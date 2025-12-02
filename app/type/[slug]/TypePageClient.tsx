"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/StructuredData";
import { InternalLinks } from "@/components/personality/InternalLinks";
import { ResearchCitations } from "@/components/personality/ResearchCitations";
import { TypeExamplesGrid } from "@/components/personality/TypeExamplesGrid";
import { archetypeExamples, archetypeDimensionDescriptions } from "@/lib/archetype-examples";
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
  Lock,
  DollarSign,
  Zap,
} from "lucide-react";
import { MarkdownText, CompactMarkdown } from "@/components/ui/markdown-text";
import { ExpandableText } from "@/components/ui/ExpandableText";
import { SectionedDescription } from "@/components/personality/SectionedDescription";
import { ArchetypeRadarMini, PopulationRarity } from "@/components/visualizations";
import type { TypePageContent } from "@/lib/type-content";
import type { Archetype } from "@/lib/archetypes";

interface TypePageClientProps {
  content: TypePageContent;
  relatedArchetypes: (Archetype | undefined)[];
}

export function TypePageClient({ content, relatedArchetypes }: TypePageClientProps) {
  const { archetype } = content;
  const examples = archetypeExamples[archetype.id] || [];
  const dimensionDescription = archetypeDimensionDescriptions[archetype.id] || "";

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Personality Types", url: "/type" },
    { name: archetype.name, url: `/type/${archetype.id}` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <section className={`relative py-10 sm:py-16 md:py-24 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${archetype.color} opacity-10`} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <span className="text-5xl sm:text-6xl">{archetype.icon}</span>
            </div>
            <Badge className="mb-3 sm:mb-4 bg-primary/20 text-primary border-primary/30 text-xs sm:text-sm px-3 sm:px-4 py-1">
              {archetype.rarity}% of the population
            </Badge>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-4">{archetype.name}</h1>
            <p className="text-lg sm:text-2xl md:text-3xl text-muted-foreground mb-6 sm:mb-8 px-2">
              {archetype.tagline}
            </p>
            <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
              <Link href="/assessment/intro">
                <span className="hidden sm:inline">Am I {archetype.name.replace("The ", "")}? Take the Free Test</span>
                <span className="sm:hidden">Take the Free Test</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-16 max-w-6xl">
        <div className="space-y-10 sm:space-y-16">
          {/* Description */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-xl sm:text-3xl">Understanding {archetype.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base">
                <SectionedDescription 
                  paragraphs={content.longDescription} 
                  typeName={archetype.name}
                />
              </CardContent>
            </Card>
          </motion.section>

          {/* Dimensional Profile & Rarity Visualizations */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <ArchetypeRadarMini
                archetypeId={archetype.id}
                archetypeName={archetype.name}
                size="md"
              />
            </motion.section>
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <PopulationRarity
                percentage={archetype.rarity}
                typeName={archetype.name}
                variant="dots"
              />
            </motion.section>
          </div>

          {/* Strengths & Growth */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-2xl border border-border/50 bg-gradient-to-br from-green-500/5 to-transparent h-full">
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-green-500/20">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    </div>
                    <CardTitle className="text-lg sm:text-2xl">Core Strengths</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm sm:text-base">
                  {content.detailedStrengths.map((strength, index) => (
                    <div key={index} className="space-y-1 sm:space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">{strength.title}</h4>
                      </div>
                      <div className="pl-6 text-muted-foreground">
                        <CompactMarkdown>{strength.description}</CompactMarkdown>
                      </div>
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
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-500/20">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                    </div>
                    <CardTitle className="text-lg sm:text-2xl">Growth Opportunities</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm sm:text-base">
                  {content.detailedGrowthAreas.map((area, index) => (
                    <div key={index} className="space-y-1 sm:space-y-2">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">{area.title}</h4>
                      </div>
                      <div className="pl-6 text-muted-foreground">
                        <CompactMarkdown>{area.description}</CompactMarkdown>
                      </div>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
              {archetype.name} in Relationships
            </h2>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
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
                  <ExpandableText 
                    text={content.inRelationships.romantic}
                    previewSentences={3}
                    expandThreshold={300}
                    textClassName="text-sm"
                    sentencesPerParagraph={3}
                  />
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
                  <ExpandableText 
                    text={content.inRelationships.friendship}
                    previewSentences={3}
                    expandThreshold={300}
                    textClassName="text-sm"
                    sentencesPerParagraph={3}
                  />
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
                  <ExpandableText 
                    text={content.inRelationships.professional}
                    previewSentences={3}
                    expandThreshold={300}
                    textClassName="text-sm"
                    sentencesPerParagraph={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Compatibility CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Card className="rounded-2xl border-2 border-dashed border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-rose-500/5">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20 flex-shrink-0">
                      <Heart className="h-6 w-6 text-pink-500" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-bold mb-1">See Your Compatibility with Other Types</h4>
                      <p className="text-sm text-muted-foreground">
                        Discover which types are most compatible with {archetype.name} in romance, friendship, and work.
                      </p>
                    </div>
                    <Button asChild variant="outline" className="border-pink-500/30 hover:bg-pink-500/10">
                      <Link href="/assessment/intro">
                        Take the Test
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.section>

          {/* Career Matches */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
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
                  <Badge variant="outline" className="hidden md:flex">
                    6 of 15+ shown
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {archetype.careerMatches.slice(0, 6).map((career, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                      <h4 className="font-semibold mb-2">{career.title}</h4>
                      <CompactMarkdown>{career.explanation}</CompactMarkdown>
                    </div>
                  ))}
                </div>

                {/* Premium Career Upsell */}
                <div className="rounded-xl border-2 border-dashed border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 flex-shrink-0">
                      <Sparkles className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">Get Your Personalized Career Report</h4>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-emerald-500" />
                          Salary ranges
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-blue-500" />
                          Fit scores
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-purple-500" />
                          Interview tips
                        </span>
                      </div>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 whitespace-nowrap">
                      <Link href="/assessment/intro">
                        Take the Assessment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Type Examples - Fictional + Public Figures */}
          {examples.length > 0 && (
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
                    <div>
                      <CardTitle className="text-2xl">Who Shares {archetype.name} Traits?</CardTitle>
                      <CardDescription>Characters and figures associated with this type</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <TypeExamplesGrid 
                    examples={examples} 
                    typeName={archetype.name.replace("The ", "")} 
                    typeDescription={dimensionDescription}
                  />
                </CardContent>
              </Card>
            </motion.section>
          )}

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
                  <ul className="space-y-4">
                    {content.commonMisunderstandings.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <CompactMarkdown>{item}</CompactMarkdown>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Framework Correlations */}
          {content.frameworkCorrelations && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Framework Correlations</CardTitle>
                      <CardDescription>How {archetype.name} maps to other systems</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CompactMarkdown>{content.frameworkCorrelations.description}</CompactMarkdown>
                  <div className="flex flex-wrap gap-4">
                    {content.frameworkCorrelations.mbtiTypes.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Similar MBTI Types:</p>
                        <div className="flex flex-wrap gap-2">
                          {content.frameworkCorrelations.mbtiTypes.map((type) => (
                            <Link key={type} href={`/type/mbti/${type.toLowerCase()}`}>
                              <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 hover:bg-blue-500/30 cursor-pointer">
                                {type}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {content.frameworkCorrelations.enneagramTypes.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Similar Enneagram Types:</p>
                        <div className="flex flex-wrap gap-2">
                          {content.frameworkCorrelations.enneagramTypes.map((type) => (
                            <Link key={type} href={`/type/enneagram/${type}`}>
                              <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30 hover:bg-purple-500/30 cursor-pointer">
                                Type {type}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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

          {/* Research Citations */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ResearchCitations variant="compact" />
          </motion.section>

          {/* Internal Links */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <InternalLinks 
              currentType={archetype.id} 
              currentFramework="prism" 
              variant="footer" 
            />
          </motion.section>

          {/* CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-8 sm:py-12"
          >
            <Card className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardContent className="p-6 sm:p-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                  Are You {archetype.name.replace("The ", "")}?
                </h2>
                <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Take our scientifically-validated personality assessment to discover 
                  your true type. It's free and takes just 10 minutes.
                </p>
                <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                  <Link href="/assessment/intro">
                    Discover Your Type
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
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
            "headline": `${archetype.name} Personality Type`,
            "description": archetype.tagline,
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
      {content.faqs && content.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": content.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      )}

      <Footer />
    </div>
  );
}

