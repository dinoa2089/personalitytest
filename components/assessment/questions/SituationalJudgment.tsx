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
  // Ensure state is clean for new question
  useEffect(() => {
    setSelected(null);
  }, [question.id]);

  const options = question.options || [];

  // Helper to get option text (handles both string and ForcedChoiceOption types)
  const getOptionText = (opt: string | { text: string }): string => {
    return typeof opt === 'string' ? opt : opt.text;
  };

  const handleSelect = (option: string) => {
    setSelected(option);
    onAnswer(option);
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const optionText = getOptionText(option);
        return (
          <motion.button
            key={index}
            onClick={() => handleSelect(optionText)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
              selected === optionText
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                  selected === optionText
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}
              >
                {selected === optionText && (
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                )}
              </div>
              <span>{optionText}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

