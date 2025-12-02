"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Briefcase,
  TrendingUp,
  Search,
  Download,
  UserPlus,
  PieChart,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Eye,
  Copy,
  Check
} from "lucide-react";
import { FeatureGate } from "@/components/premium/FeatureGate";
import { archetypes, type Archetype } from "@/lib/archetypes";
import type { DimensionScore } from "@/types";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  archetype: Archetype;
  scores: DimensionScore[];
  completedAt: Date;
  jobTitle?: string;
}

interface JobProfile {
  id: string;
  title: string;
  idealDimensions: Record<string, { min: number; max: number; weight: number }>;
  idealArchetypes: string[];
}

interface TeamDashboardProps {
  organizationId: string;
  organizationName: string;
  members: TeamMember[];
  jobProfiles: JobProfile[];
  availableCodes: number;
  usedCodes: number;
}

// Calculate team composition
function calculateTeamComposition(members: TeamMember[]) {
  const composition: Record<string, number> = {};
  members.forEach(member => {
    const type = member.archetype.id;
    composition[type] = (composition[type] || 0) + 1;
  });
  return composition;
}

// Find team gaps
function findTeamGaps(members: TeamMember[]) {
  const composition = calculateTeamComposition(members);
  const gaps: string[] = [];
  const recommendations: string[] = [];

  // Check for missing archetypes
  archetypes.forEach(archetype => {
    if (!composition[archetype.id]) {
      gaps.push(`No ${archetype.name}s on the team`);
    }
  });

  // Check for over-concentration
  const total = members.length;
  Object.entries(composition).forEach(([type, count]) => {
    const percentage = (count / total) * 100;
    if (percentage > 40) {
      const archetype = archetypes.find(a => a.id === type);
      recommendations.push(`Team is heavily weighted toward ${archetype?.name}s (${percentage.toFixed(0)}%). Consider diversifying.`);
    }
  });

  return { gaps: gaps.slice(0, 3), recommendations };
}

// Calculate fit score for a member against a job profile
function calculateJobFit(member: TeamMember, profile: JobProfile): number {
  let totalWeight = 0;
  let weightedScore = 0;

  Object.entries(profile.idealDimensions).forEach(([dimension, ideal]) => {
    const score = member.scores.find(s => s.dimension === dimension)?.percentile || 50;
    const fit = score >= ideal.min && score <= ideal.max ? 100 : 
      Math.max(0, 100 - Math.abs(score - (ideal.min + ideal.max) / 2));
    weightedScore += fit * ideal.weight;
    totalWeight += ideal.weight;
  });

  // Bonus for matching archetypes
  if (profile.idealArchetypes.includes(member.archetype.id)) {
    weightedScore += 10 * totalWeight;
    totalWeight += 10;
  }

  return Math.round(weightedScore / totalWeight);
}

export function TeamDashboard({
  organizationId,
  organizationName,
  members,
  jobProfiles,
  availableCodes,
  usedCodes,
}: TeamDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobProfile | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;
    const term = searchTerm.toLowerCase();
    return members.filter(m => 
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.archetype.name.toLowerCase().includes(term)
    );
  }, [members, searchTerm]);

  const teamComposition = useMemo(() => calculateTeamComposition(members), [members]);
  const { gaps, recommendations } = useMemo(() => findTeamGaps(members), [members]);

  const rankedCandidates = useMemo(() => {
    if (!selectedJob) return [];
    return filteredMembers
      .map(member => ({
        ...member,
        fitScore: calculateJobFit(member, selectedJob),
      }))
      .sort((a, b) => b.fitScore - a.fitScore);
  }, [filteredMembers, selectedJob]);

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/assessment/intro?org=${organizationId}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Get archetype colors for pie chart
  const compositionData = Object.entries(teamComposition).map(([type, count]) => {
    const archetype = archetypes.find(a => a.id === type);
    return {
      name: archetype?.name || type,
      count,
      color: archetype?.color || "from-gray-500 to-gray-600",
      icon: archetype?.icon || "👤",
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <FeatureGate feature="team_dashboard">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{members.length}</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{jobProfiles.length}</div>
                  <div className="text-sm text-muted-foreground">Job Profiles</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{usedCodes}</div>
                  <div className="text-sm text-muted-foreground">Codes Used</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <UserPlus className="h-8 w-8 text-amber-500" />
                <div>
                  <div className="text-2xl font-bold">{availableCodes}</div>
                  <div className="text-sm text-muted-foreground">Codes Available</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Team Composition */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Team Composition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Simple Bar Chart */}
              <div className="space-y-3">
                {compositionData.slice(0, 6).map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <span>{item.icon}</span>
                        {item.name}
                      </span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                        style={{ width: `${(item.count / members.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Recommendations
                  </div>
                  <ul className="space-y-2">
                    {recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Members List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-48"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopyInviteLink}>
                    {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedCode ? "Copied!" : "Invite Link"}
                  </Button>
                </div>
              </div>
              {selectedJob && (
                <Badge variant="outline" className="w-fit">
                  Filtering by: {selectedJob.title}
                  <button 
                    className="ml-2 hover:text-primary"
                    onClick={() => setSelectedJob(null)}
                  >
                    ×
                  </button>
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {(selectedJob ? rankedCandidates : filteredMembers).map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{member.archetype.icon}</div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {member.archetype.name}
                          {member.jobTitle && ` • ${member.jobTitle}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {'fitScore' in member && (
                        <Badge 
                          variant="outline"
                          className={
                            (member as any).fitScore >= 80 ? "text-green-600 border-green-600/30" :
                            (member as any).fitScore >= 60 ? "text-blue-600 border-blue-600/30" :
                            "text-amber-600 border-amber-600/30"
                          }
                        >
                          {(member as any).fitScore}% fit
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
                {filteredMembers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No team members found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Profiles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Job Profiles</CardTitle>
                <CardDescription>
                  Select a profile to rank team members by fit
                </CardDescription>
              </div>
              <Button>
                <Briefcase className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {jobProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedJob(selectedJob?.id === profile.id ? null : profile)}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    selectedJob?.id === profile.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border/50 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{profile.title}</h4>
                    <ChevronRight className={`h-4 w-4 transition-transform ${
                      selectedJob?.id === profile.id ? "rotate-90" : ""
                    }`} />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {profile.idealArchetypes.slice(0, 3).map((id) => {
                      const arch = archetypes.find(a => a.id === id);
                      return (
                        <Badge key={id} variant="outline" className="text-xs">
                          {arch?.icon} {arch?.name.replace("The ", "")}
                        </Badge>
                      );
                    })}
                  </div>
                </button>
              ))}
              {jobProfiles.length === 0 && (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                  No job profiles created yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Communication Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Team Communication Matrix
            </CardTitle>
            <CardDescription>
              How different types on your team prefer to communicate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compositionData.slice(0, 6).map((item) => {
                const archetype = archetypes.find(a => a.name === item.name);
                return (
                  <div key={item.name} className="rounded-lg border border-border/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-semibold">{item.name}</span>
                      <Badge variant="outline" className="text-xs">{item.count}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {archetype?.communicationStyle.split('.')[0]}.
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureGate>
  );
}

