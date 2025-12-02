"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  X,
  Minus,
  Sparkles,
  Trophy,
  Scale,
} from "lucide-react";

interface ComparisonItem {
  category: string;
  mbti: {
    value: string;
    status: "bad" | "neutral" | "good";
    detail?: string;
  };
  prism: {
    value: string;
    status: "bad" | "neutral" | "good";
    detail?: string;
  };
}

const comparisonData: ComparisonItem[] = [
  {
    category: "Measurement Approach",
    mbti: {
      value: "16 rigid categories",
      status: "bad",
      detail: "Binary classification (E or I, not both)",
    },
    prism: {
      value: "7 continuous dimensions",
      status: "good",
      detail: "Percentile scores showing degree of each trait",
    },
  },
  {
    category: "Test-Retest Reliability",
    mbti: {
      value: "39-76%",
      status: "bad",
      detail: "High chance of getting different result",
    },
    prism: {
      value: "85-92%",
      status: "good",
      detail: "Consistent results over time",
    },
  },
  {
    category: "Confidence Intervals",
    mbti: {
      value: "Not provided",
      status: "bad",
      detail: "Results presented as definitive truth",
    },
    prism: {
      value: "90% CI included",
      status: "good",
      detail: "Shows measurement precision for each score",
    },
  },
  {
    category: "Scientific Validation",
    mbti: {
      value: "Limited independent research",
      status: "bad",
      detail: "Most studies from MBTI Foundation",
    },
    prism: {
      value: "Peer-reviewed studies",
      status: "good",
      detail: "Based on validated HEXACO+ framework",
    },
  },
  {
    category: "Number of Questions",
    mbti: {
      value: "93 questions",
      status: "neutral",
      detail: "Fixed-length assessment",
    },
    prism: {
      value: "35 or 125",
      status: "good",
      detail: "Quick (7 min) or Full (15 min) options",
    },
  },
  {
    category: "Barnum Effect Mitigation",
    mbti: {
      value: "Vague descriptions",
      status: "bad",
      detail: "Could apply to almost anyone",
    },
    prism: {
      value: "Specific percentiles",
      status: "good",
      detail: "Precise scores, not generic statements",
    },
  },
  {
    category: "Honesty-Humility Dimension",
    mbti: {
      value: "Not measured",
      status: "bad",
      detail: "Missing key ethical/integrity factor",
    },
    prism: {
      value: "Included",
      status: "good",
      detail: "Predicts workplace integrity, relationships",
    },
  },
];

const StatusIcon = ({ status }: { status: "bad" | "neutral" | "good" }) => {
  if (status === "good") {
    return (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </div>
    );
  }
  if (status === "bad") {
    return (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30">
        <X className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30">
      <Minus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
    </div>
  );
};

interface ComparisonPanelProps {
  showTitle?: boolean;
  className?: string;
  compact?: boolean;
}

export function ComparisonPanel({
  showTitle = true,
  className = "",
  compact = false,
}: ComparisonPanelProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const content = (
    <div ref={ref} className={className}>
      {/* VS Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center">
          <div className="flex items-center gap-6 px-6 bg-background">
            {/* MBTI Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/20"
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-semibold text-rose-600 dark:text-rose-400">MBTI</span>
            </motion.div>

            {/* VS */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-lg opacity-50" />
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-xl">
                <Scale className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            {/* PRISM-7 Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">PRISM-7</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="space-y-3">
        {comparisonData.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="group relative"
          >
            {/* Category Label */}
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 pl-1">
              {item.category}
            </div>

            {/* Comparison Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* MBTI Cell */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                  item.mbti.status === "bad"
                    ? "bg-gradient-to-br from-rose-500/5 to-orange-500/5 border border-rose-500/20 hover:border-rose-500/40"
                    : item.mbti.status === "neutral"
                    ? "bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-500/20 hover:border-amber-500/40"
                    : "bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 hover:border-emerald-500/40"
                }`}
              >
                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                  backgroundSize: '16px 16px'
                }} />
                
                <div className="relative flex items-start gap-3">
                  <StatusIcon status={item.mbti.status} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight">{item.mbti.value}</p>
                    {!compact && item.mbti.detail && (
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {item.mbti.detail}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* PRISM-7 Cell */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                  item.prism.status === "bad"
                    ? "bg-gradient-to-br from-rose-500/5 to-orange-500/5 border border-rose-500/20 hover:border-rose-500/40"
                    : item.prism.status === "neutral"
                    ? "bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-500/20 hover:border-amber-500/40"
                    : "bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 hover:border-emerald-500/40"
                }`}
              >
                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                  backgroundSize: '16px 16px'
                }} />

                <div className="relative flex items-start gap-3">
                  <StatusIcon status={item.prism.status} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight">{item.prism.value}</p>
                    {!compact && item.prism.detail && (
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {item.prism.detail}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Winner Summary */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="relative mt-8 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 rounded-2xl" />
          
          <div className="relative p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-lg bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                The Scientific Choice
              </span>
            </div>
            <p className="text-sm text-center text-muted-foreground max-w-xl mx-auto leading-relaxed">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">PRISM-7</span> addresses
              the fundamental scientific weaknesses that have led the academic
              community to criticize popular assessments like the MBTI.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );

  if (showTitle) {
    return (
      <Card className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 backdrop-blur-sm shadow-xl">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <CardHeader className="relative pb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20">
              <Scale className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">The Comparison</CardTitle>
              <CardDescription className="text-sm">
                Why science matters in personality assessment
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative pt-4">{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default ComparisonPanel;
