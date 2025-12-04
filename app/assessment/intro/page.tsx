"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAssessmentStore } from "@/store/assessment-store";
import { ProcessFlow, DimensionsWheel } from "@/components/visualizations";
import { CHECKPOINTS } from "@/lib/checkpoint-logic";
import { AlertCircle, Briefcase, Building2, Clock, XCircle } from "lucide-react";

type AssessmentType = "quick" | "standard" | "full";

interface JobPostingInfo {
  id: string;
  title: string;
  company_name?: string;
}

interface LinkError {
  message: string;
  type: "expired" | "maxed" | "invalid" | "deactivated";
}

function AssessmentIntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser(); // Get Clerk user if logged in
  const { initializeSession } = useAssessmentStore();
  const [isStarting, setIsStarting] = useState(false);
  const [selectedType, setSelectedType] = useState<AssessmentType | null>("standard");
  const [jobToken, setJobToken] = useState<string | null>(null);
  const [jobInfo, setJobInfo] = useState<JobPostingInfo | null>(null);
  const [linkError, setLinkError] = useState<LinkError | null>(null);
  const [loadingJobInfo, setLoadingJobInfo] = useState(false);
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [showApplicantForm, setShowApplicantForm] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  
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
    setLinkError(null);
    try {
      const response = await fetch(`/api/business/jobs/by-token?token=${token}`);
      const data = await response.json();
      
      if (response.ok && data.valid) {
        const jobPosting = data.job_posting;
        setJobInfo({
          id: jobPosting.id,
          title: jobPosting.title,
          company_name: jobPosting.company_name,
        });
        setShowApplicantForm(true);
      } else if (response.status === 410) {
        // Link expired or maxed out
        const errorMsg = data.error || "This link is no longer valid";
        const errorType = errorMsg.toLowerCase().includes("expired") ? "expired" 
          : errorMsg.toLowerCase().includes("maximum") ? "maxed" 
          : "deactivated";
        setLinkError({ message: errorMsg, type: errorType });
      } else if (response.status === 404) {
        setLinkError({ 
          message: "This assessment link is invalid or does not exist.", 
          type: "invalid" 
        });
      } else {
        setLinkError({ 
          message: data.error || "Unable to load job information.", 
          type: "invalid" 
        });
      }
    } catch (error) {
      console.error("Error fetching job info:", error);
      setLinkError({ 
        message: "Unable to connect. Please try again later.", 
        type: "invalid" 
      });
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

    // Create session in database
    try {
      setStartError(null);
      const referralCode = localStorage.getItem("referral-code");
      const response = await fetch("/api/assessment/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestSessionId: sessionId,
          userId: user?.id || null, // Pass Clerk user ID if logged in
          assessmentType: type, // Pass assessment type to API
          referralCode: referralCode || null,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Failed to create session:", data.error);
        setStartError(data.error || "Failed to start assessment. Please try again.");
        setIsStarting(false);
        return;
      }
      
      // Update localStorage with actual session ID from DB
      if (data.session?.id) {
        localStorage.setItem("current-guest-session-id", data.session.id);
      }
      
      router.push(`/assessment/questions/${sessionId}`);
    } catch (error) {
      console.error("Network error starting assessment:", error);
      setStartError("Network error. Please check your connection and try again.");
      setIsStarting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Link Error State */}
          {linkError && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {linkError.type === "expired" ? (
                    <Clock className="h-12 w-12 text-destructive" />
                  ) : linkError.type === "maxed" ? (
                    <XCircle className="h-12 w-12 text-destructive" />
                  ) : (
                    <AlertCircle className="h-12 w-12 text-destructive" />
                  )}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-destructive">
                      {linkError.type === "expired" ? "Link Expired" 
                        : linkError.type === "maxed" ? "Link Limit Reached" 
                        : "Invalid Link"}
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                      {linkError.message}
                    </p>
                  </div>
                  <div className="pt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Please contact the employer for a new assessment link, or:
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setLinkError(null);
                        setJobToken(null);
                        localStorage.removeItem("job-token");
                        window.history.replaceState({}, "", "/assessment/intro");
                      }}
                    >
                      Take a Personal Assessment Instead
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading Job Info */}
          {loadingJobInfo && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}

          {!linkError && !loadingJobInfo && jobInfo ? (
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-primary">
                        Job Application Assessment
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{jobInfo.title}</h3>
                    {jobInfo.company_name && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{jobInfo.company_name}</span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground pt-2">
                      This assessment is pre-paid by the employer. Complete it to be considered for this role.
                      Your results will be shared with {jobInfo.company_name || "the employer"}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {!linkError && !loadingJobInfo && jobInfo && (
            <div className="text-center space-y-6">
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
              
              {/* Primary CTA for Job Applicants - Above the fold */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={() => handleStart("standard")} 
                  disabled={isStarting}
                  className="text-lg px-12 py-7 h-auto bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-full"
                >
                  {isStarting ? "Starting..." : "Start Assessment →"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  ~19 minutes • Pre-paid by employer
                </p>
              </div>
            </div>
          )}

          {!linkError && !loadingJobInfo && !jobInfo && (
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
                <span className="text-foreground font-medium">Start in 8 minutes, go deeper anytime</span>
              </p>
              
              {/* Error Display */}
              {startError && (
                <div className="mx-auto max-w-md p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{startError}</span>
                  </div>
                </div>
              )}
              
              {/* Primary CTA - Above the fold */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={() => handleStart("standard")} 
                  disabled={isStarting}
                  className="text-lg px-12 py-7 h-auto bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-full"
                >
                  {isStarting ? "Starting..." : "Take the Assessment →"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Free • No signup required • 8 min
                </p>
              </div>
            </div>
          )}

          {/* Journey Preview - hide when there's a link error */}
          {!linkError && !loadingJobInfo && (
          <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Your Personality Journey</CardTitle>
              <CardDescription className="text-base">
                Complete at your own pace — stop anytime and continue later
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {CHECKPOINTS.map((checkpoint, i) => (
                  <div key={checkpoint.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        i === 0 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-primary/20 text-primary"
                      }`}>
                        {checkpoint.id}
                      </div>
                      {i < CHECKPOINTS.length - 1 && (
                        <div className="w-0.5 h-8 bg-border my-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="font-semibold text-lg">{checkpoint.name}</h3>
                        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                          {checkpoint.timeEstimate}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{checkpoint.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {checkpoint.unlocks.slice(0, 2).map((unlock, j) => (
                          <span key={j} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                            ✓ {unlock}
                          </span>
                        ))}
                        {checkpoint.unlocks.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{checkpoint.unlocks.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-xl text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Stop anytime</span> • Your progress is saved • Continue later
                </p>
              </div>
            </CardContent>
          </Card>
          )}

          {!linkError && !loadingJobInfo && (
          <>
            <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl">What to Expect</CardTitle>
                <CardDescription className="text-base">What you&apos;ll learn about yourself</CardDescription>
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
          </>
          )}

          {!linkError && !loadingJobInfo && (
          <>

          {/* Dimensions Preview */}
          <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">The 7 Dimensions You&apos;ll Discover</CardTitle>
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
                {jobInfo ? "Select the assessment version" : "Each option builds on the previous — stop at any checkpoint and get results"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Assessment - Checkpoint 1 */}
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
                      <h3 className="font-bold text-lg">Quick Start</h3>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Checkpoint 1</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      35 questions • ~8 minutes
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Get your PRISM-7 personality profile and basic archetype. Perfect if you&apos;re short on time.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                        ✓ PRISM-7 scores
                      </span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                        ✓ Personality archetype
                      </span>
                    </div>
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

              {/* Standard Assessment - Checkpoint 3 */}
              <div 
                className={`group relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                  selectedType === "standard" 
                    ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md" 
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/30 hover:shadow-md"
                }`}
                onClick={() => setSelectedType("standard")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full transition-all ${
                        selectedType === "standard" ? "bg-primary ring-4 ring-primary/20" : "bg-border group-hover:bg-primary/50"
                      }`} />
                      <h3 className="font-bold text-lg">Standard</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Recommended</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      80 questions • ~19 minutes • 3 checkpoints
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Unlock PRISM-7, MBTI type, and Enneagram. Best balance of depth and time. Stop at any checkpoint.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                        ✓ Everything in Quick
                      </span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                        ✓ MBTI type
                      </span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                        ✓ Enneagram
                      </span>
                    </div>
                  </div>
                  {selectedType === "standard" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Full Assessment - Checkpoint 4 */}
              <div 
                className={`group relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                  selectedType === "full" 
                    ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md" 
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/30 hover:shadow-md"
                }`}
                onClick={() => setSelectedType("full")}
              >
                {/* Premium badge */}
                <div className="absolute -top-3 -right-2">
                  <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full font-semibold shadow-lg">
                    Deep Dive
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full transition-all ${
                        selectedType === "full" ? "bg-primary ring-4 ring-primary/20" : "bg-border group-hover:bg-primary/50"
                      }`} />
                      <h3 className="font-bold text-lg">Comprehensive</h3>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">All 4 checkpoints</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      105 questions • ~25 minutes • 4 checkpoints
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Complete deep dive with facet-level analysis, Dark Triad insights, compatibility scores, and career guidance. Progress through all 4 checkpoints.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                        ✓ Everything in Standard
                      </span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                        ✓ Facet analysis
                      </span>
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                        ★ Dark Triad profile
                      </span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                        ✓ Career guidance
                      </span>
                    </div>
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

              {/* Checkpoint info note */}
              <div className="mt-2 p-3 bg-muted/30 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">How checkpoints work:</span> Answer questions → reach a checkpoint → get results for that level → continue or stop anytime
                </p>
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
              {isStarting ? "Starting..." : `Start ${selectedType === "quick" ? "Quick" : selectedType === "standard" ? "Standard" : "Comprehensive"} Assessment`}
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
          </>
          )}
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
