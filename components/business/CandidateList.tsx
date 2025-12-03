"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  ArrowUpDown,
  Star,
  Eye,
  Download,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  GitCompare,
} from "lucide-react";
import { CandidateDetailModal } from "./CandidateDetailModal";
import { CandidateCompare } from "./CandidateCompare";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export interface Candidate {
  id: string;
  applicant_name: string | null;
  applicant_email: string | null;
  fit_score: number | null;
  fit_breakdown: any;
  status: string;
  shortlisted: boolean;
  interview_scheduled: boolean;
  interview_notes: string | null;
  notes: string | null;
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  assessment_session_id: string;
}

interface Stats {
  total: number;
  pending: number;
  reviewed: number;
  completed: number;
  shortlisted: number;
  avgFit: number;
  topMatches: number;
}

interface Props {
  jobId: string;
}

export function CandidateList({ jobId }: Props) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    reviewed: 0,
    completed: 0,
    shortlisted: 0,
    avgFit: 0,
    topMatches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("fit_score");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy,
        order: sortOrder,
        status: statusFilter,
      });

      const res = await fetch(`/api/business/jobs/${jobId}/candidates?${params}`);
      const data = await res.json();

      if (res.ok) {
        setCandidates(data.candidates || []);
        setStats(data.stats || {});
      } else {
        toast.error("Failed to load candidates");
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  }, [jobId, sortBy, sortOrder, statusFilter]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const updateCandidate = async (candidateId: string, updates: Partial<Candidate>) => {
    try {
      const res = await fetch(`/api/business/jobs/${jobId}/candidates/${candidateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        fetchCandidates();
        toast.success("Candidate updated");
      } else {
        toast.error("Failed to update candidate");
      }
    } catch (error) {
      toast.error("Failed to update candidate");
    }
  };

  const toggleShortlist = (candidate: Candidate) => {
    updateCandidate(candidate.id, { shortlisted: !candidate.shortlisted });
  };

  const markReviewed = (candidate: Candidate) => {
    updateCandidate(candidate.id, { status: "reviewed" });
  };

  const toggleCompareSelection = (candidateId: string) => {
    const newSet = new Set(selectedForCompare);
    if (newSet.has(candidateId)) {
      newSet.delete(candidateId);
    } else if (newSet.size < 3) {
      newSet.add(candidateId);
    } else {
      toast.error("You can compare up to 3 candidates at a time");
    }
    setSelectedForCompare(newSet);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Fit Score", "Status", "Shortlisted", "Applied Date"];
    const rows = filteredCandidates.map(c => [
      c.applicant_name || "Anonymous",
      c.applicant_email || "N/A",
      c.fit_score?.toString() || "N/A",
      c.status,
      c.shortlisted ? "Yes" : "No",
      new Date(c.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candidates-${jobId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV");
  };

  const filteredCandidates = candidates.filter(c =>
    (c.applicant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (c.applicant_email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const getFitColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-500";
  };

  const getFitBgColor = (score: number | null) => {
    if (score === null) return "bg-muted";
    if (score >= 85) return "bg-emerald-500/20";
    if (score >= 70) return "bg-blue-500/20";
    if (score >= 50) return "bg-amber-500/20";
    return "bg-red-500/20";
  };

  const candidatesForCompare = candidates.filter(c => selectedForCompare.has(c.id));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700">
              <Users className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-200 dark:bg-amber-800">
              <Clock className="h-5 w-5 text-amber-700 dark:text-amber-200" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-200 dark:bg-emerald-800">
              <CheckCircle className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.reviewed}</p>
              <p className="text-xs text-muted-foreground">Reviewed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-200 dark:bg-yellow-800">
              <Star className="h-5 w-5 text-yellow-700 dark:text-yellow-200" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.shortlisted}</p>
              <p className="text-xs text-muted-foreground">Shortlisted</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-200 dark:bg-blue-800">
              <TrendingUp className="h-5 w-5 text-blue-700 dark:text-blue-200" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${getFitColor(stats.avgFit)}`}>
                {stats.avgFit}%
              </p>
              <p className="text-xs text-muted-foreground">Avg Fit</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-200 dark:bg-purple-800">
              <TrendingUp className="h-5 w-5 text-purple-700 dark:text-purple-200" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.topMatches}</p>
              <p className="text-xs text-muted-foreground">Top Matches</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fit_score">Fit Score</SelectItem>
                <SelectItem value="created_at">Date Applied</SelectItem>
                <SelectItem value="applicant_name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")}
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            {selectedForCompare.size >= 2 && (
              <Button variant="secondary" onClick={() => setShowCompare(true)}>
                <GitCompare className="h-4 w-4 mr-2" />
                Compare ({selectedForCompare.size})
              </Button>
            )}
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        {loading ? (
          <CardContent className="py-12 text-center">
            <div className="animate-pulse text-muted-foreground">Loading candidates...</div>
          </CardContent>
        ) : filteredCandidates.length === 0 ? (
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">No candidates found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Share the assessment link to start receiving candidates.
            </p>
          </CardContent>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[40px]">
                  <span className="sr-only">Select</span>
                </TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Fit Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredCandidates.map((candidate, index) => (
                  <motion.tr
                    key={candidate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.02, duration: 0.2 }}
                    className="group hover:bg-muted/30"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedForCompare.has(candidate.id)}
                        onCheckedChange={() => toggleCompareSelection(candidate.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getFitBgColor(candidate.fit_score)}`}>
                          <span className={`text-sm font-bold ${getFitColor(candidate.fit_score)}`}>
                            {candidate.applicant_name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {candidate.applicant_name || "Anonymous"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {candidate.applicant_email || "No email"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${getFitColor(candidate.fit_score)}`}>
                          {candidate.fit_score !== null ? `${Math.round(candidate.fit_score)}%` : "—"}
                        </span>
                        {candidate.fit_score !== null && candidate.fit_score >= 85 && (
                          <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-0">
                            Top Match
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {candidate.shortlisted && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                        <Badge
                          variant={
                            candidate.status === "reviewed"
                              ? "default"
                              : candidate.status === "completed"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {candidate.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(candidate.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedCandidate(candidate)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleShortlist(candidate)}
                          title={candidate.shortlisted ? "Remove from shortlist" : "Add to shortlist"}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              candidate.shortlisted ? "fill-yellow-500 text-yellow-500" : ""
                            }`}
                          />
                        </Button>
                        {(candidate.status === "pending" || candidate.status === "completed") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markReviewed(candidate)}
                            title="Mark as reviewed"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          jobId={jobId}
          onClose={() => setSelectedCandidate(null)}
          onUpdate={(updates) => {
            updateCandidate(selectedCandidate.id, updates);
            setSelectedCandidate(null);
          }}
        />
      )}

      {/* Candidate Compare Modal */}
      {showCompare && candidatesForCompare.length >= 2 && (
        <CandidateCompare
          candidates={candidatesForCompare}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}

