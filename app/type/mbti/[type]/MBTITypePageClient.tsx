"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Star,
  TrendingUp,
  Heart,
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Brain,
  Target,
  AlertTriangle,
  Lightbulb,
  Zap,
} from "lucide-react";
import { FamousExamplesGrid } from "@/components/personality/FamousExamplesGrid";
import type { MBTIType } from "@/lib/mbti-content";

interface MBTITypePageClientProps {
  content: MBTIType;
}

export function MBTITypePageClient({ content }: MBTITypePageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-600 border-blue-500/30 text-lg px-6 py-2">
              {content.rarity}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {content.code}
              </span>
            </h1>
            <p className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {content.nickname}
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {content.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/assessment/intro">
                  Am I Really an {content.code}? Take the Free Test
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="space-y-16">
          {/* Description */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl">Understanding the {content.code}</CardTitle>
                <CardDescription className="text-lg">{content.nickname}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.description.map((paragraph, index) => (
                  <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>
          </motion.section>

          {/* Cognitive Functions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Brain className="h-8 w-8 text-purple-600" />
              Cognitive Function Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-500 text-white">Dominant</Badge>
                    <CardTitle className="text-xl">{content.cognitiveFunctions.dominant.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.cognitiveFunctions.dominant.description}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-500 text-white">Auxiliary</Badge>
                    <CardTitle className="text-xl">{content.cognitiveFunctions.auxiliary.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.cognitiveFunctions.auxiliary.description}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Tertiary</Badge>
                    <CardTitle className="text-xl">{content.cognitiveFunctions.tertiary.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.cognitiveFunctions.tertiary.description}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-amber-500/50 text-amber-600">Inferior</Badge>
                    <CardTitle className="text-xl">{content.cognitiveFunctions.inferior.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.cognitiveFunctions.inferior.description}</p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Strengths & Blindspots */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-2xl border border-border/50 bg-gradient-to-br from-green-500/5 to-transparent h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Core Strengths</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {content.strengths.map((strength, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <h4 className="font-semibold">{strength.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {strength.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-2xl border border-border/50 bg-gradient-to-br from-amber-500/5 to-transparent h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <CardTitle className="text-2xl">Potential Blindspots</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {content.blindspots.map((blindspot, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-600" />
                        <h4 className="font-semibold">{blindspot.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {blindspot.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>
          </div>

          {/* Mid-page CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-8"
          >
            <Card className="rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-3">Think You're an {content.code}?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  MBTI categories can be misleading. Get a more accurate, dimensional assessment 
                  with confidence intervals that show where you truly fall on each trait.
                </p>
                <Button asChild size="lg">
                  <Link href="/assessment/intro">
                    Take the Free PRISM-7 Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.section>

          {/* Relationships */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">
              {content.code} in Relationships
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="rounded-2xl border border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20">
                      <Heart className="h-5 w-5 text-pink-600" />
                    </div>
                    <CardTitle className="text-xl">Romantic</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {content.inRelationships.romantic}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">Friendship</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {content.inRelationships.friendship}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">Workplace</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {content.inRelationships.workplace}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Career Paths */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Career Paths for {content.code}s</CardTitle>
                    <CardDescription>
                      Roles where {content.nickname}s naturally excel
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.careerPaths.map((career, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                      <h4 className="font-semibold mb-1">{career.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {career.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Growth Advice */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border border-border/50 bg-gradient-to-br from-green-500/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Growth & Development</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {content.growthAdvice.map((advice, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{advice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.section>

          {/* Famous Examples */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/20">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                  </div>
                  <CardTitle className="text-2xl">Famous {content.code}s</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <FamousExamplesGrid 
                  examples={content.famousExamples}
                  typeName={content.code}
                  variant="full"
                  maxVisible={8}
                  colorAccent="blue"
                />
              </CardContent>
            </Card>
          </motion.section>

          {/* PRISM-7 Correlation */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">PRISM-7 Correlation</CardTitle>
                    <CardDescription>How {content.code} maps to dimensional assessment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If you identify as an {content.code}, you likely score <strong>{content.prismCorrelation.keyDimensions}</strong> on 
                  the PRISM-7 dimensional assessment. You may find strong alignment with these PRISM-7 archetypes:
                </p>
                <div className="flex flex-wrap gap-2">
                  {content.prismCorrelation.likelyTypes.map((type) => (
                    <Link key={type} href={`/type/${type.toLowerCase()}`}>
                      <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 cursor-pointer">
                        {type}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Science Section - Why MBTI Falls Short */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">The Science: Why MBTI Falls Short</CardTitle>
                    <CardDescription>What the research actually says</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  While MBTI is popular and can provide useful frameworks for self-reflection, 
                  the scientific community has identified significant limitations:
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Poor Reliability</h4>
                    <p className="text-sm text-muted-foreground">
                      39-76% of people get a different type when retaking the test after just 5 weeks. 
                      Your "type" shouldn't change that often.
                    </p>
                  </div>
                  
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">False Dichotomies</h4>
                    <p className="text-sm text-muted-foreground">
                      You're not "T or F"—personality traits exist on a spectrum. Someone scoring 51% Thinking 
                      is treated the same as someone scoring 99%.
                    </p>
                  </div>
                  
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Barnum Effect</h4>
                    <p className="text-sm text-muted-foreground">
                      Type descriptions are often vague enough that most people would agree with them 
                      regardless of their actual type.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3">The PRISM-7 Difference</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>85-92% test-retest reliability</strong> — your results stay consistent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Dimensional scores</strong> — see exactly where you fall on each trait</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Confidence intervals</strong> — know the precision of your results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Based on HEXACO+</strong> — the most validated model in modern psychology</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Final CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <Card className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready for a More Accurate Assessment?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Discover your true personality profile with PRISM-7—the scientifically-validated 
                  evolution of personality assessment. Free, no signup required.
                </p>
                <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
                  <Link href="/assessment/intro">
                    Take the Free PRISM-7 Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>

      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${content.code} Personality Type: ${content.nickname}`,
            "description": content.tagline,
            "author": {
              "@type": "Organization",
              "name": "PRISM-7"
            },
            "publisher": {
              "@type": "Organization",
              "name": "PRISM-7"
            },
            "mainEntityOfPage": {
              "@type": "WebPage"
            }
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `What is an ${content.code} personality type?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": content.description[0]
                }
              },
              {
                "@type": "Question",
                "name": `What careers are best for ${content.code}s?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `${content.code}s often excel in careers like ${content.careerPaths.map(c => c.title).join(", ")}.`
                }
              },
              {
                "@type": "Question",
                "name": `What are ${content.code} strengths?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": content.strengths.map(s => s.title).join(", ")
                }
              }
            ]
          })
        }}
      />

      <Footer />
    </div>
  );
}

