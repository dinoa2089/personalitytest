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
  famousExamples: Array<{ name: string; known_for: string; image_url?: string }>;
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
      { name: "Mahatma Gandhi", known_for: "Independence leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/440px-Mahatma-Gandhi%2C_studio%2C_1931.jpg" },
      { name: "Michelle Obama", known_for: "Former First Lady, advocate", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Michelle_Obama_2013_official_portrait.jpg/440px-Michelle_Obama_2013_official_portrait.jpg" },
      { name: "Martha Stewart", known_for: "Businesswoman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Martha_Stewart_2011_Shankbone_2.JPG/440px-Martha_Stewart_2011_Shankbone_2.JPG" },
      { name: "Nelson Mandela", known_for: "Anti-apartheid leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/440px-Nelson_Mandela_1994.jpg" },
      { name: "Hillary Clinton", known_for: "Secretary of State", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Hillary_Clinton_official_Secretary_of_State_portrait_crop.jpg/440px-Hillary_Clinton_official_Secretary_of_State_portrait_crop.jpg" },
      { name: "Margaret Thatcher", known_for: "UK Prime Minister", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Margaret_Thatcher_stock_portrait_%28cropped%29.jpg/440px-Margaret_Thatcher_stock_portrait_%28cropped%29.jpg" },
      { name: "Jerry Seinfeld", known_for: "Comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Jerry_Seinfeld_2016_-_2.jpg/440px-Jerry_Seinfeld_2016_-_2.jpg" },
      { name: "Tina Fey", known_for: "Comedian, writer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tina_Fey_Muppets_Most_Wanted_Premiere_%28cropped%29.jpg/440px-Tina_Fey_Muppets_Most_Wanted_Premiere_%28cropped%29.jpg" },
      { name: "Kate Middleton", known_for: "Princess of Wales", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Catherine%2C_Duchess_of_Cambridge_in_2019.jpg/440px-Catherine%2C_Duchess_of_Cambridge_in_2019.jpg" },
      { name: "Al Gore", known_for: "Vice President, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Al_Gore%2C_Vice_President_of_the_United_States%2C_official_portrait_1994.jpg/440px-Al_Gore%2C_Vice_President_of_the_United_States%2C_official_portrait_1994.jpg" },
      { name: "Harrison Ford", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Harrison_Ford_by_Gage_Skidmore_3.jpg/440px-Harrison_Ford_by_Gage_Skidmore_3.jpg" },
      { name: "Emma Watson", known_for: "Actress, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Emma_Watson_2013.jpg/440px-Emma_Watson_2013.jpg" },
      { name: "Confucius", known_for: "Philosopher", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Confucius_Tang_Dynasty.jpg/440px-Confucius_Tang_Dynasty.jpg" },
      { name: "Ruth Bader Ginsburg", known_for: "Supreme Court Justice", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ruth_Bader_Ginsburg_official_SCOTUS_portrait.jpg/440px-Ruth_Bader_Ginsburg_official_SCOTUS_portrait.jpg" },
      { name: "Gregory Peck", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Gregory_Peck_1948.jpg/440px-Gregory_Peck_1948.jpg" },
      { name: "Meryl Streep", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Meryl_Streep_at_the_Tokyo_International_Film_Festival_2016_%2833203187655%29_%28cropped%29.jpg/440px-Meryl_Streep_at_the_Tokyo_International_Film_Festival_2016_%2833203187655%29_%28cropped%29.jpg" },
      { name: "Plato", known_for: "Philosopher", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Plato_Silanion_Musei_Capitolini_MC1377.jpg/440px-Plato_Silanion_Musei_Capitolini_MC1377.jpg" },
      { name: "Jane Fonda", known_for: "Actress, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Jane_Fonda_Cannes_2015.jpg/440px-Jane_Fonda_Cannes_2015.jpg" },
      { name: "Prince Charles", known_for: "King of England", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/King_Charles_III_%282024%29.jpg/440px-King_Charles_III_%282024%29.jpg" },
      { name: "Captain Picard", known_for: "Star Trek character", image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/3/32/Patrick_Stewart_as_Jean-Luc_Picard.jpg/440px-Patrick_Stewart_as_Jean-Luc_Picard.jpg" }
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
      { name: "Mother Teresa", known_for: "Humanitarian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mother_Teresa_1.jpg/440px-Mother_Teresa_1.jpg" },
      { name: "Dolly Parton", known_for: "Singer, philanthropist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Dolly_Parton_2016.jpg/440px-Dolly_Parton_2016.jpg" },
      { name: "Desmond Tutu", known_for: "Archbishop, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Desmond_Tutu_2013.jpg/440px-Desmond_Tutu_2013.jpg" },
      { name: "Mr. Rogers", known_for: "Television host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Fred_Rogers%2C_late_1960s.jpg/440px-Fred_Rogers%2C_late_1960s.jpg" },
      { name: "Pope Francis", known_for: "Head of Catholic Church", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Pope_Francis_in_March_2013.jpg/440px-Pope_Francis_in_March_2013.jpg" },
      { name: "Princess Diana", known_for: "Princess of Wales", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Diana%2C_Princess_of_Wales_1997_%282%29.jpg/440px-Diana%2C_Princess_of_Wales_1997_%282%29.jpg" },
      { name: "Nancy Reagan", known_for: "Former First Lady", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Nancy_Reagan_portrait.jpg/440px-Nancy_Reagan_portrait.jpg" },
      { name: "Lewis Carroll", known_for: "Author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Lewis_Carroll_1863.jpg/440px-Lewis_Carroll_1863.jpg" },
      { name: "Barbara Bush", known_for: "Former First Lady", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Barbara_Bush_portrait.jpg/440px-Barbara_Bush_portrait.jpg" },
      { name: "Bishop Fulton Sheen", known_for: "Catholic bishop", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Archbishop_Sheen.png/440px-Archbishop_Sheen.png" },
      { name: "Jessica Alba", known_for: "Actress, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Jessica_Alba_2019_by_Glenn_Francis.jpg/440px-Jessica_Alba_2019_by_Glenn_Francis.jpg" },
      { name: "Ann Landers", known_for: "Advice columnist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ann_Landers_1961.jpg/440px-Ann_Landers_1961.jpg" },
      { name: "Florence Nightingale", known_for: "Nursing pioneer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Florence_Nightingale_%28H_Hering_NPG_x82368%29.jpg/440px-Florence_Nightingale_%28H_Hering_NPG_x82368%29.jpg" },
      { name: "Eleanor Roosevelt", known_for: "First Lady, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Eleanor_Roosevelt_portrait_1933.jpg/440px-Eleanor_Roosevelt_portrait_1933.jpg" },
      { name: "Sally Field", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Sally_Field_cropped.jpg/440px-Sally_Field_cropped.jpg" },
      { name: "Jennifer Garner", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/JenniferGarnerAug07.jpg/440px-JenniferGarnerAug07.jpg" },
      { name: "Stevie Wonder", known_for: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Stevie_Wonder_1973.JPG/440px-Stevie_Wonder_1973.JPG" },
      { name: "Celine Dion", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/C%C3%A9line_Dion_2012.jpg/440px-C%C3%A9line_Dion_2012.jpg" },
      { name: "John Denver", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/John_Denver_1975.jpg/440px-John_Denver_1975.jpg" },
      { name: "Barry Manilow", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Barry_Manilow_2010_colour.jpg/440px-Barry_Manilow_2010_colour.jpg" }
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
      { name: "Oprah Winfrey", known_for: "Media mogul", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/440px-Oprah_in_2014.jpg" },
      { name: "Tony Robbins", known_for: "Motivational speaker", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Tony_Robbins.jpg/440px-Tony_Robbins.jpg" },
      { name: "Taylor Swift", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/440px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png" },
      { name: "Tom Cruise", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Tom_Cruise_by_Gage_Skidmore_2.jpg/440px-Tom_Cruise_by_Gage_Skidmore_2.jpg" },
      { name: "Dwayne Johnson", known_for: "Actor, wrestler", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dwayne_Johnson_2014_%28cropped%29.jpg/440px-Dwayne_Johnson_2014_%28cropped%29.jpg" },
      { name: "Will Smith", known_for: "Actor, rapper", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TechCrunch_Disrupt_2019_%2848834434641%29_%28cropped%29.jpg/440px-TechCrunch_Disrupt_2019_%2848834434641%29_%28cropped%29.jpg" },
      { name: "Muhammad Ali", known_for: "Boxing legend", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Muhammad_Ali_NYWTS.jpg/440px-Muhammad_Ali_NYWTS.jpg" },
      { name: "Arnold Schwarzenegger", known_for: "Actor, Governor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/A._Schwarzenegger.jpg/440px-A._Schwarzenegger.jpg" },
      { name: "Lady Gaga", known_for: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lady_Gaga_at_the_2019_Venice_Film_Festival.jpg/440px-Lady_Gaga_at_the_2019_Venice_Film_Festival.jpg" },
      { name: "Bill Clinton", known_for: "42nd US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/440px-Bill_Clinton.jpg" },
      { name: "Tiger Woods", known_for: "Professional golfer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TigerWoodsOfficialPortrait.jpg/440px-TigerWoodsOfficialPortrait.jpg" },
      { name: "Madonna", known_for: "Singer, entertainer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Madonna_-_Rebel_Heart_Tour_2015_-_Berlin_1_%28cropped%29.jpg/440px-Madonna_-_Rebel_Heart_Tour_2015_-_Berlin_1_%28cropped%29.jpg" },
      { name: "Beyoncé", known_for: "Singer, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png/440px-Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png" },
      { name: "Michael Jordan", known_for: "Basketball legend", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/440px-Michael_Jordan_in_2014.jpg" },
      { name: "Chris Rock", known_for: "Comedian, actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Chris_Rock_WE_2012_Shankbone.JPG/440px-Chris_Rock_WE_2012_Shankbone.JPG" },
      { name: "Reese Witherspoon", known_for: "Actress, producer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Reese_Witherspoon_2014.jpg/440px-Reese_Witherspoon_2014.jpg" },
      { name: "Ryan Seacrest", known_for: "TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Ryan_Seacrest_2018.png/440px-Ryan_Seacrest_2018.png" },
      { name: "Kris Jenner", known_for: "Media personality", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Kris_Jenner_2019.jpg/440px-Kris_Jenner_2019.jpg" },
      { name: "Mitt Romney", known_for: "Senator, businessman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Mitt_Romney_official_US_Senate_portrait.jpg/440px-Mitt_Romney_official_US_Senate_portrait.jpg" },
      { name: "Werner Erhard", known_for: "Self-help pioneer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Werner_Erhard_c1980.jpg/440px-Werner_Erhard_c1980.jpg" }
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
      { name: "Frida Kahlo", known_for: "Artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/440px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg" },
      { name: "Prince", known_for: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Prince_at_Coachella_%28cropped%29.jpg/440px-Prince_at_Coachella_%28cropped%29.jpg" },
      { name: "Virginia Woolf", known_for: "Author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg/440px-George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg" },
      { name: "Johnny Depp", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Johnny_Depp-2757_%28cropped%29.jpg/440px-Johnny_Depp-2757_%28cropped%29.jpg" },
      { name: "Amy Winehouse", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Amy_Winehouse_-_synth.jpg/440px-Amy_Winehouse_-_synth.jpg" },
      { name: "Edgar Allan Poe", known_for: "Author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Edgar_Allan_Poe_2_retouched_and_transparent_bg.png/440px-Edgar_Allan_Poe_2_retouched_and_transparent_bg.png" },
      { name: "Billie Eilish", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Billie_Eilish_2019_by_Glenn_Francis_%28cropped%29_2.jpg/440px-Billie_Eilish_2019_by_Glenn_Francis_%28cropped%29_2.jpg" },
      { name: "Vincent van Gogh", known_for: "Artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/440px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg" },
      { name: "Kate Bush", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kate_Bush_%281978%29.jpg/440px-Kate_Bush_%281978%29.jpg" },
      { name: "Bob Dylan", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Bob_Dylan_-_Azkena_Rock_Festival_2010_2.jpg/440px-Bob_Dylan_-_Azkena_Rock_Festival_2010_2.jpg" },
      { name: "Joni Mitchell", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Joni_Mitchell_1974.jpg/440px-Joni_Mitchell_1974.jpg" },
      { name: "Kurt Cobain", known_for: "Nirvana frontman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Nirvana_around_1992.jpg/440px-Nirvana_around_1992.jpg" },
      { name: "Sylvia Plath", known_for: "Poet", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Plath%2C_Sylvia_%281932-1963%29.jpg/440px-Plath%2C_Sylvia_%281932-1963%29.jpg" },
      { name: "James Dean", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/James_Dean_-_publicity_-_early.jpg/440px-James_Dean_-_publicity_-_early.jpg" },
      { name: "Lana Del Rey", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Lana_Del_Rey%40Splendour_%28cropped_2%29.jpg/440px-Lana_Del_Rey%40Splendour_%28cropped_2%29.jpg" },
      { name: "Tchaikovsky", known_for: "Composer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Portr%C3%A4t_des_Komponisten_Pjotr_I._Tschaikowski_%281840-1893%29.jpg/440px-Portr%C3%A4t_des_Komponisten_Pjotr_I._Tschaikowski_%281840-1893%29.jpg" },
      { name: "Michael Jackson", known_for: "King of Pop", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Michael_Jackson_in_1988.jpg/440px-Michael_Jackson_in_1988.jpg" },
      { name: "Marlon Brando", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Marlon_Brando_publicity_for_A_Streetcar_Named_Desire.jpg/440px-Marlon_Brando_publicity_for_A_Streetcar_Named_Desire.jpg" },
      { name: "Winona Ryder", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Winona_Ryder_2010_TIFF_%28adjusted%29.jpg/440px-Winona_Ryder_2010_TIFF_%28adjusted%29.jpg" },
      { name: "Nicolas Cage", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Nicolas_Cage_2011_CC.jpg/440px-Nicolas_Cage_2011_CC.jpg" }
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
      { name: "Albert Einstein", known_for: "Physicist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/440px-Albert_Einstein_Head.jpg" },
      { name: "Bill Gates", known_for: "Microsoft founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/440px-Bill_Gates_2017_%28cropped%29.jpg" },
      { name: "Stephen Hawking", known_for: "Physicist, author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/440px-Stephen_Hawking.StarChild.jpg" },
      { name: "Jane Goodall", known_for: "Primatologist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Jane_Goodall_HK.jpg/440px-Jane_Goodall_HK.jpg" },
      { name: "Mark Zuckerberg", known_for: "Meta CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/440px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg" },
      { name: "Emily Dickinson", known_for: "Poet", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Emily_Dickinson_daguerreotype.jpg/440px-Emily_Dickinson_daguerreotype.jpg" },
      { name: "Jodie Foster", known_for: "Actress, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jodie_Foster_%28cropped%29.jpg/440px-Jodie_Foster_%28cropped%29.jpg" },
      { name: "Tim Burton", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tim_Burton_%282012%29_3.jpg/440px-Tim_Burton_%282012%29_3.jpg" },
      { name: "Stanley Kubrick", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/KubrickForLook_%28cropped%29.jpg/440px-KubrickForLook_%28cropped%29.jpg" },
      { name: "Isaac Newton", known_for: "Physicist, mathematician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Portrait_of_Sir_Isaac_Newton%2C_1689.jpg/440px-Portrait_of_Sir_Isaac_Newton%2C_1689.jpg" },
      { name: "Sigourney Weaver", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Sigourney_Weaver_by_Gage_Skidmore.jpg/440px-Sigourney_Weaver_by_Gage_Skidmore.jpg" },
      { name: "Oliver Sacks", known_for: "Neurologist, author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Dr._Oliver_Sacks%2C_New_York_City%2C_2009.jpg/440px-Dr._Oliver_Sacks%2C_New_York_City%2C_2009.jpg" },
      { name: "Bobby Fischer", known_for: "Chess grandmaster", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Bobby_Fischer_1960_in_Leipzig.jpg/440px-Bobby_Fischer_1960_in_Leipzig.jpg" },
      { name: "Gary Larson", known_for: "Cartoonist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/GaryLarson.jpg/440px-GaryLarson.jpg" },
      { name: "Agatha Christie", known_for: "Mystery novelist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Agatha_Christie.png/440px-Agatha_Christie.png" },
      { name: "Jesse Eisenberg", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jesse_Eisenberg_by_Gage_Skidmore.jpg/440px-Jesse_Eisenberg_by_Gage_Skidmore.jpg" },
      { name: "David Byrne", known_for: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/David_Byrne_2019.jpg/440px-David_Byrne_2019.jpg" },
      { name: "Ursula K. Le Guin", known_for: "Author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Ursula_K._Le_Guin_at_Worldcon_2018.jpg/440px-Ursula_K._Le_Guin_at_Worldcon_2018.jpg" },
      { name: "Tilda Swinton", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Tilda_Swinton_2018_%28cropped%29.jpg/440px-Tilda_Swinton_2018_%28cropped%29.jpg" },
      { name: "Anthony Fauci", known_for: "Immunologist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Anthony_Fauci_official_portrait_%28cropped_2%29.jpg/440px-Anthony_Fauci_official_portrait_%28cropped_2%29.jpg" }
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
      { name: "Princess Diana", known_for: "Princess of Wales", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Diana%2C_Princess_of_Wales_1997_%282%29.jpg/440px-Diana%2C_Princess_of_Wales_1997_%282%29.jpg" },
      { name: "Tom Hanks", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/440px-Tom_Hanks_TIFF_2019.jpg" },
      { name: "Ellen DeGeneres", known_for: "TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Ellen_DeGeneres_2011.jpg/440px-Ellen_DeGeneres_2011.jpg" },
      { name: "George H.W. Bush", known_for: "41st US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/George_H._W._Bush%2C_President_of_the_United_States%2C_1989_official_portrait_%28cropped%29.jpg/440px-George_H._W._Bush%2C_President_of_the_United_States%2C_1989_official_portrait_%28cropped%29.jpg" },
      { name: "Jennifer Aniston", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/JenniferAnistonHWoFOct2011.jpg/440px-JenniferAnistonHWoFOct2011.jpg" },
      { name: "Mark Twain", known_for: "Author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mark_Twain_by_AF_Bradley.jpg/440px-Mark_Twain_by_AF_Bradley.jpg" },
      { name: "Woody Allen", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Woody_Allen_Cannes_2016.jpg/440px-Woody_Allen_Cannes_2016.jpg" },
      { name: "Ben Affleck", known_for: "Actor, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ben_Affleck_by_Gage_Skidmore_3.jpg/440px-Ben_Affleck_by_Gage_Skidmore_3.jpg" },
      { name: "Julia Roberts", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Julia_Roberts_2011.jpg/440px-Julia_Roberts_2011.jpg" },
      { name: "Jon Stewart", known_for: "TV host, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Jon_Stewart_2016.jpg/440px-Jon_Stewart_2016.jpg" },
      { name: "Spike Lee", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Spike_Lee_Cannes_2018.jpg/440px-Spike_Lee_Cannes_2018.jpg" },
      { name: "J. Edgar Hoover", known_for: "FBI Director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/J._Edgar_Hoover%2C_April_1940.jpg/440px-J._Edgar_Hoover%2C_April_1940.jpg" },
      { name: "Mel Gibson", known_for: "Actor, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Mel_Gibson_Cannes_2016.jpg/440px-Mel_Gibson_Cannes_2016.jpg" },
      { name: "David Letterman", known_for: "TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/David_Letterman_2012.jpg/440px-David_Letterman_2012.jpg" },
      { name: "Richard Nixon", known_for: "37th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Richard_Nixon_presidential_portrait_%281%29.jpg/440px-Richard_Nixon_presidential_portrait_%281%29.jpg" },
      { name: "Malcolm X", known_for: "Civil rights leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Malcolm_X_NYWTS_4.jpg/440px-Malcolm_X_NYWTS_4.jpg" },
      { name: "Marilyn Monroe", known_for: "Actress, icon", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Marilyn_Monroe_in_1952.jpg/440px-Marilyn_Monroe_in_1952.jpg" },
      { name: "Robert F. Kennedy", known_for: "Senator, Attorney General", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Robert_F_Kennedy_crop.jpg/440px-Robert_F_Kennedy_crop.jpg" },
      { name: "Diane Keaton", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Diane_Keaton_-_1977.jpg/440px-Diane_Keaton_-_1977.jpg" },
      { name: "Rush Limbaugh", known_for: "Radio host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Rush_Limbaugh_February_2018.jpg/440px-Rush_Limbaugh_February_2018.jpg" }
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
      { name: "Robin Williams", known_for: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Robin_Williams_2011a_%282%29.jpg/440px-Robin_Williams_2011a_%282%29.jpg" },
      { name: "Richard Branson", known_for: "Entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Richard_Branson_March_2015_%28cropped%29.jpg/440px-Richard_Branson_March_2015_%28cropped%29.jpg" },
      { name: "Elton John", known_for: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Elton_John_2017.jpg/440px-Elton_John_2017.jpg" },
      { name: "Jim Carrey", known_for: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Jim_Carrey_2008.jpg/440px-Jim_Carrey_2008.jpg" },
      { name: "Steven Spielberg", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Steven_Spielberg_Masterclass_Cin%C3%A9math%C3%A8que_Fran%C3%A7aise_2_cropped.jpg/440px-Steven_Spielberg_Masterclass_Cin%C3%A9math%C3%A8que_Fran%C3%A7aise_2_cropped.jpg" },
      { name: "Miley Cyrus", known_for: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Miley_Cyrus_-_Wrecking_Ball_Live_-_London%2C_UK.png/440px-Miley_Cyrus_-_Wrecking_Ball_Live_-_London%2C_UK.png" },
      { name: "Russell Brand", known_for: "Comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Russell_Brand_Arthur_Premiere.jpg/440px-Russell_Brand_Arthur_Premiere.jpg" },
      { name: "Brad Pitt", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg/440px-Brad_Pitt_2019_by_Glenn_Francis.jpg" },
      { name: "Cameron Diaz", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Cameron_Diaz_2012.jpg/440px-Cameron_Diaz_2012.jpg" },
      { name: "Jack Black", known_for: "Actor, musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Jack_Black_by_Gage_Skidmore.jpg/440px-Jack_Black_by_Gage_Skidmore.jpg" },
      { name: "Mozart", known_for: "Composer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Croce-Mozart-Detail.jpg/440px-Croce-Mozart-Detail.jpg" },
      { name: "Bette Midler", known_for: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Bette_Midler_4%2C_bw.jpg/440px-Bette_Midler_4%2C_bw.jpg" },
      { name: "Eddie Murphy", known_for: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Eddie_Murphy_by_David_Shankbone.jpg/440px-Eddie_Murphy_by_David_Shankbone.jpg" },
      { name: "John F. Kennedy", known_for: "35th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/John_F._Kennedy%2C_White_House_color_photo_portrait.jpg/440px-John_F._Kennedy%2C_White_House_color_photo_portrait.jpg" },
      { name: "Sarah Silverman", known_for: "Comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Sarah_Silverman_2019.jpg/440px-Sarah_Silverman_2019.jpg" },
      { name: "Katy Perry", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Katy_Perry_2019_%28cropped%29.jpg/440px-Katy_Perry_2019_%28cropped%29.jpg" },
      { name: "Howard Stern", known_for: "Radio host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Howard_Stern_at_the_2012_Tribeca_Film_Festival.jpg/440px-Howard_Stern_at_the_2012_Tribeca_Film_Festival.jpg" },
      { name: "Benjamin Franklin", known_for: "Founding Father", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/BenFranklinDupworked.jpg/440px-BenFranklinDupworked.jpg" },
      { name: "Conan O'Brien", known_for: "TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Conan_O%27Brien_2016_%28cropped%29.jpg/440px-Conan_O%27Brien_2016_%28cropped%29.jpg" },
      { name: "Timothy Leary", known_for: "Psychologist, author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Timothy_Leary_in_1989.jpg/440px-Timothy_Leary_in_1989.jpg" }
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
      { name: "Martin Luther King Jr.", known_for: "Civil rights leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Martin_Luther_King%2C_Jr..jpg/440px-Martin_Luther_King%2C_Jr..jpg" },
      { name: "Winston Churchill", known_for: "British PM", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sir_Winston_Churchill_-_19086236948.jpg/440px-Sir_Winston_Churchill_-_19086236948.jpg" },
      { name: "Serena Williams", known_for: "Tennis champion", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Serena_Williams_at_2013_US_Open.jpg/440px-Serena_Williams_at_2013_US_Open.jpg" },
      { name: "Kamala Harris", known_for: "US Vice President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Kamala_Harris_Vice_Presidential_Portrait.jpg/440px-Kamala_Harris_Vice_Presidential_Portrait.jpg" },
      { name: "Donald Trump", known_for: "45th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/440px-Donald_Trump_official_portrait.jpg" },
      { name: "Franklin D. Roosevelt", known_for: "32nd US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/FDR_1944_Color_Portrait.jpg/440px-FDR_1944_Color_Portrait.jpg" },
      { name: "Barbara Walters", known_for: "Journalist, TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Barbara_Walters_in_2011.jpg/440px-Barbara_Walters_in_2011.jpg" },
      { name: "Ernest Hemingway", known_for: "Author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/ErnestHemingway.jpg/440px-ErnestHemingway.jpg" },
      { name: "Jack Nicholson", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Jack_Nicholson_2001.jpg/440px-Jack_Nicholson_2001.jpg" },
      { name: "Sean Connery", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Sean_Connery_%281983%29.jpg/440px-Sean_Connery_%281983%29.jpg" },
      { name: "Pink", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Pink_2019_by_Glenn_Francis.jpg/440px-Pink_2019_by_Glenn_Francis.jpg" },
      { name: "Queen Latifah", known_for: "Rapper, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Queen_Latifah_2019.jpg/440px-Queen_Latifah_2019.jpg" },
      { name: "Russell Crowe", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Russell_Crowe_%28Man_of_Steel_London_premiere%2C_2013%29.jpg/440px-Russell_Crowe_%28Man_of_Steel_London_premiere%2C_2013%29.jpg" },
      { name: "Fidel Castro", known_for: "Cuban leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Fidel_Castro.jpg/440px-Fidel_Castro.jpg" },
      { name: "Clint Eastwood", known_for: "Actor, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Clint_Eastwood_at_2010_New_York_Film_Festival.jpg/440px-Clint_Eastwood_at_2010_New_York_Film_Festival.jpg" },
      { name: "Roseanne Barr", known_for: "Comedian, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Roseanne_Barr_2011.jpg/440px-Roseanne_Barr_2011.jpg" },
      { name: "Tommy Lee Jones", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Tommy_Lee_Jones_2017.jpg/440px-Tommy_Lee_Jones_2017.jpg" },
      { name: "John McCain", known_for: "Senator", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/John_McCain_official_portrait_2009.jpg/440px-John_McCain_official_portrait_2009.jpg" },
      { name: "Indira Gandhi", known_for: "Indian Prime Minister", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Indira_Gandhi_1966.jpg/440px-Indira_Gandhi_1966.jpg" },
      { name: "50 Cent", known_for: "Rapper, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/50_Cent_in_2012.jpg/440px-50_Cent_in_2012.jpg" }
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
      { name: "Barack Obama", known_for: "44th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/440px-President_Barack_Obama.jpg" },
      { name: "Queen Elizabeth II", known_for: "British monarch", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Queen_Elizabeth_II_in_March_2015.jpg/440px-Queen_Elizabeth_II_in_March_2015.jpg" },
      { name: "Morgan Freeman", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg/440px-Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg" },
      { name: "Dalai Lama", known_for: "Spiritual leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/14th_Dalai_Lama.jpg/440px-14th_Dalai_Lama.jpg" },
      { name: "Abraham Lincoln", known_for: "16th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/440px-Abraham_Lincoln_O-77_matte_collodion_print.jpg" },
      { name: "Keanu Reeves", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Keanu_Reeves_2019_%28cropped%29.jpg/440px-Keanu_Reeves_2019_%28cropped%29.jpg" },
      { name: "Carl Rogers", known_for: "Psychologist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Carl_Ransom_Rogers.jpg/440px-Carl_Ransom_Rogers.jpg" },
      { name: "Ron Howard", known_for: "Director, actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ron_Howard_2011_Shankbone.JPG/440px-Ron_Howard_2011_Shankbone.JPG" },
      { name: "Lisa Kudrow", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Lisa_Kudrow_2019_by_Glenn_Francis.jpg/440px-Lisa_Kudrow_2019_by_Glenn_Francis.jpg" },
      { name: "Ringo Starr", known_for: "Beatles drummer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Ringo_Starr_%282019%29.jpg/440px-Ringo_Starr_%282019%29.jpg" },
      { name: "Grace Kelly", known_for: "Actress, Princess", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Grace_Kelly_1956.jpg/440px-Grace_Kelly_1956.jpg" },
      { name: "Whoopi Goldberg", known_for: "Actress, TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Whoopi_Goldberg_at_the_2010_Time_100.jpg/440px-Whoopi_Goldberg_at_the_2010_Time_100.jpg" },
      { name: "Jeff Bridges", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Jeff_Bridges_2017.jpg/440px-Jeff_Bridges_2017.jpg" },
      { name: "Gloria Steinem", known_for: "Feminist activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Gloria_Steinem_at_news_conference%2C_Women%27s_Action_Alliance%2C_January_12%2C_1972_%28cropped%29.jpg/440px-Gloria_Steinem_at_news_conference%2C_Women%27s_Action_Alliance%2C_January_12%2C_1972_%28cropped%29.jpg" },
      { name: "Jim Henson", known_for: "Puppeteer, creator of Muppets", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Jim_Henson_%28 1989%29.jpg/440px-Jim_Henson_%281989%29.jpg" },
      { name: "Woody Harrelson", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Woody_Harrelson_%2850564940853%29_%28cropped%29.jpg/440px-Woody_Harrelson_%2850564940853%29_%28cropped%29.jpg" },
      { name: "Renee Zellweger", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Ren%C3%A9e_Zellweger_%2830232953572%29_%28cropped%29.jpg/440px-Ren%C3%A9e_Zellweger_%2830232953572%29_%28cropped%29.jpg" },
      { name: "Joseph Campbell", known_for: "Mythologist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Joan_Halifax_and_Joseph_Campbell.jpg/440px-Joan_Halifax_and_Joseph_Campbell.jpg" },
      { name: "Walt Disney", known_for: "Animator, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Walt_Disney_1946.JPG/440px-Walt_Disney_1946.JPG" },
      { name: "Audrey Hepburn", known_for: "Actress, humanitarian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Audrey_Hepburn_1959.jpg/440px-Audrey_Hepburn_1959.jpg" }
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
 * Get Enneagram type content by number (uses expanded 7500+ word content)
 */
export function getEnneagramTypeContent(typeNumber: string): EnneagramType | null {
  const original = enneagramTypes[typeNumber];
  if (!original) return null;
  
  // Try to load expanded content
  try {
    const expanded = require("./enneagram-content-expanded.json")[typeNumber];
    if (expanded) {
      // Merge expanded content with original, keeping original famousExamples with images
      return {
        ...original,
        ...expanded,
        famousExamples: original.famousExamples, // Keep original with image URLs
      };
    }
  } catch {
    // Fall back to original if expanded content not available
  }
  
  return original;
}

