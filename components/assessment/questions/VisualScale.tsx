"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/types";

interface VisualScaleProps {
  question: Question;
  onAnswer: (response: number) => void;
}

// Semantic visual scale with intensity indicators instead of emojis
const SCALE_OPTIONS = [
  { 
    value: 1, 
    label: "Strongly Disagree",
    intensity: 1,
    bars: 1,
    color: "bg-rose-500",
    textColor: "text-rose-600 dark:text-rose-400",
  },
  { 
    value: 2, 
    label: "Disagree",
    intensity: 2,
    bars: 2,
    color: "bg-orange-400",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  { 
    value: 3, 
    label: "Slightly Disagree",
    intensity: 3,
    bars: 3,
    color: "bg-amber-400",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  { 
    value: 4, 
    label: "Neutral",
    intensity: 4,
    bars: 4,
    color: "bg-slate-400",
    textColor: "text-slate-600 dark:text-slate-400",
  },
  { 
    value: 5, 
    label: "Slightly Agree",
    intensity: 5,
    bars: 5,
    color: "bg-emerald-400",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  { 
    value: 6, 
    label: "Agree",
    intensity: 6,
    bars: 6,
    color: "bg-green-500",
    textColor: "text-green-600 dark:text-green-400",
  },
  { 
    value: 7, 
    label: "Strongly Agree",
    intensity: 7,
    bars: 7,
    color: "bg-teal-500",
    textColor: "text-teal-600 dark:text-teal-400",
  },
];

export function VisualScale({ question, onAnswer }: VisualScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovering, setHovering] = useState<number | null>(null);

  // Reset when question changes
  useEffect(() => {
    setSelected(null);
    setHovering(null);
  }, [question.id]);

  const handleSelect = (value: number) => {
    setSelected(value);
    setTimeout(() => onAnswer(value), 300);
  };

  return (
    <div className="space-y-8">
      {/* Semantic anchor labels */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span className="font-medium text-rose-600 dark:text-rose-400">Disagree</span>
        <span className="font-medium text-teal-600 dark:text-teal-400">Agree</span>
      </div>

      {/* Visual scale with intensity bars */}
      <div className="flex justify-center gap-3 sm:gap-4">
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl
                transition-all duration-200 focus:outline-none focus-visible:ring-2 
                focus-visible:ring-primary focus-visible:ring-offset-2
                ${isSelected 
                  ? 'bg-primary/10 ring-2 ring-primary shadow-lg' 
                  : isHovered
                    ? 'bg-muted/80'
                    : 'hover:bg-muted/50'
                }
              `}
            >
              {/* Intensity bar indicator */}
              <div className="flex items-end gap-0.5 h-10 sm:h-12">
                {Array.from({ length: 7 }, (_, i) => {
                  const barIndex = i + 1;
                  const isFilled = barIndex <= option.bars;
                  const baseHeight = 4 + (i * 4); // Increasing heights: 4, 8, 12, 16, 20, 24, 28
                  
                  return (
                    <motion.div
                      key={i}
                      className={`
                        w-1.5 sm:w-2 rounded-full transition-all duration-200
                        ${isFilled 
                          ? `${option.color} ${isActive ? 'opacity-100' : 'opacity-70'}` 
                          : 'bg-muted-foreground/20'
                        }
                      `}
                      style={{ height: baseHeight }}
                      animate={{
                        height: isActive && isFilled ? baseHeight + 4 : baseHeight,
                      }}
                      transition={{ duration: 0.15 }}
                    />
                  );
                })}
              </div>

              {/* Value number */}
              <span className={`
                text-sm font-semibold transition-colors
                ${isSelected ? option.textColor : 'text-muted-foreground'}
              `}>
                {option.value}
              </span>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${option.color} flex items-center justify-center`}
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Current selection label */}
      <div className="h-6 flex justify-center">
        {selected && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-base font-medium ${SCALE_OPTIONS[selected - 1].textColor}`}
          >
            {SCALE_OPTIONS[selected - 1].label}
          </motion.p>
        )}
      </div>
    </div>
  );
}
