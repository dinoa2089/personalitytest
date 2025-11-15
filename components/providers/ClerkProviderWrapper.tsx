"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // If Clerk is not configured, render children directly without ClerkProvider
  if (!clerkKey || clerkKey === "" || clerkKey === "placeholder-key") {
    return <>{children}</>;
  }
  
  // Clerk IS configured - wrap with ClerkProvider
  return <ClerkProvider>{children}</ClerkProvider>;
}
