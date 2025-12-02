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
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Target,
  AlertTriangle,
  Lightbulb,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Flame,
} from "lucide-react";
import { FamousExamplesGrid } from "@/components/personality/FamousExamplesGrid";
import type { EnneagramType } from "@/lib/enneagram-content";
import { getRelatedEnneagramTypes, getTopicLinksForType, TOPIC_METADATA } from "@/lib/internal-links";
import type { ContentTopic } from "@/lib/content/types";

interface EnneagramTypePageClientProps {
  content: EnneagramType;
}

export function EnneagramTypePageClient({ content }: EnneagramTypePageClientProps) {
  const typeNum = content.number.toString();
  const topicLinks = getTopicLinksForType("enneagram", typeNum);
  const relatedTypes = getRelatedEnneagramTypes(typeNum);

  const typeColors: Record<number, string> = {
    1: "from-slate-500 to-gray-600",
    2: "from-pink-500 to-rose-600",
    3: "from-amber-500 to-yellow-600",
    4: "from-purple-500 to-violet-600",
    5: "from-blue-500 to-indigo-600",
    6: "from-green-500 to-emerald-600",
    7: "from-orange-500 to-red-500",
    8: "from-red-600 to-rose-700",
    9: "from-teal-500 to-cyan-600",
  };

  const bgColor = typeColors[content.number] || "from-primary to-purple-600";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-10`} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${bgColor} text-white text-5xl font-bold mb-6`}>
              {content.number}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className={`bg-gradient-to-r ${bgColor} bg-clip-text text-transparent`}>
                {content.name}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {content.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className={`text-lg px-8 py-6 bg-gradient-to-r ${bgColor} hover:opacity-90`}>
                <Link href="/assessment/intro">
                  Am I a Type {content.number}? Take the Free Test
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
          {/* Core Motivations */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
                      <Shield className="h-5 w-5 text-red-600" />
                    </div>
                    <CardTitle className="text-xl">Core Fear</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.coreFear}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
                      <Heart className="h-5 w-5 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">Core Desire</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.coreDesire}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                      <Flame className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">Core Motivation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.coreMotivation}</p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Description */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl">Understanding Type {content.number}: {content.name}</CardTitle>
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

          {/* Levels of Health */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Levels of Health</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-transparent">
                <CardHeader>
                  <Badge className="w-fit bg-green-500 text-white mb-2">Healthy</Badge>
                  <CardTitle className="text-xl">At Their Best</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{content.healthLevels.healthy}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-border/50">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">Average</Badge>
                  <CardTitle className="text-xl">Typical Expression</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{content.healthLevels.average}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent">
                <CardHeader>
                  <Badge className="w-fit bg-red-500 text-white mb-2">Unhealthy</Badge>
                  <CardTitle className="text-xl">Under Stress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{content.healthLevels.unhealthy}</p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Wings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Wings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">{content.wings.lower.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.wings.lower.description}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">{content.wings.higher.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.wings.higher.description}</p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Growth & Stress Lines */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Growth & Stress Paths</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Growth → Type {content.growthLine.number}</CardTitle>
                      <CardDescription>Integration path</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.growthLine.description}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
                      <ArrowDownRight className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Stress → Type {content.stressLine.number}</CardTitle>
                      <CardDescription>Disintegration path</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.stressLine.description}</p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Mid-page CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-8"
          >
            <Card className="rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-3">Think You're a Type {content.number}?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Enneagram typing can be subjective. Get a more objective, dimensional assessment 
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

          {/* Strengths & Challenges */}
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
                    <CardTitle className="text-2xl">Strengths</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {content.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{strength}</span>
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
                    <CardTitle className="text-2xl">Challenges</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {content.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{challenge}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>
          </div>

          {/* Relationships */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20">
                    <Heart className="h-5 w-5 text-pink-600" />
                  </div>
                  <CardTitle className="text-2xl">Type {content.number} in Relationships</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{content.inRelationships}</p>
              </CardContent>
            </Card>
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
                    <CardTitle className="text-2xl">Career Paths for Type {content.number}s</CardTitle>
                    <CardDescription>Roles where {content.name}s naturally excel</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.careerPaths.map((career, index) => (
                    <div key={index} className="rounded-lg border border-border/50 bg-muted/30 p-4">
                      <h4 className="font-semibold mb-1">{career.title}</h4>
                      <p className="text-sm text-muted-foreground">{career.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Topic Guides */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">
              Deep Dive: Type {content.number} Guides
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topicLinks.map((link) => (
                <Link key={link.url} href={link.url} className="group">
                  <Card className="rounded-xl border border-border/50 hover:border-primary/50 transition-all h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{TOPIC_METADATA[link.title.toLowerCase().replace(' style', '').replace(' guide', '').replace(' & coping', '').replace('at ', '').replace('personal ', '') as ContentTopic]?.icon || '📖'}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            Type {content.number} {link.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
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
                  <CardTitle className="text-2xl">Famous Type {content.number}s</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <FamousExamplesGrid 
                  examples={content.famousExamples}
                  typeName={`Type ${content.number}`}
                  variant="full"
                  maxVisible={8}
                  colorAccent="purple"
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
                    <CardDescription>How Type {content.number} maps to dimensional assessment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If you identify as a Type {content.number}, you likely score <strong>{content.prismCorrelation.keyDimensions}</strong> on 
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

          {/* Science Section */}
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
                    <CardTitle className="text-2xl">The Science: Enneagram Limitations</CardTitle>
                    <CardDescription>What the research says</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  While the Enneagram offers valuable frameworks for self-reflection and growth, 
                  the scientific community has identified significant limitations:
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Limited Validation</h4>
                    <p className="text-sm text-muted-foreground">
                      Unlike the Big Five or HEXACO, the Enneagram has limited peer-reviewed empirical 
                      validation in academic psychology.
                    </p>
                  </div>
                  
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Subjective Typing</h4>
                    <p className="text-sm text-muted-foreground">
                      Determining your type often relies on self-reflection rather than objective 
                      measurement, leading to inconsistent results.
                    </p>
                  </div>
                  
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">No Confidence Intervals</h4>
                    <p className="text-sm text-muted-foreground">
                      Results are presented as definitive types without acknowledging measurement 
                      uncertainty or borderline cases.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3">The PRISM-7 Difference</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Objective measurement</strong> — standardized questions with validated scoring</span>
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

          {/* Related Enneagram Types */}
          {relatedTypes.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-2xl border border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Related Enneagram Types</CardTitle>
                  <CardDescription>Wings and integration/disintegration lines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {relatedTypes.map((link) => (
                      <Link key={link.url} href={link.url}>
                        <Badge 
                          variant="outline" 
                          className="text-base py-2 px-4 hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-pointer"
                        >
                          {link.title}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

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
                  Ready for Objective Personality Insights?
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
            "headline": `Enneagram Type ${content.number}: ${content.name}`,
            "description": content.tagline,
            "author": {
              "@type": "Organization",
              "name": "PRISM-7"
            },
            "publisher": {
              "@type": "Organization",
              "name": "PRISM-7"
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
                "name": `What is Enneagram Type ${content.number}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": content.description[0]
                }
              },
              {
                "@type": "Question",
                "name": `What is the core fear of Type ${content.number}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": content.coreFear
                }
              },
              {
                "@type": "Question",
                "name": `What careers are best for Enneagram Type ${content.number}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Type ${content.number}s often excel in careers like ${content.careerPaths.map(c => c.title).join(", ")}.`
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

