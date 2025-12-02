"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface ConfidenceIntervalProps {
  score?: number;
  lowerBound?: number;
  upperBound?: number;
  dimensionName?: string;
  showTitle?: boolean;
  className?: string;
  interactive?: boolean;
}

export function ConfidenceInterval({
  score = 65,
  lowerBound = 55,
  upperBound = 75,
  dimensionName = "Extraversion",
  showTitle = true,
  className = "",
  interactive = true,
}: ConfidenceIntervalProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredArea, setHoveredArea] = useState<"lower" | "middle" | "upper" | null>(null);

  // Calculate positions as percentages
  const scorePosition = score;
  const lowerPosition = lowerBound;
  const upperPosition = upperBound;

  const content = (
    <div ref={ref} className={`space-y-6 ${className}`}>
      {/* Main Visualization */}
      <div className="relative pt-8 pb-4">
        {/* Labels */}
        <div className="absolute -top-1 left-0 right-0 flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>

        {/* Track */}
        <div className="relative h-12 rounded-full bg-muted/50 overflow-hidden">
          {/* Confidence Interval Band */}
          <motion.div
            className="absolute top-0 h-full bg-primary/20 border-x-2 border-primary/40"
            initial={{ left: "50%", width: 0 }}
            animate={isInView ? {
              left: `${lowerPosition}%`,
              width: `${upperPosition - lowerPosition}%`,
            } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            onMouseEnter={() => setHoveredArea("middle")}
            onMouseLeave={() => setHoveredArea(null)}
          />

          {/* Point Estimate */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg z-10"
            initial={{ left: "50%" }}
            animate={isInView ? { left: `calc(${scorePosition}% - 8px)` } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          />

          {/* Scale markers */}
          {[0, 25, 50, 75, 100].map((mark) => (
            <div
              key={mark}
              className="absolute top-0 bottom-0 w-px bg-border/50"
              style={{ left: `${mark}%` }}
            />
          ))}
        </div>

        {/* Score Label */}
        <motion.div
          className="absolute -bottom-6 flex flex-col items-center"
          initial={{ left: "50%", opacity: 0 }}
          animate={isInView ? {
            left: `${scorePosition}%`,
            opacity: 1,
          } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="text-sm font-bold text-primary">{score}%</div>
        </motion.div>

        {/* Confidence Interval Labels */}
        <motion.div
          className="absolute top-14 flex items-center justify-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          style={{
            left: `${lowerPosition}%`,
            width: `${upperPosition - lowerPosition}%`,
          }}
        >
          <span className="bg-card px-2 py-0.5 rounded border border-border/50">
            90% CI: {lowerBound}-{upperBound}
          </span>
        </motion.div>
      </div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">
              What does this mean?
            </p>
            <p className="text-muted-foreground">
              Your <span className="font-medium">{dimensionName}</span> score is{" "}
              <span className="font-semibold text-primary">{score}th percentile</span>.
              The shaded area shows your 90% confidence interval ({lowerBound}-{upperBound}),
              meaning your true score is very likely somewhere in this range.
            </p>
          </div>
        </div>

        {/* Why CIs Matter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border border-border/50 bg-card/50">
            <div className="text-2xl font-bold text-foreground mb-1">
              {upperBound - lowerBound}%
            </div>
            <div className="text-xs text-muted-foreground">
              Interval width (precision)
            </div>
          </div>
          <div className="p-3 rounded-lg border border-border/50 bg-card/50">
            <div className="text-2xl font-bold text-foreground mb-1">90%</div>
            <div className="text-xs text-muted-foreground">
              Confidence level
            </div>
          </div>
          <div className="p-3 rounded-lg border border-border/50 bg-card/50">
            <div className="text-2xl font-bold text-primary mb-1">{score}%</div>
            <div className="text-xs text-muted-foreground">
              Point estimate
            </div>
          </div>
        </div>

        {/* Comparison note */}
        <div className="text-xs text-muted-foreground text-center">
          <span className="font-medium">Note:</span> Unlike MBTI which presents results
          as definitive, PRISM-7 shows confidence intervals to transparently communicate
          measurement precision.
        </div>
      </motion.div>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Understanding Confidence Intervals</CardTitle>
              <CardDescription>
                How we communicate measurement precision
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary">
              {dimensionName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default ConfidenceInterval;

