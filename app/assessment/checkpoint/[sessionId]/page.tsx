"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getCurrentCheckpoint, getNextCheckpoint, CHECKPOINTS } from "@/lib/checkpoint-logic";
import { Button } from "@/components/ui/button";
import { useAssessmentStore } from "@/store/assessment-store";
import { Header } from "@/components/layout/Header";

interface CheckpointResults {
  archetype?: string;
  mbti?: { type: string };
  enneagram?: { primary_type: number; wing: number };
  dimensional_scores?: Array<{ dimension: string; percentile: number }>;
}

export default function CheckpointPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { responses } = useAssessmentStore();
  
  const [results, setResults] = useState<CheckpointResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  const currentCheckpoint = getCurrentCheckpoint(responses.length);
  const nextCheckpoint = getNextCheckpoint(responses.length);

  useEffect(() => {
    // Trigger confetti celebration
    if (!confettiTriggered) {
      setConfettiTriggered(true);
      // Dynamic import for canvas-confetti to avoid SSR issues
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }).catch(() => {
        // Confetti is optional, don't block if it fails
      });
    }

    // Fetch results for current checkpoint
    async function fetchResults() {
      try {
        const res = await fetch(`/api/results/${sessionId}?checkpoint=${currentCheckpoint.id}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.warn("Could not fetch checkpoint results:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [sessionId, currentCheckpoint.id, confettiTriggered]);

  const handleContinue = () => {
    router.push(`/assessment/questions/${sessionId}`);
  };

  const handleViewFullResults = () => {
    router.push(`/results/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Calculating your results...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />
      <div className="py-12">
        <div className="container max-w-2xl mx-auto px-4">
          {/* Celebration Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">
              Checkpoint {currentCheckpoint.id} Complete!
            </h1>
            <p className="text-muted-foreground">
              {currentCheckpoint.name}
            </p>
          </motion.div>

          {/* What You've Unlocked */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-6 mb-8 shadow-lg border border-border"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🔓</span> You&apos;ve Unlocked
            </h2>
            <ul className="space-y-2">
              {currentCheckpoint.unlocks.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Results Preview */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl p-6 mb-8 shadow-lg border border-border"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📊</span> Your Results Preview
              </h2>
              {/* Show relevant results based on checkpoint */}
              {currentCheckpoint.frameworks.includes("prism") && results.archetype && (
                <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">PRISM-7 Archetype</p>
                  <p className="font-semibold text-lg">{results.archetype}</p>
                </div>
              )}
              {currentCheckpoint.frameworks.includes("mbti") && results.mbti && (
                <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">MBTI Type</p>
                  <p className="font-semibold text-lg">{results.mbti.type}</p>
                </div>
              )}
              {currentCheckpoint.frameworks.includes("enneagram") && results.enneagram && (
                <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Enneagram</p>
                  <p className="font-semibold text-lg">
                    Type {results.enneagram.primary_type}w{results.enneagram.wing}
                  </p>
                </div>
              )}
              {results.dimensional_scores && results.dimensional_scores.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm text-muted-foreground">Top Dimensions</p>
                  {results.dimensional_scores.slice(0, 3).map((score, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="capitalize text-sm">{score.dimension.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-sm font-medium">{score.percentile}th percentile</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Continue or View Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            {nextCheckpoint ? (
              <>
                {/* Next Checkpoint CTA */}
                <div className="bg-primary/10 rounded-xl p-6 border-2 border-primary/30">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <span>🚀</span> Want to go deeper?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Continue to unlock <strong>{nextCheckpoint.name}</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground mb-4 space-y-1">
                    {nextCheckpoint.unlocks.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm mb-4 flex items-center gap-2 text-muted-foreground">
                    <span>⏱️</span>
                    {nextCheckpoint.timeEstimate} • {nextCheckpoint.questionsRequired - responses.length} more questions
                  </p>
                  <Button onClick={handleContinue} className="w-full" size="lg">
                    Continue to {nextCheckpoint.name}
                  </Button>
                </div>

                <p className="text-center text-muted-foreground">or</p>

                <Button 
                  variant="outline" 
                  onClick={handleViewFullResults}
                  className="w-full"
                  size="lg"
                >
                  View My Results So Far
                </Button>
              </>
            ) : (
              /* All checkpoints complete */
              <Button onClick={handleViewFullResults} className="w-full" size="lg">
                View Complete Results
              </Button>
            )}
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
              Your Journey
            </h3>
            <div className="flex justify-between items-center">
              {CHECKPOINTS.map((cp, i) => (
                <div key={cp.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    responses.length >= cp.questionsRequired
                      ? "bg-green-500 text-white"
                      : responses.length >= (CHECKPOINTS[i - 1]?.questionsRequired || 0)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {responses.length >= cp.questionsRequired ? "✓" : cp.id}
                  </div>
                  {i < CHECKPOINTS.length - 1 && (
                    <div className={`w-12 h-1 mx-1 transition-all ${
                      responses.length >= cp.questionsRequired
                        ? "bg-green-500"
                        : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              {CHECKPOINTS.map((cp) => (
                <span key={cp.id} className="text-center" style={{ width: "60px" }}>
                  {cp.name.split(" ")[0]}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}




