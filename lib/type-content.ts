import { archetypes as originalArchetypes, type Archetype } from "./archetypes";

// Helper type for expanded content items that may use 'title' or 'label'
interface ContentItem {
  title?: string;
  label?: string;
  description?: string;
}

// Type for expanded archetype with object-based strengths/growthAreas
interface ExpandedArchetypeData {
  id: string;
  name: string;
  tagline: string;
  description: string[];
  strengths: ContentItem[] | string[];
  growthAreas: ContentItem[] | string[];
  careerMatches: Array<{ title: string; explanation: string }>;
  workStyle: string;
  relationshipStyle: string;
  famousExamples: Array<{ name: string; role: string; image_url?: string }>;
  communicationStyle: string;
  atYourBest: string;
  whenStressed: string;
  pattern: { high: string[]; low: string[] };
  color: string;
  rarity: number;
  icon: string;
}

// Helper to get the title/label from a content item
function getItemTitle(item: ContentItem): string {
  return item.title || item.label || '';
}

// Helper to normalize strengths/growthAreas to strings
function normalizeToStrings(arr: ContentItem[] | string[]): string[] {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  return arr.map(item => {
    if (typeof item === 'string') return item;
    const title = getItemTitle(item);
    return title ? `${title}: ${item.description || ''}`.trim() : (item.description || '');
  });
}

// Helper to normalize to objects with title/description
function normalizeToObjects(arr: ContentItem[] | string[]): Array<{ title: string; description: string }> {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  return arr.map(item => {
    if (typeof item === 'string') {
      const parts = item.split(':');
      if (parts.length > 1) {
        return { title: parts[0].trim(), description: parts.slice(1).join(':').trim() };
      }
      return { title: item.split(' ').slice(0, 3).join(' '), description: item };
    }
    // Handle objects with either 'title' or 'label'
    return {
      title: getItemTitle(item),
      description: item.description || ''
    };
  });
}

// Load expanded archetypes (7500+ words per type)
let expandedArchetypes: ExpandedArchetypeData[] | null = null;
try {
  expandedArchetypes = require("./archetypes-expanded.json");
} catch {
  // Fall back to original if expanded content not available
}

// Normalize expanded archetypes to match Archetype interface
const archetypes: Archetype[] = expandedArchetypes 
  ? expandedArchetypes.map((exp): Archetype => {
      const original = originalArchetypes.find(o => o.id === exp.id);
      return {
        ...exp,
        // Normalize strengths and growthAreas to strings for the base archetype
        strengths: normalizeToStrings(exp.strengths),
        growthAreas: normalizeToStrings(exp.growthAreas),
        // Keep famousExamples from original for images
        famousExamples: original?.famousExamples || exp.famousExamples,
      };
    })
  : originalArchetypes;

// Store the object-based versions for detailed content
const expandedArchetypesMap: Record<string, ExpandedArchetypeData> = {};
if (expandedArchetypes) {
  expandedArchetypes.forEach(exp => {
    expandedArchetypesMap[exp.id] = exp;
  });
}

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
  catalyst: {
    seoTitle: "Am I a Catalyst? | Free Personality Test | PRISM-7",
    seoDescription: "Discover if you're The Catalyst - a dynamic connector who energizes change. Similar to ENFP/ENFJ. Only 5.6% of people share this type. Take the free assessment.",
    longDescription: [
      "Catalysts are the spark plugs of human interaction—individuals whose very presence seems to accelerate change and ignite possibility in others. Your unique combination of high Extraversion, Openness, and Adaptability creates a personality that naturally draws people together around new ideas and shared visions. You don't just participate in change; you create the conditions for it to happen.",
      "If you're a Catalyst, you've probably noticed that conversations seem to come alive when you're involved, that people share ideas with you they haven't told anyone else, and that you have an almost magnetic ability to rally others around a cause. This isn't manipulation—it's genuine enthusiasm combined with social intuition. You see potential in people and situations, and you can't help but try to unlock it.",
      "The Catalyst's gift is also their challenge. Your ability to energize others can leave you depleted if you don't guard your own reserves. You may find yourself overcommitted, having said yes to too many exciting possibilities. The key to thriving as a Catalyst is learning to channel your considerable social and creative energy strategically, rather than spreading it across every opportunity that presents itself."
    ],
    detailedStrengths: [
      { title: "Inspirational Leadership", description: "You have a rare ability to articulate a vision in ways that make others want to be part of it. People don't just follow your ideas—they adopt them as their own and run with them." },
      { title: "Social Intelligence", description: "You read rooms intuitively, sensing group dynamics and individual needs simultaneously. This allows you to connect the right people, say the right things, and create momentum where none existed." },
      { title: "Adaptive Communication", description: "You naturally adjust your communication style to your audience without losing authenticity. Whether speaking to executives or entry-level employees, you make people feel understood." },
      { title: "Change Navigation", description: "While others resist or fear change, you thrive in it. You help organizations and individuals see transitions as opportunities rather than threats." }
    ],
    detailedGrowthAreas: [
      { title: "Sustained Focus", description: "Your enthusiasm for new initiatives can wane as the exciting startup phase gives way to maintenance work. Practice staying engaged through the less glamorous middle phases of projects." },
      { title: "Energy Management", description: "Your social nature can lead to burnout if you don't build in recovery time. Schedule solitude as deliberately as you schedule social activities." },
      { title: "Depth Over Breadth", description: "Your wide network is valuable, but deep relationships require sustained attention. Identify your core relationships and invest in them consistently." }
    ],
    inRelationships: {
      romantic: "You bring passion, adventure, and deep emotional connection to romantic partnerships. You're the partner who plans surprise getaways, has heart-to-heart conversations at 2am, and genuinely celebrates your partner's successes. However, you may struggle with the quieter, more routine aspects of long-term partnership. Finding a partner who appreciates your energy while helping you stay grounded is essential.",
      friendship: "You're the friend everyone wants at the party and the one they call when they need encouragement. Your social calendar is perpetually full, and you have an uncanny ability to maintain connections across different friend groups. You may need to be intentional about deepening friendships beyond the surface level.",
      professional: "In work settings, you're the one who breaks down silos, facilitates collaboration, and gets buy-in for new initiatives. You excel in roles that require influence without authority and thrive in environments that value innovation and people skills equally."
    },
    commonMisunderstandings: [
      "People may see your enthusiasm as naivety, when in fact you've simply chosen optimism as a strategy for creating change",
      "Your social ease can be mistaken for superficiality, but you're capable of profound depth—you just don't lead with it",
      "When you move quickly from one initiative to another, others may think you're uncommitted, when you're actually responding to where you can have the most impact"
    ],
    selfCareAdvice: [
      "Build non-negotiable alone time into your schedule—your extroversion can mask a genuine need for solitude to process and recharge",
      "Practice saying 'let me think about it' instead of immediately saying yes to exciting opportunities",
      "Find physical outlets for your energy—exercise helps metabolize the emotional residue of intense social engagement",
      "Cultivate at least one hobby that doesn't involve other people, to maintain a sense of self separate from your social identity"
    ],
    relatedTypes: ["innovator", "connector", "explorer"],
    faqs: [
      { question: "What careers are best for Catalysts?", answer: "Catalysts thrive in roles like Change Management, Marketing Leadership, Community Building, Sales Leadership, Training & Development, and Nonprofit Direction. The common thread is roles that combine people skills with driving toward meaningful outcomes." },
      { question: "How do Catalysts handle stress?", answer: "Under stress, Catalysts may overcommit to avoid saying no, become scattered across too many initiatives, or lose their characteristic optimism. Recovery involves reconnecting with their core purpose and pruning commitments back to what truly matters." },
      { question: "What's the difference between a Catalyst and a Connector?", answer: "While both are socially oriented, Catalysts are specifically energized by change and new possibilities, while Connectors focus more on maintaining harmonious relationships. Catalysts push boundaries; Connectors build bridges." }
    ]
  },
  strategist: {
    seoTitle: "Am I a Strategist? | Free Personality Test | PRISM-7",
    seoDescription: "Discover if you're The Strategist - a reliable planner who executes with precision. Similar to ISTJ/ESTJ. Only 11.3% of people share this type. Take the free assessment.",
    longDescription: [
      "Strategists are the master planners and reliable executors who keep the world running smoothly. Your combination of high Conscientiousness and Emotional Resilience creates a personality uniquely suited to handling complexity, pressure, and long-term planning. While others may panic when faced with complicated challenges, you see a puzzle to be solved systematically.",
      "If you're a Strategist, you've likely been the person others rely on when things need to get done properly. You don't just make plans—you anticipate obstacles, build in contingencies, and execute with a consistency that others find almost uncanny. Your emotional stability under pressure isn't coldness; it's the result of confidence in your preparation and your ability to adapt within your framework.",
      "The Strategist's superpower is turning chaos into order and vision into reality. However, this same strength can become a limitation when taken too far. Your preference for proven methods may cause you to miss innovative solutions, and your systematic approach can frustrate those who think more spontaneously. The most effective Strategists learn to value their planning abilities while remaining open to inputs that don't fit neatly into their frameworks."
    ],
    detailedStrengths: [
      { title: "Execution Excellence", description: "You don't just plan—you deliver. Your ability to break complex goals into actionable steps and then actually complete them makes you invaluable in any organization or project." },
      { title: "Pressure Tolerance", description: "Where others fold under stress, you often perform better. High-stakes situations activate your preparation rather than overwhelming your emotions." },
      { title: "Risk Anticipation", description: "You naturally think about what could go wrong and build safeguards. This isn't pessimism—it's strategic thinking that prevents problems before they occur." },
      { title: "Consistent Reliability", description: "People know they can count on you. You show up, you follow through, and you maintain quality standards even when no one is watching." }
    ],
    detailedGrowthAreas: [
      { title: "Embracing Uncertainty", description: "Not everything can be planned for, and sometimes the best approach is to start before you have all the answers. Practice acting with 70% certainty instead of waiting for 95%." },
      { title: "Valuing Innovation", description: "Your respect for proven methods can make you dismissive of new approaches. Challenge yourself to regularly test ideas that feel uncomfortable or unproven." },
      { title: "Spontaneous Connection", description: "Your focus on tasks can overshadow relationships. Schedule unstructured time with people you care about, without an agenda or outcome in mind." }
    ],
    inRelationships: {
      romantic: "You show love through actions, not words—handling responsibilities, showing up consistently, and building a stable foundation for shared life. Your partners benefit from your reliability but may sometimes wish for more spontaneity or emotional expressiveness. Learning to articulate feelings that come naturally through your actions can deepen intimacy.",
      friendship: "You're the friend people call when they need practical help—moving apartments, reviewing contracts, or planning events. You may have fewer close friends than some types, but your friendships are built to last. You show care through dependability rather than frequent emotional check-ins.",
      professional: "You're the team member everyone wants on their project because you actually get things done. You excel in operations, project management, and any role requiring systematic execution. You may need to work on being more flexible when plans need to change quickly."
    },
    commonMisunderstandings: [
      "Your preference for planning isn't rigidity—it's how you create the freedom to handle unexpected challenges effectively",
      "When you point out potential problems, you're not being negative—you're trying to prevent issues before they become crises",
      "Your focus on tasks doesn't mean you don't care about people—you often show care by ensuring things work smoothly for everyone"
    ],
    selfCareAdvice: [
      "Schedule unplanned time as deliberately as you schedule everything else—spontaneity doesn't come naturally but it's restorative",
      "Practice activities where success isn't measurable, like art or meditation, to exercise different mental muscles",
      "Build in regular reviews of whether your plans still serve your actual goals, not just whether you're executing them well",
      "Cultivate relationships where you can be cared for, not just the one doing the caring and executing"
    ],
    relatedTypes: ["guardian", "architect", "analyst"],
    faqs: [
      { question: "What careers are best for Strategists?", answer: "Strategists excel in Operations Management, Project Management, Financial Planning, Supply Chain, Military Leadership, and Quality Assurance. Any role requiring systematic execution of complex plans plays to your strengths." },
      { question: "How do Strategists handle change?", answer: "Strategists prefer predictable environments but can handle change well when given time to incorporate it into their planning. Sudden, unexplained changes are most challenging. They cope best when they can understand the rationale and adjust their mental models accordingly." },
      { question: "What's the difference between a Strategist and an Architect?", answer: "Both are systematic thinkers, but Architects are more focused on creative innovation and designing new systems, while Strategists excel at executing established approaches with precision. Architects ask 'what should we build?' while Strategists ask 'how do we build it reliably?'" }
    ]
  },
  connector: {
    seoTitle: "Am I a Connector? | Free Personality Test | PRISM-7",
    seoDescription: "Discover if you're The Connector - a warm collaborator who builds relationships. Similar to ESFJ/ENFJ. Only 12.1% of people share this type. Take the free assessment.",
    longDescription: [
      "Connectors are the social glue that holds communities, teams, and families together. Your combination of high Extraversion and Agreeableness creates a personality genuinely oriented toward others' wellbeing and naturally skilled at building relationships. You don't network strategically—you genuinely care about people, and your relationships reflect that authenticity.",
      "If you're a Connector, you probably remember details about people that they've forgotten they told you. You notice when someone is having a hard day, you remember birthdays without calendar reminders, and you instinctively know who needs to be introduced to whom. This isn't a calculated social strategy—it's simply how you experience the world, through the lens of relationships and human connection.",
      "The Connector's challenge lies in the same orientation that creates their gift. Your deep investment in relationships can make you vulnerable to taking on others' emotional burdens, struggling to set boundaries, or neglecting your own needs while caring for everyone else. The healthiest Connectors learn that caring for themselves isn't selfish—it's necessary for sustainable caring for others."
    ],
    detailedStrengths: [
      { title: "Relationship Building", description: "You form genuine connections quickly and maintain them over time. People feel seen and valued in your presence, which creates loyalty and trust that others can't replicate." },
      { title: "Emotional Attunement", description: "You pick up on emotional undercurrents that others miss entirely. This sensitivity allows you to address brewing conflicts, support struggling team members, and create psychologically safe environments." },
      { title: "Team Harmony", description: "You naturally facilitate cooperation and smooth over friction. Groups you're part of tend to function more cohesively, even if your contribution isn't always visible." },
      { title: "Celebration of Others", description: "You genuinely delight in others' successes without jealousy or competition. This makes you a safe person for people to share good news with, and it strengthens your relationships." }
    ],
    detailedGrowthAreas: [
      { title: "Boundary Setting", description: "Your desire to help can lead to overextension. Practice saying no to requests that deplete you, trusting that people will adjust and your relationships will survive." },
      { title: "Conflict Tolerance", description: "Not all harmony is healthy—sometimes disagreement is necessary for growth. Practice staying engaged through productive conflict rather than smoothing it over prematurely." },
      { title: "Self-Prioritization", description: "You're so attuned to others' needs that you may lose touch with your own. Regularly check in with yourself about what YOU want, separate from what would make others happy." }
    ],
    inRelationships: {
      romantic: "You're a devoted, attentive partner who actively nurtures your relationship. You remember anniversaries, plan thoughtful gestures, and prioritize your partner's happiness. Your challenge is maintaining your own identity within the relationship and voicing your needs even when they conflict with your partner's preferences.",
      friendship: "You're the friend who organizes gatherings, remembers to check in, and shows up with soup when someone is sick. You likely have a large network of friends at varying depths and serve as a hub connecting different social circles. Guard against relationships becoming one-sided, where you're always the giver.",
      professional: "You create positive team culture wherever you go and excel at roles involving stakeholder relationships, team management, and customer interaction. Your ability to build trust quickly is a genuine business asset, though you may need to balance relationship maintenance with task execution."
    },
    commonMisunderstandings: [
      "Your attention to relationships isn't 'soft'—it's a sophisticated social intelligence that creates real business and personal value",
      "When you avoid conflict, you're not being weak—you're weighing the relationship cost against the issue at hand (though sometimes conflict is worth it)",
      "Your desire to please isn't neediness—it comes from genuine care, though learning to tolerate others' momentary displeasure is important growth"
    ],
    selfCareAdvice: [
      "Practice receiving help and care from others—your relationships should be bidirectional, and others want to give to you too",
      "Schedule solo activities that recharge you, even though your instinct may be to spend all free time with others",
      "Learn to sit with the discomfort of someone being temporarily upset with you—it's survivable, and avoiding it at all costs is exhausting",
      "Develop interests and goals that are purely your own, not in service of anyone else's needs or approval"
    ],
    relatedTypes: ["catalyst", "guardian", "harmonizer"],
    faqs: [
      { question: "What careers are best for Connectors?", answer: "Connectors thrive in Human Resources, Customer Success, Event Planning, Community Management, Counseling, and Team Leadership. Any role where building and maintaining relationships is central to success plays to your natural strengths." },
      { question: "How do Connectors handle being alone?", answer: "Connectors can struggle with solitude, sometimes filling every moment with social activity. However, learning to enjoy your own company is essential for avoiding relationship dependency. The healthiest Connectors build a relationship with themselves as strong as those they build with others." },
      { question: "What's the difference between a Connector and a Harmonizer?", answer: "Both are relationship-oriented, but Connectors are more extraverted and active in building social networks, while Harmonizers are more introverted and focus on depth with fewer people. Connectors energize groups; Harmonizers create intimate sanctuaries." }
    ]
  },
  guardian: {
    seoTitle: "Am I a Guardian? | Free Personality Test | PRISM-7",
    seoDescription: "Discover if you're The Guardian - a trustworthy protector who creates stability. Similar to ISFJ/ISTJ. Only 9.4% of people share this type. Take the free assessment.",
    longDescription: [
      "Guardians are the moral backbone and reliable foundation of any community they're part of. Your combination of high Conscientiousness, Agreeableness, and Honesty-Humility creates a personality deeply committed to doing right by others and maintaining the integrity of systems and relationships. You're not flashy, but you're the person everyone trusts completely.",
      "If you're a Guardian, you've probably spent much of your life quietly ensuring things work properly for others without seeking recognition. You remember commitments others have forgotten, you follow through when it would be easier to let things slide, and you treat fairness as non-negotiable. Your ethical compass isn't about rules for their own sake—it's about creating a world you can be proud of.",
      "The Guardian's challenge is learning that self-sacrifice isn't always noble. Your willingness to put others first and your discomfort with conflict can lead to situations where your own needs go chronically unmet. The most effective Guardians learn that caring for themselves isn't selfish—it's what enables sustainable care for others and systems over the long term."
    ],
    detailedStrengths: [
      { title: "Ethical Integrity", description: "You do the right thing even when no one is watching and even when it costs you. This creates deep trust with everyone who knows you and makes you invaluable in roles requiring high integrity." },
      { title: "Protective Instinct", description: "You naturally watch out for those who are vulnerable or overlooked. Whether it's speaking up for a new employee or noticing safety issues, you create security for others." },
      { title: "Dependable Execution", description: "When you commit to something, it gets done. Your reliability isn't glamorous, but it's the foundation that allows teams and families to function." },
      { title: "Fair-Mindedness", description: "You evaluate situations based on principles rather than politics or personal gain. People trust your judgment because they know it's not self-serving." }
    ],
    detailedGrowthAreas: [
      { title: "Advocating for Yourself", description: "You're skilled at advocating for others but may neglect your own needs. Practice asking for what you want with the same conviction you'd use for someone else." },
      { title: "Accepting Imperfection", description: "Your high standards are valuable, but perfectionism can be paralyzing. Practice distinguishing between 'good enough' and 'genuinely inadequate.'" },
      { title: "Embracing Change", description: "Your respect for tradition and proven methods can make change feel threatening. Practice seeing some changes as improvements to, rather than abandonment of, core values." }
    ],
    inRelationships: {
      romantic: "You're a steadfast, loyal partner who shows love through consistent care and reliability. You take commitments seriously and work to maintain your relationship through difficulties. Your challenge is expressing needs and desires directly, rather than hinting or hoping your partner will notice.",
      friendship: "You're the friend who remembers, who shows up, who can be trusted with secrets and difficult situations. You may have fewer close friends than some types, but your friendships are deep and lasting. You're often the one others lean on; make sure someone is there for you too.",
      professional: "You create trust and stability in every team you join. You're the one people know will handle sensitive matters appropriately, follow through on commitments, and maintain quality standards. You may need to advocate more visibly for your own contributions and career needs."
    },
    commonMisunderstandings: [
      "Your humility isn't lack of confidence—you simply don't need external validation to know your worth",
      "When you maintain traditions, you're not resistant to change—you're protecting values that have proven important",
      "Your quietness about your own accomplishments isn't false modesty—you genuinely believe work should speak for itself"
    ],
    selfCareAdvice: [
      "Practice receiving recognition gracefully—others want to appreciate you, and deflecting makes them feel rebuffed",
      "Schedule time for your own goals that isn't tied to responsibility for others",
      "Allow yourself pleasures that serve no useful purpose—rest and enjoyment are not laziness",
      "Seek out relationships where you can be protected and cared for, not just the protector"
    ],
    relatedTypes: ["strategist", "connector", "harmonizer"],
    faqs: [
      { question: "What careers are best for Guardians?", answer: "Guardians excel in Social Work, Healthcare Administration, Compliance, Education Leadership, Nonprofit Management, and Human Resources. Any role requiring high integrity and consistent care for others' wellbeing plays to your strengths." },
      { question: "How do Guardians handle recognition?", answer: "Guardians often feel uncomfortable with public recognition and may deflect praise. However, learning to accept acknowledgment gracefully is important—it validates others' desire to appreciate you and can help you advocate for yourself when needed." },
      { question: "What's the difference between a Guardian and a Strategist?", answer: "Both are conscientious and reliable, but Guardians are more oriented toward people and ethics, while Strategists are more focused on systems and execution. Guardians ask 'is this right?' while Strategists ask 'is this effective?'" }
    ]
  },
  explorer: {
    seoTitle: "Am I an Explorer? | Free Personality Test | PRISM-7",
    seoDescription: "Discover if you're The Explorer - an adventurous seeker who embraces the unknown. Similar to ESTP/ESFP. Only 6.8% of people share this type. Take the free assessment.",
    longDescription: [
      "Explorers are the adventurers who keep life interesting—for themselves and everyone around them. Your combination of high Openness and Extraversion, paired with lower Conscientiousness, creates a personality that genuinely thrives on novelty, spontaneity, and direct experience. You don't read about life; you live it fully.",
      "If you're an Explorer, you've probably felt constrained by conventional paths and predictable routines. You're drawn to new experiences not just for entertainment but because you learn and grow through direct engagement with the unfamiliar. Travel, new people, novel challenges—these aren't escapes from life for you; they're where you feel most alive.",
      "The Explorer's challenge is building something lasting when your natural inclination is toward the next horizon. Your gift for finding opportunities and adapting to new situations can become a liability if it prevents you from developing deep expertise, lasting relationships, or long-term projects. The most fulfilled Explorers learn to balance their need for novelty with selective commitments that provide meaning over time."
    ],
    detailedStrengths: [
      { title: "Opportunity Discovery", description: "You notice possibilities that others miss because they're too focused on their predetermined path. Your willingness to explore leads to unexpected discoveries that benefit everyone." },
      { title: "Rapid Adaptation", description: "You adjust to new situations faster than most, without the anxiety or resistance that slows others down. This makes you valuable in dynamic, unpredictable environments." },
      { title: "Present-Moment Engagement", description: "While others are distracted by worries or plans, you're fully here. This presence makes you more observant, more responsive, and more able to enjoy life as it happens." },
      { title: "Social Courage", description: "You approach new people and situations without the hesitation that limits others. This opens doors and creates connections that more cautious types never access." }
    ],
    detailedGrowthAreas: [
      { title: "Commitment Development", description: "Novelty is exciting, but depth requires sustained attention. Practice staying with relationships, projects, and skills past the initial exciting phase into the growth that comes from long-term investment." },
      { title: "Routine Tolerance", description: "Some important things require repetitive, unglamorous effort. Find ways to make routine sustainable—through games, variety in approach, or connecting mundane tasks to meaningful goals." },
      { title: "Future Planning", description: "Living in the present is a gift, but ignoring the future has costs. Build some planning habits that don't feel constraining—perhaps focused on creating future adventures rather than preventing future problems." }
    ],
    inRelationships: {
      romantic: "You bring excitement, spontaneity, and a sense of possibility to relationships. You're the partner who suggests weekend adventures and keeps things from getting stale. Your challenge is staying engaged through the inevitable routine phases and demonstrating commitment in ways your partner can trust.",
      friendship: "You're the friend who makes ordinary days memorable and who others call when they want an adventure. You likely have a wide network of friends across different contexts, collected through your various explorations. Deepening select friendships into reliable mutual support takes intentional effort.",
      professional: "You thrive in roles with variety, travel, or constantly changing challenges. You're excellent at business development, exploration-oriented research, and any role requiring comfort with uncertainty. Staying engaged with longer-term projects requires conscious effort and possibly structural support."
    },
    commonMisunderstandings: [
      "Your love of novelty isn't fear of commitment—it's genuine preference for how you experience life most fully",
      "When you resist routine, you're not being irresponsible—you're recognizing how your brain works and trying to work with it",
      "Your spontaneity isn't recklessness—you're often calculating risks faster than others realize and accepting ones they wouldn't"
    ],
    selfCareAdvice: [
      "Create variety within structure rather than abandoning structure entirely—multiple small adventures are sustainable, one continuous escape isn't",
      "Find ways to bring novelty to commitments you want to keep, rather than abandoning commitments to find novelty",
      "Build relationships with people who balance your spontaneity—they can help you with follow-through without killing your spirit",
      "Recognize that rest and reflection are explorations too—of your inner landscape—not just absence of external adventure"
    ],
    relatedTypes: ["catalyst", "innovator", "achiever"],
    faqs: [
      { question: "What careers are best for Explorers?", answer: "Explorers thrive in Travel Writing, Adventure Guiding, Sales Development, Entrepreneurship, Event Planning, and Field Research. Any role with built-in variety, new challenges, and opportunities for novel experiences plays to your strengths." },
      { question: "How can Explorers develop more focus?", answer: "Rather than fighting your nature, work with it. Choose commitments carefully and build variety into how you execute them. Use external accountability, environmental design, and short-term milestones to maintain engagement with longer-term goals." },
      { question: "What's the difference between an Explorer and a Catalyst?", answer: "Both are adventurous and social, but Explorers are more focused on personal experience and discovery, while Catalysts are more focused on inspiring change in others. Explorers seek new horizons for themselves; Catalysts want to take everyone along." }
    ]
  },
  stabilizer: {
    seoTitle: "Am I a Stabilizer? | Free Personality Test | PRISM-7",
    seoDescription: "Discover if you're The Stabilizer - a balanced anchor who maintains calm. Similar to ISFP/ISFJ. Only 10.5% of people share this type. Take the free assessment.",
    longDescription: [
      "Stabilizers are the calm at the center of the storm—individuals whose emotional equilibrium and adaptability create a grounding presence for everyone around them. Your combination of high Emotional Resilience and Adaptability, with moderate scores across other dimensions, creates a personality that can flex with circumstances while maintaining inner stability. You're not rigid, and you're not chaotic; you're the rare middle path.",
      "If you're a Stabilizer, you've probably noticed that people seek you out during crises—not because you have all the answers, but because your presence itself is calming. You don't have extreme reactions, you can see multiple perspectives, and you adapt without losing yourself. This equanimity isn't emptiness or lack of passion; it's a centered stability that allows you to respond thoughtfully rather than react impulsively.",
      "The Stabilizer's challenge is standing out in a world that often rewards extremes. Your balanced nature may cause others to overlook you or assume you don't have strong preferences. You might underestimate yourself because you're not as visibly intense as others. Learning to articulate your own needs and contributions clearly is essential for Stabilizers who want their steadying influence to be recognized and valued."
    ],
    detailedStrengths: [
      { title: "Emotional Regulation", description: "You maintain perspective when others are losing theirs. This isn't suppression—it's genuine stability that allows you to feel without being overwhelmed and to respond thoughtfully to challenges." },
      { title: "Adaptive Balance", description: "You adjust to changing circumstances without losing your core stability. While others are either rigid or chaotic, you find the flexible middle ground that actually works." },
      { title: "Perspective Taking", description: "Your balanced nature allows you to genuinely understand multiple viewpoints without needing one to 'win.' This makes you effective at mediation and at helping others feel understood." },
      { title: "Sustainable Presence", description: "Your even energy is maintainable over the long term. While others burn bright and flame out, you show up consistently, providing reliable support without the drama." }
    ],
    detailedGrowthAreas: [
      { title: "Assertive Presence", description: "Your calm nature can read as passive. Practice making your views and needs known clearly, even when you don't feel strongly—others need to hear from you." },
      { title: "Passion Expression", description: "Balance doesn't mean absence of passion. Identify what you genuinely care about deeply and practice expressing that intensity to others who matter." },
      { title: "Self-Advocacy", description: "Your ability to see all sides can cause you to undervalue your own position. Practice treating your needs and preferences as equally valid as others', not as negotiable defaults." }
    ],
    inRelationships: {
      romantic: "You're a calming, adaptive partner who creates stability without rigidity. You're easy to be around and skilled at navigating the inevitable bumps in long-term relationships. Your challenge is ensuring your own needs are met and not disappearing into your partner's preferences. Your voice matters—use it.",
      friendship: "You're the friend people come to for perspective and calm support. You're genuinely low-maintenance and adaptable about plans and activities. Guard against always accommodating others; your preferences deserve equal weight in friendships.",
      professional: "You're valued for your steadiness, especially in crisis situations. You work well across different team dynamics and adapt to various leadership styles. Make sure your reliability doesn't become invisibility—advocate for recognition and advancement."
    },
    commonMisunderstandings: [
      "Your calm isn't lack of caring—you simply process and respond differently than more visibly emotional people",
      "Your adaptability isn't lack of preferences—you're often choosing flexibility as the preference that enables you to maintain what matters most",
      "When you see all sides, you're not being wishy-washy—you're exhibiting cognitive sophistication that others may lack"
    ],
    selfCareAdvice: [
      "Practice identifying and stating your preferences, even when you could genuinely go either way—it builds the muscle for when it matters more",
      "Seek environments that appreciate calm stability rather than those that only reward visible intensity",
      "Build relationships with people who actively draw out your views rather than just accepting your accommodation",
      "Engage in activities that generate positive intensity—you're not just a calm presence but also someone with passions worth exploring"
    ],
    relatedTypes: ["harmonizer", "guardian", "connector"],
    faqs: [
      { question: "What careers are best for Stabilizers?", answer: "Stabilizers excel in Mediation, Crisis Management, Counseling, Operations Coordination, Healthcare Support, and Customer Service Leadership. Any role requiring calm under pressure and ability to work with diverse stakeholders plays to your strengths." },
      { question: "How do Stabilizers develop stronger preferences?", answer: "Your balance is a feature, not a bug, but you can develop clearer preferences by paying attention to small reactions, trying extremes temporarily, and asking yourself 'what would I choose if no one else's preference mattered?' The goal isn't to become extreme but to know yourself more precisely." },
      { question: "What's the difference between a Stabilizer and a Harmonizer?", answer: "Both value peace and balance, but Stabilizers derive stability from within and apply it across situations, while Harmonizers focus specifically on creating harmony in relationships through authenticity. Stabilizers are calm everywhere; Harmonizers are specifically oriented toward interpersonal peace." }
    ]
  },
  visionary: {
    seoTitle: "Am I a Visionary? | Free Personality Test | PRISM-7",
    seoDescription: "Discover if you're The Visionary - a forward-thinking builder who creates the future. Similar to INTJ/ENTJ. Only 3.9% of people share this type. Take the free assessment.",
    longDescription: [
      "Visionaries are the rare architects of the future who combine the ability to see what could be with the discipline to make it real. Your combination of high Openness, Conscientiousness, and Adaptability creates a personality uniquely suited to transforming ambitious visions into tangible outcomes. You don't just dream—you build, and you build things that last.",
      "If you're a Visionary, you probably find yourself frustrated by how slowly the world changes and how often promising ideas die due to poor execution. You see possibilities that others can't imagine and then feel compelled to realize them, not satisfied until the vision exists in the real world. This isn't ego—it's a genuine sense that you can see what needs to exist and have the capability to create it.",
      "The Visionary's challenge is the isolation that can come from seeing further than others. Your long-term perspective may make you impatient with those focused on immediate concerns. Your independence can become disconnection if you don't invest in relationships and communication. The most effective Visionaries learn to bring others along on their journey rather than traveling alone toward futures only they can see."
    ],
    detailedStrengths: [
      { title: "Strategic Foresight", description: "You see trends and possibilities before they become obvious to others. This isn't prophecy—it's pattern recognition combined with the courage to act on incomplete information." },
      { title: "Vision-to-Execution Translation", description: "Many people can imagine futures or execute plans; you do both. Your ability to connect long-term vision with systematic implementation is genuinely rare." },
      { title: "Adaptive Planning", description: "You hold goals tightly but tactics loosely. When obstacles arise, you adjust your approach without losing sight of the destination." },
      { title: "Independent Direction", description: "You don't need external validation to pursue what you believe is right. This independence allows you to work on important things that haven't yet been recognized by others." }
    ],
    detailedGrowthAreas: [
      { title: "Collaborative Leadership", description: "Your visions require others to help implement them. Invest in communication and relationship skills that bring people along rather than expecting them to follow brilliant plans they don't understand." },
      { title: "Present-Moment Value", description: "Your future focus can cause you to undervalue the present moment and the people in it. Practice being fully here, not just working toward there." },
      { title: "Vulnerability Practice", description: "Your competence and independence can create distance. Selectively sharing struggles and uncertainties builds connection and trust." }
    ],
    inRelationships: {
      romantic: "You're a partner who invests in building a future together and who brings capability and reliability to the relationship. You may struggle with the less logical aspects of partnership—emotional needs that don't make efficient 'sense.' Learning to value emotional connection as seriously as you value goals can transform your relationships.",
      friendship: "You likely have a small circle of friends who share your interests or who you've known for a long time. You're loyal and helpful, often in practical ways. Building friendship may require accepting invitations that don't obviously serve your goals—relationships have their own value.",
      professional: "You're the one people turn to for strategic direction and for making ambitious projects happen. You may intimidate colleagues with your intensity and directness. Learning to modulate your communication and recognize others' contributions builds the alliances your visions require."
    },
    commonMisunderstandings: [
      "Your directness isn't rudeness—you value time too much to obscure your meaning with unnecessary social cushioning",
      "Your independent work style isn't arrogance—you're often trying to avoid slowing others down with your different timeline and approach",
      "Your focus on the future isn't dismissal of the present—you believe making today's sacrifices enables tomorrow's flourishing"
    ],
    selfCareAdvice: [
      "Schedule activities with no productive purpose—pleasure and rest are not inefficiencies but necessities for sustained performance",
      "Cultivate relationships where you're valued for who you are, not just what you can accomplish",
      "Practice being satisfied with progress, not just completion—your long-term projects can't sustain you only through achievement",
      "Build in reflection time to ensure your visions still align with your values and not just with momentum"
    ],
    relatedTypes: ["architect", "strategist", "achiever"],
    faqs: [
      { question: "What careers are best for Visionaries?", answer: "Visionaries excel as Entrepreneurs, Strategic Executives, Innovation Leaders, Research Directors, and Management Consultants. Any role requiring both big-picture thinking and the discipline to execute plays to your unique combination of strengths." },
      { question: "How do Visionaries handle others not seeing their vision?", answer: "Frustration is common, but effective Visionaries learn to translate their visions into language and increments others can understand. The goal isn't for everyone to see as far as you but for them to trust the next step. Patience and communication are learnable skills." },
      { question: "What's the difference between a Visionary and an Architect?", answer: "Both combine creativity with systematic thinking, but Visionaries are more oriented toward organizational and strategic futures, while Architects focus on designing specific systems and structures. Visionaries lead transformation; Architects design the components." }
    ]
  },
  harmonizer: {
    seoTitle: "Am I a Harmonizer? | Free Personality Test | PRISM-7",
    seoDescription: "Discover if you're The Harmonizer - a thoughtful peacemaker who values authenticity. Similar to INFP/INFJ. Only 8.7% of people share this type. Take the free assessment.",
    longDescription: [
      "Harmonizers are the thoughtful souls who create peace through authenticity rather than accommodation. Your combination of high Agreeableness and Honesty-Humility, with lower Extraversion, creates a personality that values deep, genuine connection over broad social engagement. You don't just want relationships—you want real ones, and you're willing to accept fewer connections in exchange for greater depth.",
      "If you're a Harmonizer, you probably feel things deeply and have a rich inner world that not everyone gets to see. You're selective about who you let in, but those who enter find a loyal, caring presence who genuinely wants to understand them. Your harmony isn't about avoiding all conflict—it's about creating spaces where truth can be spoken safely and people can be fully themselves.",
      "The Harmonizer's challenge is engaging with a world that often rewards the opposite of what you value. Your preference for depth over breadth, your discomfort with self-promotion, and your need for authenticity can feel like liabilities in environments that value networking, personal branding, and social performance. Learning to navigate these environments without losing yourself is the Harmonizer's essential growth edge."
    ],
    detailedStrengths: [
      { title: "Authentic Connection", description: "You create spaces where people feel safe to be real. This isn't a technique—it's who you are, and it allows for depths of relationship that others can't access." },
      { title: "Principled Integrity", description: "You have a strong inner compass and the courage to follow it even when it's inconvenient. People trust you because they know you won't compromise what matters." },
      { title: "Deep Listening", description: "You hear what people mean, not just what they say. This creates understanding that resolves conflicts and builds lasting bonds." },
      { title: "Thoughtful Approach", description: "You consider carefully before acting, which means your contributions, while less frequent, are often more valuable." }
    ],
    detailedGrowthAreas: [
      { title: "Broader Engagement", description: "Your preference for depth is valid, but some opportunities require breadth. Practice engaging more widely without abandoning your values—you can be authentic in brief encounters too." },
      { title: "Assertive Presence", description: "Your thoughtful nature can read as passivity. Practice sharing your perspective without waiting to be asked, especially in group settings." },
      { title: "Conflict as Tool", description: "Harmony sometimes requires disruption. Practice initiating difficult conversations rather than waiting for conflict to become unavoidable." }
    ],
    inRelationships: {
      romantic: "You're a devoted, deep-feeling partner who creates emotional intimacy few relationships achieve. You take time to commit but once you do, you're there fully. Your challenge is voicing needs directly rather than hoping your partner will intuit them, and accepting that even good relationships include some conflict.",
      friendship: "You maintain a small circle of close friends who know you deeply. You're the friend people come to for genuine connection and thoughtful advice. Guard against isolation—even Harmonizers need community, and new friendships don't have to be superficial.",
      professional: "You create trust and depth in professional relationships. You may struggle with networking and self-promotion, which can limit visibility despite strong contributions. Finding advocates who appreciate your value and communicate it on your behalf can help."
    },
    commonMisunderstandings: [
      "Your quietness isn't lack of ideas—you simply think before speaking and don't talk just to be heard",
      "Your selectiveness with people isn't snobbery—you're investing your limited social energy where it creates real connection",
      "Your conflict avoidance isn't weakness—it's often wisdom about what's worth fighting over, though you may need to expand your tolerance"
    ],
    selfCareAdvice: [
      "Protect your solo time fiercely—it's where you process and restore, not escape from life",
      "Find creative outlets for your rich inner life—art, writing, or other expressive practices that don't require social performance",
      "Build at least one relationship where you can be fully known, not just the calm, listening presence for others",
      "Practice small assertions regularly so larger ones feel less daunting—your voice matters and needs exercise"
    ],
    relatedTypes: ["stabilizer", "guardian", "connector"],
    faqs: [
      { question: "What careers are best for Harmonizers?", answer: "Harmonizers excel in Counseling, Writing, Academic Research, Social Work, Human Resources, and Design. Any role allowing depth, authenticity, and behind-the-scenes impact plays to your strengths while respecting your nature." },
      { question: "How can Harmonizers handle networking and self-promotion?", answer: "Rather than forcing yourself to network traditionally, focus on one-on-one connections, written communication, and finding advocates who can speak about your work. Authentic self-promotion is possible—share what you genuinely care about rather than performing." },
      { question: "What's the difference between a Harmonizer and a Connector?", answer: "Both are relationship-oriented, but Harmonizers are introverted and focus on depth with few, while Connectors are extraverted and maintain broad networks. Harmonizers seek intimacy; Connectors seek community." }
    ]
  },
  achiever: {
    seoTitle: "Am I an Achiever? | Free Personality Test | PRISM-7",
    seoDescription: "Discover if you're The Achiever - a driven executor who delivers results. Similar to ENTJ/ESTJ. Only 8.2% of people share this type. Take the free assessment.",
    longDescription: [
      "Achievers are the engines of accomplishment who turn ambition into results. Your combination of high Conscientiousness, Extraversion, and Adaptability creates a personality that sets ambitious goals, rallies others around them, and then actually delivers. You're not content with plans and potential—you need to see things happen.",
      "If you're an Achiever, you probably find yourself restless when you're not working toward something meaningful. You're energized by competition, by progress, and by the satisfaction of checking off completed goals. This isn't just ambition—it's a fundamental orientation toward action and results that makes you a powerful force in any context.",
      "The Achiever's challenge is finding meaning beyond accomplishment. Your drive is genuine, but if left unexamined, it can lead to burnout, shallow relationships, and the discovery that achievement alone doesn't satisfy. The most fulfilled Achievers learn to include relationship depth, personal growth, and purposeful rest alongside their accomplishments—not as luxuries but as essential components of a life well-lived."
    ],
    detailedStrengths: [
      { title: "Goal Attainment", description: "You don't just set goals—you reach them. Your combination of vision, discipline, and drive means that when you commit to something, it happens." },
      { title: "Mobilizing Energy", description: "You bring energy and momentum to everything you're part of. Groups you lead move faster, teams you join accomplish more, and projects you own get finished." },
      { title: "Competitive Drive", description: "You're motivated by challenge and competition in ways that bring out your best performance. You don't just meet standards—you exceed them." },
      { title: "Adaptive Execution", description: "You adjust your approach based on what works, not just what's planned. This pragmatic flexibility allows you to navigate around obstacles that stop others." }
    ],
    detailedGrowthAreas: [
      { title: "Process Appreciation", description: "Your focus on outcomes can cause you to rush through experiences and miss the value in the journey. Practice being present during the work, not just celebrating completion." },
      { title: "Relationship Investment", description: "People aren't just means to goals. Invest in relationships for their own sake, and don't let your drive make others feel like tools." },
      { title: "Rest as Strategy", description: "Your drive can push you past sustainable effort. Learn to see rest as investment in performance, not as weakness or wasted time." }
    ],
    inRelationships: {
      romantic: "You bring energy, ambition, and capability to relationships. You're a partner who makes things happen and who actively works to achieve shared goals. Your challenge is making space for connection that isn't about accomplishment—for presence, play, and emotional intimacy on their own terms.",
      friendship: "You're the friend who gets things done and who inspires others to achieve more. You may struggle to prioritize friendships that don't overlap with your goals. Remember that relationships are valuable in themselves, not just as networking or support for achievement.",
      professional: "You're a high performer who delivers results and often advances quickly. You're effective at leading teams toward achievement. Watch for tendencies to overwork, to undervalue others' contributions, or to define yourself solely by your professional success."
    },
    commonMisunderstandings: [
      "Your drive isn't workaholism—it's genuine motivation that happens to point toward achievement, though you may need to expand what you achieve toward",
      "Your competitive nature isn't aggression—you're trying to bring out your best, and competition is simply how you find your edge",
      "Your focus on results isn't coldness—you often believe accomplishment is how you help others and contribute value"
    ],
    selfCareAdvice: [
      "Schedule non-productive time as seriously as you schedule work—your identity shouldn't be solely about what you accomplish",
      "Cultivate relationships where you're valued for who you are, not what you achieve",
      "Practice activities you're not good at—the experience of learning without achievement is valuable and humbling",
      "Regularly examine whether you're pursuing goals that actually matter to you or just goals you can win at"
    ],
    relatedTypes: ["catalyst", "visionary", "strategist"],
    faqs: [
      { question: "What careers are best for Achievers?", answer: "Achievers thrive as Executives, Sales Leaders, Entrepreneurs, Athletes, Management Consultants, and Business Developers. Any role with clear goals, competition, and rewards for performance plays to your driving strengths." },
      { question: "How do Achievers avoid burnout?", answer: "Burnout comes from achievement without meaning, rest without guilt, or relationships reduced to utility. Prevent it by regularly examining whether your goals serve your values, scheduling recovery as seriously as work, and investing in relationships that don't help your career but help your life." },
      { question: "What's the difference between an Achiever and a Strategist?", answer: "Both are disciplined and goal-oriented, but Achievers are more externally focused and energized by competition and social achievement, while Strategists are more internally focused on execution excellence regardless of recognition. Achievers need to win; Strategists need to execute well." }
    ]
  },
  analyst: {
    seoTitle: "Am I an Analyst? | Free Personality Test | PRISM-7",
    seoDescription: "Discover if you're The Analyst - an independent thinker who seeks truth. Similar to INTP/INTJ. Only 11.5% of people share this type. Take the free assessment.",
    longDescription: [
      "Analysts are the truth-seekers who cut through noise to find signal, through assumption to find fact. Your combination of high Openness and Conscientiousness, with lower Extraversion and Agreeableness, creates a personality driven by understanding—not just collecting information, but comprehending how things actually work beneath the surface.",
      "If you're an Analyst, you've probably frustrated people by asking 'why' repeatedly, by questioning accepted wisdom, and by taking apart ideas that everyone else has accepted. This isn't contrarianism—it's a genuine inability to accept explanations that don't actually explain. You think independently not to be different, but because you need to understand for yourself.",
      "The Analyst's challenge is connecting their insights to the human world around them. Your focus on truth and logic can come across as cold or critical; your preference for independent work can become isolation; your high standards can make collaboration frustrating. The most effective Analysts learn to communicate their insights in ways others can hear and to value the human elements that logic alone can't address."
    ],
    detailedStrengths: [
      { title: "Critical Thinking", description: "You evaluate ideas on their merits, not their sources or popularity. This intellectual honesty leads you to insights that consensus-following thinkers can't reach." },
      { title: "Deep Analysis", description: "You have the patience and focus to truly understand complex topics. Where others skim, you dig until you reach something solid." },
      { title: "Objectivity", description: "You can evaluate situations without being swayed by emotional appeals, social pressure, or personal interest. This isn't coldness—it's disciplined thinking." },
      { title: "Pattern Recognition", description: "You see underlying structures and connections that escape surface-level observation. This allows you to predict outcomes and identify root causes." }
    ],
    detailedGrowthAreas: [
      { title: "Emotional Integration", description: "Logic isn't the only valid way of knowing. Practice respecting emotional signals—from yourself and others—as data worth considering." },
      { title: "Communication Accessibility", description: "Your insights only create value when others can understand and act on them. Practice translating complex analysis into clear, actionable language." },
      { title: "Collaborative Practice", description: "Other people aren't just sources of error. Their different perspectives often catch what your analysis misses, and their buy-in is necessary to implement your conclusions." }
    ],
    inRelationships: {
      romantic: "You're a loyal partner who shows love through understanding and problem-solving. You bring depth and intellectual connection to relationships. Your challenge is making space for emotional needs—both yours and your partner's—that don't submit to logical analysis.",
      friendship: "You maintain a few close friendships with people who can match your intellectual curiosity. You're the friend people come to for honest, thoughtful perspective. Building friendships may require accepting social invitations that don't obviously interest you—relationships grow through presence.",
      professional: "You're valued for your analytical capabilities and your willingness to identify unpopular truths. You may struggle with organizational politics and with communication that requires simplification. Finding environments that value intellectual honesty and working with translators who can communicate your insights can help."
    },
    commonMisunderstandings: [
      "Your questioning isn't criticism—it's how you try to understand and improve ideas, including ones you like",
      "Your preference for logic isn't dismissal of emotion—you often simply don't know how to respond to emotional content effectively",
      "Your independent work style isn't arrogance—you're often trying to think clearly without the distraction of social dynamics"
    ],
    selfCareAdvice: [
      "Balance intellectual work with physical activity—your body needs attention too, and exercise can actually improve your thinking",
      "Practice social skills as the learnable capabilities they are—emotional intelligence isn't innate, and you can analyze and improve your interpersonal effectiveness",
      "Build relationships with people who can help translate your insights into forms others can use—you don't have to do everything yourself",
      "Allow yourself intellectual play—exploration that doesn't have to lead anywhere productive is valuable for creativity and satisfaction"
    ],
    relatedTypes: ["architect", "innovator", "strategist"],
    faqs: [
      { question: "What careers are best for Analysts?", answer: "Analysts thrive in Data Science, Research, Financial Analysis, Software Engineering, Academic Work, and Consulting. Any role requiring deep analysis, independent thought, and respect for truth over politics plays to your strengths." },
      { question: "How do Analysts work effectively with others?", answer: "Rather than seeing collaboration as distraction from real work, recognize that others bring perspectives your analysis might miss and that implementation requires buy-in. Practice translating your insights into language others can use, and find colleagues who complement your style." },
      { question: "What's the difference between an Analyst and an Architect?", answer: "Both are systematic thinkers who value understanding, but Architects are more oriented toward building and creating, while Analysts focus more on understanding and evaluating. Architects ask 'how should we build this?' while Analysts ask 'what's actually true here?'" }
    ]
  }
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
  detailedStrengths: archetype.strengths.slice(0, 4).map((s): { title: string; description: string } => {
    const title: string = typeof s === 'string' ? s : s.title;
    const desc: string = typeof s === 'string' ? s : s.description;
    return {
      title: title.split(" ").slice(0, 3).join(" "),
      description: desc,
    };
  }),
  detailedGrowthAreas: archetype.growthAreas.slice(0, 3).map((g): { title: string; description: string } => {
    const title: string = typeof g === 'string' ? g : g.title;
    const desc: string = typeof g === 'string' ? g : g.description;
    return {
      title: title.split(" ").slice(0, 3).join(" "),
      description: desc,
    };
  }),
  inRelationships: {
    romantic: archetype.relationshipStyle,
    friendship: `As a friend, you bring ${(typeof archetype.strengths[0] === 'string' ? archetype.strengths[0] : archetype.strengths[0]?.title)?.toLowerCase() || 'unique value'}. You value authentic connections and ${archetype.tagline.toLowerCase()}.`,
    professional: archetype.workStyle,
  },
  commonMisunderstandings: [
    `${archetype.name}s are often misunderstood when their ${(typeof archetype.strengths[0] === 'string' ? archetype.strengths[0] : archetype.strengths[0]?.title)?.toLowerCase() || 'unique traits'} are seen out of context`,
    `Your ${archetype.pattern.high[0] || 'core traits'} may be mistaken for something it's not`,
    `When you're focused on your strengths, others may not see the full picture`,
  ],
  selfCareAdvice: [
    `Embrace your natural ${(typeof archetype.strengths[0] === 'string' ? archetype.strengths[0] : archetype.strengths[0]?.title)?.toLowerCase() || 'strengths'} while working on balance`,
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

  // Check for expanded content with object-based strengths/growthAreas
  const expandedData = expandedArchetypesMap[slug];
  
  const extended = extendedContent[slug] || defaultExtendedContent(archetype);
  const correlations = frameworkCorrelations[slug] || {
    mbtiTypes: [],
    enneagramTypes: [],
    description: `Explore how ${archetype.name} maps to other personality frameworks.`
  };

  // Use extended content for detailed strengths/growth areas (disable expanded for now)
  const detailedStrengths = extended.detailedStrengths || [];
  const detailedGrowthAreas = extended.detailedGrowthAreas || [];

  // Generate default FAQs if not provided
  const firstStrengthTitle = (typeof archetype.strengths[0] === 'string' ? archetype.strengths[0] : archetype.strengths[0]?.title)?.toLowerCase() || 'unique strengths';
  const defaultFaqs = [
    { 
      question: `What careers are best for ${archetype.name}s?`, 
      answer: `${archetype.name}s often excel in ${archetype.careerMatches.slice(0, 3).map(c => c.title).join(", ")}—roles that leverage their ${firstStrengthTitle}.` 
    },
    { 
      question: `How do ${archetype.name}s handle relationships?`, 
      answer: archetype.relationshipStyle 
    },
    { 
      question: `What are the key strengths of ${archetype.name}s?`, 
      answer: archetype.strengths.slice(0, 4).map(s => typeof s === 'string' ? s : s.title).join(". ") + "." 
    },
  ];

  return {
    archetype,
    seoTitle: extended.seoTitle || `Am I ${archetype.name.replace("The ", "a")}? | Free Personality Test`,
    seoDescription: extended.seoDescription || archetype.tagline,
    longDescription: expandedData?.description || extended.longDescription || archetype.description,
    detailedStrengths,
    detailedGrowthAreas,
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

