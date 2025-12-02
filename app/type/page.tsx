"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Target,
  Users,
  Star,
  Compass,
  BookOpen
} from "lucide-react";
import { archetypes } from "@/lib/archetypes";
import { ArchetypeDistribution } from "@/components/visualizations";

// MBTI type data
const mbtiTypes = [
  { code: "INTJ", nickname: "Architect" },
  { code: "INTP", nickname: "Logician" },
  { code: "ENTJ", nickname: "Commander" },
  { code: "ENTP", nickname: "Debater" },
  { code: "INFJ", nickname: "Advocate" },
  { code: "INFP", nickname: "Mediator" },
  { code: "ENFJ", nickname: "Protagonist" },
  { code: "ENFP", nickname: "Campaigner" },
  { code: "ISTJ", nickname: "Logistician" },
  { code: "ISFJ", nickname: "Defender" },
  { code: "ESTJ", nickname: "Executive" },
  { code: "ESFJ", nickname: "Consul" },
  { code: "ISTP", nickname: "Virtuoso" },
  { code: "ISFP", nickname: "Adventurer" },
  { code: "ESTP", nickname: "Entrepreneur" },
  { code: "ESFP", nickname: "Entertainer" },
];

// Enneagram types
const enneagramTypesList = [
  { number: 1, name: "The Reformer" },
  { number: 2, name: "The Helper" },
  { number: 3, name: "The Achiever" },
  { number: 4, name: "The Individualist" },
  { number: 5, name: "The Investigator" },
  { number: 6, name: "The Loyalist" },
  { number: 7, name: "The Enthusiast" },
  { number: 8, name: "The Challenger" },
  { number: 9, name: "The Peacemaker" },
];

export default function TypeHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-100/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-300/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-violet-100 text-violet-700 border-violet-200 text-sm px-4 py-1.5">
              <Compass className="w-4 h-4 mr-2" />
              Personality Explorer
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent">
                Explore Personality Types
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Dive deep into the world of personality psychology. Choose a framework 
              to explore types, traits, and discover what makes you unique.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 border-0 text-white">
              <Link href="/assessment/intro">
                Take the Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Framework Selection */}
      <main className="container mx-auto px-4 pb-20 max-w-7xl">
        <div className="space-y-16">
          
          {/* PRISM-7 Section - Featured */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50 border-violet-200 rounded-3xl overflow-hidden shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 mb-1">
                      Recommended
                    </Badge>
                    <CardTitle className="text-3xl font-bold text-slate-900">PRISM-7 Archetypes</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-slate-600 text-lg">
                  Our scientifically-validated dimensional approach to personality. Based on HEXACO+ research 
                  with 85-92% test-retest reliability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                  {archetypes.slice(0, 12).map((archetype) => (
                    <Link 
                      key={archetype.id} 
                      href={`/type/${archetype.id}`}
                      className="group"
                    >
                      <div className="bg-white hover:bg-violet-50 border border-slate-200 hover:border-violet-300 rounded-xl p-4 transition-all h-full shadow-sm">
                        <div className="text-3xl mb-2">{archetype.icon}</div>
                        <h3 className="font-semibold text-slate-900 text-sm group-hover:text-violet-600 transition-colors">
                          {archetype.name.replace("The ", "")}
                        </h3>
                        <p className="text-xs text-slate-500">{archetype.rarity}%</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Archetype Distribution Visualization */}
                <div className="mt-6 mb-6">
                  <ArchetypeDistribution showTitle={false} variant="donut" />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-100">
                    <Link href="/assessment/intro">
                      <Target className="w-4 h-4 mr-2" />
                      Discover Your Archetype
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="text-slate-600 hover:text-slate-900">
                    <Link href="/science">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn About the Science
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* MBTI Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-slate-900">MBTI Types</CardTitle>
                    <CardDescription className="text-slate-500">
                      16 Personality Types • Cognitive Functions
                    </CardDescription>
                  </div>
                </div>
                <p className="text-slate-600 mt-2">
                  Explore the popular Myers-Briggs framework with 16 distinct types. 
                  Understand cognitive functions, relationships, and career paths.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 mb-6">
                  {mbtiTypes.map((type) => (
                    <Link 
                      key={type.code} 
                      href={`/type/mbti/${type.code.toLowerCase()}`}
                      className="group"
                    >
                      <div className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg p-3 transition-all text-center">
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {type.code}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{type.nickname}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <Star className="w-4 h-4 flex-shrink-0" />
                  <span>
                    While MBTI is popular, research shows 39-76% of people get different results on retakes. 
                    <Link href="/science" className="underline ml-1 hover:text-amber-800">Learn why dimensional assessments are more reliable →</Link>
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Enneagram Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-slate-900">Enneagram Types</CardTitle>
                    <CardDescription className="text-slate-500">
                      9 Core Types • Wings & Growth Paths
                    </CardDescription>
                  </div>
                </div>
                <p className="text-slate-600 mt-2">
                  Discover the Enneagram's nine interconnected personality types. 
                  Explore core motivations, fears, and paths to personal growth.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 mb-6">
                  {enneagramTypesList.map((type) => (
                    <Link 
                      key={type.number} 
                      href={`/type/enneagram/${type.number}`}
                      className="group"
                    >
                      <div className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg p-3 transition-all text-center">
                        <h3 className="font-bold text-2xl text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {type.number}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{type.name.replace("The ", "")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-slate-500">
                  The Enneagram focuses on core motivations and paths to growth. 
                  Each type has two "wings" and lines connecting to other types during stress and growth.
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <Card className="bg-gradient-to-br from-violet-100 to-fuchsia-100 border-violet-200 rounded-3xl shadow-sm">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                  Not Sure Which Framework to Explore?
                </h2>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  Take our free PRISM-7 assessment to discover your unique personality profile 
                  with scientific precision. No signup required.
                </p>
                <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 border-0 text-white">
                  <Link href="/assessment/intro">
                    Start Your Free Assessment
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

