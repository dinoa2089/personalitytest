"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

export function ClerkAuthContent() {
  const { isSignedIn, isLoaded } = useUser();
  
  // Don't render until Clerk is loaded (prevents hydration issues)
  if (!isLoaded) {
    return null;
  }
  
  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }
  
  return (
    <SignInButton mode="modal">
      <button className="text-sm font-medium transition-colors hover:text-primary">
        Sign In
      </button>
    </SignInButton>
  );
}

