/**
 * Admin configuration and utilities
 * Master admins bypass all paywalls and have full access
 */

// Master admin emails - these users get full access to everything
const MASTER_ADMIN_EMAILS = [
  "dean@beanstalkconsulting.co",
  // Add more admin emails as needed
];

/**
 * Check if an email belongs to a master admin
 */
export function isMasterAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return MASTER_ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Check if a user ID belongs to a master admin (requires API call)
 */
export async function checkMasterAdminStatus(clerkId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/check?userId=${clerkId}`);
    if (response.ok) {
      const data = await response.json();
      return data.isAdmin === true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Admin feature flags
 */
export const ADMIN_FEATURES = {
  // Full access to all premium features
  fullPremiumAccess: true,
  // Bypass all payment requirements
  bypassPaywall: true,
  // Access to admin dashboard (future)
  adminDashboard: true,
  // Can grant credits to users (future)
  canGrantCredits: true,
  // Can view all users' results (future)
  canViewAllResults: true,
};

export type AdminFeatures = typeof ADMIN_FEATURES;


