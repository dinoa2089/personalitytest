// Force dynamic rendering for employer routes (may require auth)
export const dynamic = 'force-dynamic';

export default function ForEmployersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
