"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  UserPlus,
  Search,
  Target,
  Sparkles,
  ChevronRight,
  BarChart3,
  Shuffle,
} from "lucide-react";
import { TeamRadarChart, TeamAverageRadarChart } from "./TeamRadarChart";
import { CompatibilityMatrix } from "./CompatibilityMatrix";
import {
  analyzeTeam,
  calculateCompatibilityMatrix,
  calculateTeamSynergy,
  getDimensionName,
  getRecommendedArchetypes,
  type TeamMember,
  type TeamAnalysis,
  type CompatibilityPair,
} from "@/lib/team-analysis";
import type { DimensionScore } from "@/types";

interface TeamCompositionProps {
  teamId: string;
  teamName: string;
  members: TeamMember[];
  onAddMember?: () => void;
  onRemoveMember?: (memberId: string) => void;
}

export function TeamComposition({
  teamId,
  teamName,
  members,
  onAddMember,
  onRemoveMember,
}: TeamCompositionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showAllMembers, setShowAllMembers] = useState(false);

  // Calculate team analysis
  const analysis = useMemo(() => analyzeTeam(members), [members]);
  const compatibility = useMemo(() => calculateCompatibilityMatrix(members), [members]);
  const synergy = useMemo(() => calculateTeamSynergy(members), [members]);
  const recommendedArchetypes = useMemo(
    () => getRecommendedArchetypes(analysis),
    [analysis]
  );

  // Filter members by search
  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;
    const term = searchTerm.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.role?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term)
    );
  }, [members, searchTerm]);

  const displayMembers = showAllMembers ? filteredMembers : filteredMembers.slice(0, 6);

  const getSynergyLabel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-green-600" };
    if (score >= 65) return { label: "Good", color: "text-blue-600" };
    if (score >= 50) return { label: "Moderate", color: "text-amber-600" };
    return { label: "Developing", color: "text-red-600" };
  };

  const synergyInfo = getSynergyLabel(synergy);

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-xs text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 rounded-lg">
                <Target className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${synergyInfo.color}`}>
                  {synergy}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Team Synergy • {synergyInfo.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Shuffle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analysis.diversity}%</p>
                <p className="text-xs text-muted-foreground">
                  Diversity Score
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Lightbulb className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analysis.strengths.length}</p>
                <p className="text-xs text-muted-foreground">Key Strengths</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Team Radar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Team Profile Overlay
            </CardTitle>
            <CardDescription>
              Individual member profiles compared to team average
            </CardDescription>
          </CardHeader>
          <CardContent>
            {members.length > 0 ? (
              <TeamRadarChart
                members={members}
                showAverage={true}
                averageProfile={analysis.averageProfile}
                height={400}
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Add team members to view the profile overlay
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Strengths & Gaps */}
        <div className="space-y-6">
          {/* Strengths */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Team Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <motion.div
                  key={strength.dimension}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {getDimensionName(strength.dimension)}
                    </span>
                    <span className="text-green-600">{strength.score}%</span>
                  </div>
                  <Progress value={strength.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {strength.description}
                  </p>
                </motion.div>
              ))}
              {analysis.strengths.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Add team members to identify strengths
                </p>
              )}
            </CardContent>
          </Card>

          {/* Gaps */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-amber-500" />
                Growth Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.gaps.map((gap, index) => (
                <motion.div
                  key={gap.dimension}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {getDimensionName(gap.dimension)}
                    </span>
                    <span className="text-amber-600">{gap.score}%</span>
                  </div>
                  <Progress value={gap.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {gap.description}
                  </p>
                </motion.div>
              ))}
              {analysis.gaps.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {members.length === 0
                    ? "Add team members to identify gaps"
                    : "No significant gaps identified"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compatibility Matrix */}
      <CompatibilityMatrix members={members} compatibility={compatibility} />

      {/* Team Members List */}
      <Card>
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
              {onAddMember && (
                <Button size="sm" onClick={onAddMember}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                index={index}
                isSelected={selectedMemberId === member.id}
                onSelect={() =>
                  setSelectedMemberId(
                    selectedMemberId === member.id ? null : member.id
                  )
                }
                onRemove={onRemoveMember}
              />
            ))}
          </div>
          {filteredMembers.length > 6 && !showAllMembers && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllMembers(true)}
              >
                Show All {filteredMembers.length} Members
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No members match your search"
                : "No team members yet"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {(analysis.recommendations.length > 0 || recommendedArchetypes.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Recommendations
            </CardTitle>
            <CardDescription>
              Suggestions to optimize your team composition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{rec}</p>
              </motion.div>
            ))}
            {recommendedArchetypes.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">
                  Consider Adding These Archetypes:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recommendedArchetypes.map((arch, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="py-2 px-3"
                    >
                      <span className="font-medium">{arch.archetype}</span>
                      <span className="text-muted-foreground ml-2">
                        — {arch.reason}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Member Card Component
interface MemberCardProps {
  member: TeamMember;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove?: (memberId: string) => void;
}

function MemberCard({
  member,
  index,
  isSelected,
  onSelect,
  onRemove,
}: MemberCardProps) {
  // Find top 3 dimensions
  const topDimensions = [...member.scores]
    .sort((a, b) => b.percentile - a.percentile)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        p-4 rounded-xl border transition-all cursor-pointer
        ${isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"}
      `}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold">{member.name}</h4>
          {member.role && (
            <p className="text-xs text-muted-foreground">{member.role}</p>
          )}
        </div>
        {onRemove && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => e.stopPropagation()}
              >
                ×
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Team Member</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove {member.name} from this team?
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={() => onRemove(member.id)}
                >
                  Remove
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-2">
        {topDimensions.map((dim) => (
          <div key={dim.dimension} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {getDimensionName(dim.dimension)}
              </span>
              <span className="font-medium">{dim.percentile}%</span>
            </div>
            <Progress value={dim.percentile} className="h-1.5" />
          </div>
        ))}
      </div>

      {isSelected && member.email && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t text-xs text-muted-foreground"
        >
          {member.email}
        </motion.div>
      )}
    </motion.div>
  );
}

