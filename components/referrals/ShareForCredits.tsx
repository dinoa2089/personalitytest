"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Copy, Check, Share2, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface ShareForCreditsProps {
  productName?: string;
  className?: string;
}

export function ShareForCredits({ productName, className }: ShareForCreditsProps) {
  const [referralLink, setReferralLink] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referrals/code")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setReferralLink(data.link);
          setReferralCode(data.code);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const copyLink = async () => {
    if (!referralLink) return;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `I just discovered my personality type! 🧠✨ Take this free assessment and see how we compare: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(
      `Just unlocked my full personality profile! 🧠✨ Take the free assessment: ${referralLink}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Personality Assessment",
          text: "Discover your authentic self with this personality assessment!",
          url: referralLink,
        });
      } catch {
        // User cancelled or share failed - fallback to copy
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`border-2 border-dashed border-green-500/30 bg-gradient-to-br from-green-950/10 to-emerald-950/10 ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 rounded-full bg-green-500/20">
            <Gift className="h-4 w-4 text-green-500" />
          </div>
          Want $1.50 Back?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Share your referral link. When a friend completes their assessment, you&apos;ll
          receive{" "}
          <span className="font-bold text-green-500">$1.50 in credits</span> toward
          your next purchase.
        </p>

        <div className="flex gap-2">
          <Input
            value={referralLink}
            readOnly
            className="font-mono text-sm bg-background"
            placeholder="Loading..."
          />
          <Button
            variant="outline"
            size="icon"
            onClick={copyLink}
            disabled={!referralLink}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={shareToWhatsApp}
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
            disabled={!referralLink}
          >
            <MessageCircle className="h-4 w-4 mr-1.5" />
            WhatsApp
          </Button>
          <Button
            onClick={shareToTwitter}
            variant="outline"
            className="border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/10"
            disabled={!referralLink}
          >
            <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </Button>
          <Button
            onClick={shareNative}
            variant="outline"
            disabled={!referralLink}
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-1">
          No limit on referrals — share with everyone! 🎉
        </p>
      </CardContent>
    </Card>
  );
}

