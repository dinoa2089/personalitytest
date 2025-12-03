"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export const dynamic = 'force-dynamic';

// This layout redirects old /business/* routes to the unified /for-employers dashboard
// with appropriate tab query params

const routeToTabMap: Record<string, string> = {
  "/business/dashboard": "overview",
  "/business/jobs/new": "jobs",
  "/business/teams": "teams",
  "/business/settings": "settings",
  "/business/setup": "", // Setup is handled within the dashboard
};

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if this is one of the main routes we want to redirect
    const tab = routeToTabMap[pathname];
    
    if (tab !== undefined) {
      // Redirect to the unified employer dashboard
      if (tab) {
        router.replace(`/for-employers?tab=${tab}`);
      } else {
        router.replace("/for-employers");
      }
    }
    // For specific job/team pages (e.g., /business/jobs/[id]), we'll keep them for now
    // as they need deep-linking support
  }, [pathname, router]);

  // For routes that aren't redirected (deep links like /business/jobs/[id]/applicants),
  // render the children
  return <>{children}</>;
}
