"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { Question } from "@/types";

interface BinaryChoiceProps {
  question: Question;
  onAnswer: (value: number) => void;
}

export function BinaryChoice({ question, onAnswer }: BinaryChoiceProps) {
  const [selected, setSelected] = useState<"agree" | "disagree" | null>(null);

  // Reset when question changes
  useEffect(() => {
    setSelected(null);
  }, [question.id]);

  const handleSelect = (choice: "agree" | "disagree") => {
    setSelected(choice);
    // Map to likert scale: disagree = 2, agree = 6
    onAnswer(choice === "agree" ? 6 : 2);
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-muted-foreground mb-8">
        Quick response - does this describe you?
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Disagree button */}
        <motion.button
          onClick={() => handleSelect("disagree")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 transition-all ${
            selected === "disagree"
              ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20"
              : "border-border hover:border-red-500/50 hover:bg-red-500/5"
          }`}
        >
          <motion.div
            animate={{
              scale: selected === "disagree" ? [1, 1.2, 1] : 1,
              rotate: selected === "disagree" ? [0, -10, 10, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-full ${
              selected === "disagree" ? "bg-red-500" : "bg-red-500/20"
            }`}
          >
            <X
              className={`w-8 h-8 ${
                selected === "disagree" ? "text-white" : "text-red-500"
              }`}
            />
          </motion.div>
          <span
            className={`text-lg font-semibold ${
              selected === "disagree" ? "text-red-500" : "text-foreground"
            }`}
          >
            Not Me
          </span>
          {selected === "disagree" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.button>

        {/* Agree button */}
        <motion.button
          onClick={() => handleSelect("agree")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 transition-all ${
            selected === "agree"
              ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
              : "border-border hover:border-emerald-500/50 hover:bg-emerald-500/5"
          }`}
        >
          <motion.div
            animate={{
              scale: selected === "agree" ? [1, 1.2, 1] : 1,
              rotate: selected === "agree" ? [0, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-full ${
              selected === "agree" ? "bg-emerald-500" : "bg-emerald-500/20"
            }`}
          >
            <Check
              className={`w-8 h-8 ${
                selected === "agree" ? "text-white" : "text-emerald-500"
              }`}
            />
          </motion.div>
          <span
            className={`text-lg font-semibold ${
              selected === "agree" ? "text-emerald-500" : "text-foreground"
            }`}
          >
            That's Me
          </span>
          {selected === "agree" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Subtle tip */}
      <p className="text-center text-xs text-muted-foreground/70 mt-4">
        Go with your gut feeling
      </p>
    </div>
  );
}


