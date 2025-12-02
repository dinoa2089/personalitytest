import { NextRequest, NextResponse } from "next/server";
import { generateImage, INFOGRAPHIC_PROMPTS, type InfographicType } from "@/lib/openrouter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, customPrompt } = body as {
      type?: InfographicType;
      customPrompt?: string;
    };

    // Determine which prompt to use
    let prompt: string;
    
    if (customPrompt) {
      prompt = customPrompt;
    } else if (type && type in INFOGRAPHIC_PROMPTS) {
      prompt = INFOGRAPHIC_PROMPTS[type];
    } else {
      return NextResponse.json(
        { 
          error: "Invalid request. Provide either 'type' (one of: " + 
                 Object.keys(INFOGRAPHIC_PROMPTS).join(", ") + 
                 ") or 'customPrompt'." 
        },
        { status: 400 }
      );
    }

    // Generate the image
    const imageUrl = await generateImage(prompt);

    return NextResponse.json({
      success: true,
      imageUrl,
      type: type || "custom",
    });
  } catch (error) {
    console.error("Infographic generation error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate infographic",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available infographic types
  return NextResponse.json({
    availableTypes: Object.keys(INFOGRAPHIC_PROMPTS),
    usage: {
      method: "POST",
      body: {
        type: "One of the available types, OR",
        customPrompt: "Your own image generation prompt"
      }
    }
  });
}

