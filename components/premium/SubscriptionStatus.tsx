"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, ExternalLink } from "lucide-react";
import { getUserSubscription, type Subscription } from "@/lib/subscriptions";
import Link from "next/link";

export function SubscriptionStatus() {
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!isLoaded || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        const sub = await getUserSubscription(user.id);
        setSubscription(sub);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user?.id, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>You're currently on the free plan</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Upgrade to Premium to unlock advanced features and insights.
          </p>
          <Button asChild>
            <Link href="/pricing">View Plans</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isActive = subscription.status === "active" || subscription.status === "trialing";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Subscription</CardTitle>
          <Badge variant={isActive ? "default" : "secondary"}>
            {subscription.status === "active" && "Active"}
            {subscription.status === "trialing" && "Trial"}
            {subscription.status === "canceled" && "Canceled"}
            {subscription.status === "past_due" && "Past Due"}
          </Badge>
        </div>
        <CardDescription>
          {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription.currentPeriodEnd && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {subscription.cancelAtPeriodEnd
                ? "Renews until"
                : "Next billing date"}{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {subscription.cancelAtPeriodEnd && (
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Your subscription will cancel at the end of the current period.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {subscription.stripeSubscriptionId && (
            <Button variant="outline" className="flex-1" asChild>
              <a
                href={`https://billing.stripe.com/p/login/test_${subscription.stripeSubscriptionId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Billing
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
          {!subscription.cancelAtPeriodEnd && (
            <Button variant="outline" asChild>
              <Link href="/pricing">Change Plan</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

