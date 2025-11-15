"use client";

import { motion } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { Container } from "@/components/layout/Container";
import { DimensionProgress } from "./DimensionProgress";
import { useAssessmentStore } from "@/store/assessment-store";
import type { Question } from "@/types";

interface QuestionContainerProps {
  question: Question;
  questionIndex: number;
  children: React.ReactNode;
}

export function QuestionContainer({ question, questionIndex, children }: QuestionContainerProps) {
  const { responses } = useAssessmentStore();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 shadow-sm">
        <Container className="py-4">
          <ProgressBar />
        </Container>
      </div>
      <div className="flex-1">
        <Container className="py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-3xl space-y-8"
          >
            <DimensionProgress responses={responses} currentQuestionIndex={questionIndex} />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 className="mb-8 text-2xl md:text-3xl font-bold leading-tight text-foreground">
                {question.text}
              </h2>
              <div className="space-y-6">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}

