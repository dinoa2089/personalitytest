/**
 * Question Generation Constants
 * Definitions for all personality dimensions and framework types
 * Used by the AI question generator to create psychometrically sound questions
 */

export const PRISM_DIMENSIONS = [
  'openness',
  'conscientiousness',
  'extraversion',
  'agreeableness',
  'emotionalResilience',
  'honestyHumility',
  'adaptability',
] as const;

export type PrismDimension = typeof PRISM_DIMENSIONS[number];

export const DIMENSION_DEFINITIONS: Record<PrismDimension, string> = {
  openness: `Openness to Experience measures curiosity, creativity, and preference for novelty vs. convention.
    High: Enjoys new ideas, abstract thinking, artistic experiences, trying new things, intellectual curiosity
    Low: Prefers routine, practical thinking, concrete facts, familiar approaches, traditional values
    Facets: Imagination, Artistic Interest, Emotionality, Adventurousness, Intellect, Liberalism`,

  conscientiousness: `Conscientiousness measures organization, discipline, and goal-orientation.
    High: Planned, organized, detail-oriented, follows through on commitments, self-disciplined
    Low: Flexible, spontaneous, may struggle with deadlines, adaptable to change, less structured
    Facets: Self-Efficacy, Orderliness, Dutifulness, Achievement-Striving, Self-Discipline, Cautiousness`,

  extraversion: `Extraversion measures social engagement, assertiveness, and positive emotionality.
    High: Energized by social interaction, assertive, talkative, seeks excitement, enthusiastic
    Low: Reserved, reflective, prefers solitary activities, independent, deliberate
    Facets: Friendliness, Gregariousness, Assertiveness, Activity Level, Excitement-Seeking, Cheerfulness`,

  agreeableness: `Agreeableness measures compassion, cooperation, and trust vs. antagonism.
    High: Cooperative, trusting, helpful, forgiving, values getting along with others
    Low: Competitive, skeptical, self-interested, can be confrontational, prioritizes own interests
    Facets: Trust, Morality, Altruism, Cooperation, Modesty, Sympathy`,

  emotionalResilience: `Emotional Resilience measures stress tolerance, emotional stability, and coping capacity.
    High: Calm under pressure, emotionally stable, handles adversity well, maintains composure
    Low: Sensitive to stress, may experience mood fluctuations, deeply affected by setbacks
    Note: This is the positive framing of Neuroticism - high scores indicate stability
    Facets: Anxiety (R), Anger (R), Depression (R), Self-Consciousness (R), Immoderation (R), Vulnerability (R)`,

  honestyHumility: `Honesty-Humility measures sincerity, fairness, and modesty vs. exploitation.
    High: Sincere, fair-minded, modest, genuine, avoids manipulation
    Low: May use flattery or manipulation, entitled, seeks status and special treatment
    Facets: Sincerity, Fairness, Greed Avoidance, Modesty`,

  adaptability: `Adaptability measures flexibility, comfort with change, and cognitive agility.
    High: Embraces change, adjusts quickly to new situations, mentally flexible
    Low: Prefers stability, may resist change, values consistency and predictability
    Facets: Cognitive Flexibility, Behavioral Flexibility, Change Tolerance, Situational Adjustment`,
};

export const DIMENSION_EXAMPLES: Record<PrismDimension, { high: string[]; low: string[] }> = {
  openness: {
    high: [
      'Explores different philosophies and worldviews',
      'Seeks out new artistic and cultural experiences',
      'Enjoys brainstorming unconventional solutions',
      'Regularly learns about topics outside their expertise',
    ],
    low: [
      'Prefers tried-and-true approaches',
      'Values practical, concrete thinking',
      'Maintains consistent routines',
      'Focuses on immediate, tangible outcomes',
    ],
  },
  conscientiousness: {
    high: [
      'Creates detailed project timelines',
      'Maintains organized workspaces',
      'Follows through on all commitments',
      'Sets and achieves long-term goals',
    ],
    low: [
      'Adapts plans spontaneously',
      'Works in flexible, creative environments',
      'Responds to situations as they arise',
      'Values freedom over structure',
    ],
  },
  extraversion: {
    high: [
      'Initiates conversations with strangers',
      'Feels energized after group activities',
      'Takes leadership roles naturally',
      'Enjoys being the center of attention',
    ],
    low: [
      'Prefers small, intimate gatherings',
      'Recharges through solitary activities',
      'Listens more than speaks in groups',
      'Values depth over breadth in relationships',
    ],
  },
  agreeableness: {
    high: [
      'Goes out of way to help others',
      'Avoids conflicts when possible',
      'Assumes good intentions in others',
      'Prioritizes group harmony',
    ],
    low: [
      'Advocates strongly for own position',
      'Questions others\' motives',
      'Comfortable with healthy debate',
      'Prioritizes outcomes over feelings',
    ],
  },
  emotionalResilience: {
    high: [
      'Remains calm during crises',
      'Bounces back quickly from setbacks',
      'Maintains stable mood under stress',
      'Views challenges as manageable',
    ],
    low: [
      'Feels emotions deeply',
      'May dwell on past difficulties',
      'Sensitive to criticism',
      'Experiences strong emotional reactions',
    ],
  },
  honestyHumility: {
    high: [
      'Returns found valuables without hesitation',
      'Shares credit generously',
      'Admits mistakes openly',
      'Treats everyone equally regardless of status',
    ],
    low: [
      'Negotiates aggressively for advantage',
      'Comfortable with self-promotion',
      'Seeks recognition for achievements',
      'Values winning and success',
    ],
  },
  adaptability: {
    high: [
      'Thrives in rapidly changing environments',
      'Quickly learns new systems and tools',
      'Embraces organizational changes',
      'Adjusts communication style to audience',
    ],
    low: [
      'Values consistency and routine',
      'Prefers stable, predictable environments',
      'Masters established processes deeply',
      'Maintains proven approaches',
    ],
  },
};

// MBTI Dimension Definitions
export const MBTI_DIMENSIONS = ['E/I', 'S/N', 'T/F', 'J/P'] as const;
export type MbtiDimension = typeof MBTI_DIMENSIONS[number];

export const MBTI_DEFINITIONS: Record<MbtiDimension, { description: string; highPole: string; lowPole: string }> = {
  'E/I': {
    description: 'Extraversion vs. Introversion - Where you direct and receive energy',
    highPole: 'E (Extraversion): Energized by external world, people, and activities. Thinks out loud, acts then reflects.',
    lowPole: 'I (Introversion): Energized by internal world of ideas and reflection. Thinks before speaking, reflects then acts.',
  },
  'S/N': {
    description: 'Sensing vs. Intuition - How you take in and process information',
    highPole: 'S (Sensing): Focuses on concrete details, facts, and present reality. Practical, sequential, values experience.',
    lowPole: 'N (Intuition): Focuses on patterns, possibilities, and future potential. Conceptual, random-access, values insight.',
  },
  'T/F': {
    description: 'Thinking vs. Feeling - How you make decisions and evaluate information',
    highPole: 'T (Thinking): Decides based on logic, analysis, and objective criteria. Values fairness and competence.',
    lowPole: 'F (Feeling): Decides based on values, empathy, and impact on people. Values harmony and compassion.',
  },
  'J/P': {
    description: 'Judging vs. Perceiving - How you orient to the external world',
    highPole: 'J (Judging): Prefers structure, plans, and closure. Organized, scheduled, seeks to control environment.',
    lowPole: 'P (Perceiving): Prefers flexibility, spontaneity, and options. Adaptable, curious, responds to environment.',
  },
};

// MBTI to PRISM dimension mapping weights
export const MBTI_TO_PRISM_MAPPING: Record<MbtiDimension, Partial<Record<PrismDimension, { pole: string; weight: number }[]>>> = {
  'E/I': {
    extraversion: [{ pole: 'E', weight: 0.9 }],
    agreeableness: [{ pole: 'E', weight: 0.2 }],
  },
  'S/N': {
    openness: [{ pole: 'N', weight: 0.7 }],
    adaptability: [{ pole: 'N', weight: 0.3 }],
  },
  'T/F': {
    agreeableness: [{ pole: 'F', weight: 0.5 }],
    emotionalResilience: [{ pole: 'T', weight: 0.2 }],
  },
  'J/P': {
    conscientiousness: [{ pole: 'J', weight: 0.7 }],
    adaptability: [{ pole: 'P', weight: 0.5 }],
  },
};

// Enneagram Type Definitions
export const ENNEAGRAM_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export type EnneagramType = typeof ENNEAGRAM_TYPES[number];

export const ENNEAGRAM_DEFINITIONS: Record<EnneagramType, string> = {
  1: 'The Perfectionist/Reformer - Principled, purposeful, self-controlled, and perfectionistic. Strives to improve themselves and the world. Strong sense of right and wrong.',
  2: 'The Helper - Generous, demonstrative, people-pleasing, and possessive. Wants to be loved and needed. Focuses on others\' needs, sometimes neglecting own.',
  3: 'The Achiever - Adaptable, excelling, driven, and image-conscious. Motivated by success and recognition. Highly focused on goals and accomplishments.',
  4: 'The Individualist - Expressive, dramatic, self-absorbed, and temperamental. Seeks identity and significance. Values authenticity and emotional depth.',
  5: 'The Investigator - Perceptive, innovative, secretive, and isolated. Seeks knowledge and understanding. Values independence and competence.',
  6: 'The Loyalist - Engaging, responsible, anxious, and suspicious. Seeks security and support. Values loyalty and preparation for worst-case scenarios.',
  7: 'The Enthusiast - Spontaneous, versatile, scattered, and distractible. Seeks variety and excitement. Avoids pain and limitation.',
  8: 'The Challenger - Self-confident, decisive, willful, and confrontational. Seeks control and autonomy. Protects self and others from vulnerability.',
  9: 'The Peacemaker - Receptive, reassuring, complacent, and resigned. Seeks peace and harmony. Avoids conflict and prioritizes connection.',
};

export const ENNEAGRAM_MOTIVATIONS: Record<EnneagramType, string> = {
  1: 'To be good, right, and to improve everything. To live up to their high ideals and avoid error.',
  2: 'To be loved, needed, and appreciated. To express their feelings for others and be helpful.',
  3: 'To be successful, impressive, and admired. To distinguish themselves through achievements.',
  4: 'To be unique, authentic, and true to themselves. To express their individuality and emotions.',
  5: 'To be capable, competent, and knowledgeable. To understand the world and gain expertise.',
  6: 'To have security, support, and certainty. To feel prepared and have reliable guidance.',
  7: 'To be satisfied, happy, and fulfilled. To experience life fully and avoid limitations.',
  8: 'To be self-reliant, strong, and in control. To protect themselves and those they care about.',
  9: 'To have peace, harmony, and stability. To avoid conflict and maintain inner calm.',
};

export const ENNEAGRAM_FEARS: Record<EnneagramType, string> = {
  1: 'Being corrupt, evil, or defective. Making mistakes that cannot be corrected.',
  2: 'Being unwanted, unloved, or unnecessary. Being seen as needy or clingy.',
  3: 'Being worthless, failing, or being seen as a failure. Not being distinguished from others.',
  4: 'Having no identity or personal significance. Being ordinary or fundamentally flawed.',
  5: 'Being helpless, useless, or incapable. Being overwhelmed by the world\'s demands.',
  6: 'Being without support, guidance, or unable to survive. Being blamed and targeted.',
  7: 'Being trapped in pain, deprivation, or boredom. Missing out on worthwhile experiences.',
  8: 'Being harmed, controlled, or violated. Showing weakness or vulnerability.',
  9: 'Loss, fragmentation, or separation. Being in conflict with loved ones.',
};

// Enneagram to PRISM dimension mapping
export const ENNEAGRAM_TO_PRISM_MAPPING: Record<EnneagramType, Partial<Record<PrismDimension, number>>> = {
  1: { conscientiousness: 0.9, honestyHumility: 0.6, openness: -0.2 },
  2: { agreeableness: 0.8, extraversion: 0.5, honestyHumility: 0.3 },
  3: { conscientiousness: 0.6, extraversion: 0.5, adaptability: 0.4, agreeableness: -0.3 },
  4: { openness: 0.7, emotionalResilience: -0.6, agreeableness: 0.2 },
  5: { openness: 0.6, extraversion: -0.7, conscientiousness: 0.3 },
  6: { conscientiousness: 0.5, agreeableness: 0.4, emotionalResilience: -0.4 },
  7: { openness: 0.7, extraversion: 0.6, adaptability: 0.5, conscientiousness: -0.4 },
  8: { extraversion: 0.6, agreeableness: -0.6, emotionalResilience: 0.5 },
  9: { agreeableness: 0.8, emotionalResilience: 0.3, adaptability: 0.4, conscientiousness: -0.3 },
};

// Question type distributions and weights
export const QUESTION_TYPE_DISTRIBUTION = {
  likert: 0.40,
  situational_judgment: 0.25,
  forced_choice: 0.20,
  behavioral_frequency: 0.15,
} as const;

export type QuestionGenerationType = keyof typeof QUESTION_TYPE_DISTRIBUTION;

// Generation targets based on requirements
export const GENERATION_TARGETS = {
  prism: {
    dimensions: 7,
    questionsPerDimension: 25,
    subtotal: 175,
  },
  mbti: {
    dimensions: 4,
    questionsPerDimension: 10,
    subtotal: 40,
  },
  enneagram: {
    types: 9,
    questionsPerType: 5,
    subtotal: 45,
  },
  totalTarget: 260,
};

// Question generation batch sizes
export const BATCH_CONFIG = {
  likertPerBatch: 10,
  situationalPerBatch: 6,
  forcedChoicePerBatch: 5,
  behavioralPerBatch: 4,
  concurrency: 5,
  delayBetweenBatches: 1000, // ms
};



