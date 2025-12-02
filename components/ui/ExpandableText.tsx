"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompactMarkdown } from "@/components/ui/markdown-text";

interface ExpandableTextProps {
  text: string;
  /** Number of sentences to show in preview (default: 3) */
  previewSentences?: number;
  /** Always show full text above this character count (default: 300) */
  expandThreshold?: number;
  /** Additional class names for the container */
  className?: string;
  /** Class names for the text */
  textClassName?: string;
  /** Whether to split text into visual paragraphs at sentence boundaries */
  splitIntoParagraphs?: boolean;
  /** Number of sentences per paragraph when splitting (default: 3) */
  sentencesPerParagraph?: number;
}

function splitIntoSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by space
  // Handles: periods, question marks, exclamation points
  // Preserves abbreviations like "Dr." "Mr." "e.g." etc.
  const sentenceRegex = /(?<=[.!?])\s+(?=[A-Z])/g;
  return text.split(sentenceRegex).filter(s => s.trim().length > 0);
}

export function ExpandableText({
  text,
  previewSentences = 3,
  expandThreshold = 300,
  className,
  textClassName,
  splitIntoParagraphs = true,
  sentencesPerParagraph = 3,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { preview, rest, needsExpansion, paragraphs } = useMemo(() => {
    const sentences = splitIntoSentences(text);
    const shouldExpand = text.length > expandThreshold && sentences.length > previewSentences;
    
    if (!shouldExpand) {
      // No expansion needed - still split into paragraphs for readability
      const paras: string[] = [];
      for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
        paras.push(sentences.slice(i, i + sentencesPerParagraph).join(" "));
      }
      return {
        preview: text,
        rest: "",
        needsExpansion: false,
        paragraphs: paras.length > 1 ? paras : [text],
      };
    }

    const previewText = sentences.slice(0, previewSentences).join(" ");
    const restText = sentences.slice(previewSentences).join(" ");
    
    // Create paragraphs from the full text for expanded view
    const paras: string[] = [];
    for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
      paras.push(sentences.slice(i, i + sentencesPerParagraph).join(" "));
    }

    return {
      preview: previewText,
      rest: restText,
      needsExpansion: true,
      paragraphs: paras,
    };
  }, [text, previewSentences, expandThreshold, sentencesPerParagraph]);

  if (!needsExpansion) {
    // Short text - just render with paragraph splitting for better readability
    return (
      <div className={cn("space-y-3", className)}>
        {splitIntoParagraphs && paragraphs.length > 1 ? (
          paragraphs.map((para, idx) => (
            <div key={idx} className={textClassName}>
              <CompactMarkdown>{para}</CompactMarkdown>
            </div>
          ))
        ) : (
          <div className={textClassName}>
            <CompactMarkdown>{text}</CompactMarkdown>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {splitIntoParagraphs ? (
              paragraphs.map((para, idx) => (
                <div key={idx} className={textClassName}>
                  <CompactMarkdown>{para}</CompactMarkdown>
                </div>
              ))
            ) : (
              <div className={textClassName}>
                <CompactMarkdown>{text}</CompactMarkdown>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={textClassName}>
              <CompactMarkdown>{preview}</CompactMarkdown>
              <span className="text-muted-foreground/60">...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <span>{isExpanded ? "Show less" : "Read more"}</span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isExpanded && "rotate-180"
          )} 
        />
      </button>
    </div>
  );
}

/**
 * A simpler version that just splits long text into readable paragraphs
 * without the expand/collapse functionality
 */
export function FormattedText({
  text,
  className,
  textClassName,
  sentencesPerParagraph = 3,
}: {
  text: string;
  className?: string;
  textClassName?: string;
  sentencesPerParagraph?: number;
}) {
  const paragraphs = useMemo(() => {
    const sentences = splitIntoSentences(text);
    if (sentences.length <= sentencesPerParagraph) {
      return [text];
    }
    
    const paras: string[] = [];
    for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
      paras.push(sentences.slice(i, i + sentencesPerParagraph).join(" "));
    }
    return paras;
  }, [text, sentencesPerParagraph]);

  return (
    <div className={cn("space-y-3", className)}>
      {paragraphs.map((para, idx) => (
        <div key={idx} className={textClassName}>
          <CompactMarkdown>{para}</CompactMarkdown>
        </div>
      ))}
    </div>
  );
}

