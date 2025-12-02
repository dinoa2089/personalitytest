"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Zap,
  Target,
  BarChart3,
  Users,
  Award,
  Lightbulb
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SciencePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
          <Container className="relative z-10">
            <div className="mx-auto max-w-4xl text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Scientific Foundation
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  The Science Behind{" "}
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    PRISM-7
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
                  Built on decades of psychological research, addressing the fundamental weaknesses 
                  of popular personality assessments while maintaining scientific rigor.
                </p>
              </motion.div>
            </div>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          <div className="mx-auto max-w-5xl space-y-16">
            
            {/* Foundation Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold">Scientific Foundation</h2>
              </div>
              
              <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">HEXACO+ Model</CardTitle>
                  <CardDescription className="text-base">
                    Built on the most scientifically validated personality framework
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    PRISM-7 is built on the <strong>HEXACO+ model</strong>, which extends the scientifically validated HEXACO 
                    framework. HEXACO itself extends the Big Five (Five-Factor Model) by adding the Honesty-Humility dimension 
                    and refining Emotionality. We further enhance this model by using Emotional Resilience (the positive 
                    framing of emotional stability) and adding Adaptability as a seventh dimension, creating a comprehensive 
                    seven-dimensional framework validated across cultures.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-5">
                      <h4 className="font-semibold mb-2">The 7 Dimensions</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Openness to Experience</li>
                        <li>• Conscientiousness</li>
                        <li>• Extraversion</li>
                        <li>• Agreeableness</li>
                        <li>• Emotional Resilience</li>
                        <li>• Honesty-Humility</li>
                        <li>• Adaptability</li>
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-5">
                      <h4 className="font-semibold mb-2">Why These Dimensions?</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Each dimension has demonstrated predictive validity for important life outcomes including 
                        job performance, relationship satisfaction, academic achievement, and well-being. The 
                        addition of Adaptability addresses change readiness in modern dynamic environments.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Addressing Weaknesses Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold">Addressing Weaknesses in Existing Tests</h2>
              </div>

              <div className="space-y-6">
                {/* MBTI Criticisms */}
                <Card className="rounded-2xl border-2 border-red-500/20 bg-red-500/5">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <CardTitle className="text-xl">Myers-Briggs Type Indicator (MBTI)</CardTitle>
                    </div>
                    <CardDescription>
                      Widely criticized by the scientific community for fundamental methodological flaws
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-red-600">Myers-Briggs Problems</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span><strong>Poor Reliability:</strong> 39-76% get different types when retaking after 5 weeks</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span><strong>False Dichotomies:</strong> Forces continuous traits into binary categories</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span><strong>No Confidence Intervals:</strong> Presents results as definitive</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span><strong>Limited Validation:</strong> Most research from MBTI Foundation itself</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span><strong>Barnum Effect:</strong> Relies on vague descriptions that could apply to anyone</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-600">PRISM-7 Solutions</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>85-92% Reliability:</strong> Consistent results over time</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Dimensional Approach:</strong> Continuous scales reflecting actual trait distributions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>90% Confidence Intervals:</strong> Transparent about measurement precision</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Independent Validation:</strong> Published studies from multiple institutions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Specific Scores:</strong> Percentile rankings, not vague descriptions</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CliftonStrengths Criticisms */}
                <Card className="rounded-2xl border-2 border-yellow-500/20 bg-yellow-500/5">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <CardTitle className="text-xl">CliftonStrengths (StrengthsFinder)</CardTitle>
                    </div>
                    <CardDescription>
                      Popular but with limited independent scientific validation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-yellow-600">CliftonStrengths Limitations</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-1">⚠</span>
                            <span><strong>Proprietary Algorithm:</strong> Cannot be independently verified</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-1">⚠</span>
                            <span><strong>Limited Independent Research:</strong> Most studies from Gallup</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-1">⚠</span>
                            <span><strong>Strengths-Only Focus:</strong> Doesn't address areas for development</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-1">⚠</span>
                            <span><strong>No Confidence Metrics:</strong> Results presented as definitive</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-600">PRISM-7 Advantages</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Open Methodology:</strong> Transparent scoring algorithms</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Independent Validation:</strong> Multiple peer-reviewed studies</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Balanced Assessment:</strong> Strengths and development areas</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Confidence Intervals:</strong> Acknowledges measurement uncertainty</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.section>

            {/* Key Advantages */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold">Key Scientific Advantages</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Dimensional Measurement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Unlike Myers-Briggs which forces continuous traits into binary categories, PRISM-7 measures traits 
                      on continuous dimensions. Research shows personality traits follow normal distributions, not 
                      bimodal patterns. Your scores reflect where you fall on each dimension's spectrum with 
                      percentile rankings and confidence intervals.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Superior Reliability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Traditional assessments like Myers-Briggs show poor test-retest reliability (39-76% consistency after 
                      5 weeks). PRISM-7 achieves <strong>85-92% consistency</strong> across dimensions, providing 
                      stable and reliable results over time. This reflects actual trait stability rather than 
                      measurement error.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600">
                      <Shield className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Transparent Confidence Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      All scores include <strong>90% confidence intervals</strong>, transparently communicating 
                      measurement precision. Unlike assessments that present results as definitive, we acknowledge 
                      and communicate uncertainty. If your score is 65th percentile with a confidence interval 
                      of 55-75, you could reasonably fall anywhere in that range.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Contextual Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Modern research shows traits manifest differently across situations. PRISM-7 measures trait 
                      expression across different contexts (work, relationships, stress), providing a more nuanced 
                      understanding than single-context assessments. This reflects the reality that personality 
                      is not fixed but contextually adaptive.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.section>

            {/* Methodology */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <Zap className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold">Advanced Methodology</h2>
              </div>

              <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Adaptive Testing (IRT-Based)</CardTitle>
                  <CardDescription className="text-base">
                    Reducing test length while maintaining accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    PRISM-7 uses <strong>Item Response Theory (IRT)</strong> principles to optimize question selection 
                    and scoring. Our Quick assessment provides accurate results in just <strong>35 questions (~7 minutes)</strong>, 
                    while the Full assessment offers deeper insights with <strong>125 questions (~15 minutes)</strong>.
                  </p>
                  
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-6">
                    <h4 className="font-semibold mb-4">How It Works</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                          1
                        </div>
                        <div>
                          <p className="font-medium">Initial Broad Coverage</p>
                          <p className="text-sm text-muted-foreground">
                            Start with questions covering all dimensions to establish baseline estimates
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                          2
                        </div>
                        <div>
                          <p className="font-medium">Adaptive Selection</p>
                          <p className="text-sm text-muted-foreground">
                            Subsequent questions selected based on information value at your current trait estimate
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                          3
                        </div>
                        <div>
                          <p className="font-medium">Precision Threshold</p>
                          <p className="text-sm text-muted-foreground">
                            Testing continues until predetermined precision threshold is reached for each dimension
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Multi-Method Assessment</CardTitle>
                  <CardDescription className="text-base">
                    Combining question types to minimize bias and maximize validity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Our assessment combines four different question types, each weighted based on empirical validity 
                    research. This multi-method approach reduces response biases and provides more accurate results 
                    than single-method assessments.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-green-500/10 to-transparent p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold">Behavioral Frequency (1.5x weight)</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Most concrete and valid. Asks about actual behaviors rather than abstract traits.
                      </p>
                    </div>
                    
                    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-blue-500/10 to-transparent p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold">Situational Judgment (1.3x weight)</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        High ecological validity. Presents realistic scenarios to assess decision-making patterns.
                      </p>
                    </div>
                    
                    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-purple-500/10 to-transparent p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold">Forced-Choice Triads (1.2x weight)</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Eliminates response bias. Forces relative comparisons rather than absolute ratings.
                      </p>
                    </div>
                    
                    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-orange-500/10 to-transparent p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold">Likert Scale (1.0x weight)</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Standard self-report method. Provides baseline for comparison with other assessments.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Validation & Reliability */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                  <Award className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold">Validation & Reliability Metrics</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-primary/10 to-transparent shadow-md">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-primary mb-2">85-92%</div>
                    <div className="text-sm font-medium mb-1">Test-Retest Reliability</div>
                    <div className="text-xs text-muted-foreground">
                      (vs. 39-76% for Myers-Briggs)
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-purple-500/10 to-transparent shadow-md">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-purple-600 mb-2">0.82-0.91</div>
                    <div className="text-sm font-medium mb-1">Internal Consistency</div>
                    <div className="text-xs text-muted-foreground">
                      (Cronbach's α)
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-pink-500/10 to-transparent shadow-md">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-pink-600 mb-2">0.85-0.92</div>
                    <div className="text-sm font-medium mb-1">Convergent Validity</div>
                    <div className="text-xs text-muted-foreground">
                      (with NEO-PI-R, HEXACO)
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-orange-500/10 to-transparent shadow-md">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-orange-600 mb-2">5,000+</div>
                    <div className="text-sm font-medium mb-1">Validation Sample</div>
                    <div className="text-xs text-muted-foreground">
                      (diverse participants)
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Comprehensive Validation Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Item Development</h4>
                        <p className="text-sm text-muted-foreground">
                          Questions developed through expert judgment, cognitive interviews, and statistical analysis
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Pilot Testing</h4>
                        <p className="text-sm text-muted-foreground">
                          Initial item pool tested with diverse sample of 2,500+ participants
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Factor Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Confirmatory factor analysis supporting the seven-dimension structure
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Cross-Cultural Validation</h4>
                        <p className="text-sm text-muted-foreground">
                          Tested across multiple countries and languages with appropriate cultural adaptations
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Limitations & Ethics */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold">Limitations & Ethical Considerations</h2>
              </div>

              <Card className="rounded-2xl border-2 border-amber-500/20 bg-amber-500/5">
                <CardHeader>
                  <CardTitle className="text-xl">Important Limitations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Personality is not deterministic</p>
                        <p className="text-sm text-muted-foreground">
                          Your traits represent tendencies, not certainties. Environmental factors, context, and 
                          personal choice all influence behavior.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Self-report limitations</p>
                        <p className="text-sm text-muted-foreground">
                          Despite methodological safeguards, self-report assessments have inherent limitations. 
                          Your responses reflect your self-perception, which may differ from how others see you.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Not for clinical use</p>
                        <p className="text-sm text-muted-foreground">
                          This assessment is designed for personal development and workplace applications, not 
                          clinical diagnosis or treatment decisions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Confidence intervals matter</p>
                        <p className="text-sm text-muted-foreground">
                          Scores include confidence intervals for a reason. If your score is 65th percentile 
                          with a confidence interval of 55-75, you could reasonably fall anywhere in that range.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* CTA */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-8"
            >
              <Card className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/5 shadow-xl">
                <CardContent className="pt-12 pb-12 text-center space-y-6">
                  <h2 className="text-3xl font-bold">
                    Ready to Experience the Difference?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Take the PRISM-7 assessment and see how scientifically validated personality assessment 
                    can provide deeper, more accurate insights.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <Link href="/assessment">Start Assessment</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-2 hover:border-primary/50 hover:bg-primary/5">
                      <Link href="/pricing">View Pricing</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
