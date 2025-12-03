"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Sparkles, 
  Check,
  ArrowRight,
  Gift
} from "lucide-react";
import type { Archetype } from "@/lib/archetypes";
import { toast } from "react-hot-toast";

interface PersonalizedEmailCaptureProps {
  archetype: Archetype;
}

export function PersonalizedEmailCapture({ archetype }: PersonalizedEmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const typeName = archetype.name.replace("The ", "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call - in production, connect to your email service
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      toast.success("You're subscribed! Check your inbox.");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "7-day personalized growth challenge",
    "Weekly tips tailored to your type",
    "Exclusive content for your archetype",
  ];

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-teal-950/20 overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 mx-auto mb-4">
              <Check className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You're All Set!</h3>
            <p className="text-zinc-400">
              Check your inbox for your first {typeName} growth tip.
              Your 7-day challenge starts now!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.95 }}
    >
      <Card className="rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-blue-950/20 overflow-hidden relative">
        {/* Decorative gradient */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <CardContent className="p-6 md:p-8 relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex-shrink-0">
              <Mail className="h-8 w-8 text-cyan-400" />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  <Gift className="h-3 w-3 mr-1" />
                  Free
                </Badge>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Get Your {typeName} Growth Guide
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Receive 7 days of personalized tips designed specifically for {archetype.name} personalities.
                Plus weekly insights to help you grow.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap gap-3 mb-4 justify-center md:justify-start">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-1.5 text-xs text-cyan-300"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-zinc-900/50 border-cyan-500/30 focus:border-cyan-500 text-white placeholder:text-zinc-500"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    "Subscribing..."
                  ) : (
                    <>
                      Start My 7-Day Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-zinc-500 mt-3 text-center md:text-left">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}



