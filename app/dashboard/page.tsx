"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { SubscriptionStatus } from "@/components/premium/SubscriptionStatus";
import { ReferralDashboard } from "@/components/referrals/ReferralDashboard";
import { PremiumUnlockNotification } from "@/components/referrals/PremiumUnlockNotification";

interface Assessment {
  id: string;
  sessionId: string;
  startedAt: string;
  completedAt: string | null;
  progress: number;
  isComplete: boolean;
  hasResults: boolean;
  resultId: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssessments: 0,
    completedAssessments: 0,
    inProgressAssessments: 0,
    lastAssessmentDate: null as string | null,
  });

  useEffect(() => {
    if (!userLoaded) return;

    const fetchAssessments = async () => {
      setIsLoading(true);
      try {
        // Support both authenticated users and guest sessions
        // For guests, we need to get all sessions with matching guest_session_id
        const guestSessionId = localStorage.getItem("current-guest-session-id");
        const userId = user?.id || null;

        const params = new URLSearchParams();
        if (userId) {
          // Authenticated user - will look up by clerk_id -> user_id
          params.append("userId", userId);
        } else if (guestSessionId) {
          // Guest user - lookup by guest_session_id
          params.append("guestSessionId", guestSessionId);
        }

        // If no user and no guest session, show empty state
        if (!userId && !guestSessionId) {
          setAssessments([]);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/dashboard/assessments?${params.toString()}`);
        const data = await response.json();
        setAssessments(data.assessments || []);

        // Calculate statistics
        const completed = data.assessments?.filter((a: Assessment) => a.isComplete) || [];
        const inProgress = data.assessments?.filter((a: Assessment) => !a.isComplete && a.progress > 0) || [];
        const lastAssessment = data.assessments?.[0]?.startedAt || null;

        setStats({
          totalAssessments: data.assessments?.length || 0,
          completedAssessments: completed.length,
          inProgressAssessments: inProgress.length,
          lastAssessmentDate: lastAssessment,
        });
      } catch (error) {
        console.error("Failed to fetch assessments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, [userLoaded, user?.id]);

  if (!userLoaded) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Container className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </Container>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PremiumUnlockNotification />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              {user?.emailAddresses[0]?.emailAddress || "Guest User"}
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAssessments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedAssessments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgressAssessments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Assessment</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {stats.lastAssessmentDate ? formatDate(stats.lastAssessmentDate) : "Never"}
                </div>
              </CardContent>
            </Card>
          </div>

                {/* Subscription Status */}
                <SubscriptionStatus />

                {/* Referral Dashboard */}
                <ReferralDashboard />

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Start a new assessment or continue an existing one</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild size="lg">
                      <Link href="/assessment/intro">Take New Assessment</Link>
                    </Button>
                  </CardContent>
                </Card>

          {/* Assessment History */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>View your past assessments and results</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Loading assessments...</p>
              ) : assessments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No assessments yet</p>
                  <Button asChild>
                    <Link href="/assessment/intro">Start Your First Assessment</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {assessments.map((assessment, index) => (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {assessment.isComplete ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="font-medium">
                              {assessment.isComplete ? "Completed" : "In Progress"}
                            </span>
                            {!assessment.isComplete && (
                              <span className="text-sm text-muted-foreground">
                                ({assessment.progress}% complete)
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Started: {formatDate(assessment.startedAt)}
                            {assessment.completedAt && (
                              <> • Completed: {formatDate(assessment.completedAt)}</>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {assessment.isComplete && assessment.hasResults ? (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/results/${assessment.sessionId}`}>View Results</Link>
                            </Button>
                          ) : !assessment.isComplete ? (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/assessment/questions/${assessment.sessionId}`}>
                                Continue
                              </Link>
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

