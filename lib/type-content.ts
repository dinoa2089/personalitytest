import { archetypes, type Archetype } from "./archetypes";

export interface TypePageContent {
  archetype: Archetype;
  seoTitle: string;
  seoDescription: string;
  longDescription: string[];
  detailedStrengths: Array<{
    title: string;
    description: string;
  }>;
  detailedGrowthAreas: Array<{
    title: string;
    description: string;
  }>;
  inRelationships: {
    romantic: string;
    friendship: string;
    professional: string;
  };
  commonMisunderstandings: string[];
  selfCareAdvice: string[];
  relatedTypes: string[]; // IDs of related archetypes
}

// Extended content for each archetype
const extendedContent: Record<string, Partial<TypePageContent>> = {
  innovator: {
    seoTitle: "The Innovator Personality Type | PRISM-7 Assessment",
    seoDescription: "Discover if you're The Innovator - a creative visionary who thrives on possibility. Only 7.2% of people share this type. Take the free assessment.",
    longDescription: [
      "Innovators are the dreamers and creators of the world. They possess an insatiable curiosity that drives them to explore new ideas, challenge conventions, and envision possibilities that others might dismiss as impossible. This rare combination of high Openness and Adaptability, paired with a more relaxed approach to structure, creates individuals who are uniquely positioned to bring fresh perspectives to any situation.",
      "If you're an Innovator, you likely find yourself constantly generating new ideas and seeing connections that others miss. You're energized by brainstorming sessions and creative challenges, and you may struggle with routine tasks that don't engage your imagination. Your natural inclination is to ask 'What if?' and to push boundaries in pursuit of better solutions.",
      "In the workplace, Innovators excel in roles that require creative problem-solving, strategic thinking, and the ability to adapt to changing circumstances. However, they may need support in areas like follow-through and detail management. The key to success for Innovators is finding environments that value their creative contributions while providing structure to help bring their ideas to fruition.",
    ],
    detailedStrengths: [
      { title: "Creative Vision", description: "You see possibilities where others see limitations. Your ability to envision new solutions and approaches is a rare gift that can transform organizations and industries." },
      { title: "Adaptability", description: "Change doesn't scare you—it excites you. You're able to pivot quickly and turn uncertainty into opportunity." },
      { title: "Pattern Recognition", description: "You naturally see connections between seemingly unrelated concepts, enabling breakthrough innovations." },
      { title: "Enthusiasm", description: "Your passion for ideas is contagious. You inspire others to think bigger and embrace new possibilities." },
    ],
    detailedGrowthAreas: [
      { title: "Follow-Through", description: "Starting projects is exciting, but finishing them is where value is created. Consider partnering with detail-oriented collaborators." },
      { title: "Structure", description: "While constraints can feel limiting, some structure can actually enhance your creativity by providing a framework for your ideas." },
      { title: "Patience with Details", description: "Not everyone moves as quickly as you do. Taking time to address the specifics can prevent problems down the road." },
    ],
    inRelationships: {
      romantic: "As a romantic partner, you bring excitement, novelty, and intellectual stimulation. You value deep conversations and shared adventures. Your ideal partner appreciates your creativity and gives you space to explore, while providing some grounding energy.",
      friendship: "You're the friend who suggests spontaneous road trips and introduces everyone to new ideas. You value friends who can match your intellectual curiosity and aren't threatened by your need for independence.",
      professional: "You thrive in collaborative environments where ideas are valued. You may clash with overly rigid structures but shine when given creative freedom with clear goals.",
    },
    commonMisunderstandings: [
      "People may see you as scattered when you're actually seeing connections they can't",
      "Your need for novelty isn't flightiness—it's how you stay engaged and productive",
      "When you challenge ideas, you're not being difficult—you're helping improve them",
    ],
    selfCareAdvice: [
      "Create dedicated time for unstructured creative exploration",
      "Balance your mental energy with physical activities",
      "Give yourself permission to finish fewer projects to a higher quality",
      "Find a 'finisher' partner or colleague who can help bring your ideas to completion",
    ],
    relatedTypes: ["architect", "catalyst", "explorer"],
  },
  architect: {
    seoTitle: "The Architect Personality Type | PRISM-7 Assessment",
    seoDescription: "Discover if you're The Architect - a systematic innovator who builds the future. Only 4.8% of people share this type. Take the free assessment.",
    longDescription: [
      "Architects are rare individuals who combine visionary thinking with systematic execution. They don't just dream—they build. This powerful combination of high Openness and Conscientiousness creates people who can envision revolutionary ideas and then methodically bring them to life.",
      "If you're an Architect, you likely spend significant time thinking deeply about how things work and how they could work better. You're drawn to complex problems that require both creativity and precision. While you may prefer solitary work, your contributions often transform entire fields.",
      "Architects are often found in roles that require both innovation and rigor: software architecture, scientific research, urban planning, and systems design. They create lasting structures—whether physical, organizational, or conceptual—that stand the test of time.",
    ],
    detailedStrengths: [
      { title: "Systems Thinking", description: "You naturally see how parts connect to form wholes, enabling you to design elegant, efficient solutions." },
      { title: "Innovation + Execution", description: "You don't just have ideas—you implement them. This rare combination makes your contributions uniquely valuable." },
      { title: "Independent Thinking", description: "You're not swayed by popular opinion and can develop genuinely original approaches." },
      { title: "Quality Focus", description: "You maintain high standards and are willing to invest the time needed to do things right." },
    ],
    detailedGrowthAreas: [
      { title: "Collaboration", description: "Your preference for independent work means you may miss valuable input from others. Practice seeking feedback earlier in your process." },
      { title: "Communication", description: "Your ideas make perfect sense to you, but others may need more context. Invest in explaining your vision clearly." },
      { title: "Flexibility", description: "Sometimes 'good enough' is better than 'perfect.' Learn to recognize when additional refinement has diminishing returns." },
    ],
    inRelationships: {
      romantic: "You show love through thoughtful gestures and building a life together. You value intellectual connection and shared goals. Give yourself permission to be more spontaneous sometimes.",
      friendship: "You have a small circle of deep, lasting friendships rather than many acquaintances. You're incredibly loyal and show up consistently for those you care about.",
      professional: "You're the one who designs the systems everyone else uses. You prefer being judged on the quality of your work rather than your social presence.",
    },
    commonMisunderstandings: [
      "Your quietness isn't coldness—it's focused concentration",
      "When you critique ideas, you're trying to make them stronger, not tear them down",
      "Your independence doesn't mean you don't care about the team",
    ],
    selfCareAdvice: [
      "Build in time for pure exploration without a goal in mind",
      "Connect with other Architects who understand your way of thinking",
      "Remember that relationships require investment, not just optimization",
      "Get outside of your head with physical activities or nature",
    ],
    relatedTypes: ["innovator", "analyst", "visionary"],
  },
  // Add more extended content for other types...
};

// Default extended content for types without custom content
const defaultExtendedContent = (archetype: Archetype): Partial<TypePageContent> => ({
  seoTitle: `${archetype.name} Personality Type | PRISM-7 Assessment`,
  seoDescription: `Discover if you're ${archetype.name} - ${archetype.tagline.toLowerCase()}. Only ${archetype.rarity}% of people share this type. Take the free assessment.`,
  longDescription: [
    archetype.description[0],
    archetype.description[1] || archetype.description[0],
    archetype.description[2] || `${archetype.name}s bring unique value to every situation through their distinctive combination of traits.`,
  ],
  detailedStrengths: archetype.strengths.slice(0, 4).map((s, i) => ({
    title: s.split(" ").slice(0, 3).join(" "),
    description: s,
  })),
  detailedGrowthAreas: archetype.growthAreas.slice(0, 3).map((g, i) => ({
    title: g.split(" ").slice(0, 3).join(" "),
    description: g,
  })),
  inRelationships: {
    romantic: archetype.relationshipStyle,
    friendship: `As a friend, you bring ${archetype.strengths[0]?.toLowerCase() || 'unique value'}. You value authentic connections and ${archetype.tagline.toLowerCase()}.`,
    professional: archetype.workStyle,
  },
  commonMisunderstandings: [
    `${archetype.name}s are often misunderstood when their ${archetype.strengths[0]?.toLowerCase() || 'unique traits'} are seen out of context`,
    `Your ${archetype.pattern.high[0] || 'core traits'} may be mistaken for something it's not`,
    `When you're focused on your strengths, others may not see the full picture`,
  ],
  selfCareAdvice: [
    `Embrace your natural ${archetype.strengths[0]?.toLowerCase() || 'strengths'} while working on balance`,
    archetype.atYourBest,
    `Remember: ${archetype.whenStressed} - recognize these patterns early`,
  ],
  relatedTypes: archetypes
    .filter(a => a.id !== archetype.id)
    .slice(0, 3)
    .map(a => a.id),
});

/**
 * Get full content for a type page
 */
export function getTypePageContent(slug: string): TypePageContent | null {
  const archetype = archetypes.find(a => a.id === slug);
  if (!archetype) return null;

  const extended = extendedContent[slug] || defaultExtendedContent(archetype);

  return {
    archetype,
    seoTitle: extended.seoTitle || `${archetype.name} Personality Type`,
    seoDescription: extended.seoDescription || archetype.tagline,
    longDescription: extended.longDescription || archetype.description,
    detailedStrengths: extended.detailedStrengths || [],
    detailedGrowthAreas: extended.detailedGrowthAreas || [],
    inRelationships: extended.inRelationships || {
      romantic: archetype.relationshipStyle,
      friendship: "",
      professional: archetype.workStyle,
    },
    commonMisunderstandings: extended.commonMisunderstandings || [],
    selfCareAdvice: extended.selfCareAdvice || [],
    relatedTypes: extended.relatedTypes || [],
  };
}

/**
 * Get all type slugs for static generation
 */
export function getAllTypeSlugs(): string[] {
  return archetypes.map(a => a.id);
}

