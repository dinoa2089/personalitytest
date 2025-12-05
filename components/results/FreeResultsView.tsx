"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  Crown,
  Brain,
  CheckCircle2,
  Eye,
  Star,
  Heart,
  Zap,
  Target,
} from "lucide-react";
import { calculateArchetype } from "@/lib/archetypes";
import { PersonalityRadarChart } from "./RadarChart";
import { ShareableInfographic } from "./ShareableInfographic";
import { ExploreYourType } from "./ExploreYourType";
import type { DimensionScore } from "@/types";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

interface FreeResultsViewProps {
  scores: DimensionScore[];
  sessionId: string;
}

// Blurred teaser card component
function BlurredTeaser({ 
  title, 
  preview, 
  icon: Icon,
  color = "violet"
}: { 
  title: string; 
  preview: string; 
  icon: React.ElementType;
  color?: "violet" | "blue" | "amber" | "emerald" | "rose";
}) {
  const colors = {
    violet: "from-violet-500 to-fuchsia-500 border-violet-200 bg-violet-50/50",
    blue: "from-blue-500 to-cyan-500 border-blue-200 bg-blue-50/50",
    amber: "from-amber-500 to-orange-500 border-amber-200 bg-amber-50/50",
    emerald: "from-emerald-500 to-teal-500 border-emerald-200 bg-emerald-50/50",
    rose: "from-rose-500 to-pink-500 border-rose-200 bg-rose-50/50",
  };

  return (
    <div className={`relative rounded-xl border-2 ${colors[color].split(' ').slice(2).join(' ')} p-6 overflow-hidden group hover:shadow-lg transition-all`}>
      {/* Blurred content overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/60 flex items-center justify-center z-10">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${colors[color].split(' ').slice(0, 2).join(' ')} mb-3`}>
            <Lock className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Unlock to reveal</p>
        </div>
      </div>
      
      {/* Teaser content (blurred behind overlay) */}
      <div className="opacity-70">
        <div className="flex items-center gap-3 mb-3">
          <Icon className="w-5 h-5 text-muted-foreground" />
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <div className="text-2xl font-bold blur-sm select-none">{preview}</div>
      </div>
    </div>
  );
}

// Animated reveal preview component
function RevealPreview({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [revealed, setRevealed] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={revealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function FreeResultsView({ scores, sessionId }: FreeResultsViewProps) {
  const { primary } = calculateArchetype(scores);
  const { user } = useUser();
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Show paywall after user has scrolled or after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowPaywall(true), 3000);
    return () => clearTimeout(timer);
  }, []);

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

  // Fake MBTI based on scores for teaser
  const fakeMBTI = scores.find(s => s.dimension === "extraversion")?.percentile! > 50 ? "E" : "I";
  const fakeEnneagram = Math.floor(Math.random() * 9) + 1;

  return (
    <div className="space-y-8">
      {/* Assessment Complete Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Assessment Complete!</span>
        </div>
        <p className="text-muted-foreground">
          You&apos;ve completed all 105 questions. Here&apos;s your personalized report.
        </p>
      </motion.div>

      {/* Primary Archetype Card - UNLOCKED */}
      <RevealPreview delay={500}>
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
      </RevealPreview>

      {/* Radar Chart - UNLOCKED */}
      <RevealPreview delay={1000}>
        <Card className="rounded-2xl border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Your 7 Dimensions</CardTitle>
            <CardDescription>
              Your personality across the PRISM-7 framework
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-full">
              <PersonalityRadarChart scores={scores} height={320} />
            </div>

            {/* Basic dimension bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scores.map((score) => (
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
      </RevealPreview>

      {/* Teaser Section - LOCKED CONTENT */}
      <RevealPreview delay={1500}>
        <Card className="rounded-2xl border-2 border-dashed border-violet-300 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-violet-100">
                <Eye className="w-6 h-6 text-violet-600" />
              </div>
            </div>
            <CardTitle className="text-xl">Unlock Your Complete Profile</CardTitle>
            <CardDescription>
              Here&apos;s a preview of what you&apos;ll discover
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Blurred teasers grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <BlurredTeaser 
                title="Your MBTI Type" 
                preview={`${fakeMBTI}N??`}
                icon={Brain}
                color="blue"
              />
              <BlurredTeaser 
                title="Enneagram Type" 
                preview={`Type ${fakeEnneagram}w?`}
                icon={Target}
                color="emerald"
              />
            </div>

            {/* Career matches teaser */}
            <div className="relative rounded-xl border-2 border-amber-200 bg-amber-50/50 p-6 overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center z-10">
                <div className="text-center px-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 mb-3">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-amber-800">15+ Career Matches Waiting</p>
                  <p className="text-sm text-amber-700/80">See which careers fit your personality</p>
                </div>
              </div>
              <div className="opacity-50">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5" />
                  <span className="font-semibold">Top Career Matches</span>
                </div>
                <div className="space-y-2 blur-sm select-none">
                  <div className="flex justify-between p-2 bg-white/60 rounded">
                    <span>Product Manager</span>
                    <span className="text-green-600 font-bold">94%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/60 rounded">
                    <span>UX Designer</span>
                    <span className="text-green-600 font-bold">91%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/60 rounded">
                    <span>Data Scientist</span>
                    <span className="text-green-600 font-bold">87%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* More locked features */}
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: Heart, label: "Compatibility Report", color: "rose" },
                { icon: Star, label: "Famous Examples", color: "amber" },
                { icon: TrendingUp, label: "Growth Plan", color: "emerald" },
              ].map((item) => (
                <div 
                  key={item.label}
                  className={`flex flex-col items-center p-4 rounded-xl border border-${item.color}-200 bg-${item.color}-50/50 text-center`}
                >
                  <div className={`p-2 rounded-full bg-${item.color}-100 mb-2`}>
                    <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                  <Lock className="w-3 h-3 text-muted-foreground/50 mt-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </RevealPreview>

      {/* Shareable Badge - UNLOCKED */}
      <RevealPreview delay={2000}>
        <ShareableInfographic 
          archetype={primary} 
          scores={scores} 
          sessionId={sessionId}
        />
      </RevealPreview>

      {/* Explore Your Type - UNLOCKED */}
      <ExploreYourType archetype={primary} />

      {/* MAIN PAYWALL CTA */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <Card className="rounded-2xl border-2 border-violet-400 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-600 overflow-hidden relative shadow-2xl shadow-violet-500/30">
              {/* Animated background shimmer */}
              <div className="absolute inset-0 opacity-20">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              <CardContent className="p-8 relative">
                <div className="flex flex-col items-center text-center text-white">
                  {/* Icon */}
                  <motion.div 
                    className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-6"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="h-10 w-10 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-3xl font-bold mb-3">Unlock Your Complete Results</h3>
                  <p className="text-white/90 mb-6 max-w-md">
                    You&apos;ve invested time discovering yourself. See everything: your MBTI type, Enneagram, 
                    career matches, compatibility insights, and personalized growth plan.
                  </p>

                  {/* What's included */}
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-8 text-left">
                    {[
                      "MBTI type with cognitive functions",
                      "Enneagram type & wing",
                      "Dark Triad personality profile",
                      "15+ career matches with fit scores",
                      "Complete compatibility report",
                      "Famous people like you",
                      "Personalized growth recommendations",
                      "Downloadable PDF report",
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/90">
                        <CheckCircle2 className="h-4 w-4 text-green-300 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex flex-col items-center gap-4">
                    <div>
                      <span className="text-5xl font-bold">$4.99</span>
                      <span className="text-white/70 ml-2">one-time</span>
                    </div>
                    <Button
                      size="lg"
                      className="h-14 px-10 text-lg bg-white text-violet-700 hover:bg-white/90 shadow-lg"
                      onClick={handlePurchase}
                      disabled={purchaseLoading}
                    >
                      {purchaseLoading ? (
                        "Processing..."
                      ) : (
                        <>
                          Unlock My Full Results
                          <Sparkles className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" /> Instant access
                      </span>
                      <span>•</span>
                      <span>14-day money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social/Viral CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
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
