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
  const [value, setValue] = useState<number | null>(null); // Start with no selection
  const [hasInteracted, setHasInteracted] = useState(false);

  // Reset when question changes
  useEffect(() => {
    setValue(null);
    setHasInteracted(false);
  }, [question.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    setHasInteracted(true);
    // Auto-submit after a brief delay to show the selection
    setTimeout(() => onAnswer(newValue), 150);
  };

  const handleTickClick = (tick: number) => {
    setValue(tick);
    setHasInteracted(true);
    // Auto-submit after a brief delay to show the selection
    setTimeout(() => onAnswer(tick), 150);
  };

  // Calculate gradient color based on value
  const getGradientColor = () => {
    if (value === null) return "from-slate-400 to-slate-400";
    if (value <= 2) return "from-red-500 to-orange-400";
    if (value <= 3) return "from-orange-400 to-yellow-400";
    if (value === 4) return "from-yellow-400 to-yellow-400";
    if (value <= 5) return "from-yellow-400 to-lime-400";
    return "from-lime-400 to-emerald-500";
  };

  // Calculate thumb position percentage (default to center if no value)
  const displayValue = value ?? 4;
  const thumbPosition = ((displayValue - 1) / 6) * 100;

  return (
    <div className="space-y-8">
      {/* Slider container */}
      <div className="relative pt-8 pb-4">
        {/* Value indicator bubble - only show when value selected */}
        {hasInteracted && value !== null && (
          <motion.div
            className="absolute -top-2 transform -translate-x-1/2 z-10"
            style={{ left: `${thumbPosition}%` }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getGradientColor()} text-white font-bold shadow-lg`}>
              {value}
            </div>
            <div className={`w-3 h-3 mx-auto -mt-1.5 rotate-45 bg-gradient-to-r ${getGradientColor()}`} />
          </motion.div>
        )}

        {/* Track background */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          {/* Filled track - only show when value selected */}
          {hasInteracted && value !== null && (
            <motion.div
              className={`absolute h-full bg-gradient-to-r ${getGradientColor()} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${thumbPosition}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </div>

        {/* Custom slider input - on the track only, not blocking tick marks */}
        <input
          type="range"
          min="1"
          max="7"
          value={displayValue}
          onChange={handleChange}
          className="absolute top-0 left-0 right-0 h-12 opacity-0 cursor-pointer z-0"
        />

        {/* Clickable tick marks - above the hidden input */}
        <div className="relative z-10 flex justify-between mt-2 px-0">
          {[1, 2, 3, 4, 5, 6, 7].map((tick) => (
            <button
              key={tick}
              type="button"
              onClick={() => handleTickClick(tick)}
              className={`flex flex-col items-center cursor-pointer hover:opacity-100 transition-opacity ${
                tick === value ? "opacity-100" : "opacity-60 hover:opacity-80"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all ${
                  tick === value 
                    ? "bg-primary scale-125 ring-2 ring-primary/30" 
                    : "bg-muted-foreground/40 hover:bg-muted-foreground/60 hover:scale-110"
                }`}
              />
              <span className={`text-sm mt-1 font-medium ${
                tick === value ? "text-foreground" : "text-muted-foreground"
              }`}>{tick}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Label display */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: hasInteracted && value !== null ? 1 : 0.5 }}
      >
        <p className="text-lg font-medium text-foreground">
          {value !== null ? scaleLabels[value - 1] : "Tap a point to answer"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {value !== null ? "Great choice!" : "Select 1-7 on the scale above"}
        </p>
      </motion.div>
    </div>
  );
}

