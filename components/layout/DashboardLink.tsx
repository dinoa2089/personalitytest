"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { useClerkWrapper } from "@/components/providers/ClerkProviderWrapper";
import dynamic from "next/dynamic";

interface DashboardLinkProps {
  mobile?: boolean;
  onClose?: () => void;
}

// Dynamically import the Clerk-dependent component
const DashboardLinkClerkContent = dynamic(
  () => import("./DashboardLinkClerkContent").then(mod => mod.DashboardLinkClerkContent),
  { 
    ssr: false,
    loading: () => null
  }
);

export function DashboardLink(props: DashboardLinkProps) {
  const { isConfigured } = useClerkWrapper();
  
  // Only render when Clerk is configured
  if (!isConfigured) {
    return null;
  }
  
  return <DashboardLinkClerkContent {...props} />;
}
