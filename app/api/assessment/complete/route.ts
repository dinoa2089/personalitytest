import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { calculateScores } from "@/lib/scoring-api";
import { getAppUrl } from "@/lib/app-url";
import { updateQuestionStatistics } from "@/lib/question-statistics";
import { incrementResponseCountBatch } from "@/lib/question-history";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, responses } = body;

    // Enrich responses with framework_tags and discrimination from question bank
    // This enables the Python scoring API to do proper MBTI/Enneagram calculation
    let enrichedResponses = responses;
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      try {
        const questionIds = responses.map((r: { question_id: string }) => r.question_id);
        const { data: questions } = await supabase
          .from("questions")
          .select("id, framework_tags, discrimination")
          .in("id", questionIds);

        if (questions && questions.length > 0) {
          const questionMap = new Map(questions.map((q) => [q.id, q]));
          
          enrichedResponses = responses.map((r: { question_id: string; [key: string]: unknown }) => {
            const question = questionMap.get(r.question_id);
            return {
              ...r,
              framework_tags: question?.framework_tags || [],
              discrimination: question?.discrimination || 1.0,
            };
          });
        }
      } catch (enrichError) {
        console.warn("Could not enrich responses with question metadata:", enrichError);
        // Continue with original responses - scoring will still work with PRISM fallback
      }
    }

    // Calculate scores (will use mock if Python API unavailable)
    // Now includes framework_tags for proper MBTI/Enneagram calculation
    const scores = await calculateScores(enrichedResponses, sessionId);

    // Fire-and-forget: Update question statistics for IRT calibration
    // This doesn't block the response to the user
    const questionIds = responses.map((r: { question_id: string }) => r.question_id);
    Promise.all([
      updateQuestionStatistics(responses),
      incrementResponseCountBatch(questionIds),
    ]).catch(err => {
      console.error("Error updating question statistics:", err);
    });

    // Save results to database (supabaseUrl/supabaseKey already checked above)
    if (supabaseUrl && supabaseKey) {
      // Try to save results to database
      try {
        // Determine access level based on user's premium status
        let accessLevel = "free";
        if (body.userId) {
          // Check if user has premium access
          const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("clerk_id", body.userId)
            .single();

          if (user) {
            // Check for active subscription
            const { data: subscription } = await supabase
              .from("subscriptions")
              .select("*")
              .eq("user_id", user.id)
              .eq("status", "active")
              .in("plan", ["premium", "professional", "enterprise"])
              .single();

            if (subscription) {
              accessLevel = "premium";
            } else {
              // Check for premium unlock
              const { data: unlock } = await supabase
                .from("premium_unlocks")
                .select("*")
                .eq("user_id", user.id)
                .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
                .single();

              if (unlock) {
                accessLevel = "unlocked";
              }
            }
          }
        }

        const { data: result, error } = await supabase
          .from("assessment_results")
          .insert({
            session_id: sessionId,
            user_id: body.userId || null,
            dimensional_scores: scores.dimensional_scores,
            results_access_level: accessLevel,
            metadata: {},
          })
          .select()
          .single();

        if (!error && result) {
          // Update session as completed
          await supabase
            .from("assessment_sessions")
            .update({
              completed_at: new Date().toISOString(),
              progress: 100,
            })
            .eq("id", sessionId);

          // Track referral if referral code exists
          const referralCode = body.referralCode;
          if (referralCode) {
            try {
              await fetch(`${getAppUrl()}/api/referrals/track`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  referralCode,
                  sessionId,
                }),
              });
            } catch (refError) {
              console.error("Error tracking referral:", refError);
              // Don't fail the request if referral tracking fails
            }
          }

          // Track job application if job token exists
          const jobToken = body.jobToken;
          if (jobToken) {
            try {
              // First, try to increment usage in job_assessment_links table
              await supabase.rpc("increment_link_usage", { link_token: jobToken });

              // Try to find job via job_assessment_links first
              let jobPosting = null;
              const { data: linkData } = await supabase
                .from("job_assessment_links")
                .select("job_posting_id")
                .eq("token", jobToken)
                .single();

              if (linkData) {
                const { data: job } = await supabase
                  .from("job_postings")
                  .select("id, ideal_profile")
                  .eq("id", linkData.job_posting_id)
                  .single();
                jobPosting = job;
              } else {
                // Fallback: Find job posting by legacy assessment_link_token
                const { data: job } = await supabase
                  .from("job_postings")
                  .select("id, ideal_profile")
                  .eq("assessment_link_token", jobToken)
                  .single();
                jobPosting = job;
              }

              if (jobPosting) {
                // Create applicant assessment (this will calculate fit score automatically)
                const applicantResponse = await fetch(`${getAppUrl()}/api/business/applicants`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    job_posting_id: jobPosting.id,
                    assessment_session_id: sessionId,
                    applicant_email: body.applicantEmail || null,
                    applicant_name: body.applicantName || null,
                  }),
                });

                // Store applicant assessment ID in result metadata for later retrieval
                if (applicantResponse.ok) {
                  const applicantData = await applicantResponse.json();
                  // Get current metadata or initialize empty object
                  const { data: currentResult } = await supabase
                    .from("assessment_results")
                    .select("metadata")
                    .eq("session_id", sessionId)
                    .single();
                  
                  const currentMetadata = currentResult?.metadata || {};
                  
                  // Update assessment result with applicant assessment reference
                  await supabase
                    .from("assessment_results")
                    .update({
                      metadata: {
                        ...currentMetadata,
                        applicant_assessment_id: applicantData.applicant?.id,
                        job_posting_id: jobPosting.id,
                        fit_score: applicantData.applicant?.fit_score,
                      },
                    })
                    .eq("session_id", sessionId);
                }
              }
            } catch (jobError) {
              console.error("Error tracking job application:", jobError);
              // Don't fail the request if job tracking fails
            }
          }

          return NextResponse.json({ success: true, result });
        }
      } catch (dbError) {
        console.error("Database error (continuing with in-memory result):", dbError);
      }
    }

    // Return results even if database save failed (for development/testing)
    return NextResponse.json({
      success: true,
      result: {
        session_id: sessionId,
        user_id: body.userId || null,
        dimensional_scores: scores.dimensional_scores,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error completing assessment:", error);
    return NextResponse.json(
      { error: "Failed to complete assessment", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

