import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Scrape job description from a URL
 * Supports common job boards and generic websites
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    
    // Extract job description based on the domain
    const hostname = parsedUrl.hostname.toLowerCase();
    let jobDescription = "";
    let jobTitle = "";

    if (hostname.includes("linkedin.com")) {
      const result = extractLinkedIn(html);
      jobDescription = result.description;
      jobTitle = result.title;
    } else if (hostname.includes("indeed.com")) {
      const result = extractIndeed(html);
      jobDescription = result.description;
      jobTitle = result.title;
    } else if (hostname.includes("glassdoor.com")) {
      const result = extractGlassdoor(html);
      jobDescription = result.description;
      jobTitle = result.title;
    } else if (hostname.includes("greenhouse.io")) {
      const result = extractGreenhouse(html);
      jobDescription = result.description;
      jobTitle = result.title;
    } else if (hostname.includes("lever.co")) {
      const result = extractLever(html);
      jobDescription = result.description;
      jobTitle = result.title;
    } else if (hostname.includes("workday.com")) {
      const result = extractWorkday(html);
      jobDescription = result.description;
      jobTitle = result.title;
    } else {
      // Generic extraction for unknown sites
      const result = extractGeneric(html);
      jobDescription = result.description;
      jobTitle = result.title;
    }

    if (!jobDescription || jobDescription.length < 50) {
      return NextResponse.json(
        { 
          error: "Could not extract job description from this URL. Try copying and pasting the job description directly.",
          partialContent: jobDescription || null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      jobDescription,
      jobTitle,
      sourceUrl: url,
      hostname,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to scrape URL. The site may be blocking automated access." },
      { status: 500 }
    );
  }
}

// Helper to clean HTML and extract text
function cleanHtml(html: string): string {
  return html
    // Remove scripts and styles
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
    // Remove HTML tags
    .replace(/<[^>]+>/g, " ")
    // Decode HTML entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&bull;/g, "•")
    // Clean up whitespace
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(html: string): string {
  // Try to find title in various places
  const patterns = [
    /<h1[^>]*class="[^"]*job[^"]*title[^"]*"[^>]*>([^<]+)/i,
    /<h1[^>]*>([^<]+)/i,
    /<title>([^<|]+)/i,
    /data-job-title="([^"]+)"/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return cleanHtml(match[1]).slice(0, 200);
    }
  }
  return "";
}

function extractLinkedIn(html: string): { title: string; description: string } {
  let description = "";
  let title = "";

  // LinkedIn job description is often in a specific div
  const descPatterns = [
    /<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*show-more-less-html__markup[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<section[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/section>/i,
  ];

  for (const pattern of descPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      description = cleanHtml(match[1]);
      if (description.length > 100) break;
    }
  }

  // Extract title
  const titleMatch = html.match(/<h1[^>]*class="[^"]*top-card-layout__title[^"]*"[^>]*>([^<]+)/i);
  if (titleMatch) {
    title = cleanHtml(titleMatch[1]);
  }

  if (!description) {
    description = extractGeneric(html).description;
  }

  return { title, description };
}

function extractIndeed(html: string): { title: string; description: string } {
  let description = "";
  let title = "";

  // Indeed job description
  const descPatterns = [
    /<div[^>]*id="jobDescriptionText"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*jobsearch-jobDescriptionText[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of descPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      description = cleanHtml(match[1]);
      if (description.length > 100) break;
    }
  }

  // Extract title
  const titleMatch = html.match(/<h1[^>]*class="[^"]*jobsearch-JobInfoHeader-title[^"]*"[^>]*>([^<]+)/i);
  if (titleMatch) {
    title = cleanHtml(titleMatch[1]);
  }

  if (!description) {
    description = extractGeneric(html).description;
  }

  return { title, description };
}

function extractGlassdoor(html: string): { title: string; description: string } {
  let description = "";
  let title = "";

  const descPatterns = [
    /<div[^>]*class="[^"]*jobDescriptionContent[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*desc[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of descPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      description = cleanHtml(match[1]);
      if (description.length > 100) break;
    }
  }

  if (!description) {
    description = extractGeneric(html).description;
  }

  title = extractTitle(html);

  return { title, description };
}

function extractGreenhouse(html: string): { title: string; description: string } {
  let description = "";
  let title = "";

  // Greenhouse uses a content div
  const descPatterns = [
    /<div[^>]*id="content"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*id="application"/i,
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of descPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      description = cleanHtml(match[1]);
      if (description.length > 100) break;
    }
  }

  // Greenhouse title
  const titleMatch = html.match(/<h1[^>]*class="[^"]*app-title[^"]*"[^>]*>([^<]+)/i);
  if (titleMatch) {
    title = cleanHtml(titleMatch[1]);
  }

  if (!description) {
    description = extractGeneric(html).description;
  }

  return { title, description };
}

function extractLever(html: string): { title: string; description: string } {
  let description = "";
  let title = "";

  // Lever uses posting-page-content
  const descPatterns = [
    /<div[^>]*class="[^"]*posting-page-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*section-wrapper[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of descPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      description = cleanHtml(match[1]);
      if (description.length > 100) break;
    }
  }

  title = extractTitle(html);

  if (!description) {
    description = extractGeneric(html).description;
  }

  return { title, description };
}

function extractWorkday(html: string): { title: string; description: string } {
  let description = "";
  let title = "";

  // Workday often has description in data attributes or specific divs
  const descPatterns = [
    /<div[^>]*data-automation-id="jobPostingDescription"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*job-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of descPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      description = cleanHtml(match[1]);
      if (description.length > 100) break;
    }
  }

  title = extractTitle(html);

  if (!description) {
    description = extractGeneric(html).description;
  }

  return { title, description };
}

function extractGeneric(html: string): { title: string; description: string } {
  let description = "";
  let title = extractTitle(html);

  // Try common job description patterns
  const patterns = [
    // Look for common job description containers
    /<div[^>]*class="[^"]*job[-_]?description[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    /<div[^>]*id="[^"]*job[-_]?description[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    /<section[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/section>/gi,
    /<article[^>]*>([\s\S]*?)<\/article>/gi,
    // Look for main content area
    /<main[^>]*>([\s\S]*?)<\/main>/gi,
  ];

  for (const pattern of patterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      const content = cleanHtml(match[1]);
      // Keep the longest description found
      if (content.length > description.length && content.length > 100) {
        description = content;
      }
    }
    if (description.length > 500) break;
  }

  // If still no description, try to get the body content and find job-related text
  if (!description || description.length < 100) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      const bodyText = cleanHtml(bodyMatch[1]);
      
      // Look for sections that contain job-related keywords
      const jobKeywords = [
        "responsibilities",
        "requirements",
        "qualifications",
        "experience",
        "about the role",
        "what you'll do",
        "what we're looking for",
        "skills",
        "benefits",
      ];
      
      // Find the start of job-related content
      let startIndex = -1;
      for (const keyword of jobKeywords) {
        const idx = bodyText.toLowerCase().indexOf(keyword);
        if (idx !== -1 && (startIndex === -1 || idx < startIndex)) {
          startIndex = Math.max(0, idx - 100); // Include some context before
        }
      }
      
      if (startIndex !== -1) {
        // Extract a reasonable chunk of text
        description = bodyText.slice(startIndex, startIndex + 5000);
      } else {
        // Just take a chunk from the middle of the body
        const mid = Math.floor(bodyText.length / 4);
        description = bodyText.slice(mid, mid + 5000);
      }
    }
  }

  // Limit length
  if (description.length > 10000) {
    description = description.slice(0, 10000);
  }

  return { title, description };
}

