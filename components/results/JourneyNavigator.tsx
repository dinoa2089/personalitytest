"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  Sparkles,
  Share2,
  Mail,
  Compass
} from "lucide-react";
import type { Archetype } from "@/lib/archetypes";

interface JourneyNavigatorProps {
  archetype: Archetype;
  sessionId: string;
}

export function JourneyNavigator({ archetype, sessionId }: JourneyNavigatorProps) {
  const journeySteps = [
    {
      id: "explore",
      icon: BookOpen,
      title: "Explore Your Type",
      description: "Deep dive into relationships, careers, and growth",
      href: `/type/${archetype.id}`,
      color: "from-violet-500 to-fuchsia-500",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
      textColor: "text-violet-300",
      badge: "Recommended",
      badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    },
    {
      id: "compare",
      icon: Users,
      title: "Compare with Someone",
      description: "See your compatibility with friends or partners",
      href: `/compare?session=${sessionId}`,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      textColor: "text-pink-300",
      badge: "Viral",
      badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    },
    {
      id: "share",
      icon: Share2,
      title: "Share Your Results",
      description: "Show off your personality profile on social",
      href: `#share`,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      textColor: "text-cyan-300",
    },
    {
      id: "premium",
      icon: Sparkles,
      title: "Unlock Full Analysis",
      description: "15+ careers, dark triad, 30-day growth plan",
      href: "/pricing",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      textColor: "text-amber-300",
      badge: "Premium",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85 }}
    >
      <Card className="rounded-2xl border-2 border-dashed border-zinc-700/50 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
              <Compass className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">What's Next?</h3>
              <p className="text-sm text-zinc-400">Continue your personality journey</p>
            </div>
          </div>

          {/* Journey Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {journeySteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.05 }}
              >
                <Link href={step.href} className="block group">
                  <div className={`relative p-4 rounded-xl border ${step.borderColor} ${step.bgColor} hover:bg-opacity-20 transition-all duration-200 hover:scale-[1.02]`}>
                    {/* Badge */}
                    {step.badge && (
                      <Badge className={`absolute -top-2 -right-2 text-xs ${step.badgeColor}`}>
                        {step.badge}
                      </Badge>
                    )}

                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${step.color} flex-shrink-0`}>
                        <step.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold ${step.textColor} group-hover:text-white transition-colors`}>
                            {step.title}
                          </h4>
                          <ArrowRight className={`h-4 w-4 ${step.textColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions Footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Mail className="h-3.5 w-3.5" />
              <span>Get weekly growth tips</span>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              <Link href={`/referrals?session=${sessionId}`}>
                Earn free premium
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
