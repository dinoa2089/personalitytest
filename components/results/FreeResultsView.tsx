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
  Download,
  Briefcase,
  TrendingUp,
  Zap,
  UserPlus,
  MessageSquare,
  ChevronDown,
  Heart,
  Layers,
  Crown,
} from "lucide-react";
import { calculateArchetype } from "@/lib/archetypes";
import { PersonalityRadarChart } from "./RadarChart";
import { PersonalityConstellation } from "./PersonalityConstellation";
import { SimpleJobAnalysis } from "./SimpleJobAnalysis";
import { ShareableInfographic } from "./ShareableInfographic";
import { ExploreYourType } from "./ExploreYourType";
import { PersonalizedContent } from "./PersonalizedContent";
import { JourneyNavigator } from "./JourneyNavigator";
import { PersonalizedEmailCapture } from "./PersonalizedEmailCapture";
import { FamousExamplesGrid } from "@/components/personality/FamousExamplesGrid";
import { CompactMarkdown } from "@/components/ui/markdown-text";
import { FeatureUpsell, FullUnlockBanner } from "@/components/pricing/FeatureUpsell";
import type { DimensionScore } from "@/types";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

interface FreeResultsViewProps {
  scores: DimensionScore[];
  sessionId: string;
}

export function FreeResultsView({ scores, sessionId }: FreeResultsViewProps) {
  const { primary } = calculateArchetype(scores);
  const { user } = useUser();
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  const handlePurchase = async (productKey: string) => {
    if (!user?.id) {
      toast.error("Please sign in to purchase");
      return;
    }

    setPurchaseLoading(productKey);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: productKey,
          userId: user.id,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout");
    } finally {
      setPurchaseLoading(null);
    }
  };

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

  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  return (
    <div className="space-y-8">
      {/* Personality Constellation - All Frameworks Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PersonalityConstellation scores={scores} sessionId={sessionId} />
      </motion.div>

      {/* Explore Your Type - Deep Dive Link */}
      <ExploreYourType archetype={primary} />

      {/* Famous Examples - Pulled out for better visibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/10 to-fuchsia-950/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-xl">Famous People Like You</CardTitle>
            </div>
            <CardDescription>
              These well-known figures share your {primary.name} personality profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FamousExamplesGrid 
              examples={primary.famousExamples}
              typeName={primary.name.replace("The ", "")}
              variant="compact"
              maxVisible={8}
              colorAccent="yellow"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Dimensional Profile with Radar Chart - Collapsible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardHeader 
            className="cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold">Your Dimensional Profile</CardTitle>
                <CardDescription>
                  Your complete PRISM-7 breakdown across all 7 personality factors
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronDown className={`h-5 w-5 transition-transform ${showDetailedBreakdown ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          
          {showDetailedBreakdown && (
            <CardContent className="space-y-6 pt-0">
              {/* Radar Chart */}
              <div className="h-[350px] w-full">
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
                    transition={{ delay: index * 0.05 }}
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
                        transition={{ delay: index * 0.05, duration: 0.5 }}
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
          )}
          
          {!showDetailedBreakdown && (
            <CardContent className="pt-0">
              {/* Quick Preview */}
              <div className="flex flex-wrap gap-3">
                {scores.slice(0, 4).map((score) => (
                  <div key={score.dimension} className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">{dimensionLabels[score.dimension]}</span>
                    <Badge variant={score.percentile > 60 ? "default" : score.percentile < 40 ? "secondary" : "outline"}>
                      {score.percentile}%
                    </Badge>
                  </div>
                ))}
                <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground text-sm">
                  +{scores.length - 4} more dimensions
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Simple Job Analysis (Top 3 Careers) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <SimpleJobAnalysis archetype={primary} scores={scores} />
      </motion.div>

      {/* Career Deep Dive Upsell */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <FeatureUpsell
          title="See All 15+ Career Matches"
          description="Including salary ranges, growth trends, and personalized interview tips for each role"
          price="$3.99"
          productKey="career"
          icon={Briefcase}
          onPurchase={handlePurchase}
          loading={purchaseLoading === "career"}
          accentColor="blue"
        />
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
            <CompactMarkdown>{primary.workStyle}</CompactMarkdown>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personalized Content Recommendations */}
      <PersonalizedContent archetype={primary} scores={scores} />

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

      {/* Journey Navigator - What's Next */}
      <JourneyNavigator archetype={primary} sessionId={sessionId} />

      {/* Compatibility CTA - Viral Hook */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="rounded-2xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-950/20 to-rose-950/20 overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl" />
          <CardContent className="p-8 relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20">
                <Users className="h-8 w-8 text-pink-400" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Check Your Compatibility</h3>
                <p className="text-muted-foreground mb-4">
                  Send this to a friend, partner, or colleague and discover how compatible you are! 
                  See your communication styles, potential conflicts, and how to work better together.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 border-0">
                    <UserPlus className="h-4 w-4" />
                    Invite Someone to Compare
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2 border-pink-500/30 hover:bg-pink-500/10">
                    <MessageSquare className="h-4 w-4" />
                    Challenge: Guess My Type
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Compatibility Report Upsell */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.92 }}
      >
        <FeatureUpsell
          title="Unlock Full Compatibility Details"
          description="Get detailed relationship insights, communication tips, and conflict resolution strategies"
          price="$2.99"
          productKey="compatibility"
          icon={Heart}
          onPurchase={handlePurchase}
          loading={purchaseLoading === "compatibility"}
          variant="compact"
          accentColor="pink"
        />
      </motion.div>

      {/* Personalized Email Capture */}
      <PersonalizedEmailCapture archetype={primary} />

      {/* Micro-Transaction Upgrade Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="space-y-4"
      >
        {/* Full Unlock Banner */}
        <FullUnlockBanner
          onPurchase={handlePurchase}
          loading={purchaseLoading === "full_unlock"}
        />

        {/* Individual Options Card */}
        <Card className="rounded-2xl border border-slate-800 bg-slate-900/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <Sparkles className="h-6 w-6 text-violet-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold">
                  Or Pick What You Need
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Pay only for the insights you want
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Framework Bundle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                  <Layers className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold">Framework Bundle</div>
                  <div className="text-sm text-muted-foreground">Full MBTI + Enneagram + DISC details</div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => handlePurchase("frameworks")}
                disabled={purchaseLoading === "frameworks"}
              >
                {purchaseLoading === "frameworks" ? "..." : "$2.99"}
              </Button>
            </div>

            {/* Career Deep Dive */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold">Career Deep Dive</div>
                  <div className="text-sm text-muted-foreground">15+ careers with salaries & growth</div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handlePurchase("career")}
                disabled={purchaseLoading === "career"}
              >
                {purchaseLoading === "career" ? "..." : "$3.99"}
              </Button>
            </div>

            {/* Growth Plan */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-green-950/20 border border-green-500/20 hover:border-green-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="font-semibold">Growth Plan</div>
                  <div className="text-sm text-muted-foreground">30-day personalized challenges</div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handlePurchase("growth_plan")}
                disabled={purchaseLoading === "growth_plan"}
              >
                {purchaseLoading === "growth_plan" ? "..." : "$2.99"}
              </Button>
            </div>

            {/* Compatibility */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-pink-950/20 border border-pink-500/20 hover:border-pink-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/20">
                  <Heart className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <div className="font-semibold">Compatibility Report</div>
                  <div className="text-sm text-muted-foreground">Detailed comparison with a friend</div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => handlePurchase("compatibility")}
                disabled={purchaseLoading === "compatibility"}
              >
                {purchaseLoading === "compatibility" ? "..." : "$2.99"}
              </Button>
            </div>

            {/* View All Pricing Link */}
            <div className="text-center pt-4">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Link href={`/pricing?session=${sessionId}`}>
                  View All Pricing Options
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

