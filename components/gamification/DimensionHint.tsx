"use client";

import { motion } from "framer-motion";
import { dimensionColors } from "@/lib/design-tokens";
import type { Dimension } from "@/types";

interface DimensionHintProps {
  dimension: Dimension;
  message: string;
}

export function DimensionHint({ dimension, message }: DimensionHintProps) {
  const color = dimensionColors[dimension];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded-lg border bg-card p-4"
      style={{ borderColor: color.light }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color.light }}
        />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </motion.div>
  );
}

