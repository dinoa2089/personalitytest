"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dimensionColors } from "@/lib/design-tokens";
import {
  Lightbulb,
  Target,
  Users,
  Heart,
  Shield,
  Compass,
  Sparkles,
} from "lucide-react";

interface DimensionInfo {
  id: string;
  name: string;
  color: string;
  icon: React.ElementType;
  shortDesc: string;
  fullDesc: string;
  highTraits: string[];
  lowTraits: string[];
}

const dimensions: DimensionInfo[] = [
  {
    id: "openness",
    name: "Openness",
    color: dimensionColors.openness.light,
    icon: Lightbulb,
    shortDesc: "Creativity & Curiosity",
    fullDesc: "Reflects your intellectual curiosity, creativity, and openness to new experiences and ideas.",
    highTraits: ["Creative", "Curious", "Imaginative", "Open-minded"],
    lowTraits: ["Practical", "Traditional", "Conventional", "Focused"],
  },
  {
    id: "conscientiousness",
    name: "Conscientiousness",
    color: dimensionColors.conscientiousness.light,
    icon: Target,
    shortDesc: "Organization & Discipline",
    fullDesc: "Measures your tendency toward organization, dependability, self-discipline, and goal-directed behavior.",
    highTraits: ["Organized", "Disciplined", "Reliable", "Thorough"],
    lowTraits: ["Flexible", "Spontaneous", "Adaptable", "Relaxed"],
  },
  {
    id: "extraversion",
    name: "Extraversion",
    color: dimensionColors.extraversion.light,
    icon: Users,
    shortDesc: "Social Energy",
    fullDesc: "Indicates how energized you are by social interaction and external stimulation.",
    highTraits: ["Outgoing", "Energetic", "Talkative", "Assertive"],
    lowTraits: ["Reserved", "Reflective", "Independent", "Calm"],
  },
  {
    id: "agreeableness",
    name: "Agreeableness",
    color: dimensionColors.agreeableness.light,
    icon: Heart,
    shortDesc: "Cooperation & Empathy",
    fullDesc: "Reflects your tendency toward cooperation, compassion, and concern for social harmony.",
    highTraits: ["Cooperative", "Trusting", "Helpful", "Empathetic"],
    lowTraits: ["Competitive", "Skeptical", "Challenging", "Direct"],
  },
  {
    id: "emotionalResilience",
    name: "Emotional Resilience",
    color: dimensionColors.emotionalResilience.light,
    icon: Shield,
    shortDesc: "Stability Under Stress",
    fullDesc: "Measures your ability to remain calm and stable under stress and in challenging situations.",
    highTraits: ["Calm", "Stable", "Confident", "Resilient"],
    lowTraits: ["Sensitive", "Reactive", "Passionate", "Expressive"],
  },
  {
    id: "honestyHumility",
    name: "Honesty-Humility",
    color: dimensionColors.honestyHumility.light,
    icon: Compass,
    shortDesc: "Authenticity & Fairness",
    fullDesc: "Reflects sincerity, fairness, modesty, and avoidance of manipulation or exploitation.",
    highTraits: ["Sincere", "Modest", "Fair", "Authentic"],
    lowTraits: ["Strategic", "Ambitious", "Confident", "Assertive"],
  },
  {
    id: "adaptability",
    name: "Adaptability",
    color: dimensionColors.adaptability.light,
    icon: Sparkles,
    shortDesc: "Change Readiness",
    fullDesc: "Measures how well you handle change, uncertainty, and new situations.",
    highTraits: ["Flexible", "Versatile", "Resourceful", "Agile"],
    lowTraits: ["Consistent", "Steady", "Predictable", "Grounded"],
  },
];

interface DimensionsWheelProps {
  showTitle?: boolean;
  className?: string;
  selectedDimension?: string;
  onSelect?: (dimensionId: string) => void;
}

export function DimensionsWheel({
  showTitle = true,
  className = "",
  selectedDimension,
  onSelect,
}: DimensionsWheelProps) {
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);
  const [activeDimension, setActiveDimension] = useState<string | null>(selectedDimension || null);

  const activeInfo = dimensions.find((d) => d.id === (activeDimension || hoveredDimension));

  const handleClick = (dimensionId: string) => {
    setActiveDimension(activeDimension === dimensionId ? null : dimensionId);
    onSelect?.(dimensionId);
  };

  // Calculate positions for 7 segments in a circle
  const centerX = 150;
  const centerY = 150;
  const innerRadius = 50;
  const outerRadius = 130;

  const createArcPath = (index: number, total: number): string => {
    const startAngle = (index * 360) / total - 90;
    const endAngle = ((index + 1) * 360) / total - 90;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + innerRadius * Math.cos(startRad);
    const y1 = centerY + innerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(startRad);
    const y2 = centerY + outerRadius * Math.sin(startRad);
    const x3 = centerX + outerRadius * Math.cos(endRad);
    const y3 = centerY + outerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(endRad);
    const y4 = centerY + innerRadius * Math.sin(endRad);

    const largeArcFlag = 0; // Each segment is less than 180 degrees

    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
      Z
    `;
  };

  const getIconPosition = (index: number, total: number) => {
    const angle = ((index + 0.5) * 360) / total - 90;
    const rad = (angle * Math.PI) / 180;
    const radius = (innerRadius + outerRadius) / 2;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  };

  const content = (
    <div className={`flex flex-col lg:flex-row items-center gap-8 ${className}`}>
      {/* SVG Wheel */}
      <div className="relative">
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="drop-shadow-lg"
        >
          {/* Segments */}
          {dimensions.map((dim, index) => {
            const isActive = activeDimension === dim.id || hoveredDimension === dim.id;
            const IconComponent = dim.icon;
            const iconPos = getIconPosition(index, dimensions.length);

            return (
              <g key={dim.id}>
                <motion.path
                  d={createArcPath(index, dimensions.length)}
                  fill={dim.color}
                  fillOpacity={isActive ? 0.9 : 0.6}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredDimension(dim.id)}
                  onMouseLeave={() => setHoveredDimension(null)}
                  onClick={() => handleClick(dim.id)}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.02 : 1,
                    fillOpacity: isActive ? 0.95 : 0.65,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                />
                {/* Icon */}
                <foreignObject
                  x={iconPos.x - 12}
                  y={iconPos.y - 12}
                  width={24}
                  height={24}
                  className="pointer-events-none"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <IconComponent
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-white/80"
                      }`}
                    />
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRadius - 5}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth={2}
          />
          <text
            x={centerX}
            y={centerY - 8}
            textAnchor="middle"
            className="fill-foreground text-xs font-bold"
          >
            PRISM-7
          </text>
          <text
            x={centerX}
            y={centerY + 8}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            Dimensions
          </text>
        </svg>
      </div>

      {/* Dimension Info Panel */}
      <div className="flex-1 min-w-[280px] max-w-[400px]">
        <AnimatePresence mode="wait">
          {activeInfo ? (
            <motion.div
              key={activeInfo.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-border/50 bg-card/80 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${activeInfo.color}20` }}
                >
                  <activeInfo.icon
                    className="w-6 h-6"
                    style={{ color: activeInfo.color }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{activeInfo.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeInfo.shortDesc}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {activeInfo.fullDesc}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-green-600 mb-2">
                    High Scorers
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {activeInfo.highTraits.map((trait) => (
                      <span
                        key={trait}
                        className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-600 mb-2">
                    Low Scorers
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {activeInfo.lowTraits.map((trait) => (
                      <span
                        key={trait}
                        className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-dashed border-border/50 bg-muted/30 p-6 text-center"
            >
              <p className="text-muted-foreground text-sm">
                Click on a dimension to learn more
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick legend */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {dimensions.map((dim) => (
            <button
              key={dim.id}
              onClick={() => handleClick(dim.id)}
              className={`text-xs px-2 py-1 rounded-full border transition-all ${
                activeDimension === dim.id
                  ? "border-primary bg-primary/10"
                  : "border-border/50 hover:border-primary/50"
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: dim.color }}
              />
              {dim.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">The 7 PRISM Dimensions</CardTitle>
          <CardDescription>
            Click on each dimension to explore what it measures
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default DimensionsWheel;

