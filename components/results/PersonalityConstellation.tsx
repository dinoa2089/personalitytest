"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Brain,
  Zap,
  Star,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import type { DimensionScore } from "@/types";
import { calculateArchetype, getStrengthTitle } from "@/lib/archetypes";
import { DimensionsWheel } from "@/components/visualizations";
import type { MbtiDimensionScore } from "@/lib/mock-scoring";

interface PersonalityConstellationProps {
  scores: DimensionScore[];
  sessionId: string;
  mbtiScores?: MbtiDimensionScore[];  // Direct MBTI scores from framework-tagged questions
}

// MBTI type descriptions for deep dive
const mbtiDetails: Record<string, { title: string; desc: string; strengths: string[]; growth: string[] }> = {
  "INTJ": { 
    title: "The Mastermind", 
    desc: "Strategic, independent, and determined. You see the big picture and create long-term plans to achieve ambitious goals.",
    strengths: ["Strategic thinking", "Independent problem-solving", "Long-term vision", "Analytical depth"],
    growth: ["Opening up emotionally", "Collaborating with others", "Being patient with details"]
  },
  "INTP": { 
    title: "The Logician", 
    desc: "Analytical, objective, and reserved. You're driven by a desire to understand how things work at a fundamental level.",
    strengths: ["Logical analysis", "Innovation", "Pattern recognition", "Theoretical thinking"],
    growth: ["Following through on projects", "Social engagement", "Practical application"]
  },
  "ENTJ": { 
    title: "The Commander", 
    desc: "Decisive, ambitious, and strategic. You naturally take charge and organize people toward goals.",
    strengths: ["Leadership", "Strategic planning", "Decisiveness", "Efficiency"],
    growth: ["Emotional sensitivity", "Patience", "Accepting alternative views"]
  },
  "ENTP": { 
    title: "The Debater", 
    desc: "Quick-witted, curious, and intellectually playful. You love exploring ideas and challenging assumptions.",
    strengths: ["Debate skills", "Innovation", "Quick thinking", "Versatility"],
    growth: ["Focus and follow-through", "Emotional awareness", "Routine tasks"]
  },
  "INFJ": { 
    title: "The Advocate", 
    desc: "Insightful, principled, and compassionate. You have a clear vision for helping others and work tirelessly toward meaningful goals.",
    strengths: ["Intuition", "Empathy", "Vision", "Dedication to values"],
    growth: ["Self-care", "Handling criticism", "Practical matters"]
  },
  "INFP": { 
    title: "The Mediator", 
    desc: "Idealistic, empathetic, and creative. You're guided by strong personal values and seek to make the world better.",
    strengths: ["Creativity", "Empathy", "Writing/Art", "Deep thinking"],
    growth: ["Practical action", "Conflict handling", "Decision-making"]
  },
  "ENFJ": { 
    title: "The Protagonist", 
    desc: "Charismatic, empathetic, and inspiring. You naturally motivate others toward growth and positive change.",
    strengths: ["Leadership", "Communication", "Motivating others", "Empathy"],
    growth: ["Setting boundaries", "Self-focus", "Handling criticism"]
  },
  "ENFP": { 
    title: "The Campaigner", 
    desc: "Enthusiastic, creative, and sociable. You're energized by possibilities and making meaningful connections.",
    strengths: ["Creativity", "Enthusiasm", "People skills", "Adaptability"],
    growth: ["Focus", "Follow-through", "Routine tasks"]
  },
  "ISTJ": { 
    title: "The Logistician", 
    desc: "Responsible, thorough, and dependable. You value tradition and prefer proven methods.",
    strengths: ["Reliability", "Organization", "Detail focus", "Loyalty"],
    growth: ["Flexibility", "Emotional expression", "Embracing change"]
  },
  "ISFJ": { 
    title: "The Defender", 
    desc: "Supportive, reliable, and observant. You're deeply committed to helping others and maintaining harmony.",
    strengths: ["Supportiveness", "Reliability", "Memory for details", "Loyalty"],
    growth: ["Assertiveness", "Accepting change", "Saying no"]
  },
  "ESTJ": { 
    title: "The Executive", 
    desc: "Organized, logical, and assertive. You excel at managing people and processes efficiently.",
    strengths: ["Organization", "Leadership", "Decisiveness", "Dedication"],
    growth: ["Emotional sensitivity", "Flexibility", "Patience"]
  },
  "ESFJ": { 
    title: "The Consul", 
    desc: "Caring, social, and traditional. You're attentive to others' needs and work hard to create harmony.",
    strengths: ["Social harmony", "Practical help", "Loyalty", "Organization"],
    growth: ["Independence", "Handling criticism", "Embracing change"]
  },
  "ISTP": { 
    title: "The Virtuoso", 
    desc: "Practical, observant, and analytical. You're a natural troubleshooter who loves understanding how things work.",
    strengths: ["Problem-solving", "Hands-on skills", "Crisis management", "Adaptability"],
    growth: ["Long-term planning", "Emotional expression", "Commitment"]
  },
  "ISFP": { 
    title: "The Adventurer", 
    desc: "Gentle, sensitive, and artistic. You live in the moment and express yourself through action.",
    strengths: ["Artistic expression", "Adaptability", "Kindness", "Present awareness"],
    growth: ["Long-term planning", "Conflict handling", "Self-advocacy"]
  },
  "ESTP": { 
    title: "The Entrepreneur", 
    desc: "Energetic, pragmatic, and observant. You thrive on action and live in the moment.",
    strengths: ["Quick thinking", "Risk-taking", "Negotiation", "Practicality"],
    growth: ["Long-term planning", "Emotional depth", "Routine tasks"]
  },
  "ESFP": { 
    title: "The Entertainer", 
    desc: "Spontaneous, energetic, and fun-loving. You love being the center of attention and bringing joy to others.",
    strengths: ["Entertainment", "Social skills", "Practicality", "Spontaneity"],
    growth: ["Planning ahead", "Focus", "Handling criticism"]
  },
};

// DISC details
const discDetails: Record<string, { title: string; desc: string; strengths: string[]; communication: string }> = {
  "D": { 
    title: "Dominant", 
    desc: "You're direct, results-oriented, and confident. You focus on the bottom line and thrive when given authority.",
    strengths: ["Decision-making", "Problem-solving", "Leadership", "Achieving results"],
    communication: "Be direct, focus on results, avoid small talk, respect their time"
  },
  "I": { 
    title: "Influential", 
    desc: "You're outgoing, enthusiastic, and optimistic. You excel at motivating others and building relationships.",
    strengths: ["Persuasion", "Enthusiasm", "Collaboration", "Creativity"],
    communication: "Be friendly, allow for socializing, focus on the big picture, share stories"
  },
  "S": { 
    title: "Steady", 
    desc: "You're patient, reliable, and team-oriented. You value cooperation and bring calmness to stressful situations.",
    strengths: ["Patience", "Team support", "Listening", "Consistency"],
    communication: "Be patient, show appreciation, avoid sudden changes, be genuine"
  },
  "C": { 
    title: "Conscientious", 
    desc: "You're analytical, reserved, and precise. You value accuracy and think through decisions carefully.",
    strengths: ["Analysis", "Quality control", "Planning", "Systematic thinking"],
    communication: "Provide data, be accurate, allow processing time, focus on quality"
  },
};

// Enneagram details
const enneagramDetails: Record<string, { title: string; desc: string; core: string; fear: string }> = {
  "1": { title: "The Reformer", desc: "Principled, purposeful, self-controlled. You strive to improve yourself and the world.", core: "Integrity & Perfection", fear: "Being corrupt or defective" },
  "2": { title: "The Helper", desc: "Caring, generous, people-pleasing. You genuinely want to help and be loved.", core: "Love & Nurturing", fear: "Being unwanted or unworthy of love" },
  "3": { title: "The Achiever", desc: "Adaptable, driven, success-oriented. You're focused on accomplishment and recognition.", core: "Value & Success", fear: "Being worthless or a failure" },
  "4": { title: "The Individualist", desc: "Expressive, dramatic, self-aware. You have deep emotions and seek authenticity.", core: "Identity & Significance", fear: "Having no identity or significance" },
  "5": { title: "The Investigator", desc: "Perceptive, innovative, secretive. You seek to understand how things work.", core: "Competence & Knowledge", fear: "Being useless or incompetent" },
  "6": { title: "The Loyalist", desc: "Committed, responsible, anxious. You're reliable and anticipate problems.", core: "Security & Support", fear: "Being without support or guidance" },
  "7": { title: "The Enthusiast", desc: "Spontaneous, versatile, scattered. You're optimistic and keep options open.", core: "Freedom & Happiness", fear: "Being deprived or in pain" },
  "8": { title: "The Challenger", desc: "Self-confident, decisive, willful. You're protective and value strength.", core: "Control & Protection", fear: "Being harmed or controlled by others" },
  "9": { title: "The Peacemaker", desc: "Receptive, reassuring, agreeable. You create harmony and see all viewpoints.", core: "Peace & Stability", fear: "Loss or separation from others" },
};

// Calculate MBTI type from scores
// Uses direct MBTI scores when available, falls back to improved PRISM mapping
function calculateMBTI(scores: DimensionScore[], mbtiScores?: MbtiDimensionScore[]): string {
  // If we have direct MBTI scores from framework-tagged questions, use them
  if (mbtiScores && mbtiScores.length === 4) {
    const mbtiMap = mbtiScores.reduce((acc, s) => ({ ...acc, [s.dimension]: s }), {} as Record<string, MbtiDimensionScore>);
    return [
      mbtiMap['mbti_ei']?.letter || 'E',
      mbtiMap['mbti_sn']?.letter || 'N',
      mbtiMap['mbti_tf']?.letter || 'T',
      mbtiMap['mbti_jp']?.letter || 'J',
    ].join("");
  }
  
  // Fallback: improved PRISM mapping
  const scoreMap = scores.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
  
  // E/I: Direct extraversion mapping (works well)
  const E = scoreMap.extraversion || 50;
  
  // S/N: Openness -> N (high openness = intuitive)
  const N = scoreMap.openness || 50;
  
  // T/F: IMPROVED - NOT just agreeableness!
  // High agreeableness does NOT mean Feeling - ENTJs can be highly agreeable
  // Use: inverted agreeableness * 0.6 + emotional resilience * 0.4
  const agreeableness = scoreMap.agreeableness || 50;
  const resilience = scoreMap.emotionalResilience || 50;
  const T = (100 - agreeableness) * 0.6 + resilience * 0.4;  // Higher = more Thinking
  
  // J/P: IMPROVED - conscientiousness + inverted adaptability
  // Someone can be organized AND adaptable
  const conscientiousness = scoreMap.conscientiousness || 50;
  const adaptability = scoreMap.adaptability || 50;
  const J = conscientiousness * 0.6 + (100 - adaptability) * 0.4;  // Higher = more Judging
  
  return [
    E > 50 ? "E" : "I",
    N > 50 ? "N" : "S",
    T > 50 ? "T" : "F",
    J > 50 ? "J" : "P",
  ].join("");
}

function calculateDISC(scores: DimensionScore[]): string {
  const scoreMap = scores.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
  const D = 100 - (scoreMap.agreeableness || 50);
  const I = scoreMap.extraversion || 50;
  const S = 100 - (scoreMap.adaptability || 50);
  const C = scoreMap.conscientiousness || 50;
  
  const highest = Math.max(D, I, S, C);
  if (highest === D) return "D";
  if (highest === I) return "I";
  if (highest === S) return "S";
  return "C";
}

function calculateEnneagram(scores: DimensionScore[]): string {
  const scoreMap = scores.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
  
  const patterns = [
    { type: "1", score: (scoreMap.conscientiousness || 50) + (scoreMap.honestyHumility || 50) - (scoreMap.adaptability || 50) },
    { type: "2", score: (scoreMap.agreeableness || 50) + (scoreMap.extraversion || 50) },
    { type: "3", score: (scoreMap.conscientiousness || 50) + (scoreMap.extraversion || 50) + (scoreMap.adaptability || 50) },
    { type: "4", score: (scoreMap.openness || 50) + (100 - (scoreMap.emotionalResilience || 50)) },
    { type: "5", score: (scoreMap.openness || 50) + (100 - (scoreMap.extraversion || 50)) },
    { type: "6", score: (scoreMap.conscientiousness || 50) + (100 - (scoreMap.emotionalResilience || 50)) },
    { type: "7", score: (scoreMap.extraversion || 50) + (scoreMap.openness || 50) + (scoreMap.adaptability || 50) },
    { type: "8", score: (scoreMap.extraversion || 50) + (100 - (scoreMap.agreeableness || 50)) + (scoreMap.emotionalResilience || 50) },
    { type: "9", score: (scoreMap.agreeableness || 50) + (scoreMap.adaptability || 50) },
  ];
  
  return patterns.sort((a, b) => b.score - a.score)[0].type;
}

export function PersonalityConstellation({ scores, sessionId, mbtiScores }: PersonalityConstellationProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // Calculate all types
  const { primary: prismArchetype, matchPercentage } = calculateArchetype(scores);
  const mbtiType = calculateMBTI(scores, mbtiScores);
  const discType = calculateDISC(scores);
  const enneagramType = calculateEnneagram(scores);
  
  const mbtiInfo = mbtiDetails[mbtiType];
  const discInfo = discDetails[discType];
  const enneagramInfo = enneagramDetails[enneagramType];

  const toggleExpand = (card: string) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  return (
    <div className="space-y-6">
      {/* Hero Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Badge className="mb-4 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-300 border-violet-500/30">
          <Sparkles className="w-3 h-3 mr-2" />
          Complete Personality Profile
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
            Your Personality Constellation
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on your assessment, here's how you map across four major personality frameworks. 
          Click any card to explore deeper.
        </p>
      </motion.div>

      {/* Main Grid - 2x2 on desktop, stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* PRISM Card - Featured */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card 
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
              expandedCard === 'prism' 
                ? 'border-violet-500/50 bg-violet-50 dark:bg-gradient-to-br dark:from-violet-950/30 dark:to-fuchsia-950/30' 
                : 'border-violet-500/20 bg-violet-50/50 dark:bg-gradient-to-br dark:from-violet-950/20 dark:to-fuchsia-950/20 hover:border-violet-500/40'
            }`}
            onClick={() => toggleExpand('prism')}
          >
            {/* Decorative gradient orb */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl" />
            
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{prismArchetype.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 text-xs">
                        PRISM-7
                      </Badge>
                      <Badge variant="outline" className="text-xs border-violet-500/30 text-violet-700 dark:text-violet-300">
                        {matchPercentage}% Match
                      </Badge>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-violet-900 dark:text-white">{prismArchetype.name}</h3>
                    <p className="text-violet-700 dark:text-violet-300">{prismArchetype.tagline}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-violet-600 dark:text-violet-300">
                  {expandedCard === 'prism' ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>

              <AnimatePresence>
                {expandedCard === 'prism' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-violet-500/20 mt-6 space-y-4">
                      <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                        {prismArchetype.description[0]}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-100 dark:bg-green-500/10 rounded-xl p-4">
                          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                            <Star className="w-4 h-4" /> Top Strengths
                          </h4>
                          <ul className="text-sm text-slate-700 dark:text-zinc-300 space-y-1">
                            {prismArchetype.strengths.slice(0, 4).map((s, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                                <span>{getStrengthTitle(s)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-amber-100 dark:bg-amber-500/10 rounded-xl p-4">
                          <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Growth Areas
                          </h4>
                          <ul className="text-sm text-slate-700 dark:text-zinc-300 space-y-1">
                            {prismArchetype.growthAreas.slice(0, 4).map((g, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                                <span>{getStrengthTitle(g)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700">
                          <Link href={`/type/${prismArchetype.id}`}>
                            Explore Full Profile
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* MBTI Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 h-full border-2 ${
              expandedCard === 'mbti' 
                ? 'border-blue-500/50 bg-blue-50 dark:bg-gradient-to-br dark:from-blue-950/30 dark:to-cyan-950/30' 
                : 'border-blue-500/20 bg-blue-50/50 dark:bg-gradient-to-br dark:from-blue-950/20 dark:to-cyan-950/20 hover:border-blue-500/40'
            }`}
            onClick={() => toggleExpand('mbti')}
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
            
            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs mb-1">
                      MBTI
                    </Badge>
                    <h3 className="text-2xl font-bold text-blue-900 dark:text-white">{mbtiType}</h3>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-blue-600 dark:text-blue-300">
                  {expandedCard === 'mbti' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              <p className="text-blue-700 dark:text-blue-300 font-medium">{mbtiInfo.title}</p>
              <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2">{mbtiInfo.desc}</p>

              <AnimatePresence>
                {expandedCard === 'mbti' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-blue-500/20 mt-4 space-y-3">
                      <div className="bg-blue-100 dark:bg-blue-500/10 rounded-lg p-3">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-2">Key Strengths</h4>
                        <div className="flex flex-wrap gap-2">
                          {mbtiInfo.strengths.map((s, i) => (
                            <Badge key={i} variant="outline" className="border-blue-500/30 text-blue-700 dark:text-blue-200 text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button asChild size="sm" variant="outline" className="w-full border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/10">
                        <Link href={`/type/mbti/${mbtiType.toLowerCase()}`}>
                          Deep Dive into {mbtiType}
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enneagram Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card 
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 h-full border-2 ${
              expandedCard === 'enneagram' 
                ? 'border-emerald-500/50 bg-emerald-50 dark:bg-gradient-to-br dark:from-emerald-950/30 dark:to-teal-950/30' 
                : 'border-emerald-500/20 bg-emerald-50/50 dark:bg-gradient-to-br dark:from-emerald-950/20 dark:to-teal-950/20 hover:border-emerald-500/40'
            }`}
            onClick={() => toggleExpand('enneagram')}
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
            
            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-2xl font-bold text-white">
                    {enneagramType}
                  </div>
                  <div>
                    <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs mb-1">
                      Enneagram
                    </Badge>
                    <h3 className="text-xl font-bold text-emerald-900 dark:text-white">Type {enneagramType}</h3>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-emerald-600 dark:text-emerald-300">
                  {expandedCard === 'enneagram' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              <p className="text-emerald-700 dark:text-emerald-300 font-medium">{enneagramInfo.title}</p>
              <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2">{enneagramInfo.desc}</p>

              <AnimatePresence>
                {expandedCard === 'enneagram' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-emerald-500/20 mt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-emerald-100 dark:bg-emerald-500/10 rounded-lg p-3">
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Core Drive</p>
                          <p className="text-sm text-emerald-900 dark:text-white font-medium">{enneagramInfo.core}</p>
                        </div>
                        <div className="bg-rose-100 dark:bg-rose-500/10 rounded-lg p-3">
                          <p className="text-xs text-rose-600 dark:text-rose-400 mb-1">Core Fear</p>
                          <p className="text-sm text-rose-900 dark:text-white font-medium">{enneagramInfo.fear}</p>
                        </div>
                      </div>
                      
                      <Button asChild size="sm" variant="outline" className="w-full border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10">
                        <Link href={`/type/enneagram/${enneagramType}`}>
                          Explore Type {enneagramType}
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* DISC Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2"
        >
          <Card 
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
              expandedCard === 'disc' 
                ? 'border-orange-500/50 bg-orange-50 dark:bg-gradient-to-br dark:from-orange-950/30 dark:to-red-950/30' 
                : 'border-orange-500/20 bg-orange-50/50 dark:bg-gradient-to-br dark:from-orange-950/20 dark:to-red-950/20 hover:border-orange-500/40'
            }`}
            onClick={() => toggleExpand('disc')}
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
            
            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30 text-xs">
                        DISC Profile
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-orange-900 dark:text-white">{discInfo.title}</h3>
                    <p className="text-orange-700 dark:text-orange-300">Primary Style: <span className="font-bold text-2xl">{discType}</span></p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-orange-600 dark:text-orange-300">
                  {expandedCard === 'disc' ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-zinc-400 mt-3">{discInfo.desc}</p>

              <AnimatePresence>
                {expandedCard === 'disc' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-orange-500/20 mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-orange-100 dark:bg-orange-500/10 rounded-xl p-4">
                          <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Your Strengths</h4>
                          <div className="flex flex-wrap gap-2">
                            {discInfo.strengths.map((s, i) => (
                              <Badge key={i} variant="outline" className="border-orange-500/30 text-orange-700 dark:text-orange-200">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="bg-orange-100 dark:bg-orange-500/10 rounded-xl p-4">
                          <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">How to Communicate With You</h4>
                          <p className="text-sm text-slate-700 dark:text-zinc-300">{discInfo.communication}</p>
                        </div>
                      </div>
                      
                      {/* DISC Visual Breakdown */}
                      <div className="bg-slate-100 dark:bg-zinc-900/50 rounded-xl p-4">
                        <h4 className="font-semibold text-slate-700 dark:text-zinc-300 mb-3">Your DISC Breakdown</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {['D', 'I', 'S', 'C'].map((type) => {
                            const isActive = type === discType;
                            const colors: Record<string, string> = {
                              'D': 'bg-red-500',
                              'I': 'bg-yellow-500',
                              'S': 'bg-green-500',
                              'C': 'bg-blue-500',
                            };
                            return (
                              <div 
                                key={type} 
                                className={`text-center p-3 rounded-lg transition-all ${
                                  isActive ? `${colors[type]}/20 ring-2 ring-${colors[type].replace('bg-', '')}/50` : 'bg-slate-200/50 dark:bg-zinc-800/50'
                                }`}
                              >
                                <div className={`text-2xl font-bold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-500'}`}>
                                  {type}
                                </div>
                                <div className={`text-xs ${isActive ? 'text-slate-700 dark:text-zinc-300' : 'text-slate-500 dark:text-zinc-600'}`}>
                                  {type === 'D' && 'Dominant'}
                                  {type === 'I' && 'Influential'}
                                  {type === 'S' && 'Steady'}
                                  {type === 'C' && 'Conscientious'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary Badges Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-3 pt-4"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-full border border-violet-500/20">
          <span className="text-xl">{prismArchetype.icon}</span>
          <span className="text-sm font-medium text-violet-300">{prismArchetype.name.replace("The ", "")}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
          <Brain className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">{mbtiType}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <span className="text-sm font-bold text-emerald-400">{enneagramType}</span>
          <span className="text-sm font-medium text-emerald-300">{enneagramInfo.title.replace("The ", "")}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full border border-orange-500/20">
          <Zap className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-orange-300">{discType} - {discInfo.title}</span>
        </div>
      </motion.div>

      {/* Interactive Dimensions Wheel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <DimensionsWheel showTitle={false} className="border-violet-500/20" />
      </motion.div>
    </div>
  );
}

