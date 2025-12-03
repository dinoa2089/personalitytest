"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Mail, Calendar, Trophy, Medal } from "lucide-react";
import type { Candidate } from "./CandidateList";

interface Props {
  candidates: Candidate[];
  onClose: () => void;
}

export function CandidateCompare({ candidates, onClose }: Props) {
  // Sort candidates by fit score for ranking
  const rankedCandidates = [...candidates].sort(
    (a, b) => (b.fit_score || 0) - (a.fit_score || 0)
  );

  const getFitColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-500";
  };

  const getFitBgColor = (score: number | null) => {
    if (score === null) return "bg-muted";
    if (score >= 85) return "bg-emerald-500/20";
    if (score >= 70) return "bg-blue-500/20";
    if (score >= 50) return "bg-amber-500/20";
    return "bg-red-500/20";
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-slate-400" />;
    if (index === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  // Get all unique dimensions from all candidates
  const allDimensions = new Set<string>();
  candidates.forEach(c => {
    if (c.fit_breakdown && Array.isArray(c.fit_breakdown)) {
      c.fit_breakdown.forEach((item: any) => {
        if (item.dimension) allDimensions.add(item.dimension);
      });
    }
  });

  const getDimensionScore = (candidate: Candidate, dimension: string) => {
    if (!candidate.fit_breakdown || !Array.isArray(candidate.fit_breakdown)) return null;
    const item = candidate.fit_breakdown.find((b: any) => b.dimension === dimension);
    return item ? Math.round(item.fit_score || 0) : null;
  };

  const getDimensionPercentile = (candidate: Candidate, dimension: string) => {
    if (!candidate.fit_breakdown || !Array.isArray(candidate.fit_breakdown)) return null;
    const item = candidate.fit_breakdown.find((b: any) => b.dimension === dimension);
    return item ? Math.round(item.applicant_percentile || 0) : null;
  };

  const getHighestScoreForDimension = (dimension: string) => {
    let highest = -1;
    let winner: string | null = null;
    candidates.forEach(c => {
      const score = getDimensionScore(c, dimension);
      if (score !== null && score > highest) {
        highest = score;
        winner = c.id;
      }
    });
    return winner;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Candidates</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Candidate headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${candidates.length}, 1fr)` }}>
            <div className="font-semibold text-muted-foreground">Candidate</div>
            {rankedCandidates.map((candidate, index) => (
              <div key={candidate.id} className="text-center">
                <div className="flex justify-center mb-2">
                  {getRankIcon(index)}
                </div>
                <div className={`flex h-14 w-14 mx-auto items-center justify-center rounded-full ${getFitBgColor(candidate.fit_score)}`}>
                  <span className={`text-lg font-bold ${getFitColor(candidate.fit_score)}`}>
                    {candidate.applicant_name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <p className="font-semibold mt-2 truncate">
                  {candidate.applicant_name || "Anonymous"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {candidate.applicant_email || "No email"}
                </p>
                {candidate.shortlisted && (
                  <Badge className="mt-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-0 text-xs">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Shortlisted
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <hr className="my-4" />

          {/* Overall Fit Score */}
          <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `200px repeat(${candidates.length}, 1fr)` }}>
            <div className="font-semibold">Overall Fit Score</div>
            {rankedCandidates.map((candidate, index) => (
              <div key={candidate.id} className="text-center">
                <div className={`text-3xl font-bold ${getFitColor(candidate.fit_score)} ${index === 0 ? "scale-110" : ""}`}>
                  {candidate.fit_score !== null ? `${Math.round(candidate.fit_score)}%` : "—"}
                </div>
                {index === 0 && candidate.fit_score !== null && (
                  <Badge className="mt-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-0 text-xs">
                    Best Match
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <hr className="my-4" />

          {/* Status */}
          <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `200px repeat(${candidates.length}, 1fr)` }}>
            <div className="font-semibold">Status</div>
            {rankedCandidates.map((candidate) => (
              <div key={candidate.id} className="text-center">
                <Badge variant={candidate.status === "reviewed" ? "default" : "secondary"}>
                  {candidate.status}
                </Badge>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          {/* Applied Date */}
          <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `200px repeat(${candidates.length}, 1fr)` }}>
            <div className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Applied
            </div>
            {rankedCandidates.map((candidate) => (
              <div key={candidate.id} className="text-center text-sm text-muted-foreground">
                {new Date(candidate.created_at).toLocaleDateString()}
              </div>
            ))}
          </div>

          {/* Dimension-by-dimension comparison */}
          {allDimensions.size > 0 && (
            <>
              <hr className="my-4" />
              <h3 className="font-semibold text-lg mb-4">Dimension Breakdown</h3>

              {Array.from(allDimensions).map((dimension) => {
                const winner = getHighestScoreForDimension(dimension);
                return (
                  <div key={dimension} className="mb-4">
                    <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `200px repeat(${candidates.length}, 1fr)` }}>
                      <div className="text-sm font-medium capitalize">
                        {dimension.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      {rankedCandidates.map((candidate) => {
                        const score = getDimensionScore(candidate, dimension);
                        const percentile = getDimensionPercentile(candidate, dimension);
                        const isWinner = candidate.id === winner;
                        return (
                          <div key={candidate.id} className="text-center">
                            <div className={`text-lg font-semibold ${isWinner ? "text-emerald-600" : ""}`}>
                              {score !== null ? `${score}%` : "—"}
                              {isWinner && score !== null && (
                                <span className="ml-1 text-xs">✓</span>
                              )}
                            </div>
                            {percentile !== null && (
                              <div className="text-xs text-muted-foreground">
                                {percentile}th percentile
                              </div>
                            )}
                            {/* Progress bar */}
                            {score !== null && (
                              <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden mx-4">
                                <div
                                  className={`h-full transition-all ${
                                    score >= 85
                                      ? "bg-emerald-500"
                                      : score >= 70
                                      ? "bg-blue-500"
                                      : score >= 50
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

