"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Heart,
  Briefcase,
  UserPlus,
  Baby,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ChevronRight
} from "lucide-react";
import { FeatureGate } from "@/components/premium/FeatureGate";
import { 
  calculateCompatibility, 
  getAllModes, 
  type CompatibilityMode,
  type CompatibilityResult 
} from "@/lib/compatibility";
import type { DimensionScore } from "@/types";
import type { Archetype } from "@/lib/archetypes";

interface FullCompatibilityReportProps {
  myScores: DimensionScore[];
  myArchetype: Archetype;
  partnerScores: DimensionScore[];
  partnerArchetype: Archetype;
  partnerName?: string;
}

const modeIcons: Record<CompatibilityMode, React.ComponentType<{ className?: string }>> = {
  work: Briefcase,
  romantic: Heart,
  friendship: Users,
  parent: UserPlus,
  child: Baby,
};

const modeColors: Record<CompatibilityMode, string> = {
  work: "from-blue-500 to-indigo-500",
  romantic: "from-pink-500 to-rose-500",
  friendship: "from-green-500 to-emerald-500",
  parent: "from-purple-500 to-violet-500",
  child: "from-amber-500 to-orange-500",
};

const modeDescriptions: Record<CompatibilityMode, string> = {
  work: "How well you collaborate professionally, handle projects, and support each other's careers",
  romantic: "Your romantic and intimate compatibility, communication styles, and long-term potential",
  friendship: "How well you connect as friends, shared interests, and social dynamics",
  parent: "Your parenting style compatibility if you're raising children together",
  child: "How your personality dynamics work in a parent-child relationship",
};

export function FullCompatibilityReport({ 
  myScores, 
  myArchetype,
  partnerScores, 
  partnerArchetype,
  partnerName = "Your Partner"
}: FullCompatibilityReportProps) {
  const [selectedMode, setSelectedMode] = useState<CompatibilityMode>("work");
  const modes = getAllModes();
  
  // Calculate compatibility for all modes
  const results: Record<CompatibilityMode, CompatibilityResult> = {
    work: calculateCompatibility(myScores, partnerScores, "work"),
    romantic: calculateCompatibility(myScores, partnerScores, "romantic"),
    friendship: calculateCompatibility(myScores, partnerScores, "friendship"),
    parent: calculateCompatibility(myScores, partnerScores, "parent"),
    child: calculateCompatibility(myScores, partnerScores, "child"),
  };

  const currentResult = results[selectedMode];
  const Icon = modeIcons[selectedMode];
  const overallAverage = Math.round(
    Object.values(results).reduce((sum, r) => sum + r.overallScore, 0) / 5
  );

  return (
    <FeatureGate feature="full_compatibility">
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex -space-x-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xl font-bold border-2 border-background">
                {myArchetype.icon}
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xl font-bold border-2 border-background">
                {partnerArchetype.icon}
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Compatibility Report</CardTitle>
              <CardDescription>
                {myArchetype.name} + {partnerArchetype.name}
              </CardDescription>
            </div>
            <div className="ml-auto text-right">
              <div className="text-3xl font-bold text-primary">{overallAverage}%</div>
              <div className="text-sm text-muted-foreground">Overall Match</div>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex flex-wrap gap-2">
            {modes.map(({ mode, title }) => {
              const ModeIcon = modeIcons[mode];
              return (
                <Button
                  key={mode}
                  variant={selectedMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMode(mode)}
                  className="gap-2"
                >
                  <ModeIcon className="h-4 w-4" />
                  {title}
                  <Badge variant="secondary" className="ml-1">
                    {results[mode].overallScore}%
                  </Badge>
                </Button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Selected Mode Header */}
          <motion.div
            key={selectedMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl bg-gradient-to-br ${modeColors[selectedMode]} p-1`}
          >
            <div className="rounded-lg bg-background/95 p-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${modeColors[selectedMode]} flex items-center justify-center text-white`}>
                  <Icon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {modes.find(m => m.mode === selectedMode)?.title} Compatibility
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {modeDescriptions[selectedMode]}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">
                    {currentResult.overallScore}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Dimensional Breakdown
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {currentResult.categories.map((category) => (
                <div
                  key={category.name}
                  className="rounded-lg border border-border/50 bg-muted/30 p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{category.name}</span>
                    <Badge 
                      variant="outline"
                      className={
                        category.score >= 80 ? "text-green-600 border-green-600/30" :
                        category.score >= 60 ? "text-blue-600 border-blue-600/30" :
                        "text-amber-600 border-amber-600/30"
                      }
                    >
                      {category.score}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        category.score >= 80 ? "bg-green-500" :
                        category.score >= 60 ? "bg-blue-500" :
                        "bg-amber-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${category.score}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Challenges */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/50 bg-green-500/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold">What Works Between You</h4>
              </div>
              <ul className="space-y-3">
                {currentResult.strengths.map((strength, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-muted-foreground">{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border/50 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold">Where You'll Challenge Each Other</h4>
              </div>
              <ul className="space-y-3">
                {currentResult.challenges.map((challenge, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-amber-600 mt-0.5">!</span>
                    <span className="text-muted-foreground">{challenge}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-purple-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Tips for This Relationship</h4>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {currentResult.tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Communication Styles */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/50 bg-muted/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{myArchetype.icon}</span>
                <span className="font-semibold">Your Style</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {myArchetype.communicationStyle}
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-muted/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{partnerArchetype.icon}</span>
                <span className="font-semibold">{partnerName}'s Style</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {partnerArchetype.communicationStyle}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </FeatureGate>
  );
}

