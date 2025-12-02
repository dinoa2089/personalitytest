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
  frameworkCorrelations: {
    mbtiTypes: string[];
    enneagramTypes: string[];
    description: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

// Framework correlation data for all archetypes
const frameworkCorrelations: Record<string, { mbtiTypes: string[]; enneagramTypes: string[]; description: string }> = {
  innovator: {
    mbtiTypes: ["ENTP", "ENFP", "INTP"],
    enneagramTypes: ["7", "4"],
    description: "If you've tested as ENTP or ENFP on Myers-Briggs, or Type 7 on the Enneagram, you may find strong alignment with the Innovator archetype."
  },
  architect: {
    mbtiTypes: ["INTJ", "INTP", "ENTJ"],
    enneagramTypes: ["5", "1"],
    description: "If you've tested as INTJ or INTP on Myers-Briggs, or Type 5 on the Enneagram, you may find strong alignment with the Architect archetype."
  },
  catalyst: {
    mbtiTypes: ["ENFP", "ENTP", "ENFJ"],
    enneagramTypes: ["7", "3"],
    description: "If you've tested as ENFP or ENFJ on Myers-Briggs, or Type 7 or 3 on the Enneagram, you may find strong alignment with the Catalyst archetype."
  },
  strategist: {
    mbtiTypes: ["ISTJ", "ESTJ", "INTJ"],
    enneagramTypes: ["1", "6"],
    description: "If you've tested as ISTJ or ESTJ on Myers-Briggs, or Type 1 or 6 on the Enneagram, you may find strong alignment with the Strategist archetype."
  },
  connector: {
    mbtiTypes: ["ESFJ", "ENFJ", "ESFP"],
    enneagramTypes: ["2", "7"],
    description: "If you've tested as ESFJ or ENFJ on Myers-Briggs, or Type 2 on the Enneagram, you may find strong alignment with the Connector archetype."
  },
  guardian: {
    mbtiTypes: ["ISFJ", "ESFJ", "ISTJ"],
    enneagramTypes: ["1", "2", "6"],
    description: "If you've tested as ISFJ or ISTJ on Myers-Briggs, or Type 1, 2, or 6 on the Enneagram, you may find strong alignment with the Guardian archetype."
  },
  explorer: {
    mbtiTypes: ["ESTP", "ESFP", "ENTP"],
    enneagramTypes: ["7", "8"],
    description: "If you've tested as ESTP or ESFP on Myers-Briggs, or Type 7 on the Enneagram, you may find strong alignment with the Explorer archetype."
  },
  stabilizer: {
    mbtiTypes: ["ISFP", "INFP", "ISFJ"],
    enneagramTypes: ["9", "6"],
    description: "If you've tested as ISFP or ISFJ on Myers-Briggs, or Type 9 on the Enneagram, you may find strong alignment with the Stabilizer archetype."
  },
  visionary: {
    mbtiTypes: ["INTJ", "ENTJ", "INFJ"],
    enneagramTypes: ["1", "5", "3"],
    description: "If you've tested as INTJ or ENTJ on Myers-Briggs, or Type 1 or 3 on the Enneagram, you may find strong alignment with the Visionary archetype."
  },
  harmonizer: {
    mbtiTypes: ["INFP", "INFJ", "ISFP"],
    enneagramTypes: ["4", "9", "2"],
    description: "If you've tested as INFP or INFJ on Myers-Briggs, or Type 4 or 9 on the Enneagram, you may find strong alignment with the Harmonizer archetype."
  },
  achiever: {
    mbtiTypes: ["ENTJ", "ESTJ", "ESTP"],
    enneagramTypes: ["3", "8"],
    description: "If you've tested as ENTJ or ESTJ on Myers-Briggs, or Type 3 or 8 on the Enneagram, you may find strong alignment with the Achiever archetype."
  },
  analyst: {
    mbtiTypes: ["INTP", "INTJ", "ISTP"],
    enneagramTypes: ["5", "1"],
    description: "If you've tested as INTP or INTJ on Myers-Briggs, or Type 5 on the Enneagram, you may find strong alignment with the Analyst archetype."
  },
};

// Extended content for each archetype
const extendedContent: Record<string, Partial<TypePageContent>> = {
  innovator: {
    seoTitle: "Am I an Innovator? | Free Personality Test | PRISM-7",
    seoDescription: "Discover if you're The Innovator - a creative visionary who thrives on possibility. Similar to ENTP/ENFP. Only 7.2% of people share this type. Take the free assessment.",
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
    faqs: [
      { question: "What careers are best for Innovators?", answer: "Innovators excel in Product Design, Research, Entrepreneurship, Creative Direction, and Innovation Consulting—roles that value creativity and adaptability over routine." },
      { question: "How do Innovators handle stress?", answer: "Under stress, Innovators may become scattered, jumping between too many ideas without completing any. They benefit from structure and partnering with detail-oriented colleagues." },
      { question: "What's the difference between an Innovator and an Architect?", answer: "While both are creative, Architects combine creativity with systematic execution. Innovators focus more on generating ideas, while Architects focus on building them." },
    ],
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
  const correlations = frameworkCorrelations[slug] || {
    mbtiTypes: [],
    enneagramTypes: [],
    description: `Explore how ${archetype.name} maps to other personality frameworks.`
  };

  // Generate default FAQs if not provided
  const defaultFaqs = [
    { 
      question: `What careers are best for ${archetype.name}s?`, 
      answer: `${archetype.name}s often excel in ${archetype.careerMatches.slice(0, 3).map(c => c.title).join(", ")}—roles that leverage their ${archetype.strengths[0]?.toLowerCase() || 'unique strengths'}.` 
    },
    { 
      question: `How do ${archetype.name}s handle relationships?`, 
      answer: archetype.relationshipStyle 
    },
    { 
      question: `What are the key strengths of ${archetype.name}s?`, 
      answer: archetype.strengths.slice(0, 4).join(". ") + "." 
    },
  ];

  return {
    archetype,
    seoTitle: extended.seoTitle || `Am I ${archetype.name.replace("The ", "a")}? | Free Personality Test`,
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
    frameworkCorrelations: correlations,
    faqs: extended.faqs || defaultFaqs,
  };
}

/**
 * Get all type slugs for static generation
 */
export function getAllTypeSlugs(): string[] {
  return archetypes.map(a => a.id);
}

