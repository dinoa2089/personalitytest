"use client";

import Link from "next/link";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { ConditionalAuth } from "@/components/providers/ConditionalAuth";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:via-purple-500 group-hover:to-pink-500 transition-all">
              PRISM-7
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/assessment"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Take Assessment
            </Link>
            <Link
              href="/science"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Science
            </Link>
            <ConditionalAuth />
          </nav>
        </div>
      </div>
    </header>
  );
}

