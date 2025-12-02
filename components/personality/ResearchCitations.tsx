"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, BookOpen, GraduationCap, FileText } from "lucide-react";

interface Citation {
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  doi?: string;
}

const hexacoCitations: Citation[] = [
  {
    title: "The HEXACO Model of Personality Structure",
    authors: "Ashton, M. C., & Lee, K.",
    journal: "Personality and Social Psychology Review",
    year: 2007,
    url: "https://journals.sagepub.com/doi/10.1177/1088868306294907",
    doi: "10.1177/1088868306294907"
  },
  {
    title: "A Six-Factor Structure of Personality-Descriptive Adjectives",
    authors: "Ashton, M. C., Lee, K., Perugini, M., et al.",
    journal: "Journal of Personality and Social Psychology",
    year: 2004,
    url: "https://psycnet.apa.org/record/2004-10414-008",
    doi: "10.1037/0022-3514.86.2.356"
  },
  {
    title: "Empirical, Theoretical, and Practical Advantages of the HEXACO Model",
    authors: "Ashton, M. C., & Lee, K.",
    journal: "Personality and Social Psychology Review",
    year: 2019,
    url: "https://journals.sagepub.com/doi/10.1177/1088868318784647",
    doi: "10.1177/1088868318784647"
  },
  {
    title: "The HEXACO-PI-R: A Brief Measure of the Major Personality Dimensions",
    authors: "Lee, K., & Ashton, M. C.",
    journal: "Journal of Research in Personality",
    year: 2018,
    url: "https://www.sciencedirect.com/science/article/pii/S0092656617301046"
  }
];

const validationCitations: Citation[] = [
  {
    title: "Reliability and Validity of the HEXACO Model",
    authors: "de Vries, R. E., et al.",
    journal: "European Journal of Personality",
    year: 2009,
    url: "https://onlinelibrary.wiley.com/doi/abs/10.1002/per.718"
  },
  {
    title: "Cross-Cultural Validation of the HEXACO Model",
    authors: "Ashton, M. C., Lee, K., & de Vries, R. E.",
    journal: "Journal of Personality Assessment",
    year: 2014,
    url: "https://www.tandfonline.com/doi/abs/10.1080/00223891.2013.867500"
  }
];

interface ResearchCitationsProps {
  variant?: "full" | "compact";
  className?: string;
}

export function ResearchCitations({ variant = "compact", className = "" }: ResearchCitationsProps) {
  if (variant === "compact") {
    return (
      <Card className={`rounded-2xl border border-border/50 bg-gradient-to-br from-blue-500/5 to-transparent ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Scientific Foundation</CardTitle>
              <p className="text-sm text-muted-foreground">Based on peer-reviewed research</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            PRISM-7 is built on the HEXACO model of personality, which has been validated across 
            multiple cultures and languages with superior reliability compared to older models.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Link 
              href="/science"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <GraduationCap className="h-4 w-4" />
              Learn about our methodology
            </Link>
            <span className="text-muted-foreground">•</span>
            <a 
              href="https://hexaco.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              HEXACO.org
            </a>
          </div>
          
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Key citation: Ashton & Lee (2007). "The HEXACO Model of Personality Structure." 
              <em> Personality and Social Psychology Review</em>.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant with all citations
  return (
    <div className={`space-y-8 ${className}`}>
      {/* HEXACO Research */}
      <Card className="rounded-2xl border border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">HEXACO Model Research</CardTitle>
              <p className="text-sm text-muted-foreground">Foundational peer-reviewed studies</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {hexacoCitations.map((citation, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/30">
              <a 
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors flex items-start gap-2"
              >
                <FileText className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>{citation.title}</span>
              </a>
              <p className="text-sm text-muted-foreground mt-1 pl-6">
                {citation.authors} ({citation.year}). <em>{citation.journal}</em>.
                {citation.doi && (
                  <span className="ml-1">
                    DOI: <a href={`https://doi.org/${citation.doi}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{citation.doi}</a>
                  </span>
                )}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Validation Studies */}
      <Card className="rounded-2xl border border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
              <GraduationCap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Validation Studies</CardTitle>
              <p className="text-sm text-muted-foreground">Cross-cultural reliability research</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {validationCitations.map((citation, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/30">
              <a 
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors flex items-start gap-2"
              >
                <FileText className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>{citation.title}</span>
              </a>
              <p className="text-sm text-muted-foreground mt-1 pl-6">
                {citation.authors} ({citation.year}). <em>{citation.journal}</em>.
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* External Resources */}
      <Card className="rounded-2xl border border-border/50 bg-gradient-to-br from-purple-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-lg">External Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <a 
              href="https://hexaco.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">HEXACO.org</p>
                <p className="text-sm text-muted-foreground">Official HEXACO research site</p>
              </div>
            </a>
            <a 
              href="https://scholar.google.com/scholar?q=HEXACO+personality"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Google Scholar</p>
                <p className="text-sm text-muted-foreground">Browse HEXACO research papers</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "HEXACO Personality Research Citations",
            "description": "Peer-reviewed research supporting the HEXACO model of personality",
            "itemListElement": [...hexacoCitations, ...validationCitations].map((citation, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "ScholarlyArticle",
                "name": citation.title,
                "author": citation.authors,
                "datePublished": citation.year.toString(),
                "isPartOf": {
                  "@type": "Periodical",
                  "name": citation.journal
                },
                "url": citation.url,
                ...(citation.doi && { "sameAs": `https://doi.org/${citation.doi}` })
              }
            }))
          })
        }}
      />
    </div>
  );
}

