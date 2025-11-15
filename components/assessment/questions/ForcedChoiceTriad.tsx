"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/types";

interface ForcedChoiceTriadProps {
  question: Question;
  onAnswer: (response: string) => void;
}

export function ForcedChoiceTriad({ question, onAnswer }: ForcedChoiceTriadProps) {
  const [step, setStep] = useState<"most" | "least">("most");
  const [mostSelected, setMostSelected] = useState<string | null>(null);
  const [leastSelected, setLeastSelected] = useState<string | null>(null);

  // Reset selection when question changes
  useEffect(() => {
    setStep("most");
    setMostSelected(null);
    setLeastSelected(null);
  }, [question.id]);

  const options = question.options || [];

  const handleMostSelect = (option: string) => {
    setMostSelected(option);
    // Move to least selection step
    setTimeout(() => setStep("least"), 300);
  };

  const handleLeastSelect = (option: string) => {
    if (option === mostSelected) {
      // Can't select the same option as most
      return;
    }
    setLeastSelected(option);
    // Submit the complete answer
    onAnswer(JSON.stringify({ most: mostSelected, least: option }));
  };

  if (step === "most") {
    return (
      <div className="space-y-4">
        <p className="text-lg font-medium mb-6 text-center">
          Which is <span className="text-green-600 font-semibold">MOST</span> like you?
        </p>
        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleMostSelect(option)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                mostSelected === option
                  ? "border-green-500 bg-green-500/10"
                  : "border-border hover:border-green-500/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {mostSelected === option && (
                  <span className="text-green-500 font-semibold">✓ Selected</span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Select least
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium mb-2 text-center">
        Which is <span className="text-red-600 font-semibold">LEAST</span> like you?
      </p>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        You selected: <span className="font-medium text-green-600">{mostSelected}</span> as most like you
      </p>
      <div className="space-y-3">
        {options.map((option, index) => {
          const isDisabled = option === mostSelected;
          return (
            <motion.button
              key={index}
              onClick={() => !isDisabled && handleLeastSelect(option)}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              disabled={isDisabled}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                isDisabled
                  ? "border-muted bg-muted/30 opacity-50 cursor-not-allowed"
                  : leastSelected === option
                  ? "border-red-500 bg-red-500/10"
                  : "border-border hover:border-red-500/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isDisabled && (
                  <span className="text-xs text-muted-foreground">(Already selected as most)</span>
                )}
                {leastSelected === option && !isDisabled && (
                  <span className="text-red-500 font-semibold">✓ Selected</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

