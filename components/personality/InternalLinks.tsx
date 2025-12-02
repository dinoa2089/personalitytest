"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Sparkles, Users, Brain } from "lucide-react";

interface RelatedLink {
  href: string;
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface InternalLinksProps {
  currentType?: string;
  currentFramework?: "prism" | "mbti" | "enneagram";
  variant?: "sidebar" | "footer" | "inline";
}

// Strategic internal links for SEO
const assessmentLinks: RelatedLink[] = [
  {
    href: "/assessment/intro",
    title: "Take the Free Assessment",
    description: "Discover your personality type in just 5 minutes",
    badge: "Free",
    icon: <Sparkles className="h-5 w-5" />
  },
  {
    href: "/science",
    title: "Our Scientific Approach",
    description: "Learn about the HEXACO+ model and our methodology",
    icon: <Brain className="h-5 w-5" />
  },
];

const blogLinks: RelatedLink[] = [
  {
    href: "/blog/why-most-personality-tests-fall-short",
    title: "Why Most Personality Tests Fall Short",
    description: "The science behind accurate personality assessment",
    icon: <BookOpen className="h-5 w-5" />
  },
];

// Cross-framework links
const frameworkLinks = {
  prism: [
    { href: "/type/mbti/intj", title: "Compare with INTJ", framework: "MBTI" },
    { href: "/type/enneagram/5", title: "Compare with Type 5", framework: "Enneagram" },
  ],
  mbti: [
    { href: "/type/innovator", title: "See PRISM-7 Equivalent", framework: "PRISM-7" },
    { href: "/type/enneagram/7", title: "Compare with Enneagram", framework: "Enneagram" },
  ],
  enneagram: [
    { href: "/type/architect", title: "See PRISM-7 Equivalent", framework: "PRISM-7" },
    { href: "/type/mbti/intp", title: "Compare with MBTI", framework: "MBTI" },
  ],
};

// Related type suggestions based on current type
const relatedTypes: Record<string, string[]> = {
  innovator: ["architect", "catalyst", "explorer"],
  architect: ["innovator", "analyst", "visionary"],
  catalyst: ["innovator", "connector", "explorer"],
  strategist: ["guardian", "achiever", "analyst"],
  connector: ["catalyst", "guardian", "harmonizer"],
  guardian: ["strategist", "connector", "stabilizer"],
  explorer: ["innovator", "catalyst", "achiever"],
  stabilizer: ["guardian", "harmonizer", "strategist"],
  visionary: ["architect", "innovator", "achiever"],
  harmonizer: ["connector", "guardian", "stabilizer"],
  achiever: ["strategist", "visionary", "explorer"],
  analyst: ["architect", "strategist", "visionary"],
};

export function InternalLinks({ currentType, currentFramework = "prism", variant = "sidebar" }: InternalLinksProps) {
  const relatedTypeList = currentType ? relatedTypes[currentType.toLowerCase()] || [] : [];

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-muted-foreground">Explore:</span>
        <Link href="/assessment/intro" className="text-primary hover:underline">
          Take Assessment
        </Link>
        <span className="text-muted-foreground">•</span>
        <Link href="/science" className="text-primary hover:underline">
          Our Science
        </Link>
        <span className="text-muted-foreground">•</span>
        <Link href="/blog" className="text-primary hover:underline">
          Blog
        </Link>
        {relatedTypeList.length > 0 && (
          <>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Related:</span>
            {relatedTypeList.slice(0, 2).map((type, i) => (
              <span key={type}>
                <Link href={`/type/${type}`} className="text-primary hover:underline capitalize">
                  {type}
                </Link>
                {i < 1 && <span className="text-muted-foreground">, </span>}
              </span>
            ))}
          </>
        )}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <Card className="rounded-xl border border-border/50 bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Continue Exploring
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {assessmentLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="text-primary mt-0.5">{link.icon}</div>
                <div>
                  <div className="font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                    {link.title}
                    {link.badge && (
                      <Badge variant="secondary" className="text-xs">{link.badge}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
              </Link>
            ))}
            {blogLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="text-primary mt-0.5">{link.icon}</div>
                <div>
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {link.title}
                  </div>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
          
          {relatedTypeList.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Related personality types:</p>
              <div className="flex flex-wrap gap-2">
                {relatedTypeList.map((type) => (
                  <Link key={type} href={`/type/${type}`}>
                    <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer capitalize">
                      {type}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Sidebar variant
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4">
          <Link 
            href="/assessment/intro"
            className="flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold group-hover:text-primary transition-colors">
                Take the Assessment
              </div>
              <p className="text-sm text-muted-foreground">Free • 5 minutes</p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardContent>
      </Card>

      {/* Related Types */}
      {relatedTypeList.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-3">Related Types</h4>
          <div className="space-y-2">
            {relatedTypeList.map((type) => (
              <Link 
                key={type} 
                href={`/type/${type}`}
                className="block p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="capitalize font-medium">{type}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Cross-Framework */}
      <div>
        <h4 className="font-semibold text-sm mb-3">Compare Frameworks</h4>
        <div className="space-y-2">
          {frameworkLinks[currentFramework]?.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-sm">{link.title}</span>
              <Badge variant="outline" className="text-xs">{link.framework}</Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Learn More */}
      <div>
        <h4 className="font-semibold text-sm mb-3">Learn More</h4>
        <div className="space-y-2">
          <Link 
            href="/science"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
          >
            <Brain className="h-4 w-4 text-muted-foreground" />
            Our Scientific Approach
          </Link>
          <Link 
            href="/blog"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
          >
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            Personality Blog
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Contextual link suggestions for embedding within content
 */
export function ContextualLinks({ context }: { context: "assessment" | "science" | "career" | "relationships" }) {
  const links: Record<string, RelatedLink[]> = {
    assessment: [
      { href: "/assessment/intro", title: "Take the free assessment", description: "" },
      { href: "/science", title: "Learn about our methodology", description: "" },
    ],
    science: [
      { href: "/science", title: "Explore the HEXACO+ model", description: "" },
      { href: "/blog/why-most-personality-tests-fall-short", title: "Why accuracy matters", description: "" },
    ],
    career: [
      { href: "/assessment/intro", title: "Discover your career matches", description: "" },
      { href: "/pricing", title: "Get detailed career insights", description: "" },
    ],
    relationships: [
      { href: "/assessment/intro", title: "Understand your relationship style", description: "" },
      { href: "/compare", title: "Compare with a partner", description: "" },
    ],
  };

  return (
    <div className="my-4 p-4 rounded-lg bg-muted/50 border border-border/50">
      <p className="text-sm text-muted-foreground mb-2">Related:</p>
      <div className="flex flex-wrap gap-3">
        {links[context]?.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            className="text-sm text-primary hover:underline"
          >
            {link.title} →
          </Link>
        ))}
      </div>
    </div>
  );
}

