"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Heart, 
  Briefcase, 
  TrendingUp, 
  Users,
  Star,
  AlertCircle,
  Lightbulb,
  Target,
  Zap
} from "lucide-react";
import { mbtiTypes, type MBTIType } from "@/lib/mbti-content";
import Link from "next/link";

interface PersonalizedMBTIReportProps {
  mbtiType: string;
  confidence?: number;
}

export function PersonalizedMBTIReport({ mbtiType, confidence }: PersonalizedMBTIReportProps) {
  const typeKey = mbtiType.toLowerCase();
  const typeData = mbtiTypes[typeKey];

  if (!typeData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>MBTI Type: {mbtiType}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detailed content for {mbtiType} is being prepared. 
            <Link href={`/type/mbti/${typeKey}`} className="text-primary ml-1 hover:underline">
              View type page →
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-2">Myers-Briggs Type Indicator</Badge>
            <CardTitle className="text-3xl">{typeData.code} - {typeData.nickname}</CardTitle>
            <CardDescription className="text-base mt-2">{typeData.tagline}</CardDescription>
          </div>
          <div className="text-right">
            {confidence && (
              <div className="text-sm text-muted-foreground mb-1">
                {Math.round(confidence)}% confidence
              </div>
            )}
            <Badge className="bg-indigo-600">{typeData.rarity}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cognitive">Mind</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Description */}
            <div className="space-y-4">
              {typeData.description.map((para, idx) => (
                <motion.p 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-muted-foreground leading-relaxed"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Strengths & Blindspots Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-600" />
                  Your Strengths
                </h3>
                <div className="space-y-3">
                  {typeData.strengths.map((strength, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30"
                    >
                      <p className="font-medium text-green-800 dark:text-green-200">{strength.title}</p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">{strength.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  Blind Spots to Watch
                </h3>
                <div className="space-y-3">
                  {typeData.blindspots.map((blindspot, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30"
                    >
                      <p className="font-medium text-amber-800 dark:text-amber-200">{blindspot.title}</p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{blindspot.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cognitive" className="space-y-6">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Your Cognitive Function Stack
              </h3>
              <p className="text-sm text-muted-foreground">
                These are the mental processes that drive how you perceive and make decisions.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { key: 'dominant', label: 'Dominant (Hero)', color: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300', data: typeData.cognitiveFunctions.dominant },
                { key: 'auxiliary', label: 'Auxiliary (Parent)', color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300', data: typeData.cognitiveFunctions.auxiliary },
                { key: 'tertiary', label: 'Tertiary (Child)', color: 'bg-green-100 dark:bg-green-900/30 border-green-300', data: typeData.cognitiveFunctions.tertiary },
                { key: 'inferior', label: 'Inferior (Aspirational)', color: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300', data: typeData.cognitiveFunctions.inferior },
              ].map((func, idx) => (
                <motion.div
                  key={func.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className={`p-4 rounded-lg border ${func.color}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{func.label}</Badge>
                    <span className="font-semibold">{func.data.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{func.data.description}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="relationships" className="space-y-6">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800"
              >
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Romantic Relationships
                </h4>
                <p className="text-muted-foreground">{typeData.inRelationships.romantic}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-5 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800"
              >
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-teal-600" />
                  Friendships
                </h4>
                <p className="text-muted-foreground">{typeData.inRelationships.friendship}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
              >
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  In the Workplace
                </h4>
                <p className="text-muted-foreground">{typeData.inRelationships.workplace}</p>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-600" />
                Career Paths That Fit You
              </h3>
              <p className="text-sm text-muted-foreground">
                Based on your cognitive style and natural strengths, these careers tend to be fulfilling for {typeData.code}s.
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
                Personal Growth Recommendations
              </h3>
              <p className="text-sm text-muted-foreground">
                Actionable advice specifically tailored for {typeData.code}s to reach their full potential.
              </p>
            </div>

            <div className="space-y-4">
              {typeData.growthAdvice.map((advice, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
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
                  Famous {typeData.code}s You Might Relate To
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
            href={`/type/mbti/${typeKey}`}
            className="text-sm text-primary hover:underline"
          >
            Explore the full {typeData.code} type page →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

