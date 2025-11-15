"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/types";

interface SituationalJudgmentProps {
  question: Question;
  onAnswer: (value: string) => void;
}

export function SituationalJudgment({ question, onAnswer }: SituationalJudgmentProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // Reset selection when question changes
  useEffect(() => {
    setSelected(null);
  }, [question.id]);

  const options = question.options || [];

  const handleSelect = (option: string) => {
    setSelected(option);
    onAnswer(option);
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <motion.button
          key={index}
          onClick={() => handleSelect(option)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
            selected === option
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                selected === option
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              }`}
            >
              {selected === option && (
                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              )}
            </div>
            <span>{option}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

