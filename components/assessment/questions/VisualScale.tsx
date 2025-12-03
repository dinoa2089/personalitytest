"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/types";

interface VisualScaleProps {
  question: Question;
  onAnswer: (response: number) => void;
}

const SCALE_OPTIONS = [
  { value: 1, emoji: "😟", label: "Strongly Disagree" },
  { value: 2, emoji: "🙁", label: "Disagree" },
  { value: 3, emoji: "😕", label: "Slightly Disagree" },
  { value: 4, emoji: "😐", label: "Neutral" },
  { value: 5, emoji: "🙂", label: "Slightly Agree" },
  { value: 6, emoji: "😊", label: "Agree" },
  { value: 7, emoji: "😄", label: "Strongly Agree" },
];

export function VisualScale({ question, onAnswer }: VisualScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovering, setHovering] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    setSelected(value);
    setTimeout(() => onAnswer(value), 400);
  };

  return (
    <div className="space-y-8">
      <p className="text-lg text-center">{question.text}</p>

      <div className="flex justify-center gap-2 sm:gap-4">
        {SCALE_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            onMouseEnter={() => setHovering(option.value)}
            onMouseLeave={() => setHovering(null)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`relative p-2 sm:p-3 rounded-full transition-all ${
              selected === option.value
                ? "bg-primary/20 ring-2 ring-primary"
                : "hover:bg-muted"
            }`}
          >
            <span className="text-2xl sm:text-4xl">{option.emoji}</span>
            
            {/* Tooltip */}
            {hovering === option.value && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-xs bg-popover text-popover-foreground px-2 py-1 rounded shadow">
                  {option.label}
                </span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Current selection label */}
      {selected && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground"
        >
          {SCALE_OPTIONS.find(o => o.value === selected)?.label}
        </motion.p>
      )}
    </div>
  );
}



