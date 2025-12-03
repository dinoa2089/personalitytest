"use client";

import { motion } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { Container } from "@/components/layout/Container";
import { DimensionProgress } from "./DimensionProgress";
import { useAssessmentStore } from "@/store/assessment-store";
import type { Question, Dimension } from "@/types";
import {
  Lightbulb,
  ListChecks,
  Users,
  Heart,
  Shield,
  Scale,
  Shuffle,
} from "lucide-react";

interface QuestionContainerProps {
  question: Question;
  questionIndex: number;
  children: React.ReactNode;
}

// Dimension theme configuration
const dimensionThemes: Record<
  Dimension,
  {
    gradient: string;
    border: string;
    icon: React.ElementType;
    iconColor: string;
    label: string;
    bgAccent: string;
  }
> = {
  openness: {
    gradient: "from-violet-500/10 via-transparent to-purple-500/5",
    border: "border-violet-500/30",
    icon: Lightbulb,
    iconColor: "text-violet-500",
    label: "Openness",
    bgAccent: "bg-violet-500/5",
  },
  conscientiousness: {
    gradient: "from-blue-500/10 via-transparent to-cyan-500/5",
    border: "border-blue-500/30",
    icon: ListChecks,
    iconColor: "text-blue-500",
    label: "Conscientiousness",
    bgAccent: "bg-blue-500/5",
  },
  extraversion: {
    gradient: "from-orange-500/10 via-transparent to-amber-500/5",
    border: "border-orange-500/30",
    icon: Users,
    iconColor: "text-orange-500",
    label: "Extraversion",
    bgAccent: "bg-orange-500/5",
  },
  agreeableness: {
    gradient: "from-rose-500/10 via-transparent to-pink-500/5",
    border: "border-rose-500/30",
    icon: Heart,
    iconColor: "text-rose-500",
    label: "Agreeableness",
    bgAccent: "bg-rose-500/5",
  },
  emotionalResilience: {
    gradient: "from-emerald-500/10 via-transparent to-teal-500/5",
    border: "border-emerald-500/30",
    icon: Shield,
    iconColor: "text-emerald-500",
    label: "Resilience",
    bgAccent: "bg-emerald-500/5",
  },
  honestyHumility: {
    gradient: "from-amber-500/10 via-transparent to-yellow-500/5",
    border: "border-amber-500/30",
    icon: Scale,
    iconColor: "text-amber-500",
    label: "Integrity",
    bgAccent: "bg-amber-500/5",
  },
  adaptability: {
    gradient: "from-cyan-500/10 via-transparent to-sky-500/5",
    border: "border-cyan-500/30",
    icon: Shuffle,
    iconColor: "text-cyan-500",
    label: "Adaptability",
    bgAccent: "bg-cyan-500/5",
  },
};

export function QuestionContainer({
  question,
  questionIndex,
  children,
}: QuestionContainerProps) {
  const { responses } = useAssessmentStore();
  const theme = dimensionThemes[question.dimension] || dimensionThemes.openness;
  const Icon = theme.icon;

  return (
    <div
      className={`flex min-h-screen flex-col bg-gradient-to-b ${theme.gradient} from-background via-background to-muted/20`}
    >
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 shadow-sm">
        <Container className="py-4">
          <ProgressBar />
        </Container>
      </div>
      <div className="flex-1">
        <Container className="py-12 md:py-16">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-3xl space-y-8"
          >
            <DimensionProgress
              responses={responses}
              currentQuestionIndex={questionIndex}
            />

            {/* Dimension indicator pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme.bgAccent} ${theme.border} border`}
              >
                <Icon className={`w-4 h-4 ${theme.iconColor}`} />
                <span className={`text-sm font-medium ${theme.iconColor}`}>
                  {theme.label}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className={`rounded-2xl border ${theme.border} bg-card/80 backdrop-blur-sm p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {/* Question type badge */}
              <div className="flex justify-end mb-4">
                <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                  {question.type.replace("_", " ")}
                </span>
              </div>

              <h2 className="mb-8 text-2xl md:text-3xl font-bold leading-tight text-foreground">
                {question.text}
              </h2>
              <div className="space-y-6">{children}</div>
            </motion.div>

{/* Question counter moved to parent page for accuracy */}
          </motion.div>
        </Container>
      </div>
    </div>
  );
}
