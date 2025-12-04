// Force dynamic rendering for all business routes (requires auth)
export const dynamic = 'force-dynamic';

// Simple layout wrapper for business routes
export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
