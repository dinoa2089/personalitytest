"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, User, Share2, BookOpen } from "lucide-react";
import Link from "next/link";

export default function WhyMostPersonalityTestsFallShortPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-yellow-500/5" />
          <Container className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl"
            >
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
              
              <Badge className="mb-4 bg-red-500/10 text-red-600 border-red-500/20">
                Scientific Analysis
              </Badge>
              
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
                Why Most Personality Tests Fall Short: A Scientific Critique
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                An in-depth look at the fundamental flaws in popular personality assessments 
                and why the scientific community has largely moved beyond them.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Dr. Sarah Mitchell, PhD</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>November 12, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>12 min read</span>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Article Content */}
        <Container className="py-12 md:py-16">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-3xl prose prose-lg dark:prose-invert"
          >
            <p className="lead text-xl text-muted-foreground">
              Every year, millions of people take personality tests hoping to gain insight into 
              who they are. From corporate team-building exercises to dating app profiles, these 
              assessments have become ubiquitous. But how many of these tests actually measure 
              what they claim to measure? The answer, according to decades of psychological 
              research, is surprisingly few.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">The Myers-Briggs Problem</h2>
            
            <p>
              The Myers-Briggs Type Indicator (MBTI) is perhaps the most famous personality test 
              in the world. Over 2 million people take it annually, and it generates an estimated 
              $20 million per year for the company that owns it. Fortune 500 companies use it for 
              hiring decisions. People identify strongly with their four-letter types.
            </p>
            
            <p>
              Yet the scientific community has been skeptical of the MBTI for decades. Here's why:
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">1. The Reliability Problem</h3>
            
            <p>
              A reliable test should give you the same result when you take it multiple times. 
              But research shows that <strong>39-76% of people get a different MBTI type</strong> when 
              they retake the test after just five weeks. This is a fundamental problem—if your 
              personality type can change in a month, what exactly is the test measuring?
            </p>
            
            <p>
              A 1991 study by the National Research Council concluded that "there is not sufficient, 
              well-designed research to justify the use of MBTI in career counseling programs." 
              More recent meta-analyses have confirmed these concerns.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">2. The False Dichotomy Problem</h3>
            
            <p>
              The MBTI forces people into one of two categories for each dimension: you're either 
              an Introvert OR an Extravert, a Thinker OR a Feeler. But personality traits don't 
              work this way.
            </p>
            
            <p>
              Decades of research show that personality traits follow a <strong>normal distribution</strong>—most 
              people fall somewhere in the middle, with extreme scores being relatively rare. 
              By forcing a binary classification, the MBTI treats someone who scores 51% toward 
              extraversion identically to someone who scores 99%, while treating them as completely 
              different from someone who scores 49%.
            </p>
            
            <p>
              Imagine if we measured height this way: everyone over 5'7" is "tall" and everyone 
              under is "short." A person who is 5'7.5" would be classified as fundamentally 
              different from someone who is 5'6.5", despite being nearly identical.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">3. The Barnum Effect</h3>
            
            <p>
              Named after the showman P.T. Barnum (who allegedly said "we have something for 
              everyone"), this psychological phenomenon describes our tendency to accept vague, 
              general personality descriptions as uniquely applicable to ourselves.
            </p>
            
            <p>
              MBTI type descriptions are often so broad that most people would agree with them 
              regardless of their actual type. Statements like "you value deep connections with 
              others" or "you prefer to think things through before acting" apply to virtually 
              everyone in some contexts.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">The CliftonStrengths Concerns</h2>
            
            <p>
              CliftonStrengths (formerly StrengthsFinder) has gained massive popularity in 
              corporate settings. While it avoids some of MBTI's problems, it has its own issues:
            </p>
            
            <ul className="space-y-2 my-6">
              <li>
                <strong>Proprietary black box:</strong> The scoring algorithm is not publicly 
                available, making independent verification impossible.
              </li>
              <li>
                <strong>Limited independent research:</strong> Most published studies come from 
                Gallup itself, creating potential conflicts of interest.
              </li>
              <li>
                <strong>Strengths-only focus:</strong> By ignoring areas for development, it 
                provides an incomplete picture that may not serve users well.
              </li>
              <li>
                <strong>No confidence metrics:</strong> Results are presented as definitive, 
                without acknowledging measurement uncertainty.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">What Does Good Personality Science Look Like?</h2>
            
            <p>
              The scientific consensus has largely coalesced around dimensional models of 
              personality, particularly the <strong>Big Five</strong> (also known as the Five-Factor Model) 
              and its extension, the <strong>HEXACO model</strong>.
            </p>
            
            <p>
              These models share several key characteristics that make them scientifically robust:
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">Dimensional Rather Than Categorical</h3>
            
            <p>
              Instead of putting you in a box, dimensional models measure where you fall on a 
              continuous scale. You might score in the 72nd percentile for Extraversion—more 
              extraverted than most people, but not extremely so. This approach reflects how 
              personality actually works.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">High Reliability</h3>
            
            <p>
              Well-constructed Big Five and HEXACO assessments typically show test-retest 
              reliability of 85-92%—far higher than the MBTI. This means your results will be 
              consistent over time, reflecting actual trait stability rather than measurement error.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">Predictive Validity</h3>
            
            <p>
              These models have been shown to predict important life outcomes including job 
              performance, relationship satisfaction, academic achievement, and even health 
              outcomes. The predictions aren't perfect—personality is just one factor among 
              many—but they're statistically significant and practically meaningful.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">Cross-Cultural Validation</h3>
            
            <p>
              The Big Five and HEXACO structures have been replicated across dozens of cultures 
              and languages, suggesting they capture something fundamental about human personality 
              rather than being artifacts of Western psychology.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">The HEXACO Advantage</h2>
            
            <p>
              The HEXACO model, developed by researchers Kibeom Lee and Michael Ashton, extends 
              the Big Five by adding a sixth dimension: <strong>Honesty-Humility</strong>. This dimension 
              captures tendencies toward sincerity, fairness, modesty, and greed-avoidance.
            </p>
            
            <p>
              Research has shown that Honesty-Humility predicts important outcomes that the Big 
              Five misses, including:
            </p>
            
            <ul className="space-y-2 my-6">
              <li>Workplace counterproductive behavior and theft</li>
              <li>Ethical decision-making in business contexts</li>
              <li>Relationship fidelity and commitment</li>
              <li>Susceptibility to manipulation and exploitation</li>
            </ul>
            
            <p>
              The addition of this dimension makes HEXACO particularly valuable for contexts 
              where integrity and ethical behavior matter—which is to say, most contexts.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">What Should You Look For?</h2>
            
            <p>
              If you're considering taking a personality assessment—whether for personal insight, 
              career development, or team building—here are the key features to look for:
            </p>
            
            <ol className="space-y-4 my-6">
              <li>
                <strong>Dimensional scores:</strong> Avoid tests that put you into discrete 
                categories. Look for percentile rankings or continuous scales.
              </li>
              <li>
                <strong>Confidence intervals:</strong> Good assessments acknowledge measurement 
                uncertainty. If a test claims perfect precision, be skeptical.
              </li>
              <li>
                <strong>Published reliability data:</strong> The test should have documented 
                test-retest reliability of at least 80%.
              </li>
              <li>
                <strong>Independent validation:</strong> Look for peer-reviewed research from 
                sources other than the test publisher.
              </li>
              <li>
                <strong>Transparent methodology:</strong> You should be able to understand how 
                your scores are calculated.
              </li>
            </ol>

            <h2 className="text-2xl font-bold mt-12 mb-4">The Bottom Line</h2>
            
            <p>
              Personality assessment can be a valuable tool for self-understanding and development. 
              But not all assessments are created equal. The most popular tests often lack the 
              scientific rigor needed to provide meaningful, accurate results.
            </p>
            
            <p>
              By understanding the limitations of common assessments and the characteristics of 
              scientifically valid alternatives, you can make more informed choices about which 
              tools to trust with something as important as understanding yourself.
            </p>
            
            <p>
              The goal isn't to dismiss personality assessment entirely—it's to demand better. 
              When we settle for pseudoscience dressed up as insight, we miss the opportunity 
              for genuine self-discovery that rigorous personality science can provide.
            </p>

            <div className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border/50">
              <div className="flex items-start gap-4">
                <BookOpen className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Further Reading</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ashton, M. C., & Lee, K. (2007). Empirical, theoretical, and practical advantages of the HEXACO model of personality structure.</li>
                    <li>• Pittenger, D. J. (2005). Cautionary comments regarding the Myers-Briggs Type Indicator. Consulting Psychology Journal.</li>
                    <li>• McCrae, R. R., & Costa, P. T. (1997). Personality trait structure as a human universal. American Psychologist.</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.article>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto max-w-3xl mt-16"
          >
            <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/5 p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Experience Scientifically-Validated Assessment
              </h2>
              <p className="text-muted-foreground mb-6">
                PRISM-7 is built on the HEXACO+ model with dimensional scoring, confidence 
                intervals, and transparent methodology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/assessment">Take the Assessment</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/science">Learn About Our Science</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-auto max-w-3xl mt-12 flex items-center justify-between border-t border-border/50 pt-8"
          >
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Article
            </Button>
          </motion.div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

