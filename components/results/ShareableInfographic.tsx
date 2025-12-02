"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Twitter, 
  Linkedin,
  Instagram,
  LayoutGrid,
  Smartphone,
  Monitor
} from "lucide-react";
import type { Archetype } from "@/lib/archetypes";
import type { DimensionScore } from "@/types";
import html2canvas from "html2canvas";

interface ShareableInfographicProps {
  archetype: Archetype;
  scores: DimensionScore[];
  sessionId: string;
}

type FormatType = 'square' | 'story' | 'banner';

const formatConfig = {
  square: { width: 400, height: 400, label: 'Square', icon: LayoutGrid, description: 'Instagram Feed' },
  story: { width: 270, height: 480, label: 'Story', icon: Smartphone, description: 'Instagram/TikTok Stories' },
  banner: { width: 480, height: 270, label: 'Banner', icon: Monitor, description: 'Twitter/LinkedIn' },
};

export function ShareableInfographic({ archetype, scores, sessionId }: ShareableInfographicProps) {
  const [selectedFormat, setSelectedFormat] = useState<FormatType>('square');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const topScores = [...scores]
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

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/results/${sessionId}`;
  const shareText = `I'm ${archetype.name}! 🎯 Only ${archetype.rarity}% of people share my personality type. Discover yours:`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `personality-${archetype.id}-${selectedFormat}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
    setDownloading(false);
  };

  const handleShare = async (platform: 'twitter' | 'linkedin') => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const format = formatConfig[selectedFormat];

  return (
    <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 text-white">
            <Share2 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Share Your Results</CardTitle>
            <CardDescription>
              Download or share your personality type with friends
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Format Selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(formatConfig) as FormatType[]).map((format) => {
            const config = formatConfig[format];
            const Icon = config.icon;
            return (
              <Button
                key={format}
                variant={selectedFormat === format ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFormat(format)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {config.label}
              </Button>
            );
          })}
        </div>

        {/* Preview Card */}
        <div className="flex justify-center">
          <div 
            className="relative overflow-hidden rounded-xl shadow-2xl"
            style={{ 
              width: format.width, 
              height: format.height,
            }}
          >
            {/* Downloadable Card */}
            <div 
              ref={cardRef}
              className={`absolute inset-0 bg-gradient-to-br ${archetype.color} p-6 flex flex-col justify-between`}
              style={{ 
                width: format.width, 
                height: format.height,
              }}
            >
              {/* Top Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{archetype.icon}</span>
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">
                    {archetype.rarity}% of people
                  </Badge>
                </div>
                <h2 className="text-white text-2xl font-bold leading-tight">
                  {archetype.name}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {archetype.tagline}
                </p>
              </div>

              {/* Middle Section - Top Traits */}
              {selectedFormat !== 'story' && (
                <div className="space-y-2">
                  {topScores.slice(0, selectedFormat === 'banner' ? 2 : 3).map((score, index) => (
                    <div key={score.dimension} className="flex items-center gap-2">
                      <div className="text-white/80 text-xs w-20 truncate">
                        {dimensionLabels[score.dimension]}
                      </div>
                      <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full"
                          style={{ width: `${score.percentile}%` }}
                        />
                      </div>
                      <div className="text-white text-xs font-bold w-8 text-right">
                        {score.percentile}%
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Story format - vertical layout */}
              {selectedFormat === 'story' && (
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  {topScores.map((score) => (
                    <div key={score.dimension} className="text-center">
                      <div className="text-white text-3xl font-bold">{score.percentile}%</div>
                      <div className="text-white/80 text-xs">
                        {dimensionLabels[score.dimension]}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Section */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/60 text-[10px]">
                    Discover your type at
                  </p>
                  <p className="text-white text-xs font-semibold">
                    prism7.app
                  </p>
                </div>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <div className="text-xs font-bold text-gray-800 text-center leading-tight">
                    PRISM<br/>7
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {format.description}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            onClick={handleDownload} 
            disabled={downloading}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {downloading ? 'Saving...' : 'Download'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCopyLink}
            className="gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleShare('twitter')}
            className="gap-2"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleShare('linkedin')}
            className="gap-2"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
        </div>

        {/* Viral Message */}
        <div className="text-center text-sm text-muted-foreground">
          Share your results and challenge friends to discover their type! 🎯
        </div>
      </CardContent>
    </Card>
  );
}

