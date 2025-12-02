"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Sparkles, 
  Users, 
  Building2, 
  Zap, 
  Gift,
  ArrowRight,
  Star,
  Shield,
  Briefcase,
  Heart,
  TrendingUp,
  Download,
  Clock
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

// Individual Pricing
const individualPlans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Generous results to share with everyone",
    icon: Gift,
    features: [
      "Full personality archetype with description",
      "All 7 dimensions with percentiles",
      "Interactive radar chart",
      "Strengths and growth areas",
      "One random framework mapping (MBTI, DISC, or Enneagram)",
      "Top 3 career matches",
      "Shareable infographic",
      "Compatibility teaser",
    ],
    cta: "Start Free Assessment",
    ctaLink: "/assessment/intro",
    popular: false,
  },
  {
    id: "premium_report",
    name: "Premium Report",
    price: "$14.99",
    period: "one-time",
    description: "Full insights for this assessment",
    icon: Sparkles,
    features: [
      "Everything in Free",
      "All framework mappings (MBTI, DISC, Enneagram)",
      "15+ detailed career matches with salaries",
      "All compatibility modes (work, romantic, friendship)",
      "30-day personalized development plan",
      "Professional PDF export",
      "Results saved forever",
    ],
    savings: "Save 75% vs MBTI ($59.95)",
    cta: "Unlock Premium Report",
    popular: true,
    stripePlan: "premium_report",
  },
  {
    id: "deep_dive",
    name: "Deep Dive",
    price: "$29.99",
    period: "one-time",
    description: "The complete personality deep dive",
    icon: Zap,
    features: [
      "Everything in Premium Report",
      "Extended assessment (40 additional questions)",
      "Dark Triad analysis",
      "Sub-facet scoring for each dimension",
      "Historical comparison over time",
      "Priority email support",
    ],
    savings: "Save 50% vs CliftonStrengths ($59.99)",
    cta: "Get Deep Dive",
    popular: false,
    stripePlan: "deep_dive",
  },
];

// Subscription
const subscriptionPlan = {
  id: "subscription",
  name: "Unlimited",
  monthlyPrice: "$4.99",
  yearlyPrice: "$29.99",
  description: "For people who retake regularly",
  icon: Star,
  features: [
    "Unlimited Premium Reports on all assessments",
    "All Deep Dive features included",
    "Unlimited friend compatibility reports",
    "Track personality changes over time",
    "Early access to new features",
  ],
  savings: "81% cheaper than competitors",
  stripePlanMonthly: "unlimited_monthly",
  stripePlanYearly: "unlimited_yearly",
};

// B2B Code Packs
const codePacks = [
  { codes: 10, price: 99, perCode: 9.90, savings: "34%" },
  { codes: 25, price: 199, perCode: 7.96, savings: "47%" },
  { codes: 50, price: 349, perCode: 6.98, savings: "53%" },
  { codes: 100, price: 499, perCode: 4.99, savings: "67%" },
];

// Competitor Comparison
const competitors = [
  { name: "Official MBTI", theirPrice: "$59.95", ourPrice: "$14.99", savings: "75%" },
  { name: "CliftonStrengths 34", theirPrice: "$59.99", ourPrice: "$29.99", savings: "50%" },
  { name: "Truity Premium", theirPrice: "$49.00", ourPrice: "$14.99", savings: "69%" },
  { name: "Monthly Subscriptions", theirPrice: "$26/mo", ourPrice: "$4.99/mo", savings: "81%" },
  { name: "B2B (per person)", theirPrice: "$25+", ourPrice: "$4.99", savings: "80%" },
];

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    if (!user?.id) {
      toast.error("Please sign in to purchase");
      return;
    }

    setLoading(plan);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          userId: user.id,
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
      setLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-green-500/20 text-green-600 border-green-500/30">
              Enterprise-grade insights at a fraction of the cost
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              No subscriptions required. Pay once, own your insights forever.
            </p>
          </motion.div>
        </section>

        {/* Individual Plans */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {individualPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative h-full ${plan.popular ? "border-2 border-primary shadow-xl" : "border-border/50"}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <plan.icon className={`h-5 w-5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    {plan.savings && (
                      <Badge variant="outline" className="mt-2 text-green-600 border-green-600/30 bg-green-500/10">
                        {plan.savings}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.ctaLink ? (
                      <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                        <Link href={plan.ctaLink}>{plan.cta}</Link>
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => handleCheckout(plan.stripePlan!)}
                        disabled={loading === plan.stripePlan || !isLoaded}
                      >
                        {loading === plan.stripePlan ? "Processing..." : plan.cta}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Subscription Option */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <h3 className="text-2xl font-bold">Prefer a Subscription?</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {subscriptionPlan.description}
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex rounded-lg border p-1">
                        <button
                          onClick={() => setBillingPeriod("monthly")}
                          className={`px-3 py-1 rounded text-sm ${
                            billingPeriod === "monthly" ? "bg-primary text-primary-foreground" : ""
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setBillingPeriod("yearly")}
                          className={`px-3 py-1 rounded text-sm ${
                            billingPeriod === "yearly" ? "bg-primary text-primary-foreground" : ""
                          }`}
                        >
                          Yearly (Save 50%)
                        </button>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold">
                        {billingPeriod === "yearly" ? subscriptionPlan.yearlyPrice : subscriptionPlan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingPeriod === "yearly" ? "year" : "month"}
                      </span>
                    </div>
                    <ul className="space-y-1 mb-4">
                      {subscriptionPlan.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => handleCheckout(
                      billingPeriod === "yearly" 
                        ? subscriptionPlan.stripePlanYearly 
                        : subscriptionPlan.stripePlanMonthly
                    )}
                    disabled={!!loading || !isLoaded || !user}
                  >
                    Subscribe Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Competitor Comparison */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Compare & Save</h2>
              <p className="text-muted-foreground">
                Get the same (or better) insights for a fraction of the price
              </p>
            </div>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-4 font-semibold">Assessment</th>
                      <th className="text-center p-4 font-semibold">Their Price</th>
                      <th className="text-center p-4 font-semibold">Our Price</th>
                      <th className="text-center p-4 font-semibold">You Save</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.map((comp, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-4 font-medium">{comp.name}</td>
                        <td className="text-center p-4 text-muted-foreground line-through">
                          {comp.theirPrice}
                        </td>
                        <td className="text-center p-4 font-bold text-primary">
                          {comp.ourPrice}
                        </td>
                        <td className="text-center p-4">
                          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                            {comp.savings}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* B2B Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4">For Teams & Organizations</Badge>
              <h2 className="text-3xl font-bold mb-2">Assessment Code Packs</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Buy codes in bulk and distribute to your team, candidates, or clients. 
                Each code unlocks a Premium Report.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {codePacks.map((pack) => (
                <Card key={pack.codes} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold mb-1">{pack.codes}</div>
                    <div className="text-sm text-muted-foreground mb-4">codes</div>
                    <div className="text-2xl font-bold text-primary mb-1">${pack.price}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      ${pack.perCode.toFixed(2)} per code
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600/30">
                      Save {pack.savings}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Team Dashboard Add-On</h3>
                    <p className="text-muted-foreground mb-4">
                      View all results, team composition, candidate ranking, and more.
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-primary" />
                        Team composition view
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-primary" />
                        Job profile builder
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Candidate ranking
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">$49</div>
                    <div className="text-sm text-muted-foreground mb-4">/month</div>
                    <Button asChild>
                      <Link href="/contact">Contact Sales</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Need 250+ codes or enterprise features?
              </p>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  Contact Us for Custom Pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "What's the difference between one-time and subscription?",
                  a: "One-time purchases unlock features for a single assessment. Subscriptions give you unlimited access - great if you retake assessments regularly or want to compare with multiple friends."
                },
                {
                  q: "How do assessment codes work?",
                  a: "Purchase a pack of codes, then distribute them to your team or candidates. Each person enters their code when taking the assessment to automatically unlock their Premium Report."
                },
                {
                  q: "Can I upgrade from Premium Report to Deep Dive?",
                  a: "Yes! You only pay the difference ($15). Your existing results carry over and you'll get access to the extended assessment and Dark Triad analysis."
                },
                {
                  q: "Is there a refund policy?",
                  a: "Yes, we offer a 14-day money-back guarantee. If you're not satisfied with your results, contact us for a full refund."
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
