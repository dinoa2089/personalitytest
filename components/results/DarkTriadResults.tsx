"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Briefcase,
  Heart,
  Eye
} from "lucide-react";
import { FeatureGate } from "@/components/premium/FeatureGate";
import { 
  calculateDarkTriadScores, 
  traitDefinitions,
  type DarkTriadProfile 
} from "@/lib/dark-triad";
import type { DimensionScore } from "@/types";

interface DarkTriadResultsProps {
  scores: DimensionScore[];
  extendedResponses?: Record<string, number>;
}

const levelColors = {
  low: "text-green-600 bg-green-500/20 border-green-500/30",
  moderate: "text-blue-600 bg-blue-500/20 border-blue-500/30",
  elevated: "text-amber-600 bg-amber-500/20 border-amber-500/30",
};

export function DarkTriadResults({ scores, extendedResponses }: DarkTriadResultsProps) {
  const profile = calculateDarkTriadScores(scores, extendedResponses);

  return (
    <FeatureGate feature="dark_triad">
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-red-500 text-white">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl">Your Shadow Profile</CardTitle>
              <CardDescription>
                Understanding your dark triad traits for self-awareness
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Disclaimer */}
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                This analysis helps you understand natural tendencies that exist on a spectrum in everyone. 
                It's not a clinical assessment. These traits can be strengths when channeled appropriately.
              </p>
            </div>
          </div>

          {/* Overall Shadow Index */}
          <div className="text-center py-4">
            <div className="text-5xl font-bold text-primary mb-2">
              {profile.overallShadowIndex}%
            </div>
            <p className="text-sm text-muted-foreground">
              Overall Shadow Index
              {profile.dominantTrait && (
                <span> • Dominant: {traitDefinitions[profile.dominantTrait].name}</span>
              )}
            </p>
          </div>

          {/* Individual Traits */}
          <div className="space-y-4">
            {profile.scores.map((score, index) => {
              const def = traitDefinitions[score.trait];
              const description = score.level === "elevated" 
                ? def.highDescription 
                : score.level === "moderate" 
                  ? def.moderateDescription 
                  : def.lowDescription;

              return (
                <motion.div
                  key={score.trait}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl bg-gradient-to-r ${def.color} p-0.5`}
                >
                  <div className="rounded-[10px] bg-background p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{def.icon}</span>
                        <div>
                          <h4 className="font-bold text-lg">{def.name}</h4>
                          <p className="text-xs text-muted-foreground">{def.shadowName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{score.score}%</div>
                        <Badge variant="outline" className={levelColors[score.level]}>
                          {score.level}
                        </Badge>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full bg-muted rounded-full h-2 mb-4">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${def.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score.score}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {description}
                    </p>

                    {/* Strengths & Watch Areas */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          Potential Strengths
                        </div>
                        <ul className="space-y-1">
                          {def.strengths.slice(0, 2).map((s, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                              <span className="text-green-600">+</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {score.level !== "low" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
                            <AlertTriangle className="h-3 w-3" />
                            Watch Areas
                          </div>
                          <ul className="space-y-1">
                            {def.watchAreas.slice(0, 2).map((w, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                                <span className="text-amber-600">!</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Insights */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">In the Workplace</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {profile.insights.inWorkplace}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">In Relationships</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {profile.insights.inRelationships}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Balance Tips */}
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-purple-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Finding Balance</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-green-600 mb-2">Leverage Your Strengths</p>
                <ul className="space-y-1">
                  {profile.insights.strengths.slice(0, 3).map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-600">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              {profile.insights.watchAreas.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-amber-600 mb-2">Areas for Growth</p>
                  <ul className="space-y-1">
                    {profile.insights.watchAreas.slice(0, 3).map((w, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-amber-600">→</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </FeatureGate>
  );
}

