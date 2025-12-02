/**
 * Content Generation Script
 * 
 * Usage:
 *   npx ts-node scripts/generate-content.ts --framework prism --type innovator --topic learning
 *   npx ts-node scripts/generate-content.ts --framework mbti --type intj --topic careers
 *   npx ts-node scripts/generate-content.ts --framework enneagram --type 1 --topic stress
 *   npx ts-node scripts/generate-content.ts --all --framework prism --topic learning
 */

import * as fs from "fs";
import * as path from "path";
import { generateContent } from "../lib/openrouter";
import { 
  ContentTopic, 
  ContentFramework, 
  GeneratedContent, 
  ALL_TOPICS 
} from "../lib/content/types";
import { 
  generatePrompt, 
  getTypeContext,
  getPrismTypeIds,
  getMbtiTypeIds,
  getEnneagramTypeIds
} from "../lib/content/prompts";

// Load environment variables
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

interface GenerationArgs {
  framework: ContentFramework;
  type?: string;
  topic?: ContentTopic;
  all?: boolean;
  allTopics?: boolean;
}

function parseArgs(): GenerationArgs {
  const args = process.argv.slice(2);
  const result: GenerationArgs = { framework: "prism" };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--framework":
        result.framework = args[++i] as ContentFramework;
        break;
      case "--type":
        result.type = args[++i];
        break;
      case "--topic":
        result.topic = args[++i] as ContentTopic;
        break;
      case "--all":
        result.all = true;
        break;
      case "--all-topics":
        result.allTopics = true;
        break;
    }
  }

  return result;
}

function getTypeIds(framework: ContentFramework): string[] {
  switch (framework) {
    case "prism":
      return getPrismTypeIds();
    case "mbti":
      return getMbtiTypeIds();
    case "enneagram":
      return getEnneagramTypeIds();
  }
}

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getOutputPath(framework: ContentFramework, typeId: string, topic: ContentTopic): string {
  return path.join(
    __dirname,
    "..",
    "lib",
    "content",
    "generated",
    framework,
    `${typeId}-${topic}.json`
  );
}

async function generateContentForType(
  framework: ContentFramework,
  typeId: string,
  topic: ContentTopic
): Promise<GeneratedContent> {
  console.log(`\n📝 Generating ${topic} content for ${framework}/${typeId}...`);

  const context = getTypeContext(framework, typeId);
  const { system, user } = generatePrompt(topic, context);

  const startTime = Date.now();
  
  const response = await generateContent([
    { role: "system", content: system },
    { role: "user", content: user }
  ], {
    temperature: 0.7,
    maxTokens: 8000
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`   ⏱️  Generated in ${elapsed}s`);

  // Parse JSON from response
  let jsonStr = response;
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse response:", response.substring(0, 500));
    throw new Error("Failed to parse AI response as JSON");
  }

  // Build full content object
  const content: GeneratedContent = {
    id: `${typeId}-${topic}`,
    type: typeId,
    framework,
    topic,
    title: parsed.title,
    metaDescription: parsed.metaDescription,
    keywords: parsed.keywords || [],
    introduction: parsed.introduction,
    sections: parsed.sections || [],
    faqs: parsed.faqs || [],
    keyTakeaways: parsed.keyTakeaways || [],
    relatedTopics: ALL_TOPICS.filter(t => t !== topic),
    relatedTypes: [],
    generatedAt: new Date().toISOString(),
    model: "google/gemini-3-pro-preview",
    wordCount: countWords(parsed)
  };

  return content;
}

function countWords(obj: any): number {
  const text = JSON.stringify(obj);
  return text.split(/\s+/).length;
}

async function saveContent(content: GeneratedContent) {
  const outputPath = getOutputPath(content.framework, content.type, content.topic);
  ensureDirectoryExists(outputPath);
  
  fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));
  console.log(`   ✅ Saved to ${outputPath}`);
}

async function main() {
  const args = parseArgs();

  console.log("🚀 PRISM-7 Content Generator");
  console.log("============================");
  console.log(`Framework: ${args.framework}`);
  console.log(`Model: google/gemini-3-pro-preview`);

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY not found in environment");
    process.exit(1);
  }

  const typeIds = args.all ? getTypeIds(args.framework) : [args.type!];
  const topics = args.allTopics ? ALL_TOPICS : [args.topic!];

  if (!args.all && !args.type) {
    console.error("❌ Please specify --type or use --all");
    console.log("\nUsage:");
    console.log("  npx ts-node scripts/generate-content.ts --framework prism --type innovator --topic learning");
    console.log("  npx ts-node scripts/generate-content.ts --all --framework prism --topic learning");
    console.log("  npx ts-node scripts/generate-content.ts --framework mbti --type intj --all-topics");
    process.exit(1);
  }

  if (!args.allTopics && !args.topic) {
    console.error("❌ Please specify --topic or use --all-topics");
    process.exit(1);
  }

  console.log(`\nGenerating content for ${typeIds.length} type(s) × ${topics.length} topic(s) = ${typeIds.length * topics.length} pages`);

  let successCount = 0;
  let errorCount = 0;

  for (const typeId of typeIds) {
    for (const topic of topics) {
      try {
        const content = await generateContentForType(args.framework, typeId, topic);
        await saveContent(content);
        successCount++;
      } catch (error) {
        console.error(`   ❌ Error generating ${typeId}/${topic}:`, error);
        errorCount++;
      }

      // Rate limiting - wait between requests
      if (typeIds.length * topics.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  console.log("\n============================");
  console.log(`✅ Successfully generated: ${successCount}`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount}`);
  }
}

main().catch(console.error);

