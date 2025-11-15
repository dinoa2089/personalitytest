// Shared TypeScript types for Authentic Self Platform

export type Dimension =
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "emotionalResilience"
  | "honestyHumility"
  | "adaptability";

export type QuestionType =
  | "likert"
  | "forced_choice"
  | "situational_judgment"
  | "behavioral_frequency";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  dimension: Dimension;
  options?: string[];
  reverse_scored?: boolean;
  weight?: number;
}

export interface QuestionResponse {
  question_id: string;
  question_type: QuestionType;
  response: string | number;
  dimension: Dimension;
  timestamp?: Date;
}

export interface DimensionScore {
  dimension: Dimension;
  raw_score: number;
  percentile: number;
  confidence_interval: [number, number];
}

export interface AssessmentSession {
  id: string;
  user_id?: string;
  started_at: Date;
  completed_at?: Date;
  progress: number;
  responses: QuestionResponse[];
}

export interface FrameworkMappings {
  mbti?: {
    type: string;
    confidence: number;
    dimensions: {
      "E/I": { value: string; confidence: number; score: number };
      "S/N": { value: string; confidence: number; score: number };
      "T/F": { value: string; confidence: number; score: number };
      "J/P": { value: string; confidence: number; score: number };
    };
    explanation: string;
  };
  cliftonstrengths?: {
    top_themes: Array<{
      name: string;
      domain: string;
      score: number;
    }>;
    domains: {
      "Strategic Thinking": number;
      "Executing": number;
      "Influencing": number;
      "Relationship Building": number;
    };
    explanation: string;
  };
  enneagram?: {
    primary_type: number;
    primary_probability: number;
    wing: number;
    wing_probability: number;
    all_probabilities: Record<number, number>;
    explanation: string;
  };
}

export interface AssessmentResult {
  session_id: string;
  dimensional_scores: DimensionScore[];
  frameworks?: FrameworkMappings;
  completed: boolean;
  created_at: Date;
}

