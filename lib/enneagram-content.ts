/**
 * Comprehensive Enneagram Type Content for SEO Landing Pages
 * Rich, authoritative content positioning PRISM-7 as the next-generation alternative
 */

export interface EnneagramType {
  number: number;
  name: string;
  tagline: string;
  coreFear: string;
  coreDesire: string;
  coreMotivation: string;
  description: string[];
  healthLevels: {
    healthy: string;
    average: string;
    unhealthy: string;
  };
  wings: {
    lower: { name: string; description: string };
    higher: { name: string; description: string };
  };
  growthLine: { number: number; description: string };
  stressLine: { number: number; description: string };
  strengths: string[];
  challenges: string[];
  inRelationships: string;
  careerPaths: Array<{ title: string; reason: string }>;
  growthAdvice: string[];
  famousExamples: Array<{ name: string; known_for: string }>;
  prismCorrelation: {
    likelyTypes: string[];
    keyDimensions: string;
  };
}

export const enneagramTypes: Record<string, EnneagramType> = {
  "1": {
    number: 1,
    name: "The Reformer",
    tagline: "The principled, purposeful, self-controlled perfectionist",
    coreFear: "Being corrupt, evil, or defective",
    coreDesire: "To be good, to have integrity, to be balanced",
    coreMotivation: "To be right, to strive higher, to improve everything, to be beyond criticism",
    description: [
      "Ones are conscientious and ethical, with a strong sense of right and wrong. They are teachers, crusaders, and advocates for change—always striving to improve things but afraid of making mistakes. Well-organized, orderly, and fastidious, they try to maintain high standards but can slip into being critical and perfectionistic.",
      "The One's inner critic is constantly active, comparing reality to an ideal standard and finding it wanting. This creates both their drive for improvement and their tendency toward self-criticism. They feel responsible for fixing what's wrong in the world, which can be both inspiring and exhausting.",
      "At their best, Ones are wise, discerning, realistic, and noble—morally heroic. They have a clear sense of purpose and can inspire others to reach for higher standards. They combine principle with pragmatism, knowing when to stand firm and when to adapt.",
      "Ones often struggle with resentment—the feeling that they're working hard to do the right thing while others take shortcuts. Learning to accept imperfection in themselves and others is central to their growth journey."
    ],
    healthLevels: {
      healthy: "Wise, discerning, realistic, and noble. They accept imperfection while still striving for improvement. They're tolerant, patient, and able to see the good in situations and people. They inspire others through their integrity rather than criticizing them into compliance.",
      average: "Orderly and well-organized, but increasingly critical and perfectionistic. They become more focused on rules and procedures, losing sight of the spirit behind them. They may become judgmental of others who don't meet their standards.",
      unhealthy: "Highly critical, both of self and others. They become rigid, dogmatic, and self-righteous. They may become obsessive about minor imperfections while missing larger issues. In extreme cases, they can become punitive and condemning."
    },
    wings: {
      lower: {
        name: "1w9 - The Idealist",
        description: "More introverted, philosophical, and detached. They combine the One's perfectionism with the Nine's desire for peace, creating individuals who are principled but less confrontational. They may struggle more with procrastination."
      },
      higher: {
        name: "1w2 - The Advocate",
        description: "More extraverted, warm, and people-oriented. They combine the One's drive for improvement with the Two's desire to help, creating passionate advocates for causes. They may struggle more with emotional expression."
      }
    },
    growthLine: {
      number: 7,
      description: "In growth, Ones move toward Seven, becoming more spontaneous, joyful, and accepting. They learn to embrace life's pleasures without guilt and to see multiple valid perspectives rather than just the 'right' one."
    },
    stressLine: {
      number: 4,
      description: "Under stress, Ones move toward Four, becoming moody, irrational, and self-pitying. They may feel misunderstood and become dramatic about their suffering. They lose their usual objectivity and become emotionally reactive."
    },
    strengths: [
      "Strong moral compass and integrity",
      "Dedication to improvement and excellence",
      "Ability to see what needs to be fixed",
      "Self-discipline and reliability",
      "Courage to stand up for principles"
    ],
    challenges: [
      "Excessive self-criticism and perfectionism",
      "Difficulty accepting imperfection in self and others",
      "Suppressed anger that emerges as resentment",
      "Rigidity and difficulty with ambiguity",
      "Tendency to be judgmental and critical"
    ],
    inRelationships: "Ones are loyal, responsible partners who take their commitments seriously. They show love through acts of service and helping their partners improve. They need to watch their tendency to criticize and learn to accept their partners as they are. They thrive with partners who appreciate their integrity while helping them lighten up.",
    careerPaths: [
      { title: "Quality Assurance", reason: "Their eye for detail and commitment to standards ensures excellence" },
      { title: "Judge/Lawyer", reason: "Their strong sense of justice and ethics serves the legal system well" },
      { title: "Editor", reason: "Their perfectionism and attention to detail improve written work" },
      { title: "Nonprofit Director", reason: "Their desire to improve the world drives meaningful change" },
      { title: "Teacher", reason: "Their commitment to improvement helps students reach their potential" }
    ],
    growthAdvice: [
      "Practice self-compassion. You deserve the same grace you (sometimes) extend to others.",
      "Recognize that 'good enough' is often good enough. Perfectionism is the enemy of progress.",
      "Allow yourself pleasure without guilt. Joy is not a moral failing.",
      "Express anger directly rather than letting it become resentment.",
      "Remember that there are multiple valid ways to do things, not just the 'right' way."
    ],
    famousExamples: [
      { name: "Mahatma Gandhi", known_for: "Independence leader, nonviolent activist" },
      { name: "Michelle Obama", known_for: "Former First Lady, advocate" },
      { name: "Martha Stewart", known_for: "Businesswoman, perfectionist lifestyle brand" },
      { name: "Nelson Mandela", known_for: "Anti-apartheid leader, president" }
    ],
    prismCorrelation: {
      likelyTypes: ["Guardian", "Strategist", "Analyst"],
      keyDimensions: "High Conscientiousness + High Honesty-Humility"
    }
  },

  "2": {
    number: 2,
    name: "The Helper",
    tagline: "The caring, interpersonal, generous people-pleaser",
    coreFear: "Being unwanted, unloved, or unneeded",
    coreDesire: "To be loved and appreciated",
    coreMotivation: "To be loved, to express feelings, to be needed and appreciated",
    description: [
      "Twos are empathetic, sincere, and warm-hearted. They are friendly, generous, and self-sacrificing, but can also be sentimental, flattering, and people-pleasing. They are well-meaning and driven to be close to others, but can slip into doing things for others in order to be needed.",
      "The Two's identity is built around being helpful and loving. They have an intuitive sense of what others need and derive satisfaction from meeting those needs. However, this can become a way of earning love rather than simply giving it, creating hidden expectations and eventual resentment.",
      "At their best, Twos are genuinely altruistic, giving without expectation of return. They have remarkable empathy and can make others feel deeply cared for. They use their interpersonal gifts to create genuine connection rather than to secure their own position.",
      "Twos often struggle to acknowledge their own needs, seeing neediness as weakness. Learning to receive as well as give, and to value themselves independent of their usefulness to others, is central to their growth."
    ],
    healthLevels: {
      healthy: "Genuinely loving and caring without hidden agendas. They give freely without keeping score. They acknowledge their own needs and can receive as well as give. They're nurturing without being intrusive or controlling.",
      average: "Increasingly focused on relationships and being needed. They may become possessive, intrusive, or manipulative in their giving. They struggle to acknowledge their own needs while expecting others to intuit them.",
      unhealthy: "Manipulative and self-serving while maintaining a facade of selflessness. They may become bitter about their unacknowledged sacrifices. In extreme cases, they can become coercive, using guilt and emotional manipulation to get their needs met."
    },
    wings: {
      lower: {
        name: "2w1 - The Servant",
        description: "More principled and idealistic. They combine the Two's helpfulness with the One's sense of duty, creating individuals who serve out of moral conviction. They may be more critical and less emotionally expressive."
      },
      higher: {
        name: "2w3 - The Host",
        description: "More ambitious and image-conscious. They combine the Two's interpersonal focus with the Three's drive for success, creating charming individuals who excel at networking. They may be more competitive and less genuinely selfless."
      }
    },
    growthLine: {
      number: 4,
      description: "In growth, Twos move toward Four, becoming more self-aware and authentic. They learn to acknowledge their own feelings and needs rather than focusing exclusively on others. They develop a richer inner life."
    },
    stressLine: {
      number: 8,
      description: "Under stress, Twos move toward Eight, becoming aggressive and domineering. They may become demanding about having their needs met after suppressing them for so long. They can become confrontational and controlling."
    },
    strengths: [
      "Deep empathy and emotional intelligence",
      "Genuine care for others' wellbeing",
      "Ability to create warm, supportive environments",
      "Intuitive understanding of others' needs",
      "Generosity and willingness to help"
    ],
    challenges: [
      "Difficulty acknowledging own needs",
      "Tendency toward people-pleasing and codependency",
      "Hidden expectations in giving",
      "Difficulty setting boundaries",
      "Pride in being needed that masks insecurity"
    ],
    inRelationships: "Twos are warm, attentive partners who prioritize their relationships. They show love through care and attention, sometimes to the point of smothering. They need to learn to receive love as well as give it, and to express their needs directly rather than hoping partners will intuit them.",
    careerPaths: [
      { title: "Nurse/Healthcare", reason: "Their caring nature and empathy serve patients well" },
      { title: "Counselor", reason: "Their emotional intelligence helps others heal" },
      { title: "Human Resources", reason: "Their people skills create positive work environments" },
      { title: "Teacher", reason: "Their nurturing nature helps students thrive" },
      { title: "Social Worker", reason: "Their desire to help serves vulnerable populations" }
    ],
    growthAdvice: [
      "Practice receiving without immediately giving back. You're allowed to be helped.",
      "Acknowledge your own needs directly rather than hinting or hoping.",
      "Set boundaries. Saying no to some things allows you to say yes to what matters.",
      "Examine your motives for helping. Is it freely given or expecting something in return?",
      "Develop interests and identity beyond your relationships."
    ],
    famousExamples: [
      { name: "Mother Teresa", known_for: "Humanitarian, missionary" },
      { name: "Dolly Parton", known_for: "Singer, philanthropist" },
      { name: "Desmond Tutu", known_for: "Archbishop, human rights activist" },
      { name: "Mr. Rogers", known_for: "Television host, educator" }
    ],
    prismCorrelation: {
      likelyTypes: ["Connector", "Guardian", "Harmonizer"],
      keyDimensions: "High Agreeableness + High Extraversion"
    }
  },

  "3": {
    number: 3,
    name: "The Achiever",
    tagline: "The success-oriented, pragmatic, adaptive performer",
    coreFear: "Being worthless or without inherent value",
    coreDesire: "To be valuable, successful, and admired",
    coreMotivation: "To be affirmed, to distinguish themselves, to be successful and admired",
    description: [
      "Threes are self-assured, attractive, and charming. Ambitious, competent, and energetic, they can also be status-conscious and highly driven for advancement. They are diplomatic and poised, but can also be overly concerned with their image and what others think of them.",
      "The Three's identity is built around achievement and success. They have an intuitive sense of what will impress others and can adapt their presentation accordingly. However, this adaptability can become a loss of authentic self as they shape-shift to meet expectations.",
      "At their best, Threes are authentic, self-accepting, and genuinely accomplished. They use their drive and competence to achieve meaningful goals rather than just impressive ones. They inspire others through genuine excellence rather than polished image.",
      "Threes often struggle with the question of who they really are beneath their accomplishments. Learning to value themselves for who they are rather than what they achieve is central to their growth journey."
    ],
    healthLevels: {
      healthy: "Authentic, self-accepting, and genuinely accomplished. They pursue meaningful goals rather than just impressive ones. They're honest about their limitations and don't need constant validation. They inspire through genuine excellence.",
      average: "Increasingly focused on image and achievement. They may become competitive, calculating, and concerned with status. They adapt their presentation to different audiences, sometimes losing touch with their authentic self.",
      unhealthy: "Deceptive and image-obsessed. They may fabricate accomplishments or take credit for others' work. In extreme cases, they can become exploitative and malicious, willing to sabotage others to maintain their position."
    },
    wings: {
      lower: {
        name: "3w2 - The Charmer",
        description: "More interpersonal and charming. They combine the Three's achievement drive with the Two's people skills, creating individuals who succeed through relationships. They may be more genuinely warm but also more dependent on approval."
      },
      higher: {
        name: "3w4 - The Professional",
        description: "More introspective and artistic. They combine the Three's drive with the Four's depth, creating individuals who seek meaningful rather than just impressive achievements. They may struggle more with self-doubt."
      }
    },
    growthLine: {
      number: 6,
      description: "In growth, Threes move toward Six, becoming more loyal, committed, and team-oriented. They learn to value connection over competition and to be honest about their vulnerabilities. They become more trustworthy and less image-focused."
    },
    stressLine: {
      number: 9,
      description: "Under stress, Threes move toward Nine, becoming disengaged, apathetic, and unfocused. They may numb out rather than face failure. They lose their characteristic drive and become passive and indecisive."
    },
    strengths: [
      "Drive and ambition to achieve goals",
      "Adaptability and social intelligence",
      "Efficiency and competence",
      "Ability to inspire and motivate others",
      "Confidence and poise under pressure"
    ],
    challenges: [
      "Over-identification with achievements and image",
      "Difficulty with authenticity and vulnerability",
      "Tendency to cut corners or deceive to maintain image",
      "Workaholism and neglect of relationships",
      "Difficulty knowing who they really are"
    ],
    inRelationships: "Threes bring energy, ambition, and success to relationships. They're supportive partners who help their significant others achieve their goals. They need to learn to be present and authentic rather than always performing, and to value the relationship itself, not just how it looks.",
    careerPaths: [
      { title: "Executive/CEO", reason: "Their drive and competence lead organizations effectively" },
      { title: "Sales Director", reason: "Their charm and goal-orientation drive results" },
      { title: "Entrepreneur", reason: "Their ambition and adaptability build successful ventures" },
      { title: "Marketing Executive", reason: "Their image-consciousness creates compelling brands" },
      { title: "Politician", reason: "Their charisma and adaptability win support" }
    ],
    growthAdvice: [
      "Practice being rather than doing. Your worth isn't determined by achievements.",
      "Be honest about failures and limitations. Vulnerability builds real connection.",
      "Ask yourself what you really want, not what will impress others.",
      "Slow down and be present. Life isn't just a series of goals to accomplish.",
      "Develop relationships where you can be authentic, not performing."
    ],
    famousExamples: [
      { name: "Oprah Winfrey", known_for: "Media mogul, philanthropist" },
      { name: "Tony Robbins", known_for: "Motivational speaker, author" },
      { name: "Taylor Swift", known_for: "Singer-songwriter" },
      { name: "Tom Cruise", known_for: "Actor" }
    ],
    prismCorrelation: {
      likelyTypes: ["Achiever", "Catalyst", "Visionary"],
      keyDimensions: "High Extraversion + High Conscientiousness + High Adaptability"
    }
  },

  "4": {
    number: 4,
    name: "The Individualist",
    tagline: "The sensitive, introspective, expressive romantic",
    coreFear: "Having no identity or personal significance",
    coreDesire: "To find themselves and their significance",
    coreMotivation: "To express their individuality, to create and surround themselves with beauty, to maintain certain moods and feelings",
    description: [
      "Fours are self-aware, sensitive, and reserved. They are emotionally honest, creative, and personal, but can also be moody and self-conscious. Withholding themselves from others due to feeling vulnerable and defective, they can also feel disdainful and exempt from ordinary ways of living.",
      "The Four's identity is built around being unique and different. They have a keen awareness of what's missing—in themselves, in their lives, in the world. This creates both their artistic sensitivity and their tendency toward melancholy and envy.",
      "At their best, Fours are profoundly creative, able to transform their emotional experiences into art that touches others deeply. They have the courage to explore the full range of human emotion and to express what others feel but cannot articulate.",
      "Fours often struggle with feeling fundamentally flawed or deficient compared to others. Learning to see their ordinary humanity as beautiful rather than shameful is central to their growth journey."
    ],
    healthLevels: {
      healthy: "Creative, emotionally honest, and deeply connected to themselves and others. They transform their emotional depth into meaningful expression. They embrace both the light and dark aspects of life without getting lost in either.",
      average: "Increasingly focused on their uniqueness and emotional states. They may become self-absorbed, moody, and envious of others. They romanticize suffering and may create drama to feel alive.",
      unhealthy: "Tormented by self-hatred and hopelessness. They may become self-destructive, alienating others through their emotional demands. In extreme cases, they can become suicidal or develop severe depression."
    },
    wings: {
      lower: {
        name: "4w3 - The Aristocrat",
        description: "More ambitious and image-conscious. They combine the Four's depth with the Three's drive, creating individuals who want their uniqueness to be recognized and admired. They may be more competitive and less introspective."
      },
      higher: {
        name: "4w5 - The Bohemian",
        description: "More withdrawn and cerebral. They combine the Four's emotional depth with the Five's intellectual curiosity, creating individuals who explore their inner world through ideas and analysis. They may be more isolated and eccentric."
      }
    },
    growthLine: {
      number: 1,
      description: "In growth, Fours move toward One, becoming more objective, principled, and disciplined. They learn to channel their emotional energy into purposeful action rather than endless self-exploration. They become more grounded and effective."
    },
    stressLine: {
      number: 2,
      description: "Under stress, Fours move toward Two, becoming clingy, dependent, and people-pleasing. They may abandon their authenticity to secure connection. They become needy and resentful when their emotional needs aren't met."
    },
    strengths: [
      "Emotional depth and authenticity",
      "Creative and artistic expression",
      "Ability to find meaning in suffering",
      "Empathy for others' pain",
      "Courage to explore difficult emotions"
    ],
    challenges: [
      "Tendency toward melancholy and self-pity",
      "Envy and feeling deficient compared to others",
      "Difficulty with practical, mundane aspects of life",
      "Self-absorption and emotional volatility",
      "Romanticizing suffering and drama"
    ],
    inRelationships: "Fours bring depth, passion, and emotional honesty to relationships. They want partners who can meet them in their emotional depths and appreciate their uniqueness. They need to watch their tendency to create drama or push partners away to test their love.",
    careerPaths: [
      { title: "Artist/Musician", reason: "Their emotional depth and creativity produce moving work" },
      { title: "Writer", reason: "Their introspection and sensitivity create compelling narratives" },
      { title: "Therapist", reason: "Their empathy and emotional intelligence help others heal" },
      { title: "Designer", reason: "Their aesthetic sensitivity creates beautiful environments" },
      { title: "Actor", reason: "Their emotional range brings characters to life" }
    ],
    growthAdvice: [
      "Practice gratitude for what you have rather than focusing on what's missing.",
      "Take action even when you don't feel inspired. Discipline enables creativity.",
      "Recognize that ordinary life has its own beauty. You don't have to be extraordinary to be valuable.",
      "Connect with others rather than withdrawing into your inner world.",
      "Challenge the belief that suffering is more authentic than happiness."
    ],
    famousExamples: [
      { name: "Frida Kahlo", known_for: "Artist" },
      { name: "Prince", known_for: "Musician" },
      { name: "Virginia Woolf", known_for: "Author" },
      { name: "Johnny Depp", known_for: "Actor" }
    ],
    prismCorrelation: {
      likelyTypes: ["Innovator", "Harmonizer", "Explorer"],
      keyDimensions: "High Openness + Low Emotional Resilience + Low Extraversion"
    }
  },

  "5": {
    number: 5,
    name: "The Investigator",
    tagline: "The intense, cerebral, perceptive observer",
    coreFear: "Being useless, helpless, or incapable",
    coreDesire: "To be capable and competent",
    coreMotivation: "To possess knowledge, to understand the environment, to have everything figured out",
    description: [
      "Fives are alert, insightful, and curious. They are able to concentrate and focus on developing complex ideas and skills. Independent, innovative, and inventive, they can also become preoccupied with their thoughts and imaginary constructs. They become detached, yet high-strung and intense.",
      "The Five's identity is built around knowledge and competence. They feel that they have limited energy and resources, so they withdraw to conserve them and develop expertise that will make them capable of engaging with the world. This creates both their intellectual depth and their tendency toward isolation.",
      "At their best, Fives are visionary pioneers, discovering new knowledge and making connections others miss. They have the patience and focus to master complex subjects and the independence to pursue unconventional ideas.",
      "Fives often struggle with engaging fully with life rather than observing it from a distance. Learning to participate in the world—emotionally, physically, socially—rather than just analyzing it is central to their growth."
    ],
    healthLevels: {
      healthy: "Visionary, open-minded, and deeply knowledgeable. They engage with life rather than just observing it. They share their knowledge generously and connect with others without feeling depleted.",
      average: "Increasingly withdrawn and cerebral. They may become detached, eccentric, and preoccupied with their own ideas. They hoard knowledge and energy, reluctant to engage with demands from others.",
      unhealthy: "Isolated, nihilistic, and out of touch with reality. They may develop paranoid delusions or become so detached that they can't function. In extreme cases, they can become schizoid or self-destructive."
    },
    wings: {
      lower: {
        name: "5w4 - The Iconoclast",
        description: "More creative and emotionally intense. They combine the Five's intellectual depth with the Four's emotional sensitivity, creating individuals who explore ideas with passion. They may be more artistic and less detached."
      },
      higher: {
        name: "5w6 - The Problem Solver",
        description: "More practical and loyal. They combine the Five's analytical abilities with the Six's focus on security, creating individuals who apply knowledge to real-world problems. They may be more anxious and less independent."
      }
    },
    growthLine: {
      number: 8,
      description: "In growth, Fives move toward Eight, becoming more confident, decisive, and engaged with the world. They learn to take action on their knowledge and to trust their instincts. They become more present and powerful."
    },
    stressLine: {
      number: 7,
      description: "Under stress, Fives move toward Seven, becoming scattered, hyperactive, and escapist. They may distract themselves with activities and stimulation rather than facing their fears. They lose their characteristic focus."
    },
    strengths: [
      "Deep analytical and intellectual abilities",
      "Independence of thought and action",
      "Ability to focus and concentrate intensely",
      "Innovative and original thinking",
      "Objectivity and clear-headedness"
    ],
    challenges: [
      "Tendency to withdraw and isolate",
      "Difficulty with emotional expression and connection",
      "Hoarding knowledge, time, and energy",
      "Detachment from physical and emotional needs",
      "Analysis paralysis and reluctance to act"
    ],
    inRelationships: "Fives bring intellectual depth, loyalty, and independence to relationships. They need partners who respect their need for space and don't make excessive emotional demands. They show love through sharing their inner world and knowledge rather than emotional expression.",
    careerPaths: [
      { title: "Researcher", reason: "Their analytical abilities and focus drive discoveries" },
      { title: "Software Developer", reason: "Their logical thinking creates elegant solutions" },
      { title: "Professor", reason: "Their expertise and independence suit academic life" },
      { title: "Data Scientist", reason: "Their analytical skills extract insights from complexity" },
      { title: "Technical Writer", reason: "Their ability to understand and explain complex topics" }
    ],
    growthAdvice: [
      "Engage with life rather than just observing it. Experience is knowledge too.",
      "Practice sharing your knowledge and inner world with others.",
      "Attend to your physical and emotional needs, not just intellectual ones.",
      "Take action on your ideas. Knowledge without application is incomplete.",
      "Trust that you have enough resources to engage with the world."
    ],
    famousExamples: [
      { name: "Albert Einstein", known_for: "Physicist" },
      { name: "Bill Gates", known_for: "Microsoft founder, philanthropist" },
      { name: "Stephen Hawking", known_for: "Physicist, author" },
      { name: "Jane Goodall", known_for: "Primatologist" }
    ],
    prismCorrelation: {
      likelyTypes: ["Analyst", "Architect", "Innovator"],
      keyDimensions: "High Openness + Low Extraversion + Low Agreeableness"
    }
  },

  "6": {
    number: 6,
    name: "The Loyalist",
    tagline: "The committed, security-oriented, responsible skeptic",
    coreFear: "Being without support and guidance, being alone",
    coreDesire: "To have security and support",
    coreMotivation: "To have security, to feel supported, to have certainty and reassurance",
    description: [
      "Sixes are reliable, hard-working, responsible, and trustworthy. Excellent troubleshooters, they foresee problems and foster cooperation, but can also become defensive, evasive, and anxious—running on stress while complaining about it. They can be cautious and indecisive, but also reactive, defiant, and rebellious.",
      "The Six's identity is built around loyalty and security. They are constantly scanning for threats and seeking reliable allies. This creates both their excellent troubleshooting abilities and their tendency toward anxiety and worst-case thinking.",
      "At their best, Sixes are courageous, loyal, and self-reliant. They face their fears rather than being controlled by them. They use their awareness of danger to prepare and protect rather than to worry and avoid.",
      "Sixes often struggle with trusting themselves and others. Learning to develop inner authority rather than constantly seeking external reassurance is central to their growth journey."
    ],
    healthLevels: {
      healthy: "Courageous, loyal, and self-reliant. They trust themselves and face their fears. They're excellent at building and maintaining supportive communities. They use their awareness of risk to prepare rather than worry.",
      average: "Increasingly anxious and security-focused. They may become indecisive, seeking reassurance from authorities or rebelling against them. They're hypervigilant about potential threats and may test others' loyalty.",
      unhealthy: "Paranoid, panicky, and self-defeating. They may become dependent and clingy or aggressively counterphobic. In extreme cases, they can become self-destructive or lash out at perceived threats."
    },
    wings: {
      lower: {
        name: "6w5 - The Defender",
        description: "More introverted and analytical. They combine the Six's security focus with the Five's intellectual depth, creating individuals who seek safety through knowledge. They may be more independent and less emotionally expressive."
      },
      higher: {
        name: "6w7 - The Buddy",
        description: "More extraverted and optimistic. They combine the Six's loyalty with the Seven's enthusiasm, creating individuals who build security through relationships and activities. They may be more scattered and less focused."
      }
    },
    growthLine: {
      number: 9,
      description: "In growth, Sixes move toward Nine, becoming more relaxed, trusting, and accepting. They learn to let go of anxiety and trust that things will work out. They become more peaceful and less reactive."
    },
    stressLine: {
      number: 3,
      description: "Under stress, Sixes move toward Three, becoming competitive, image-conscious, and workaholic. They may try to prove themselves through achievement rather than addressing their underlying anxiety."
    },
    strengths: [
      "Loyalty and commitment to people and causes",
      "Excellent troubleshooting and risk assessment",
      "Responsibility and follow-through",
      "Ability to build and maintain community",
      "Courage to face fears when necessary"
    ],
    challenges: [
      "Anxiety and worst-case thinking",
      "Difficulty trusting self and others",
      "Indecisiveness and seeking reassurance",
      "Projection of fears onto others",
      "Oscillation between compliance and rebellion"
    ],
    inRelationships: "Sixes bring loyalty, commitment, and protective care to relationships. They're devoted partners who take their commitments seriously. They need to watch their tendency to test partners' loyalty or project fears onto the relationship.",
    careerPaths: [
      { title: "Risk Analyst", reason: "Their ability to foresee problems prevents disasters" },
      { title: "Project Manager", reason: "Their responsibility and troubleshooting keep projects on track" },
      { title: "Paralegal", reason: "Their attention to detail and loyalty serve legal teams well" },
      { title: "Security Professional", reason: "Their awareness of threats protects organizations" },
      { title: "Nurse", reason: "Their reliability and care serve patients well" }
    ],
    growthAdvice: [
      "Practice trusting yourself. You have more inner resources than you realize.",
      "Notice when you're seeking reassurance rather than trusting your own judgment.",
      "Face fears directly rather than avoiding or projecting them.",
      "Recognize that uncertainty is part of life. You can't eliminate all risk.",
      "Build inner authority rather than depending on external guidance."
    ],
    famousExamples: [
      { name: "Princess Diana", known_for: "Princess of Wales, humanitarian" },
      { name: "Tom Hanks", known_for: "Actor" },
      { name: "Ellen DeGeneres", known_for: "Comedian, talk show host" },
      { name: "George H.W. Bush", known_for: "41st US President" }
    ],
    prismCorrelation: {
      likelyTypes: ["Guardian", "Strategist", "Connector"],
      keyDimensions: "High Conscientiousness + Low Emotional Resilience"
    }
  },

  "7": {
    number: 7,
    name: "The Enthusiast",
    tagline: "The busy, fun-loving, spontaneous adventurer",
    coreFear: "Being deprived, trapped in pain, or missing out",
    coreDesire: "To be satisfied and content, to have their needs fulfilled",
    coreMotivation: "To maintain freedom and happiness, to avoid pain, to keep themselves excited and occupied",
    description: [
      "Sevens are extroverted, optimistic, versatile, and spontaneous. Playful, high-spirited, and practical, they can also misapply their many talents, becoming over-extended, scattered, and undisciplined. They constantly seek new and exciting experiences, but can become distracted and exhausted by staying on the go.",
      "The Seven's identity is built around staying positive and pursuing pleasure. They have a remarkable ability to reframe difficulties and find silver linings. However, this can become avoidance of necessary pain and a restless inability to be present with difficult emotions.",
      "At their best, Sevens are joyful, accomplished, and deeply appreciative of life. They bring genuine enthusiasm and creativity to everything they do. They can sit with difficulty when necessary while maintaining their fundamental optimism.",
      "Sevens often struggle with depth and commitment, always looking for the next exciting thing. Learning to stay present with both pleasure and pain, rather than constantly seeking stimulation, is central to their growth."
    ],
    healthLevels: {
      healthy: "Joyful, accomplished, and deeply present. They appreciate life fully without needing constant stimulation. They can sit with difficulty when necessary. They use their enthusiasm to inspire and uplift others.",
      average: "Increasingly scattered and hyperactive. They may become superficial, materialistic, and unable to commit. They use busyness and stimulation to avoid pain and difficult emotions.",
      unhealthy: "Impulsive, escapist, and out of control. They may develop addictions or engage in reckless behavior. In extreme cases, they can become manic, offensive, and debauched."
    },
    wings: {
      lower: {
        name: "7w6 - The Entertainer",
        description: "More relationship-oriented and loyal. They combine the Seven's enthusiasm with the Six's commitment, creating individuals who seek adventure with trusted companions. They may be more anxious and less independent."
      },
      higher: {
        name: "7w8 - The Realist",
        description: "More assertive and materialistic. They combine the Seven's enthusiasm with the Eight's power, creating individuals who pursue their desires aggressively. They may be more focused and less scattered."
      }
    },
    growthLine: {
      number: 5,
      description: "In growth, Sevens move toward Five, becoming more focused, contemplative, and content with less. They learn to find depth rather than breadth, and to appreciate what they have rather than always seeking more."
    },
    stressLine: {
      number: 1,
      description: "Under stress, Sevens move toward One, becoming critical, perfectionistic, and frustrated. They may become judgmental of themselves and others when their usual optimism fails them."
    },
    strengths: [
      "Enthusiasm and positive energy",
      "Creativity and versatility",
      "Ability to reframe and find silver linings",
      "Spontaneity and sense of adventure",
      "Quick thinking and resourcefulness"
    ],
    challenges: [
      "Difficulty with commitment and follow-through",
      "Avoidance of pain and difficult emotions",
      "Scattered attention and superficiality",
      "Impulsiveness and excess",
      "FOMO and inability to be present"
    ],
    inRelationships: "Sevens bring fun, adventure, and optimism to relationships. They're enthusiastic partners who keep things exciting. They need to learn to stay present during difficult times rather than avoiding or reframing away legitimate concerns.",
    careerPaths: [
      { title: "Entrepreneur", reason: "Their enthusiasm and versatility launch new ventures" },
      { title: "Travel Writer", reason: "Their love of adventure and communication skills" },
      { title: "Event Planner", reason: "Their creativity and energy create memorable experiences" },
      { title: "Marketing Creative", reason: "Their enthusiasm and ideas generate compelling campaigns" },
      { title: "Motivational Speaker", reason: "Their optimism and energy inspire others" }
    ],
    growthAdvice: [
      "Practice staying present, even when it's uncomfortable. Depth requires stillness.",
      "Complete projects before starting new ones. Follow-through builds real capability.",
      "Allow yourself to feel pain rather than reframing or avoiding it.",
      "Recognize that commitment enables freedom rather than limiting it.",
      "Find satisfaction in what you have rather than always seeking more."
    ],
    famousExamples: [
      { name: "Robin Williams", known_for: "Actor, comedian" },
      { name: "Richard Branson", known_for: "Entrepreneur, adventurer" },
      { name: "Elton John", known_for: "Musician" },
      { name: "Jim Carrey", known_for: "Actor, comedian" }
    ],
    prismCorrelation: {
      likelyTypes: ["Explorer", "Catalyst", "Innovator"],
      keyDimensions: "High Extraversion + High Openness + Low Conscientiousness"
    }
  },

  "8": {
    number: 8,
    name: "The Challenger",
    tagline: "The powerful, dominating, self-confident leader",
    coreFear: "Being harmed or controlled by others",
    coreDesire: "To protect themselves and determine their own path",
    coreMotivation: "To be self-reliant, to prove their strength, to resist weakness, to be important in their world",
    description: [
      "Eights are self-confident, strong, and assertive. Protective, resourceful, straight-talking, and decisive, but can also be ego-centric and domineering. Eights feel they must control their environment, especially people, sometimes becoming confrontational and intimidating.",
      "The Eight's identity is built around strength and control. They learned early that the world is a place where the strong survive and the weak get hurt. This creates both their protective power and their tendency to dominate and intimidate.",
      "At their best, Eights are magnanimous leaders who use their power to protect and empower others. They have the courage to stand up for what's right and the strength to make things happen. They combine power with heart.",
      "Eights often struggle with vulnerability, seeing it as weakness. Learning to access their tender side and allow others to see it is central to their growth journey."
    ],
    healthLevels: {
      healthy: "Magnanimous, courageous, and protective. They use their power to champion others and fight for justice. They're vulnerable with those they trust and lead with heart as well as strength.",
      average: "Increasingly dominating and confrontational. They may become controlling, competitive, and unwilling to show vulnerability. They see the world in terms of power dynamics and position themselves on top.",
      unhealthy: "Ruthless, dictatorial, and destructive. They may become violent and vindictive, destroying anything they can't control. In extreme cases, they can become sociopathic and murderous."
    },
    wings: {
      lower: {
        name: "8w7 - The Maverick",
        description: "More extraverted and adventurous. They combine the Eight's power with the Seven's enthusiasm, creating individuals who pursue their desires with energy and charm. They may be more scattered and less focused."
      },
      higher: {
        name: "8w9 - The Bear",
        description: "More grounded and receptive. They combine the Eight's strength with the Nine's calmness, creating individuals who are powerful but less aggressive. They may be more patient and less confrontational."
      }
    },
    growthLine: {
      number: 2,
      description: "In growth, Eights move toward Two, becoming more caring, nurturing, and connected to others. They learn to use their strength to serve rather than dominate. They become more tender and emotionally available."
    },
    stressLine: {
      number: 5,
      description: "Under stress, Eights move toward Five, becoming withdrawn, secretive, and fearful. They may retreat and become suspicious rather than confronting challenges directly. They lose their characteristic confidence."
    },
    strengths: [
      "Strength and decisiveness",
      "Courage to face challenges directly",
      "Protective instinct for the vulnerable",
      "Ability to make things happen",
      "Authenticity and directness"
    ],
    challenges: [
      "Difficulty with vulnerability and tenderness",
      "Tendency to dominate and control",
      "Intimidating presence that pushes others away",
      "Denial of fear and weakness",
      "Excessive confrontation and aggression"
    ],
    inRelationships: "Eights bring strength, protection, and passion to relationships. They're loyal partners who will fight for those they love. They need to learn to be vulnerable and to not dominate their partners.",
    careerPaths: [
      { title: "CEO/Executive", reason: "Their decisiveness and strength lead organizations effectively" },
      { title: "Trial Lawyer", reason: "Their confrontational style and strength serve courtroom advocacy" },
      { title: "Entrepreneur", reason: "Their drive and willingness to take risks build businesses" },
      { title: "Political Leader", reason: "Their power and decisiveness drive policy change" },
      { title: "Emergency Responder", reason: "Their courage and quick action save lives" }
    ],
    growthAdvice: [
      "Practice vulnerability. Showing weakness takes more courage than hiding it.",
      "Use your power to serve rather than dominate. True strength lifts others up.",
      "Listen before acting. Others' perspectives have value.",
      "Recognize that control is an illusion. You can't protect yourself from everything.",
      "Allow yourself to need others. Independence taken too far becomes isolation."
    ],
    famousExamples: [
      { name: "Martin Luther King Jr.", known_for: "Civil rights leader" },
      { name: "Winston Churchill", known_for: "British Prime Minister" },
      { name: "Serena Williams", known_for: "Tennis champion" },
      { name: "Kamala Harris", known_for: "US Vice President" }
    ],
    prismCorrelation: {
      likelyTypes: ["Achiever", "Strategist", "Catalyst"],
      keyDimensions: "Low Agreeableness + High Extraversion + High Emotional Resilience"
    }
  },

  "9": {
    number: 9,
    name: "The Peacemaker",
    tagline: "The easygoing, self-effacing, agreeable mediator",
    coreFear: "Loss of connection, fragmentation, separation",
    coreDesire: "To have inner stability and peace of mind",
    coreMotivation: "To create harmony, to avoid conflict, to preserve things as they are, to resist whatever would upset them",
    description: [
      "Nines are accepting, trusting, and stable. They are usually creative, optimistic, and supportive, but can also be too willing to go along with others to keep the peace. They want everything to go smoothly and be without conflict, but they can also tend to be complacent, simplifying problems and minimizing anything upsetting.",
      "The Nine's identity is built around maintaining peace and connection. They have a remarkable ability to see all perspectives and create harmony. However, this can become self-forgetting as they merge with others' agendas rather than asserting their own.",
      "At their best, Nines are powerful peacemakers who bring people together while maintaining their own center. They have the rare ability to see all sides of an issue without losing their own perspective. They're grounded, present, and genuinely inclusive.",
      "Nines often struggle with asserting themselves and their own priorities. Learning to wake up to their own desires and take action on their own behalf is central to their growth journey."
    ],
    healthLevels: {
      healthy: "Self-possessed, present, and genuinely peaceful. They maintain their own center while connecting with others. They're powerful mediators who take action on what matters. They're grounded and fully engaged with life.",
      average: "Increasingly accommodating and conflict-avoidant. They may become passive, disengaged, and complacent. They go along to get along, losing touch with their own priorities and desires.",
      unhealthy: "Neglectful, dissociated, and ineffectual. They may become depressed, stubborn, and completely disengaged. In extreme cases, they can become so disconnected that they can't function."
    },
    wings: {
      lower: {
        name: "9w8 - The Referee",
        description: "More assertive and grounded. They combine the Nine's peacemaking with the Eight's strength, creating individuals who can maintain peace while standing their ground. They may be more confrontational and less accommodating."
      },
      higher: {
        name: "9w1 - The Dreamer",
        description: "More idealistic and principled. They combine the Nine's harmony-seeking with the One's sense of right, creating individuals who pursue peace through principle. They may be more critical and less easygoing."
      }
    },
    growthLine: {
      number: 3,
      description: "In growth, Nines move toward Three, becoming more self-developing, energetic, and focused on their own goals. They learn to assert themselves and take action on their own behalf. They become more present and engaged."
    },
    stressLine: {
      number: 6,
      description: "Under stress, Nines move toward Six, becoming anxious, reactive, and suspicious. They may become worried and indecisive, losing their characteristic calm. They seek reassurance rather than maintaining inner peace."
    },
    strengths: [
      "Ability to see all perspectives",
      "Creating harmony and bringing people together",
      "Patience and acceptance",
      "Groundedness and stability",
      "Genuine inclusivity and openness"
    ],
    challenges: [
      "Difficulty asserting own needs and priorities",
      "Tendency to merge with others' agendas",
      "Complacency and resistance to change",
      "Passive-aggressive expression of anger",
      "Numbing out and disengaging from life"
    ],
    inRelationships: "Nines bring acceptance, patience, and stability to relationships. They're supportive partners who create harmonious environments. They need to learn to express their own needs and not lose themselves in their partners' priorities.",
    careerPaths: [
      { title: "Mediator", reason: "Their ability to see all sides resolves conflicts" },
      { title: "Counselor", reason: "Their acceptance and patience help others heal" },
      { title: "Human Resources", reason: "Their harmony-seeking creates positive work environments" },
      { title: "Diplomat", reason: "Their ability to understand all perspectives bridges divides" },
      { title: "Editor", reason: "Their ability to see the whole picture improves work" }
    ],
    growthAdvice: [
      "Practice asserting your own needs and priorities. Your desires matter.",
      "Notice when you're going along to avoid conflict. Is it worth the cost?",
      "Take action on your own goals rather than just supporting others'.",
      "Express anger directly rather than through passive resistance.",
      "Stay present and engaged rather than numbing out."
    ],
    famousExamples: [
      { name: "Barack Obama", known_for: "44th US President" },
      { name: "Queen Elizabeth II", known_for: "British monarch" },
      { name: "Morgan Freeman", known_for: "Actor" },
      { name: "Dalai Lama", known_for: "Spiritual leader" }
    ],
    prismCorrelation: {
      likelyTypes: ["Stabilizer", "Harmonizer", "Guardian"],
      keyDimensions: "High Agreeableness + High Emotional Resilience + Low Extraversion"
    }
  }
};

/**
 * Get all Enneagram type numbers for static generation
 */
export function getAllEnneagramTypes(): string[] {
  return Object.keys(enneagramTypes);
}

/**
 * Get Enneagram type content by number
 */
export function getEnneagramTypeContent(typeNumber: string): EnneagramType | null {
  return enneagramTypes[typeNumber] || null;
}

