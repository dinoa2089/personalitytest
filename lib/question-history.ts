/**
 * Question History Tracking
 * 
 * Functions to track which questions users have seen and answered.
 * Enables variety across retakes and supports IRT calibration.
 */

import { supabase } from './supabase';

export interface QuestionHistoryEntry {
  user_id: string;
  question_id: string;
  session_id?: string;
  response_value?: number;
  response_time_ms?: number;
}

/**
 * Record a question that was shown/answered by a user
 */
export async function recordQuestionHistory(entry: QuestionHistoryEntry): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Supabase not configured - return success (graceful degradation)
    return true;
  }

  try {
    const { error } = await supabase
      .from('user_question_history')
      .upsert({
        user_id: entry.user_id,
        question_id: entry.question_id,
        session_id: entry.session_id || null,
        response_value: entry.response_value ?? null,
        response_time_ms: entry.response_time_ms ?? null,
        answered_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,question_id,session_id'
      });

    if (error) {
      console.error('Error recording question history:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception recording question history:', err);
    return false;
  }
}

/**
 * Record multiple questions in batch (more efficient)
 */
export async function recordQuestionHistoryBatch(entries: QuestionHistoryEntry[]): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || entries.length === 0) {
    return true;
  }

  try {
    const records = entries.map(entry => ({
      user_id: entry.user_id,
      question_id: entry.question_id,
      session_id: entry.session_id || null,
      response_value: entry.response_value ?? null,
      response_time_ms: entry.response_time_ms ?? null,
      answered_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('user_question_history')
      .upsert(records, {
        onConflict: 'user_id,question_id,session_id'
      });

    if (error) {
      console.error('Error recording question history batch:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception recording question history batch:', err);
    return false;
  }
}

/**
 * Get IDs of questions a user has previously answered
 */
export async function getSeenQuestionIds(userId: string): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('user_question_history')
      .select('question_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching seen questions:', error);
      return [];
    }

    // Return unique question IDs
    return [...new Set(data.map(row => row.question_id))];
  } catch (err) {
    console.error('Exception fetching seen questions:', err);
    return [];
  }
}

/**
 * Get detailed history for a user (with response data)
 */
export async function getUserQuestionHistory(userId: string, limit = 100): Promise<{
  question_id: string;
  session_id: string | null;
  response_value: number | null;
  response_time_ms: number | null;
  answered_at: string;
}[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('user_question_history')
      .select('question_id, session_id, response_value, response_time_ms, answered_at')
      .eq('user_id', userId)
      .order('answered_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user question history:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception fetching user question history:', err);
    return [];
  }
}

/**
 * Increment the response_count on a question
 */
export async function incrementQuestionResponseCount(questionId: string): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return true;
  }

  try {
    // Use RPC or direct increment
    const { error } = await supabase.rpc('increment_response_count', { 
      question_uuid: questionId 
    });

    // If RPC doesn't exist, fall back to select+update
    if (error?.code === 'PGRST202') {
      // RPC not found, use manual increment
      const { data: current } = await supabase
        .from('questions')
        .select('response_count')
        .eq('id', questionId)
        .single();

      const currentCount = current?.response_count || 0;

      const { error: updateError } = await supabase
        .from('questions')
        .update({ response_count: currentCount + 1 })
        .eq('id', questionId);

      if (updateError) {
        console.error('Error incrementing response count:', updateError);
        return false;
      }
    } else if (error) {
      console.error('Error incrementing response count via RPC:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception incrementing response count:', err);
    return false;
  }
}

/**
 * Batch increment response counts for multiple questions
 */
export async function incrementResponseCountBatch(questionIds: string[]): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || questionIds.length === 0) {
    return true;
  }

  try {
    // Get current counts
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('id, response_count')
      .in('id', questionIds);

    if (fetchError) {
      console.error('Error fetching question counts:', fetchError);
      return false;
    }

    // Count occurrences of each question ID
    const countMap = new Map<string, number>();
    for (const qid of questionIds) {
      countMap.set(qid, (countMap.get(qid) || 0) + 1);
    }

    // Update each question
    const updates = (questions || []).map(q => ({
      id: q.id,
      response_count: (q.response_count || 0) + (countMap.get(q.id) || 0),
    }));

    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('questions')
        .upsert(updates, { onConflict: 'id' });

      if (updateError) {
        console.error('Error batch updating response counts:', updateError);
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error('Exception batch incrementing response counts:', err);
    return false;
  }
}

