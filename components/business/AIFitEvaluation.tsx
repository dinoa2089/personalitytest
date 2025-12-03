"use client";

/**
 * AI-Powered Fit Evaluation Display Component
 * 
 * Shows comprehensive candidate evaluation results from Gemini 3 Pro / Kimi K2
 * Aligns with prism7test.com/for-employers features
 */

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  MessageSquare,
  Sparkles,
  Shield,
  Brain,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import type { AIFitEvaluation, DimensionAnalysis, RedFlag, TeamImpactAnalysis } from "@/lib/ai-job-fit-evaluator";

interface Props {
  evaluation: AIFitEvaluation;
  candidateName?: string;
  compact?: boolean;
}

// ============================================================================
// Recommendation Styling
// ============================================================================

const recommendationConfig = {
  strong_yes: {
    label: "Strong Yes",
    color: "bg-emerald-500",
    badgeColor: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
    icon: CheckCircle2,
    description: "Exceptional fit - proceed confidently"
  },
  yes: {
    label: "Yes",
    color: "bg-green-500",
    badgeColor: "bg-green-500/20 text-green-700 border-green-500/30",
    icon: CheckCircle2,
    description: "Good fit - recommend hiring"
  },
  maybe: {
    label: "Maybe",
    color: "bg-amber-500",
    badgeColor: "bg-amber-500/20 text-amber-700 border-amber-500/30",
    icon: AlertTriangle,
    description: "Mixed signals - needs interview exploration"
  },
  no: {
    label: "No",
    color: "bg-red-400",
    badgeColor: "bg-red-400/20 text-red-600 border-red-400/30",
    icon: XCircle,
    description: "Significant concerns for this role"
  },
  strong_no: {
    label: "Strong No",
    color: "bg-red-600",
    badgeColor: "bg-red-600/20 text-red-700 border-red-600/30",
    icon: XCircle,
    description: "Clear mismatch - do not proceed"
  }
};

const confidenceColors = {
  high: "text-emerald-600",
  medium: "text-amber-600",
  low: "text-red-500"
};

const concernColors = {
  none: "bg-emerald-500",
  minor: "bg-green-400",
  moderate: "bg-amber-500",
  significant: "bg-red-500"
};

const severityConfig = {
  warning: { color: "bg-amber-100 border-amber-300 text-amber-800", icon: AlertTriangle },
  concern: { color: "bg-orange-100 border-orange-300 text-orange-800", icon: AlertTriangle },
  critical: { color: "bg-red-100 border-red-300 text-red-800", icon: XCircle }
};

// ============================================================================
// Sub-components
// ============================================================================

function ScoreCircle({ score, size = "lg" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-xl",
    lg: "w-24 h-24 text-3xl"
  };

  const getColor = (s: number) => {
    if (s >= 80) return "from-emerald-400 to-emerald-600";
    if (s >= 60) return "from-green-400 to-green-600";
    if (s >= 40) return "from-amber-400 to-amber-600";
    return "from-red-400 to-red-600";
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", duration: 0.8 }}
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getColor(score)} flex items-center justify-center font-bold text-white shadow-lg`}
    >
      {score}
    </motion.div>
  );
}

function DimensionBar({ analysis, index }: { analysis: DimensionAnalysis; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="space-y-2"
    >
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">{analysis.label}</span>
                {analysis.weight >= 1.3 && (
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    Critical
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {analysis.candidatePercentile}% → {analysis.targetPercentile}% target
                </span>
                <Badge 
                  variant="outline" 
                  className={analysis.fitScore >= 70 ? "text-green-600" : analysis.fitScore >= 50 ? "text-amber-600" : "text-red-600"}
                >
                  {analysis.fitScore}%
                </Badge>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </button>
        </CollapsibleTrigger>

        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          {/* Target marker */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-foreground/40 z-10 rounded"
            style={{ left: `${analysis.targetPercentile}%` }}
          />
          {/* Candidate score */}
          <motion.div
            className={`h-full rounded-full ${concernColors[analysis.concernLevel]}`}
            initial={{ width: 0 }}
            animate={{ width: `${analysis.candidatePercentile}%` }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
          />
        </div>

        <CollapsibleContent>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mt-2 p-3 bg-muted/50 rounded-lg"
          >
            {analysis.analysis}
          </motion.p>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

function RedFlagCard({ flag, index }: { flag: RedFlag; index: number }) {
  const config = severityConfig[flag.severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-3 rounded-lg border ${config.color}`}
    >
      <div className="flex items-start gap-2">
        <Icon className="h-4 w-4 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-medium text-sm">{flag.issue}</p>
          {flag.mitigation && (
            <p className="text-xs opacity-80">
              <span className="font-medium">Mitigation:</span> {flag.mitigation}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TeamImpactCard({ impact }: { impact: TeamImpactAnalysis }) {
  const impactColors = {
    positive: "bg-emerald-50 border-emerald-200 text-emerald-800",
    neutral: "bg-slate-50 border-slate-200 text-slate-800",
    mixed: "bg-amber-50 border-amber-200 text-amber-800",
    negative: "bg-red-50 border-red-200 text-red-800"
  };

  return (
    <Card className={`border-2 ${impactColors[impact.overallImpact]}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4" />
          Team Impact: {impact.overallImpact.charAt(0).toUpperCase() + impact.overallImpact.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {impact.strengthsAdded.length > 0 && (
          <div>
            <p className="font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Strengths Added
            </p>
            <ul className="list-disc list-inside text-xs mt-1 opacity-80">
              {impact.strengthsAdded.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
        {impact.gapsFilled.length > 0 && (
          <div>
            <p className="font-medium flex items-center gap-1">
              <Target className="h-3 w-3" /> Gaps Filled
            </p>
            <ul className="list-disc list-inside text-xs mt-1 opacity-80">
              {impact.gapsFilled.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </div>
        )}
        {impact.potentialConflicts.length > 0 && (
          <div>
            <p className="font-medium flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Potential Conflicts
            </p>
            <ul className="list-disc list-inside text-xs mt-1 opacity-80">
              {impact.potentialConflicts.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}
        <p className="text-xs italic border-t pt-2 mt-2">{impact.recommendation}</p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AIFitEvaluation({ evaluation, candidateName, compact = false }: Props) {
  const recConfig = recommendationConfig[evaluation.hiringRecommendation];
  const RecIcon = recConfig.icon;
  const [showReasoning, setShowReasoning] = useState(false);

  // Compact view for list displays
  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 rounded-lg bg-card border">
        <ScoreCircle score={evaluation.overallFitScore} size="sm" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {candidateName && <span className="font-medium">{candidateName}</span>}
            <Badge className={recConfig.badgeColor}>
              <RecIcon className="h-3 w-3 mr-1" />
              {recConfig.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {evaluation.greenFlags.slice(0, 2).join(" • ")}
          </p>
        </div>
        {evaluation.redFlags.length > 0 && (
          <Badge variant="outline" className="text-amber-600 border-amber-300">
            {evaluation.redFlags.length} flag{evaluation.redFlags.length > 1 ? "s" : ""}
          </Badge>
        )}
      </div>
    );
  }

  // Full detailed view
  return (
    <div className="space-y-6">
      {/* Header with score and recommendation */}
      <Card className="overflow-hidden">
        <div className={`h-2 ${recConfig.color}`} />
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {candidateName && (
                <h3 className="text-lg font-semibold">{candidateName}</h3>
              )}
              <div className="flex items-center gap-2">
                <Badge className={`${recConfig.badgeColor} text-base px-3 py-1`}>
                  <RecIcon className="h-4 w-4 mr-1" />
                  {recConfig.label}
                </Badge>
                <span className={`text-sm font-medium ${confidenceColors[evaluation.confidenceLevel]}`}>
                  {evaluation.confidenceLevel.charAt(0).toUpperCase() + evaluation.confidenceLevel.slice(1)} confidence
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{recConfig.description}</p>
            </div>
            <ScoreCircle score={evaluation.overallFitScore} />
          </div>

          {/* Confidence reason */}
          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {evaluation.confidenceReason}
          </p>
        </CardContent>
      </Card>

      {/* Green flags */}
      {evaluation.greenFlags.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {evaluation.greenFlags.map((flag, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {flag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Red flags */}
      {evaluation.redFlags.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              Areas of Concern ({evaluation.redFlags.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {evaluation.redFlags.map((flag, i) => (
              <RedFlagCard key={i} flag={flag} index={i} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Dimension breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Dimension Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {evaluation.dimensionAnalysis.map((dim, i) => (
            <DimensionBar key={dim.dimension} analysis={dim} index={i} />
          ))}
        </CardContent>
      </Card>

      {/* Interview focus & onboarding */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Interview Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.interviewFocusAreas.map((area, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-sm flex items-start gap-2"
                >
                  <span className="text-primary mt-1">•</span>
                  {area}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Onboarding Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.onboardingConsiderations.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-sm flex items-start gap-2"
                >
                  <span className="text-primary mt-1">•</span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Team impact */}
      {evaluation.teamImpact && (
        <TeamImpactCard impact={evaluation.teamImpact} />
      )}

      {/* AI Reasoning (collapsible) */}
      <Collapsible open={showReasoning} onOpenChange={setShowReasoning}>
        <Card>
          <CardHeader className="pb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Reasoning
                </span>
                {showReasoning ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {evaluation.reasoning}
              </p>
              <p className="text-xs text-muted-foreground mt-4 pt-2 border-t">
                Model: {evaluation.modelUsed}
              </p>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}

export default AIFitEvaluation;

