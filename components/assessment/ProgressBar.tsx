"use client";

import { motion } from "framer-motion";
import { useAssessmentStore } from "@/store/assessment-store";

export function ProgressBar() {
  const { progress } = useAssessmentStore();

  // Round to 1 decimal place for display
  const displayProgress = Math.round(progress * 10) / 10;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">{displayProgress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

