"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AssessmentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to intro page
    router.push("/assessment/intro");
  }, [router]);

  return null;
}

