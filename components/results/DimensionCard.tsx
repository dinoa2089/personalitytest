"use client";

import { motion } from "framer-motion";
import { dimensionColors } from "@/lib/design-tokens";
import type { DimensionScore } from "@/types";

interface DimensionCardProps {
  score: DimensionScore;
}

export function DimensionCard({ score }: DimensionCardProps) {
  const color = dimensionColors[score.dimension as keyof typeof dimensionColors];
  const dimensionName = score.dimension
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-bold">{dimensionName}</h3>
          <div className="flex items-baseline gap-1">
            <span
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${color.light}, ${color.dark || color.light})`
              }}
            >
              {score.percentile.toFixed(0)}
            </span>
            <span className="text-lg text-muted-foreground">%</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full overflow-hidden rounded-full bg-muted/50 backdrop-blur-sm">
            <motion.div
              className="h-full rounded-full shadow-sm"
              style={{ 
                background: `linear-gradient(90deg, ${color.light}, ${color.dark || color.light})`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${score.percentile}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{score.percentile.toFixed(1)}th percentile</span>
            <span className="text-xs">
              90% CI: {score.confidence_interval[0].toFixed(1)}-{score.confidence_interval[1].toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

