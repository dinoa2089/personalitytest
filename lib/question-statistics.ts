/**
 * Question Statistics Module
 * 
 * Functions to update question statistics for IRT calibration.
 * Tracks response distributions, means, and standard deviations.
 */

import { supabase } from './supabase';
import type { QuestionResponse } from '@/types';

export interface QuestionStatUpdate {
  question_id: string;
  response_value: number;
}

interface ResponseDistribution {
  [key: string]: number; // e.g., "1": 5, "2": 10, etc.
}

/**
 * Update question statistics after an assessment completes
 * Batches updates for efficiency
 */
export async function updateQuestionStatistics(
  responses: QuestionResponse[]
): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || responses.length === 0) {
    return true; // Graceful degradation
  }

  try {
    // Extract numeric response values
    const updates: QuestionStatUpdate[] = [];
    
    for (const response of responses) {
      const responseValue = extractNumericValue(response.response);
      if (responseValue !== null) {
        updates.push({
          question_id: response.question_id,
          response_value: responseValue,
        });
      }
    }

    if (updates.length === 0) {
      return true;
    }

    // Group updates by question
    const byQuestion = new Map<string, number[]>();
    for (const update of updates) {
      const existing = byQuestion.get(update.question_id) || [];
      existing.push(update.response_value);
      byQuestion.set(update.question_id, existing);
    }

    // Get existing statistics for these questions
    const questionIds = Array.from(byQuestion.keys());
    const { data: existingStats, error: fetchError } = await supabase
      .from('question_statistics')
      .select('*')
      .in('question_id', questionIds);

    if (fetchError) {
      console.error('Error fetching question statistics:', fetchError);
      // Continue anyway - we'll create new entries
    }

    const existingMap = new Map(
      (existingStats || []).map(s => [s.question_id, s])
    );

    // Prepare upserts
    const upserts = [];
    
    for (const [questionId, newValues] of byQuestion) {
      const existing = existingMap.get(questionId);
      
      if (existing) {
        // Update existing statistics
        const updatedStats = mergeStatistics(
          existing.total_responses,
          existing.mean_response,
          existing.std_deviation,
          existing.response_distribution || {},
          newValues
        );
        
        upserts.push({
          question_id: questionId,
          total_responses: updatedStats.totalResponses,
          mean_response: updatedStats.mean,
          std_deviation: updatedStats.stdDeviation,
          response_distribution: updatedStats.distribution,
          updated_at: new Date().toISOString(),
        });
      } else {
        // Create new statistics entry
        const newStats = calculateStatistics(newValues);
        
        upserts.push({
          question_id: questionId,
          total_responses: newStats.totalResponses,
          mean_response: newStats.mean,
          std_deviation: newStats.stdDeviation,
          response_distribution: newStats.distribution,
          updated_at: new Date().toISOString(),
        });
      }
    }

    // Batch upsert
    if (upserts.length > 0) {
      const { error: upsertError } = await supabase
        .from('question_statistics')
        .upsert(upserts, { onConflict: 'question_id' });

      if (upsertError) {
        console.error('Error upserting question statistics:', upsertError);
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error('Exception updating question statistics:', err);
    return false;
  }
}

/**
 * Extract numeric value from various response formats
 */
function extractNumericValue(response: string | number): number | null {
  if (typeof response === 'number') {
    return response;
  }
  
  if (typeof response === 'string') {
    // Try direct parse
    const num = parseFloat(response);
    if (!isNaN(num)) {
      return num;
    }
    
    // Try JSON parse (for wrapped values like { value: 5 })
    try {
      const parsed = JSON.parse(response);
      if (typeof parsed === 'number') {
        return parsed;
      }
      if (typeof parsed === 'object' && parsed?.value !== undefined) {
        const val = parseFloat(parsed.value);
        return isNaN(val) ? null : val;
      }
    } catch {
      // Not JSON
    }
  }
  
  return null;
}

/**
 * Calculate statistics from a set of values
 */
function calculateStatistics(values: number[]): {
  totalResponses: number;
  mean: number;
  stdDeviation: number;
  distribution: ResponseDistribution;
} {
  const n = values.length;
  if (n === 0) {
    return {
      totalResponses: 0,
      mean: 0,
      stdDeviation: 0,
      distribution: {},
    };
  }

  // Calculate mean
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  // Calculate standard deviation
  const squaredDiffs = values.map(v => (v - mean) ** 2);
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
  const stdDeviation = Math.sqrt(variance);

  // Calculate distribution
  const distribution: ResponseDistribution = {};
  for (const v of values) {
    const key = String(Math.round(v));
    distribution[key] = (distribution[key] || 0) + 1;
  }

  return {
    totalResponses: n,
    mean: Math.round(mean * 1000) / 1000, // Round to 3 decimals
    stdDeviation: Math.round(stdDeviation * 1000) / 1000,
    distribution,
  };
}

/**
 * Merge new values into existing statistics using Welford's algorithm variant
 */
function mergeStatistics(
  existingN: number,
  existingMean: number | null,
  existingStd: number | null,
  existingDist: ResponseDistribution,
  newValues: number[]
): {
  totalResponses: number;
  mean: number;
  stdDeviation: number;
  distribution: ResponseDistribution;
} {
  // If no existing data, just calculate fresh
  if (!existingN || existingMean === null) {
    return calculateStatistics(newValues);
  }

  const n1 = existingN;
  const n2 = newValues.length;
  const nTotal = n1 + n2;

  // Calculate new mean using weighted average
  const newSum = newValues.reduce((a, b) => a + b, 0);
  const newMean = newSum / n2;
  const combinedMean = (existingMean * n1 + newSum) / nTotal;

  // Calculate combined variance using parallel algorithm
  // Var(combined) = (n1*var1 + n2*var2 + n1*(mean1-combinedMean)² + n2*(mean2-combinedMean)²) / nTotal
  const existingVar = (existingStd || 0) ** 2;
  const newVar = newValues.map(v => (v - newMean) ** 2).reduce((a, b) => a + b, 0) / n2;
  
  const combinedVar = (
    n1 * existingVar + 
    n2 * newVar + 
    n1 * (existingMean - combinedMean) ** 2 + 
    n2 * (newMean - combinedMean) ** 2
  ) / nTotal;
  
  const combinedStd = Math.sqrt(combinedVar);

  // Merge distributions
  const combinedDist: ResponseDistribution = { ...existingDist };
  for (const v of newValues) {
    const key = String(Math.round(v));
    combinedDist[key] = (combinedDist[key] || 0) + 1;
  }

  return {
    totalResponses: nTotal,
    mean: Math.round(combinedMean * 1000) / 1000,
    stdDeviation: Math.round(combinedStd * 1000) / 1000,
    distribution: combinedDist,
  };
}

/**
 * Get statistics for a specific question
 */
export async function getQuestionStatistics(questionId: string): Promise<{
  total_responses: number;
  mean_response: number | null;
  std_deviation: number | null;
  response_distribution: ResponseDistribution;
} | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('question_statistics')
      .select('*')
      .eq('question_id', questionId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      total_responses: data.total_responses,
      mean_response: data.mean_response,
      std_deviation: data.std_deviation,
      response_distribution: data.response_distribution || {},
    };
  } catch (err) {
    console.error('Error fetching question statistics:', err);
    return null;
  }
}

/**
 * Bulk get statistics for multiple questions (efficient for calibration)
 */
export async function getBulkQuestionStatistics(questionIds: string[]): Promise<Map<string, {
  total_responses: number;
  mean_response: number | null;
  std_deviation: number | null;
  response_distribution: ResponseDistribution;
}>> {
  const result = new Map();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || questionIds.length === 0) {
    return result;
  }

  try {
    const { data, error } = await supabase
      .from('question_statistics')
      .select('*')
      .in('question_id', questionIds);

    if (error) {
      console.error('Error fetching bulk question statistics:', error);
      return result;
    }

    for (const row of data || []) {
      result.set(row.question_id, {
        total_responses: row.total_responses,
        mean_response: row.mean_response,
        std_deviation: row.std_deviation,
        response_distribution: row.response_distribution || {},
      });
    }

    return result;
  } catch (err) {
    console.error('Exception fetching bulk question statistics:', err);
    return result;
  }
}

