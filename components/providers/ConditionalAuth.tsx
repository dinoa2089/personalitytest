"use client";

import { useClerkWrapper } from "@/components/providers/ClerkProviderWrapper";
import dynamic from "next/dynamic";

// Dynamically import the Clerk-dependent component
const ClerkAuthContent = dynamic(
  () => import("./ClerkAuthContent").then(mod => mod.ClerkAuthContent),
  { 
    ssr: false,
    loading: () => null // Show nothing while loading
  }
);

export function ConditionalAuth() {
  const { isConfigured } = useClerkWrapper();
  
  // Only render Clerk components when Clerk is actually configured
  if (!isConfigured) {
    return null;
  }
  
  return <ClerkAuthContent />;
}
