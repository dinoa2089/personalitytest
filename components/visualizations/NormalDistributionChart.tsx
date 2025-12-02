"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Generate normal distribution data points
function generateNormalDistribution(mean: number = 50, stdDev: number = 15, points: number = 100) {
  const data = [];
  for (let i = 0; i <= 100; i += 100 / points) {
    const x = i;
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
              Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    data.push({ x, y: y * 1000 }); // Scale for visibility
  }
  return data;
}

interface NormalDistributionChartProps {
  showTitle?: boolean;
  className?: string;
  cutoffLine?: number;
  highlightRange?: { start: number; end: number };
  showMBTICutoff?: boolean;
}

export function NormalDistributionChart({
  showTitle = true,
  className = "",
  cutoffLine = 50,
  highlightRange,
  showMBTICutoff = true,
}: NormalDistributionChartProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const data = generateNormalDistribution(50, 15, 100);
  const maxY = Math.max(...data.map((d) => d.y));

  const content = (
    <div ref={ref} className={className}>
      {/* Chart */}
      <div className="relative h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="normalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
              </linearGradient>
              {/* Left side gradient (Introvert side) */}
              <linearGradient id="leftGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
              {/* Right side gradient (Extravert side) */}
              <linearGradient id="rightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="x"
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `${value}%`}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis hide domain={[0, maxY * 1.1]} />

            {/* Highlight range if provided */}
            {highlightRange && (
              <ReferenceArea
                x1={highlightRange.start}
                x2={highlightRange.end}
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
            )}

            {/* MBTI Cutoff Line */}
            {showMBTICutoff && (
              <ReferenceLine
                x={cutoffLine}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: "MBTI Cutoff",
                  position: "top",
                  fill: "#ef4444",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            )}

            {/* The distribution curve */}
            <Area
              type="monotone"
              dataKey="y"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#normalGradient)"
              animationDuration={isInView ? 1500 : 0}
              animationBegin={isInView ? 0 : 9999}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Labels */}
        {showMBTICutoff && (
          <>
            <div className="absolute bottom-[60px] left-[15%] text-xs text-center">
              <Badge variant="outline" className="border-blue-500/30 text-blue-600">
                "Introvert"
              </Badge>
            </div>
            <div className="absolute bottom-[60px] right-[15%] text-xs text-center">
              <Badge variant="outline" className="border-amber-500/30 text-amber-600">
                "Extravert"
              </Badge>
            </div>
          </>
        )}
      </div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="space-y-4 mt-4"
      >
        {/* The Problem Section */}
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
            <span className="text-red-500">✗</span>
            The MBTI Problem: False Dichotomies
          </h4>
          <p className="text-sm text-muted-foreground">
            Personality traits follow a <span className="font-medium">normal distribution</span>—most 
            people fall near the middle. MBTI forces an arbitrary cutoff: someone scoring 51% on 
            extraversion is labeled "Extravert" while someone at 49% is labeled "Introvert," despite 
            being nearly identical.
          </p>
        </div>

        {/* The Solution Section */}
        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
          <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
            <span className="text-green-500">✓</span>
            The PRISM-7 Solution: Dimensional Scores
          </h4>
          <p className="text-sm text-muted-foreground">
            We report your <span className="font-medium">actual percentile position</span> on the 
            distribution. Someone at the 51st percentile is reported as "51st percentile"—slightly 
            above average—not forced into a binary category.
          </p>
        </div>

        {/* Visual comparison */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
            <p className="text-xs text-muted-foreground mb-1">MBTI says:</p>
            <p className="font-bold text-red-600">"You are an Extravert"</p>
            <p className="text-[10px] text-muted-foreground mt-1">(or Introvert, nothing in between)</p>
          </div>
          <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5">
            <p className="text-xs text-muted-foreground mb-1">PRISM-7 says:</p>
            <p className="font-bold text-green-600">"65th percentile"</p>
            <p className="text-[10px] text-muted-foreground mt-1">(with 90% CI: 55-75)</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Why Continuous Dimensions Matter</CardTitle>
          <CardDescription>
            Personality traits are distributed normally, not in binary categories
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default NormalDistributionChart;

