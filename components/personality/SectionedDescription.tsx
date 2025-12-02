"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Brain, 
  Sparkles, 
  Clock, 
  TrendingUp,
  Lightbulb,
  Heart,
  Zap,
  User,
  Shield,
  Flame,
  Target,
  Compass,
  GitBranch,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownText } from "@/components/ui/markdown-text";

type Framework = "prism" | "enneagram" | "mbti";

interface SectionedDescriptionProps {
  paragraphs: string[];
  typeName: string;
  className?: string;
  framework?: Framework;
}

interface DescriptionSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  paragraphs: string[];
  gradient: string;
}

// Base keywords (PRISM / general)
const BASE_KEYWORDS: Record<string, string[]> = {
  innerWorld: ["experience", "internal", "processing", "find that you", "likely find", "lived experience", "mental", "brain"],
  development: ["childhood", "develop", "evolution", "grew", "matured", "child", "early in life", "adulthood"],
  flow: ["flow state", "focus", "hyper-focus", "concentration", "deep work", "triggers", "distraction"],
  creativity: ["creativity", "creative", "innovation", "unique contribution", "vision", "imagination"],
  growth: ["growth", "challenge", "edge", "develop", "evolution", "learning", "struggle"],
  daily: ["typical day", "morning", "routine", "daily", "day-to-day", "decision", "facing a difficult"],
  emotional: ["emotional", "feeling", "passion", "care deeply", "love language", "empathy"],
};

// Enneagram-specific keywords
const ENNEAGRAM_KEYWORDS: Record<string, string[]> = {
  innerWorld: ["inner critic", "inner voice", "internal", "psyche", "psychological", "unconscious", "defense mechanism", "superego", "ego"],
  bodyInstincts: ["body center", "gut", "somatic", "instinct", "visceral", "physical", "body triad", "anger", "rage", "repress"],
  development: ["childhood", "origin", "child", "caregiver", "parent", "early", "grew up", "learned early", "transactional"],
  spiritual: ["spiritual", "liberation", "holy", "virtue", "essence", "soul", "transcend", "awakening", "enlighten", "wisdom"],
  identity: ["identity", "self-image", "who they are", "sense of self", "authenticity", "true self", "false self", "mask"],
  emotional: ["feeling", "emotion", "heart center", "shame", "fear", "anxiety", "love", "passion", "empathy"],
  relationships: ["relationship", "partner", "intimacy", "connection", "attachment", "bond", "trust"],
  integration: ["integration", "disintegration", "growth line", "stress line", "moves toward", "healthy", "unhealthy", "average"],
};

// MBTI-specific keywords  
const MBTI_KEYWORDS: Record<string, string[]> = {
  cognitiveStack: ["cognitive function", "function stack", "dominant", "auxiliary", "tertiary", "inferior", "shadow"],
  perceiving: ["perceiving", "sensing", "intuition", "information", "data", "patterns", "concrete", "abstract", "ni ", "ne ", "si ", "se "],
  judging: ["judging", "thinking", "feeling", "decision", "logic", "values", "ti ", "te ", "fi ", "fe "],
  innerWorld: ["introverted", "inner world", "internal", "reflection", "introspection", "solitude", "energy"],
  outerWorld: ["extraverted", "outer world", "external", "interaction", "social", "action", "engagement"],
  development: ["develop", "mature", "child", "adolescent", "midlife", "grip", "loop"],
  communication: ["communicate", "expression", "language", "conversation", "discuss", "articulate"],
};

// Get keywords based on framework
function getKeywordsForFramework(framework: Framework): Record<string, string[]> {
  switch (framework) {
    case "enneagram":
      return { ...BASE_KEYWORDS, ...ENNEAGRAM_KEYWORDS };
    case "mbti":
      return { ...BASE_KEYWORDS, ...MBTI_KEYWORDS };
    default:
      return BASE_KEYWORDS;
  }
}

function detectSection(paragraph: string, framework: Framework): string {
  const lowerPara = paragraph.toLowerCase();
  const keywords = getKeywordsForFramework(framework);
  
  // Check each category
  for (const [section, sectionKeywords] of Object.entries(keywords)) {
    for (const keyword of sectionKeywords) {
      if (lowerPara.includes(keyword.toLowerCase())) {
        return section;
      }
    }
  }
  return "general";
}

// Base section metadata (PRISM / general)
const BASE_SECTION_META: Record<string, { title: string; icon: React.ReactNode; gradient: string; order: number }> = {
  innerWorld: { 
    title: "Your Inner World", 
    icon: <Brain className="h-4 w-4" />, 
    gradient: "from-purple-500/10 to-transparent",
    order: 1
  },
  flow: { 
    title: "Flow & Focus", 
    icon: <Zap className="h-4 w-4" />, 
    gradient: "from-amber-500/10 to-transparent",
    order: 2
  },
  creativity: { 
    title: "Your Unique Gifts", 
    icon: <Sparkles className="h-4 w-4" />, 
    gradient: "from-pink-500/10 to-transparent",
    order: 3
  },
  development: { 
    title: "How You Develop", 
    icon: <TrendingUp className="h-4 w-4" />, 
    gradient: "from-green-500/10 to-transparent",
    order: 4
  },
  growth: { 
    title: "Growth Opportunities", 
    icon: <Lightbulb className="h-4 w-4" />, 
    gradient: "from-blue-500/10 to-transparent",
    order: 5
  },
  daily: { 
    title: "A Day in Your Life", 
    icon: <Clock className="h-4 w-4" />, 
    gradient: "from-indigo-500/10 to-transparent",
    order: 6
  },
  emotional: { 
    title: "Emotional Landscape", 
    icon: <Heart className="h-4 w-4" />, 
    gradient: "from-rose-500/10 to-transparent",
    order: 7
  },
  general: { 
    title: "Deeper Insights", 
    icon: <User className="h-4 w-4" />, 
    gradient: "from-slate-500/10 to-transparent",
    order: 99
  },
};

// Enneagram-specific section metadata
const ENNEAGRAM_SECTION_META: Record<string, { title: string; icon: React.ReactNode; gradient: string; order: number }> = {
  ...BASE_SECTION_META,
  innerWorld: { 
    title: "The Inner Landscape", 
    icon: <Brain className="h-4 w-4" />, 
    gradient: "from-purple-500/10 to-transparent",
    order: 1
  },
  bodyInstincts: { 
    title: "Body & Instincts", 
    icon: <Activity className="h-4 w-4" />, 
    gradient: "from-red-500/10 to-transparent",
    order: 2
  },
  identity: { 
    title: "Identity & Self-Image", 
    icon: <User className="h-4 w-4" />, 
    gradient: "from-amber-500/10 to-transparent",
    order: 3
  },
  emotional: { 
    title: "Emotional Patterns", 
    icon: <Heart className="h-4 w-4" />, 
    gradient: "from-rose-500/10 to-transparent",
    order: 4
  },
  development: { 
    title: "Origins & Development", 
    icon: <TrendingUp className="h-4 w-4" />, 
    gradient: "from-green-500/10 to-transparent",
    order: 5
  },
  integration: { 
    title: "Growth & Integration", 
    icon: <GitBranch className="h-4 w-4" />, 
    gradient: "from-teal-500/10 to-transparent",
    order: 6
  },
  relationships: { 
    title: "In Relationships", 
    icon: <Heart className="h-4 w-4" />, 
    gradient: "from-pink-500/10 to-transparent",
    order: 7
  },
  spiritual: { 
    title: "The Spiritual Path", 
    icon: <Sparkles className="h-4 w-4" />, 
    gradient: "from-indigo-500/10 to-transparent",
    order: 8
  },
};

// MBTI-specific section metadata
const MBTI_SECTION_META: Record<string, { title: string; icon: React.ReactNode; gradient: string; order: number }> = {
  ...BASE_SECTION_META,
  cognitiveStack: { 
    title: "Cognitive Functions", 
    icon: <Brain className="h-4 w-4" />, 
    gradient: "from-purple-500/10 to-transparent",
    order: 1
  },
  perceiving: { 
    title: "How You Perceive", 
    icon: <Compass className="h-4 w-4" />, 
    gradient: "from-blue-500/10 to-transparent",
    order: 2
  },
  judging: { 
    title: "How You Decide", 
    icon: <Target className="h-4 w-4" />, 
    gradient: "from-amber-500/10 to-transparent",
    order: 3
  },
  innerWorld: { 
    title: "Your Inner World", 
    icon: <Shield className="h-4 w-4" />, 
    gradient: "from-indigo-500/10 to-transparent",
    order: 4
  },
  outerWorld: { 
    title: "Engaging the World", 
    icon: <Flame className="h-4 w-4" />, 
    gradient: "from-orange-500/10 to-transparent",
    order: 5
  },
  development: { 
    title: "Development & Growth", 
    icon: <TrendingUp className="h-4 w-4" />, 
    gradient: "from-green-500/10 to-transparent",
    order: 6
  },
  communication: { 
    title: "Communication Style", 
    icon: <User className="h-4 w-4" />, 
    gradient: "from-pink-500/10 to-transparent",
    order: 7
  },
};

function getSectionMetaForFramework(framework: Framework): Record<string, { title: string; icon: React.ReactNode; gradient: string; order: number }> {
  switch (framework) {
    case "enneagram":
      return ENNEAGRAM_SECTION_META;
    case "mbti":
      return MBTI_SECTION_META;
    default:
      return BASE_SECTION_META;
  }
}

function groupParagraphsIntoSections(paragraphs: string[], typeName: string, framework: Framework): {
  intro: string[];
  sections: DescriptionSection[];
} {
  if (paragraphs.length <= 3) {
    return { intro: paragraphs, sections: [] };
  }

  // First 2 paragraphs are always intro
  const intro = paragraphs.slice(0, 2);
  const remaining = paragraphs.slice(2);

  // Group remaining paragraphs by detected topic
  const grouped: Record<string, string[]> = {};
  
  for (const para of remaining) {
    const section = detectSection(para, framework);
    if (!grouped[section]) {
      grouped[section] = [];
    }
    grouped[section].push(para);
  }

  // Get framework-specific section metadata
  const sectionMeta = getSectionMetaForFramework(framework);

  // Build sections array
  const sections: DescriptionSection[] = [];
  
  for (const [sectionId, paras] of Object.entries(grouped)) {
    if (paras.length > 0) {
      const meta = sectionMeta[sectionId] || sectionMeta.general;
      sections.push({
        id: sectionId,
        title: meta.title,
        icon: meta.icon,
        paragraphs: paras,
        gradient: meta.gradient,
      });
    }
  }

  // Sort by order
  sections.sort((a, b) => {
    const orderA = sectionMeta[a.id]?.order ?? 99;
    const orderB = sectionMeta[b.id]?.order ?? 99;
    return orderA - orderB;
  });

  return { intro, sections };
}

function CollapsibleSection({ section, defaultOpen = false }: { section: DescriptionSection; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn(
      "rounded-xl border border-border/50 overflow-hidden transition-all duration-200",
      isOpen ? "bg-gradient-to-br " + section.gradient : "bg-card/50 hover:bg-card/80"
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
            isOpen ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}>
            {section.icon}
          </div>
          <h3 className="font-semibold text-base">{section.title}</h3>
        </div>
        <ChevronDown 
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 space-y-4">
              {section.paragraphs.map((para, idx) => (
                <MarkdownText 
                  key={idx} 
                  variant="full" 
                  className="text-[15px] leading-relaxed text-muted-foreground"
                >
                  {para}
                </MarkdownText>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SectionedDescription({ paragraphs, typeName, className, framework = "prism" }: SectionedDescriptionProps) {
  const { intro, sections } = useMemo(
    () => groupParagraphsIntoSections(paragraphs, typeName, framework),
    [paragraphs, typeName, framework]
  );

  // If 3 or fewer paragraphs, just render normally
  if (sections.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {paragraphs.map((para, idx) => (
          <MarkdownText key={idx} variant="full" className="text-lg">
            {para}
          </MarkdownText>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Intro paragraphs - always visible */}
      <div className="space-y-4">
        {intro.map((para, idx) => (
          <MarkdownText key={idx} variant="full" className="text-lg leading-relaxed">
            {para}
          </MarkdownText>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Explore Deeper
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Collapsible sections */}
      <div className="space-y-3">
        {sections.map((section, idx) => (
          <CollapsibleSection 
            key={section.id} 
            section={section} 
            defaultOpen={idx === 0} // First section open by default
          />
        ))}
      </div>
    </div>
  );
}

