"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dimensionColors } from "@/lib/design-tokens";
import type { DimensionScore } from "@/types";

interface PersonProfile {
  name: string;
  archetype: string;
  icon: string;
  scores: DimensionScore[];
  color: string;
}

interface DualRadarChartProps {
  personA: PersonProfile;
  personB: PersonProfile;
  showTitle?: boolean;
  className?: string;
  showOverlapAnalysis?: boolean;
}

const dimensionLabels: Record<string, string> = {
  openness: "Openness",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  emotionalResilience: "Emotional Resilience",
  honestyHumility: "Honesty-Humility",
  adaptability: "Adaptability",
};

function calculateOverlap(scoresA: DimensionScore[], scoresB: DimensionScore[]): {
  overallCompatibility: number;
  complementaryAreas: string[];
  similarAreas: string[];
  potentialFriction: string[];
} {
  const aMap = new Map(scoresA.map(s => [s.dimension, s.percentile]));
  const bMap = new Map(scoresB.map(s => [s.dimension, s.percentile]));
  
  let totalSimilarity = 0;
  const complementary: string[] = [];
  const similar: string[] = [];
  const friction: string[] = [];
  
  scoresA.forEach(scoreA => {
    const aVal = scoreA.percentile;
    const bVal = bMap.get(scoreA.dimension) || 50;
    const diff = Math.abs(aVal - bVal);
    
    // Calculate similarity (100 - difference)
    totalSimilarity += (100 - diff);
    
    const dimName = dimensionLabels[scoreA.dimension] || scoreA.dimension;
    
    if (diff <= 15) {
      // Very similar
      similar.push(dimName);
    } else if (diff >= 40) {
      // Could be complementary or friction
      // Complementary: one high, one low in areas where that's beneficial
      if ((aVal > 65 && bVal < 40) || (bVal > 65 && aVal < 40)) {
        if (scoreA.dimension === "extraversion" || scoreA.dimension === "openness") {
          complementary.push(dimName);
        } else {
          friction.push(dimName);
        }
      } else {
        friction.push(dimName);
      }
    }
  });
  
  const overallCompatibility = Math.round(totalSimilarity / scoresA.length);
  
  return {
    overallCompatibility,
    complementaryAreas: complementary.slice(0, 2),
    similarAreas: similar.slice(0, 3),
    potentialFriction: friction.slice(0, 2),
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length >= 2) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{entry.value}%</span>
          </p>
        ))}
        <p className="text-xs text-muted-foreground mt-1">
          Difference: {Math.abs(payload[0].value - payload[1].value)}%
        </p>
      </div>
    );
  }
  return null;
};

export function DualRadarChart({
  personA,
  personB,
  showTitle = true,
  className = "",
  showOverlapAnalysis = true,
}: DualRadarChartProps) {
  // Combine data for dual radar
  const combinedData = personA.scores.map((scoreA) => {
    const scoreB = personB.scores.find((s) => s.dimension === scoreA.dimension);
    return {
      dimension: dimensionLabels[scoreA.dimension] || scoreA.dimension,
      [personA.name]: scoreA.percentile,
      [personB.name]: scoreB?.percentile || 50,
      fullMark: 100,
    };
  });

  const overlap = calculateOverlap(personA.scores, personB.scores);

  const content = (
    <div className={className}>
      {/* Person legends */}
      <div className="flex justify-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: personA.color }}
          />
          <span className="text-sm font-medium">{personA.icon} {personA.name}</span>
          <Badge variant="outline" className="text-xs">
            {personA.archetype}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: personB.color }}
          />
          <span className="text-sm font-medium">{personB.icon} {personB.name}</span>
          <Badge variant="outline" className="text-xs">
            {personB.archetype}
          </Badge>
        </div>
      </div>

      {/* Radar Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={combinedData}>
          <PolarGrid strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name={personA.name}
            dataKey={personA.name}
            stroke={personA.color}
            fill={personA.color}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name={personB.name}
            dataKey={personB.name}
            stroke={personB.color}
            fill={personB.color}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Overlap Analysis */}
      {showOverlapAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 space-y-4"
        >
          {/* Overall Compatibility Score */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-1">
              {overlap.overallCompatibility}%
            </div>
            <div className="text-sm text-muted-foreground">Overall Similarity</div>
          </div>

          {/* Analysis Grid */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            {/* Similar */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <div className="font-semibold text-green-600 mb-2 flex items-center gap-1">
                <span className="text-green-500">●</span> Similar
              </div>
              {overlap.similarAreas.length > 0 ? (
                <ul className="space-y-1 text-muted-foreground">
                  {overlap.similarAreas.map((area) => (
                    <li key={area} className="text-xs">{area}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">Few shared traits</p>
              )}
            </div>

            {/* Complementary */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="font-semibold text-blue-600 mb-2 flex items-center gap-1">
                <span className="text-blue-500">●</span> Complementary
              </div>
              {overlap.complementaryAreas.length > 0 ? (
                <ul className="space-y-1 text-muted-foreground">
                  {overlap.complementaryAreas.map((area) => (
                    <li key={area} className="text-xs">{area}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">Balance each other</p>
              )}
            </div>

            {/* Friction */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="font-semibold text-amber-600 mb-2 flex items-center gap-1">
                <span className="text-amber-500">●</span> Watch For
              </div>
              {overlap.potentialFriction.length > 0 ? (
                <ul className="space-y-1 text-muted-foreground">
                  {overlap.potentialFriction.map((area) => (
                    <li key={area} className="text-xs">{area}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">Low friction risk</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Personality Comparison</CardTitle>
          <CardDescription>
            See how your profiles overlap and complement each other
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default DualRadarChart;

