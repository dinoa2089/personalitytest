"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid, List, Users } from "lucide-react";
import type { CompatibilityPair } from "@/lib/team-analysis";
import {
  getCompatibilityColor,
  getCompatibilityBgColor,
} from "@/lib/team-analysis";

interface TeamMember {
  id: string;
  name: string;
}

interface CompatibilityMatrixProps {
  members: TeamMember[];
  compatibility: CompatibilityPair[];
}

type ViewMode = "matrix" | "list";

export function CompatibilityMatrix({
  members,
  compatibility,
}: CompatibilityMatrixProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("matrix");

  // Create a map for quick lookup
  const compatibilityMap = useMemo(() => {
    const map = new Map<string, CompatibilityPair>();
    compatibility.forEach((pair) => {
      const key1 = `${pair.member1.id}-${pair.member2.id}`;
      const key2 = `${pair.member2.id}-${pair.member1.id}`;
      map.set(key1, pair);
      map.set(key2, pair);
    });
    return map;
  }, [compatibility]);

  const getCompatibility = (id1: string, id2: string): CompatibilityPair | undefined => {
    return compatibilityMap.get(`${id1}-${id2}`);
  };

  if (members.length < 2) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Add at least 2 team members to view compatibility.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Compatibility
        </CardTitle>
        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === "matrix" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            onClick={() => setViewMode("matrix")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "matrix" ? (
          <MatrixView
            members={members}
            getCompatibility={getCompatibility}
          />
        ) : (
          <ListView compatibility={compatibility} />
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t flex flex-wrap items-center gap-4 justify-center text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/60" />
            <span>High (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500/60" />
            <span>Good (65-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500/60" />
            <span>Moderate (50-64%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/60" />
            <span>Low (&lt;50%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MatrixView({
  members,
  getCompatibility,
}: {
  members: TeamMember[];
  getCompatibility: (id1: string, id2: string) => CompatibilityPair | undefined;
}) {
  // Show a maximum of 10 members in the matrix view
  const displayMembers = members.slice(0, 10);

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-medium text-muted-foreground">
                &nbsp;
              </th>
              {displayMembers.map((member) => (
                <th
                  key={member.id}
                  className="p-2 text-center text-xs font-medium text-muted-foreground min-w-[60px]"
                >
                  <div className="truncate max-w-[80px]" title={member.name}>
                    {member.name.split(" ")[0]}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayMembers.map((rowMember, rowIndex) => (
              <tr key={rowMember.id}>
                <td className="p-2 text-xs font-medium text-muted-foreground">
                  <div className="truncate max-w-[100px]" title={rowMember.name}>
                    {rowMember.name}
                  </div>
                </td>
                {displayMembers.map((colMember, colIndex) => {
                  if (rowIndex === colIndex) {
                    return (
                      <td key={colMember.id} className="p-2">
                        <div className="w-10 h-10 mx-auto flex items-center justify-center bg-muted rounded-lg">
                          <span className="text-xs text-muted-foreground">—</span>
                        </div>
                      </td>
                    );
                  }

                  const pair = getCompatibility(rowMember.id, colMember.id);
                  const score = pair?.compatibility ?? 50;
                  const cellColor = getCellColor(score);

                  return (
                    <td key={colMember.id} className="p-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              delay: (rowIndex * displayMembers.length + colIndex) * 0.02,
                            }}
                            className={`
                              w-10 h-10 mx-auto flex items-center justify-center 
                              rounded-lg cursor-help font-medium text-sm
                              ${cellColor}
                            `}
                          >
                            {score}
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {rowMember.name} & {colMember.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {pair?.dynamics || "Compatibility analysis"}
                            </p>
                            <Badge variant="outline" className={getCompatibilityColor(score)}>
                              {score}% Compatible
                            </Badge>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {members.length > 10 && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Showing first 10 members. Switch to list view to see all pairs.
        </p>
      )}
    </TooltipProvider>
  );
}

function ListView({ compatibility }: { compatibility: CompatibilityPair[] }) {
  // Show top and bottom pairs
  const topPairs = compatibility.slice(0, 5);
  const bottomPairs = compatibility.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Strongest Connections */}
      <div>
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Strongest Connections
        </h4>
        <div className="space-y-2">
          {topPairs.map((pair, index) => (
            <motion.div
              key={`${pair.member1.id}-${pair.member2.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${getCompatibilityBgColor(pair.compatibility)}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">{pair.member1.name}</span>
                <span className="text-muted-foreground">↔</span>
                <span className="font-medium text-sm">{pair.member2.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {pair.dynamics}
                </span>
                <Badge
                  variant="outline"
                  className={getCompatibilityColor(pair.compatibility)}
                >
                  {pair.compatibility}%
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Areas for Development */}
      {bottomPairs.some((p) => p.compatibility < 65) && (
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Areas for Development
          </h4>
          <div className="space-y-2">
            {bottomPairs
              .filter((p) => p.compatibility < 65)
              .map((pair, index) => (
                <motion.div
                  key={`${pair.member1.id}-${pair.member2.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.25 }}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border
                    ${getCompatibilityBgColor(pair.compatibility)}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{pair.member1.name}</span>
                    <span className="text-muted-foreground">↔</span>
                    <span className="font-medium text-sm">{pair.member2.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {pair.dynamics}
                    </span>
                    <Badge
                      variant="outline"
                      className={getCompatibilityColor(pair.compatibility)}
                    >
                      {pair.compatibility}%
                    </Badge>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getCellColor(score: number): string {
  if (score >= 80) return "bg-green-500/60 text-green-50";
  if (score >= 65) return "bg-blue-500/60 text-blue-50";
  if (score >= 50) return "bg-amber-500/60 text-amber-50";
  return "bg-red-500/60 text-red-50";
}


