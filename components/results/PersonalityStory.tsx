"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dimensionColors } from "@/lib/design-tokens";
import { calculateArchetype } from "@/lib/archetypes";
import type { DimensionScore, Dimension } from "@/types";

interface PersonalityStoryProps {
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

const dimensionDescriptions: Record<Dimension, string> = {
  openness: "curiosity, creativity, and appreciation for new experiences",
  conscientiousness: "organization, discipline, and goal-directed behavior",
  extraversion: "social energy, assertiveness, and positive emotionality",
  agreeableness: "cooperation, empathy, and concern for others",
  emotionalResilience: "stability, composure, and ability to handle stress",
  honestyHumility: "authenticity, fairness, and modesty",
  adaptability: "flexibility, openness to change, and comfort with uncertainty",
};

export function PersonalityStory({ scores }: PersonalityStoryProps) {
  const { primary } = calculateArchetype(scores);
  const scoreMap = scores.reduce((acc, score) => {
    acc[score.dimension] = score;
    return acc;
  }, {} as Record<Dimension, DimensionScore>);

  // Identify top 3 and bottom 3 dimensions
  const sortedScores = [...scores].sort((a, b) => b.percentile - a.percentile);
  const topThree = sortedScores.slice(0, 3);
  const bottomThree = sortedScores.slice(-3).reverse();

  // Identify key patterns
  const isHighExtraversion = scoreMap.extraversion?.percentile >= 70;
  const isHighOpenness = scoreMap.openness?.percentile >= 70;
  const isHighConscientiousness = scoreMap.conscientiousness?.percentile >= 70;
  const isHighAgreeableness = scoreMap.agreeableness?.percentile >= 70;
  const isHighResilience = scoreMap.emotionalResilience?.percentile >= 70;
  const isHighAdaptability = scoreMap.adaptability?.percentile >= 70;

  // Generate narrative paragraphs
  const generateOpening = () => {
    const topDim = topThree[0];
    const topName = dimensionNames[topDim.dimension];
    const topDesc = dimensionDescriptions[topDim.dimension];
    
    return `As ${primary.name}, your personality profile reveals a distinctive combination of traits that shape how you navigate the world. ${topName} stands out as one of your most prominent dimensions (${Math.round(topDim.percentile)}th percentile), reflecting your natural inclination toward ${topDesc}. This dimension, along with your other core traits, creates a unique psychological fingerprint that influences your thoughts, behaviors, and interactions. ${primary.tagline}.`;
  };

  const generatePatterns = () => {
    const patterns: string[] = [];

    // Social energy pattern
    if (isHighExtraversion && isHighAgreeableness) {
      patterns.push("You likely thrive in collaborative environments where you can combine your social energy with your natural empathy");
    } else if (isHighExtraversion && !isHighAgreeableness) {
      patterns.push("Your assertiveness and social confidence may make you a natural leader, though you may prefer direct communication over diplomatic approaches");
    } else if (!isHighExtraversion && isHighAgreeableness) {
      patterns.push("You tend to build deep, meaningful connections with a smaller circle of trusted individuals rather than seeking broad social networks");
    }

    // Cognitive style pattern
    if (isHighOpenness && isHighConscientiousness) {
      patterns.push("You balance creative exploration with structured execution, allowing you to innovate while maintaining focus and organization");
    } else if (isHighOpenness && !isHighConscientiousness) {
      patterns.push("Your creative and exploratory nature may lead you to pursue multiple interests simultaneously, sometimes at the expense of completing every project");
    } else if (!isHighOpenness && isHighConscientiousness) {
      patterns.push("You prefer proven methods and established systems, excelling when you can apply your organizational skills to well-defined tasks");
    }

    // Resilience pattern
    if (isHighResilience && isHighAdaptability) {
      patterns.push("You demonstrate remarkable flexibility in the face of change, maintaining your composure even when circumstances shift unexpectedly");
    } else if (isHighResilience && !isHighAdaptability) {
      patterns.push("While you handle stress well, you may prefer stability and predictability over frequent changes");
    }

    if (patterns.length === 0) {
      patterns.push("Your dimensional profile shows a balanced approach across multiple traits, suggesting versatility in different situations");
    }

    return patterns.join(". ") + ".";
  };

  const generateContextualVariations = () => {
    const variations: string[] = [];

    if (isHighExtraversion && isHighOpenness) {
      variations.push("In social settings, you're likely energized by new people and novel experiences");
    }
    if (isHighConscientiousness && isHighResilience) {
      variations.push("Under pressure, you maintain your organizational systems and continue working methodically");
    }
    if (isHighAgreeableness && scoreMap.honestyHumility?.percentile >= 70) {
      variations.push("In relationships, you prioritize authenticity and genuine connection over surface-level interactions");
    }
    if (isHighAdaptability && isHighOpenness) {
      variations.push("When facing uncertainty, you're more likely to see opportunities than threats");
    }

    if (variations.length === 0) {
      variations.push("Your personality expression may vary significantly depending on the context and your current goals");
    }

    return variations.join(" ") + ".";
  };

  const generateBalancedPerspective = () => {
    const strengths: string[] = [];
    const growthAreas: string[] = [];

    topThree.forEach((score) => {
      const name = dimensionNames[score.dimension];
      strengths.push(name.toLowerCase());
    });

    bottomThree.forEach((score) => {
      const name = dimensionNames[score.dimension];
      growthAreas.push(name.toLowerCase());
    });

    let perspective = `Your strongest dimensions—${strengths.slice(0, 2).join(" and ")}, and ${strengths[2]}—represent areas where you naturally excel. `;
    
    if (bottomThree[0].percentile < 40) {
      perspective += `At the same time, your lower scores in ${growthAreas[0]} suggest areas where you might intentionally develop new skills or perspectives. `;
    }
    
    perspective += `Remember that personality traits are not fixed—they represent tendencies that can be expressed differently across situations and can evolve over time. Your profile reflects who you are now, but it also highlights potential pathways for growth and development.`;

    return perspective;
  };

  const paragraphs = [
    generateOpening(),
    generatePatterns(),
    generateContextualVariations(),
    generateBalancedPerspective(),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Personality Story</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="text-muted-foreground leading-relaxed"
          >
            {paragraph}
          </motion.p>
        ))}
      </CardContent>
    </Card>
  );
}

