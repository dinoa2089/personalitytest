"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/types";

interface BehavioralFrequencyProps {
  question: Question;
  onAnswer: (value: number) => void;
}

const frequencyOptions = [
  { label: "Never", value: 1 },
  { label: "Rarely", value: 2 },
  { label: "Sometimes", value: 3 },
  { label: "Often", value: 4 },
  { label: "Very Often", value: 5 },
];

export function BehavioralFrequency({ question, onAnswer }: BehavioralFrequencyProps) {
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
    <div className="space-y-3">
      {frequencyOptions.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => handleSelect(option.value)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
            selected === option.value
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{option.label}</span>
            {selected === option.value && (
              <span className="text-primary">✓</span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

