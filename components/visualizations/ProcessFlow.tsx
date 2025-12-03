"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList,
  Brain,
  BarChart3,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface Step {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  highlight?: string;
}

const steps: Step[] = [
  {
    icon: ClipboardList,
    title: "Answer Questions",
    subtitle: "35-105 questions",
    description: "Choose quick (35 questions) or comprehensive (105 questions) assessment",
    color: "#8B5CF6", // Purple
    highlight: "8-25 min",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    subtitle: "Pattern recognition",
    description: "Advanced algorithms identify your unique personality patterns across dimensions",
    color: "#3B82F6", // Blue
    highlight: "Instant",
  },
  {
    icon: BarChart3,
    title: "7 Dimensions",
    subtitle: "Percentile scores + CI",
    description: "Get precise scores with confidence intervals showing measurement accuracy",
    color: "#10B981", // Green
    highlight: "90% CI",
  },
  {
    icon: Sparkles,
    title: "Your Type",
    subtitle: "1 of 12 archetypes",
    description: "Discover your personality archetype with strengths, growth areas, and insights",
    color: "#F59E0B", // Amber
    highlight: "Personalized",
  },
];

interface ProcessFlowProps {
  showTitle?: boolean;
  className?: string;
  variant?: "horizontal" | "vertical";
}

export function ProcessFlow({
  showTitle = true,
  className = "",
  variant = "horizontal",
}: ProcessFlowProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const isHorizontal = variant === "horizontal";

  const content = (
    <div
      ref={ref}
      className={`${className} ${
        isHorizontal
          ? "flex flex-col md:flex-row items-stretch gap-4 md:gap-2"
          : "flex flex-col gap-4"
      }`}
    >
      {steps.map((step, index) => (
        <div
          key={step.title}
          className={`flex ${
            isHorizontal
              ? "flex-col md:flex-row items-center flex-1"
              : "flex-row items-start"
          } gap-3`}
        >
          {/* Step Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className={`relative flex-1 ${
              isHorizontal ? "w-full" : "flex-1"
            }`}
          >
            <div
              className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 h-full
                         hover:border-primary/30 hover:shadow-lg transition-all duration-300
                         group"
            >
              {/* Step number badge */}
              <div
                className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center
                           text-xs font-bold text-white shadow-md"
                style={{ backgroundColor: step.color }}
              >
                {index + 1}
              </div>

              {/* Highlight badge */}
              {step.highlight && (
                <div
                  className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold
                             text-white shadow-sm"
                  style={{ backgroundColor: step.color }}
                >
                  {step.highlight}
                </div>
              )}

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3
                           transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${step.color}15` }}
              >
                <step.icon
                  className="w-6 h-6"
                  style={{ color: step.color }}
                />
              </div>

              {/* Content */}
              <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground font-medium mb-2">
                {step.subtitle}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>

          {/* Arrow connector (not after last step) */}
          {index < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.3 }}
              className={`flex items-center justify-center ${
                isHorizontal
                  ? "hidden md:flex w-8"
                  : "w-full justify-start pl-6"
              }`}
            >
              <ArrowRight
                className={`w-5 h-5 text-muted-foreground/50 ${
                  isHorizontal ? "" : "rotate-90"
                }`}
              />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );

  // Summary stats below the flow
  const summaryStats = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.6 }}
      className="mt-6 flex flex-wrap justify-center gap-6"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4 text-primary" />
        <span>8-25 minutes total</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span>No signup required</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>Free instant results</span>
      </div>
    </motion.div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">How It Works</CardTitle>
          <CardDescription>
            From questions to personalized insights in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {content}
          {summaryStats}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {content}
      {summaryStats}
    </>
  );
}

export default ProcessFlow;

