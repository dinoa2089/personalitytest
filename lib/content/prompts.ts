/**
 * Prompt Templates for Content Generation
 * These prompts are designed to generate detail-rich, non-generic content
 */

import { ContentTopic, TOPIC_DEFINITIONS } from "./types";
import { archetypes } from "../archetypes";
import { mbtiTypes } from "../mbti-content";
import { enneagramTypes } from "../enneagram-content";

interface PromptContext {
  typeName: string;
  typeDescription: string;
  strengths: string[];
  challenges: string[];
  workStyle?: string;
  relationshipStyle?: string;
  framework: "prism" | "mbti" | "enneagram";
  additionalContext?: string;
}

/**
 * Get context for a personality type
 */
export function getTypeContext(framework: "prism" | "mbti" | "enneagram", typeId: string): PromptContext {
  if (framework === "prism") {
    const archetype = archetypes.find(a => a.id === typeId);
    if (!archetype) throw new Error(`Unknown PRISM type: ${typeId}`);
    return {
      typeName: archetype.name,
      typeDescription: archetype.description.join(" "),
      strengths: archetype.strengths.map((s): string => typeof s === 'string' ? s : s.title),
      challenges: archetype.growthAreas.map((g): string => typeof g === 'string' ? g : g.title),
      workStyle: archetype.workStyle,
      relationshipStyle: archetype.relationshipStyle,
      framework: "prism",
      additionalContext: `Tagline: ${archetype.tagline}. At their best: ${archetype.atYourBest}. Under stress: ${archetype.whenStressed}. Communication style: ${archetype.communicationStyle}.`
    };
  } else if (framework === "mbti") {
    const mbtiType = mbtiTypes[typeId.toLowerCase()];
    if (!mbtiType) throw new Error(`Unknown MBTI type: ${typeId}`);
    return {
      typeName: `${mbtiType.code} - ${mbtiType.nickname}`,
      typeDescription: mbtiType.description.join(" "),
      strengths: mbtiType.strengths.map(s => `${s.title}: ${s.description}`),
      challenges: mbtiType.blindspots.map(b => `${b.title}: ${b.description}`),
      workStyle: mbtiType.inRelationships.workplace,
      relationshipStyle: mbtiType.inRelationships.romantic,
      framework: "mbti",
      additionalContext: `Rarity: ${mbtiType.rarity}. Tagline: ${mbtiType.tagline}. Cognitive functions: Dominant - ${mbtiType.cognitiveFunctions.dominant.name}, Auxiliary - ${mbtiType.cognitiveFunctions.auxiliary.name}.`
    };
  } else {
    const enneaType = enneagramTypes[typeId];
    if (!enneaType) throw new Error(`Unknown Enneagram type: ${typeId}`);
    return {
      typeName: `Type ${enneaType.number} - ${enneaType.name}`,
      typeDescription: enneaType.description.join(" "),
      strengths: enneaType.strengths,
      challenges: enneaType.challenges,
      relationshipStyle: enneaType.inRelationships,
      framework: "enneagram",
      additionalContext: `Core fear: ${enneaType.coreFear}. Core desire: ${enneaType.coreDesire}. Core motivation: ${enneaType.coreMotivation}. Health levels - Healthy: ${enneaType.healthLevels.healthy}. Growth direction: ${enneaType.growthLine.description}. Stress direction: ${enneaType.stressLine.description}.`
    };
  }
}

/**
 * Base system prompt for all content generation
 */
const BASE_SYSTEM_PROMPT = `You are an expert personality psychology writer creating in-depth, SEO-optimized content for a personality assessment platform. Your writing must be:

1. NARRATIVE-RICH: Each section MUST contain substantial narrative paragraphs (3-5 sentences minimum) BEFORE any bullet points. Tell stories, paint pictures, and draw readers in with flowing prose. Bullet points are supplements to narrative, not replacements. The reader should feel like they're reading a magazine feature article, not a PowerPoint deck.

2. SPECIFIC AND CONCRETE: Never use vague platitudes. Every point must include specific examples, scenarios, or actionable advice. Instead of "They are good communicators," write "In team meetings, they often synthesize multiple viewpoints into a coherent summary, typically waiting until others have spoken before offering their perspective."

3. PSYCHOLOGICALLY GROUNDED: Reference real psychological concepts, research findings, and theoretical frameworks where relevant. Cite concepts like cognitive functions, attachment theory, or workplace psychology naturally.

4. PRACTICAL AND ACTIONABLE: Include specific tips, strategies, and exercises that readers can immediately apply.

5. ENGAGING AND PERSONAL: Write as if speaking directly to someone who just discovered they are this type. Use "you" language. Make them feel understood and validated while being honest about challenges. Use vivid scenarios: "Picture yourself at a dinner party..." or "You know that feeling when..."

6. WELL-STRUCTURED: Use clear headings with substantial narrative content under each. Bullet points should accent and summarize, not carry the main content.

7. SEO-OPTIMIZED: Naturally incorporate relevant keywords without stuffing. Write compelling meta descriptions and use heading hierarchy properly.

8. MINIMUM LENGTH: Each section must have at least 200-300 words of narrative content. The total article must exceed 2,250 words.

CRITICAL: Avoid generic AI writing patterns. No "In conclusion," no "It's important to note that," no filler phrases. Every sentence should add value. Lead with STORY and NARRATIVE, not lists.`;

/**
 * Generate prompt for a specific topic
 */
export function generatePrompt(
  topic: ContentTopic,
  context: PromptContext
): { system: string; user: string } {
  const topicDef = TOPIC_DEFINITIONS[topic];
  
  const userPrompt = buildTopicPrompt(topic, context, topicDef);
  
  return {
    system: BASE_SYSTEM_PROMPT,
    user: userPrompt
  };
}

function buildTopicPrompt(
  topic: ContentTopic,
  context: PromptContext,
  topicDef: typeof TOPIC_DEFINITIONS[ContentTopic]
): string {
  const baseContext = `
PERSONALITY TYPE: ${context.typeName}
FRAMEWORK: ${context.framework.toUpperCase()}

TYPE DESCRIPTION:
${context.typeDescription}

KEY STRENGTHS:
${context.strengths.map(s => `- ${s}`).join("\n")}

KEY CHALLENGES:
${context.challenges.map(c => `- ${c}`).join("\n")}

${context.workStyle ? `WORK STYLE: ${context.workStyle}` : ""}
${context.relationshipStyle ? `RELATIONSHIP STYLE: ${context.relationshipStyle}` : ""}
${context.additionalContext ? `ADDITIONAL CONTEXT: ${context.additionalContext}` : ""}
`;

  const topicSpecificInstructions = getTopicSpecificInstructions(topic, context);

  return `${baseContext}

CONTENT REQUEST: Create a comprehensive ${topicDef.name} article for ${context.typeName}.

TARGET WORD COUNT: ${topicDef.targetWordCount} words minimum

REQUIRED SECTIONS:
${topicDef.requiredSections.map((s, i) => `${i + 1}. ${s}`).join("\n")}

SEO KEYWORDS TO INCORPORATE NATURALLY:
${topicDef.seoKeywords.map(k => `- "${context.typeName} ${k}"`).join("\n")}

${topicSpecificInstructions}

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "title": "SEO-optimized page title (50-60 chars)",
  "metaDescription": "Compelling meta description (150-160 chars)",
  "keywords": ["array", "of", "target", "keywords"],
  "introduction": "2-3 paragraph introduction that hooks the reader and validates their type",
  "sections": [
    {
      "heading": "Section Heading",
      "content": "Detailed markdown content for this section...",
      "subsections": [
        {
          "heading": "Subsection Heading",
          "content": "Subsection content..."
        }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Commonly asked question?",
      "answer": "Detailed, helpful answer..."
    }
  ],
  "keyTakeaways": ["5-7 key takeaways as bullet points"]
}`;
}

function getTopicSpecificInstructions(topic: ContentTopic, context: PromptContext): string {
  const narrativeReminder = `
NARRATIVE REQUIREMENT (CRITICAL):
Every section must open with 2-4 paragraphs of flowing narrative prose that tells a story or paints a vivid picture BEFORE any bullet points or lists. Use scenarios like "Imagine yourself in a meeting where..." or "You've probably experienced that moment when..." The reader should feel immersed, not like they're reading a manual. Aim for magazine-quality prose that draws them in emotionally.

`;

  const instructions: Record<ContentTopic, string> = {
    learning: narrativeReminder + `
SPECIFIC REQUIREMENTS FOR LEARNING STYLE CONTENT:
- Open with a vivid narrative about this type's relationship with learning - perhaps a scene from their school days or a moment of breakthrough
- Include specific study techniques that work for this type (e.g., "Use color-coded mind maps" not just "visual learning")
- Describe optimal study environments with rich sensory details - what does their ideal study space look, sound, and feel like?
- Provide a sample study schedule or routine woven into a narrative about a typical study day
- Address both formal education and self-directed learning with stories and examples
- Include specific book/course format recommendations (video vs text vs interactive)
- Describe how this type handles exams, deadlines, and group projects through scenarios
- Include a "Quick Study Tips" section with 5-7 immediately actionable tips`,

    careers: narrativeReminder + `
SPECIFIC REQUIREMENTS FOR CAREER CONTENT:
- Open with a narrative about this type discovering their professional calling or struggling in the wrong career
- List 15+ specific job titles with salary ranges where appropriate
- Explain WHY each career fits through storytelling, not just bullet points
- Include vivid "day in the life" scenarios for top 3-5 career matches (full paragraphs, not bullets)
- Discuss industry sectors through the lens of how this type would experience them
- Address career progression with a narrative arc - early career, mid-career, senior positions
- Include specific interview tips woven into a scenario of them in an interview
- Discuss freelance/entrepreneurship with stories of what that journey might look like`,

    relationships: narrativeReminder + `
SPECIFIC REQUIREMENTS FOR RELATIONSHIP CONTENT:
- Open with a vivid narrative of this type falling in love or navigating a relationship challenge
- Include rich scenarios (first dates, conflicts, long-term milestones) told as mini-stories
- Address attachment style tendencies through narrative, not clinical description
- Provide specific conversation starters and date ideas within context
- Discuss love languages alignment with examples of how they show and receive love
- Include "red flags to watch for" framed as cautionary tales
- Address breakups through the emotional journey, not just tips
- Include advice for partners OF this type written as if speaking to that partner`,

    communication: narrativeReminder + `
SPECIFIC REQUIREMENTS FOR COMMUNICATION CONTENT:
- Open with a scene showing this type in conversation - what does it look and feel like?
- Include specific phrases this type commonly uses with context for when/why
- Describe non-verbal communication through vivid observation
- Address email/text vs in-person with scenarios showing the difference
- Include "scripts" for difficult conversations embedded in narrative scenarios
- Describe listening style through the eyes of someone being listened to by this type
- Address conflict communication through a story of a disagreement
- Include tips for others framed as "when talking to this type, imagine..."`,

    stress: narrativeReminder + `
SPECIFIC REQUIREMENTS FOR STRESS CONTENT:
- Open with a visceral narrative of this type under stress - what does it feel like from inside?
- Describe physical manifestations through the experience, not just a symptom list
- Include specific de-escalation techniques within scenarios of using them
- Provide a "stress recovery routine" as a narrative of a recovery day/week
- Address workplace vs personal stress through contrasting scenarios
- Include warning signs framed as "you might notice yourself..."
- Discuss professional help through a compassionate narrative about when it's time
- Address how loved ones can help through the perspective of a caring partner or friend`,

    leadership: narrativeReminder + `
SPECIFIC REQUIREMENTS FOR LEADERSHIP CONTENT:
- Open with a narrative of this type stepping into a leadership moment
- Include specific management scenarios told as stories with dialogue
- Address different contexts (startup vs corporate) through contrasting narratives
- Discuss leadership frameworks through how this type would naturally embody them
- Include delegation strategies within a scene of them delegating
- Address feedback and reviews through a scenario of giving difficult feedback
- Discuss crisis leadership through a vivid crisis scenario
- Address organizational politics through a narrative of navigating a tricky situation`,

    growth: narrativeReminder + `
SPECIFIC REQUIREMENTS FOR GROWTH CONTENT:
- Open with a narrative of this type at a growth crossroads or breakthrough moment
- Include specific 30-day challenges framed as a journey narrative
- Address shadow work through exploration of what they might discover about themselves
- Provide journaling prompts within context of why they matter for this type
- Include book/resource recommendations with narrative about how they'd benefit
- Discuss therapy approaches through the experience of starting therapy
- Include milestone markers as a story of what growth looks like over time
- Discuss daily habit integration through a narrative of transformed daily life`,

    workplace: narrativeReminder + `
SPECIFIC REQUIREMENTS FOR WORKPLACE CONTENT:
- Open with a narrative of this type's typical workday or a pivotal work moment
- Describe meeting behaviors through a scene of them in a meeting
- Address office environment preferences through sensory description
- Include email/Slack patterns through example exchanges with context
- Discuss project management through a narrative of them running a project
- Address feedback through scenarios of receiving and giving it
- Include workplace tips within stories of navigating common situations
- Address work-life balance through the narrative of finding (or losing) balance`,

    compatibility: narrativeReminder + `
SPECIFIC REQUIREMENTS FOR COMPATIBILITY CONTENT:
- Open with a narrative about what this type seeks in connection and why
- Rank compatibility with ALL other types but introduce top matches through relationship vignettes
- Include specific dynamics for top 5 matches as mini-stories of those relationships
- Address challenging pairings through narratives of the friction points
- Show how compatibility differs by relationship type through contrasting scenarios
- Include compromise strategies within stories of couples/friends working through issues
- Discuss deal-breakers through the emotional experience of encountering them
- Address group dynamics through a scene of this type in a group of mixed types`
  };

  return instructions[topic];
}

/**
 * Get all PRISM archetype IDs
 */
export function getPrismTypeIds(): string[] {
  return archetypes.map(a => a.id);
}

/**
 * Get all MBTI type IDs
 */
export function getMbtiTypeIds(): string[] {
  return Object.keys(mbtiTypes);
}

/**
 * Get all Enneagram type IDs
 */
export function getEnneagramTypeIds(): string[] {
  return Object.keys(enneagramTypes);
}

