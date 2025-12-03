/**
 * Mock question data for development/testing when Supabase is not available
 * Based on the complete question bank
 */
import type { Question, ForcedChoiceOption } from "@/types";

export const mockQuestions: Question[] = [
  // Openness to Experience (5 questions)
  {
    id: "mock-openness-1",
    text: "I enjoy exploring new ideas and concepts.",
    type: "likert",
    dimension: "openness",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-openness-2",
    text: "I prefer familiar routines over new experiences.",
    type: "likert",
    dimension: "openness",
    reverse_scored: true,
    weight: 1.0,
  },
  {
    id: "mock-openness-3",
    text: "Which is MOST like you and which is LEAST like you?",
    type: "forced_choice",
    dimension: "openness",
    options: [
      { text: "I enjoy philosophical discussions and exploring abstract ideas", dimension: "openness" },
      { text: "I prefer practical, proven approaches to solving problems", dimension: "conscientiousness" },
      { text: "I like to engage others in collaborative brainstorming", dimension: "extraversion" },
    ] as ForcedChoiceOption[],
    weight: 1.2,
  },
  {
    id: "mock-openness-4",
    text: "When faced with a new technology at work, you typically:",
    type: "situational_judgment",
    dimension: "openness",
    options: [
      "Eagerly explore all its features right away",
      "Learn only the essential functions needed for your tasks",
      "Wait until others have tested it before trying it yourself",
    ],
    weight: 1.3,
  },
  {
    id: "mock-openness-5",
    text: "In the past month, how often have you sought out information on a topic unrelated to your work or studies?",
    type: "behavioral_frequency",
    dimension: "openness",
    weight: 1.5,
  },

  // Conscientiousness (5 questions)
  {
    id: "mock-conscientiousness-1",
    text: "I create detailed plans before starting projects.",
    type: "likert",
    dimension: "conscientiousness",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-conscientiousness-2",
    text: "I often leave tasks unfinished when I lose interest.",
    type: "likert",
    dimension: "conscientiousness",
    reverse_scored: true,
    weight: 1.0,
  },
  {
    id: "mock-conscientiousness-3",
    text: "Which is MOST like you and which is LEAST like you?",
    type: "forced_choice",
    dimension: "conscientiousness",
    options: [
      { text: "I keep my environment organized and clutter-free", dimension: "conscientiousness" },
      { text: "I help others stay on track with their commitments", dimension: "agreeableness" },
      { text: "I seek innovative methods to improve efficiency", dimension: "adaptability" },
    ] as ForcedChoiceOption[],
    weight: 1.2,
  },
  {
    id: "mock-conscientiousness-4",
    text: "When working on a team project with a deadline next week, you would most likely:",
    type: "situational_judgment",
    dimension: "conscientiousness",
    options: [
      "Create a detailed plan with milestones for the entire team",
      "Focus on completing your part perfectly, regardless of what others do",
      "Adapt your approach based on how the project evolves",
    ],
    weight: 1.3,
  },
  {
    id: "mock-conscientiousness-5",
    text: "How often do you make lists to organize your tasks?",
    type: "behavioral_frequency",
    dimension: "conscientiousness",
    weight: 1.5,
  },

  // Extraversion (5 questions)
  {
    id: "mock-extraversion-1",
    text: "I feel energized after spending time with a large group of people.",
    type: "likert",
    dimension: "extraversion",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-extraversion-2",
    text: "I prefer working independently rather than collaborating with others.",
    type: "likert",
    dimension: "extraversion",
    reverse_scored: true,
    weight: 1.0,
  },
  {
    id: "mock-extraversion-3",
    text: "Which is MOST like you and which is LEAST like you?",
    type: "forced_choice",
    dimension: "extraversion",
    options: [
      { text: "I enjoy being the center of attention at gatherings", dimension: "extraversion" },
      { text: "I prefer meaningful connections over many acquaintances", dimension: "agreeableness" },
      { text: "I like exploring new ideas and perspectives on my own", dimension: "openness" },
    ] as ForcedChoiceOption[],
    weight: 1.2,
  },
  {
    id: "mock-extraversion-4",
    text: "At a networking event where you know few people, you would most likely:",
    type: "situational_judgment",
    dimension: "extraversion",
    options: [
      "Introduce yourself to as many new people as possible",
      "Find one or two interesting people for in-depth conversations",
      "Observe the dynamics before deciding whom to approach",
    ],
    weight: 1.3,
  },
  {
    id: "mock-extraversion-5",
    text: "In the past week, how many times have you initiated a conversation with someone you don't know well?",
    type: "behavioral_frequency",
    dimension: "extraversion",
    weight: 1.5,
  },

  // Agreeableness (5 questions)
  {
    id: "mock-agreeableness-1",
    text: "I prioritize others' needs above my own.",
    type: "likert",
    dimension: "agreeableness",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-agreeableness-2",
    text: "I'm quick to point out when I think someone is wrong.",
    type: "likert",
    dimension: "agreeableness",
    reverse_scored: true,
    weight: 1.0,
  },
  {
    id: "mock-agreeableness-3",
    text: "Which is MOST like you and which is LEAST like you?",
    type: "forced_choice",
    dimension: "agreeableness",
    options: [
      { text: "I avoid conflict to maintain harmony in relationships", dimension: "agreeableness" },
      { text: "I stand firm on my principles even under pressure", dimension: "honestyHumility" },
      { text: "I adapt my approach based on the situation at hand", dimension: "adaptability" },
    ] as ForcedChoiceOption[],
    weight: 1.2,
  },
  {
    id: "mock-agreeableness-4",
    text: "When a colleague takes credit for your idea in a meeting, you would most likely:",
    type: "situational_judgment",
    dimension: "agreeableness",
    options: [
      "Confront them privately after the meeting",
      "Politely clarify your contribution during the meeting",
      "Let it go to maintain workplace harmony",
    ],
    weight: 1.3,
  },
  {
    id: "mock-agreeableness-5",
    text: "How often do you volunteer to help others with their tasks when you notice they're struggling?",
    type: "behavioral_frequency",
    dimension: "agreeableness",
    weight: 1.5,
  },

  // Emotional Resilience (5 questions)
  {
    id: "mock-emotionalResilience-1",
    text: "I remain calm under pressure.",
    type: "likert",
    dimension: "emotionalResilience",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-emotionalResilience-2",
    text: "Small setbacks can significantly impact my mood.",
    type: "likert",
    dimension: "emotionalResilience",
    reverse_scored: true,
    weight: 1.0,
  },
  {
    id: "mock-emotionalResilience-3",
    text: "Which is MOST like you and which is LEAST like you?",
    type: "forced_choice",
    dimension: "emotionalResilience",
    options: [
      { text: "I anticipate problems and plan ahead to prevent them", dimension: "conscientiousness" },
      { text: "I recover quickly from disappointments and setbacks", dimension: "emotionalResilience" },
      { text: "I see challenges as opportunities to grow and learn", dimension: "adaptability" },
    ] as ForcedChoiceOption[],
    weight: 1.2,
  },
  {
    id: "mock-emotionalResilience-4",
    text: "When you receive unexpected critical feedback on an important project, you would most likely:",
    type: "situational_judgment",
    dimension: "emotionalResilience",
    options: [
      "Feel upset for days and question your abilities",
      "Analyze the feedback objectively and create an improvement plan",
      "Seek validation from others that the criticism was unfair",
    ],
    weight: 1.3,
  },
  {
    id: "mock-emotionalResilience-5",
    text: "In the past month, how often have you felt overwhelmed by stress?",
    type: "behavioral_frequency",
    dimension: "emotionalResilience",
    reverse_scored: true,
    weight: 1.5,
  },

  // Honesty-Humility (5 questions)
  {
    id: "mock-honestyHumility-1",
    text: "I would never accept credit for someone else's work.",
    type: "likert",
    dimension: "honestyHumility",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-honestyHumility-2",
    text: "It's sometimes necessary to bend the rules to get ahead.",
    type: "likert",
    dimension: "honestyHumility",
    reverse_scored: true,
    weight: 1.0,
  },
  {
    id: "mock-honestyHumility-3",
    text: "Which is MOST like you and which is LEAST like you?",
    type: "forced_choice",
    dimension: "honestyHumility",
    options: [
      { text: "I expect recognition and praise for my achievements", dimension: "extraversion" },
      { text: "I value fairness above personal gain", dimension: "honestyHumility" },
      { text: "I'm comfortable admitting when I don't know something", dimension: "openness" },
    ] as ForcedChoiceOption[],
    weight: 1.2,
  },
  {
    id: "mock-honestyHumility-4",
    text: "If you found a wallet containing $200 and identification, you would most likely:",
    type: "situational_judgment",
    dimension: "honestyHumility",
    options: [
      "Return it with all contents intact",
      "Return it but keep some or all of the money",
      "Consider your options based on your current financial needs",
    ],
    weight: 1.3,
  },
  {
    id: "mock-honestyHumility-5",
    text: "How often do you acknowledge your mistakes to others?",
    type: "behavioral_frequency",
    dimension: "honestyHumility",
    weight: 1.5,
  },

  // Adaptability (5 questions)
  {
    id: "mock-adaptability-1",
    text: "I easily adjust my plans when circumstances change.",
    type: "likert",
    dimension: "adaptability",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-adaptability-2",
    text: "I find it stressful when my routine is disrupted.",
    type: "likert",
    dimension: "adaptability",
    reverse_scored: true,
    weight: 1.0,
  },
  {
    id: "mock-adaptability-3",
    text: "Which is MOST like you and which is LEAST like you?",
    type: "forced_choice",
    dimension: "adaptability",
    options: [
      { text: "I thrive in rapidly changing environments", dimension: "adaptability" },
      { text: "I prefer structured routines and clear expectations", dimension: "conscientiousness" },
      { text: "I enjoy exploring new ideas and perspectives", dimension: "openness" },
    ] as ForcedChoiceOption[],
    weight: 1.2,
  },
  {
    id: "mock-adaptability-4",
    text: "When your organization implements a major change to processes you've mastered, you would most likely:",
    type: "situational_judgment",
    dimension: "adaptability",
    options: [
      "Embrace the change as an opportunity to learn and grow",
      "Compare the new and old processes to determine which is truly better",
      "Feel frustrated about having to relearn established procedures",
    ],
    weight: 1.3,
  },
  {
    id: "mock-adaptability-5",
    text: "In the past year, how often have you voluntarily changed your approach to a recurring task?",
    type: "behavioral_frequency",
    dimension: "adaptability",
    weight: 1.5,
  },

  // Additional questions for expanded coverage (mock data has 56 total)
  // Openness to Experience (additional 3 questions)
  {
    id: "mock-openness-6",
    text: "I find abstract concepts and theoretical discussions engaging.",
    type: "likert",
    dimension: "openness",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-openness-7",
    text: "When planning a vacation, you would most likely:",
    type: "situational_judgment",
    dimension: "openness",
    options: [
      "Choose a destination you've never visited before",
      "Return to a place you've enjoyed in the past",
      "Research extensively but stick to popular tourist destinations",
    ],
    weight: 1.3,
  },
  {
    id: "mock-openness-8",
    text: "How often do you read books or articles about topics outside your field of expertise?",
    type: "behavioral_frequency",
    dimension: "openness",
    weight: 1.2,
  },

  // Conscientiousness (additional 3 questions)
  {
    id: "mock-conscientiousness-6",
    text: "I set high standards for myself and work hard to meet them.",
    type: "likert",
    dimension: "conscientiousness",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-conscientiousness-7",
    text: "Which is MOST like you and which is LEAST like you?",
    type: "forced_choice",
    dimension: "conscientiousness",
    options: [
      { text: "I always arrive early to appointments and meetings", dimension: "conscientiousness" },
      { text: "I build rapport with people easily and naturally", dimension: "extraversion" },
      { text: "I stay calm even when deadlines are tight", dimension: "emotionalResilience" },
    ] as ForcedChoiceOption[],
    weight: 1.2,
  },
  {
    id: "mock-conscientiousness-8",
    text: "How often do you review and update your goals or plans?",
    type: "behavioral_frequency",
    dimension: "conscientiousness",
    weight: 1.2,
  },

  // Extraversion (additional 3 questions)
  {
    id: "mock-extraversion-6",
    text: "I feel comfortable speaking up in group settings.",
    type: "likert",
    dimension: "extraversion",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-extraversion-7",
    text: "When attending a social gathering, you would most likely:",
    type: "situational_judgment",
    dimension: "extraversion",
    options: [
      "Actively seek out conversations with multiple people",
      "Engage in deeper conversations with a few people",
      "Prefer to observe and join conversations when invited",
    ],
    weight: 1.3,
  },
  {
    id: "mock-extraversion-8",
    text: "How often do you initiate social activities or events?",
    type: "behavioral_frequency",
    dimension: "extraversion",
    weight: 1.2,
  },

  // Agreeableness (additional 3 questions)
  {
    id: "mock-agreeableness-6",
    text: "I believe most people have good intentions.",
    type: "likert",
    dimension: "agreeableness",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-agreeableness-7",
    text: "When someone disagrees with your opinion, you would most likely:",
    type: "situational_judgment",
    dimension: "agreeableness",
    options: [
      "Try to find common ground and understand their perspective",
      "Stand firm on your position while respecting theirs",
      "Avoid the conflict and change the subject",
    ],
    weight: 1.3,
  },
  {
    id: "mock-agreeableness-8",
    text: "How often do you compromise your own preferences to make others happy?",
    type: "behavioral_frequency",
    dimension: "agreeableness",
    weight: 1.2,
  },

  // Emotional Resilience (additional 3 questions)
  {
    id: "mock-emotionalResilience-6",
    text: "I bounce back quickly from setbacks and disappointments.",
    type: "likert",
    dimension: "emotionalResilience",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-emotionalResilience-7",
    text: "Which is MOST like you and which is LEAST like you?",
    type: "forced_choice",
    dimension: "emotionalResilience",
    options: [
      { text: "I stay composed and optimistic under pressure", dimension: "emotionalResilience" },
      { text: "I analyze setbacks methodically to prevent future issues", dimension: "conscientiousness" },
      { text: "I quickly pivot and find new approaches when things go wrong", dimension: "adaptability" },
    ] as ForcedChoiceOption[],
    weight: 1.2,
  },
  {
    id: "mock-emotionalResilience-8",
    text: "In the past month, how often have you felt overwhelmed by your emotions?",
    type: "behavioral_frequency",
    dimension: "emotionalResilience",
    reverse_scored: true,
    weight: 1.2,
  },

  // Honesty-Humility (additional 3 questions)
  {
    id: "mock-honestyHumility-6",
    text: "I value authenticity and being true to myself.",
    type: "likert",
    dimension: "honestyHumility",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-honestyHumility-7",
    text: "When you make a mistake that affects others, you would most likely:",
    type: "situational_judgment",
    dimension: "honestyHumility",
    options: [
      "Immediately acknowledge it and take responsibility",
      "Assess the impact before deciding how to address it",
      "Only mention it if someone else notices",
    ],
    weight: 1.3,
  },
  {
    id: "mock-honestyHumility-8",
    text: "How often do you admit when you don't know something?",
    type: "behavioral_frequency",
    dimension: "honestyHumility",
    weight: 1.2,
  },

  // Adaptability (additional 3 questions)
  {
    id: "mock-adaptability-6",
    text: "I enjoy trying new approaches even when current methods work well.",
    type: "likert",
    dimension: "adaptability",
    reverse_scored: false,
    weight: 1.0,
  },
  {
    id: "mock-adaptability-7",
    text: "When your plans are disrupted by unexpected events, you would most likely:",
    type: "situational_judgment",
    dimension: "adaptability",
    options: [
      "Quickly adjust and find alternative solutions",
      "Feel frustrated but eventually adapt",
      "Stick to your original plan as much as possible",
    ],
    weight: 1.3,
  },
  {
    id: "mock-adaptability-8",
    text: "How often do you change your mind about decisions you've made?",
    type: "behavioral_frequency",
    dimension: "adaptability",
    weight: 1.2,
  },
];
