/**
 * Script to generate AI infographics for PRISM-7
 * Uses OpenRouter with Nano Banana Pro or other image models
 * 
 * Usage:
 *   npx tsx scripts/generate-infographics.ts [infographic-type]
 *   
 * Examples:
 *   npx tsx scripts/generate-infographics.ts all
 *   npx tsx scripts/generate-infographics.ts dimensionalVsCategorical
 *   npx tsx scripts/generate-infographics.ts adaptiveTesting
 */

import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// Infographic prompts
const INFOGRAPHIC_CONFIGS = {
  dimensionalVsCategorical: {
    filename: "dimensional-vs-categorical.png",
    prompt: `Create a clean split infographic comparing personality assessment approaches:

LEFT SIDE (labeled "Categorical"):
- Show a 4x4 grid of 16 rigid boxes/squares representing MBTI types
- Each box is a solid color, clearly separated
- Include a subtle red X or warning indicator
- Represents rigid binary classification

RIGHT SIDE (labeled "Dimensional"):  
- Show 7 horizontal gradient bars/spectrums
- Each bar smoothly transitions from low to high
- Include a subtle green checkmark indicator
- Represents continuous measurement

STYLE:
- Modern, professional data visualization aesthetic
- Dark background (#0f172a) with subtle blue/purple gradients
- Clean minimalist design
- High contrast for readability
- Suitable for science/education context
- 1200x630 pixel aspect ratio
- No text except minimal labels`,
  },

  adaptiveTesting: {
    filename: "adaptive-testing.png",
    prompt: `Create an infographic showing how adaptive testing works:

CONCEPT:
- Branching decision tree flowing from top to bottom
- Starts with MANY question nodes at the top (wide)
- Progressively narrows down through branches
- Ends with a SINGLE precise result at the bottom (narrow)
- Shows the "funnel" concept of adaptive questioning

VISUAL ELEMENTS:
- Abstract nodes/circles representing questions
- Connecting lines showing branching paths
- Some paths highlighted, others faded (showing selected vs skipped)
- Glowing result point at bottom

STYLE:
- Blue to purple gradient color scheme
- Dark background
- Clean, modern data visualization aesthetic
- Abstract/geometric representation
- No text
- 1200x630 aspect ratio`,
  },

  evolutionTimeline: {
    filename: "evolution-timeline.png",
    prompt: `Create a horizontal timeline infographic showing the evolution of personality science:

TIMELINE POINTS (left to right):
1. 1920s - Jungian Theory (oldest, most faded)
2. 1960s - MBTI (faded)
3. 1980s - Big Five (clearer)
4. 2000s - HEXACO (modern)
5. 2024 - PRISM-7 (most vibrant, glowing)

VISUAL PROGRESSION:
- Sepia/faded aesthetic on the left gradually transitioning to vibrant/modern on the right
- Each milestone represented by an abstract icon or symbol
- Connecting line showing progression
- Background gets more colorful/sophisticated from left to right

STYLE:
- Scientific aesthetic
- Dark background with gradient highlights
- Shows progression from old to new
- No text labels (icons/symbols only)
- 1200x630 aspect ratio`,
  },

  brainPersonality: {
    filename: "brain-personality-hero.png",
    prompt: `Create an abstract hero image representing personality dimensions as neural pathways:

MAIN ELEMENTS:
- 7 glowing nodes arranged in a pattern, each in a different color:
  * Purple (Openness)
  * Blue (Conscientiousness)
  * Amber/Orange (Extraversion)
  * Green (Agreeableness)
  * Red (Emotional Resilience)
  * Cyan (Honesty-Humility)
  * Pink (Adaptability)
- Flowing light trails connecting all nodes
- Network pattern suggesting neural connections

BACKGROUND:
- Subtle brain silhouette outline (very faint)
- Dark background (#0a0a0a to #1a1a2e gradient)
- Particle effects or stars in the void

STYLE:
- Modern scientific aesthetic
- Ethereal, glowing quality
- Suitable for website hero section
- No text
- 1200x800 aspect ratio`,
  },

  reliabilityComparison: {
    filename: "reliability-comparison.png",
    prompt: `Create a data visualization comparing test reliability:

LEFT GAUGE (labeled "MBTI"):
- Circular gauge/meter showing unstable measurement
- Needle fluctuating between 39-76% range
- Red color scheme
- Visual indication of instability (wavy lines, multiple positions)
- Warning/negative indicator

RIGHT GAUGE (labeled "PRISM-7"):
- Circular gauge/meter showing stable measurement
- Needle steady at 85-92% range
- Green color scheme
- Visual indication of stability (solid, consistent)
- Success/positive indicator

STYLE:
- Professional scientific infographic
- Dark background
- High contrast gauges
- Clean, readable design
- 1200x630 aspect ratio`,
  },

  compatibilityProfiles: {
    filename: "compatibility-profiles.png",
    prompt: `Create an artistic visualization of personality compatibility:

MAIN ELEMENTS:
- Two abstract human profile silhouettes facing each other
- Left profile in blue tones
- Right profile in orange/amber tones
- Flowing harmonious lines connecting between them
- Lines connecting at "matching" points suggesting compatibility
- Some lines bright (strong connections), some subtle (weaker matches)

STYLE:
- Warm, relationship-focused aesthetic
- Gradient backgrounds behind each profile
- Ethereal, flowing quality
- Abstract representation (not realistic faces)
- Romantic/professional dual interpretation possible
- 1200x630 aspect ratio`,
  },

  confidenceInterval: {
    filename: "confidence-interval.png",
    prompt: `Create a statistical infographic explaining confidence intervals:

MAIN VISUALIZATION:
- Central point (dot) representing the measured score
- Expanding bands/zones radiating outward from the point
- Inner zone (darkest): highest probability
- Middle zone: medium probability
- Outer zone (lightest): lower probability
- Shows 90% confidence interval concept

BACKGROUND:
- Subtle bell curve shape in the far background
- Helps contextualize the normal distribution concept

STYLE:
- Blue gradient color scheme
- Educational, scientific aesthetic
- Clean, minimal design
- Professional data visualization
- 1200x630 aspect ratio`,
  },

  blogHeaderMBTI: {
    filename: "blog/mbti-critique-header.png",
    prompt: `Create a blog header image for an article about MBTI limitations:

CONCEPT:
- MBTI four-letter type codes (like INTJ, ENFP) appearing to crumble, pixelate, or dissolve
- Contrasted with solid, stable dimensional bars/graphs standing firm
- Visual metaphor of unstable categorical assessment vs stable dimensional measurement

LEFT SIDE:
- Crumbling/dissolving letters, red-tinted
- Represents failing methodology

RIGHT SIDE:
- Solid bar charts or dimensional scales, green-tinted
- Represents robust measurement

STYLE:
- Scientific critique aesthetic
- Dark background
- Dramatic contrast
- Blog header format 1200x630
- No text`,
  },

  blogHeaderScience: {
    filename: "blog/science-compatibility-header.png",
    prompt: `Create a blog header image about the science of compatibility:

CONCEPT:
- Two personality radar charts overlapping
- One chart in blue, one in orange
- Where they overlap: harmony/green glow
- Abstract representation of two personalities finding compatibility

STYLE:
- Scientific but warm aesthetic
- Data visualization meets relationship warmth
- Dark background with colorful elements
- Blog header format 1200x630`,
  },
};

type InfographicKey = keyof typeof INFOGRAPHIC_CONFIGS;

async function generateImage(prompt: string, model: string = "nana-banana/nano-banana-pro"): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not set in environment");
  }

  console.log(`  Calling OpenRouter API with model: ${model}`);
  
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
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  // Extract image URL from response
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content in API response");
  }

  // Return the URL or data URI
  return content;
}

async function downloadImage(url: string, outputPath: string): Promise<void> {
  // If it's a data URI, decode and save directly
  if (url.startsWith("data:image")) {
    const base64Data = url.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(outputPath, buffer);
    return;
  }

  // If it's a URL, download it
  if (url.startsWith("http")) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    return;
  }

  // Assume it's base64 without prefix
  const buffer = Buffer.from(url, "base64");
  fs.writeFileSync(outputPath, buffer);
}

async function generateInfographic(key: InfographicKey): Promise<void> {
  const config = INFOGRAPHIC_CONFIGS[key];
  console.log(`\nGenerating: ${key}`);
  console.log(`  Output: ${config.filename}`);

  try {
    const imageData = await generateImage(config.prompt);
    
    // Ensure output directory exists
    const outputDir = path.join(__dirname, "..", "public", "infographics");
    const outputPath = path.join(outputDir, config.filename);
    
    // Create subdirectories if needed
    const fileDir = path.dirname(outputPath);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    await downloadImage(imageData, outputPath);
    console.log(`  ✓ Saved to: ${outputPath}`);
  } catch (error) {
    console.error(`  ✗ Failed: ${error}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const target = args[0] || "all";

  console.log("=================================");
  console.log("PRISM-7 Infographic Generator");
  console.log("=================================");

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("\n❌ OPENROUTER_API_KEY not found in environment");
    console.log("\nSet it in your .env file or run:");
    console.log("  export OPENROUTER_API_KEY=your_key_here");
    process.exit(1);
  }

  const availableKeys = Object.keys(INFOGRAPHIC_CONFIGS) as InfographicKey[];

  if (target === "all") {
    console.log(`\nGenerating all ${availableKeys.length} infographics...`);
    for (const key of availableKeys) {
      await generateInfographic(key);
      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } else if (target === "list") {
    console.log("\nAvailable infographics:");
    availableKeys.forEach((key) => {
      console.log(`  - ${key}: ${INFOGRAPHIC_CONFIGS[key].filename}`);
    });
  } else if (availableKeys.includes(target as InfographicKey)) {
    await generateInfographic(target as InfographicKey);
  } else {
    console.error(`\n❌ Unknown infographic: ${target}`);
    console.log("\nAvailable options:");
    console.log("  all - Generate all infographics");
    console.log("  list - List available infographics");
    availableKeys.forEach((key) => {
      console.log(`  ${key}`);
    });
    process.exit(1);
  }

  console.log("\n✓ Done!");
}

main().catch(console.error);

