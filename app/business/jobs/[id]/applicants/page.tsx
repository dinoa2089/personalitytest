"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, User, Mail, Calendar } from "lucide-react";
import Link from "next/link";

interface Applicant {
  id: string;
  applicant_email: string | null;
  applicant_name: string | null;
  fit_score: number | null;
  fit_breakdown: any;
  status: string;
  created_at: string;
  assessment_session_id: string;
}

export default function ApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job posting for title
        const jobResponse = await fetch(`/api/business/jobs/${jobId}`);
        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          setJobTitle(jobData.job_posting?.title || "");
        }

        // Fetch applicants
        const applicantsResponse = await fetch(`/api/business/applicants?job_posting_id=${jobId}`);
        if (applicantsResponse.ok) {
          const applicantsData = await applicantsResponse.json();
          setApplicants(applicantsData.applicants || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const getFitScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-500";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getFitScoreLabel = (score: number | null) => {
    if (score === null) return "Not Calculated";
    if (score >= 80) return "Excellent Fit";
    if (score >= 60) return "Good Fit";
    if (score >= 40) return "Moderate Fit";
    return "Limited Fit";
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-4xl font-bold mb-2">Applicants</h1>
              <p className="text-muted-foreground">{jobTitle}</p>
            </div>
          </div>

          {applicants.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No applicants yet</p>
                <p className="text-sm text-muted-foreground">
                  Share the assessment link from the job posting to start receiving applicants.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applicants.map((applicant) => (
                <Card key={applicant.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">
                                {applicant.applicant_name || "Anonymous Applicant"}
                              </h3>
                              <Badge variant="outline">{applicant.status}</Badge>
                            </div>
                            {applicant.applicant_email && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Mail className="h-4 w-4" />
                                {applicant.applicant_email}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Applied: {new Date(applicant.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {applicant.fit_score !== null && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Fit Score</div>
                                <div className="flex items-center gap-2">
                                  <div className={`h-3 w-3 rounded-full ${getFitScoreColor(applicant.fit_score)}`} />
                                  <span className="text-2xl font-bold">{applicant.fit_score.toFixed(1)}</span>
                                  <span className="text-sm text-muted-foreground">
                                    / 100 - {getFitScoreLabel(applicant.fit_score)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {applicant.fit_breakdown && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t">
                                {applicant.fit_breakdown.slice(0, 4).map((breakdown: any, idx: number) => (
                                  <div key={idx} className="text-sm">
                                    <div className="font-medium capitalize mb-1">
                                      {breakdown.dimension.replace(/([A-Z])/g, " $1").trim()}
                                    </div>
                                    <div className="text-muted-foreground">
                                      {breakdown.fit_score.toFixed(0)}% fit
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Applicant: {breakdown.applicant_percentile.toFixed(0)}%
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/results/${applicant.assessment_session_id}`}>
                            View Full Profile
                          </Link>
                        </Button>
                        {applicant.fit_score === null && (
                          <Badge variant="secondary" className="text-xs">
                            Score Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {applicants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Summary Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Applicants</div>
                    <div className="text-2xl font-bold">{applicants.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Average Fit Score</div>
                    <div className="text-2xl font-bold">
                      {applicants.filter(a => a.fit_score !== null).length > 0
                        ? (
                            applicants
                              .filter(a => a.fit_score !== null)
                              .reduce((sum, a) => sum + (a.fit_score || 0), 0) /
                            applicants.filter(a => a.fit_score !== null).length
                          ).toFixed(1)
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Excellent Fits (80+)</div>
                    <div className="text-2xl font-bold">
                      {applicants.filter(a => a.fit_score !== null && a.fit_score >= 80).length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}

