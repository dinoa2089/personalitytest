"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { dimensionColors } from "@/lib/design-tokens";
import type { DimensionScore } from "@/types";

interface RadarChartProps {
  scores: DimensionScore[];
  height?: number;
}

// Shorter labels to prevent overlap in radar chart
const shortLabels: Record<string, string> = {
  openness: "Openness",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  emotionalResilience: "Resilience",
  honestyHumility: "Honesty",
  adaptability: "Adaptability",
};

export function PersonalityRadarChart({ scores, height = 350 }: RadarChartProps) {
  const data = scores.map((score) => ({
    dimension: shortLabels[score.dimension] || score.dimension
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    score: score.percentile,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          tickCount={5}
        />
        <Radar
          name="Your Profile"
          dataKey="score"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

