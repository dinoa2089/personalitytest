import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMBTITypeContent, getAllMBTITypes } from "@/lib/mbti-content";
import { MBTITypePageClient } from "./MBTITypePageClient";

interface MBTITypePageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: MBTITypePageProps): Promise<Metadata> {
  const { type } = await params;
  const content = getMBTITypeContent(type);
  
  if (!content) {
    return { title: "Type Not Found" };
  }

  const title = `${content.code} Personality Type: ${content.nickname} | Free Test`;
  const description = `Are you an ${content.code}? ${content.tagline}. Learn about ${content.nickname} strengths, careers, relationships, and take our scientifically-validated personality test.`;

  return {
    title,
    description,
    keywords: [
      `${content.code} personality`,
      `${content.code} personality type`,
      `${content.nickname}`,
      `${content.code} careers`,
      `${content.code} relationships`,
      `${content.code} strengths`,
      `${content.code} weaknesses`,
      "MBTI",
      "Myers-Briggs",
      "personality test",
      "free personality test",
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
  return getAllMBTITypes().map((type) => ({ type }));
}

export default async function MBTITypePage({ params }: MBTITypePageProps) {
  const { type } = await params;
  const content = getMBTITypeContent(type);

  if (!content) {
    notFound();
  }

  return <MBTITypePageClient content={content} />;
}

