/**
 * Subscription and premium feature utilities
 */
import { supabase } from "./supabase";

export type SubscriptionPlan = "free" | "premium" | "professional" | "enterprise";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";
export type PremiumUnlockMethod = "paid" | "referral" | "trial" | "promo";

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeSubscriptionId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * Check if user has active premium subscription or unlock
 */
export async function hasPremiumAccess(userId: string | null): Promise<boolean> {
  if (!userId) return false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return false;
  }

  try {
    // Get user's internal ID from Clerk ID
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!user) return false;

    // Check for active subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("plan", ["premium", "professional", "enterprise"])
      .single();

    if (subscription) return true;

    // Check for premium unlock (referral, trial, etc.)
    const { data: unlock } = await supabase
      .from("premium_unlocks")
      .select("*")
      .eq("user_id", user.id)
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
      .order("unlocked_at", { ascending: false })
      .limit(1)
      .single();

    return !!unlock;
  } catch (error) {
    console.error("Error checking premium access:", error);
    return false;
  }
}

/**
 * Get user's subscription
 */
export async function getUserSubscription(userId: string | null): Promise<Subscription | null> {
  if (!userId) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  try {
    // Get user's internal ID from Clerk ID
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!user) return null;

    // Get subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!subscription) return null;

    return {
      id: subscription.id,
      userId: subscription.user_id,
      plan: subscription.plan as SubscriptionPlan,
      status: subscription.status as SubscriptionStatus,
      stripeSubscriptionId: subscription.stripe_subscription_id,
      currentPeriodStart: subscription.current_period_start
        ? new Date(subscription.current_period_start)
        : null,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
    };
  } catch (error) {
    console.error("Error getting subscription:", error);
    return null;
  }
}

/**
 * Check if feature is available for user's plan
 */
export function isFeatureAvailable(
  feature: string,
  plan: SubscriptionPlan
): boolean {
  const featurePlanMap: Record<string, SubscriptionPlan[]> = {
    // Free features
    basic_assessment: ["free", "premium", "professional", "enterprise"],
    basic_results: ["free", "premium", "professional", "enterprise"],
    share_results: ["free", "premium", "professional", "enterprise"],

    // Premium features
    pdf_export: ["premium", "professional", "enterprise"],
    comparison_reports: ["premium", "professional", "enterprise"],
    detailed_insights: ["premium", "professional", "enterprise"],
    contextual_modules: ["premium", "professional", "enterprise"],
    development_plans: ["premium", "professional", "enterprise"],
    ad_free: ["premium", "professional", "enterprise"],

    // Professional features
    client_management: ["professional", "enterprise"],
    bulk_assessments: ["professional", "enterprise"],
    white_label: ["professional", "enterprise"],
    api_access: ["professional", "enterprise"],

    // Enterprise features
    custom_integrations: ["enterprise"],
    dedicated_support: ["enterprise"],
    on_premise: ["enterprise"],
  };

  const allowedPlans = featurePlanMap[feature] || [];
  return allowedPlans.includes(plan);
}

/**
 * Check if user has premium unlock (via referral or other method)
 */
export async function hasPremiumUnlock(userId: string | null): Promise<{
  hasUnlock: boolean;
  method: PremiumUnlockMethod | null;
  expiresAt: Date | null;
}> {
  if (!userId) {
    return { hasUnlock: false, method: null, expiresAt: null };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { hasUnlock: false, method: null, expiresAt: null };
  }

  try {
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return { hasUnlock: false, method: null, expiresAt: null };
    }

    const { data: unlock } = await supabase
      .from("premium_unlocks")
      .select("*")
      .eq("user_id", user.id)
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
      .order("unlocked_at", { ascending: false })
      .limit(1)
      .single();

    if (!unlock) {
      return { hasUnlock: false, method: null, expiresAt: null };
    }

    return {
      hasUnlock: true,
      method: unlock.unlock_method as PremiumUnlockMethod,
      expiresAt: unlock.expires_at ? new Date(unlock.expires_at) : null,
    };
  } catch (error) {
    console.error("Error checking premium unlock:", error);
    return { hasUnlock: false, method: null, expiresAt: null };
  }
}

