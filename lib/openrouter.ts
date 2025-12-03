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
  // High-end reasoning models (best for job fit evaluation)
  "gemini-3-pro": "google/gemini-3-pro-preview",
  "kimi-k2": "moonshotai/kimi-k2",
  "claude-opus": "anthropic/claude-opus-4",
  // Standard models
  "claude-sonnet": "anthropic/claude-sonnet-4",
  "gpt-4o": "openai/gpt-4o",
  // Image generation models
  "nano-banana-pro": "nana-banana/nano-banana-pro",
  "flux-schnell": "black-forest-labs/flux-schnell",
  "stable-diffusion-xl": "stabilityai/stable-diffusion-xl-base-1.0",
} as const;

/**
 * Recommended models for different use cases
 */
export const MODEL_RECOMMENDATIONS = {
  // Job fit evaluation - needs deep reasoning
  jobFitEvaluation: "google/gemini-3-pro-preview",
  jobFitEvaluationFallback: "moonshotai/kimi-k2",
  // Quick analysis
  quickAnalysis: "anthropic/claude-sonnet-4",
  // Content generation
  contentGeneration: "google/gemini-3-pro-preview",
} as const;

export type ModelKey = keyof typeof AVAILABLE_MODELS;

/**
 * Image generation options
 */
export interface ImageGenerationOptions {
  model?: string;
  width?: number;
  height?: number;
  numImages?: number;
}

/**
 * Image generation response
 */
export interface ImageGenerationResponse {
  id: string;
  images: Array<{
    url?: string;
    b64_json?: string;
  }>;
}

/**
 * Generate an image using OpenRouter API with image models
 * Returns the image URL or base64 data
 */
export async function generateImage(
  prompt: string,
  options: ImageGenerationOptions = {}
): Promise<string> {
  const apiKey = getApiKey();

  const {
    model = AVAILABLE_MODELS["nano-banana-pro"],
    width = 1024,
    height = 1024,
    numImages = 1,
  } = options;

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://prism7.app",
      "X-Title": "PRISM-7 Infographic Generator",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      // Some image models may support these parameters
      ...(model.includes("flux") || model.includes("stable-diffusion") ? {
        width,
        height,
        n: numImages,
      } : {}),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter Image API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  // Handle different response formats
  // Some models return image URL in content, others in a different format
  if (data.choices?.[0]?.message?.content) {
    const content = data.choices[0].message.content;
    
    // Check if content is a URL
    if (content.startsWith("http")) {
      return content;
    }
    
    // Check if content contains markdown image
    const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
    if (markdownMatch) {
      return markdownMatch[1];
    }
    
    // Check if content is base64
    if (content.startsWith("data:image")) {
      return content;
    }
    
    // Return as-is (might be base64 without prefix)
    return content;
  }
  
  // Handle direct image response format
  if (data.data?.[0]?.url) {
    return data.data[0].url;
  }
  
  if (data.data?.[0]?.b64_json) {
    return `data:image/png;base64,${data.data[0].b64_json}`;
  }

  throw new Error("Unexpected image generation response format");
}

/**
 * Generate multiple images
 */
export async function generateImages(
  prompt: string,
  count: number = 1,
  options: ImageGenerationOptions = {}
): Promise<string[]> {
  const results: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const image = await generateImage(prompt, options);
    results.push(image);
  }
  
  return results;
}

/**
 * Infographic prompt templates for common use cases
 */
export const INFOGRAPHIC_PROMPTS = {
  dimensionalVsCategorical: `Split infographic comparing personality assessment approaches: 
    Left side shows 16 rigid boxes in a 4x4 grid representing categorical MBTI types with red X overlay. 
    Right side shows 7 smooth horizontal gradient bars representing continuous dimensional scores with green checkmark. 
    Clean modern design, professional data visualization style, dark background with subtle gradients, 
    minimal text, clear visual metaphor of boxes vs spectrums. 1200x630 aspect ratio.`,

  adaptiveTesting: `Infographic showing adaptive testing process: 
    Branching decision tree flowing from top to bottom, starting with many paths that narrow down to a precise result. 
    Funnel visualization with questions entering at top and refined score emerging at bottom. 
    Blue to purple gradient, clean data visualization style, modern minimal aesthetic, 
    abstract representation without text. 1200x630 aspect ratio.`,

  evolutionTimeline: `Clean horizontal timeline infographic showing evolution of personality science: 
    Starting from 1920s (faded/sepia) through 1960s MBTI, 1980s Big Five, 2000s HEXACO, to 2024 PRISM-7 (vibrant). 
    Progressive visual transition from old/faded on left to modern/glowing on right. 
    Scientific aesthetic, dark background with gradient highlights, no text labels. 1200x630 aspect ratio.`,

  reliabilityComparison: `Data visualization comparing test reliability: 
    Two gauge/meter visualizations side by side - left one unstable/fluctuating showing 39-76% range in red, 
    right one stable showing 85-92% range in green. 
    Scientific validation visual, professional infographic style, 
    clear contrast between unstable and reliable measurements. 1200x630 aspect ratio.`,

  brainPersonality: `Abstract visualization of personality as neural pathways: 
    7 glowing nodes in spectrum colors (purple, blue, amber, green, red, cyan, pink) 
    connected by flowing light trails forming a network pattern. 
    Subtle brain silhouette outline in background, dark background, 
    modern scientific aesthetic suitable for hero section, no text. 1200x800 aspect ratio.`,

  compatibilityProfiles: `Two overlapping human silhouette profiles facing each other, 
    connected by harmonious flowing lines between matching trait areas. 
    Complementary colors (blue and orange), showing relationship compatibility concept. 
    Warm tones, abstract representation, 1200x630 aspect ratio.`,

  confidenceInterval: `Statistical infographic showing a data point with expanding confidence bands: 
    Central point estimate with radiating probability zones getting lighter toward edges. 
    Bell curve in subtle background, blue gradient color scheme, 
    educational scientific visualization style. 1200x630 aspect ratio.`,
} as const;

export type InfographicType = keyof typeof INFOGRAPHIC_PROMPTS;

