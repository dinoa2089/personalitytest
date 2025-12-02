"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { archetypes } from "@/lib/archetypes";

// Get colors for each archetype based on their defined gradient
const archetypeColors: Record<string, string> = {
  innovator: "#8B5CF6",
  architect: "#3B82F6",
  catalyst: "#F97316",
  strategist: "#10B981",
  connector: "#EC4899",
  guardian: "#22C55E",
  explorer: "#F59E0B",
  stabilizer: "#06B6D4",
  visionary: "#8B5CF6",
  harmonizer: "#14B8A6",
  achiever: "#F59E0B",
  analyst: "#64748B",
};

interface ArchetypeDistributionProps {
  showTitle?: boolean;
  className?: string;
  highlightArchetype?: string;
  variant?: "donut" | "pie";
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{data.icon}</span>
          <span className="font-semibold">{data.name}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {data.rarity}% of population
        </p>
      </div>
    );
  }
  return null;
};

export function ArchetypeDistribution({
  showTitle = true,
  className = "",
  highlightArchetype,
  variant = "donut",
}: ArchetypeDistributionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = archetypes.map((archetype) => ({
    id: archetype.id,
    name: archetype.name,
    rarity: archetype.rarity,
    icon: archetype.icon,
    color: archetypeColors[archetype.id] || "#888888",
  }));

  // Sort by rarity for better visualization
  const sortedData = [...data].sort((a, b) => b.rarity - a.rarity);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const content = (
    <div ref={ref} className={className}>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sortedData}
              dataKey="rarity"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={variant === "donut" ? 60 : 0}
              outerRadius={120}
              paddingAngle={2}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationBegin={isInView ? 0 : 9999}
              animationDuration={800}
            >
              {sortedData.map((entry, index) => {
                const isHighlighted = highlightArchetype === entry.id;
                const isActive = activeIndex === index;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    fillOpacity={
                      highlightArchetype
                        ? isHighlighted
                          ? 1
                          : 0.3
                        : isActive
                        ? 1
                        : 0.8
                    }
                    stroke={isHighlighted || isActive ? "hsl(var(--foreground))" : "transparent"}
                    strokeWidth={isHighlighted || isActive ? 2 : 0}
                    style={{
                      filter: isActive ? "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" : undefined,
                      transform: isActive ? "scale(1.05)" : undefined,
                      transformOrigin: "center",
                      transition: "all 0.2s ease",
                    }}
                  />
                );
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8 }}
        className="mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
      >
        {sortedData.map((item, index) => {
          const isHighlighted = highlightArchetype === item.id;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8 + index * 0.03 }}
              className={`flex items-center gap-1.5 p-2 rounded-lg text-xs
                ${isHighlighted ? "bg-primary/10 ring-1 ring-primary" : "hover:bg-muted/50"}
                transition-colors cursor-default`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-lg">{item.icon}</span>
              <div className="overflow-hidden">
                <p className="font-medium truncate text-[10px]">
                  {item.name.replace("The ", "")}
                </p>
                <p className="text-muted-foreground text-[9px]">{item.rarity}%</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
        className="mt-4 text-center text-xs text-muted-foreground"
      >
        {highlightArchetype ? (
          <p>
            <span className="font-medium text-foreground">
              {data.find((d) => d.id === highlightArchetype)?.name}
            </span>{" "}
            represents{" "}
            <span className="font-medium text-primary">
              {data.find((d) => d.id === highlightArchetype)?.rarity}%
            </span>{" "}
            of the population
          </p>
        ) : (
          <p>
            Distribution based on validation sample of 5,000+ participants
          </p>
        )}
      </motion.div>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Archetype Distribution</CardTitle>
          <CardDescription>
            How common is each personality type in the population?
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default ArchetypeDistribution;

