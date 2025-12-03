"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/types";

interface ForcedChoiceTriadProps {
  question: Question;
  onAnswer: (response: string) => void;
}

export function ForcedChoiceTriad({ question, onAnswer }: ForcedChoiceTriadProps) {
  const [step, setStep] = useState<"most" | "least">("most");
  const [mostSelected, setMostSelected] = useState<string | null>(null);
  const [leastSelected, setLeastSelected] = useState<string | null>(null);

  useEffect(() => {
    setStep("most");
    setMostSelected(null);
    setLeastSelected(null);
  }, [question.id]);

  const options = question.options || [];

  const handleMostSelect = (option: string) => {
    setMostSelected(option);
    // Clear transition before moving to next step
    // Wait for animation to complete
    setTimeout(() => setStep("least"), 400);
  };

  const handleLeastSelect = (option: string) => {
    if (option === mostSelected) return;
    setLeastSelected(option);
    onAnswer(JSON.stringify({ most: mostSelected, least: option }));
  };

  const getOptionText = (opt: string | { text: string }): string => {
    return typeof opt === 'string' ? opt : opt.text;
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          step === "most" 
            ? "bg-green-500/20 text-green-600 ring-2 ring-green-500" 
            : "bg-muted text-muted-foreground"
        }`}>
          <span className="font-bold">1</span>
          <span>Select MOST</span>
          {mostSelected && <span>✓</span>}
        </div>
        
        <div className="w-8 h-0.5 bg-muted" />
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          step === "least" 
            ? "bg-orange-500/20 text-orange-600 ring-2 ring-orange-500" 
            : "bg-muted text-muted-foreground"
        }`}>
          <span className="font-bold">2</span>
          <span>Select LEAST</span>
        </div>
      </div>

      {/* Current Step Label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`text-xl font-semibold text-center ${
            step === "most" ? "text-green-600" : "text-orange-600"
          }`}
        >
          Which is <span className="font-bold uppercase">{step}</span> like you?
        </motion.p>
      </AnimatePresence>

      {/* Options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: step === "least" ? 50 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {options.map((option, index) => {
            const optionText = getOptionText(option);
            const isSelectedAsMost = optionText === mostSelected;
            const isDisabled = step === "least" && isSelectedAsMost;

            return (
              <motion.button
                key={index}
                onClick={() => {
                  if (isDisabled) return;
                  step === "most" 
                    ? handleMostSelect(optionText) 
                    : handleLeastSelect(optionText);
                }}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  isDisabled
                    ? "border-green-300 bg-green-50 opacity-60 cursor-not-allowed"
                    : step === "most"
                    ? "border-border hover:border-green-500 hover:bg-green-500/5"
                    : "border-border hover:border-orange-500 hover:bg-orange-500/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={isDisabled ? "text-green-700" : ""}>
                    {optionText}
                  </span>
                  {isDisabled && (
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Selected as MOST
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
