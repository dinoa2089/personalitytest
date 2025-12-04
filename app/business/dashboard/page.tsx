"use client";

// Prevent static generation - this page requires authentication
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, Users, TrendingUp, FileText, Settings } from "lucide-react";
import Link from "next/link";

interface JobPosting {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  assessment_link_token: string;
}

export default function BusinessDashboardPage() {
  const { user, isLoaded } = useUser();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchBusinessData = async () => {
      try {
        // Get business account for user
        const businessResponse = await fetch(`/api/business/account?user_id=${user.id}`);
        if (businessResponse.ok) {
          const businessData = await businessResponse.json();
          if (businessData.business_account) {
            setBusinessId(businessData.business_account.id);
            
            // Fetch job postings
            const jobsResponse = await fetch(`/api/business/jobs?business_id=${businessData.business_account.id}`);
            if (jobsResponse.ok) {
              const jobsData = await jobsResponse.json();
              setJobPostings(jobsData.job_postings || []);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching business data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [user?.id, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
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
              <CardTitle>Business Account Required</CardTitle>
              <CardDescription>
                Please sign in to access the business dashboard
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

  if (!businessId) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Create Business Account</CardTitle>
              <CardDescription>
                Set up your business account to start using applicant assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/business/setup">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Business Dashboard</h1>
              <p className="text-muted-foreground">
                Manage job postings and review applicant assessments
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/business/teams">
                  <Users className="mr-2 h-4 w-4" />
                  Teams
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/business/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button asChild>
                <Link href="/business/jobs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Job Posting
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobPostings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobPostings.filter(j => j.status === "active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Fit Score</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </div>

          {/* Job Postings */}
          <Card>
            <CardHeader>
              <CardTitle>Job Postings</CardTitle>
              <CardDescription>Manage your job postings and view applicants</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : jobPostings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No job postings yet</p>
                  <Button asChild>
                    <Link href="/business/jobs/new">Create Your First Job Posting</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobPostings.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{job.title}</h3>
                          <Badge variant={job.status === "active" ? "default" : "secondary"}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {job.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/business/jobs/${job.id}`}>View</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/business/jobs/${job.id}/applicants`}>
                            Applicants
                          </Link>
                        </Button>
                      </div>
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

