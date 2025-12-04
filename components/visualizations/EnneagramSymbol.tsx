"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EnneagramSymbolProps {
  highlightedType: number;
  showWings?: boolean;
  showLines?: boolean;
  showTitle?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const typeColors: Record<number, string> = {
  1: "#64748b", // slate
  2: "#ec4899", // pink
  3: "#f59e0b", // amber
  4: "#8b5cf6", // purple
  5: "#3b82f6", // blue
  6: "#22c55e", // green
  7: "#f97316", // orange
  8: "#ef4444", // red
  9: "#14b8a6", // teal
};

const typeNames: Record<number, string> = {
  1: "Reformer",
  2: "Helper",
  3: "Achiever",
  4: "Individualist",
  5: "Investigator",
  6: "Loyalist",
  7: "Enthusiast",
  8: "Challenger",
  9: "Peacemaker",
};

// Integration and disintegration lines
const integrationLines: Record<number, number> = {
  1: 7, 2: 4, 3: 6, 4: 1, 5: 8, 6: 9, 7: 5, 8: 2, 9: 3,
};

const disintegrationLines: Record<number, number> = {
  1: 4, 2: 8, 3: 9, 4: 2, 5: 7, 6: 3, 7: 1, 8: 5, 9: 6,
};

export function EnneagramSymbol({
  highlightedType,
  showWings = true,
  showLines = true,
  showTitle = true,
  size = "md",
  className = "",
}: EnneagramSymbolProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  const sizeConfig = {
    sm: { width: 200, radius: 70, fontSize: 12, dotSize: 24 },
    md: { width: 280, radius: 100, fontSize: 14, dotSize: 32 },
    lg: { width: 360, radius: 130, fontSize: 16, dotSize: 40 },
  };

  const config = sizeConfig[size];
  const center = config.width / 2;

  // Calculate positions for each type (starting from top, going clockwise)
  const getPosition = (type: number) => {
    // Type 9 is at top (270°), then clockwise
    const angle = ((type - 9) * 40 - 90) * (Math.PI / 180);
    return {
      x: center + config.radius * Math.cos(angle),
      y: center + config.radius * Math.sin(angle),
    };
  };

  // Get wing types
  const leftWing = highlightedType === 1 ? 9 : highlightedType - 1;
  const rightWing = highlightedType === 9 ? 1 : highlightedType + 1;

  const integrationTarget = integrationLines[highlightedType];
  const disintegrationTarget = disintegrationLines[highlightedType];

  const content = (
    <div ref={ref} className={`flex flex-col items-center ${className}`}>
      <svg width={config.width} height={config.width} viewBox={`0 0 ${config.width} ${config.width}`}>
        {/* Outer circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={config.radius + 15}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={1}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Inner triangle (3-6-9) */}
        {showLines && (
          <motion.path
            d={`M ${getPosition(9).x} ${getPosition(9).y} 
                L ${getPosition(3).x} ${getPosition(3).y} 
                L ${getPosition(6).x} ${getPosition(6).y} Z`}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1}
            strokeOpacity={0.3}
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        )}

        {/* Hexad (1-4-2-8-5-7) */}
        {showLines && (
          <motion.path
            d={`M ${getPosition(1).x} ${getPosition(1).y} 
                L ${getPosition(4).x} ${getPosition(4).y} 
                L ${getPosition(2).x} ${getPosition(2).y} 
                L ${getPosition(8).x} ${getPosition(8).y} 
                L ${getPosition(5).x} ${getPosition(5).y} 
                L ${getPosition(7).x} ${getPosition(7).y} Z`}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1}
            strokeOpacity={0.3}
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />
        )}

        {/* Integration line (growth) */}
        {showLines && (
          <motion.line
            x1={getPosition(highlightedType).x}
            y1={getPosition(highlightedType).y}
            x2={getPosition(integrationTarget).x}
            y2={getPosition(integrationTarget).y}
            stroke="#22c55e"
            strokeWidth={2}
            strokeDasharray="4 2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
          />
        )}

        {/* Disintegration line (stress) */}
        {showLines && (
          <motion.line
            x1={getPosition(highlightedType).x}
            y1={getPosition(highlightedType).y}
            x2={getPosition(disintegrationTarget).x}
            y2={getPosition(disintegrationTarget).y}
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="4 2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
          />
        )}

        {/* Type dots */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((type, index) => {
          const pos = getPosition(type);
          const isHighlighted = type === highlightedType;
          const isWing = showWings && (type === leftWing || type === rightWing);
          const isArrow = type === integrationTarget || type === disintegrationTarget;
          
          return (
            <motion.g key={type}>
              {/* Dot circle */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isHighlighted ? config.dotSize / 2 : isWing ? config.dotSize / 2.5 : config.dotSize / 3}
                fill={isHighlighted ? typeColors[type] : isWing ? `${typeColors[type]}80` : "hsl(var(--muted))"}
                stroke={isHighlighted ? typeColors[type] : "transparent"}
                strokeWidth={isHighlighted ? 3 : 0}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
              />
              {/* Type number */}
              <motion.text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isHighlighted ? "white" : "hsl(var(--foreground))"}
                fontSize={isHighlighted ? config.fontSize : config.fontSize - 2}
                fontWeight={isHighlighted ? "bold" : "normal"}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.1 * index + 0.3 }}
              >
                {type}
              </motion.text>
            </motion.g>
          );
        })}
      </svg>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.5 }}
        className="flex flex-wrap justify-center gap-4 mt-4 text-xs"
      >
        {showWings && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted border border-border" />
            <span className="text-muted-foreground">Wings: {leftWing} & {rightWing}</span>
          </div>
        )}
        {showLines && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-green-500" style={{ backgroundImage: "repeating-linear-gradient(90deg, #22c55e 0, #22c55e 4px, transparent 4px, transparent 6px)" }} />
              <span className="text-muted-foreground">Growth → {integrationTarget}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5" style={{ backgroundImage: "repeating-linear-gradient(90deg, #ef4444 0, #ef4444 4px, transparent 4px, transparent 6px)" }} />
              <span className="text-muted-foreground">Stress → {disintegrationTarget}</span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-lg">Type {highlightedType}: {typeNames[highlightedType]}</CardTitle>
          <CardDescription className="text-xs">
            Enneagram connections and growth paths
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-4">{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default EnneagramSymbol;




