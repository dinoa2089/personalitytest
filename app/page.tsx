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
  Users,
  Star,
  CheckCircle2,
  Clock,
  Shield
} from "lucide-react";
import { archetypes } from "@/lib/archetypes";

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
  { number: 1, name: "Reformer" },
  { number: 2, name: "Helper" },
  { number: 3, name: "Achiever" },
  { number: 4, name: "Individualist" },
  { number: 5, name: "Investigator" },
  { number: 6, name: "Loyalist" },
  { number: 7, name: "Enthusiast" },
  { number: 8, name: "Challenger" },
  { number: 9, name: "Peacemaker" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/15 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-violet-500/20 text-violet-300 border-violet-500/30 text-sm px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Free • 7 Minutes • Science-Backed
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Which of{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                12 Personality Types
              </span>
              {" "}Are You?
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover your authentic self with the most accurate personality test available. 
              More reliable than Myers-Briggs, backed by HEXACO+ research.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Button asChild size="lg" className="text-lg px-10 py-7 h-auto bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0 shadow-lg shadow-violet-500/25">
                <Link href="/assessment">
                  Start Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-10 py-7 h-auto border-zinc-700 text-white hover:bg-zinc-800/50 hover:border-zinc-600">
                <Link href="/science">
                  How It Works
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-violet-400" />
                <span>Results in 7 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span>85-92% test-retest reliability</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Framework Selection */}
      <main className="container mx-auto px-4 pb-20 max-w-7xl">
        <div className="space-y-12">
          
          {/* PRISM-7 Section - Featured */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-violet-950/60 to-fuchsia-950/40 border-violet-500/30 rounded-3xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 mb-1">
                      Recommended
                    </Badge>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-white">PRISM-7 Archetypes</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-zinc-300 text-lg leading-relaxed">
                  Our scientifically-validated dimensional approach to personality. Based on HEXACO+ research 
                  with 85-92% test-retest reliability—far more accurate than traditional tests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
                  {archetypes.slice(0, 12).map((archetype) => (
                    <Link 
                      key={archetype.id} 
                      href={`/type/${archetype.id}`}
                      className="group"
                    >
                      <div className="bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-violet-500/50 rounded-xl p-4 transition-all duration-200 h-full">
                        <div className="text-3xl mb-2">{archetype.icon}</div>
                        <h3 className="font-semibold text-white text-sm group-hover:text-violet-300 transition-colors leading-tight">
                          {archetype.name.replace("The ", "")}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">{archetype.rarity}% of people</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0">
                    <Link href="/assessment">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Take the Free Assessment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-violet-500/50 text-violet-300 hover:bg-violet-500/20 hover:text-violet-200">
                    <Link href="/science">
                      Learn About the Science
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Why PRISM-7 Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Scientifically Validated</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Based on HEXACO+ model with 7 core dimensions. Transparent methodology with confidence intervals you can trust.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Quick & Comprehensive</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Get precise results in just 35 questions (7 min). Go deeper with our extended 125-question assessment.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400 mb-4">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Actionable Insights</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Practical recommendations for career, relationships, and personal growth based on your unique profile.
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* MBTI Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 rounded-3xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">MBTI Types</CardTitle>
                    <CardDescription className="text-zinc-400">
                      16 Personality Types • Cognitive Functions
                    </CardDescription>
                  </div>
                </div>
                <p className="text-zinc-300 mt-2 leading-relaxed">
                  Explore the popular Myers-Briggs framework with 16 distinct types. 
                  Understand cognitive functions, relationships, and career paths.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6">
                  {mbtiTypes.map((type) => (
                    <Link 
                      key={type.code} 
                      href={`/type/mbti/${type.code.toLowerCase()}`}
                      className="group"
                    >
                      <div className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-blue-500/50 rounded-lg p-3 transition-all text-center">
                        <h3 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                          {type.code}
                        </h3>
                        <p className="text-xs text-zinc-500 truncate">{type.nickname}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="flex items-start gap-2 text-sm text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    While MBTI is popular, research shows 39-76% of people get different results on retakes. 
                    <Link href="/science" className="underline ml-1 hover:text-amber-200 font-medium">Learn why dimensional assessments are more reliable →</Link>
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
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 rounded-3xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">Enneagram Types</CardTitle>
                    <CardDescription className="text-zinc-400">
                      9 Core Types • Wings & Growth Paths
                    </CardDescription>
                  </div>
                </div>
                <p className="text-zinc-300 mt-2 leading-relaxed">
                  Discover the Enneagram&apos;s nine interconnected personality types. 
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
                      <div className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-emerald-500/50 rounded-lg p-3 transition-all text-center">
                        <h3 className="font-bold text-2xl text-white group-hover:text-emerald-300 transition-colors">
                          {type.number}
                        </h3>
                        <p className="text-xs text-zinc-500 truncate">{type.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  The Enneagram focuses on core motivations and paths to growth. 
                  Each type has two &quot;wings&quot; and lines connecting to other types during stress and growth.
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center py-12"
          >
            <Card className="bg-gradient-to-br from-violet-950/60 to-fuchsia-950/40 border-violet-500/20 rounded-3xl">
              <CardContent className="p-10 md:p-14">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
                  Ready to Discover Your{" "}
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                    Authentic Self
                  </span>
                  ?
                </h2>
                <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Take our free PRISM-7 assessment to discover your unique personality profile 
                  with scientific precision. No signup required.
                </p>
                <Button asChild size="lg" className="text-lg px-10 py-7 h-auto bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0 shadow-lg shadow-violet-500/25">
                  <Link href="/assessment">
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
