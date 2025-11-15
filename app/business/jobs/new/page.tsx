"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function NewJobPostingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [idealProfile, setIdealProfile] = useState<any>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

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

  const handleAnalyze = async () => {
    if (!formData.description.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch("/api/business/jobs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_description: formData.description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIdealProfile(data.ideal_profile);
        toast.success("Job description analyzed successfully!");
      } else {
        toast.error("Failed to analyze job description");
      }
    } catch (error) {
      toast.error("Error analyzing job description");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId) {
      toast.error("Business account not found");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/business/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          ideal_profile: idealProfile,
          business_id: businessId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Job posting created!");
        router.push(`/business/jobs/${data.job_posting.id}`);
      } else {
        toast.error("Failed to create job posting");
      }
    } catch (error) {
      toast.error("Error creating job posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Create Job Posting</h1>
            <p className="text-muted-foreground">
              Add a new job posting and generate an assessment link for applicants
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Enter the job title and description. We'll analyze it to create an ideal candidate profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter the full job description..."
                    rows={10}
                    required
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAnalyze}
                  disabled={analyzing || !formData.description.trim()}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Job Description"
                  )}
                </Button>
              </CardContent>
            </Card>

            {idealProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Ideal Candidate Profile</CardTitle>
                  <CardDescription>
                    Based on the job description analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {idealProfile.requirements?.map((req: any, idx: number) => (
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
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading || !idealProfile}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Job Posting"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

