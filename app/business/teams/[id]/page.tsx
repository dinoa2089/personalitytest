"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  MoreVertical,
  Settings,
  Trash2,
  Loader2,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import { TeamComposition } from "@/components/business/TeamComposition";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TeamMember, TeamRole, TeamAnalysis, CompatibilityPair } from "@/lib/team-analysis";

interface Team {
  id: string;
  name: string;
  description: string | null;
  organization_id: string;
}

interface TeamAnalysisData {
  members: TeamMember[];
  analysis: TeamAnalysis;
  compatibility: CompatibilityPair[];
  synergy: number;
  recommendedArchetypes: { archetype: string; reason: string }[];
}

export default function TeamDetailPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [analysisData, setAnalysisData] = useState<TeamAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    job_title: "",
    team_role: "member" as TeamRole,
    assessment_session_id: "",
  });
  const [isAddingMember, setIsAddingMember] = useState(false);

  const fetchTeamData = useCallback(async () => {
    if (!teamId) return;

    try {
      // Fetch team details
      const teamResponse = await fetch(`/api/business/teams/${teamId}`);
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeam(teamData.team);
      }

      // Fetch team analysis
      const analysisResponse = await fetch(
        `/api/business/teams/${teamId}/analysis`
      );
      if (analysisResponse.ok) {
        const data = await analysisResponse.json();
        setAnalysisData(data);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  }, [teamId]);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const loadData = async () => {
      setLoading(true);
      await fetchTeamData();
      setLoading(false);
    };

    loadData();
  }, [user?.id, isLoaded, fetchTeamData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTeamData();
    setRefreshing(false);
  };

  const handleAddMember = async () => {
    if (!newMember.name) return;

    setIsAddingMember(true);
    try {
      const response = await fetch(`/api/business/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMember.name,
          email: newMember.email || null,
          job_title: newMember.job_title || null,
          team_role: newMember.team_role,
          assessment_session_id: newMember.assessment_session_id || null,
        }),
      });

      if (response.ok) {
        setNewMember({ name: "", email: "", job_title: "", team_role: "member", assessment_session_id: "" });
        setAddMemberOpen(false);
        await fetchTeamData();
      }
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: TeamRole) => {
    try {
      const response = await fetch(`/api/business/teams/${teamId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: memberId,
          team_role: newRole,
        }),
      });

      if (response.ok) {
        await fetchTeamData();
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(
        `/api/business/teams/${teamId}/members?member_id=${memberId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        await fetchTeamData();
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      const response = await fetch(`/api/business/teams/${teamId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/business/teams");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Container>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to view team details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Team Not Found</CardTitle>
              <CardDescription>
                This team doesn&apos;t exist or you don&apos;t have access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/business/teams">Back to Teams</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <Container className="flex-1 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/business/teams">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{team.name}</h1>
                {team.description && (
                  <p className="text-muted-foreground">{team.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>
                      Add a new member to this team. You can optionally link
                      their assessment results.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-name">Name *</Label>
                      <Input
                        id="member-name"
                        placeholder="John Doe"
                        value={newMember.name}
                        onChange={(e) =>
                          setNewMember({ ...newMember, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-email">Email</Label>
                      <Input
                        id="member-email"
                        type="email"
                        placeholder="john@company.com"
                        value={newMember.email}
                        onChange={(e) =>
                          setNewMember({ ...newMember, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-job-title">Job Title</Label>
                      <Input
                        id="member-job-title"
                        placeholder="Software Engineer"
                        value={newMember.job_title}
                        onChange={(e) =>
                          setNewMember({ ...newMember, job_title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-team-role">Team Role</Label>
                      <Select
                        value={newMember.team_role}
                        onValueChange={(value: TeamRole) =>
                          setNewMember({ ...newMember, team_role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Admins can manage team members and settings
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-session">
                        Assessment Session ID (optional)
                      </Label>
                      <Input
                        id="member-session"
                        placeholder="UUID of their assessment"
                        value={newMember.assessment_session_id}
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            assessment_session_id: e.target.value,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Link to existing assessment results for personality
                        analysis
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setAddMemberOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddMember}
                        disabled={!newMember.name || isAddingMember}
                      >
                        {isAddingMember ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Member"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Team Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDeleteTeam}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Team Composition */}
          {analysisData ? (
            <TeamComposition
              teamId={teamId}
              teamName={team.name}
              members={analysisData.members}
              onAddMember={() => setAddMemberOpen(true)}
              onRemoveMember={handleRemoveMember}
              onUpdateRole={handleUpdateRole}
              currentUserIsAdmin={true} // TODO: Check actual user role
            />
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Loading team analysis...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}

