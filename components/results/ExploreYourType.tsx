"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Heart, 
  Briefcase, 
  Users, 
  Sparkles,
  BookOpen,
  TrendingUp
} from "lucide-react";
import type { Archetype } from "@/lib/archetypes";

interface ExploreYourTypeProps {
  archetype: Archetype;
}

export function ExploreYourType({ archetype }: ExploreYourTypeProps) {
  const typeSlug = archetype.id;
  
  // What users will discover on the type page
  const discoveries = [
    {
      icon: Heart,
      title: "Relationship Dynamics",
      description: "Romantic, friendship, and professional patterns",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Briefcase,
      title: "Career Deep Dive",
      description: "8+ career paths with detailed explanations",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Users,
      title: "Famous Examples",
      description: "20+ notable people who share your type",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: TrendingUp,
      title: "Growth Strategies",
      description: "Actionable tips tailored to your personality",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 overflow-hidden">
        <CardContent className="p-0">
          {/* Header Section */}
          <div className="p-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{archetype.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Deep Dive Available
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Free
                  </Badge>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mt-1">
                  Learn Everything About {archetype.name}
                </h3>
              </div>
            </div>
            <p className="text-muted-foreground">
              You've discovered your type — now understand it fully. Explore the complete guide to {archetype.name.replace("The ", "")} personality.
            </p>
          </div>

          {/* What You'll Discover Grid */}
          <div className="p-6 pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
              What You'll Discover
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {discoveries.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bgColor} flex-shrink-0`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <Button asChild size="lg" className="w-full group">
              <Link href={`/type/${typeSlug}`}>
                <span>Explore {archetype.name} In Depth</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Secondary Links */}
            <div className="flex items-center justify-center gap-4 mt-4 text-sm">
              <Link 
                href="/science" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                Our methodology
              </Link>
              <span className="text-border">•</span>
              <Link 
                href="/blog/why-most-personality-tests-fall-short" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                The science behind it
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}




