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
 * Quick: Only core questions (is_core = true) - approximately 20-25 questions
 * Full: All questions
 */
export function filterQuestionsByType(
  questions: Question[],
  assessmentType: "quick" | "full"
): Question[] {
  if (assessmentType === "full") {
    return questions;
  }
  
  // For quick assessment, prioritize:
  // 1. Core questions (is_core flag from database)
  // 2. Highest weighted questions from each dimension
  // 3. Ensure at least 3 questions per dimension
  
  const coreQuestions = questions.filter((q) => {
    // Check if question has is_core metadata (from database)
    // For mock questions, we'll use weight and order_index as proxy
    return (q as any).is_core === true || 
           (q.weight && q.weight >= 1.2) || // Higher weighted questions
           ((q as any).order_index && (q as any).order_index <= 35); // First 35 questions (core set)
  });
  
  // If we have core questions, use them
  if (coreQuestions.length >= 20) {
    return coreQuestions.slice(0, 25); // Limit to 25 for quick assessment
  }
  
  // Fallback: Select top questions from each dimension
  const dimensionCounts: Record<string, number> = {};
  const selected: Question[] = [];
  
  // Sort by weight (descending) and order_index (ascending)
  const sorted = [...questions].sort((a, b) => {
    const weightDiff = (b.weight || 1.0) - (a.weight || 1.0);
    if (weightDiff !== 0) return weightDiff;
    const aOrder = (a as any).order_index || 999;
    const bOrder = (b as any).order_index || 999;
    return aOrder - bOrder;
  });
  
  for (const question of sorted) {
    const dim = question.dimension;
    const count = dimensionCounts[dim] || 0;
    
    // Ensure at least 3 questions per dimension, max 4 for quick assessment
    if (count < 4 && selected.length < 25) {
      selected.push(question);
      dimensionCounts[dim] = count + 1;
    }
  }
  
  return selected;
}

