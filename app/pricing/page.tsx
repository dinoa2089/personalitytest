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
import {
  Check,
  Sparkles,
  Building2,
  Briefcase,
  Heart,
  TrendingUp,
  Layers,
  Gift,
  ArrowRight,
  Shield,
  Star,
  Crown,
  Brain,
  Users,
  Target,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

// Simplified to just 2 products for individuals
const FULL_RESULTS_PRICE = "$4.99";
const FULL_RESULTS_PRICE_VALUE = 4.99;

// What's included in free vs paid
const freeFeatures = [
  "Your primary archetype name",
  "Basic 7-dimension overview",
  "Radar chart visualization",
  "Share your type badge",
];

const paidFeatures = [
  "Complete dimensional breakdown with insights",
  "All 15+ career matches with fit scores",
  "Full MBTI & Enneagram mappings",
  "Compatibility profile for relationships",
  "Famous examples who share your type",
  "Personalized growth recommendations",
  "Downloadable PDF report",
  "Shareable detailed infographic",
];

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") || null;
  
  const [loading, setLoading] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

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
          // Check if they have full unlock or any legacy premium
          setHasPurchased(data.full_unlock || data.career || data.frameworks);
        }
      } catch (error) {
        console.error("Error checking purchases:", error);
      }
    }
    
    if (isLoaded && user) {
      checkPurchases();
    }
  }, [isLoaded, user, sessionId]);

  const handleCheckout = async () => {
    if (!isLoaded) {
      toast.error("Please wait while we load your account...");
      return;
    }
    if (!user?.id) {
      toast.error("Please sign in to purchase");
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-violet-50 via-white to-fuchsia-50/30">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-fuchsia-200/30 rounded-full blur-3xl" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Badge className="mb-6 bg-violet-100 text-violet-700 border-violet-200 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 inline" />
              One-Time Purchase, Yours Forever
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Unlock Your Complete{" "}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent">
                Personality Profile
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Go beyond the basics. Get your full career matches, framework mappings, 
              compatibility insights, and personalized growth plan.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-green-600" />
                Secure payment via Stripe
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-violet-600" />
                Instant access
              </span>
              <span className="flex items-center gap-1.5">
                <Gift className="h-4 w-4 text-fuchsia-600" />
                14-day money-back guarantee
              </span>
            </div>
          </motion.div>
        </section>

        {/* Pricing Comparison */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/50 bg-white/80 backdrop-blur-sm h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Gift className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-xl">Free Results</CardTitle>
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">$0</span>
                  </div>
                  <CardDescription className="mt-2">
                    A taste of your personality profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {freeFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/assessment">
                        Take Free Assessment
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Full Results - Recommended */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className={`border-2 border-violet-500/50 bg-gradient-to-br from-violet-50 to-fuchsia-50 shadow-xl shadow-violet-500/10 h-full relative ${hasPurchased ? "border-green-500/50" : ""}`}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm rounded-full">
                  Recommended
                </div>
                
                {hasPurchased && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600 text-white">✓ Purchased</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-violet-600" />
                    <CardTitle className="text-xl">Full Results</CardTitle>
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{FULL_RESULTS_PRICE}</span>
                    <span className="text-muted-foreground ml-2">one-time</span>
                  </div>
                  <CardDescription className="mt-2">
                    Your complete personalized profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {paidFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground">
                        <Check className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <Button
                      className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
                      onClick={handleCheckout}
                      disabled={loading || hasPurchased}
                    >
                      {loading ? (
                        "Processing..."
                      ) : hasPurchased ? (
                        "Already Unlocked"
                      ) : (
                        <>
                          Unlock Full Results
                          <Sparkles className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="container mx-auto px-4 py-16 border-t border-border/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What's In Your Full Report?</h2>
              <p className="text-muted-foreground">
                Everything you need to understand yourself and leverage your strengths
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Brain,
                  title: "Deep Personality Insights",
                  description: "Detailed breakdown of all 7 HEXACO+ dimensions with what each means for you specifically."
                },
                {
                  icon: Briefcase,
                  title: "Career Matches",
                  description: "15+ career paths that align with your personality, with fit scores and growth potential."
                },
                {
                  icon: Layers,
                  title: "Framework Mappings",
                  description: "See your MBTI type, Enneagram number, and how they connect to your PRISM-7 profile."
                },
                {
                  icon: Heart,
                  title: "Compatibility Profile",
                  description: "Understand how you relate to others in romance, friendship, and professional settings."
                },
                {
                  icon: Users,
                  title: "Famous Examples",
                  description: "Discover well-known people who share your personality profile and what you can learn from them."
                },
                {
                  icon: TrendingUp,
                  title: "Growth Recommendations",
                  description: "Personalized suggestions for leveraging your strengths and developing growth areas."
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-white/60 border border-border/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 flex-shrink-0">
                    <item.icon className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* B2B Section */}
        <section className="container mx-auto px-4 py-16 border-t border-border/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-4 bg-slate-100 text-slate-700 border-slate-200">
              <Building2 className="h-3.5 w-3.5 mr-1.5 inline" />
              For Teams & Hiring
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Need Assessments for Your Team?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Screen candidates for job fit, build better teams, and make data-driven hiring decisions.
              Volume pricing available.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/for-employers">
                  <Target className="mr-2 h-4 w-4" />
                  Learn About Employer Plans
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/contact">
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16 border-t border-border/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Common Questions</h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "What do I get for free?",
                  a: "The free assessment gives you your primary archetype, a basic overview of your 7 personality dimensions, and a simple shareable badge. It's enough to understand your core type."
                },
                {
                  q: "What's included in the Full Results?",
                  a: "Full Results unlocks your complete profile: detailed dimension breakdowns, all 15+ career matches with fit scores, full MBTI & Enneagram mappings, compatibility insights, famous examples, growth recommendations, and a downloadable PDF."
                },
                {
                  q: "Is this a subscription?",
                  a: "No. It's a one-time purchase of $4.99. You pay once and own your full results forever. No recurring charges."
                },
                {
                  q: "Can I upgrade later?",
                  a: "Yes! You can take the free assessment first and upgrade to Full Results anytime. Your scores are saved."
                },
                {
                  q: "Is there a refund policy?",
                  a: "Yes. We offer a 14-day money-back guarantee. If you're not satisfied, contact us for a full refund."
                },
              ].map((faq, index) => (
                <Card key={index} className="border-border/50 bg-white/60">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50">
              <CardContent className="p-8">
                <Sparkles className="h-10 w-10 text-violet-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Ready to Discover Your Full Profile?</h2>
                <p className="text-muted-foreground mb-6">
                  Start with the free assessment. Upgrade when you're ready.
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white">
                  <Link href="/assessment">
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
