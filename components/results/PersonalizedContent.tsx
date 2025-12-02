"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ArrowRight, 
  ExternalLink,
  Sparkles,
  Lock
} from "lucide-react";
import type { Archetype } from "@/lib/archetypes";
import type { DimensionScore } from "@/types";
import { getPersonalizedContent, type ContentRecommendation } from "@/lib/personalized-content";

interface PersonalizedContentProps {
  archetype: Archetype;
  scores: DimensionScore[];
}

export function PersonalizedContent({ archetype, scores }: PersonalizedContentProps) {
  const recommendations = getPersonalizedContent(archetype, scores);
  
  // Split into free and premium recommendations
  const freeContent = recommendations.filter(r => !r.premium).slice(0, 3);
  const premiumContent = recommendations.filter(r => r.premium).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75 }}
    >
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <BookOpen className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-xl">Your Reading List</CardTitle>
                <CardDescription>
                  Curated content based on your {archetype.name} profile
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
              Personalized
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Free Content */}
          <div className="space-y-3">
            {freeContent.map((item, index) => (
              <ContentCard key={item.href} item={item} index={index} />
            ))}
          </div>

          {/* Premium Content Preview */}
          {premiumContent.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                <span>Unlock with Premium</span>
              </div>
              {premiumContent.map((item, index) => (
                <div
                  key={item.href}
                  className="relative rounded-xl border border-dashed border-border/50 bg-muted/20 p-4 opacity-75"
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconBg} flex-shrink-0 opacity-50`}>
                      <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-muted-foreground">{item.title}</span>
                        <Badge variant="outline" className="text-xs">Premium</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground/60 mt-1">{item.description}</p>
                    </div>
                    <Lock className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View More */}
          <div className="flex items-center justify-between pt-2">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link href={`/type/${archetype.id}`}>
                See all {archetype.name} content
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/pricing">
                <Sparkles className="h-3 w-3" />
                Unlock all content
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ContentCard({ item, index }: { item: ContentRecommendation; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.05 }}
    >
      <Link href={item.href} className="block group">
        <div className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-primary/30 transition-all">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconBg} flex-shrink-0`}>
            <item.icon className={`h-4 w-4 ${item.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                {item.title}
              </span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {item.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
        </div>
      </Link>
    </motion.div>
  );
}

