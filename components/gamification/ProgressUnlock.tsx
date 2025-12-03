"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Sparkles } from "lucide-react";
import { FeatureGate } from "@/components/premium/FeatureGate";

export interface UnlockableModule {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  unlocked: boolean;
  progress: number; // 0-100
  icon: string;
  benefits: string[];
}

interface ProgressUnlockProps {
  modules: UnlockableModule[];
  onUnlock: (moduleId: string) => void;
  currentProgress: number;
}

export function ProgressUnlock({ modules, onUnlock, currentProgress }: ProgressUnlockProps) {
  return (
    <Card className="border-2 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Unlock More Insights
        </CardTitle>
        <CardDescription>
          You're {Math.round(currentProgress)}% complete. Unlock additional modules to get deeper insights into your personality.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg border p-4 ${
                module.unlocked 
                  ? "border-primary/50 bg-primary/5" 
                  : "border-muted bg-muted/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{module.icon}</span>
                    <h3 className="font-semibold">{module.name}</h3>
                    {module.unlocked ? (
                      <Unlock className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                  <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                    {module.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{module.questionCount} additional questions</span>
                    {!module.unlocked && module.progress > 0 && (
                      <>
                        <span>•</span>
                        <span>{Math.round(module.progress)}% progress</span>
                      </>
                    )}
                  </div>
                </div>
                {!module.unlocked && (
                  <FeatureGate feature={`unlock_${module.id}`} showUpgrade={true}>
                    <Button
                      onClick={() => onUnlock(module.id)}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                    >
                      Unlock
                    </Button>
                  </FeatureGate>
                )}
              </div>
              {!module.unlocked && module.progress > 0 && (
                <div className="mt-3">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${module.progress}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}






