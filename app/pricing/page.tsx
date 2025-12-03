"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PurchaseCard, type PurchaseProduct } from "@/components/pricing/PurchaseCard";
import {
  Check,
  Sparkles,
  Users,
  Building2,
  Briefcase,
  Heart,
  TrendingUp,
  Layers,
  Zap,
  Gift,
  ArrowRight,
  Shield,
  Star,
  Crown,
  Target,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import type { MicroPurchaseStatus } from "@/lib/subscriptions";

// Micro-transaction products
const microProducts: PurchaseProduct[] = [
  {
    id: "compatibility",
    name: "Compatibility Report",
    price: "$2.99",
    priceValue: 2.99,
    description: "See how you match with ONE friend, partner, or colleague",
    icon: Heart,
    features: [
      "Detailed compatibility breakdown",
      "Communication style comparison",
      "Potential friction points",
      "Tips for better collaboration",
    ],
    planKey: "compatibility",
  },
  {
    id: "career",
    name: "Career Deep Dive",
    price: "$3.99",
    priceValue: 3.99,
    description: "Unlock your full career potential",
    icon: Briefcase,
    features: [
      "15+ detailed career matches",
      "Salary ranges & growth trends",
      "Skills gap analysis",
      "Interview tips per role",
    ],
    planKey: "career",
  },
  {
    id: "frameworks",
    name: "Framework Bundle",
    price: "$2.99",
    priceValue: 2.99,
    description: "Complete personality framework mappings",
    icon: Layers,
    features: [
      "Full MBTI type + cognitive functions",
      "Enneagram with wing & tritype",
      "DISC profile breakdown",
      "Framework comparison chart",
    ],
    planKey: "frameworks",
  },
  {
    id: "growth_plan",
    name: "Growth Plan",
    price: "$2.99",
    priceValue: 2.99,
    description: "Personalized development roadmap",
    icon: TrendingUp,
    features: [
      "30-day challenge calendar",
      "Daily micro-habits",
      "Progress tracking guide",
      "Weakness-to-strength exercises",
    ],
    planKey: "growth_plan",
  },
];

// Full unlock bundle
const fullUnlockProduct: PurchaseProduct = {
  id: "full_unlock",
  name: "Full Unlock",
  price: "$7.99",
  priceValue: 7.99,
  description: "Everything included — save ~$5",
  icon: Crown,
  features: [
    "All 4 premium features above",
    "Unlimited compatibility comparisons",
    "Future feature updates included",
    "Priority support",
  ],
  savings: "Save ~$5 vs individual",
  popular: true,
  planKey: "full_unlock",
};

// Free tier features
const freeFeatures = [
  "Full archetype name + description",
  "All 7 dimensions with percentiles",
  "Interactive radar chart",
  "ONE random framework (type only)",
  "Top 3 careers (titles only)",
  "Shareable infographic",
  "Compatibility teaser",
];

// Competitor comparison
const competitors = [
  { name: "Official MBTI", price: "$59.95", ourEquivalent: "$2.99" },
  { name: "16Personalities Premium", price: "$32.99", ourEquivalent: "$7.99" },
  { name: "Truity Career Test", price: "$29.00", ourEquivalent: "$3.99" },
  { name: "Enneagram Institute", price: "$12.00", ourEquivalent: "$2.99" },
];

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") || null;
  
  const [loading, setLoading] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<MicroPurchaseStatus>({
    compatibility: false,
    career: false,
    frameworks: false,
    growth_plan: false,
    full_unlock: false,
  });

  // Check existing purchases on mount
  useEffect(() => {
    async function checkPurchases() {
      if (!user?.id) return;
      
      try {
        const url = new URL("/api/purchases/check", window.location.origin);
        url.searchParams.set("userId", user.id);
        if (sessionId) {
          url.searchParams.set("sessionId", sessionId);
        }
        
        const response = await fetch(url.toString());
        if (response.ok) {
          const data = await response.json();
          setPurchaseStatus(data);
        }
      } catch (error) {
        console.error("Error checking purchases:", error);
      }
    }
    
    if (isLoaded && user) {
      checkPurchases();
    }
  }, [isLoaded, user, sessionId]);

  const handleCheckout = async (planKey: string) => {
    if (!isLoaded) {
      toast.error("Please wait while we load your account...");
      return;
    }
    if (!user?.id) {
      toast.error("Please sign in to purchase");
      return;
    }

    setLoading(planKey);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planKey,
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
      setLoading(null);
    }
  };

  const isPurchased = (productId: string): boolean => {
    if (purchaseStatus.full_unlock) return true;
    return purchaseStatus[productId as keyof MicroPurchaseStatus] || false;
  };

  // Note: We don't block on isLoaded - page content renders immediately
  // Purchase status will update once auth loads

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Badge className="mb-6 bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 mr-1.5 inline" />
              Pay Only For What You Want
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Unlock Your Full Personality Insights
            </h1>
            
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              No subscriptions. No bundles you don't need. 
              Pick exactly what interests you, starting at just <span className="text-amber-400 font-semibold">$2.99</span>.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-green-500" />
                Secure payment via Stripe
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500" />
                Instant access after purchase
              </span>
              <span className="flex items-center gap-1.5">
                <Gift className="h-4 w-4 text-purple-500" />
                14-day money-back guarantee
              </span>
            </div>
          </motion.div>
        </section>

        {/* Free Tier */}
        <section className="container mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-5xl mx-auto"
          >
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-xl">Free Forever</CardTitle>
                </div>
                <CardDescription>
                  Start with generous free insights — no credit card required
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-3">
                  {freeFeatures.map((feature, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-full text-sm text-slate-300"
                    >
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Button asChild variant="outline" className="border-slate-700 hover:bg-slate-800">
                    <Link href="/assessment/intro">
                      Start Free Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Full Unlock (Best Value) */}
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-6">
              <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30">
                <Crown className="h-3.5 w-3.5 mr-1.5 inline" />
                Best Value
              </Badge>
            </div>
            
            <Card className={`border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/20 via-slate-900 to-orange-950/20 shadow-xl shadow-amber-500/10 relative overflow-hidden ${isPurchased("full_unlock") ? "border-green-500/50" : ""}`}>
              {/* Glow effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
              
              {isPurchased("full_unlock") && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white">✓ Purchased</Badge>
                </div>
              )}
              
              <CardContent className="p-8 relative">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30">
                        <Crown className="h-7 w-7 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{fullUnlockProduct.name}</h3>
                        <p className="text-slate-400">{fullUnlockProduct.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6 mb-6">
                      {fullUnlockProduct.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-white">{fullUnlockProduct.price}</span>
                      <span className="text-slate-400 ml-2">one-time</span>
                    </div>
                    <Badge variant="outline" className="mb-4 text-green-400 border-green-500/30 bg-green-500/10">
                      {fullUnlockProduct.savings}
                    </Badge>
                    <div>
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0"
                        onClick={() => handleCheckout(fullUnlockProduct.planKey)}
                        disabled={loading === fullUnlockProduct.planKey || isPurchased("full_unlock")}
                      >
                        {loading === fullUnlockProduct.planKey ? (
                          "Processing..."
                        ) : isPurchased("full_unlock") ? (
                          "Already Unlocked"
                        ) : (
                          <>
                            Unlock Everything
                            <Sparkles className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Individual Products */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Or Pick What You Need</h2>
            <p className="text-slate-400">
              Just want one feature? No problem — buy only what interests you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {microProducts.map((product, index) => (
              <PurchaseCard
                key={product.id}
                product={product}
                onPurchase={handleCheckout}
                loading={loading === product.planKey}
                disabled={!!loading}
                alreadyPurchased={isPurchased(product.id)}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Comparison Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
                Compare & Save
              </Badge>
              <h2 className="text-3xl font-bold mb-2">Why Pay More?</h2>
              <p className="text-slate-400">
                Get professional-grade personality insights at a fraction of the cost
              </p>
            </div>

            <Card className="border-slate-800 bg-slate-900/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="text-left p-4 font-semibold text-slate-300">Assessment</th>
                      <th className="text-center p-4 font-semibold text-slate-300">They Charge</th>
                      <th className="text-center p-4 font-semibold text-slate-300">We Charge</th>
                      <th className="text-center p-4 font-semibold text-slate-300">You Save</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.map((comp, index) => {
                      const theirPrice = parseFloat(comp.price.replace("$", ""));
                      const ourPrice = parseFloat(comp.ourEquivalent.replace("$", ""));
                      const savings = Math.round(((theirPrice - ourPrice) / theirPrice) * 100);
                      
                      return (
                        <tr key={index} className="border-t border-slate-800">
                          <td className="p-4 font-medium text-slate-200">{comp.name}</td>
                          <td className="text-center p-4 text-slate-500 line-through">
                            {comp.price}
                          </td>
                          <td className="text-center p-4 font-bold text-amber-400">
                            {comp.ourEquivalent}
                          </td>
                          <td className="text-center p-4">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {savings}% less
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* B2B Section */}
        <section className="container mx-auto px-4 py-16 bg-slate-900/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-4">For Teams & Organizations</Badge>
            <h2 className="text-3xl font-bold mb-4">Need Bulk Assessments?</h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Get volume discounts on assessment codes for your team, candidates, or clients.
              Includes team dashboard and analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline" className="border-slate-700">
                <Link href="/contact">
                  <Building2 className="mr-2 h-4 w-4" />
                  Contact Sales
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/enterprise">
                  Learn About Enterprise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "How do one-time purchases work?",
                  a: "Each purchase unlocks that specific feature for your current assessment results. If you take the assessment again, you'll have access to the same features for your new results too.",
                },
                {
                  q: "What's included in the Full Unlock?",
                  a: "The Full Unlock ($7.99) includes all four premium features: Compatibility Reports, Career Deep Dive, Framework Bundle, and Growth Plan. It's the best value if you want everything.",
                },
                {
                  q: "Can I buy features later?",
                  a: "Absolutely! Your free results are saved forever. You can come back anytime and unlock additional features when you're ready.",
                },
                {
                  q: "Is there a refund policy?",
                  a: "Yes! We offer a 14-day money-back guarantee. If you're not satisfied with your purchase, contact us for a full refund.",
                },
                {
                  q: "Do you offer subscriptions?",
                  a: "We focus on one-time purchases so you only pay for what you need. No recurring charges or cancellation hassles.",
                },
              ].map((faq, index) => (
                <Card key={index} className="border-slate-800 bg-slate-900/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 text-slate-200">{faq.q}</h3>
                    <p className="text-sm text-slate-400">{faq.a}</p>
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
