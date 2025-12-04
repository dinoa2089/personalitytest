"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CognitiveFunction {
  code: string;
  name: string;
  description: string;
}

interface CognitiveFunctionStackProps {
  mbtiType: string;
  dominant: CognitiveFunction;
  auxiliary: CognitiveFunction;
  tertiary: CognitiveFunction;
  inferior: CognitiveFunction;
  showTitle?: boolean;
  className?: string;
  variant?: "vertical" | "horizontal";
}

const functionColors: Record<string, { bg: string; border: string; text: string }> = {
  // Introverted functions
  Ni: { bg: "bg-purple-500/20", border: "border-purple-500/50", text: "text-purple-600" },
  Si: { bg: "bg-blue-500/20", border: "border-blue-500/50", text: "text-blue-600" },
  Ti: { bg: "bg-cyan-500/20", border: "border-cyan-500/50", text: "text-cyan-600" },
  Fi: { bg: "bg-pink-500/20", border: "border-pink-500/50", text: "text-pink-600" },
  // Extraverted functions
  Ne: { bg: "bg-amber-500/20", border: "border-amber-500/50", text: "text-amber-600" },
  Se: { bg: "bg-orange-500/20", border: "border-orange-500/50", text: "text-orange-600" },
  Te: { bg: "bg-green-500/20", border: "border-green-500/50", text: "text-green-600" },
  Fe: { bg: "bg-rose-500/20", border: "border-rose-500/50", text: "text-rose-600" },
};

const getCodeFromName = (name: string): string => {
  // Extract 2-letter code from full name like "Introverted Intuition (Ni)"
  const match = name.match(/\((\w{2})\)/);
  return match ? match[1] : name.slice(0, 2);
};

export function CognitiveFunctionStack({
  mbtiType,
  dominant,
  auxiliary,
  tertiary,
  inferior,
  showTitle = true,
  className = "",
  variant = "vertical",
}: CognitiveFunctionStackProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  const functions = [
    { ...dominant, position: "Dominant", strength: 100 },
    { ...auxiliary, position: "Auxiliary", strength: 75 },
    { ...tertiary, position: "Tertiary", strength: 50 },
    { ...inferior, position: "Inferior", strength: 25 },
  ];

  const content = (
    <div ref={ref} className={className}>
      <div className={`${variant === "horizontal" ? "flex flex-wrap gap-3" : "space-y-3"}`}>
        {functions.map((func, index) => {
          const code = getCodeFromName(func.name);
          const colors = functionColors[code] || functionColors.Ni;
          
          return (
            <motion.div
              key={func.position}
              initial={{ opacity: 0, x: variant === "horizontal" ? 0 : -20, y: variant === "horizontal" ? 20 : 0 }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.4 }}
              className={`${variant === "horizontal" ? "flex-1 min-w-[140px]" : ""}`}
            >
              <div className={`relative rounded-xl border-2 ${colors.border} ${colors.bg} p-4 overflow-hidden`}>
                {/* Strength indicator bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-current opacity-30"
                  style={{ color: colors.text.replace("text-", "").replace("-600", "") }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${func.strength}%` } : {}}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                />
                
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className={`${colors.text} ${colors.border} text-xs`}>
                    {func.position}
                  </Badge>
                  <span className={`text-lg font-bold ${colors.text}`}>{code}</span>
                </div>
                
                <p className="text-sm font-medium text-foreground mb-1">
                  {func.name.replace(/\s*\(\w{2}\)/, "")}
                </p>
                
                {variant === "vertical" && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {func.description.slice(0, 100)}...
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Visual stack representation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="mt-4 flex justify-center"
      >
        <div className="flex items-end gap-1">
          {functions.map((func, index) => {
            const code = getCodeFromName(func.name);
            const colors = functionColors[code] || functionColors.Ni;
            const height = 80 - index * 15;
            
            return (
              <motion.div
                key={func.position}
                className={`w-12 rounded-t ${colors.bg} border ${colors.border} flex items-end justify-center pb-1`}
                style={{ height }}
                initial={{ height: 0 }}
                animate={isInView ? { height } : {}}
                transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
              >
                <span className={`text-xs font-bold ${colors.text}`}>{code}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.3 }}
        className="text-xs text-center text-muted-foreground mt-2"
      >
        {mbtiType} cognitive function stack (strongest → weakest)
      </motion.p>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{mbtiType} Function Stack</CardTitle>
          <CardDescription className="text-xs">
            How {mbtiType}s process information and make decisions
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default CognitiveFunctionStack;




