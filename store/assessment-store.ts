/**
 * Zustand store for assessment state management
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question, QuestionResponse, AssessmentSession, AssessmentResult } from "@/types";

interface AssessmentState {
  session: AssessmentSession | null;
  currentQuestion: Question | null;
  questions: Question[];
  responses: QuestionResponse[];
  progress: number;
  isComplete: boolean;
  result: AssessmentResult | null;
  
  // Actions
  initializeSession: (sessionId: string, userId?: string) => void;
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestion: (question: Question) => void;
  addResponse: (response: QuestionResponse) => void;
  updateProgress: (progress: number) => void;
  setResult: (result: AssessmentResult) => void;
  completeAssessment: () => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      session: null,
      currentQuestion: null,
      questions: [],
      responses: [],
      progress: 0,
      isComplete: false,
      result: null,

      initializeSession: (sessionId: string, userId?: string) =>
        set({
          session: {
            id: sessionId,
            user_id: userId,
            started_at: new Date(),
            progress: 0,
            responses: [],
          },
        }),

      setQuestions: (questions) => set({ questions }),

      setCurrentQuestion: (question) => set({ currentQuestion: question }),

      addResponse: (response) =>
        set((state) => ({
          responses: [...state.responses, response],
        })),

      updateProgress: (progress) =>
        set((state) => ({
          progress,
          session: state.session
            ? { ...state.session, progress }
            : null,
        })),

      setResult: (result) => set({ result }),

      completeAssessment: () =>
        set((state) => ({
          isComplete: true,
          session: state.session
            ? {
                ...state.session,
                completed_at: new Date(),
                progress: 100,
              }
            : null,
        })),

      reset: () =>
        set({
          session: null,
          currentQuestion: null,
          questions: [],
          responses: [],
          progress: 0,
          isComplete: false,
          result: null,
        }),
    }),
    {
      name: "assessment-storage",
      partialize: (state) => ({
        session: state.session,
        responses: state.responses,
        progress: state.progress,
        result: state.result,
        isComplete: state.isComplete,
      }),
    }
  )
);

