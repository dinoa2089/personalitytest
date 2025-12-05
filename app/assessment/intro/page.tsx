"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAssessmentStore } from "@/store/assessment-store";
import { DimensionsWheel } from "@/components/visualizations";
import { ASSESSMENT_STAGES } from "@/lib/assessment-stages";
import { 
  AlertCircle, 
  Briefcase, 
  Building2, 
  Clock, 
  XCircle,
  ChevronRight,
  Sparkles,
  Lock,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Gift
} from "lucide-react";

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
  const { initializeSession } = useAssessmentStore();
  const [isStarting, setIsStarting] = useState(false);
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
      localStorage.setItem("referral-code", refCode);
    }
    
    if (token) {
      setJobToken(token);
      localStorage.setItem("job-token", token);
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

  // Start assessment - always begins with PRISM stage (no choice needed)
  const handleStart = async () => {
    setIsStarting(true);
    const sessionId = crypto.randomUUID();
    
    initializeSession(sessionId);
    
    // Store assessment stage (always starts with prism)
    localStorage.setItem(`assessment-stage-${sessionId}`, "prism");
    localStorage.setItem("current-guest-session-id", sessionId);

    if (applicantEmail) {
      localStorage.setItem(`applicant-email-${sessionId}`, applicantEmail);
    }
    if (applicantName) {
      localStorage.setItem(`applicant-name-${sessionId}`, applicantName);
    }

    try {
      setStartError(null);
      const referralCode = localStorage.getItem("referral-code");
      const response = await fetch("/api/assessment/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestSessionId: sessionId,
          userId: null, // Guest session - user claims it after auth
          assessmentType: "progressive", // New type - starts with PRISM
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

  // Define stages for the visual journey preview
  const journeyStages = [
    {
      stage: ASSESSMENT_STAGES[0],
      icon: "🎯",
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/30",
      free: true,
    },
    {
      stage: ASSESSMENT_STAGES[1],
      icon: "🔮",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      free: true,
      requiresAuth: true,
    },
    {
      stage: ASSESSMENT_STAGES[2],
      icon: "✨",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      premium: true,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <Container className="flex-1 py-12 md:py-20">
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

          {/* Job Application Header - for B2B flow */}
          {!linkError && !loadingJobInfo && jobInfo && (
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
                      This assessment is pre-paid by the employer. Your results will be shared with {jobInfo.company_name || "the employer"}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Hero - Consumer Flow */}
          {!linkError && !loadingJobInfo && !jobInfo && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Discover Your{" "}
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">
                  True Personality
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-muted-foreground">
                Get scientifically-validated insights into your authentic self.
                Start free, go as deep as you want.
              </p>
              
              {/* Error Display */}
              {startError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mx-auto max-w-md p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{startError}</span>
                  </div>
                </motion.div>
              )}
              
              {/* Primary CTA - Single button, starts immediately */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="pt-4 flex flex-col items-center gap-4"
              >
                <Button 
                  size="lg" 
                  onClick={handleStart} 
                  disabled={isStarting}
                  className="text-lg px-10 py-7 h-auto bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 hover:from-violet-700 hover:via-fuchsia-700 hover:to-orange-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-full"
                >
                  {isStarting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Starting...
                    </>
                  ) : (
                    <>
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Gift className="h-4 w-4 text-green-600" />
                    Free to start
                  </span>
                  <span className="hidden sm:block">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-blue-600" />
                    ~8 minutes
                  </span>
                  <span className="hidden sm:block">•</span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-violet-600" />
                    No signup required
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* B2B Job Application Flow */}
          {!linkError && !loadingJobInfo && jobInfo && (
            <div className="text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Your Assessment for{" "}
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">
                  {jobInfo.title}
                </span>
              </h1>
              
              {showApplicantForm && (
                <Card className="text-left max-w-md mx-auto">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Your Information (Optional)</CardTitle>
                    <CardDescription>
                      Help the employer identify your assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="applicant-name">Full Name</Label>
                      <Input
                        id="applicant-name"
                        type="text"
                        placeholder="John Doe"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="applicant-email">Email Address</Label>
                      <Input
                        id="applicant-email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Button 
                size="lg" 
                onClick={handleStart} 
                disabled={isStarting}
                className="text-lg px-10 py-7 h-auto bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 hover:from-violet-700 hover:via-fuchsia-700 hover:to-orange-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-full"
              >
                {isStarting ? "Starting..." : "Start Assessment →"}
              </Button>
              <p className="text-sm text-muted-foreground">
                ~19 minutes • Pre-paid by employer
              </p>
            </div>
          )}

          {/* Progressive Journey Preview - Consumer Flow */}
          {!linkError && !loadingJobInfo && !jobInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-orange-500/5">
                  <CardTitle className="text-xl md:text-2xl">Your Progressive Journey</CardTitle>
                  <CardDescription className="text-base">
                    Unlock deeper insights at each stage — go as far as you like
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {journeyStages.map((item, i) => (
                      <motion.div
                        key={item.stage.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className={`relative rounded-xl border p-5 ${item.borderColor} ${item.bgColor} transition-all hover:shadow-md`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Stage Number & Icon */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg`}>
                            {item.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold text-lg">{item.stage.name}</h3>
                              {item.free && !item.requiresAuth && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                  Free • No signup
                                </span>
                              )}
                              {item.free && item.requiresAuth && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                  <Lock className="h-3 w-3" />
                                  Free with account
                                </span>
                              )}
                              {item.premium && (
                                <span className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  Premium
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {item.stage.questionCount} questions • {item.stage.timeEstimate}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.stage.unlocks.slice(0, 3).map((unlock, j) => (
                                <span 
                                  key={j} 
                                  className="text-xs bg-background/80 text-muted-foreground px-2 py-1 rounded-full border border-border/50"
                                >
                                  <CheckCircle2 className="h-3 w-3 inline mr-1 text-green-600" />
                                  {unlock}
                                </span>
                              ))}
                              {item.stage.unlocks.length > 3 && (
                                <span className="text-xs text-muted-foreground px-2 py-1">
                                  +{item.stage.unlocks.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Connector */}
                          {i < journeyStages.length - 1 && (
                            <div className="absolute left-[2.25rem] -bottom-4 w-0.5 h-4 bg-border z-10" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Bottom note */}
                  <div className="mt-6 p-4 bg-muted/30 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Results at every stage</span> — 
                      get instant insights, then decide if you want to go deeper
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* What You'll Discover - Consumer Flow */}
          {!linkError && !loadingJobInfo && !jobInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl md:text-2xl">The 7 Dimensions You'll Discover</CardTitle>
                  <CardDescription className="text-base">
                    Scientifically-validated personality traits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DimensionsWheel showTitle={false} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Secondary CTA at bottom */}
          {!linkError && !loadingJobInfo && !jobInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center space-y-4 pt-4"
            >
              <Button 
                size="lg" 
                onClick={handleStart} 
                disabled={isStarting}
                className="text-lg px-10 py-6 h-auto bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 hover:from-violet-700 hover:via-fuchsia-700 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
              >
                {isStarting ? "Starting..." : "Begin Your Discovery →"}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push("/science")} 
                  className="text-muted-foreground hover:text-foreground"
                >
                  Learn about the science
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </motion.div>
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </Container>
      </div>
    }>
      <AssessmentIntroContent />
    </Suspense>
  );
}
