"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, CreditCard, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface BusinessAccount {
  id: string;
  company_name: string;
  subscription_tier: string;
  created_at: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string | null;
}

export default function BusinessSettingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessAccount, setBusinessAccount] = useState<BusinessAccount | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [formData, setFormData] = useState({
    company_name: "",
  });

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchData = async () => {
      try {
        const accountResponse = await fetch(`/api/business/account?user_id=${user.id}`);
        if (accountResponse.ok) {
          const accountData = await accountResponse.json();
          if (accountData.business_account) {
            const account = accountData.business_account;
            setBusinessAccount(account);
            setFormData({ company_name: account.company_name });

            // Fetch team members
            const teamResponse = await fetch(`/api/business/team?business_id=${account.id}`);
            if (teamResponse.ok) {
              const teamData = await teamResponse.json();
              setTeamMembers(teamData.team_members || []);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching business data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessAccount) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/business/account/${businessAccount.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: formData.company_name,
        }),
      });

      if (response.ok) {
        toast.success("Settings updated!");
        setBusinessAccount({ ...businessAccount, company_name: formData.company_name });
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("Error updating settings");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </Container>
      </div>
    );
  }

  if (!businessAccount) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Business Account Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/business/setup">Create Business Account</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  const tierLabels: Record<string, string> = {
    starter: "Starter",
    professional: "Professional",
    enterprise: "Enterprise",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Business Settings</h1>
            <p className="text-muted-foreground">
              Manage your business account and team
            </p>
          </div>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Company Information</CardTitle>
              </div>
              <CardDescription>
                Update your company details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Subscription</CardTitle>
              </div>
              <CardDescription>
                Your current subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold mb-1">
                    {tierLabels[businessAccount.subscription_tier] || businessAccount.subscription_tier}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(businessAccount.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Badge variant="outline">{businessAccount.subscription_tier}</Badge>
              </div>
              <Button variant="outline" asChild>
                <Link href="/pricing">Upgrade Plan</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Team Members</CardTitle>
                </div>
                <Button variant="outline" size="sm">
                  Invite Member
                </Button>
              </div>
              <CardDescription>
                Manage team members who can access this business account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teamMembers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No team members yet</p>
                  <Button variant="outline" size="sm">
                    Invite Your First Team Member
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">Team Member</div>
                        <div className="text-sm text-muted-foreground">
                          Role: {member.role}
                          {member.joined_at && (
                            <> • Joined: {new Date(member.joined_at).toLocaleDateString()}</>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}


