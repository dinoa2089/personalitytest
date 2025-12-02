/**
 * Dark Triad Analysis - Scoring and interpretation
 * 
 * The Dark Triad consists of:
 * 1. Machiavellianism - Strategic manipulation, cynicism, prioritizing self-interest
 * 2. Narcissism - Grandiosity, pride, egotism, lack of empathy
 * 3. Psychopathy - Impulsivity, thrill-seeking, low empathy, callousness
 * 
 * This is framed as "understanding your shadow side" rather than pathologizing.
 */

export interface DarkTriadScore {
  trait: "machiavellianism" | "narcissism" | "psychopathy";
  score: number; // 0-100
  percentile: number;
  level: "low" | "moderate" | "elevated";
}

export interface DarkTriadProfile {
  scores: DarkTriadScore[];
  overallShadowIndex: number; // Average of all three
  dominantTrait: DarkTriadScore["trait"] | null;
  insights: {
    strengths: string[];
    watchAreas: string[];
    inWorkplace: string;
    inRelationships: string;
  };
}

// Trait definitions with balanced framing
export const traitDefinitions = {
  machiavellianism: {
    name: "Strategic Thinking",
    shadowName: "Machiavellianism",
    icon: "🎭",
    color: "from-indigo-500 to-purple-500",
    description: "The ability to see and navigate complex social and political dynamics",
    highDescription: "You have a keen ability to understand what motivates people and how to navigate complex social situations. You're strategic in your thinking and can see several moves ahead.",
    moderateDescription: "You have a balanced view of human nature—neither overly cynical nor naive. You can be strategic when needed but don't default to manipulation.",
    lowDescription: "You tend to take people at face value and prefer direct, transparent interactions. You may sometimes be surprised by others' hidden motives.",
    strengths: [
      "Strategic planning and foresight",
      "Understanding complex social dynamics",
      "Negotiation and influence skills",
      "Ability to achieve goals through indirect means",
    ],
    watchAreas: [
      "May come across as calculating or cold",
      "Could underestimate the value of authentic connections",
      "Might over-complicate simple situations",
    ],
  },
  narcissism: {
    name: "Self-Confidence",
    shadowName: "Narcissism",
    icon: "👑",
    color: "from-amber-500 to-orange-500",
    description: "Strong sense of self-worth and comfort with attention and leadership",
    highDescription: "You have a robust sense of self-worth and aren't afraid to take the spotlight. You believe in your abilities and have the confidence to pursue ambitious goals.",
    moderateDescription: "You have healthy self-esteem without being arrogant. You can accept both praise and criticism without your sense of self being threatened.",
    lowDescription: "You tend to be humble and may undervalue your own contributions. You're comfortable staying out of the spotlight but might benefit from owning your achievements more.",
    strengths: [
      "Confidence in high-stakes situations",
      "Natural leadership presence",
      "Resilience to criticism",
      "Ability to inspire and motivate others",
    ],
    watchAreas: [
      "May struggle to truly hear feedback",
      "Could dominate conversations or relationships",
      "Might take credit for others' work",
    ],
  },
  psychopathy: {
    name: "Boldness",
    shadowName: "Psychopathy",
    icon: "⚡",
    color: "from-red-500 to-rose-500",
    description: "Ability to act decisively under pressure without being paralyzed by fear or emotion",
    highDescription: "You can make tough decisions quickly without being paralyzed by fear or emotion. You're comfortable with risk and can stay calm in crisis situations.",
    moderateDescription: "You balance emotional consideration with decisive action. You can be bold when needed but also take time to consider impacts on others.",
    lowDescription: "You're highly empathetic and consider emotional implications carefully before acting. This makes you caring but may slow decision-making in crisis.",
    strengths: [
      "Decisive action under pressure",
      "Emotional resilience in crisis",
      "Comfort with calculated risk",
      "Ability to make unpopular decisions",
    ],
    watchAreas: [
      "May appear cold or uncaring",
      "Could undervalue emotional considerations",
      "Might take unnecessary risks",
    ],
  },
};

/**
 * Calculate Dark Triad scores from extended assessment responses
 * 
 * In a real implementation, this would use validated instruments like:
 * - Short Dark Triad (SD3)
 * - Dirty Dozen
 * - MACH-IV for Machiavellianism
 * 
 * For now, we approximate from dimensional scores and additional questions
 */
export function calculateDarkTriadScores(
  dimensionalScores: { dimension: string; percentile: number }[],
  extendedResponses?: Record<string, number>
): DarkTriadProfile {
  const scoreMap = dimensionalScores.reduce(
    (acc, s) => ({ ...acc, [s.dimension]: s.percentile }),
    {} as Record<string, number>
  );

  // Approximate Dark Triad from HEXACO dimensions
  // Machiavellianism: Low Honesty-Humility, Low Agreeableness, High Conscientiousness
  const machiavellianismRaw = (
    (100 - (scoreMap.honestyHumility || 50)) * 0.4 +
    (100 - (scoreMap.agreeableness || 50)) * 0.3 +
    (scoreMap.conscientiousness || 50) * 0.2 +
    (scoreMap.emotionalResilience || 50) * 0.1
  );

  // Narcissism: Low Honesty-Humility, High Extraversion
  const narcissismRaw = (
    (100 - (scoreMap.honestyHumility || 50)) * 0.4 +
    (scoreMap.extraversion || 50) * 0.3 +
    (100 - (scoreMap.agreeableness || 50)) * 0.2 +
    (scoreMap.emotionalResilience || 50) * 0.1
  );

  // Psychopathy: Low Agreeableness, Low Conscientiousness, Low Emotional Resilience, High Adaptability
  const psychopathyRaw = (
    (100 - (scoreMap.agreeableness || 50)) * 0.3 +
    (100 - (scoreMap.emotionalResilience || 50)) * 0.25 +
    (100 - (scoreMap.conscientiousness || 50)) * 0.25 +
    (scoreMap.adaptability || 50) * 0.2
  );

  // Apply extended responses if available (these would be from specific dark triad questions)
  const adjustedMach = extendedResponses?.machiavellianism 
    ? (machiavellianismRaw * 0.6 + extendedResponses.machiavellianism * 0.4)
    : machiavellianismRaw;
  
  const adjustedNarc = extendedResponses?.narcissism
    ? (narcissismRaw * 0.6 + extendedResponses.narcissism * 0.4)
    : narcissismRaw;
  
  const adjustedPsych = extendedResponses?.psychopathy
    ? (psychopathyRaw * 0.6 + extendedResponses.psychopathy * 0.4)
    : psychopathyRaw;

  const getLevel = (score: number): "low" | "moderate" | "elevated" => {
    if (score < 40) return "low";
    if (score < 65) return "moderate";
    return "elevated";
  };

  const scores: DarkTriadScore[] = [
    {
      trait: "machiavellianism",
      score: Math.round(adjustedMach),
      percentile: Math.round(adjustedMach),
      level: getLevel(adjustedMach),
    },
    {
      trait: "narcissism",
      score: Math.round(adjustedNarc),
      percentile: Math.round(adjustedNarc),
      level: getLevel(adjustedNarc),
    },
    {
      trait: "psychopathy",
      score: Math.round(adjustedPsych),
      percentile: Math.round(adjustedPsych),
      level: getLevel(adjustedPsych),
    },
  ];

  const overallShadowIndex = Math.round(
    scores.reduce((sum, s) => sum + s.score, 0) / 3
  );

  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const dominantTrait = sortedScores[0].score > 50 ? sortedScores[0].trait : null;

  return {
    scores,
    overallShadowIndex,
    dominantTrait,
    insights: generateInsights(scores),
  };
}

function generateInsights(scores: DarkTriadScore[]): DarkTriadProfile["insights"] {
  const highTraits = scores.filter(s => s.level === "elevated");
  const lowTraits = scores.filter(s => s.level === "low");
  
  const strengths: string[] = [];
  const watchAreas: string[] = [];
  
  scores.forEach(score => {
    const def = traitDefinitions[score.trait];
    if (score.level === "elevated" || score.level === "moderate") {
      strengths.push(def.strengths[0]);
    }
    if (score.level === "elevated") {
      watchAreas.push(def.watchAreas[0]);
    }
  });

  // Workplace insight
  let inWorkplace = "";
  if (highTraits.length >= 2) {
    inWorkplace = "You're likely seen as a formidable professional—confident, strategic, and decisive. You may excel in competitive environments but should be mindful of how your intensity affects team dynamics.";
  } else if (highTraits.length === 1) {
    const trait = highTraits[0].trait;
    if (trait === "machiavellianism") {
      inWorkplace = "You navigate office politics skillfully and can build strategic alliances. Be careful not to be seen as purely transactional.";
    } else if (trait === "narcissism") {
      inWorkplace = "Your confidence makes you a natural leader who can inspire teams. Make sure to create space for others' ideas and contributions.";
    } else {
      inWorkplace = "You can make tough calls without agonizing, which is valuable in leadership. Balance decisiveness with stakeholder consideration.";
    }
  } else {
    inWorkplace = "You're likely seen as collaborative, humble, and considerate—valuable traits for team-based work. Consider developing more assertiveness for leadership roles.";
  }

  // Relationship insight
  let inRelationships = "";
  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / 3;
  if (avgScore > 60) {
    inRelationships = "Your shadow traits may create intensity in relationships. You might benefit from practicing vulnerability and genuine emotional sharing. Deep connections require letting your guard down.";
  } else if (avgScore > 40) {
    inRelationships = "You have a healthy balance of self-interest and care for others. Your relationships likely benefit from your ability to be both strategic and empathetic when needed.";
  } else {
    inRelationships = "Your natural empathy and humility serve you well in relationships. You might sometimes benefit from being more assertive about your own needs and boundaries.";
  }

  return {
    strengths,
    watchAreas,
    inWorkplace,
    inRelationships,
  };
}

// Extended Dark Triad questions (used in Deep Dive assessment)
export const darkTriadQuestions = [
  // Machiavellianism
  { id: "dt_mach_1", trait: "machiavellianism", text: "It's wise to keep track of information that you can use against people later", reverse: false },
  { id: "dt_mach_2", trait: "machiavellianism", text: "I like to use clever manipulation to get my way", reverse: false },
  { id: "dt_mach_3", trait: "machiavellianism", text: "Whatever it takes, you must get the important people on your side", reverse: false },
  { id: "dt_mach_4", trait: "machiavellianism", text: "Avoid direct conflict with others because they may be useful in the future", reverse: false },
  
  // Narcissism
  { id: "dt_narc_1", trait: "narcissism", text: "I like to get acquainted with important people", reverse: false },
  { id: "dt_narc_2", trait: "narcissism", text: "I feel embarrassed if someone compliments me", reverse: true },
  { id: "dt_narc_3", trait: "narcissism", text: "I have been compared to famous people", reverse: false },
  { id: "dt_narc_4", trait: "narcissism", text: "I am an average person", reverse: true },
  
  // Psychopathy
  { id: "dt_psych_1", trait: "psychopathy", text: "I like to get revenge on authorities", reverse: false },
  { id: "dt_psych_2", trait: "psychopathy", text: "Payback needs to be quick and nasty", reverse: false },
  { id: "dt_psych_3", trait: "psychopathy", text: "I avoid dangerous situations", reverse: true },
  { id: "dt_psych_4", trait: "psychopathy", text: "People often say I'm out of control", reverse: false },
];

