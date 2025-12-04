"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Briefcase, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Target,
  Zap,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { enneagramTypes, type EnneagramType } from "@/lib/enneagram-content";
import Link from "next/link";

interface PersonalizedEnneagramReportProps {
  enneagramType: number;
  wing?: number;
  confidence?: number;
}

export function PersonalizedEnneagramReport({ enneagramType, wing, confidence }: PersonalizedEnneagramReportProps) {
  const typeData = enneagramTypes[String(enneagramType)];

  if (!typeData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enneagram Type {enneagramType}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detailed content for Type {enneagramType} is being prepared.
            <Link href={`/type/enneagram/${enneagramType}`} className="text-primary ml-1 hover:underline">
              View type page →
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-fuchsia-500/10">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-2">Enneagram</Badge>
            <CardTitle className="text-3xl">Type {typeData.number} - {typeData.name}</CardTitle>
            <CardDescription className="text-base mt-2">{typeData.tagline}</CardDescription>
          </div>
          <div className="text-right">
            {confidence && (
              <div className="text-sm text-muted-foreground mb-1">
                {Math.round(confidence)}% match
              </div>
            )}
            {wing && (
              <Badge className="bg-purple-600">Wing {wing}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="core" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="dynamics">Dynamics</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="space-y-6">
            {/* Core Motivations */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
              >
                <h4 className="font-semibold text-red-800 dark:text-red-200 flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Core Fear
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">{typeData.coreFear}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
              >
                <h4 className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4" />
                  Core Desire
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">{typeData.coreDesire}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
              >
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4" />
                  Core Motivation
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">{typeData.coreMotivation}</p>
              </motion.div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              {typeData.description.map((para, idx) => (
                <motion.p 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="text-muted-foreground leading-relaxed"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Strengths & Challenges */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Your Strengths
                </h3>
                {typeData.strengths.map((strength, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-2 p-2 rounded bg-green-50/50 dark:bg-green-950/20"
                  >
                    <Sparkles className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Challenges to Overcome
                </h3>
                {typeData.challenges.map((challenge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-2 p-2 rounded bg-amber-50/50 dark:bg-amber-950/20"
                  >
                    <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{challenge}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Levels of Development
              </h3>
              <p className="text-sm text-muted-foreground">
                Understanding where you are on the health spectrum helps identify growth opportunities.
              </p>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-lg bg-green-100 dark:bg-green-950/40 border-l-4 border-green-500"
              >
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">At Your Best (Healthy)</h4>
                <p className="text-green-700 dark:text-green-300">{typeData.healthLevels.healthy}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-5 rounded-lg bg-yellow-100 dark:bg-yellow-950/40 border-l-4 border-yellow-500"
              >
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Day-to-Day (Average)</h4>
                <p className="text-yellow-700 dark:text-yellow-300">{typeData.healthLevels.average}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-lg bg-red-100 dark:bg-red-950/40 border-l-4 border-red-500"
              >
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Under Stress (Unhealthy)</h4>
                <p className="text-red-700 dark:text-red-300">{typeData.healthLevels.unhealthy}</p>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="dynamics" className="space-y-6">
            {/* Wings */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Your Wings
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border ${wing === enneagramType - 1 || (enneagramType === 1 && wing === 9) ? 'bg-purple-100 dark:bg-purple-950/40 border-purple-300' : 'bg-muted/30'}`}
                >
                  <Badge variant="outline" className="mb-2">{typeData.wings.lower.name}</Badge>
                  <p className="text-sm text-muted-foreground">{typeData.wings.lower.description}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border ${wing === enneagramType + 1 || (enneagramType === 9 && wing === 1) ? 'bg-purple-100 dark:bg-purple-950/40 border-purple-300' : 'bg-muted/30'}`}
                >
                  <Badge variant="outline" className="mb-2">{typeData.wings.higher.name}</Badge>
                  <p className="text-sm text-muted-foreground">{typeData.wings.higher.description}</p>
                </motion.div>
              </div>
            </div>

            {/* Growth & Stress Lines */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
              >
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                  Growth Direction → Type {typeData.growthLine.number}
                </h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">{typeData.growthLine.description}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800"
              >
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <ArrowDownRight className="h-5 w-5 text-rose-600" />
                  Stress Direction → Type {typeData.stressLine.number}
                </h4>
                <p className="text-sm text-rose-700 dark:text-rose-300">{typeData.stressLine.description}</p>
              </motion.div>
            </div>

            {/* Relationships */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 mt-6"
            >
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-pink-600" />
                In Relationships
              </h4>
              <p className="text-muted-foreground">{typeData.inRelationships}</p>
            </motion.div>
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                Career Paths That Fit Your Type
              </h3>
              <p className="text-sm text-muted-foreground">
                Based on the natural motivations and strengths of Type {enneagramType}s.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {typeData.careerPaths.map((career, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-lg mb-2">{career.title}</h4>
                  <p className="text-sm text-muted-foreground">{career.reason}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Growth Path for Type {enneagramType}
              </h3>
              <p className="text-sm text-muted-foreground">
                Personalized advice to help you move toward your healthiest self.
              </p>
            </div>

            <div className="space-y-4">
              {typeData.growthAdvice.map((advice, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-200 dark:border-purple-800"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{advice}</p>
                </motion.div>
              ))}
            </div>

            {/* Famous Examples */}
            {typeData.famousExamples && typeData.famousExamples.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Famous Type {enneagramType}s
                </h3>
                <div className="flex flex-wrap gap-2">
                  {typeData.famousExamples.slice(0, 8).map((person, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">
                      {person.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t text-center">
          <Link 
            href={`/type/enneagram/${enneagramType}`}
            className="text-sm text-primary hover:underline"
          >
            Explore the full Type {enneagramType} page →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

