"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { DimensionScore } from "@/types";

interface TeamMemberData {
  id: string;
  name: string;
  scores: DimensionScore[];
}

interface Props {
  members: TeamMemberData[];
  showAverage?: boolean;
  averageProfile?: DimensionScore[];
  height?: number;
}

const MEMBER_COLORS = [
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f59e0b", // amber
  "#10b981", // emerald
  "#f43f5e", // rose
  "#6366f1", // indigo
  "#84cc16", // lime
  "#ec4899", // pink
  "#14b8a6", // teal
  "#a855f7", // purple
];

const DIMENSION_LABELS: Record<string, string> = {
  openness: "Openness",
  conscientiousness: "Conscient.",
  extraversion: "Extraversion",
  agreeableness: "Agreeable.",
  emotionalResilience: "Resilience",
  honestyHumility: "Honesty",
  adaptability: "Adaptability",
};

const DIMENSIONS = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "emotionalResilience",
  "honestyHumility",
  "adaptability",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function TeamRadarChart({
  members,
  showAverage = true,
  averageProfile,
  height = 400,
}: Props) {
  // Transform data for Recharts
  const data = DIMENSIONS.map((dim) => {
    const point: Record<string, string | number> = {
      dimension: DIMENSION_LABELS[dim] || dim,
    };

    members.forEach((member) => {
      const score = member.scores.find((s) => s.dimension === dim);
      point[member.name] = score?.percentile ?? 50;
    });

    if (showAverage && averageProfile) {
      const avgScore = averageProfile.find((s) => s.dimension === dim);
      point["Team Average"] = avgScore?.percentile ?? 50;
    }

    return point;
  });

  // Limit to 10 members for visual clarity
  const displayMembers = members.slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{
            fill: "hsl(var(--muted-foreground))",
            fontSize: 11,
          }}
          tickLine={false}
        />

        {displayMembers.map((member, i) => (
          <Radar
            key={member.id}
            name={member.name}
            dataKey={member.name}
            stroke={MEMBER_COLORS[i % MEMBER_COLORS.length]}
            fill={MEMBER_COLORS[i % MEMBER_COLORS.length]}
            fillOpacity={0.1}
            strokeWidth={2}
          />
        ))}

        {showAverage && averageProfile && (
          <Radar
            name="Team Average"
            dataKey="Team Average"
            stroke="hsl(var(--foreground))"
            fill="hsl(var(--foreground))"
            fillOpacity={0.05}
            strokeWidth={3}
            strokeDasharray="5 5"
          />
        )}

        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            paddingTop: "20px",
            fontSize: "12px",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// A simplified version showing only the team average
export function TeamAverageRadarChart({
  averageProfile,
  height = 300,
}: {
  averageProfile: DimensionScore[];
  height?: number;
}) {
  const data = DIMENSIONS.map((dim) => {
    const score = averageProfile.find((s) => s.dimension === dim);
    return {
      dimension: DIMENSION_LABELS[dim] || dim,
      score: score?.percentile ?? 50,
      fullMark: 100,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{
            fill: "hsl(var(--muted-foreground))",
            fontSize: 11,
          }}
          tickLine={false}
        />
        <Radar
          name="Team Profile"
          dataKey="score"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Score"]}
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

