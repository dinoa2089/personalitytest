/**
 * Curated examples for PRISM-7 archetypes
 * Mix of fictional characters (strongly associated) and public figures (hedged association)
 * Images hosted on Supabase Storage
 */

import type { TypeExample } from "@/components/personality/TypeExamplesGrid";

const SUPABASE_IMG = "https://eqkcmlxxuubibzoqliee.supabase.co/storage/v1/object/public/famous-images";

export const archetypeExamples: Record<string, TypeExample[]> = {
  innovator: [
    // Fictional
    {
      name: "Tony Stark / Iron Man",
      source: "Marvel Cinematic Universe",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/tony-stark.png`,
      description: "Tony Stark perfectly embodies the Innovator archetype—constantly generating breakthrough ideas, comfortable with risk, and driven by curiosity rather than convention.",
      traits_shown: ["Creative problem-solving", "Comfortable with ambiguity", "Quick adaptation", "Challenges status quo"]
    },
    {
      name: "Doc Brown",
      source: "Back to the Future",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/doc-brown.jpg`,
      description: "Dr. Emmett Brown's relentless pursuit of the impossible—time travel—and his willingness to experiment regardless of convention makes him a quintessential Innovator.",
      traits_shown: ["Visionary thinking", "Risk-taking", "Enthusiasm for ideas", "Struggles with structure"]
    },
    {
      name: "Willy Wonka",
      source: "Charlie and the Chocolate Factory",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/willy-wonka.jpg`,
      description: "Wonka's factory of impossible inventions and his disdain for conventional business practices showcase the Innovator's creative vision.",
      traits_shown: ["Boundless creativity", "Unconventional approach", "Imaginative solutions", "Low concern for rules"]
    },
    {
      name: "The Doctor",
      source: "Doctor Who",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/the-doctor.jpg`,
      description: "The Doctor's insatiable curiosity, ability to improvise solutions, and rejection of authority represent core Innovator traits.",
      traits_shown: ["Endless curiosity", "Improvisation", "Adaptability", "Questions authority"]
    },
    {
      name: "Q",
      source: "James Bond",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/q-bond.jpg`,
      description: "Q's endless stream of creative gadgets and inventions, pushing technological boundaries for MI6, embodies the Innovator's creative engineering spirit.",
      traits_shown: ["Technical innovation", "Creative solutions", "Practical inventions", "Pushing boundaries"]
    },
    // Public figures
    {
      name: "Elon Musk",
      source: "Entrepreneur, SpaceX & Tesla",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/elon-musk.jpg`,
      description: "Musk's public persona—pursuing electric vehicles, space colonization, and neural interfaces simultaneously—aligns with Innovator traits.",
      traits_shown: ["Ambitious vision", "Multiple pursuits", "Challenges conventions", "High risk tolerance"]
    },
    {
      name: "Steve Jobs",
      source: "Co-founder, Apple",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/steve-jobs.jpg`,
      description: "Jobs' famous 'think different' ethos and ability to envision products people didn't know they needed exemplify the Innovator's creative vision.",
      traits_shown: ["Visionary products", "Challenged conventions", "Creative leadership", "Design thinking"]
    },
    {
      name: "Nikola Tesla",
      source: "Inventor & Electrical Engineer",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/nikola-tesla.jpg`,
      description: "Tesla's revolutionary ideas about AC electricity and wireless power transmission showcase the Innovator's ability to envision transformative possibilities.",
      traits_shown: ["Revolutionary ideas", "Future vision", "Technical creativity", "Independent thinking"]
    },
    {
      name: "Richard Branson",
      source: "Entrepreneur, Virgin Group",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/richard-branson.jpg`,
      description: "Branson's willingness to enter diverse industries and his 'screw it, let's do it' philosophy reflect the Innovator's adaptability.",
      traits_shown: ["Diverse interests", "Action-oriented", "Embraces adventure", "Unconventional business"]
    },
    {
      name: "Leonardo da Vinci",
      source: "Renaissance Polymath",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/leonardo-da-vinci.png`,
      description: "Da Vinci's boundless curiosity spanning art, science, engineering, and anatomy exemplifies the Innovator's cross-disciplinary thinking.",
      traits_shown: ["Cross-disciplinary thinking", "Boundless curiosity", "Ahead of time", "Creative vision"]
    }
  ],

  architect: [
    // Fictional
    {
      name: "Bruce Wayne / Batman",
      source: "DC Comics",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/batman.jpg`,
      description: "Batman combines visionary thinking with meticulous planning and execution. His approach involves elaborate systems and contingency plans.",
      traits_shown: ["Strategic planning", "Systematic approach", "Independent work", "Long-term vision"]
    },
    {
      name: "Sherlock Holmes",
      source: "Arthur Conan Doyle",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/sherlock-holmes.jpg`,
      description: "Holmes' methodical approach to solving mysteries—creating systems, analyzing data, and building logical frameworks—exemplifies the Architect.",
      traits_shown: ["Analytical thinking", "Pattern recognition", "Independent investigation", "Systematic methods"]
    },
    {
      name: "Hermione Granger",
      source: "Harry Potter",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/hermione-granger.jpg`,
      description: "Hermione's ability to master complex magical theory and apply it practically reflects the Architect's blend of curiosity and conscientiousness.",
      traits_shown: ["Deep research", "Practical application", "Thorough preparation", "High standards"]
    },
    {
      name: "Spock",
      source: "Star Trek",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/spock.jpg`,
      description: "Spock's logical approach to problem-solving and preference for evidence-based decisions embodies the Architect's systematic nature.",
      traits_shown: ["Logical analysis", "Scientific method", "Objective thinking", "Systematic approach"]
    },
    {
      name: "Walter White",
      source: "Breaking Bad",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/walter-white.png`,
      description: "Walter White's methodical approach to chemistry and business planning reflects the darker side of the Architect's systematic capabilities.",
      traits_shown: ["Methodical planning", "Scientific precision", "Strategic thinking", "Long-term vision"]
    },
    // Public figures
    {
      name: "Bill Gates",
      source: "Co-founder, Microsoft",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/bill-gates.jpg`,
      description: "Gates' public image as someone who combines visionary thinking with systematic, data-driven approaches aligns with Architect patterns.",
      traits_shown: ["Systems thinking", "Data-driven decisions", "Long-term planning", "Technical depth"]
    },
    {
      name: "Marie Curie",
      source: "Physicist & Chemist",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/marie-curie.jpg`,
      description: "Curie's methodical research approach, combined with groundbreaking discoveries in radioactivity, exemplifies the Architect's systematic innovation.",
      traits_shown: ["Rigorous research", "Breakthrough discoveries", "Persistent focus", "Systematic methods"]
    },
    {
      name: "Isaac Newton",
      source: "Physicist & Mathematician",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/isaac-newton.jpg`,
      description: "Newton's development of calculus and laws of motion through systematic analysis embodies the Architect's methodical approach.",
      traits_shown: ["Systematic analysis", "Theoretical frameworks", "Independent work", "Revolutionary thinking"]
    },
    {
      name: "Ada Lovelace",
      source: "Mathematician & Writer",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/ada-lovelace.jpg`,
      description: "Lovelace's vision of computing possibilities combined with methodical mathematical analysis reflects the Architect's blend of innovation and systematic thinking.",
      traits_shown: ["Visionary thinking", "Mathematical precision", "Systematic approach", "Future vision"]
    },
    {
      name: "Alan Turing",
      source: "Computer Scientist",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/alan-turing.jpg`,
      description: "Turing's systematic approach to breaking Enigma codes and foundational work on computing theory exemplifies the Architect's methodical innovation.",
      traits_shown: ["Systematic problem-solving", "Theoretical innovation", "Independent thinking", "Methodical approach"]
    }
  ],

  catalyst: [
    // Fictional
    {
      name: "Ted Lasso",
      source: "Ted Lasso (Apple TV+)",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/ted-lasso.jpg`,
      description: "Ted's infectious optimism, ability to inspire teams through change, and natural networking skills perfectly capture the Catalyst's gift for energizing others.",
      traits_shown: ["Inspirational leadership", "Positive energy", "Adaptability", "Relationship building"]
    },
    {
      name: "Elle Woods",
      source: "Legally Blonde",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/elle-woods.png`,
      description: "Elle's ability to adapt to Harvard Law while maintaining her enthusiasm and inspiring others demonstrates classic Catalyst energy.",
      traits_shown: ["Social energy", "Adaptability", "Inspiring others", "Positive attitude"]
    },
    {
      name: "Star-Lord / Peter Quill",
      source: "Guardians of the Galaxy",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/star-lord.jpg`,
      description: "Quill's ability to bring together a diverse team and lead through charisma reflects the Catalyst's dynamic leadership style.",
      traits_shown: ["Team building", "Charismatic leadership", "Flexibility", "Enthusiasm"]
    },
    {
      name: "Jack Sparrow",
      source: "Pirates of the Caribbean",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/jack-sparrow.jpg`,
      description: "Jack's ability to charm, persuade, and adapt to any situation while bringing together unlikely allies demonstrates classic Catalyst social energy.",
      traits_shown: ["Charismatic influence", "Social adaptability", "Improvisation", "Alliance building"]
    },
    {
      name: "Michael Scott",
      source: "The Office",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/michael-scott.png`,
      description: "Michael's enthusiastic (if sometimes misguided) efforts to inspire his team reflect Catalyst traits of motivation and connection.",
      traits_shown: ["Enthusiastic leadership", "Social energy", "Team focus", "Optimism"]
    },
    // Public figures
    {
      name: "Oprah Winfrey",
      source: "Media Mogul & Philanthropist",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/oprah-winfrey.jpg`,
      description: "Oprah's public persona as someone who inspires millions and drives cultural conversations aligns with the Catalyst's ability to energize change.",
      traits_shown: ["Inspirational communication", "Network building", "Cultural influence", "Enthusiasm"]
    },
    {
      name: "Ellen DeGeneres",
      source: "Talk Show Host & Comedian",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/ellen-degeneres.jpg`,
      description: "Ellen's ability to energize audiences, build connections, and spread positivity reflects Catalyst characteristics.",
      traits_shown: ["Social energy", "Positive influence", "Connection building", "Entertainment"]
    },
    {
      name: "Tony Robbins",
      source: "Motivational Speaker & Author",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/tony-robbins.jpg`,
      description: "Robbins' high-energy approach to motivating others and his adaptability across different audiences reflects Catalyst traits.",
      traits_shown: ["High energy", "Motivating others", "Adaptability", "Enthusiasm"]
    },
    {
      name: "Dwayne Johnson",
      source: "Actor & Producer",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/dwayne-johnson.jpg`,
      description: "The Rock's infectious energy, ability to connect with diverse audiences, and motivational presence exemplify Catalyst traits.",
      traits_shown: ["Infectious energy", "Universal appeal", "Motivational presence", "Social connection"]
    },
    {
      name: "Richard Simmons",
      source: "Fitness Personality",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/richard-simmons.jpg`,
      description: "Simmons' legendary enthusiasm and ability to motivate people through energy and positivity epitomizes the Catalyst's inspiring nature.",
      traits_shown: ["Boundless enthusiasm", "Motivational energy", "Personal connection", "Positive transformation"]
    }
  ],

  strategist: [
    // Fictional
    {
      name: "Captain America / Steve Rogers",
      source: "Marvel Cinematic Universe",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/captain-america.jpg`,
      description: "Steve Rogers' ability to remain calm under pressure, develop tactical plans, and execute with unwavering consistency exemplifies the Strategist.",
      traits_shown: ["Tactical planning", "Calm under pressure", "Consistent execution", "Reliable leadership"]
    },
    {
      name: "Admiral Adama",
      source: "Battlestar Galactica",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/admiral-adama.jpg`,
      description: "Adama's steady leadership through crisis, methodical decision-making, and emotional stability reflect the Strategist's reliable command presence.",
      traits_shown: ["Crisis leadership", "Methodical decisions", "Emotional stability", "Reliable command"]
    },
    {
      name: "Ned Stark",
      source: "Game of Thrones",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/ned-stark.jpg`,
      description: "Ned's commitment to honor, methodical governance, and emotional stability reflect the Strategist's values and steady approach.",
      traits_shown: ["Principled decisions", "Steady leadership", "Emotional stability", "Methodical governance"]
    },
    {
      name: "Jean-Luc Picard",
      source: "Star Trek: The Next Generation",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/jean-luc-picard.jpg`,
      description: "Picard's thoughtful leadership, strategic thinking, and calm presence under pressure embody the Strategist's methodical approach.",
      traits_shown: ["Thoughtful leadership", "Strategic thinking", "Calm presence", "Diplomatic approach"]
    },
    {
      name: "Obi-Wan Kenobi",
      source: "Star Wars",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/obi-wan-kenobi.jpg`,
      description: "Obi-Wan's patient approach, strategic thinking, and emotional stability in facing challenges reflect quintessential Strategist characteristics.",
      traits_shown: ["Patient approach", "Strategic planning", "Emotional balance", "Methodical execution"]
    },
    // Public figures
    {
      name: "Angela Merkel",
      source: "Former Chancellor of Germany",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/angela-merkel.jpg`,
      description: "Merkel's reputation for careful analysis, steady leadership, and calm crisis management aligns with Strategist patterns.",
      traits_shown: ["Careful analysis", "Steady leadership", "Crisis management", "Methodical approach"]
    },
    {
      name: "Warren Buffett",
      source: "Investor & Business Leader",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/warren-buffett.jpg`,
      description: "Buffett's disciplined investment approach, long-term planning, and emotional steadiness during market volatility reflect classic Strategist characteristics.",
      traits_shown: ["Disciplined approach", "Long-term thinking", "Emotional stability", "Methodical execution"]
    },
    {
      name: "Colin Powell",
      source: "Military Leader & Statesman",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/colin-powell.jpg`,
      description: "Powell's methodical approach to military strategy and leadership, combined with calm decision-making, reflects Strategist characteristics.",
      traits_shown: ["Methodical strategy", "Calm leadership", "Disciplined approach", "Long-term planning"]
    },
    {
      name: "Tim Cook",
      source: "CEO, Apple",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/tim-cook.jpg`,
      description: "Cook's methodical approach to operations and steady leadership through transitions exemplifies Strategist traits.",
      traits_shown: ["Operational excellence", "Steady leadership", "Systematic approach", "Calm presence"]
    },
    {
      name: "Sandra Day O'Connor",
      source: "Supreme Court Justice",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/sandra-day-oconnor.jpg`,
      description: "O'Connor's methodical legal reasoning and pragmatic approach to judicial decisions reflect Strategist patterns.",
      traits_shown: ["Methodical reasoning", "Pragmatic approach", "Careful analysis", "Balanced judgment"]
    }
  ],

  connector: [
    // Fictional
    {
      name: "Samwise Gamgee",
      source: "The Lord of the Rings",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/samwise-gamgee.jpg`,
      description: "Sam's unwavering loyalty, genuine care for Frodo, and ability to maintain relationships through hardship perfectly embody the Connector.",
      traits_shown: ["Deep loyalty", "Genuine care", "Relationship maintenance", "Supportive presence"]
    },
    {
      name: "Olaf",
      source: "Frozen",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/olaf.jpg`,
      description: "Olaf's warmth, enthusiasm for friendship, and desire to bring joy capture the Connector's natural ability to create positive social environments.",
      traits_shown: ["Warmth", "Enthusiasm", "Joyful presence", "Values friendship"]
    },
    {
      name: "Hagrid",
      source: "Harry Potter",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/hagrid.jpg`,
      description: "Hagrid's natural warmth, care for outcasts, and ability to build connections reflect the Connector's inclusive relationship style.",
      traits_shown: ["Warmth", "Inclusivity", "Protective care", "Genuine connections"]
    },
    {
      name: "Paddington Bear",
      source: "Paddington",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/paddington-bear.jpg`,
      description: "Paddington's endless kindness, ability to bring people together, and genuine warmth epitomizes Connector traits.",
      traits_shown: ["Endless kindness", "Bringing people together", "Genuine warmth", "Universal friendliness"]
    },
    {
      name: "Baymax",
      source: "Big Hero 6",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/baymax.jpg`,
      description: "Baymax's dedication to caring for others and his gentle, supportive presence reflect the Connector's nurturing nature.",
      traits_shown: ["Caring dedication", "Gentle presence", "Supportive nature", "Nurturing care"]
    },
    // Public figures
    {
      name: "Dolly Parton",
      source: "Singer & Philanthropist",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/dolly-parton.jpg`,
      description: "Dolly's public warmth, philanthropic focus, and ability to connect across divides aligns with Connector patterns.",
      traits_shown: ["Warmth", "Philanthropy", "Bridge building", "Genuine care"]
    },
    {
      name: "Fred Rogers",
      source: "Television Host & Educator",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/fred-rogers.png`,
      description: "Mr. Rogers' legendary warmth, focus on making everyone feel valued, and dedication to helping children reflects quintessential Connector characteristics.",
      traits_shown: ["Unconditional warmth", "Making others feel valued", "Caring presence", "Gentle approach"]
    },
    {
      name: "Princess Diana",
      source: "British Royal Family",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/princess-diana.jpg`,
      description: "Diana's genuine warmth, dedication to humanitarian causes, and ability to connect with people exemplifies Connector traits.",
      traits_shown: ["Genuine warmth", "Humanitarian care", "Universal connection", "Compassionate presence"]
    },
    {
      name: "Keanu Reeves",
      source: "Actor",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/keanu-reeves.jpg`,
      description: "Keanu's reputation for genuine kindness and thoughtful treatment of everyone reflects Connector characteristics.",
      traits_shown: ["Genuine kindness", "Thoughtful treatment", "Authentic care", "Humble warmth"]
    },
    {
      name: "Steve Irwin",
      source: "Wildlife Expert & TV Personality",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/steve-irwin.jpg`,
      description: "Steve's infectious enthusiasm and genuine care for animals and people alike embodies Connector traits.",
      traits_shown: ["Infectious enthusiasm", "Genuine care", "Bridge building", "Warm passion"]
    }
  ],

  guardian: [
    // Fictional
    {
      name: "Atticus Finch",
      source: "To Kill a Mockingbird",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/atticus-finch.jpg`,
      description: "Atticus' unwavering moral principles, protective care, and commitment to justice perfectly embody the Guardian's ethical leadership.",
      traits_shown: ["Moral integrity", "Protective care", "Ethical leadership", "Standing for principles"]
    },
    {
      name: "Mufasa",
      source: "The Lion King",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/mufasa.jpg`,
      description: "Mufasa's combination of protective strength, ethical leadership, and commitment to balance reflects the Guardian's values.",
      traits_shown: ["Protective strength", "Ethical leadership", "Balance maintenance", "Principled rule"]
    },
    {
      name: "Gandalf",
      source: "The Lord of the Rings",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/gandalf.jpg`,
      description: "Gandalf's role as protector of Middle-earth, his ethical guidance, and his combination of wisdom with principled action exemplify the Guardian.",
      traits_shown: ["Protective wisdom", "Ethical guidance", "Principled action", "Long-term stewardship"]
    },
    {
      name: "Wonder Woman",
      source: "DC Comics",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/wonder-woman.png`,
      description: "Diana's unwavering commitment to truth, justice, and protecting the innocent embodies the Guardian's protective and ethical nature.",
      traits_shown: ["Truth commitment", "Justice focus", "Protective instinct", "Ethical strength"]
    },
    {
      name: "King T'Chaka",
      source: "Black Panther",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/king-tchaka.jpg`,
      description: "T'Chaka's protective leadership of Wakanda and his commitment to tradition and responsibility reflect Guardian characteristics.",
      traits_shown: ["Protective leadership", "Tradition commitment", "Responsibility", "Principled rule"]
    },
    // Public figures
    {
      name: "Nelson Mandela",
      source: "Anti-apartheid Revolutionary & President",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/nelson-mandela.jpg`,
      description: "Mandela's public legacy of moral leadership and commitment to reconciliation aligns with Guardian patterns of principled leadership.",
      traits_shown: ["Moral leadership", "Protective of values", "Principled stand", "Ethical commitment"]
    },
    {
      name: "Ruth Bader Ginsburg",
      source: "Supreme Court Justice",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/ruth-bader-ginsburg.jpg`,
      description: "RBG's reputation for protecting rights and unwavering commitment to equality reflects Guardian characteristics.",
      traits_shown: ["Rights protection", "Methodical approach", "Principled commitment", "Ethical advocacy"]
    },
    {
      name: "Malala Yousafzai",
      source: "Education Activist",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/malala-yousafzai.jpg`,
      description: "Malala's protective advocacy for education rights and unwavering commitment to principles exemplifies Guardian traits.",
      traits_shown: ["Rights advocacy", "Principled courage", "Protective of others", "Ethical commitment"]
    },
    {
      name: "John Lewis",
      source: "Civil Rights Leader & Congressman",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/john-lewis.jpg`,
      description: "Lewis's lifelong commitment to civil rights and willingness to stand for principles reflects the Guardian's protective nature.",
      traits_shown: ["Civil rights dedication", "Principled stance", "Protective advocacy", "Ethical courage"]
    },
    {
      name: "Desmond Tutu",
      source: "Archbishop & Human Rights Activist",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/desmond-tutu.jpg`,
      description: "Tutu's moral leadership in opposing apartheid and advocating for reconciliation reflects Guardian characteristics.",
      traits_shown: ["Moral leadership", "Ethical advocacy", "Reconciliation focus", "Principled stand"]
    }
  ],

  explorer: [
    // Fictional
    {
      name: "Indiana Jones",
      source: "Indiana Jones Films",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/indiana-jones.jpg`,
      description: "Indy's insatiable curiosity, comfort with uncertainty, and enthusiasm for adventure perfectly capture the Explorer's drive.",
      traits_shown: ["Curiosity", "Adventure-seeking", "Comfort with uncertainty", "Enthusiasm"]
    },
    {
      name: "Moana",
      source: "Moana (Disney)",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/moana.jpg`,
      description: "Moana's calling to explore beyond her island and adaptability on her journey reflects the Explorer's adventurous spirit.",
      traits_shown: ["Adventure calling", "Adaptability", "Curiosity", "Social exploration"]
    },
    {
      name: "Captain Jack Sparrow",
      source: "Pirates of the Caribbean",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/jack-sparrow.jpg`,
      description: "Jack's improvisation, comfort with chaos, and preference for freedom exemplify the Explorer's spontaneous approach.",
      traits_shown: ["Improvisation", "Freedom-seeking", "Spontaneity", "Unconventional approach"]
    },
    {
      name: "Lara Croft",
      source: "Tomb Raider",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/lara-croft.jpg`,
      description: "Lara's drive to explore ancient mysteries and her comfort with danger reflects quintessential Explorer traits.",
      traits_shown: ["Mystery seeking", "Risk comfort", "Adventure drive", "Physical exploration"]
    },
    {
      name: "Dora the Explorer",
      source: "Dora the Explorer",
      type: "fictional",
      description: "Dora's endless curiosity, love of adventure, and enthusiasm for discovery embody the Explorer's joy in new experiences.",
      traits_shown: ["Endless curiosity", "Adventure love", "Discovery enthusiasm", "Positive exploration"]
    },
    // Public figures
    {
      name: "Anthony Bourdain",
      source: "Chef & Travel Documentarian",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/anthony-bourdain.jpg`,
      description: "Bourdain's legendary curiosity about cultures and willingness to try anything aligned with Explorer patterns.",
      traits_shown: ["Cultural curiosity", "Openness to experience", "Social connection", "Adventure"]
    },
    {
      name: "Jane Goodall",
      source: "Primatologist & Adventurer",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/jane-goodall.jpg`,
      description: "Goodall's willingness to venture into the unknown and live among chimpanzees reflects the Explorer's combination of curiosity and comfort with uncertainty.",
      traits_shown: ["Scientific curiosity", "Comfort with unknown", "Immersive approach", "Persistence"]
    },
    {
      name: "Bear Grylls",
      source: "Adventurer & TV Host",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/bear-grylls.jpg`,
      description: "Bear's embrace of extreme environments and enthusiasm for survival adventures exemplifies the Explorer's comfort with uncertainty.",
      traits_shown: ["Extreme adventure", "Survival skills", "Physical exploration", "Risk embrace"]
    },
    {
      name: "Jacques Cousteau",
      source: "Ocean Explorer & Filmmaker",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/jacques-cousteau.jpg`,
      description: "Cousteau's pioneering ocean exploration and dedication to discovering the unknown reflects quintessential Explorer characteristics.",
      traits_shown: ["Pioneering exploration", "Curiosity", "Discovery dedication", "Unknown seeking"]
    },
    {
      name: "Neil Armstrong",
      source: "Astronaut",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/neil-armstrong.jpg`,
      description: "Armstrong's willingness to venture into the ultimate unknown—space—embodies the Explorer's spirit of pushing boundaries.",
      traits_shown: ["Ultimate exploration", "Risk acceptance", "Boundary pushing", "Pioneering spirit"]
    }
  ],

  stabilizer: [
    // Fictional
    {
      name: "Samwise Gamgee",
      source: "The Lord of the Rings (stability aspect)",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/samwise-gamgee.jpg`,
      description: "Sam's steady emotional presence and ability to remain calm through Mordor's challenges reflect Stabilizer characteristics.",
      traits_shown: ["Emotional steadiness", "Calm presence", "Adaptability", "Reliable support"]
    },
    {
      name: "Alfred Pennyworth",
      source: "Batman",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/alfred-pennyworth.jpg`,
      description: "Alfred's calm demeanor, adaptability to Bruce's needs, and steady presence through chaos exemplify the Stabilizer's balanced approach.",
      traits_shown: ["Calm demeanor", "Adaptability", "Steady presence", "Balanced approach"]
    },
    {
      name: "Iroh",
      source: "Avatar: The Last Airbender",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/iroh.jpg`,
      description: "Iroh's emotional wisdom, calm presence in crisis, and ability to adapt reflect the Stabilizer's balanced and flexible nature.",
      traits_shown: ["Emotional wisdom", "Calm in crisis", "Flexible approach", "Balanced perspective"]
    },
    {
      name: "Groot",
      source: "Guardians of the Galaxy",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/groot.jpg`,
      description: "Groot's calm, steady presence and reliable support for his team reflects the Stabilizer's grounding influence.",
      traits_shown: ["Calm presence", "Reliable support", "Steady nature", "Grounding influence"]
    },
    {
      name: "Marge Simpson",
      source: "The Simpsons",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/marge-simpson.png`,
      description: "Marge's role as the calm, steady center of the Simpson family reflects Stabilizer characteristics.",
      traits_shown: ["Family anchor", "Emotional balance", "Steady presence", "Calm center"]
    },
    // Public figures
    {
      name: "Dalai Lama",
      source: "Spiritual Leader",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/dalai-lama.jpg`,
      description: "The Dalai Lama's public image of emotional equilibrium and steady presence aligns with Stabilizer patterns.",
      traits_shown: ["Emotional balance", "Cross-cultural adaptability", "Steady presence", "Calm demeanor"]
    },
    {
      name: "Tom Hanks",
      source: "Actor",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/tom-hanks.jpg`,
      description: "Hanks' reputation for steady professionalism and calm public presence reflects Stabilizer characteristics.",
      traits_shown: ["Steady professionalism", "Versatile adaptability", "Calm presence", "Balanced approach"]
    },
    {
      name: "Morgan Freeman",
      source: "Actor",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/morgan-freeman.jpg`,
      description: "Freeman's calm, reassuring presence and ability to bring stability to any role reflects Stabilizer characteristics.",
      traits_shown: ["Reassuring presence", "Calm demeanor", "Stability", "Grounding voice"]
    },
    {
      name: "Bob Ross",
      source: "Painter & TV Host",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/bob-ross.jpg`,
      description: "Bob Ross's calm, soothing presence and ability to bring peace embodies the Stabilizer's grounding influence.",
      traits_shown: ["Calming presence", "Peaceful demeanor", "Soothing influence", "Gentle stability"]
    },
    {
      name: "Thich Nhat Hanh",
      source: "Buddhist Monk & Author",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/thich-nhat-hanh.jpg`,
      description: "Thich Nhat Hanh's teachings on mindfulness and calm presence exemplify Stabilizer characteristics.",
      traits_shown: ["Mindful presence", "Emotional centeredness", "Calm teaching", "Peaceful wisdom"]
    }
  ],

  visionary: [
    // Fictional
    {
      name: "Professor X / Charles Xavier",
      source: "X-Men",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/professor-x.jpg`,
      description: "Xavier's combination of a transformative vision for mutant-human coexistence with systematic institution-building exemplifies the Visionary.",
      traits_shown: ["Transformative vision", "Institution building", "Systematic approach", "Adaptable strategy"]
    },
    {
      name: "Dumbledore",
      source: "Harry Potter",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/dumbledore.jpg`,
      description: "Dumbledore's ability to see the long game and build systems to defeat Voldemort reflects the Visionary's strategic innovation.",
      traits_shown: ["Long-term vision", "Strategic planning", "Adaptive execution", "Institution building"]
    },
    {
      name: "T'Challa / Black Panther",
      source: "Marvel Cinematic Universe",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/tchalla.jpg`,
      description: "T'Challa's vision to open Wakanda while systematically planning the transition demonstrates the Visionary's combination of innovation and execution.",
      traits_shown: ["Transformative vision", "Systematic planning", "Adaptive approach", "Principled innovation"]
    },
    {
      name: "Morpheus",
      source: "The Matrix",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/morpheus.jpg`,
      description: "Morpheus's unwavering vision of freeing humanity and his systematic approach reflect Visionary characteristics.",
      traits_shown: ["Unwavering vision", "Systematic approach", "Inspirational leadership", "Long-term planning"]
    },
    {
      name: "Vision",
      source: "Marvel Cinematic Universe",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/vision-mcu.jpg`,
      description: "Vision's unique perspective on humanity's potential and thoughtful approach embody the Visionary's combination of insight and planning.",
      traits_shown: ["Unique perspective", "Systematic thinking", "Principled approach", "Future focus"]
    },
    // Public figures
    {
      name: "Satya Nadella",
      source: "CEO, Microsoft",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/satya-nadella.jpg`,
      description: "Nadella's transformation of Microsoft's culture and strategy, combining vision with systematic execution, aligns with Visionary patterns.",
      traits_shown: ["Cultural transformation", "Strategic vision", "Systematic execution", "Adaptive leadership"]
    },
    {
      name: "Jeff Bezos",
      source: "Founder, Amazon",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/jeff-bezos.jpg`,
      description: "Bezos' long-term thinking and systematic building of Amazon's infrastructure reflects Visionary characteristics.",
      traits_shown: ["Long-term thinking", "Systematic building", "Adaptive strategy", "Visionary planning"]
    },
    {
      name: "Sundar Pichai",
      source: "CEO, Google/Alphabet",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/sundar-pichai.jpg`,
      description: "Pichai's strategic vision for AI and Google's future combined with systematic execution reflects Visionary characteristics.",
      traits_shown: ["Strategic vision", "Systematic leadership", "Future focus", "Adaptive planning"]
    },
    {
      name: "Mary Barra",
      source: "CEO, General Motors",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/mary-barra.jpg`,
      description: "Barra's vision for GM's electric future and systematic transformation exemplifies Visionary leadership.",
      traits_shown: ["Transformative vision", "Systematic change", "Industry leadership", "Long-term planning"]
    },
    {
      name: "Reed Hastings",
      source: "Co-founder, Netflix",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/reed-hastings.jpg`,
      description: "Hastings's vision of streaming entertainment and systematic disruption reflects Visionary patterns.",
      traits_shown: ["Industry vision", "Systematic disruption", "Adaptive strategy", "Long-term thinking"]
    }
  ],

  harmonizer: [
    // Fictional
    {
      name: "Aang",
      source: "Avatar: The Last Airbender",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/aang.jpg`,
      description: "Aang's commitment to balance, care for all nations, and preference for peaceful resolution reflects the Harmonizer's authentic peacemaking.",
      traits_shown: ["Commitment to balance", "Deep care", "Peaceful approach", "Authentic connection"]
    },
    {
      name: "Belle",
      source: "Beauty and the Beast",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/belle.jpg`,
      description: "Belle's preference for meaningful connection over superficial socializing, combined with empathy, reflects Harmonizer patterns.",
      traits_shown: ["Deep connection", "Ethical principles", "Empathy", "Authentic relationships"]
    },
    {
      name: "Newt Scamander",
      source: "Fantastic Beasts",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/newt-scamander.jpg`,
      description: "Newt's preference for small circles and genuine care for misunderstood creatures exemplify the Harmonizer's values.",
      traits_shown: ["Small circle preference", "Genuine care", "Ethical stance", "Authentic empathy"]
    },
    {
      name: "Steven Universe",
      source: "Steven Universe",
      type: "fictional",
      description: "Steven's deep empathy, commitment to understanding others, and peaceful conflict resolution reflect Harmonizer characteristics.",
      traits_shown: ["Deep empathy", "Understanding others", "Peaceful resolution", "Authentic care"]
    },
    {
      name: "Amélie Poulain",
      source: "Amélie",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/amelie.jpg`,
      description: "Amélie's quiet care for others and genuine empathy reflect Harmonizer traits.",
      traits_shown: ["Quiet care", "Meaningful gestures", "Genuine empathy", "Authentic kindness"]
    },
    // Public figures
    {
      name: "Brené Brown",
      source: "Researcher & Author",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/brene-brown.jpg`,
      description: "Brown's focus on authenticity and genuine connection aligns with the Harmonizer's values of deep, honest relationships.",
      traits_shown: ["Authenticity focus", "Vulnerability advocacy", "Genuine connection", "Ethical approach"]
    },
    {
      name: "Mr. Rogers",
      source: "Television Host (harmonizer aspect)",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/fred-rogers.png`,
      description: "Mr. Rogers' commitment to authenticity and one-on-one connection reflects Harmonizer patterns.",
      traits_shown: ["Authenticity", "Individual connection", "Ethical guidance", "Gentle approach"]
    },
    {
      name: "Hayao Miyazaki",
      source: "Animator & Director",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/hayao-miyazaki.jpg`,
      description: "Miyazaki's films emphasize harmony with nature and authentic human connection, reflecting Harmonizer values.",
      traits_shown: ["Nature harmony", "Authentic storytelling", "Deep themes", "Ethical creativity"]
    },
    {
      name: "Jane Austen",
      source: "Author",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/jane-austen.jpg`,
      description: "Austen's focus on authentic relationships and ethical behavior in her novels reflects Harmonizer values.",
      traits_shown: ["Relationship focus", "Ethical themes", "Authentic portrayal", "Social observation"]
    },
    {
      name: "Emily Dickinson",
      source: "Poet",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/emily-dickinson.png`,
      description: "Dickinson's preference for solitude and authentic expression through poetry reflects Harmonizer characteristics.",
      traits_shown: ["Solitude preference", "Deep introspection", "Authentic expression", "Inner focus"]
    }
  ],

  achiever: [
    // Fictional
    {
      name: "Leslie Knope",
      source: "Parks and Recreation",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/leslie-knope.jpg`,
      description: "Leslie's relentless goal pursuit, organizational skills, and social energy exemplifies the Achiever archetype.",
      traits_shown: ["Goal-driven", "Highly organized", "Social energy", "Adaptable execution"]
    },
    {
      name: "Miranda Priestly",
      source: "The Devil Wears Prada",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/miranda-priestly.jpg`,
      description: "Miranda's demanding excellence and drive for achievement reflect the Achiever's results-focused approach.",
      traits_shown: ["High standards", "Results focus", "Systematic execution", "Driven leadership"]
    },
    {
      name: "Harvey Specter",
      source: "Suits",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/harvey-specter.jpg`,
      description: "Harvey's competitive drive and systematic approach to winning cases demonstrate Achiever characteristics.",
      traits_shown: ["Competitive drive", "Winning focus", "Strategic approach", "Relationship leverage"]
    },
    {
      name: "Don Draper",
      source: "Mad Men",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/don-draper.jpg`,
      description: "Don's relentless pursuit of professional success and adaptability reflects Achiever traits.",
      traits_shown: ["Success pursuit", "Adaptive approach", "Results focus", "Professional drive"]
    },
    {
      name: "Rocky Balboa",
      source: "Rocky",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/rocky-balboa.jpg`,
      description: "Rocky's determination, disciplined training, and unwavering focus on goals exemplify Achiever characteristics.",
      traits_shown: ["Determination", "Disciplined effort", "Goal focus", "Persistent drive"]
    },
    // Public figures
    {
      name: "Serena Williams",
      source: "Tennis Champion",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/serena-williams.jpg`,
      description: "Williams' legendary drive for excellence and competitive spirit align with Achiever patterns.",
      traits_shown: ["Drive for excellence", "Disciplined approach", "Competitive spirit", "Results focus"]
    },
    {
      name: "Kobe Bryant",
      source: "Basketball Legend",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/kobe-bryant.jpg`,
      description: "Bryant's legendary work ethic, competitive drive, and relentless pursuit of excellence exemplify Achiever characteristics.",
      traits_shown: ["Legendary work ethic", "Competitive drive", "Excellence pursuit", "Disciplined focus"]
    },
    {
      name: "Beyoncé",
      source: "Singer & Performer",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/beyonce.jpg`,
      description: "Beyoncé's perfectionism and relentless work ethic reflect Achiever traits.",
      traits_shown: ["Perfectionism", "Work ethic", "Excellence drive", "Results focus"]
    },
    {
      name: "Michael Jordan",
      source: "Basketball Legend",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/michael-jordan.jpg`,
      description: "Jordan's competitive drive and legendary work ethic exemplify quintessential Achiever characteristics.",
      traits_shown: ["Competitive drive", "Work ethic", "Championship focus", "Relentless pursuit"]
    },
    {
      name: "Indra Nooyi",
      source: "Former CEO, PepsiCo",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/indra-nooyi.jpg`,
      description: "Nooyi's reputation for ambitious goals and systematic execution reflects Achiever characteristics.",
      traits_shown: ["Ambitious goals", "Systematic execution", "Adaptive strategy", "Driven leadership"]
    }
  ],

  analyst: [
    // Fictional
    {
      name: "Sherlock Holmes",
      source: "Arthur Conan Doyle (analyst aspect)",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/sherlock-holmes.jpg`,
      description: "Holmes' rigorous analytical method and independent thinking perfectly embody the Analyst archetype.",
      traits_shown: ["Rigorous analysis", "Independent thinking", "Logic-driven", "Systematic investigation"]
    },
    {
      name: "Data",
      source: "Star Trek: The Next Generation",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/data-tng.jpg`,
      description: "Data's analytical approach to understanding humans and systematic problem-solving reflect the Analyst's methodology.",
      traits_shown: ["Systematic analysis", "Objective perspective", "Curious investigation", "Logical approach"]
    },
    {
      name: "Lisbeth Salander",
      source: "The Girl with the Dragon Tattoo",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/lisbeth-salander.jpg`,
      description: "Lisbeth's exceptional analytical skills and willingness to challenge assumptions exemplify the Analyst's truth-seeking nature.",
      traits_shown: ["Exceptional analysis", "Independent work", "Challenges assumptions", "Deep investigation"]
    },
    {
      name: "Spencer Reid",
      source: "Criminal Minds",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/spencer-reid.jpg`,
      description: "Reid's encyclopedic knowledge and analytical profiling methods reflect Analyst characteristics.",
      traits_shown: ["Encyclopedic knowledge", "Analytical methods", "Data-driven", "Pattern recognition"]
    },
    {
      name: "Amy Santiago",
      source: "Brooklyn Nine-Nine",
      type: "fictional",
      image_url: `${SUPABASE_IMG}/amy-santiago.png`,
      description: "Amy's methodical approach to police work and love of documentation reflect Analyst traits.",
      traits_shown: ["Methodical approach", "Documentation focus", "Systematic methods", "Detail orientation"]
    },
    // Public figures
    {
      name: "Albert Einstein",
      source: "Theoretical Physicist",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/albert-einstein.jpg`,
      description: "Einstein's systematic approach and independent thinking align with Analyst patterns.",
      traits_shown: ["Systematic thinking", "Independent conclusions", "Deep analysis", "Challenges conventions"]
    },
    {
      name: "Stephen Hawking",
      source: "Theoretical Physicist & Author",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/stephen-hawking.jpg`,
      description: "Hawking's rigorous analytical work and methodical approach reflect Analyst characteristics.",
      traits_shown: ["Rigorous analysis", "Independent theory", "Methodical approach", "Truth-seeking"]
    },
    {
      name: "Katherine Johnson",
      source: "NASA Mathematician",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/katherine-johnson.jpg`,
      description: "Johnson's precise mathematical calculations and analytical approach exemplify Analyst characteristics.",
      traits_shown: ["Mathematical precision", "Analytical calculations", "Methodical work", "Accurate analysis"]
    },
    {
      name: "Nate Silver",
      source: "Statistician & Writer",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/nate-silver.jpg`,
      description: "Silver's data-driven approach to forecasting reflects Analyst patterns of systematic investigation.",
      traits_shown: ["Data-driven analysis", "Statistical methods", "Systematic forecasting", "Pattern recognition"]
    },
    {
      name: "Carl Sagan",
      source: "Astronomer & Science Communicator",
      type: "public_figure",
      image_url: `${SUPABASE_IMG}/carl-sagan.jpg`,
      description: "Sagan's analytical approach to understanding the cosmos reflects Analyst characteristics.",
      traits_shown: ["Scientific inquiry", "Analytical thinking", "Systematic exploration", "Evidence-based approach"]
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
