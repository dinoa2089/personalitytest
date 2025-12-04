"use client";

import { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isFeatureAvailable, type SubscriptionPlan } from "@/lib/subscriptions";
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoaded) return;

      if (!user?.id) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Check premium/admin status via API (works correctly with server-side env vars)
        const userEmail = user.primaryEmailAddress?.emailAddress || "";
        const params = new URLSearchParams({
          userId: user.id,
          email: userEmail,
        });
        
        const response = await fetch(`/api/user/premium-status?${params}`);
        const data = await response.json();
        
        // Admins get access to ALL features
        if (data.isAdmin) {
          setIsAdmin(true);
          setHasAccess(true);
        } else if (data.hasPremium) {
          // Premium users - check if specific feature is available for their plan
          const plan = data.plan || "premium_report";
          const featureAvailable = isFeatureAvailable(feature, plan as SubscriptionPlan);
          setHasAccess(featureAvailable);
        } else {
          // Free users - check if feature is available on free plan
          const featureAvailable = isFeatureAvailable(feature, "free");
          setHasAccess(featureAvailable);
        }
      } catch (error) {
        console.error("Error checking feature access:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user?.id, isLoaded, feature, user?.primaryEmailAddress?.emailAddress]);

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

