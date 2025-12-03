"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  Plus,
  TrendingUp,
  FileText,
  ChevronRight,
  Calendar,
  Loader2,
  Building2,
  Target,
  Copy,
  Check,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobDescriptionAnalyzer, AnalysisResult } from "@/components/business/JobDescriptionAnalyzer";
import { JobProfileDisplay } from "@/components/business/JobProfileDisplay";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

// Types
interface JobPosting {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  assessment_link_token: string;
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  team_members: { count: number }[];
}

interface BusinessAccount {
  id: string;
  company_name: string;
  subscription_tier: string;
  created_at: string;
  organization_id?: string;
}

// Tab navigation items
const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "teams", label: "Teams", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export function EmployerDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  
  // Data states
  const [loading, setLoading] = useState(true);
  const [businessAccount, setBusinessAccount] = useState<BusinessAccount | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  // Job creation states
  const [showJobCreator, setShowJobCreator] = useState(false);
  const [jobStep, setJobStep] = useState<"analyze" | "review" | "complete">("analyze");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [rawDescription, setRawDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [creatingJob, setCreatingJob] = useState(false);
  const [createdJob, setCreatedJob] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  // Team creation states
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });
  const [creatingTeam, setCreatingTeam] = useState(false);
  
  // Settings states
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ company_name: "" });

  // Fetch data on mount
  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchData = async () => {
      try {
        // Get business account
        const businessResponse = await fetch(`/api/business/account?user_id=${user.id}`);
        if (businessResponse.ok) {
          const businessData = await businessResponse.json();
          if (businessData.business_account) {
            const account = businessData.business_account;
            setBusinessAccount(account);
            setFormData({ company_name: account.company_name });

            // Fetch jobs
            const jobsResponse = await fetch(`/api/business/jobs?business_id=${account.id}`);
            if (jobsResponse.ok) {
              const jobsData = await jobsResponse.json();
              setJobPostings(jobsData.job_postings || []);
            }

            // Fetch teams
            if (account.organization_id) {
              const teamsResponse = await fetch(`/api/business/teams?organization_id=${account.organization_id}`);
              if (teamsResponse.ok) {
                const teamsData = await teamsResponse.json();
                setTeams(teamsData.teams || []);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, isLoaded]);

  // Update URL when tab changes
  useEffect(() => {
    const newUrl = activeTab === "overview" ? "/for-employers" : `/for-employers?tab=${activeTab}`;
    window.history.replaceState({}, "", newUrl);
  }, [activeTab]);

  // Job creation handlers
  const handleAnalysisComplete = (result: AnalysisResult, description: string) => {
    setAnalysis(result);
    setRawDescription(description);
    setJobTitle(result.title);
    setJobStep("review");
    toast.success("Analysis complete!");
  };

  const handleDimensionsUpdate = (dimensions: AnalysisResult["dimensions"]) => {
    if (analysis) {
      setAnalysis({ ...analysis, dimensions });
    }
  };

  const handleCreateJob = async () => {
    if (!businessAccount || !analysis) return;

    setCreatingJob(true);
    try {
      const response = await fetch("/api/business/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: jobTitle || analysis.title,
          description: rawDescription,
          analysis: analysis,
          organizationId: businessAccount.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCreatedJob(data);
        setJobStep("complete");
        // Add to jobs list
        const newJob = data.job_profile || data.job_posting;
        if (newJob) {
          setJobPostings([newJob, ...jobPostings]);
        }
        toast.success("Job profile created!");
      } else {
        toast.error(data.error || "Failed to create job");
      }
    } catch (error) {
      toast.error("Error creating job");
    } finally {
      setCreatingJob(false);
    }
  };

  const resetJobCreator = () => {
    setShowJobCreator(false);
    setJobStep("analyze");
    setAnalysis(null);
    setRawDescription("");
    setJobTitle("");
    setCreatedJob(null);
  };

  const copyAssessmentLink = (token: string) => {
    const link = `${window.location.origin}/assessment?job=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(token);
    toast.success("Link copied!");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Team creation handler
  const handleCreateTeam = async () => {
    if (!businessAccount?.organization_id || !newTeam.name) return;

    setCreatingTeam(true);
    try {
      const response = await fetch("/api/business/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id: businessAccount.organization_id,
          name: newTeam.name,
          description: newTeam.description || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTeams([{ ...data.team, team_members: [{ count: 0 }] }, ...teams]);
        setNewTeam({ name: "", description: "" });
        setTeamDialogOpen(false);
        toast.success("Team created!");
      }
    } catch (error) {
      toast.error("Error creating team");
    } finally {
      setCreatingTeam(false);
    }
  };

  // Settings handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessAccount) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/business/account/${businessAccount.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: formData.company_name }),
      });

      if (response.ok) {
        toast.success("Settings saved!");
        setBusinessAccount({ ...businessAccount, company_name: formData.company_name });
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  // No business account - show setup
  if (!businessAccount) {
    return <BusinessSetupForm onComplete={(account) => setBusinessAccount(account)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Dashboard Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{businessAccount.company_name}</h1>
              <p className="text-sm text-slate-400">Employer Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-violet-500/30 text-violet-300">
                {businessAccount.subscription_tier}
              </Badge>
              <Button
                onClick={() => {
                  setShowJobCreator(true);
                  setActiveTab("jobs");
                }}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1 -mb-px">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== "jobs") setShowJobCreator(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === item.id
                    ? "text-violet-400 border-violet-400"
                    : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Total Jobs</CardTitle>
                    <Briefcase className="h-4 w-4 text-violet-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{jobPostings.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Active Jobs</CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      {jobPostings.filter(j => j.status === "active").length}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Teams</CardTitle>
                    <Users className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{teams.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Total Applicants</CardTitle>
                    <FileText className="h-4 w-4 text-fuchsia-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">—</div>
                    <p className="text-xs text-slate-500">Coming soon</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Jobs */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Recent Jobs</CardTitle>
                    <CardDescription className="text-slate-400">Your latest job postings</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("jobs")} className="text-violet-400">
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {jobPostings.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">No job postings yet</p>
                      <Button onClick={() => { setShowJobCreator(true); setActiveTab("jobs"); }}>
                        Create your first job
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {jobPostings.slice(0, 5).map((job) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-white truncate">{job.title}</h3>
                              <Badge
                                variant="outline"
                                className={job.status === "active" ? "border-emerald-500/50 text-emerald-400" : "border-slate-600 text-slate-400"}
                              >
                                {job.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500">
                              Created {new Date(job.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyAssessmentLink(job.assessment_link_token)}
                              className="text-slate-400 hover:text-white"
                            >
                              {copiedLink === job.assessment_link_token ? (
                                <Check className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="text-slate-400 hover:text-white"
                            >
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

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card
                  className="bg-gradient-to-br from-violet-900/30 to-slate-900/50 border-violet-500/20 cursor-pointer hover:border-violet-500/40 transition-colors"
                  onClick={() => { setShowJobCreator(true); setActiveTab("jobs"); }}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                      <Target className="h-6 w-6 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Create Job Profile</h3>
                      <p className="text-sm text-slate-400">AI-powered job analysis</p>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="bg-gradient-to-br from-emerald-900/30 to-slate-900/50 border-emerald-500/20 cursor-pointer hover:border-emerald-500/40 transition-colors"
                  onClick={() => { setTeamDialogOpen(true); setActiveTab("teams"); }}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Create Team</h3>
                      <p className="text-sm text-slate-400">Analyze team composition</p>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="bg-gradient-to-br from-blue-900/30 to-slate-900/50 border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition-colors"
                  onClick={() => setActiveTab("settings")}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Settings className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Settings</h3>
                      <p className="text-sm text-slate-400">Manage your account</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {showJobCreator ? (
                // Job Creator
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {jobStep === "complete" ? "Job Created!" : "Create Job Profile"}
                      </h2>
                      <p className="text-slate-400">
                        {jobStep === "analyze" && "Paste your job description to generate an ideal candidate profile"}
                        {jobStep === "review" && "Review and customize the AI-generated personality requirements"}
                        {jobStep === "complete" && "Share the assessment link with candidates"}
                      </p>
                    </div>
                    <Button variant="ghost" onClick={resetJobCreator} className="text-slate-400">
                      Cancel
                    </Button>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex items-center justify-center gap-4">
                    {["Analyze", "Review", "Complete"].map((label, i) => {
                      const stepIndex = ["analyze", "review", "complete"].indexOf(jobStep);
                      const isActive = i === stepIndex;
                      const isComplete = i < stepIndex;

                      return (
                        <div key={label} className="flex items-center">
                          <div
                            className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                              isComplete ? "bg-violet-500 text-white" :
                              isActive ? "bg-violet-500 text-white ring-4 ring-violet-500/20" :
                              "bg-slate-800 text-slate-500"
                            )}
                          >
                            {isComplete ? <Check className="h-4 w-4" /> : i + 1}
                          </div>
                          <span className={cn(
                            "ml-2 text-sm hidden sm:inline",
                            isActive ? "text-white font-medium" : "text-slate-500"
                          )}>
                            {label}
                          </span>
                          {i < 2 && (
                            <div className={cn(
                              "w-12 h-0.5 mx-4",
                              isComplete ? "bg-violet-500" : "bg-slate-800"
                            )} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Step Content */}
                  {jobStep === "analyze" && (
                    <JobDescriptionAnalyzer onAnalysisComplete={handleAnalysisComplete} />
                  )}

                  {jobStep === "review" && analysis && (
                    <div className="space-y-6">
                      <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Job Title</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Input
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="e.g., Senior Software Engineer"
                            className="text-lg bg-slate-800 border-slate-700 text-white"
                          />
                        </CardContent>
                      </Card>

                      <JobProfileDisplay
                        analysis={{ ...analysis, title: jobTitle || analysis.title }}
                        editable
                        onUpdate={handleDimensionsUpdate}
                      />

                      <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setJobStep("analyze")} className="flex-1 border-slate-700">
                          Re-analyze
                        </Button>
                        <Button
                          onClick={handleCreateJob}
                          disabled={creatingJob}
                          className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600"
                        >
                          {creatingJob ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Job Profile"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {jobStep === "complete" && createdJob && (
                    <div className="space-y-6">
                      <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border-emerald-500/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Check className="h-5 w-5 text-emerald-400" />
                            Assessment Link Ready
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Share this link with candidates
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 p-3 bg-slate-800 rounded-lg font-mono text-sm text-slate-300 break-all">
                              {createdJob.assessmentLink ? `${window.location.origin}${createdJob.assessmentLink}` : "—"}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                if (createdJob.assessmentLink) {
                                  navigator.clipboard.writeText(`${window.location.origin}${createdJob.assessmentLink}`);
                                  toast.success("Link copied!");
                                }
                              }}
                              className="border-slate-700"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex gap-4 pt-4">
                            <Button variant="outline" onClick={resetJobCreator} className="flex-1 border-slate-700">
                              Back to Jobs
                            </Button>
                            <Button
                              onClick={() => {
                                resetJobCreator();
                                setShowJobCreator(true);
                                setJobStep("analyze");
                              }}
                              className="flex-1"
                            >
                              Create Another
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {analysis && (
                        <JobProfileDisplay analysis={{ ...analysis, title: jobTitle || analysis.title }} />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Jobs List
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Job Postings</h2>
                      <p className="text-slate-400">Manage your jobs and view applicants</p>
                    </div>
                    <Button onClick={() => setShowJobCreator(true)} className="bg-gradient-to-r from-violet-600 to-fuchsia-600">
                      <Plus className="h-4 w-4 mr-2" />
                      New Job
                    </Button>
                  </div>

                  {jobPostings.length === 0 ? (
                    <Card className="bg-slate-900/50 border-slate-800">
                      <CardContent className="py-16 text-center">
                        <Briefcase className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No job postings yet</h3>
                        <p className="text-slate-400 mb-6">Create your first job posting to start receiving candidates</p>
                        <Button onClick={() => setShowJobCreator(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Job Profile
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {jobPostings.map((job, index) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-white text-lg">{job.title}</h3>
                                    <Badge
                                      variant="outline"
                                      className={job.status === "active" ? "border-emerald-500/50 text-emerald-400" : "border-slate-600 text-slate-400"}
                                    >
                                      {job.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-400 line-clamp-2 mb-2">{job.description}</p>
                                  <p className="text-xs text-slate-500">
                                    Created {new Date(job.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyAssessmentLink(job.assessment_link_token)}
                                    className="text-slate-400 hover:text-white"
                                  >
                                    {copiedLink === job.assessment_link_token ? (
                                      <Check className="h-4 w-4 text-emerald-400" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                    <span className="ml-2 hidden sm:inline">Copy Link</span>
                                  </Button>
                                  <Button variant="outline" size="sm" asChild className="border-slate-700">
                                    <Link href={`/business/jobs/${job.id}/applicants`}>
                                      View Applicants
                                    </Link>
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-slate-400">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                                      <DropdownMenuItem asChild>
                                        <Link href={`/business/jobs/${job.id}`} className="flex items-center">
                                          <ExternalLink className="h-4 w-4 mr-2" />
                                          View Details
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <Link href={`/business/jobs/${job.id}/edit`} className="flex items-center">
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit
                                        </Link>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Teams Tab */}
          {activeTab === "teams" && (
            <motion.div
              key="teams"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Teams</h2>
                  <p className="text-slate-400">Manage teams and view composition analytics</p>
                </div>
                <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                      <DialogTitle className="text-white">Create New Team</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Create a team to analyze personality composition
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="team-name" className="text-slate-300">Team Name</Label>
                        <Input
                          id="team-name"
                          placeholder="e.g., Engineering Team"
                          value={newTeam.name}
                          onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team-description" className="text-slate-300">Description (optional)</Label>
                        <Textarea
                          id="team-description"
                          placeholder="Brief description of the team"
                          value={newTeam.description}
                          onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setTeamDialogOpen(false)} className="border-slate-700">
                          Cancel
                        </Button>
                        <Button onClick={handleCreateTeam} disabled={!newTeam.name || creatingTeam}>
                          {creatingTeam ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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

              {teams.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="py-16 text-center">
                    <Users className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No teams yet</h3>
                    <p className="text-slate-400 mb-6">Create your first team to start analyzing composition</p>
                    <Button onClick={() => setTeamDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
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
                        <Card className="bg-slate-900/50 border-slate-800 h-full hover:border-violet-500/50 transition-colors cursor-pointer group">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between text-white">
                              <span className="truncate">{team.name}</span>
                              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                            </CardTitle>
                            {team.description && (
                              <CardDescription className="text-slate-400 line-clamp-2">
                                {team.description}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{team.team_members?.[0]?.count || 0} members</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(team.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <p className="text-slate-400">Manage your business account</p>
              </div>

              {/* Company Information */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-violet-400" />
                    <CardTitle className="text-white">Company Information</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">Update your company details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name" className="text-slate-300">Company Name</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <CardTitle className="text-white">Subscription</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">Your current plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white mb-1 capitalize">
                        {businessAccount.subscription_tier}
                      </div>
                      <div className="text-sm text-slate-500">
                        Created: {new Date(businessAccount.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="outline" className="border-violet-500/30 text-violet-300">
                      {businessAccount.subscription_tier}
                    </Badge>
                  </div>
                  <Button variant="outline" asChild className="border-slate-700">
                    <Link href="/pricing">Upgrade Plan</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      <CardTitle className="text-white">Account Users</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                  <CardDescription className="text-slate-400">
                    Manage who can access this account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-500">
                    <p>Team member management coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Business Setup Form Component
function BusinessSetupForm({ onComplete }: { onComplete: (account: BusinessAccount) => void }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    subscription_tier: "starter" as "starter" | "professional" | "enterprise",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company_name.trim()) {
      toast.error("Please enter a company name");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/business/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: formData.company_name,
          subscription_tier: formData.subscription_tier,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Business account created!");
        onComplete(data.business_account);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create account");
      }
    } catch (error) {
      toast.error("Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Set Up Your Business</h1>
          <p className="text-slate-400">Create your account to start using PRISM-7 for hiring</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-slate-300">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Acme Corporation"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscription_tier" className="text-slate-300">Subscription Tier</Label>
                <select
                  id="subscription_tier"
                  value={formData.subscription_tier}
                  onChange={(e) => setFormData({ ...formData, subscription_tier: e.target.value as any })}
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <option value="starter">Starter - $99/month</option>
                  <option value="professional">Professional - $299/month</option>
                  <option value="enterprise">Enterprise - Custom</option>
                </select>
              </div>

              <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-4">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Check className="h-4 w-4 text-violet-400" />
                  What you'll get:
                </h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Create job postings with AI personality analysis</li>
                  <li>• Receive and rank candidate assessments</li>
                  <li>• View fit scores and detailed profiles</li>
                  <li>• Team composition analytics</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Business Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

