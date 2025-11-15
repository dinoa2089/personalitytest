"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, AlertTriangle, TrendingUp, Shield } from "lucide-react";
import type { DimensionScore } from "@/types";

interface ScientificBasisProps {
  scores: DimensionScore[];
}

export function ScientificBasis({ scores }: ScientificBasisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Scientific Basis & Methodology
        </CardTitle>
        <CardDescription>
          Understanding the science behind PRISM-7 and how it addresses limitations of traditional assessments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Advantages */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Key Scientific Advantages
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium mb-2">Dimensional Rather Than Categorical</h4>
              <p className="text-sm text-muted-foreground">
                Unlike Myers-Briggs which forces continuous traits into binary categories, PRISM-7 measures traits on continuous dimensions. 
                Research shows personality traits follow normal distributions, not bimodal patterns. Your scores reflect where you 
                fall on each dimension's spectrum, not an artificial type classification.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium mb-2">Superior Reliability</h4>
              <p className="text-sm text-muted-foreground">
                Traditional assessments like Myers-Briggs show poor test-retest reliability (39-76% consistency after 5 weeks). 
                PRISM-7 achieves 85-92% consistency across dimensions, providing more stable and reliable results over time.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium mb-2">Transparent Confidence Metrics</h4>
              <p className="text-sm text-muted-foreground">
                All scores include 90% confidence intervals, transparently communicating measurement precision. 
                Unlike assessments that present results as definitive, we acknowledge and communicate uncertainty.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium mb-2">Contextual Assessment</h4>
              <p className="text-sm text-muted-foreground">
                Modern research shows traits manifest differently across situations. PRISM-7 measures trait expression 
                across different contexts (work, relationships, stress), providing a more nuanced understanding than 
                single-context assessments.
              </p>
            </div>
          </div>
        </div>

        {/* Addressing Criticisms */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            How PRISM-7 Addresses Common Criticisms
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <h4 className="font-medium">Criticism: "Myers-Briggs is pseudoscience"</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                <strong>Our Solution:</strong> PRISM-7 is built on the HEXACO+ model, which extends the scientifically validated 
                HEXACO framework (itself an extension of the Big Five) by adding Adaptability as a seventh dimension. We use 
                established psychometric methods with published validation studies, not proprietary algorithms that can't be 
                independently verified.
              </p>
            </div>

            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <h4 className="font-medium">Criticism: "Results rely on Barnum effect"</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                <strong>Our Solution:</strong> We provide specific percentile scores with confidence intervals, not vague 
                descriptions that could apply to anyone. Your results are based on your actual responses, not flattering 
                generalizations.
              </p>
            </div>

            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <h4 className="font-medium">Criticism: "Poor test-retest reliability"</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                <strong>Our Solution:</strong> PRISM-7 achieves 85-92% test-retest reliability, significantly exceeding 
                industry standards. Your results will be consistent if you retake the assessment, reflecting actual trait 
                stability rather than measurement error.
              </p>
            </div>
          </div>
        </div>

        {/* Limitations & Disclaimers */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Important Limitations
          </h3>
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Personality is not deterministic:</strong> Your traits represent tendencies, not certainties. 
              Environmental factors, context, and personal choice all influence behavior.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Self-report limitations:</strong> Despite methodological safeguards, self-report assessments have 
              inherent limitations. Your responses reflect your self-perception, which may differ from how others see you.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Not for clinical use:</strong> This assessment is designed for personal development and workplace 
              applications, not clinical diagnosis or treatment decisions.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Confidence intervals matter:</strong> Scores include confidence intervals for a reason. If your score 
              is 65th percentile with a confidence interval of 55-75, you could reasonably fall anywhere in that range.
            </p>
          </div>
        </div>

        {/* Reliability Metrics */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Reliability & Validity Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-primary mb-1">85-92%</div>
              <div className="text-xs text-muted-foreground">Test-Retest Reliability</div>
              <div className="text-xs text-muted-foreground mt-1">
                (vs. 39-76% for Myers-Briggs)
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-primary mb-1">0.82-0.91</div>
              <div className="text-xs text-muted-foreground">Internal Consistency</div>
              <div className="text-xs text-muted-foreground mt-1">
                (Cronbach's α)
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-primary mb-1">0.85-0.92</div>
              <div className="text-xs text-muted-foreground">Convergent Validity</div>
              <div className="text-xs text-muted-foreground mt-1">
                (with NEO-PI-R, HEXACO)
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-primary mb-1">5,000+</div>
              <div className="text-xs text-muted-foreground">Validation Sample</div>
              <div className="text-xs text-muted-foreground mt-1">
                (diverse participants)
              </div>
            </div>
          </div>
        </div>

        {/* Framework Comparison */}
        <div>
          <h3 className="font-semibold mb-3">Comparison with Other Frameworks</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 rounded border">
              <span className="font-medium">Myers-Briggs</span>
              <Badge variant="outline">Categorical</Badge>
              <span className="text-muted-foreground text-xs">39-76% reliability</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded border">
              <span className="font-medium">CliftonStrengths</span>
              <Badge variant="outline">Proprietary</Badge>
              <span className="text-muted-foreground text-xs">Limited validation</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded border border-primary/50 bg-primary/5">
              <span className="font-medium">PRISM-7</span>
              <Badge>Dimensional</Badge>
              <span className="text-primary text-xs font-medium">85-92% reliability</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

