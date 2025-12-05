"use client";

import { ReactNode, createContext, useContext } from "react";
import { ClerkProvider } from "@clerk/nextjs";

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

// Create a context for when Clerk is not configured
interface MockClerkContextValue {
  isConfigured: false;
}

interface ClerkContextValue {
  isConfigured: true;
}

type ClerkWrapperContextValue = MockClerkContextValue | ClerkContextValue;

const ClerkWrapperContext = createContext<ClerkWrapperContextValue>({ isConfigured: false });

// Hook to access Clerk configuration state
export const useClerkWrapper = () => {
  return useContext(ClerkWrapperContext);
};

/**
 * A wrapper component that only renders children when Clerk is configured.
 * Use this to wrap components that use Clerk hooks (useUser, etc.) to prevent
 * errors when Clerk is not set up.
 */
export function WithClerk({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const { isConfigured } = useClerkWrapper();
  
  if (!isConfigured) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // If Clerk is not configured, render children with mock context
  if (!clerkKey || clerkKey === "" || clerkKey === "placeholder-key") {
    return (
      <ClerkWrapperContext.Provider value={{ isConfigured: false }}>
        {children}
      </ClerkWrapperContext.Provider>
    );
  }
  
  // Clerk IS configured - wrap with ClerkProvider
  return (
    <ClerkWrapperContext.Provider value={{ isConfigured: true }}>
      <ClerkProvider>{children}</ClerkProvider>
    </ClerkWrapperContext.Provider>
  );
}
