"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface PopulationRarityProps {
  percentage: number;
  typeName: string;
  showTitle?: boolean;
  className?: string;
  variant?: "dots" | "bar" | "pictograph";
}

export function PopulationRarity({
  percentage,
  typeName,
  showTitle = true,
  className = "",
  variant = "dots",
}: PopulationRarityProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  const totalDots = 100;
  const filledDots = Math.round(percentage);

  const getRarityLabel = (pct: number): { label: string; color: string } => {
    if (pct <= 3) return { label: "Very Rare", color: "text-purple-500" };
    if (pct <= 6) return { label: "Rare", color: "text-violet-500" };
    if (pct <= 9) return { label: "Uncommon", color: "text-blue-500" };
    if (pct <= 12) return { label: "Moderately Common", color: "text-cyan-500" };
    return { label: "Common", color: "text-green-500" };
  };

  const { label: rarityLabel, color: rarityColor } = getRarityLabel(percentage);

  const renderDots = () => (
    <div className="grid grid-cols-10 gap-1">
      {Array.from({ length: totalDots }).map((_, index) => {
        const isFilled = index < filledDots;
        return (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full ${
              isFilled ? "bg-primary" : "bg-muted/50"
            }`}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              delay: isFilled ? index * 0.02 : 0.5 + (index - filledDots) * 0.005,
              duration: 0.2,
            }}
          />
        );
      })}
    </div>
  );

  const renderBar = () => (
    <div className="space-y-2">
      <div className="h-8 bg-muted/30 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground drop-shadow-sm">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );

  const renderPictograph = () => {
    const rows = 5;
    const cols = 20;
    const totalPeople = rows * cols;
    const filledPeople = Math.round((percentage / 100) * totalPeople);

    return (
      <div className="space-y-1">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-0.5">
            {Array.from({ length: cols }).map((_, colIndex) => {
              const index = rowIndex * cols + colIndex;
              const isFilled = index < filledPeople;
              return (
                <motion.div
                  key={colIndex}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.01 }}
                >
                  <Users
                    className={`w-3 h-3 ${
                      isFilled ? "text-primary" : "text-muted/30"
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const content = (
    <div ref={ref} className={className}>
      {variant === "dots" && renderDots()}
      {variant === "bar" && renderBar()}
      {variant === "pictograph" && renderPictograph()}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1 }}
        className="mt-4 text-center space-y-1"
      >
        <div className="flex items-center justify-center gap-2">
          <span className={`text-2xl font-bold ${rarityColor}`}>
            {percentage}%
          </span>
          <span className={`text-sm font-medium ${rarityColor}`}>
            ({rarityLabel})
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          of the population shares this personality type
        </p>
      </motion.div>

      {/* Context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
        className="mt-4 p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground"
      >
        <p>
          In a room of 100 people, approximately{" "}
          <span className="font-semibold text-foreground">{Math.round(percentage)}</span>{" "}
          would share your {typeName} personality type.
        </p>
      </motion.div>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Population Rarity</CardTitle>
          </div>
          <CardDescription className="text-xs">
            How common is {typeName} in the general population?
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default PopulationRarity;

