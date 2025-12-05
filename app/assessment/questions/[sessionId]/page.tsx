"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAssessmentStore } from "@/store/assessment-store";
import { QuestionContainer } from "@/components/assessment/QuestionContainer";
import { LikertScale } from "@/components/assessment/questions/LikertScale";
import { SliderScale } from "@/components/assessment/questions/SliderScale";
import { BinaryChoice } from "@/components/assessment/questions/BinaryChoice";
import { ForcedChoiceTriad } from "@/components/assessment/questions/ForcedChoiceTriad";
import { SituationalJudgment } from "@/components/assessment/questions/SituationalJudgment";
import { BehavioralFrequency } from "@/components/assessment/questions/BehavioralFrequency";
import { MilestoneCelebration } from "@/components/assessment/MilestoneCelebration";
import { Button } from "@/components/ui/button";
import { 
  loadQuestions, 
  getOrInitializeAdaptiveState,
  saveAdaptiveState,
  selectQuestionBatch,
  updateTraitEstimate,
  normalizeResponse,
  type AdaptiveState,
} from "@/lib/questions";
import { 
  getCurrentStage, 
  isStageComplete, 
  getStageProgress,
  ASSESSMENT_STAGES 
} from "@/lib/assessment-stages";
import type { Question, QuestionResponse } from "@/types";

export default function QuestionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const { user } = useUser(); // Get signed-in user if available
  
  const {
    currentQuestion,
    questions,
    responses,
    progress,
    setQuestions,
    setCurrentQuestion,
    addResponse,
    updateProgress,
    setResult,
    completeAssessment,
  } = useAssessmentStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [adaptiveState, setAdaptiveState] = useState<AdaptiveState | null>(null);
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  
  // Track if we've initialized to prevent double loading
  const initialized = useRef(false);
  // Track if assessment is completing to prevent race conditions
  const isCompleting = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const fetchQuestions = async () => {
      try {
        // Load full question bank
        const allQuestions = await loadQuestions();
        setQuestionBank(allQuestions);
        
        // Try to resume session if it exists in database
        let dbResponseCount = 0;
        try {
          const sessionResponse = await fetch(`/api/assessment/progress?sessionId=${sessionId}`);
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            if (sessionData.session && sessionData.responses) {
              dbResponseCount = sessionData.responses.length;
              
              // Check if we've completed the entire assessment
              const maxQuestions = ASSESSMENT_STAGES[ASSESSMENT_STAGES.length - 1].cumulativeQuestions;
              if (dbResponseCount >= maxQuestions) {
                router.push(`/results/${sessionId}`);
                return;
              }
              
              // Check if we just completed a stage - redirect to stage completion
              if (isStageComplete(dbResponseCount)) {
                router.push(`/assessment/stage-complete/${sessionId}`);
                return;
              }
            }
          }
        } catch (error) {
          console.warn("Could not resume session:", error);
        }
        
        // Get or initialize adaptive state
        let state = getOrInitializeAdaptiveState(sessionId);
        
        // Sync adaptive state with database
        if (state.questionsAnswered > dbResponseCount) {
          console.log(`Resetting adaptive state: localStorage has ${state.questionsAnswered} but DB has ${dbResponseCount}`);
          localStorage.removeItem(`adaptive-state-${sessionId}`);
          state = getOrInitializeAdaptiveState(sessionId);
        }
        
        if (dbResponseCount > 0 && state.questionsAnswered < dbResponseCount) {
          state = { ...state, questionsAnswered: dbResponseCount };
        }
        
        setAdaptiveState(state);
        
        // Get current stage and calculate questions needed
        const currentStage = getCurrentStage(dbResponseCount);
        const questionsNeeded = currentStage.cumulativeQuestions - dbResponseCount;
        
        // Update progress for current stage
        const stageProgress = getStageProgress(dbResponseCount);
        updateProgress(stageProgress.progressPercent);
        
        // Select questions for current stage
        const selectedQuestions = selectQuestionBatch(
          allQuestions,
          state,
          questionsNeeded,
          { 
            checkpoint: ASSESSMENT_STAGES.findIndex(s => s.id === currentStage.id) + 1, 
            diversifyTypes: true 
          }
        );
        
        if (selectedQuestions.length > 0) {
          setQuestions(selectedQuestions);
          setCurrentQuestion(selectedQuestions[0]);
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [sessionId, router, setQuestions, setCurrentQuestion, updateProgress]);

  const handleAnswer = async (answer: string | number) => {
    if (isCompleting.current) return;
    if (!currentQuestion || !adaptiveState) return;

    const response: QuestionResponse = {
      question_id: currentQuestion.id,
      question_type: currentQuestion.type,
      response: answer,
      dimension: currentQuestion.dimension,
      timestamp: new Date(),
    };

    addResponse(response);

    // Update adaptive state
    const normalizedValue = normalizeResponse(answer, currentQuestion.type);
    const newAdaptiveState = updateTraitEstimate(adaptiveState, currentQuestion, normalizedValue);
    setAdaptiveState(newAdaptiveState);
    saveAdaptiveState(sessionId, newAdaptiveState);

    // Save to backend
    try {
      const currentStage = getCurrentStage(newAdaptiveState.questionsAnswered);
      await fetch("/api/assessment/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          response: answer,
          dimension: currentQuestion.dimension,
          questionType: currentQuestion.type,
          totalQuestions: currentStage.cumulativeQuestions,
          currentProgress: newAdaptiveState.questionsAnswered,
        }),
      });
    } catch (error) {
      console.error("Failed to save response:", error);
    }

    const totalAnswered = newAdaptiveState.questionsAnswered;
    const nextIndex = currentIndex + 1;

    // Update progress for current stage
    const stageProgress = getStageProgress(totalAnswered);
    updateProgress(stageProgress.progressPercent);

    // Check if we've completed a stage (reached a stage boundary)
    if (isStageComplete(totalAnswered)) {
      isCompleting.current = true;
      
      // Save partial results for this stage
      await saveStageResults(response);
      
      // Redirect to stage completion page (shows results + prompts to continue)
      router.push(`/assessment/stage-complete/${sessionId}`);
      return;
    }

    // Move to next question or load more
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
    } else {
      // Load more questions for this stage
      const currentStage = getCurrentStage(totalAnswered);
      const questionsNeeded = currentStage.cumulativeQuestions - totalAnswered;
      
      if (questionsNeeded <= 0) {
        // Shouldn't happen, but safety check
        isCompleting.current = true;
        await saveStageResults(response);
        router.push(`/assessment/stage-complete/${sessionId}`);
        return;
      }
      
      const newBatch = selectQuestionBatch(
        questionBank,
        newAdaptiveState,
        questionsNeeded,
        { 
          checkpoint: ASSESSMENT_STAGES.findIndex(s => s.id === currentStage.id) + 1, 
          diversifyTypes: true 
        }
      );
      
      if (newBatch.length > 0) {
        setQuestions(newBatch);
        setCurrentIndex(0);
        setCurrentQuestion(newBatch[0]);
      } else {
        // No more questions - complete this stage
        isCompleting.current = true;
        await saveStageResults(response);
        router.push(`/assessment/stage-complete/${sessionId}`);
      }
    }
  };

  // Save results for the current stage
  const saveStageResults = async (finalResponse: QuestionResponse) => {
    try {
      const referralCode = localStorage.getItem("referral-code");
      const jobToken = localStorage.getItem("job-token");
      const applicantEmail = localStorage.getItem(`applicant-email-${sessionId}`);
      const applicantName = localStorage.getItem(`applicant-name-${sessionId}`);
      
      const allResponses = [...responses, finalResponse];
      
      await fetch("/api/assessment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          responses: allResponses,
          userId: user?.id || null, // Pass Clerk user ID if signed in
          referralCode: referralCode || null,
          jobToken: jobToken || null,
          applicantEmail: applicantEmail || null,
          applicantName: applicantName || null,
          stageComplete: true, // Flag to indicate partial completion
        }),
      });
    } catch (error) {
      console.error("Error saving stage results:", error);
    }
  };

  if (isLoading || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading your questions...</p>
        </div>
      </div>
    );
  }

  // Determine question variant for visual variety
  const getLikertVariant = (question: Question, index: number): "emoji" | "slider" | "binary" => {
    const hash = question.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    if (index % 5 === 4 && !question.reverse_scored) {
      return "binary";
    }
    
    if (hash % 3 === 0) {
      return "slider";
    }
    
    return "emoji";
  };

  const renderQuestionComponent = () => {
    switch (currentQuestion.type) {
      case "likert": {
        const variant = getLikertVariant(currentQuestion, currentIndex);
        
        if (variant === "binary") {
          return (
            <BinaryChoice
              question={currentQuestion}
              onAnswer={(value) => handleAnswer(value)}
            />
          );
        }
        
        if (variant === "slider") {
          return (
            <SliderScale
              question={currentQuestion}
              onAnswer={(value) => handleAnswer(value)}
            />
          );
        }
        
        return (
          <LikertScale
            question={currentQuestion}
            onAnswer={(value) => handleAnswer(value)}
          />
        );
      }
      case "forced_choice":
        return (
          <ForcedChoiceTriad
            question={currentQuestion}
            onAnswer={(response) => handleAnswer(response)}
          />
        );
      case "situational_judgment":
        return (
          <SituationalJudgment
            question={currentQuestion}
            onAnswer={(value) => handleAnswer(value)}
          />
        );
      case "behavioral_frequency":
        return (
          <BehavioralFrequency
            question={currentQuestion}
            onAnswer={(value) => handleAnswer(value)}
          />
        );
      default:
        return null;
    }
  };

  // Get current stage info for display
  const stageProgress = getStageProgress(adaptiveState?.questionsAnswered || 0);

  return (
    <>
      <MilestoneCelebration progress={progress} />
      <QuestionContainer question={currentQuestion} questionIndex={currentIndex}>
        {renderQuestionComponent()}
        {/* Navigation and question counter */}
        <div className="mt-8 flex items-center justify-between">
          <div className="w-24">
            {currentIndex > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prevIndex = currentIndex - 1;
                  setCurrentIndex(prevIndex);
                  setCurrentQuestion(questions[prevIndex]);
                }}
              >
                ← Back
              </Button>
            )}
          </div>
          
          {/* Question counter - shows progress within current stage */}
          <p className="text-sm text-muted-foreground text-center">
            {stageProgress.questionsInStage + 1} of {stageProgress.stage.questionCount}
          </p>
          
          <div className="w-24" />
        </div>
      </QuestionContainer>
    </>
  );
}
