"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Gift,
  TrendingUp,
  Link as LinkIcon,
  Crown,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface ReferralStats {
  hasCode: boolean;
  code?: string;
  referralLink?: string;
  completedReferrals: number;
  threshold: number;
  progress: number;
  unlocked: boolean;
  referrals?: Array<{
    id: string;
    completedAt: string | null;
    unlockedPremium: boolean;
  }>;
}

export function ReferralDashboard() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchStats = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/referrals/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          
          // If just unlocked, show celebration
          if (data.unlocked && !data.hasShownUnlockNotification) {
            window.dispatchEvent(new CustomEvent('premium-unlocked'));
          }
        }
      } catch (error) {
        console.error("Error fetching referral stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds to catch new unlocks
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [user?.id, isLoaded]);

  const createReferralCode = async () => {
    try {
      const response = await fetch("/api/referrals/create", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          ...stats!,
          hasCode: true,
          code: data.code,
          referralLink: data.referralLink,
        });
        toast.success("Referral code created!");
      }
    } catch (error) {
      toast.error("Failed to create referral code");
    }
  };

  const copyReferralLink = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralLink = () => {
    if (stats?.referralLink) {
      if (navigator.share) {
        navigator.share({
          title: "Take the PRISM-7 Personality Assessment",
          text: "Discover your authentic self with this scientifically validated personality assessment!",
          url: stats.referralLink,
        });
      } else {
        copyReferralLink();
      }
    }
  };

  if (!isLoaded || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
          <CardDescription>
            Sign in to unlock your Full Results for free by sharing with friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  if (!stats.hasCode) {
    return (
      <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-violet-600" />
            <CardTitle>Get Full Results Free</CardTitle>
          </div>
          <CardDescription>
            Share your assessment with {stats.threshold} friends to unlock your complete personality profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-violet-200 bg-white/80 p-4">
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-violet-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold mb-2">How it works</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Create your unique referral link</li>
                  <li>2. Share it with {stats.threshold} friends</li>
                  <li>3. When they complete the assessment, you unlock Full Results!</li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* What you'll get */}
          <div className="rounded-lg border border-violet-200 bg-white/80 p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-600" />
              What you'll unlock ($4.99 value):
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                "Complete dimensional breakdown",
                "All 15+ career matches",
                "MBTI & Enneagram mappings",
                "Compatibility profile",
                "Famous examples like you",
                "Growth recommendations",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-1.5 text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-violet-600 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={createReferralCode} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
            Create My Referral Link
          </Button>
        </CardContent>
      </Card>
    );
  }

  const remaining = Math.max(0, stats.threshold - stats.completedReferrals);

  return (
    <Card className={stats.unlocked ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50" : "border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className={`h-5 w-5 ${stats.unlocked ? "text-green-600" : "text-violet-600"}`} />
            <CardTitle>Referral Program</CardTitle>
          </div>
          {stats.unlocked && (
            <Badge className="bg-green-600 text-white">Full Results Unlocked! 🎉</Badge>
          )}
        </div>
        <CardDescription>
          {stats.unlocked
            ? "You've unlocked Full Results! Keep sharing to help friends discover their authentic self."
            : `${remaining} more ${remaining === 1 ? "friend" : "friends"} needed to unlock Full Results`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        {!stats.unlocked && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">
                {stats.completedReferrals} / {stats.threshold}
              </span>
            </div>
            <Progress value={stats.progress} className="h-3" />
          </div>
        )}

        {/* Referral Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Referral Link</label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{stats.referralLink}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={copyReferralLink}
              title="Copy link"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={shareReferralLink}
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-white p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className={`h-4 w-4 ${stats.unlocked ? "text-green-600" : "text-violet-600"}`} />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="text-2xl font-bold">{stats.completedReferrals}</div>
          </div>
          <div className="rounded-lg border border-border bg-white p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`h-4 w-4 ${stats.unlocked ? "text-green-600" : "text-violet-600"}`} />
              <span className="text-sm text-muted-foreground">
                {stats.unlocked ? "Total" : "Remaining"}
              </span>
            </div>
            <div className="text-2xl font-bold">
              {stats.unlocked ? stats.completedReferrals : remaining}
            </div>
          </div>
        </div>

        {/* What you'll unlock (only if not unlocked) */}
        {!stats.unlocked && (
          <div className="rounded-lg border border-violet-200 bg-white/80 p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Crown className="h-4 w-4 text-violet-600" />
              What you'll unlock:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                "Complete dimensional breakdown",
                "All 15+ career matches",
                "MBTI & Enneagram mappings",
                "Compatibility profile",
                "Famous examples like you",
                "Downloadable PDF report",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-1.5 text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-violet-600 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Button 
          onClick={shareReferralLink} 
          className={`w-full ${stats.unlocked ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"}`}
          size="lg"
        >
          <Share2 className="mr-2 h-4 w-4" />
          {stats.unlocked ? "Share With More Friends" : "Share to Unlock Full Results"}
        </Button>
      </CardContent>
    </Card>
  );
}
