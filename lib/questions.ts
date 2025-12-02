/**
 * Question loading and management utilities
 */
import { supabase } from "./supabase";
import { mockQuestions } from "./mock-questions";
import type { Question } from "@/types";

export async function loadQuestions(): Promise<Question[]> {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, use mock data
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase not configured, using mock questions");
    return mockQuestions;
  }

  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error loading questions from Supabase:", error);
      console.warn("Falling back to mock questions");
      return mockQuestions;
    }

    // If no data returned, use mock questions
    if (!data || data.length === 0) {
      console.warn("No questions found in database, using mock questions");
      return mockQuestions;
    }

    return data.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type as Question["type"],
      dimension: q.dimension as Question["dimension"],
      options: q.options ? (Array.isArray(q.options) ? q.options : []) : undefined,
      reverse_scored: q.reverse_scored || false,
      weight: q.weight || 1.0,
    }));
  } catch (error) {
    console.error("Exception loading questions:", error);
    console.warn("Falling back to mock questions");
    return mockQuestions;
  }
}

export function getQuestionByDimension(
  questions: Question[],
  dimension: Question["dimension"]
): Question[] {
  return questions.filter((q) => q.dimension === dimension);
}

export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Filter questions based on assessment type
 * Quick: 35 questions with at least 5 per dimension for accuracy
 * Full: All questions
 */
export function filterQuestionsByType(
  questions: Question[],
  assessmentType: "quick" | "full"
): Question[] {
  if (assessmentType === "full") {
    return questions;
  }
  
  // For quick assessment:
  // - Target: 35 questions total
  // - Minimum: 5 questions per dimension (7 dimensions = 35 minimum)
  // - Prioritize: Higher weighted questions and diverse question types
  
  const TARGET_TOTAL = 35;
  const MIN_PER_DIMENSION = 5;
  
  const dimensions = [
    "openness",
    "conscientiousness", 
    "extraversion",
    "agreeableness",
    "emotionalResilience",
    "honestyHumility",
    "adaptability",
  ];
  
  // Group questions by dimension
  const questionsByDimension: Record<string, Question[]> = {};
  for (const dim of dimensions) {
    questionsByDimension[dim] = questions.filter(q => q.dimension === dim);
  }
  
  // Sort each dimension's questions by weight and discriminating power
  for (const dim of dimensions) {
    questionsByDimension[dim].sort((a, b) => {
      // Prioritize by weight first
      const weightDiff = (b.weight || 1.0) - (a.weight || 1.0);
      if (weightDiff !== 0) return weightDiff;
      
      // Then by question type (behavioral_frequency > situational_judgment > forced_choice > likert)
      const typeOrder: Record<string, number> = {
        behavioral_frequency: 4,
        situational_judgment: 3,
        forced_choice: 2,
        likert: 1,
      };
      const aTypeScore = typeOrder[a.type] || 0;
      const bTypeScore = typeOrder[b.type] || 0;
      if (aTypeScore !== bTypeScore) return bTypeScore - aTypeScore;
      
      // Finally by order_index
      const aOrder = (a as any).order_index || 999;
      const bOrder = (b as any).order_index || 999;
      return aOrder - bOrder;
    });
  }
  
  const selected: Question[] = [];
  const dimensionCounts: Record<string, number> = {};
  
  // First pass: Ensure minimum questions per dimension
  for (const dim of dimensions) {
    dimensionCounts[dim] = 0;
    const dimQuestions = questionsByDimension[dim];
    
    for (let i = 0; i < Math.min(MIN_PER_DIMENSION, dimQuestions.length); i++) {
      selected.push(dimQuestions[i]);
      dimensionCounts[dim]++;
    }
  }
  
  // Second pass: Fill remaining slots with best remaining questions
  // Prioritize dimensions that might need more differentiation
  if (selected.length < TARGET_TOTAL) {
    const remaining: Question[] = [];
    
    for (const dim of dimensions) {
      const dimQuestions = questionsByDimension[dim];
      // Add questions beyond the minimum that we haven't selected yet
      for (let i = MIN_PER_DIMENSION; i < dimQuestions.length; i++) {
        remaining.push(dimQuestions[i]);
      }
    }
    
    // Sort remaining by weight
    remaining.sort((a, b) => (b.weight || 1.0) - (a.weight || 1.0));
    
    // Add best remaining questions up to target
    for (const q of remaining) {
      if (selected.length >= TARGET_TOTAL) break;
      
      // Don't add too many from one dimension (max 7 per dimension for balance)
      const dim = q.dimension;
      if ((dimensionCounts[dim] || 0) < 7) {
        selected.push(q);
        dimensionCounts[dim] = (dimensionCounts[dim] || 0) + 1;
      }
    }
  }
  
  // Shuffle to avoid predictable ordering while maintaining selection
  return shuffleQuestions(selected);
}

