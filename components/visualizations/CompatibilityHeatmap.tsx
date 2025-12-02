"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { archetypes } from "@/lib/archetypes";

// Compatibility scores between archetypes (simplified matrix)
// Values: 1-5 where 5 = highly compatible, 1 = challenging
const compatibilityMatrix: Record<string, Record<string, number>> = {
  innovator: { innovator: 4, architect: 5, catalyst: 4, strategist: 3, connector: 3, guardian: 2, explorer: 5, stabilizer: 3, visionary: 5, harmonizer: 3, achiever: 4, analyst: 4 },
  architect: { innovator: 5, architect: 4, catalyst: 3, strategist: 5, connector: 3, guardian: 4, explorer: 3, stabilizer: 4, visionary: 5, harmonizer: 3, achiever: 4, analyst: 5 },
  catalyst: { innovator: 4, architect: 3, catalyst: 4, strategist: 3, connector: 5, guardian: 3, explorer: 5, stabilizer: 4, visionary: 4, harmonizer: 4, achiever: 5, analyst: 2 },
  strategist: { innovator: 3, architect: 5, catalyst: 3, strategist: 4, connector: 4, guardian: 5, explorer: 2, stabilizer: 5, visionary: 4, harmonizer: 4, achiever: 5, analyst: 5 },
  connector: { innovator: 3, architect: 3, catalyst: 5, strategist: 4, connector: 4, guardian: 5, explorer: 4, stabilizer: 5, visionary: 3, harmonizer: 5, achiever: 4, analyst: 2 },
  guardian: { innovator: 2, architect: 4, catalyst: 3, strategist: 5, connector: 5, guardian: 4, explorer: 2, stabilizer: 5, visionary: 3, harmonizer: 5, achiever: 4, analyst: 4 },
  explorer: { innovator: 5, architect: 3, catalyst: 5, strategist: 2, connector: 4, guardian: 2, explorer: 4, stabilizer: 3, visionary: 4, harmonizer: 3, achiever: 4, analyst: 3 },
  stabilizer: { innovator: 3, architect: 4, catalyst: 4, strategist: 5, connector: 5, guardian: 5, explorer: 3, stabilizer: 4, visionary: 4, harmonizer: 5, achiever: 4, analyst: 4 },
  visionary: { innovator: 5, architect: 5, catalyst: 4, strategist: 4, connector: 3, guardian: 3, explorer: 4, stabilizer: 4, visionary: 4, harmonizer: 3, achiever: 5, analyst: 4 },
  harmonizer: { innovator: 3, architect: 3, catalyst: 4, strategist: 4, connector: 5, guardian: 5, explorer: 3, stabilizer: 5, visionary: 3, harmonizer: 4, achiever: 3, analyst: 3 },
  achiever: { innovator: 4, architect: 4, catalyst: 5, strategist: 5, connector: 4, guardian: 4, explorer: 4, stabilizer: 4, visionary: 5, harmonizer: 3, achiever: 4, analyst: 4 },
  analyst: { innovator: 4, architect: 5, catalyst: 2, strategist: 5, connector: 2, guardian: 4, explorer: 3, stabilizer: 4, visionary: 4, harmonizer: 3, achiever: 4, analyst: 4 },
};

function getCompatibilityColor(score: number): string {
  if (score >= 5) return "#10b981"; // Green
  if (score >= 4) return "#22c55e"; // Light green
  if (score >= 3) return "#eab308"; // Yellow
  if (score >= 2) return "#f97316"; // Orange
  return "#ef4444"; // Red
}

function getCompatibilityLabel(score: number): string {
  if (score >= 5) return "Excellent";
  if (score >= 4) return "Good";
  if (score >= 3) return "Moderate";
  if (score >= 2) return "Challenging";
  return "Difficult";
}

interface CompatibilityHeatmapProps {
  showTitle?: boolean;
  className?: string;
  highlightType?: string;
  onCellClick?: (type1: string, type2: string, score: number) => void;
}

export function CompatibilityHeatmap({
  showTitle = true,
  className = "",
  highlightType,
  onCellClick,
}: CompatibilityHeatmapProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredCell, setHoveredCell] = useState<{ row: string; col: string } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: string; col: string; score: number } | null>(null);

  const archetypeIds = archetypes.map((a) => a.id);
  const archetypeMap = new Map(archetypes.map((a) => [a.id, a]));

  const handleCellClick = (row: string, col: string) => {
    const score = compatibilityMatrix[row]?.[col] || 3;
    setSelectedCell({ row, col, score });
    onCellClick?.(row, col, score);
  };

  const content = (
    <div ref={ref} className={`space-y-4 ${className}`}>
      {/* Hint for mobile users */}
      <p className="text-xs text-muted-foreground text-center sm:hidden">
        Scroll horizontally to view full matrix →
      </p>
      
      {/* Grid */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-block">
          {/* Header row */}
          <div className="flex">
            <div className="w-7 h-7 sm:w-10 sm:h-10 flex-shrink-0" /> {/* Corner spacer */}
            {archetypeIds.map((id, index) => {
              const archetype = archetypeMap.get(id);
              const isHighlighted = highlightType === id || hoveredCell?.col === id;
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.02 }}
                  className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg flex-shrink-0
                    ${isHighlighted ? "bg-primary/10 rounded-t-lg" : ""}`}
                  title={archetype?.name}
                >
                  {archetype?.icon}
                </motion.div>
              );
            })}
          </div>

          {/* Data rows */}
          {archetypeIds.map((rowId, rowIndex) => {
            const rowArchetype = archetypeMap.get(rowId);
            const isRowHighlighted = highlightType === rowId || hoveredCell?.row === rowId;
            
            return (
              <div key={rowId} className="flex">
                {/* Row header */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: rowIndex * 0.02 }}
                  className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg flex-shrink-0
                    ${isRowHighlighted ? "bg-primary/10 rounded-l-lg" : ""}`}
                  title={rowArchetype?.name}
                >
                  {rowArchetype?.icon}
                </motion.div>

                {/* Cells */}
                {archetypeIds.map((colId, colIndex) => {
                  const score = compatibilityMatrix[rowId]?.[colId] || 3;
                  const color = getCompatibilityColor(score);
                  const isHovered = hoveredCell?.row === rowId && hoveredCell?.col === colId;
                  const isSelected = selectedCell?.row === rowId && selectedCell?.col === colId;
                  const isInHighlightedRowOrCol = 
                    highlightType === rowId || highlightType === colId ||
                    hoveredCell?.row === rowId || hoveredCell?.col === colId;

                  return (
                    <motion.div
                      key={`${rowId}-${colId}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: (rowIndex + colIndex) * 0.01 }}
                      className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center text-[10px] sm:text-xs font-medium
                        cursor-pointer transition-all duration-150 flex-shrink-0
                        ${isHovered || isSelected ? "ring-2 ring-primary z-10" : ""}
                        ${isInHighlightedRowOrCol && !isHovered ? "opacity-100" : ""}
                        ${!isInHighlightedRowOrCol && highlightType ? "opacity-40" : ""}`}
                      style={{
                        backgroundColor: color,
                        opacity: isInHighlightedRowOrCol || !highlightType ? undefined : 0.4,
                      }}
                      onMouseEnter={() => setHoveredCell({ row: rowId, col: colId })}
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => handleCellClick(rowId, colId)}
                    >
                      <span className="text-white font-bold drop-shadow-sm">
                        {score}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Cell Info */}
      {selectedCell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-4 rounded-xl border border-border/50 bg-card/80"
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">{archetypeMap.get(selectedCell.row)?.icon}</span>
              <span className="font-medium text-sm sm:text-base">{archetypeMap.get(selectedCell.row)?.name}</span>
            </div>
            <span className="text-muted-foreground hidden sm:inline">+</span>
            <span className="text-muted-foreground sm:hidden text-xs">×</span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">{archetypeMap.get(selectedCell.col)?.icon}</span>
              <span className="font-medium text-sm sm:text-base">{archetypeMap.get(selectedCell.col)?.name}</span>
            </div>
            <div className="sm:ml-auto flex items-center gap-2 mt-2 sm:mt-0">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: getCompatibilityColor(selectedCell.score) }}
              >
                {selectedCell.score}
              </div>
              <span className="text-xs sm:text-sm font-medium">
                {getCompatibilityLabel(selectedCell.score)}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 text-xs">
        {[5, 4, 3, 2, 1].map((score) => (
          <div key={score} className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getCompatibilityColor(score) }}
            />
            <span className="text-muted-foreground">
              {score} - {getCompatibilityLabel(score)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Archetype Compatibility Matrix</CardTitle>
          <CardDescription>
            Click on a cell to see compatibility details between two types
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default CompatibilityHeatmap;

