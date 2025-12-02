"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Heart, AlertCircle, Lightbulb, TrendingUp, BookOpen } from "lucide-react";
import type { DimensionScore, Dimension } from "@/types";

interface InsightsSectionProps {
  scores: DimensionScore[];
}

const dimensionNames: Record<Dimension, string> = {
  openness: "Openness to Experience",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  emotionalResilience: "Emotional Resilience",
  honestyHumility: "Honesty-Humility",
  adaptability: "Adaptability",
};

// Rich dimension-specific descriptions for high scores (strengths)
const dimensionStrengthDescriptions: Record<Dimension, { title: string; description: string }> = {
  openness: {
    title: "Creative & Curious Mind",
    description: "Your high Openness means you naturally seek out new experiences, ideas, and perspectives. You're comfortable with ambiguity and complexity, often seeing possibilities where others see obstacles. This trait makes you a natural innovator who can connect disparate concepts and envision futures that haven't been imagined yet. You're likely drawn to intellectual challenges, aesthetic experiences, and unconventional approaches."
  },
  conscientiousness: {
    title: "Disciplined & Goal-Oriented",
    description: "Your high Conscientiousness reflects a natural ability to organize, plan, and execute. You set goals and actually achieve them—not through force of will alone, but because systematic execution comes naturally to you. Others rely on you because you follow through on commitments and maintain high standards. This trait is one of the strongest predictors of professional and academic success across virtually all fields."
  },
  extraversion: {
    title: "Energized by Connection",
    description: "Your high Extraversion means you gain energy from social interaction rather than being drained by it. You're comfortable in groups, naturally assertive, and tend toward positive emotions. This doesn't mean you're never introspective—but your natural state is oriented outward, toward people and action. You likely find it easy to meet new people, speak up in meetings, and maintain wide social networks."
  },
  agreeableness: {
    title: "Naturally Empathetic",
    description: "Your high Agreeableness reflects genuine concern for others' wellbeing and a natural orientation toward cooperation. You pick up on others' emotions easily, value harmony, and often prioritize relationships over competition. This isn't weakness—it's social intelligence that builds trust and enables collaboration. You create environments where others feel safe and valued, which is increasingly recognized as essential for effective teams."
  },
  emotionalResilience: {
    title: "Calm Under Pressure",
    description: "Your high Emotional Resilience means you maintain stability when others might become anxious or overwhelmed. This isn't suppression of emotion but genuine equanimity—you feel things without being destabilized by them. Under pressure, you're able to think clearly and make sound decisions. This trait is particularly valuable in leadership, crisis management, and any role requiring steady judgment when stakes are high."
  },
  honestyHumility: {
    title: "Principled & Authentic",
    description: "Your high Honesty-Humility reflects a genuine orientation toward fairness, authenticity, and modesty. You don't pursue status for its own sake and aren't comfortable with manipulation or deception. This creates deep trust with those who know you—they understand that your word is reliable and your motives are transparent. In an era of spin and self-promotion, your authenticity is increasingly rare and valued."
  },
  adaptability: {
    title: "Thrives on Change",
    description: "Your high Adaptability means you handle change and uncertainty better than most. Rather than being destabilized by shifting circumstances, you're energized by them—finding new situations interesting rather than threatening. This flexibility extends to your thinking, which can shift perspectives and approach problems from multiple angles. In rapidly changing environments, your adaptability is a crucial competitive advantage."
  }
};

// Rich dimension-specific descriptions for lower scores (growth areas)
const dimensionGrowthDescriptions: Record<Dimension, { title: string; description: string }> = {
  openness: {
    title: "Preference for the Familiar",
    description: "Your score suggests you prefer established approaches over experimental ones, and find comfort in the familiar. This isn't a weakness—it provides stability and ensures that proven methods aren't abandoned prematurely. Growth opportunity: occasionally challenging yourself to try new approaches can expand your toolkit without abandoning what works. Even small experiments outside your comfort zone can yield valuable insights."
  },
  conscientiousness: {
    title: "Flexible & Spontaneous",
    description: "Your score suggests you're more spontaneous and flexible than highly structured. This brings genuine advantages—you adapt easily and aren't paralyzed by imperfect plans. Growth opportunity: building some systems and routines (even simple ones) can help you achieve longer-term goals that require sustained effort. The key is finding the minimal structure that works for you rather than fighting your nature entirely."
  },
  extraversion: {
    title: "Reflective & Independent",
    description: "Your score suggests you're more oriented toward inner experience and prefer meaningful one-on-one connections over group activities. This enables deep focus, careful thought, and rich inner life. Growth opportunity: while honoring your natural preference for solitude, occasionally pushing yourself into social situations can expand opportunities and prevent isolation. Quality matters more than quantity in your social investments."
  },
  agreeableness: {
    title: "Direct & Independent-Minded",
    description: "Your score suggests you prioritize truth and logic over harmony, and you're comfortable with competition and disagreement. This enables honest feedback and prevents groupthink. Growth opportunity: while your directness is valuable, learning to deliver honest messages with warmth can increase their impact. People are more likely to hear difficult truths from someone they feel cares about them."
  },
  emotionalResilience: {
    title: "Emotionally Sensitive",
    description: "Your score suggests you experience emotions intensely and may be more affected by stress than some others. This sensitivity isn't weakness—it enables empathy, creativity, and awareness of subtleties others miss. Growth opportunity: developing coping strategies and support systems can help you leverage your sensitivity while building resilience. Consider stress management techniques, regular exercise, and nurturing relationships as essential investments."
  },
  honestyHumility: {
    title: "Ambitious & Self-Assured",
    description: "Your score suggests you're comfortable with self-promotion, competition for status, and strategic positioning. This can be advantageous in competitive environments that reward visibility. Growth opportunity: while your ambition is valuable, ensure it's channeled toward meaningful goals rather than status for its own sake. Consider how your success can create value for others—this reframes ambition as service."
  },
  adaptability: {
    title: "Values Stability",
    description: "Your score suggests you prefer predictable environments and may find frequent change draining rather than energizing. This provides consistency and enables deep investment in chosen paths. Growth opportunity: while honoring your need for stability, building some tolerance for change can expand your options. Small, voluntary exposures to novelty are easier than sudden forced changes—prepare for inevitable transitions before they happen."
  }
};

export function InsightsSection({ scores }: InsightsSectionProps) {
  const scoreMap = scores.reduce((acc, score) => {
    acc[score.dimension] = score;
    return acc;
  }, {} as Record<Dimension, DimensionScore>);

  // Find top 3 and bottom 3 dimensions
  const sortedScores = [...scores].sort((a, b) => b.percentile - a.percentile);
  const top3 = sortedScores.slice(0, 3);
  const bottom3 = sortedScores.slice(-3).reverse();

  // Helper to get percentile values with defaults
  const getPercentile = (dim: Dimension): number => scoreMap[dim]?.percentile ?? 50;

  // Generate work context insights with richer content
  const generateWorkInsights = () => {
    const insights: { heading: string; detail: string }[] = [];
    const conscientiousness = getPercentile("conscientiousness");
    const extraversion = getPercentile("extraversion");
    const openness = getPercentile("openness");
    const agreeableness = getPercentile("agreeableness");
    const resilience = getPercentile("emotionalResilience");
    const adaptability = getPercentile("adaptability");

    // Work style based on conscientiousness + openness combination
    if (conscientiousness >= 70 && openness >= 70) {
      insights.push({
        heading: "Creative Executor",
        detail: "You have a rare combination: the imagination to envision new solutions and the discipline to make them real. You excel in roles requiring innovation within structured environments—product development, R&D leadership, or strategic consulting. Unlike pure creatives, you actually ship. Unlike pure executors, you generate original ideas."
      });
    } else if (conscientiousness >= 70 && openness < 40) {
      insights.push({
        heading: "Reliable Specialist",
        detail: "You thrive in roles with clear expectations, established methods, and measurable outcomes. Your combination of discipline and preference for proven approaches makes you excellent at operations, quality assurance, and process optimization. You're the person who ensures things work consistently, not the one who tears up the playbook."
      });
    } else if (conscientiousness >= 70) {
      insights.push({
        heading: "Organized Achiever",
        detail: "Your high conscientiousness is one of the strongest predictors of career success across fields. You set goals and reach them, meet deadlines, and maintain standards. Structure isn't constraining for you—it's enabling. Look for roles that reward systematic execution and long-term commitment rather than constant reinvention."
      });
    } else if (openness >= 70 && conscientiousness < 50) {
      insights.push({
        heading: "Creative Generator",
        detail: "You're strongest in the ideation and exploration phases of work, generating possibilities and seeing connections others miss. You may find execution and routine draining. Consider roles that value your creative contribution while partnering with or delegating to those who excel at follow-through and detail management."
      });
    } else if (openness >= 70) {
      insights.push({
        heading: "Innovative Thinker",
        detail: "Your openness to experience makes you naturally curious and creative. You're drawn to novel challenges and unconventional approaches. The most satisfying roles will engage your mind with genuine complexity and give you latitude to explore—research, design, strategy, or creative fields that value originality."
      });
    }

    // Social orientation at work
    if (extraversion >= 70 && agreeableness >= 70) {
      insights.push({
        heading: "Natural Team Builder",
        detail: "You combine social energy with genuine care for others, making you exceptionally effective at building and leading teams. People enjoy working with you and tend to perform better under your influence. Consider roles involving team leadership, stakeholder management, or any position where success depends on getting the best from others."
      });
    } else if (extraversion >= 70 && agreeableness < 40) {
      insights.push({
        heading: "Assertive Driver",
        detail: "You're comfortable in social situations and not afraid of conflict or competition. This makes you effective at sales, negotiation, and leadership roles requiring tough decisions. You'll push for results where more agreeable types might preserve harmony at the cost of performance. Channel this into roles where directness is valued."
      });
    } else if (extraversion >= 70) {
      insights.push({
        heading: "Energized by Interaction",
        detail: "You draw energy from social interaction and are comfortable being visible in groups. You communicate naturally, build relationships easily, and don't shy from speaking up. Roles involving presentations, networking, or frequent collaboration play to your strengths—avoid positions requiring extended solitary work."
      });
    } else if (extraversion < 40 && openness >= 60) {
      insights.push({
        heading: "Deep Thinker",
        detail: "You do your best work in focused, independent settings where you can think deeply without constant interruption. Open offices and meeting-heavy cultures may drain you. Seek roles that value thoughtful analysis over rapid social processing—research, writing, analysis, or specialized technical work that rewards depth over breadth."
      });
    } else if (extraversion < 40) {
      insights.push({
        heading: "Independent Contributor",
        detail: "You work best with autonomy and focused time rather than constant collaboration. This isn't antisocial—it's how you do your best thinking. Seek roles with clear deliverables where you can manage your own time, limiting meetings to what's genuinely necessary. Your deep work capability is increasingly rare and valuable."
      });
    }

    // Stress and change handling at work
    if (resilience >= 70 && adaptability >= 70) {
      insights.push({
        heading: "Crisis-Ready",
        detail: "You maintain clarity under pressure and adapt quickly to changing circumstances—a powerful combination for leadership and high-stakes environments. Consider roles in crisis management, startup environments, or any position where composure during chaos is valuable. You're the one others look to when things get difficult."
      });
    } else if (adaptability >= 70 && conscientiousness < 50) {
      insights.push({
        heading: "Change Navigator",
        detail: "You thrive in dynamic environments that would exhaust more stability-seeking types. Your flexibility allows you to pivot quickly and take advantage of emerging opportunities. Startups, project-based work, and rapidly evolving industries suit you better than stable, process-oriented organizations."
      });
    } else if (resilience >= 70) {
      insights.push({
        heading: "Steady Anchor",
        detail: "Your emotional stability makes you a calming presence in stressful situations. You make decisions based on facts rather than anxiety, and you don't amplify others' stress. This is particularly valuable in management, healthcare, crisis response, and any role requiring level-headed judgment under pressure."
      });
    }

    if (insights.length === 0) {
      insights.push({
        heading: "Versatile Professional",
        detail: "Your balanced profile suggests adaptability across different work contexts. You're not locked into a narrow niche—you can flex your style based on what the situation requires. This versatility is valuable, though you may benefit from identifying and doubling down on specific strengths rather than remaining generalized."
      });
    }

    return insights;
  };

  // Generate relationship insights with richer content
  const generateRelationshipInsights = () => {
    const insights: { heading: string; detail: string }[] = [];
    const agreeableness = getPercentile("agreeableness");
    const extraversion = getPercentile("extraversion");
    const honestyHumility = getPercentile("honestyHumility");
    const resilience = getPercentile("emotionalResilience");
    const openness = getPercentile("openness");

    // Connection style
    if (agreeableness >= 70 && honestyHumility >= 70) {
      insights.push({
        heading: "Authentic Caregiver",
        detail: "You combine genuine empathy with principled authenticity, creating relationships built on trust and mutual care. People know you're honest and that you genuinely have their interests at heart. This combination is powerful—you can give difficult feedback that lands because people know it comes from care, not judgment or competition."
      });
    } else if (agreeableness >= 70 && extraversion >= 70) {
      insights.push({
        heading: "Social Nurturer",
        detail: "You bring warmth and energy to social situations, naturally creating positive environments where others feel welcome. You likely have a wide circle of connections and serve as a hub who brings people together. Your challenge is ensuring some of these connections develop real depth—quality alongside quantity."
      });
    } else if (agreeableness >= 70 && extraversion < 40) {
      insights.push({
        heading: "Quiet Supporter",
        detail: "You care deeply about others but express it more through listening, thoughtfulness, and reliable presence than through social energy. You prefer fewer, deeper connections to broad networks. People close to you know you as someone who truly understands and supports them—even if you don't show up at every social event."
      });
    } else if (agreeableness >= 70) {
      insights.push({
        heading: "Naturally Caring",
        detail: "You're genuinely oriented toward others' wellbeing and pick up on emotional cues easily. This creates warm relationships but may also lead you to prioritize others' needs at the expense of your own. Learning to balance care for others with self-advocacy is an important growth edge for you."
      });
    } else if (agreeableness < 40 && honestyHumility >= 70) {
      insights.push({
        heading: "Principled Truth-Teller",
        detail: "You value honesty over harmony and aren't afraid to voice disagreement or deliver difficult truths. This isn't about lacking care—you believe honest feedback is more valuable than comfortable validation. People who want genuine input seek you out; those who want cheerleading may find you uncomfortable."
      });
    } else if (agreeableness < 40) {
      insights.push({
        heading: "Independent Connector",
        detail: "You approach relationships from a position of independence rather than interdependence. You don't need others' approval and won't sacrifice authenticity for social comfort. This can make you refreshingly direct but may also create friction with more harmony-oriented people. Choose relationships that value your directness."
      });
    }

    // Social energy and investment
    if (extraversion < 40 && openness >= 70) {
      insights.push({
        heading: "Depth Over Breadth",
        detail: "You invest deeply in a smaller circle rather than maintaining wide networks. This isn't social failure—it's resource allocation. Your relationships tend to be meaningful and lasting because you bring your full presence rather than spreading thin. Accept your social style rather than forcing yourself toward an extraverted ideal."
      });
    } else if (extraversion < 40) {
      insights.push({
        heading: "Selective Connection",
        detail: "You choose relationships carefully and invest in them seriously. Small talk feels draining, but deep conversation is rewarding. You don't need to change this—but do ensure you maintain enough connection to avoid isolation. Quality matters more than quantity, but zero quantity is too little."
      });
    }

    // Emotional stability in relationships
    if (resilience >= 70 && agreeableness >= 60) {
      insights.push({
        heading: "Stable Foundation",
        detail: "You provide emotional stability that others can rely on. You don't amplify conflicts or create drama, and you can sit with others' difficult emotions without being destabilized yourself. This makes you a grounding presence in relationships—the one others come to when they need calm support rather than reactive escalation."
      });
    } else if (resilience < 40 && agreeableness >= 70) {
      insights.push({
        heading: "Sensitive Connector",
        detail: "You feel things deeply—both your own emotions and others'. This sensitivity enables profound empathy and connection but may also leave you vulnerable to absorbing others' stress or being hurt by minor conflicts. Building emotional self-care practices is essential for sustainable relationships."
      });
    }

    if (insights.length === 0) {
      insights.push({
        heading: "Adaptive Relater",
        detail: "Your relationship style flexes based on context and the specific people involved. You don't have a rigid social template—you adjust your approach to what each relationship needs. This versatility serves you well, though you may benefit from identifying your core relationship needs rather than always adapting to others."
      });
    }

    return insights;
  };

  // Generate stress response insights with richer content
  const generateStressInsights = () => {
    const insights: { heading: string; detail: string }[] = [];
    const resilience = getPercentile("emotionalResilience");
    const adaptability = getPercentile("adaptability");
    const conscientiousness = getPercentile("conscientiousness");
    const openness = getPercentile("openness");
    const extraversion = getPercentile("extraversion");

    // Core stress response
    if (resilience >= 75 && adaptability >= 70) {
      insights.push({
        heading: "Thrives Under Pressure",
        detail: "You have exceptional stress tolerance—the combination of emotional stability and adaptability means you handle both chronic pressure and sudden changes well. You may even notice that you perform better with some stress, as it activates your focus without overwhelming your capacity. Be aware that others may not share this tolerance; what feels normal to you may be overwhelming to them."
      });
    } else if (resilience >= 70) {
      insights.push({
        heading: "Emotionally Stable",
        detail: "You maintain your equilibrium when others might become anxious or reactive. This allows you to think clearly under pressure and make sound decisions when stakes are high. You're likely seen as a calming presence during difficult times. Your stress response tends toward stability rather than reactivity—though you may underestimate how challenging situations are for others."
      });
    } else if (resilience >= 50 && resilience < 70) {
      insights.push({
        heading: "Moderate Stress Response",
        detail: "You experience stress but can manage it with appropriate strategies. You're neither immune to pressure nor overwhelmed by normal challenges. Building a toolkit of coping mechanisms—exercise, social support, structured problem-solving—allows you to maintain performance during demanding periods without accumulating chronic stress."
      });
    } else if (resilience < 50) {
      insights.push({
        heading: "Stress-Sensitive",
        detail: "You may experience stress more intensely than some others, with emotional reactions that feel harder to manage. This isn't weakness—it's neurological difference that has evolutionary advantages (sensitivity to threats). The key is building robust coping systems: regular exercise, sleep hygiene, social support, and techniques for calming your nervous system when activated."
      });
    }

    // Coping strategies based on profile
    if (conscientiousness >= 70 && resilience >= 60) {
      insights.push({
        heading: "System-Based Coping",
        detail: "When stressed, you likely regain control through organization and planning. Making lists, creating schedules, and breaking problems into manageable steps helps you feel capable of handling challenges. This systematic approach to stress is effective—the act of planning itself reduces anxiety by creating a sense of agency."
      });
    } else if (openness >= 70 && adaptability >= 70) {
      insights.push({
        heading: "Creative Problem-Solving",
        detail: "Under stress, you're likely to seek novel solutions or reframe problems entirely. You might change your environment, try unconventional approaches, or find ways to see challenges as opportunities. This flexibility is valuable, though sometimes problems require persistence with existing approaches rather than seeking new ones."
      });
    } else if (extraversion >= 70) {
      insights.push({
        heading: "Social Processing",
        detail: "You likely cope with stress by talking through problems with others—not necessarily seeking solutions, but processing out loud and gaining perspective through social connection. Being isolated during stressful periods probably makes things worse for you. Maintain your support network as a stress management strategy."
      });
    } else if (extraversion < 40 && resilience >= 60) {
      insights.push({
        heading: "Reflective Recovery",
        detail: "You recover from stress through solitude and reflection rather than social processing. Time alone to think, decompress, and recharge is essential—not avoidance, but genuine restoration. Protect this alone time during stressful periods even if others don't understand your need for it."
      });
    }

    // Growth edge for stress management
    if (resilience < 50 && adaptability < 50) {
      insights.push({
        heading: "Building Resilience",
        detail: "Developing stress tolerance is possible through practice. Start with physical foundations: regular exercise, consistent sleep, and reduced stimulant use. Add psychological practices: mindfulness, cognitive reframing, and deliberately exposing yourself to small stressors to build tolerance. Consider professional support if stress significantly impacts your life."
      });
    }

    if (insights.length === 0) {
      insights.push({
        heading: "Contextual Response",
        detail: "Your stress response varies based on the type of challenge and your current resources. This adaptability means you're not locked into a single stress pattern, but it also means different strategies may work better in different situations. Pay attention to what helps in which contexts."
      });
    }

    return insights;
  };

  // Generate learning and communication insights with richer content
  const generateLearningInsights = () => {
    const insights: { heading: string; detail: string }[] = [];
    const openness = getPercentile("openness");
    const extraversion = getPercentile("extraversion");
    const conscientiousness = getPercentile("conscientiousness");
    const agreeableness = getPercentile("agreeableness");

    // Learning style
    if (openness >= 70 && extraversion >= 70) {
      insights.push({
        heading: "Interactive Explorer",
        detail: "You learn best through discussion, hands-on experimentation, and collaborative projects. Passive absorption (reading, lectures) is less effective for you than active engagement. You benefit from explaining concepts to others—the act of articulation deepens your understanding. Seek learning environments with interaction and exploration."
      });
    } else if (openness >= 70 && extraversion < 40) {
      insights.push({
        heading: "Independent Investigator",
        detail: "You learn deeply through independent exploration, following your curiosity wherever it leads. You prefer to discover through your own investigation rather than being taught. Give yourself permission to learn non-linearly, diving into what interests you rather than following prescribed sequences. Your comprehension is deeper when it's self-directed."
      });
    } else if (conscientiousness >= 70 && openness < 50) {
      insights.push({
        heading: "Structured Learner",
        detail: "You learn most effectively through clear instruction, organized materials, and systematic practice. You prefer knowing what's expected and working methodically toward mastery. Step-by-step curricula and structured courses suit you better than open-ended exploration. You build competence through repetition and gradual skill-building."
      });
    } else if (conscientiousness >= 70) {
      insights.push({
        heading: "Disciplined Student",
        detail: "Your conscientiousness makes you naturally good at learning—you put in the time, complete the work, and maintain focus. You can learn through almost any method because you'll do what it takes. This is a genuine advantage, though you may benefit from occasionally breaking structure to explore tangentially related ideas."
      });
    } else if (openness >= 70) {
      insights.push({
        heading: "Curiosity-Driven Learner",
        detail: "Your learning is driven by genuine curiosity rather than external requirements. You're drawn to complex, novel material and may struggle with rote learning or topics that don't engage your interest. When you're curious about something, you learn it deeply; when you're not, all the discipline in the world may not help. Follow your genuine interests."
      });
    }

    // Communication style
    if (extraversion >= 70 && agreeableness >= 60) {
      insights.push({
        heading: "Warm Communicator",
        detail: "You communicate with energy and warmth, making others feel engaged and valued. You're comfortable speaking in groups, build rapport easily, and adapt your style to your audience. Your natural communication mode is inclusive and encouraging—you bring people in rather than talking at them."
      });
    } else if (extraversion >= 70 && agreeableness < 50) {
      insights.push({
        heading: "Direct Communicator",
        detail: "You communicate with confidence and directness, not filtering your message to preserve others' comfort. This clarity is valuable—people know where they stand with you. However, be aware that some interpret directness as aggression. Matching your message's urgency to the situation prevents unnecessary friction."
      });
    } else if (extraversion < 40 && conscientiousness >= 60) {
      insights.push({
        heading: "Thoughtful Communicator",
        detail: "You prefer written communication and time to formulate responses rather than thinking on your feet in conversation. Your communication tends to be careful, precise, and considered—you say what you mean and mean what you say. Create contexts where this style is valued; don't force yourself into rapid-fire verbal environments."
      });
    } else if (extraversion < 40) {
      insights.push({
        heading: "Selective Communicator",
        detail: "You communicate deliberately, speaking when you have something meaningful to contribute rather than filling silence. This isn't shyness—it's efficiency. In cultures that value verbal volume, this may be underappreciated, but in contexts valuing substance, your communication style is an asset."
      });
    }

    if (insights.length === 0) {
      insights.push({
        heading: "Flexible Learner",
        detail: "Your learning style adapts to the context and material. You're not locked into a single approach and can adjust based on what's required. This flexibility is valuable, though you may benefit from identifying which methods work best for you in different situations."
      });
    }

    return insights;
  };

  const workInsights = generateWorkInsights();
  const relationshipInsights = generateRelationshipInsights();
  const stressInsights = generateStressInsights();
  const learningInsights = generateLearningInsights();

  return (
    <div className="space-y-6">
      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Your Core Strengths
          </CardTitle>
          <CardDescription>Dimensions where you naturally excel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {top3.map((score, index) => {
              const strengthInfo = dimensionStrengthDescriptions[score.dimension];
              return (
                <motion.div
                  key={score.dimension}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-green-800 dark:text-green-300">
                      {strengthInfo.title}
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {dimensionNames[score.dimension]} • {Math.round(score.percentile)}th percentile
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {strengthInfo.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Growth Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-600" />
            Growth Opportunities
          </CardTitle>
          <CardDescription>Dimensions with potential for intentional development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {bottom3.map((score, index) => {
              const growthInfo = dimensionGrowthDescriptions[score.dimension];
              return (
                <motion.div
                  key={score.dimension}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-amber-800 dark:text-amber-300">
                      {growthInfo.title}
                    </span>
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      {dimensionNames[score.dimension]} • {Math.round(score.percentile)}th percentile
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {growthInfo.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Work Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            Work & Career
          </CardTitle>
          <CardDescription>How your personality shapes your professional life</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {workInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border bg-card p-4"
              >
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  {insight.heading}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Relationships */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Relationships & Connection
          </CardTitle>
          <CardDescription>How you form and maintain relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {relationshipInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border bg-card p-4"
              >
                <h4 className="font-semibold text-pink-700 dark:text-pink-400 mb-2">
                  {insight.heading}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stress & Resilience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-purple-600" />
            Stress & Resilience
          </CardTitle>
          <CardDescription>How you respond to pressure and recover</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {stressInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border bg-card p-4"
              >
                <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">
                  {insight.heading}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning & Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-teal-600" />
            Learning & Communication
          </CardTitle>
          <CardDescription>How you absorb information and express yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {learningInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border bg-card p-4"
              >
                <h4 className="font-semibold text-teal-700 dark:text-teal-400 mb-2">
                  {insight.heading}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
