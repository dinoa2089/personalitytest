"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Typical dimensional profiles for each archetype
const archetypeProfiles: Record<string, { dimension: string; score: number; label: string }[]> = {
  innovator: [
    { dimension: "O", score: 85, label: "Openness" },
    { dimension: "C", score: 55, label: "Conscientiousness" },
    { dimension: "E", score: 60, label: "Extraversion" },
    { dimension: "A", score: 50, label: "Agreeableness" },
    { dimension: "N", score: 45, label: "Neuroticism" },
    { dimension: "H", score: 65, label: "Honesty-Humility" },
    { dimension: "X", score: 70, label: "Expressiveness" },
  ],
  architect: [
    { dimension: "O", score: 75, label: "Openness" },
    { dimension: "C", score: 85, label: "Conscientiousness" },
    { dimension: "E", score: 35, label: "Extraversion" },
    { dimension: "A", score: 45, label: "Agreeableness" },
    { dimension: "N", score: 40, label: "Neuroticism" },
    { dimension: "H", score: 70, label: "Honesty-Humility" },
    { dimension: "X", score: 40, label: "Expressiveness" },
  ],
  catalyst: [
    { dimension: "O", score: 80, label: "Openness" },
    { dimension: "C", score: 50, label: "Conscientiousness" },
    { dimension: "E", score: 85, label: "Extraversion" },
    { dimension: "A", score: 70, label: "Agreeableness" },
    { dimension: "N", score: 50, label: "Neuroticism" },
    { dimension: "H", score: 60, label: "Honesty-Humility" },
    { dimension: "X", score: 85, label: "Expressiveness" },
  ],
  strategist: [
    { dimension: "O", score: 70, label: "Openness" },
    { dimension: "C", score: 80, label: "Conscientiousness" },
    { dimension: "E", score: 55, label: "Extraversion" },
    { dimension: "A", score: 50, label: "Agreeableness" },
    { dimension: "N", score: 35, label: "Neuroticism" },
    { dimension: "H", score: 65, label: "Honesty-Humility" },
    { dimension: "X", score: 50, label: "Expressiveness" },
  ],
  connector: [
    { dimension: "O", score: 65, label: "Openness" },
    { dimension: "C", score: 60, label: "Conscientiousness" },
    { dimension: "E", score: 80, label: "Extraversion" },
    { dimension: "A", score: 85, label: "Agreeableness" },
    { dimension: "N", score: 55, label: "Neuroticism" },
    { dimension: "H", score: 75, label: "Honesty-Humility" },
    { dimension: "X", score: 75, label: "Expressiveness" },
  ],
  guardian: [
    { dimension: "O", score: 45, label: "Openness" },
    { dimension: "C", score: 85, label: "Conscientiousness" },
    { dimension: "E", score: 50, label: "Extraversion" },
    { dimension: "A", score: 75, label: "Agreeableness" },
    { dimension: "N", score: 50, label: "Neuroticism" },
    { dimension: "H", score: 85, label: "Honesty-Humility" },
    { dimension: "X", score: 45, label: "Expressiveness" },
  ],
  explorer: [
    { dimension: "O", score: 90, label: "Openness" },
    { dimension: "C", score: 40, label: "Conscientiousness" },
    { dimension: "E", score: 75, label: "Extraversion" },
    { dimension: "A", score: 55, label: "Agreeableness" },
    { dimension: "N", score: 45, label: "Neuroticism" },
    { dimension: "H", score: 55, label: "Honesty-Humility" },
    { dimension: "X", score: 80, label: "Expressiveness" },
  ],
  stabilizer: [
    { dimension: "O", score: 40, label: "Openness" },
    { dimension: "C", score: 80, label: "Conscientiousness" },
    { dimension: "E", score: 45, label: "Extraversion" },
    { dimension: "A", score: 70, label: "Agreeableness" },
    { dimension: "N", score: 40, label: "Neuroticism" },
    { dimension: "H", score: 80, label: "Honesty-Humility" },
    { dimension: "X", score: 35, label: "Expressiveness" },
  ],
  visionary: [
    { dimension: "O", score: 95, label: "Openness" },
    { dimension: "C", score: 45, label: "Conscientiousness" },
    { dimension: "E", score: 70, label: "Extraversion" },
    { dimension: "A", score: 55, label: "Agreeableness" },
    { dimension: "N", score: 55, label: "Neuroticism" },
    { dimension: "H", score: 60, label: "Honesty-Humility" },
    { dimension: "X", score: 85, label: "Expressiveness" },
  ],
  harmonizer: [
    { dimension: "O", score: 60, label: "Openness" },
    { dimension: "C", score: 55, label: "Conscientiousness" },
    { dimension: "E", score: 55, label: "Extraversion" },
    { dimension: "A", score: 90, label: "Agreeableness" },
    { dimension: "N", score: 45, label: "Neuroticism" },
    { dimension: "H", score: 80, label: "Honesty-Humility" },
    { dimension: "X", score: 60, label: "Expressiveness" },
  ],
  achiever: [
    { dimension: "O", score: 65, label: "Openness" },
    { dimension: "C", score: 90, label: "Conscientiousness" },
    { dimension: "E", score: 75, label: "Extraversion" },
    { dimension: "A", score: 50, label: "Agreeableness" },
    { dimension: "N", score: 35, label: "Neuroticism" },
    { dimension: "H", score: 55, label: "Honesty-Humility" },
    { dimension: "X", score: 70, label: "Expressiveness" },
  ],
  analyst: [
    { dimension: "O", score: 70, label: "Openness" },
    { dimension: "C", score: 75, label: "Conscientiousness" },
    { dimension: "E", score: 35, label: "Extraversion" },
    { dimension: "A", score: 55, label: "Agreeableness" },
    { dimension: "N", score: 50, label: "Neuroticism" },
    { dimension: "H", score: 75, label: "Honesty-Humility" },
    { dimension: "X", score: 30, label: "Expressiveness" },
  ],
};

interface ArchetypeRadarMiniProps {
  archetypeId: string;
  archetypeName: string;
  color?: string;
  showTitle?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold">{data.label}</p>
        <p className="text-muted-foreground">{data.score}th percentile</p>
      </div>
    );
  }
  return null;
};

export function ArchetypeRadarMini({
  archetypeId,
  archetypeName,
  color = "#8B5CF6",
  showTitle = true,
  className = "",
  size = "md",
}: ArchetypeRadarMiniProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  const data = archetypeProfiles[archetypeId] || archetypeProfiles.innovator;
  
  const sizeConfig = {
    sm: { height: 180, outerRadius: 50 },
    md: { height: 250, outerRadius: 70 },
    lg: { height: 320, outerRadius: 90 },
  };

  const config = sizeConfig[size];

  const content = (
    <div ref={ref} className={className}>
      <div style={{ height: config.height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%">
            <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <Radar
              name={archetypeName}
              dataKey="score"
              stroke={color}
              fill={color}
              fillOpacity={isInView ? 0.3 : 0}
              strokeWidth={2}
              animationBegin={isInView ? 0 : 9999}
              animationDuration={800}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className="text-xs text-center text-muted-foreground mt-2"
      >
        Typical dimensional profile for {archetypeName}
      </motion.p>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Dimensional Profile</CardTitle>
          <CardDescription className="text-xs">
            How {archetypeName} typically scores across 7 dimensions
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default ArchetypeRadarMini;



