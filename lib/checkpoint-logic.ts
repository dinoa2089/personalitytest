export interface Checkpoint {
  id: number;
  name: string;
  description: string;
  questionsRequired: number;
  frameworks: string[];
  timeEstimate: string;
  unlocks: string[];
}

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: 1,
    name: "PRISM-7 Profile",
    description: "Discover your core personality dimensions",
    questionsRequired: 35,
    frameworks: ["prism"],
    timeEstimate: "~8 minutes",
    unlocks: ["PRISM-7 dimensional scores", "Personality archetype", "Basic insights"],
  },
  {
    id: 2,
    name: "MBTI Discovery",
    description: "Find your Myers-Briggs type",
    questionsRequired: 55, // 35 + 20
    frameworks: ["prism", "mbti"],
    timeEstimate: "+5 minutes",
    unlocks: ["MBTI type (e.g., ENFP)", "Cognitive functions", "Type-specific insights"],
  },
  {
    id: 3,
    name: "Enneagram Insights",
    description: "Uncover your Enneagram type and wing",
    questionsRequired: 80, // 55 + 25
    frameworks: ["prism", "mbti", "enneagram"],
    timeEstimate: "+6 minutes",
    unlocks: ["Enneagram type & wing", "Core motivations", "Growth paths"],
  },
  {
    id: 4,
    name: "Deep Dive",
    description: "Complete comprehensive analysis with Dark Triad",
    questionsRequired: 105,
    frameworks: ["prism", "mbti", "enneagram", "detailed", "dark_triad"],
    timeEstimate: "+6 minutes",
    unlocks: ["Dark Triad profile", "Facet-level analysis", "Compatibility insights", "Career guidance"],
  },
];

export function getCurrentCheckpoint(questionsAnswered: number): Checkpoint {
  for (let i = CHECKPOINTS.length - 1; i >= 0; i--) {
    if (questionsAnswered >= CHECKPOINTS[i].questionsRequired) {
      return CHECKPOINTS[i];
    }
  }
  return CHECKPOINTS[0];
}

export function getNextCheckpoint(questionsAnswered: number): Checkpoint | null {
  for (const checkpoint of CHECKPOINTS) {
    if (questionsAnswered < checkpoint.questionsRequired) {
      return checkpoint;
    }
  }
  return null;
}

export function getUnlockedFrameworks(questionsAnswered: number): string[] {
  const checkpoint = getCurrentCheckpoint(questionsAnswered);
  return checkpoint.frameworks;
}

export function isCheckpointReached(questionsAnswered: number): boolean {
  return CHECKPOINTS.some(cp => cp.questionsRequired === questionsAnswered);
}

export function getCheckpointProgress(questionsAnswered: number): {
  current: Checkpoint | null;
  next: Checkpoint | null;
  progressToNext: number;
} {
  const current = getCurrentCheckpoint(questionsAnswered);
  const next = getNextCheckpoint(questionsAnswered);
  
  if (!next) {
    return { current, next: null, progressToNext: 100 };
  }

  const previousRequired = current.questionsRequired;
  const nextRequired = next.questionsRequired;
  const progressToNext = ((questionsAnswered - previousRequired) / (nextRequired - previousRequired)) * 100;

  return { current, next, progressToNext: Math.max(0, progressToNext) };
}



