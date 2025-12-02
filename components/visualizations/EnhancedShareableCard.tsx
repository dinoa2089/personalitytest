"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Check, Copy } from "lucide-react";
import { PersonalityRadarChart } from "@/components/results/RadarChart";
import type { DimensionScore } from "@/types";
import { type Archetype, getStrengthTitle } from "@/lib/archetypes";

interface EnhancedShareableCardProps {
  archetype: Archetype;
  scores: DimensionScore[];
  sessionId: string;
  userName?: string;
  className?: string;
}

export function EnhancedShareableCard({
  archetype,
  scores,
  sessionId,
  userName = "My",
  className = "",
}: EnhancedShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get top 3 dimensions
  const topDimensions = [...scores]
    .sort((a, b) => b.percentile - a.percentile)
    .slice(0, 3);

  const dimensionLabels: Record<string, string> = {
    openness: "Openness",
    conscientiousness: "Conscientiousness",
    extraversion: "Extraversion",
    agreeableness: "Agreeableness",
    emotionalResilience: "Resilience",
    honestyHumility: "Integrity",
    adaptability: "Adaptability",
  };

  const handleExport = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    try {
      // Dynamic import of html2canvas
      const html2canvas = (await import("html2canvas")).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `prism7-${archetype.id}-results.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Export failed:", error);
    }
    setIsExporting(false);
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/results/${sessionId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/results/${sessionId}`;
    const text = `I'm ${archetype.name}! ${archetype.tagline}. Take the PRISM-7 personality test to discover your type.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userName} PRISM-7 Results`,
          text,
          url,
        });
      } catch (error) {
        // User cancelled or error
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className={className}>
      {/* The Shareable Card */}
      <div
        ref={cardRef}
        className="w-[400px] mx-auto rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        }}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-primary/80 uppercase tracking-wider">
              PRISM-7 Results
            </span>
            <Badge 
              variant="outline" 
              className="text-[10px] border-primary/30 text-primary/80"
            >
              {archetype.rarity}% of population
            </Badge>
          </div>
          
          {/* Archetype */}
          <div className="flex items-center gap-4">
            <span className="text-5xl">{archetype.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {archetype.name}
              </h2>
              <p className="text-sm text-gray-400">
                {archetype.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Mini Radar Chart */}
        <div className="px-4 h-[180px]">
          <PersonalityRadarChart scores={scores} />
        </div>

        {/* Top Strengths */}
        <div className="px-6 py-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Top Dimensions
          </p>
          <div className="space-y-2">
            {topDimensions.map((dim, index) => (
              <div key={dim.dimension} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">
                      {dimensionLabels[dim.dimension]}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {dim.percentile}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.percentile}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Discover your type at
              </p>
              <p className="text-sm font-semibold text-primary">
                prism7.app
              </p>
            </div>
            <div className="flex items-center gap-1">
              {archetype.strengths.slice(0, 2).map((strength, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-[9px] border-green-500/30 text-green-400 px-1.5 py-0"
                >
                  {getStrengthTitle(strength).split(" ").slice(0, 2).join(" ")}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          {isExporting ? "Exporting..." : "Download"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Link
            </>
          )}
        </Button>
        <Button
          size="sm"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>
    </div>
  );
}

export default EnhancedShareableCard;

