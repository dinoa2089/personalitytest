import { notFound } from "next/navigation";
import { Metadata } from "next";
import { TopicPage } from "@/components/content/TopicPage";
import { enneagramTypes } from "@/lib/enneagram-content";
import { ALL_TOPICS, ContentTopic, GeneratedContent } from "@/lib/content/types";
import * as fs from "fs";
import * as path from "path";

interface PageProps {
  params: Promise<{
    type: string;
    topic: string;
  }>;
}

// Get content from generated files
function getContent(typeId: string, topic: ContentTopic): GeneratedContent | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "lib",
      "content",
      "generated",
      "enneagram",
      `${typeId}-${topic}.json`
    );
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as GeneratedContent;
  } catch (error) {
    console.error(`Error loading content for ${typeId}/${topic}:`, error);
    return null;
  }
}

export async function generateStaticParams() {
  const params: { type: string; topic: string }[] = [];
  
  for (const typeId of Object.keys(enneagramTypes)) {
    for (const topic of ALL_TOPICS) {
      params.push({
        type: typeId,
        topic: topic
      });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, topic } = await params;
  
  const enneaType = enneagramTypes[type];
  if (!enneaType) {
    return { title: "Not Found" };
  }
  
  const content = getContent(type, topic as ContentTopic);
  
  if (content) {
    return {
      title: content.title,
      description: content.metaDescription,
      keywords: content.keywords.join(", "),
      openGraph: {
        title: content.title,
        description: content.metaDescription,
        type: "article"
      }
    };
  }
  
  // Fallback metadata if content not generated yet
  const topicNames: Record<string, string> = {
    learning: "Learning Style",
    careers: "Career Guide",
    relationships: "Relationships",
    communication: "Communication Style",
    stress: "Stress & Coping",
    leadership: "Leadership Style",
    growth: "Personal Growth",
    workplace: "At Work",
    compatibility: "Compatibility"
  };
  
  return {
    title: `Enneagram Type ${enneaType.number} ${topicNames[topic] || topic} | PRISM-7`,
    description: `Discover the ${topicNames[topic]?.toLowerCase() || topic} of Enneagram Type ${enneaType.number} (${enneaType.name}). ${enneaType.tagline}`
  };
}

export default async function EnneagramTopicPage({ params }: PageProps) {
  const { type, topic } = await params;
  
  // Validate Enneagram type exists
  const enneaType = enneagramTypes[type];
  if (!enneaType) {
    notFound();
  }
  
  // Validate topic exists
  if (!ALL_TOPICS.includes(topic as ContentTopic)) {
    notFound();
  }
  
  // Get generated content
  const content = getContent(type, topic as ContentTopic);
  
  if (!content) {
    // Content not yet generated - show placeholder
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Content Coming Soon</h1>
          <p className="text-muted-foreground">
            The {topic} guide for Type {enneaType.number} is being prepared.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <TopicPage
      content={content}
      typeName={`Type ${enneaType.number} - ${enneaType.name}`}
      typeSlug={type}
      framework="enneagram"
    />
  );
}

