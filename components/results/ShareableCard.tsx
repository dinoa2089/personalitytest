"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Copy } from "lucide-react";
import { toast } from "react-hot-toast";
// Dynamic import for html2canvas to reduce bundle size
import type { AssessmentResult } from "@/types";

// Helper function to get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

interface ShareableCardProps {
  result: AssessmentResult;
  sessionId: string;
}

export function ShareableCard({ result, sessionId }: ShareableCardProps) {
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Generate shareable image
  const generateImage = async () => {
    if (!cardRef) return;

    try {
      // Dynamic import to reduce bundle size
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      setImageUrl(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate shareable image");
    }
  };

  useEffect(() => {
    // Generate image after a delay to ensure DOM is fully rendered
    if (!cardRef) return;
    
    const timer = setTimeout(async () => {
      try {
        // Dynamic import to reduce bundle size
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(cardRef, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          logging: false, // Disable console logging
        });
        const dataUrl = canvas.toDataURL("image/png");
        setImageUrl(dataUrl);
      } catch (error) {
        console.warn("Could not generate shareable image:", error);
        // Don't show error toast on initial load - only on user action
      }
    }, 1500); // Wait 1.5 seconds for styles to apply
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardRef]);

  const downloadImage = async () => {
    if (!imageUrl) {
      await generateImage();
      return;
    }

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `personality-profile-${sessionId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  const copyImage = async () => {
    if (!imageUrl) {
      await generateImage();
      return;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      toast.success("Image copied to clipboard!");
    } catch (error) {
      console.error("Error copying image:", error);
      toast.error("Failed to copy image");
    }
  };

  const shareNative = async () => {
    if (!imageUrl) {
      await generateImage();
      return;
    }

    if (navigator.share) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `personality-profile-${sessionId}.png`, {
          type: "image/png",
        });

        await navigator.share({
          title: "My Personality Profile - PRISM-7",
          text: "Check out my personality assessment results!",
          files: [file],
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
          toast.error("Failed to share");
        }
      }
    } else {
      copyImage();
    }
  };

  // Get top 3 dimensions
  const topDimensions = [...result.dimensional_scores]
    .sort((a, b) => b.percentile - a.percentile)
    .slice(0, 3);

  const dimensionNames: Record<string, string> = {
    openness: "Openness",
    conscientiousness: "Conscientiousness",
    extraversion: "Extraversion",
    agreeableness: "Agreeableness",
    emotionalResilience: "Emotional Resilience",
    honestyHumility: "Honesty-Humility",
    adaptability: "Adaptability",
  };

  return (
    <div className="space-y-4">
      <div
        ref={setCardRef}
        className="bg-gradient-to-br from-primary/10 via-background to-primary/5 rounded-lg border-2 border-primary/20 p-8 max-w-md mx-auto"
        style={{ aspectRatio: "4/5" }}
      >
        <div className="text-center space-y-4 h-full flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">My Personality Profile</h2>
            <p className="text-sm text-muted-foreground mb-6">PRISM-7 Assessment</p>
          </div>

          <div className="space-y-3">
            {topDimensions.map((dim, index) => (
              <div key={dim.dimension} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {dimensionNames[dim.dimension] || dim.dimension}
                  </span>
                  <span className="text-primary font-bold">
                    {Math.round(dim.percentile)}{getOrdinalSuffix(Math.round(dim.percentile))} percentile
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.percentile}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary to-primary/70"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Discover your authentic self at prism7test.com
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={downloadImage} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button onClick={copyImage} variant="outline" size="sm">
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button onClick={shareNative} variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}

