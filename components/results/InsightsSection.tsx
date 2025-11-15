"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Heart, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";
import type { DimensionScore, Dimension } from "@/types";

interface InsightsSectionProps {
  scores: DimensionScore[];
}

const dimensionNames: Record<Dimension, string> = {
  openness: "Openness to Experience",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  emotionalResilience: "Emotional Resilience",
  honestyHumility: "Honesty-Humility",
  adaptability: "Adaptability",
};

export function InsightsSection({ scores }: InsightsSectionProps) {
  const scoreMap = scores.reduce((acc, score) => {
    acc[score.dimension] = score;
    return acc;
  }, {} as Record<Dimension, DimensionScore>);

  // Find top 3 and bottom 3 dimensions
  const sortedScores = [...scores].sort((a, b) => b.percentile - a.percentile);
  const top3 = sortedScores.slice(0, 3);
  const bottom3 = sortedScores.slice(-3).reverse();

  // Generate work context insights
  const generateWorkInsights = () => {
    const insights: string[] = [];
    const isHighConscientiousness = scoreMap.conscientiousness?.percentile >= 70;
    const isHighExtraversion = scoreMap.extraversion?.percentile >= 70;
    const isHighOpenness = scoreMap.openness?.percentile >= 70;
    const isHighAgreeableness = scoreMap.agreeableness?.percentile >= 70;
    const isHighResilience = scoreMap.emotionalResilience?.percentile >= 70;
    const isHighAdaptability = scoreMap.adaptability?.percentile >= 70;

    if (isHighConscientiousness && isHighOpenness) {
      insights.push("You excel in roles that require both creative problem-solving and systematic execution");
    } else if (isHighConscientiousness) {
      insights.push("You thrive in structured environments with clear goals and established processes");
    } else if (isHighOpenness) {
      insights.push("You're most effective in roles that allow for innovation and exploration of new ideas");
    }

    if (isHighExtraversion && isHighAgreeableness) {
      insights.push("You're a natural collaborator who builds strong team relationships and facilitates group success");
    } else if (isHighExtraversion) {
      insights.push("You're comfortable taking leadership roles and driving initiatives forward");
    } else if (!isHighExtraversion) {
      insights.push("You work best in focused, independent settings where you can dive deep into complex problems");
    }

    if (isHighResilience && isHighAdaptability) {
      insights.push("You handle workplace change and pressure exceptionally well, maintaining performance under stress");
    } else if (isHighResilience) {
      insights.push("You maintain composure in high-pressure situations, making you reliable in crisis management");
    }

    if (insights.length === 0) {
      insights.push("Your balanced profile suggests versatility across different work contexts and team dynamics");
    }

    return insights;
  };

  // Generate relationship insights
  const generateRelationshipInsights = () => {
    const insights: string[] = [];
    const isHighAgreeableness = scoreMap.agreeableness?.percentile >= 70;
    const isHighExtraversion = scoreMap.extraversion?.percentile >= 70;
    const isHighHonestyHumility = scoreMap.honestyHumility?.percentile >= 70;
    const isHighEmotionalResilience = scoreMap.emotionalResilience?.percentile >= 70;
    const isLowAgreeableness = scoreMap.agreeableness?.percentile < 40;
    const isLowExtraversion = scoreMap.extraversion?.percentile < 40;

    if (isHighAgreeableness && isHighHonestyHumility) {
      insights.push("You prioritize authentic, genuine connections and value fairness in your relationships");
    } else if (isHighAgreeableness) {
      insights.push("You're naturally empathetic and often put others' needs before your own");
    } else if (isLowAgreeableness) {
      insights.push("You value direct communication and may prioritize honesty over harmony in relationships");
    }

    if (isHighExtraversion && isHighAgreeableness) {
      insights.push("You enjoy social activities and build broad networks of friends and acquaintances");
    } else if (isLowExtraversion && isHighAgreeableness) {
      insights.push("You prefer deeper, more meaningful connections with a smaller circle of close friends");
    } else if (isLowExtraversion) {
      insights.push("You value quality over quantity in relationships, investing deeply in a few close connections");
    }

    if (isHighEmotionalResilience) {
      insights.push("You provide stable emotional support to others and handle relationship conflicts with composure");
    }

    if (insights.length === 0) {
      insights.push("Your relationship style adapts based on context and the depth of connection you seek");
    }

    return insights;
  };

  // Generate stress response insights
  const generateStressInsights = () => {
    const insights: string[] = [];
    const resilience = scoreMap.emotionalResilience?.percentile || 50;
    const adaptability = scoreMap.adaptability?.percentile || 50;
    const conscientiousness = scoreMap.conscientiousness?.percentile || 50;
    const openness = scoreMap.openness?.percentile || 50;

    if (resilience >= 70 && adaptability >= 70) {
      insights.push("You handle stress exceptionally well, viewing challenges as opportunities and adapting quickly");
    } else if (resilience >= 70) {
      insights.push("You maintain emotional stability under pressure, though you may prefer predictable stress over sudden changes");
    } else if (resilience < 40) {
      insights.push("You may be more sensitive to stress and benefit from developing coping strategies and support systems");
    }

    if (conscientiousness >= 70 && resilience >= 70) {
      insights.push("Under stress, you rely on your organizational systems and methodical approach to regain control");
    } else if (openness >= 70 && adaptability >= 70) {
      insights.push("When stressed, you may seek novel solutions or change your environment to find relief");
    }

    if (insights.length === 0) {
      insights.push("Your stress response varies based on the type and duration of the stressor");
    }

    return insights;
  };

  // Generate learning and communication preferences
  const generateLearningInsights = () => {
    const insights: string[] = [];
    const openness = scoreMap.openness?.percentile || 50;
    const extraversion = scoreMap.extraversion?.percentile || 50;
    const conscientiousness = scoreMap.conscientiousness?.percentile || 50;

    if (openness >= 70 && extraversion >= 70) {
      insights.push("You learn best through interactive discussions, hands-on exploration, and collaborative projects");
    } else if (openness >= 70) {
      insights.push("You prefer learning through independent exploration, experimentation, and creative problem-solving");
    } else if (conscientiousness >= 70) {
      insights.push("You learn most effectively through structured methods, clear instructions, and systematic practice");
    }

    if (extraversion >= 70) {
      insights.push("You communicate best through verbal discussion and benefit from explaining concepts to others");
    } else {
      insights.push("You prefer written communication and benefit from time to reflect before responding");
    }

    return insights;
  };

  const workInsights = generateWorkInsights();
  const relationshipInsights = generateRelationshipInsights();
  const stressInsights = generateStressInsights();
  const learningInsights = generateLearningInsights();

  return (
    <div className="space-y-6">
      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Strengths
          </CardTitle>
          <CardDescription>Areas where you score highest</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {top3.map((score, index) => (
              <motion.div
                key={score.dimension}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border bg-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">
                    {dimensionNames[score.dimension]}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {Math.round(score.percentile)}th percentile
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This is one of your strongest dimensions, indicating natural talent and comfort in this area.
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Growth Areas
          </CardTitle>
          <CardDescription>Areas with potential for development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bottom3.map((score, index) => (
              <motion.div
                key={score.dimension}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border bg-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">
                    {dimensionNames[score.dimension]}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {Math.round(score.percentile)}th percentile
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This dimension offers opportunities for intentional growth and skill development.
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Context
          </CardTitle>
          <CardDescription>How your personality shows up at work</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {workInsights.map((insight, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-muted-foreground">{insight}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Relationships */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Relationships
          </CardTitle>
          <CardDescription>How you connect with others</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {relationshipInsights.map((insight, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-muted-foreground">{insight}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Stress & Resilience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Stress Response & Resilience
          </CardTitle>
          <CardDescription>How you handle pressure and challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {stressInsights.map((insight, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-muted-foreground">{insight}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Learning & Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Learning & Communication
          </CardTitle>
          <CardDescription>Your preferred learning and communication styles</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {learningInsights.map((insight, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-muted-foreground">{insight}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

