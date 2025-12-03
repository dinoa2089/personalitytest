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
  Briefcase,
  TrendingUp,
  UserPlus,
  MessageSquare,
  ChevronDown,
  Heart,
  Layers,
  Crown,
  Brain,
  CheckCircle2,
} from "lucide-react";
import { calculateArchetype } from "@/lib/archetypes";
import { PersonalityRadarChart } from "./RadarChart";
import { ShareableInfographic } from "./ShareableInfographic";
import { ExploreYourType } from "./ExploreYourType";
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
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const handlePurchase = async () => {
    if (!user?.id) {
      toast.error("Please sign in to purchase");
      return;
    }

    setPurchaseLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "full_unlock",
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
      setPurchaseLoading(false);
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

  return (
    <div className="space-y-8">
      {/* Primary Archetype Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{primary.icon}</div>
            <Badge className="mb-3 bg-violet-100 text-violet-700 border-violet-200">
              {primary.rarity}% of the population
            </Badge>
            <h2 className="text-3xl font-bold mb-2">{primary.name}</h2>
            <p className="text-lg text-muted-foreground mb-4">{primary.tagline}</p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/type/${primary.id}`}>
                Learn more about {primary.name}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Basic Dimensional Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-2xl border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Your 7 Dimensions</CardTitle>
            <CardDescription>
              A preview of your personality across the PRISM-7 framework
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Radar Chart */}
            <div className="w-full">
              <PersonalityRadarChart scores={scores} height={320} />
            </div>

            {/* Basic dimension bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scores.map((score, index) => (
                <div
                  key={score.dimension}
                  className="flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg min-w-0"
                >
                  <span className="text-sm font-medium truncate">
                    {dimensionLabels[score.dimension]}
                  </span>
                  <Badge 
                    variant={score.percentile > 60 ? "default" : score.percentile < 40 ? "secondary" : "outline"}
                    className="flex-shrink-0"
                  >
                    {score.percentile}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shareable Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ShareableInfographic 
          archetype={primary} 
          scores={scores} 
          sessionId={sessionId}
        />
      </motion.div>

      {/* Explore Your Type */}
      <ExploreYourType archetype={primary} />

      {/* Full Results Unlock CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-2xl border-2 border-violet-300 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 overflow-hidden relative">
          {/* Decorative background */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fuchsia-200/30 rounded-full blur-3xl" />
          
          <CardContent className="p-8 relative">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25 flex-shrink-0">
                <Crown className="h-10 w-10 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl font-bold mb-2">Unlock Your Full Personality Profile</h3>
                <p className="text-muted-foreground mb-4">
                  Get the complete picture: detailed insights, all career matches, framework mappings, and personalized recommendations.
                </p>

                {/* What's included */}
                <div className="grid sm:grid-cols-2 gap-2 mb-6">
                  {[
                    "Complete dimensional breakdown",
                    "All 15+ career matches",
                    "MBTI & Enneagram mappings",
                    "Compatibility profile",
                    "Famous examples like you",
                    "Growth recommendations",
                    "Downloadable PDF report",
                    "Detailed infographic",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-violet-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="text-center flex-shrink-0">
                <div className="mb-3">
                  <span className="text-4xl font-bold">$4.99</span>
                  <span className="text-muted-foreground ml-1">one-time</span>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-lg shadow-violet-500/25"
                  onClick={handlePurchase}
                  disabled={purchaseLoading}
                >
                  {purchaseLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      Unlock Full Results
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  14-day money-back guarantee
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Social/Viral CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold mb-1">Share With Friends</h4>
                <p className="text-sm text-muted-foreground">
                  Challenge your friends to take the test and compare your personality types!
                </p>
              </div>
              <Button variant="outline" className="border-pink-200 hover:bg-pink-50">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Friends
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Link to pricing page */}
      <div className="text-center">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Link href={`/pricing?session=${sessionId}`}>
            View pricing details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
