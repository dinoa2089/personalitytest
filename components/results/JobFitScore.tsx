"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface JobFitScoreProps {
  fitScore: number;
  fitBreakdown?: {
    dimension: string;
    fit_score: number;
    explanation?: string;
  }[];
  jobTitle?: string;
  companyName?: string;
}

export function JobFitScore({ fitScore, fitBreakdown, jobTitle, companyName }: JobFitScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Fit";
    if (score >= 60) return "Good Fit";
    if (score >= 40) return "Moderate Fit";
    return "Low Fit";
  };

  return (
    <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl">Job Fit Score</CardTitle>
        <CardDescription className="text-base">
          {jobTitle && companyName && (
            <>Your personality match for {jobTitle} at {companyName}</>
          )}
          {jobTitle && !companyName && (
            <>Your personality match for {jobTitle}</>
          )}
          {!jobTitle && "Your personality match for this position"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Overall Fit</span>
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold ${getScoreColor(fitScore)}`}>
                {Math.round(fitScore)}%
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(fitScore)} bg-opacity-10 ${getScoreBgColor(fitScore)} bg-opacity-10`}>
                {getScoreLabel(fitScore)}
              </span>
            </div>
          </div>
          <Progress value={fitScore} className="h-3" />
        </div>

        {fitBreakdown && fitBreakdown.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">Dimension Breakdown</h3>
            <div className="space-y-3">
              {fitBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {item.dimension.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className={`text-sm font-semibold ${getScoreColor(item.fit_score)}`}>
                      {Math.round(item.fit_score)}%
                    </span>
                  </div>
                  <Progress value={item.fit_score} className="h-2" />
                  {item.explanation && (
                    <p className="text-xs text-muted-foreground">{item.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            This score is based on how well your personality dimensions align with the ideal profile for this role.
            The employer will review your complete assessment results along with this fit score.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}





