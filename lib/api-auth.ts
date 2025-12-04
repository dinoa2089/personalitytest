/**
 * API Authentication & Rate Limiting
 * Handles API key generation, validation, and usage tracking
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import crypto from "crypto";

// ============================================================================
// Types
// ============================================================================

export interface ApiKeyData {
  id: string;
  user_id: string;
  tier: ApiTier;
  is_active: boolean;
}

export type ApiTier = "api_starter" | "professional" | "enterprise";

// Rate limits per tier (requests per month)
export const RATE_LIMITS: Record<ApiTier, number> = {
  api_starter: 1000,
  professional: 500,
  enterprise: 10000,
};

// ============================================================================
// Supabase Client (Service Role)
// ============================================================================

function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase configuration missing for API authentication");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ============================================================================
// API Key Generation
// ============================================================================

/**
 * Generates a new API key for a user
 * @param userId - The user's UUID from the users table
 * @param tier - The API tier (api_starter, professional, enterprise)
 * @returns The full API key (only returned once, store it securely!)
 */
export async function generateApiKey(
  userId: string,
  tier: ApiTier = "api_starter"
): Promise<{ apiKey: string; keyPrefix: string; keyId: string }> {
  const supabase = getSupabaseAdmin();

  // Generate a secure random key
  const randomBytes = crypto.randomBytes(32);
  const keyBody = randomBytes.toString("base64url");
  
  // Format: sk_live_<base64url_random>
  const fullKey = `sk_live_${keyBody}`;
  const keyPrefix = fullKey.substring(0, 12); // "sk_live_XXXX"
  
  // Hash the full key for storage (SHA-256)
  const keyHash = crypto.createHash("sha256").update(fullKey).digest("hex");

  // Store in database
  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      user_id: userId,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      tier: tier,
      is_active: true,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error generating API key:", error);
    throw new Error(`Failed to generate API key: ${error.message}`);
  }

  return {
    apiKey: fullKey,
    keyPrefix: keyPrefix,
    keyId: data.id,
  };
}

// ============================================================================
// API Key Validation
// ============================================================================

/**
 * Validates an API key from the request
 * @param request - The incoming Next.js request
 * @returns The API key data if valid
 * @throws Error if invalid or missing
 */
export async function validateApiKey(request: NextRequest): Promise<ApiKeyData> {
  // Extract bearer token from Authorization header
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader) {
    throw new ApiAuthError("Missing Authorization header", 401);
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiAuthError("Invalid Authorization format. Use: Bearer <api_key>", 401);
  }

  const apiKey = authHeader.substring(7); // Remove "Bearer " prefix

  if (!apiKey || !apiKey.startsWith("sk_")) {
    throw new ApiAuthError("Invalid API key format", 401);
  }

  // Hash the provided key
  const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

  // Look up in database
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, user_id, tier, is_active")
    .eq("key_hash", keyHash)
    .single();

  if (error || !data) {
    throw new ApiAuthError("Invalid API key", 401);
  }

  if (!data.is_active) {
    throw new ApiAuthError("API key has been deactivated", 401);
  }

  return {
    id: data.id,
    user_id: data.user_id,
    tier: data.tier as ApiTier,
    is_active: data.is_active,
  };
}

// ============================================================================
// Rate Limiting
// ============================================================================

/**
 * Checks if the user has exceeded their rate limit
 * @param userId - The user's UUID
 * @param tier - The user's API tier
 * @throws Error if rate limit exceeded
 */
export async function checkRateLimit(userId: string, tier: ApiTier): Promise<{
  used: number;
  limit: number;
  remaining: number;
}> {
  const supabase = getSupabaseAdmin();
  const limit = RATE_LIMITS[tier];

  // Get the start of the current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get all API keys for this user
  const { data: keys } = await supabase
    .from("api_keys")
    .select("id")
    .eq("user_id", userId);

  if (!keys || keys.length === 0) {
    return { used: 0, limit, remaining: limit };
  }

  // Count API calls this month for this user's API keys
  const { count, error } = await supabase
    .from("api_usage_logs")
    .select("id", { count: "exact", head: true })
    .in("api_key_id", keys.map(k => k.id))
    .gte("created_at", monthStart.toISOString());

  if (error) {
    console.error("Error checking rate limit:", error);
    // On error, allow the request but log it
    return { used: 0, limit, remaining: limit };
  }

  const used = count || 0;
  const remaining = Math.max(0, limit - used);

  if (used >= limit) {
    throw new ApiAuthError(
      `Rate limit exceeded. Used ${used}/${limit} requests this month. Upgrade your plan for more.`,
      429
    );
  }

  return { used, limit, remaining };
}

/**
 * Alternative rate limit check using a direct query (more efficient)
 */
export async function checkRateLimitByApiKey(apiKeyId: string, tier: ApiTier): Promise<{
  used: number;
  limit: number;
  remaining: number;
}> {
  const supabase = getSupabaseAdmin();
  const limit = RATE_LIMITS[tier];

  // Get the start of the current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Count API calls this month for this specific API key
  const { count, error } = await supabase
    .from("api_usage_logs")
    .select("id", { count: "exact", head: true })
    .eq("api_key_id", apiKeyId)
    .gte("created_at", monthStart.toISOString());

  if (error) {
    console.error("Error checking rate limit:", error);
    return { used: 0, limit, remaining: limit };
  }

  const used = count || 0;
  const remaining = Math.max(0, limit - used);

  if (used >= limit) {
    throw new ApiAuthError(
      `Rate limit exceeded. Used ${used}/${limit} requests this month.`,
      429
    );
  }

  return { used, limit, remaining };
}

// ============================================================================
// Usage Logging
// ============================================================================

/**
 * Logs an API call to the usage logs table
 * @param apiKeyId - The API key UUID used for the request
 * @param endpoint - The API endpoint called
 * @param statusCode - The HTTP response status code
 * @param latencyMs - The request processing time in milliseconds
 */
export async function logApiCall(
  apiKeyId: string,
  endpoint: string,
  statusCode: number,
  latencyMs: number
): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("api_usage_logs").insert({
    api_key_id: apiKeyId,
    endpoint: endpoint.substring(0, 50), // Truncate to fit VARCHAR(50)
    status_code: statusCode,
    latency_ms: latencyMs,
  });

  if (error) {
    // Log but don't throw - usage logging shouldn't break the API
    console.error("Error logging API call:", error);
  }
}

// ============================================================================
// API Key Management
// ============================================================================

/**
 * Lists all API keys for a user (without the actual keys)
 */
export async function listApiKeys(userId: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, key_prefix, tier, is_active, created_at, last_used_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list API keys: ${error.message}`);
  }

  return data;
}

/**
 * Revokes (deactivates) an API key
 */
export async function revokeApiKey(keyId: string, userId: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("api_keys")
    .update({ is_active: false })
    .eq("id", keyId)
    .eq("user_id", userId); // Ensure user owns the key

  if (error) {
    throw new Error(`Failed to revoke API key: ${error.message}`);
  }
}

/**
 * Deletes an API key permanently
 */
export async function deleteApiKey(keyId: string, userId: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", keyId)
    .eq("user_id", userId); // Ensure user owns the key

  if (error) {
    throw new Error(`Failed to delete API key: ${error.message}`);
  }
}

/**
 * Gets usage statistics for a user
 */
export async function getUsageStats(userId: string, apiKeyId?: string) {
  const supabase = getSupabaseAdmin();

  // Get the start of the current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let keyIds: string[] = [];

  if (apiKeyId) {
    keyIds = [apiKeyId];
  } else {
    // Get all keys for user first
    const { data: keys } = await supabase
      .from("api_keys")
      .select("id")
      .eq("user_id", userId);
    
    if (keys && keys.length > 0) {
      keyIds = keys.map(k => k.id);
    }
  }

  if (keyIds.length === 0) {
    return {
      totalThisMonth: 0,
      totalToday: 0,
      avgLatencyMs: 0,
      errorRate: 0,
      byEndpoint: {},
    };
  }

  // Build query
  const { data, error } = await supabase
    .from("api_usage_logs")
    .select("id, endpoint, status_code, latency_ms, created_at")
    .in("api_key_id", keyIds)
    .gte("created_at", monthStart.toISOString());

  if (error) {
    throw new Error(`Failed to get usage stats: ${error.message}`);
  }

  // Calculate stats
  const logs = data || [];
  const todayLogs = logs.filter(l => new Date(l.created_at) >= dayStart);

  return {
    totalThisMonth: logs.length,
    totalToday: todayLogs.length,
    avgLatencyMs: logs.length > 0 
      ? Math.round(logs.reduce((sum, l) => sum + l.latency_ms, 0) / logs.length)
      : 0,
    errorRate: logs.length > 0
      ? Math.round((logs.filter(l => l.status_code >= 400).length / logs.length) * 100)
      : 0,
    byEndpoint: logs.reduce((acc, l) => {
      acc[l.endpoint] = (acc[l.endpoint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}

// ============================================================================
// Custom Error Class
// ============================================================================

export class ApiAuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "ApiAuthError";
    this.statusCode = statusCode;
  }
}

// ============================================================================
// Middleware Helper
// ============================================================================

/**
 * Validates API request and returns auth context
 * Use this in API route handlers
 */
export async function authenticateApiRequest(request: NextRequest): Promise<{
  apiKey: ApiKeyData;
  rateLimit: { used: number; limit: number; remaining: number };
}> {
  // Validate API key
  const apiKey = await validateApiKey(request);

  // Check rate limit
  const rateLimit = await checkRateLimitByApiKey(apiKey.id, apiKey.tier);

  return { apiKey, rateLimit };
}

