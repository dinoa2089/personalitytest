"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  AlertTriangle,
  Minus,
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
    return <Check className="w-5 h-5 text-green-500" />;
  }
  if (status === "bad") {
    return <X className="w-5 h-5 text-red-500" />;
  }
  return <Minus className="w-5 h-5 text-amber-500" />;
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
      {/* Headers */}
      <div className="grid grid-cols-[1fr,1fr,1fr] gap-4 mb-4">
        <div className="text-sm font-semibold text-muted-foreground">
          Category
        </div>
        <div className="text-center">
          <Badge variant="outline" className="border-red-500/30 text-red-600">
            <AlertTriangle className="w-3 h-3 mr-1" />
            MBTI
          </Badge>
        </div>
        <div className="text-center">
          <Badge variant="outline" className="border-green-500/30 text-green-600">
            <Check className="w-3 h-3 mr-1" />
            PRISM-7
          </Badge>
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="space-y-2">
        {comparisonData.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="grid grid-cols-[1fr,1fr,1fr] gap-4 items-start py-3 border-b border-border/30 last:border-0"
          >
            {/* Category */}
            <div className="text-sm font-medium text-foreground">
              {item.category}
            </div>

            {/* MBTI */}
            <div
              className={`rounded-lg p-3 ${
                item.mbti.status === "bad"
                  ? "bg-red-500/5 border border-red-500/20"
                  : item.mbti.status === "neutral"
                  ? "bg-amber-500/5 border border-amber-500/20"
                  : "bg-green-500/5 border border-green-500/20"
              }`}
            >
              <div className="flex items-start gap-2">
                <StatusIcon status={item.mbti.status} />
                <div>
                  <p className="text-sm font-medium">{item.mbti.value}</p>
                  {!compact && item.mbti.detail && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.mbti.detail}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* PRISM-7 */}
            <div
              className={`rounded-lg p-3 ${
                item.prism.status === "bad"
                  ? "bg-red-500/5 border border-red-500/20"
                  : item.prism.status === "neutral"
                  ? "bg-amber-500/5 border border-amber-500/20"
                  : "bg-green-500/5 border border-green-500/20"
              }`}
            >
              <div className="flex items-start gap-2">
                <StatusIcon status={item.prism.status} />
                <div>
                  <p className="text-sm font-medium">{item.prism.value}</p>
                  {!compact && item.prism.detail && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.prism.detail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-primary/10 border border-green-500/20"
        >
          <p className="text-sm text-center">
            <span className="font-semibold text-green-600">PRISM-7</span> addresses
            the fundamental scientific weaknesses that have led the academic
            community to criticize popular assessments like the MBTI.
          </p>
        </motion.div>
      )}
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">MBTI vs PRISM-7</CardTitle>
          <CardDescription>
            A scientific comparison of personality assessment approaches
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default ComparisonPanel;

