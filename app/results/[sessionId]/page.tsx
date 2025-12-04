"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { PersonalityRadarChart } from "@/components/results/RadarChart";
import { DimensionCard } from "@/components/results/DimensionCard";
import { FrameworkMapping } from "@/components/results/FrameworkMapping";
import { InsightsSection } from "@/components/results/InsightsSection";
import { PersonalityStory } from "@/components/results/PersonalityStory";
import { PersonalityArchetype } from "@/components/results/PersonalityArchetype";
import { ShareButton } from "@/components/results/ShareButton";
import { ExportButton } from "@/components/results/ExportButton";
import { ComparisonView } from "@/components/results/ComparisonView";
import { WorkInsights } from "@/components/results/WorkInsights";
import { ScientificBasis } from "@/components/results/ScientificBasis";
import { ShareableCard } from "@/components/results/ShareableCard";
import { FeatureGate } from "@/components/premium/FeatureGate";
import { FreeResultsView } from "@/components/results/FreeResultsView";
import { PremiumUnlockNotification } from "@/components/referrals/PremiumUnlockNotification";
import { JobFitScore } from "@/components/results/JobFitScore";
import { PersonalizedMBTIReport } from "@/components/results/PersonalizedMBTIReport";
import { PersonalizedEnneagramReport } from "@/components/results/PersonalizedEnneagramReport";
import { useAssessmentStore } from "@/store/assessment-store";
// Premium access is now checked via API at /api/user/premium-status
import type { AssessmentResult } from "@/types";

// This page requires authentication - unauthenticated users are redirected to auth gate

// Helper function to calculate MBTI type from dimensional scores
function calculateMBTIFromScores(scores: { dimension: string; percentile: number }[]): string {
  const scoreMap = scores.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
  
  const E = scoreMap.extraversion || 50;
  const N = scoreMap.openness || 50;
  const agreeableness = scoreMap.agreeableness || 50;
  const resilience = scoreMap.emotionalResilience || 50;
  const T = (100 - agreeableness) * 0.6 + resilience * 0.4;
  const conscientiousness = scoreMap.conscientiousness || 50;
  const adaptability = scoreMap.adaptability || 50;
  const J = conscientiousness * 0.6 + (100 - adaptability) * 0.4;

  return [
    E > 50 ? "E" : "I",
    N > 50 ? "N" : "S",
    T > 50 ? "T" : "F",
    J > 50 ? "J" : "P",
  ].join("");
}

// Helper function to calculate Enneagram type from dimensional scores
function calculateEnneagramFromScores(scores: { dimension: string; percentile: number }[]): number {
  const scoreMap = scores.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
  
  const getLevel = (p: number): string => p >= 70 ? "high" : p >= 40 ? "moderate" : "low";
  
  const profile = {
    openness: getLevel(scoreMap.openness || 50),
    conscientiousness: getLevel(scoreMap.conscientiousness || 50),
    extraversion: getLevel(scoreMap.extraversion || 50),
    agreeableness: getLevel(scoreMap.agreeableness || 50),
    emotionalResilience: getLevel(scoreMap.emotionalResilience || 50),
  };

  // Simplified pattern matching
  if (profile.conscientiousness === "high" && profile.agreeableness === "high") return 1;
  if (profile.agreeableness === "high" && profile.extraversion === "high") return 2;
  if (profile.conscientiousness === "high" && profile.extraversion === "high") return 3;
  if (profile.openness === "high" && profile.emotionalResilience === "low") return 4;
  if (profile.openness === "high" && profile.extraversion === "low") return 5;
  if (profile.conscientiousness === "high" && profile.emotionalResilience === "moderate") return 6;
  if (profile.extraversion === "high" && profile.openness === "high") return 7;
  if (profile.extraversion === "high" && profile.emotionalResilience === "high") return 8;
  return 9; // Default to Peacemaker
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { user, isLoaded: userLoaded } = useUser();
  const { result: storeResult } = useAssessmentStore();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPremium, setHasPremium] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(true);
  const [fitScore, setFitScore] = useState<number | null>(null);
  const [fitBreakdown, setFitBreakdown] = useState<any>(null);
  const [jobInfo, setJobInfo] = useState<{ title?: string; company_name?: string } | null>(null);

  // Redirect to auth gate if user is not authenticated
  useEffect(() => {
    if (userLoaded && !user) {
      router.push(`/assessment/complete/${sessionId}`);
    }
  }, [userLoaded, user, sessionId, router]);

  // Claim the session for the authenticated user (links guest session to account)
  useEffect(() => {
    const claimSession = async () => {
      if (!userLoaded || !user?.id || !sessionId) return;
      
      try {
        const response = await fetch("/api/assessment/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (!data.alreadyClaimed) {
            console.log("Session claimed successfully:", data.message);
          }
        } else {
          const error = await response.json();
          // Only log if it's not a "belongs to another user" error
          if (response.status !== 403) {
            console.warn("Could not claim session:", error.error);
          }
        }
      } catch (error) {
        console.warn("Error claiming session:", error);
      }
    };

    claimSession();
  }, [userLoaded, user?.id, sessionId]);

  useEffect(() => {
    // Check premium access via API (works correctly with server-side env vars)
    const checkPremium = async () => {
      if (!userLoaded) return;
      
      if (user?.id) {
        try {
          const userEmail = user.primaryEmailAddress?.emailAddress || "";
          const params = new URLSearchParams({
            userId: user.id,
            email: userEmail,
          });
          
          const response = await fetch(`/api/user/premium-status?${params}`);
          const data = await response.json();
          
          setHasPremium(data.hasPremium === true);
          
          if (data.isAdmin) {
            console.log("Admin access detected - full premium enabled");
          }
        } catch (error) {
          console.error("Error checking premium status:", error);
          setHasPremium(false);
        }
      } else {
        // Guest users don't have premium
        setHasPremium(false);
      }
      setCheckingPremium(false);
    };

    checkPremium();
  }, [user?.id, userLoaded, user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    // First check if we have results in store (from recent completion)
    if (storeResult && storeResult.session_id === sessionId) {
      setResult(storeResult);
      setLoading(false);
      return;
    }

    // Otherwise, fetch results from API
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/results/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          
          // Handle both database result format and in-memory result format
          const resultData = data.dimensional_scores ? data : data.result;
          
          const finalResult: AssessmentResult = {
            session_id: resultData?.session_id || sessionId,
            dimensional_scores: resultData?.dimensional_scores || data.dimensional_scores || [],
            frameworks: data.frameworks || resultData?.framework_mappings || resultData?.frameworks || undefined,
            completed: resultData?.completed ?? data.completed ?? true,
            created_at: new Date(resultData?.created_at || data.created_at || Date.now()),
          };
          
          setResult(finalResult);
          
          // Check if this is a business assessment with fit score
          if (data.fit_score !== null && data.fit_score !== undefined) {
            setFitScore(data.fit_score);
            setFitBreakdown(data.fit_breakdown);
            setJobInfo(data.job_info || null);
          }
        } else {
          // If results not found and not in store, show error
          console.warn("Results not found for session:", sessionId);
        }
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResults();
    }
  }, [sessionId, storeResult]);

  // Show loading while checking auth or while redirecting
  if (!userLoaded || (userLoaded && !user)) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </Container>
      </div>
    );
  }

  if (loading || checkingPremium) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading your results...</p>
        </Container>
      </div>
    );
  }

  if (!result || result.dimensional_scores.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Results not found</p>
        </Container>
      </div>
    );
  }

  // Show free view if user doesn't have premium access
  if (!hasPremium) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <PremiumUnlockNotification />
        <Container className="flex-1 py-12">
          <div className="mx-auto max-w-6xl space-y-16 md:space-y-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Your <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">Personality Profile</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Discover your authentic self through science
                </p>
              </div>
              <ShareButton sessionId={sessionId} />
            </motion.div>
            {fitScore !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <JobFitScore
                  fitScore={fitScore}
                  fitBreakdown={fitBreakdown}
                  jobTitle={jobInfo?.title}
                  companyName={jobInfo?.company_name}
                />
              </motion.div>
            )}
            <FreeResultsView scores={result.dimensional_scores} sessionId={sessionId} />
          </div>
        </Container>
      </div>
    );
  }

  // Premium view - full results
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-6xl space-y-16 md:space-y-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Your <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">Personality Profile</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover your authentic self through science
              </p>
            </div>
            <div className="flex gap-3">
              <FeatureGate feature="pdf_export" showUpgrade={false}>
                <ExportButton result={result} sessionId={sessionId} />
              </FeatureGate>
              <ShareButton sessionId={sessionId} />
            </div>
          </motion.div>

          {/* Results Container - for PDF export */}
          <div id="results-container">
            {/* Job Fit Score - Show first if this is a business assessment */}
            {fitScore !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <JobFitScore
                  fitScore={fitScore}
                  fitBreakdown={fitBreakdown}
                  jobTitle={jobInfo?.title}
                  companyName={jobInfo?.company_name}
                />
              </motion.div>
            )}

            {/* Personality Archetype - Primary Result */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <PersonalityArchetype scores={result.dimensional_scores} />
            </motion.div>

            {/* Radar Chart */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Your Dimensional Profile</h2>
            <PersonalityRadarChart scores={result.dimensional_scores} />
          </motion.div>

          {/* Dimension Cards */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">Detailed Scores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {result.dimensional_scores.map((score, index) => (
                <motion.div
                  key={score.dimension}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <DimensionCard score={score} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Personality Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <PersonalityStory scores={result.dimensional_scores} />
          </motion.div>

          {/* Framework Mappings Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <FrameworkMapping scores={result.dimensional_scores} frameworks={result.frameworks} />
          </motion.div>

          {/* Detailed MBTI Report */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62 }}
          >
            <FeatureGate feature="all_frameworks">
              <PersonalizedMBTIReport 
                mbtiType={result.frameworks?.mbti?.type || calculateMBTIFromScores(result.dimensional_scores)} 
                confidence={result.frameworks?.mbti?.confidence}
              />
            </FeatureGate>
          </motion.div>

          {/* Detailed Enneagram Report */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.64 }}
          >
            <FeatureGate feature="all_frameworks">
              <PersonalizedEnneagramReport 
                enneagramType={result.frameworks?.enneagram?.primary_type || calculateEnneagramFromScores(result.dimensional_scores)}
                wing={result.frameworks?.enneagram?.wing}
                confidence={result.frameworks?.enneagram?.primary_probability}
              />
            </FeatureGate>
          </motion.div>

          {/* Work & Career Insights - B2B Focus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            <FeatureGate feature="work_insights">
              <WorkInsights scores={result.dimensional_scores} />
            </FeatureGate>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <InsightsSection scores={result.dimensional_scores} />
          </motion.div>

          {/* Shareable Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
          >
            <ShareableCard result={result} sessionId={sessionId} />
          </motion.div>

          {/* Scientific Basis & Transparency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <ScientificBasis scores={result.dimensional_scores} />
          </motion.div>

          {/* Comparison with Previous Assessments - Premium Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          >
            <FeatureGate feature="comparison_reports">
              <ComparisonView currentResult={result} sessionId={sessionId} />
            </FeatureGate>
          </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
}

