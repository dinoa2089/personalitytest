"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";
import type { DimensionScore, FrameworkMappings } from "@/types";
import Link from "next/link";

interface RandomFrameworkRevealProps {
  scores: DimensionScore[];
  frameworks?: FrameworkMappings;
  sessionId: string;
}

// Framework definitions with rich original content
const frameworkDefinitions = {
  mbti: {
    name: "Myers-Briggs Type",
    shortName: "MBTI",
    icon: "🧠",
    color: "from-blue-500 to-indigo-500",
    getType: (scores: DimensionScore[]) => {
      const scoreMap = scores.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
      const E = scoreMap.extraversion || 50;
      const N = scoreMap.openness || 50;
      const F = scoreMap.agreeableness || 50;
      const J = scoreMap.conscientiousness || 50;
      return [
        E > 50 ? "E" : "I",
        N > 50 ? "N" : "S",
        F > 50 ? "F" : "T",
        J > 50 ? "J" : "P",
      ].join("");
    },
    typeDescriptions: {
      "INTJ": { title: "The Mastermind", desc: "Strategic, independent, and determined. You see the big picture and create long-term plans to achieve ambitious goals. You value competence and logic, preferring to work independently on complex problems." },
      "INTP": { title: "The Logician", desc: "Analytical, objective, and reserved. You're driven by a desire to understand how things work. You excel at spotting inconsistencies and developing innovative theoretical frameworks." },
      "ENTJ": { title: "The Commander", desc: "Decisive, ambitious, and strategic. You naturally take charge and organize people toward goals. You value efficiency and have little patience for ineffective processes." },
      "ENTP": { title: "The Debater", desc: "Quick-witted, curious, and intellectually playful. You love exploring ideas and challenging assumptions. You thrive in debate and see possibilities everywhere." },
      "INFJ": { title: "The Advocate", desc: "Insightful, principled, and compassionate. You have a clear vision for helping others and work tirelessly toward meaningful goals. You seek deep, authentic connections." },
      "INFP": { title: "The Mediator", desc: "Idealistic, empathetic, and creative. You're guided by strong personal values and seek to make the world a better place. You express yourself best through creative outlets." },
      "ENFJ": { title: "The Protagonist", desc: "Charismatic, empathetic, and inspiring. You naturally motivate others toward growth and positive change. You're highly attuned to others' emotions and needs." },
      "ENFP": { title: "The Campaigner", desc: "Enthusiastic, creative, and sociable. You're energized by possibilities and making meaningful connections. You bring warmth and imagination to everything you do." },
      "ISTJ": { title: "The Logistician", desc: "Responsible, thorough, and dependable. You value tradition and prefer proven methods. You're the backbone of any organization, ensuring things run smoothly." },
      "ISFJ": { title: "The Defender", desc: "Supportive, reliable, and observant. You're deeply committed to helping others and maintaining harmony. You remember details and honor your commitments." },
      "ESTJ": { title: "The Executive", desc: "Organized, logical, and assertive. You excel at managing people and processes. You value order and are dedicated to upholding standards and expectations." },
      "ESFJ": { title: "The Consul", desc: "Caring, social, and traditional. You're attentive to others' needs and work hard to create harmony. You value loyalty and take your responsibilities seriously." },
      "ISTP": { title: "The Virtuoso", desc: "Practical, observant, and analytical. You're a natural troubleshooter who loves understanding how things work. You prefer hands-on experience over theory." },
      "ISFP": { title: "The Adventurer", desc: "Gentle, sensitive, and artistic. You live in the moment and express yourself through action. You're warm with those you trust but fiercely independent." },
      "ESTP": { title: "The Entrepreneur", desc: "Energetic, pragmatic, and observant. You thrive on action and live in the moment. You're perceptive about people and adapt quickly to situations." },
      "ESFP": { title: "The Entertainer", desc: "Spontaneous, energetic, and fun-loving. You love being the center of attention and bringing joy to others. You're observant of others and generous with your time." },
    }
  },
  disc: {
    name: "DISC Profile",
    shortName: "DISC",
    icon: "⚡",
    color: "from-orange-500 to-red-500",
    getType: (scores: DimensionScore[]) => {
      const scoreMap = scores.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
      const D = 100 - (scoreMap.agreeableness || 50); // Dominance (inverse of agreeableness)
      const I = scoreMap.extraversion || 50; // Influence
      const S = 100 - (scoreMap.adaptability || 50); // Steadiness (inverse of adaptability)
      const C = scoreMap.conscientiousness || 50; // Conscientiousness
      
      const highest = Math.max(D, I, S, C);
      if (highest === D) return "D";
      if (highest === I) return "I";
      if (highest === S) return "S";
      return "C";
    },
    typeDescriptions: {
      "D": { title: "Dominant", desc: "You're direct, results-oriented, and confident. You focus on the bottom line and aren't afraid to challenge the status quo. You thrive when given authority and variety, and you value competence and quick results. In teams, you push for progress and aren't satisfied with the status quo." },
      "I": { title: "Influential", desc: "You're outgoing, enthusiastic, and optimistic. You excel at motivating others and creating a positive atmosphere. You're collaborative and enjoy building relationships. You bring energy to teams and help maintain morale during challenging times." },
      "S": { title: "Steady", desc: "You're patient, reliable, and team-oriented. You value cooperation and stability, and you're skilled at supporting others. You're a great listener and bring calmness to stressful situations. You prefer consistency and may need time to adapt to sudden changes." },
      "C": { title: "Conscientious", desc: "You're analytical, reserved, and precise. You value accuracy, quality, and competence. You think through decisions carefully and prefer having all the facts. You maintain high standards and are excellent at analyzing complex problems." },
    }
  },
  enneagram: {
    name: "Enneagram Type",
    shortName: "Enneagram",
    icon: "✨",
    color: "from-purple-500 to-pink-500",
    getType: (scores: DimensionScore[]) => {
      const scoreMap = scores.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
      
      // Simplified mapping based on dimensional patterns
      const patterns = [
        { type: "1", score: (scoreMap.conscientiousness || 50) + (scoreMap.honestyHumility || 50) - (scoreMap.adaptability || 50) },
        { type: "2", score: (scoreMap.agreeableness || 50) + (scoreMap.extraversion || 50) },
        { type: "3", score: (scoreMap.conscientiousness || 50) + (scoreMap.extraversion || 50) + (scoreMap.adaptability || 50) },
        { type: "4", score: (scoreMap.openness || 50) + (100 - (scoreMap.emotionalResilience || 50)) },
        { type: "5", score: (scoreMap.openness || 50) + (100 - (scoreMap.extraversion || 50)) },
        { type: "6", score: (scoreMap.conscientiousness || 50) + (100 - (scoreMap.emotionalResilience || 50)) },
        { type: "7", score: (scoreMap.extraversion || 50) + (scoreMap.openness || 50) + (scoreMap.adaptability || 50) },
        { type: "8", score: (scoreMap.extraversion || 50) + (100 - (scoreMap.agreeableness || 50)) + (scoreMap.emotionalResilience || 50) },
        { type: "9", score: (scoreMap.agreeableness || 50) + (scoreMap.adaptability || 50) },
      ];
      
      return patterns.sort((a, b) => b.score - a.score)[0].type;
    },
    typeDescriptions: {
      "1": { title: "The Reformer", desc: "You're principled, purposeful, and self-controlled. You have a strong sense of right and wrong and strive to improve yourself and the world around you. Your integrity and idealism drive you to do things right, though you may struggle with being overly critical." },
      "2": { title: "The Helper", desc: "You're caring, interpersonal, and generous. You genuinely want to help others and often anticipate their needs before they do. Your warmth draws people to you, though you may sometimes neglect your own needs while focusing on others." },
      "3": { title: "The Achiever", desc: "You're adaptable, excelling, and driven. You're highly goal-oriented and skilled at presenting yourself well. Success and recognition matter to you, and you know how to achieve them. You may need to remember that your worth isn't just your achievements." },
      "4": { title: "The Individualist", desc: "You're expressive, dramatic, and self-aware. You have a deep emotional life and a strong sense of your own identity. You're drawn to beauty and meaning, and you're not afraid to be different. You may struggle with feelings of inadequacy." },
      "5": { title: "The Investigator", desc: "You're perceptive, innovative, and secretive. You have a deep desire to understand how things work and to be competent. You're independent and prefer to observe before engaging. You may need to work on connecting more with others." },
      "6": { title: "The Loyalist", desc: "You're committed, security-oriented, and engaging. You're reliable and work hard to build security and support systems. You anticipate problems and prepare for them. You may struggle with anxiety and self-doubt despite your capabilities." },
      "7": { title: "The Enthusiast", desc: "You're spontaneous, versatile, and acquisitive. You're optimistic and see possibilities everywhere. You love new experiences and keep many options open. You may need to slow down and follow through on commitments." },
      "8": { title: "The Challenger", desc: "You're self-confident, decisive, and willful. You're protective of those you care about and aren't afraid to confront injustice. You're natural leaders who value strength and autonomy. You may need to show more vulnerability." },
      "9": { title: "The Peacemaker", desc: "You're receptive, reassuring, and agreeable. You're accepting and create harmony in groups. You see all sides of issues and help mediate conflicts. You may need to assert yourself more and not avoid conflict entirely." },
    }
  }
};

// Other frameworks shown as locked
const lockedFrameworks = [
  { name: "Myers-Briggs (MBTI)", icon: "🧠", premium: true },
  { name: "DISC Profile", icon: "⚡", premium: true },
  { name: "Enneagram", icon: "✨", premium: true },
];

export function RandomFrameworkReveal({ scores, frameworks, sessionId }: RandomFrameworkRevealProps) {
  // Randomly select which framework to show (deterministic based on sessionId)
  const selectedFramework = useMemo(() => {
    const hash = sessionId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const frameworks = ['mbti', 'disc', 'enneagram'] as const;
    return frameworks[Math.abs(hash) % 3];
  }, [sessionId]);

  const framework = frameworkDefinitions[selectedFramework];
  const typeCode = framework.getType(scores);
  const typeDescriptions = framework.typeDescriptions as Record<string, { title: string; desc: string }>;
  const typeInfo = typeDescriptions[typeCode];

  // Get the other two frameworks that are locked
  const otherFrameworks = lockedFrameworks.filter(f => 
    f.name.toLowerCase().includes(selectedFramework) === false
  );

  return (
    <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold">Framework Mappings</CardTitle>
            <CardDescription>
              See how your results map to popular personality frameworks
            </CardDescription>
          </div>
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            1 of 3 Unlocked
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revealed Framework */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-xl border-2 border-primary/30 bg-gradient-to-br ${framework.color} p-1`}
        >
          <div className="rounded-lg bg-background/95 p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{framework.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">Your {framework.name}</Badge>
                </div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-3xl md:text-4xl font-bold text-primary">{typeCode}</span>
                  <span className="text-lg text-muted-foreground">—</span>
                  <span className="text-xl md:text-2xl font-semibold">{typeInfo?.title || "Unknown"}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {typeInfo?.desc || "Based on your dimensional scores, this is your closest match in this framework."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Locked Frameworks */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">Also available with Premium:</p>
          <div className="grid md:grid-cols-2 gap-3">
            {otherFrameworks.map((f) => (
              <div
                key={f.name}
                className="relative rounded-xl border border-dashed border-border/50 bg-muted/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl opacity-50">{f.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-muted-foreground">{f.name}</div>
                    <div className="text-xs text-muted-foreground/60">
                      Unlock for detailed breakdown
                    </div>
                  </div>
                  <Lock className="h-4 w-4 text-muted-foreground/50" />
                </div>
                <div className="absolute inset-0 backdrop-blur-[1px] rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="flex justify-center pt-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/pricing">
              Unlock All Frameworks
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

