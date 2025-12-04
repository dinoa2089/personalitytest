"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobDescriptionAnalyzer, AnalysisResult } from "@/components/business/JobDescriptionAnalyzer";
import { JobProfileDisplay } from "@/components/business/JobProfileDisplay";
import { Loader2, ArrowLeft, Copy, Check, Link2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

export default function NewJobPostingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"analyze" | "review" | "complete">("analyze");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [rawDescription, setRawDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [createdJob, setCreatedJob] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Get business ID on mount
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/business/account?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.business_account) {
            setBusinessId(data.business_account.id);
          }
        });
    }
  }, [user?.id]);

  const handleAnalysisComplete = (result: AnalysisResult, description: string) => {
    setAnalysis(result);
    setRawDescription(description);
    setJobTitle(result.title);
    setStep("review");
    toast.success("Analysis complete! Review the personality profile below.");
  };

  const handleDimensionsUpdate = (dimensions: AnalysisResult["dimensions"]) => {
    if (analysis) {
      setAnalysis({
        ...analysis,
        dimensions,
      });
    }
  };

  const handleSubmit = async () => {
    if (!businessId || !analysis) {
      toast.error("Missing required data");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/business/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: jobTitle || analysis.title,
          description: rawDescription,
          analysis: analysis,
          organizationId: businessId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCreatedJob(data);
        setStep("complete");
        toast.success("Job profile created successfully!");
      } else {
        toast.error(data.error || "Failed to create job profile");
      }
    } catch (error) {
      toast.error("Error creating job profile");
    } finally {
      setLoading(false);
    }
  };

  const assessmentLink = createdJob?.assessmentLink 
    ? `${window.location.origin}${createdJob.assessmentLink}`
    : null;

  const handleCopyLink = () => {
    if (assessmentLink) {
      navigator.clipboard.writeText(assessmentLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <Container className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                {step === "complete" ? "Job Profile Created!" : "Create Job Profile"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {step === "analyze" && "Paste your job description to generate an ideal candidate profile"}
                {step === "review" && "Review and customize the AI-generated personality requirements"}
                {step === "complete" && "Share the assessment link with candidates"}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {["Analyze", "Review", "Complete"].map((label, i) => {
              const stepIndex = ["analyze", "review", "complete"].indexOf(step);
              const isActive = i === stepIndex;
              const isComplete = i < stepIndex;

              return (
                <div key={label} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      isComplete
                        ? "bg-primary text-primary-foreground"
                        : isActive
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isComplete ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm hidden sm:inline ${
                      isActive ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                  {i < 2 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                        isComplete ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          {step === "analyze" && (
            <JobDescriptionAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          )}

          {step === "review" && analysis && (
            <div className="space-y-6">
              {/* Job Title Override */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Title</CardTitle>
                  <CardDescription>
                    Customize the job title if needed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="text-lg"
                  />
                </CardContent>
              </Card>

              {/* Profile Display */}
              <JobProfileDisplay
                analysis={{ ...analysis, title: jobTitle || analysis.title }}
                editable
                onUpdate={handleDimensionsUpdate}
              />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("analyze")}
                  className="sm:flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Re-analyze
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="sm:flex-1 bg-gradient-to-r from-primary to-primary/80"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Job Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "complete" && createdJob && (
            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    Assessment Link Ready
                  </CardTitle>
                  <CardDescription>
                    Share this link with candidates to have them take the personality assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                      {assessmentLink}
                    </div>
                    <Button variant="outline" size="icon" onClick={handleCopyLink}>
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/business/dashboard")}
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={() => {
                        const job = createdJob.job_profile || createdJob.job_posting;
                        if (job?.id) {
                          router.push(`/business/jobs/${job.id}`);
                        }
                      }}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      View Job Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card */}
              {analysis && (
                <JobProfileDisplay
                  analysis={{ ...analysis, title: jobTitle || analysis.title }}
                />
              )}

              {/* Create Another */}
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => {
                    setStep("analyze");
                    setAnalysis(null);
                    setRawDescription("");
                    setJobTitle("");
                    setCreatedJob(null);
                  }}
                >
                  + Create another job profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
