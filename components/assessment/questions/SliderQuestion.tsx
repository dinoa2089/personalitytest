"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/types";

interface SliderQuestionProps {
  question: Question;
  onAnswer: (response: number) => void;
  min?: number;
  max?: number;
  labels?: { low: string; high: string };
}

export function SliderQuestion({ 
  question, 
  onAnswer,
  min = 1,
  max = 7,
  labels = { low: "Strongly Disagree", high: "Strongly Agree" }
}: SliderQuestionProps) {
  const [value, setValue] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
  };

  const handleSubmit = () => {
    if (value === null) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onAnswer(value);
      setIsSubmitting(false);
    }, 300);
  };

  const percentage = value !== null ? ((value - min) / (max - min)) * 100 : 50;

  return (
    <div className="space-y-8">
      <p className="text-lg text-center">{question.text}</p>

      {/* Slider */}
      <div className="space-y-4">
        <div className="relative pt-6">
          {/* Value indicator */}
          {value !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-2 transform -translate-x-1/2"
              style={{ left: `${percentage}%` }}
            >
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                {value}
              </div>
            </motion.div>
          )}

          {/* Track */}
          <div className="relative h-3 bg-muted rounded-full">
            {/* Filled portion */}
            <div
              className="absolute h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Input */}
          <input
            type="range"
            min={min}
            max={max}
            value={value ?? Math.floor((min + max) / 2)}
            onChange={handleChange}
            className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
          />

          {/* Tick marks */}
          <div className="flex justify-between mt-2">
            {Array.from({ length: max - min + 1 }, (_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-0.5 h-2 bg-muted-foreground/30" />
                <span className="text-xs text-muted-foreground mt-1">{min + i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{labels.low}</span>
          <span>{labels.high}</span>
        </div>
      </div>

      {/* Submit button */}
      <motion.button
        onClick={handleSubmit}
        disabled={value === null || isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-lg font-medium transition-all ${
          value !== null
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Saving..." : "Continue"}
      </motion.button>
    </div>
  );
}




