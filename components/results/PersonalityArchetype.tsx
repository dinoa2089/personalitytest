"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateArchetype, type Archetype } from "@/lib/archetypes";
import type { DimensionScore } from "@/types";
import {
  Sparkles,
  TrendingUp,
  Users,
  Briefcase,
  Heart,
  MessageSquare,
  Star,
  AlertCircle,
  Award,
  Zap,
} from "lucide-react";

interface PersonalityArchetypeProps {
  scores: DimensionScore[];
}

export function PersonalityArchetype({ scores }: PersonalityArchetypeProps) {
  const { primary, matchPercentage, secondary } = calculateArchetype(scores);

  return (
    <div className="space-y-8">
      {/* Primary Archetype Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`rounded-2xl border-2 border-border/50 bg-gradient-to-br ${primary.color} shadow-xl overflow-hidden`}>
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm" />
          <CardHeader className="relative z-10 pb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
                  Your Personality Type
                </Badge>
                <CardTitle className="text-4xl md:text-5xl font-bold mb-2">
                  {primary.name}
                </CardTitle>
                <CardDescription className="text-lg md:text-xl text-muted-foreground font-medium">
                  {primary.tagline}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {matchPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Match</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            {/* Description */}
            <div className="space-y-3">
              {primary.description.map((paragraph, index) => (
                <p key={index} className="text-base md:text-lg leading-relaxed text-foreground">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Strengths & Growth Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border/50 bg-green-500/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-green-600" />
                  <h3 className="text-xl font-bold">Your Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {primary.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm md:text-base">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-muted-foreground">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border/50 bg-amber-500/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  <h3 className="text-xl font-bold">Growth Areas</h3>
                </div>
                <ul className="space-y-2">
                  {primary.growthAreas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm md:text-base">
                      <span className="text-amber-600 mt-1">→</span>
                      <span className="text-muted-foreground">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Secondary Archetypes */}
      {secondary.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">You're Also Close To...</CardTitle>
              <CardDescription>
                Your personality also shows similarities to these archetypes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {secondary.map((item, index) => (
                  <div
                    key={item.archetype.id}
                    className="rounded-xl border border-border/50 bg-muted/30 p-5 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg">{item.archetype.name}</h4>
                      <Badge variant="outline">{item.matchPercentage}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.archetype.tagline}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Detailed Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Career Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl">Career Matches</CardTitle>
              </div>
              <CardDescription>
                Roles where your personality traits naturally excel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {primary.careerMatches.map((career, index) => (
                <div key={index} className="rounded-lg border border-border/50 bg-muted/30 p-4 hover:bg-muted/50 transition-colors">
                  <h4 className="font-semibold mb-1">{career.title}</h4>
                  <p className="text-sm text-muted-foreground">{career.explanation}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Work & Relationship Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                  <Zap className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Work Style</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{primary.workStyle}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600">
                  <Heart className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Relationship Style</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{primary.relationshipStyle}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Communication, At Your Best, When Stressed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Communication Style</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{primary.communicationStyle}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">At Your Best</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{primary.atYourBest}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg">When Stressed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{primary.whenStressed}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Famous Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl">Famous Examples</CardTitle>
            </div>
            <CardDescription>
              Well-known people who share similar personality patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {primary.famousExamples.map((example, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center hover:bg-muted/50 transition-colors"
                >
                  <h4 className="font-semibold mb-1">{example.name}</h4>
                  <p className="text-xs text-muted-foreground">{example.role}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


