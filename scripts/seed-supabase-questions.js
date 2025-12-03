/**
 * Seed questions into Supabase database
 * Run with: node scripts/seed-supabase-questions.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Supabase credentials not found in .env.local');
  console.log('Please make sure .env.local exists with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// All 56 questions with updated forced-choice options containing dimension mappings
// Each forced-choice question now has options as objects with {text, dimension}
const questions = [
  // Openness to Experience (8 questions)
  { text: "I enjoy exploring new ideas and concepts.", type: "likert", dimension: "openness", options: null, reverse_scored: false, weight: 1.0, order_index: 1 },
  { text: "I prefer familiar routines over new experiences.", type: "likert", dimension: "openness", options: null, reverse_scored: true, weight: 1.0, order_index: 2 },
  { 
    text: "Which is MOST like you and which is LEAST like you?", 
    type: "forced_choice", 
    dimension: "openness", 
    options: [
      { text: "I enjoy philosophical discussions and exploring abstract ideas", dimension: "openness" },
      { text: "I prefer practical, proven approaches to solving problems", dimension: "conscientiousness" },
      { text: "I like to engage others in collaborative brainstorming", dimension: "extraversion" }
    ], 
    reverse_scored: false, 
    weight: 1.2, 
    order_index: 3 
  },
  { text: "When faced with a new technology at work, you typically:", type: "situational_judgment", dimension: "openness", options: ["Eagerly explore all its features right away", "Learn only the essential functions needed for your tasks", "Wait until others have tested it before trying it yourself"], reverse_scored: false, weight: 1.3, order_index: 4 },
  { text: "In the past month, how often have you sought out information on a topic unrelated to your work or studies?", type: "behavioral_frequency", dimension: "openness", options: null, reverse_scored: false, weight: 1.5, order_index: 5 },
  { text: "I find abstract concepts and theoretical discussions engaging.", type: "likert", dimension: "openness", options: null, reverse_scored: false, weight: 1.0, order_index: 6 },
  { text: "When planning a vacation, you would most likely:", type: "situational_judgment", dimension: "openness", options: ["Choose a destination you've never visited before", "Return to a place you've enjoyed in the past", "Research extensively but stick to popular tourist destinations"], reverse_scored: false, weight: 1.3, order_index: 7 },
  { text: "How often do you read books or articles about topics outside your field of expertise?", type: "behavioral_frequency", dimension: "openness", options: null, reverse_scored: false, weight: 1.2, order_index: 8 },

  // Conscientiousness (8 questions)
  { text: "I create detailed plans before starting projects.", type: "likert", dimension: "conscientiousness", options: null, reverse_scored: false, weight: 1.0, order_index: 9 },
  { text: "I often leave tasks unfinished when I lose interest.", type: "likert", dimension: "conscientiousness", options: null, reverse_scored: true, weight: 1.0, order_index: 10 },
  { 
    text: "Which is MOST like you and which is LEAST like you?", 
    type: "forced_choice", 
    dimension: "conscientiousness", 
    options: [
      { text: "I keep my environment organized and clutter-free", dimension: "conscientiousness" },
      { text: "I help others stay on track with their commitments", dimension: "agreeableness" },
      { text: "I seek innovative methods to improve efficiency", dimension: "adaptability" }
    ], 
    reverse_scored: false, 
    weight: 1.2, 
    order_index: 11 
  },
  { text: "When working on a team project with a deadline next week, you would most likely:", type: "situational_judgment", dimension: "conscientiousness", options: ["Create a detailed plan with milestones for the entire team", "Focus on completing your part perfectly, regardless of what others do", "Adapt your approach based on how the project evolves"], reverse_scored: false, weight: 1.3, order_index: 12 },
  { text: "How often do you make lists to organize your tasks?", type: "behavioral_frequency", dimension: "conscientiousness", options: null, reverse_scored: false, weight: 1.5, order_index: 13 },
  { text: "I set high standards for myself and work hard to meet them.", type: "likert", dimension: "conscientiousness", options: null, reverse_scored: false, weight: 1.0, order_index: 14 },
  { 
    text: "Which is MOST like you and which is LEAST like you?", 
    type: "forced_choice", 
    dimension: "conscientiousness", 
    options: [
      { text: "I always arrive early to appointments and meetings", dimension: "conscientiousness" },
      { text: "I build rapport with people easily and naturally", dimension: "extraversion" },
      { text: "I stay calm even when deadlines are tight", dimension: "emotionalResilience" }
    ], 
    reverse_scored: false, 
    weight: 1.2, 
    order_index: 15 
  },
  { text: "How often do you review and update your goals or plans?", type: "behavioral_frequency", dimension: "conscientiousness", options: null, reverse_scored: false, weight: 1.2, order_index: 16 },

  // Extraversion (8 questions)
  { text: "I feel energized after spending time with a large group of people.", type: "likert", dimension: "extraversion", options: null, reverse_scored: false, weight: 1.0, order_index: 17 },
  { text: "I prefer working independently rather than collaborating with others.", type: "likert", dimension: "extraversion", options: null, reverse_scored: true, weight: 1.0, order_index: 18 },
  { 
    text: "Which is MOST like you and which is LEAST like you?", 
    type: "forced_choice", 
    dimension: "extraversion", 
    options: [
      { text: "I enjoy being the center of attention at gatherings", dimension: "extraversion" },
      { text: "I prefer meaningful connections over many acquaintances", dimension: "agreeableness" },
      { text: "I like exploring new ideas and perspectives on my own", dimension: "openness" }
    ], 
    reverse_scored: false, 
    weight: 1.2, 
    order_index: 19 
  },
  { text: "At a networking event where you know few people, you would most likely:", type: "situational_judgment", dimension: "extraversion", options: ["Introduce yourself to as many new people as possible", "Find one or two interesting people for in-depth conversations", "Observe the dynamics before deciding whom to approach"], reverse_scored: false, weight: 1.3, order_index: 20 },
  { text: "In the past week, how many times have you initiated a conversation with someone you don't know well?", type: "behavioral_frequency", dimension: "extraversion", options: null, reverse_scored: false, weight: 1.5, order_index: 21 },
  { text: "I feel comfortable speaking up in group settings.", type: "likert", dimension: "extraversion", options: null, reverse_scored: false, weight: 1.0, order_index: 22 },
  { text: "When attending a social gathering, you would most likely:", type: "situational_judgment", dimension: "extraversion", options: ["Actively seek out conversations with multiple people", "Engage in deeper conversations with a few people", "Prefer to observe and join conversations when invited"], reverse_scored: false, weight: 1.3, order_index: 23 },
  { text: "How often do you initiate social activities or events?", type: "behavioral_frequency", dimension: "extraversion", options: null, reverse_scored: false, weight: 1.2, order_index: 24 },

  // Agreeableness (8 questions)
  { text: "I prioritize others' needs above my own.", type: "likert", dimension: "agreeableness", options: null, reverse_scored: false, weight: 1.0, order_index: 25 },
  { text: "I'm quick to point out when I think someone is wrong.", type: "likert", dimension: "agreeableness", options: null, reverse_scored: true, weight: 1.0, order_index: 26 },
  { 
    text: "Which is MOST like you and which is LEAST like you?", 
    type: "forced_choice", 
    dimension: "agreeableness", 
    options: [
      { text: "I avoid conflict to maintain harmony in relationships", dimension: "agreeableness" },
      { text: "I stand firm on my principles even under pressure", dimension: "honestyHumility" },
      { text: "I adapt my approach based on the situation at hand", dimension: "adaptability" }
    ], 
    reverse_scored: false, 
    weight: 1.2, 
    order_index: 27 
  },
  { text: "When a colleague takes credit for your idea in a meeting, you would most likely:", type: "situational_judgment", dimension: "agreeableness", options: ["Confront them privately after the meeting", "Politely clarify your contribution during the meeting", "Let it go to maintain workplace harmony"], reverse_scored: false, weight: 1.3, order_index: 28 },
  { text: "How often do you volunteer to help others with their tasks when you notice they're struggling?", type: "behavioral_frequency", dimension: "agreeableness", options: null, reverse_scored: false, weight: 1.5, order_index: 29 },
  { text: "I believe most people have good intentions.", type: "likert", dimension: "agreeableness", options: null, reverse_scored: false, weight: 1.0, order_index: 30 },
  { text: "When someone disagrees with your opinion, you would most likely:", type: "situational_judgment", dimension: "agreeableness", options: ["Try to find common ground and understand their perspective", "Stand firm on your position while respecting theirs", "Avoid the conflict and change the subject"], reverse_scored: false, weight: 1.3, order_index: 31 },
  { text: "How often do you compromise your own preferences to make others happy?", type: "behavioral_frequency", dimension: "agreeableness", options: null, reverse_scored: false, weight: 1.2, order_index: 32 },

  // Emotional Resilience (8 questions)
  { text: "I remain calm under pressure.", type: "likert", dimension: "emotionalResilience", options: null, reverse_scored: false, weight: 1.0, order_index: 33 },
  { text: "Small setbacks can significantly impact my mood.", type: "likert", dimension: "emotionalResilience", options: null, reverse_scored: true, weight: 1.0, order_index: 34 },
  { 
    text: "Which is MOST like you and which is LEAST like you?", 
    type: "forced_choice", 
    dimension: "emotionalResilience", 
    options: [
      { text: "I anticipate problems and plan ahead to prevent them", dimension: "conscientiousness" },
      { text: "I recover quickly from disappointments and setbacks", dimension: "emotionalResilience" },
      { text: "I see challenges as opportunities to grow and learn", dimension: "adaptability" }
    ], 
    reverse_scored: false, 
    weight: 1.2, 
    order_index: 35 
  },
  { text: "When you receive unexpected critical feedback on an important project, you would most likely:", type: "situational_judgment", dimension: "emotionalResilience", options: ["Feel upset for days and question your abilities", "Analyze the feedback objectively and create an improvement plan", "Seek validation from others that the criticism was unfair"], reverse_scored: false, weight: 1.3, order_index: 36 },
  { text: "In the past month, how often have you felt overwhelmed by stress?", type: "behavioral_frequency", dimension: "emotionalResilience", options: null, reverse_scored: true, weight: 1.5, order_index: 37 },
  { text: "I bounce back quickly from setbacks and disappointments.", type: "likert", dimension: "emotionalResilience", options: null, reverse_scored: false, weight: 1.0, order_index: 38 },
  { 
    text: "Which is MOST like you and which is LEAST like you?", 
    type: "forced_choice", 
    dimension: "emotionalResilience", 
    options: [
      { text: "I stay composed and optimistic under pressure", dimension: "emotionalResilience" },
      { text: "I analyze setbacks methodically to prevent future issues", dimension: "conscientiousness" },
      { text: "I quickly pivot and find new approaches when things go wrong", dimension: "adaptability" }
    ], 
    reverse_scored: false, 
    weight: 1.2, 
    order_index: 39 
  },
  { text: "In the past month, how often have you felt overwhelmed by your emotions?", type: "behavioral_frequency", dimension: "emotionalResilience", options: null, reverse_scored: true, weight: 1.2, order_index: 40 },

  // Honesty-Humility (8 questions)
  { text: "I would never accept credit for someone else's work.", type: "likert", dimension: "honestyHumility", options: null, reverse_scored: false, weight: 1.0, order_index: 41 },
  { text: "It's sometimes necessary to bend the rules to get ahead.", type: "likert", dimension: "honestyHumility", options: null, reverse_scored: true, weight: 1.0, order_index: 42 },
  { 
    text: "Which is MOST like you and which is LEAST like you?", 
    type: "forced_choice", 
    dimension: "honestyHumility", 
    options: [
      { text: "I expect recognition and praise for my achievements", dimension: "extraversion" },
      { text: "I value fairness above personal gain", dimension: "honestyHumility" },
      { text: "I'm comfortable admitting when I don't know something", dimension: "openness" }
    ], 
    reverse_scored: false, 
    weight: 1.2, 
    order_index: 43 
  },
  { text: "If you found a wallet containing $200 and identification, you would most likely:", type: "situational_judgment", dimension: "honestyHumility", options: ["Return it with all contents intact", "Return it but keep some or all of the money", "Consider your options based on your current financial needs"], reverse_scored: false, weight: 1.3, order_index: 44 },
  { text: "How often do you acknowledge your mistakes to others?", type: "behavioral_frequency", dimension: "honestyHumility", options: null, reverse_scored: false, weight: 1.5, order_index: 45 },
  { text: "I value authenticity and being true to myself.", type: "likert", dimension: "honestyHumility", options: null, reverse_scored: false, weight: 1.0, order_index: 46 },
  { text: "When you make a mistake that affects others, you would most likely:", type: "situational_judgment", dimension: "honestyHumility", options: ["Immediately acknowledge it and take responsibility", "Assess the impact before deciding how to address it", "Only mention it if someone else notices"], reverse_scored: false, weight: 1.3, order_index: 47 },
  { text: "How often do you admit when you don't know something?", type: "behavioral_frequency", dimension: "honestyHumility", options: null, reverse_scored: false, weight: 1.2, order_index: 48 },

  // Adaptability (8 questions)
  { text: "I easily adjust my plans when circumstances change.", type: "likert", dimension: "adaptability", options: null, reverse_scored: false, weight: 1.0, order_index: 49 },
  { text: "I find it stressful when my routine is disrupted.", type: "likert", dimension: "adaptability", options: null, reverse_scored: true, weight: 1.0, order_index: 50 },
  { 
    text: "Which is MOST like you and which is LEAST like you?", 
    type: "forced_choice", 
    dimension: "adaptability", 
    options: [
      { text: "I thrive in rapidly changing environments", dimension: "adaptability" },
      { text: "I prefer structured routines and clear expectations", dimension: "conscientiousness" },
      { text: "I enjoy exploring new ideas and perspectives", dimension: "openness" }
    ], 
    reverse_scored: false, 
    weight: 1.2, 
    order_index: 51 
  },
  { text: "When your organization implements a major change to processes you've mastered, you would most likely:", type: "situational_judgment", dimension: "adaptability", options: ["Embrace the change as an opportunity to learn and grow", "Compare the new and old processes to determine which is truly better", "Feel frustrated about having to relearn established procedures"], reverse_scored: false, weight: 1.3, order_index: 52 },
  { text: "In the past year, how often have you voluntarily changed your approach to a recurring task?", type: "behavioral_frequency", dimension: "adaptability", options: null, reverse_scored: false, weight: 1.5, order_index: 53 },
  { text: "I enjoy trying new approaches even when current methods work well.", type: "likert", dimension: "adaptability", options: null, reverse_scored: false, weight: 1.0, order_index: 54 },
  { text: "When your plans are disrupted by unexpected events, you would most likely:", type: "situational_judgment", dimension: "adaptability", options: ["Quickly adjust and find alternative solutions", "Feel frustrated but eventually adapt", "Stick to your original plan as much as possible"], reverse_scored: false, weight: 1.3, order_index: 55 },
  { text: "How often do you change your mind about decisions you've made?", type: "behavioral_frequency", dimension: "adaptability", options: null, reverse_scored: false, weight: 1.2, order_index: 56 },
];

async function seedQuestions() {
  console.log('🌱 Seeding questions into Supabase...\n');
  console.log(`Total questions to insert: ${questions.length}\n`);

  // Check if questions already exist
  const { count: existingCount } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });

  if (existingCount > 0) {
    console.log(`⚠️  Found ${existingCount} existing questions in database.`);
    console.log('   This script will add new questions. Duplicates may occur.\n');
    console.log('   To start fresh, delete all questions from Supabase dashboard first.\n');
  }

  // Insert questions in batches
  const batchSize = 10;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    // Convert options array to JSONB format
    const formattedBatch = batch.map(q => ({
      text: q.text,
      type: q.type,
      dimension: q.dimension,
      options: q.options ? q.options : null,
      reverse_scored: q.reverse_scored,
      weight: q.weight,
      order_index: q.order_index,
    }));

    const { data, error } = await supabase
      .from('questions')
      .insert(formattedBatch)
      .select();

    if (error) {
      console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      errors++;
    } else {
      inserted += data.length;
      console.log(`✓ Inserted batch ${Math.floor(i / batchSize) + 1}: ${data.length} questions (${inserted}/${questions.length} total)`);
    }
  }

  console.log('\n' + '='.repeat(50));
  if (errors === 0) {
    console.log(`✅ Successfully seeded ${inserted} questions!`);
    console.log('\nYou can now run: npm run dev');
    console.log('Questions will load from Supabase.');
  } else {
    console.log(`⚠️  Completed with ${errors} errors. ${inserted} questions inserted.`);
  }
  console.log('='.repeat(50));
}

seedQuestions().catch(console.error);
