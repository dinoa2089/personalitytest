import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PRISM-7 | Which of 12 Personality Types Are You?",
  description: "Take the free 7-minute personality test that's more accurate than Myers-Briggs. Scientifically validated HEXACO+ assessment with dimensional insights, not vague categories. No signup required.",
  keywords: ["personality test", "free personality test", "MBTI alternative", "personality types", "HEXACO", "scientific personality assessment"],
  openGraph: {
    title: "PRISM-7 | Which of 12 Personality Types Are You?",
    description: "Take the free 7-minute personality test that's more accurate than Myers-Briggs. Scientifically validated with dimensional insights.",
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          
          <Container className="relative z-10">
            <div className="mx-auto max-w-4xl text-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-tight">
                  Which of{" "}
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-gradient">
                    12 Personality Types
                  </span>
                  {" "}Are You?
                </h1>
                <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground sm:text-2xl">
                  Take the <span className="text-foreground font-semibold">7-minute test</span> that's more accurate than Myers-Briggs.
                  <br className="hidden sm:block" />
                  <span className="text-foreground font-medium">Scientifically validated. No signup required. Free results.</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button asChild size="lg" className="text-lg px-10 py-6 h-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link href="/assessment">Start Assessment</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-10 py-6 h-auto border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                  <Link href="/science">Learn More</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-6 pt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Free</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span>No signup required</span>
                <div className="h-4 w-px bg-border" />
                <span>Scientifically validated</span>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-b from-muted/30 via-background to-background">
          <Container>
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Why <span className="gradient-text">PRISM-7</span>?
              </h2>
              <p className="text-xl text-muted-foreground">
                More accurate than Myers-Briggs, more engaging than Big Five
              </p>
            </div>
            <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <Link href="/science" className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 cursor-pointer">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Scientifically Validated</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Based on HEXACO+ model with 7 core dimensions. Transparent methodology with confidence intervals.
                  </p>
                </div>
              </Link>
              
              <Link href="/science" className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 cursor-pointer">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Quick & Comprehensive</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get precise results in just 35 questions (7 min) or go deeper with 125 questions (15 min).
                  </p>
                </div>
              </Link>
              
              <Link href="/science" className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 cursor-pointer">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Actionable Insights</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Practical recommendations for career, relationships, and personal growth based on your unique profile.
                  </p>
                </div>
              </Link>
              
              <Link href="/science" className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 cursor-pointer">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Framework Mapping</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    See how your results map to Myers-Briggs, CliftonStrengths, and Enneagram for familiar reference points.
                  </p>
                </div>
              </Link>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/5" />
          <Container className="relative z-10">
            <div className="mx-auto max-w-3xl text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Ready to discover your{" "}
                  <span className="gradient-text">authentic self</span>?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Take our free assessment and get personalized insights in minutes.
                </p>
              </div>
              <div className="pt-4">
                <Button asChild size="lg" className="text-lg px-12 py-7 h-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 glow-primary-hover">
                  <Link href="/assessment">Start Free Assessment</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
