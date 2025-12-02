"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownTextProps {
  children: string;
  /**
   * 'full' - Full styling with proper typography for long content
   * 'inline' - Minimal styling for inline text (bold, italic, links only)
   * 'compact' - Tighter spacing for cards and smaller containers
   */
  variant?: "full" | "inline" | "compact";
  className?: string;
}

/**
 * MarkdownText - Reusable component for rendering markdown content with proper SEO structure
 * 
 * Supports:
 * - **bold** and *italic* text
 * - [links](url)
 * - Headers (h1-h6) for SEO
 * - Lists (ordered and unordered)
 * - Blockquotes
 * - Line breaks and paragraphs
 */
export function MarkdownText({
  children,
  variant = "full",
  className,
}: MarkdownTextProps) {
  if (!children) return null;

  const isInline = variant === "inline";
  const isCompact = variant === "compact";

  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headers - properly structured for SEO
          h1: ({ children }) => (
            <h1 className={cn(
              "font-bold text-foreground",
              isCompact ? "text-2xl mt-6 mb-3" : "text-3xl mt-8 mb-4"
            )}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className={cn(
              "font-bold text-foreground",
              isCompact ? "text-xl mt-5 mb-2" : "text-2xl mt-8 mb-4"
            )}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className={cn(
              "font-semibold text-foreground",
              isCompact ? "text-lg mt-4 mb-2" : "text-xl mt-6 mb-3"
            )}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className={cn(
              "font-semibold text-foreground",
              isCompact ? "text-base mt-3 mb-1" : "text-lg mt-4 mb-2"
            )}>{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-semibold text-foreground mt-3 mb-2">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-semibold text-foreground mt-2 mb-1">{children}</h6>
          ),
          // Paragraphs
          p: ({ children }) => {
            if (isInline) {
              return <span className="text-inherit">{children}</span>;
            }
            return (
              <p className={cn(
                "text-muted-foreground leading-relaxed",
                isCompact ? "text-sm mb-3" : "text-base mb-4"
              )}>{children}</p>
            );
          },
          // Text formatting
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          // Lists
          ul: ({ children }) => {
            if (isInline) return <>{children}</>;
            return (
              <ul className={cn(
                "list-disc pl-6 space-y-2",
                isCompact ? "my-3" : "my-4"
              )}>{children}</ul>
            );
          },
          ol: ({ children }) => {
            if (isInline) return <>{children}</>;
            return (
              <ol className={cn(
                "list-decimal pl-6 space-y-2",
                isCompact ? "my-3" : "my-4"
              )}>{children}</ol>
            );
          },
          li: ({ children }) => (
            <li className={cn(
              "text-muted-foreground",
              isCompact ? "text-sm" : "text-base"
            )}>{children}</li>
          ),
          // Blockquotes - great for highlighting key points
          blockquote: ({ children }) => {
            if (isInline) return <>{children}</>;
            return (
              <blockquote className={cn(
                "border-l-4 border-primary/50 bg-muted/30 py-2 px-4 rounded-r-lg italic my-4",
                isCompact ? "text-sm" : "text-base"
              )}>
                {children}
              </blockquote>
            );
          },
          // Links
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          // Code
          code: ({ children, className: codeClassName }) => {
            const isBlock = codeClassName?.includes('language-');
            if (isBlock) {
              return (
                <code className={cn("block bg-muted p-4 rounded-lg text-sm overflow-x-auto my-4", codeClassName)}>
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          },
          // Horizontal rule
          hr: () => (
            <hr className="my-8 border-border" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

/**
 * InlineMarkdown - For rendering markdown inline without block elements
 * Useful for short text like titles, descriptions, or labels with bold/italic
 */
export function InlineMarkdown({ children, className }: { children: string; className?: string }) {
  if (!children) return null;
  return (
    <MarkdownText variant="inline" className={cn("inline", className)}>
      {children}
    </MarkdownText>
  );
}

/**
 * CompactMarkdown - For card content with tighter spacing
 */
export function CompactMarkdown({ children, className }: { children: string; className?: string }) {
  return (
    <MarkdownText variant="compact" className={className}>
      {children}
    </MarkdownText>
  );
}
