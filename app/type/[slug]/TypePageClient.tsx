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
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import type { TypePageContent } from "@/lib/type-content";
import type { Archetype } from "@/lib/archetypes";

interface TypePageClientProps {
  content: TypePageContent;
  relatedArchetypes: (Archetype | undefined)[];
}

export function TypePageClient({ content, relatedArchetypes }: TypePageClientProps) {
  const { archetype } = content;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />

      {/* Hero Section */}
      <section className={`relative py-20 md:py-32 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${archetype.color} opacity-10`} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-6xl">{archetype.icon}</span>
            </div>
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 text-sm px-4 py-1">
              {archetype.rarity}% of the population
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">{archetype.name}</h1>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-8">
              {archetype.tagline}
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/assessment/intro">
                Am I {archetype.name.replace("The ", "")}? Take the Free Test
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
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
                <CardTitle className="text-3xl">Understanding {archetype.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.longDescription.map((paragraph, index) => (
                  <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>
          </motion.section>

          {/* Strengths & Growth */}
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
                  {content.detailedStrengths.map((strength, index) => (
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
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                    <CardTitle className="text-2xl">Growth Opportunities</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {content.detailedGrowthAreas.map((area, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-600" />
                        <h4 className="font-semibold">{area.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {area.description}
                      </p>
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
            <h2 className="text-3xl font-bold mb-8 text-center">
              {archetype.name} in Relationships
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
                    <CardTitle className="text-xl">Professional</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {content.inRelationships.professional}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Career Matches */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Career Paths</CardTitle>
                    <CardDescription>
                      Roles where {archetype.name}s naturally excel
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {archetype.careerMatches.slice(0, 6).map((career, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                      <h4 className="font-semibold mb-1">{career.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {career.explanation}
                      </p>
                    </div>
                  ))}
                </div>
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
                  <CardTitle className="text-2xl">Famous {archetype.name}s</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {archetype.famousExamples.map((example, index) => (
                    <div
                      key={index}
                      className="rounded-full border border-border/50 bg-muted/30 px-4 py-2"
                    >
                      <span className="font-medium">{example.name}</span>
                      <span className="text-muted-foreground ml-2">• {example.role}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Common Misunderstandings */}
          {content.commonMisunderstandings.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-2xl border border-border/50 bg-gradient-to-br from-red-500/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl">Common Misunderstandings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {content.commonMisunderstandings.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Related Types */}
          {relatedArchetypes.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6">Related Personality Types</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedArchetypes.map((related) => related && (
                  <Link key={related.id} href={`/type/${related.id}`}>
                    <Card className="rounded-xl border border-border/50 hover:border-primary/50 transition-colors h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{related.icon}</span>
                          <div>
                            <h3 className="font-semibold">{related.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {related.rarity}%
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {related.tagline}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <Card className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Are You {archetype.name.replace("The ", "")}?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Take our scientifically-validated personality assessment to discover 
                  your true type. It's free and takes just 10 minutes.
                </p>
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/assessment/intro">
                    Discover Your Type
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

