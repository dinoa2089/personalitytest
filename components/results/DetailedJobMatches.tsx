"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Building2,
  GraduationCap,
  Star,
  ChevronDown,
  ChevronUp,
  Target,
  AlertCircle,
  Users
} from "lucide-react";
import { FeatureGate } from "@/components/premium/FeatureGate";
import { type Archetype, getStrengthTitle } from "@/lib/archetypes";
import type { DimensionScore } from "@/types";

interface DetailedJobMatchesProps {
  archetype: Archetype;
  scores: DimensionScore[];
}

interface JobMatch {
  title: string;
  fitScore: number;
  salaryRange: { min: number; max: number };
  industry: string;
  growthOutlook: "high" | "moderate" | "stable";
  educationRequired: string;
  whyYouExcel: string[];
  watchOutFor: string[];
  dayInLife: string;
  interviewTips: string[];
}

// Extended job matches with salary data
const getJobMatches = (archetype: Archetype, scores: DimensionScore[]): JobMatch[] => {
  const scoreMap = scores.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
  
  // Base jobs from archetype
  const baseJobs = archetype.careerMatches.map((job, index) => {
    const baseFit = 95 - (index * 3);
    
    return {
      title: job.title,
      fitScore: baseFit,
      salaryRange: getSalaryRange(job.title),
      industry: getIndustry(job.title),
      growthOutlook: getGrowthOutlook(job.title),
      educationRequired: getEducation(job.title),
      whyYouExcel: [job.explanation, ...getAdditionalReasons(job.title, scoreMap)],
      watchOutFor: getWatchOutFor(job.title, archetype),
      dayInLife: getDayInLife(job.title),
      interviewTips: getInterviewTips(job.title, archetype),
    };
  });

  // Add additional relevant jobs based on dimensional scores
  const additionalJobs = getAdditionalJobs(scoreMap, archetype);
  
  return [...baseJobs, ...additionalJobs].slice(0, 15);
};

// Salary ranges by job title (simplified)
const getSalaryRange = (title: string): { min: number; max: number } => {
  const salaryData: Record<string, { min: number; max: number }> = {
    // Tech
    "Software Architect": { min: 150000, max: 250000 },
    "Software Engineer": { min: 90000, max: 180000 },
    "Data Scientist": { min: 95000, max: 175000 },
    "Product Designer": { min: 85000, max: 160000 },
    "Product Manager": { min: 100000, max: 185000 },
    "Product Strategist": { min: 110000, max: 190000 },
    "UX Researcher": { min: 80000, max: 145000 },
    "Technology Architect": { min: 140000, max: 220000 },
    "Systems Designer": { min: 100000, max: 170000 },
    
    // Business
    "Marketing Director": { min: 90000, max: 180000 },
    "Sales Director": { min: 100000, max: 200000 },
    "Operations Manager": { min: 70000, max: 130000 },
    "Operations Executive": { min: 120000, max: 220000 },
    "Project Manager": { min: 70000, max: 130000 },
    "Management Consultant": { min: 85000, max: 200000 },
    "Business Development Manager": { min: 75000, max: 150000 },
    "Financial Analyst": { min: 65000, max: 120000 },
    "Investment Analyst": { min: 80000, max: 160000 },
    
    // Leadership
    "Chief Innovation Officer": { min: 180000, max: 350000 },
    "Executive Coach": { min: 100000, max: 250000 },
    "Entrepreneur": { min: 0, max: 500000 },
    "Nonprofit Director": { min: 60000, max: 120000 },
    "Strategic Planner": { min: 80000, max: 150000 },
    
    // Creative
    "Creative Director": { min: 90000, max: 180000 },
    "Content Creator": { min: 40000, max: 150000 },
    "Travel Writer": { min: 35000, max: 90000 },
    "Photographer": { min: 35000, max: 100000 },
    
    // People-focused
    "Human Resources Manager": { min: 70000, max: 130000 },
    "Human Resources Director": { min: 100000, max: 180000 },
    "Therapist or Counselor": { min: 50000, max: 100000 },
    "Life Coach": { min: 45000, max: 150000 },
    "Social Worker": { min: 45000, max: 80000 },
    "Community Manager": { min: 50000, max: 90000 },
    "Customer Success Manager": { min: 60000, max: 110000 },
    
    // Research
    "Research Scientist": { min: 70000, max: 140000 },
    "Research Analyst": { min: 60000, max: 100000 },
    "Academic Researcher": { min: 55000, max: 120000 },
    "Research Director": { min: 100000, max: 180000 },
    
    // Default
    default: { min: 50000, max: 100000 },
  };
  
  return salaryData[title] || salaryData.default;
};

const getIndustry = (title: string): string => {
  if (title.includes("Software") || title.includes("Data") || title.includes("Technology")) return "Technology";
  if (title.includes("Marketing") || title.includes("Sales")) return "Marketing & Sales";
  if (title.includes("Research")) return "Research & Development";
  if (title.includes("Human") || title.includes("Counselor") || title.includes("Coach")) return "Human Resources / Coaching";
  if (title.includes("Creative") || title.includes("Content") || title.includes("Writer")) return "Creative & Media";
  if (title.includes("Financial") || title.includes("Investment")) return "Finance";
  return "Business & Management";
};

const getGrowthOutlook = (title: string): "high" | "moderate" | "stable" => {
  const highGrowth = ["Data Scientist", "Product Manager", "UX Researcher", "Software", "AI", "Cloud"];
  const moderate = ["Marketing", "Sales", "Consultant", "Analyst"];
  
  if (highGrowth.some(term => title.includes(term))) return "high";
  if (moderate.some(term => title.includes(term))) return "moderate";
  return "stable";
};

const getEducation = (title: string): string => {
  if (title.includes("Director") || title.includes("Chief")) return "Bachelor's + 10 years experience";
  if (title.includes("Manager") || title.includes("Lead")) return "Bachelor's + 5 years experience";
  if (title.includes("Scientist") || title.includes("Research")) return "Master's or PhD preferred";
  if (title.includes("Coach") || title.includes("Counselor")) return "Master's + Certification";
  return "Bachelor's degree";
};

const getAdditionalReasons = (title: string, scoreMap: Record<string, number>): string[] => {
  const reasons: string[] = [];
  
  if (scoreMap.openness > 70) {
    reasons.push("Your high Openness means you'll bring fresh perspectives and innovative solutions");
  }
  if (scoreMap.conscientiousness > 70) {
    reasons.push("Your strong Conscientiousness ensures reliable execution and attention to detail");
  }
  if (scoreMap.extraversion > 70 && (title.includes("Sales") || title.includes("Manager"))) {
    reasons.push("Your social energy is perfect for the interpersonal demands of this role");
  }
  
  return reasons.slice(0, 2);
};

const getWatchOutFor = (title: string, archetype: Archetype): string[] => {
  const warnings: string[] = [];
  
  archetype.growthAreas.slice(0, 2).forEach(area => {
    warnings.push(`Your growth area of "${area.toLowerCase()}" may be challenged in this role`);
  });
  
  return warnings;
};

const getDayInLife = (title: string): string => {
  const dayDescriptions: Record<string, string> = {
    "Software Architect": "Your day involves designing system architectures, reviewing code, and collaborating with teams on technical decisions. You'll balance strategic thinking with hands-on problem solving.",
    "Product Manager": "You'll run between user interviews, roadmap planning sessions, and stakeholder meetings. Your days are dynamic, balancing customer needs with business goals.",
    "Data Scientist": "Expect to split time between exploring datasets, building models, and presenting insights to stakeholders. You'll need both deep focus and communication skills.",
    "Marketing Director": "Your day mixes strategic campaign planning, team meetings, and analyzing performance metrics. You'll balance creativity with data-driven decision making.",
  };
  
  return dayDescriptions[title] || 
    "This role offers a blend of independent work and collaboration, with opportunities to apply your unique strengths daily.";
};

const getInterviewTips = (title: string, archetype: Archetype): string[] => {
  const tips = [
    `Highlight your strength in "${archetype.strengths[0]?.toLowerCase() || 'problem-solving'}"`,
    `Prepare examples that show your ${archetype.tagline.toLowerCase()}`,
    "Address potential concerns about your growth areas proactively",
    `Emphasize how your communication style (${archetype.communicationStyle.split('.')[0].toLowerCase()}) benefits the team`,
  ];
  
  return tips;
};

const getAdditionalJobs = (scoreMap: Record<string, number>, archetype: Archetype): JobMatch[] => {
  const additionalJobs: JobMatch[] = [];
  
  // Add jobs based on high scores
  if (scoreMap.openness > 75 && scoreMap.conscientiousness > 60) {
    additionalJobs.push({
      title: "Innovation Consultant",
      fitScore: 88,
      salaryRange: { min: 90000, max: 180000 },
      industry: "Consulting",
      growthOutlook: "high",
      educationRequired: "Bachelor's + consulting experience",
      whyYouExcel: ["Your combination of creativity and execution is rare and highly valued", "You can translate innovative ideas into actionable plans"],
      watchOutFor: ["Client demands may conflict with your preferred pace", "Heavy travel can be draining"],
      dayInLife: "You'll work with various clients on innovation challenges, facilitating workshops, conducting research, and developing strategic recommendations.",
      interviewTips: ["Share examples of innovations you've implemented", "Show how you balance creativity with practicality"],
    });
  }
  
  if (scoreMap.agreeableness > 75 && scoreMap.emotionalResilience > 60) {
    additionalJobs.push({
      title: "Organizational Development Specialist",
      fitScore: 85,
      salaryRange: { min: 75000, max: 130000 },
      industry: "Human Resources",
      growthOutlook: "moderate",
      educationRequired: "Master's preferred + certifications",
      whyYouExcel: ["Your empathy combined with resilience helps you navigate change management", "People trust and open up to you"],
      watchOutFor: ["Organizational politics can be frustrating", "Change resistance may test your patience"],
      dayInLife: "You'll assess organizational needs, design development programs, facilitate workshops, and coach leaders through change.",
      interviewTips: ["Demonstrate your change management experience", "Show how you handle resistance constructively"],
    });
  }
  
  return additionalJobs;
};

const growthColors = {
  high: "text-green-600 bg-green-500/20 border-green-500/30",
  moderate: "text-blue-600 bg-blue-500/20 border-blue-500/30",
  stable: "text-gray-600 bg-gray-500/20 border-gray-500/30",
};

export function DetailedJobMatches({ archetype, scores }: DetailedJobMatchesProps) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "high" | "moderate" | "stable">("all");
  
  const jobs = getJobMatches(archetype, scores);
  const filteredJobs = filter === "all" 
    ? jobs 
    : jobs.filter(j => j.growthOutlook === filter);

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <FeatureGate feature="detailed_career_matches">
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl">Detailed Career Matches</CardTitle>
                <CardDescription>
                  {jobs.length} roles matched to your personality with salary insights
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {(["all", "high", "moderate", "stable"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : `${f.charAt(0).toUpperCase() + f.slice(1)} Growth`}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={`rounded-xl border transition-colors ${
                  expandedJob === job.title 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border/50 bg-muted/30 hover:bg-muted/50"
                }`}
              >
                {/* Main Row */}
                <button
                  onClick={() => setExpandedJob(expandedJob === job.title ? null : job.title)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="text-2xl font-bold text-primary">{job.fitScore}%</div>
                        <div className="text-xs text-muted-foreground">fit</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold">{job.title}</h4>
                          <Badge variant="outline" className={growthColors[job.growthOutlook]}>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {job.growthOutlook}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {job.industry}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatSalary(job.salaryRange.min)} - {formatSalary(job.salaryRange.max)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {expandedJob === job.title ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedJob === job.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <div className="border-t pt-4 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Why You'd Excel */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                            <Star className="h-4 w-4" />
                            Why You'd Excel
                          </div>
                          <ul className="space-y-1">
                            {job.whyYouExcel.map((reason, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <Target className="h-3 w-3 mt-1 flex-shrink-0 text-green-600" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Watch Out For */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
                            <AlertCircle className="h-4 w-4" />
                            Watch Out For
                          </div>
                          <ul className="space-y-1">
                            {job.watchOutFor.map((warning, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <AlertCircle className="h-3 w-3 mt-1 flex-shrink-0 text-amber-600" />
                                {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Day in the Life */}
                      <div className="rounded-lg bg-muted/50 p-3">
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                          <Users className="h-4 w-4 text-primary" />
                          A Day in This Role
                        </div>
                        <p className="text-sm text-muted-foreground">{job.dayInLife}</p>
                      </div>

                      {/* Requirements & Interview Tips */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium mb-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            Requirements
                          </div>
                          <p className="text-sm text-muted-foreground">{job.educationRequired}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium mb-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            Interview Tips
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {job.interviewTips.slice(0, 2).map((tip, i) => (
                              <li key={i}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </FeatureGate>
  );
}

