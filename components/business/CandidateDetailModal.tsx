"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Mail,
  Calendar,
  ExternalLink,
  CheckCircle,
  XCircle,
  CalendarCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import type { Candidate } from "./CandidateList";

interface Props {
  candidate: Candidate;
  jobId: string;
  onClose: () => void;
  onUpdate: (updates: Partial<Candidate>) => void;
}

export function CandidateDetailModal({ candidate, jobId, onClose, onUpdate }: Props) {
  const [notes, setNotes] = useState(candidate.notes || "");
  const [interviewNotes, setInterviewNotes] = useState(candidate.interview_notes || "");
  const [rejectionReason, setRejectionReason] = useState(candidate.rejection_reason || "");

  const getFitColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-500";
  };

  const getFitLabel = (score: number | null) => {
    if (score === null) return "Not calculated";
    if (score >= 85) return "Excellent Match";
    if (score >= 70) return "Good Match";
    if (score >= 50) return "Moderate Match";
    return "Limited Match";
  };

  const getDimensionColor = (fitScore: number) => {
    if (fitScore >= 85) return "bg-emerald-500";
    if (fitScore >= 70) return "bg-blue-500";
    if (fitScore >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const handleSaveNotes = () => {
    onUpdate({ notes });
  };

  const handleToggleShortlist = () => {
    onUpdate({ shortlisted: !candidate.shortlisted });
  };

  const handleMarkReviewed = () => {
    onUpdate({ status: "reviewed", notes });
  };

  const handleReject = () => {
    onUpdate({ status: "rejected", rejection_reason: rejectionReason });
  };

  const handleScheduleInterview = () => {
    onUpdate({ interview_scheduled: true, interview_notes: interviewNotes });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {candidate.applicant_name || "Anonymous Applicant"}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4 mt-1">
                  {candidate.applicant_email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {candidate.applicant_email}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(candidate.created_at).toLocaleDateString()}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant={candidate.status === "reviewed" ? "default" : "secondary"}>
            {candidate.status}
          </Badge>
          {candidate.shortlisted && (
            <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-0">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Shortlisted
            </Badge>
          )}
          {candidate.interview_scheduled && (
            <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-0">
              <CalendarCheck className="h-3 w-3 mr-1" />
              Interview Scheduled
            </Badge>
          )}
        </div>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fit">Fit Breakdown</TabsTrigger>
            <TabsTrigger value="notes">Notes & Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Fit Score */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Overall Fit Score</p>
                <p className={`text-5xl font-bold ${getFitColor(candidate.fit_score)}`}>
                  {candidate.fit_score !== null ? `${Math.round(candidate.fit_score)}%` : "—"}
                </p>
                <p className={`text-sm mt-1 ${getFitColor(candidate.fit_score)}`}>
                  {getFitLabel(candidate.fit_score)}
                </p>
              </div>
            </div>

            {/* Quick stats */}
            {candidate.fit_breakdown && Array.isArray(candidate.fit_breakdown) && (
              <div className="grid grid-cols-2 gap-3">
                {candidate.fit_breakdown.slice(0, 4).map((item: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.dimension?.replace(/([A-Z])/g, " $1").trim() || `Dimension ${idx + 1}`}
                    </p>
                    <p className="text-lg font-semibold">
                      {Math.round(item.fit_score || 0)}% fit
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Button variant="outline" asChild className="w-full">
              <Link href={`/results/${candidate.assessment_session_id}`} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Assessment Results
              </Link>
            </Button>
          </TabsContent>

          <TabsContent value="fit" className="space-y-4 mt-4">
            {candidate.fit_breakdown && Array.isArray(candidate.fit_breakdown) ? (
              <div className="space-y-3">
                {candidate.fit_breakdown.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium">
                        {item.dimension?.replace(/([A-Z])/g, " $1").trim() || `Dimension ${idx + 1}`}
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round(item.fit_score || 0)}% fit
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getDimensionColor(item.fit_score || 0)} transition-all`}
                        style={{ width: `${item.fit_score || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Candidate: {Math.round(item.applicant_percentile || 0)}%</span>
                      {item.ideal_min !== undefined && item.ideal_max !== undefined && (
                        <span>Ideal: {item.ideal_min}% - {item.ideal_max}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No fit breakdown available</p>
                <p className="text-sm mt-1">Assessment may still be processing</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this candidate..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <Button size="sm" variant="outline" onClick={handleSaveNotes}>
                Save Notes
              </Button>
            </div>

            {candidate.interview_scheduled && (
              <div className="space-y-2">
                <Label htmlFor="interview-notes">Interview Notes</Label>
                <Textarea
                  id="interview-notes"
                  placeholder="Notes from the interview..."
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {candidate.status === "rejected" && candidate.rejection_reason && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Rejection Reason</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {candidate.rejection_reason}
                </p>
              </div>
            )}

            {candidate.status !== "rejected" && (
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="rejection-reason">Rejection Reason (optional)</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Reason for rejection if applicable..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={2}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-wrap gap-2 mt-6">
          <div className="flex gap-2 flex-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleShortlist}
              className={candidate.shortlisted ? "text-yellow-600" : ""}
            >
              <Star className={`h-4 w-4 mr-1 ${candidate.shortlisted ? "fill-yellow-500" : ""}`} />
              {candidate.shortlisted ? "Remove Shortlist" : "Shortlist"}
            </Button>

            {!candidate.interview_scheduled && candidate.status !== "rejected" && (
              <Button variant="outline" size="sm" onClick={handleScheduleInterview}>
                <CalendarCheck className="h-4 w-4 mr-1" />
                Schedule Interview
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {candidate.status !== "rejected" && (
              <Button variant="destructive" size="sm" onClick={handleReject}>
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            )}

            {(candidate.status === "pending" || candidate.status === "completed") && (
              <Button size="sm" onClick={handleMarkReviewed}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark Reviewed
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


