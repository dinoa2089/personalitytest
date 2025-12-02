import type { DimensionScore } from "@/types";

// Support both string and structured format for strengths/growth areas
export type StrengthItem = string | { title: string; description: string };

export interface Archetype {
  id: string;
  name: string;
  tagline: string;
  description: string[];
  strengths: StrengthItem[];
  growthAreas: StrengthItem[];
  careerMatches: Array<{ title: string; explanation: string }>;
  workStyle: string;
  relationshipStyle: string;
  famousExamples: Array<{ name: string; role: string; image_url?: string }>;
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
      { name: "Steve Jobs", role: "Co-founder of Apple", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/440px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg" },
      { name: "Leonardo da Vinci", role: "Renaissance polymath", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Francesco_Melzi_-_Portrait_of_Leonardo.png/440px-Francesco_Melzi_-_Portrait_of_Leonardo.png" },
      { name: "Maya Angelou", role: "Poet and author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Angelou_at_Clinton_inauguration_%28cropped%29.jpg/440px-Angelou_at_Clinton_inauguration_%28cropped%29.jpg" },
      { name: "Elon Musk", role: "Entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg" },
      { name: "Nikola Tesla", role: "Inventor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/440px-N.Tesla.JPG" },
      { name: "Walt Disney", role: "Animator, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Walt_Disney_1946.JPG/440px-Walt_Disney_1946.JPG" },
      { name: "Thomas Edison", role: "Inventor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Thomas_Edison2.jpg/440px-Thomas_Edison2.jpg" },
      { name: "Richard Branson", role: "Entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Richard_Branson_March_2015_%28cropped%29.jpg/440px-Richard_Branson_March_2015_%28cropped%29.jpg" },
      { name: "Lady Gaga", role: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lady_Gaga_at_the_2019_Venice_Film_Festival.jpg/440px-Lady_Gaga_at_the_2019_Venice_Film_Festival.jpg" },
      { name: "Jim Henson", role: "Puppeteer, creator", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Jim_Henson_%281989%29.jpg/440px-Jim_Henson_%281989%29.jpg" },
      { name: "Robin Williams", role: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Robin_Williams_2011a_%282%29.jpg/440px-Robin_Williams_2011a_%282%29.jpg" },
      { name: "David Bowie", role: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg/440px-David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg" },
      { name: "Benjamin Franklin", role: "Inventor, statesman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/BenFranklinDupworked.jpg/440px-BenFranklinDupworked.jpg" },
      { name: "Björk", role: "Singer, artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Bj%C3%B6rk%2C_T%C3%ADvoli%2C_2003.jpg/440px-Bj%C3%B6rk%2C_T%C3%ADvoli%2C_2003.jpg" },
      { name: "Salvador Dalí", role: "Artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Salvador_Dal%C3%AD_1939.jpg/440px-Salvador_Dal%C3%AD_1939.jpg" },
      { name: "Frida Kahlo", role: "Artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/440px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg" },
      { name: "Prince", role: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Prince_at_Coachella_%28cropped%29.jpg/440px-Prince_at_Coachella_%28cropped%29.jpg" },
      { name: "Quentin Tarantino", role: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Quentin_Tarantino_by_Gage_Skidmore.jpg/440px-Quentin_Tarantino_by_Gage_Skidmore.jpg" },
      { name: "Tim Burton", role: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tim_Burton_%282012%29_3.jpg/440px-Tim_Burton_%282012%29_3.jpg" },
      { name: "Kanye West", role: "Rapper, designer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Kanye_West_at_the_2009_Tribeca_Film_Festival.jpg/440px-Kanye_West_at_the_2009_Tribeca_Film_Festival.jpg" }
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
      { name: "Albert Einstein", role: "Theoretical physicist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/440px-Albert_Einstein_Head.jpg" },
      { name: "Jane Goodall", role: "Primatologist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Jane_Goodall_HK.jpg/440px-Jane_Goodall_HK.jpg" },
      { name: "Tim Berners-Lee", role: "Inventor of WWW", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sir_Tim_Berners-Lee_%28cropped%29.jpg/440px-Sir_Tim_Berners-Lee_%28cropped%29.jpg" },
      { name: "Marie Curie", role: "Physicist and chemist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c._1920s.jpg/440px-Marie_Curie_c._1920s.jpg" },
      { name: "Isaac Newton", role: "Physicist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Portrait_of_Sir_Isaac_Newton%2C_1689.jpg/440px-Portrait_of_Sir_Isaac_Newton%2C_1689.jpg" },
      { name: "Stephen Hawking", role: "Physicist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/440px-Stephen_Hawking.StarChild.jpg" },
      { name: "Bill Gates", role: "Microsoft founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/440px-Bill_Gates_2017_%28cropped%29.jpg" },
      { name: "Nikola Tesla", role: "Inventor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/440px-N.Tesla.JPG" },
      { name: "Christopher Nolan", role: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Christopher_Nolan_Cannes_2018.jpg/440px-Christopher_Nolan_Cannes_2018.jpg" },
      { name: "Stanley Kubrick", role: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/KubrickForLook_%28cropped%29.jpg/440px-KubrickForLook_%28cropped%29.jpg" },
      { name: "Mark Zuckerberg", role: "Meta CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/440px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg" },
      { name: "Sherlock Holmes", role: "Fictional detective", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Sherlock_Holmes_Portrait_Paget.jpg/440px-Sherlock_Holmes_Portrait_Paget.jpg" },
      { name: "Ada Lovelace", role: "Mathematician, programmer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/440px-Ada_Lovelace_portrait.jpg" },
      { name: "Charles Darwin", role: "Naturalist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Charles_Darwin_seated_crop.jpg/440px-Charles_Darwin_seated_crop.jpg" },
      { name: "Jodie Foster", role: "Actress, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jodie_Foster_%28cropped%29.jpg/440px-Jodie_Foster_%28cropped%29.jpg" },
      { name: "Tilda Swinton", role: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Tilda_Swinton_2018_%28cropped%29.jpg/440px-Tilda_Swinton_2018_%28cropped%29.jpg" },
      { name: "Immanuel Kant", role: "Philosopher", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Kant_Portrait.jpg/440px-Kant_Portrait.jpg" },
      { name: "Carl Sagan", role: "Astronomer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Carl_Sagan_Planetary_Society.JPG/440px-Carl_Sagan_Planetary_Society.JPG" },
      { name: "Cillian Murphy", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Cillian_Murphy_Press_Conference_The_Party_Berlinale_2017_02.jpg/440px-Cillian_Murphy_Press_Conference_The_Party_Berlinale_2017_02.jpg" },
      { name: "Hillary Clinton", role: "Secretary of State", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Hillary_Clinton_official_Secretary_of_State_portrait_crop.jpg/440px-Hillary_Clinton_official_Secretary_of_State_portrait_crop.jpg" }
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
      { name: "Oprah Winfrey", role: "Media mogul", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/440px-Oprah_in_2014.jpg" },
      { name: "Richard Branson", role: "Entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Richard_Branson_March_2015_%28cropped%29.jpg/440px-Richard_Branson_March_2015_%28cropped%29.jpg" },
      { name: "Ellen DeGeneres", role: "TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Ellen_DeGeneres_2011.jpg/440px-Ellen_DeGeneres_2011.jpg" },
      { name: "Tony Robbins", role: "Motivational speaker", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Tony_Robbins.jpg/440px-Tony_Robbins.jpg" },
      { name: "Will Smith", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TechCrunch_Disrupt_2019_%2848834434641%29_%28cropped%29.jpg/440px-TechCrunch_Disrupt_2019_%2848834434641%29_%28cropped%29.jpg" },
      { name: "Dwayne Johnson", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dwayne_Johnson_2014_%28cropped%29.jpg/440px-Dwayne_Johnson_2014_%28cropped%29.jpg" },
      { name: "Barack Obama", role: "44th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/440px-President_Barack_Obama.jpg" },
      { name: "Bill Clinton", role: "42nd US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/440px-Bill_Clinton.jpg" },
      { name: "Magic Johnson", role: "Basketball legend", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Magic_Johnson_2019_%28cropped%29.jpg/440px-Magic_Johnson_2019_%28cropped%29.jpg" },
      { name: "Steve Harvey", role: "TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Steve_Harvey_2017.jpg/440px-Steve_Harvey_2017.jpg" },
      { name: "Robin Williams", role: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Robin_Williams_2011a_%282%29.jpg/440px-Robin_Williams_2011a_%282%29.jpg" },
      { name: "Jim Carrey", role: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Jim_Carrey_2008.jpg/440px-Jim_Carrey_2008.jpg" },
      { name: "Drew Barrymore", role: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Drew_Barrymore_2019.jpg/440px-Drew_Barrymore_2019.jpg" },
      { name: "Conan O'Brien", role: "TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Conan_O%27Brien_2016_%28cropped%29.jpg/440px-Conan_O%27Brien_2016_%28cropped%29.jpg" },
      { name: "Amy Poehler", role: "Comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Amy_Poehler_2019.jpg/440px-Amy_Poehler_2019.jpg" },
      { name: "Chris Rock", role: "Comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Chris_Rock_WE_2012_Shankbone.JPG/440px-Chris_Rock_WE_2012_Shankbone.JPG" },
      { name: "Ryan Reynolds", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Ryan_Reynolds_2016.jpg/440px-Ryan_Reynolds_2016.jpg" },
      { name: "Jennifer Lawrence", role: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Jennifer_Lawrence_SDCC_2015_X-Men.jpg/440px-Jennifer_Lawrence_SDCC_2015_X-Men.jpg" },
      { name: "Robert Downey Jr.", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/440px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg" },
      { name: "Bono", role: "U2 frontman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Bono_at_the_2014_Dublin_Web_Summit.jpg/440px-Bono_at_the_2014_Dublin_Web_Summit.jpg" }
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
      { name: "Warren Buffett", role: "Investor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Warren_Buffett_KU_Visit.jpg/440px-Warren_Buffett_KU_Visit.jpg" },
      { name: "Angela Merkel", role: "German Chancellor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Angela_Merkel_%282019%29_cropped.jpg/440px-Angela_Merkel_%282019%29_cropped.jpg" },
      { name: "Sheryl Sandberg", role: "Former Meta COO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sheryl_Sandberg_World_Economic_Forum_2013.jpg/440px-Sheryl_Sandberg_World_Economic_Forum_2013.jpg" },
      { name: "Dwight D. Eisenhower", role: "34th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Dwight_D._Eisenhower%2C_official_photo_portrait%2C_May_29%2C_1959.jpg/440px-Dwight_D._Eisenhower%2C_official_photo_portrait%2C_May_29%2C_1959.jpg" },
      { name: "Condoleezza Rice", role: "Secretary of State", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Condoleezza_Rice_cropped.jpg/440px-Condoleezza_Rice_cropped.jpg" },
      { name: "Colin Powell", role: "General, Secretary of State", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Colin_Powell_official_Secretary_of_State_photo.jpg/440px-Colin_Powell_official_Secretary_of_State_photo.jpg" },
      { name: "George Washington", role: "1st US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg/440px-Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg" },
      { name: "Queen Elizabeth II", role: "British monarch", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Queen_Elizabeth_II_in_March_2015.jpg/440px-Queen_Elizabeth_II_in_March_2015.jpg" },
      { name: "Jeff Bezos", role: "Amazon founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped3%29.jpg/440px-Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped3%29.jpg" },
      { name: "Ruth Bader Ginsburg", role: "Supreme Court Justice", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ruth_Bader_Ginsburg_official_SCOTUS_portrait.jpg/440px-Ruth_Bader_Ginsburg_official_SCOTUS_portrait.jpg" },
      { name: "George H.W. Bush", role: "41st US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/George_H._W._Bush%2C_President_of_the_United_States%2C_1989_official_portrait_%28cropped%29.jpg/440px-George_H._W._Bush%2C_President_of_the_United_States%2C_1989_official_portrait_%28cropped%29.jpg" },
      { name: "Denzel Washington", role: "Actor, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Denzel_Washington_2018.jpg/440px-Denzel_Washington_2018.jpg" },
      { name: "Anthony Hopkins", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/AnthonyHopkins10TIFF.jpg/440px-AnthonyHopkins10TIFF.jpg" },
      { name: "Sandra Day O'Connor", role: "Supreme Court Justice", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Sandra_Day_O%27Connor.jpg/440px-Sandra_Day_O%27Connor.jpg" },
      { name: "Michael Bloomberg", role: "Mayor, businessman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Mike_Bloomberg_Headshot.jpg/440px-Mike_Bloomberg_Headshot.jpg" },
      { name: "Martha Stewart", role: "Businesswoman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Martha_Stewart_2011_Shankbone_2.JPG/440px-Martha_Stewart_2011_Shankbone_2.JPG" },
      { name: "Margaret Thatcher", role: "UK Prime Minister", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Margaret_Thatcher_stock_portrait_%28cropped%29.jpg/440px-Margaret_Thatcher_stock_portrait_%28cropped%29.jpg" },
      { name: "Sam Walton", role: "Walmart founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Walton.png/440px-Walton.png" },
      { name: "Jack Welch", role: "GE CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Jack_Welch_2012.jpg/440px-Jack_Welch_2012.jpg" },
      { name: "Tim Cook", role: "Apple CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Tim_Cook_%282017%2C_cropped%29.jpg/440px-Tim_Cook_%282017%2C_cropped%29.jpg" }
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
      { name: "Dolly Parton", role: "Singer, philanthropist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Dolly_Parton_2016.jpg/440px-Dolly_Parton_2016.jpg" },
      { name: "Jimmy Fallon", role: "Television host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Jimmy_Fallon%2C_2011.jpg/440px-Jimmy_Fallon%2C_2011.jpg" },
      { name: "Ellen DeGeneres", role: "Television host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Ellen_DeGeneres_2011.jpg/440px-Ellen_DeGeneres_2011.jpg" },
      { name: "Fred Rogers", role: "Television host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Fred_Rogers%2C_late_1960s.jpg/440px-Fred_Rogers%2C_late_1960s.jpg" },
      { name: "Taylor Swift", role: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/440px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png" },
      { name: "Jennifer Aniston", role: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/JenniferAnistonHWoFOct2011.jpg/440px-JenniferAnistonHWoFOct2011.jpg" },
      { name: "Hugh Jackman", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Hugh_Jackman_by_Gage_Skidmore.jpg/440px-Hugh_Jackman_by_Gage_Skidmore.jpg" },
      { name: "Reese Witherspoon", role: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Reese_Witherspoon_2014.jpg/440px-Reese_Witherspoon_2014.jpg" },
      { name: "Tom Hanks", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/440px-Tom_Hanks_TIFF_2019.jpg" },
      { name: "Paul McCartney", role: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Paul_McCartney_2021_%28cropped%29.jpg/440px-Paul_McCartney_2021_%28cropped%29.jpg" },
      { name: "Kelly Clarkson", role: "Singer, TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Kelly_Clarkson%2C_2018.jpg/440px-Kelly_Clarkson%2C_2018.jpg" },
      { name: "Ryan Gosling", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Ryan_Gosling_Cannes_2011.jpg/440px-Ryan_Gosling_Cannes_2011.jpg" },
      { name: "Sandra Bullock", role: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Sandra_Bullock_in_2013_by_Gage_Skidmore.jpg/440px-Sandra_Bullock_in_2013_by_Gage_Skidmore.jpg" },
      { name: "Julia Roberts", role: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Julia_Roberts_2011.jpg/440px-Julia_Roberts_2011.jpg" },
      { name: "Beyoncé", role: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png/440px-Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png" },
      { name: "Jennifer Lopez", role: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Jennifer_Lopez_2018_2_%28cropped%29.jpg/440px-Jennifer_Lopez_2018_2_%28cropped%29.jpg" },
      { name: "Jimmy Carter", role: "39th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/JimmyCarterPortrait2.jpg/440px-JimmyCarterPortrait2.jpg" },
      { name: "Kate Middleton", role: "Princess of Wales", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Catherine%2C_Duchess_of_Cambridge_in_2019.jpg/440px-Catherine%2C_Duchess_of_Cambridge_in_2019.jpg" },
      { name: "Elton John", role: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Elton_John_2017.jpg/440px-Elton_John_2017.jpg" },
      { name: "Ariana Grande", role: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Ariana_Grande_Grammys_Red_Carpet_2020.png/440px-Ariana_Grande_Grammys_Red_Carpet_2020.png" }
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
      { name: "Nelson Mandela", role: "Anti-apartheid leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/440px-Nelson_Mandela_1994.jpg" },
      { name: "Mother Teresa", role: "Humanitarian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mother_Teresa_1.jpg/440px-Mother_Teresa_1.jpg" },
      { name: "Jimmy Carter", role: "39th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/JimmyCarterPortrait2.jpg/440px-JimmyCarterPortrait2.jpg" },
      { name: "Malala Yousafzai", role: "Education activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Malala_Yousafzai_at_Girl_Summit_2014.jpg/440px-Malala_Yousafzai_at_Girl_Summit_2014.jpg" },
      { name: "Mahatma Gandhi", role: "Independence leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/440px-Mahatma-Gandhi%2C_studio%2C_1931.jpg" },
      { name: "Abraham Lincoln", role: "16th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/440px-Abraham_Lincoln_O-77_matte_collodion_print.jpg" },
      { name: "Martin Luther King Jr.", role: "Civil rights leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Martin_Luther_King%2C_Jr..jpg/440px-Martin_Luther_King%2C_Jr..jpg" },
      { name: "Desmond Tutu", role: "Archbishop, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Desmond_Tutu_2013.jpg/440px-Desmond_Tutu_2013.jpg" },
      { name: "Eleanor Roosevelt", role: "First Lady, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Eleanor_Roosevelt_portrait_1933.jpg/440px-Eleanor_Roosevelt_portrait_1933.jpg" },
      { name: "Pope Francis", role: "Head of Catholic Church", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Pope_Francis_in_March_2013.jpg/440px-Pope_Francis_in_March_2013.jpg" },
      { name: "Ruth Bader Ginsburg", role: "Supreme Court Justice", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ruth_Bader_Ginsburg_official_SCOTUS_portrait.jpg/440px-Ruth_Bader_Ginsburg_official_SCOTUS_portrait.jpg" },
      { name: "Atticus Finch", role: "Fictional lawyer", image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Atticus_Finch_in_To_Kill_a_Mockingbird.png/440px-Atticus_Finch_in_To_Kill_a_Mockingbird.png" },
      { name: "Dolly Parton", role: "Singer, philanthropist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Dolly_Parton_2016.jpg/440px-Dolly_Parton_2016.jpg" },
      { name: "Florence Nightingale", role: "Nursing pioneer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Florence_Nightingale_%28H_Hering_NPG_x82368%29.jpg/440px-Florence_Nightingale_%28H_Hering_NPG_x82368%29.jpg" },
      { name: "Fred Rogers", role: "TV educator", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Fred_Rogers%2C_late_1960s.jpg/440px-Fred_Rogers%2C_late_1960s.jpg" },
      { name: "John Lewis", role: "Civil rights leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/John_Lewis_2020.jpg/440px-John_Lewis_2020.jpg" },
      { name: "Harriet Tubman", role: "Abolitionist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Harriet_Tubman_by_Squyer%2C_NPG%2C_c1885.jpg/440px-Harriet_Tubman_by_Squyer%2C_NPG%2C_c1885.jpg" },
      { name: "Rosa Parks", role: "Civil rights activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Rosaparks.jpg/440px-Rosaparks.jpg" },
      { name: "Dalai Lama", role: "Spiritual leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/14th_Dalai_Lama.jpg/440px-14th_Dalai_Lama.jpg" },
      { name: "Greta Thunberg", role: "Climate activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Greta_Thunberg_sp119_%28cropped%29.jpg/440px-Greta_Thunberg_sp119_%28cropped%29.jpg" }
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
      { name: "Anthony Bourdain", role: "Chef, travel documentarian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Anthony_Bourdain_on_WNYC-2011-24-02.jpg/440px-Anthony_Bourdain_on_WNYC-2011-24-02.jpg" },
      { name: "Amelia Earhart", role: "Aviation pioneer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Amelia_Earhart_1935.jpg/440px-Amelia_Earhart_1935.jpg" },
      { name: "Ernest Hemingway", role: "Author, adventurer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/ErnestHemingway.jpg/440px-ErnestHemingway.jpg" },
      { name: "Bear Grylls", role: "Adventurer, TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Bear_Grylls%2C_bautismo_del_Parque_Scout_Grillos_-_01.jpg/440px-Bear_Grylls%2C_bautismo_del_Parque_Scout_Grillos_-_01.jpg" },
      { name: "Steve Irwin", role: "Wildlife expert", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Steve_Irwin.jpg/440px-Steve_Irwin.jpg" },
      { name: "Richard Branson", role: "Entrepreneur, adventurer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Richard_Branson_March_2015_%28cropped%29.jpg/440px-Richard_Branson_March_2015_%28cropped%29.jpg" },
      { name: "Jacques Cousteau", role: "Ocean explorer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Jacques-Yves_Cousteau_%28cropped%29.jpg/440px-Jacques-Yves_Cousteau_%28cropped%29.jpg" },
      { name: "Indiana Jones", role: "Fictional archaeologist", image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Indiana_Jones_in_Raiders_of_the_Lost_Ark.jpg/440px-Indiana_Jones_in_Raiders_of_the_Lost_Ark.jpg" },
      { name: "Neil Armstrong", role: "Astronaut", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Neil_Armstrong_pose.jpg/440px-Neil_Armstrong_pose.jpg" },
      { name: "Bruce Lee", role: "Martial artist, actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bruce_Lee_1973.jpg/440px-Bruce_Lee_1973.jpg" },
      { name: "Jamie Oliver", role: "Chef, TV personality", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Jamie_Oliver_%28cropped%29.jpg/440px-Jamie_Oliver_%28cropped%29.jpg" },
      { name: "Evel Knievel", role: "Stunt performer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Evel_Knievel_1967.jpg/440px-Evel_Knievel_1967.jpg" },
      { name: "Jack London", role: "Author, adventurer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Jack_London_young.jpg/440px-Jack_London_young.jpg" },
      { name: "Chris McCandless", role: "Adventurer", image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Christopher_McCandless.jpg/440px-Christopher_McCandless.jpg" },
      { name: "Marco Polo", role: "Explorer, merchant", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Marco_Polo_portrait.jpg/440px-Marco_Polo_portrait.jpg" },
      { name: "Theodore Roosevelt", role: "26th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg/440px-President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg" },
      { name: "Chuck Yeager", role: "Test pilot", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Chuck_Yeager_%28Oct._14%2C_1997%2C_color%29.jpg/440px-Chuck_Yeager_%28Oct._14%2C_1997%2C_color%29.jpg" },
      { name: "Buzz Aldrin", role: "Astronaut", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Buzz_Aldrin.jpg/440px-Buzz_Aldrin.jpg" },
      { name: "Guy Fieri", role: "Chef, TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Guy_Fieri_at_the_2011_Tribeca_Film_Festival_2.jpg/440px-Guy_Fieri_at_the_2011_Tribeca_Film_Festival_2.jpg" },
      { name: "Mike Tyson", role: "Boxer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Mike_Tyson_2019_by_Glenn_Francis.jpg/440px-Mike_Tyson_2019_by_Glenn_Francis.jpg" }
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
      { name: "Dalai Lama", role: "Spiritual leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/14th_Dalai_Lama.jpg/440px-14th_Dalai_Lama.jpg" },
      { name: "Mr. Rogers", role: "TV host, educator", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Fred_Rogers%2C_late_1960s.jpg/440px-Fred_Rogers%2C_late_1960s.jpg" },
      { name: "Desmond Tutu", role: "Archbishop", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Desmond_Tutu_2013.jpg/440px-Desmond_Tutu_2013.jpg" },
      { name: "Jane Goodall", role: "Primatologist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Jane_Goodall_HK.jpg/440px-Jane_Goodall_HK.jpg" },
      { name: "Keanu Reeves", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Keanu_Reeves_2019_%28cropped%29.jpg/440px-Keanu_Reeves_2019_%28cropped%29.jpg" },
      { name: "Morgan Freeman", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg/440px-Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg" },
      { name: "Barack Obama", role: "44th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/440px-President_Barack_Obama.jpg" },
      { name: "Tom Hanks", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/440px-Tom_Hanks_TIFF_2019.jpg" },
      { name: "Carl Rogers", role: "Psychologist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Carl_Ransom_Rogers.jpg/440px-Carl_Ransom_Rogers.jpg" },
      { name: "Bob Ross", role: "Painter, TV host", image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/70/Bob_at_Easel.jpg/440px-Bob_at_Easel.jpg" },
      { name: "Abraham Lincoln", role: "16th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/440px-Abraham_Lincoln_O-77_matte_collodion_print.jpg" },
      { name: "Queen Elizabeth II", role: "British monarch", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Queen_Elizabeth_II_in_March_2015.jpg/440px-Queen_Elizabeth_II_in_March_2015.jpg" },
      { name: "Thich Nhat Hanh", role: "Zen master", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Thich_Nhat_Hanh_12_%28cropped%29.jpg/440px-Thich_Nhat_Hanh_12_%28cropped%29.jpg" },
      { name: "Jeff Bridges", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Jeff_Bridges_2017.jpg/440px-Jeff_Bridges_2017.jpg" },
      { name: "Woody Harrelson", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Woody_Harrelson_%2850564940853%29_%28cropped%29.jpg/440px-Woody_Harrelson_%2850564940853%29_%28cropped%29.jpg" },
      { name: "Walt Disney", role: "Animator, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Walt_Disney_1946.JPG/440px-Walt_Disney_1946.JPG" },
      { name: "Lisa Kudrow", role: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Lisa_Kudrow_2019_by_Glenn_Francis.jpg/440px-Lisa_Kudrow_2019_by_Glenn_Francis.jpg" },
      { name: "Ringo Starr", role: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Ringo_Starr_%282019%29.jpg/440px-Ringo_Starr_%282019%29.jpg" },
      { name: "Audrey Hepburn", role: "Actress, humanitarian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Audrey_Hepburn_1959.jpg/440px-Audrey_Hepburn_1959.jpg" },
      { name: "Grace Kelly", role: "Actress, Princess", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Grace_Kelly_1956.jpg/440px-Grace_Kelly_1956.jpg" }
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
      { name: "Elon Musk", role: "Entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg" },
      { name: "Jeff Bezos", role: "Amazon founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped3%29.jpg/440px-Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped3%29.jpg" },
      { name: "Reed Hastings", role: "Netflix co-founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Reed_Hastings%2C_Web_2.0_Conference_2010.jpg/440px-Reed_Hastings%2C_Web_2.0_Conference_2010.jpg" },
      { name: "Satya Nadella", role: "Microsoft CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg/440px-MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg" },
      { name: "Steve Jobs", role: "Apple co-founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/440px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg" },
      { name: "Bill Gates", role: "Microsoft founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/440px-Bill_Gates_2017_%28cropped%29.jpg" },
      { name: "Mark Zuckerberg", role: "Meta CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/440px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg" },
      { name: "Tim Cook", role: "Apple CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Tim_Cook_%282017%2C_cropped%29.jpg/440px-Tim_Cook_%282017%2C_cropped%29.jpg" },
      { name: "Sundar Pichai", role: "Google CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Sundar_Pichai_%2832522099047%29_%28cropped%29.jpg/440px-Sundar_Pichai_%2832522099047%29_%28cropped%29.jpg" },
      { name: "Jensen Huang", role: "NVIDIA CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Jensen_Huang_-_2016_%28cropped%29.jpg/440px-Jensen_Huang_-_2016_%28cropped%29.jpg" },
      { name: "Oprah Winfrey", role: "Media mogul", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/440px-Oprah_in_2014.jpg" },
      { name: "Walt Disney", role: "Animator, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Walt_Disney_1946.JPG/440px-Walt_Disney_1946.JPG" },
      { name: "Nelson Mandela", role: "South African President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/440px-Nelson_Mandela_1994.jpg" },
      { name: "Winston Churchill", role: "British Prime Minister", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sir_Winston_Churchill_-_19086236948.jpg/440px-Sir_Winston_Churchill_-_19086236948.jpg" },
      { name: "Martin Luther King Jr.", role: "Civil rights leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Martin_Luther_King%2C_Jr..jpg/440px-Martin_Luther_King%2C_Jr..jpg" },
      { name: "Jack Ma", role: "Alibaba founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Jack_Ma_2019.jpg/440px-Jack_Ma_2019.jpg" },
      { name: "Richard Branson", role: "Virgin founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Richard_Branson_March_2015_%28cropped%29.jpg/440px-Richard_Branson_March_2015_%28cropped%29.jpg" },
      { name: "Howard Schultz", role: "Starbucks founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Howard_Schultz_at_the_2010_Time_100.jpg/440px-Howard_Schultz_at_the_2010_Time_100.jpg" },
      { name: "Sam Altman", role: "OpenAI CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Sam_Altman_2019.jpg/440px-Sam_Altman_2019.jpg" },
      { name: "Larry Page", role: "Google co-founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Larry_Page_in_the_European_Parliament%2C_17.06.2009_%28cropped%29.jpg/440px-Larry_Page_in_the_European_Parliament%2C_17.06.2009_%28cropped%29.jpg" }
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
      { name: "Mr. Rogers", role: "TV host, educator", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Fred_Rogers%2C_late_1960s.jpg/440px-Fred_Rogers%2C_late_1960s.jpg" },
      { name: "Brené Brown", role: "Researcher, author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Bren%C3%A9_Brown_2019.jpg/440px-Bren%C3%A9_Brown_2019.jpg" },
      { name: "Thich Nhat Hanh", role: "Zen master", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Thich_Nhat_Hanh_12_%28cropped%29.jpg/440px-Thich_Nhat_Hanh_12_%28cropped%29.jpg" },
      { name: "Maya Angelou", role: "Poet, author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Angelou_at_Clinton_inauguration_%28cropped%29.jpg/440px-Angelou_at_Clinton_inauguration_%28cropped%29.jpg" },
      { name: "Princess Diana", role: "Princess of Wales", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Diana%2C_Princess_of_Wales_1997_%282%29.jpg/440px-Diana%2C_Princess_of_Wales_1997_%282%29.jpg" },
      { name: "Keanu Reeves", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Keanu_Reeves_2019_%28cropped%29.jpg/440px-Keanu_Reeves_2019_%28cropped%29.jpg" },
      { name: "Johnny Depp", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Johnny_Depp-2757_%28cropped%29.jpg/440px-Johnny_Depp-2757_%28cropped%29.jpg" },
      { name: "Bob Dylan", role: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Bob_Dylan_-_Azkena_Rock_Festival_2010_2.jpg/440px-Bob_Dylan_-_Azkena_Rock_Festival_2010_2.jpg" },
      { name: "Audrey Hepburn", role: "Actress, humanitarian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Audrey_Hepburn_1959.jpg/440px-Audrey_Hepburn_1959.jpg" },
      { name: "J.R.R. Tolkien", role: "Author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/J._R._R._Tolkien%2C_ca._1925.jpg/440px-J._R._R._Tolkien%2C_ca._1925.jpg" },
      { name: "William Shakespeare", role: "Playwright", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/440px-Shakespeare.jpg" },
      { name: "Vincent van Gogh", role: "Artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/440px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg" },
      { name: "Frida Kahlo", role: "Artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/440px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg" },
      { name: "John Lennon", role: "Musician, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/John_Lennon_1969_%28cropped%29.jpg/440px-John_Lennon_1969_%28cropped%29.jpg" },
      { name: "Virginia Woolf", role: "Author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg/440px-George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg" },
      { name: "Edgar Allan Poe", role: "Author, poet", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Edgar_Allan_Poe_2_retouched_and_transparent_bg.png/440px-Edgar_Allan_Poe_2_retouched_and_transparent_bg.png" },
      { name: "Tim Burton", role: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tim_Burton_%282012%29_3.jpg/440px-Tim_Burton_%282012%29_3.jpg" },
      { name: "Andrew Garfield", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Andrew_Garfield_by_Gage_Skidmore.jpg/440px-Andrew_Garfield_by_Gage_Skidmore.jpg" },
      { name: "Tom Hiddleston", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Tom_Hiddleston_at_SDCC_2016.jpg/440px-Tom_Hiddleston_at_SDCC_2016.jpg" },
      { name: "Björk", role: "Singer, artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Bj%C3%B6rk%2C_T%C3%ADvoli%2C_2003.jpg/440px-Bj%C3%B6rk%2C_T%C3%ADvoli%2C_2003.jpg" }
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
      { name: "Michael Jordan", role: "Basketball legend", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/440px-Michael_Jordan_in_2014.jpg" },
      { name: "Sheryl Sandberg", role: "Former Meta COO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sheryl_Sandberg_World_Economic_Forum_2013.jpg/440px-Sheryl_Sandberg_World_Economic_Forum_2013.jpg" },
      { name: "Indra Nooyi", role: "Former PepsiCo CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Indra_Nooyi_-_World_Economic_Forum_Annual_Meeting_Davos_2008.jpg/440px-Indra_Nooyi_-_World_Economic_Forum_Annual_Meeting_Davos_2008.jpg" },
      { name: "Jeff Bezos", role: "Amazon founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped3%29.jpg/440px-Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped3%29.jpg" },
      { name: "Oprah Winfrey", role: "Media mogul", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/440px-Oprah_in_2014.jpg" },
      { name: "Tom Cruise", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Tom_Cruise_by_Gage_Skidmore_2.jpg/440px-Tom_Cruise_by_Gage_Skidmore_2.jpg" },
      { name: "Beyoncé", role: "Singer, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png/440px-Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png" },
      { name: "Serena Williams", role: "Tennis champion", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Serena_Williams_at_2013_US_Open.jpg/440px-Serena_Williams_at_2013_US_Open.jpg" },
      { name: "Taylor Swift", role: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/440px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png" },
      { name: "Dwayne Johnson", role: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dwayne_Johnson_2014_%28cropped%29.jpg/440px-Dwayne_Johnson_2014_%28cropped%29.jpg" },
      { name: "Madonna", role: "Singer, entertainer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Madonna_-_Rebel_Heart_Tour_2015_-_Berlin_1_%28cropped%29.jpg/440px-Madonna_-_Rebel_Heart_Tour_2015_-_Berlin_1_%28cropped%29.jpg" },
      { name: "Arnold Schwarzenegger", role: "Actor, Governor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/A._Schwarzenegger.jpg/440px-A._Schwarzenegger.jpg" },
      { name: "Elon Musk", role: "Entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg" },
      { name: "LeBron James", role: "Basketball player", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/LeBron_James_crop.jpg/440px-LeBron_James_crop.jpg" },
      { name: "Tiger Woods", role: "Professional golfer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TigerWoodsOfficialPortrait.jpg/440px-TigerWoodsOfficialPortrait.jpg" },
      { name: "Kobe Bryant", role: "Basketball legend", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Kobe_Bryant_2014.jpg/440px-Kobe_Bryant_2014.jpg" },
      { name: "David Beckham", role: "Soccer star", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/David_Beckham_2019.jpg/440px-David_Beckham_2019.jpg" },
      { name: "Reese Witherspoon", role: "Actress, producer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Reese_Witherspoon_2014.jpg/440px-Reese_Witherspoon_2014.jpg" },
      { name: "Gordon Ramsay", role: "Celebrity chef", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Gordon_Ramsay.jpg/440px-Gordon_Ramsay.jpg" },
      { name: "Simon Cowell", role: "TV producer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Simon_Cowell_2016.jpg/440px-Simon_Cowell_2016.jpg" }
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
      { name: "Albert Einstein", role: "Theoretical physicist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/440px-Albert_Einstein_Head.jpg" },
      { name: "Marie Curie", role: "Physicist and chemist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c._1920s.jpg/440px-Marie_Curie_c._1920s.jpg" },
      { name: "Stephen Hawking", role: "Theoretical physicist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/440px-Stephen_Hawking.StarChild.jpg" },
      { name: "Carl Sagan", role: "Astronomer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Carl_Sagan_Planetary_Society.JPG/440px-Carl_Sagan_Planetary_Society.JPG" },
      { name: "Isaac Newton", role: "Physicist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Portrait_of_Sir_Isaac_Newton%2C_1689.jpg/440px-Portrait_of_Sir_Isaac_Newton%2C_1689.jpg" },
      { name: "Charles Darwin", role: "Naturalist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Charles_Darwin_seated_crop.jpg/440px-Charles_Darwin_seated_crop.jpg" },
      { name: "Bill Gates", role: "Microsoft founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/440px-Bill_Gates_2017_%28cropped%29.jpg" },
      { name: "Mark Zuckerberg", role: "Meta CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/440px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg" },
      { name: "Sherlock Holmes", role: "Fictional detective", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Sherlock_Holmes_Portrait_Paget.jpg/440px-Sherlock_Holmes_Portrait_Paget.jpg" },
      { name: "Nikola Tesla", role: "Inventor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/440px-N.Tesla.JPG" },
      { name: "Sigmund Freud", role: "Psychoanalyst", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Sigmund_Freud%2C_by_Max_Halberstadt_%28cropped%29.jpg/440px-Sigmund_Freud%2C_by_Max_Halberstadt_%28cropped%29.jpg" },
      { name: "Richard Feynman", role: "Physicist", image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Richard_Feynman_Nobel.jpg/440px-Richard_Feynman_Nobel.jpg" },
      { name: "Noam Chomsky", role: "Linguist, philosopher", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Noam_Chomsky_portrait_2017_retouched.png/440px-Noam_Chomsky_portrait_2017_retouched.png" },
      { name: "Bobby Fischer", role: "Chess grandmaster", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Bobby_Fischer_1960_in_Leipzig.jpg/440px-Bobby_Fischer_1960_in_Leipzig.jpg" },
      { name: "Agatha Christie", role: "Mystery novelist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Agatha_Christie.png/440px-Agatha_Christie.png" },
      { name: "Alan Turing", role: "Computer scientist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Alan_Turing_Aged_16.jpg/440px-Alan_Turing_Aged_16.jpg" },
      { name: "Ada Lovelace", role: "Mathematician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/440px-Ada_Lovelace_portrait.jpg" },
      { name: "Immanuel Kant", role: "Philosopher", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Kant_Portrait.jpg/440px-Kant_Portrait.jpg" },
      { name: "Richard Dawkins", role: "Evolutionary biologist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Richard_Dawkins_Stonehenge_2022_%28cropped%29.jpg/440px-Richard_Dawkins_Stonehenge_2022_%28cropped%29.jpg" },
      { name: "Neil deGrasse Tyson", role: "Astrophysicist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Neil_deGrasse_Tyson_in_June_2017_%28cropped%29.jpg/440px-Neil_deGrasse_Tyson_in_June_2017_%28cropped%29.jpg" }
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



