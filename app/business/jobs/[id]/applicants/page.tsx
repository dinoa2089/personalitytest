"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { CandidateList } from "@/components/business/CandidateList";
import { toast } from "react-hot-toast";

export default function ApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [jobTitle, setJobTitle] = useState("");
  const [assessmentLink, setAssessmentLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/business/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJobTitle(data.job_posting?.title || "Job Position");
          
          // Build assessment link
          if (data.job_posting?.assessment_link_token) {
            const baseUrl = typeof window !== "undefined" 
              ? window.location.origin 
              : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            setAssessmentLink(`${baseUrl}/assessment/intro?job=${data.job_posting.assessment_link_token}`);
          }
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

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
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <Container className="flex-1 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mb-2 -ml-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
              <p className="text-muted-foreground mt-1">{jobTitle}</p>
            </div>
            
            {/* Assessment Link Quick Actions */}
            {assessmentLink && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyAssessmentLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={assessmentLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* Candidate List */}
          <CandidateList jobId={jobId} />
        </div>
      </Container>
    </div>
  );
}
