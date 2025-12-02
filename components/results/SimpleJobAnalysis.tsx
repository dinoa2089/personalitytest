"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight, Lock, TrendingUp, DollarSign, Sparkles, Star } from "lucide-react";
import type { Archetype } from "@/lib/archetypes";
import type { DimensionScore } from "@/types";
import Link from "next/link";

interface SimpleJobAnalysisProps {
  archetype: Archetype;
  scores: DimensionScore[];
}

// Mock salary data for premium preview
const salaryRanges: Record<string, string> = {
  "Product Designer": "$85K - $150K",
  "Research Scientist": "$90K - $160K",
  "Entrepreneur": "$60K - $500K+",
  "Creative Director": "$100K - $200K",
  "Innovation Consultant": "$95K - $180K",
  "UX Researcher": "$80K - $140K",
  "Software Architect": "$140K - $220K",
  "Operations Manager": "$75K - $130K",
  "Data Scientist": "$100K - $180K",
  "Marketing Director": "$90K - $170K",
  // Default
  "default": "$70K - $150K",
};

export function SimpleJobAnalysis({ archetype, scores }: SimpleJobAnalysisProps) {
  // Get top 3 career matches for free, plus 3 more for locked preview
  const topCareers = archetype.careerMatches.slice(0, 3);
  const lockedCareers = archetype.careerMatches.slice(3, 6);
  
  // Calculate a simple fit percentage based on how well their scores match the archetype pattern
  const calculateFitScore = (index: number) => {
    // First career is always best fit, with slight variation
    const baseFit = 95 - (index * 4);
    const variance = Math.floor(Math.random() * 3);
    return baseFit - variance;
  };

  const getSalary = (title: string) => {
    return salaryRanges[title] || salaryRanges["default"];
  };

  return (
    <Card className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/20 to-indigo-950/20 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-white">Top Career Matches</CardTitle>
              <CardDescription className="text-blue-300/70">
                Roles where {archetype.name} personalities naturally excel
              </CardDescription>
            </div>
          </div>
          <Badge className="hidden md:flex bg-blue-500/20 text-blue-300 border-blue-500/30">
            3 of 15+ shown
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top 3 Careers - Unlocked */}
        <div className="space-y-3">
          {topCareers.map((career, index) => (
            <motion.div
              key={career.title}
              className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 hover:bg-blue-500/10 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {index === 0 && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                    <h4 className="font-bold text-lg text-white">{career.title}</h4>
                    <Badge 
                      className={index === 0 
                        ? "bg-green-500/20 text-green-400 border-green-500/30" 
                        : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      }
                    >
                      {index === 0 ? "Best Match" : `#${index + 1}`}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {career.explanation}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-blue-400">{calculateFitScore(index)}%</div>
                  <div className="text-xs text-zinc-500">fit score</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Locked Careers Preview */}
        {lockedCareers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-500 mt-6 mb-2">
              <Lock className="h-3.5 w-3.5" />
              <span>Premium career matches with salary data</span>
            </div>
            
            {lockedCareers.map((career, index) => (
              <motion.div
                key={career.title}
                className="relative rounded-xl border border-dashed border-zinc-700/50 bg-zinc-900/30 p-4 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                {/* Blur overlay */}
                <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-r from-transparent via-zinc-900/20 to-transparent" />
                
                <div className="flex items-center justify-between gap-4 relative">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-zinc-400">{career.title}</h4>
                      <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-500">
                        #{index + 4}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-1">
                      {career.explanation}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 relative">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600/50" />
                      <span className="text-sm font-medium text-emerald-500/60 blur-[3px] select-none">
                        {getSalary(career.title)}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-600">{calculateFitScore(index + 3)}% fit</div>
                  </div>
                </div>
                
                {/* Lock icon overlay */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Lock className="h-4 w-4 text-zinc-600" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Work Style Summary */}
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            <h4 className="font-semibold text-white">Your Ideal Work Environment</h4>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Based on your profile, you thrive in environments that offer{' '}
            <span className="text-indigo-300">
              {(scores.find(s => s.dimension === 'openness')?.percentile || 50) > 50 
                ? 'creativity and innovation' 
                : 'structure and clarity'}
            </span>, 
            <span className="text-indigo-300">
              {(scores.find(s => s.dimension === 'extraversion')?.percentile || 50) > 50 
                ? ' collaborative teamwork' 
                : ' focused independent work'}
            </span>, 
            and{' '}
            <span className="text-indigo-300">
              {(scores.find(s => s.dimension === 'adaptability')?.percentile || 50) > 50 
                ? 'dynamic, changing projects' 
                : 'consistent, stable processes'}
            </span>.
          </p>
        </div>

        {/* Premium Unlock CTA */}
        <div className="rounded-xl border-2 border-dashed border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-orange-950/20 p-5 mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex-shrink-0">
              <Sparkles className="h-6 w-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">Unlock All 15+ Career Matches</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-emerald-500" />
                  Salary ranges for every role
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-blue-500" />
                  Industry growth & demand data
                </li>
                <li className="flex items-center gap-2">
                  <Briefcase className="h-3 w-3 text-purple-500" />
                  Interview tips tailored to {archetype.name}
                </li>
              </ul>
            </div>
            <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border-0 whitespace-nowrap">
              <Link href="/pricing">
                See All Careers
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
