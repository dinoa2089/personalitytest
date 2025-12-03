"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Target, TrendingUp, Lightbulb, Shield } from "lucide-react";
import type { DimensionScore } from "@/types";

interface WorkInsightsProps {
  scores: DimensionScore[];
}

interface TeamRole {
  name: string;
  match: number;
  description: string;
  strengths: string[];
  fit: "excellent" | "good" | "moderate";
}

interface WorkRecommendation {
  category: string;
  title: string;
  description: string;
  actionable: string[];
  icon: React.ReactNode;
}

export function WorkInsights({ scores }: WorkInsightsProps) {
  const scoreMap = scores.reduce((acc, score) => {
    acc[score.dimension] = score.percentile;
    return acc;
  }, {} as Record<string, number>);

  // Calculate team role recommendations
  const calculateTeamRoles = (): TeamRole[] => {
    const roles: TeamRole[] = [];

    // Leader
    const leadershipScore = 
      (scoreMap.extraversion || 50) * 0.3 +
      (scoreMap.conscientiousness || 50) * 0.3 +
      (scoreMap.emotionalResilience || 50) * 0.2 +
      (scoreMap.adaptability || 50) * 0.2;
    
    if (leadershipScore > 60) {
      roles.push({
        name: "Team Leader",
        match: leadershipScore,
        description: "You excel at guiding teams, making strategic decisions, and inspiring others.",
        strengths: [
          "Strategic vision and direction",
          "Team motivation and development",
          "Decision-making under pressure",
          "Conflict resolution"
        ],
        fit: leadershipScore > 75 ? "excellent" : "good"
      });
    }

    // Individual Contributor
    const icScore = 
      (scoreMap.conscientiousness || 50) * 0.4 +
      (scoreMap.openness || 50) * 0.3 +
      (scoreMap.honestyHumility || 50) * 0.3;
    
    roles.push({
      name: "Individual Contributor",
      match: icScore,
      description: "You thrive when working independently on specialized tasks and projects.",
      strengths: [
        "Deep expertise development",
        "Quality-focused execution",
        "Reliable delivery",
        "Technical problem-solving"
      ],
      fit: icScore > 70 ? "excellent" : icScore > 55 ? "good" : "moderate"
    });

    // Collaborator
    const collaboratorScore = 
      (scoreMap.agreeableness || 50) * 0.4 +
      (scoreMap.extraversion || 50) * 0.3 +
      (scoreMap.emotionalResilience || 50) * 0.3;
    
    if (collaboratorScore > 60) {
      roles.push({
        name: "Collaborator",
        match: collaboratorScore,
        description: "You excel at working with others, building consensus, and facilitating teamwork.",
        strengths: [
          "Cross-functional collaboration",
          "Stakeholder management",
          "Team cohesion",
          "Knowledge sharing"
        ],
        fit: collaboratorScore > 75 ? "excellent" : "good"
      });
    }

    // Innovator
    const innovatorScore = 
      (scoreMap.openness || 50) * 0.5 +
      (scoreMap.adaptability || 50) * 0.3 +
      (scoreMap.extraversion || 50) * 0.2;
    
    if (innovatorScore > 65) {
      roles.push({
        name: "Innovator",
        match: innovatorScore,
        description: "You drive change, explore new possibilities, and create breakthrough solutions.",
        strengths: [
          "Creative problem-solving",
          "Change management",
          "Future-oriented thinking",
          "Experimentation and learning"
        ],
        fit: innovatorScore > 80 ? "excellent" : "good"
      });
    }

    return roles.sort((a, b) => b.match - a.match).slice(0, 3);
  };

  // Generate work recommendations
  const generateRecommendations = (): WorkRecommendation[] => {
    const recommendations: WorkRecommendation[] = [];

    // Career Development
    if (scoreMap.openness && scoreMap.openness > 70) {
      recommendations.push({
        category: "Career Development",
        title: "Pursue Roles Requiring Innovation",
        description: "Your high openness suggests you'd thrive in roles that value creativity and new ideas.",
        actionable: [
          "Seek out projects involving new technologies or methodologies",
          "Consider roles in R&D, product development, or innovation teams",
          "Look for companies with a culture of experimentation",
          "Build skills in design thinking and creative problem-solving"
        ],
        icon: <Lightbulb className="h-5 w-5" />
      });
    }

    // Work Environment
    if (scoreMap.conscientiousness && scoreMap.conscientiousness > 70) {
      recommendations.push({
        category: "Work Environment",
        title: "Thrive in Structured Environments",
        description: "Your high conscientiousness indicates you perform best with clear processes and expectations.",
        actionable: [
          "Seek roles with well-defined responsibilities and goals",
          "Prefer organizations with established processes",
          "Look for companies that value planning and organization",
          "Consider roles in operations, project management, or quality assurance"
        ],
        icon: <Target className="h-5 w-5" />
      });
    }

    // Team Dynamics
    if (scoreMap.extraversion && scoreMap.extraversion > 70) {
      recommendations.push({
        category: "Team Dynamics",
        title: "Excel in Collaborative Settings",
        description: "Your high extraversion suggests you energize teams and drive group success.",
        actionable: [
          "Seek roles with frequent team interaction",
          "Consider leadership or mentoring opportunities",
          "Look for companies with strong team cultures",
          "Build skills in facilitation and team building"
        ],
        icon: <Users className="h-5 w-5" />
      });
    } else if (scoreMap.extraversion && scoreMap.extraversion < 40) {
      recommendations.push({
        category: "Team Dynamics",
        title: "Optimize for Deep Work",
        description: "Your preference for independent work suggests you excel with focused, uninterrupted time.",
        actionable: [
          "Negotiate for quiet workspace or remote work options",
          "Block calendar time for deep work",
          "Seek roles with minimal meeting requirements",
          "Consider individual contributor or specialist roles"
        ],
        icon: <Shield className="h-5 w-5" />
      });
    }

    // Stress Management
    if (scoreMap.emotionalResilience && scoreMap.emotionalResilience < 50) {
      recommendations.push({
        category: "Stress Management",
        title: "Build Resilience Strategies",
        description: "Develop techniques to manage workplace stress and maintain performance under pressure.",
        actionable: [
          "Practice mindfulness or stress-reduction techniques",
          "Set clear boundaries between work and personal time",
          "Seek supportive work environments",
          "Consider stress management coaching or resources"
        ],
        icon: <TrendingUp className="h-5 w-5" />
      });
    }

    return recommendations;
  };

  // Calculate work environment fit
  const calculateWorkEnvironmentFit = () => {
    const structured = (scoreMap.conscientiousness || 50) * 0.6 + (scoreMap.adaptability || 50) * 0.4;
    const dynamic = (scoreMap.adaptability || 50) * 0.6 + (scoreMap.openness || 50) * 0.4;
    const collaborative = (scoreMap.extraversion || 50) * 0.5 + (scoreMap.agreeableness || 50) * 0.5;
    const independent = (100 - (scoreMap.extraversion || 50)) * 0.6 + (scoreMap.conscientiousness || 50) * 0.4;

    return {
      structured: Math.round(structured),
      dynamic: Math.round(dynamic),
      collaborative: Math.round(collaborative),
      independent: Math.round(independent),
    };
  };

  const teamRoles = calculateTeamRoles();
  const recommendations = generateRecommendations();
  const environmentFit = calculateWorkEnvironmentFit();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Work & Career Insights
        </CardTitle>
        <CardDescription>
          Professional insights tailored for career development and workplace success
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Team Role Recommendations */}
        <div>
          <h3 className="font-semibold mb-4">Recommended Team Roles</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Based on your personality profile, these roles align best with your natural strengths:
          </p>
          <div className="space-y-4">
            {teamRoles.map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border bg-card p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{role.name}</h4>
                      <Badge 
                        variant={
                          role.fit === "excellent" ? "default" :
                          role.fit === "good" ? "secondary" : "outline"
                        }
                      >
                        {Math.round(role.match)}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                    <div>
                      <p className="text-xs font-medium mb-2">Key Strengths:</p>
                      <ul className="space-y-1">
                        {role.strengths.map((strength, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Work Environment Fit */}
        <div>
          <h3 className="font-semibold mb-4">Work Environment Fit</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your ideal work environment characteristics:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Structured</span>
                <span className="text-sm font-bold">{environmentFit.structured}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${environmentFit.structured}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Dynamic</span>
                <span className="text-sm font-bold">{environmentFit.dynamic}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${environmentFit.dynamic}%` }}
                  className="h-full bg-purple-500"
                />
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Collaborative</span>
                <span className="text-sm font-bold">{environmentFit.collaborative}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${environmentFit.collaborative}%` }}
                  className="h-full bg-green-500"
                />
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Independent</span>
                <span className="text-sm font-bold">{environmentFit.independent}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${environmentFit.independent}%` }}
                  className="h-full bg-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div>
          <h3 className="font-semibold mb-4">Career Development Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-primary">{rec.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {rec.category}
                      </Badge>
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                    <div>
                      <p className="text-xs font-medium mb-2">Action Steps:</p>
                      <ul className="space-y-1">
                        {rec.actionable.map((action, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">→</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}






