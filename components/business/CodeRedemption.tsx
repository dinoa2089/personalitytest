"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Ticket, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  ArrowRight,
  Building2
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { redeemAssessmentCode } from "@/lib/assessment-codes";
import Link from "next/link";

interface CodeRedemptionProps {
  onSuccess?: (features: string[]) => void;
}

export function CodeRedemption({ onSuccess }: CodeRedemptionProps) {
  const { user } = useUser();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
    organizationName?: string;
    features?: string[];
  } | null>(null);

  const formatCodeInput = (value: string) => {
    // Remove non-alphanumeric characters and uppercase
    const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Add dashes every 4 characters
    const parts = [];
    for (let i = 0; i < clean.length && i < 12; i += 4) {
      parts.push(clean.slice(i, i + 4));
    }
    return parts.join('-');
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(formatCodeInput(e.target.value));
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setResult({ success: false, error: "Please sign in to redeem a code." });
      return;
    }

    if (code.replace(/-/g, '').length !== 12) {
      setResult({ success: false, error: "Please enter a valid 12-character code." });
      return;
    }

    setLoading(true);
    try {
      const redemptionResult = await redeemAssessmentCode(code, user.id);
      setResult(redemptionResult);
      
      if (redemptionResult.success && onSuccess) {
        onSuccess(redemptionResult.features || []);
      }
    } catch (error) {
      setResult({ success: false, error: "Failed to redeem code. Please try again." });
    }
    setLoading(false);
  };

  return (
    <Card className="rounded-2xl border border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Have an Assessment Code?</CardTitle>
            <CardDescription>
              Enter your code to unlock Premium Report features
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {result?.success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-green-700 mb-2">Code Redeemed!</h3>
              {result.organizationName && (
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Provided by {result.organizationName}
                  </span>
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-4">
                You now have access to Premium Report features!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {result.features?.map((feature) => (
                  <Badge key={feature} variant="outline" className="bg-green-500/10">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {feature.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
              <Button asChild>
                <Link href="/assessment/intro">
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="XXXX-XXXX-XXXX"
                  value={code}
                  onChange={handleCodeChange}
                  className="text-center text-lg font-mono tracking-wider uppercase"
                  maxLength={14} // 12 chars + 2 dashes
                />
              </div>
              {result?.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-600"
                >
                  <XCircle className="h-4 w-4" />
                  {result.error}
                </motion.div>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || code.replace(/-/g, '').length !== 12}
            >
              {loading ? "Verifying..." : "Redeem Code"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Assessment codes are provided by employers or purchased in bulk.
              <br />
              <Link href="/pricing" className="text-primary hover:underline">
                Learn more about team pricing →
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

