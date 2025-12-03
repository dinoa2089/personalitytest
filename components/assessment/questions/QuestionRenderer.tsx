"use client";

import type { Question } from "@/types";
import { LikertScale } from "./LikertScale";
import { SliderQuestion } from "./SliderQuestion";
import { VisualScale } from "./VisualScale";
import { ForcedChoiceTriad } from "./ForcedChoiceTriad";
import { SituationalJudgment } from "./SituationalJudgment";
import { BehavioralFrequency } from "./BehavioralFrequency";

interface QuestionRendererProps {
  question: Question;
  onAnswer: (response: string | number) => void;
  preferredModality?: "buttons" | "slider" | "visual";
}

export function QuestionRenderer({ 
  question, 
  onAnswer,
  preferredModality = "buttons"
}: QuestionRendererProps) {
  
  // Route to appropriate component based on question type
  switch (question.type) {
    case "likert":
      // Vary between slider and buttons for engagement
      if (preferredModality === "slider") {
        return <SliderQuestion question={question} onAnswer={onAnswer} />;
      }
      if (preferredModality === "visual") {
        return <VisualScale question={question} onAnswer={onAnswer} />;
      }
      return <LikertScale question={question} onAnswer={onAnswer} />;

    case "forced_choice":
      return <ForcedChoiceTriad question={question} onAnswer={(r) => onAnswer(r)} />;

    case "situational_judgment":
      return <SituationalJudgment question={question} onAnswer={onAnswer} />;

    case "behavioral_frequency":
      if (preferredModality === "slider") {
        return (
          <SliderQuestion 
            question={question} 
            onAnswer={onAnswer}
            min={1}
            max={5}
            labels={{ low: "Never", high: "Very Often" }}
          />
        );
      }
      return <BehavioralFrequency question={question} onAnswer={onAnswer} />;

    default:
      return <LikertScale question={question} onAnswer={onAnswer} />;
  }
}



