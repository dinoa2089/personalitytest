/**
 * Fire-all-at-once extension script
 * Extends ALL types below target in parallel without batching
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const MODEL = "google/gemini-3-pro-preview";
const TARGET_WORD_COUNT = 7500;

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");
  return key;
}

async function generateContent(prompt: string): Promise<string> {
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
      messages: [
        { role: "system", content: "You are a personality psychology expert. Extend the content to 7500+ words. Return ONLY valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 20000,
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

function countWords(obj: any): number {
  return JSON.stringify(obj).split(/\s+/).length;
}

function parseJson(response: string): any {
  let content = response.trim();
  const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) content = match[1].trim();
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start !== -1 && end !== -1) content = content.slice(start, end + 1);
  return JSON.parse(content);
}

function buildExtendPrompt(content: any, currentWords: number, typeName: string): string {
  const needed = TARGET_WORD_COUNT - currentWords + 1500;
  return `Extend this ${typeName} personality content from ${currentWords} to ${TARGET_WORD_COUNT}+ words by ADDING ${needed}+ words of NEW content.

CURRENT CONTENT:
${JSON.stringify(content, null, 2)}

ADD to these sections:
1. description[]: Add 4+ NEW paragraphs with day-in-the-life scenarios, internal monologue, developmental arc
2. strengths/blindspots/challenges/growthAreas: Add 2-3 sentences to each item with concrete examples
3. careerPaths/careerMatches: Add "typical day" narrative (50+ words) to each career
4. inRelationships/relationshipStyle: Double length with specific dialogue examples
5. workStyle/communicationStyle: Add concrete workplace scenarios

KEEP all existing content. APPEND new material. Return COMPLETE JSON with ${TARGET_WORD_COUNT}+ total words.`;
}

interface Task {
  framework: 'prism' | 'mbti' | 'enneagram';
  key: string;
  name: string;
  content: any;
  currentWords: number;
}

async function extendType(task: Task): Promise<{ task: Task; content: any; words: number; success: boolean }> {
  const { name, content, currentWords } = task;
  
  try {
    console.log(`  🚀 ${name} (${currentWords} → ${TARGET_WORD_COUNT}+)`);
    const response = await generateContent(buildExtendPrompt(content, currentWords, name));
    const parsed = parseJson(response);
    const newWords = countWords(parsed);
    
    if (newWords > currentWords) {
      const status = newWords >= TARGET_WORD_COUNT ? '✅' : '📈';
      console.log(`  ${status} ${name}: ${currentWords} → ${newWords} words`);
      return { task, content: parsed, words: newWords, success: true };
    }
    
    console.log(`  ⚠️ ${name}: No improvement (${newWords} words)`);
    return { task, content, words: currentWords, success: false };
    
  } catch (error: any) {
    console.log(`  ❌ ${name}: ${error.message?.slice(0, 40)}`);
    return { task, content, words: currentWords, success: false };
  }
}

async function main() {
  console.log("🔥 FIRE-ALL-AT-ONCE Extension Script");
  console.log("====================================\n");
  
  const startTime = Date.now();
  const libPath = path.join(__dirname, "..", "lib");
  
  // Load all expanded content
  const prismData: any[] = JSON.parse(fs.readFileSync(path.join(libPath, "archetypes-expanded.json"), "utf-8"));
  const mbtiData: Record<string, any> = JSON.parse(fs.readFileSync(path.join(libPath, "mbti-content-expanded.json"), "utf-8"));
  const enneagramData: Record<string, any> = JSON.parse(fs.readFileSync(path.join(libPath, "enneagram-content-expanded.json"), "utf-8"));
  
  // Build task list for types below target
  const tasks: Task[] = [];
  
  for (const type of prismData) {
    const words = countWords(type);
    if (words < TARGET_WORD_COUNT) {
      tasks.push({ framework: 'prism', key: type.id, name: type.name, content: type, currentWords: words });
    }
  }
  
  for (const [key, type] of Object.entries(mbtiData)) {
    const words = countWords(type);
    if (words < TARGET_WORD_COUNT) {
      tasks.push({ framework: 'mbti', key, name: key.toUpperCase(), content: type, currentWords: words });
    }
  }
  
  for (const [key, type] of Object.entries(enneagramData)) {
    const words = countWords(type);
    if (words < TARGET_WORD_COUNT) {
      tasks.push({ framework: 'enneagram', key, name: `Type ${key}`, content: type, currentWords: words });
    }
  }
  
  console.log(`📋 Types below ${TARGET_WORD_COUNT} words: ${tasks.length}`);
  tasks.forEach(t => console.log(`   ${t.name}: ${t.currentWords} words`));
  console.log(`\n🚀 Firing ALL ${tasks.length} requests in parallel...\n`);
  
  // Fire ALL at once
  const results = await Promise.all(tasks.map(extendType));
  
  // Update content with results
  for (const result of results) {
    if (result.words > result.task.currentWords) {
      if (result.task.framework === 'prism') {
        const idx = prismData.findIndex(t => t.id === result.task.key);
        if (idx !== -1) prismData[idx] = result.content;
      } else if (result.task.framework === 'mbti') {
        mbtiData[result.task.key] = result.content;
      } else {
        enneagramData[result.task.key] = result.content;
      }
    }
  }
  
  // Save all
  fs.writeFileSync(path.join(libPath, "archetypes-expanded.json"), JSON.stringify(prismData, null, 2));
  fs.writeFileSync(path.join(libPath, "mbti-content-expanded.json"), JSON.stringify(mbtiData, null, 2));
  fs.writeFileSync(path.join(libPath, "enneagram-content-expanded.json"), JSON.stringify(enneagramData, null, 2));
  
  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  const improved = results.filter(r => r.words > r.task.currentWords).length;
  const atTarget = results.filter(r => r.words >= TARGET_WORD_COUNT).length;
  
  console.log(`\n====================================`);
  console.log(`✅ Done in ${elapsed}s`);
  console.log(`📈 Improved: ${improved}/${tasks.length}`);
  console.log(`🎯 At target: ${atTarget}/${tasks.length}`);
  
  // Show remaining below target
  const stillBelow = results.filter(r => r.words < TARGET_WORD_COUNT);
  if (stillBelow.length > 0) {
    console.log(`\n⚠️ Still below target:`);
    stillBelow.forEach(r => console.log(`   ${r.task.name}: ${r.words} words`));
  }
}

main().catch(console.error);




