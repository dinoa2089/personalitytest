"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import type { Dimension } from "@/types";

interface DimensionFit {
  dimension: Dimension;
  label: string;
  candidateScore: number;
  targetScore: number;
  weight: number;
  difference: number;
  fit: number;
  rating: "excellent" | "good" | "fair" | "poor";
}

interface JobFitResult {
  overallFit: number;
  rating: "excellent" | "good" | "fair" | "poor";
  breakdown: DimensionFit[];
  strengths: DimensionFit[];
  concerns: DimensionFit[];
  summary: string;
}

interface Props {
  fit: JobFitResult;
  compact?: boolean;
  jobTitle?: string;
}

const ratingColors: Record<string, string> = {
  excellent: "bg-emerald-500",
  good: "bg-sky-500",
  fair: "bg-amber-500",
  poor: "bg-rose-500",
};

const ratingBadgeColors: Record<string, string> = {
  excellent: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  good: "bg-sky-500/15 text-sky-600 border-sky-500/30 dark:text-sky-400",
  fair: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  poor: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400",
};

const ratingBarColors: Record<string, string> = {
  excellent: "bg-emerald-500",
  good: "bg-sky-500",
  fair: "bg-amber-500",
  poor: "bg-rose-500",
};

export function CandidateFitScore({ fit, compact = false, jobTitle }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${ratingColors[fit.rating]}`}
        >
          {fit.overallFit}
        </div>
        <Badge className={`${ratingBadgeColors[fit.rating]} border font-medium`}>
          {fit.rating.charAt(0).toUpperCase() + fit.rating.slice(1)} Fit
        </Badge>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">Job Fit Analysis</CardTitle>
            {jobTitle && (
              <p className="text-sm text-muted-foreground mt-1">
                Fit assessment for {jobTitle}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold tracking-tight">{fit.overallFit}%</span>
              <Badge
                className={`${ratingBadgeColors[fit.rating]} border font-semibold px-3 py-1`}
              >
                {fit.rating.charAt(0).toUpperCase() + fit.rating.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {fit.summary}
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Strengths */}
        {fit.strengths.length > 0 && (
          <div>
            <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Key Strengths
            </h4>
            <div className="grid gap-2">
              {fit.strengths.map((s) => (
                <div
                  key={s.dimension}
                  className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
                >
                  <span className="font-medium text-sm">{s.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {s.candidateScore}%{" "}
                      <span className="text-muted-foreground/60">
                        (target: {s.targetScore}%)
                      </span>
                    </span>
                    <Badge
                      variant="outline"
                      className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold"
                    >
                      {s.fit}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Concerns */}
        {fit.concerns.length > 0 && (
          <div>
            <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Areas to Explore
            </h4>
            <div className="grid gap-2">
              {fit.concerns.map((c) => (
                <div
                  key={c.dimension}
                  className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/10"
                >
                  <span className="font-medium text-sm">{c.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {c.candidateScore}%{" "}
                      <span className="text-muted-foreground/60">
                        (target: {c.targetScore}%)
                      </span>
                    </span>
                    {c.difference > 0 ? (
                      <TrendingUp className="h-4 w-4 text-sky-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-amber-500" />
                    )}
                    <Badge
                      variant="outline"
                      className="text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold"
                    >
                      {c.fit}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Breakdown */}
        <div>
          <h4 className="font-semibold mb-4 text-sm">Full Breakdown</h4>
          <div className="space-y-4">
            {fit.breakdown.map((dim, index) => (
              <div
                key={dim.dimension}
                className="space-y-2"
                style={{
                  animation: `fadeSlideIn 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{dim.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {dim.candidateScore}% → {dim.targetScore}% target
                    {dim.weight !== 1 && (
                      <span className="ml-1 text-muted-foreground/60">
                        (×{dim.weight.toFixed(1)})
                      </span>
                    )}
                  </span>
                </div>
                <div className="relative h-2.5 bg-muted/50 rounded-full overflow-hidden">
                  {/* Target marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-foreground/40 z-10 rounded-full"
                    style={{ left: `${dim.targetScore}%` }}
                  />
                  {/* Candidate score bar */}
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${ratingBarColors[dim.rating]}`}
                    style={{
                      width: `${dim.candidateScore}%`,
                      animationDelay: `${index * 0.05}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weight Legend */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">How to read:</span> The vertical marker (|) shows the target score for each dimension.
            Higher weights (×1.5) indicate dimensions more critical for this role.
          </p>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </Card>
  );
}

/**
 * Skeleton loader for the CandidateFitScore component
 */
export function CandidateFitScoreSkeleton() {
  return (
    <Card className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-16 bg-muted animate-pulse rounded" />
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
          </div>
        </div>
        <div className="h-4 w-full bg-muted animate-pulse rounded mt-3" />
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-2.5 bg-muted animate-pulse rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

