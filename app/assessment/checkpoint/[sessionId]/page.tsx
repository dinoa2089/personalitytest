"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * Legacy checkpoint page - redirects to new stage-complete page
 * This maintains backwards compatibility with any existing links
 */
export default function CheckpointPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  useEffect(() => {
    // Redirect to new stage completion page
    router.replace(`/assessment/stage-complete/${sessionId}`);
  }, [sessionId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground">Loading your results...</p>
      </div>
    </div>
  );
}
