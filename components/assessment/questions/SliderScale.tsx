"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/types";

interface SliderScaleProps {
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

export function SliderScale({ question, onAnswer }: SliderScaleProps) {
  const [value, setValue] = useState<number>(4); // Start neutral
  const [hasInteracted, setHasInteracted] = useState(false);

  // Reset when question changes
  useEffect(() => {
    setValue(4);
    setHasInteracted(false);
  }, [question.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    setHasInteracted(true);
  };

  const handleSubmit = () => {
    if (hasInteracted) {
      onAnswer(value);
    }
  };

  // Calculate gradient color based on value
  const getGradientColor = () => {
    if (value <= 2) return "from-red-500 to-orange-400";
    if (value <= 3) return "from-orange-400 to-yellow-400";
    if (value === 4) return "from-yellow-400 to-yellow-400";
    if (value <= 5) return "from-yellow-400 to-lime-400";
    return "from-lime-400 to-emerald-500";
  };

  // Calculate thumb position percentage
  const thumbPosition = ((value - 1) / 6) * 100;

  return (
    <div className="space-y-8">
      {/* Slider container */}
      <div className="relative pt-8 pb-4">
        {/* Value indicator bubble */}
        <motion.div
          className="absolute -top-2 transform -translate-x-1/2 z-10"
          style={{ left: `${thumbPosition}%` }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: hasInteracted ? 1 : 0.8, opacity: hasInteracted ? 1 : 0.5 }}
        >
          <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getGradientColor()} text-white font-bold shadow-lg`}>
            {value}
          </div>
          <div className={`w-3 h-3 mx-auto -mt-1.5 rotate-45 bg-gradient-to-r ${getGradientColor()}`} />
        </motion.div>

        {/* Track background */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          {/* Filled track */}
          <motion.div
            className={`absolute h-full bg-gradient-to-r ${getGradientColor()} rounded-full`}
            initial={{ width: "50%" }}
            animate={{ width: `${thumbPosition}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Custom slider input */}
        <input
          type="range"
          min="1"
          max="7"
          value={value}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Tick marks */}
        <div className="flex justify-between mt-2 px-0">
          {[1, 2, 3, 4, 5, 6, 7].map((tick) => (
            <div
              key={tick}
              className={`flex flex-col items-center ${
                tick === value ? "opacity-100" : "opacity-50"
              }`}
            >
              <div
                className={`w-1 h-3 rounded-full ${
                  tick === value ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
              <span className="text-xs mt-1 text-muted-foreground">{tick}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Label display */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: hasInteracted ? 1 : 0.5 }}
      >
        <p className="text-lg font-medium text-foreground">
          {scaleLabels[value - 1]}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Drag the slider or tap a point to select
        </p>
      </motion.div>

      {/* Submit button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!hasInteracted}
        whileHover={{ scale: hasInteracted ? 1.02 : 1 }}
        whileTap={{ scale: hasInteracted ? 0.98 : 1 }}
        className={`w-full py-4 rounded-xl font-semibold transition-all ${
          hasInteracted
            ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        {hasInteracted ? "Confirm Answer" : "Move the slider to answer"}
      </motion.button>
    </div>
  );
}

