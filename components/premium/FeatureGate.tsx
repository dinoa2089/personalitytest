"use client";

import { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hasPremiumAccess, isFeatureAvailable, getUserSubscription, type SubscriptionPlan } from "@/lib/subscriptions";
import Link from "next/link";

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export function FeatureGate({ feature, children, fallback, showUpgrade = true }: FeatureGateProps) {
  const { user, isLoaded } = useUser();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<{ plan: SubscriptionPlan } | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoaded) return;

      if (!user?.id) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const userSubscription = await getUserSubscription(user.id);
        const plan = userSubscription?.plan || "free";
        setSubscription({ plan });

        const access = await hasPremiumAccess(user.id);
        const featureAvailable = isFeatureAvailable(feature, plan);

        setHasAccess(access && featureAvailable);
      } catch (error) {
        console.error("Error checking feature access:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user?.id, isLoaded, feature]);

  if (loading) {
    return <div className="animate-pulse">{children}</div>;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Premium Feature</CardTitle>
        </div>
        <CardDescription>
          This feature is available with a Premium subscription
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upgrade to Premium to unlock this feature and more:
          </p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              PDF export and detailed reports
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Comparison with previous assessments
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Contextual insights and development plans
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Ad-free experience
            </li>
          </ul>
          <Button asChild className="w-full">
            <Link href="/pricing">Upgrade to Premium</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

