"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUser, SignIn, SignUp } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";

/**
 * Auth gate page for viewing results
 * This page is shown when:
 * 1. User completed the full assessment but isn't logged in
 * 2. User was redirected here from old flow
 * 
 * With the new progressive flow, users hit the auth gate after PRISM stage
 * at /assessment/stage-complete/[sessionId] instead.
 */
export default function AssessmentCompletePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const { user, isLoaded } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Initialize auth mode from URL search params
  const urlMode = searchParams.get("mode");
  const initialMode = urlMode === "sign-in" || urlMode === "sign-up" ? urlMode : "choice";
  const [authMode, setAuthMode] = useState<"choice" | "sign-in" | "sign-up">(initialMode);

  // Update auth mode if URL changes
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "sign-in" || mode === "sign-up") {
      setAuthMode(mode);
    }
  }, [searchParams]);

  // Store session ID for post-auth redirect
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("pending-results-session", sessionId);
    }
  }, [sessionId]);

  // If user is already signed in, redirect to results
  useEffect(() => {
    if (isLoaded && user) {
      setIsRedirecting(true);
      // Small delay for smooth transition
      setTimeout(() => {
        router.push(`/results/${sessionId}`);
      }, 500);
    }
  }, [isLoaded, user, sessionId, router]);

  if (!isLoaded || isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-slate-300 text-lg">Preparing your results...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/5 to-transparent rounded-full" />
      </div>

      <Container className="relative py-12 md:py-20">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {authMode === "choice" && (
              <motion.div
                key="choice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Success indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>

                {/* Header */}
                <div className="text-center space-y-3">
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold text-white"
                  >
                    Assessment Complete!
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-400 text-lg"
                  >
                    Your personalized results are ready. Create a free account to unlock them.
                  </motion.p>
                </div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
                >
                  <h3 className="text-white font-semibold mb-4">With your free account:</h3>
                  <ul className="space-y-3">
                    {[
                      "View your complete personality profile",
                      "Save your results forever",
                      "Compare yourself to others",
                      "Access detailed insights & analysis",
                    ].map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center gap-3 text-slate-300"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        </div>
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Auth buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={() => setAuthMode("sign-up")}
                    className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Free Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAuthMode("sign-in")}
                    className="w-full h-12 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Already have an account? Sign in
                  </Button>
                </motion.div>

                {/* Privacy note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center text-sm text-slate-500"
                >
                  Your results are encrypted and stored securely. We never share your data.
                </motion.p>
              </motion.div>
            )}

            {authMode === "sign-up" && (
              <motion.div
                key="sign-up"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Button
                  variant="ghost"
                  onClick={() => setAuthMode("choice")}
                  className="text-slate-400 hover:text-white"
                >
                  ← Back
                </Button>
                <div className="flex justify-center">
                  <SignUp
                    appearance={{
                      elements: {
                        rootBox: "mx-auto",
                        card: "bg-slate-800/80 backdrop-blur-sm border-slate-700",
                        headerTitle: "text-white",
                        headerSubtitle: "text-slate-400",
                        socialButtonsBlockButton: "bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                        formFieldLabel: "text-slate-300",
                        formFieldInput: "bg-slate-700 border-slate-600 text-white",
                        footerActionLink: "text-emerald-400 hover:text-emerald-300",
                        formButtonPrimary: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
                      },
                    }}
                    fallbackRedirectUrl={`/results/${sessionId}`}
                    signInUrl={`/assessment/complete/${sessionId}?mode=sign-in`}
                  />
                </div>
              </motion.div>
            )}

            {authMode === "sign-in" && (
              <motion.div
                key="sign-in"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Button
                  variant="ghost"
                  onClick={() => setAuthMode("choice")}
                  className="text-slate-400 hover:text-white"
                >
                  ← Back
                </Button>
                <div className="flex justify-center">
                  <SignIn
                    appearance={{
                      elements: {
                        rootBox: "mx-auto",
                        card: "bg-slate-800/80 backdrop-blur-sm border-slate-700",
                        headerTitle: "text-white",
                        headerSubtitle: "text-slate-400",
                        socialButtonsBlockButton: "bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                        formFieldLabel: "text-slate-300",
                        formFieldInput: "bg-slate-700 border-slate-600 text-white",
                        footerActionLink: "text-emerald-400 hover:text-emerald-300",
                        formButtonPrimary: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
                      },
                    }}
                    fallbackRedirectUrl={`/results/${sessionId}`}
                    signUpUrl={`/assessment/complete/${sessionId}?mode=sign-up`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
