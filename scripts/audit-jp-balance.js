/**
 * Audit J/P questions for balance across different Judging/Perceiving styles
 */
const fs = require('fs');

const content = fs.readFileSync('lib/mock-questions.ts', 'utf8');
const arrayMatch = content.match(/export const mockQuestions[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
let mockQuestions = [];
if (arrayMatch) {
  let jsonStr = arrayMatch[1].trim();
  if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
  mockQuestions = JSON.parse(jsonStr);
}

// Filter J/P questions
const jpQuestions = mockQuestions.filter(q => 
  q.framework_tags?.includes('mbti_jp')
);

console.log('=== J/P QUESTION BALANCE AUDIT ===\n');
console.log('Total J/P questions:', jpQuestions.length);

// Categorize by style
const styles = {
  // ISTJ-style Judging (methodical, organized)
  methodical: {
    keywords: ['to-do', 'todo', 'checklist', 'calendar', 'schedule', 'organize', 'tidy', 'clutter', 'systematic'],
    questions: []
  },
  // Planning-focused (detailed plans, preparation)
  planning: {
    keywords: ['plan', 'prepare', 'before starting', 'in advance', 'detailed', 'step-by-step'],
    questions: []
  },
  // Routine/Structure preference
  routine: {
    keywords: ['routine', 'consistent', 'predictable', 'stable', 'regular', 'daily activities'],
    questions: []
  },
  // Flexibility/Adaptability (P-style)
  flexibility: {
    keywords: ['adjust', 'adapt', 'change', 'switch', 'flexible', 'spontaneous', 'improvise', 'new approach'],
    questions: []
  },
  // Decisiveness (ENTJ-style)
  decisiveness: {
    keywords: ['decide', 'decision', 'settle', 'closure', 'conclude', 'resolve', 'commit'],
    questions: []
  },
  // Goal/Outcome focus
  goalFocus: {
    keywords: ['goal', 'achieve', 'accomplish', 'complete', 'finish', 'deadline', 'outcome', 'result'],
    questions: []
  },
  // Control/Command (ENTJ-style)
  command: {
    keywords: ['control', 'lead', 'direct', 'command', 'charge', 'authority', 'manage'],
    questions: []
  },
  // Uncategorized
  other: {
    keywords: [],
    questions: []
  }
};

// Categorize each question
jpQuestions.forEach(q => {
  const text = q.text.toLowerCase();
  let categorized = false;
  
  for (const [styleName, style] of Object.entries(styles)) {
    if (styleName === 'other') continue;
    
    if (style.keywords.some(k => text.includes(k))) {
      style.questions.push(q);
      categorized = true;
      break; // Only categorize once
    }
  }
  
  if (!categorized) {
    styles.other.questions.push(q);
  }
});

console.log('\n--- DISTRIBUTION BY STYLE ---\n');

const styleNames = {
  methodical: 'Methodical/Organized (ISTJ-style)',
  planning: 'Detailed Planning',
  routine: 'Routine/Structure',
  flexibility: 'Flexibility/Adaptability',
  decisiveness: 'Decisiveness (ENTJ-style)',
  goalFocus: 'Goal/Outcome Focus',
  command: 'Command/Control (ENTJ-style)',
  other: 'Uncategorized'
};

let istjStyle = 0;
let entjStyle = 0;
let pStyle = 0;

for (const [styleName, style] of Object.entries(styles)) {
  const count = style.questions.length;
  const bar = '█'.repeat(count);
  console.log(styleNames[styleName] + ': ' + count);
  console.log('  ' + bar);
  
  if (['methodical', 'planning', 'routine'].includes(styleName)) {
    istjStyle += count;
  } else if (['decisiveness', 'goalFocus', 'command'].includes(styleName)) {
    entjStyle += count;
  } else if (styleName === 'flexibility') {
    pStyle += count;
  }
  
  if (count > 0 && count <= 5) {
    style.questions.forEach(q => {
      console.log('  • ' + q.text.substring(0, 60) + '...');
    });
  }
  console.log('');
}

console.log('--- BALANCE SUMMARY ---\n');
console.log('ISTJ-style J questions (methodical, planning, routine):', istjStyle);
console.log('ENTJ-style J questions (decisiveness, goals, command):', entjStyle);
console.log('P-style questions (flexibility):', pStyle);
console.log('');

if (entjStyle < istjStyle * 0.5) {
  console.log('⚠️  ENTJ-style questions are UNDERREPRESENTED');
  console.log('   Need ' + Math.ceil(istjStyle * 0.5 - entjStyle) + ' more ENTJ-style questions for balance');
} else {
  console.log('✅ Reasonable balance between ISTJ and ENTJ styles');
}

