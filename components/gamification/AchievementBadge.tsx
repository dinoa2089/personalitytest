"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number; // 0-100 for progress towards unlocking
  category: "assessment" | "progress" | "social" | "premium";
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
}

export function AchievementBadge({ 
  achievement, 
  size = "md",
  showProgress = false 
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: "text-xs p-2",
    md: "text-sm p-3",
    lg: "text-base p-4",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative rounded-lg border bg-card ${sizeClasses[size]} ${
        achievement.unlocked 
          ? "border-primary/50 shadow-md" 
          : "border-muted opacity-60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`text-2xl ${achievement.unlocked ? "" : "grayscale"}`}>
          {achievement.unlocked ? achievement.icon : "🔒"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold ${achievement.unlocked ? "" : "text-muted-foreground"}`}>
              {achievement.name}
            </h4>
            {achievement.unlocked && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </div>
          <p className={`text-xs ${achievement.unlocked ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
            {achievement.description}
          </p>
          {showProgress && achievement.progress !== undefined && !achievement.unlocked && (
            <div className="mt-2">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(achievement.progress)}% complete
              </p>
            </div>
          )}
        </div>
      </div>
      {achievement.unlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="h-4 w-4 text-yellow-400" />
        </motion.div>
      )}
    </motion.div>
  );
}
