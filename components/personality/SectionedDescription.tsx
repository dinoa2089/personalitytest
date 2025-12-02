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
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownText } from "@/components/ui/markdown-text";

interface SectionedDescriptionProps {
  paragraphs: string[];
  typeName: string;
  className?: string;
}

interface DescriptionSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  paragraphs: string[];
  gradient: string;
}

// Keywords to detect what a paragraph is about
const SECTION_KEYWORDS = {
  innerWorld: ["experience", "internal", "processing", "find that you", "likely find", "lived experience", "mental", "brain"],
  development: ["childhood", "develop", "evolution", "grew", "matured", "child", "early in life", "adulthood"],
  flow: ["flow state", "focus", "hyper-focus", "concentration", "deep work", "triggers", "distraction"],
  creativity: ["creativity", "creative", "innovation", "unique contribution", "vision", "imagination"],
  growth: ["growth", "challenge", "edge", "develop", "evolution", "learning", "struggle"],
  daily: ["typical day", "morning", "routine", "daily", "day-to-day", "decision", "facing a difficult"],
  emotional: ["emotional", "feeling", "passion", "care deeply", "love language", "empathy"],
};

function detectSection(paragraph: string): string {
  const lowerPara = paragraph.toLowerCase();
  
  // Check each category
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerPara.includes(keyword.toLowerCase())) {
        return section;
      }
    }
  }
  return "general";
}

function groupParagraphsIntoSections(paragraphs: string[], typeName: string): {
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
    const section = detectSection(para);
    if (!grouped[section]) {
      grouped[section] = [];
    }
    grouped[section].push(para);
  }

  // Define section metadata
  const sectionMeta: Record<string, { title: string; icon: React.ReactNode; gradient: string; order: number }> = {
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
      order: 8
    },
  };

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

export function SectionedDescription({ paragraphs, typeName, className }: SectionedDescriptionProps) {
  const { intro, sections } = useMemo(
    () => groupParagraphsIntoSections(paragraphs, typeName),
    [paragraphs, typeName]
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

