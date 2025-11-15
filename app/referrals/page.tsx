"use client";

import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { ReferralDashboard } from "@/components/referrals/ReferralDashboard";
import { PremiumUnlockNotification } from "@/components/referrals/PremiumUnlockNotification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Gift, TrendingUp } from "lucide-react";

export default function ReferralsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PremiumUnlockNotification />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Unlock Premium for Free
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your assessment with friends and unlock premium features when they complete it
            </p>
          </div>

          <ReferralDashboard />

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Share & Earn</CardTitle>
                </div>
                <CardDescription>
                  Share your unique referral link with friends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  When your friends complete the assessment using your link, it counts toward your unlock goal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>Track Progress</CardTitle>
                </div>
                <CardDescription>
                  See how many friends have completed the assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor your progress toward unlocking premium features in real-time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <CardTitle>Unlock Premium</CardTitle>
                </div>
                <CardDescription>
                  Get full access when 3 friends complete the assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Once unlocked, you'll have permanent access to all premium features including detailed insights and comparisons.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>What You'll Unlock</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Complete Profile</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All 7 dimension scores with confidence intervals</li>
                    <li>• Detailed percentile rankings</li>
                    <li>• Full radar chart visualization</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Premium Insights</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Career and work recommendations</li>
                    <li>• Relationship compatibility insights</li>
                    <li>• Personal growth strategies</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Framework Mappings</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• MBTI type mapping</li>
                    <li>• CliftonStrengths themes</li>
                    <li>• Enneagram type analysis</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Advanced Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Comparison with previous assessments</li>
                    <li>• PDF export functionality</li>
                    <li>• Shareable detailed reports</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

