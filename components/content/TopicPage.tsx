"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  ArrowRight, 
  BookOpen, 
  ChevronRight,
  Clock,
  Share2,
  Users,
  Sparkles
} from "lucide-react";
import type { GeneratedContent, ContentTopic } from "@/lib/content/types";
import { MarkdownText, CompactMarkdown } from "@/components/ui/markdown-text";
import { SalaryRangeChart, CompatibilityMiniChart } from "@/components/visualizations";
import { 
  getRelatedMBTITypes, 
  getRelatedEnneagramTypes,
  getPRISMLinksForMBTI,
  getPRISMLinksForEnneagram,
  TOPIC_METADATA
} from "@/lib/internal-links";

interface TopicPageProps {
  content: GeneratedContent;
  typeName: string;
  typeSlug: string;
  typeIcon?: string;
  framework: "prism" | "mbti" | "enneagram";
}

const TOPIC_ICONS: Record<ContentTopic, string> = {
  learning: "📚",
  careers: "💼",
  relationships: "💕",
  communication: "💬",
  stress: "🧘",
  leadership: "👑",
  growth: "🌱",
  workplace: "🏢",
  compatibility: "🤝"
};

const TOPIC_NAMES: Record<ContentTopic, string> = {
  learning: "Learning Style",
  careers: "Career Guide",
  relationships: "Relationships",
  communication: "Communication",
  stress: "Stress & Coping",
  leadership: "Leadership",
  growth: "Personal Growth",
  workplace: "At Work",
  compatibility: "Compatibility"
};

export function TopicPage({ 
  content, 
  typeName, 
  typeSlug, 
  typeIcon,
  framework 
}: TopicPageProps) {
  const readingTime = Math.ceil(content.wordCount / 200);
  
  const getBaseUrl = () => {
    switch (framework) {
      case "prism": return `/type/${typeSlug}`;
      case "mbti": return `/type/mbti/${typeSlug}`;
      case "enneagram": return `/type/enneagram/${typeSlug}`;
    }
  };

  // Get related type links based on framework
  const relatedTypes = framework === "mbti" 
    ? getRelatedMBTITypes(typeSlug)
    : framework === "enneagram"
    ? getRelatedEnneagramTypes(typeSlug)
    : [];
  
  // Get PRISM correlation links
  const prismLinks = framework === "mbti"
    ? getPRISMLinksForMBTI(typeSlug)
    : framework === "enneagram"
    ? getPRISMLinksForEnneagram(typeSlug)
    : [];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Personality Types", url: "/type" },
    { name: typeName, url: getBaseUrl() },
    { name: TOPIC_NAMES[content.topic], url: `${getBaseUrl()}/${content.topic}` }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />

      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 sm:px-6 pt-6 pb-2">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, i) => (
            <li key={crumb.url} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-4 w-4" />}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-foreground">{crumb.name}</span>
              ) : (
                <Link href={crumb.url} className="hover:text-foreground transition-colors">
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{typeIcon || TOPIC_ICONS[content.topic]}</span>
              <Badge variant="outline" className="text-sm">
                {framework === "prism" ? "PRISM-7" : framework.toUpperCase()}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {typeof content.title === 'string' 
                ? content.title 
                : (content.title as { title?: string })?.title || 'Untitled'}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {typeof content.metaDescription === 'string' 
                ? content.metaDescription 
                : `Explore ${typeName} personality insights`}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {content.wordCount.toLocaleString()} words
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            {/* Article Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-none"
            >
              {/* Introduction */}
              <div className="mb-8 text-lg leading-relaxed">
                <MarkdownText variant="full">{content.introduction}</MarkdownText>
              </div>

              {/* Topic-Specific Visualizations */}
              {content.topic === "careers" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10"
                >
                  <SalaryRangeChart
                    careers={[
                      { title: "Senior Role", minSalary: 80000, maxSalary: 150000, medianSalary: 110000, fitScore: 92 },
                      { title: "Mid-Level Position", minSalary: 55000, maxSalary: 95000, medianSalary: 72000, fitScore: 85 },
                      { title: "Entry Level", minSalary: 40000, maxSalary: 65000, medianSalary: 52000, fitScore: 78 },
                      { title: "Leadership Track", minSalary: 120000, maxSalary: 200000, medianSalary: 155000, fitScore: 88 },
                    ]}
                    showTitle={true}
                  />
                </motion.div>
              )}

              {(content.topic === "relationships" || content.topic === "compatibility") && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10"
                >
                  <CompatibilityMiniChart
                    currentType={typeName}
                    framework={framework}
                    compatibilities={[
                      { type: "ENFP", typeName: "Campaigner", romantic: 92, friendship: 88, work: 75, typeUrl: "/type/mbti/enfp" },
                      { type: "INFJ", typeName: "Advocate", romantic: 88, friendship: 90, work: 82, typeUrl: "/type/mbti/infj" },
                      { type: "ENTP", typeName: "Debater", romantic: 78, friendship: 85, work: 88, typeUrl: "/type/mbti/entp" },
                      { type: "INTJ", typeName: "Architect", romantic: 72, friendship: 78, work: 90, typeUrl: "/type/mbti/intj" },
                      { type: "ISFJ", typeName: "Defender", romantic: 65, friendship: 70, work: 68, typeUrl: "/type/mbti/isfj" },
                    ]}
                    showTitle={true}
                  />
                </motion.div>
              )}

              {/* Sections */}
              {content.sections.map((section, index) => (
                <section key={index} className="mb-10">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    {typeof section.heading === 'string' ? section.heading : (section.heading as { title?: string })?.title || 'Section'}
                  </h2>
                  <MarkdownText variant="full">
                    {typeof section.content === 'string' 
                      ? section.content 
                      : `**${(section.content as { title?: string })?.title || ''}**\n\n${(section.content as { description?: string })?.description || ''}`}
                  </MarkdownText>
                  
                  {section.subsections?.map((sub, subIndex) => (
                    <div key={subIndex} className="ml-4 mt-6 border-l-2 border-primary/20 pl-4">
                      <h3 className="text-xl font-semibold mb-3 text-foreground">
                        {typeof sub.heading === 'string' ? sub.heading : (sub.heading as { title?: string })?.title || ''}
                      </h3>
                      <MarkdownText variant="compact">
                        {typeof sub.content === 'string' 
                          ? sub.content 
                          : (sub.content as { description?: string })?.description || ''}
                      </MarkdownText>
                    </div>
                  ))}
                </section>
              ))}

              {/* Key Takeaways */}
              {content.keyTakeaways.length > 0 && (
                <section className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>✨</span> Key Takeaways
                  </h2>
                  <ul className="space-y-2">
                    {content.keyTakeaways.map((takeaway, i) => {
                      let text: string;
                      if (typeof takeaway === 'string') {
                        text = takeaway;
                      } else {
                        const title = typeof takeaway.title === 'string' ? takeaway.title : '';
                        const desc = typeof takeaway.description === 'string' ? takeaway.description : '';
                        text = `${title} ${desc}`.trim();
                      }
                      return (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* FAQs */}
              {content.faqs.length > 0 && (
                <section className="mt-12 not-prose">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {content.faqs.map((faq, i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{faq.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CompactMarkdown>{faq.answer}</CompactMarkdown>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Articles - Same Topic, Different Types */}
              {relatedTypes.length > 0 && (
                <section className="mt-12 not-prose">
                  <h2 className="text-2xl font-bold mb-6">
                    {TOPIC_METADATA[content.topic]?.name || content.topic} for Related Types
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {relatedTypes.slice(0, 4).map((link) => (
                      <Link
                        key={link.url}
                        href={`${link.url}/${content.topic}`}
                        className="group"
                      >
                        <Card className="h-full hover:border-primary/50 transition-colors">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold group-hover:text-primary transition-colors">
                                  {link.title} {TOPIC_METADATA[content.topic]?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {TOPIC_METADATA[content.topic]?.icon} Explore {content.topic} guide
                                </p>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </motion.article>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="sticky top-24 space-y-6">
                {/* Other Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">More About {typeName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {content.relatedTopics.map((topic) => (
                      <Link
                        key={topic}
                        href={`${getBaseUrl()}/${topic}`}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <span>{TOPIC_ICONS[topic as ContentTopic]}</span>
                        <span className="text-sm">{TOPIC_NAMES[topic as ContentTopic]}</span>
                        <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Discover Your Type</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Take our free personality assessment to find out if you're a {typeName}.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/assessment/intro">
                        Take the Test
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Related Types */}
                {relatedTypes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Related Types
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {relatedTypes.slice(0, 4).map((link) => (
                        <Link
                          key={link.url}
                          href={link.url}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span className="text-sm font-medium">{link.title}</span>
                          <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* PRISM-7 Correlation */}
                {prismLinks.length > 0 && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        PRISM-7 Match
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-3">
                        Discover how this type maps to PRISM-7 archetypes
                      </p>
                      {prismLinks.slice(0, 3).map((link) => (
                        <Link
                          key={link.url}
                          href={link.url}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <span className="text-sm font-medium text-primary">{link.title}</span>
                          <ChevronRight className="h-4 w-4 ml-auto text-primary/60" />
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Share */}
                <Card>
                  <CardContent className="pt-6">
                    <Button variant="outline" className="w-full gap-2">
                      <Share2 className="h-4 w-4" />
                      Share This Article
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.aside>
          </div>
        </div>
      </main>

      {/* FAQ Schema */}
      {content.faqs.length > 0 && (
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

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": typeof content.title === 'string' 
              ? content.title 
              : (content.title as { title?: string })?.title || typeName,
            "description": typeof content.metaDescription === 'string' 
              ? content.metaDescription 
              : `Learn about ${typeName}`,
            "author": {
              "@type": "Organization",
              "name": "PRISM-7"
            },
            "publisher": {
              "@type": "Organization",
              "name": "PRISM-7"
            },
            "datePublished": content.generatedAt,
            "wordCount": content.wordCount
          })
        }}
      />

      <Footer />
    </div>
  );
}

