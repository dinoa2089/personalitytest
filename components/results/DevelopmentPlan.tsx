"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Calendar, 
  BookOpen, 
  CheckCircle2,
  Circle,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Clock,
  Star
} from "lucide-react";
import { FeatureGate } from "@/components/premium/FeatureGate";
import type { Archetype } from "@/lib/archetypes";
import type { DimensionScore } from "@/types";

interface DevelopmentPlanProps {
  archetype: Archetype;
  scores: DimensionScore[];
}

interface Challenge {
  day: number;
  title: string;
  description: string;
  category: "mindset" | "action" | "reflection" | "social";
  duration: string;
}

interface GrowthArea {
  dimension: string;
  label: string;
  currentScore: number;
  tips: string[];
  resources: { title: string; type: "book" | "article" | "exercise" }[];
}

// Challenge templates based on growth areas
const challengeTemplates: Record<string, Challenge[]> = {
  openness: [
    { day: 1, title: "Try Something New", description: "Choose an activity you've never done before, even if it's small", category: "action", duration: "30 min" },
    { day: 5, title: "Question Your Assumptions", description: "Pick one belief you hold and research the opposing viewpoint", category: "reflection", duration: "20 min" },
    { day: 10, title: "Creative Expression", description: "Express yourself through art, writing, or music—no judgment", category: "action", duration: "45 min" },
    { day: 15, title: "Learn from Difference", description: "Have a conversation with someone very different from you", category: "social", duration: "30 min" },
    { day: 20, title: "Embrace Uncertainty", description: "Make a small decision without researching it first", category: "mindset", duration: "15 min" },
    { day: 25, title: "Explore New Ideas", description: "Read or watch something outside your usual interests", category: "action", duration: "1 hour" },
    { day: 30, title: "Reflect on Growth", description: "Journal about how your perspective has changed this month", category: "reflection", duration: "20 min" },
  ],
  conscientiousness: [
    { day: 1, title: "Plan Tomorrow Tonight", description: "Before bed, write down your top 3 priorities for tomorrow", category: "action", duration: "10 min" },
    { day: 5, title: "Declutter One Space", description: "Organize one drawer, shelf, or area of your home", category: "action", duration: "30 min" },
    { day: 10, title: "Track Your Time", description: "Log how you spend your time today, hour by hour", category: "reflection", duration: "All day" },
    { day: 15, title: "Start a Keystone Habit", description: "Begin one small daily habit that triggers other positive behaviors", category: "action", duration: "15 min" },
    { day: 20, title: "Review Your Goals", description: "Write down your goals and create one specific next step for each", category: "reflection", duration: "30 min" },
    { day: 25, title: "Practice Finishing", description: "Complete one thing you've been putting off, no matter how small", category: "action", duration: "Variable" },
    { day: 30, title: "Create a System", description: "Design a simple system for one recurring task in your life", category: "action", duration: "45 min" },
  ],
  extraversion: [
    { day: 1, title: "Reach Out First", description: "Initiate a conversation with someone you haven't talked to recently", category: "social", duration: "15 min" },
    { day: 5, title: "Join a Group Activity", description: "Attend a class, meetup, or group event", category: "social", duration: "1-2 hours" },
    { day: 10, title: "Practice Active Listening", description: "In your next conversation, focus entirely on understanding", category: "social", duration: "30 min" },
    { day: 15, title: "Share Your Ideas", description: "Speak up in a meeting or share your opinion publicly", category: "action", duration: "10 min" },
    { day: 20, title: "Network Authentically", description: "Connect with someone new and find common ground", category: "social", duration: "30 min" },
    { day: 25, title: "Recharge Strategically", description: "Notice when you need alone time and take it guilt-free", category: "reflection", duration: "1 hour" },
    { day: 30, title: "Host Something", description: "Organize a small gathering, even just 2-3 people", category: "social", duration: "2 hours" },
  ],
  agreeableness: [
    { day: 1, title: "Practice Saying No", description: "Decline one request politely but firmly", category: "action", duration: "5 min" },
    { day: 5, title: "Express Your Needs", description: "Clearly state what you need in one interaction today", category: "social", duration: "10 min" },
    { day: 10, title: "Healthy Boundaries", description: "Identify one boundary you need to set and communicate it", category: "reflection", duration: "30 min" },
    { day: 15, title: "Constructive Feedback", description: "Give honest, helpful feedback to someone", category: "social", duration: "15 min" },
    { day: 20, title: "Self-Compassion", description: "Treat yourself with the kindness you show others", category: "mindset", duration: "20 min" },
    { day: 25, title: "Negotiate for Yourself", description: "Advocate for something you want or deserve", category: "action", duration: "Variable" },
    { day: 30, title: "Balance Care", description: "Reflect on giving to others vs. giving to yourself", category: "reflection", duration: "20 min" },
  ],
  emotionalResilience: [
    { day: 1, title: "Breathe Through Stress", description: "Practice 4-7-8 breathing when you feel stressed", category: "action", duration: "5 min" },
    { day: 5, title: "Name Your Emotions", description: "Journal about what you're feeling and why", category: "reflection", duration: "15 min" },
    { day: 10, title: "Reframe a Setback", description: "Find one positive lesson in a recent challenge", category: "mindset", duration: "10 min" },
    { day: 15, title: "Build a Stress Toolkit", description: "List 5 healthy ways you can manage stress", category: "reflection", duration: "20 min" },
    { day: 20, title: "Practice Acceptance", description: "Accept something you cannot change without trying to fix it", category: "mindset", duration: "All day" },
    { day: 25, title: "Seek Support", description: "Talk to someone you trust about something that's bothering you", category: "social", duration: "30 min" },
    { day: 30, title: "Celebrate Resilience", description: "Acknowledge a time you bounced back from difficulty", category: "reflection", duration: "15 min" },
  ],
  honestyHumility: [
    { day: 1, title: "Admit a Mistake", description: "Acknowledge an error to someone without making excuses", category: "action", duration: "10 min" },
    { day: 5, title: "Ask for Feedback", description: "Request honest feedback on something you did", category: "social", duration: "15 min" },
    { day: 10, title: "Give Credit", description: "Publicly acknowledge someone else's contribution", category: "social", duration: "5 min" },
    { day: 15, title: "Check Your Ego", description: "Notice when pride influences your decisions", category: "reflection", duration: "All day" },
    { day: 20, title: "Learn from Someone Unexpected", description: "Seek wisdom from someone you might normally overlook", category: "social", duration: "30 min" },
    { day: 25, title: "Practice Transparency", description: "Share something you'd normally keep private (appropriately)", category: "action", duration: "15 min" },
    { day: 30, title: "Reflect on Authenticity", description: "Journal about where you're most and least authentic", category: "reflection", duration: "20 min" },
  ],
  adaptability: [
    { day: 1, title: "Change Your Routine", description: "Do one thing differently in your morning or evening routine", category: "action", duration: "15 min" },
    { day: 5, title: "Embrace a Minor Disruption", description: "When something doesn't go as planned, go with it", category: "mindset", duration: "All day" },
    { day: 10, title: "Try a New Approach", description: "Solve a problem using a method you've never tried", category: "action", duration: "30 min" },
    { day: 15, title: "Question 'The Way It's Done'", description: "Challenge one assumption about how things should be", category: "reflection", duration: "20 min" },
    { day: 20, title: "Practice Pivoting", description: "When your first plan fails, immediately generate two alternatives", category: "mindset", duration: "15 min" },
    { day: 25, title: "Learn from Change", description: "Reflect on a past change that turned out better than expected", category: "reflection", duration: "20 min" },
    { day: 30, title: "Plan for Flexibility", description: "Create a plan B for something important in your life", category: "action", duration: "30 min" },
  ],
};

// Resource recommendations based on growth areas
const resourcesByDimension: Record<string, GrowthArea["resources"]> = {
  openness: [
    { title: "Originals by Adam Grant", type: "book" },
    { title: "The Power of Curiosity", type: "article" },
    { title: "Daily Creativity Prompts", type: "exercise" },
  ],
  conscientiousness: [
    { title: "Atomic Habits by James Clear", type: "book" },
    { title: "The Science of Habit Formation", type: "article" },
    { title: "Weekly Planning Template", type: "exercise" },
  ],
  extraversion: [
    { title: "Quiet by Susan Cain", type: "book" },
    { title: "Networking as an Introvert", type: "article" },
    { title: "Social Energy Management", type: "exercise" },
  ],
  agreeableness: [
    { title: "Boundaries by Henry Cloud", type: "book" },
    { title: "Healthy Assertiveness Guide", type: "article" },
    { title: "Saying No with Grace", type: "exercise" },
  ],
  emotionalResilience: [
    { title: "Option B by Sheryl Sandberg", type: "book" },
    { title: "Building Emotional Resilience", type: "article" },
    { title: "Stress Management Toolkit", type: "exercise" },
  ],
  honestyHumility: [
    { title: "Radical Candor by Kim Scott", type: "book" },
    { title: "The Art of Authentic Leadership", type: "article" },
    { title: "Feedback Practice Exercises", type: "exercise" },
  ],
  adaptability: [
    { title: "Who Moved My Cheese? by Spencer Johnson", type: "book" },
    { title: "Thriving Through Change", type: "article" },
    { title: "Flexibility Training", type: "exercise" },
  ],
};

const categoryColors: Record<string, string> = {
  mindset: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  action: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  reflection: "bg-amber-500/20 text-amber-600 border-amber-500/30",
  social: "bg-green-500/20 text-green-600 border-green-500/30",
};

const dimensionLabels: Record<string, string> = {
  openness: "Openness",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  emotionalResilience: "Emotional Resilience",
  honestyHumility: "Honesty-Humility",
  adaptability: "Adaptability",
};

export function DevelopmentPlan({ archetype, scores }: DevelopmentPlanProps) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(1);

  // Find the lowest scoring dimensions for growth focus
  const sortedScores = [...scores].sort((a, b) => a.percentile - b.percentile);
  const growthFocusDimensions = sortedScores.slice(0, 2);

  // Generate personalized challenges
  const generateChallenges = (): Challenge[] => {
    const challenges: Challenge[] = [];
    
    growthFocusDimensions.forEach((dimScore, index) => {
      const dimChallenges = challengeTemplates[dimScore.dimension] || [];
      dimChallenges.forEach(challenge => {
        // Offset days for second dimension
        const adjustedDay = index === 0 ? challenge.day : challenge.day + 1;
        if (adjustedDay <= 30) {
          challenges.push({ ...challenge, day: adjustedDay });
        }
      });
    });

    // Sort by day and remove duplicates
    return challenges
      .sort((a, b) => a.day - b.day)
      .filter((c, i, arr) => i === 0 || c.day !== arr[i-1].day)
      .slice(0, 30);
  };

  const challenges = generateChallenges();
  const weekChallenges = challenges.filter(c => {
    const weekStart = (selectedWeek - 1) * 7 + 1;
    const weekEnd = selectedWeek * 7;
    return c.day >= weekStart && c.day <= weekEnd;
  });

  const toggleComplete = (day: number) => {
    setCompletedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const completionPercentage = Math.round((completedDays.length / challenges.length) * 100);

  return (
    <FeatureGate feature="development_plans">
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl">30-Day Development Plan</CardTitle>
                <CardDescription>
                  Personalized growth challenges based on your profile
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="hidden md:flex gap-1">
              <Star className="h-3 w-3" />
              {completionPercentage}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Growth Focus Areas */}
          <div className="grid md:grid-cols-2 gap-4">
            {growthFocusDimensions.map((dimScore) => (
              <div
                key={dimScore.dimension}
                className="rounded-xl border border-border/50 bg-muted/30 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">
                    {dimensionLabels[dimScore.dimension]}
                  </span>
                  <Badge variant="outline">{dimScore.percentile}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  This month, we'll focus on strengthening this area with targeted exercises.
                </p>
                <div className="space-y-1">
                  {resourcesByDimension[dimScore.dimension]?.slice(0, 2).map((resource, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      <span>{resource.title}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {resource.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Week Selector */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4].map((week) => (
              <Button
                key={week}
                variant={selectedWeek === week ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedWeek(week)}
              >
                Week {week}
              </Button>
            ))}
          </div>

          {/* Challenges for Selected Week */}
          <div className="space-y-3">
            {weekChallenges.map((challenge) => (
              <motion.div
                key={challenge.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border p-4 transition-colors ${
                  completedDays.includes(challenge.day)
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-muted/30 border-border/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(challenge.day)}
                    className="mt-1 flex-shrink-0"
                  >
                    {completedDays.includes(challenge.day) ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">Day {challenge.day}</span>
                      <Badge variant="outline" className={categoryColors[challenge.category]}>
                        {challenge.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {challenge.duration}
                      </span>
                    </div>
                    <h4 className={`font-semibold ${completedDays.includes(challenge.day) ? "line-through text-muted-foreground" : ""}`}>
                      {challenge.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {challenge.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{completedDays.length} of {challenges.length} completed</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Quick Tips */}
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-purple-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Pro Tips for {archetype.name}</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {archetype.growthAreas.slice(0, 3).map((area, i) => (
                <li key={i} className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{typeof area === 'string' ? area : area.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </FeatureGate>
  );
}

