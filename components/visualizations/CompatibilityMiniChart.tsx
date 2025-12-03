"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Briefcase, Sparkles } from "lucide-react";
import Link from "next/link";

interface CompatibilityScore {
  type: string;
  typeName: string;
  romantic: number;
  friendship: number;
  work: number;
  typeUrl: string;
}

interface CompatibilityMiniChartProps {
  currentType: string;
  compatibilities: CompatibilityScore[];
  showTitle?: boolean;
  className?: string;
  framework?: "prism" | "mbti" | "enneagram";
}

const getScoreColor = (score: number): string => {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-emerald-500";
  if (score >= 55) return "bg-amber-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
};

const getScoreLabel = (score: number): string => {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Great";
  if (score >= 55) return "Good";
  if (score >= 40) return "Fair";
  return "Challenging";
};

export function CompatibilityMiniChart({
  currentType,
  compatibilities,
  showTitle = true,
  className = "",
  framework = "prism",
}: CompatibilityMiniChartProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  // Sort by overall compatibility (average of all scores)
  const sortedCompatibilities = [...compatibilities]
    .map(c => ({
      ...c,
      overall: Math.round((c.romantic + c.friendship + c.work) / 3),
    }))
    .sort((a, b) => b.overall - a.overall)
    .slice(0, 5); // Top 5

  const content = (
    <div ref={ref} className={className}>
      <div className="space-y-3">
        {sortedCompatibilities.map((compat, index) => (
          <motion.div
            key={compat.type}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Link href={compat.typeUrl} className="block group">
              <div className="rounded-xl border border-border/50 bg-muted/20 p-3 hover:bg-muted/40 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {compat.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {compat.typeName}
                    </span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getScoreColor(compat.overall)}`}>
                    {compat.overall}%
                  </div>
                </div>

                {/* Score bars */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Heart, score: compat.romantic, label: "Romance" },
                    { icon: Users, score: compat.friendship, label: "Friends" },
                    { icon: Briefcase, score: compat.work, label: "Work" },
                  ].map(({ icon: Icon, score, label }) => (
                    <div key={label} className="space-y-1">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Icon className="h-3 w-3" />
                        <span>{label}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${getScoreColor(score)}`}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${score}%` } : {}}
                          transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap justify-center gap-3 mt-4 text-[10px]"
      >
        {[
          { label: "Excellent", color: "bg-green-500" },
          { label: "Great", color: "bg-emerald-500" },
          { label: "Good", color: "bg-amber-500" },
          { label: "Fair", color: "bg-orange-500" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.9 }}
        className="mt-4 text-center"
      >
        <Link 
          href="/compare" 
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Sparkles className="h-3 w-3" />
          Compare with someone specific
        </Link>
      </motion.div>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <CardTitle className="text-lg">Best Matches for {currentType}</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Compatibility across romantic, friendship, and work relationships
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default CompatibilityMiniChart;



