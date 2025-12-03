/**
 * Mock question data for development/testing when Supabase is not available
 * Auto-generated from database export on 2025-12-03
 * Run: node scripts/sync-mock-questions.js to regenerate
 */
import type { Question, ForcedChoiceOption } from "@/types";

export const mockQuestions: Question[] = [
  {
    "id": "00cbe0a4-d05a-4f55-a74f-4c90cf98de12",
    "text": "I would accept a personal disadvantage rather than break a rule to get ahead.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.966313426113164,
    "framework_tags": [
      "prism_honestyHumility",
      "enneagram_1"
    ]
  },
  {
    "id": "03033aee-d3bd-49b4-9a66-0ff166e575ca",
    "text": "I trust tangible facts and evidence more than theoretical possibilities.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 0.987913119881857,
    "framework_tags": [
      "prism_openness",
      "mbti_sn"
    ]
  },
  {
    "id": "0308d329-5a01-49a4-a297-611d268fab9c",
    "text": "Spending time in a lively social setting recharges my energy.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.94861081738736,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "036a497d-6268-456c-8144-aeba07c89ef1",
    "text": "I feel uncomfortable starting a project when the objectives are vague or undefined.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.04878402461862,
    "framework_tags": [
      "prism_openness",
      "mbti_sn"
    ]
  },
  {
    "id": "044dd035-a818-4ae1-b0bc-584e4e335d71",
    "text": "I often feel that something essential is missing from my life that I cannot quite define.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.02331831766895,
    "framework_tags": [
      "prism_openness",
      "enneagram_4"
    ]
  },
  {
    "id": "0480de63-5048-4a2b-adb7-9a30bd15e17d",
    "text": "How often do you review and update your goals or plans?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "05520763-6014-4aba-9e37-5fe3893553e0",
    "text": "When facing unexpected changes in your environment, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.986283089243445,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      {
        "text": "I modify my methods to fit the situation",
        "dimension": "adaptability"
      },
      {
        "text": "I act with transparency in all interactions",
        "dimension": "honestyHumility"
      },
      {
        "text": "I seek out complex and theoretical problems",
        "dimension": "openness"
      }
    ]
  },
  {
    "id": "0601579b-1811-4d80-99a2-260b6c55da73",
    "text": "You have decided to learn a new language to improve your future career prospects. You would most likely:",
    "type": "situational_judgment",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.923692856713144,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      "Create a strict daily schedule with specific milestones to ensure you reach fluency by a set date.",
      "Set a general goal to practice a few times a week whenever you have a block of free time.",
      "Learn naturally by listening to music or watching movies in that language whenever you feel like it."
    ]
  },
  {
    "id": "06c029b7-6aa3-487c-b54f-8ea78efe46e6",
    "text": "Your team is facing a recurring technical problem. A colleague proposes a completely new, experimental theory that might fix the root cause but involves learning complex, abstract concepts. You would most likely:",
    "type": "situational_judgment",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.02019070337559,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      "Dive enthusiastically into the new theory to understand the abstract concepts and potential innovation.",
      "Review the theory to see if it offers a practical application before spending too much time on it.",
      "Suggest sticking to the standard troubleshooting methods that have proven effective in the past."
    ]
  },
  {
    "id": "07b2c2af-b392-4209-8566-68c06c166960",
    "text": "I create detailed plans before starting any significant project.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.0455859260359,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp"
    ]
  },
  {
    "id": "085628cd-22ee-4898-8fc3-53144d88c5e5",
    "text": "During a brainstorming session at work, the moderator asks the group to generate ideas for a future project without worrying about budget or current limitations. You would most likely:",
    "type": "situational_judgment",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.01726493664369,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      "Propose wild, unconventional ideas that might seem impossible now but could revolutionize the work.",
      "Suggest creative improvements to existing processes that push boundaries but remain somewhat realistic.",
      "Focus on generating practical, concrete strategies that ensure the project is feasible and successful."
    ]
  },
  {
    "id": "08991fdd-e8b1-4a8b-8e93-a4b711d79a62",
    "text": "You are mediating a dispute between two coworkers who disagree on how to approach a task. You would most likely:",
    "type": "situational_judgment",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.00221140482059,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      "Evaluate both arguments against the project goals and select the most logical solution.",
      "Look for a technical compromise that incorporates functional parts of both ideas.",
      "Focus on resolving the emotional tension between them to ensure their working relationship remains intact."
    ]
  },
  {
    "id": "09690caa-b6ff-48d6-b2b9-703a56873332",
    "text": "In the past month, how often have you chosen a familiar method to solve a problem specifically to avoid the uncertainty of trying a new approach?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": true,
    "weight": 1.5,
    "discrimination": 0.905125772799765,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "09cb9585-b41f-484e-b2b0-8c156a9a84c8",
    "text": "I prefer a schedule filled with varied activities and different people.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.98151221641122,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei",
      "enneagram_7"
    ]
  },
  {
    "id": "0b4521f8-23c0-4243-af09-ac37d7ef9d83",
    "text": "When considering how you interact with others, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.987362163446934,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      {
        "text": "I avoid manipulating others for personal gain",
        "dimension": "honestyHumility"
      },
      {
        "text": "I remain calm during stressful situations",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I seek out complex theoretical problems",
        "dimension": "openness"
      }
    ]
  },
  {
    "id": "0bb51702-0f27-40de-949e-eb5eb4ee74a4",
    "text": "I work most effectively where rules and expectations stay consistent over time.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.00468262864514,
    "framework_tags": [
      "prism_adaptability",
      "mbti_jp"
    ]
  },
  {
    "id": "0c0160ff-bd3f-479a-b525-eb598a84fa98",
    "text": "I complete tasks well before deadlines to avoid last-minute stress.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.03540389283092,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp"
    ]
  },
  {
    "id": "0c904ec0-656d-4d07-8875-fe94a69521d5",
    "text": "Thinking about your sense of self and entitlement, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      {
        "text": "I sometimes feel entitled to special treatment",
        "dimension": "honestyHumility"
      },
      {
        "text": "I value fairness above personal gain",
        "dimension": "honestyHumility"
      },
      {
        "text": "I'm comfortable admitting when I don't know something",
        "dimension": "honestyHumility"
      }
    ]
  },
  {
    "id": "0cb25a3a-18dd-48ea-ab93-dc454ea1d42d",
    "text": "In the past month, how often have you criticized yourself for making a minor error that others likely did not notice?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.00628553334912,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "0d27f0f4-f98e-498e-96ce-abdf887e507e",
    "text": "In the past month, how often have you anticipated someone else's needs and acted on them before they asked for help?",
    "type": "behavioral_frequency",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.984452858618265,
    "framework_tags": [
      "prism_agreeableness"
    ]
  },
  {
    "id": "0dedb9f6-b4b8-4f1d-ba1f-4222be574041",
    "text": "When dealing with challenges at work or in life, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.937729723745962,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      {
        "text": "I maintain a positive outlook during difficulties",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I strive for accuracy in every detail",
        "dimension": "conscientiousness"
      },
      {
        "text": "I enjoy navigating through ambiguous situations",
        "dimension": "adaptability"
      }
    ]
  },
  {
    "id": "0ef7b495-45d8-42bb-b97b-9a262c5b6098",
    "text": "When working on projects, I look for opportunities to collaborate with others.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.07441681744544,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei",
      "enneagram_2"
    ]
  },
  {
    "id": "1254392e-7e24-4fd3-80b1-0fc96e42c763",
    "text": "You are working on a group project where a team member suggests a strategy that you believe is inefficient and likely to fail. You would most likely:",
    "type": "situational_judgment",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.08802979365176,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      "Agree to try their approach to maintain team harmony and boost their confidence.",
      "Suggest combining their idea with your own to find a middle ground that keeps everyone satisfied.",
      "Directly challenge the idea and insist on using the method you know will generate the best results."
    ]
  },
  {
    "id": "126946da-d742-4979-acf6-1faf5bbe8768",
    "text": "In the past week, how often have you returned personal items to their designated storage place immediately after using them?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1.00956467090918,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "12a380fd-fc5a-4408-ad60-b0291a3bbced",
    "text": "I enjoy analyzing my own emotional reactions to understand what they reveal about me.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.01284616111795,
    "framework_tags": [
      "prism_openness",
      "enneagram_4"
    ]
  },
  {
    "id": "1407e242-86b5-4912-821d-7fbd22c0e9d9",
    "text": "You are working on a long-term project when your supervisor suddenly announces that the deadline has been moved up by two days, requiring you to work much faster than planned. You would most likely:",
    "type": "situational_judgment",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.08921974157259,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      "Immediately reorganize your schedule to prioritize essential tasks and focus on execution.",
      "Feel a spike of stress about the change, but push through it to get the work done.",
      "Feel overwhelmed by the sudden pressure and struggle to concentrate on where to start."
    ]
  },
  {
    "id": "150e82a6-4d1e-47fe-b452-51f4f4c0fbf0",
    "text": "You are selling a used item online. You know it has a minor defect that only appears occasionally, but the buyer hasn't noticed it during their inspection. You would most likely:",
    "type": "situational_judgment",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.09412315030875,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      "Inform the buyer about the issue before finalizing the price, so they know exactly what they are buying.",
      "Say nothing unless they ask specifically about defects, as it is the buyer's job to check the item.",
      "Actively assure them the item is in perfect condition to ensure you get the price you want."
    ]
  },
  {
    "id": "155238b2-fdca-4aab-b6d8-8747f0e7f81a",
    "text": "You are introduced to an influential figure in your industry who could significantly advance your career. During the conversation, they make a joke that you do not find funny at all. You would most likely:",
    "type": "situational_judgment",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.944383998493577,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      "Remain polite but do not fake a laugh, preferring to stay genuine in your interactions.",
      "Smile slightly to be polite, even though you do not genuinely find it amusing.",
      "Laugh enthusiastically to flatter them and ensure they have a positive impression of you."
    ]
  },
  {
    "id": "159e2d02-836d-4753-84b8-7fa19bc45e8a",
    "text": "I return items to their designated places immediately after using them.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp"
    ]
  },
  {
    "id": "17322dc2-83c9-4bbe-9e60-105eb29a830d",
    "text": "I need regular time alone to explore my thoughts and interests without interruption.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.995057883523914,
    "framework_tags": [
      "prism_openness",
      "enneagram_5"
    ]
  },
  {
    "id": "178eb6bf-7259-49dd-a0df-1a58c65b03de",
    "text": "You are attending a large professional networking event where you don't know anyone. You would most likely:",
    "type": "situational_judgment",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.0355300655426,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      "Actively circulate the room to meet as many new people as possible.",
      "Find one approachable person or small group and stick with them for a while.",
      "Spend most of the time observing from the sidelines or finding a quiet spot to take a break."
    ]
  },
  {
    "id": "17b450d9-daa1-4c67-8442-fcddd08c8edf",
    "text": "I actively seek out fast-paced environments full of activity.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.937162035728531,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei",
      "enneagram_7",
      "enneagram_8"
    ]
  },
  {
    "id": "18a1a633-6ee0-4339-9690-1d92a1202c57",
    "text": "When your principles are tested, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.01612483612055,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      {
        "text": "I value fairness more than winning",
        "dimension": "honestyHumility"
      },
      {
        "text": "I initiate conversations with strangers easily",
        "dimension": "extraversion"
      },
      {
        "text": "I adjust my plans when circumstances change",
        "dimension": "adaptability"
      }
    ]
  },
  {
    "id": "199dc4f2-c2ef-4340-aa37-493d4c83417e",
    "text": "When receiving feedback or criticism, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.07064571087248,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      {
        "text": "I handle criticism without getting discouraged",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I admit when I do not know the answer",
        "dimension": "honestyHumility"
      },
      {
        "text": "I adjust my approach when circumstances change",
        "dimension": "adaptability"
      }
    ]
  },
  {
    "id": "1a2fde58-90ff-4417-9821-b65217cba6de",
    "text": "When you make a mistake that affects others, you would most likely:",
    "type": "situational_judgment",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      "Immediately acknowledge it and take responsibility",
      "Assess the impact before deciding how to address it",
      "Only mention it if someone else notices"
    ]
  },
  {
    "id": "1af41de6-671d-4579-bda0-9cb11f6a19b5",
    "text": "You receive news that you have achieved a significant personal goal you have been working toward for months. You would most likely:",
    "type": "situational_judgment",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.01091355633857,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      "Organize a get-together with friends and colleagues to celebrate the news publicly.",
      "Share the good news with a few close family members or friends over a quiet dinner.",
      "Feel a sense of internal satisfaction and enjoy the accomplishment privately without making a big announcement."
    ]
  },
  {
    "id": "1ef5fcc6-fb90-48ea-a1d8-8bd3475dd342",
    "text": "I find myself worrying about potential outcomes long before they happen.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 0.931331027461227,
    "framework_tags": [
      "prism_emotionalResilience",
      "enneagram_6"
    ]
  },
  {
    "id": "1f960deb-01e0-4696-8eff-606f6dc4d0e6",
    "text": "I need to discuss my ideas verbally with others to fully understand my own thinking.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.08337250878705,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "1ff837e8-421a-44d3-9981-9339b338e6ec",
    "text": "In the past month, how often have you engaged in a creative activity (such as writing, drawing, crafting, or brainstorming) for personal enjoyment?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1.05622869230858,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "212c079a-13e3-4732-adb5-8536f651c856",
    "text": "A close colleague presents a proposal to you that they are excited about, but you immediately spot a major logical flaw. You would most likely:",
    "type": "situational_judgment",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.08460386473629,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      "Immediately point out the error to prevent them from wasting further time.",
      "Listen to the full presentation before asking questions that lead them to the error.",
      "Focus on praising their effort and creativity first, avoiding direct criticism to protect their confidence."
    ]
  },
  {
    "id": "22b0b255-373a-4e5a-968a-30a5ea461bc6",
    "text": "When project goals change unexpectedly, I immediately adjust my workflow.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.971267595941778,
    "framework_tags": [
      "prism_adaptability",
      "mbti_jp",
      "enneagram_7"
    ]
  },
  {
    "id": "22f9e806-a39e-4eca-986b-8454e8706190",
    "text": "You are a manager required to cut the budget, which will result in letting one team member go. You would most likely:",
    "type": "situational_judgment",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.924699551042222,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      "Review performance metrics and remove the person with the lowest output.",
      "Ask for volunteers or reduce hours across the board to avoid firing anyone.",
      "Consider who has the most difficult personal circumstances and protect them."
    ]
  },
  {
    "id": "23130e11-0951-497e-aac0-70c483ecf885",
    "text": "I engage in discussions about the deeper meaning behind current events and trends.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.915083097140906,
    "framework_tags": [
      "prism_openness",
      "mbti_sn"
    ]
  },
  {
    "id": "232debfb-a8d4-43fe-9162-6fef13fc7d0e",
    "text": "How often do you compromise your own preferences to make others happy?",
    "type": "behavioral_frequency",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_agreeableness"
    ]
  },
  {
    "id": "23a409a4-3365-4703-ae34-a32a672e441a",
    "text": "When your plans are disrupted by unexpected events, you would most likely:",
    "type": "situational_judgment",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      "Quickly adjust and find alternative solutions",
      "Feel frustrated but eventually adapt",
      "Stick to your original plan as much as possible"
    ]
  },
  {
    "id": "24947478-c409-4cd8-b8bd-5c84be24d2dc",
    "text": "I set high standards for myself and work persistently to meet them.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.04573443738924,
    "framework_tags": [
      "prism_conscientiousness",
      "enneagram_1",
      "enneagram_3"
    ]
  },
  {
    "id": "24e24df7-f185-4356-be3d-843e98d9c876",
    "text": "I feel overwhelmed when I have multiple urgent tasks to complete at once.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.08331037688208,
    "framework_tags": [
      "prism_emotionalResilience",
      "enneagram_6"
    ]
  },
  {
    "id": "2607df27-f491-4e94-b4f6-0a789fe22046",
    "text": "In the past month, how often have you sought external reassurance or checked with others before feeling confident in a decision you made?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.03525413042468,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "2678a390-8b5c-4479-80c2-b3db47ecb96c",
    "text": "A colleague approaches you with a personal problem that is affecting their focus, but you are currently very busy with your own urgent tasks. You would most likely:",
    "type": "situational_judgment",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.927689418848605,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      "Stop what you are doing immediately to listen and offer emotional support, putting your tasks on hold.",
      "Listen for a few minutes to show you care, then suggest talking more extensively after work.",
      "Politely explain that you are on a tight deadline and cannot talk right now."
    ]
  },
  {
    "id": "26a308fd-8c7a-409a-9961-019eb9af8d68",
    "text": "You are explaining a complex concept to a colleague. To ensure they understand, you would most likely:",
    "type": "situational_judgment",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.06787648454038,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      "Use specific examples, real-world data, and a chronological sequence of events.",
      "Start with the main point and fill in details as they ask for them.",
      "Use analogies, metaphors, and focus on the 'big picture' theory behind the concept."
    ]
  },
  {
    "id": "28ac1bb2-0bb4-4092-b9d3-ba4549589c6e",
    "text": "You are at a restaurant with friends, and the menu features a 'Chef's Special' described only as a unique fusion of exotic ingredients you have never tasted before. You would most likely:",
    "type": "situational_judgment",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.0784461795371,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      "Order the special immediately, excited by the surprise and the chance to experience new flavors.",
      "Ask the server for a few details about the main ingredients before deciding if it is worth the risk.",
      "Order a dish you are familiar with to ensure you enjoy your meal without any unpleasant surprises."
    ]
  },
  {
    "id": "296286a5-1f1f-498f-b5ae-040bf0cc8c98",
    "text": "In the past month, how often have you raised your voice at someone when you felt frustrated?",
    "type": "behavioral_frequency",
    "dimension": "emotionalResilience",
    "reverse_scored": true,
    "weight": 1.5,
    "discrimination": 1.03878128075196,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "2a03985a-63ec-4bcb-bcb7-58043624b8c1",
    "text": "I enjoy situations that force me to reconsider my perspective on an issue.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.05522239632487,
    "framework_tags": [
      "prism_adaptability",
      "enneagram_7"
    ]
  },
  {
    "id": "2ab1b632-4d0e-47d7-9f72-1688f6f15358",
    "text": "In social gatherings, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.01533987953482,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      {
        "text": "I feel energized when meeting new people",
        "dimension": "extraversion"
      },
      {
        "text": "I make an effort to understand others' perspectives",
        "dimension": "agreeableness"
      },
      {
        "text": "I keep my workspace clean and organized",
        "dimension": "conscientiousness"
      }
    ]
  },
  {
    "id": "2c4fc461-3ced-425c-ba80-56fe2f81cea8",
    "text": "I pay more attention to concrete physical details than to abstract atmosphere or meaning.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 1.08514339988829,
    "framework_tags": [
      "prism_openness",
      "mbti_sn"
    ]
  },
  {
    "id": "2c561f3f-e286-45b0-a6e0-e21972af07c4",
    "text": "In the past week, how often have you created a written list or schedule of tasks to complete?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1.09441702897756,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "2d45adeb-9a86-4e2b-a929-a75173c0c551",
    "text": "Thinking about how you spend your free time, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.985362025705505,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      {
        "text": "I prefer spending time with large groups",
        "dimension": "extraversion"
      },
      {
        "text": "I set ambitious goals for myself",
        "dimension": "conscientiousness"
      },
      {
        "text": "I recover quickly from setbacks",
        "dimension": "emotionalResilience"
      }
    ]
  },
  {
    "id": "2d5368f2-4ff0-4e69-89a9-4e1f894b43fb",
    "text": "When my initial problem-solving approach fails, I quickly switch to a different strategy.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.09164764329876,
    "framework_tags": [
      "prism_adaptability",
      "mbti_jp"
    ]
  },
  {
    "id": "2faee747-d199-4a07-b45e-3c325b851848",
    "text": "I prefer using proven methods rather than experimenting with untested approaches.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.02556738854466,
    "framework_tags": [
      "prism_adaptability",
      "mbti_jp"
    ]
  },
  {
    "id": "2ff3dd61-a6a2-46dc-9f01-4fa9107f80bd",
    "text": "How often do you read books or articles about topics outside your field of expertise?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "3022a13f-ea87-4ae0-ab86-086543326508",
    "text": "In the past month, how often have you started a new project or hobby because the previous one lost its initial excitement?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.05216738339653,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "32febd1a-9276-46c5-9743-655fce46c365",
    "text": "At a networking event where you know few people, you would most likely:",
    "type": "situational_judgment",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      "Introduce yourself to as many new people as possible",
      "Find one or two interesting people for in-depth conversations",
      "Observe the dynamics before deciding whom to approach"
    ]
  },
  {
    "id": "33175c76-0ea0-4519-a478-a5a68d5a9993",
    "text": "In the past week, how often have you double-checked your work for errors before marking it as finished?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.904546027983353,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "354e8d59-0979-4fc1-a544-59a5dbc63d23",
    "text": "During high-pressure moments, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.916565707934295,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      {
        "text": "I keep my emotions steady in stressful moments",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I value artistic expression and beauty",
        "dimension": "openness"
      },
      {
        "text": "I treat others fairly regardless of status",
        "dimension": "honestyHumility"
      }
    ]
  },
  {
    "id": "362e7722-2424-42bc-a921-0b4bdf321d71",
    "text": "You are traveling for business and have the option to book a luxury hotel that exceeds the standard company budget. You know the finance department rarely checks these specific details and you have had a very stressful month. You would most likely:",
    "type": "situational_judgment",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.937274705829756,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      "Book a standard hotel within the budget, as it meets your basic needs and complies with policy.",
      "Book a slightly nicer hotel than usual, assuming a small overage is acceptable given your recent workload.",
      "Book the luxury hotel, feeling that you deserve the extra comfort and status for the hard work you are putting in."
    ]
  },
  {
    "id": "3708399a-ff64-40b2-9755-073e5f62c487",
    "text": "When things don't go as planned, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      {
        "text": "I bounce back quickly after disappointments",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I prefer having a detailed plan before starting",
        "dimension": "conscientiousness"
      },
      {
        "text": "I enjoy exploring unconventional ideas",
        "dimension": "openness"
      }
    ]
  },
  {
    "id": "38843c91-e83c-450a-84a6-35d037350460",
    "text": "I flatter people I dislike if I think it will help me achieve my goals.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.00188420707851,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "3896cc47-946d-4fe9-a882-19e939fd3a20",
    "text": "I allow my workspace to become cluttered before taking time to organize it.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 1.05911629646687,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp"
    ]
  },
  {
    "id": "38a6d39f-c451-4a11-802d-4c1ed97711ec",
    "text": "I express my frustration directly and immediately when someone makes a mistake.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 0.984426487594486,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf"
    ]
  },
  {
    "id": "39ec8371-c397-4779-b888-2fa724c17b52",
    "text": "Living a conventional, predictable life feels stifling to me.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.951153459761231,
    "framework_tags": [
      "prism_openness",
      "enneagram_4",
      "enneagram_7"
    ]
  },
  {
    "id": "3acfaee9-0248-4a1b-bc9d-e34379b61910",
    "text": "You have spent months mastering a specific software program for your daily work. Suddenly, your organization announces that everyone must switch to a completely different system starting next week. You would most likely:",
    "type": "situational_judgment",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.08233873123577,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      "Immediately start exploring the new system's features to see how it might improve your current workflow.",
      "Accept the change and schedule time to learn the basics, though you feel frustrated about losing your expertise in the old system.",
      "Continue using the old system for as long as possible while waiting to see if the decision to switch is actually final."
    ]
  },
  {
    "id": "3add5e59-5aba-4285-8dcb-62af38b9c6f0",
    "text": "When facing uncertainty about the future, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      {
        "text": "I stay calm even when outcomes are unclear",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I thrive in group discussions and debates",
        "dimension": "extraversion"
      },
      {
        "text": "I prioritize helping others over my own tasks",
        "dimension": "agreeableness"
      }
    ]
  },
  {
    "id": "3c867a51-ea9a-4e78-a008-b0200e674da1",
    "text": "I minimize my own needs to avoid becoming a burden or source of conflict.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.09307902199358,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_9",
      "enneagram_2"
    ]
  },
  {
    "id": "3cf5c9fa-54e2-45bc-982d-bf7c3e499280",
    "text": "For vacations, I choose destinations I have visited before to ensure enjoyment.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 0.965216092529997,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "3de35668-00ef-4a73-85ea-448189177972",
    "text": "I prefer communication that is literal and direct rather than metaphorical.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 1.05750833220914,
    "framework_tags": [
      "prism_openness",
      "mbti_sn"
    ]
  },
  {
    "id": "40132e24-429b-4c4c-adf8-29bdb8070bb2",
    "text": "I prefer approaching my day without a specific schedule or plan.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp"
    ]
  },
  {
    "id": "40b85e80-484c-44d7-a8ee-ee54a1052b0b",
    "text": "I find it stressful when my daily routine is disrupted.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_adaptability",
      "mbti_jp"
    ]
  },
  {
    "id": "41408688-aff5-4e29-a261-54d3ace18bcb",
    "text": "I worry that people might distance themselves if I stop being helpful.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.994495033660863,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_2"
    ]
  },
  {
    "id": "41940867-1855-4376-baa0-8320f3d2d433",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.971341356918626,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      {
        "text": "I recover quickly after facing a setback",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I ensure that everyone feels included",
        "dimension": "agreeableness"
      },
      {
        "text": "I seek out complex problems to solve",
        "dimension": "openness"
      }
    ]
  },
  {
    "id": "419955d6-c449-404d-9430-809f92ee67eb",
    "text": "Being logically consistent matters more to me than maintaining group harmony.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 1.04300520808016,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf"
    ]
  },
  {
    "id": "41b1af65-71dd-435c-ade2-122316f976cf",
    "text": "You complete a difficult work assignment two days before the final deadline. You would most likely:",
    "type": "situational_judgment",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.09168715973908,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      "Spend the remaining two days reviewing the work multiple times to polish details and catch minor errors.",
      "Submit the work now to clear your schedule and get a head start on the next item on your list.",
      "Submit the work immediately and take the opportunity to relax or socialize with colleagues."
    ]
  },
  {
    "id": "41b8bdd9-cde1-4fda-a7d3-aa6b1a0bd6cb",
    "text": "In the past month, how often have you spent your free time researching a complex topic purely out of curiosity?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.926477723779604,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "42108959-770c-4bff-9cd3-38fe411d152c",
    "text": "I bounce back quickly from setbacks and disappointments.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "4300941e-67d1-4633-9c2c-27658768d349",
    "text": "I feel I deserve better treatment than average people due to my unique qualities.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 0.981719303961095,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "45d4ca67-346c-49eb-8a86-1260ef703bae",
    "text": "I value practical solutions that have worked before more than untested novel ideas.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 0.937993717155726,
    "framework_tags": [
      "prism_openness",
      "mbti_sn"
    ]
  },
  {
    "id": "464221b6-2d1d-4e57-8f06-582e5480006b",
    "text": "You attend a social gathering where the customs and etiquette are very different from what you are used to. You realize you are overdressed and unfamiliar with the food being served. You would most likely:",
    "type": "situational_judgment",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.925401935558648,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      "Observe how others are behaving, mimic their actions, and enthusiastically try the food to immerse yourself in the experience.",
      "Stay polite and engage in conversation, though you remain self-conscious about being overdressed.",
      "Find a quiet corner to observe from a distance and plan to leave as soon as it is polite to do so."
    ]
  },
  {
    "id": "4698b603-9819-4c74-9e03-73734e52abef",
    "text": "I value emotional depth and authenticity even when it involves pain or discomfort.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.0890137415009,
    "framework_tags": [
      "prism_openness",
      "enneagram_4"
    ]
  },
  {
    "id": "476966d1-2afd-4085-ba8c-628954389868",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.943785065592769,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      {
        "text": "I plan my daily schedule carefully",
        "dimension": "conscientiousness"
      },
      {
        "text": "I enjoy learning about new topics",
        "dimension": "openness"
      },
      {
        "text": "I treat everyone with fairness",
        "dimension": "honestyHumility"
      }
    ]
  },
  {
    "id": "48bc414c-20ef-4572-a048-f330ca4c5be9",
    "text": "I prefer working independently rather than collaborating with others.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 1.04631489293182,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "48c14eef-6b94-4355-bd14-b9ee6a6db46b",
    "text": "I rely primarily on objective facts and logic rather than personal values when deciding.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 1.02603983399312,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf"
    ]
  },
  {
    "id": "48c4d429-8b8a-4f9d-8c0d-0f8354b65b3e",
    "text": "I actively seek out films, music, and books from cultures very different from my own.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.905064183891391,
    "framework_tags": [
      "prism_openness",
      "mbti_sn"
    ]
  },
  {
    "id": "48e18781-5422-440a-8bbb-e87111416c95",
    "text": "I resume friendly relations quickly after having an argument with someone.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.933127130216951,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_9"
    ]
  },
  {
    "id": "4977dfd3-fe7d-4492-87e7-4ccfac9dcf4a",
    "text": "I am comfortable making unpopular decisions if they are the most efficient option.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 0.919360436077458,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf"
    ]
  },
  {
    "id": "4af93c78-2496-49ea-a466-eedeb65bcc38",
    "text": "At work or school events, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      {
        "text": "I naturally gravitate toward group activities",
        "dimension": "extraversion"
      },
      {
        "text": "I follow through on commitments even when difficult",
        "dimension": "conscientiousness"
      },
      {
        "text": "I embrace new approaches when old ones stop working",
        "dimension": "adaptability"
      }
    ]
  },
  {
    "id": "4ca3e2f3-8b75-4941-98c1-1e44b75ab8ea",
    "text": "In the past month, how often have you sought out information on a topic unrelated to your work or studies?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "4dd5e40a-94d7-4fce-894c-f9719c925d70",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.03613136259801,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      {
        "text": "I admit my mistakes rather than hiding them",
        "dimension": "honestyHumility"
      },
      {
        "text": "I adjust my approach quickly when circumstances change",
        "dimension": "adaptability"
      },
      {
        "text": "I avoid conflict by seeking compromise with others",
        "dimension": "agreeableness"
      }
    ]
  },
  {
    "id": "4dd9e205-ba31-48e5-90ef-6ca8cbdf129a",
    "text": "While traveling to a destination, you discover a road closure forces a significant detour. You would most likely:",
    "type": "situational_judgment",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.07776884326819,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      "Immediately consult a map to find the most efficient alternative route to get back on schedule.",
      "Look for a new route, but take a moment to see if there is a convenient stop nearby.",
      "View this as an exciting opportunity to explore a new area you hadn't intended to visit."
    ]
  },
  {
    "id": "4e895e8c-c87b-435c-82a2-160f2e0b2385",
    "text": "I accept group decisions I dislike to avoid causing tension among members.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.91449356732857,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_9"
    ]
  },
  {
    "id": "4f8b0bc6-aee6-44e4-af98-c88838d45455",
    "text": "I prefer spending free evenings with solitary hobbies rather than going out.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "513a696a-137e-49e2-847a-36e06e7f9119",
    "text": "You are at a social gathering and are introduced to someone who holds a worldview and set of values completely opposite to your own. You would most likely:",
    "type": "situational_judgment",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.05409950397286,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      "Engage them in a deep conversation to understand their perspective and challenge your own thinking.",
      "Listen politely to their views and try to find specific areas where you might agree.",
      "Steer the conversation toward neutral, everyday topics to avoid potential conflict or discomfort."
    ]
  },
  {
    "id": "51a1886e-de1c-4478-a7cd-481c04bc479b",
    "text": "I initiate conversations with people I do not know at social events.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.999406683109463,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "5320d9f3-b3b9-4b46-bedb-4a8fd4ad857e",
    "text": "In the past month, how often have you mentally rehearsed a negative outcome to ensure you had a plan to handle it?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.06808427032011,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "533e251e-8b5b-4eae-b0fc-5f54b1e42f88",
    "text": "In the past year, how often have you voluntarily changed your approach to a recurring task?",
    "type": "behavioral_frequency",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1,
    "framework_tags": [
      "prism_adaptability"
    ]
  },
  {
    "id": "534cdaee-a3db-45bc-b750-c6fd36a485e6",
    "text": "I hold myself to higher standards than what others typically expect of me.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.03524545789153,
    "framework_tags": [
      "prism_conscientiousness",
      "enneagram_1"
    ]
  },
  {
    "id": "53f190d5-68be-4b0e-a54c-dfa70a56b07b",
    "text": "I keep my weekly schedule filled with various activities and commitments.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.974140012581794,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei",
      "enneagram_3"
    ]
  },
  {
    "id": "54229708-2202-48e1-b047-eb9ed1456036",
    "text": "I prefer working where expectations are clear and procedures are standardized.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp",
      "enneagram_6"
    ]
  },
  {
    "id": "54f856f6-99f4-4927-9a94-1fc9555857ae",
    "text": "You have a free weekend with absolutely no work commitments. You would most likely:",
    "type": "situational_judgment",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.97886343089077,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      "Create a schedule of specific activities to ensure you make the most of the time.",
      "Choose one main activity to do, but leave the rest of the time unstructured.",
      "Wake up without a plan and decide what to do based on how you feel in the moment."
    ]
  },
  {
    "id": "551647ce-3a79-4ae5-9dc2-5b8d6e572636",
    "text": "You are sitting in a waiting area for an appointment that has been delayed by 30 minutes. Several other people are waiting as well. You would most likely:",
    "type": "situational_judgment",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.06157566106669,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      "Start a conversation with the people sitting next to you to pass the time and make a connection.",
      "Smile if someone makes eye contact, but otherwise occupy yourself with your phone or a book.",
      "Put on headphones or focus intently on reading to signal that you prefer not to be disturbed."
    ]
  },
  {
    "id": "555bfb82-5b00-410d-901e-ea71e015ba57",
    "text": "When facing problems, my instinct is to act immediately rather than contemplate.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.950520962241461,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei",
      "enneagram_8"
    ]
  },
  {
    "id": "56ce2c49-487a-4f0c-abc3-c572556f103b",
    "text": "When facing complex issues, I enjoy brainstorming abstract possibilities even if impractical.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.95772034579624,
    "framework_tags": [
      "prism_openness",
      "mbti_sn"
    ]
  },
  {
    "id": "579373b7-9e00-47d9-9328-2956ec08af18",
    "text": "I follow a consistent daily routine to maximize efficiency.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.00323188818426,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "57b02ae0-6f53-4d7e-b4d9-25cba6707050",
    "text": "I prefer to research and understand topics deeply before forming opinions.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.927225632281477,
    "framework_tags": [
      "prism_openness",
      "enneagram_5"
    ]
  },
  {
    "id": "583b9a22-660c-4efe-bdc6-8aff5376a435",
    "text": "When someone needs help, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      {
        "text": "I put others' needs before my own",
        "dimension": "agreeableness"
      },
      {
        "text": "I stay focused on my own priorities",
        "dimension": "conscientiousness"
      },
      {
        "text": "I offer creative solutions to their problems",
        "dimension": "openness"
      }
    ]
  },
  {
    "id": "58686f95-6f47-4aa7-9602-6d5d77b80d33",
    "text": "I maintain composure even when unexpected problems arise.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.926749072753718,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "59e5ddc3-7ba5-4c7c-b9c5-ef3079878017",
    "text": "In the past week, how often have you initiated a conversation with someone you did not know well?",
    "type": "behavioral_frequency",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.908714697690635,
    "framework_tags": [
      "prism_extraversion"
    ]
  },
  {
    "id": "5a41efed-77ae-4c55-8cae-8ea787b689b9",
    "text": "I express my enthusiasm openly and visibly when I hear good news.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.992260576987129,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei",
      "enneagram_7"
    ]
  },
  {
    "id": "5a6bdad1-98c6-423c-994b-58e41a4da720",
    "text": "Small setbacks can significantly impact my mood for hours.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_emotionalResilience",
      "enneagram_4"
    ]
  },
  {
    "id": "5c17cd51-458f-443b-94f1-d136f71761f9",
    "text": "I spend free time researching topics unrelated to my work or daily responsibilities.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.0862808675333,
    "framework_tags": [
      "prism_openness",
      "enneagram_5"
    ]
  },
  {
    "id": "5c95a280-2ffa-4459-aa4c-ef4496a76f04",
    "text": "I listen patiently to others' personal problems even when I have a busy schedule.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.00076145945971,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_2"
    ]
  },
  {
    "id": "5edece02-26db-47b1-b29d-adcf2702bfcb",
    "text": "You applied for a specific opportunity that you really wanted and felt qualified for, but you just received a notification stating you were not selected. You would most likely:",
    "type": "situational_judgment",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.09517990976586,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      "Accept that it wasn't the right fit and immediately turn your attention to the next opportunity.",
      "Feel disappointed for a short time, but remind yourself that other chances will come.",
      "Feel deeply discouraged and question your abilities, losing the motivation to try again soon."
    ]
  },
  {
    "id": "5efaa891-6ff0-4a68-8ec8-cb8844bcd5cb",
    "text": "In the past month, how often have you stepped in to take charge of a situation because you felt the current leadership was ineffective or slow?",
    "type": "behavioral_frequency",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.953038532355157,
    "framework_tags": [
      "prism_extraversion"
    ]
  },
  {
    "id": "5f487031-e9bd-4f7b-952f-d607a218f5e8",
    "text": "I feel at ease when speaking in front of unfamiliar groups.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.09702868290998,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "61ee1d72-b328-43c6-9417-6f9ecaef9bf8",
    "text": "In the past year, how often have you pointed out a financial error (such as being undercharged) that was in your favor?",
    "type": "behavioral_frequency",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1.07816855300604,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "6272db81-0566-445f-b2dd-ab759dda40ac",
    "text": "When I make a verbal commitment, I follow through even if it becomes inconvenient.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.02490558594021,
    "framework_tags": [
      "prism_conscientiousness",
      "enneagram_1"
    ]
  },
  {
    "id": "637b8834-57f0-49ae-9d4f-b07919c14d9d",
    "text": "I volunteer for tasks that require learning entirely new skill sets.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.0544080731523,
    "framework_tags": [
      "prism_openness",
      "enneagram_7"
    ]
  },
  {
    "id": "638f627f-26c5-4bc4-aa79-0906c90d1259",
    "text": "I naturally detach emotionally from problems to analyze them objectively.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 0.998169738812088,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf"
    ]
  },
  {
    "id": "64a4eed5-7883-4fd5-b233-33bc6f7f8dae",
    "text": "You are packing for a week-long vacation that starts tomorrow morning. You would most likely:",
    "type": "situational_judgment",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.03152637832835,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      "Pack everything tonight using a checklist, ensuring every outfit is planned for specific activities.",
      "Pack the main essentials tonight and throw in the final toiletries and clothes in the morning.",
      "Wake up early tomorrow and pack right before you leave so you can choose what you feel like wearing then."
    ]
  },
  {
    "id": "656c18c3-449c-466e-9532-a29c7b907996",
    "text": "In the past month, how often have you agreed to a request you wanted to decline because you were afraid of disappointing someone?",
    "type": "behavioral_frequency",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.01718977268119,
    "framework_tags": [
      "prism_agreeableness"
    ]
  },
  {
    "id": "6653b0cd-c0e4-44c7-a191-91a695f67ccd",
    "text": "It takes me a long time to recover mentally after a significant failure.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 0.981338604694409,
    "framework_tags": [
      "prism_emotionalResilience",
      "enneagram_4"
    ]
  },
  {
    "id": "66ef0a80-a3d4-48c5-8a6d-2b9bbad3b50c",
    "text": "In the past month, how often have you felt overwhelmed by stress?",
    "type": "behavioral_frequency",
    "dimension": "emotionalResilience",
    "reverse_scored": true,
    "weight": 1.5,
    "discrimination": 1,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "6720b89a-f31e-4dca-9154-34584fe92c6c",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.01490736918024,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      {
        "text": "I focus on maintaining harmony in the group",
        "dimension": "agreeableness"
      },
      {
        "text": "I find beauty in artistic expression",
        "dimension": "openness"
      },
      {
        "text": "I express my opinions openly to others",
        "dimension": "extraversion"
      }
    ]
  },
  {
    "id": "6754f764-a6f8-4135-a4bf-07c43cdaa0d5",
    "text": "In the past month, how often have you felt unable to relax because there were outstanding responsibilities or imperfections in your immediate environment?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.912925242949613,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "68f68fd8-de60-4bc7-9a55-6df6fe454d1c",
    "text": "I find exploring new ideas and concepts genuinely exciting.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_openness",
      "mbti_sn"
    ]
  },
  {
    "id": "6a0c79c9-a43e-4c78-8300-d71b21af24c6",
    "text": "In the past month, how often have you voiced complaints when a standard routine was altered?",
    "type": "behavioral_frequency",
    "dimension": "adaptability",
    "reverse_scored": true,
    "weight": 1.5,
    "discrimination": 0.904060313762466,
    "framework_tags": [
      "prism_adaptability"
    ]
  },
  {
    "id": "6b63926b-dbd2-4f09-8c95-aa5bd2e1b468",
    "text": "I follow established rules even when bypassing them would benefit me personally.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.953861656732483,
    "framework_tags": [
      "prism_agreeableness",
      "enneagram_1"
    ]
  },
  {
    "id": "6ddc1408-8e0f-44f1-baa3-1f0e9dae2c29",
    "text": "In the past month, how often have you voluntarily taken on an extra task to help someone else lighten their workload?",
    "type": "behavioral_frequency",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1.07320332444044,
    "framework_tags": [
      "prism_agreeableness"
    ]
  },
  {
    "id": "6eb9e4f0-fa0d-43e5-8035-3949851384f9",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.905950384077487,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      {
        "text": "I recover quickly after experiencing a personal setback",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I initiate conversations easily with new acquaintances",
        "dimension": "extraversion"
      },
      {
        "text": "I show empathy towards those who are struggling",
        "dimension": "agreeableness"
      }
    ]
  },
  {
    "id": "7018a820-3291-4e6f-bc98-d2ec5922f81e",
    "text": "I feel drained after spending several hours in a large group.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.01401321290566,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "7060c2f6-354b-45bf-b3f5-a7ead18665f0",
    "text": "I focus on immediate realities rather than speculating about future implications.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 1.08908088455921,
    "framework_tags": [
      "prism_openness",
      "mbti_sn"
    ]
  },
  {
    "id": "7089f36c-f8ae-451a-a987-3065ee57e176",
    "text": "How often do you admit when you don't know something?",
    "type": "behavioral_frequency",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "70b6d9a6-0ad8-4502-8841-44e3ad779655",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.913910324670159,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      {
        "text": "I ensure my work is accurate",
        "dimension": "conscientiousness"
      },
      {
        "text": "I start conversations with strangers easily",
        "dimension": "extraversion"
      },
      {
        "text": "I adapt quickly to new situations",
        "dimension": "adaptability"
      }
    ]
  },
  {
    "id": "72b395f5-f3e0-40d5-b582-3b5281febeae",
    "text": "I often leave tasks unfinished when I lose interest in them.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.00904185837749,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp"
    ]
  },
  {
    "id": "7350c69f-e65e-46d0-ac31-da1ba9f2eb05",
    "text": "During a team meeting, a colleague points out several errors in a proposal you just presented, suggesting that you did not prepare thoroughly. You would most likely:",
    "type": "situational_judgment",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.933777259100305,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      "Listen to the feedback objectively and note the corrections without taking it personally.",
      "Feel a bit embarrassed, but try to explain your reasoning while accepting the valid points.",
      "Feel hurt by the public criticism and dwell on the comments for the rest of the day."
    ]
  },
  {
    "id": "7422c503-9d08-4a7c-9606-b2a07604e65d",
    "text": "I feel uneasy when my routine is interrupted without warning.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 0.908691607668404,
    "framework_tags": [
      "prism_adaptability",
      "mbti_jp"
    ]
  },
  {
    "id": "7537e131-f87e-4fa3-8346-9f0cde2b068d",
    "text": "In meetings, I wait for others to speak before sharing my own opinions.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 0.985898920338917,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "7734b13d-3240-4cc1-a5ff-4f0428147e2c",
    "text": "I adjust my vocabulary and tone based on who I am speaking with.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.02941816239388,
    "framework_tags": [
      "prism_adaptability",
      "enneagram_9"
    ]
  },
  {
    "id": "77c401cf-d317-4534-9a45-6510d2f2a224",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.985216876009706,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      {
        "text": "I refuse to take credit for others' work",
        "dimension": "honestyHumility"
      },
      {
        "text": "I enjoy expressing myself artistically",
        "dimension": "openness"
      },
      {
        "text": "I trust people until given reason not to",
        "dimension": "agreeableness"
      }
    ]
  },
  {
    "id": "7829bb8d-cc31-4bb9-93c0-4bc7abd83a2e",
    "text": "You have a free afternoon in a new city and are deciding how to spend your time. You see an advertisement for a modern art exhibit described as 'provocative, strange, and open to interpretation.' You would most likely:",
    "type": "situational_judgment",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.966329777877509,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      "Visit the exhibit, eager to analyze the deeper meanings and emotions behind the abstract pieces.",
      "Walk through the exhibit to see if anything is visually appealing, though you may not analyze it deeply.",
      "Skip the exhibit in favor of visiting a historical landmark or a museum with realistic, traditional art."
    ]
  },
  {
    "id": "78505e02-c3b4-4080-b4fd-bb14c46a6163",
    "text": "A colleague calls in sick during a critical project phase. Your manager asks you to take over their responsibilities for the week, which involves tasks you have never done before. You would most likely:",
    "type": "situational_judgment",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.925265700552781,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      "View this as an exciting opportunity to expand your skillset and adjust your schedule to accommodate the new responsibilities.",
      "Agree to help out for the sake of the team, but request clear instructions to ensure you don't make mistakes.",
      "Explain to your manager that you are not trained for those specific tasks and suggest focusing on your own workload to ensure quality."
    ]
  },
  {
    "id": "796bc9ed-0fda-4bd7-a722-1f78c1fd1a5a",
    "text": "In the past month, how often have you verbally expressed optimism when facing a complex problem?",
    "type": "behavioral_frequency",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.904720187383163,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "79893ec0-939a-4d7b-aa48-48faa2ae13ed",
    "text": "You have just finished a demanding week at work. A friend invites you to a crowded, lively social gathering that evening. You would most likely:",
    "type": "situational_judgment",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.959346899660791,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      "Accept the invitation excitedly, feeling that being around people will energize you after the long week.",
      "Agree to go for a short while, but plan to leave early to ensure you get some rest.",
      "Decline the invitation politely, preferring to spend the evening relaxing alone at home."
    ]
  },
  {
    "id": "7b57b3af-89bb-4447-96a6-f6a774376ce9",
    "text": "I actively seek opportunities to learn systems different from what I am used to.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.00114498975015,
    "framework_tags": [
      "prism_adaptability",
      "enneagram_7"
    ]
  },
  {
    "id": "7b9c46bb-edc9-43f5-9bd4-b65d5934a86a",
    "text": "When attending a social gathering, you would most likely:",
    "type": "situational_judgment",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      "Actively seek out conversations with multiple people",
      "Engage in deeper conversations with a few people",
      "Prefer to observe and join conversations when invited"
    ]
  },
  {
    "id": "7b9de131-910a-43be-8d05-b335e189f01d",
    "text": "I actively look for solutions rather than focusing on the emotional impact of problems.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.01925887261358,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "7cbcac5a-881c-45cc-bbd0-918906768425",
    "text": "You need to renew an official document, but the waiting list is months long. A friend works at the agency and offers to quietly move your application to the top of the pile, bypassing the queue. You would most likely:",
    "type": "situational_judgment",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.0898011280816,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      "Decline the offer and wait your turn like everyone else to ensure the process remains fair.",
      "Ask if there is a legitimate expedited process first, but consider the offer if the wait becomes critical.",
      "Accept the offer immediately, reasoning that using your network is a smart way to solve problems efficiently."
    ]
  },
  {
    "id": "7d59cf7a-8379-40e6-8475-86674c2b4e75",
    "text": "I speak up as soon as a thought occurs to me rather than formulating it first.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.03456618394983,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "7dd0ea59-14f7-4768-86de-5f5db147e2be",
    "text": "I suppress my own difficulties so I can be a source of strength for others.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.977425571989304,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_2"
    ]
  },
  {
    "id": "7e089711-6847-4ff6-bf37-6dcce399537c",
    "text": "I dwell on negative feedback for days after receiving it.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.07667414782314,
    "framework_tags": [
      "prism_emotionalResilience",
      "enneagram_4"
    ]
  },
  {
    "id": "7f94cdbb-4ed3-4653-b9f6-57f14f723aca",
    "text": "I value authenticity and being true to myself over social approval.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_honestyHumility",
      "enneagram_1"
    ]
  },
  {
    "id": "7fba0e7e-78cb-4b62-9f5e-a73a2d31d651",
    "text": "I rely heavily on to-do lists and calendars to stay organized.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.03614801700383,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp"
    ]
  },
  {
    "id": "7ff86dac-3e68-4ecf-80a6-bb4d7db3edad",
    "text": "I want my life to feel like an open-ended adventure rather than a predictable path.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.09261329164936,
    "framework_tags": [
      "prism_openness",
      "enneagram_7"
    ]
  },
  {
    "id": "8049a71b-4777-4e8c-9e09-65193eed15bb",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.980666895349139,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      {
        "text": "I constantly look for creative inspiration",
        "dimension": "openness"
      },
      {
        "text": "I work diligently until the job is done",
        "dimension": "conscientiousness"
      },
      {
        "text": "I treat everyone with fairness and sincerity",
        "dimension": "honestyHumility"
      }
    ]
  },
  {
    "id": "836d3c69-2fe9-480c-bcd2-b948690b46e4",
    "text": "I enjoy trying new approaches even when current methods work well.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_adaptability",
      "mbti_jp",
      "enneagram_7"
    ]
  },
  {
    "id": "8478638c-4f67-47cd-9b1b-31b360013ec0",
    "text": "I feel my worth is closely tied to my tangible accomplishments.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.970462760555401,
    "framework_tags": [
      "prism_conscientiousness",
      "enneagram_3"
    ]
  },
  {
    "id": "84923e27-3cac-4e18-9822-9f0e7428d617",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.08719924730121,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      {
        "text": "I adjust quickly to shifting priorities",
        "dimension": "adaptability"
      },
      {
        "text": "I feel energized when meeting new people",
        "dimension": "extraversion"
      },
      {
        "text": "I plan my work with careful detail",
        "dimension": "conscientiousness"
      }
    ]
  },
  {
    "id": "84a6794b-0c0b-498f-9580-dff85d745827",
    "text": "I prefer to blend into the background during large gatherings.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.01818743467152,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "84e76904-9d5c-4941-86c5-e857f4808beb",
    "text": "In the past month, how often have you modified a plan of action within minutes of encountering an unexpected obstacle?",
    "type": "behavioral_frequency",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.985249080886786,
    "framework_tags": [
      "prism_adaptability"
    ]
  },
  {
    "id": "87027e5d-0bac-4234-a37c-23ff39bdf099",
    "text": "During a team meeting, a disagreement arises about how to solve a complex problem, and the discussion stalls. You would most likely:",
    "type": "situational_judgment",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.09743086744232,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      "Speak up energetically to steer the group toward a decision and rally everyone around a specific plan.",
      "Wait for a pause in the conversation to offer a suggestion that bridges the different viewpoints.",
      "Listen carefully to all sides and analyze the details before sending your thoughts in an email later."
    ]
  },
  {
    "id": "8707dcda-7e14-498d-92f2-d1298bbf4f82",
    "text": "I prioritize others' needs above my own in most situations.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_2",
      "enneagram_9"
    ]
  },
  {
    "id": "87398a1d-44bd-4497-a655-5f532d5b644f",
    "text": "I make decisions impulsively without analyzing potential consequences.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 0.988421466862597,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp"
    ]
  },
  {
    "id": "876654b0-b529-48d2-8de6-573db744f264",
    "text": "In the past month, how often have you taken the lead in a group situation?",
    "type": "behavioral_frequency",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.98251784221327,
    "framework_tags": [
      "prism_extraversion"
    ]
  },
  {
    "id": "881ca411-43ea-487f-bef5-1f2596fcd0b8",
    "text": "In the past month, how often have you voluntarily shared credit for a success with others, even when you could have claimed it all for yourself?",
    "type": "behavioral_frequency",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.967528098721031,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "88bf0b0f-5f0c-42f3-b087-39ce172e1c26",
    "text": "Rules and principles should be applied strictly to everyone regardless of circumstances.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 0.90790896169037,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf"
    ]
  },
  {
    "id": "896b24ea-3f34-4b73-881a-4bfa3c571d57",
    "text": "I feel internal tension when I see a task performed below its potential quality.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.986807544049629,
    "framework_tags": [
      "prism_conscientiousness",
      "enneagram_1"
    ]
  },
  {
    "id": "8a1fe63c-8284-4e59-953d-d142065ad59b",
    "text": "I prepare detailed checklists before starting complex activities.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.939077525492994,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp"
    ]
  },
  {
    "id": "8b03d0ab-eb83-4d4a-ac06-0159d8da8698",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.03120294320107,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      {
        "text": "I embrace uncertainty as part of the process",
        "dimension": "adaptability"
      },
      {
        "text": "I persist until I achieve my goals",
        "dimension": "conscientiousness"
      },
      {
        "text": "I recover quickly from setbacks or failures",
        "dimension": "emotionalResilience"
      }
    ]
  },
  {
    "id": "8b863f34-be6b-4e94-b62a-2078ac7ac2e0",
    "text": "I feel most comfortable when my daily activities are planned in advance.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.07806199850165,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp",
      "enneagram_6"
    ]
  },
  {
    "id": "8c64dc82-65c3-49c5-8b5f-a8e88b35f8aa",
    "text": "You are assigned to train a new employee who learns very slowly and makes repeated mistakes on simple tasks. You would most likely:",
    "type": "situational_judgment",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.947361547590383,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      "Patiently explain the tasks as many times as necessary, prioritizing their comfort over speed.",
      "Continue helping them but set a timeline for when they need to start working independently.",
      "Advise them to take better notes and focus on your own work so your productivity doesn't suffer."
    ]
  },
  {
    "id": "8f568ccb-c550-4448-a97f-a3dabf51b219",
    "text": "I easily adjust my plans when circumstances change.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_adaptability",
      "mbti_jp"
    ]
  },
  {
    "id": "8f674c84-2372-4cce-9a53-60669dbe4163",
    "text": "In the past month, how often have you declined a social invitation in order to spend time alone?",
    "type": "behavioral_frequency",
    "dimension": "extraversion",
    "reverse_scored": true,
    "weight": 1.5,
    "discrimination": 0.937913366956678,
    "framework_tags": [
      "prism_extraversion"
    ]
  },
  {
    "id": "8f82d2a7-bff2-4704-952e-97a69b0fb63b",
    "text": "I set specific, measurable goals to track my personal progress.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.971096160830829,
    "framework_tags": [
      "prism_conscientiousness",
      "enneagram_3"
    ]
  },
  {
    "id": "8fa55afe-ed42-44ed-a274-4e622b7465a8",
    "text": "Fast-paced, noisy environments feel stimulating rather than overwhelming to me.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.943513826977279,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei",
      "enneagram_7"
    ]
  },
  {
    "id": "8fee9587-840f-4e29-a9a0-43f698379bd4",
    "text": "The thought of being seen as average or unremarkable causes me distress.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.907227649245115,
    "framework_tags": [
      "prism_conscientiousness",
      "enneagram_3"
    ]
  },
  {
    "id": "90d5c14b-4087-4139-becb-e2dd38f79c6b",
    "text": "I feel anxious when my options are limited or I feel tied down to one path.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.97757846856722,
    "framework_tags": [
      "prism_openness",
      "enneagram_7"
    ]
  },
  {
    "id": "9119c63e-3533-486c-9855-05cce6af015e",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.965049103895872,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      {
        "text": "I remain calm even under pressure",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I start conversations with strangers easily",
        "dimension": "extraversion"
      },
      {
        "text": "I seek out complex problems to solve",
        "dimension": "openness"
      }
    ]
  },
  {
    "id": "91688903-f22e-4084-b797-1881c204640b",
    "text": "How often do you change your mind about decisions you've made?",
    "type": "behavioral_frequency",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_adaptability"
    ]
  },
  {
    "id": "926a8cf8-1772-4891-98e2-851c178b4c05",
    "text": "When starting a new project, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      {
        "text": "I create a detailed plan before beginning",
        "dimension": "conscientiousness"
      },
      {
        "text": "I dive in and figure it out as I go",
        "dimension": "adaptability"
      },
      {
        "text": "I consider creative alternatives first",
        "dimension": "openness"
      }
    ]
  },
  {
    "id": "92c25e01-583d-4b29-9a52-b35362224eef",
    "text": "In the past week, how often have you rearranged your daily schedule to accommodate an unplanned event?",
    "type": "behavioral_frequency",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1.02923722235377,
    "framework_tags": [
      "prism_adaptability"
    ]
  },
  {
    "id": "9352f319-e9ea-485f-9e12-9638931866d2",
    "text": "You have spent several hours working on a complex document, but a technical error occurs before you can save, causing you to lose a significant amount of work. You would most likely:",
    "type": "situational_judgment",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.961449990763664,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      "Take a deep breath, accept the situation, and calmly begin recreating the work.",
      "Feel frustrated and need to step away for a few minutes before you can start over.",
      "Feel extremely upset and find it difficult to regain the focus needed to redo the task."
    ]
  },
  {
    "id": "949e0eca-20cc-43c5-af07-c0f2cf41d2b4",
    "text": "You lent a valuable item to a friend, and they returned it slightly damaged. They have apologized but have not offered to pay for repairs. You would most likely:",
    "type": "situational_judgment",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.953899496428033,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      "Accept the apology and absorb the cost yourself to avoid making the interaction awkward.",
      "Accept the apology but gently ask if they might be able to contribute to the repair costs later.",
      "Express your frustration and insist that they are responsible for fixing what they broke."
    ]
  },
  {
    "id": "953ce5b5-6294-4272-9771-428936e5756a",
    "text": "A neighbor is playing music loudly while you are trying to relax at home. It is annoying, but not violating any laws. You would most likely:",
    "type": "situational_judgment",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.936902149983055,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      "Tolerate the noise without complaint, assuming they are having a good time and will stop eventually.",
      "Wait a while to see if it stops, and if not, politely ask them to turn it down slightly.",
      "Go over immediately and tell them the noise is disturbing you and needs to be lowered."
    ]
  },
  {
    "id": "95bffeaa-6bd0-4a21-9f4c-ece4896ac9ea",
    "text": "In the past week, how often have you stopped what you were doing to listen to someone describe a personal problem?",
    "type": "behavioral_frequency",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.963884752455234,
    "framework_tags": [
      "prism_agreeableness"
    ]
  },
  {
    "id": "95ee653e-f349-496a-b8c1-56a0c1341a54",
    "text": "Your department needs a volunteer to present a project update on stage to a large audience of senior leaders. You would most likely:",
    "type": "situational_judgment",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.908048658745102,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      "Volunteer immediately, viewing the opportunity to speak in front of a crowd as thrilling and rewarding.",
      "Agree to do the presentation if no one else volunteers, though you would feel somewhat nervous.",
      "Offer to prepare the slides and data for the presentation, but ask a colleague to do the speaking."
    ]
  },
  {
    "id": "9827211e-24bd-434b-902a-b5af2e793126",
    "text": "In the past month, how often have you adjusted your personality or communication style to win the approval of a specific audience?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.04899205035644,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "9873642b-412f-4e89-b041-02f8375e580a",
    "text": "You suddenly have a completely free weekend with no obligations. You would most likely:",
    "type": "situational_judgment",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.08419108171228,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      "Reach out to friends to organize a get-together or attend a public event.",
      "Plan a mix of running errands and perhaps seeing one close friend for dinner.",
      "Look forward to staying home alone to read, play video games, or engage in a solitary hobby."
    ]
  },
  {
    "id": "989c53f4-060e-41fa-a1fd-44fd92c36b3e",
    "text": "If you found a wallet containing $200 and identification, you would most likely:",
    "type": "situational_judgment",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      "Return it with all contents intact",
      "Return it but keep some or all of the money",
      "Consider your options based on your current financial needs"
    ]
  },
  {
    "id": "99a77fb2-1933-4145-8a72-1b5b393e0629",
    "text": "In the past year, how often have you voluntarily adopted a new method or tool to replace a familiar one?",
    "type": "behavioral_frequency",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.969837417025312,
    "framework_tags": [
      "prism_adaptability"
    ]
  },
  {
    "id": "9a904dcb-0144-431f-a7ac-7c8b8dfd2802",
    "text": "When a colleague takes credit for your idea in a meeting, you would most likely:",
    "type": "situational_judgment",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      "Confront them privately after the meeting",
      "Politely clarify your contribution during the meeting",
      "Let it go to maintain workplace harmony"
    ]
  },
  {
    "id": "9af6c332-9688-408d-8fb5-cff8805d308a",
    "text": "In the past month, how often have you felt overwhelmed by your emotions?",
    "type": "behavioral_frequency",
    "dimension": "emotionalResilience",
    "reverse_scored": true,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "9b493618-4a0e-4bf6-901a-8b877b85a890",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.03022776937215,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      {
        "text": "I present myself exactly as I am",
        "dimension": "honestyHumility"
      },
      {
        "text": "I keep my workspace neat and organized",
        "dimension": "conscientiousness"
      },
      {
        "text": "I bounce back quickly from disappointments",
        "dimension": "emotionalResilience"
      }
    ]
  },
  {
    "id": "9be5c849-fbf8-48b5-9ab7-e5a566e147cd",
    "text": "In the past month, how often have you pointed out a mistake in someone else's logic or work during a discussion?",
    "type": "behavioral_frequency",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1.5,
    "discrimination": 1.06279829528202,
    "framework_tags": [
      "prism_agreeableness"
    ]
  },
  {
    "id": "9bed1c96-1c2e-434a-a419-a0d3f237ea58",
    "text": "In the past month, how often have you concealed a mistake or struggle to maintain an image of competence?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.08517891926003,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "9c5bac10-300d-4fa6-b4a5-9630c7507ea1",
    "text": "I prefer to use established methods to solve problems rather than experimenting with new techniques.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 0.936461949171695,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "9ca4ab20-5178-4d8c-9387-7cfee07ec25a",
    "text": "When learning a new skill, I prefer clear, step-by-step instructions over figuring out the general concept on my own.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.91125192926112,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "9ca51cdd-4794-4c78-9047-1d7282f20058",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.04222263344752,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      {
        "text": "I handle unexpected changes with ease",
        "dimension": "adaptability"
      },
      {
        "text": "I prioritize the needs and feelings of others",
        "dimension": "agreeableness"
      },
      {
        "text": "I remain calm during high-pressure situations",
        "dimension": "emotionalResilience"
      }
    ]
  },
  {
    "id": "9f0af9f8-361c-4dca-b18f-29bb9ed4de3b",
    "text": "When working on a team project with a deadline next week, you would most likely:",
    "type": "situational_judgment",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      "Create a detailed plan with milestones for the entire team",
      "Focus on completing your part perfectly, regardless of what others do",
      "Adapt your approach based on how the project evolves"
    ]
  },
  {
    "id": "9f2ac7d4-cfbf-4234-8bf8-7f191c2a6bdb",
    "text": "I review my work multiple times to identify and correct errors before submitting.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.9304803069698,
    "framework_tags": [
      "prism_conscientiousness",
      "enneagram_1"
    ]
  },
  {
    "id": "9f44bb7d-e005-4b76-9dde-85744c47c339",
    "text": "When you receive unexpected critical feedback on an important project, you would most likely:",
    "type": "situational_judgment",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      "Feel upset for days and question your abilities",
      "Analyze the feedback objectively and create an improvement plan",
      "Seek validation from others that the criticism was unfair"
    ]
  },
  {
    "id": "a01fc774-4f34-4520-9036-def5f982bd2b",
    "text": "In the past month, how often have you explicitly admitted you were wrong during an argument or disagreement?",
    "type": "behavioral_frequency",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.943161339142815,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "a198f5dc-eab4-47a7-89e2-85cfb659423f",
    "text": "When entering a new environment, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      {
        "text": "I adjust my behavior to fit in quickly",
        "dimension": "adaptability"
      },
      {
        "text": "I stay true to my usual way of doing things",
        "dimension": "conscientiousness"
      },
      {
        "text": "I observe before participating",
        "dimension": "openness"
      }
    ]
  },
  {
    "id": "a269ee0f-6fbd-4e0d-8089-99b9649a1770",
    "text": "When your organization implements a major change to processes you've mastered, you would most likely:",
    "type": "situational_judgment",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      "Embrace the change as an opportunity to learn and grow",
      "Compare the new and old processes to determine which is truly better",
      "Feel frustrated about having to relearn established procedures"
    ]
  },
  {
    "id": "a6324b7b-c090-4b4f-b87d-0893b4981ad4",
    "text": "In disagreements, I focus on proving my point rather than finding middle ground.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.05372087268625,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf"
    ]
  },
  {
    "id": "a6861eb7-7ec1-4e53-acf3-8f516e702298",
    "text": "During a team meeting, a senior manager praises you for a successful project proposal. Although you presented it, a quiet colleague actually came up with the core idea that made the project work. You would most likely:",
    "type": "situational_judgment",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.913707725579679,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      "Immediately mention that the core idea came from your colleague and highlight their contribution to the group.",
      "Accept the praise in the moment to avoid disrupting the flow, but thank your colleague privately afterwards.",
      "Enjoy the recognition, reasoning that your presentation skills were what actually sold the idea to management."
    ]
  },
  {
    "id": "a6a65238-b25b-45dd-a477-a6019535872b",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.06476703530161,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      {
        "text": "I pivot easily when obstacles arise",
        "dimension": "adaptability"
      },
      {
        "text": "I ensure everyone feels included in the group",
        "dimension": "agreeableness"
      },
      {
        "text": "I share credit for successes with the team",
        "dimension": "honestyHumility"
      }
    ]
  },
  {
    "id": "a9948419-d59d-4de2-99e3-af00bca5fccd",
    "text": "In the past month, how often have you exaggerated your actual skills or achievements to impress someone?",
    "type": "behavioral_frequency",
    "dimension": "honestyHumility",
    "reverse_scored": true,
    "weight": 1.5,
    "discrimination": 1.04100374608727,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "ac15707b-75c2-47e0-9d43-cd400507d8a3",
    "text": "I struggle to take action when I do not have a detailed plan in place.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.06290958598455,
    "framework_tags": [
      "prism_adaptability",
      "mbti_jp"
    ]
  },
  {
    "id": "ac6a200d-6a47-4e99-abbe-d96ae3f3f59f",
    "text": "You are attending a professional training workshop where you do not know anyone. During the lunch break, you enter the cafeteria. You would most likely:",
    "type": "situational_judgment",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.984994118879692,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      "Immediately approach a large group of people, introduce yourself, and join their conversation.",
      "Look for one or two people who seem approachable and ask if you can sit near them.",
      "Find a quiet table in the corner to eat your meal peacefully and recharge for the afternoon."
    ]
  },
  {
    "id": "ade7034b-b39c-463e-b8f7-577d9328d856",
    "text": "When group projects succeed, I emphasize team contributions rather than my own role.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.989437740368574,
    "framework_tags": [
      "prism_honestyHumility",
      "enneagram_2"
    ]
  },
  {
    "id": "ae42d74c-ff67-451d-aefa-01eba1fa6457",
    "text": "How often do you initiate social activities or events?",
    "type": "behavioral_frequency",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_extraversion"
    ]
  },
  {
    "id": "af697ee4-f2fa-402a-a8d3-69bf1a2bd673",
    "text": "When tension arises in relationships, I smooth things over rather than confront issues.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.925684315937213,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_9"
    ]
  },
  {
    "id": "afaa21d9-94f7-44ef-b60a-7c620a0156d0",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.989962164651806,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      {
        "text": "I seek out complex intellectual challenges",
        "dimension": "openness"
      },
      {
        "text": "I prioritize the needs of others",
        "dimension": "agreeableness"
      },
      {
        "text": "I remain calm under intense pressure",
        "dimension": "emotionalResilience"
      }
    ]
  },
  {
    "id": "b22a2131-28dd-40c2-9aef-314c277e0458",
    "text": "I am quick to point out when I think someone is wrong.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf"
    ]
  },
  {
    "id": "b22e4910-3738-4dad-831b-f039e879750f",
    "text": "I would never accept credit for someone else's work.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_honestyHumility",
      "enneagram_1"
    ]
  },
  {
    "id": "b3d14daa-a680-4e65-9eac-6141d62fc565",
    "text": "When planning a trip to a new city, you would most likely:",
    "type": "situational_judgment",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.06730068448847,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      "Research specific landmarks, create a schedule, and map out routes in advance.",
      "Have a general list of places to go but leave the timing open to change.",
      "Read about the general culture and decide what to do based on inspiration upon arrival."
    ]
  },
  {
    "id": "b3e54311-bb8a-40e8-9833-3a435c9053aa",
    "text": "How often do you make lists to organize your tasks?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "b3edec16-a799-44ce-a26a-92028e1bdb72",
    "text": "I tend to cope with difficult emotions by automatically shifting my focus toward positive future possibilities.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.961899487069341,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "b525464b-f281-4925-a308-624882c5f9bf",
    "text": "In the past week, how often have you attended a social gathering involving more than two other people?",
    "type": "behavioral_frequency",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1.07088871726211,
    "framework_tags": [
      "prism_extraversion"
    ]
  },
  {
    "id": "b5b451b6-22ba-416c-8ee3-cfcaa9065e22",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.01319759890818,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      {
        "text": "I appreciate beauty in art and nature",
        "dimension": "openness"
      },
      {
        "text": "I feel energized when meeting new people",
        "dimension": "extraversion"
      },
      {
        "text": "I cooperate readily with my team members",
        "dimension": "agreeableness"
      }
    ]
  },
  {
    "id": "b625d547-8fe6-43c6-8b83-3743e665f766",
    "text": "In the past month, how often have you continued working on a task immediately after receiving critical feedback?",
    "type": "behavioral_frequency",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.984488951432951,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "b6429ca8-3ac2-4782-a97b-09eb0b4d3d3d",
    "text": "In the past month, how often have you physically or mentally withdrawn from a social situation specifically to process information or recharge in private?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.08673688198424,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "b6a2a54d-55f7-453a-92b9-217a67cb0ab1",
    "text": "I feel comfortable speaking up in group settings.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.957334787737572,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "b6b98358-0c50-4d5c-8412-5aee5b76efd5",
    "text": "You need to purchase a generic but expensive appliance for your home that you will use every day. You would most likely:",
    "type": "situational_judgment",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.06465951654312,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      "Spend several days comparing technical specifications, warranties, and user reviews before choosing.",
      "Ask a few friends for recommendations and buy the most popular option to save time.",
      "Go to the store and purchase the one that looks the best or is on sale at that moment."
    ]
  },
  {
    "id": "b6d198d9-f75c-4420-9644-c2ecb1f05392",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.963333427350803,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      {
        "text": "I seek out complex theories and abstract ideas",
        "dimension": "openness"
      },
      {
        "text": "I prioritize the needs and feelings of others",
        "dimension": "agreeableness"
      },
      {
        "text": "I feel energized when interacting with large groups",
        "dimension": "extraversion"
      }
    ]
  },
  {
    "id": "b7396fc0-fe41-4ca2-839b-bdadd2b6f066",
    "text": "In the past month, how often have you agreed to a suggestion you disliked specifically to avoid a disagreement?",
    "type": "behavioral_frequency",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.96671477674142,
    "framework_tags": [
      "prism_agreeableness"
    ]
  },
  {
    "id": "b8e1cb2d-1319-4686-94f8-6618c37c0f8c",
    "text": "I feel most secure in relationships when actively contributing to others' wellbeing.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.939118363458183,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_2"
    ]
  },
  {
    "id": "b9ee2dcf-fae7-4ce7-aaba-30c1e4088a47",
    "text": "I resist the urge to make impulsive decisions when under pressure.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.916028016490438,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "bb0a0987-b0bc-4e98-b316-8cf7e9fb8089",
    "text": "When someone disagrees with your opinion, you would most likely:",
    "type": "situational_judgment",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      "Try to find common ground and understand their perspective",
      "Stand firm on your position while respecting theirs",
      "Avoid the conflict and change the subject"
    ]
  },
  {
    "id": "bba02944-8204-4752-aafe-0ce4de8c3895",
    "text": "You are assigned a complex project due in two weeks. You would most likely:",
    "type": "situational_judgment",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.06529231129919,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      "Immediately break the project into daily sub-tasks and stick to a strict timeline.",
      "Sketch out a general direction but adjust the workflow day-by-day.",
      "Gather information first and wait for inspiration to strike before committing to a specific path."
    ]
  },
  {
    "id": "bc27aa80-e34c-4008-b1f5-67ad738ba953",
    "text": "I feel significantly more secure when I can observe a situation from the periphery before fully engaging with it.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.941803132812005,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "bc8a3955-e653-48ca-914d-322c2bb15283",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.920872912601582,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      {
        "text": "I keep my promises to others",
        "dimension": "conscientiousness"
      },
      {
        "text": "I cooperate willingly with my team",
        "dimension": "agreeableness"
      },
      {
        "text": "I modify my approach when necessary",
        "dimension": "adaptability"
      }
    ]
  },
  {
    "id": "bc8bcf41-6467-4188-8f57-7c2e37bc2c70",
    "text": "You have planned your entire week around completing a high-priority assignment. On Tuesday morning, an urgent request comes in that requires you to drop everything and focus on it for the next two days. You would most likely:",
    "type": "situational_judgment",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.01451064537529,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      "Immediately pause your current work, reorganize your calendar, and fully focus your energy on solving the urgent issue.",
      "Accept the new request, but feel anxious about how this interruption will impact your original schedule.",
      "Ask if the urgent request can wait until you have reached a stopping point with your current assignment."
    ]
  },
  {
    "id": "bda495c8-d64e-4ac1-a3cd-3f4008f62e7d",
    "text": "I reprioritize my daily tasks immediately when I receive new critical information.",
    "type": "likert",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.956036536912235,
    "framework_tags": [
      "prism_adaptability",
      "mbti_jp"
    ]
  },
  {
    "id": "bdd71cfe-65a4-462e-9b14-b6b547ec595a",
    "text": "I prioritize being efficient and effective over dwelling on emotional experiences.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.973269944469064,
    "framework_tags": [
      "prism_conscientiousness",
      "enneagram_3"
    ]
  },
  {
    "id": "bf43f384-ace5-4826-9179-54d095c4fadb",
    "text": "I find unexpected changes to my schedule more stressful than exciting.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.971131015255811,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp"
    ]
  },
  {
    "id": "c10f083c-c906-48fe-a3ec-24d555f755ed",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.970771506346407,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      {
        "text": "I value fairness over personal gain",
        "dimension": "honestyHumility"
      },
      {
        "text": "I adjust quickly to unexpected changes",
        "dimension": "adaptability"
      },
      {
        "text": "I take charge in social situations",
        "dimension": "extraversion"
      }
    ]
  },
  {
    "id": "c1c4eb55-85af-483a-a729-bdaa28d52f34",
    "text": "How often do you acknowledge your mistakes to others?",
    "type": "behavioral_frequency",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "c373ec6d-2a2f-46bd-8910-1fd6a13e747f",
    "text": "Your team has been assigned a complex new project with a tight deadline. To get started, you would most likely:",
    "type": "situational_judgment",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.990688723180638,
    "framework_tags": [
      "prism_extraversion"
    ],
    "options": [
      "Call an immediate brainstorming session to bounce ideas off colleagues.",
      "Draft a few quick bullet points and then ask a neighbor for their opinion.",
      "Retreat to a quiet space to think through the structure alone before talking to anyone."
    ]
  },
  {
    "id": "c3f1d989-b2a4-4dc4-b2d0-bdee77458eb5",
    "text": "I volunteer to take charge when a group lacks clear direction.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.02597665280059,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei",
      "enneagram_8",
      "enneagram_3"
    ]
  },
  {
    "id": "c457ae0f-fad2-4c99-974f-eeea9400faf5",
    "text": "In the past month, how often have you engaged in comforting routines or distractions (like scrolling, snacking, or sleeping) specifically to tune out feelings of anxiety or anger?",
    "type": "behavioral_frequency",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.968321308136962,
    "framework_tags": [
      "prism_agreeableness"
    ]
  },
  {
    "id": "c52e1b7c-b2a8-4a2e-821d-b66772c2d249",
    "text": "In the past month, how frequently have you felt that your personal experiences were too unique or nuanced to be truly understood by those around you?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.03284549496301,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "c589c7cb-ec79-4f6a-b4ad-bd69fd63a288",
    "text": "I prefer to settle decisions quickly rather than keeping options open.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.05691887148134,
    "framework_tags": [
      "prism_conscientiousness",
      "mbti_jp"
    ]
  },
  {
    "id": "c6b96b1c-9c28-4820-8458-d7f0722c301d",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.04145350532251,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      {
        "text": "I work collaboratively to achieve shared team goals",
        "dimension": "agreeableness"
      },
      {
        "text": "I persist in my work despite facing obstacles",
        "dimension": "conscientiousness"
      },
      {
        "text": "I enjoy experimenting with new ways of doing things",
        "dimension": "openness"
      }
    ]
  },
  {
    "id": "c7977936-c73a-4f77-ba00-55744fcb9891",
    "text": "You are selecting a book to read during your commute. The reviews for a popular new novel describe it as having a complex, non-linear plot with an ambiguous ending that leaves many questions unanswered. You would most likely:",
    "type": "situational_judgment",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.08738956863371,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      "Choose the book, looking forward to the mental challenge of piecing together the story and interpreting the ending.",
      "Read the book, provided the story is engaging, even if the ending is slightly confusing.",
      "Select a different book with a clear narrative and a resolved ending so you can relax while reading."
    ]
  },
  {
    "id": "c8e1ec68-188c-41dd-93cb-6c1f1a63563c",
    "text": "I feel more comfortable improving existing methods to ensure efficiency than reinventing the process entirely.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.987536045421418,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "c966ebe2-42a3-429d-937d-4b11a70e74b5",
    "text": "In the past month, how often have you tried a specific food, activity, or route that you had never experienced before?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1.07292190188718,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "c9bb7522-0f1f-4ce2-a79e-cabc1ec8eef7",
    "text": "I bring issues out into the open immediately even if it causes friction.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei",
      "enneagram_8"
    ]
  },
  {
    "id": "cc26dfc8-efa1-4a26-96bf-912ce300c3c3",
    "text": "It is sometimes necessary to bend rules to get ahead in life.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "cc7c0701-35b0-4f35-b4dd-3015d0090115",
    "text": "In the past month, how often have you delayed taking action on a project because you felt you needed to research the topic more thoroughly first?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.973659010246566,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "ccbd5195-a10d-437a-ba81-8193c31a73cb",
    "text": "When meeting new people, I assume their intentions are good until proven otherwise.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.07766236968396,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_9"
    ]
  },
  {
    "id": "cd768c2e-83fb-43ef-a6c0-ab4f9182b862",
    "text": "I prepare a detailed checklist or itinerary before starting a complex activity.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.982411288491773,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "ce6039bf-247c-4471-9eed-e3c3605b10cb",
    "text": "I sometimes feel unsure what I want because I focus so much on others' preferences.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.04347349111982,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_9"
    ]
  },
  {
    "id": "cf26d14a-2f3a-40a9-9867-88c88db0369a",
    "text": "I try to change the subject when conversations focus solely on my achievements.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.01747084346916,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "cf27901a-cd85-4757-a093-821971cb48db",
    "text": "I set aside my own tasks to help colleagues who are struggling with their workload.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.938239740956555,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf",
      "enneagram_2"
    ]
  },
  {
    "id": "cfb400a6-e494-4d80-b17d-1bc517effabf",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.91669756508038,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      {
        "text": "I finish the tasks I start",
        "dimension": "conscientiousness"
      },
      {
        "text": "I consider other people's feelings",
        "dimension": "agreeableness"
      },
      {
        "text": "I stay composed under pressure",
        "dimension": "emotionalResilience"
      }
    ]
  },
  {
    "id": "cfca6ab2-c6ae-48e9-838d-3e05a4a79aac",
    "text": "I am satisfied with a standard of living that covers my needs without luxury symbols.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.987872883632288,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "d0241aca-9660-4e5b-9fb5-2308710e5480",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.933468552645908,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      {
        "text": "I enjoy experimenting with unconventional methods",
        "dimension": "openness"
      },
      {
        "text": "I take the lead in social situations",
        "dimension": "extraversion"
      },
      {
        "text": "I adjust easily to changing plans",
        "dimension": "adaptability"
      }
    ]
  },
  {
    "id": "d107e735-d3dc-42d0-86ab-7f608e5c6127",
    "text": "During a meeting, your manager praises you specifically for the success of a project that was actually a collaborative team effort. You would most likely:",
    "type": "situational_judgment",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.956343465948298,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      "Immediately interrupt to redirect the praise to your team members, downplaying your own role.",
      "Thank the manager and make sure to mention the team's hard work in your response.",
      "Accept the compliment graciously, assuming the manager understands it was a group effort."
    ]
  },
  {
    "id": "d1803f5b-af76-47d8-b04e-2586827e3c22",
    "text": "When considering your interests, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      {
        "text": "I'm drawn to philosophical questions",
        "dimension": "openness"
      },
      {
        "text": "I prefer hands-on practical activities",
        "dimension": "conscientiousness"
      },
      {
        "text": "I enjoy activities I can share with friends",
        "dimension": "extraversion"
      }
    ]
  },
  {
    "id": "d19bd882-f1f7-48ac-a4f1-c6d3b97f7318",
    "text": "In debates, arriving at factual truth matters more than ensuring everyone feels heard.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 1.07145093108422,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf"
    ]
  },
  {
    "id": "d2031ee2-50e4-44c3-ab3b-e1b5e639eb8e",
    "text": "I feel energized after spending time with a large group of people.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.02365296289144,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "d5e75213-a2ce-403b-b1c7-8ffe2a49ea1b",
    "text": "I prefer familiar routines over new experiences.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "d61ed9fa-5e3d-4036-86ae-c3bea61f03c4",
    "text": "I remain patient when dealing with difficult or irrational people.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.09637821231687,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "d81b83a9-4f96-459e-960d-f9948af20360",
    "text": "You are buying several items at a store. After leaving the counter, you check your receipt and notice the cashier accidentally forgot to scan one of the more expensive items, meaning you were not charged for it. You would most likely:",
    "type": "situational_judgment",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.989867240088313,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      "Return to the counter immediately to point out the mistake and pay for the item.",
      "Keep the item this time, reasoning that big stores account for errors and you usually pay full price.",
      "Consider it a lucky break and keep the item, as it was the cashier???s responsibility to scan it correctly."
    ]
  },
  {
    "id": "d8db3371-43fd-4791-9367-28fc801f9f5a",
    "text": "My mood remains consistent throughout the day regardless of minor annoyances.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.05050008779396,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "d9bdff98-fe37-441c-a8d4-76880b65c672",
    "text": "When planning a vacation, you would most likely:",
    "type": "situational_judgment",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      "Choose a destination you've never visited before",
      "Return to a place you've enjoyed in the past",
      "Research extensively but stick to popular tourist destinations"
    ]
  },
  {
    "id": "db2c1886-c7bb-4b8b-9709-a232d7953e6d",
    "text": "You have almost finished a complex report following specific guidelines. A supervisor reviews it and suggests a completely different approach that would require rewriting most of the document. You would most likely:",
    "type": "situational_judgment",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.9841328565269,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      "Discard the previous draft without hesitation and start over using the new approach to create a better final product.",
      "Feel initially discouraged about the wasted time, but proceed with the rewrite to meet the supervisor???s expectations.",
      "Try to convince the supervisor that the current version is sufficient to avoid having to redo the work."
    ]
  },
  {
    "id": "dbf57eb7-2f4a-4091-b6d3-afb544ff36e4",
    "text": "In the past month, how often have you filled your schedule with activities specifically to avoid sitting with unpleasant feelings or boredom?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.968594145182832,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "dcc45ce3-efe9-48c3-877a-246509838fae",
    "text": "In groups, I am usually the one who initiates conversations and introduces people.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.940223106986157,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei",
      "enneagram_2"
    ]
  },
  {
    "id": "dd485148-1ee0-4adc-af0c-b507b97632d1",
    "text": "You are assigned to lead a new project with vague requirements. You would most likely:",
    "type": "situational_judgment",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.938230387274454,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      "Start by listing the known constraints, available resources, and immediate steps needed.",
      "Look for a balance between the project goals and the practical limitations before starting.",
      "Start by brainstorming the overarching vision and potential impact before worrying about logistics."
    ]
  },
  {
    "id": "dd8accba-aa84-4b08-9601-c425d68d6ad0",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 0.960160279112539,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      {
        "text": "I am fascinated by abstract concepts",
        "dimension": "openness"
      },
      {
        "text": "I keep my surroundings neat and organized",
        "dimension": "conscientiousness"
      },
      {
        "text": "I admit my mistakes openly and quickly",
        "dimension": "honestyHumility"
      }
    ]
  },
  {
    "id": "ddd5c049-8680-4f08-8ed5-72fa08f7fd29",
    "text": "In the past month, how often have you found yourself withdrawing from social situations to process complex feelings or moods?",
    "type": "behavioral_frequency",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.05429724740248,
    "framework_tags": [
      "prism_openness"
    ]
  },
  {
    "id": "e1592807-9dc0-4748-b05a-eb1fcce3bcc8",
    "text": "If a store clerk undercharges me by mistake, I correct them immediately.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.04399325391161,
    "framework_tags": [
      "prism_honestyHumility",
      "enneagram_1"
    ]
  },
  {
    "id": "e2e2ed5f-3c5e-4984-81fb-42b54189623e",
    "text": "I need significant quiet time alone to recharge after social activities.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_extraversion",
      "mbti_ei"
    ]
  },
  {
    "id": "e470efb2-12d4-4512-babf-b65bbd5c5f73",
    "text": "When given a task, which statement is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      {
        "text": "I complete it thoroughly and on time",
        "dimension": "conscientiousness"
      },
      {
        "text": "I explore creative ways to approach it",
        "dimension": "openness"
      },
      {
        "text": "I check with others to ensure alignment",
        "dimension": "agreeableness"
      }
    ]
  },
  {
    "id": "e5b033a7-91c4-4fae-9da5-c7dfc7b5f649",
    "text": "In the past month, how often have you intervened to protect someone you felt was being treated unfairly or taken advantage of?",
    "type": "behavioral_frequency",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.917371358779924,
    "framework_tags": [
      "prism_extraversion"
    ]
  },
  {
    "id": "e67c9007-506a-4c2c-90f5-8bf32aca7728",
    "text": "I feel most comfortable when my daily activities are planned out in advance.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 1.08267612836844,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "e83843bb-b3f8-406a-9ada-675594141963",
    "text": "I test people's loyalty before feeling safe enough to trust them fully.",
    "type": "likert",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.1,
    "discrimination": 0.962843724354561,
    "framework_tags": [
      "prism_extraversion",
      "enneagram_6",
      "enneagram_8"
    ]
  },
  {
    "id": "e93d29ca-2e20-4162-b149-aa3e002a546d",
    "text": "When faced with a new technology at work, you typically:",
    "type": "situational_judgment",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1,
    "framework_tags": [
      "prism_openness"
    ],
    "options": [
      "Eagerly explore all its features right away",
      "Learn only the essential functions needed for your tasks",
      "Wait until others have tested it before trying it yourself"
    ]
  },
  {
    "id": "e98ae941-eec3-4d94-8dd8-f7bbd5e381bb",
    "text": "I look for hidden motives when someone unexpectedly offers me a favor.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.08886915136514,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf"
    ]
  },
  {
    "id": "ea150f65-5776-45c7-a6d7-2630dfa5060b",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.00309772942747,
    "framework_tags": [
      "prism_honestyHumility"
    ],
    "options": [
      {
        "text": "I admit my mistakes without hesitation",
        "dimension": "honestyHumility"
      },
      {
        "text": "I prioritize others' needs before my own",
        "dimension": "agreeableness"
      },
      {
        "text": "I set ambitious goals for myself",
        "dimension": "conscientiousness"
      }
    ]
  },
  {
    "id": "eb2072a7-3de5-4a52-b673-eca304ae43e3",
    "text": "I believe most people have good intentions.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_agreeableness",
      "enneagram_9"
    ]
  },
  {
    "id": "eb6e2764-6463-459b-8571-e16f4595917b",
    "text": "In the past week, how many times have you initiated a conversation with someone you don't know well?",
    "type": "behavioral_frequency",
    "dimension": "extraversion",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1,
    "framework_tags": [
      "prism_extraversion"
    ]
  },
  {
    "id": "eb83b68b-355b-427e-8113-0176ae162a98",
    "text": "I express my true opinions to superiors even when I know they disagree.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.08621192396107,
    "framework_tags": [
      "prism_honestyHumility",
      "enneagram_1"
    ]
  },
  {
    "id": "ed01aecb-7000-45a4-ae7c-933e5879086f",
    "text": "If I noticed a contract flaw that favored me unfairly, I would keep quiet about it.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.06010141711394,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "ed95f2a8-2f2d-46f2-b4ed-c717c0c26bb5",
    "text": "When giving feedback, I prioritize honest critique over softening the message.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1.1,
    "discrimination": 1.06489188854101,
    "framework_tags": [
      "prism_agreeableness",
      "mbti_tf"
    ]
  },
  {
    "id": "f06876c8-1366-4333-89ce-be21b05d63df",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.0944392103628,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      {
        "text": "I remain calm even when under pressure",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I feel energized when interacting with others",
        "dimension": "extraversion"
      },
      {
        "text": "I plan my schedule well in advance",
        "dimension": "conscientiousness"
      }
    ]
  },
  {
    "id": "f1716378-add3-4bf4-866b-43ab087e8111",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.02937620152661,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      {
        "text": "I strive for excellence in my work",
        "dimension": "conscientiousness"
      },
      {
        "text": "I handle stress without worrying",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I generate original ideas frequently",
        "dimension": "openness"
      }
    ]
  },
  {
    "id": "f1d4503c-2d3b-42a1-a98c-44596c8abc76",
    "text": "I set specific, measurable goals for myself to track my personal progress.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.0018250783313,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "f25adf00-8fd8-49be-8d69-758bffa331a8",
    "text": "You are leading a long-term team project that involves managing hundreds of digital files and documents. You would most likely:",
    "type": "situational_judgment",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.955222346938916,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      "Create a detailed folder structure with strict naming conventions before adding any files.",
      "Create general category folders now and organize the specific files later when you have time.",
      "Save all files in one central location and rely on the search function to find what is needed."
    ]
  },
  {
    "id": "f2daecf9-7736-47dc-baf2-1c46d721218a",
    "text": "I remain calm under pressure.",
    "type": "likert",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "f3260229-2a5d-4921-bb39-308af868b1b1",
    "text": "The thought of being seen as average or unremarkable causes me significant distress.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.98601681478877,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "f54bd6f2-f409-43e4-a8f5-8dfde61801f3",
    "text": "You are meeting a friend for dinner at a restaurant in a part of the city you have not visited before. You would most likely:",
    "type": "situational_judgment",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.925058414829648,
    "framework_tags": [
      "prism_conscientiousness"
    ],
    "options": [
      "Check the route and traffic conditions in advance to ensure you arrive at the venue 10 minutes early.",
      "Leave at a time that should get you there right on time, assuming there are no major traffic delays.",
      "Leave when you are ready and text your friend that you are on your way, even if you might be slightly late."
    ]
  },
  {
    "id": "f5b242b5-bfe8-47af-bfb0-cf9799730d89",
    "text": "I find abstract concepts and theoretical discussions genuinely engaging.",
    "type": "likert",
    "dimension": "openness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1,
    "framework_tags": [
      "prism_openness",
      "mbti_sn"
    ]
  },
  {
    "id": "f68b4d59-919b-4237-acc2-50f9563854db",
    "text": "How often do you volunteer to help others with their tasks when you notice they're struggling?",
    "type": "behavioral_frequency",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 1,
    "framework_tags": [
      "prism_agreeableness"
    ]
  },
  {
    "id": "f6a5c678-154d-47f6-8783-fe1ad31b9035",
    "text": "You are organizing a group dinner at an outdoor venue. An hour before the event, it begins to rain heavily, making the original location unusable. You would most likely:",
    "type": "situational_judgment",
    "dimension": "adaptability",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 0.939436924299886,
    "framework_tags": [
      "prism_adaptability"
    ],
    "options": [
      "Quickly find a nearby indoor alternative and message the group with a cheerful update, viewing it as a chance to try something different.",
      "Search for a backup location that is similar to the original, feeling stressed that the evening won't go exactly as planned.",
      "Consider postponing the dinner to a different date so that it can take place at the original venue as intended."
    ]
  },
  {
    "id": "f84b5594-e0bc-436f-b9e4-d165b6f30382",
    "text": "I review my work multiple times to identify and correct errors before submitting it.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.07396252290738,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "f8620213-b7d6-4eff-859e-1c002da4be8f",
    "text": "I find myself naturally scanning my environment or relationships for inconsistencies that might indicate a lack of trustworthiness.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.923689177334327,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "f9544e64-4893-41bc-8a00-dbe6c11f5076",
    "text": "In the past month, how often have you slept your usual number of hours the night before a significant deadline or event?",
    "type": "behavioral_frequency",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.5,
    "discrimination": 0.923189547887564,
    "framework_tags": [
      "prism_emotionalResilience"
    ]
  },
  {
    "id": "f9b5883a-f41b-43b2-8a0a-15de8a5b45e1",
    "text": "In the past month, how often have you submitted a project or assignment after the agreed-upon deadline?",
    "type": "behavioral_frequency",
    "dimension": "conscientiousness",
    "reverse_scored": true,
    "weight": 1.5,
    "discrimination": 1.0616008127514,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "f9ef7418-dc8f-4152-beb8-7bda24b459d2",
    "text": "You are attending a social gathering where you do not know many people. While telling a story to a group, you mix up your words and say something that makes no sense. You would most likely:",
    "type": "situational_judgment",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.05686029064048,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      "Laugh at the mistake along with the group and continue the story without hesitation.",
      "Feel awkward for a moment and quickly correct yourself to move past the error.",
      "Feel your face flush and stay quiet for a while, worrying that you looked foolish."
    ]
  },
  {
    "id": "fa3c1c37-9a74-40d6-9ce4-a41269e91c41",
    "text": "You are going through a period of high uncertainty regarding your future living arrangements or job stability. You would most likely:",
    "type": "situational_judgment",
    "dimension": "emotionalResilience",
    "reverse_scored": false,
    "weight": 1.3,
    "discrimination": 1.02700081585981,
    "framework_tags": [
      "prism_emotionalResilience"
    ],
    "options": [
      "Maintain your daily routine and focus on the things you can control right now.",
      "Find yourself worrying often, but manage to keep functioning in your daily life.",
      "Feel constantly anxious and have trouble sleeping or relaxing until the issue is resolved."
    ]
  },
  {
    "id": "fa8c9c08-7c0a-4c71-99a4-fa0c8e9827c6",
    "text": "Which is MOST like you and which is LEAST like you?",
    "type": "forced_choice",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1.2,
    "discrimination": 1.07775545828947,
    "framework_tags": [
      "prism_agreeableness"
    ],
    "options": [
      {
        "text": "I make an effort to ensure others feel welcome",
        "dimension": "agreeableness"
      },
      {
        "text": "I remain calm and composed under heavy pressure",
        "dimension": "emotionalResilience"
      },
      {
        "text": "I plan my daily tasks with great attention to detail",
        "dimension": "conscientiousness"
      }
    ]
  },
  {
    "id": "fc93feed-c2ed-40f0-8b23-beebedf27d2a",
    "text": "I maintain relationships primarily because certain people are useful to my advancement.",
    "type": "likert",
    "dimension": "honestyHumility",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.01964237007577,
    "framework_tags": [
      "prism_honestyHumility"
    ]
  },
  {
    "id": "fe1b9855-034f-47b7-87fc-4e041cfbe295",
    "text": "In the past month, how often have you said \"I don't mind\" or \"whatever you want\" when you actually had a specific preference?",
    "type": "behavioral_frequency",
    "dimension": "agreeableness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 0.962595599439838,
    "framework_tags": [
      "prism_agreeableness"
    ]
  },
  {
    "id": "fe75445b-7e19-4940-8a20-e47a84bc225b",
    "text": "I prioritize being efficient and effective over dwelling on emotional experiences.",
    "type": "likert",
    "dimension": "conscientiousness",
    "reverse_scored": false,
    "weight": 1,
    "discrimination": 1.02869148439953,
    "framework_tags": [
      "prism_conscientiousness"
    ]
  },
  {
    "id": "ff64efd2-3d5b-4371-9a41-d2a35eb31289",
    "text": "I ensure my individual achievements are recognized even if it shifts focus from the team.",
    "type": "likert",
    "dimension": "agreeableness",
    "reverse_scored": true,
    "weight": 1,
    "discrimination": 1.09057294472548,
    "framework_tags": [
      "prism_agreeableness",
      "enneagram_3"
    ]
  }
];
