"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles, ArrowRight, Users } from "lucide-react";
import { calculateArchetype } from "@/lib/archetypes";
import type { DimensionScore } from "@/types";
import Link from "next/link";

interface FreeResultsViewProps {
  scores: DimensionScore[];
  sessionId: string;
}

export function FreeResultsView({ scores, sessionId }: FreeResultsViewProps) {
  const { primary, matchPercentage } = calculateArchetype(scores);
  
  // Get top 3 dimensions by percentile
  const topDimensions = [...scores]
    .sort((a, b) => b.percentile - a.percentile)
    .slice(0, 3);

  const dimensionLabels: Record<string, string> = {
    openness: "Openness",
    conscientiousness: "Conscientiousness",
    extraversion: "Extraversion",
    agreeableness: "Agreeableness",
    emotionalResilience: "Emotional Resilience",
    honestyHumility: "Honesty-Humility",
    adaptability: "Adaptability",
  };

  return (
    <div className="space-y-8">
      {/* Personality Type - Always Shown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`rounded-2xl border-2 border-border/50 bg-gradient-to-br ${primary.color} shadow-xl overflow-hidden`}>
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm" />
          <CardHeader className="relative z-10 pb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
                  Your Personality Type
                </Badge>
                <CardTitle className="text-4xl md:text-5xl font-bold mb-2">
                  {primary.name}
                </CardTitle>
                <CardDescription className="text-lg md:text-xl text-muted-foreground font-medium">
                  {primary.tagline}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {matchPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Match</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-base md:text-lg leading-relaxed text-foreground mb-6">
              {primary.description[0]}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Dimensions Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold">Your Top Traits</CardTitle>
            <CardDescription>
              Here are your strongest personality dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {topDimensions.map((score, index) => (
                <div
                  key={score.dimension}
                  className="rounded-xl border border-border/50 bg-muted/30 p-4"
                >
                  <div className="text-sm text-muted-foreground mb-1">
                    {dimensionLabels[score.dimension]}
                  </div>
                  <div className="text-2xl font-bold mb-2">{score.percentile}%</div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${score.percentile}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="rounded-2xl border-2 border-dashed border-primary/50 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  Unlock Your Full Profile
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  See your complete 7-dimension profile, detailed insights, and personalized recommendations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Complete Dimensional Scores</div>
                  <div className="text-sm text-muted-foreground">
                    All 7 dimensions with confidence intervals
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Detailed Insights</div>
                  <div className="text-sm text-muted-foreground">
                    Career, relationship, and growth recommendations
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="flex-1">
                <Link href="/pricing">
                  Upgrade to Premium
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href={`/referrals?session=${sessionId}`}>
                  Unlock via Referrals
                  <Users className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <p className="text-sm text-center text-muted-foreground">
              💡 Tip: Share your assessment with 3 friends to unlock premium features for free!
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Blurred Preview Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative"
      >
        <div className="blur-sm pointer-events-none select-none">
          <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Full Dimensional Profile</CardTitle>
              <CardDescription>
                Complete breakdown of all 7 personality dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scores.map((score) => (
                  <div
                    key={score.dimension}
                    className="rounded-xl border border-border/50 bg-muted/30 p-4"
                  >
                    <div className="text-sm text-muted-foreground mb-1">
                      {dimensionLabels[score.dimension]}
                    </div>
                    <div className="text-2xl font-bold mb-2">{score.percentile}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-center">Premium Feature</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

