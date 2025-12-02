"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Share2, 
  Download,
  Briefcase,
  Heart,
  Star,
  TrendingUp,
  Zap,
  UserPlus,
  MessageSquare
} from "lucide-react";
import { calculateArchetype } from "@/lib/archetypes";
import { PersonalityRadarChart } from "./RadarChart";
import { RandomFrameworkReveal } from "./RandomFrameworkReveal";
import { SimpleJobAnalysis } from "./SimpleJobAnalysis";
import { ShareableInfographic } from "./ShareableInfographic";
import { FamousExamplesGrid } from "@/components/personality/FamousExamplesGrid";
import type { DimensionScore, FrameworkMappings } from "@/types";
import Link from "next/link";
import { useState } from "react";

interface FreeResultsViewProps {
  scores: DimensionScore[];
  sessionId: string;
  frameworks?: FrameworkMappings;
}

export function FreeResultsView({ scores, sessionId, frameworks }: FreeResultsViewProps) {
  const { primary, matchPercentage, secondary } = calculateArchetype(scores);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Get top 3 and bottom 3 dimensions
  const sortedScores = [...scores].sort((a, b) => b.percentile - a.percentile);
  const topDimensions = sortedScores.slice(0, 3);
  const growthDimensions = sortedScores.slice(-3).reverse();

  const dimensionLabels: Record<string, string> = {
    openness: "Openness",
    conscientiousness: "Conscientiousness",
    extraversion: "Extraversion",
    agreeableness: "Agreeableness",
    emotionalResilience: "Emotional Resilience",
    honestyHumility: "Honesty-Humility",
    adaptability: "Adaptability",
  };

  const dimensionDescriptions: Record<string, { high: string; low: string }> = {
    openness: {
      high: "You embrace new experiences and creative thinking",
      low: "You prefer familiar approaches and practical solutions"
    },
    conscientiousness: {
      high: "You're organized, disciplined, and goal-oriented",
      low: "You're flexible, spontaneous, and adaptable"
    },
    extraversion: {
      high: "You're energized by social interaction and activity",
      low: "You recharge through solitude and reflection"
    },
    agreeableness: {
      high: "You prioritize harmony and cooperation",
      low: "You're direct, competitive, and independent"
    },
    emotionalResilience: {
      high: "You stay calm under pressure and handle stress well",
      low: "You experience emotions deeply and are sensitive to stress"
    },
    honestyHumility: {
      high: "You value authenticity, fairness, and modesty",
      low: "You're confident, ambitious, and results-focused"
    },
    adaptability: {
      high: "You thrive in change and embrace new situations",
      low: "You prefer stability and consistent routines"
    },
  };

  return (
    <div className="space-y-8">
      {/* Primary Archetype - Full Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className={`rounded-2xl border-2 border-border/50 bg-gradient-to-br ${primary.color} shadow-xl overflow-hidden relative`}>
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm" />
          <CardHeader className="relative z-10 pb-4">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
                    Your Personality Type
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {primary.rarity}% of population
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{primary.icon}</span>
                  <div>
                    <CardTitle className="text-4xl md:text-5xl font-bold mb-1">
                      {primary.name}
                    </CardTitle>
                    <CardDescription className="text-lg md:text-xl text-muted-foreground font-medium">
                      {primary.tagline}
                    </CardDescription>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {matchPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Match</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            {/* Full Description */}
            <div className="space-y-3">
              {primary.description.map((paragraph, index) => (
                <motion.p 
                  key={index} 
                  className="text-base md:text-lg leading-relaxed text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Strengths & Growth Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                className="rounded-xl border border-border/50 bg-green-500/5 p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-green-600" />
                  <h3 className="text-xl font-bold">Your Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {primary.strengths.slice(0, 5).map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm md:text-base">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-muted-foreground">{strength}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                className="rounded-xl border border-border/50 bg-amber-500/5 p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  <h3 className="text-xl font-bold">Growth Areas</h3>
                </div>
                <ul className="space-y-2">
                  {primary.growthAreas.slice(0, 5).map((area, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm md:text-base">
                      <span className="text-amber-600 mt-1">→</span>
                      <span className="text-muted-foreground">{area}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Famous Examples */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-bold">Famous People Like You</h3>
              </div>
              <FamousExamplesGrid 
                examples={primary.famousExamples}
                typeName={primary.name.replace("The ", "")}
                variant="compact"
                maxVisible={6}
                colorAccent="yellow"
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Secondary Types */}
      {secondary.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">You Also Have Traits Of...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {secondary.map((item) => (
                  <div
                    key={item.archetype.id}
                    className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-4 py-3"
                  >
                    <span className="text-xl">{item.archetype.icon}</span>
                    <div>
                      <span className="font-semibold">{item.archetype.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">{item.matchPercentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Full Dimensional Profile with Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold">Your PRISM-7 Profile</CardTitle>
            <CardDescription>
              Your complete dimensional breakdown across all 7 personality factors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Radar Chart */}
            <div className="h-[400px] w-full">
              <PersonalityRadarChart scores={scores} />
            </div>

            {/* All 7 Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scores.map((score, index) => (
                <motion.div
                  key={score.dimension}
                  className="rounded-xl border border-border/50 bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-foreground">
                      {dimensionLabels[score.dimension]}
                    </div>
                    <div className="text-xl font-bold text-primary">{score.percentile}%</div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${score.percentile}%` }}
                      transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {score.percentile > 50 
                      ? dimensionDescriptions[score.dimension]?.high 
                      : dimensionDescriptions[score.dimension]?.low}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Random Framework Reveal (ONE framework shown) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <RandomFrameworkReveal scores={scores} frameworks={frameworks} sessionId={sessionId} />
      </motion.div>

      {/* Simple Job Analysis (Top 3 Careers) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <SimpleJobAnalysis archetype={primary} scores={scores} />
      </motion.div>

      {/* Work Style Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Your Work Style</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{primary.workStyle}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shareable Infographic Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <ShareableInfographic 
          archetype={primary} 
          scores={scores} 
          sessionId={sessionId}
        />
      </motion.div>

      {/* Compatibility CTA - Viral Hook */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Check Your Compatibility</h3>
                <p className="text-muted-foreground mb-4">
                  Send this to a friend, partner, or colleague and discover how compatible you are! 
                  See your communication styles, potential conflicts, and how to work better together.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button size="lg" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Invite Someone to Compare
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Challenge: Guess My Type
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium Upgrade CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="rounded-2xl border-2 border-dashed border-primary/50 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  Go Deeper with Premium
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Unlock your complete personality analysis
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">All Framework Mappings</div>
                  <div className="text-sm text-muted-foreground">
                    MBTI, DISC, and Enneagram with detailed breakdowns
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                <Briefcase className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">15+ Career Matches</div>
                  <div className="text-sm text-muted-foreground">
                    Detailed job fits with salary ranges
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Full Compatibility</div>
                  <div className="text-sm text-muted-foreground">
                    Work, romantic, friendship, and parenting modes
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Dark Triad Analysis</div>
                  <div className="text-sm text-muted-foreground">
                    Understand your shadow side
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">30-Day Growth Plan</div>
                  <div className="text-sm text-muted-foreground">
                    Personalized development challenges
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                <Download className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">PDF Export</div>
                  <div className="text-sm text-muted-foreground">
                    Professional report to share
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild size="lg" className="flex-1">
                <Link href="/pricing">
                  Unlock Premium - $14.99
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href={`/referrals?session=${sessionId}`}>
                  Unlock Free via Referrals
                  <Users className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
