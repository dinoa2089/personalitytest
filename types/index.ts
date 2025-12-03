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

export interface ForcedChoiceOption {
  text: string;
  dimension: Dimension;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  dimension: Dimension;
  options?: string[] | ForcedChoiceOption[]; // Support both for backward compat
  reverse_scored?: boolean;
  weight?: number;
  framework_tags?: string[]; // e.g., ["mbti_ei", "enneagram_9"]
  // IRT (Item Response Theory) parameters
  discrimination?: number; // How well the item differentiates high/low scorers (default 1.0)
  difficulty?: number; // Where on trait continuum item provides most info (-3 to +3, default 0)
  // Metadata
  is_core?: boolean; // Core questions always included, supplementary randomly sampled
  context?: string; // Situational context: work, social, personal, stress, general
  response_count?: number; // Times this question has been answered (for calibration)
}

export interface QuestionResponse {
  question_id: string;
  question_type: QuestionType;
  response: string | number;
  dimension: Dimension;
  timestamp?: Date;
  // Framework metadata for accurate MBTI/Enneagram scoring
  framework_tags?: string[];  // e.g., ["mbti_tf", "prism_agreeableness"]
  discrimination?: number;     // IRT discrimination parameter
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

