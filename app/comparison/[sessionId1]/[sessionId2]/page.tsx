"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PersonalityRadarChart } from "@/components/results/RadarChart";
import { DualRadarChart } from "@/components/visualizations";
import { calculateArchetype } from "@/lib/archetypes";
import type { AssessmentResult, DimensionScore } from "@/types";
import { ArrowLeft, Users } from "lucide-react";

export default function ComparisonPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId1 = params.sessionId1 as string;
  const sessionId2 = params.sessionId2 as string;

  const [result1, setResult1] = useState<AssessmentResult | null>(null);
  const [result2, setResult2] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`/api/results/${sessionId1}`),
          fetch(`/api/results/${sessionId2}`),
        ]);

        if (res1.ok && res2.ok) {
          const data1 = await res1.json();
          const data2 = await res2.json();

          const finalResult1: AssessmentResult = {
            session_id: data1?.session_id || sessionId1,
            dimensional_scores: data1?.dimensional_scores || data1.dimensional_scores || [],
            completed: true,
            created_at: new Date(data1?.created_at || Date.now()),
            frameworks: data1?.frameworks,
          };

          const finalResult2: AssessmentResult = {
            session_id: data2?.session_id || sessionId2,
            dimensional_scores: data2?.dimensional_scores || data2.dimensional_scores || [],
            completed: true,
            created_at: new Date(data2?.created_at || Date.now()),
            frameworks: data2?.frameworks,
          };

          setResult1(finalResult1);
          setResult2(finalResult2);
        }
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId1 && sessionId2) {
      fetchResults();
    }
  }, [sessionId1, sessionId2]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading comparison...</p>
        </Container>
      </div>
    );
  }

  if (!result1 || !result2) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Results not found</p>
        </Container>
      </div>
    );
  }

  // Calculate differences
  const calculateDifferences = () => {
    const differences: Array<{
      dimension: string;
      diff: number;
      person1Higher: boolean;
    }> = [];

    result1.dimensional_scores.forEach((score1) => {
      const score2 = result2.dimensional_scores.find(
        (s) => s.dimension === score1.dimension
      );
      if (score2) {
        const diff = Math.abs(score1.percentile - score2.percentile);
        differences.push({
          dimension: score1.dimension,
          diff,
          person1Higher: score1.percentile > score2.percentile,
        });
      }
    });

    return differences.sort((a, b) => b.diff - a.diff);
  };

  const differences = calculateDifferences();
  const dimensionNames: Record<string, string> = {
    openness: "Openness",
    conscientiousness: "Conscientiousness",
    extraversion: "Extraversion",
    agreeableness: "Agreeableness",
    emotionalResilience: "Emotional Resilience",
    honestyHumility: "Honesty-Humility",
    adaptability: "Adaptability",
  };

  // Create combined scores for radar chart
  const combinedScores: DimensionScore[] = result1.dimensional_scores.map((score1) => {
    const score2 = result2.dimensional_scores.find(
      (s) => s.dimension === score1.dimension
    );
    return {
      ...score1,
      percentile: (score1.percentile + (score2?.percentile || 50)) / 2,
    };
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                <Users className="h-8 w-8" />
                Personality Comparison
              </h1>
              <p className="text-muted-foreground">
                Compare two personality profiles side by side
              </p>
            </div>
          </div>

          {/* Comparison Overview with Dual Radar */}
          <DualRadarChart 
            personA={{
              name: "Profile 1",
              archetype: calculateArchetype(result1.dimensional_scores).primary.name,
              icon: calculateArchetype(result1.dimensional_scores).primary.icon,
              scores: result1.dimensional_scores,
              color: "#3b82f6",
            }}
            personB={{
              name: "Profile 2",
              archetype: calculateArchetype(result2.dimensional_scores).primary.name,
              icon: calculateArchetype(result2.dimensional_scores).primary.icon,
              scores: result2.dimensional_scores,
              color: "#a855f7",
            }}
            showOverlapAnalysis={true}
          />

          {/* Dimension-by-Dimension Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Dimension Comparison</CardTitle>
              <CardDescription>
                Detailed comparison across all 7 dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result1.dimensional_scores.map((score1, index) => {
                  const score2 = result2.dimensional_scores.find(
                    (s) => s.dimension === score1.dimension
                  );
                  if (!score2) return null;

                  const diff = score1.percentile - score2.percentile;
                  const absDiff = Math.abs(diff);

                  return (
                    <motion.div
                      key={score1.dimension}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                          {dimensionNames[score1.dimension] || score1.dimension}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          Difference: {diff > 0 ? "+" : ""}
                          {Math.round(diff)} points
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Person 1 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Profile 1</span>
                            <span className="font-medium">{Math.round(score1.percentile)}th</span>
                          </div>
                          <div className="h-4 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score1.percentile}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              className="h-full bg-blue-500"
                            />
                          </div>
                        </div>

                        {/* Person 2 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Profile 2</span>
                            <span className="font-medium">{Math.round(score2.percentile)}th</span>
                          </div>
                          <div className="h-4 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score2.percentile}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 + 0.1 }}
                              className="h-full bg-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Biggest Differences */}
          <Card>
            <CardHeader>
              <CardTitle>Biggest Differences</CardTitle>
              <CardDescription>
                Dimensions where these profiles differ most significantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {differences.slice(0, 3).map((diff, index) => {
                  const score1 = result1.dimensional_scores.find(
                    (s) => s.dimension === diff.dimension
                  );
                  const score2 = result2.dimensional_scores.find(
                    (s) => s.dimension === diff.dimension
                  );

                  return (
                    <motion.div
                      key={diff.dimension}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-lg border bg-card p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">
                          {dimensionNames[diff.dimension] || diff.dimension}
                        </h4>
                        <Badge variant="outline">
                          {Math.round(diff.diff)} point difference
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {diff.person1Higher
                          ? `Profile 1 scores ${Math.round(score1?.percentile || 0)}th percentile, while Profile 2 scores ${Math.round(score2?.percentile || 0)}th percentile.`
                          : `Profile 2 scores ${Math.round(score2?.percentile || 0)}th percentile, while Profile 1 scores ${Math.round(score1?.percentile || 0)}th percentile.`}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

