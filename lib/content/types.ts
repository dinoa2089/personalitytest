/**
 * Content Types for Generated SEO Pages
 */

export type ContentTopic = 
  | "learning"
  | "careers"
  | "relationships"
  | "communication"
  | "stress"
  | "leadership"
  | "growth"
  | "workplace"
  | "compatibility";

export type ContentFramework = "prism" | "mbti" | "enneagram";

export interface ContentSection {
  heading: string;
  content: string; // Markdown content
  subsections?: Array<{
    heading: string;
    content: string;
  }>;
}

export interface ContentFAQ {
  question: string;
  answer: string;
}

export interface GeneratedContent {
  // Identifiers
  id: string; // e.g., "innovator-learning", "intj-careers"
  type: string; // e.g., "innovator", "intj", "1"
  framework: ContentFramework;
  topic: ContentTopic;
  
  // SEO metadata
  title: string;
  metaDescription: string;
  keywords: string[];
  
  // Page content
  introduction: string; // Opening paragraph
  sections: ContentSection[];
  
  // Structured data
  faqs: ContentFAQ[];
  keyTakeaways: string[];
  
  // Related content
  relatedTopics: string[]; // Other topic pages for this type
  relatedTypes: string[]; // Similar types to explore
  
  // Generation metadata
  generatedAt: string;
  model: string;
  wordCount: number;
}

export interface TopicDefinition {
  id: ContentTopic;
  name: string;
  description: string;
  targetWordCount: number;
  requiredSections: string[];
  seoKeywords: string[];
}

export const TOPIC_DEFINITIONS: Record<ContentTopic, TopicDefinition> = {
  learning: {
    id: "learning",
    name: "Learning Style",
    description: "How this personality type learns most effectively",
    targetWordCount: 2500,
    requiredSections: [
      "Overview of Learning Preferences",
      "Optimal Learning Environments",
      "Study Strategies That Work",
      "Common Learning Challenges",
      "Tips for Educators",
      "Self-Directed Learning Approaches"
    ],
    seoKeywords: ["learning style", "study tips", "education", "how to learn", "study methods"]
  },
  careers: {
    id: "careers",
    name: "Career Guide",
    description: "In-depth career guidance and job fit analysis",
    targetWordCount: 2800,
    requiredSections: [
      "Career Strengths",
      "Ideal Work Environments",
      "Top Career Paths",
      "Careers to Approach with Caution",
      "Career Development Strategies",
      "Negotiating and Advancing",
      "Entrepreneurship Potential"
    ],
    seoKeywords: ["careers", "jobs", "career path", "best jobs for", "career advice"]
  },
  relationships: {
    id: "relationships",
    name: "Relationships",
    description: "How this type approaches romantic, friendship, and family relationships",
    targetWordCount: 2800,
    requiredSections: [
      "Relationship Strengths",
      "Romantic Partnerships",
      "Dating and Attraction",
      "Long-Term Relationship Dynamics",
      "Friendships",
      "Family Relationships",
      "Common Relationship Challenges"
    ],
    seoKeywords: ["relationships", "dating", "love", "compatibility", "friendship"]
  },
  communication: {
    id: "communication",
    name: "Communication Style",
    description: "How this type communicates and how to communicate with them",
    targetWordCount: 2250,
    requiredSections: [
      "Communication Strengths",
      "Natural Communication Style",
      "How They Express Themselves",
      "What They Need from Others",
      "Potential Miscommunications",
      "Tips for Communicating With This Type",
      "Written vs Verbal Communication"
    ],
    seoKeywords: ["communication style", "how to talk to", "communication tips"]
  },
  stress: {
    id: "stress",
    name: "Stress & Coping",
    description: "How this type experiences and manages stress",
    targetWordCount: 2500,
    requiredSections: [
      "Common Stress Triggers",
      "Signs of Stress",
      "Unhealthy Stress Responses",
      "Healthy Coping Strategies",
      "Recovery and Restoration",
      "Building Long-Term Resilience",
      "Supporting This Type Under Stress"
    ],
    seoKeywords: ["stress management", "coping strategies", "anxiety", "burnout", "resilience"]
  },
  leadership: {
    id: "leadership",
    name: "Leadership Style",
    description: "Leadership strengths, style, and development areas",
    targetWordCount: 2500,
    requiredSections: [
      "Natural Leadership Strengths",
      "Leadership Style in Action",
      "How They Motivate Others",
      "Decision-Making Approach",
      "Potential Leadership Blind Spots",
      "Developing as a Leader",
      "Best Leadership Contexts"
    ],
    seoKeywords: ["leadership style", "management", "leader", "team leadership"]
  },
  growth: {
    id: "growth",
    name: "Personal Growth",
    description: "Personal development guide and growth opportunities",
    targetWordCount: 2500,
    requiredSections: [
      "Growth Mindset for This Type",
      "Key Development Areas",
      "Practical Growth Exercises",
      "Overcoming Core Challenges",
      "Developing Weaker Functions",
      "Signs of Personal Growth",
      "Long-Term Development Path"
    ],
    seoKeywords: ["personal growth", "self improvement", "development", "personal development"]
  },
  workplace: {
    id: "workplace",
    name: "At Work",
    description: "Workplace dynamics, team roles, and professional behavior",
    targetWordCount: 2500,
    requiredSections: [
      "Workplace Strengths",
      "Ideal Role and Responsibilities",
      "Team Dynamics",
      "Working with Different Types",
      "Meeting and Collaboration Style",
      "Potential Workplace Challenges",
      "Career Advancement Tips"
    ],
    seoKeywords: ["workplace", "at work", "team", "professional", "office"]
  },
  compatibility: {
    id: "compatibility",
    name: "Compatibility",
    description: "How this type pairs with other personality types",
    targetWordCount: 2800,
    requiredSections: [
      "What This Type Seeks in Others",
      "Best Compatibility Matches",
      "Challenging Pairings",
      "Romantic Compatibility",
      "Friendship Compatibility",
      "Work Compatibility",
      "Tips for Any Pairing"
    ],
    seoKeywords: ["compatibility", "matches", "relationships", "partner", "compatible"]
  }
};

export const ALL_TOPICS: ContentTopic[] = Object.keys(TOPIC_DEFINITIONS) as ContentTopic[];

