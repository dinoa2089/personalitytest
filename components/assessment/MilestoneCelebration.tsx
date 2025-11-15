"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, TrendingUp, Award } from "lucide-react";

interface MilestoneCelebrationProps {
  progress: number;
  currentQuestion?: number;
  totalQuestions?: number;
}

const milestones = [
  { percent: 25, message: "You're making great progress!", icon: "🎯", color: "text-blue-500" },
  { percent: 50, message: "Halfway there! Keep going!", icon: "⭐", color: "text-yellow-500" },
  { percent: 75, message: "Almost done! You're doing amazing!", icon: "🌟", color: "text-purple-500" },
  { percent: 100, message: "Assessment complete! 🎉", icon: "🏆", color: "text-green-500" },
];

export function MilestoneCelebration({ 
  progress, 
  currentQuestion,
  totalQuestions 
}: MilestoneCelebrationProps) {
  const [celebrated, setCelebrated] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<typeof milestones[0] | null>(null);

  useEffect(() => {
    const milestone = milestones.find(
      (m) => progress >= m.percent && !celebrated.has(m.percent)
    );

    if (milestone) {
      setCelebrated((prev) => new Set([...prev, milestone.percent]));
      setCurrentMilestone(milestone);
      setShowCelebration(true);

      // More sophisticated confetti - different patterns for different milestones
      if (milestone.percent === 100) {
        // Celebration burst for completion
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
        });
        // Additional burst after delay
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 250);
      } else {
        // Subtle celebration for milestones
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }

      // Hide after 4 seconds
      setTimeout(() => setShowCelebration(false), 4000);
    }
  }, [progress, celebrated]);

  if (!currentMilestone) return null;

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transform"
        >
          <motion.div
            className="rounded-lg border-2 border-primary/50 bg-card p-6 shadow-2xl backdrop-blur-sm"
            animate={{
              boxShadow: [
                "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                "0 25px 50px -12px rgba(59, 130, 246, 0.5)",
                "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 0.3,
                }}
                className={`text-5xl ${currentMilestone.color}`}
              >
                {currentMilestone.icon}
              </motion.div>
              <div className="flex-1">
                <p className="font-bold text-lg">{currentMilestone.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(progress)}% complete
                    {currentQuestion && totalQuestions && (
                      <> • Question {currentQuestion} of {totalQuestions}</>
                    )}
                  </p>
                </div>
              </div>
              {currentMilestone.percent === 100 && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Award className="h-6 w-6 text-yellow-500" />
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

