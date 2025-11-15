"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dimensionColors } from "@/lib/design-tokens";
import type { Dimension } from "@/types";

interface DimensionProgressProps {
  responses: Array<{ dimension: Dimension }>;
  currentQuestionIndex: number;
}

export function DimensionProgress({ responses, currentQuestionIndex }: DimensionProgressProps) {
  const [hintDimension, setHintDimension] = useState<Dimension | null>(null);

  useEffect(() => {
    // Show hint every 5-7 questions
    if (currentQuestionIndex > 0 && currentQuestionIndex % 6 === 0) {
      // Find dimension with most responses so far
      const dimensionCounts = responses.reduce((acc, r) => {
        acc[r.dimension] = (acc[r.dimension] || 0) + 1;
        return acc;
      }, {} as Record<Dimension, number>);

      const topDimension = Object.entries(dimensionCounts).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0] as Dimension | undefined;

      if (topDimension) {
        setHintDimension(topDimension);
        setTimeout(() => setHintDimension(null), 5000);
      }
    }
  }, [currentQuestionIndex, responses]);

  if (!hintDimension) return null;

  const color = dimensionColors[hintDimension];
  const dimensionName = color.name;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="mb-4 rounded-lg border bg-card p-3"
      style={{ borderColor: color.light }}
    >
      <div className="flex items-center gap-2">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color.light }}
        />
        <p className="text-sm text-muted-foreground">
          Your <span className="font-medium" style={{ color: color.light }}>
            {dimensionName}
          </span> is taking shape...
        </p>
      </div>
    </motion.div>
  );
}

