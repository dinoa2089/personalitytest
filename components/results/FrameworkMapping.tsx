"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureGate } from "@/components/premium/FeatureGate";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock, ChevronRight } from "lucide-react";
import type { DimensionScore, FrameworkMappings } from "@/types";
import type { FrameworkConfidence } from "@/lib/questions";

interface FrameworkMappingProps {
  scores: DimensionScore[];
  frameworks?: FrameworkMappings;
  questionsAnswered?: number;  // Total questions answered
  confidence?: {
    mbti: FrameworkConfidence;
    enneagram: FrameworkConfidence;
  };
  onContinueAssessment?: () => void;  // Callback to continue assessment
}

// CliftonStrengths-style themes mapped to dimensions
const strengthThemes = {
  openness: {
    name: "Innovator",
    description: "You thrive on new ideas, creative solutions, and exploring possibilities",
    application: "Excels in brainstorming, problem-solving, and visionary thinking",
  },
  conscientiousness: {
    name: "Achiever",
    description: "You are organized, disciplined, and driven to complete tasks with excellence",
    application: "Thrives in structured environments and long-term project management",
  },
  extraversion: {
    name: "Connector",
    description: "You energize through social interaction and build relationships naturally",
    application: "Excels in team environments, networking, and collaborative projects",
  },
  agreeableness: {
    name: "Harmonizer",
    description: "You value cooperation, empathy, and creating positive team dynamics",
    application: "Thrives in supportive roles, conflict resolution, and collaborative leadership",
  },
  emotionalResilience: {
    name: "Stabilizer",
    description: "You maintain composure under pressure and adapt to challenges gracefully",
    application: "Excels in high-stress situations, crisis management, and maintaining team morale",
  },
  honestyHumility: {
    name: "Integrity",
    description: "You value authenticity, fairness, and ethical behavior in all interactions",
    application: "Thrives in roles requiring trust, transparency, and principled decision-making",
  },
  adaptability: {
    name: "Flexible",
    description: "You adapt quickly to change and thrive in dynamic, evolving environments",
    application: "Excels in fast-paced environments, change management, and agile teams",
  },
};

// Enneagram types mapped from dimensional patterns
const enneagramTypes = [
  {
    type: 1,
    name: "The Perfectionist",
    description: "Rational, idealistic, principled, orderly, and self-disciplined",
    pattern: { conscientiousness: "high", agreeableness: "high", emotionalResilience: "moderate" },
  },
  {
    type: 2,
    name: "The Helper",
    description: "Caring, interpersonal, demonstrative, generous, and people-pleasing",
    pattern: { agreeableness: "high", extraversion: "high", honestyHumility: "high" },
  },
  {
    type: 3,
    name: "The Achiever",
    description: "Adaptive, excelling, driven, and image-conscious",
    pattern: { conscientiousness: "high", extraversion: "high", adaptability: "high" },
  },
  {
    type: 4,
    name: "The Individualist",
    description: "Expressive, dramatic, self-absorbed, and temperamental",
    pattern: { openness: "high", emotionalResilience: "low", adaptability: "moderate" },
  },
  {
    type: 5,
    name: "The Investigator",
    description: "Intense, cerebral, perceptive, innovative, secretive, and isolated",
    pattern: { openness: "high", extraversion: "low", conscientiousness: "moderate" },
  },
  {
    type: 6,
    name: "The Loyalist",
    description: "Engaging, responsible, anxious, and suspicious",
    pattern: { conscientiousness: "high", emotionalResilience: "moderate", agreeableness: "high" },
  },
  {
    type: 7,
    name: "The Enthusiast",
    description: "Spontaneous, versatile, acquisitive, and scattered",
    pattern: { extraversion: "high", openness: "high", adaptability: "high" },
  },
  {
    type: 8,
    name: "The Challenger",
    description: "Self-confident, decisive, willful, and confrontational",
    pattern: { extraversion: "high", emotionalResilience: "high", agreeableness: "low" },
  },
  {
    type: 9,
    name: "The Peacemaker",
    description: "Receptive, reassuring, complacent, and resigned",
    pattern: { agreeableness: "high", extraversion: "moderate", adaptability: "high" },
  },
];

export function FrameworkMapping({ 
  scores, 
  frameworks,
  questionsAnswered = 105, // Default to full assessment
  confidence,
  onContinueAssessment,
}: FrameworkMappingProps) {
  const scoreMap = scores.reduce((acc, score) => {
    acc[score.dimension] = score.percentile;
    return acc;
  }, {} as Record<string, number>);

  // Determine what to show based on questions answered
  const showMbti = !confidence || confidence.mbti.canShow;
  const showEnneagram = !confidence || confidence.enneagram.canShow;
  const mbtiWarning = confidence?.mbti.showWarning;
  const enneagramWarning = confidence?.enneagram.showWarning;

  // Use API-provided frameworks if available, otherwise calculate client-side
  const mbtiData = frameworks?.mbti;
  const cliftonstrengthsData = frameworks?.cliftonstrengths;
  const enneagramData = frameworks?.enneagram;

  // Calculate MBTI type from dimensional scores (fallback)
  const calculateMBTI = (): string => {
    const E = scoreMap.extraversion || 50;
    const N = scoreMap.openness || 50;
    const S = scoreMap.conscientiousness || 50;
    const F = scoreMap.agreeableness || 50;
    const T = scoreMap.emotionalResilience || 50;
    const J = scoreMap.conscientiousness || 50;
    const P = scoreMap.adaptability || 50;

    return [
      E > 50 ? "E" : "I",
      N > S ? "N" : "S",
      F > T ? "F" : "T",
      J > P ? "J" : "P",
    ].join("");
  };

  // Calculate top 5 CliftonStrengths-style themes
  const calculateStrengths = () => {
    const dimensionScores = scores.map((s) => ({
      dimension: s.dimension,
      percentile: s.percentile,
    }));

    return dimensionScores
      .sort((a, b) => b.percentile - a.percentile)
      .slice(0, 5)
      .map((s) => ({
        ...strengthThemes[s.dimension as keyof typeof strengthThemes],
        percentile: s.percentile,
      }));
  };

  // Calculate Enneagram type
  const calculateEnneagram = () => {
    const getLevel = (percentile: number): "high" | "moderate" | "low" => {
      if (percentile >= 70) return "high";
      if (percentile >= 40) return "moderate";
      return "low";
    };

    const userProfile = {
      openness: getLevel(scoreMap.openness || 50),
      conscientiousness: getLevel(scoreMap.conscientiousness || 50),
      extraversion: getLevel(scoreMap.extraversion || 50),
      agreeableness: getLevel(scoreMap.agreeableness || 50),
      emotionalResilience: getLevel(scoreMap.emotionalResilience || 50),
      honestyHumility: getLevel(scoreMap.honestyHumility || 50),
      adaptability: getLevel(scoreMap.adaptability || 50),
    };

    // Score each Enneagram type based on pattern matching
    const typeScores = enneagramTypes.map((type) => {
      let score = 0;
      const pattern = type.pattern as Partial<Record<string, string>>;

      Object.entries(pattern).forEach(([dim, level]) => {
        if (userProfile[dim as keyof typeof userProfile] === level) {
          score += 2;
        } else {
          // Partial match
          const userLevel = userProfile[dim as keyof typeof userProfile];
          if (
            (level === "high" && userLevel === "moderate") ||
            (level === "low" && userLevel === "moderate")
          ) {
            score += 1;
          }
        }
      });

      return { ...type, matchScore: score };
    });

    return typeScores.sort((a, b) => b.matchScore - a.matchScore)[0];
  };

  const mbtiType = mbtiData?.type || calculateMBTI();
  const topStrengths = cliftonstrengthsData?.top_themes || calculateStrengths();
  const enneagram = enneagramData || calculateEnneagram();

  return (
    <FeatureGate feature="framework_mappings">
      <Card>
        <CardHeader>
          <CardTitle>Framework Mappings</CardTitle>
          <CardDescription>
            See how your results relate to familiar personality frameworks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* MBTI */}
          <div>
            <h3 className="font-semibold mb-3">Myers-Briggs Type</h3>
            {showMbti ? (
              <>
                {mbtiWarning && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm mb-3 p-2 bg-amber-50 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>{confidence?.mbti.message || 'Preliminary result - complete more questions for higher accuracy'}</span>
                  </div>
                )}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-block rounded-lg bg-primary/10 px-4 py-2 mb-2"
                >
                  <span className="text-2xl font-bold text-primary">{mbtiType}</span>
                  {(mbtiData?.confidence || confidence?.mbti.percentage) && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({Math.round(mbtiData?.confidence || confidence?.mbti.percentage || 0)}% confidence)
                    </span>
                  )}
                </motion.div>
                <p className="text-sm text-muted-foreground">
                  {mbtiData?.explanation || (
                    <>
                      Based on your dimensional profile, your closest Myers-Briggs type is <strong>{mbtiType}</strong>.
                      This mapping connects your PRISM-7 scores to the familiar Myers-Briggs framework.
                    </>
                  )}
                </p>
                {mbtiData?.dimensions && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(mbtiData.dimensions).map(([dim, data]) => (
                      <div key={dim} className="flex justify-between">
                        <span className="text-muted-foreground">{dim}:</span>
                        <span className="font-medium">{data.value} ({Math.round(data.confidence)}%)</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-3">
                  {confidence?.mbti.message || 'Complete checkpoint 2 to unlock your MBTI type'}
                </p>
                {onContinueAssessment && (
                  <Button variant="outline" size="sm" onClick={onContinueAssessment}>
                    Continue Assessment <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            )}
          </div>

        {/* CliftonStrengths-style Themes */}
        <div>
          <h3 className="font-semibold mb-3">Top 5 Strength Themes</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {cliftonstrengthsData?.explanation || "Similar to CliftonStrengths, these themes represent your natural talents and areas where you excel:"}
          </p>
          {cliftonstrengthsData?.domains && (
            <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
              {Object.entries(cliftonstrengthsData.domains).map(([domain, score]) => (
                <div key={domain} className="flex justify-between">
                  <span className="text-muted-foreground">{domain}:</span>
                  <span className="font-medium">{Math.round(score)}%</span>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-3">
            {topStrengths.map((strength, index) => (
              <motion.div
                key={strength.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border bg-card p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{strength.name}</h4>
                    {"domain" in strength && (
                      <p className="text-xs text-muted-foreground">{strength.domain}</p>
                    )}
                  </div>
                  <span className="text-xs font-medium text-primary">
                    {Math.round("score" in strength ? strength.score : ("percentile" in strength ? strength.percentile : 0) || 0)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enneagram */}
        <div>
          <h3 className="font-semibold mb-3">Enneagram Type</h3>
          {showEnneagram ? (
            <>
              {enneagramWarning && (
                <div className="flex items-center gap-2 text-amber-600 text-sm mb-3 p-2 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>{confidence?.enneagram.message || 'Preliminary result - complete more questions for higher accuracy'}</span>
                </div>
              )}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-block rounded-lg bg-purple-500/10 px-4 py-2 mb-2"
              >
                <span className="text-xl font-bold text-purple-600">
                  Type {"primary_type" in enneagram ? enneagram.primary_type : enneagram.type}: {"primary_type" in enneagram ? enneagramTypes.find(t => t.type === enneagram.primary_type)?.name : enneagram.name}
                </span>
                {("primary_probability" in enneagram || confidence?.enneagram.percentage) && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({Math.round("primary_probability" in enneagram ? enneagram.primary_probability : confidence?.enneagram.percentage || 0)}% match)
                  </span>
                )}
              </motion.div>
              <p className="text-sm text-muted-foreground mb-2">
                {"primary_type" in enneagram 
                  ? enneagramTypes.find(t => t.type === enneagram.primary_type)?.description || ""
                  : enneagram.description}
              </p>
              {"wing" in enneagram && enneagram.wing && (
                <p className="text-sm text-muted-foreground mb-2">
                  Wing: Type {enneagram.wing} ({Math.round(enneagram.wing_probability)}% match)
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {"explanation" in enneagram && enneagram.explanation 
                  ? enneagram.explanation
                  : "This Enneagram type was determined by analyzing patterns in your dimensional scores. Your wing types (adjacent numbers) may also resonate with you."}
              </p>
            </>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-3">
                {confidence?.enneagram.message || 'Complete checkpoint 3 to discover your Enneagram type'}
              </p>
              {onContinueAssessment && (
                <Button variant="outline" size="sm" onClick={onContinueAssessment}>
                  Continue Assessment <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </FeatureGate>
  );
}

