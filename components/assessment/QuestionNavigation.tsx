"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function QuestionNavigation({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: QuestionNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <p className="text-sm text-muted-foreground">
        Question {currentIndex + 1} of {totalQuestions}
      </p>
      <Button
        onClick={onNext}
        disabled={!canGoNext}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

