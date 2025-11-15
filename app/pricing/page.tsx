"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Users, Building2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out the assessment",
    features: [
      "Core personality assessment",
      "Basic dimensional profile",
      "Shareable results link",
      "Basic insights",
    ],
    cta: "Current Plan",
    popular: false,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "month",
    yearlyPrice: "$89.99",
    yearlyPeriod: "year",
    description: "For individuals who want deeper insights",
    features: [
      "Everything in Free",
      "PDF export",
      "Comparison reports",
      "Detailed insights",
      "Development plans",
      "Ad-free experience",
      "Priority support",
    ],
    cta: "Upgrade to Premium",
    popular: true,
    stripePlanMonthly: "premium_monthly",
    stripePlanYearly: "premium_yearly",
  },
  {
    name: "Professional",
    price: "$39.99",
    period: "month",
    yearlyPrice: "$399.99",
    yearlyPeriod: "year",
    description: "For coaches and consultants",
    features: [
      "Everything in Premium",
      "Client management",
      "Bulk assessments",
      "White-label reports",
      "API access",
      "Professional resources",
    ],
    cta: "Upgrade to Professional",
    popular: false,
    stripePlanMonthly: "professional_monthly",
    stripePlanYearly: "professional_yearly",
  },
];

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan: string) => {
    if (!user?.id) {
      toast.error("Please sign in to subscribe");
      return;
    }

    setLoading(true);
    try {
      const planKey = billingPeriod === "monthly" ? `${plan}_monthly` : `${plan}_yearly`;
      
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planKey,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Choose Your Plan</h1>
            <p className="text-lg text-muted-foreground">
              Select the plan that best fits your needs
            </p>
          </div>

          {/* Billing Period Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg border p-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === "yearly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly <span className="text-xs">(Save 16%)</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {plan.name === "Premium" && <Sparkles className="h-5 w-5 text-primary" />}
                    {plan.name === "Professional" && <Users className="h-5 w-5 text-primary" />}
                    {plan.name === "Free" && <Building2 className="h-5 w-5 text-muted-foreground" />}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      {billingPeriod === "yearly" && plan.yearlyPrice
                        ? plan.yearlyPrice
                        : plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{billingPeriod === "yearly" && plan.yearlyPeriod ? plan.yearlyPeriod : plan.period}
                    </span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.name === "Free" ? (
                    <Button variant="outline" className="w-full" disabled>
                      {plan.cta}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleCheckout(plan.name.toLowerCase())}
                      disabled={loading || !isLoaded || !user}
                    >
                      {loading ? "Processing..." : plan.cta}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
