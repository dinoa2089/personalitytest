"use client";

import { motion } from "framer-motion";
import { useAssessmentStore } from "@/store/assessment-store";
import { CHECKPOINTS } from "@/lib/checkpoint-logic";

interface ProgressBarProps {
  totalQuestions?: number;
}

export function ProgressBar({ totalQuestions = 105 }: ProgressBarProps) {
  const { progress, responses } = useAssessmentStore();

  // Round to 1 decimal place for display
  const displayProgress = Math.round(progress * 10) / 10;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">{displayProgress}%</span>
      </div>
      
      <div className="relative h-3 w-full overflow-visible rounded-full bg-muted">
        {/* Progress fill */}
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        
        {/* Checkpoint markers */}
        {CHECKPOINTS.map((cp, i) => {
          const position = (cp.questionsRequired / totalQuestions) * 100;
          const reached = responses.length >= cp.questionsRequired;
          return (
            <div
              key={i}
              className={`absolute top-1/2 w-3 h-3 rounded-full border-2 transition-all z-10 ${
                reached
                  ? "bg-green-500 border-green-600"
                  : "bg-background border-muted-foreground/50"
              }`}
              style={{ 
                left: `${position}%`, 
                transform: 'translate(-50%, -50%)' 
              }}
              title={cp.name}
            />
          );
        })}
      </div>

      {/* Checkpoint labels */}
      <div className="relative h-6 mt-1">
        {CHECKPOINTS.map((cp, i) => {
          const position = (cp.questionsRequired / totalQuestions) * 100;
          const labels = ["PRISM-7", "MBTI", "Enneagram", "Complete"];
          const reached = responses.length >= cp.questionsRequired;
          return (
            <span
              key={i}
              className={`absolute text-xs transform -translate-x-1/2 whitespace-nowrap transition-colors ${
                reached ? "text-green-600 font-medium" : "text-muted-foreground"
              }`}
              style={{ left: `${position}%` }}
            >
              {labels[i]}
            </span>
          );
        })}
      </div>
    </div>
  );
}
