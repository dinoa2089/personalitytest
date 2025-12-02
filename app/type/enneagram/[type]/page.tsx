import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEnneagramTypeContent, getAllEnneagramTypes } from "@/lib/enneagram-content";
import { EnneagramTypePageClient } from "./EnneagramTypePageClient";

interface EnneagramTypePageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: EnneagramTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const content = getEnneagramTypeContent(type);
  
  if (!content) {
    return { title: "Type Not Found" };
  }

  const title = `Enneagram Type ${content.number}: ${content.name} | Free Test`;
  const description = `Are you an Enneagram Type ${content.number}? ${content.tagline}. Learn about ${content.name}'s core fears, desires, growth paths, and take our scientifically-validated personality test.`;

  return {
    title,
    description,
    keywords: [
      `enneagram type ${content.number}`,
      `enneagram ${content.number}`,
      content.name.toLowerCase(),
      `enneagram ${content.name.toLowerCase()}`,
      "enneagram test",
      "enneagram personality",
      "personality test",
      "free personality test",
      `type ${content.number} enneagram`,
    ],
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  return getAllEnneagramTypes().map((type) => ({ type }));
}

export default async function EnneagramTypePage({ params }: EnneagramTypePageProps) {
  const { type } = await params;
  const content = getEnneagramTypeContent(type);

  if (!content) {
    notFound();
  }

  return <EnneagramTypePageClient content={content} />;
}

