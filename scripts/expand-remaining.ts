/**
 * Retry/Complete Content Expansion Script
 * - Extends PRISM types below 7500 words
 * - Runs full expansion for MBTI and Enneagram
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

import { archetypes } from "../lib/archetypes";
import { mbtiTypes } from "../lib/mbti-content";
import { enneagramTypes } from "../lib/enneagram-content";

dotenv.config({ path: ".env.local" });

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const MODEL = "google/gemini-3-pro-preview";
const TARGET_WORD_COUNT = 7500;
const PARALLEL_BATCH_SIZE = 15; // Run 15 at once for speed
const DELAY_BETWEEN_BATCHES = 2000; // Only 2 seconds between batches

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");
  return key;
}

async function generateContent(messages: OpenRouterMessage[]): Promise<string> {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getApiKey()}`,
      "HTTP-Referer": "https://prism7.app",
      "X-Title": "PRISM-7 Content Expander",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 24000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

function countWords(obj: any): number {
  return JSON.stringify(obj).split(/\s+/).length;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseJsonResponse(response: string): any {
  let content = response.trim();
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) content = jsonMatch[1].trim();
  
  const jsonStart = content.indexOf('{');
  const jsonEnd = content.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    content = content.slice(jsonStart, jsonEnd + 1);
  }
  
  return JSON.parse(content);
}

const SYSTEM_PROMPT = `You are an expert personality psychology writer. Create comprehensive, original content (~7,500+ words) with:
- Deep psychological insights and specific examples
- Day-in-the-life scenarios and internal monologues
- Rich detail on relationships, careers, and growth
- Integration with PRISM-7/HEXACO+ framework strengths
Return ONLY valid JSON matching the exact structure provided.`;

// Extension prompt for types that need more content
function buildExtendPrompt(content: any, currentWords: number): string {
  const needed = TARGET_WORD_COUNT - currentWords + 1000;
  return `This personality content is ${currentWords} words. ADD ${needed}+ words of NEW content.

CURRENT:
${JSON.stringify(content, null, 2)}

ADD to each section:
1. description[]: Add 4-5 new paragraphs with day-in-the-life scenarios, internal monologues
2. strengths/growthAreas: Add detailed examples and scenarios to each
3. careerMatches: Add "typical day" narratives for each career
4. workStyle/relationshipStyle: Double the length with specific examples
5. communicationStyle/atYourBest/whenStressed: Add concrete scenarios

Keep ALL existing content. Append new material. Return complete JSON (${TARGET_WORD_COUNT}+ words).`;
}

function buildMBTIPrompt(typeCode: string, content: any): string {
  return `Create comprehensive ${typeCode} personality content (~7,500 words). Expand this base:

${JSON.stringify(content, null, 2)}

EXPAND each section:
1. description[]: 10-12 paragraphs on lived experience, internal world, development, paradoxes
2. cognitiveFunctions: 150+ words each on daily manifestation and examples
3. strengths[]: 80+ word descriptions with specific scenarios
4. blindspots[]: 80+ words with real consequences and mitigation
5. inRelationships: 250+ words each (romantic/friendship/workplace)
6. careerPaths[]: 120+ word reasons with day-in-the-life scenarios
7. growthAdvice[]: 80+ words with concrete steps
8. prismCorrelation.keyDimensions: 150+ words on HEXACO+ mapping

Return ONLY valid JSON.`;
}

function buildEnneagramPrompt(typeNum: string, content: any): string {
  return `Create comprehensive Enneagram Type ${typeNum} content (~7,500 words). Expand this base:

${JSON.stringify(content, null, 2)}

EXPAND each section:
1. description[]: 10-12 paragraphs on core wound, fixation, internal logic, liberation
2. healthLevels: 200+ words each level with observable behaviors
3. wings: 150+ words each on how wing modifies expression
4. growthLine/stressLine: 150+ words each on movement patterns
5. strengths[]/challenges[]: 60+ words each with examples
6. inRelationships: 300+ words on patterns rooted in fixation
7. careerPaths[]: 100+ word reasons with scenarios
8. growthAdvice[]: 80+ words with psychological mechanism
9. prismCorrelation.keyDimensions: 150+ words

Return ONLY valid JSON.`;
}

async function expandType(
  name: string,
  content: any,
  buildPrompt: (content: any) => string,
  preserveFields?: (orig: any, parsed: any) => void
): Promise<{ content: any; words: number; success: boolean }> {
  let currentContent = content;
  let wordCount = countWords(content);
  
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const isExtend = attempt > 1 && wordCount > countWords(content);
      const prompt = isExtend 
        ? buildExtendPrompt(currentContent, wordCount)
        : buildPrompt(currentContent);
      
      console.log(`  ${attempt > 1 ? '📝' : '🔄'} ${name}...`);
      
      const response = await generateContent([
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ]);
      
      const parsed = parseJsonResponse(response);
      if (preserveFields) preserveFields(content, parsed);
      
      const newWords = countWords(parsed);
      if (newWords > wordCount) {
        currentContent = parsed;
        wordCount = newWords;
      }
      
      if (wordCount >= TARGET_WORD_COUNT) {
        console.log(`  ✅ ${name}: ${wordCount} words`);
        return { content: currentContent, words: wordCount, success: true };
      }
      
      if (attempt === 1 && wordCount < TARGET_WORD_COUNT) {
        console.log(`  🔁 ${name}: ${wordCount} words, extending...`);
      }
      
    } catch (error: any) {
      console.log(`  ⚠️ ${name} failed: ${error.message?.slice(0, 40)}`);
      await sleep(1000);
    }
  }
  
  console.log(`  ⚠️ ${name}: ${wordCount} words (below target)`);
  return { content: currentContent, words: wordCount, success: wordCount > countWords(content) };
}

async function runBatch<T>(
  items: T[],
  processor: (item: T) => Promise<any>
): Promise<any[]> {
  const results: any[] = [];
  
  for (let i = 0; i < items.length; i += PARALLEL_BATCH_SIZE) {
    const batch = items.slice(i, i + PARALLEL_BATCH_SIZE);
    console.log(`\n📦 Batch ${Math.floor(i/PARALLEL_BATCH_SIZE) + 1}/${Math.ceil(items.length/PARALLEL_BATCH_SIZE)} (${batch.length} items)\n`);
    
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    
    if (i + PARALLEL_BATCH_SIZE < items.length) {
      console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES/1000}s...`);
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }
  
  return results;
}

async function main() {
  console.log("🚀 Content Expansion - Remaining Types");
  console.log("======================================\n");
  
  const startTime = Date.now();
  
  // Load existing PRISM expanded content
  const prismPath = path.join(__dirname, "..", "lib", "archetypes-expanded.json");
  let expandedPrism: any[] = [];
  
  if (fs.existsSync(prismPath)) {
    expandedPrism = JSON.parse(fs.readFileSync(prismPath, "utf-8"));
    console.log(`📂 Loaded ${expandedPrism.length} existing PRISM types\n`);
  }
  
  // Find PRISM types below target
  const prismBelowTarget = expandedPrism.filter(t => countWords(t) < TARGET_WORD_COUNT);
  console.log(`🔧 PRISM types needing extension: ${prismBelowTarget.length}`);
  prismBelowTarget.forEach(t => console.log(`   - ${t.name}: ${countWords(t)} words`));
  
  // Extend PRISM types below target (run in parallel with MBTI/Enneagram)
  let prismExtendPromises: Promise<any>[] = [];
  if (prismBelowTarget.length > 0) {
    console.log(`\n📚 Will extend ${prismBelowTarget.length} PRISM types in parallel...\n`);
    
    prismExtendPromises = prismBelowTarget.map(async (type) => {
      const original = archetypes.find(a => a.id === type.id)!;
      const result = await expandType(
        type.name,
        type,
        (c) => buildExtendPrompt(c, countWords(c)),
        (orig, parsed) => {
          parsed.id = original.id;
          parsed.pattern = original.pattern;
          parsed.color = original.color;
          parsed.rarity = original.rarity;
          parsed.icon = original.icon;
          parsed.famousExamples = original.famousExamples;
        }
      );
      return { id: type.id, ...result };
    });
  }
  
  // Build ALL remaining tasks and run everything in parallel batches
  console.log("\n📚 Running ALL expansions in parallel batches...\n");
  
  type Task = { type: 'prism' | 'mbti' | 'enneagram'; key: string; name: string; content: any };
  const allTasks: Task[] = [];
  
  // Add MBTI tasks
  for (const key of Object.keys(mbtiTypes)) {
    allTasks.push({ type: 'mbti', key, name: key.toUpperCase(), content: mbtiTypes[key] });
  }
  
  // Add Enneagram tasks  
  for (const key of Object.keys(enneagramTypes)) {
    allTasks.push({ type: 'enneagram', key, name: `E${key}-${enneagramTypes[key].name}`, content: enneagramTypes[key] });
  }
  
  // Add PRISM extension tasks
  for (const type of prismBelowTarget) {
    allTasks.push({ type: 'prism', key: type.id, name: type.name, content: type });
  }
  
  console.log(`📋 Total tasks: ${allTasks.length} (${Object.keys(mbtiTypes).length} MBTI + ${Object.keys(enneagramTypes).length} Enneagram + ${prismBelowTarget.length} PRISM extensions)\n`);
  
  // Process all in batches
  const allResults = await runBatch(allTasks, async (task) => {
    if (task.type === 'mbti') {
      return { ...task, ...(await expandType(task.name, task.content, (c) => buildMBTIPrompt(task.key.toUpperCase(), c))) };
    } else if (task.type === 'enneagram') {
      return { ...task, ...(await expandType(task.name, task.content, (c) => buildEnneagramPrompt(task.key, c))) };
    } else {
      const original = archetypes.find(a => a.id === task.key)!;
      return { ...task, ...(await expandType(task.name, task.content, (c) => buildExtendPrompt(c, countWords(c)), (_, parsed) => {
        parsed.id = original.id;
        parsed.pattern = original.pattern;
        parsed.color = original.color;
        parsed.rarity = original.rarity;
        parsed.icon = original.icon;
        parsed.famousExamples = original.famousExamples;
      })) };
    }
  });
  
  // Organize results
  const mbtiResults: Record<string, any> = {};
  const enneagramResults: Record<string, any> = {};
  
  for (const r of allResults) {
    if (r.type === 'mbti') {
      mbtiResults[r.key] = r.content;
    } else if (r.type === 'enneagram') {
      enneagramResults[r.key] = r.content;
    } else if (r.type === 'prism') {
      const idx = expandedPrism.findIndex(t => t.id === r.key);
      if (idx !== -1) expandedPrism[idx] = r.content;
    }
  }
  
  // Save all results
  fs.writeFileSync(prismPath, JSON.stringify(expandedPrism, null, 2));
  console.log(`\n📁 Saved PRISM content`);
  
  const mbtiPath = path.join(__dirname, "..", "lib", "mbti-content-expanded.json");
  fs.writeFileSync(mbtiPath, JSON.stringify(mbtiResults, null, 2));
  console.log(`📁 Saved MBTI content`);
  
  const enneagramPath = path.join(__dirname, "..", "lib", "enneagram-content-expanded.json");
  fs.writeFileSync(enneagramPath, JSON.stringify(enneagramResults, null, 2));
  console.log(`📁 Saved Enneagram content`);
  
  const mbtiExpanded = allResults.filter(r => r.type === 'mbti');
  const enneagramExpanded = allResults.filter(r => r.type === 'enneagram');
  
  // Summary
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  
  const prismWords = expandedPrism.reduce((sum, t) => sum + countWords(t), 0);
  const mbtiWords = Object.values(mbtiResults).reduce((sum: number, t) => sum + countWords(t), 0);
  const enneagramWords = Object.values(enneagramResults).reduce((sum: number, t) => sum + countWords(t), 0);
  
  console.log("\n======================================");
  console.log(`✅ Complete! (${elapsed} minutes)`);
  console.log(`📊 PRISM: ${prismWords.toLocaleString()} words (${expandedPrism.filter(t => countWords(t) >= TARGET_WORD_COUNT).length}/12 at target)`);
  console.log(`📊 MBTI: ${mbtiWords.toLocaleString()} words (${mbtiExpanded.filter(r => r.words >= TARGET_WORD_COUNT).length}/16 at target)`);
  console.log(`📊 Enneagram: ${enneagramWords.toLocaleString()} words (${enneagramExpanded.filter(r => r.words >= TARGET_WORD_COUNT).length}/9 at target)`);
  console.log(`📊 Total: ${(prismWords + mbtiWords + enneagramWords).toLocaleString()} words`);
}

main().catch(console.error);

