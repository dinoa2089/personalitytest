"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";

interface DashboardLinkClerkContentProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function DashboardLinkClerkContent({ mobile, onClose }: DashboardLinkClerkContentProps) {
  const { isSignedIn } = useUser();

  if (!isSignedIn) return null;

  if (mobile) {
    return (
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
        onClick={onClose}
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
    >
      <LayoutDashboard className="h-4 w-4" />
      Dashboard
    </Link>
  );
}

