import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { calculateScores } from "@/lib/scoring-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, responses } = body;

    // Calculate scores (will use mock if Python API unavailable)
    const scores = await calculateScores(responses, sessionId);

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
              await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/referrals/track`, {
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
              // Find job posting by assessment_link_token
              const { data: jobPosting } = await supabase
                .from("job_postings")
                .select("id, ideal_profile")
                .eq("assessment_link_token", jobToken)
                .single();

              if (jobPosting) {
                // Create applicant assessment (this will calculate fit score automatically)
                const applicantResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/business/applicants`, {
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

