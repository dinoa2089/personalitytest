"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ArrowRight, 
  Heart, 
  Briefcase, 
  UserPlus,
  Lock,
  Sparkles
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

function CompareContent() {
  const searchParams = useSearchParams();
  const withSessionId = searchParams.get("with");
  const [inviterData, setInviterData] = useState<{
    archetype: string;
    icon: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (withSessionId) {
      // Fetch the inviter's basic info
      fetchInviterInfo(withSessionId);
    } else {
      setLoading(false);
    }
  }, [withSessionId]);

  const fetchInviterInfo = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/results/${sessionId}/basic`);
      if (response.ok) {
        const data = await response.json();
        setInviterData(data);
      }
    } catch (error) {
      console.error("Failed to fetch inviter info:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {withSessionId && inviterData ? (
          // Someone invited you to compare
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-4 py-1">
                Compatibility Check
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold">
                You've Been Invited! 🎉
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Someone wants to see how compatible you are. Take the free assessment 
                and discover your compatibility across work, friendship, and more.
              </p>
            </div>

            {/* Inviter Card */}
            <Card className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{inviterData.icon}</div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">They are</p>
                    <h2 className="text-3xl font-bold">{inviterData.archetype}</h2>
                    <p className="text-muted-foreground">{inviterData.name} wants to compare with you</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Discover */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">What You'll Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold">Overall Compatibility Score</div>
                      <div className="text-sm text-muted-foreground">
                        See your overall match percentage
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                    <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold">Work Partnership</div>
                      <div className="text-sm text-muted-foreground">
                        How well you'd collaborate professionally
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                    <Heart className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold">Relationship Dynamics</div>
                      <div className="text-sm text-muted-foreground">
                        Communication and conflict styles
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold">Growth Opportunities</div>
                      <div className="text-sm text-muted-foreground">
                        How you can help each other grow
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center space-y-4">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href={`/assessment/intro?compare=${withSessionId}`}>
                  Take the Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Takes about 5-10 minutes • No credit card required
              </p>
            </div>
          </motion.div>
        ) : (
          // No invitation - general compare page
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Check Your Compatibility
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover how well you match with friends, partners, and colleagues 
                across multiple relationship dimensions.
              </p>
            </div>

            {/* Compatibility Modes */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Briefcase, title: "Work Partners", desc: "Professional collaboration" },
                { icon: Heart, title: "Romantic", desc: "Intimate relationships" },
                { icon: Users, title: "Friendship", desc: "Social connections" },
                { icon: UserPlus, title: "Parenting", desc: "Parent-child dynamics" },
              ].map((mode, index) => (
                <Card key={mode.title} className="rounded-xl hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <mode.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">{mode.title}</h3>
                    <p className="text-sm text-muted-foreground">{mode.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                First, take the assessment to discover your personality type
              </p>
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/assessment/intro">
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}

