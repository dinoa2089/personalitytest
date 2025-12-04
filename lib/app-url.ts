/**
 * Get the application URL, using Vercel's automatic URL detection when available
 * This eliminates the need for NEXT_PUBLIC_APP_URL environment variable
 */
export function getAppUrl(): string {
  // In Vercel, use the automatic VERCEL_URL (server-side only)
  if (typeof window === 'undefined' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback to NEXT_PUBLIC_APP_URL if set
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Default fallback
  return process.env.NODE_ENV === 'production' 
    ? 'https://personalitytest.vercel.app' // Will be updated after first deployment
    : 'http://localhost:3000';
}






