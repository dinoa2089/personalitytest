"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp } from "lucide-react";

interface CareerSalary {
  title: string;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  fitScore?: number; // 0-100
}

interface SalaryRangeChartProps {
  careers: CareerSalary[];
  showTitle?: boolean;
  className?: string;
  maxSalary?: number;
}

const formatSalary = (salary: number): string => {
  if (salary >= 1000000) {
    return `$${(salary / 1000000).toFixed(1)}M`;
  }
  if (salary >= 1000) {
    return `$${Math.round(salary / 1000)}K`;
  }
  return `$${salary}`;
};

export function SalaryRangeChart({
  careers,
  showTitle = true,
  className = "",
  maxSalary: customMaxSalary,
}: SalaryRangeChartProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  // Calculate max salary for scale
  const maxSalary = customMaxSalary || Math.max(...careers.map(c => c.maxSalary)) * 1.1;

  // Sort by median salary descending
  const sortedCareers = [...careers].sort((a, b) => b.medianSalary - a.medianSalary);

  const content = (
    <div ref={ref} className={className}>
      <div className="space-y-4">
        {sortedCareers.map((career, index) => {
          const minPercent = (career.minSalary / maxSalary) * 100;
          const maxPercent = (career.maxSalary / maxSalary) * 100;
          const medianPercent = (career.medianSalary / maxSalary) * 100;
          const rangeWidth = maxPercent - minPercent;

          return (
            <motion.div
              key={career.title}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="space-y-2"
            >
              {/* Career title and fit score */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate flex-1">{career.title}</span>
                {career.fitScore !== undefined && (
                  <Badge 
                    variant="outline" 
                    className={`ml-2 text-xs ${
                      career.fitScore >= 80 ? "border-green-500/50 text-green-600 bg-green-500/10" :
                      career.fitScore >= 60 ? "border-amber-500/50 text-amber-600 bg-amber-500/10" :
                      "border-muted text-muted-foreground"
                    }`}
                  >
                    {career.fitScore}% fit
                  </Badge>
                )}
              </div>

              {/* Salary range bar */}
              <div className="relative h-8 bg-muted/30 rounded-lg overflow-hidden">
                {/* Range bar */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 h-4 rounded bg-gradient-to-r from-blue-500/40 via-blue-500/60 to-blue-500/40"
                  style={{ left: `${minPercent}%` }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${rangeWidth}%` } : {}}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                />

                {/* Median marker */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full shadow-md"
                  style={{ left: `${medianPercent}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                />

                {/* Salary labels */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-between px-2"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <span className="text-[10px] text-muted-foreground">
                    {formatSalary(career.minSalary)}
                  </span>
                  <span className="text-xs font-semibold text-primary bg-card/80 px-1.5 py-0.5 rounded">
                    {formatSalary(career.medianSalary)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatSalary(career.maxSalary)}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500/50" />
          <span>Salary range</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 rounded bg-primary" />
          <span>Median</span>
        </div>
      </motion.div>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Salary Ranges</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Expected compensation by career path (USD/year)
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default SalaryRangeChart;

