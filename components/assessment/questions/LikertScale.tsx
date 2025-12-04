"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/types";

interface LikertScaleProps {
  question: Question;
  onAnswer: (value: number) => void;
}

// Semantic anchor configuration with intensity-based visualization
const SCALE_OPTIONS = [
  { 
    value: 1, 
    label: "Strongly Disagree", 
    shortLabel: "SD",
    intensity: 0,
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-500",
    ringColor: "ring-rose-500",
  },
  { 
    value: 2, 
    label: "Disagree", 
    shortLabel: "D",
    intensity: 1,
    color: "from-orange-400 to-orange-500",
    bgColor: "bg-orange-400",
    ringColor: "ring-orange-400",
  },
  { 
    value: 3, 
    label: "Somewhat Disagree", 
    shortLabel: "−",
    intensity: 2,
    color: "from-amber-300 to-amber-400",
    bgColor: "bg-amber-300",
    ringColor: "ring-amber-400",
  },
  { 
    value: 4, 
    label: "Neutral", 
    shortLabel: "○",
    intensity: 3,
    color: "from-slate-300 to-slate-400",
    bgColor: "bg-slate-400",
    ringColor: "ring-slate-400",
  },
  { 
    value: 5, 
    label: "Somewhat Agree", 
    shortLabel: "+",
    intensity: 4,
    color: "from-emerald-300 to-emerald-400",
    bgColor: "bg-emerald-300",
    ringColor: "ring-emerald-400",
  },
  { 
    value: 6, 
    label: "Agree", 
    shortLabel: "A",
    intensity: 5,
    color: "from-green-400 to-green-500",
    bgColor: "bg-green-400",
    ringColor: "ring-green-500",
  },
  { 
    value: 7, 
    label: "Strongly Agree", 
    shortLabel: "SA",
    intensity: 6,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500",
    ringColor: "ring-emerald-500",
  },
];

export function LikertScale({ question, onAnswer }: LikertScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovering, setHovering] = useState<number | null>(null);

  // Reset selection when question changes
  useEffect(() => {
    setSelected(null);
    setHovering(null);
  }, [question.id]);

  const handleSelect = (value: number) => {
    setSelected(value);
    onAnswer(value);
  };

  // Calculate fill width for the gradient track
  const activeValue = hovering ?? selected;
  const fillPercentage = activeValue ? ((activeValue - 1) / 6) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Semantic anchor labels */}
      <div className="flex justify-between text-xs sm:text-sm text-muted-foreground px-1">
        <span className="font-medium text-rose-600 dark:text-rose-400">Disagree</span>
        <span className="font-medium text-emerald-600 dark:text-emerald-400">Agree</span>
      </div>

      {/* Gradient track background */}
      <div className="relative">
        {/* Background track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-rose-200 via-slate-200 to-emerald-200 dark:from-rose-900/30 dark:via-slate-700/30 dark:to-emerald-900/30 rounded-full" />
        
        {/* Active fill track */}
        {activeValue && (
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 via-slate-300 via-emerald-300 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${fillPercentage}%` }}
            transition={{ duration: 0.15 }}
            style={{ left: 0 }}
          />
        )}

        {/* Scale buttons */}
        <div className="relative grid grid-cols-7 gap-1 sm:gap-2">
          {SCALE_OPTIONS.map((option) => {
            const isSelected = selected === option.value;
            const isHovered = hovering === option.value;
            const isActive = isSelected || isHovered;

            return (
              <motion.button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHovering(option.value)}
                onMouseLeave={() => setHovering(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex flex-col items-center gap-2 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
              >
                {/* Intensity dot */}
                <motion.div
                  className={`
                    w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200
                    ${isSelected 
                      ? `${option.bgColor} border-transparent ring-2 ${option.ringColor} ring-offset-2` 
                      : isHovered
                        ? `${option.bgColor}/60 border-transparent`
                        : 'bg-background border-muted-foreground/30 hover:border-muted-foreground/50'
                    }
                  `}
                  animate={{
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Inner fill indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full rounded-full flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>

                {/* Value number */}
                <span className={`
                  text-xs sm:text-sm font-medium transition-colors
                  ${isSelected 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
                  }
                `}>
                  {option.value}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected label display */}
      <div className="h-6 flex justify-center">
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <div className={`w-3 h-3 rounded-full ${SCALE_OPTIONS[selected - 1].bgColor}`} />
            <span className="text-sm font-medium text-foreground">
              {SCALE_OPTIONS[selected - 1].label}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
