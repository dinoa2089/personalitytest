import type { DimensionScore } from "@/types";

export interface Archetype {
  id: string;
  name: string;
  tagline: string;
  description: string[];
  strengths: string[];
  growthAreas: string[];
  careerMatches: Array<{ title: string; explanation: string }>;
  workStyle: string;
  relationshipStyle: string;
  famousExamples: Array<{ name: string; role: string }>;
  communicationStyle: string;
  atYourBest: string;
  whenStressed: string;
  pattern: {
    high: string[]; // Dimensions that should be high (percentile > 65)
    low: string[]; // Dimensions that should be low (percentile < 40)
  };
  color: string; // Gradient color for visual representation
  rarity: number; // Percentage of population with this type (adds up to 100)
  icon: string; // Emoji icon for the type
}

export const archetypes: Archetype[] = [
  {
    id: "innovator",
    name: "The Innovator",
    tagline: "Creative visionary who thrives on possibility",
    description: [
      "You are a natural innovator, driven by curiosity and a passion for exploring new ideas. Your high Openness and Adaptability make you comfortable with ambiguity and change, seeing opportunities where others see obstacles.",
      "You're energized by creative challenges and novel solutions. While you may struggle with routine tasks, your ability to think outside the box and adapt quickly makes you invaluable in dynamic environments.",
      "You're the person who asks 'What if?' and isn't afraid to challenge the status quo. Your innovative spirit drives you to constantly seek better ways of doing things."
    ],
    strengths: [
      "Exceptional creativity and original thinking",
      "Comfortable with ambiguity and uncertainty",
      "Quick to adapt to new situations",
      "Natural problem-solver with fresh perspectives",
      "Enthusiastic about learning and growth",
      "Able to see connections others miss",
      "Willing to take calculated risks"
    ],
    growthAreas: [
      "Developing follow-through on projects",
      "Creating structure for your ideas",
      "Balancing innovation with practical execution",
      "Managing details and routine tasks",
      "Staying focused on one project at a time"
    ],
    careerMatches: [
      { title: "Product Designer", explanation: "Your creativity and user-focused thinking make you excellent at designing innovative solutions" },
      { title: "Research Scientist", explanation: "Your curiosity and comfort with uncertainty drive breakthrough discoveries" },
      { title: "Entrepreneur", explanation: "Your adaptability and innovative thinking help you navigate the unpredictable startup world" },
      { title: "Creative Director", explanation: "You excel at envisioning new creative directions and inspiring teams" },
      { title: "Innovation Consultant", explanation: "Your ability to see possibilities makes you valuable for organizational transformation" },
      { title: "UX Researcher", explanation: "Your curiosity about human behavior drives insights into user needs" },
      { title: "Content Creator", explanation: "Your creativity and adaptability help you produce engaging, original content" },
      { title: "Strategic Planner", explanation: "You're skilled at envisioning future scenarios and planning for change" }
    ],
    workStyle: "You thrive in flexible, creative environments where you can explore ideas freely. You prefer projects that allow for experimentation and innovation over routine tasks. You work best when given autonomy and the freedom to approach problems creatively.",
    relationshipStyle: "You bring excitement and novelty to relationships, always introducing new experiences and perspectives. You value partners who appreciate your creativity and give you space to explore. You may struggle with partners who need high levels of routine and predictability.",
    famousExamples: [
      { name: "Steve Jobs", role: "Co-founder of Apple" },
      { name: "Leonardo da Vinci", role: "Renaissance polymath" },
      { name: "Maya Angelou", role: "Poet and author" },
      { name: "Elon Musk", role: "Entrepreneur and innovator" }
    ],
    communicationStyle: "You communicate through stories, metaphors, and big-picture concepts. You're enthusiastic and expressive, often jumping between ideas. You prefer conversations that explore possibilities rather than focus on details.",
    atYourBest: "When you're thriving, you're generating breakthrough ideas, inspiring others with your vision, and creating solutions that didn't exist before. You're energized, creative, and making meaningful contributions.",
    whenStressed: "Under stress, you may become scattered, jumping between too many ideas without completing any. You might feel overwhelmed by routine demands and become frustrated with constraints. You may struggle to prioritize.",
    pattern: {
      high: ["openness", "adaptability"],
      low: ["conscientiousness"]
    },
    color: "from-purple-500 to-pink-500",
    rarity: 7.2,
    icon: "💡"
  },
  {
    id: "architect",
    name: "The Architect",
    tagline: "Systematic innovator who builds the future",
    description: [
      "You are an Architect—someone who combines creative vision with systematic execution. Your high Openness and Conscientiousness make you uniquely capable of both imagining new possibilities and building them into reality.",
      "You're the person who can see the big picture and break it down into actionable steps. While you may prefer working independently, your ability to create well-designed systems and solutions makes you highly valuable.",
      "You're thoughtful, methodical, and innovative. You don't just have ideas—you figure out how to make them work."
    ],
    strengths: [
      "Exceptional at designing systems and structures",
      "Combines creativity with practical execution",
      "Strong analytical and problem-solving skills",
      "Able to see both details and big picture",
      "Methodical and thorough in your approach",
      "Innovative yet reliable",
      "Excellent at planning and organization"
    ],
    growthAreas: [
      "Building stronger collaborative relationships",
      "Communicating your vision to others",
      "Being more flexible when plans change",
      "Balancing perfectionism with progress",
      "Engaging more with teams and social activities"
    ],
    careerMatches: [
      { title: "Software Architect", explanation: "Your systematic thinking and innovation make you excellent at designing complex systems" },
      { title: "Urban Planner", explanation: "You excel at envisioning and creating well-designed spaces and communities" },
      { title: "Research & Development Lead", explanation: "Your combination of innovation and methodical approach drives breakthrough development" },
      { title: "Systems Designer", explanation: "You're skilled at creating efficient, elegant solutions to complex problems" },
      { title: "Engineering Manager", explanation: "Your ability to balance vision and execution makes you effective at leading technical teams" },
      { title: "Product Manager", explanation: "You excel at translating innovative ideas into actionable product roadmaps" },
      { title: "Academic Researcher", explanation: "Your systematic approach to innovation drives rigorous, groundbreaking research" },
      { title: "Technical Writer", explanation: "You're skilled at creating clear, well-structured documentation for complex systems" }
    ],
    workStyle: "You work best independently or in small, focused teams. You prefer projects that allow you to design and build systems from the ground up. You excel when you can combine creative problem-solving with methodical execution.",
    relationshipStyle: "You value deep, meaningful connections with a few close people rather than broad social networks. You appreciate partners who respect your need for independence and intellectual space. You show care through thoughtful actions and well-designed solutions.",
    famousExamples: [
      { name: "Albert Einstein", role: "Theoretical physicist" },
      { name: "Jane Goodall", role: "Primatologist and researcher" },
      { name: "Tim Berners-Lee", role: "Inventor of the World Wide Web" },
      { name: "Marie Curie", role: "Physicist and chemist" }
    ],
    communicationStyle: "You communicate through clear, structured explanations. You prefer written communication and thoughtful discussions over spontaneous conversations. You're precise and logical, often using diagrams or structured frameworks.",
    atYourBest: "When thriving, you're designing elegant solutions, building innovative systems, and creating lasting value. You're productive, creative, and making meaningful contributions through your methodical innovation.",
    whenStressed: "Under stress, you may become overly perfectionistic or isolated. You might struggle with collaboration or become frustrated when others don't follow your systematic approach. You may withdraw from social interactions.",
    pattern: {
      high: ["openness", "conscientiousness"],
      low: ["extraversion"]
    },
    color: "from-blue-500 to-indigo-500",
    rarity: 4.8,
    icon: "🏛️"
  },
  {
    id: "catalyst",
    name: "The Catalyst",
    tagline: "Dynamic connector who energizes change",
    description: [
      "You are a Catalyst—someone who combines social energy with innovative thinking and adaptability. Your high Extraversion, Openness, and Adaptability make you a natural change agent who brings people together around new ideas.",
      "You're energized by social interaction and novel experiences. You're the person who sees opportunities, rallies others around a vision, and adapts quickly as situations evolve. You thrive in dynamic, people-centered environments.",
      "You're enthusiastic, creative, and socially engaged. You don't just adapt to change—you create it and bring others along with you."
    ],
    strengths: [
      "Exceptional at inspiring and motivating others",
      "Comfortable leading through change",
      "Natural networking and relationship-building",
      "Quick to adapt to new situations",
      "Enthusiastic and energizing presence",
      "Creative problem-solving in social contexts",
      "Able to see and communicate possibilities"
    ],
    growthAreas: [
      "Following through on commitments",
      "Creating structure for your ideas",
      "Managing details and logistics",
      "Balancing social energy with focused work",
      "Staying committed to long-term projects"
    ],
    careerMatches: [
      { title: "Marketing Director", explanation: "Your ability to inspire and adapt makes you excellent at connecting products with people" },
      { title: "Event Planner", explanation: "Your social energy and adaptability help you create memorable experiences" },
      { title: "Sales Leader", explanation: "Your enthusiasm and relationship-building skills drive successful sales" },
      { title: "Community Organizer", explanation: "You excel at bringing people together around shared goals" },
      { title: "Public Relations Specialist", explanation: "Your social skills and adaptability help you navigate dynamic communication challenges" },
      { title: "Talent Acquisition", explanation: "Your ability to connect with people makes you skilled at finding and attracting talent" },
      { title: "Nonprofit Director", explanation: "Your passion and ability to inspire others drive meaningful social impact" },
      { title: "Training & Development", explanation: "You excel at creating engaging learning experiences that inspire growth" }
    ],
    workStyle: "You thrive in collaborative, dynamic environments with lots of social interaction. You prefer projects that involve working with others and allow for creativity and adaptation. You work best when you can inspire teams and respond quickly to changing needs.",
    relationshipStyle: "You bring energy, excitement, and novelty to relationships. You value partners who appreciate your social nature and share your enthusiasm for new experiences. You may struggle with partners who need high levels of routine and predictability.",
    famousExamples: [
      { name: "Oprah Winfrey", role: "Media mogul and philanthropist" },
      { name: "Richard Branson", role: "Entrepreneur and adventurer" },
      { name: "Ellen DeGeneres", role: "Television host and comedian" },
      { name: "Tony Robbins", role: "Motivational speaker and author" }
    ],
    communicationStyle: "You communicate with enthusiasm and energy, often using stories and examples. You're expressive and engaging, drawing others into your vision. You prefer dynamic, interactive conversations over formal presentations.",
    atYourBest: "When thriving, you're inspiring teams, creating positive change, and bringing people together around shared goals. You're energized, creative, and making meaningful connections.",
    whenStressed: "Under stress, you may become scattered or overwhelmed by too many commitments. You might struggle with follow-through or become frustrated with routine demands. You may feel drained if you can't maintain social connections.",
    pattern: {
      high: ["extraversion", "openness", "adaptability"],
      low: []
    },
    color: "from-orange-500 to-red-500",
    rarity: 5.6,
    icon: "⚡"
  },
  {
    id: "strategist",
    name: "The Strategist",
    tagline: "Reliable planner who executes with precision",
    description: [
      "You are a Strategist—someone who combines careful planning with emotional stability. Your high Conscientiousness and Emotional Resilience make you reliable, methodical, and able to execute complex plans under pressure.",
      "You're the person who creates detailed plans, anticipates challenges, and follows through systematically. While you may prefer proven methods over innovation, your reliability and precision make you invaluable for execution.",
      "You're organized, disciplined, and steady. You don't just plan—you execute with consistency and reliability."
    ],
    strengths: [
      "Exceptional planning and organization skills",
      "Reliable and consistent execution",
      "Calm under pressure",
      "Detail-oriented and thorough",
      "Strong follow-through on commitments",
      "Able to anticipate and plan for challenges",
      "Methodical and systematic approach"
    ],
    growthAreas: [
      "Embracing innovation and new approaches",
      "Being more flexible when plans change",
      "Exploring creative solutions",
      "Adapting to unexpected situations",
      "Balancing planning with spontaneity"
    ],
    careerMatches: [
      { title: "Operations Manager", explanation: "Your planning skills and reliability make you excellent at ensuring smooth operations" },
      { title: "Project Manager", explanation: "Your methodical approach and emotional stability help you manage complex projects" },
      { title: "Financial Analyst", explanation: "Your attention to detail and systematic thinking drive accurate financial planning" },
      { title: "Supply Chain Manager", explanation: "You excel at creating efficient, reliable systems for logistics" },
      { title: "Quality Assurance Lead", explanation: "Your thoroughness and consistency ensure high standards" },
      { title: "Compliance Officer", explanation: "Your methodical approach and reliability make you skilled at ensuring adherence to regulations" },
      { title: "Executive Assistant", explanation: "Your organization and reliability make you invaluable for managing complex schedules" },
      { title: "Military Officer", explanation: "Your planning skills and emotional resilience are essential for strategic leadership" }
    ],
    workStyle: "You work best in structured environments with clear processes and expectations. You prefer projects that allow for careful planning and methodical execution. You excel when you can create detailed plans and follow them systematically.",
    relationshipStyle: "You show care through reliability and consistent actions. You value partners who appreciate your dependability and planning. You may struggle with partners who are highly spontaneous or unpredictable.",
    famousExamples: [
      { name: "Warren Buffett", role: "Investor and business magnate" },
      { name: "Angela Merkel", role: "Former Chancellor of Germany" },
      { name: "Sheryl Sandberg", role: "Former COO of Meta" },
      { name: "Dwight D. Eisenhower", role: "Former U.S. President and General" }
    ],
    communicationStyle: "You communicate through clear, structured information. You prefer organized presentations and detailed explanations. You're precise and reliable, often providing comprehensive context.",
    atYourBest: "When thriving, you're executing complex plans flawlessly, maintaining high standards, and providing reliable leadership. You're organized, calm, and making consistent progress.",
    whenStressed: "Under stress, you may become overly rigid or resistant to change. You might struggle with unexpected situations or become frustrated when others don't follow plans. You may become overly controlling.",
    pattern: {
      high: ["conscientiousness", "emotionalResilience"],
      low: ["openness"]
    },
    color: "from-green-500 to-teal-500",
    rarity: 11.3,
    icon: "🎯"
  },
  {
    id: "connector",
    name: "The Connector",
    tagline: "Warm collaborator who builds relationships",
    description: [
      "You are a Connector—someone who combines social energy with genuine care for others. Your high Extraversion and Agreeableness make you naturally skilled at building relationships and creating positive social environments.",
      "You're energized by people and genuinely interested in their wellbeing. You're the person who brings teams together, creates harmony, and helps others feel valued. You thrive in collaborative, people-centered environments.",
      "You're warm, friendly, and socially engaged. You don't just network—you build genuine connections that create value for everyone."
    ],
    strengths: [
      "Exceptional relationship-building skills",
      "Natural ability to create harmony",
      "Warm and approachable presence",
      "Skilled at reading social dynamics",
      "Energized by collaboration",
      "Able to make others feel valued",
      "Strong communication and interpersonal skills"
    ],
    growthAreas: [
      "Setting boundaries and saying no",
      "Making difficult decisions independently",
      "Handling conflict directly",
      "Focusing on tasks over relationships",
      "Balancing social needs with individual work"
    ],
    careerMatches: [
      { title: "Human Resources Manager", explanation: "Your people skills and care for others make you excellent at supporting employee wellbeing" },
      { title: "Customer Success Manager", explanation: "Your relationship-building skills help you create loyal, satisfied customers" },
      { title: "Therapist or Counselor", explanation: "Your empathy and interpersonal skills make you skilled at helping others" },
      { title: "Team Lead", explanation: "You excel at creating cohesive, collaborative teams" },
      { title: "Sales Representative", explanation: "Your relationship-building skills drive successful customer relationships" },
      { title: "Community Manager", explanation: "Your ability to connect people makes you excellent at building communities" },
      { title: "Recruiter", explanation: "Your people skills help you match candidates with opportunities" },
      { title: "Event Coordinator", explanation: "You excel at creating experiences that bring people together" }
    ],
    workStyle: "You thrive in collaborative, team-oriented environments with lots of social interaction. You prefer projects that involve working closely with others and allow you to build relationships. You work best when you can create positive team dynamics.",
    relationshipStyle: "You bring warmth, care, and social energy to relationships. You value partners who appreciate your social nature and reciprocate your care. You may struggle with partners who are highly independent or prefer minimal social interaction.",
    famousExamples: [
      { name: "Dolly Parton", role: "Singer and philanthropist" },
      { name: "Jimmy Fallon", role: "Television host" },
      { name: "Ellen DeGeneres", role: "Television host" },
      { name: "Fred Rogers", role: "Television host and educator" }
    ],
    communicationStyle: "You communicate warmly and personally, often using stories and examples. You're expressive and engaging, making others feel heard and valued. You prefer interactive, collaborative conversations.",
    atYourBest: "When thriving, you're building strong teams, creating positive environments, and helping others succeed. You're energized, connected, and making meaningful contributions through relationships.",
    whenStressed: "Under stress, you may struggle to set boundaries or become overwhelmed by others' needs. You might avoid conflict or become frustrated when relationships are strained. You may feel drained if you can't maintain social connections.",
    pattern: {
      high: ["extraversion", "agreeableness"],
      low: ["openness"]
    },
    color: "from-pink-500 to-rose-500",
    rarity: 12.1,
    icon: "🤝"
  },
  {
    id: "guardian",
    name: "The Guardian",
    tagline: "Trustworthy protector who creates stability",
    description: [
      "You are a Guardian—someone who combines reliability, care for others, and strong ethical principles. Your high Conscientiousness, Agreeableness, and Honesty-Humility make you a trusted, dependable person who creates stability and fairness.",
      "You're the person others turn to for reliable support and ethical guidance. You value fairness, consistency, and doing the right thing. You thrive in environments where trust and integrity matter.",
      "You're responsible, caring, and principled. You don't just follow rules—you create environments where everyone can thrive."
    ],
    strengths: [
      "Exceptional reliability and dependability",
      "Strong ethical principles and integrity",
      "Genuine care for others' wellbeing",
      "Skilled at creating fair, stable environments",
      "Consistent and trustworthy",
      "Able to balance care with responsibility",
      "Natural ability to protect and support others"
    ],
    growthAreas: [
      "Embracing change and innovation",
      "Being more flexible with rules",
      "Taking calculated risks",
      "Balancing others' needs with your own",
      "Adapting to dynamic situations"
    ],
    careerMatches: [
      { title: "Social Worker", explanation: "Your care for others and ethical principles make you excellent at supporting vulnerable populations" },
      { title: "School Principal", explanation: "Your reliability and care for others help you create safe, supportive learning environments" },
      { title: "Compliance Officer", explanation: "Your ethical principles and reliability make you skilled at ensuring fair practices" },
      { title: "Healthcare Administrator", explanation: "You excel at creating systems that support both patients and staff" },
      { title: "Human Resources Director", explanation: "Your care for others and ethical principles drive fair, supportive workplace policies" },
      { title: "Nonprofit Director", explanation: "Your values and reliability make you effective at leading mission-driven organizations" },
      { title: "Legal Aid Attorney", explanation: "Your ethical principles and care for others drive advocacy for justice" },
      { title: "Quality Assurance Manager", explanation: "Your reliability and principles ensure high standards and fairness" }
    ],
    workStyle: "You work best in stable, values-driven environments with clear ethical guidelines. You prefer projects that allow you to create fair, supportive systems. You excel when you can balance responsibility with care for others.",
    relationshipStyle: "You show care through consistent, reliable actions and ethical behavior. You value partners who share your principles and appreciate your dependability. You create stable, trustworthy relationships.",
    famousExamples: [
      { name: "Nelson Mandela", role: "Anti-apartheid revolutionary and President" },
      { name: "Mother Teresa", role: "Missionary and humanitarian" },
      { name: "Jimmy Carter", role: "Former U.S. President and humanitarian" },
      { name: "Malala Yousafzai", role: "Education activist" }
    ],
    communicationStyle: "You communicate with honesty and care, often focusing on fairness and ethical considerations. You're reliable and consistent, building trust through your words and actions.",
    atYourBest: "When thriving, you're creating fair systems, supporting others reliably, and making principled decisions. You're trusted, caring, and making meaningful contributions through your values.",
    whenStressed: "Under stress, you may become overly rigid or resistant to change. You might struggle with situations that require flexibility or become frustrated when others don't share your ethical standards. You may become overly protective.",
    pattern: {
      high: ["conscientiousness", "agreeableness", "honestyHumility"],
      low: []
    },
    color: "from-emerald-500 to-green-500",
    rarity: 9.4,
    icon: "🛡️"
  },
  {
    id: "explorer",
    name: "The Explorer",
    tagline: "Adventurous seeker who embraces the unknown",
    description: [
      "You are an Explorer—someone who combines curiosity with social energy and a willingness to embrace the unknown. Your high Openness and Extraversion, combined with lower Conscientiousness, make you adventurous, spontaneous, and always seeking new experiences.",
      "You're energized by novelty, people, and adventure. You're the person who's always planning the next trip, trying the new restaurant, or meeting new people. You thrive in dynamic, unpredictable environments.",
      "You're curious, social, and spontaneous. You don't just travel—you explore life itself with enthusiasm and openness."
    ],
    strengths: [
      "Exceptional curiosity and openness to experience",
      "Natural ability to adapt to new situations",
      "Energized by social interaction and novelty",
      "Comfortable with uncertainty",
      "Skilled at finding opportunities",
      "Enthusiastic and engaging presence",
      "Able to inspire others to explore"
    ],
    growthAreas: [
      "Following through on commitments",
      "Creating structure and routine",
      "Managing details and logistics",
      "Staying focused on long-term goals",
      "Balancing exploration with stability"
    ],
    careerMatches: [
      { title: "Travel Writer", explanation: "Your curiosity and adaptability make you excellent at exploring and documenting new places" },
      { title: "Adventure Guide", explanation: "Your enthusiasm and comfort with uncertainty help you lead exciting experiences" },
      { title: "Photographer", explanation: "Your curiosity and openness help you capture unique perspectives" },
      { title: "International Business Development", explanation: "You excel at exploring new markets and building relationships globally" },
      { title: "Cultural Anthropologist", explanation: "Your curiosity and adaptability make you skilled at understanding different cultures" },
      { title: "Restaurant Owner", explanation: "Your openness to new experiences helps you create unique dining experiences" },
      { title: "Tourism Director", explanation: "Your enthusiasm and social skills help you promote exciting destinations" },
      { title: "Freelance Journalist", explanation: "Your curiosity and adaptability drive compelling stories from diverse experiences" }
    ],
    workStyle: "You thrive in dynamic, varied environments with lots of change and social interaction. You prefer projects that allow for exploration and adaptation. You work best when you can follow your curiosity and engage with new people and experiences.",
    relationshipStyle: "You bring excitement, novelty, and social energy to relationships. You value partners who share your enthusiasm for exploration and give you freedom to pursue new experiences. You may struggle with partners who need high levels of routine and predictability.",
    famousExamples: [
      { name: "Anthony Bourdain", role: "Chef and travel documentarian" },
      { name: "Amelia Earhart", role: "Aviation pioneer" },
      { name: "Ernest Hemingway", role: "Author and adventurer" },
      { name: "Bear Grylls", role: "Adventurer and television presenter" }
    ],
    communicationStyle: "You communicate with enthusiasm and energy, often sharing stories about your experiences. You're expressive and engaging, drawing others into your adventures. You prefer dynamic, spontaneous conversations.",
    atYourBest: "When thriving, you're discovering new experiences, inspiring others to explore, and living life fully. You're energized, curious, and making meaningful connections through your adventures.",
    whenStressed: "Under stress, you may become restless or scattered. You might struggle with routine demands or become frustrated with constraints. You may feel trapped if you can't pursue new experiences.",
    pattern: {
      high: ["openness", "extraversion"],
      low: ["conscientiousness"]
    },
    color: "from-yellow-500 to-orange-500",
    rarity: 6.8,
    icon: "🧭"
  },
  {
    id: "stabilizer",
    name: "The Stabilizer",
    tagline: "Balanced anchor who maintains calm",
    description: [
      "You are a Stabilizer—someone who maintains emotional balance and adaptability across situations. Your high Emotional Resilience and Adaptability, combined with moderate scores across other dimensions, make you steady, flexible, and able to handle whatever comes your way.",
      "You're the person others turn to in times of change or stress because you remain calm and adaptable. You don't have extreme highs or lows—you maintain steady, balanced responses. You thrive in environments that require stability and flexibility.",
      "You're calm, adaptable, and balanced. You don't just handle stress—you create stability for yourself and others."
    ],
    strengths: [
      "Exceptional emotional stability",
      "Natural ability to adapt to change",
      "Calm under pressure",
      "Balanced approach to challenges",
      "Able to maintain perspective",
      "Skilled at finding middle ground",
      "Reliable and steady presence"
    ],
    growthAreas: [
      "Developing stronger passions and interests",
      "Taking stronger stands on issues",
      "Embracing more extreme positions when needed",
      "Building deeper expertise in specific areas",
      "Creating more distinctive personal brand"
    ],
    careerMatches: [
      { title: "Mediator", explanation: "Your balance and calm make you excellent at resolving conflicts" },
      { title: "Crisis Manager", explanation: "Your stability and adaptability help you handle emergencies effectively" },
      { title: "Life Coach", explanation: "Your balanced perspective helps others navigate challenges" },
      { title: "Operations Coordinator", explanation: "You excel at maintaining smooth operations during change" },
      { title: "Customer Service Manager", explanation: "Your calm and adaptability help you handle diverse customer needs" },
      { title: "Human Resources Generalist", explanation: "Your balance helps you support diverse employee needs" },
      { title: "Project Coordinator", explanation: "Your stability helps you manage projects through various challenges" },
      { title: "Wellness Coordinator", explanation: "Your balanced approach helps others achieve wellbeing" }
    ],
    workStyle: "You work well in varied environments, adapting as needed while maintaining stability. You prefer projects that allow for flexibility and balance. You excel when you can provide steady support during change.",
    relationshipStyle: "You bring stability, calm, and balance to relationships. You value partners who appreciate your steady presence and adaptability. You create harmonious, flexible relationships.",
    famousExamples: [
      { name: "Dalai Lama", role: "Spiritual leader" },
      { name: "Mr. Rogers", role: "Television host and educator" },
      { name: "Desmond Tutu", role: "Archbishop and human rights activist" },
      { name: "Jane Goodall", role: "Primatologist" }
    ],
    communicationStyle: "You communicate with balance and calm, often finding middle ground. You're steady and reliable, helping others maintain perspective. You prefer measured, thoughtful conversations.",
    atYourBest: "When thriving, you're providing stability during change, helping others maintain balance, and adapting smoothly to challenges. You're calm, flexible, and making meaningful contributions through your steady presence.",
    whenStressed: "Under stress, you may become overly passive or struggle to take strong positions. You might avoid making difficult decisions or become frustrated when balance isn't possible. You may feel like you're not distinctive enough.",
    pattern: {
      high: ["emotionalResilience", "adaptability"],
      low: []
    },
    color: "from-cyan-500 to-blue-500",
    rarity: 10.5,
    icon: "⚖️"
  },
  {
    id: "visionary",
    name: "The Visionary",
    tagline: "Forward-thinking builder who creates the future",
    description: [
      "You are a Visionary—someone who combines innovative thinking with systematic execution and adaptability. Your high Openness, Conscientiousness, and Adaptability make you uniquely capable of envisioning the future and building it systematically.",
      "You're the person who sees what's possible and figures out how to make it happen. You combine creativity with discipline, innovation with execution. You thrive in environments that value both vision and results.",
      "You're innovative, organized, and adaptable. You don't just dream—you build the future methodically."
    ],
    strengths: [
      "Exceptional at envisioning future possibilities",
      "Combines innovation with systematic execution",
      "Able to adapt plans as needed",
      "Strong strategic thinking",
      "Skilled at translating vision into action",
      "Innovative yet reliable",
      "Excellent at long-term planning"
    ],
    growthAreas: [
      "Building stronger collaborative relationships",
      "Being more flexible with execution details",
      "Balancing vision with present-moment awareness",
      "Engaging more with teams",
      "Communicating vision more effectively"
    ],
    careerMatches: [
      { title: "Chief Innovation Officer", explanation: "Your vision and systematic approach make you excellent at driving organizational innovation" },
      { title: "Strategic Planner", explanation: "You excel at envisioning future scenarios and creating actionable plans" },
      { title: "Product Strategist", explanation: "Your innovation and execution skills help you create successful products" },
      { title: "Technology Architect", explanation: "You're skilled at designing future-ready systems" },
      { title: "Research Director", explanation: "Your vision and methodical approach drive breakthrough research" },
      { title: "Entrepreneur", explanation: "Your combination of vision and execution helps you build successful ventures" },
      { title: "Consultant", explanation: "You excel at helping organizations envision and achieve their future state" },
      { title: "Futurist", explanation: "Your innovative thinking and systematic approach help you predict and shape trends" }
    ],
    workStyle: "You work best when you can combine vision with execution. You prefer projects that allow you to innovate while building systematically. You excel when you can create long-term strategies and adapt them as you learn.",
    relationshipStyle: "You value partners who appreciate your vision and support your goals. You show care through thoughtful planning and building shared futures. You may prefer deep connections with a few people over broad social networks.",
    famousExamples: [
      { name: "Elon Musk", role: "Entrepreneur and innovator" },
      { name: "Jeff Bezos", role: "Founder of Amazon" },
      { name: "Reed Hastings", role: "Co-founder of Netflix" },
      { name: "Satya Nadella", role: "CEO of Microsoft" }
    ],
    communicationStyle: "You communicate through clear vision and structured plans. You prefer presentations that show both the big picture and the path forward. You're strategic and forward-thinking, often using frameworks and roadmaps.",
    atYourBest: "When thriving, you're creating breakthrough innovations, building systematic solutions, and leading transformation. You're visionary, organized, and making meaningful contributions through your unique combination of skills.",
    whenStressed: "Under stress, you may become overly focused on the future at the expense of the present. You might struggle with collaboration or become frustrated when others don't share your vision. You may become isolated.",
    pattern: {
      high: ["openness", "conscientiousness", "adaptability"],
      low: []
    },
    color: "from-violet-500 to-purple-500",
    rarity: 3.9,
    icon: "🔮"
  },
  {
    id: "harmonizer",
    name: "The Harmonizer",
    tagline: "Thoughtful peacemaker who values authenticity",
    description: [
      "You are a Harmonizer—someone who combines genuine care for others with strong ethical principles and a preference for meaningful, smaller social circles. Your high Agreeableness and Honesty-Humility, combined with lower Extraversion, make you thoughtful, authentic, and skilled at creating harmony.",
      "You're the person who values deep, authentic connections and fairness. You prefer quality over quantity in relationships. You thrive in environments where authenticity and ethical behavior matter.",
      "You're caring, principled, and thoughtful. You don't just avoid conflict—you create genuine harmony through authenticity and fairness."
    ],
    strengths: [
      "Exceptional at creating authentic connections",
      "Strong ethical principles and integrity",
      "Genuine care for others' wellbeing",
      "Skilled at resolving conflicts fairly",
      "Thoughtful and reflective",
      "Able to create safe, supportive environments",
      "Natural ability to understand others deeply"
    ],
    growthAreas: [
      "Building broader social networks",
      "Being more assertive when needed",
      "Taking on leadership roles",
      "Engaging more in group activities",
      "Balancing others' needs with your own"
    ],
    careerMatches: [
      { title: "Counselor or Therapist", explanation: "Your empathy and authenticity make you excellent at supporting others' growth" },
      { title: "Mediator", explanation: "Your fairness and care help you resolve conflicts effectively" },
      { title: "Social Worker", explanation: "Your values and care for others drive support for vulnerable populations" },
      { title: "Ethics Officer", explanation: "Your principles and thoughtfulness make you skilled at ensuring ethical practices" },
      { title: "Human Resources Specialist", explanation: "Your care and fairness help you support employees authentically" },
      { title: "Life Coach", explanation: "Your authenticity and care help others achieve personal growth" },
      { title: "Nonprofit Program Manager", explanation: "Your values and care drive meaningful social impact" },
      { title: "Academic Advisor", explanation: "Your thoughtfulness and care help students navigate their paths" }
    ],
    workStyle: "You work best in values-driven environments with opportunities for meaningful, one-on-one or small group work. You prefer projects that allow you to create authentic connections and support others. You excel when you can work thoughtfully and ethically.",
    relationshipStyle: "You value deep, authentic connections with a few close people. You show care through thoughtful actions and genuine presence. You create safe, supportive relationships built on authenticity and fairness.",
    famousExamples: [
      { name: "Mr. Rogers", role: "Television host and educator" },
      { name: "Brené Brown", role: "Researcher and author" },
      { name: "Thich Nhat Hanh", role: "Zen master and peace activist" },
      { name: "Maya Angelou", role: "Poet and author" }
    ],
    communicationStyle: "You communicate thoughtfully and authentically, often focusing on understanding and fairness. You prefer deep, meaningful conversations over surface-level interactions. You're genuine and caring.",
    atYourBest: "When thriving, you're creating authentic connections, supporting others' growth, and making principled decisions. You're caring, thoughtful, and making meaningful contributions through your values.",
    whenStressed: "Under stress, you may become overly focused on others' needs or struggle to assert yourself. You might avoid conflict or become frustrated when others don't share your values. You may become isolated.",
    pattern: {
      high: ["agreeableness", "honestyHumility"],
      low: ["extraversion"]
    },
    color: "from-teal-500 to-cyan-500",
    rarity: 8.7,
    icon: "☮️"
  },
  {
    id: "achiever",
    name: "The Achiever",
    tagline: "Driven executor who delivers results",
    description: [
      "You are an Achiever—someone who combines discipline, social energy, and adaptability to get things done. Your high Conscientiousness, Extraversion, and Adaptability make you driven, organized, and able to execute effectively while maintaining social connections.",
      "You're the person who sets ambitious goals and achieves them systematically. You're energized by accomplishment and social recognition. You thrive in competitive, results-driven environments.",
      "You're driven, organized, and socially engaged. You don't just plan—you execute and achieve while building relationships."
    ],
    strengths: [
      "Exceptional goal-setting and achievement",
      "Strong organizational and execution skills",
      "Energized by accomplishment",
      "Able to adapt plans as needed",
      "Skilled at building relationships",
      "Comfortable with competition",
      "Natural ability to inspire and lead"
    ],
    growthAreas: [
      "Balancing achievement with wellbeing",
      "Valuing process over just outcomes",
      "Being more flexible with goals",
      "Appreciating others' different approaches",
      "Finding meaning beyond achievement"
    ],
    careerMatches: [
      { title: "Sales Director", explanation: "Your drive and social skills make you excellent at achieving sales targets" },
      { title: "Operations Executive", explanation: "Your execution skills and adaptability help you deliver operational excellence" },
      { title: "Entrepreneur", explanation: "Your drive and adaptability help you build successful businesses" },
      { title: "Management Consultant", explanation: "You excel at helping organizations achieve their goals" },
      { title: "Athletic Director", explanation: "Your drive and social skills help you build winning teams" },
      { title: "Real Estate Developer", explanation: "Your execution skills and adaptability drive successful projects" },
      { title: "Executive Coach", explanation: "Your achievement focus helps others reach their goals" },
      { title: "Business Development Manager", explanation: "Your drive and relationship-building skills create growth opportunities" }
    ],
    workStyle: "You thrive in competitive, results-driven environments with clear goals and social interaction. You prefer projects that allow you to achieve measurable outcomes. You work best when you can set ambitious goals and execute systematically.",
    relationshipStyle: "You bring energy, ambition, and achievement to relationships. You value partners who appreciate your drive and share your goals. You may struggle with partners who prioritize process over outcomes.",
    famousExamples: [
      { name: "Michael Jordan", role: "Basketball player" },
      { name: "Sheryl Sandberg", role: "Former COO of Meta" },
      { name: "Indra Nooyi", role: "Former CEO of PepsiCo" },
      { name: "Jeff Bezos", role: "Founder of Amazon" }
    ],
    communicationStyle: "You communicate with energy and focus on results. You prefer conversations that move toward action and achievement. You're direct and goal-oriented, often using metrics and outcomes.",
    atYourBest: "When thriving, you're achieving ambitious goals, inspiring teams, and delivering exceptional results. You're driven, organized, and making meaningful contributions through your achievements.",
    whenStressed: "Under stress, you may become overly focused on outcomes or become frustrated with slow progress. You might struggle with work-life balance or become competitive in unhealthy ways. You may feel like you're never doing enough.",
    pattern: {
      high: ["conscientiousness", "extraversion", "adaptability"],
      low: []
    },
    color: "from-amber-500 to-yellow-500",
    rarity: 8.2,
    icon: "🏆"
  },
  {
    id: "analyst",
    name: "The Analyst",
    tagline: "Independent thinker who seeks truth",
    description: [
      "You are an Analyst—someone who combines intellectual curiosity with systematic thinking and independence. Your high Openness and Conscientiousness, combined with lower Extraversion and Agreeableness, make you thoughtful, analytical, and focused on finding truth through careful analysis.",
      "You're the person who digs deep into problems, analyzes data carefully, and reaches independent conclusions. You prefer working independently and value accuracy over social harmony. You thrive in environments that value rigorous thinking.",
      "You're curious, systematic, and independent. You don't just accept information—you analyze it thoroughly to find truth."
    ],
    strengths: [
      "Exceptional analytical and critical thinking",
      "Strong intellectual curiosity",
      "Independent and objective",
      "Skilled at systematic problem-solving",
      "Able to see patterns others miss",
      "Thorough and methodical",
      "Comfortable challenging assumptions"
    ],
    growthAreas: [
      "Building stronger collaborative relationships",
      "Considering emotional factors in decisions",
      "Communicating findings more effectively",
      "Being more flexible with conclusions",
      "Balancing analysis with action"
    ],
    careerMatches: [
      { title: "Data Scientist", explanation: "Your analytical skills and curiosity make you excellent at extracting insights from data" },
      { title: "Research Analyst", explanation: "Your systematic thinking and independence drive rigorous research" },
      { title: "Financial Analyst", explanation: "You excel at analyzing financial data and making independent recommendations" },
      { title: "Software Engineer", explanation: "Your analytical skills and systematic approach help you build complex systems" },
      { title: "Academic Researcher", explanation: "Your curiosity and methodical approach drive breakthrough discoveries" },
      { title: "Intelligence Analyst", explanation: "Your analytical skills and independence help you assess complex situations" },
      { title: "Quality Assurance Engineer", explanation: "Your thoroughness and systematic thinking ensure high standards" },
      { title: "Investment Analyst", explanation: "Your analytical skills and independence drive sound investment decisions" }
    ],
    workStyle: "You work best independently or in small, focused teams. You prefer projects that allow for deep analysis and independent thinking. You excel when you can dig into complex problems systematically.",
    relationshipStyle: "You value deep, intellectual connections with a few close people. You show care through thoughtful analysis and honest feedback. You may struggle with partners who need high levels of emotional expression or social activity.",
    famousExamples: [
      { name: "Albert Einstein", role: "Theoretical physicist" },
      { name: "Marie Curie", role: "Physicist and chemist" },
      { name: "Stephen Hawking", role: "Theoretical physicist" },
      { name: "Carl Sagan", role: "Astronomer and science communicator" }
    ],
    communicationStyle: "You communicate through clear, logical explanations. You prefer written communication and structured discussions. You're precise and analytical, often using data and evidence.",
    atYourBest: "When thriving, you're uncovering insights, solving complex problems, and contributing through rigorous analysis. You're curious, systematic, and making meaningful contributions through your thinking.",
    whenStressed: "Under stress, you may become overly critical or isolated. You might struggle with collaboration or become frustrated when others don't value analysis. You may become overly skeptical.",
    pattern: {
      high: ["openness", "conscientiousness"],
      low: ["extraversion", "agreeableness"]
    },
    color: "from-slate-500 to-gray-500",
    rarity: 11.5,
    icon: "🔬"
  }
];

/**
 * Calculate archetype match based on dimensional scores
 * Returns primary archetype with match percentage and secondary matches
 */
export function calculateArchetype(scores: DimensionScore[]): {
  primary: Archetype;
  matchPercentage: number;
  secondary: Array<{ archetype: Archetype; matchPercentage: number }>;
} {
  // Create score map for easy lookup
  const scoreMap = scores.reduce((acc, score) => {
    acc[score.dimension] = score.percentile;
    return acc;
  }, {} as Record<string, number>);

  // Score each archetype based on pattern matching
  const archetypeScores = archetypes.map((archetype) => {
    let matchScore = 0;
    let maxPossibleScore = 0;

    // Score high dimensions (should be > 65)
    archetype.pattern.high.forEach((dim) => {
      maxPossibleScore += 2;
      const percentile = scoreMap[dim] || 50;
      if (percentile > 65) {
        matchScore += 2; // Perfect match
      } else if (percentile > 50) {
        matchScore += 1; // Partial match
      }
    });

    // Score low dimensions (should be < 40)
    archetype.pattern.low.forEach((dim) => {
      maxPossibleScore += 2;
      const percentile = scoreMap[dim] || 50;
      if (percentile < 40) {
        matchScore += 2; // Perfect match
      } else if (percentile < 50) {
        matchScore += 1; // Partial match
      }
    });

    // If no specific pattern, score based on overall balance
    if (archetype.pattern.high.length === 0 && archetype.pattern.low.length === 0) {
      // For balanced archetypes, check if scores are moderate (40-60 range)
      const allDims = ["openness", "conscientiousness", "extraversion", "agreeableness", "emotionalResilience", "honestyHumility", "adaptability"];
      allDims.forEach((dim) => {
        maxPossibleScore += 1;
        const percentile = scoreMap[dim] || 50;
        if (percentile >= 40 && percentile <= 60) {
          matchScore += 1;
        }
      });
    }

    const matchPercentage = maxPossibleScore > 0 
      ? Math.round((matchScore / maxPossibleScore) * 100)
      : 50; // Default if no pattern

    return {
      archetype,
      matchScore,
      matchPercentage,
    };
  });

  // Sort by match percentage
  archetypeScores.sort((a, b) => b.matchPercentage - a.matchPercentage);

  const primary = archetypeScores[0].archetype;
  const primaryMatchPercentage = archetypeScores[0].matchPercentage;

  // Get secondary matches (next 2-3 highest)
  const secondary = archetypeScores
    .slice(1, 4)
    .map((item) => ({
      archetype: item.archetype,
      matchPercentage: item.matchPercentage,
    }))
    .filter((item) => item.matchPercentage >= primaryMatchPercentage - 20); // Within 20% of primary

  return {
    primary,
    matchPercentage: primaryMatchPercentage,
    secondary,
  };
}



