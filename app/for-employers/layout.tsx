import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://prism7test.com";

export const metadata: Metadata = {
  title: "Hire Better with Personality Science | PRISM-7 for Employers",
  description: "Make smarter hiring decisions with PRISM-7. Our HEXACO-based personality assessment helps you evaluate job fit and build stronger teams. Science-backed, 15-minute assessment.",
  keywords: [
    "hiring assessment",
    "pre-employment personality test",
    "candidate screening",
    "job fit assessment",
    "reduce turnover",
    "hiring software",
    "talent assessment",
    "recruitment tools",
    "personality hiring",
    "team building",
    "candidate ranking",
    "HR tech",
    "employee screening",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/for-employers`,
    siteName: "PRISM-7",
    title: "Hire Better with Personality Science | PRISM-7 for Employers",
    description: "Make smarter hiring decisions with science-backed personality assessment. HEXACO-based, 15-minute evaluation.",
    images: [
      {
        url: "/og-employers.png",
        width: 1200,
        height: 630,
        alt: "PRISM-7 for Employers - Hire with Confidence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Better with Personality Science | PRISM-7",
    description: "Stop losing $240,000 on bad hires. AI-powered assessments that predict job fit.",
    images: ["/og-employers.png"],
  },
  alternates: {
    canonical: `${siteUrl}/for-employers`,
  },
};

// Structured data for the business landing page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "PRISM-7 for Employers",
  description: "Science-backed personality assessment platform for hiring. HEXACO-based evaluation to help make informed hiring decisions.",
  brand: {
    "@type": "Brand",
    name: "PRISM-7",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "10",
    highPrice: "15",
    offerCount: "3",
    offers: [
      {
        "@type": "Offer",
        name: "Pay As You Go",
        price: "15",
        priceCurrency: "USD",
        description: "Per assessment pricing for occasional hiring",
      },
      {
        "@type": "Offer",
        name: "Credit Packs",
        price: "10",
        priceCurrency: "USD",
        description: "Bulk assessment credits with 33% savings",
      },
    ],
  },
};

export default function ForEmployersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main>{children}</main>
      {/* Footer is rendered conditionally by the page component based on auth state */}
    </>
  );
}
