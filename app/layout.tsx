import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProviderWrapper } from "@/components/providers/ClerkProviderWrapper";
import { GlobalStructuredData } from "@/components/seo/StructuredData";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Optimize font loading for Core Web Vitals
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
      <head>
        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://upload.wikimedia.org" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* DNS Prefetch for image CDNs */}
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <GlobalStructuredData />
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
