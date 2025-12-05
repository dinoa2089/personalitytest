"use client";

import { motion } from "framer-motion";
import { StageProgressBar } from "./StageProgressBar";
import { Container } from "@/components/layout/Container";
import { DimensionProgress } from "./DimensionProgress";
import { useAssessmentStore } from "@/store/assessment-store";
import type { Question, Dimension, QuestionType } from "@/types";
import {
  Lightbulb,
  ListChecks,
  Users,
  Heart,
  Shield,
  Scale,
  Shuffle,
  ClipboardCheck,
  BarChart3,
  GitBranch,
  Clock,
  Info,
} from "lucide-react";

interface QuestionContainerProps {
  question: Question;
  questionIndex: number;
  children: React.ReactNode;
}

// Dimension theme configuration with research-backed descriptions
const dimensionThemes: Record<
  Dimension,
  {
    gradient: string;
    border: string;
    icon: React.ElementType;
    iconColor: string;
    label: string;
    bgAccent: string;
    // Non-biasing insight text - describes what the dimension measures without leading
    insight: string;
    researchNote: string;
  }
> = {
  openness: {
    gradient: "from-violet-500/10 via-transparent to-purple-500/5",
    border: "border-violet-500/30",
    icon: Lightbulb,
    iconColor: "text-violet-500",
    label: "Openness",
    bgAccent: "bg-violet-500/5",
    insight: "This explores your relationship with new ideas, creativity, and abstract thinking.",
    researchNote: "People naturally vary on this dimension — there's no right or wrong place to be.",
  },
  conscientiousness: {
    gradient: "from-blue-500/10 via-transparent to-cyan-500/5",
    border: "border-blue-500/30",
    icon: ListChecks,
    iconColor: "text-blue-500",
    label: "Conscientiousness",
    bgAccent: "bg-blue-500/5",
    insight: "This explores your approach to organization, planning, and follow-through.",
    researchNote: "Different work contexts benefit from different levels of this trait.",
  },
  extraversion: {
    gradient: "from-orange-500/10 via-transparent to-amber-500/5",
    border: "border-orange-500/30",
    icon: Users,
    iconColor: "text-orange-500",
    label: "Extraversion",
    bgAccent: "bg-orange-500/5",
    insight: "This explores how you gain energy — through social interaction or solitary activities.",
    researchNote: "Neither end of this spectrum is superior; both offer distinct strengths.",
  },
  agreeableness: {
    gradient: "from-rose-500/10 via-transparent to-pink-500/5",
    border: "border-rose-500/30",
    icon: Heart,
    iconColor: "text-rose-500",
    label: "Agreeableness",
    bgAccent: "bg-rose-500/5",
    insight: "This explores your natural approach to cooperation, trust, and interpersonal harmony.",
    researchNote: "Healthy teams benefit from a mix of perspectives on this dimension.",
  },
  emotionalResilience: {
    gradient: "from-emerald-500/10 via-transparent to-teal-500/5",
    border: "border-emerald-500/30",
    icon: Shield,
    iconColor: "text-emerald-500",
    label: "Resilience",
    bgAccent: "bg-emerald-500/5",
    insight: "This explores how you typically respond to stress, setbacks, and emotional challenges.",
    researchNote: "This trait can shift over time with experience and intentional practice.",
  },
  honestyHumility: {
    gradient: "from-amber-500/10 via-transparent to-yellow-500/5",
    border: "border-amber-500/30",
    icon: Scale,
    iconColor: "text-amber-500",
    label: "Integrity",
    bgAccent: "bg-amber-500/5",
    insight: "This explores your orientation toward fairness, modesty, and ethical principles.",
    researchNote: "This dimension is a key predictor of trustworthy behavior in research.",
  },
  adaptability: {
    gradient: "from-cyan-500/10 via-transparent to-sky-500/5",
    border: "border-cyan-500/30",
    icon: Shuffle,
    iconColor: "text-cyan-500",
    label: "Adaptability",
    bgAccent: "bg-cyan-500/5",
    insight: "This explores how you respond to change, uncertainty, and shifting circumstances.",
    researchNote: "Modern workplaces increasingly value flexibility, but stability has its place too.",
  },
};

// Question type badges with non-biasing descriptions
const questionTypeInfo: Record<
  QuestionType,
  {
    icon: React.ElementType;
    label: string;
    description: string;
  }
> = {
  likert: {
    icon: BarChart3,
    label: "Agreement Scale",
    description: "Rate how strongly you agree or disagree",
  },
  forced_choice: {
    icon: GitBranch,
    label: "Preference Comparison",
    description: "Compare options to reveal relative priorities",
  },
  situational_judgment: {
    icon: ClipboardCheck,
    label: "Scenario Response",
    description: "How you'd respond reveals behavioral tendencies",
  },
  behavioral_frequency: {
    icon: Clock,
    label: "Frequency Assessment",
    description: "Past behavior patterns help predict future tendencies",
  },
};

export function QuestionContainer({
  question,
  questionIndex,
  children,
}: QuestionContainerProps) {
  const { responses } = useAssessmentStore();
  const theme = dimensionThemes[question.dimension] || dimensionThemes.openness;
  const typeInfo = questionTypeInfo[question.type] || questionTypeInfo.likert;
  const Icon = theme.icon;
  const TypeIcon = typeInfo.icon;

  return (
    <div
      className={`flex min-h-screen flex-col bg-gradient-to-b ${theme.gradient} from-background via-background to-muted/20`}
    >
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 shadow-sm">
        <Container className="py-4">
          <StageProgressBar questionsAnswered={responses.length} showStageIndicators={true} />
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
            className="mx-auto max-w-3xl space-y-6"
          >
            <DimensionProgress
              responses={responses}
              currentQuestionIndex={questionIndex}
            />

            {/* Dimension & Question Type Context Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              {/* Dimension pill */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme.bgAccent} ${theme.border} border`}
              >
                <Icon className={`w-4 h-4 ${theme.iconColor}`} />
                <span className={`text-sm font-medium ${theme.iconColor}`}>
                  {theme.label}
                </span>
              </div>

              {/* Question type pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-muted-foreground/20">
                <TypeIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {typeInfo.label}
                </span>
              </div>
            </motion.div>

            {/* Main question card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className={`rounded-2xl border ${theme.border} bg-card/80 backdrop-blur-sm p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <h2 className="mb-8 text-2xl md:text-3xl font-bold leading-tight text-foreground">
                {question.text}
              </h2>
              <div className="space-y-6">{children}</div>
            </motion.div>

            {/* Non-biasing insight footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-muted-foreground/10"
            >
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {theme.insight}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {theme.researchNote}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}
