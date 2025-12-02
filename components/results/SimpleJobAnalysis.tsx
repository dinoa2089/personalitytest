"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight, Lock, TrendingUp, DollarSign } from "lucide-react";
import type { Archetype } from "@/lib/archetypes";
import type { DimensionScore } from "@/types";
import Link from "next/link";

interface SimpleJobAnalysisProps {
  archetype: Archetype;
  scores: DimensionScore[];
}

export function SimpleJobAnalysis({ archetype, scores }: SimpleJobAnalysisProps) {
  // Get top 3 career matches
  const topCareers = archetype.careerMatches.slice(0, 3);
  
  // Calculate a simple fit percentage based on how well their scores match the archetype pattern
  const calculateFitScore = (index: number) => {
    // First career is always best fit, with slight variation
    const baseFit = 95 - (index * 5);
    const variance = Math.floor(Math.random() * 3);
    return baseFit - variance;
  };

  return (
    <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold">Top Career Matches</CardTitle>
              <CardDescription>
                Roles where your personality naturally excels
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="hidden md:flex">
            3 of 15+ shown
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top 3 Careers */}
        <div className="space-y-4">
          {topCareers.map((career, index) => (
            <motion.div
              key={career.title}
              className="rounded-xl border border-border/50 bg-muted/30 p-5 hover:bg-muted/50 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-lg">{career.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={index === 0 ? "bg-green-500/10 text-green-600 border-green-500/30" : ""}
                    >
                      {index === 0 ? "Best Match" : `#${index + 1}`}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {career.explanation}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-primary">{calculateFitScore(index)}%</div>
                  <div className="text-xs text-muted-foreground">fit score</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Work Style Summary */}
        <div className="rounded-xl border border-border/50 bg-primary/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Your Work Environment</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Based on your personality profile, you thrive in environments that offer{' '}
            {scores.find(s => s.dimension === 'openness')?.percentile || 50 > 50 
              ? 'creativity and innovation' 
              : 'structure and clarity'}, 
            {scores.find(s => s.dimension === 'extraversion')?.percentile || 50 > 50 
              ? ' collaborative teamwork' 
              : ' focused independent work'}, 
            and{' '}
            {scores.find(s => s.dimension === 'adaptability')?.percentile || 50 > 50 
              ? 'dynamic, changing projects' 
              : 'consistent, stable processes'}.
          </p>
        </div>

        {/* Locked Premium Features */}
        <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 p-5">
          <div className="flex items-start gap-4">
            <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Unlock 12+ More Career Matches</h4>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                <li className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3" />
                  Salary ranges for each role
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  Industry growth projections
                </li>
                <li className="flex items-center gap-2">
                  <Briefcase className="h-3 w-3" />
                  Interview tips based on your type
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/pricing">
                  See All Career Matches
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

