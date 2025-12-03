/**
 * Update Duplicate Questions in Supabase
 * 
 * Replaces near-duplicate questions with conceptually diverse alternatives
 * while maintaining the same dimension, type, and scoring properties.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.error('   Add: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Questions to update with new, conceptually diverse phrasing
// Each update maintains the same dimension, type, reverse_scored, and weight
const QUESTION_UPDATES = [
  // ============================================================================
  // HIGH PRIORITY: Nearly identical questions (>50% similarity)
  // ============================================================================
  
  // 73% similar - storage/items duplicate
  {
    matchText: 'I return items to their designated storage place immediately after using them',
    newText: 'My desk and workspace stay organized throughout the day without deliberate effort.',
    rationale: 'Measures organization as natural habit vs specific behavior',
    dimension: 'conscientiousness'
  },
  
  // 67% similar - conversation initiation duplicate  
  {
    matchText: 'In the past week, how many times have you initiated a conversation with someone you don\'t know well',
    newText: 'In the past week, how often have you introduced yourself to someone new at a work or social event?',
    rationale: 'Specific context (events) vs general stranger interaction',
    dimension: 'extraversion'
  },
  
  // 50% similar - social initiation duplicate
  {
    matchText: 'How often do you initiate social activities or events',
    newText: 'How often are you the one who suggests where to eat or what to do when making plans with friends?',
    rationale: 'Measures social initiative in decision-making context',
    dimension: 'extraversion'
  },

  // ============================================================================
  // PLANNING CLUSTER (23 questions - diversify to measure different facets)
  // ============================================================================
  
  {
    matchText: 'I prepare a detailed checklist or itinerary before starting a complex activity',
    newText: 'I mentally walk through important conversations or events before they happen.',
    rationale: 'Cognitive planning (mental rehearsal) vs written planning',
    dimension: 'conscientiousness'
  },
  {
    matchText: 'I feel most comfortable when my daily activities are planned out in advance',
    newText: 'I typically know what I will be doing at this time next week.',
    rationale: 'Time horizon planning with concrete behavioral indicator',
    dimension: 'conscientiousness'
  },
  {
    matchText: 'I struggle to take action when I do not have a detailed plan in place',
    newText: 'I usually have a backup approach ready when I start a new project.',
    rationale: 'Contingency thinking (positive) vs paralysis (negative)',
    dimension: 'adaptability'
  },
  {
    matchText: 'I prefer to approach my day without a specific schedule or plan',
    newText: 'I get excited when friends suggest spontaneous last-minute plans.',
    rationale: 'Spontaneity comfort in social context vs abstract preference',
    dimension: 'conscientiousness'
  },
  {
    matchText: 'Even during leisure time, I prefer having a rough itinerary rather than just seeing what happens',
    newText: 'I block out dedicated time for focused work versus meetings and interruptions.',
    rationale: 'Energy/time management vs leisure planning',
    dimension: 'conscientiousness'
  },
  {
    matchText: 'How often do you make lists to organize your tasks',
    newText: 'How often do you prioritize your tasks by importance before starting your workday?',
    rationale: 'Prioritization behavior vs list-making',
    dimension: 'conscientiousness'
  },

  // ============================================================================
  // STRESS/RESILIENCE CLUSTER (12 questions - diversify angles)
  // ============================================================================
  
  {
    matchText: 'I feel overwhelmed when I have multiple urgent tasks to complete at once',
    newText: 'Stressful situations rarely affect my sleep quality or appetite.',
    rationale: 'Physical manifestation of stress vs cognitive overwhelm',
    dimension: 'emotionalResilience'
  },
  {
    matchText: 'In the past month, how often have you felt overwhelmed by stress',
    newText: 'In the past month, how often have you maintained your exercise or self-care routine during busy periods?',
    rationale: 'Behavioral resilience indicator vs subjective feeling',
    dimension: 'emotionalResilience'
  },
  {
    matchText: 'I remain calm under pressure',
    newText: 'I can think clearly and make good decisions even when facing tight deadlines.',
    rationale: 'Cognitive functioning under stress vs general calmness',
    dimension: 'emotionalResilience'
  },
  {
    matchText: 'In the past month, how often have you felt overwhelmed by your emotions',
    newText: 'In the past month, how often have you successfully used a calming technique when feeling stressed?',
    rationale: 'Active coping behavior vs passive experience',
    dimension: 'emotionalResilience'
  },

  // ============================================================================
  // SOCIAL/EXTRAVERSION CLUSTER (18 questions - diversify angles)
  // ============================================================================
  
  {
    matchText: 'I find myself feeling drained or tired after spending several hours in a large',
    newText: 'I prefer dinner with six people over dinner with just one other person.',
    rationale: 'Group size preference vs energy drain',
    dimension: 'extraversion'
  },
  {
    matchText: 'I attempt to blend into the background during large gatherings',
    newText: 'I am usually the one who texts or calls friends to make plans.',
    rationale: 'Social initiative vs visibility preference',
    dimension: 'extraversion'
  },
  {
    matchText: 'I feel energized after spending time with a large group of people',
    newText: 'After a quiet weekend at home, I feel eager to see people on Monday.',
    rationale: 'Recovery pattern vs immediate energy response',
    dimension: 'extraversion'
  },
  {
    matchText: 'In group settings, I am usually the one who initiates conversations and actively introduces',
    newText: 'I enjoy chatting with people while waiting in lines or public spaces.',
    rationale: 'Stranger comfort in casual settings vs formal networking',
    dimension: 'extraversion'
  },

  // ============================================================================
  // TASKS/CONSCIENTIOUSNESS CLUSTER (20 questions - diversify)
  // ============================================================================
  
  {
    matchText: 'I often leave tasks unfinished to start working on something new',
    newText: 'I tend to have multiple projects in progress at the same time.',
    rationale: 'Multi-tasking behavior (neutral) vs abandonment (negative)',
    dimension: 'conscientiousness'
  },
  {
    matchText: 'I often leave tasks unfinished when I lose interest',
    newText: 'I push through tedious parts of projects even when I find them boring.',
    rationale: 'Persistence through boredom vs abandonment',
    dimension: 'conscientiousness'
  },

  // ============================================================================
  // CHANGE/ADAPTABILITY CLUSTER (9 questions - diversify)
  // ============================================================================
  
  {
    matchText: 'I find it stressful when my routine is disrupted',
    newText: 'When meetings get rescheduled at the last minute, I feel more frustrated than accepting.',
    rationale: 'Emotional response to specific scenario vs abstract stress',
    dimension: 'adaptability'
  },
  {
    matchText: 'I feel uneasy when my daily routine is interrupted without warning',
    newText: 'I deliberately change my personal routines every few months to keep things interesting.',
    rationale: 'Proactive change-seeking vs reactive discomfort',
    dimension: 'adaptability'
  },
  {
    matchText: 'I easily adjust my plans when circumstances change',
    newText: 'I care more about achieving the end goal than following my original plan exactly.',
    rationale: 'Process vs outcome flexibility',
    dimension: 'adaptability'
  },

  // ============================================================================
  // NEW EXPERIENCES/OPENNESS CLUSTER (23 questions - diversify)
  // ============================================================================
  
  {
    matchText: 'I prefer to use established methods to solve problems rather than experimenting with new techniques',
    newText: 'I try a completely different approach when my usual method is not producing results.',
    rationale: 'Reactive flexibility vs proactive experimentation preference',
    dimension: 'openness'
  },
  {
    matchText: 'I prefer using proven methods rather than experimenting with new, untested approaches',
    newText: 'I enjoy learning new software or tools even when my current ones work perfectly fine.',
    rationale: 'Proactive learning vs method preference',
    dimension: 'adaptability'
  },
  {
    matchText: 'I prefer familiar routines over new experiences',
    newText: 'I often choose restaurants I have never been to over my reliable favorites.',
    rationale: 'Concrete behavioral example vs abstract preference',
    dimension: 'openness'
  },

  // ============================================================================
  // HELPING/AGREEABLENESS CLUSTER (8 questions - diversify)
  // ============================================================================
  
  {
    matchText: 'How often do you volunteer to help others with their tasks when you notice they\'re struggling',
    newText: 'I notice when colleagues are struggling before they ask for help.',
    rationale: 'Perceptiveness to needs vs helping behavior',
    dimension: 'agreeableness'
  },
  {
    matchText: 'I set aside my own tasks to assist colleagues who are struggling with their workload',
    newText: 'I have given up something I wanted so that someone else could have it instead.',
    rationale: 'Personal cost/sacrifice vs task assistance',
    dimension: 'agreeableness'
  },

  // ============================================================================
  // CONFLICT/AGREEABLENESS - diversify
  // ============================================================================
  
  {
    matchText: 'I accept a group decision I dislike to avoid causing tension among the members',
    newText: 'I express disagreement diplomatically even when I feel strongly about an issue.',
    rationale: 'Diplomatic assertion vs passive acceptance',
    dimension: 'agreeableness'
  },
];

async function findQuestionByText(searchText) {
  // Search for partial match
  const { data, error } = await supabase
    .from('questions')
    .select('id, text, dimension, type, reverse_scored, weight, discrimination')
    .ilike('text', `%${searchText.substring(0, 40)}%`);
  
  if (error) {
    console.error('Search error:', error);
    return null;
  }
  
  // Find best match
  if (data && data.length > 0) {
    // Return the one with highest text similarity
    return data.sort((a, b) => {
      const simA = a.text.toLowerCase().includes(searchText.toLowerCase().substring(0, 30)) ? 1 : 0;
      const simB = b.text.toLowerCase().includes(searchText.toLowerCase().substring(0, 30)) ? 1 : 0;
      return simB - simA;
    })[0];
  }
  
  return null;
}

async function updateQuestions() {
  console.log('🔄 Updating Duplicate Questions in Supabase\n');
  console.log('='.repeat(100));
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const updatedQuestions = [];
  
  for (const update of QUESTION_UPDATES) {
    // Find the question
    const question = await findQuestionByText(update.matchText);
    
    if (!question) {
      console.log(`\n⚪ SKIP: Could not find "${update.matchText.substring(0, 50)}..."`);
      skipCount++;
      continue;
    }
    
    console.log(`\n📝 Updating [${question.dimension}]:`);
    console.log(`   OLD: "${question.text.substring(0, 70)}..."`);
    console.log(`   NEW: "${update.newText}"`);
    console.log(`   WHY: ${update.rationale}`);
    
    // Update the question
    const { error } = await supabase
      .from('questions')
      .update({ text: update.newText })
      .eq('id', question.id);
    
    if (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      errorCount++;
    } else {
      console.log(`   ✅ Updated successfully`);
      successCount++;
      updatedQuestions.push({
        id: question.id,
        oldText: question.text,
        newText: update.newText,
        dimension: question.dimension,
        type: question.type
      });
    }
  }
  
  console.log('\n' + '='.repeat(100));
  console.log('\n📊 UPDATE SUMMARY\n');
  console.log(`   ✅ Successfully updated: ${successCount}`);
  console.log(`   ⚪ Skipped (not found): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  
  // Save update log for review
  const fs = require('fs');
  fs.writeFileSync(
    'scripts/question-update-log.json',
    JSON.stringify({ 
      timestamp: new Date().toISOString(),
      updated: updatedQuestions,
      summary: { successCount, skipCount, errorCount }
    }, null, 2)
  );
  console.log('\n   📄 Update log saved to scripts/question-update-log.json');
  
  return { successCount, skipCount, errorCount, updatedQuestions };
}

async function main() {
  const result = await updateQuestions();
  
  if (result.successCount > 0) {
    console.log('\n✅ Questions updated! Now run validation to ensure psychometric integrity.');
  }
}

main().catch(console.error);

