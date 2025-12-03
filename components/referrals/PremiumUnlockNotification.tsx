"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Crown } from "lucide-react";
import Link from "next/link";
import { hasPremiumUnlock } from "@/lib/subscriptions";

export function PremiumUnlockNotification() {
  const { user, isLoaded } = useUser();
  const [showNotification, setShowNotification] = useState(false);
  const [unlockMethod, setUnlockMethod] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const checkUnlock = async () => {
      const unlock = await hasPremiumUnlock(user.id);
      
      if (unlock.hasUnlock && unlock.method === "referral") {
        // Check if we've shown this notification before (using localStorage)
        const notificationKey = `premium-unlock-notification-${user.id}`;
        const hasShown = localStorage.getItem(notificationKey);
        
        if (!hasShown) {
          setUnlockMethod(unlock.method);
          setShowNotification(true);
          localStorage.setItem(notificationKey, "true");
        }
      }
      
      setHasChecked(true);
    };

    checkUnlock();

    // Listen for unlock events from ReferralDashboard
    const handleUnlockEvent = () => {
      checkUnlock();
    };
    
    window.addEventListener('premium-unlocked', handleUnlockEvent);
    return () => window.removeEventListener('premium-unlocked', handleUnlockEvent);
  }, [user?.id, isLoaded]);

  if (!showNotification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-50 max-w-md"
      >
        <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                <Crown className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    Full Results Unlocked!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Congratulations! Your friends completed the assessment, so you now have 
                    full access to your complete personality profile, all career matches, 
                    framework mappings, and more!
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <Link href="/dashboard">View My Results</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNotification(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
