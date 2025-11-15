"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import type { AssessmentResult, DimensionScore } from "@/types";

interface ComparisonViewProps {
  currentResult: AssessmentResult;
  sessionId: string;
}

interface PreviousResult {
  sessionId: string;
  createdAt: Date;
  scores: DimensionScore[];
}

export function ComparisonView({ currentResult, sessionId }: ComparisonViewProps) {
  const { user, isLoaded } = useUser();
  const [previousResults, setPreviousResults] = useState<PreviousResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComparison, setSelectedComparison] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchPreviousResults = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/dashboard/assessments?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const assessments = data.assessments || [];

          // Fetch results for completed assessments (excluding current)
          const resultsPromises = assessments
            .filter((a: any) => a.isComplete && a.hasResults && a.sessionId !== sessionId)
            .slice(0, 5) // Limit to 5 most recent
            .map(async (assessment: any) => {
              try {
                const resultResponse = await fetch(`/api/results/${assessment.sessionId}`);
                if (resultResponse.ok) {
                  const resultData = await resultResponse.json();
                  return {
                    sessionId: assessment.sessionId,
                    createdAt: new Date(assessment.completedAt || assessment.startedAt),
                    scores: resultData.dimensional_scores || [],
                  };
                }
              } catch (error) {
                console.error("Error fetching result:", error);
              }
              return null;
            });

          const results = (await Promise.all(resultsPromises)).filter(
            (r): r is PreviousResult => r !== null
          );
          setPreviousResults(results);
        }
      } catch (error) {
        console.error("Error fetching previous results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousResults();
  }, [user?.id, isLoaded, sessionId]);

  const compareScores = (current: DimensionScore[], previous: DimensionScore[]) => {
    const comparison: Record<
      string,
      { current: number; previous: number; change: number; trend: "up" | "down" | "same" }
    > = {};

    current.forEach((currentScore) => {
      const previousScore = previous.find((p) => p.dimension === currentScore.dimension);
      if (previousScore) {
        const change = currentScore.percentile - previousScore.percentile;
        comparison[currentScore.dimension] = {
          current: currentScore.percentile,
          previous: previousScore.percentile,
          change: Math.abs(change),
          trend: change > 2 ? "up" : change < -2 ? "down" : "same",
        };
      }
    });

    return comparison;
  };

  if (!isLoaded) {
    return null;
  }

  if (!user?.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compare with Previous Assessments</CardTitle>
          <CardDescription>Sign in to compare your results over time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create an account to track your personality development and compare results across
            multiple assessments.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compare with Previous Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading previous results...</p>
        </CardContent>
      </Card>
    );
  }

  if (previousResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compare with Previous Assessments</CardTitle>
          <CardDescription>Track your personality development over time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Complete more assessments to see how your personality traits evolve over time.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedResult = previousResults.find((r) => r.sessionId === selectedComparison);
  const comparison = selectedResult
    ? compareScores(currentResult.dimensional_scores, selectedResult.scores)
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare with Previous Assessments</CardTitle>
        <CardDescription>See how your personality traits have changed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedComparison && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Select an assessment to compare:</p>
            <div className="space-y-2">
              {previousResults.map((result) => (
                <Button
                  key={result.sessionId}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setSelectedComparison(result.sessionId)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {result.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Button>
              ))}
            </div>
          </div>
        )}

        {comparison && selectedResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">
                Comparison with{" "}
                {selectedResult.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedComparison(null)}
              >
                Change
              </Button>
            </div>

            <div className="space-y-3">
              {Object.entries(comparison).map(([dimension, data]) => {
                const dimensionName = dimension
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim();

                return (
                  <div
                    key={dimension}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{dimensionName}</span>
                        <div className="flex items-center gap-2">
                          {data.trend === "up" && (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          )}
                          {data.trend === "down" && (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          {data.trend === "same" && (
                            <Minus className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              data.trend === "up"
                                ? "text-green-600"
                                : data.trend === "down"
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {data.change > 0 ? "+" : ""}
                            {data.change.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Previous: {data.previous.toFixed(1)}%</span>
                        <span>→</span>
                        <span className="font-medium text-foreground">
                          Current: {data.current.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

