"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAssessmentStore } from "@/store/assessment-store";
import { ProcessFlow, DimensionsWheel } from "@/components/visualizations";

type AssessmentType = "quick" | "full";

interface JobPostingInfo {
  id: string;
  title: string;
  company_name?: string;
}

function AssessmentIntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initializeSession } = useAssessmentStore();
  const [isStarting, setIsStarting] = useState(false);
  const [selectedType, setSelectedType] = useState<AssessmentType | null>(null);
  const [jobToken, setJobToken] = useState<string | null>(null);
  const [jobInfo, setJobInfo] = useState<JobPostingInfo | null>(null);
  const [loadingJobInfo, setLoadingJobInfo] = useState(false);
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [showApplicantForm, setShowApplicantForm] = useState(false);
  
  // Check for referral code or job token in URL
  useEffect(() => {
    const refCode = searchParams.get("ref");
    const token = searchParams.get("job");
    
    if (refCode) {
      // Store referral code for later tracking
      localStorage.setItem("referral-code", refCode);
    }
    
    if (token) {
      setJobToken(token);
      // Store job token for applicant assessment tracking
      localStorage.setItem("job-token", token);
      // Fetch job posting info
      fetchJobInfo(token);
    }
  }, [searchParams]);

  const fetchJobInfo = async (token: string) => {
    setLoadingJobInfo(true);
    try {
      const response = await fetch(`/api/business/jobs/by-token?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        const jobPosting = data.job_posting;
        setJobInfo({
          id: jobPosting.id,
          title: jobPosting.title,
          company_name: jobPosting.business_accounts?.company_name,
        });
        setShowApplicantForm(true);
      }
    } catch (error) {
      console.error("Error fetching job info:", error);
    } finally {
      setLoadingJobInfo(false);
    }
  };

  const handleStart = async (type: AssessmentType = "full") => {
    setIsStarting(true);
    const sessionId = crypto.randomUUID();
    
    // Initialize session in store with assessment type
    initializeSession(sessionId);
    
    // Store assessment type in session metadata
    localStorage.setItem(`assessment-type-${sessionId}`, type);

    // Store guest session ID in localStorage for dashboard lookup
    localStorage.setItem("current-guest-session-id", sessionId);

    // Store applicant info if provided
    if (applicantEmail) {
      localStorage.setItem(`applicant-email-${sessionId}`, applicantEmail);
    }
    if (applicantName) {
      localStorage.setItem(`applicant-name-${sessionId}`, applicantName);
    }

    // Try to create session in database (will fail gracefully if Supabase not configured)
    try {
      const referralCode = localStorage.getItem("referral-code");
      const response = await fetch("/api/assessment/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestSessionId: sessionId,
          assessmentType: type, // Pass assessment type to API
          referralCode: referralCode || null,
        }),
      });
      
      // If session was created successfully, update localStorage with actual session ID from DB
      if (response.ok) {
        const data = await response.json();
        if (data.session?.id) {
          localStorage.setItem("current-guest-session-id", data.session.id);
        }
      }
    } catch (error) {
      // Continue even if API call fails - we have in-memory session
      console.warn("Could not create session in database:", error);
    }

    router.push(`/assessment/questions/${sessionId}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-12">
          {jobInfo ? (
            <div className="text-center space-y-6">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
                Job Application Assessment
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Personality Assessment for{" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  {jobInfo.title}
                </span>
              </h1>
              {jobInfo.company_name && (
                <p className="text-2xl font-semibold text-muted-foreground">
                  {jobInfo.company_name}
                </p>
              )}
              <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
                Complete this assessment to help {jobInfo.company_name || "the employer"} understand your personality fit for this role.
                <br className="hidden sm:block" />
                <span className="text-foreground font-medium">Your results will be shared with the employer.</span>
              </p>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Discover Your{" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  True Personality Type
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
                Get scientifically validated insights into your personality across 7 core dimensions.
                <br className="hidden sm:block" />
                <span className="text-foreground font-medium">Quick: 7 minutes • Full: 15 minutes</span>
              </p>
            </div>
          )}

          <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">What to Expect</CardTitle>
              <CardDescription className="text-base">What you'll learn about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 rounded-xl border border-border/50 bg-muted/30 p-5 hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg">Your Dimensional Profile</h3>
                <p className="text-muted-foreground leading-relaxed">
                  See how you score across 7 core personality dimensions with percentile rankings and
                  confidence intervals.
                </p>
              </div>
              <div className="space-y-3 rounded-xl border border-border/50 bg-muted/30 p-5 hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg">Framework Mappings</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Understand how your results relate to familiar frameworks like Myers-Briggs, CliftonStrengths,
                  and Enneagram.
                </p>
              </div>
              <div className="space-y-3 rounded-xl border border-border/50 bg-muted/30 p-5 hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg">Personalized Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive actionable insights for your career, relationships, and personal growth.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How It Works - Process Flow */}
          <ProcessFlow showTitle={true} variant="horizontal" className="mt-8" />

          {/* Dimensions Preview */}
          <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">The 7 Dimensions You'll Discover</CardTitle>
              <CardDescription className="text-base">
                Click any dimension to learn more about what it measures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DimensionsWheel showTitle={false} />
            </CardContent>
          </Card>

          {showApplicantForm && (
            <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl">Applicant Information</CardTitle>
                <CardDescription className="text-base">
                  Optional: Provide your contact information to help the employer identify your assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="applicant-name">Full Name (Optional)</Label>
                  <Input
                    id="applicant-name"
                    type="text"
                    placeholder="John Doe"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicant-email">Email Address (Optional)</Label>
                  <Input
                    id="applicant-email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  You can skip this step and proceed directly to the assessment if you prefer.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Choose Your Assessment</CardTitle>
              <CardDescription className="text-base">
                {jobInfo ? "Select the assessment version" : "Select the version that works best for you"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className={`group relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                  selectedType === "quick" 
                    ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md" 
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/30 hover:shadow-md"
                }`}
                onClick={() => setSelectedType("quick")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full transition-all ${
                        selectedType === "quick" ? "bg-primary ring-4 ring-primary/20" : "bg-border group-hover:bg-primary/50"
                      }`} />
                      <h3 className="font-bold text-lg">Quick Assessment</h3>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      35 core questions • ~7 minutes
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Get your basic personality profile quickly. Unlock additional modules for deeper insights.
                    </p>
                  </div>
                  {selectedType === "quick" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div 
                className={`group relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                  selectedType === "full" 
                    ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md" 
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/30 hover:shadow-md"
                }`}
                onClick={() => setSelectedType("full")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full transition-all ${
                        selectedType === "full" ? "bg-primary ring-4 ring-primary/20" : "bg-border group-hover:bg-primary/50"
                      }`} />
                      <h3 className="font-bold text-lg">Full Assessment</h3>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      125 comprehensive questions • ~15 minutes
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Complete assessment with all modules including work context, relationships, and deep dive insights.
                    </p>
                  </div>
                  {selectedType === "full" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => handleStart(selectedType || "full")} 
              disabled={isStarting || !selectedType} 
              className="text-lg px-10 py-6 h-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isStarting ? "Starting..." : `Start ${selectedType === "quick" ? "Quick" : "Full"} Assessment`}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => router.push("/science")} 
              className="text-lg px-10 py-6 h-auto border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              Learn About the Science
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>No signup required</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span>Auto-saved responses</span>
            <div className="h-4 w-px bg-border" />
            <span>Free results</span>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function AssessmentIntroPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </Container>
      </div>
    }>
      <AssessmentIntroContent />
    </Suspense>
  );
}

