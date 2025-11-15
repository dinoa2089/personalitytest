"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Question } from "@/types";

interface LikertScaleProps {
  question: Question;
  onAnswer: (value: number) => void;
}

const scaleLabels = [
  "Strongly Disagree",
  "Disagree",
  "Somewhat Disagree",
  "Neutral",
  "Somewhat Agree",
  "Agree",
  "Strongly Agree",
];

// Improved emojis with better emotional contrast - more nuanced range
const scaleEmojis = ["😞", "😐", "🙂", "😊", "😄", "🤩", "🎯"];

export function LikertScale({ question, onAnswer }: LikertScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);

  // Reset selection when question changes
  useEffect(() => {
    setSelected(null);
  }, [question.id]);

  const handleSelect = (value: number) => {
    setSelected(value);
    onAnswer(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-7 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((value) => (
          <motion.button
            key={value}
            onClick={() => handleSelect(value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
              selected === value
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className="text-2xl">{scaleEmojis[value - 1]}</span>
            <span className="text-sm font-medium">{value}</span>
          </motion.button>
        ))}
      </div>
      {selected && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-muted-foreground"
        >
          {scaleLabels[selected - 1]}
        </motion.p>
      )}
    </div>
  );
}

