import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProviderWrapper } from "@/components/providers/ClerkProviderWrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://prism7test.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PRISM-7 | Scientific Personality Assessment",
    template: "%s | PRISM-7",
  },
  description: "Discover your authentic self with PRISM-7, a scientifically validated personality assessment built on the HEXACO+ model. Get accurate, dimensional insights with confidence intervals - not vague categories.",
  keywords: [
    "personality test",
    "personality assessment",
    "HEXACO",
    "Big Five",
    "scientific personality test",
    "personality psychology",
    "self-discovery",
    "career assessment",
    "team building",
    "personality traits",
    "PRISM-7",
    "dimensional personality",
    "reliable personality test",
  ],
  authors: [{ name: "PRISM-7" }],
  creator: "PRISM-7",
  publisher: "PRISM-7",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "PRISM-7",
    title: "PRISM-7 | Scientific Personality Assessment",
    description: "Discover your authentic self with PRISM-7, a scientifically validated personality assessment. Get accurate, dimensional insights - not vague categories.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PRISM-7 - Scientific Personality Assessment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PRISM-7 | Scientific Personality Assessment",
    description: "Discover your authentic self with PRISM-7, a scientifically validated personality assessment.",
    images: ["/og-image.png"],
    creator: "@prism7test",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here after setup
    // google: "your-google-verification-code",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <ClerkProviderWrapper>
            {children}
          </ClerkProviderWrapper>
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
