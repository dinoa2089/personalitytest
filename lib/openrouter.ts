/**
 * OpenRouter API Client
 * Uses Gemini 3 Pro Preview for content generation
 */

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables");
  }
  return key;
}

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

const DEFAULT_MODEL = "google/gemini-3-pro-preview";

/**
 * Generate content using OpenRouter API
 */
export async function generateContent(
  messages: OpenRouterMessage[],
  options: GenerationOptions = {}
): Promise<string> {
  const apiKey = getApiKey();

  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 8000,
  } = options;

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://prism7.app",
      "X-Title": "PRISM-7 Content Generator",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0]?.message?.content || "";
}

/**
 * Generate structured JSON content
 */
export async function generateStructuredContent<T>(
  messages: OpenRouterMessage[],
  options: GenerationOptions = {}
): Promise<T> {
  const content = await generateContent(messages, options);
  
  // Extract JSON from the response (handle markdown code blocks)
  let jsonStr = content;
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }
  
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", content);
    throw new Error("Failed to parse structured response from AI");
  }
}

/**
 * Available models on OpenRouter
 */
export const AVAILABLE_MODELS = {
  "gemini-3-pro": "google/gemini-3-pro-preview",
  "claude-sonnet": "anthropic/claude-sonnet-4",
  "gpt-4o": "openai/gpt-4o",
  "claude-opus": "anthropic/claude-opus-4",
} as const;

