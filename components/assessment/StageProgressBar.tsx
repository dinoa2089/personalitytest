"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getStageProgress, ASSESSMENT_STAGES, type AssessmentStage } from "@/lib/assessment-stages";
import { Check, Lock, Sparkles } from "lucide-react";

interface StageProgressBarProps {
  questionsAnswered: number;
  showStageIndicators?: boolean;
}

export function StageProgressBar({ 
  questionsAnswered, 
  showStageIndicators = true 
}: StageProgressBarProps) {
  const { stage, questionsInStage, progressPercent, questionsRemaining } = getStageProgress(questionsAnswered);
  
  // Find stage index for display
  const stageIndex = ASSESSMENT_STAGES.findIndex(s => s.id === stage.id);
  
  return (
    <div className="w-full space-y-3">
      {/* Stage name and question counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">{stage.displayName}</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Stage {stageIndex + 1} of 3
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {questionsInStage} of {stage.questionCount} questions
        </span>
      </div>
      
      {/* Main progress bar - shows current stage progress only */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary/80"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        
        {/* Animated shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Stage indicators */}
      {showStageIndicators && (
        <div className="flex items-center justify-between pt-2">
          {ASSESSMENT_STAGES.map((s, i) => {
            const isCompleted = questionsAnswered >= s.cumulativeQuestions;
            const isCurrent = s.id === stage.id;
            const isLocked = i > stageIndex + 1 || (i > stageIndex && !isCompleted);
            
            return (
              <div key={s.id} className="flex items-center">
                {/* Stage dot */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                    animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : isLocked && s.requiresPayment ? (
                      <Sparkles className="w-4 h-4" />
                    ) : isLocked && s.requiresAuth ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      i + 1
                    )}
                  </motion.div>
                  <span className={`mt-1.5 text-[10px] font-medium whitespace-nowrap ${
                    isCompleted
                      ? "text-green-600"
                      : isCurrent
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}>
                    {s.name.split(" ")[0]}
                  </span>
                </div>
                
                {/* Connector line */}
                {i < ASSESSMENT_STAGES.length - 1 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-2 transition-all ${
                    questionsAnswered >= s.cumulativeQuestions
                      ? "bg-green-500"
                      : "bg-muted"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Encouraging message based on progress */}
      <AnimatePresence mode="wait">
        {questionsRemaining <= 5 && questionsRemaining > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-primary font-medium"
          >
            Almost there! Just {questionsRemaining} more {questionsRemaining === 1 ? 'question' : 'questions'} to unlock your {stage.name}!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

