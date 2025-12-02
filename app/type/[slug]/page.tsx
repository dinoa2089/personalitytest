import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTypePageContent, getAllTypeSlugs } from "@/lib/type-content";
import { archetypes } from "@/lib/archetypes";
import { TypePageClient } from "./TypePageClient";

interface TypePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TypePageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getTypePageContent(slug);
  
  if (!content) {
    return { title: "Type Not Found" };
  }

  return {
    title: content.seoTitle,
    description: content.seoDescription,
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
      type: "website",
      images: [
        {
          url: `/api/og/type/${slug}`,
          width: 1200,
          height: 630,
          alt: `${content.archetype.name} Personality Type`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seoTitle,
      description: content.seoDescription,
    },
  };
}

export async function generateStaticParams() {
  return getAllTypeSlugs().map((slug) => ({ slug }));
}

export default async function TypePage({ params }: TypePageProps) {
  const { slug } = await params;
  const content = getTypePageContent(slug);

  if (!content) {
    notFound();
  }

  // Get related archetypes
  const relatedArchetypes = content.relatedTypes
    .map(id => archetypes.find(a => a.id === id))
    .filter(Boolean);

  return <TypePageClient content={content} relatedArchetypes={relatedArchetypes} />;
}

