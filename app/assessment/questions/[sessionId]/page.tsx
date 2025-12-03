"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { QuestionContainer } from "@/components/assessment/QuestionContainer";
import { LikertScale } from "@/components/assessment/questions/LikertScale";
import { ForcedChoiceTriad } from "@/components/assessment/questions/ForcedChoiceTriad";
import { SituationalJudgment } from "@/components/assessment/questions/SituationalJudgment";
import { BehavioralFrequency } from "@/components/assessment/questions/BehavioralFrequency";
import { MilestoneCelebration } from "@/components/assessment/MilestoneCelebration";
import { Button } from "@/components/ui/button";
import { loadQuestions, filterQuestionsByType } from "@/lib/questions";
import { isCheckpointReached } from "@/lib/checkpoint-logic";
import type { Question, QuestionResponse } from "@/types";

// Checkpoint thresholds
const CHECKPOINT_THRESHOLDS = [35, 55, 80, 105];

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

  useEffect(() => {
    // Load questions from Supabase
    const fetchQuestions = async () => {
      try {
        // Get assessment type from localStorage
        const assessmentType = (localStorage.getItem(`assessment-type-${sessionId}`) || "full") as "quick" | "standard" | "full";
        
        const allQuestions = await loadQuestions();
        // Filter questions based on assessment type
        const questions = filterQuestionsByType(allQuestions, assessmentType);
        
        if (questions.length > 0) {
          setQuestions(questions);
          
          // Try to resume session if it exists in database
          try {
            const sessionResponse = await fetch(`/api/assessment/progress?sessionId=${sessionId}`);
            if (sessionResponse.ok) {
              const sessionData = await sessionResponse.json();
              if (sessionData.session && sessionData.responses) {
                // Restore progress
                const savedProgress = sessionData.session.progress || 0;
                updateProgress(savedProgress);
                
                // If there are saved responses, resume from where we left off
                if (sessionData.responses.length > 0 && sessionData.responses.length < questions.length) {
                  const nextIndex = sessionData.responses.length;
                  setCurrentIndex(nextIndex);
                  setCurrentQuestion(questions[nextIndex]);
                  setIsLoading(false);
                  return;
                } else if (sessionData.responses.length >= questions.length) {
                  // Assessment already completed - redirect to results
                  router.push(`/results/${sessionId}`);
                  return;
                }
              }
            }
          } catch (error) {
            // Continue with fresh start if resumption fails
            console.warn("Could not resume session:", error);
          }
          
          // Start fresh or continue from beginning
          setCurrentQuestion(questions[0]);
          updateProgress((responses.length / questions.length) * 100);
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [setQuestions, setCurrentQuestion, sessionId, router]);

  const handleAnswer = async (answer: string | number) => {
    if (!currentQuestion) return;

    const response: QuestionResponse = {
      question_id: currentQuestion.id,
      question_type: currentQuestion.type,
      response: answer,
      dimension: currentQuestion.dimension,
      timestamp: new Date(),
    };

    addResponse(response);

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
          totalQuestions: questions.length,
          currentProgress: responses.length + 1, // +1 because we just added it
        }),
      });
    } catch (error) {
      console.error("Failed to save response:", error);
      // Continue anyway - don't block user
    }

    // Calculate answered count
    const answeredCount = responses.length + 1;
    const nextIndex = currentIndex + 1;

    // Check if we've reached a checkpoint
    if (CHECKPOINT_THRESHOLDS.includes(answeredCount) && answeredCount < questions.length) {
      // Update progress before redirecting
      updateProgress((answeredCount / questions.length) * 100);
      router.push(`/assessment/checkpoint/${sessionId}`);
      return;
    }

    // Move to next question
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      // Update progress based on number of responses (questions answered)
      updateProgress((answeredCount / questions.length) * 100);
    } else {
      // Complete assessment - calculate scores and save results
      try {
        // Get referral code, job token, and applicant info from localStorage if they exist
        const referralCode = localStorage.getItem("referral-code");
        const jobToken = localStorage.getItem("job-token");
        const applicantEmail = localStorage.getItem(`applicant-email-${sessionId}`);
        const applicantName = localStorage.getItem(`applicant-name-${sessionId}`);
        
        const completeResponse = await fetch("/api/assessment/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            responses: [...responses, response],
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
    }
  };

  if (isLoading || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading question...</p>
      </div>
    );
  }

  const renderQuestionComponent = () => {
    switch (currentQuestion.type) {
      case "likert":
        return (
          <LikertScale
            question={currentQuestion}
            onAnswer={(value) => handleAnswer(value)}
          />
        );
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
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (currentIndex > 0) {
                const prevIndex = currentIndex - 1;
                setCurrentIndex(prevIndex);
                setCurrentQuestion(questions[prevIndex]);
                // Update progress based on responses (questions answered before the previous one)
                // Count how many responses exist for questions before the previous index
                const responsesBeforePrev = responses.filter(
                  (_, idx) => idx < prevIndex
                ).length;
                updateProgress((responsesBeforePrev / questions.length) * 100);
              }
            }}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <p className="text-sm text-muted-foreground self-center">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
      </QuestionContainer>
    </>
  );
}
