"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Edit, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface JobPosting {
  id: string;
  title: string;
  description: string;
  ideal_profile: any;
  status: string;
  assessment_link_token: string;
  created_at: string;
  updated_at: string;
}

export default function JobPostingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const jobId = params.id as string;
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobPosting = async () => {
      try {
        // In a real implementation, you'd fetch by ID
        // For now, we'll need to add this endpoint
        const response = await fetch(`/api/business/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJobPosting(data.job_posting);
        }
      } catch (error) {
        console.error("Error fetching job posting:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobPosting();
    }
  }, [jobId]);

  const assessmentLink = jobPosting
    ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/assessment/intro?job=${jobPosting.assessment_link_token}`
    : "";

  const copyAssessmentLink = () => {
    if (assessmentLink) {
      navigator.clipboard.writeText(assessmentLink);
      toast.success("Assessment link copied!");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </Container>
      </div>
    );
  }

  if (!jobPosting) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Job Posting Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/business/dashboard">Back to Dashboard</Link>
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
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{jobPosting.title}</h1>
                <Badge variant={jobPosting.status === "active" ? "default" : "secondary"}>
                  {jobPosting.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Created: {new Date(jobPosting.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/business/jobs/${jobId}/edit`}>
                  Edit
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/business/jobs/${jobId}/applicants`}>
                  <Users className="mr-2 h-4 w-4" />
                  View Applicants
                </Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{jobPosting.description}</p>
              </div>
            </CardContent>
          </Card>

          {jobPosting.ideal_profile && (
            <Card>
              <CardHeader>
                <CardTitle>Ideal Candidate Profile</CardTitle>
                <CardDescription>
                  Personality requirements extracted from job description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobPosting.ideal_profile.requirements?.map((req: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold capitalize">{req.dimension}</span>
                        <span className="text-sm text-muted-foreground">
                          Weight: {req.importance_weight}x
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ideal range: {req.min_percentile}% - {req.max_percentile}%
                      </div>
                    </div>
                  ))}
                  {jobPosting.ideal_profile.red_flags?.length > 0 && (
                    <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">Red Flags</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        {jobPosting.ideal_profile.red_flags.map((flag: any, idx: number) => (
                          <li key={idx}>
                            {flag.dimension}: {flag.condition} {flag.threshold}%
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Applicant Assessment Link</CardTitle>
              <CardDescription>
                Share this link with applicants to take the assessment for this position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                  <span className="flex-1 truncate">{assessmentLink}</span>
                </div>
                <Button variant="outline" size="icon" onClick={copyAssessmentLink}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={assessmentLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                When applicants complete the assessment using this link, their results will be automatically matched against this job posting's ideal profile.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

