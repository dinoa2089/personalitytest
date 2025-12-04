"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Plus,
  ChevronRight,
  Calendar,
  Loader2,
  Building2,
} from "lucide-react";

interface Team {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  team_members: { count: number }[];
}

export default function TeamsPage() {
  const { user, isLoaded } = useUser();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchTeams = async () => {
      try {
        // First get the organization ID
        const businessResponse = await fetch(
          `/api/business/account?user_id=${user.id}`
        );
        if (businessResponse.ok) {
          const businessData = await businessResponse.json();
          if (businessData.business_account?.organization_id) {
            setOrganizationId(businessData.business_account.organization_id);

            // Fetch teams
            const teamsResponse = await fetch(
              `/api/business/teams?organization_id=${businessData.business_account.organization_id}`
            );
            if (teamsResponse.ok) {
              const teamsData = await teamsResponse.json();
              setTeams(teamsData.teams || []);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user?.id, isLoaded]);

  const handleCreateTeam = async () => {
    if (!organizationId || !newTeam.name) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/business/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id: organizationId,
          name: newTeam.name,
          description: newTeam.description || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTeams([{ ...data.team, team_members: [{ count: 0 }] }, ...teams]);
        setNewTeam({ name: "", description: "" });
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating team:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isLoaded) {
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
                Please sign in to access team management
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

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Teams</h1>
              <p className="text-muted-foreground">
                Manage your teams and view team composition analytics
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>
                    Create a team to group employees and analyze their
                    personality composition
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input
                      id="team-name"
                      placeholder="e.g., Engineering Team"
                      value={newTeam.name}
                      onChange={(e) =>
                        setNewTeam({ ...newTeam, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team-description">
                      Description (optional)
                    </Label>
                    <Textarea
                      id="team-description"
                      placeholder="Brief description of the team"
                      value={newTeam.description}
                      onChange={(e) =>
                        setNewTeam({ ...newTeam, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTeam}
                      disabled={!newTeam.name || isCreating}
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Team"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Teams Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : teams.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first team to start analyzing team composition
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/business/teams/${team.id}`}>
                    <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="truncate">{team.name}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardTitle>
                        {team.description && (
                          <CardDescription className="line-clamp-2">
                            {team.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {team.team_members?.[0]?.count || 0} members
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(team.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}


