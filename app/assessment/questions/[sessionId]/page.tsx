"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { isCheckpointReached, getCurrentCheckpoint } from "@/lib/checkpoint-logic";
import type { Question, QuestionResponse } from "@/types";

// Checkpoint thresholds
const CHECKPOINT_THRESHOLDS = [35, 55, 80, 105];

// Questions to load per batch (between checkpoints)
const BATCH_SIZES: Record<number, number> = {
  1: 35,  // First checkpoint: PRISM-7
  2: 20,  // Second: MBTI (+20)
  3: 25,  // Third: Enneagram (+25)
  4: 25,  // Fourth: Deep dive (+25)
};

export default function QuestionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  
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
  const [totalQuestionsTarget, setTotalQuestionsTarget] = useState(105);
  // Track the questionsAnswered count when the current batch was loaded
  const [batchStartCount, setBatchStartCount] = useState(0);
  
  // Track if we've initialized to prevent double loading
  const initialized = useRef(false);
  // Track if assessment is completing to prevent race conditions
  const isCompleting = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    // Load questions adaptively
    const fetchQuestions = async () => {
      try {
        // Get assessment type from localStorage
        const assessmentType = (localStorage.getItem(`assessment-type-${sessionId}`) || "full") as "quick" | "standard" | "full";
        
        // Set target questions based on assessment type
        const targetQuestions = assessmentType === "quick" ? 35 : assessmentType === "standard" ? 80 : 105;
        setTotalQuestionsTarget(targetQuestions);
        
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
              
              // Check if already completed
              if (dbResponseCount >= targetQuestions) {
                router.push(`/results/${sessionId}`);
                return;
              }
            }
          }
        } catch (error) {
          console.warn("Could not resume session:", error);
        }
        
        // Get or initialize adaptive state
        let state = getOrInitializeAdaptiveState(sessionId);
        
        // IMPORTANT: Sync adaptive state with database
        // If localStorage has more questions than DB, reset the adaptive state
        // This handles cases where DB was cleared but localStorage wasn't
        if (state.questionsAnswered > dbResponseCount) {
          console.log(`Resetting adaptive state: localStorage has ${state.questionsAnswered} but DB has ${dbResponseCount}`);
          localStorage.removeItem(`adaptive-state-${sessionId}`);
          state = getOrInitializeAdaptiveState(sessionId);
        }
        
        // If DB has responses but state doesn't match, update progress
        if (dbResponseCount > 0 && state.questionsAnswered < dbResponseCount) {
          // DB has more - we need to resume from DB position
          // For now, just update the count (full state rebuild would need response data)
          state = { ...state, questionsAnswered: dbResponseCount };
        }
        
        setAdaptiveState(state);
        
        // Update progress based on actual DB response count
        updateProgress((dbResponseCount / targetQuestions) * 100);
        
        // Determine current checkpoint and batch size
        const currentCheckpoint = state.currentCheckpoint || 1;
        const questionsAnswered = state.questionsAnswered || 0;
        
        // Calculate how many questions we need for the current batch
        const nextCheckpointThreshold = CHECKPOINT_THRESHOLDS.find(t => t > questionsAnswered) || targetQuestions;
        const questionsNeeded = Math.min(nextCheckpointThreshold - questionsAnswered, targetQuestions - questionsAnswered);
        
        // Select questions adaptively for this batch
        const selectedQuestions = selectQuestionBatch(
          allQuestions,
          state,
          questionsNeeded,
          { checkpoint: currentCheckpoint, diversifyTypes: true }
        );
        
        if (selectedQuestions.length > 0) {
          setQuestions(selectedQuestions);
          setCurrentQuestion(selectedQuestions[0]);
          // Track the starting count for this batch
          setBatchStartCount(state.questionsAnswered || 0);
          // Progress already set above based on dbResponseCount
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
    // Prevent processing if already completing/redirecting
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

    // Update adaptive state with the new response
    const normalizedValue = normalizeResponse(answer, currentQuestion.type);
    const newAdaptiveState = updateTraitEstimate(adaptiveState, currentQuestion, normalizedValue);
    setAdaptiveState(newAdaptiveState);
    saveAdaptiveState(sessionId, newAdaptiveState);

    // Save to backend with progress update
    try {
      await fetch("/api/assessment/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          response: answer,
          dimension: currentQuestion.dimension,
          questionType: currentQuestion.type,
          totalQuestions: totalQuestionsTarget,
          currentProgress: newAdaptiveState.questionsAnswered,
        }),
      });
    } catch (error) {
      console.error("Failed to save response:", error);
      // Continue anyway - don't block user
    }

    // Calculate total answered count (from adaptive state)
    const totalAnswered = newAdaptiveState.questionsAnswered;
    const nextIndex = currentIndex + 1;

    // FIRST: Check if we've reached the target (assessment complete)
    if (totalAnswered >= totalQuestionsTarget) {
      isCompleting.current = true;
      updateProgress(100);
      completeAssessmentFlow(response);
      return;
    }

    // SECOND: Check if we've reached an intermediate checkpoint
    if (CHECKPOINT_THRESHOLDS.includes(totalAnswered)) {
      isCompleting.current = true;
      updateProgress((totalAnswered / totalQuestionsTarget) * 100);
      router.push(`/assessment/checkpoint/${sessionId}`);
      return;
    }

    // THIRD: Move to next question or load more
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      updateProgress((totalAnswered / totalQuestionsTarget) * 100);
    } else {
      // Need to load more questions for the next batch
      const nextCheckpoint = newAdaptiveState.currentCheckpoint;
      const nextThreshold = CHECKPOINT_THRESHOLDS.find(t => t > totalAnswered) || totalQuestionsTarget;
      const questionsNeeded = Math.min(nextThreshold - totalAnswered, totalQuestionsTarget - totalAnswered);
      
      if (questionsNeeded <= 0) {
        // Safety: Should have completed already, but just in case
        isCompleting.current = true;
        completeAssessmentFlow(response);
        return;
      }
      
      const newBatch = selectQuestionBatch(
        questionBank,
        newAdaptiveState,
        questionsNeeded,
        { checkpoint: nextCheckpoint, diversifyTypes: true }
      );
      
      if (newBatch.length > 0) {
        setQuestions(newBatch);
        setCurrentIndex(0);
        setCurrentQuestion(newBatch[0]);
        // Track the starting count for this new batch
        setBatchStartCount(totalAnswered);
        updateProgress((totalAnswered / totalQuestionsTarget) * 100);
      } else {
        // No more questions available - complete assessment
        isCompleting.current = true;
        completeAssessmentFlow(response);
      }
    }
  };

  // Helper function to complete the assessment
  const completeAssessmentFlow = async (finalResponse: QuestionResponse) => {
    try {
      // Get referral code, job token, and applicant info from localStorage if they exist
      const referralCode = localStorage.getItem("referral-code");
      const jobToken = localStorage.getItem("job-token");
      const applicantEmail = localStorage.getItem(`applicant-email-${sessionId}`);
      const applicantName = localStorage.getItem(`applicant-name-${sessionId}`);
      
      const allResponses = [...responses, finalResponse];
      
      const completeResponse = await fetch("/api/assessment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          responses: allResponses,
          userId: null, // Guest session - no user ID
          referralCode: referralCode || null,
          jobToken: jobToken || null,
          applicantEmail: applicantEmail || null,
          applicantName: applicantName || null,
        }),
      });

      if (completeResponse.ok) {
        const data = await completeResponse.json();
        const resultData = data.result || data;
        
        // Store result in store for fallback access
        setResult({
          session_id: sessionId,
          dimensional_scores: resultData.dimensional_scores || [],
          completed: true,
          created_at: new Date(),
        });
        
        completeAssessment();
        // Redirect to auth gate - requires sign in before viewing results
        router.push(`/assessment/complete/${sessionId}`);
      } else {
        const errorData = await completeResponse.json().catch(() => ({}));
        console.error("Failed to complete assessment:", errorData);
        // Still redirect to auth gate
        router.push(`/assessment/complete/${sessionId}`);
      }
    } catch (error) {
      console.error("Error completing assessment:", error);
      // Still redirect to auth gate - they might be in store
      completeAssessment();
      router.push(`/assessment/complete/${sessionId}`);
    }
  };

  if (isLoading || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading question...</p>
      </div>
    );
  }

  // Determine which likert variant to show based on question characteristics
  // This creates variety while being deterministic (same question = same style)
  const getLikertVariant = (question: Question, index: number): "emoji" | "slider" | "binary" => {
    // Use question ID hash to determine variant consistently
    const hash = question.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Binary choice for simpler, more direct questions (every 5th likert question)
    // These work best for clear-cut statements
    if (index % 5 === 4 && !question.reverse_scored) {
      return "binary";
    }
    
    // Slider for every 3rd question to add variety
    if (hash % 3 === 0) {
      return "slider";
    }
    
    // Default to emoji scale
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

  return (
    <>
      <MilestoneCelebration progress={progress} />
      <QuestionContainer question={currentQuestion} questionIndex={currentIndex}>
        {renderQuestionComponent()}
        {/* Navigation and question counter */}
        <div className="mt-8 flex items-center justify-between">
          {/* Previous button - only show if we can go back */}
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
          
          {/* Question counter - accurate count based on batch position */}
          <p className="text-sm text-muted-foreground text-center">
            Question {batchStartCount + currentIndex + 1} of {totalQuestionsTarget}
          </p>
          
          {/* Skip button - allows moving forward without answering (optional) */}
          <div className="w-24 flex justify-end">
            {/* Space reserved for symmetry - Next happens automatically on answer */}
          </div>
        </div>
      </QuestionContainer>
    </>
  );
}
