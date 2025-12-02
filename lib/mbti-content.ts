/**
 * Comprehensive MBTI Type Content for SEO Landing Pages
 * Rich, authoritative content positioning PRISM-7 as the next-generation alternative
 */

export interface MBTIType {
  code: string;
  nickname: string;
  tagline: string;
  rarity: string;
  description: string[];
  cognitiveFunctions: {
    dominant: { name: string; description: string };
    auxiliary: { name: string; description: string };
    tertiary: { name: string; description: string };
    inferior: { name: string; description: string };
  };
  strengths: Array<{ title: string; description: string }>;
  blindspots: Array<{ title: string; description: string }>;
  inRelationships: {
    romantic: string;
    friendship: string;
    workplace: string;
  };
  careerPaths: Array<{ title: string; reason: string }>;
  growthAdvice: string[];
  famousExamples: Array<{ name: string; known_for: string; image_url?: string }>;
  prismCorrelation: {
    likelyTypes: string[];
    keyDimensions: string;
  };
}

export const mbtiTypes: Record<string, MBTIType> = {
  intj: {
    code: "INTJ",
    nickname: "The Architect",
    tagline: "Strategic visionaries who see the world as a chessboard of possibilities",
    rarity: "2.1% of the population",
    description: [
      "INTJs are perhaps the most strategically-minded of all personality types. They possess an unusual combination of imagination and reliability—dreamers who can turn their visions into reality through sheer determination and intellectual prowess. Unlike types who get lost in abstract possibilities, INTJs have an innate drive to implement their ideas, creating systems and strategies that actually work.",
      "The INTJ mind operates like a perpetual chess game, always thinking several moves ahead. They see patterns and possibilities that others miss, connecting disparate pieces of information into coherent theories and actionable plans. This isn't mere daydreaming—it's purposeful vision combined with the discipline to execute.",
      "What sets INTJs apart is their intellectual independence. They form their own opinions through rigorous analysis rather than accepting conventional wisdom. This can make them seem contrarian, but their skepticism is rooted in a genuine desire for truth and effectiveness, not mere rebellion.",
      "INTJs often feel like outsiders, and in many ways they are. Their combination of introversion, abstract thinking, and high standards can make social navigation challenging. Yet those who take the time to understand an INTJ often find a loyal, insightful friend who offers perspectives no one else can provide."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Introverted Intuition (Ni)",
        description: "INTJs lead with Ni, giving them an almost prophetic ability to see how things will unfold. They synthesize information unconsciously, arriving at insights that seem to come from nowhere but prove remarkably accurate."
      },
      auxiliary: {
        name: "Extraverted Thinking (Te)",
        description: "Te gives INTJs their drive for efficiency and results. They organize the external world logically, creating systems and structures that turn their visions into reality."
      },
      tertiary: {
        name: "Introverted Feeling (Fi)",
        description: "Though often hidden, Fi gives INTJs a deep sense of personal values. They care intensely about authenticity and may struggle when their logical conclusions conflict with their inner moral compass."
      },
      inferior: {
        name: "Extraverted Sensing (Se)",
        description: "Se is the INTJ's blind spot. They may neglect physical needs, miss sensory details, or struggle to stay present. Under stress, they might overindulge in sensory pleasures or become hypersensitive to their environment."
      }
    },
    strengths: [
      { title: "Strategic Vision", description: "INTJs excel at seeing the big picture and charting a course to get there. They anticipate obstacles before they arise and plan accordingly." },
      { title: "Independent Thinking", description: "They form conclusions based on evidence and logic, not social pressure. This makes them excellent at identifying flawed conventional wisdom." },
      { title: "Determination", description: "Once committed to a goal, INTJs pursue it with relentless focus. They don't give up easily and can push through obstacles that would stop others." },
      { title: "High Standards", description: "INTJs hold themselves and their work to exacting standards, producing consistently high-quality results." }
    ],
    blindspots: [
      { title: "Emotional Intelligence", description: "INTJs may struggle to read emotional cues or respond appropriately to others' feelings. They can come across as cold or dismissive without intending to." },
      { title: "Flexibility", description: "Their confidence in their vision can make them resistant to feedback or alternative approaches, even when adaptation would serve them better." },
      { title: "Patience with Others", description: "INTJs often expect others to match their pace of understanding. They may become frustrated when explaining concepts that seem obvious to them." },
      { title: "Present-Moment Awareness", description: "So focused on future possibilities, INTJs can miss what's happening right in front of them, including their own physical and emotional needs." }
    ],
    inRelationships: {
      romantic: "INTJs approach relationships with the same strategic mindset they apply elsewhere. They seek partners who are intellectually stimulating and share their drive for growth. While not naturally expressive, INTJs show love through loyalty, problem-solving, and creating a stable future. They need partners who respect their independence and don't require constant emotional validation.",
      friendship: "INTJs maintain a small circle of close friends rather than a wide social network. They value depth over breadth, preferring meaningful conversations to small talk. Friendships form around shared interests or intellectual pursuits. They're fiercely loyal to those they've deemed worthy of their inner circle.",
      workplace: "INTJs thrive in roles that leverage their strategic thinking and allow autonomy. They prefer to work independently or lead, struggling with micromanagement or bureaucratic inefficiency. They respect competence over credentials and can be blunt in their feedback. Best paired with colleagues who value results over process."
    },
    careerPaths: [
      { title: "Software Architect", reason: "Combines systems thinking with the ability to design elegant, efficient solutions" },
      { title: "Investment Strategist", reason: "Leverages pattern recognition and long-term thinking for financial planning" },
      { title: "Scientific Researcher", reason: "Satisfies intellectual curiosity while allowing deep, focused work" },
      { title: "Management Consultant", reason: "Uses strategic analysis to solve complex organizational problems" },
      { title: "Entrepreneur", reason: "Provides autonomy and the ability to implement their vision without bureaucratic constraints" }
    ],
    growthAdvice: [
      "Practice active listening without immediately jumping to solutions. Sometimes people need to be heard, not fixed.",
      "Build in time for physical activity and sensory experiences. Your body needs attention too.",
      "Cultivate emotional vocabulary. Being able to name feelings helps you process them and connect with others.",
      "Seek feedback from trusted sources and genuinely consider perspectives that challenge your conclusions.",
      "Remember that being right isn't always the most important thing. Relationships sometimes matter more than accuracy."
    ],
    famousExamples: [
      { name: "Elon Musk", known_for: "Tesla, SpaceX founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg" },
      { name: "Isaac Newton", known_for: "Physicist, mathematician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Portrait_of_Sir_Isaac_Newton%2C_1689.jpg/440px-Portrait_of_Sir_Isaac_Newton%2C_1689.jpg" },
      { name: "Nikola Tesla", known_for: "Inventor, electrical engineer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/440px-N.Tesla.JPG" },
      { name: "Michelle Obama", known_for: "Former First Lady, author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Michelle_Obama_2013_official_portrait.jpg/440px-Michelle_Obama_2013_official_portrait.jpg" },
      { name: "Arnold Schwarzenegger", known_for: "Actor, Governor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/A._Schwarzenegger.jpg/440px-A._Schwarzenegger.jpg" },
      { name: "Jodie Foster", known_for: "Actress, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jodie_Foster_%28cropped%29.jpg/440px-Jodie_Foster_%28cropped%29.jpg" },
      { name: "Christopher Nolan", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Christopher_Nolan_Cannes_2018.jpg/440px-Christopher_Nolan_Cannes_2018.jpg" },
      { name: "Ayn Rand", known_for: "Author, philosopher", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ayn_Rand_%281943_Talbot_portrait%29.jpg/440px-Ayn_Rand_%281943_Talbot_portrait%29.jpg" },
      { name: "Friedrich Nietzsche", known_for: "Philosopher", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/440px-Nietzsche187a.jpg" },
      { name: "Hillary Clinton", known_for: "Secretary of State, Senator", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Hillary_Clinton_official_Secretary_of_State_portrait_crop.jpg/440px-Hillary_Clinton_official_Secretary_of_State_portrait_crop.jpg" },
      { name: "Vladimir Putin", known_for: "Russian President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Vladimir_Putin_%282020-02-20%29.jpg/440px-Vladimir_Putin_%282020-02-20%29.jpg" },
      { name: "Mark Zuckerberg", known_for: "Meta CEO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/440px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg" },
      { name: "Jane Austen", known_for: "Novelist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg/440px-CassandraAusten-JaneAusten%28c.1810%29_hires.jpg" },
      { name: "Stephen Hawking", known_for: "Theoretical physicist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/440px-Stephen_Hawking.StarChild.jpg" },
      { name: "Cillian Murphy", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Cillian_Murphy_Press_Conference_The_Party_Berlinale_2017_02.jpg/440px-Cillian_Murphy_Press_Conference_The_Party_Berlinale_2017_02.jpg" },
      { name: "Jay-Z", known_for: "Rapper, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Jay-Z-02-mika.jpg/440px-Jay-Z-02-mika.jpg" },
      { name: "Stanley Kubrick", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/KubrickForLook_%28cropped%29.jpg/440px-KubrickForLook_%28cropped%29.jpg" },
      { name: "Samantha Power", known_for: "UN Ambassador, author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Samantha_Power_USAID_portrait.jpg/440px-Samantha_Power_USAID_portrait.jpg" },
      { name: "Ludwig van Beethoven", known_for: "Composer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/440px-Beethoven.jpg" },
      { name: "Martina Navratilova", known_for: "Tennis champion", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Martina_Navratilova_at_the_2010_US_Open_01.jpg/440px-Martina_Navratilova_at_the_2010_US_Open_01.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Architect", "Visionary", "Analyst"],
      keyDimensions: "High Openness + High Conscientiousness + Low Extraversion"
    }
  },

  intp: {
    code: "INTP",
    nickname: "The Logician",
    tagline: "Innovative philosophers driven by an insatiable thirst for understanding",
    rarity: "3.3% of the population",
    description: [
      "INTPs are the philosophers of the personality world—endlessly curious minds that find joy in the pursuit of understanding itself. They don't just want to know facts; they want to understand the underlying principles that explain why things work the way they do. This drive for comprehension is so fundamental to their nature that they often lose track of time when exploring an interesting problem.",
      "The INTP mind is a laboratory of ideas where theories are constantly being tested, refined, and sometimes discarded entirely. They approach problems with intellectual honesty that many find refreshing—an INTP would rather admit they were wrong than cling to a flawed theory. This makes them excellent at finding errors in reasoning, including their own.",
      "Unlike some analytical types who seek knowledge for practical application, INTPs often pursue understanding for its own sake. They find the elegant theory as satisfying as the practical solution, sometimes more so. This can make them seem impractical, but it also allows them to make conceptual breakthroughs that more pragmatic thinkers miss.",
      "Socially, INTPs often feel like they're operating in a foreign country where they don't quite speak the language. Small talk feels pointless, social conventions seem arbitrary, and emotional dynamics can be genuinely confusing. Yet INTPs deeply value the few connections they make, bringing intellectual excitement and unwavering honesty to their relationships."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Introverted Thinking (Ti)",
        description: "INTPs lead with Ti, creating elaborate internal frameworks for understanding the world. They constantly refine these mental models, seeking internal logical consistency above all else."
      },
      auxiliary: {
        name: "Extraverted Intuition (Ne)",
        description: "Ne gives INTPs their love of possibilities and connections. They see multiple angles on every problem and delight in exploring 'what if' scenarios."
      },
      tertiary: {
        name: "Introverted Sensing (Si)",
        description: "Si provides INTPs with detailed memory for information relevant to their interests. It can also make them creatures of habit in their personal routines."
      },
      inferior: {
        name: "Extraverted Feeling (Fe)",
        description: "Fe is the INTP's Achilles heel. They may struggle with social expectations, emotional expression, and reading group dynamics. Under stress, they might become uncharacteristically concerned with others' opinions."
      }
    },
    strengths: [
      { title: "Analytical Precision", description: "INTPs can dissect complex problems with surgical precision, identifying logical flaws and inconsistencies others miss." },
      { title: "Intellectual Honesty", description: "They value truth over ego, willing to change their minds when presented with better evidence or arguments." },
      { title: "Creative Problem-Solving", description: "Their combination of logic and imagination allows them to find novel solutions to problems others consider unsolvable." },
      { title: "Independence of Thought", description: "INTPs think for themselves, unswayed by authority, tradition, or popular opinion." }
    ],
    blindspots: [
      { title: "Practical Implementation", description: "INTPs can get so caught up in perfecting theories that they never get around to applying them. The gap between knowing and doing can be vast." },
      { title: "Emotional Attunement", description: "They may intellectualize emotions rather than experiencing them, and struggle to respond appropriately to others' emotional needs." },
      { title: "Decision-Making", description: "The desire to consider all possibilities can lead to analysis paralysis. INTPs may delay decisions indefinitely while gathering more information." },
      { title: "Social Navigation", description: "Social conventions that others follow automatically may seem arbitrary or pointless, leading to awkward interactions." }
    ],
    inRelationships: {
      romantic: "INTPs seek partners who can engage them intellectually and respect their need for independence. They show love through sharing ideas, solving problems together, and offering their honest perspective. They may struggle with traditional romantic gestures but demonstrate care through loyalty and genuine interest in their partner's thoughts.",
      friendship: "INTPs form friendships around shared intellectual interests. They prefer one-on-one conversations to group activities and value friends who can engage in deep discussions without taking disagreement personally. They're low-maintenance friends who don't require constant contact but show up when it matters.",
      workplace: "INTPs excel in roles that require analysis, problem-solving, and independent work. They struggle with rigid structures, arbitrary deadlines, and excessive meetings. They contribute best when given complex problems and the freedom to solve them their own way."
    },
    careerPaths: [
      { title: "Software Developer", reason: "Combines logical thinking with creative problem-solving in a field that values results over social skills" },
      { title: "Data Scientist", reason: "Allows deep analysis of complex systems and pattern recognition" },
      { title: "Philosopher/Academic", reason: "Provides space for pure theoretical exploration and intellectual discourse" },
      { title: "Research Scientist", reason: "Satisfies curiosity while contributing to human knowledge" },
      { title: "Technical Writer", reason: "Leverages ability to explain complex concepts clearly without requiring extensive social interaction" }
    ],
    growthAdvice: [
      "Set deadlines for decisions. Perfect information is impossible—learn to act on 'good enough' understanding.",
      "Practice expressing emotions directly rather than analyzing them. 'I feel frustrated' is more connecting than explaining why frustration is occurring.",
      "Recognize that some social conventions exist for good reasons, even if those reasons aren't immediately logical.",
      "Find ways to apply your theories. Understanding without action is incomplete knowledge.",
      "Build routines that support physical health. Your body isn't just a vehicle for your brain."
    ],
    famousExamples: [
      { name: "Albert Einstein", known_for: "Theoretical physicist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/440px-Albert_Einstein_Head.jpg" },
      { name: "Charles Darwin", known_for: "Naturalist, evolutionary theory", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Charles_Darwin_seated_crop.jpg/440px-Charles_Darwin_seated_crop.jpg" },
      { name: "Marie Curie", known_for: "Physicist, chemist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c._1920s.jpg/440px-Marie_Curie_c._1920s.jpg" },
      { name: "Bill Gates", known_for: "Microsoft founder, philanthropist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/440px-Bill_Gates_2017_%28cropped%29.jpg" },
      { name: "Abraham Lincoln", known_for: "16th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/440px-Abraham_Lincoln_O-77_matte_collodion_print.jpg" },
      { name: "Socrates", known_for: "Greek philosopher", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Socrate_du_Louvre.jpg/440px-Socrate_du_Louvre.jpg" },
      { name: "Tina Fey", known_for: "Comedian, writer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tina_Fey_Muppets_Most_Wanted_Premiere_%28cropped%29.jpg/440px-Tina_Fey_Muppets_Most_Wanted_Premiere_%28cropped%29.jpg" },
      { name: "Larry Page", known_for: "Google co-founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Larry_Page_in_the_European_Parliament%2C_17.06.2009_%28cropped%29.jpg/440px-Larry_Page_in_the_European_Parliament%2C_17.06.2009_%28cropped%29.jpg" },
      { name: "Rene Descartes", known_for: "Philosopher, mathematician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Frans_Hals_-_Portret_van_Ren%C3%A9_Descartes.jpg/440px-Frans_Hals_-_Portret_van_Ren%C3%A9_Descartes.jpg" },
      { name: "Blaise Pascal", known_for: "Mathematician, physicist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Blaise_Pascal_Versailles.JPG/440px-Blaise_Pascal_Versailles.JPG" },
      { name: "Kristen Stewart", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kristen_Stewart_Cannes_2022.jpg/440px-Kristen_Stewart_Cannes_2022.jpg" },
      { name: "Jesse Eisenberg", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jesse_Eisenberg_by_Gage_Skidmore.jpg/440px-Jesse_Eisenberg_by_Gage_Skidmore.jpg" },
      { name: "Randall Munroe", known_for: "xkcd creator", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Randall_Munroe_at_the_ROFLCon_II.jpg/440px-Randall_Munroe_at_the_ROFLCon_II.jpg" },
      { name: "Harper Lee", known_for: "Author, To Kill a Mockingbird", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Harper_Lee_medal.jpg/440px-Harper_Lee_medal.jpg" },
      { name: "Isaac Asimov", known_for: "Science fiction author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Isaac.Asimov01.jpg/440px-Isaac.Asimov01.jpg" },
      { name: "Carl Jung", known_for: "Psychiatrist, psychologist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/CGJung.jpg/440px-CGJung.jpg" },
      { name: "Edward Snowden", known_for: "Whistleblower", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Edward_Snowden-2.jpg/440px-Edward_Snowden-2.jpg" },
      { name: "Richard Dawkins", known_for: "Evolutionary biologist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Richard_Dawkins_Stonehenge_2022_%28cropped%29.jpg/440px-Richard_Dawkins_Stonehenge_2022_%28cropped%29.jpg" },
      { name: "Ellen Page", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Ellen_Page_at_TIFF_2015_%2821165025644%29.jpg/440px-Ellen_Page_at_TIFF_2015_%2821165025644%29.jpg" },
      { name: "Immanuel Kant", known_for: "Philosopher", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Kant_Portrait.jpg/440px-Kant_Portrait.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Analyst", "Architect", "Innovator"],
      keyDimensions: "High Openness + Low Extraversion + Variable Conscientiousness"
    }
  },

  entj: {
    code: "ENTJ",
    nickname: "The Commander",
    tagline: "Natural leaders who see inefficiency as a personal challenge to overcome",
    rarity: "1.8% of the population",
    description: [
      "ENTJs are born leaders—not because they seek power for its own sake, but because they genuinely believe they can do things better and can't stand watching inefficiency when they know how to fix it. Their combination of strategic vision, decisive action, and natural authority makes them formidable forces in any arena they choose to enter.",
      "The ENTJ mind operates like a CEO's—constantly scanning for opportunities, assessing risks, and mobilizing resources toward goals. They think in terms of systems and leverage, understanding instinctively how to organize people and processes for maximum effectiveness. This isn't cold calculation; it's a genuine drive to create value and achieve meaningful results.",
      "What distinguishes ENTJs from other ambitious types is their willingness to make hard decisions. They don't shy away from conflict or difficult conversations when necessary. They'd rather address problems directly than let them fester, even if that means temporary discomfort. This directness can seem harsh, but it's rooted in a desire for clarity and progress.",
      "ENTJs have high standards for themselves and others, which can be both inspiring and exhausting for those around them. They push themselves relentlessly and expect the same from their teams. When channeled well, this creates extraordinary achievement. When unchecked, it can lead to burnout and strained relationships."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Extraverted Thinking (Te)",
        description: "ENTJs lead with Te, giving them a natural drive to organize the external world efficiently. They think out loud, make quick decisions, and take immediate action to implement their plans."
      },
      auxiliary: {
        name: "Introverted Intuition (Ni)",
        description: "Ni provides ENTJs with strategic vision and the ability to see how current actions will play out in the future. They can anticipate consequences and plan accordingly."
      },
      tertiary: {
        name: "Extraverted Sensing (Se)",
        description: "Se gives ENTJs awareness of their environment and the ability to respond quickly to changing circumstances. It also connects them to status symbols and tangible achievements."
      },
      inferior: {
        name: "Introverted Feeling (Fi)",
        description: "Fi is the ENTJ's vulnerable point. They may struggle to access their own emotions or understand their deeper values. Under stress, they might become uncharacteristically sensitive or self-doubting."
      }
    },
    strengths: [
      { title: "Decisive Leadership", description: "ENTJs can assess situations quickly and make confident decisions, providing clear direction when others are paralyzed by uncertainty." },
      { title: "Strategic Thinking", description: "They naturally see the big picture and can chart efficient paths to ambitious goals." },
      { title: "Execution Power", description: "ENTJs don't just plan—they implement. They have the drive and organizational skills to turn visions into reality." },
      { title: "Direct Communication", description: "They say what they mean clearly and efficiently, eliminating ambiguity and confusion." }
    ],
    blindspots: [
      { title: "Emotional Sensitivity", description: "ENTJs may steamroll over others' feelings in pursuit of efficiency, damaging relationships and morale without realizing it." },
      { title: "Patience", description: "They can become frustrated with slower-paced colleagues or processes, pushing too hard and creating resistance." },
      { title: "Work-Life Balance", description: "Their drive for achievement can consume everything else, leading to neglected relationships and burnout." },
      { title: "Accepting Limitations", description: "ENTJs may struggle to accept that some things can't be optimized or controlled, leading to frustration and wasted effort." }
    ],
    inRelationships: {
      romantic: "ENTJs approach relationships with the same intensity they bring to their careers. They're loyal, protective, and will work hard to build a successful partnership. They show love through actions—solving problems, providing resources, creating opportunities. They need partners who have their own ambitions and won't be overwhelmed by the ENTJ's intensity.",
      friendship: "ENTJs maintain friendships that are mutually beneficial and intellectually stimulating. They're generous with their network and resources, helping friends achieve their goals. They respect competence and ambition, and may have little patience for friends who complain without taking action.",
      workplace: "ENTJs naturally gravitate toward leadership roles and excel at building and directing teams. They set high standards and expect results, but also invest in developing their people. They can be demanding bosses but also create opportunities for those who perform."
    },
    careerPaths: [
      { title: "CEO/Executive", reason: "Natural fit for roles requiring strategic vision, decisive leadership, and organizational management" },
      { title: "Entrepreneur", reason: "Provides autonomy to implement their vision and build something from the ground up" },
      { title: "Management Consultant", reason: "Allows them to diagnose organizational problems and implement solutions" },
      { title: "Lawyer", reason: "Combines strategic thinking with competitive drive and direct communication" },
      { title: "Investment Banker", reason: "High-stakes environment that rewards decisive action and strategic thinking" }
    ],
    growthAdvice: [
      "Slow down to consider how your decisions affect others emotionally. Efficiency isn't everything.",
      "Practice asking questions before offering solutions. Others may have insights you're missing.",
      "Build in time for relationships that aren't 'productive.' Connection has value beyond utility.",
      "Learn to recognize when you're pushing too hard. Sustainable success requires pacing.",
      "Develop comfort with uncertainty. Not everything can be controlled or optimized."
    ],
    famousExamples: [
      { name: "Steve Jobs", known_for: "Apple co-founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/440px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg" },
      { name: "Margaret Thatcher", known_for: "Former UK Prime Minister", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Margaret_Thatcher_stock_portrait_%28cropped%29.jpg/440px-Margaret_Thatcher_stock_portrait_%28cropped%29.jpg" },
      { name: "Franklin D. Roosevelt", known_for: "32nd US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/FDR_1944_Color_Portrait.jpg/440px-FDR_1944_Color_Portrait.jpg" },
      { name: "Sheryl Sandberg", known_for: "Former Meta COO", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sheryl_Sandberg_World_Economic_Forum_2013.jpg/440px-Sheryl_Sandberg_World_Economic_Forum_2013.jpg" },
      { name: "Napoleon Bonaparte", known_for: "French Emperor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/440px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg" },
      { name: "Gordon Ramsay", known_for: "Celebrity chef", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Gordon_Ramsay.jpg/440px-Gordon_Ramsay.jpg" },
      { name: "Adele", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Adele_-_Live_2016%2C_Glasgow_SSE_Hydro_03.jpg/440px-Adele_-_Live_2016%2C_Glasgow_SSE_Hydro_03.jpg" },
      { name: "Jeff Bezos", known_for: "Amazon founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped3%29.jpg/440px-Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped3%29.jpg" },
      { name: "Angela Merkel", known_for: "Former German Chancellor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Angela_Merkel_%282019%29_cropped.jpg/440px-Angela_Merkel_%282019%29_cropped.jpg" },
      { name: "Dwayne Johnson", known_for: "Actor, wrestler", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dwayne_Johnson_2014_%28cropped%29.jpg/440px-Dwayne_Johnson_2014_%28cropped%29.jpg" },
      { name: "Condoleezza Rice", known_for: "Secretary of State", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Condoleezza_Rice_cropped.jpg/440px-Condoleezza_Rice_cropped.jpg" },
      { name: "Julius Caesar", known_for: "Roman dictator", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Bust_of_Julius_Caesar_from_History_of_the_World_%281902%29.png/440px-Bust_of_Julius_Caesar_from_History_of_the_World_%281902%29.png" },
      { name: "Harrison Ford", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Harrison_Ford_by_Gage_Skidmore_3.jpg/440px-Harrison_Ford_by_Gage_Skidmore_3.jpg" },
      { name: "Patrick Stewart", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Patrick_Stewart_Photo_Call_Logan_Berlinale_2017_%28cropped%29.jpg/440px-Patrick_Stewart_Photo_Call_Logan_Berlinale_2017_%28cropped%29.jpg" },
      { name: "Whoopi Goldberg", known_for: "Actress, TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Whoopi_Goldberg_at_the_2010_Time_100.jpg/440px-Whoopi_Goldberg_at_the_2010_Time_100.jpg" },
      { name: "David Letterman", known_for: "TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/David_Letterman_2012.jpg/440px-David_Letterman_2012.jpg" },
      { name: "Jim Carrey", known_for: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Jim_Carrey_2008.jpg/440px-Jim_Carrey_2008.jpg" },
      { name: "Charlize Theron", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Charlize_Theron_Cannes_2015_5.jpg/440px-Charlize_Theron_Cannes_2015_5.jpg" },
      { name: "George Clooney", known_for: "Actor, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/George_Clooney_2016.jpg/440px-George_Clooney_2016.jpg" },
      { name: "Quentin Tarantino", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Quentin_Tarantino_by_Gage_Skidmore.jpg/440px-Quentin_Tarantino_by_Gage_Skidmore.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Achiever", "Visionary", "Strategist"],
      keyDimensions: "High Conscientiousness + High Extraversion + Low Agreeableness"
    }
  },

  entp: {
    code: "ENTP",
    nickname: "The Debater",
    tagline: "Quick-witted innovators who thrive on intellectual challenge and creative disruption",
    rarity: "3.2% of the population",
    description: [
      "ENTPs are the ultimate idea people—endlessly generating possibilities, challenging assumptions, and finding creative angles that others miss. Their minds move at remarkable speed, connecting disparate concepts and seeing potential where others see only problems. They're energized by intellectual sparring and genuinely enjoy having their ideas challenged.",
      "The ENTP's signature trait is their love of debate—not for the sake of winning, but for the sake of exploring ideas from every angle. They'll argue positions they don't even believe just to see what emerges from the exchange. This can be exhilarating for some and exhausting for others, but it's how ENTPs process and refine their thinking.",
      "Unlike more cautious types, ENTPs are comfortable with risk and uncertainty. They'd rather try something and fail than miss an opportunity through excessive deliberation. This makes them natural entrepreneurs and innovators, but can also lead to scattered efforts and unfinished projects when the next exciting idea comes along.",
      "ENTPs have a rebellious streak that resists authority and convention. They question everything, not out of disrespect, but because they genuinely believe better approaches exist. This makes them valuable for challenging groupthink but can create friction in hierarchical environments."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Extraverted Intuition (Ne)",
        description: "ENTPs lead with Ne, constantly scanning for possibilities and connections. They see potential everywhere and generate ideas faster than they can implement them."
      },
      auxiliary: {
        name: "Introverted Thinking (Ti)",
        description: "Ti gives ENTPs analytical rigor, helping them evaluate which of their many ideas actually hold up to scrutiny. They build internal frameworks for understanding how things work."
      },
      tertiary: {
        name: "Extraverted Feeling (Fe)",
        description: "Fe provides ENTPs with social awareness and charm. They can read a room and adapt their communication style, though they may use this skill manipulatively when immature."
      },
      inferior: {
        name: "Introverted Sensing (Si)",
        description: "Si is the ENTP's weak point. They may neglect practical details, forget commitments, or fail to learn from past mistakes. Under stress, they can become obsessed with physical symptoms or past failures."
      }
    },
    strengths: [
      { title: "Innovative Thinking", description: "ENTPs generate more ideas in an hour than most people do in a week. They see possibilities and connections that others miss entirely." },
      { title: "Adaptability", description: "They pivot quickly when circumstances change, turning obstacles into opportunities without missing a beat." },
      { title: "Persuasive Communication", description: "ENTPs can argue any position convincingly, making them effective advocates, salespeople, and negotiators." },
      { title: "Intellectual Courage", description: "They're willing to challenge sacred cows and question authority, often leading to breakthrough insights." }
    ],
    blindspots: [
      { title: "Follow-Through", description: "The excitement of new ideas can overshadow the discipline needed to implement them. Many ENTP projects remain unfinished." },
      { title: "Sensitivity to Others", description: "Their love of debate can come across as argumentative or dismissive, especially when others aren't in the mood for intellectual sparring." },
      { title: "Practical Details", description: "ENTPs may overlook important logistics, deadlines, or administrative requirements in their enthusiasm for the big picture." },
      { title: "Commitment", description: "The constant pull of new possibilities can make it hard to commit fully to relationships, careers, or projects." }
    ],
    inRelationships: {
      romantic: "ENTPs bring excitement, intellectual stimulation, and spontaneity to relationships. They need partners who can keep up with their quick minds and don't take their debating personally. They show love through engagement—sharing ideas, planning adventures, and helping partners see new possibilities. Routine and predictability can feel stifling.",
      friendship: "ENTPs collect friends across diverse domains, enjoying the variety of perspectives this brings. They're entertaining companions who make ordinary situations interesting. They value friends who challenge them intellectually and don't require constant emotional processing.",
      workplace: "ENTPs thrive in roles that reward innovation and allow flexibility. They struggle with routine, micromanagement, and rigid hierarchies. They contribute best in brainstorming sessions and strategic planning, but may need support with implementation and follow-through."
    },
    careerPaths: [
      { title: "Entrepreneur", reason: "Provides the variety, autonomy, and opportunity for innovation that ENTPs crave" },
      { title: "Lawyer", reason: "Combines intellectual challenge with persuasive argumentation" },
      { title: "Creative Director", reason: "Allows them to generate and champion innovative ideas" },
      { title: "Venture Capitalist", reason: "Evaluates new ideas and possibilities across diverse domains" },
      { title: "Political Strategist", reason: "Applies strategic thinking and persuasion to complex social dynamics" }
    ],
    growthAdvice: [
      "Choose one project and see it through to completion. The discipline of finishing builds capabilities that starting never will.",
      "Practice listening without formulating counterarguments. Sometimes people need to be heard, not debated.",
      "Build systems for managing details and commitments. Your ideas deserve better than being lost to disorganization.",
      "Recognize when debate is unwelcome. Not every conversation needs to be an intellectual exercise.",
      "Develop deeper expertise in one area rather than surface knowledge in many. Depth creates opportunities breadth cannot."
    ],
    famousExamples: [
      { name: "Mark Twain", known_for: "Author, humorist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mark_Twain_by_AF_Bradley.jpg/440px-Mark_Twain_by_AF_Bradley.jpg" },
      { name: "Thomas Edison", known_for: "Inventor, businessman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Thomas_Edison2.jpg/440px-Thomas_Edison2.jpg" },
      { name: "Sacha Baron Cohen", known_for: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Sacha_Baron_Cohen_2011.jpg/440px-Sacha_Baron_Cohen_2011.jpg" },
      { name: "Leonardo da Vinci", known_for: "Renaissance polymath", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Francesco_Melzi_-_Portrait_of_Leonardo.png/440px-Francesco_Melzi_-_Portrait_of_Leonardo.png" },
      { name: "Benjamin Franklin", known_for: "Founding Father, inventor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/BenFranklinDupworked.jpg/440px-BenFranklinDupworked.jpg" },
      { name: "Tom Hanks", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/440px-Tom_Hanks_TIFF_2019.jpg" },
      { name: "Celine Dion", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/C%C3%A9line_Dion_2012.jpg/440px-C%C3%A9line_Dion_2012.jpg" },
      { name: "Weird Al Yankovic", known_for: "Musical comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Weird_Al_Yankovic_2010.jpg/440px-Weird_Al_Yankovic_2010.jpg" },
      { name: "Adam Savage", known_for: "MythBusters host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Adam_Savage_in_2018.jpg/440px-Adam_Savage_in_2018.jpg" },
      { name: "Ryan Reynolds", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Ryan_Reynolds_2016.jpg/440px-Ryan_Reynolds_2016.jpg" },
      { name: "Neil Patrick Harris", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Neil_Patrick_Harris%2C_2013.jpg/440px-Neil_Patrick_Harris%2C_2013.jpg" },
      { name: "Amy Poehler", known_for: "Actress, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Amy_Poehler_2019.jpg/440px-Amy_Poehler_2019.jpg" },
      { name: "Voltaire", known_for: "Philosopher, writer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/D%27apr%C3%A8s_Maurice_Quentin_de_La_Tour%2C_Portrait_de_Voltaire%2C_d%C3%A9tail_du_visage_%28ch%C3%A2teau_de_Ferney%29.jpg/440px-D%27apr%C3%A8s_Maurice_Quentin_de_La_Tour%2C_Portrait_de_Voltaire%2C_d%C3%A9tail_du_visage_%28ch%C3%A2teau_de_Ferney%29.jpg" },
      { name: "Conan O'Brien", known_for: "TV host, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Conan_O%27Brien_2016_%28cropped%29.jpg/440px-Conan_O%27Brien_2016_%28cropped%29.jpg" },
      { name: "Matthew Perry", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Matthew_Perry_2013.jpg/440px-Matthew_Perry_2013.jpg" },
      { name: "Robert Downey Jr.", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/440px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg" },
      { name: "Oscar Wilde", known_for: "Writer, playwright", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Oscar_Wilde_Sarony.jpg/440px-Oscar_Wilde_Sarony.jpg" },
      { name: "Jon Stewart", known_for: "Comedian, TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Jon_Stewart_2016.jpg/440px-Jon_Stewart_2016.jpg" },
      { name: "Hugh Laurie", known_for: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Hugh_Laurie_2009.jpg/440px-Hugh_Laurie_2009.jpg" },
      { name: "Federico Fellini", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Federico_Fellini_NYWTS_2.jpg/440px-Federico_Fellini_NYWTS_2.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Innovator", "Catalyst", "Explorer"],
      keyDimensions: "High Openness + High Extraversion + Low Conscientiousness"
    }
  },

  infj: {
    code: "INFJ",
    nickname: "The Advocate",
    tagline: "Insightful idealists driven to help others realize their potential",
    rarity: "1.5% of the population",
    description: [
      "INFJs are the rarest personality type, and in many ways the most paradoxical. They combine deep empathy with strategic thinking, idealism with practicality, and introversion with genuine concern for others. This creates individuals who can see into people's hearts while also understanding the systems that shape their lives.",
      "The INFJ's defining gift is their insight into human nature. They often understand people better than those people understand themselves, perceiving motivations, fears, and potential that remain hidden from others. This isn't mind-reading—it's pattern recognition honed by genuine interest in the human condition.",
      "INFJs are driven by a sense of mission. They don't just want to help individuals; they want to address root causes and create lasting change. This can manifest as advocacy, counseling, writing, or any work that allows them to influence hearts and minds toward what they see as a better world.",
      "Despite their warmth and concern for others, INFJs need significant solitude to recharge and process their insights. They're often surprised when others see them as extraverted, not realizing how much energy their social engagement requires. Without adequate alone time, INFJs become depleted and may withdraw suddenly."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Introverted Intuition (Ni)",
        description: "INFJs lead with Ni, giving them an almost mystical ability to perceive patterns and possibilities. They often know things without being able to explain how they know."
      },
      auxiliary: {
        name: "Extraverted Feeling (Fe)",
        description: "Fe drives INFJs to create harmony and meet others' emotional needs. They're highly attuned to the emotional atmosphere and work to maintain positive group dynamics."
      },
      tertiary: {
        name: "Introverted Thinking (Ti)",
        description: "Ti gives INFJs analytical capabilities that complement their intuition. They can build logical frameworks to explain and communicate their insights."
      },
      inferior: {
        name: "Extraverted Sensing (Se)",
        description: "Se is the INFJ's blind spot. They may neglect physical needs, miss concrete details, or feel overwhelmed by sensory stimulation. Under stress, they might overindulge in sensory pleasures."
      }
    },
    strengths: [
      { title: "Deep Insight", description: "INFJs perceive patterns in human behavior and motivation that others miss, allowing them to help people in profound ways." },
      { title: "Principled Action", description: "They combine idealism with the determination to actually make change happen, not just dream about it." },
      { title: "Empathic Connection", description: "INFJs create deep bonds quickly, making others feel truly seen and understood." },
      { title: "Written Expression", description: "Many INFJs have a gift for putting complex emotional and philosophical ideas into words." }
    ],
    blindspots: [
      { title: "Perfectionism", description: "INFJs hold themselves to impossibly high standards, leading to self-criticism and burnout." },
      { title: "Difficulty with Criticism", description: "Their sensitivity can make even constructive feedback feel like personal rejection." },
      { title: "Overextension", description: "Their desire to help can lead them to take on others' emotional burdens, depleting their own resources." },
      { title: "All-or-Nothing Thinking", description: "INFJs may idealize people or causes, then feel betrayed when reality falls short of their vision." }
    ],
    inRelationships: {
      romantic: "INFJs seek deep, meaningful partnerships built on mutual understanding and shared values. They're devoted partners who invest heavily in their relationships, sometimes to the point of losing themselves. They need partners who appreciate their depth and don't dismiss their intuitions as irrational.",
      friendship: "INFJs prefer a few close friendships to many acquaintances. They're the friend who remembers everything you've told them and notices when something's wrong before you say a word. They need friends who reciprocate their depth of investment.",
      workplace: "INFJs thrive in roles that allow them to help others grow and contribute to meaningful causes. They struggle with purely profit-driven environments or work that feels meaningless. They often become the emotional center of their teams, supporting colleagues through difficulties."
    },
    careerPaths: [
      { title: "Counselor/Therapist", reason: "Directly applies their insight and empathy to help others heal and grow" },
      { title: "Writer/Author", reason: "Allows them to explore and communicate complex ideas about the human condition" },
      { title: "Nonprofit Director", reason: "Combines their idealism with strategic thinking to create systemic change" },
      { title: "Human Resources Director", reason: "Applies people insight to organizational development" },
      { title: "Professor", reason: "Allows them to mentor others while exploring ideas that matter to them" }
    ],
    growthAdvice: [
      "Set boundaries around your emotional availability. You can't pour from an empty cup.",
      "Practice accepting 'good enough.' Perfectionism is a form of self-sabotage.",
      "Ground yourself in physical reality. Regular exercise, nature time, and sensory pleasures aren't indulgences—they're necessities.",
      "Learn to receive as well as give. Relationships should be mutual, not one-directional.",
      "Trust your intuitions, but verify them. Your insights are valuable but not infallible."
    ],
    famousExamples: [
      { name: "Martin Luther King Jr.", known_for: "Civil rights leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Martin_Luther_King%2C_Jr..jpg/440px-Martin_Luther_King%2C_Jr..jpg" },
      { name: "Nelson Mandela", known_for: "Anti-apartheid revolutionary, president", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/440px-Nelson_Mandela_1994.jpg" },
      { name: "Carl Jung", known_for: "Psychiatrist, analytical psychology founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/CGJung.jpg/440px-CGJung.jpg" },
      { name: "Lady Gaga", known_for: "Singer, actress, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lady_Gaga_at_the_2019_Venice_Film_Festival.jpg/440px-Lady_Gaga_at_the_2019_Venice_Film_Festival.jpg" },
      { name: "Mahatma Gandhi", known_for: "Independence leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/440px-Mahatma-Gandhi%2C_studio%2C_1931.jpg" },
      { name: "Mother Teresa", known_for: "Humanitarian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mother_Teresa_1.jpg/440px-Mother_Teresa_1.jpg" },
      { name: "Taylor Swift", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/440px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png" },
      { name: "Cate Blanchett", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Cate_Blanchett_Cannes_2018_2_%28cropped%29.jpg/440px-Cate_Blanchett_Cannes_2018_2_%28cropped%29.jpg" },
      { name: "Fyodor Dostoevsky", known_for: "Novelist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Dostoevsky_1872.jpg/440px-Dostoevsky_1872.jpg" },
      { name: "Plato", known_for: "Greek philosopher", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Plato_Silanion_Musei_Capitolini_MC1377.jpg/440px-Plato_Silanion_Musei_Capitolini_MC1377.jpg" },
      { name: "Agatha Christie", known_for: "Mystery novelist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Agatha_Christie.png/440px-Agatha_Christie.png" },
      { name: "Noam Chomsky", known_for: "Linguist, philosopher", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Noam_Chomsky_portrait_2017_retouched.png/440px-Noam_Chomsky_portrait_2017_retouched.png" },
      { name: "Marilyn Manson", known_for: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Marilyn_Manson_-_Rock_am_Ring_2015-8717_%28cropped%29.jpg/440px-Marilyn_Manson_-_Rock_am_Ring_2015-8717_%28cropped%29.jpg" },
      { name: "Nicole Kidman", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Nicole_Kidman_Cannes_2017_5.jpg/440px-Nicole_Kidman_Cannes_2017_5.jpg" },
      { name: "Al Pacino", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Al_Pacino.jpg/440px-Al_Pacino.jpg" },
      { name: "Edward Norton", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Edward_Norton_2012.jpg/440px-Edward_Norton_2012.jpg" },
      { name: "Daniel Day-Lewis", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Daniel_Day-Lewis_in_2013.jpg/440px-Daniel_Day-Lewis_in_2013.jpg" },
      { name: "Rooney Mara", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Rooney_Mara_at_the_Caf%C3%A9_Society_Press_Conference_in_Cannes_%28cropped%29.jpg/440px-Rooney_Mara_at_the_Caf%C3%A9_Society_Press_Conference_in_Cannes_%28cropped%29.jpg" },
      { name: "Adolf Hitler", known_for: "Nazi dictator", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hitler_portrait_crop.jpg/440px-Hitler_portrait_crop.jpg" },
      { name: "Simone de Beauvoir", known_for: "Philosopher, feminist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Simone_de_Beauvoir2.png/440px-Simone_de_Beauvoir2.png" }
    ],
    prismCorrelation: {
      likelyTypes: ["Harmonizer", "Guardian", "Visionary"],
      keyDimensions: "High Openness + High Agreeableness + Low Extraversion"
    }
  },

  infp: {
    code: "INFP",
    nickname: "The Mediator",
    tagline: "Imaginative idealists guided by their own core values and beliefs",
    rarity: "4.4% of the population",
    description: [
      "INFPs are the poets and dreamers of the personality world—individuals whose rich inner lives often go unnoticed by those around them. Beneath their quiet exterior lies a passionate commitment to their values and a vivid imagination that colors everything they experience. They see the world not just as it is, but as it could be.",
      "The INFP's defining characteristic is their deep sense of personal values. Unlike types who adopt values from their environment, INFPs develop their own moral compass through introspection and experience. This makes them fiercely authentic but can also leave them feeling out of step with a world that doesn't share their ideals.",
      "INFPs experience emotions with an intensity that can be overwhelming. They feel the full spectrum—joy, sorrow, wonder, despair—more deeply than most. This emotional depth fuels their creativity and empathy but can also lead to periods of melancholy when reality falls short of their ideals.",
      "Despite their sensitivity, INFPs have a quiet strength that emerges when their values are threatened. They may avoid conflict in daily life, but become surprisingly fierce when standing up for what they believe in or protecting those they love. This combination of gentleness and conviction makes them powerful advocates for causes they care about."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Introverted Feeling (Fi)",
        description: "INFPs lead with Fi, navigating the world through their internal value system. They constantly evaluate experiences against their deeply held beliefs about what matters and what's right."
      },
      auxiliary: {
        name: "Extraverted Intuition (Ne)",
        description: "Ne gives INFPs their creativity and openness to possibilities. They see potential everywhere and enjoy exploring ideas, though they filter everything through their values."
      },
      tertiary: {
        name: "Introverted Sensing (Si)",
        description: "Si connects INFPs to their past experiences and creates a rich inner world of memories and associations. It can also make them nostalgic or stuck in past hurts."
      },
      inferior: {
        name: "Extraverted Thinking (Te)",
        description: "Te is the INFP's weak point. They may struggle with organization, logical analysis, and asserting themselves in practical matters. Under stress, they can become uncharacteristically critical or obsessed with efficiency."
      }
    },
    strengths: [
      { title: "Authenticity", description: "INFPs live according to their values, not external expectations. This integrity inspires others and creates deep trust." },
      { title: "Creativity", description: "Their rich inner world and openness to possibilities fuel artistic and innovative expression." },
      { title: "Empathy", description: "INFPs feel others' emotions deeply, allowing them to provide comfort and understanding that feels genuine." },
      { title: "Idealism", description: "They see the best in people and situations, inspiring others to reach for higher standards." }
    ],
    blindspots: [
      { title: "Practical Matters", description: "INFPs may neglect logistics, finances, and other practical necessities in favor of more meaningful pursuits." },
      { title: "Self-Criticism", description: "They often hold themselves to impossible standards and struggle with self-compassion when they fall short." },
      { title: "Conflict Avoidance", description: "Their desire for harmony can lead them to suppress their own needs, building resentment over time." },
      { title: "Idealization", description: "INFPs may put people or causes on pedestals, setting themselves up for disappointment when reality intrudes." }
    ],
    inRelationships: {
      romantic: "INFPs seek soulmate connections—relationships characterized by deep understanding, shared values, and emotional intimacy. They're devoted partners who remember every meaningful moment and express love through thoughtful gestures. They need partners who appreciate their depth and don't try to 'fix' their sensitivity.",
      friendship: "INFPs form deep bonds with a select few rather than maintaining large social networks. They're the friends who truly listen, remember what matters to you, and show up during difficult times. They need friends who accept their need for solitude and don't take their occasional withdrawals personally.",
      workplace: "INFPs thrive in roles that align with their values and allow creative expression. They struggle in competitive, high-pressure environments or work that feels meaningless. They often become the moral compass of their teams, advocating for ethical treatment and authentic communication."
    },
    careerPaths: [
      { title: "Writer/Author", reason: "Allows full expression of their rich inner world and imagination" },
      { title: "Counselor/Therapist", reason: "Applies their deep empathy to help others heal" },
      { title: "Artist/Designer", reason: "Channels their creativity and aesthetic sensitivity" },
      { title: "Librarian", reason: "Combines love of ideas with meaningful service in a calm environment" },
      { title: "Social Worker", reason: "Allows them to advocate for their values while helping individuals" }
    ],
    growthAdvice: [
      "Develop practical skills alongside your idealism. Dreams need structure to become reality.",
      "Practice self-compassion. You deserve the same kindness you extend to others.",
      "Learn to express needs directly. Hoping others will intuit them leads to disappointment.",
      "Build tolerance for imperfection—in yourself, others, and the world. Perfect is the enemy of good.",
      "Take action on your values, even imperfectly. Living your ideals matters more than articulating them."
    ],
    famousExamples: [
      { name: "William Shakespeare", known_for: "Playwright, poet", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/440px-Shakespeare.jpg" },
      { name: "J.R.R. Tolkien", known_for: "Author, Lord of the Rings", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/J._R._R._Tolkien%2C_ca._1925.jpg/440px-J._R._R._Tolkien%2C_ca._1925.jpg" },
      { name: "Princess Diana", known_for: "Humanitarian, Princess of Wales", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Diana%2C_Princess_of_Wales_1997_%282%29.jpg/440px-Diana%2C_Princess_of_Wales_1997_%282%29.jpg" },
      { name: "John Lennon", known_for: "Musician, peace activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/John_Lennon_1969_%28cropped%29.jpg/440px-John_Lennon_1969_%28cropped%29.jpg" },
      { name: "Edgar Allan Poe", known_for: "Author, poet", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Edgar_Allan_Poe_2_retouched_and_transparent_bg.png/440px-Edgar_Allan_Poe_2_retouched_and_transparent_bg.png" },
      { name: "Kurt Cobain", known_for: "Nirvana frontman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Nirvana_around_1992.jpg/440px-Nirvana_around_1992.jpg" },
      { name: "Audrey Hepburn", known_for: "Actress, humanitarian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Audrey_Hepburn_1959.jpg/440px-Audrey_Hepburn_1959.jpg" },
      { name: "Vincent van Gogh", known_for: "Artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/440px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg" },
      { name: "Johnny Depp", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Johnny_Depp-2757_%28cropped%29.jpg/440px-Johnny_Depp-2757_%28cropped%29.jpg" },
      { name: "Tim Burton", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tim_Burton_%282012%29_3.jpg/440px-Tim_Burton_%282012%29_3.jpg" },
      { name: "Florence Welch", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Florence_and_the_Machine_at_Coachella%2C_2015.jpg/440px-Florence_and_the_Machine_at_Coachella%2C_2015.jpg" },
      { name: "Bjork", known_for: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Bj%C3%B6rk%2C_T%C3%ADvoli%2C_2003.jpg/440px-Bj%C3%B6rk%2C_T%C3%ADvoli%2C_2003.jpg" },
      { name: "Keanu Reeves", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Keanu_Reeves_2019_%28cropped%29.jpg/440px-Keanu_Reeves_2019_%28cropped%29.jpg" },
      { name: "Andrew Garfield", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Andrew_Garfield_by_Gage_Skidmore.jpg/440px-Andrew_Garfield_by_Gage_Skidmore.jpg" },
      { name: "Heath Ledger", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Heath_Ledger_%282%29.jpg/440px-Heath_Ledger_%282%29.jpg" },
      { name: "Emily Blunt", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Emily_Blunt_SAG_Awards_2019.png/440px-Emily_Blunt_SAG_Awards_2019.png" },
      { name: "Louis C.K.", known_for: "Comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Louis_CK_2012_Shankbone.JPG/440px-Louis_CK_2012_Shankbone.JPG" },
      { name: "Tom Hiddleston", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Tom_Hiddleston_at_SDCC_2016.jpg/440px-Tom_Hiddleston_at_SDCC_2016.jpg" },
      { name: "Helena Bonham Carter", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Helena_Bonham_Carter_%28Berlin_Film_Festival_2011%29_2.jpg/440px-Helena_Bonham_Carter_%28Berlin_Film_Festival_2011%29_2.jpg" },
      { name: "Virginia Woolf", known_for: "Author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg/440px-George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Harmonizer", "Innovator", "Explorer"],
      keyDimensions: "High Openness + High Agreeableness + Low Extraversion + Low Conscientiousness"
    }
  },

  enfj: {
    code: "ENFJ",
    nickname: "The Protagonist",
    tagline: "Charismatic leaders who inspire others to grow and achieve their potential",
    rarity: "2.5% of the population",
    description: [
      "ENFJs are natural-born leaders, but not in the commanding, directive sense. Their leadership emerges from genuine care for others and an ability to see and nurture potential that people don't even see in themselves. They lead by inspiring, encouraging, and creating environments where others can flourish.",
      "The ENFJ's superpower is their ability to make others feel seen, valued, and capable of more than they believed possible. They have an intuitive understanding of what people need to hear and how to deliver it. This isn't manipulation—it's genuine investment in others' growth, though immature ENFJs can use these skills less ethically.",
      "ENFJs think in terms of people and relationships. They naturally consider how decisions will affect everyone involved and work to create outcomes that benefit the group. This makes them excellent mediators and community builders, though they may sometimes sacrifice their own needs for harmony.",
      "Despite their warmth and social ease, ENFJs have a strategic side that's often overlooked. They don't just want to help individuals—they want to create lasting positive change. They think about systems, influence, and how to move groups toward better outcomes."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Extraverted Feeling (Fe)",
        description: "ENFJs lead with Fe, constantly reading and responding to the emotional needs of those around them. They create harmony and connection naturally, often without conscious effort."
      },
      auxiliary: {
        name: "Introverted Intuition (Ni)",
        description: "Ni gives ENFJs their vision and ability to see potential in people and situations. They can anticipate how relationships and events will unfold."
      },
      tertiary: {
        name: "Extraverted Sensing (Se)",
        description: "Se provides ENFJs with presence and awareness of their environment. It helps them read body language and respond to the moment."
      },
      inferior: {
        name: "Introverted Thinking (Ti)",
        description: "Ti is the ENFJ's weak point. They may struggle with impersonal logical analysis or become defensive when their reasoning is questioned. Under stress, they can become uncharacteristically critical or withdrawn."
      }
    },
    strengths: [
      { title: "Inspirational Leadership", description: "ENFJs motivate others not through authority but through genuine belief in their potential." },
      { title: "Emotional Intelligence", description: "They read people accurately and respond in ways that make others feel understood and valued." },
      { title: "Communication", description: "ENFJs articulate ideas in ways that resonate emotionally, making them powerful speakers and writers." },
      { title: "Community Building", description: "They naturally create connections between people and foster environments where relationships thrive." }
    ],
    blindspots: [
      { title: "Self-Neglect", description: "ENFJs often prioritize others' needs over their own, leading to burnout and resentment." },
      { title: "Approval-Seeking", description: "Their desire to be valued can make them overly dependent on external validation." },
      { title: "Conflict Avoidance", description: "They may smooth over problems rather than addressing them directly, allowing issues to fester." },
      { title: "Overinvolvement", description: "ENFJs can become too invested in others' lives, crossing boundaries or becoming controlling in their desire to help." }
    ],
    inRelationships: {
      romantic: "ENFJs are devoted, attentive partners who work actively to understand and meet their partner's needs. They remember important dates, anticipate desires, and create meaningful experiences. They need partners who reciprocate their investment and don't take their giving nature for granted.",
      friendship: "ENFJs are the friends who organize gatherings, remember birthdays, and check in when you've been quiet. They invest heavily in their friendships and create tight-knit communities. They need friends who appreciate their efforts and offer support in return.",
      workplace: "ENFJs excel in roles that involve developing others—teaching, coaching, HR, management. They create positive team cultures and bring out the best in colleagues. They struggle in competitive, impersonal environments or roles that don't involve human connection."
    },
    careerPaths: [
      { title: "Teacher/Professor", reason: "Directly applies their gift for developing others' potential" },
      { title: "HR Director", reason: "Shapes organizational culture and employee development" },
      { title: "Life Coach", reason: "Helps individuals identify and achieve their goals" },
      { title: "Nonprofit Leader", reason: "Combines their people skills with desire for meaningful impact" },
      { title: "Diplomat", reason: "Uses their ability to understand and bridge different perspectives" }
    ],
    growthAdvice: [
      "Schedule time for yourself as non-negotiable. You can't pour from an empty cup.",
      "Practice saying no without excessive explanation or guilt. Your boundaries matter.",
      "Develop comfort with conflict. Addressing problems directly often serves relationships better than avoiding them.",
      "Seek validation from within. Your worth doesn't depend on others' approval.",
      "Let others struggle sometimes. Growth often requires challenges you can't smooth away."
    ],
    famousExamples: [
      { name: "Oprah Winfrey", known_for: "Media mogul, philanthropist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/440px-Oprah_in_2014.jpg" },
      { name: "Barack Obama", known_for: "44th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/440px-President_Barack_Obama.jpg" },
      { name: "Martin Luther King Jr.", known_for: "Civil rights leader", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Martin_Luther_King%2C_Jr..jpg/440px-Martin_Luther_King%2C_Jr..jpg" },
      { name: "Maya Angelou", known_for: "Poet, memoirist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Angelou_at_Clinton_inauguration_%28cropped%29.jpg/440px-Angelou_at_Clinton_inauguration_%28cropped%29.jpg" },
      { name: "Reese Witherspoon", known_for: "Actress, producer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Reese_Witherspoon_2014.jpg/440px-Reese_Witherspoon_2014.jpg" },
      { name: "Bono", known_for: "U2 frontman, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Bono_at_the_2014_Dublin_Web_Summit.jpg/440px-Bono_at_the_2014_Dublin_Web_Summit.jpg" },
      { name: "Jennifer Lawrence", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Jennifer_Lawrence_SDCC_2015_X-Men.jpg/440px-Jennifer_Lawrence_SDCC_2015_X-Men.jpg" },
      { name: "John Cusack", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/John_Cusack_2012.jpg/440px-John_Cusack_2012.jpg" },
      { name: "Matthew McConaughey", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Matthew_McConaughey_2019.jpg/440px-Matthew_McConaughey_2019.jpg" },
      { name: "John Legend", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/John_Legend_2014_%28cropped%29.jpg/440px-John_Legend_2014_%28cropped%29.jpg" },
      { name: "Tony Robbins", known_for: "Motivational speaker", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Tony_Robbins.jpg/440px-Tony_Robbins.jpg" },
      { name: "Emma Thompson", known_for: "Actress, writer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Emma_Thompson_Césars_2022.png/440px-Emma_Thompson_Césars_2022.png" },
      { name: "Pope Francis", known_for: "Head of Catholic Church", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Pope_Francis_in_March_2013.jpg/440px-Pope_Francis_in_March_2013.jpg" },
      { name: "Ralph Nader", known_for: "Consumer advocate", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Ralph_Nader.jpg/440px-Ralph_Nader.jpg" },
      { name: "Ben Stiller", known_for: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Ben_Stiller_2019.jpg/440px-Ben_Stiller_2019.jpg" },
      { name: "Dakota Fanning", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Dakota_Fanning_2018.jpg/440px-Dakota_Fanning_2018.jpg" },
      { name: "Sean Connery", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Sean_Connery_%281983%29.jpg/440px-Sean_Connery_%281983%29.jpg" },
      { name: "Michael Jordan", known_for: "Basketball legend", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/440px-Michael_Jordan_in_2014.jpg" },
      { name: "Kate Winslet", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Kate_Winslet_at_the_2017_Toronto_International_Film_Festival_%28cropped%29.png/440px-Kate_Winslet_at_the_2017_Toronto_International_Film_Festival_%28cropped%29.png" },
      { name: "Drake", known_for: "Rapper, singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Drake_July_2016.jpg/440px-Drake_July_2016.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Connector", "Catalyst", "Guardian"],
      keyDimensions: "High Extraversion + High Agreeableness + High Conscientiousness"
    }
  },

  enfp: {
    code: "ENFP",
    nickname: "The Campaigner",
    tagline: "Enthusiastic free spirits who find joy in connecting ideas and people",
    rarity: "8.1% of the population",
    description: [
      "ENFPs are the enthusiasts of the personality world—individuals who approach life with infectious energy and see possibility everywhere they look. Their combination of creativity, warmth, and intellectual curiosity makes them natural connectors who bring people and ideas together in unexpected ways.",
      "The ENFP mind is a constant fireworks display of ideas, connections, and possibilities. They see potential in everything and everyone, which makes them inspiring companions but can also lead to scattered attention and unfinished projects. Their enthusiasm is genuine but can shift rapidly as new interests capture their imagination.",
      "What distinguishes ENFPs from other enthusiastic types is their depth. Beneath the bubbly exterior lies genuine concern for authenticity and meaning. They're not interested in surface-level connections or hollow achievements—they want experiences that matter and relationships that are real.",
      "ENFPs have a rebellious streak that resists being boxed in. They bristle at rigid expectations and conventional paths, preferring to forge their own way. This can make them seem flaky or irresponsible, but it's really a commitment to living authentically rather than following scripts written by others."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Extraverted Intuition (Ne)",
        description: "ENFPs lead with Ne, constantly generating possibilities and connections. They see the world as full of potential waiting to be explored."
      },
      auxiliary: {
        name: "Introverted Feeling (Fi)",
        description: "Fi gives ENFPs their depth and authenticity. They evaluate everything against their personal values and seek experiences that feel meaningful."
      },
      tertiary: {
        name: "Extraverted Thinking (Te)",
        description: "Te provides ENFPs with the ability to organize and implement their ideas when developed. It helps them turn possibilities into reality."
      },
      inferior: {
        name: "Introverted Sensing (Si)",
        description: "Si is the ENFP's weak point. They may neglect practical details, forget commitments, or struggle to learn from past mistakes. Under stress, they can become obsessed with physical symptoms or past failures."
      }
    },
    strengths: [
      { title: "Enthusiasm", description: "ENFPs bring genuine excitement to everything they do, energizing those around them and making ordinary situations feel special." },
      { title: "Creativity", description: "Their constant idea generation and ability to see connections makes them excellent innovators and problem-solvers." },
      { title: "People Skills", description: "ENFPs connect easily with diverse people, making others feel interesting and valued." },
      { title: "Authenticity", description: "They live according to their values and encourage others to do the same, creating space for genuine expression." }
    ],
    blindspots: [
      { title: "Follow-Through", description: "The excitement of new possibilities can overshadow the discipline needed to finish what they start." },
      { title: "Practical Details", description: "ENFPs may overlook logistics, deadlines, and administrative requirements in their enthusiasm for ideas." },
      { title: "Emotional Overwhelm", description: "Their sensitivity can lead to dramatic emotional swings, especially when they feel their values are violated." },
      { title: "People-Pleasing", description: "Their desire for connection can lead them to overcommit or avoid necessary conflict." }
    ],
    inRelationships: {
      romantic: "ENFPs bring passion, creativity, and deep emotional connection to relationships. They want partners who can match their intellectual curiosity and emotional depth. They show love through enthusiasm, quality time, and helping partners see their own potential. They need freedom within relationships and partners who don't try to constrain their spirit.",
      friendship: "ENFPs collect friends everywhere they go, drawn to interesting people across all walks of life. They're the friends who make you feel like the most fascinating person in the room. They need friends who can handle their intensity and don't take their occasional flakiness personally.",
      workplace: "ENFPs thrive in creative, collaborative environments that value innovation and human connection. They struggle with routine, micromanagement, and work that feels meaningless. They contribute best when they can generate ideas and inspire others, but may need support with implementation."
    },
    careerPaths: [
      { title: "Creative Director", reason: "Combines their creativity with ability to inspire and lead creative teams" },
      { title: "Entrepreneur", reason: "Provides the variety and autonomy they crave while allowing them to pursue their vision" },
      { title: "Journalist", reason: "Satisfies their curiosity while connecting with diverse people and stories" },
      { title: "Counselor", reason: "Applies their empathy and insight to help others grow" },
      { title: "Actor/Performer", reason: "Channels their expressiveness and desire for authentic connection" }
    ],
    growthAdvice: [
      "Develop systems for managing commitments. Your word matters, even when enthusiasm fades.",
      "Practice sitting with discomfort rather than seeking distraction. Growth often requires staying with difficulty.",
      "Learn to say no to good opportunities so you can say yes to great ones. Focus amplifies impact.",
      "Build tolerance for routine. Some structure actually enables creativity rather than constraining it.",
      "Distinguish between authentic values and momentary feelings. Not every emotion requires action."
    ],
    famousExamples: [
      { name: "Robin Williams", known_for: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Robin_Williams_2011a_%282%29.jpg/440px-Robin_Williams_2011a_%282%29.jpg" },
      { name: "Walt Disney", known_for: "Animator, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Walt_Disney_1946.JPG/440px-Walt_Disney_1946.JPG" },
      { name: "Ellen DeGeneres", known_for: "Comedian, talk show host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Ellen_DeGeneres_2011.jpg/440px-Ellen_DeGeneres_2011.jpg" },
      { name: "Robert Downey Jr.", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/440px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg" },
      { name: "Will Smith", known_for: "Actor, rapper", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TechCrunch_Disrupt_2019_%2848834434641%29_%28cropped%29.jpg/440px-TechCrunch_Disrupt_2019_%2848834434641%29_%28cropped%29.jpg" },
      { name: "Sandra Bullock", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Sandra_Bullock_in_2013_by_Gage_Skidmore.jpg/440px-Sandra_Bullock_in_2013_by_Gage_Skidmore.jpg" },
      { name: "Russell Brand", known_for: "Comedian, actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Russell_Brand_Arthur_Premiere.jpg/440px-Russell_Brand_Arthur_Premiere.jpg" },
      { name: "Mark Twain", known_for: "Author, humorist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mark_Twain_by_AF_Bradley.jpg/440px-Mark_Twain_by_AF_Bradley.jpg" },
      { name: "Anne Frank", known_for: "Diarist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Anne_Frank_lance_un_regard_complice_-_Anne_Frank_Fonds_BS.jpg/440px-Anne_Frank_lanceun_regard_complice_-_Anne_Frank_Fonds_BS.jpg" },
      { name: "Drew Barrymore", known_for: "Actress, producer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Drew_Barrymore_2019.jpg/440px-Drew_Barrymore_2019.jpg" },
      { name: "Janis Joplin", known_for: "Rock singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Janis_Joplin_1970.JPG/440px-Janis_Joplin_1970.JPG" },
      { name: "Oscar Wilde", known_for: "Writer, playwright", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Oscar_Wilde_Sarony.jpg/440px-Oscar_Wilde_Sarony.jpg" },
      { name: "Jerry Seinfeld", known_for: "Comedian, actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Jerry_Seinfeld_2016_-_2.jpg/440px-Jerry_Seinfeld_2016_-_2.jpg" },
      { name: "Keira Knightley", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Keira_Knightley_at_TIFF_2018_%28cropped%29.jpg/440px-Keira_Knightley_at_TIFF_2018_%28cropped%29.jpg" },
      { name: "Hunter S. Thompson", known_for: "Journalist, author", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hunter_S._Thompson.jpg/440px-Hunter_S._Thompson.jpg" },
      { name: "Quentin Tarantino", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Quentin_Tarantino_by_Gage_Skidmore.jpg/440px-Quentin_Tarantino_by_Gage_Skidmore.jpg" },
      { name: "Gwen Stefani", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Gwen_Stefani_2016.jpg/440px-Gwen_Stefani_2016.jpg" },
      { name: "Kelly Clarkson", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Kelly_Clarkson%2C_2018.jpg/440px-Kelly_Clarkson%2C_2018.jpg" },
      { name: "Alicia Keys", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Alicia_Keys_2020_cropped.png/440px-Alicia_Keys_2020_cropped.png" },
      { name: "Cher", known_for: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Cher_in_2019_%28cropped%29.jpg/440px-Cher_in_2019_%28cropped%29.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Catalyst", "Explorer", "Innovator"],
      keyDimensions: "High Openness + High Extraversion + High Agreeableness"
    }
  },

  istj: {
    code: "ISTJ",
    nickname: "The Logistician",
    tagline: "Dependable traditionalists who value responsibility and follow-through",
    rarity: "11.6% of the population",
    description: [
      "ISTJs are the backbone of society—reliable, hardworking individuals who take their responsibilities seriously and follow through on their commitments. They may not seek the spotlight, but organizations and families depend on their steady, consistent contributions more than most people realize.",
      "The ISTJ mind values clarity, order, and proven methods. They're not opposed to change, but they want evidence that new approaches actually work before abandoning what's reliable. This makes them excellent at maintaining systems and standards that others might neglect in pursuit of novelty.",
      "ISTJs have a strong sense of duty that extends to their work, family, and community. They don't just do what's required—they do what's right, even when no one is watching. This integrity is so fundamental to their nature that they often assume others share it, leading to disappointment when they don't.",
      "Despite their serious demeanor, ISTJs have a dry wit and deep loyalty that emerges in close relationships. They may not express affection effusively, but they show love through consistent actions—being there, following through, and quietly handling responsibilities that make others' lives easier."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Introverted Sensing (Si)",
        description: "ISTJs lead with Si, drawing on detailed memories of past experiences to guide present decisions. They value tradition and proven methods because they've seen what works."
      },
      auxiliary: {
        name: "Extraverted Thinking (Te)",
        description: "Te gives ISTJs their drive for efficiency and clear organization. They create systems and procedures that ensure things run smoothly."
      },
      tertiary: {
        name: "Introverted Feeling (Fi)",
        description: "Fi provides ISTJs with a strong internal sense of right and wrong. They have deep values that guide their behavior, even if they don't discuss them openly."
      },
      inferior: {
        name: "Extraverted Intuition (Ne)",
        description: "Ne is the ISTJ's weak point. They may struggle with ambiguity, resist change, or miss possibilities that don't fit their experience. Under stress, they can become catastrophic in their thinking."
      }
    },
    strengths: [
      { title: "Reliability", description: "When ISTJs commit to something, it gets done. Their word is their bond, and they take commitments seriously." },
      { title: "Attention to Detail", description: "They notice and remember specifics that others overlook, preventing errors and ensuring quality." },
      { title: "Organizational Skills", description: "ISTJs create and maintain systems that keep things running smoothly." },
      { title: "Integrity", description: "They do what's right because it's right, not for recognition or reward." }
    ],
    blindspots: [
      { title: "Adaptability", description: "ISTJs may resist change even when it's necessary, clinging to familiar methods past their usefulness." },
      { title: "Emotional Expression", description: "They may struggle to express feelings or respond to others' emotional needs." },
      { title: "Flexibility", description: "Their commitment to rules and procedures can become rigidity that frustrates others." },
      { title: "Innovation", description: "Focus on proven methods may cause them to miss better approaches or dismiss creative solutions." }
    ],
    inRelationships: {
      romantic: "ISTJs show love through actions rather than words—handling responsibilities, being reliable, and creating stability. They're loyal partners who take commitment seriously. They need partners who appreciate their steady nature and don't require constant emotional expression.",
      friendship: "ISTJs maintain long-term friendships with people who've proven themselves trustworthy. They're not the most exciting friends, but they're the ones who show up when it matters. They value friends who respect their time and don't create unnecessary drama.",
      workplace: "ISTJs are ideal employees for roles requiring accuracy, reliability, and attention to detail. They follow procedures, meet deadlines, and maintain high standards. They struggle with ambiguity, frequent changes, and colleagues who don't pull their weight."
    },
    careerPaths: [
      { title: "Accountant", reason: "Combines their attention to detail with clear rules and procedures" },
      { title: "Military Officer", reason: "Values their respect for hierarchy, duty, and following through on commitments" },
      { title: "Lawyer", reason: "Applies their thoroughness and respect for rules to legal practice" },
      { title: "Project Manager", reason: "Uses their organizational skills to keep complex projects on track" },
      { title: "Quality Assurance", reason: "Leverages their eye for detail to maintain standards" }
    ],
    growthAdvice: [
      "Practice flexibility. Sometimes the best solution isn't the traditional one.",
      "Express appreciation verbally, not just through actions. Others need to hear it.",
      "Stay open to new methods. Your experience is valuable but not comprehensive.",
      "Allow for ambiguity. Not everything can or should be systematized.",
      "Take time for activities that have no practical purpose. Play has value too."
    ],
    famousExamples: [
      { name: "George Washington", known_for: "1st US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg/440px-Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg" },
      { name: "Queen Elizabeth II", known_for: "British monarch", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Queen_Elizabeth_II_in_March_2015.jpg/440px-Queen_Elizabeth_II_in_March_2015.jpg" },
      { name: "Warren Buffett", known_for: "Investor, businessman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Warren_Buffett_KU_Visit.jpg/440px-Warren_Buffett_KU_Visit.jpg" },
      { name: "Angela Merkel", known_for: "Former German Chancellor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Angela_Merkel_%282019%29_cropped.jpg/440px-Angela_Merkel_%282019%29_cropped.jpg" },
      { name: "Denzel Washington", known_for: "Actor, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Denzel_Washington_2018.jpg/440px-Denzel_Washington_2018.jpg" },
      { name: "Anthony Hopkins", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/AnthonyHopkins10TIFF.jpg/440px-AnthonyHopkins10TIFF.jpg" },
      { name: "Jeff Sessions", known_for: "Former Attorney General", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Jeff_Sessions%2C_official_portrait.jpg/440px-Jeff_Sessions%2C_official_portrait.jpg" },
      { name: "Natalie Portman", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Natalie_Portman_%2835332270293%29_%28cropped%29.jpg/440px-Natalie_Portman_%2835332270293%29_%28cropped%29.jpg" },
      { name: "Condoleezza Rice", known_for: "Secretary of State", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Condoleezza_Rice_cropped.jpg/440px-Condoleezza_Rice_cropped.jpg" },
      { name: "Robert De Niro", known_for: "Actor, producer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Robert_De_Niro_Cannes_2016.jpg/440px-Robert_De_Niro_Cannes_2016.jpg" },
      { name: "Sting", known_for: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Sting_in_2015.jpg/440px-Sting_in_2015.jpg" },
      { name: "Julia Roberts", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Julia_Roberts_2011.jpg/440px-Julia_Roberts_2011.jpg" },
      { name: "Matt Damon", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Matt_Damon_TIFF_2015.jpg/440px-Matt_Damon_TIFF_2015.jpg" },
      { name: "Jackie Chan", known_for: "Actor, martial artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Jackie_Chan_July_2016.jpg/440px-Jackie_Chan_July_2016.jpg" },
      { name: "Karl Marx", known_for: "Philosopher, economist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Karl_Marx_001.jpg/440px-Karl_Marx_001.jpg" },
      { name: "Henry Ford", known_for: "Ford founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Henry_ford_1919.jpg/440px-Henry_ford_1919.jpg" },
      { name: "Sigmund Freud", known_for: "Psychoanalyst", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Sigmund_Freud%2C_by_Max_Halberstadt_%28cropped%29.jpg/440px-Sigmund_Freud%2C_by_Max_Halberstadt_%28cropped%29.jpg" },
      { name: "Hermione Granger", known_for: "Harry Potter character", image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Hermione_Granger_poster.jpg/440px-Hermione_Granger_poster.jpg" },
      { name: "Colin Powell", known_for: "General, Secretary of State", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Colin_Powell_official_Secretary_of_State_photo.jpg/440px-Colin_Powell_official_Secretary_of_State_photo.jpg" },
      { name: "George H.W. Bush", known_for: "41st US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/George_H._W._Bush%2C_President_of_the_United_States%2C_1989_official_portrait_%28cropped%29.jpg/440px-George_H._W._Bush%2C_President_of_the_United_States%2C_1989_official_portrait_%28cropped%29.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Strategist", "Guardian", "Analyst"],
      keyDimensions: "High Conscientiousness + Low Openness + Low Extraversion"
    }
  },

  isfj: {
    code: "ISFJ",
    nickname: "The Defender",
    tagline: "Dedicated protectors who combine warmth with quiet determination",
    rarity: "13.8% of the population",
    description: [
      "ISFJs are the unsung heroes of the personality world—individuals who work tirelessly behind the scenes to support others and maintain the social fabric that holds communities together. They may not seek recognition, but their contributions are essential and often irreplaceable.",
      "The ISFJ's defining quality is their attentiveness to others' needs. They remember birthdays, notice when someone seems off, and anticipate what people need before they ask. This isn't calculated—it's a natural orientation toward care that makes others feel seen and valued.",
      "ISFJs have excellent memories for personal details and past experiences, which they use to create continuity and tradition. They're the keepers of family histories, the maintainers of rituals, and the ones who ensure important occasions are properly observed.",
      "Despite their gentle nature, ISFJs have a strong sense of duty and will work themselves to exhaustion for those they care about. They often struggle to set boundaries or prioritize their own needs, seeing self-care as selfish when others might need them."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Introverted Sensing (Si)",
        description: "ISFJs lead with Si, drawing on detailed memories of past experiences, especially those involving people and relationships. They value tradition and continuity."
      },
      auxiliary: {
        name: "Extraverted Feeling (Fe)",
        description: "Fe drives ISFJs to create harmony and meet others' needs. They're highly attuned to social dynamics and work to maintain positive relationships."
      },
      tertiary: {
        name: "Introverted Thinking (Ti)",
        description: "Ti gives ISFJs analytical capabilities that help them solve practical problems and understand how things work."
      },
      inferior: {
        name: "Extraverted Intuition (Ne)",
        description: "Ne is the ISFJ's weak point. They may struggle with change, miss abstract possibilities, or become anxious about uncertain futures. Under stress, they can catastrophize about what might go wrong."
      }
    },
    strengths: [
      { title: "Supportiveness", description: "ISFJs provide consistent, practical support that makes others' lives easier and more comfortable." },
      { title: "Reliability", description: "They follow through on commitments and can be counted on in times of need." },
      { title: "Observant Care", description: "ISFJs notice what others need and remember important personal details." },
      { title: "Patience", description: "They can work steadily on tasks that others would find tedious, maintaining quality throughout." }
    ],
    blindspots: [
      { title: "Self-Neglect", description: "ISFJs often prioritize others' needs to the point of exhaustion and burnout." },
      { title: "Difficulty with Change", description: "They may resist new approaches or become anxious when routines are disrupted." },
      { title: "Conflict Avoidance", description: "Their desire for harmony can lead them to suppress their own needs or avoid necessary confrontations." },
      { title: "Undervaluing Themselves", description: "ISFJs often don't recognize the value of their contributions or advocate for themselves." }
    ],
    inRelationships: {
      romantic: "ISFJs are devoted partners who show love through acts of service and consistent care. They remember what matters to their partners and work to create comfortable, harmonious homes. They need partners who appreciate their efforts and don't take their giving nature for granted.",
      friendship: "ISFJs are loyal, supportive friends who remember important dates and show up during difficult times. They prefer deep connections with a few people over large social networks. They need friends who reciprocate their care and don't just take from the relationship.",
      workplace: "ISFJs excel in supportive roles that involve helping others—healthcare, education, administrative support. They're reliable team members who ensure nothing falls through the cracks. They struggle with conflict, rapid change, and environments that don't value their contributions."
    },
    careerPaths: [
      { title: "Nurse", reason: "Directly applies their caring nature and attention to detail in service of others' health" },
      { title: "Elementary Teacher", reason: "Combines their patience and nurturing with creating structure for children" },
      { title: "Social Worker", reason: "Allows them to provide practical support to those in need" },
      { title: "Administrative Assistant", reason: "Uses their organizational skills and attention to detail to support others" },
      { title: "Librarian", reason: "Combines service orientation with love of tradition and organization" }
    ],
    growthAdvice: [
      "Practice setting boundaries. Saying no to some things allows you to say yes to what matters most.",
      "Recognize that self-care isn't selfish. You can't pour from an empty cup.",
      "Express your needs directly. Others can't read your mind, and hinting often doesn't work.",
      "Embrace some change. Not all new things are threats to what you value.",
      "Accept appreciation gracefully. Your contributions deserve recognition."
    ],
    famousExamples: [
      { name: "Mother Teresa", known_for: "Humanitarian, missionary", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mother_Teresa_1.jpg/440px-Mother_Teresa_1.jpg" },
      { name: "Kate Middleton", known_for: "Princess of Wales", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Catherine%2C_Duchess_of_Cambridge_in_2019.jpg/440px-Catherine%2C_Duchess_of_Cambridge_in_2019.jpg" },
      { name: "Rosa Parks", known_for: "Civil rights activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Rosaparks.jpg/440px-Rosaparks.jpg" },
      { name: "Beyoncé", known_for: "Singer, entertainer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png/440px-Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png" },
      { name: "Anne Hathaway", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Anne_Hathaway_at_TIFF_2012_%28cropped%29.jpg/440px-Anne_Hathaway_at_TIFF_2012_%28cropped%29.jpg" },
      { name: "Vin Diesel", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Vin_Diesel_2013_%28cropped%29.jpg/440px-Vin_Diesel_2013_%28cropped%29.jpg" },
      { name: "Kim Kardashian", known_for: "Media personality", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Kim_Kardashian_in_2018.jpg/440px-Kim_Kardashian_in_2018.jpg" },
      { name: "Halle Berry", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Halle_Berry_by_Gage_Skidmore_2.jpg/440px-Halle_Berry_by_Gage_Skidmore_2.jpg" },
      { name: "Selena Gomez", known_for: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Selena_Gomez_-_Revival_Tour_%28cropped%29.jpg/440px-Selena_Gomez_-_Revival_Tour_%28cropped%29.jpg" },
      { name: "Jimmy Carter", known_for: "39th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/JimmyCarterPortrait2.jpg/440px-JimmyCarterPortrait2.jpg" },
      { name: "Dr. Dre", known_for: "Rapper, producer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Dr._Dre_in_2020.png/440px-Dr._Dre_in_2020.png" },
      { name: "Tiger Woods", known_for: "Professional golfer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TigerWoodsOfficialPortrait.jpg/440px-TigerWoodsOfficialPortrait.jpg" },
      { name: "Bruce Willis", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Bruce_Willis_by_Gage_Skidmore_2.jpg/440px-Bruce_Willis_by_Gage_Skidmore_2.jpg" },
      { name: "50 Cent", known_for: "Rapper, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/50_Cent_in_2012.jpg/440px-50_Cent_in_2012.jpg" },
      { name: "Christopher Walken", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Christopher_Walken_Cannes_2016.jpg/440px-Christopher_Walken_Cannes_2016.jpg" },
      { name: "Katie Holmes", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Katie_Holmes_at_the_launch_of_Mamarazzi_%28cropped%29.jpg/440px-Katie_Holmes_at_the_launch_of_Mamarazzi_%28cropped%29.jpg" },
      { name: "Lance Armstrong", known_for: "Cyclist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Lance_Armstrong_Tour_2010_team_presentation.jpg/440px-Lance_Armstrong_Tour_2010_team_presentation.jpg" },
      { name: "Aretha Franklin", known_for: "Queen of Soul", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Aretha_Franklin_1968.jpg/440px-Aretha_Franklin_1968.jpg" },
      { name: "David Copperfield", known_for: "Magician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/David_Copperfield.jpg/440px-David_Copperfield.jpg" },
      { name: "Ed Sheeran", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Ed_Sheeran_2013.jpg/440px-Ed_Sheeran_2013.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Guardian", "Harmonizer", "Connector"],
      keyDimensions: "High Agreeableness + High Conscientiousness + Low Extraversion"
    }
  },

  estj: {
    code: "ESTJ",
    nickname: "The Executive",
    tagline: "Organized administrators who bring order and get things done",
    rarity: "8.7% of the population",
    description: [
      "ESTJs are the organizers and administrators who keep society running smoothly. They have a natural talent for creating order, establishing procedures, and ensuring that things get done correctly and on time. In a world that often feels chaotic, ESTJs provide the structure that others depend on.",
      "The ESTJ mind thinks in terms of systems, hierarchies, and clear expectations. They believe in doing things the right way—not out of rigidity, but because they've seen how proper procedures prevent problems and create efficiency. They're frustrated by people who cut corners or ignore established methods.",
      "ESTJs take their responsibilities seriously and expect others to do the same. They lead by example, working hard and meeting their commitments. They may come across as demanding, but their standards apply to themselves first. They have little patience for excuses or victim mentality.",
      "Despite their task-oriented nature, ESTJs are deeply committed to their communities and families. They show love through providing, protecting, and ensuring that those they care about have what they need. They may not be emotionally expressive, but their dedication is unmistakable."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Extraverted Thinking (Te)",
        description: "ESTJs lead with Te, naturally organizing the external world for efficiency and results. They think out loud, make quick decisions, and expect clear outcomes."
      },
      auxiliary: {
        name: "Introverted Sensing (Si)",
        description: "Si gives ESTJs their respect for tradition and proven methods. They draw on past experience to guide decisions and value continuity."
      },
      tertiary: {
        name: "Extraverted Intuition (Ne)",
        description: "Ne provides ESTJs with some openness to new possibilities, though they prefer to work within established frameworks."
      },
      inferior: {
        name: "Introverted Feeling (Fi)",
        description: "Fi is the ESTJ's weak point. They may struggle with their own emotions or fail to consider personal values in decision-making. Under stress, they can become uncharacteristically sensitive or feel unappreciated."
      }
    },
    strengths: [
      { title: "Organization", description: "ESTJs create and maintain systems that keep things running smoothly." },
      { title: "Decisiveness", description: "They make clear decisions and take action rather than deliberating endlessly." },
      { title: "Reliability", description: "When ESTJs commit to something, it gets done. They take their word seriously." },
      { title: "Direct Communication", description: "They say what they mean clearly, eliminating ambiguity and confusion." }
    ],
    blindspots: [
      { title: "Emotional Sensitivity", description: "ESTJs may overlook or dismiss emotional factors, damaging relationships without realizing it." },
      { title: "Flexibility", description: "Their commitment to established methods can become rigidity that prevents adaptation." },
      { title: "Innovation", description: "Focus on proven approaches may cause them to miss better solutions or dismiss creative ideas." },
      { title: "Patience", description: "They can become frustrated with people who work differently or need more time to process." }
    ],
    inRelationships: {
      romantic: "ESTJs show love through providing, protecting, and creating stability. They're loyal partners who take commitment seriously. They need partners who appreciate their practical nature and don't require constant emotional processing.",
      friendship: "ESTJs maintain friendships through shared activities and mutual respect. They're reliable friends who show up when needed and expect the same in return. They value friends who are straightforward and don't create unnecessary drama.",
      workplace: "ESTJs excel in management and administrative roles that require organization and clear direction. They create efficient systems and hold teams accountable. They struggle with ambiguity, constant change, and colleagues who don't meet their commitments."
    },
    careerPaths: [
      { title: "Operations Manager", reason: "Uses their organizational skills to ensure smooth business operations" },
      { title: "Military Officer", reason: "Values their respect for hierarchy, duty, and clear command structure" },
      { title: "School Administrator", reason: "Applies their organizational skills to educational institutions" },
      { title: "Financial Manager", reason: "Combines their attention to procedure with responsibility for resources" },
      { title: "Judge", reason: "Uses their respect for rules and procedures in service of justice" }
    ],
    growthAdvice: [
      "Consider emotional factors in decisions. Logic isn't the only valid input.",
      "Practice flexibility. Sometimes the best solution isn't the established one.",
      "Listen to understand, not just to respond. Others' perspectives have value.",
      "Recognize that different doesn't mean wrong. Other approaches can also work.",
      "Express appreciation for who people are, not just what they accomplish."
    ],
    famousExamples: [
      { name: "Henry Ford", known_for: "Ford Motor Company founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Henry_ford_1919.jpg/440px-Henry_ford_1919.jpg" },
      { name: "John D. Rockefeller", known_for: "Industrialist, philanthropist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/John_D._Rockefeller_1885.jpg/440px-John_D._Rockefeller_1885.jpg" },
      { name: "Judge Judy", known_for: "Television judge", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Judge_Judy_Sheindlin_VF_2012_Shankbone.JPG/440px-Judge_Judy_Sheindlin_VF_2012_Shankbone.JPG" },
      { name: "Lyndon B. Johnson", known_for: "36th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/37_Lyndon_Johnson_3x4.jpg/440px-37_Lyndon_Johnson_3x4.jpg" },
      { name: "Martha Stewart", known_for: "Business magnate", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Martha_Stewart_2011_Shankbone_2.JPG/440px-Martha_Stewart_2011_Shankbone_2.JPG" },
      { name: "Sonia Sotomayor", known_for: "Supreme Court Justice", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Sonia_Sotomayor_in_SCOTUS_robe.jpg/440px-Sonia_Sotomayor_in_SCOTUS_robe.jpg" },
      { name: "Dr. Phil", known_for: "TV personality", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Phil_McGraw%2C_2013_%28cropped%29.jpg/440px-Phil_McGraw%2C_2013_%28cropped%29.jpg" },
      { name: "Michelle Pfeiffer", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Michelle_Pfeiffer_2018.png/440px-Michelle_Pfeiffer_2018.png" },
      { name: "Vince Lombardi", known_for: "Football coach", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vince_Lombardi.jpg/440px-Vince_Lombardi.jpg" },
      { name: "Emma Watson", known_for: "Actress, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Emma_Watson_2013.jpg/440px-Emma_Watson_2013.jpg" },
      { name: "Alec Baldwin", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Alec_Baldwin_3%2C_2010.jpg/440px-Alec_Baldwin_3%2C_2010.jpg" },
      { name: "Nancy Pelosi", known_for: "Speaker of the House", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Nancy_Pelosi_official_photo.jpg/440px-Nancy_Pelosi_official_photo.jpg" },
      { name: "John Wayne", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/John_Wayne_-_still_portrait.jpg/440px-John_Wayne_-_still_portrait.jpg" },
      { name: "Sam Walton", known_for: "Walmart founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Walton.png/440px-Walton.png" },
      { name: "Frank Sinatra", known_for: "Singer, actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Frank_Sinatra_%2757.jpg/440px-Frank_Sinatra_%2757.jpg" },
      { name: "Billy Graham", known_for: "Evangelist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Billy_Graham_bw_photo%2C_April_11%2C_1966.jpg/440px-Billy_Graham_bw_photo%2C_April_11%2C_1966.jpg" },
      { name: "Mike Pence", known_for: "48th Vice President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Mike_Pence_official_portrait.jpg/440px-Mike_Pence_official_portrait.jpg" },
      { name: "Bernard Law Montgomery", known_for: "British Field Marshal", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bernard_Montgomery.jpg/440px-Bernard_Montgomery.jpg" },
      { name: "Douglas MacArthur", known_for: "US General", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Douglas_MacArthur_smoking_his_corncob_pipe.jpg/440px-Douglas_MacArthur_smoking_his_corncob_pipe.jpg" },
      { name: "Kamala Harris", known_for: "Vice President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Kamala_Harris_Vice_Presidential_Portrait.jpg/440px-Kamala_Harris_Vice_Presidential_Portrait.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Strategist", "Achiever", "Guardian"],
      keyDimensions: "High Conscientiousness + High Extraversion + Low Openness"
    }
  },

  esfj: {
    code: "ESFJ",
    nickname: "The Consul",
    tagline: "Caring community builders who bring people together",
    rarity: "12.3% of the population",
    description: [
      "ESFJs are the social glue that holds communities together—warm, attentive individuals who naturally create connections and ensure everyone feels included. They have an instinctive understanding of social dynamics and work tirelessly to maintain harmony in their groups.",
      "The ESFJ's defining quality is their genuine care for others' wellbeing. They notice when someone is left out, remember important occasions, and go out of their way to make others feel valued. This isn't performance—it's a fundamental orientation toward nurturing relationships.",
      "ESFJs value tradition and social conventions because they see how these create shared meaning and connection. They're often the ones who maintain family traditions, organize community events, and ensure that important milestones are properly celebrated.",
      "Despite their warmth, ESFJs have clear expectations about how people should behave and can be surprisingly firm when those expectations are violated. They believe in doing the right thing and can become judgmental toward those who don't share their values."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Extraverted Feeling (Fe)",
        description: "ESFJs lead with Fe, constantly reading and responding to the social and emotional needs of those around them. They create harmony naturally and feel responsible for group morale."
      },
      auxiliary: {
        name: "Introverted Sensing (Si)",
        description: "Si gives ESFJs their appreciation for tradition and attention to personal details. They remember what matters to people and create continuity through rituals and customs."
      },
      tertiary: {
        name: "Extraverted Intuition (Ne)",
        description: "Ne provides ESFJs with some openness to new ideas, though they prefer to work within familiar social frameworks."
      },
      inferior: {
        name: "Introverted Thinking (Ti)",
        description: "Ti is the ESFJ's weak point. They may struggle with impersonal logical analysis or become defensive when their reasoning is questioned. Under stress, they can become uncharacteristically critical or withdrawn."
      }
    },
    strengths: [
      { title: "Social Intelligence", description: "ESFJs read social dynamics accurately and know how to navigate complex interpersonal situations." },
      { title: "Caring Nature", description: "They genuinely care about others' wellbeing and work to ensure everyone feels included and valued." },
      { title: "Organizational Skills", description: "ESFJs excel at organizing events and coordinating people toward shared goals." },
      { title: "Reliability", description: "They follow through on commitments and can be counted on to show up when needed." }
    ],
    blindspots: [
      { title: "Approval-Seeking", description: "ESFJs may become overly dependent on external validation and struggle when criticized." },
      { title: "Difficulty with Conflict", description: "Their desire for harmony can lead them to avoid necessary confrontations." },
      { title: "Rigidity", description: "Strong attachment to 'how things should be done' can make them judgmental or inflexible." },
      { title: "Self-Neglect", description: "Focus on others' needs can come at the expense of their own wellbeing." }
    ],
    inRelationships: {
      romantic: "ESFJs are devoted partners who show love through care, attention, and creating a warm home. They remember important dates, anticipate needs, and work to maintain harmony. They need partners who appreciate their efforts and offer emotional support in return.",
      friendship: "ESFJs are the friends who organize gatherings, remember birthdays, and ensure no one is left out. They invest heavily in their friendships and expect reciprocity. They need friends who appreciate their care and don't just take from the relationship.",
      workplace: "ESFJs excel in roles that involve supporting others and creating positive team environments. They're reliable team members who ensure social cohesion. They struggle with impersonal environments, frequent criticism, and colleagues who don't value relationships."
    },
    careerPaths: [
      { title: "Event Planner", reason: "Combines their organizational skills with love of bringing people together" },
      { title: "Nurse", reason: "Applies their caring nature in direct service of others' health" },
      { title: "Human Resources", reason: "Uses their people skills to support employees and organizational culture" },
      { title: "Elementary Teacher", reason: "Combines their nurturing nature with creating structure for children" },
      { title: "Social Worker", reason: "Allows them to provide practical support to those in need" }
    ],
    growthAdvice: [
      "Develop internal validation. Your worth doesn't depend on others' approval.",
      "Practice setting boundaries. Taking care of yourself isn't selfish.",
      "Be open to different ways of doing things. Your way isn't the only right way.",
      "Learn to sit with conflict. Addressing problems directly often serves relationships better than avoiding them.",
      "Examine your 'shoulds.' Some social expectations deserve questioning."
    ],
    famousExamples: [
      { name: "Taylor Swift", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/440px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png" },
      { name: "Bill Clinton", known_for: "42nd US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/440px-Bill_Clinton.jpg" },
      { name: "Jennifer Garner", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/JenniferGarnerAug07.jpg/440px-JenniferGarnerAug07.jpg" },
      { name: "Steve Harvey", known_for: "Television host, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Steve_Harvey_2017.jpg/440px-Steve_Harvey_2017.jpg" },
      { name: "Hugh Jackman", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Hugh_Jackman_by_Gage_Skidmore.jpg/440px-Hugh_Jackman_by_Gage_Skidmore.jpg" },
      { name: "Danny DeVito", known_for: "Actor, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Danny_DeVito_by_Gage_Skidmore.jpg/440px-Danny_DeVito_by_Gage_Skidmore.jpg" },
      { name: "Mariah Carey", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Mariah_Carey_2019_by_Glenn_Francis.jpg/440px-Mariah_Carey_2019_by_Glenn_Francis.jpg" },
      { name: "Jennifer Lopez", known_for: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Jennifer_Lopez_2018_2_%28cropped%29.jpg/440px-Jennifer_Lopez_2018_2_%28cropped%29.jpg" },
      { name: "Whitney Houston", known_for: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Whitney_Houston_Welcome_Home_Heroes_1_cropped.jpg/440px-Whitney_Houston_Welcome_Home_Heroes_1_cropped.jpg" },
      { name: "Tyra Banks", known_for: "Model, TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tyra_Banks_2019_2.jpg/440px-Tyra_Banks_2019_2.jpg" },
      { name: "Larry King", known_for: "TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Larry_King.jpg/440px-Larry_King.jpg" },
      { name: "Andrew Carnegie", known_for: "Industrialist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Andrew_Carnegie%2C_three-quarter_length_portrait%2C_seated%2C_facing_slightly_left%2C_1913.jpg/440px-Andrew_Carnegie%2C_three-quarter_length_portrait%2C_seated%2C_facing_slightly_left%2C_1913.jpg" },
      { name: "Desmond Tutu", known_for: "Archbishop, activist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Desmond_Tutu_2013.jpg/440px-Desmond_Tutu_2013.jpg" },
      { name: "Sally Field", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Sally_Field_cropped.jpg/440px-Sally_Field_cropped.jpg" },
      { name: "Nancy Reagan", known_for: "Former First Lady", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Nancy_Reagan_portrait.jpg/440px-Nancy_Reagan_portrait.jpg" },
      { name: "Mary Tyler Moore", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Mary_Tyler_Moore_1971.JPG/440px-Mary_Tyler_Moore_1971.JPG" },
      { name: "Pope John Paul II", known_for: "Head of Catholic Church", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/John_Paul_II_Medal_of_Freedom_2004.jpg/440px-John_Paul_II_Medal_of_Freedom_2004.jpg" },
      { name: "Elton John", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Elton_John_2017.jpg/440px-Elton_John_2017.jpg" },
      { name: "Prince William", known_for: "Duke of Cambridge", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Prince_William_of_Wales.jpg/440px-Prince_William_of_Wales.jpg" },
      { name: "Céline Dion", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/C%C3%A9line_Dion_2012.jpg/440px-C%C3%A9line_Dion_2012.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Connector", "Guardian", "Catalyst"],
      keyDimensions: "High Extraversion + High Agreeableness + High Conscientiousness"
    }
  },

  istp: {
    code: "ISTP",
    nickname: "The Virtuoso",
    tagline: "Practical problem-solvers who master the physical world",
    rarity: "5.4% of the population",
    description: [
      "ISTPs are the master craftspeople and troubleshooters—individuals who understand how things work at a fundamental level and can fix, build, or optimize almost anything they put their hands on. They have an intuitive grasp of mechanical systems and physical processes that others find almost magical.",
      "The ISTP mind is constantly analyzing how things work, breaking systems down into components and understanding the relationships between them. They learn by doing, preferring hands-on experimentation to theoretical instruction. They trust their own experience over others' explanations.",
      "ISTPs value efficiency and competence above almost everything else. They have little patience for inefficiency, unnecessary rules, or people who talk more than they act. They prefer to let their work speak for itself rather than promoting their accomplishments.",
      "Despite their reserved nature, ISTPs have a thrill-seeking side that emerges in their love of action and physical challenge. They're often drawn to activities that combine skill with risk—motorsports, extreme sports, or skilled trades that require precision under pressure."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Introverted Thinking (Ti)",
        description: "ISTPs lead with Ti, building detailed internal models of how things work. They analyze systems logically and seek to understand underlying principles."
      },
      auxiliary: {
        name: "Extraverted Sensing (Se)",
        description: "Se gives ISTPs their awareness of the physical world and ability to respond quickly to their environment. They're present-focused and action-oriented."
      },
      tertiary: {
        name: "Introverted Intuition (Ni)",
        description: "Ni provides ISTPs with some ability to anticipate how situations will unfold, though they prefer to deal with what's in front of them."
      },
      inferior: {
        name: "Extraverted Feeling (Fe)",
        description: "Fe is the ISTP's weak point. They may struggle with emotional expression, social niceties, and understanding others' feelings. Under stress, they can become uncharacteristically emotional or seek external validation."
      }
    },
    strengths: [
      { title: "Technical Mastery", description: "ISTPs develop deep expertise in how things work and can troubleshoot problems others find impossible." },
      { title: "Calm Under Pressure", description: "They remain cool in crises, thinking clearly when others panic." },
      { title: "Efficiency", description: "ISTPs find the most direct path to solutions, eliminating unnecessary steps." },
      { title: "Adaptability", description: "They respond quickly to changing situations, improvising solutions on the fly." }
    ],
    blindspots: [
      { title: "Emotional Intelligence", description: "ISTPs may miss emotional cues or respond inappropriately to others' feelings." },
      { title: "Long-Term Planning", description: "Their focus on the present can lead to neglect of future consequences." },
      { title: "Communication", description: "They may struggle to explain their thinking or seem dismissive of others' input." },
      { title: "Commitment", description: "Their need for freedom and variety can make long-term commitments challenging." }
    ],
    inRelationships: {
      romantic: "ISTPs show love through actions rather than words—fixing things, solving problems, sharing experiences. They need partners who respect their independence and don't require constant emotional processing. They're loyal but need space to pursue their interests.",
      friendship: "ISTPs form friendships around shared activities rather than emotional sharing. They're reliable friends who show up when there's a practical problem to solve. They need friends who don't require extensive social maintenance.",
      workplace: "ISTPs excel in hands-on roles that require technical skill and problem-solving. They struggle with bureaucracy, excessive meetings, and work that doesn't produce tangible results. They prefer to be judged on their output rather than their social skills."
    },
    careerPaths: [
      { title: "Mechanic/Engineer", reason: "Directly applies their understanding of mechanical systems" },
      { title: "Pilot", reason: "Combines technical skill with action and calculated risk" },
      { title: "Surgeon", reason: "Requires precision, calm under pressure, and technical mastery" },
      { title: "Forensic Scientist", reason: "Uses analytical skills to solve practical problems" },
      { title: "Software Developer", reason: "Applies logical analysis to building systems" }
    ],
    growthAdvice: [
      "Practice expressing feelings verbally. Others can't read your mind.",
      "Consider long-term consequences of present actions. The future matters too.",
      "Develop patience with people who process differently. Not everyone learns by doing.",
      "Build some routine into your life. Structure can actually enable freedom.",
      "Recognize that emotions are data too. They're not irrational—they're information."
    ],
    famousExamples: [
      { name: "Clint Eastwood", known_for: "Actor, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Clint_Eastwood_at_2010_New_York_Film_Festival.jpg/440px-Clint_Eastwood_at_2010_New_York_Film_Festival.jpg" },
      { name: "Michael Jordan", known_for: "Basketball player", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/440px-Michael_Jordan_in_2014.jpg" },
      { name: "Amelia Earhart", known_for: "Aviation pioneer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Amelia_Earhart_1935.jpg/440px-Amelia_Earhart_1935.jpg" },
      { name: "Bruce Lee", known_for: "Martial artist, actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bruce_Lee_1973.jpg/440px-Bruce_Lee_1973.jpg" },
      { name: "Tom Cruise", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Tom_Cruise_by_Gage_Skidmore_2.jpg/440px-Tom_Cruise_by_Gage_Skidmore_2.jpg" },
      { name: "Scarlett Johansson", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Scarlett_Johansson_by_Gage_Skidmore_2_%28cropped%29.jpg/440px-Scarlett_Johansson_by_Gage_Skidmore_2_%28cropped%29.jpg" },
      { name: "Daniel Craig", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Daniel_Craig_in_2021.jpg/440px-Daniel_Craig_in_2021.jpg" },
      { name: "Kristen Stewart", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kristen_Stewart_Cannes_2022.jpg/440px-Kristen_Stewart_Cannes_2022.jpg" },
      { name: "Steve McQueen", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Steve_McQueen_1959.jpg/440px-Steve_McQueen_1959.jpg" },
      { name: "Vladimir Putin", known_for: "Russian President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Vladimir_Putin_%282020-02-20%29.jpg/440px-Vladimir_Putin_%282020-02-20%29.jpg" },
      { name: "Megan Fox", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Megan_Fox_2019_by_Glenn_Francis.jpg/440px-Megan_Fox_2019_by_Glenn_Francis.jpg" },
      { name: "Bear Grylls", known_for: "Adventurer, TV host", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Bear_Grylls%2C_bautismo_del_Parque_Scout_Grillos_-_01.jpg/440px-Bear_Grylls%2C_bautismo_del_Parque_Scout_Grillos_-_01.jpg" },
      { name: "Keith Richards", known_for: "Rolling Stones guitarist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Keith_Richards_Photo_Jimieye.jpg/440px-Keith_Richards_Photo_Jimieye.jpg" },
      { name: "Chuck Yeager", known_for: "Test pilot", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Chuck_Yeager_%28Oct._14%2C_1997%2C_color%29.jpg/440px-Chuck_Yeager_%28Oct._14%2C_1997%2C_color%29.jpg" },
      { name: "Milla Jovovich", known_for: "Actress, model", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Milla_Jovovich_2010_Shankbone.jpg/440px-Milla_Jovovich_2010_Shankbone.jpg" },
      { name: "Eminem", known_for: "Rapper", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Eminem_-_Concert_for_Valor_in_Washington%2C_D.C._Nov._11%2C_2014_%282%29_%28Cropped%29.jpg/440px-Eminem_-_Concert_for_Valor_in_Washington%2C_D.C._Nov._11%2C_2014_%282%29_%28Cropped%29.jpg" },
      { name: "Simon Cowell", known_for: "TV producer, judge", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Simon_Cowell_2016.jpg/440px-Simon_Cowell_2016.jpg" },
      { name: "Tiger Woods", known_for: "Professional golfer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TigerWoodsOfficialPortrait.jpg/440px-TigerWoodsOfficialPortrait.jpg" },
      { name: "James Bond", known_for: "Fictional spy", image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Fleming007impression.jpg/440px-Fleming007impression.jpg" },
      { name: "Katharine Hepburn", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Katharine_Hepburn_promo_photo.jpg/440px-Katharine_Hepburn_promo_photo.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Analyst", "Explorer", "Stabilizer"],
      keyDimensions: "Low Extraversion + Low Agreeableness + High Adaptability"
    }
  },

  isfp: {
    code: "ISFP",
    nickname: "The Adventurer",
    tagline: "Gentle artists who experience life through their senses and values",
    rarity: "8.8% of the population",
    description: [
      "ISFPs are the artists and aesthetes of the personality world—individuals who experience life intensely through their senses and express themselves through action rather than words. They have a natural eye for beauty and an ability to create harmony in their physical environment.",
      "The ISFP's inner world is rich with feeling and sensation, though they rarely share it openly. They process experiences deeply, forming strong personal values that guide their choices. They don't impose these values on others but live them quietly and consistently.",
      "ISFPs are present-focused, preferring to experience life as it unfolds rather than planning extensively for the future. They're spontaneous and adaptable, comfortable with uncertainty as long as they have freedom to respond in their own way.",
      "Despite their gentle nature, ISFPs have a stubborn streak when it comes to their values. They may seem easygoing until something violates their sense of what's right, at which point they become surprisingly firm. They'd rather walk away from a situation than compromise their integrity."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Introverted Feeling (Fi)",
        description: "ISFPs lead with Fi, navigating the world through their internal value system. They have a strong sense of personal ethics and authenticity."
      },
      auxiliary: {
        name: "Extraverted Sensing (Se)",
        description: "Se gives ISFPs their connection to the physical world and aesthetic sensitivity. They're attuned to sensory experiences and often express themselves through physical mediums."
      },
      tertiary: {
        name: "Introverted Intuition (Ni)",
        description: "Ni provides ISFPs with some ability to see deeper meanings and future implications, though they prefer to stay grounded in present experience."
      },
      inferior: {
        name: "Extraverted Thinking (Te)",
        description: "Te is the ISFP's weak point. They may struggle with organization, logical analysis, and asserting themselves in practical matters. Under stress, they can become uncharacteristically critical or controlling."
      }
    },
    strengths: [
      { title: "Aesthetic Sensitivity", description: "ISFPs have a natural eye for beauty and create harmony in their environments." },
      { title: "Authenticity", description: "They live according to their values without pretense or performance." },
      { title: "Gentleness", description: "ISFPs interact with others and the world with care and consideration." },
      { title: "Adaptability", description: "They respond flexibly to changing situations without losing their center." }
    ],
    blindspots: [
      { title: "Planning", description: "ISFPs may neglect long-term planning in favor of present experience." },
      { title: "Self-Advocacy", description: "They often struggle to assert their needs or promote their accomplishments." },
      { title: "Verbal Expression", description: "Putting feelings into words can be challenging, leading to misunderstandings." },
      { title: "Criticism", description: "They may take feedback personally and withdraw rather than engage." }
    ],
    inRelationships: {
      romantic: "ISFPs show love through presence, thoughtful gestures, and shared experiences. They're loyal partners who need space to be themselves. They struggle with partners who are overly critical or try to change them.",
      friendship: "ISFPs form deep bonds with a few people who accept them as they are. They're supportive friends who show up through actions rather than words. They need friends who don't require extensive verbal processing.",
      workplace: "ISFPs thrive in roles that allow creative expression and align with their values. They struggle with rigid structures, conflict, and work that feels meaningless. They prefer to contribute quietly rather than compete for recognition."
    },
    careerPaths: [
      { title: "Artist/Designer", reason: "Allows direct expression of their aesthetic sensitivity" },
      { title: "Veterinarian", reason: "Combines their gentleness with hands-on care for animals" },
      { title: "Chef", reason: "Applies their sensory awareness and creativity to food" },
      { title: "Physical Therapist", reason: "Uses hands-on skills to help others heal" },
      { title: "Photographer", reason: "Captures beauty and meaning through visual medium" }
    ],
    growthAdvice: [
      "Practice expressing feelings verbally. Others need to hear what you're thinking.",
      "Develop some structure in your life. Planning doesn't have to constrain spontaneity.",
      "Learn to receive feedback without taking it personally. Growth requires input.",
      "Advocate for yourself. Your needs and accomplishments deserve recognition.",
      "Engage with conflict when necessary. Avoidance often makes things worse."
    ],
    famousExamples: [
      { name: "Bob Dylan", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Bob_Dylan_-_Azkena_Rock_Festival_2010_2.jpg/440px-Bob_Dylan_-_Azkena_Rock_Festival_2010_2.jpg" },
      { name: "Frida Kahlo", known_for: "Artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/440px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg" },
      { name: "Prince", known_for: "Musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Prince_at_Coachella_%28cropped%29.jpg/440px-Prince_at_Coachella_%28cropped%29.jpg" },
      { name: "Lana Del Rey", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Lana_Del_Rey%40Splendour_%28cropped_2%29.jpg/440px-Lana_Del_Rey%40Splendour_%28cropped_2%29.jpg" },
      { name: "Michael Jackson", known_for: "King of Pop", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Michael_Jackson_in_1988.jpg/440px-Michael_Jackson_in_1988.jpg" },
      { name: "Marilyn Monroe", known_for: "Actress, icon", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Marilyn_Monroe_in_1952.jpg/440px-Marilyn_Monroe_in_1952.jpg" },
      { name: "Rihanna", known_for: "Singer, entrepreneur", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Rihanna_Fenty_2018.png/440px-Rihanna_Fenty_2018.png" },
      { name: "Brad Pitt", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg/440px-Brad_Pitt_2019_by_Glenn_Francis.jpg" },
      { name: "Jimi Hendrix", known_for: "Guitarist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Jimi_Hendrix_1967.png/440px-Jimi_Hendrix_1967.png" },
      { name: "David Bowie", known_for: "Musician, actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg/440px-David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg" },
      { name: "Lady Gaga", known_for: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lady_Gaga_at_the_2019_Venice_Film_Festival.jpg/440px-Lady_Gaga_at_the_2019_Venice_Film_Festival.jpg" },
      { name: "Avril Lavigne", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Avril_Lavigne_Sydney_%28Straighten_Crop%29.jpg/440px-Avril_Lavigne_Sydney_%28Straighten_Crop%29.jpg" },
      { name: "Pablo Picasso", known_for: "Artist", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Portrait_de_Picasso%2C_1908.jpg/440px-Portrait_de_Picasso%2C_1908.jpg" },
      { name: "Kevin Costner", known_for: "Actor, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Kevin_Costner_2016.jpg/440px-Kevin_Costner_2016.jpg" },
      { name: "Britney Spears", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Britney_Spears_2013.jpg/440px-Britney_Spears_2013.jpg" },
      { name: "Ryan Gosling", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Ryan_Gosling_Cannes_2011.jpg/440px-Ryan_Gosling_Cannes_2011.jpg" },
      { name: "John Travolta", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/John_Travolta_Deauville_2013_2.jpg/440px-John_Travolta_Deauville_2013_2.jpg" },
      { name: "Billie Eilish", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Billie_Eilish_2019_by_Glenn_Francis_%28cropped%29_2.jpg/440px-Billie_Eilish_2019_by_Glenn_Francis_%28cropped%29_2.jpg" },
      { name: "Jared Leto", known_for: "Actor, musician", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Jared_Leto%2C_San_Diego_Comic_Con_2016_%282%29.jpg/440px-Jared_Leto%2C_San_Diego_Comic_Con_2016_%282%29.jpg" },
      { name: "Amy Winehouse", known_for: "Singer-songwriter", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Amy_Winehouse_-_synth.jpg/440px-Amy_Winehouse_-_synth.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Explorer", "Harmonizer", "Innovator"],
      keyDimensions: "High Openness + High Agreeableness + Low Extraversion + Low Conscientiousness"
    }
  },

  estp: {
    code: "ESTP",
    nickname: "The Entrepreneur",
    tagline: "Bold risk-takers who thrive on action and immediate results",
    rarity: "4.3% of the population",
    description: [
      "ESTPs are the action heroes of the personality world—bold, pragmatic individuals who thrive in the heat of the moment and make things happen through sheer force of will and charm. They have an uncanny ability to read situations and people, responding with perfect timing to get what they want.",
      "The ESTP mind is wired for immediate engagement with the physical world. They're bored by theory and abstraction, preferring to learn through direct experience. They trust their instincts and reflexes, often making split-second decisions that turn out remarkably well.",
      "ESTPs are natural negotiators and salespeople, able to read others' motivations and adapt their approach accordingly. They're persuasive without being manipulative—they simply understand what people want and find ways to deliver it while getting what they want too.",
      "Despite their love of excitement, ESTPs are surprisingly practical. They're not interested in risk for its own sake—they calculate odds and make informed bets. They may seem reckless to more cautious types, but they usually know exactly what they're doing."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Extraverted Sensing (Se)",
        description: "ESTPs lead with Se, fully engaged with the physical world around them. They notice everything and respond instantly to opportunities and threats."
      },
      auxiliary: {
        name: "Introverted Thinking (Ti)",
        description: "Ti gives ESTPs analytical capabilities, helping them understand how things work and make logical decisions quickly."
      },
      tertiary: {
        name: "Extraverted Feeling (Fe)",
        description: "Fe provides ESTPs with social awareness and charm. They can read a room and adapt their approach to influence others."
      },
      inferior: {
        name: "Introverted Intuition (Ni)",
        description: "Ni is the ESTP's weak point. They may struggle with long-term planning, miss deeper meanings, or become anxious about the future. Under stress, they can become paranoid or obsessed with negative possibilities."
      }
    },
    strengths: [
      { title: "Quick Thinking", description: "ESTPs assess situations and respond effectively faster than almost anyone else." },
      { title: "Persuasiveness", description: "They read people well and know how to influence them toward desired outcomes." },
      { title: "Pragmatism", description: "ESTPs focus on what works rather than what should work in theory." },
      { title: "Crisis Management", description: "They remain calm and effective when others panic, thriving under pressure." }
    ],
    blindspots: [
      { title: "Long-Term Thinking", description: "ESTPs may neglect future consequences in pursuit of immediate results." },
      { title: "Emotional Depth", description: "They may avoid or dismiss deeper emotional processing." },
      { title: "Patience", description: "Waiting for results or dealing with slow processes frustrates them." },
      { title: "Commitment", description: "The lure of new opportunities can make long-term dedication challenging." }
    ],
    inRelationships: {
      romantic: "ESTPs bring excitement, spontaneity, and fun to relationships. They show love through shared experiences and practical support. They need partners who can keep up with their pace and don't require extensive emotional processing.",
      friendship: "ESTPs are fun, generous friends who make ordinary situations exciting. They're loyal to their crew and quick to help in practical ways. They need friends who enjoy action and don't take themselves too seriously.",
      workplace: "ESTPs excel in fast-paced roles that require quick thinking and people skills. They struggle with bureaucracy, routine, and excessive planning. They're natural salespeople, negotiators, and crisis managers."
    },
    careerPaths: [
      { title: "Entrepreneur", reason: "Provides the action, risk, and autonomy they thrive on" },
      { title: "Sales Executive", reason: "Uses their persuasion skills and love of the deal" },
      { title: "Paramedic/EMT", reason: "Combines action with practical problem-solving under pressure" },
      { title: "Stock Trader", reason: "Fast-paced environment that rewards quick decisions" },
      { title: "Sports Coach", reason: "Applies their competitive drive and ability to motivate others" }
    ],
    growthAdvice: [
      "Consider long-term consequences before acting. The future will arrive eventually.",
      "Develop tolerance for slower processes. Not everything can or should be rushed.",
      "Practice emotional presence. Sometimes people need you to just listen.",
      "Build some routine into your life. Structure can actually enable freedom.",
      "Recognize that reflection has value. Not all important work is visible action."
    ],
    famousExamples: [
      { name: "Ernest Hemingway", known_for: "Author, adventurer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/ErnestHemingway.jpg/440px-ErnestHemingway.jpg" },
      { name: "Madonna", known_for: "Singer, entertainer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Madonna_-_Rebel_Heart_Tour_2015_-_Berlin_1_%28cropped%29.jpg/440px-Madonna_-_Rebel_Heart_Tour_2015_-_Berlin_1_%28cropped%29.jpg" },
      { name: "Donald Trump", known_for: "Businessman, 45th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/440px-Donald_Trump_official_portrait.jpg" },
      { name: "Eddie Murphy", known_for: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Eddie_Murphy_by_David_Shankbone.jpg/440px-Eddie_Murphy_by_David_Shankbone.jpg" },
      { name: "Jack Nicholson", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Jack_Nicholson_2001.jpg/440px-Jack_Nicholson_2001.jpg" },
      { name: "Mick Jagger", known_for: "Rolling Stones frontman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Mick_Jagger_Deauville_2014.jpg/440px-Mick_Jagger_Deauville_2014.jpg" },
      { name: "George Clooney", known_for: "Actor, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/George_Clooney_2016.jpg/440px-George_Clooney_2016.jpg" },
      { name: "Samuel L. Jackson", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/SamuelLJackson.jpg/440px-SamuelLJackson.jpg" },
      { name: "Angelina Jolie", known_for: "Actress, humanitarian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Angelina_jolie_by_philipp_von_ostau.jpg/440px-Angelina_jolie_by_philipp_von_ostau.jpg" },
      { name: "Nicolas Cage", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Nicolas_Cage_2011_CC.jpg/440px-Nicolas_Cage_2011_CC.jpg" },
      { name: "Kevin Bacon", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Kevin_Bacon_at_San_Diego_Comic-Con_2013.jpg/440px-Kevin_Bacon_at_San_Diego_Comic-Con_2013.jpg" },
      { name: "Eva Longoria", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Eva_Longoria_Cannes_2019_%28cropped%29.jpg/440px-Eva_Longoria_Cannes_2019_%28cropped%29.jpg" },
      { name: "Winston Churchill", known_for: "British Prime Minister", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sir_Winston_Churchill_-_19086236948.jpg/440px-Sir_Winston_Churchill_-_19086236948.jpg" },
      { name: "Theodore Roosevelt", known_for: "26th US President", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg/440px-President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg" },
      { name: "Lucille Ball", known_for: "Comedian, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Lucille_Ball_-_1964.jpg/440px-Lucille_Ball_-_1964.jpg" },
      { name: "Bruce Willis", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Bruce_Willis_by_Gage_Skidmore_2.jpg/440px-Bruce_Willis_by_Gage_Skidmore_2.jpg" },
      { name: "Antonio Banderas", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Antonio_Banderas_2014_2.jpg/440px-Antonio_Banderas_2014_2.jpg" },
      { name: "Burt Reynolds", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Burt_Reynolds_1991_cropped_portrait.jpg/440px-Burt_Reynolds_1991_cropped_portrait.jpg" },
      { name: "Helen Mirren", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Helen_Mirren_%2821417355562%29_%28cropped%29.jpg/440px-Helen_Mirren_%2821417355562%29_%28cropped%29.jpg" },
      { name: "Sylvester Stallone", known_for: "Actor, director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Sylvester_Stallone_by_Gage_Skidmore.jpg/440px-Sylvester_Stallone_by_Gage_Skidmore.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Achiever", "Explorer", "Catalyst"],
      keyDimensions: "High Extraversion + Low Openness + High Adaptability"
    }
  },

  esfp: {
    code: "ESFP",
    nickname: "The Entertainer",
    tagline: "Spontaneous performers who bring joy and energy wherever they go",
    rarity: "8.5% of the population",
    description: [
      "ESFPs are the life of the party—vibrant, spontaneous individuals who bring energy and joy to every situation they enter. They have a natural gift for entertaining and connecting with others, making everyone around them feel included and alive.",
      "The ESFP mind is fully engaged with the present moment. They experience life through their senses with an intensity that others envy, finding pleasure in experiences that more cerebral types might overlook. They don't just observe life—they participate fully.",
      "ESFPs have an instinctive understanding of what people enjoy and how to create experiences that bring happiness. They're generous with their energy and resources, often going out of their way to ensure others are having a good time.",
      "Despite their fun-loving nature, ESFPs have a practical side that emerges when people they care about need help. They're surprisingly good at handling immediate crises, responding quickly and effectively while others are still processing what's happening."
    ],
    cognitiveFunctions: {
      dominant: {
        name: "Extraverted Sensing (Se)",
        description: "ESFPs lead with Se, fully immersed in sensory experience and present-moment awareness. They notice and respond to their environment with remarkable speed."
      },
      auxiliary: {
        name: "Introverted Feeling (Fi)",
        description: "Fi gives ESFPs their values and authenticity. They have strong personal ethics and care deeply about being true to themselves."
      },
      tertiary: {
        name: "Extraverted Thinking (Te)",
        description: "Te provides ESFPs with some organizational capability and practical problem-solving skills."
      },
      inferior: {
        name: "Introverted Intuition (Ni)",
        description: "Ni is the ESFP's weak point. They may struggle with long-term planning, miss deeper patterns, or become anxious about the future. Under stress, they can become uncharacteristically pessimistic."
      }
    },
    strengths: [
      { title: "Enthusiasm", description: "ESFPs bring genuine energy and excitement that's contagious." },
      { title: "People Skills", description: "They connect easily with diverse people and make others feel valued." },
      { title: "Adaptability", description: "ESFPs respond flexibly to changing situations without losing their positive energy." },
      { title: "Practical Help", description: "They're quick to offer tangible assistance when others need it." }
    ],
    blindspots: [
      { title: "Long-Term Planning", description: "ESFPs may neglect future consequences in pursuit of present enjoyment." },
      { title: "Depth", description: "Their focus on experience can come at the expense of deeper reflection." },
      { title: "Criticism", description: "They may take negative feedback personally and become defensive." },
      { title: "Routine", description: "Repetitive tasks and long-term commitments can feel stifling." }
    ],
    inRelationships: {
      romantic: "ESFPs bring fun, affection, and spontaneity to relationships. They show love through quality time, physical affection, and creating memorable experiences. They need partners who appreciate their spontaneous nature and don't try to constrain them.",
      friendship: "ESFPs are fun, generous friends who make ordinary moments special. They're the ones who organize activities and ensure everyone's included. They need friends who can keep up with their energy and don't take themselves too seriously.",
      workplace: "ESFPs thrive in roles that involve people and variety. They struggle with isolation, routine, and excessive paperwork. They're natural performers, salespeople, and event coordinators."
    },
    careerPaths: [
      { title: "Event Planner", reason: "Combines their love of people with creating memorable experiences" },
      { title: "Performer/Actor", reason: "Allows full expression of their entertaining nature" },
      { title: "Sales Representative", reason: "Uses their people skills and enthusiasm" },
      { title: "Flight Attendant", reason: "Combines travel, variety, and customer service" },
      { title: "Recreation Director", reason: "Creates fun experiences for others" }
    ],
    growthAdvice: [
      "Develop some long-term goals. The future will arrive whether you plan for it or not.",
      "Practice sitting with difficult emotions rather than distracting from them.",
      "Build tolerance for routine. Some structure actually enables spontaneity.",
      "Learn to receive criticism constructively. Growth requires feedback.",
      "Recognize that depth has value too. Not every moment needs to be entertaining."
    ],
    famousExamples: [
      { name: "Marilyn Monroe", known_for: "Actress, icon", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Marilyn_Monroe_in_1952.jpg/440px-Marilyn_Monroe_in_1952.jpg" },
      { name: "Elvis Presley", known_for: "Singer, 'The King'", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elvis_Presley_promoting_Jailhouse_Rock.jpg/440px-Elvis_Presley_promoting_Jailhouse_Rock.jpg" },
      { name: "Jamie Oliver", known_for: "Chef, television personality", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Jamie_Oliver_%28cropped%29.jpg/440px-Jamie_Oliver_%28cropped%29.jpg" },
      { name: "Miley Cyrus", known_for: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Miley_Cyrus_-_Wrecking_Ball_Live_-_London%2C_UK.png/440px-Miley_Cyrus_-_Wrecking_Ball_Live_-_London%2C_UK.png" },
      { name: "Will Ferrell", known_for: "Actor, comedian", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Will_Ferrell_2012.jpg/440px-Will_Ferrell_2012.jpg" },
      { name: "Cameron Diaz", known_for: "Actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Cameron_Diaz_2012.jpg/440px-Cameron_Diaz_2012.jpg" },
      { name: "Justin Bieber", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Justin_Bieber_in_2015.jpg/440px-Justin_Bieber_in_2015.jpg" },
      { name: "Adam Levine", known_for: "Maroon 5 frontman", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Adam_Levine_2013.jpg/440px-Adam_Levine_2013.jpg" },
      { name: "Leonardo DiCaprio", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Leonardo_DiCaprio_2019_by_Glenn_Francis.jpg/440px-Leonardo_DiCaprio_2019_by_Glenn_Francis.jpg" },
      { name: "Katy Perry", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Katy_Perry_2019_%28cropped%29.jpg/440px-Katy_Perry_2019_%28cropped%29.jpg" },
      { name: "Pink", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Pink_2019_by_Glenn_Francis.jpg/440px-Pink_2019_by_Glenn_Francis.jpg" },
      { name: "Steven Spielberg", known_for: "Film director", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Steven_Spielberg_Masterclass_Cin%C3%A9math%C3%A8que_Fran%C3%A7aise_2_cropped.jpg/440px-Steven_Spielberg_Masterclass_Cin%C3%A9math%C3%A8que_Fran%C3%A7aise_2_cropped.jpg" },
      { name: "Nicki Minaj", known_for: "Rapper, singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Nicki_Minaj_2019.png/440px-Nicki_Minaj_2019.png" },
      { name: "Magic Johnson", known_for: "Basketball legend", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Magic_Johnson_2019_%28cropped%29.jpg/440px-Magic_Johnson_2019_%28cropped%29.jpg" },
      { name: "Richard Branson", known_for: "Virgin Group founder", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Richard_Branson_March_2015_%28cropped%29.jpg/440px-Richard_Branson_March_2015_%28cropped%29.jpg" },
      { name: "Dolly Parton", known_for: "Singer, actress", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Dolly_Parton_2016.jpg/440px-Dolly_Parton_2016.jpg" },
      { name: "Shakira", known_for: "Singer", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Shakira_2022.jpg/440px-Shakira_2022.jpg" },
      { name: "Chris Rock", known_for: "Comedian, actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Chris_Rock_WE_2012_Shankbone.JPG/440px-Chris_Rock_WE_2012_Shankbone.JPG" },
      { name: "Bob Hope", known_for: "Comedian, actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Bob_Hope_Allan_Warren.jpg/440px-Bob_Hope_Allan_Warren.jpg" },
      { name: "Zac Efron", known_for: "Actor", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Zac_Efron_2012.jpg/440px-Zac_Efron_2012.jpg" }
    ],
    prismCorrelation: {
      likelyTypes: ["Catalyst", "Connector", "Explorer"],
      keyDimensions: "High Extraversion + High Agreeableness + Low Conscientiousness"
    }
  }
};

/**
 * Get all MBTI type codes for static generation
 */
export function getAllMBTITypes(): string[] {
  return Object.keys(mbtiTypes);
}

/**
 * Get MBTI type content by code (uses expanded 7500+ word content)
 */
export function getMBTITypeContent(code: string): MBTIType | null {
  const original = mbtiTypes[code.toLowerCase()];
  if (!original) return null;
  
  // Try to load expanded content
  try {
    // Dynamic import of expanded content
    const expanded = require("./mbti-content-expanded.json")[code.toLowerCase()];
    if (expanded) {
      // Normalize growthAdvice - convert objects to strings if needed
      let normalizedGrowthAdvice = expanded.growthAdvice;
      if (Array.isArray(expanded.growthAdvice) && expanded.growthAdvice.length > 0) {
        if (typeof expanded.growthAdvice[0] === 'object' && expanded.growthAdvice[0] !== null) {
          // Convert objects with advice/context to strings
          normalizedGrowthAdvice = expanded.growthAdvice.map((item: { advice?: string; context?: string } | string) => {
            if (typeof item === 'string') return item;
            return item.advice ? `${item.advice}${item.context ? ' ' + item.context : ''}` : '';
          }).filter(Boolean);
        }
      }

      // Merge expanded content with original, keeping original famousExamples with images
      return {
        ...original,
        ...expanded,
        growthAdvice: normalizedGrowthAdvice || original.growthAdvice,
        famousExamples: original.famousExamples, // Keep original with image URLs
      };
    }
  } catch {
    // Fall back to original if expanded content not available
  }
  
  return original;
}

/**
 * Group MBTI types by temperament for navigation
 */
export const mbtiTemperaments = {
  analysts: ["intj", "intp", "entj", "entp"],
  diplomats: ["infj", "infp", "enfj", "enfp"],
  sentinels: ["istj", "isfj", "estj", "esfj"],
  explorers: ["istp", "isfp", "estp", "esfp"],
};

