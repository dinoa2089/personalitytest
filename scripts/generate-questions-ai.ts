#!/usr/bin/env npx ts-node
/**
 * AI-Powered Question Generator for PRISM-7
 * 
 * Generates 260+ psychometrically sound personality assessment questions
 * using OpenRouter with Gemini 3 Pro Preview.
 * 
 * Usage:
 *   cd frontend
 *   npx ts-node scripts/generate-questions-ai.ts
 * 
 * Required environment variables:
 *   OPENROUTER_API_KEY - Your OpenRouter API key
 *   NEXT_PUBLIC_SUPABASE_URL - Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Supabase service role key (for inserts)
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';
import {
  DIMENSION_DEFINITIONS,
  DIMENSION_EXAMPLES,
  PRISM_DIMENSIONS,
  MBTI_DIMENSIONS,
  MBTI_DEFINITIONS,
  ENNEAGRAM_TYPES,
  ENNEAGRAM_DEFINITIONS,
  ENNEAGRAM_MOTIVATIONS,
  ENNEAGRAM_FEARS,
  BATCH_CONFIG,
  type PrismDimension,
  type MbtiDimension,
  type EnneagramType,
} from './question-generation-constants';

// Types
interface GeneratedLikertQuestion {
  text: string;
  reverse_scored: boolean;
  weight: number;
  context: 'work' | 'social' | 'personal' | 'stress';
}

interface GeneratedForcedChoiceQuestion {
  text: string;
  options: Array<{ text: string; dimension: string }>;
}

interface GeneratedSituationalQuestion {
  text: string;
  options: string[];
}

interface GeneratedBehavioralQuestion {
  text: string;
  reverse_scored: boolean;
  timeframe: 'week' | 'month' | 'year';
}

interface GeneratedMbtiQuestion {
  text: string;
  type: 'likert' | 'situational_judgment';
  options?: string[];
  high_pole: string;
  low_pole: string;
}

interface GeneratedEnneagramQuestion {
  text: string;
  type: 'likert' | 'behavioral_frequency';
  reverse_scored: boolean;
}

interface StorableQuestion {
  text: string;
  type: 'likert' | 'forced_choice' | 'situational_judgment' | 'behavioral_frequency';
  dimension: string;
  options?: string[] | Array<{ text: string; dimension: string }>;
  reverse_scored: boolean;
  weight: number;
  framework_tags: string[];
  discrimination: number;
  difficulty: number;
  is_core: boolean;
}

// OpenRouter API configuration
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = 'google/gemini-3-pro-preview';

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables');
  }
  return key;
}

async function generateContent(prompt: string): Promise<string> {
  const apiKey = getApiKey();

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://prism7.app',
      'X-Title': 'PRISM-7 Question Generator',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert psychometrician specializing in personality assessment design. Generate high-quality, psychometrically sound questions that are culturally neutral and scientifically valid.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

function parseJsonResponse<T>(content: string): T {
  let jsonStr = content;
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }
  
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    console.error('Failed to parse JSON response:', content.substring(0, 500));
    throw new Error('Failed to parse structured response from AI');
  }
}

// Prompt Templates
function getLikertPrompt(dimension: PrismDimension, count: number): string {
  const examples = DIMENSION_EXAMPLES[dimension];
  return `
You are a psychometrician designing personality assessment questions.

Generate ${count} Likert scale questions measuring the "${dimension}" personality dimension.

DIMENSION DEFINITION:
${DIMENSION_DEFINITIONS[dimension]}

HIGH TRAIT EXAMPLES:
${examples.high.map(e => `- ${e}`).join('\n')}

LOW TRAIT EXAMPLES:
${examples.low.map(e => `- ${e}`).join('\n')}

REQUIREMENTS:
1. Each question should be a statement the user rates from 1 (Strongly Disagree) to 7 (Strongly Agree)
2. Use behavioral anchoring - reference specific behaviors, not abstract traits
   - BAD: "I am organized"
   - GOOD: "I create detailed plans before starting projects"
3. About 40% should be reverse-scored (disagreeing = high on trait)
4. Avoid double-barreled questions (asking two things at once)
5. Use culturally neutral language accessible globally
6. Vary the context: work, social, personal, and stress situations
7. Avoid leading questions or obvious "right" answers
8. Each question should be distinct and not redundant

OUTPUT FORMAT (JSON array only, no other text):
[
  {
    "text": "Question text here",
    "reverse_scored": false,
    "weight": 1.0,
    "context": "work"
  }
]

Generate exactly ${count} unique, high-quality questions.
`;
}

function getForcedChoicePrompt(primaryDimension: PrismDimension, count: number): string {
  const otherDimensions = PRISM_DIMENSIONS.filter(d => d !== primaryDimension);
  return `
You are a psychometrician designing forced-choice personality questions.

Generate ${count} forced-choice triads. Each triad has 3 options where the user selects which is MOST like them and which is LEAST like them.

CRITICAL REQUIREMENT: Each of the 3 options MUST measure a DIFFERENT personality dimension.

PRISM-7 DIMENSIONS:
- openness: Curiosity, creativity, preference for novelty
- conscientiousness: Organization, discipline, goal-orientation  
- extraversion: Social engagement, energy from others
- agreeableness: Compassion, cooperation, trust
- emotionalResilience: Stress tolerance, emotional stability
- honestyHumility: Integrity, fairness, modesty
- adaptability: Flexibility, comfort with change

REQUIREMENTS:
1. Primary dimension is "${primaryDimension}" - one option should measure this
2. The other two options MUST measure TWO DIFFERENT dimensions from: ${otherDimensions.join(', ')}
3. All three options should be equally socially desirable (no obvious "right" answer)
4. Options should be concise (under 15 words each)
5. Options should be parallel in grammatical structure
6. Use "I" statements for consistency

OUTPUT FORMAT (JSON array only, no other text):
[
  {
    "text": "Which is MOST like you and which is LEAST like you?",
    "options": [
      { "text": "I enjoy exploring new ideas and approaches", "dimension": "openness" },
      { "text": "I follow through on my commitments", "dimension": "conscientiousness" },
      { "text": "I thrive in group settings", "dimension": "extraversion" }
    ]
  }
]

Generate exactly ${count} triads with options spanning 3 DIFFERENT dimensions each.
`;
}

function getSituationalJudgmentPrompt(dimension: PrismDimension, count: number): string {
  return `
You are a psychometrician designing situational judgment questions.

Generate ${count} situational judgment questions measuring "${dimension}".

DIMENSION DEFINITION:
${DIMENSION_DEFINITIONS[dimension]}

REQUIREMENTS:
1. Present a realistic scenario (work, social, or personal context)
2. End the scenario with "You would most likely:"
3. Provide exactly 3 response options representing different levels of the trait
4. Options should be ordered from highest trait expression to lowest
5. Scenarios should be relatable to diverse populations globally
6. Avoid obvious "correct" answers - all options should be reasonable
7. Make scenarios specific and concrete, not abstract

OUTPUT FORMAT (JSON array only, no other text):
[
  {
    "text": "Scenario description ending with 'You would most likely:'",
    "options": [
      "Option representing HIGH trait expression",
      "Option representing MODERATE trait expression", 
      "Option representing LOW trait expression"
    ]
  }
]

Generate exactly ${count} unique scenarios.
`;
}

function getBehavioralFrequencyPrompt(dimension: PrismDimension, count: number): string {
  return `
You are a psychometrician designing behavioral frequency questions.

Generate ${count} behavioral frequency questions measuring "${dimension}".

DIMENSION DEFINITION:
${DIMENSION_DEFINITIONS[dimension]}

REQUIREMENTS:
1. Ask about frequency of specific, observable behaviors
2. Include a time frame (past week, past month, past year)
3. Behaviors should be countable and verifiable
4. User responds: Never, Rarely, Sometimes, Often, Very Often
5. About 30% should be reverse-scored (frequent behavior = LOW on trait)
6. Behaviors should be culturally universal

OUTPUT FORMAT (JSON array only, no other text):
[
  {
    "text": "In the past month, how often have you [specific behavior]?",
    "reverse_scored": false,
    "timeframe": "month"
  }
]

Generate exactly ${count} unique questions.
`;
}

function getMbtiPrompt(mbtiDim: MbtiDimension, count: number): string {
  const def = MBTI_DEFINITIONS[mbtiDim];
  const [highPole, lowPole] = mbtiDim.split('/');
  
  return `
Generate ${count} questions specifically targeting the MBTI ${mbtiDim} dimension.

DIMENSION: ${mbtiDim}
${def.description}

${def.highPole}
${def.lowPole}

Generate questions that clearly discriminate between the two poles.
Mix of Likert (70%) and situational judgment (30%) formats.

For Likert questions:
- Statement that ${highPole}-preference would agree with (reverse_scored for ${lowPole})
- Clear behavioral anchoring

For situational judgment:
- Scenario with 3 options showing different preferences
- First option = ${highPole} preference, Third option = ${lowPole} preference

OUTPUT FORMAT (JSON array only, no other text):
[
  {
    "text": "Question text",
    "type": "likert",
    "high_pole": "${highPole}",
    "low_pole": "${lowPole}"
  },
  {
    "text": "Scenario ending with 'You would most likely:'",
    "type": "situational_judgment",
    "options": ["${highPole}-like response", "Moderate response", "${lowPole}-like response"],
    "high_pole": "${highPole}",
    "low_pole": "${lowPole}"
  }
]

Generate exactly ${count} questions.
`;
}

function getEnneagramPrompt(enneagramType: EnneagramType, count: number): string {
  return `
Generate ${count} questions targeting Enneagram Type ${enneagramType}.

ENNEAGRAM TYPE ${enneagramType}:
${ENNEAGRAM_DEFINITIONS[enneagramType]}

Core motivation: ${ENNEAGRAM_MOTIVATIONS[enneagramType]}
Core fear: ${ENNEAGRAM_FEARS[enneagramType]}

REQUIREMENTS:
1. Questions should tap into the core motivation/fear pattern
2. Avoid stereotypes - focus on underlying psychological patterns
3. Mix of Likert (60%) and behavioral frequency (40%) formats
4. Questions should feel self-reflective, not pathologizing
5. All questions should have natural variation in responses

OUTPUT FORMAT (JSON array only, no other text):
[
  {
    "text": "I-statement question text",
    "type": "likert",
    "reverse_scored": false
  },
  {
    "text": "In the past month, how often have you [behavior]?",
    "type": "behavioral_frequency",
    "reverse_scored": false
  }
]

Generate exactly ${count} questions.
`;
}

// Generation Functions
async function generateLikertQuestions(dimension: PrismDimension, count: number): Promise<StorableQuestion[]> {
  const prompt = getLikertPrompt(dimension, count);
  const content = await generateContent(prompt);
  const questions = parseJsonResponse<GeneratedLikertQuestion[]>(content);
  
  return questions.map(q => ({
    text: q.text,
    type: 'likert' as const,
    dimension,
    reverse_scored: q.reverse_scored,
    weight: q.weight || 1.0,
    framework_tags: [`prism_${dimension}`],
    discrimination: 1.0,
    difficulty: 0.5,
    is_core: false,
  }));
}

async function generateForcedChoiceQuestions(dimension: PrismDimension, count: number): Promise<StorableQuestion[]> {
  const prompt = getForcedChoicePrompt(dimension, count);
  const content = await generateContent(prompt);
  const questions = parseJsonResponse<GeneratedForcedChoiceQuestion[]>(content);
  
  return questions.map(q => {
    const dimensions = q.options.map(o => o.dimension);
    return {
      text: q.text,
      type: 'forced_choice' as const,
      dimension, // Primary dimension
      options: q.options,
      reverse_scored: false,
      weight: 1.2, // Forced choice has higher weight due to ipsative nature
      framework_tags: dimensions.map(d => `prism_${d}`),
      discrimination: 1.2,
      difficulty: 0.5,
      is_core: false,
    };
  });
}

async function generateSituationalQuestions(dimension: PrismDimension, count: number): Promise<StorableQuestion[]> {
  const prompt = getSituationalJudgmentPrompt(dimension, count);
  const content = await generateContent(prompt);
  const questions = parseJsonResponse<GeneratedSituationalQuestion[]>(content);
  
  return questions.map(q => ({
    text: q.text,
    type: 'situational_judgment' as const,
    dimension,
    options: q.options,
    reverse_scored: false,
    weight: 1.3, // SJT has highest ecological validity
    framework_tags: [`prism_${dimension}`],
    discrimination: 1.1,
    difficulty: 0.5,
    is_core: false,
  }));
}

async function generateBehavioralQuestions(dimension: PrismDimension, count: number): Promise<StorableQuestion[]> {
  const prompt = getBehavioralFrequencyPrompt(dimension, count);
  const content = await generateContent(prompt);
  const questions = parseJsonResponse<GeneratedBehavioralQuestion[]>(content);
  
  return questions.map(q => ({
    text: q.text,
    type: 'behavioral_frequency' as const,
    dimension,
    reverse_scored: q.reverse_scored,
    weight: 1.5, // Behavioral frequency is most verifiable
    framework_tags: [`prism_${dimension}`],
    discrimination: 1.0,
    difficulty: 0.5,
    is_core: false,
  }));
}

async function generateMbtiQuestions(mbtiDim: MbtiDimension, count: number): Promise<StorableQuestion[]> {
  const prompt = getMbtiPrompt(mbtiDim, count);
  const content = await generateContent(prompt);
  const questions = parseJsonResponse<GeneratedMbtiQuestion[]>(content);
  
  // Map MBTI to primary PRISM dimension
  const mbtiToPrismPrimary: Record<MbtiDimension, PrismDimension> = {
    'E/I': 'extraversion',
    'S/N': 'openness',
    'T/F': 'agreeableness',
    'J/P': 'conscientiousness',
  };
  
  const mbtiTag = `mbti_${mbtiDim.toLowerCase().replace('/', '')}`;
  
  return questions.map(q => ({
    text: q.text,
    type: q.type as 'likert' | 'situational_judgment',
    dimension: mbtiToPrismPrimary[mbtiDim],
    options: q.options,
    reverse_scored: false,
    weight: 1.1,
    framework_tags: [mbtiTag, `prism_${mbtiToPrismPrimary[mbtiDim]}`],
    discrimination: 1.0,
    difficulty: 0.5,
    is_core: false,
  }));
}

async function generateEnneagramQuestions(enneagramType: EnneagramType, count: number): Promise<StorableQuestion[]> {
  const prompt = getEnneagramPrompt(enneagramType, count);
  const content = await generateContent(prompt);
  const questions = parseJsonResponse<GeneratedEnneagramQuestion[]>(content);
  
  // Map Enneagram to primary PRISM dimension
  const enneagramToPrismPrimary: Record<EnneagramType, PrismDimension> = {
    1: 'conscientiousness',
    2: 'agreeableness',
    3: 'conscientiousness',
    4: 'openness',
    5: 'openness',
    6: 'conscientiousness',
    7: 'openness',
    8: 'extraversion',
    9: 'agreeableness',
  };
  
  return questions.map(q => ({
    text: q.text,
    type: q.type as 'likert' | 'behavioral_frequency',
    dimension: enneagramToPrismPrimary[enneagramType],
    reverse_scored: q.reverse_scored,
    weight: 1.0,
    framework_tags: [`enneagram_${enneagramType}`, `prism_${enneagramToPrismPrimary[enneagramType]}`],
    discrimination: 1.0,
    difficulty: 0.5,
    is_core: false,
  }));
}

// Batch processing with concurrency control
async function generateQuestionsInParallel<T>(
  tasks: Array<() => Promise<T[]>>,
  concurrency: number = BATCH_CONFIG.concurrency
): Promise<T[]> {
  const allResults: T[] = [];
  
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    console.log(`  Processing batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(tasks.length / concurrency)}...`);
    
    const results = await Promise.all(batch.map(task => task()));
    allResults.push(...results.flat());
    
    // Small delay between batches to avoid rate limits
    if (i + concurrency < tasks.length) {
      await new Promise(r => setTimeout(r, BATCH_CONFIG.delayBetweenBatches));
    }
  }
  
  return allResults;
}

// Supabase storage
async function storeQuestionsInSupabase(questions: StorableQuestion[]): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.log('\n⚠️  Supabase not configured. Saving questions to JSON file instead...');
    const outputPath = path.join(__dirname, 'generated-questions.json');
    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
    console.log(`   Saved ${questions.length} questions to ${outputPath}`);
    return;
  }
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  // Get current max order_index
  const { data: maxOrderData } = await supabase
    .from('questions')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
    .single();
  
  let orderIndex = (maxOrderData?.order_index || 0) + 1;
  
  const formattedQuestions = questions.map(q => ({
    text: q.text,
    type: q.type,
    dimension: q.dimension,
    options: q.options || null,
    reverse_scored: q.reverse_scored,
    weight: q.weight,
    order_index: orderIndex++,
    framework_tags: q.framework_tags,
    discrimination: q.discrimination,
    difficulty: q.difficulty,
    is_core: q.is_core,
  }));
  
  // Insert in batches of 50
  const batchSize = 50;
  let inserted = 0;
  
  for (let i = 0; i < formattedQuestions.length; i += batchSize) {
    const batch = formattedQuestions.slice(i, i + batchSize);
    const { error } = await supabase.from('questions').insert(batch);
    
    if (error) {
      console.error(`  ❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(formattedQuestions.length / batchSize)} (${inserted}/${formattedQuestions.length})`);
    }
  }
  
  console.log(`\n✅ Successfully stored ${inserted} questions in Supabase`);
}

// Main execution
async function main() {
  console.log('🚀 PRISM-7 Question Generator');
  console.log('================================\n');
  
  const allQuestions: StorableQuestion[] = [];
  
  // Generate PRISM-7 dimension questions
  console.log('📊 Generating PRISM-7 dimension questions...\n');
  
  for (const dimension of PRISM_DIMENSIONS) {
    console.log(`\n  🎯 ${dimension.toUpperCase()}`);
    
    try {
      // Generate all types for this dimension in parallel
      const tasks = [
        () => generateLikertQuestions(dimension, BATCH_CONFIG.likertPerBatch),
        () => generateSituationalQuestions(dimension, BATCH_CONFIG.situationalPerBatch),
        () => generateForcedChoiceQuestions(dimension, BATCH_CONFIG.forcedChoicePerBatch),
        () => generateBehavioralQuestions(dimension, BATCH_CONFIG.behavioralPerBatch),
      ];
      
      const dimensionQuestions = await generateQuestionsInParallel(tasks, 4);
      allQuestions.push(...dimensionQuestions);
      
      console.log(`     ✓ Generated ${dimensionQuestions.length} questions for ${dimension}`);
    } catch (error) {
      console.error(`     ❌ Error generating questions for ${dimension}:`, error);
    }
    
    // Delay between dimensions
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Generate MBTI-specific questions
  console.log('\n📊 Generating MBTI-specific questions...\n');
  
  for (const mbtiDim of MBTI_DIMENSIONS) {
    try {
      console.log(`  🎯 MBTI ${mbtiDim}`);
      const mbtiQuestions = await generateMbtiQuestions(mbtiDim, 10);
      allQuestions.push(...mbtiQuestions);
      console.log(`     ✓ Generated ${mbtiQuestions.length} questions`);
    } catch (error) {
      console.error(`     ❌ Error generating MBTI ${mbtiDim} questions:`, error);
    }
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Generate Enneagram-specific questions
  console.log('\n📊 Generating Enneagram-specific questions...\n');
  
  for (const enneagramType of ENNEAGRAM_TYPES) {
    try {
      console.log(`  🎯 Enneagram Type ${enneagramType}`);
      const enneagramQuestions = await generateEnneagramQuestions(enneagramType, 5);
      allQuestions.push(...enneagramQuestions);
      console.log(`     ✓ Generated ${enneagramQuestions.length} questions`);
    } catch (error) {
      console.error(`     ❌ Error generating Enneagram Type ${enneagramType} questions:`, error);
    }
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Summary
  console.log('\n================================');
  console.log('📈 GENERATION SUMMARY');
  console.log('================================');
  console.log(`Total questions generated: ${allQuestions.length}`);
  
  // Count by type
  const byType = allQuestions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('\nBy question type:');
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`);
  });
  
  // Count by dimension
  const byDimension = allQuestions.reduce((acc, q) => {
    acc[q.dimension] = (acc[q.dimension] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('\nBy PRISM dimension:');
  Object.entries(byDimension).forEach(([dim, count]) => {
    console.log(`  - ${dim}: ${count}`);
  });
  
  // Store in Supabase
  console.log('\n💾 Storing questions...');
  await storeQuestionsInSupabase(allQuestions);
  
  console.log('\n🎉 Question generation complete!');
}

// Run the generator
main().catch(console.error);

