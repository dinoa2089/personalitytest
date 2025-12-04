"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Link, RefreshCw, ExternalLink, Check, Clock, Users, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface JobLink {
  id?: string;
  token: string;
  url: string;
  is_active: boolean;
  current_uses: number;
  max_uses: number | null;
  expires_at: string | null;
  created_at?: string;
  is_legacy?: boolean;
}

interface Props {
  jobId: string;
}

export function JobLinkManager({ jobId }: Props) {
  const [link, setLink] = useState<JobLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [maxUses, setMaxUses] = useState<string>("");
  const [expiresInDays, setExpiresInDays] = useState<string>("");

  const fetchLink = useCallback(async () => {
    try {
      const res = await fetch(`/api/business/jobs/${jobId}/link`);
      const data = await res.json();
      setLink(data.link);
    } catch (error) {
      console.error("Error fetching link:", error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchLink();
  }, [fetchLink]);

  const generateLink = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/business/jobs/${jobId}/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maxUses: maxUses ? parseInt(maxUses) : null,
          expiresInDays: expiresInDays ? parseInt(expiresInDays) : null,
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setLink(data.link);
        toast.success("Assessment link generated!");
        setShowAdvanced(false);
        setMaxUses("");
        setExpiresInDays("");
      } else {
        toast.error(data.error || "Failed to generate link");
      }
    } catch (error) {
      console.error("Error generating link:", error);
      toast.error("Failed to generate link");
    } finally {
      setGenerating(false);
    }
  };

  const deactivateLink = async () => {
    try {
      const res = await fetch(`/api/business/jobs/${jobId}/link`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setLink(null);
        toast.success("Link deactivated");
      }
    } catch (error) {
      console.error("Error deactivating link:", error);
      toast.error("Failed to deactivate link");
    }
  };

  const copyLink = () => {
    if (link?.url) {
      navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard!");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isExpired = link?.expires_at && new Date(link.expires_at) < new Date();
  const isMaxedOut = link?.max_uses && link.current_uses >= link.max_uses;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Candidate Assessment Link
        </CardTitle>
        <CardDescription>
          Share this link with candidates to let them take the pre-paid assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : link ? (
          <>
            {/* Link Status Warnings */}
            {(isExpired || isMaxedOut) && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  {isExpired ? "This link has expired." : "This link has reached its usage limit."}
                  {" "}Generate a new link to continue.
                </span>
              </div>
            )}

            {/* Link Display */}
            <div className="flex gap-2">
              <Input 
                value={link.url} 
                readOnly 
                className="font-mono text-sm bg-muted/50"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyLink}
                title="Copy link"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                asChild
                title="Open in new tab"
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Link Stats */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>
                  Uses: {link.current_uses}
                  {link.max_uses ? ` / ${link.max_uses}` : " (unlimited)"}
                </span>
              </div>
              {link.expires_at && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>
                    {isExpired ? "Expired" : `Expires ${formatDate(link.expires_at)}`}
                  </span>
                </div>
              )}
              {link.is_legacy && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                  Legacy Link
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Link
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={deactivateLink}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Deactivate Link
              </Button>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="mt-4 p-4 border rounded-lg space-y-4 bg-muted/30">
                <h4 className="font-medium text-sm">Link Settings (Optional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxUses" className="text-sm">Max Uses</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      placeholder="Unlimited"
                      min="1"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Limit number of assessments
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expires" className="text-sm">Expires in (days)</Label>
                    <Input
                      id="expires"
                      type="number"
                      placeholder="Never"
                      min="1"
                      value={expiresInDays}
                      onChange={(e) => setExpiresInDays(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Auto-expire the link
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={generateLink} 
                    disabled={generating}
                  >
                    {generating ? "Generating..." : "Generate New Link"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAdvanced(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              No active assessment link. Generate one to share with candidates.
            </p>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mb-2"
            >
              {showAdvanced ? "Hide Options" : "Show Options"}
            </Button>

            {showAdvanced && (
              <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
                <h4 className="font-medium text-sm">Link Settings (Optional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxUses" className="text-sm">Max Uses</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      placeholder="Unlimited"
                      min="1"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expires" className="text-sm">Expires in (days)</Label>
                    <Input
                      id="expires"
                      type="number"
                      placeholder="Never"
                      min="1"
                      value={expiresInDays}
                      onChange={(e) => setExpiresInDays(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={generateLink} 
              disabled={generating}
              className="w-full"
            >
              {generating ? "Generating..." : "Generate Assessment Link"}
            </Button>
          </>
        )}

        <p className="text-xs text-muted-foreground pt-2">
          When candidates complete the assessment using this link, their results will automatically appear in your dashboard with fit scores.
        </p>
      </CardContent>
    </Card>
  );
}


