"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Target, 
  Lightbulb, 
  Users, 
  Heart, 
  Shield, 
  Shuffle,
  ChevronDown,
  ChevronUp,
  Pencil,
  Check,
  X,
  Sparkles
} from "lucide-react";

interface DimensionAnalysis {
  target: number;
  weight: number;
  reasoning: string;
}

interface Dimensions {
  openness: DimensionAnalysis;
  conscientiousness: DimensionAnalysis;
  extraversion: DimensionAnalysis;
  agreeableness: DimensionAnalysis;
  emotionalResilience: DimensionAnalysis;
  honestyHumility: DimensionAnalysis;
  adaptability: DimensionAnalysis;
}

interface Props {
  analysis: {
    title: string;
    dimensions: Dimensions;
    keyPhrases: string[];
    overallReasoning: string;
  };
  editable?: boolean;
  onUpdate?: (dimensions: Dimensions) => void;
}

const dimensionConfig: Record<
  keyof Dimensions,
  { label: string; icon: React.ReactNode; color: string; gradient: string }
> = {
  openness: {
    label: "Openness",
    icon: <Lightbulb className="h-4 w-4" />,
    color: "text-purple-500",
    gradient: "from-purple-500 to-violet-500",
  },
  conscientiousness: {
    label: "Conscientiousness",
    icon: <Target className="h-4 w-4" />,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
  },
  extraversion: {
    label: "Extraversion",
    icon: <Users className="h-4 w-4" />,
    color: "text-amber-500",
    gradient: "from-amber-500 to-orange-500",
  },
  agreeableness: {
    label: "Agreeableness",
    icon: <Heart className="h-4 w-4" />,
    color: "text-pink-500",
    gradient: "from-pink-500 to-rose-500",
  },
  emotionalResilience: {
    label: "Emotional Resilience",
    icon: <Shield className="h-4 w-4" />,
    color: "text-emerald-500",
    gradient: "from-emerald-500 to-green-500",
  },
  honestyHumility: {
    label: "Honesty-Humility",
    icon: <Brain className="h-4 w-4" />,
    color: "text-sky-500",
    gradient: "from-sky-500 to-blue-500",
  },
  adaptability: {
    label: "Adaptability",
    icon: <Shuffle className="h-4 w-4" />,
    color: "text-orange-500",
    gradient: "from-orange-500 to-red-500",
  },
};

export function JobProfileDisplay({ analysis, editable = false, onUpdate }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedDimensions, setEditedDimensions] = useState<Dimensions>(analysis.dimensions);

  const handleSaveEdit = () => {
    if (onUpdate) {
      onUpdate(editedDimensions);
    }
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedDimensions(analysis.dimensions);
    setEditing(false);
  };

  const updateDimension = (key: keyof Dimensions, field: "target" | "weight", value: number) => {
    setEditedDimensions((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const currentDimensions = editing ? editedDimensions : analysis.dimensions;

  // Sort dimensions by weight (most critical first)
  const sortedDimensions = Object.entries(currentDimensions).sort(
    ([, a], [, b]) => b.weight - a.weight
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-amber-500" />
              {analysis.title}
            </CardTitle>
            <CardDescription className="mt-2 max-w-2xl">
              {analysis.overallReasoning}
            </CardDescription>
          </div>
          {editable && !editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="h-3 w-3 mr-2" />
              Edit
            </Button>
          )}
          {editing && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="h-3 w-3 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                <Check className="h-3 w-3 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Key phrases */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Key Indicators</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.keyPhrases.map((phrase, i) => (
              <Badge key={i} variant="secondary" className="bg-muted/50">
                {phrase}
              </Badge>
            ))}
          </div>
        </div>

        {/* Dimension bars */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            Personality Requirements
            {editing && <span className="text-amber-500 ml-2">(editing)</span>}
          </h4>
          
          {sortedDimensions.map(([key, dim], index) => {
            const config = dimensionConfig[key as keyof Dimensions];
            const isExpanded = expanded === key;
            const isCritical = dim.weight > 1.2;
            const isLessImportant = dim.weight < 0.8;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2"
              >
                <div
                  className={`flex justify-between items-center cursor-pointer hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors ${
                    isExpanded ? "bg-muted/50" : ""
                  }`}
                  onClick={() => setExpanded(isExpanded ? null : key)}
                >
                  <div className="flex items-center gap-2">
                    <span className={config.color}>{config.icon}</span>
                    <span className="font-medium">{config.label}</span>
                    {isCritical && (
                      <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                        Critical
                      </Badge>
                    )}
                    {isLessImportant && (
                      <Badge variant="outline" className="text-xs opacity-60">
                        Less Important
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={`bg-gradient-to-r ${config.gradient} text-white`}
                    >
                      {dim.target}%
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.target}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-4 pl-6 space-y-3">
                        <p className="text-sm text-muted-foreground">{dim.reasoning}</p>

                        {editing && (
                          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Target Score</span>
                                <span className="font-mono">
                                  {editedDimensions[key as keyof Dimensions].target}%
                                </span>
                              </div>
                              <Slider
                                value={[editedDimensions[key as keyof Dimensions].target]}
                                onValueChange={([v]) =>
                                  updateDimension(key as keyof Dimensions, "target", v)
                                }
                                min={0}
                                max={100}
                                step={5}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Importance Weight</span>
                                <span className="font-mono">
                                  {editedDimensions[key as keyof Dimensions].weight.toFixed(1)}x
                                </span>
                              </div>
                              <Slider
                                value={[editedDimensions[key as keyof Dimensions].weight * 10]}
                                onValueChange={([v]) =>
                                  updateDimension(key as keyof Dimensions, "weight", v / 10)
                                }
                                min={5}
                                max={15}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}

                        {!editing && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Weight:{" "}
                              <span className="font-medium text-foreground">
                                {dim.weight.toFixed(1)}x
                              </span>
                            </span>
                            <span>
                              Ideal Range:{" "}
                              <span className="font-medium text-foreground">
                                {Math.max(0, dim.target - 15)}% - {Math.min(100, dim.target + 15)}%
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

