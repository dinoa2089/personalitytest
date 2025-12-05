"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, SignIn, SignUp } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  UserPlus, 
  LogIn,
  Lock,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { useAssessmentStore } from "@/store/assessment-store";
import { 
  getCompletedStage, 
  getNextStage, 
  canProceedToNextStage,
  ASSESSMENT_STAGES,
  type AssessmentStage 
} from "@/lib/assessment-stages";
import type { DimensionScore } from "@/types";

// Results preview components
import { PersonalityRadarChart } from "@/components/results/RadarChart";
import { PersonalityArchetype } from "@/components/results/PersonalityArchetype";

interface StageResults {
  archetype?: string;
  dimensional_scores?: DimensionScore[];
  mbti?: { type: string; confidence?: number };
  enneagram?: { primary_type: number; wing?: number };
}

export default function StageCompletePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { user, isLoaded: userLoaded } = useUser();
  const { responses } = useAssessmentStore();
  
  const [completedStage, setCompletedStage] = useState<AssessmentStage | null>(null);
  const [nextStage, setNextStage] = useState<AssessmentStage | null>(null);
  const [results, setResults] = useState<StageResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"results" | "sign-in" | "sign-up">("results");
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  // Determine which stage was completed based on responses
  useEffect(() => {
    const fetchStageInfo = async () => {
      try {
        // Fetch session progress to get accurate question count
        const progressRes = await fetch(`/api/assessment/progress?sessionId=${sessionId}`);
        let questionsAnswered = responses.length;
        
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          questionsAnswered = progressData.responses?.length || responses.length;
        }
        
        // Determine completed stage
        const stage = getCompletedStage(questionsAnswered);
        if (!stage) {
          // Not at a stage boundary, redirect back to questions
          router.push(`/assessment/questions/${sessionId}`);
          return;
        }
        
        setCompletedStage(stage);
        setNextStage(getNextStage(stage.id));
        
        // Fetch results for this stage
        const resultsRes = await fetch(`/api/results/${sessionId}?checkpoint=${ASSESSMENT_STAGES.findIndex(s => s.id === stage.id) + 1}`);
        if (resultsRes.ok) {
          const resultsData = await resultsRes.json();
          setResults(resultsData);
        }
      } catch (error) {
        console.error("Error fetching stage info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStageInfo();
  }, [sessionId, responses.length, router]);

  // Trigger confetti celebration
  useEffect(() => {
    if (!loading && completedStage && !confettiTriggered) {
      setConfettiTriggered(true);
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#d946ef', '#f97316', '#22c55e']
        });
      }).catch(() => {});
    }
  }, [loading, completedStage, confettiTriggered]);


  // Handle continuing to next stage
  const handleContinue = async () => {
    if (!completedStage || !nextStage) return;
    
    const { canProceed, reason } = canProceedToNextStage(
      completedStage.id, 
      !!user, 
      hasPurchased
    );
    
    if (!canProceed) {
      if (reason === "auth") {
        setAuthMode("sign-up");
        return;
      }
      if (reason === "payment") {
        router.push(`/pricing?session=${sessionId}`);
        return;
      }
    }
    
    // Proceed to next stage
    router.push(`/assessment/questions/${sessionId}`);
  };

  // Handle viewing final results (after all stages or when stopping)
  const handleViewResults = () => {
    router.push(`/results/${sessionId}`);
  };


  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Calculating your results...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!completedStage) {
    return null;
  }

  // Determine what gate to show
  const showAuthGate = completedStage.gate === "auth" && !user && authMode !== "results";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Header />
      <Container className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Celebration Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {completedStage.name} Complete! 🎉
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                {completedStage.description}
              </p>
            </div>
          </motion.div>

          {/* Auth Gate UI - After PRISM */}
          <AnimatePresence mode="wait">
            {showAuthGate && (
              <motion.div
                key="auth-gate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {authMode === "sign-up" && (
                  <Card className="border-2 border-primary/30 bg-card/90 backdrop-blur-sm">
                    <CardContent className="pt-8 pb-6">
                      <div className="space-y-6">
                        <Button
                          variant="ghost"
                          onClick={() => setAuthMode("results")}
                          className="text-muted-foreground"
                        >
                          ← Back to results
                        </Button>
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-bold">Create Your Free Account</h2>
                          <p className="text-muted-foreground">
                            Save your results and unlock deeper insights
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <SignUp
                            appearance={{
                              elements: {
                                rootBox: "mx-auto",
                                card: "shadow-none border-0 bg-transparent",
                                formButtonPrimary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700",
                              },
                            }}
                            fallbackRedirectUrl={`/assessment/stage-complete/${sessionId}`}
                            signInUrl={`/assessment/stage-complete/${sessionId}?auth=sign-in`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {authMode === "sign-in" && (
                  <Card className="border-2 border-primary/30 bg-card/90 backdrop-blur-sm">
                    <CardContent className="pt-8 pb-6">
                      <div className="space-y-6">
                        <Button
                          variant="ghost"
                          onClick={() => setAuthMode("results")}
                          className="text-muted-foreground"
                        >
                          ← Back to results
                        </Button>
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-bold">Welcome Back</h2>
                          <p className="text-muted-foreground">
                            Sign in to continue your journey
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <SignIn
                            appearance={{
                              elements: {
                                rootBox: "mx-auto",
                                card: "shadow-none border-0 bg-transparent",
                                formButtonPrimary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700",
                              },
                            }}
                            fallbackRedirectUrl={`/assessment/stage-complete/${sessionId}`}
                            signUpUrl={`/assessment/stage-complete/${sessionId}?auth=sign-up`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Preview - Always show (dopamine hit!) */}
          {!showAuthGate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* What You've Unlocked */}
              <Card className="border border-green-500/30 bg-green-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    You've Unlocked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {completedStage.unlocks.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Results Preview Cards */}
              {results && (
                <div className="space-y-6">
                  {/* Archetype Card - For PRISM */}
                  {completedStage.id === "prism" && results.dimensional_scores && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <PersonalityArchetype scores={results.dimensional_scores} />
                    </motion.div>
                  )}

                  {/* Radar Chart */}
                  {results.dimensional_scores && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Your Dimensional Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <PersonalityRadarChart scores={results.dimensional_scores} />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* MBTI Result - For Extended stage */}
                  {(completedStage.id === "extended" || completedStage.id === "deep-dive") && results.mbti && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Card className="border-blue-500/30 bg-blue-500/5">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xl font-bold">
                              {results.mbti.type}
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Your MBTI Type</p>
                              <p className="text-2xl font-bold">{results.mbti.type}</p>
                              {results.mbti.confidence && (
                                <p className="text-sm text-muted-foreground">
                                  {Math.round(results.mbti.confidence * 100)}% confidence
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Enneagram Result - For Extended stage */}
                  {(completedStage.id === "extended" || completedStage.id === "deep-dive") && results.enneagram && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Card className="border-purple-500/30 bg-purple-500/5">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
                              {results.enneagram.primary_type}
                              {results.enneagram.wing && (
                                <span className="text-sm ml-0.5">w{results.enneagram.wing}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Your Enneagram</p>
                              <p className="text-2xl font-bold">
                                Type {results.enneagram.primary_type}
                                {results.enneagram.wing && `w${results.enneagram.wing}`}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Next Stage CTA */}
          {!showAuthGate && nextStage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              {/* Auth Gate CTA - After PRISM when not logged in */}
              {completedStage.gate === "auth" && !user ? (
                  <Card className="border-2 border-primary/30 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <CardTitle>Keep Going!</CardTitle>
                      </div>
                      <CardDescription>
                        Create a free account to unlock {nextStage.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-2">
                        {nextStage.unlocks.slice(0, 4).map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                          onClick={() => setAuthMode("sign-up")}
                          className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Free Account
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setAuthMode("sign-in")}
                          className="flex-1"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        Free forever • No credit card required
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  /* Continue CTA - When authenticated and can proceed */
                  <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <CardTitle>Ready to Go Deeper?</CardTitle>
                      </div>
                      <CardDescription>
                        Continue to unlock {nextStage.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{nextStage.questionCount} more questions</span>
                        <span>•</span>
                        <span>{nextStage.timeEstimate}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={handleContinue}
                          className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                        >
                          Continue to {nextStage.name}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleViewResults}
                          className="flex-1"
                        >
                          View My Results
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </motion.div>
          )}

          {/* Final stage complete - No next stage */}
          {!showAuthGate && !nextStage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="text-4xl">🏆</div>
                  <div>
                    <h2 className="text-2xl font-bold">Assessment Complete!</h2>
                    <p className="text-muted-foreground">
                      You've completed all stages. View your full comprehensive results.
                    </p>
                  </div>
                  <Button
                    onClick={handleViewResults}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    View Complete Results
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-4"
          >
            <div className="flex justify-between items-center px-4">
              {ASSESSMENT_STAGES.map((stage, i) => {
                const isCompleted = completedStage && 
                  ASSESSMENT_STAGES.findIndex(s => s.id === completedStage.id) >= i;
                const isCurrent = stage.id === completedStage?.id;
                
                return (
                  <div key={stage.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-green-500/20" : ""}`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                      </div>
                      <span className={`mt-2 text-xs font-medium ${
                        isCompleted ? "text-green-600" : "text-muted-foreground"
                      }`}>
                        {stage.name.split(" ")[0]}
                      </span>
                    </div>
                    {i < ASSESSMENT_STAGES.length - 1 && (
                      <div className={`w-16 sm:w-24 h-1 mx-2 transition-all ${
                        isCompleted && i < ASSESSMENT_STAGES.findIndex(s => s.id === completedStage?.id)
                          ? "bg-green-500"
                          : "bg-muted"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

