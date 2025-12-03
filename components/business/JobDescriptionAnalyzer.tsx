"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Link, FileText, AlertCircle, CheckCircle2, Globe } from "lucide-react";

interface DimensionAnalysis {
  target: number;
  weight: number;
  reasoning: string;
}

export interface AnalysisResult {
  title: string;
  dimensions: {
    openness: DimensionAnalysis;
    conscientiousness: DimensionAnalysis;
    extraversion: DimensionAnalysis;
    agreeableness: DimensionAnalysis;
    emotionalResilience: DimensionAnalysis;
    honestyHumility: DimensionAnalysis;
    adaptability: DimensionAnalysis;
  };
  keyPhrases: string[];
  overallReasoning: string;
}

interface Props {
  onAnalysisComplete: (analysis: AnalysisResult, rawDescription: string) => void;
  initialDescription?: string;
}

export function JobDescriptionAnalyzer({ onAnalysisComplete, initialDescription = "" }: Props) {
  const [mode, setMode] = useState<"paste" | "url">("paste");
  const [input, setInput] = useState(initialDescription);
  const [scraping, setScraping] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrapedData, setScrapedData] = useState<{ description: string; title: string; url: string } | null>(null);

  const handleScrapeUrl = async () => {
    if (!input.trim()) return;

    // Validate URL
    try {
      new URL(input);
    } catch {
      setError("Please enter a valid URL (e.g., https://linkedin.com/jobs/...)");
      return;
    }

    setScraping(true);
    setError(null);
    setScrapedData(null);

    try {
      const response = await fetch("/api/business/jobs/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Failed to scrape URL. Try pasting the job description directly.");
        if (data.partialContent) {
          // Show partial content in paste mode
          setMode("paste");
          setInput(data.partialContent);
        }
        return;
      }

      setScrapedData({
        description: data.jobDescription,
        title: data.jobTitle || "",
        url: data.sourceUrl,
      });
    } catch (err) {
      setError("Failed to connect. Please check your connection and try again.");
    } finally {
      setScraping(false);
    }
  };

  const handleAnalyze = async () => {
    const descriptionToAnalyze = mode === "url" && scrapedData 
      ? scrapedData.description 
      : input;

    if (!descriptionToAnalyze.trim()) return;

    if (descriptionToAnalyze.length < 50) {
      setError("Job description must be at least 50 characters.");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/business/jobs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: descriptionToAnalyze,
          sourceUrl: mode === "url" ? input : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Failed to analyze. Please try again.");
        return;
      }

      onAnalysisComplete(data.analysis, descriptionToAnalyze);
    } catch (err) {
      setError("Failed to analyze. Please check your connection and try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const isUrlValid = mode === "url" && input.trim() && (() => {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  })();

  const canAnalyze = mode === "paste" 
    ? input.trim().length >= 50
    : scrapedData !== null;

  return (
    <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          AI Job Analysis
        </CardTitle>
        <CardDescription>
          Paste your job description or provide a URL, and our AI will extract the ideal personality profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === "paste" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("paste");
              setError(null);
              setScrapedData(null);
            }}
            className="flex-1 sm:flex-none"
          >
            <FileText className="h-4 w-4 mr-2" />
            Paste Description
          </Button>
          <Button
            variant={mode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("url");
              setError(null);
              setInput("");
              setScrapedData(null);
            }}
            className="flex-1 sm:flex-none"
          >
            <Globe className="h-4 w-4 mr-2" />
            From URL
          </Button>
        </div>

        {/* Input */}
        {mode === "paste" ? (
          <>
            <Textarea
              placeholder="Paste the full job description here...

Example:
We are looking for a Senior Software Engineer to join our fast-paced team. The ideal candidate is creative, detail-oriented, and thrives in collaborative environments. You'll be responsible for designing and implementing complex systems while mentoring junior developers..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={12}
              className="resize-none font-mono text-sm"
            />
            {/* Character count */}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                {input.length} characters
                {input.length < 50 && input.length > 0 && (
                  <span className="text-amber-500 ml-2">(minimum 50)</span>
                )}
              </span>
              <span>
                ~{Math.ceil(input.length / 500)} min analysis
              </span>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://linkedin.com/jobs/view/..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setScrapedData(null);
                  setError(null);
                }}
                className="flex-1"
              />
              <Button
                onClick={handleScrapeUrl}
                disabled={scraping || !isUrlValid}
                variant="secondary"
              >
                {scraping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Link className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Supported sites hint */}
            <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
              <span>Supported:</span>
              {["LinkedIn", "Indeed", "Glassdoor", "Greenhouse", "Lever", "Workday"].map((site) => (
                <span key={site} className="px-1.5 py-0.5 bg-muted rounded">
                  {site}
                </span>
              ))}
              <span className="text-muted-foreground/60">+ most job sites</span>
            </div>

            {/* Scraped content preview */}
            {scrapedData && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Job description extracted</span>
                </div>
                {scrapedData.title && (
                  <p className="text-sm font-medium">{scrapedData.title}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {scrapedData.description.slice(0, 200)}...
                </p>
                <p className="text-xs text-muted-foreground">
                  {scrapedData.description.length.toLocaleString()} characters extracted
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <p>{error}</p>
              {mode === "url" && (
                <button
                  className="underline mt-1 text-xs opacity-80 hover:opacity-100"
                  onClick={() => {
                    setMode("paste");
                    setError(null);
                  }}
                >
                  Switch to paste mode instead
                </button>
              )}
            </div>
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={analyzing || !canAnalyze}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          size="lg"
        >
          {analyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze Job Requirements
            </>
          )}
        </Button>

        {/* Analysis preview hints */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {["Openness", "Conscientiousness", "Extraversion", "Adaptability"].map((dim) => (
            <div
              key={dim}
              className="text-center p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground"
            >
              {dim}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
