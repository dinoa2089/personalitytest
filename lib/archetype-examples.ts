/**
 * Curated examples for PRISM-7 archetypes
 * Mix of fictional characters (strongly associated) and public figures (hedged association)
 */

import type { TypeExample } from "@/components/personality/TypeExamplesGrid";

export const archetypeExamples: Record<string, TypeExample[]> = {
  innovator: [
    // Fictional - strongly associated
    {
      name: "Tony Stark / Iron Man",
      source: "Marvel Cinematic Universe",
      type: "fictional",
      image_url: "https://upload.wikimedia.org/wikipedia/en/c/ce/Iron_Man_3_poster.jpg",
      description: "Tony Stark perfectly embodies the Innovator archetype—constantly generating breakthrough ideas, comfortable with risk, and driven by curiosity rather than convention. His creation of the Iron Man suit from scraps in a cave exemplifies the Innovator's ability to see possibilities where others see limitations.",
      traits_shown: ["Creative problem-solving", "Comfortable with ambiguity", "Quick adaptation", "Challenges status quo"]
    },
    {
      name: "Doc Brown",
      source: "Back to the Future",
      type: "fictional",
      image_url: "https://upload.wikimedia.org/wikipedia/en/3/30/Back_to_the_Future_film_series_logo.png",
      description: "Dr. Emmett Brown's relentless pursuit of the impossible—time travel—and his willingness to experiment regardless of convention makes him a quintessential Innovator. His scattered genius and follow-through challenges are also classic Innovator patterns.",
      traits_shown: ["Visionary thinking", "Risk-taking", "Enthusiasm for ideas", "Struggles with structure"]
    },
    {
      name: "Willy Wonka",
      source: "Charlie and the Chocolate Factory",
      type: "fictional",
      description: "Wonka's factory of impossible inventions and his disdain for conventional business practices showcase the Innovator's creative vision and resistance to structure. He creates for the joy of creation itself.",
      traits_shown: ["Boundless creativity", "Unconventional approach", "Imaginative solutions", "Low concern for rules"]
    },
    {
      name: "The Doctor",
      source: "Doctor Who",
      type: "fictional",
      description: "The Doctor's insatiable curiosity, ability to improvise solutions, and rejection of authority represent core Innovator traits. Each regeneration brings new creative approaches to impossible problems.",
      traits_shown: ["Endless curiosity", "Improvisation", "Adaptability", "Questions authority"]
    },
    // Public figures - hedged association
    {
      name: "Elon Musk",
      source: "Entrepreneur, SpaceX & Tesla",
      type: "public_figure",
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
      description: "Musk's public persona—pursuing electric vehicles, space colonization, and neural interfaces simultaneously—aligns with Innovator traits of high openness and comfort with ambitious, unconventional ideas.",
      traits_shown: ["Ambitious vision", "Multiple pursuits", "Challenges conventions", "High risk tolerance"]
    },
    {
      name: "Richard Branson",
      source: "Entrepreneur, Virgin Group",
      type: "public_figure",
      description: "Branson's willingness to enter diverse industries and his 'screw it, let's do it' philosophy reflect the Innovator's adaptability and preference for action over excessive planning.",
      traits_shown: ["Diverse interests", "Action-oriented", "Embraces adventure", "Unconventional business"]
    },
    {
      name: "Steve Jobs",
      source: "Co-founder, Apple",
      type: "public_figure",
      description: "Jobs' famous 'think different' ethos and ability to envision products people didn't know they needed exemplify the Innovator's creative vision and willingness to challenge industry norms.",
      traits_shown: ["Visionary products", "Challenged conventions", "Creative leadership", "Design thinking"]
    }
  ],

  architect: [
    // Fictional
    {
      name: "Bruce Wayne / Batman",
      source: "DC Comics",
      type: "fictional",
      image_url: "https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg",
      description: "Batman combines visionary thinking with meticulous planning and execution. His approach to crime-fighting involves elaborate systems, contingency plans, and careful analysis—hallmarks of the Architect's systematic innovation.",
      traits_shown: ["Strategic planning", "Systematic approach", "Independent work", "Long-term vision"]
    },
    {
      name: "Sherlock Holmes",
      source: "Arthur Conan Doyle",
      type: "fictional",
      description: "Holmes' methodical approach to solving mysteries—creating systems, analyzing data, and building logical frameworks—exemplifies the Architect's combination of creativity and systematic thinking.",
      traits_shown: ["Analytical thinking", "Pattern recognition", "Independent investigation", "Systematic methods"]
    },
    {
      name: "Hermione Granger",
      source: "Harry Potter",
      type: "fictional",
      description: "Hermione's ability to master complex magical theory and apply it practically, combined with her meticulous research and planning, reflects the Architect's blend of intellectual curiosity and conscientiousness.",
      traits_shown: ["Deep research", "Practical application", "Thorough preparation", "High standards"]
    },
    {
      name: "Spock",
      source: "Star Trek",
      type: "fictional",
      description: "Spock's logical approach to problem-solving, combined with his scientific curiosity and preference for evidence-based decisions, embodies the Architect's systematic and analytical nature.",
      traits_shown: ["Logical analysis", "Scientific method", "Objective thinking", "Systematic approach"]
    },
    // Public figures
    {
      name: "Bill Gates",
      source: "Co-founder, Microsoft",
      type: "public_figure",
      description: "Gates' public image as someone who combines visionary thinking about technology and global health with systematic, data-driven approaches aligns with Architect patterns.",
      traits_shown: ["Systems thinking", "Data-driven decisions", "Long-term planning", "Technical depth"]
    },
    {
      name: "Marie Curie",
      source: "Physicist & Chemist",
      type: "public_figure",
      description: "Curie's methodical research approach, combined with groundbreaking discoveries in radioactivity, exemplifies the Architect's ability to combine innovation with rigorous systematic work.",
      traits_shown: ["Rigorous research", "Breakthrough discoveries", "Persistent focus", "Systematic methods"]
    }
  ],

  catalyst: [
    // Fictional
    {
      name: "Ted Lasso",
      source: "Ted Lasso (Apple TV+)",
      type: "fictional",
      description: "Ted's infectious optimism, ability to inspire teams through change, and natural networking skills perfectly capture the Catalyst's gift for energizing others and driving positive transformation.",
      traits_shown: ["Inspirational leadership", "Positive energy", "Adaptability", "Relationship building"]
    },
    {
      name: "Elle Woods",
      source: "Legally Blonde",
      type: "fictional",
      description: "Elle's ability to adapt to Harvard Law while maintaining her enthusiasm, building networks, and inspiring others demonstrates classic Catalyst energy and social adaptability.",
      traits_shown: ["Social energy", "Adaptability", "Inspiring others", "Positive attitude"]
    },
    {
      name: "Star-Lord / Peter Quill",
      source: "Guardians of the Galaxy",
      type: "fictional",
      description: "Quill's ability to bring together a diverse team, adapt on the fly, and lead through charisma rather than authority reflects the Catalyst's dynamic leadership style.",
      traits_shown: ["Team building", "Charismatic leadership", "Flexibility", "Enthusiasm"]
    },
    // Public figures
    {
      name: "Oprah Winfrey",
      source: "Media Mogul & Philanthropist",
      type: "public_figure",
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/440px-Oprah_in_2014.jpg",
      description: "Oprah's public persona as someone who inspires millions, builds networks, and drives cultural conversations aligns with the Catalyst's ability to energize change through connection.",
      traits_shown: ["Inspirational communication", "Network building", "Cultural influence", "Enthusiasm"]
    },
    {
      name: "Tony Robbins",
      source: "Motivational Speaker & Author",
      type: "public_figure",
      description: "Robbins' high-energy approach to motivating others and his adaptability across different audiences reflects Catalyst traits of social energy and inspirational leadership.",
      traits_shown: ["High energy", "Motivating others", "Adaptability", "Enthusiasm"]
    }
  ],

  strategist: [
    // Fictional
    {
      name: "Captain America / Steve Rogers",
      source: "Marvel Cinematic Universe",
      type: "fictional",
      description: "Steve Rogers' ability to remain calm under pressure, develop tactical plans, and execute with unwavering consistency exemplifies the Strategist's reliable, methodical approach.",
      traits_shown: ["Tactical planning", "Calm under pressure", "Consistent execution", "Reliable leadership"]
    },
    {
      name: "Hermione Granger",
      source: "Harry Potter (strategic aspect)",
      type: "fictional",
      description: "Beyond her Architect traits, Hermione's ability to create detailed plans and maintain calm under pressure shows strong Strategist characteristics.",
      traits_shown: ["Detailed planning", "Organization", "Reliability", "Methodical approach"]
    },
    {
      name: "Ned Stark",
      source: "Game of Thrones",
      type: "fictional",
      description: "Ned's commitment to honor, methodical governance, and emotional stability in crisis situations reflect the Strategist's values and steady approach.",
      traits_shown: ["Principled decisions", "Steady leadership", "Emotional stability", "Methodical governance"]
    },
    // Public figures
    {
      name: "Angela Merkel",
      source: "Former Chancellor of Germany",
      type: "public_figure",
      description: "Merkel's reputation for careful analysis, steady leadership, and calm crisis management aligns with Strategist patterns of methodical execution and emotional resilience.",
      traits_shown: ["Careful analysis", "Steady leadership", "Crisis management", "Methodical approach"]
    },
    {
      name: "Warren Buffett",
      source: "Investor & Business Leader",
      type: "public_figure",
      description: "Buffett's disciplined investment approach, long-term planning, and emotional steadiness during market volatility reflect classic Strategist characteristics.",
      traits_shown: ["Disciplined approach", "Long-term thinking", "Emotional stability", "Methodical execution"]
    }
  ],

  connector: [
    // Fictional
    {
      name: "Samwise Gamgee",
      source: "The Lord of the Rings",
      type: "fictional",
      description: "Sam's unwavering loyalty, genuine care for Frodo, and ability to maintain relationships through hardship perfectly embody the Connector's warmth and relationship focus.",
      traits_shown: ["Deep loyalty", "Genuine care", "Relationship maintenance", "Supportive presence"]
    },
    {
      name: "Olaf",
      source: "Frozen",
      type: "fictional",
      description: "Olaf's warmth, enthusiasm for friendship, and desire to bring joy to others capture the Connector's natural ability to create positive social environments.",
      traits_shown: ["Warmth", "Enthusiasm", "Joyful presence", "Values friendship"]
    },
    {
      name: "Hagrid",
      source: "Harry Potter",
      type: "fictional",
      description: "Hagrid's natural warmth, care for outcasts, and ability to build connections with diverse beings (humans, giants, dragons) reflect the Connector's inclusive relationship style.",
      traits_shown: ["Warmth", "Inclusivity", "Protective care", "Genuine connections"]
    },
    // Public figures
    {
      name: "Dolly Parton",
      source: "Singer & Philanthropist",
      type: "public_figure",
      description: "Dolly's public warmth, philanthropic focus on helping others, and ability to connect across divides aligns with Connector patterns of genuine care and relationship building.",
      traits_shown: ["Warmth", "Philanthropy", "Bridge building", "Genuine care"]
    },
    {
      name: "Fred Rogers",
      source: "Television Host & Educator",
      type: "public_figure",
      description: "Mr. Rogers' legendary warmth, focus on making everyone feel valued, and dedication to helping children reflects quintessential Connector characteristics.",
      traits_shown: ["Unconditional warmth", "Making others feel valued", "Caring presence", "Gentle approach"]
    }
  ],

  guardian: [
    // Fictional
    {
      name: "Atticus Finch",
      source: "To Kill a Mockingbird",
      type: "fictional",
      description: "Atticus' unwavering moral principles, protective care for his children, and commitment to justice even when unpopular perfectly embody the Guardian's ethical leadership.",
      traits_shown: ["Moral integrity", "Protective care", "Ethical leadership", "Standing for principles"]
    },
    {
      name: "Mufasa",
      source: "The Lion King",
      type: "fictional",
      description: "Mufasa's combination of protective strength, ethical leadership, and commitment to maintaining balance in the Pride Lands reflects the Guardian's values and responsibilities.",
      traits_shown: ["Protective strength", "Ethical leadership", "Balance maintenance", "Principled rule"]
    },
    {
      name: "Gandalf",
      source: "The Lord of the Rings",
      type: "fictional",
      description: "Gandalf's role as protector of Middle-earth, his ethical guidance, and his combination of wisdom with principled action exemplify the Guardian archetype.",
      traits_shown: ["Protective wisdom", "Ethical guidance", "Principled action", "Long-term stewardship"]
    },
    // Public figures
    {
      name: "Nelson Mandela",
      source: "Anti-apartheid Revolutionary & President",
      type: "public_figure",
      description: "Mandela's public legacy of moral leadership, protection of democratic values, and commitment to reconciliation aligns with Guardian patterns of principled, protective leadership.",
      traits_shown: ["Moral leadership", "Protective of values", "Principled stand", "Ethical commitment"]
    },
    {
      name: "Ruth Bader Ginsburg",
      source: "Supreme Court Justice",
      type: "public_figure",
      description: "RBG's reputation for protecting rights, methodical legal work, and unwavering commitment to equality reflects Guardian characteristics of principled protection.",
      traits_shown: ["Rights protection", "Methodical approach", "Principled commitment", "Ethical advocacy"]
    }
  ],

  explorer: [
    // Fictional
    {
      name: "Indiana Jones",
      source: "Indiana Jones Films",
      type: "fictional",
      description: "Indy's insatiable curiosity, comfort with uncertainty, and enthusiasm for adventure perfectly capture the Explorer's drive to seek new experiences and knowledge.",
      traits_shown: ["Curiosity", "Adventure-seeking", "Comfort with uncertainty", "Enthusiasm"]
    },
    {
      name: "Moana",
      source: "Moana (Disney)",
      type: "fictional",
      description: "Moana's calling to explore beyond her island, adaptability on her journey, and social energy in building alliances reflects the Explorer's adventurous spirit.",
      traits_shown: ["Adventure calling", "Adaptability", "Curiosity", "Social exploration"]
    },
    {
      name: "Captain Jack Sparrow",
      source: "Pirates of the Caribbean",
      type: "fictional",
      description: "Jack's improvisation, comfort with chaos, and preference for freedom over structure exemplify the Explorer's spontaneous approach to life.",
      traits_shown: ["Improvisation", "Freedom-seeking", "Spontaneity", "Unconventional approach"]
    },
    // Public figures
    {
      name: "Anthony Bourdain",
      source: "Chef & Travel Documentarian",
      type: "public_figure",
      description: "Bourdain's legendary curiosity about cultures, willingness to try anything, and gift for connecting with people worldwide aligned with Explorer patterns.",
      traits_shown: ["Cultural curiosity", "Openness to experience", "Social connection", "Adventure"]
    },
    {
      name: "Jane Goodall",
      source: "Primatologist & Adventurer",
      type: "public_figure",
      description: "Goodall's willingness to venture into the unknown and live among chimpanzees reflects the Explorer's combination of curiosity and comfort with uncertainty.",
      traits_shown: ["Scientific curiosity", "Comfort with unknown", "Immersive approach", "Persistence"]
    }
  ],

  stabilizer: [
    // Fictional
    {
      name: "Samwise Gamgee",
      source: "The Lord of the Rings (stability aspect)",
      type: "fictional",
      description: "Beyond his Connector traits, Sam's steady emotional presence and ability to remain calm and adaptable through Mordor's challenges reflect Stabilizer characteristics.",
      traits_shown: ["Emotional steadiness", "Calm presence", "Adaptability", "Reliable support"]
    },
    {
      name: "Alfred Pennyworth",
      source: "Batman",
      type: "fictional",
      description: "Alfred's calm demeanor, adaptability to Bruce's various needs, and steady presence through decades of chaos exemplify the Stabilizer's balanced approach.",
      traits_shown: ["Calm demeanor", "Adaptability", "Steady presence", "Balanced approach"]
    },
    {
      name: "Iroh",
      source: "Avatar: The Last Airbender",
      type: "fictional",
      description: "Iroh's emotional wisdom, calm presence in crisis, and ability to adapt his approach to each situation reflect the Stabilizer's balanced and flexible nature.",
      traits_shown: ["Emotional wisdom", "Calm in crisis", "Flexible approach", "Balanced perspective"]
    },
    // Public figures
    {
      name: "Dalai Lama",
      source: "Spiritual Leader",
      type: "public_figure",
      description: "The Dalai Lama's public image of emotional equilibrium, adaptability across cultures, and steady presence aligns with Stabilizer patterns.",
      traits_shown: ["Emotional balance", "Cross-cultural adaptability", "Steady presence", "Calm demeanor"]
    },
    {
      name: "Tom Hanks",
      source: "Actor",
      type: "public_figure",
      description: "Hanks' reputation for steady professionalism, adaptability across diverse roles, and calm public presence reflects Stabilizer characteristics.",
      traits_shown: ["Steady professionalism", "Versatile adaptability", "Calm presence", "Balanced approach"]
    }
  ],

  visionary: [
    // Fictional
    {
      name: "Professor X / Charles Xavier",
      source: "X-Men",
      type: "fictional",
      description: "Xavier's combination of a transformative vision for mutant-human coexistence with systematic institution-building (the X-Men, Xavier School) exemplifies the Visionary archetype.",
      traits_shown: ["Transformative vision", "Institution building", "Systematic approach", "Adaptable strategy"]
    },
    {
      name: "Dumbledore",
      source: "Harry Potter",
      type: "fictional",
      description: "Dumbledore's ability to see the long game, build systems to defeat Voldemort, and adapt plans as circumstances change reflects the Visionary's strategic innovation.",
      traits_shown: ["Long-term vision", "Strategic planning", "Adaptive execution", "Institution building"]
    },
    {
      name: "T'Challa / Black Panther",
      source: "Marvel Cinematic Universe",
      type: "fictional",
      description: "T'Challa's vision to open Wakanda while systematically planning the transition demonstrates the Visionary's combination of innovation and methodical execution.",
      traits_shown: ["Transformative vision", "Systematic planning", "Adaptive approach", "Principled innovation"]
    },
    // Public figures
    {
      name: "Satya Nadella",
      source: "CEO, Microsoft",
      type: "public_figure",
      description: "Nadella's transformation of Microsoft's culture and strategy, combining vision with systematic execution, aligns with Visionary patterns.",
      traits_shown: ["Cultural transformation", "Strategic vision", "Systematic execution", "Adaptive leadership"]
    },
    {
      name: "Jeff Bezos",
      source: "Founder, Amazon",
      type: "public_figure",
      description: "Bezos' long-term thinking, systematic building of Amazon's infrastructure, and adaptability to new opportunities reflects Visionary characteristics.",
      traits_shown: ["Long-term thinking", "Systematic building", "Adaptive strategy", "Visionary planning"]
    }
  ],

  harmonizer: [
    // Fictional
    {
      name: "Aang",
      source: "Avatar: The Last Airbender",
      type: "fictional",
      description: "Aang's commitment to balance, care for all nations, and preference for peaceful resolution through deep personal connection reflects the Harmonizer's authentic peacemaking.",
      traits_shown: ["Commitment to balance", "Deep care", "Peaceful approach", "Authentic connection"]
    },
    {
      name: "Belle",
      source: "Beauty and the Beast",
      type: "fictional",
      description: "Belle's preference for meaningful connection over superficial socializing, combined with her ethical principles and empathy, reflects Harmonizer patterns.",
      traits_shown: ["Deep connection", "Ethical principles", "Empathy", "Authentic relationships"]
    },
    {
      name: "Newt Scamander",
      source: "Fantastic Beasts",
      type: "fictional",
      description: "Newt's preference for small circles, genuine care for misunderstood creatures, and ethical stance against exploitation exemplify the Harmonizer's values.",
      traits_shown: ["Small circle preference", "Genuine care", "Ethical stance", "Authentic empathy"]
    },
    // Public figures
    {
      name: "Brené Brown",
      source: "Researcher & Author",
      type: "public_figure",
      description: "Brown's focus on authenticity, vulnerability, and genuine connection in her work aligns with the Harmonizer's values of deep, honest relationships.",
      traits_shown: ["Authenticity focus", "Vulnerability advocacy", "Genuine connection", "Ethical approach"]
    },
    {
      name: "Mr. Rogers",
      source: "Television Host (harmonizer aspect)",
      type: "public_figure",
      description: "Beyond his Connector traits, Mr. Rogers' commitment to authenticity, one-on-one connection, and gentle ethical guidance reflects Harmonizer patterns.",
      traits_shown: ["Authenticity", "Individual connection", "Ethical guidance", "Gentle approach"]
    }
  ],

  achiever: [
    // Fictional
    {
      name: "Leslie Knope",
      source: "Parks and Recreation",
      type: "fictional",
      description: "Leslie's relentless goal pursuit, organizational skills, social energy, and ability to adapt her approach while maintaining focus exemplifies the Achiever archetype.",
      traits_shown: ["Goal-driven", "Highly organized", "Social energy", "Adaptable execution"]
    },
    {
      name: "Miranda Priestly",
      source: "The Devil Wears Prada",
      type: "fictional",
      description: "Miranda's demanding excellence, systematic execution, and drive for achievement in the fashion industry reflect the Achiever's results-focused approach.",
      traits_shown: ["High standards", "Results focus", "Systematic execution", "Driven leadership"]
    },
    {
      name: "Harvey Specter",
      source: "Suits",
      type: "fictional",
      description: "Harvey's competitive drive, systematic approach to winning cases, and social skills in building client relationships demonstrate Achiever characteristics.",
      traits_shown: ["Competitive drive", "Winning focus", "Strategic approach", "Relationship leverage"]
    },
    // Public figures
    {
      name: "Serena Williams",
      source: "Tennis Champion",
      type: "public_figure",
      description: "Williams' legendary drive for excellence, disciplined training, and competitive spirit align with Achiever patterns of goal-focused execution.",
      traits_shown: ["Drive for excellence", "Disciplined approach", "Competitive spirit", "Results focus"]
    },
    {
      name: "Indra Nooyi",
      source: "Former CEO, PepsiCo",
      type: "public_figure",
      description: "Nooyi's reputation for ambitious goals, systematic execution, and adaptable strategy reflects Achiever characteristics of driven, organized leadership.",
      traits_shown: ["Ambitious goals", "Systematic execution", "Adaptive strategy", "Driven leadership"]
    }
  ],

  analyst: [
    // Fictional
    {
      name: "Sherlock Holmes",
      source: "Arthur Conan Doyle (analyst aspect)",
      type: "fictional",
      description: "Holmes' rigorous analytical method, independent thinking, and preference for logic over social convention perfectly embody the Analyst archetype.",
      traits_shown: ["Rigorous analysis", "Independent thinking", "Logic-driven", "Systematic investigation"]
    },
    {
      name: "Data",
      source: "Star Trek: The Next Generation",
      type: "fictional",
      description: "Data's analytical approach to understanding humans, systematic problem-solving, and objective perspective reflect the Analyst's methodology.",
      traits_shown: ["Systematic analysis", "Objective perspective", "Curious investigation", "Logical approach"]
    },
    {
      name: "Lisbeth Salander",
      source: "The Girl with the Dragon Tattoo",
      type: "fictional",
      description: "Lisbeth's exceptional analytical skills, independent work style, and willingness to challenge assumptions exemplify the Analyst's truth-seeking nature.",
      traits_shown: ["Exceptional analysis", "Independent work", "Challenges assumptions", "Deep investigation"]
    },
    // Public figures
    {
      name: "Albert Einstein",
      source: "Theoretical Physicist",
      type: "public_figure",
      description: "Einstein's systematic approach to physics, independent thinking that challenged conventions, and deep analytical work align with Analyst patterns.",
      traits_shown: ["Systematic thinking", "Independent conclusions", "Deep analysis", "Challenges conventions"]
    },
    {
      name: "Stephen Hawking",
      source: "Theoretical Physicist & Author",
      type: "public_figure",
      description: "Hawking's rigorous analytical work, independent theoretical contributions, and methodical approach to understanding the universe reflect Analyst characteristics.",
      traits_shown: ["Rigorous analysis", "Independent theory", "Methodical approach", "Truth-seeking"]
    }
  ]
};

/**
 * Get type dimension description for examples component
 */
export const archetypeDimensionDescriptions: Record<string, string> = {
  innovator: "High Openness + High Adaptability",
  architect: "High Openness + High Conscientiousness",
  catalyst: "High Extraversion + High Openness + High Adaptability",
  strategist: "High Conscientiousness + High Emotional Resilience",
  connector: "High Extraversion + High Agreeableness",
  guardian: "High Conscientiousness + High Agreeableness + High Honesty-Humility",
  explorer: "High Openness + High Extraversion, Low Conscientiousness",
  stabilizer: "High Emotional Resilience + High Adaptability",
  visionary: "High Openness + High Conscientiousness + High Adaptability",
  harmonizer: "High Agreeableness + High Honesty-Humility, Low Extraversion",
  achiever: "High Conscientiousness + High Extraversion + High Adaptability",
  analyst: "High Openness + High Conscientiousness, Low Extraversion + Low Agreeableness"
};

