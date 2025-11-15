"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface JobPosting {
  id: string;
  title: string;
  description: string;
  ideal_profile: any;
  status: string;
}

export default function EditJobPostingPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft" as "draft" | "active" | "closed",
  });
  const [idealProfile, setIdealProfile] = useState<any>(null);

  useEffect(() => {
    const fetchJobPosting = async () => {
      try {
        const response = await fetch(`/api/business/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          const job = data.job_posting;
          setFormData({
            title: job.title,
            description: job.description,
            status: job.status,
          });
          setIdealProfile(job.ideal_profile);
        } else {
          toast.error("Failed to load job posting");
          router.push("/business/dashboard");
        }
      } catch (error) {
        toast.error("Error loading job posting");
        router.push("/business/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobPosting();
    }
  }, [jobId, router]);

  const handleAnalyze = async () => {
    if (!formData.description.trim()) {
      toast.error("Please enter a job description");
      return;
    }

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/business/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          ideal_profile: idealProfile,
        }),
      });

      if (response.ok) {
        toast.success("Job posting updated!");
        router.push(`/business/jobs/${jobId}`);
      } else {
        toast.error("Failed to update job posting");
      }
    } catch (error) {
      toast.error("Error updating job posting");
    } finally {
      setSaving(false);
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Edit Job Posting</h1>
              <p className="text-muted-foreground">
                Update job details and ideal candidate profile
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Update the job title and description
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

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAnalyze}
                  disabled={!formData.description.trim()}
                >
                  Re-analyze Job Description
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
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
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

