/**
 * Assessment Code System for B2B
 * 
 * Allows companies to purchase bulk codes and distribute them to candidates/employees.
 * Each code unlocks Premium Report features for the person who redeems it.
 */

import { supabase } from "./supabase";

export interface AssessmentCode {
  id: string;
  code: string;
  organizationId: string;
  organizationName: string;
  isRedeemed: boolean;
  redeemedBy: string | null;
  redeemedAt: Date | null;
  createdAt: Date;
  expiresAt: Date | null;
  unlocksFeatures: string[];
}

export interface CodePack {
  id: string;
  organizationId: string;
  totalCodes: number;
  usedCodes: number;
  purchasedAt: Date;
  expiresAt: Date | null;
  stripePaymentId: string | null;
}

/**
 * Generate a unique, easy-to-type assessment code
 * Format: XXXX-XXXX-XXXX (12 characters)
 */
export function generateAssessmentCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0, O, 1, I)
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate and redeem an assessment code
 */
export async function redeemAssessmentCode(
  code: string, 
  userId: string
): Promise<{
  success: boolean;
  error?: string;
  organizationName?: string;
  features?: string[];
}> {
  try {
    // Normalize code (uppercase, remove spaces and dashes for lookup)
    const normalizedCode = code.toUpperCase().replace(/[-\s]/g, '');
    
    // Look up the code
    const { data: codeRecord, error: lookupError } = await supabase
      .from('assessment_codes')
      .select('*')
      .eq('code_normalized', normalizedCode)
      .single();

    if (lookupError || !codeRecord) {
      return { success: false, error: 'Invalid code. Please check and try again.' };
    }

    // Check if already redeemed
    if (codeRecord.is_redeemed) {
      return { success: false, error: 'This code has already been used.' };
    }

    // Check if expired
    if (codeRecord.expires_at && new Date(codeRecord.expires_at) < new Date()) {
      return { success: false, error: 'This code has expired.' };
    }

    // Redeem the code
    const { error: redeemError } = await supabase
      .from('assessment_codes')
      .update({
        is_redeemed: true,
        redeemed_by: userId,
        redeemed_at: new Date().toISOString(),
      })
      .eq('id', codeRecord.id);

    if (redeemError) {
      return { success: false, error: 'Failed to redeem code. Please try again.' };
    }

    // Create premium unlock for user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (user) {
      await supabase.from('premium_unlocks').insert({
        user_id: user.id,
        unlock_method: 'assessment_code',
        features: codeRecord.unlocks_features || ['premium_report'],
        source_organization_id: codeRecord.organization_id,
        expires_at: null, // Assessment code unlocks don't expire
      });
    }

    // Update code pack usage count
    await supabase.rpc('increment_code_pack_usage', {
      pack_id: codeRecord.pack_id,
    });

    return {
      success: true,
      organizationName: codeRecord.organization_name,
      features: codeRecord.unlocks_features || ['premium_report'],
    };
  } catch (error) {
    console.error('Code redemption error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Get codes for an organization (for admin dashboard)
 */
export async function getOrganizationCodes(
  organizationId: string
): Promise<AssessmentCode[]> {
  const { data, error } = await supabase
    .from('assessment_codes')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(code => ({
    id: code.id,
    code: code.code_display,
    organizationId: code.organization_id,
    organizationName: code.organization_name,
    isRedeemed: code.is_redeemed,
    redeemedBy: code.redeemed_by,
    redeemedAt: code.redeemed_at ? new Date(code.redeemed_at) : null,
    createdAt: new Date(code.created_at),
    expiresAt: code.expires_at ? new Date(code.expires_at) : null,
    unlocksFeatures: code.unlocks_features || [],
  }));
}

/**
 * Get code pack usage summary
 */
export async function getCodePackSummary(
  organizationId: string
): Promise<{
  totalCodes: number;
  usedCodes: number;
  availableCodes: number;
  recentRedemptions: Array<{
    redeemedAt: Date;
    userEmail: string;
  }>;
}> {
  // Get all packs for org
  const { data: packs } = await supabase
    .from('code_packs')
    .select('total_codes, used_codes')
    .eq('organization_id', organizationId);

  const totalCodes = packs?.reduce((sum, p) => sum + p.total_codes, 0) || 0;
  const usedCodes = packs?.reduce((sum, p) => sum + p.used_codes, 0) || 0;

  // Get recent redemptions
  const { data: redemptions } = await supabase
    .from('assessment_codes')
    .select('redeemed_at, redeemed_by')
    .eq('organization_id', organizationId)
    .eq('is_redeemed', true)
    .order('redeemed_at', { ascending: false })
    .limit(10);

  return {
    totalCodes,
    usedCodes,
    availableCodes: totalCodes - usedCodes,
    recentRedemptions: redemptions?.map(r => ({
      redeemedAt: new Date(r.redeemed_at),
      userEmail: r.redeemed_by || 'Unknown',
    })) || [],
  };
}

