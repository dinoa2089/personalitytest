/**
 * Batch Content Generation Script
 * Generates all content pages in parallel with rate limiting
 * 
 * Usage: npx tsx scripts/generate-all-content.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

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

// Configuration
const PARALLEL_REQUESTS = 10; // Number of parallel requests
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds between batches
const DELAY_BETWEEN_REQUESTS = 500; // 0.5 second stagger within batch

interface GenerationTask {
  framework: ContentFramework;
  typeId: string;
  topic: ContentTopic;
}

function getTypeIds(framework: ContentFramework): string[] {
  switch (framework) {
    case "prism": return getPrismTypeIds();
    case "mbti": return getMbtiTypeIds();
    case "enneagram": return getEnneagramTypeIds();
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

function contentExists(framework: ContentFramework, typeId: string, topic: ContentTopic): boolean {
  const filePath = getOutputPath(framework, typeId, topic);
  return fs.existsSync(filePath);
}

async function generateContentForType(
  framework: ContentFramework,
  typeId: string,
  topic: ContentTopic
): Promise<GeneratedContent | null> {
  try {
    const context = getTypeContext(framework, typeId);
    const { system, user } = generatePrompt(topic, context);

    const response = await generateContent([
      { role: "system", content: system },
      { role: "user", content: user }
    ], {
      temperature: 0.7,
      maxTokens: 10000
    });

    // Parse JSON from response
    let jsonStr = response;
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

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
  } catch (error) {
    console.error(`Error generating ${framework}/${typeId}/${topic}:`, error);
    return null;
  }
}

function countWords(obj: any): number {
  const text = JSON.stringify(obj);
  return text.split(/\s+/).length;
}

async function saveContent(content: GeneratedContent) {
  const outputPath = getOutputPath(content.framework, content.type, content.topic);
  ensureDirectoryExists(outputPath);
  fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processBatch(tasks: GenerationTask[], batchNum: number, totalBatches: number): Promise<{ success: number; failed: number }> {
  console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${tasks.length} tasks)`);
  
  let success = 0;
  let failed = 0;

  const promises = tasks.map(async (task, index) => {
    // Stagger requests within batch
    await sleep(index * DELAY_BETWEEN_REQUESTS);
    
    const startTime = Date.now();
    console.log(`   🔄 ${task.framework}/${task.typeId}/${task.topic}...`);
    
    const content = await generateContentForType(task.framework, task.typeId, task.topic);
    
    if (content) {
      await saveContent(content);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`   ✅ ${task.framework}/${task.typeId}/${task.topic} (${elapsed}s, ${content.wordCount} words)`);
      return true;
    } else {
      console.log(`   ❌ ${task.framework}/${task.typeId}/${task.topic} FAILED`);
      return false;
    }
  });

  const results = await Promise.all(promises);
  success = results.filter(r => r).length;
  failed = results.filter(r => !r).length;

  return { success, failed };
}

async function main() {
  console.log("🚀 PRISM-7 Batch Content Generator");
  console.log("===================================");
  console.log(`Model: google/gemini-3-pro-preview`);
  console.log(`Parallel requests: ${PARALLEL_REQUESTS}`);
  console.log(`Batch delay: ${DELAY_BETWEEN_BATCHES}ms`);

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY not found");
    process.exit(1);
  }

  // Build task list
  const allTasks: GenerationTask[] = [];
  const frameworks: ContentFramework[] = ["prism", "mbti", "enneagram"];

  for (const framework of frameworks) {
    const typeIds = getTypeIds(framework);
    for (const typeId of typeIds) {
      for (const topic of ALL_TOPICS) {
        // Skip if already generated
        if (!contentExists(framework, typeId, topic)) {
          allTasks.push({ framework, typeId, topic });
        }
      }
    }
  }

  console.log(`\n📊 Tasks to generate: ${allTasks.length}`);
  
  // Count existing
  let existingCount = 0;
  for (const framework of frameworks) {
    const typeIds = getTypeIds(framework);
    for (const typeId of typeIds) {
      for (const topic of ALL_TOPICS) {
        if (contentExists(framework, typeId, topic)) {
          existingCount++;
        }
      }
    }
  }
  console.log(`📂 Already generated: ${existingCount}`);

  if (allTasks.length === 0) {
    console.log("\n✨ All content already generated!");
    return;
  }

  // Process in batches
  const batches: GenerationTask[][] = [];
  for (let i = 0; i < allTasks.length; i += PARALLEL_REQUESTS) {
    batches.push(allTasks.slice(i, i + PARALLEL_REQUESTS));
  }

  let totalSuccess = 0;
  let totalFailed = 0;
  const startTime = Date.now();

  for (let i = 0; i < batches.length; i++) {
    const { success, failed } = await processBatch(batches[i], i + 1, batches.length);
    totalSuccess += success;
    totalFailed += failed;

    // Delay between batches (except for last one)
    if (i < batches.length - 1) {
      console.log(`   ⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...`);
      await sleep(DELAY_BETWEEN_BATCHES);
    }

    // Progress update every 10 batches
    if ((i + 1) % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      const remaining = ((batches.length - i - 1) * (DELAY_BETWEEN_BATCHES + 60000 * PARALLEL_REQUESTS) / 1000 / 60).toFixed(1);
      console.log(`\n📈 Progress: ${totalSuccess}/${allTasks.length} complete | ${elapsed}min elapsed | ~${remaining}min remaining\n`);
    }
  }

  const totalElapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log("\n===================================");
  console.log(`✅ Successfully generated: ${totalSuccess}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`⏱️  Total time: ${totalElapsed} minutes`);
}

main().catch(console.error);

