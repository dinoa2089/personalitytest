"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  Clock, 
  DollarSign,
  Building2,
  Sparkles,
  BarChart3,
  UserCheck,
  Zap,
  Award,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import { EmployerDashboard } from "@/components/employer/EmployerDashboard";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function ForEmployersPage() {
  const { isLoaded, isSignedIn } = useUser();

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  // If signed in, show the dashboard
  if (isSignedIn) {
    return <EmployerDashboard />;
  }

  // If not signed in, show the landing page
  return <EmployerLandingPage />;
}

function EmployerLandingPage() {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section - Problem Focused */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-rose-600/10 blur-3xl" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Based on HEXACO Personality Research</span>
            </motion.div>

            {/* Main Headline - Problem/Agitation */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Stop Gambling <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-orange-400">$24,000</span> On Every Hire
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-slate-300 mb-4 leading-relaxed"
            >
              That&apos;s what the U.S. Department of Labor says a bad $80K hire <em>actually</em> costs you. Not including the sleepless nights, the team drama, or the 6 months you&apos;ll never get back.
            </motion.p>

            <motion.p 
              variants={fadeInUp}
              className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto"
            >
              PRISM-7 shows you which candidates will actually fit your team—<strong className="text-white">before</strong> you make an offer you&apos;ll regret. 15 minutes. No subscriptions. Science you can trust.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-6 text-lg shadow-lg shadow-violet-500/25"
                asChild
              >
                <Link href="/sign-up">
                  Get Your First Assessment Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-700 bg-slate-900/50 text-white hover:bg-slate-800 px-8 py-6 text-lg"
                asChild
              >
                <Link href="#demo">
                  Watch It In Action
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>EEOC Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>15-Minute Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span>No Subscription Required</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points Section - Problem Math */}
      <section className="py-20 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Think About Your Last Bad Hire.<br />Now Multiply By Every One Before That.
            </h2>
            <p className="text-slate-400 text-lg">
              Here&apos;s the uncomfortable truth: most hiring failures have nothing to do with skills. The candidate interviewed great. Their resume was impressive. So why are they gone in 8 months?
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stat: "30%+",
                title: "Gone. Poof. Vanished.",
                description: "The U.S. Department of Labor's estimate for what a bad hire costs—minimum. For senior roles? Try 50-200% of salary. That's real money you're lighting on fire.",
                icon: DollarSign,
                source: "U.S. Dept. of Labor"
              },
              {
                stat: "89%",
                title: "Fired for Fit, Not Skills",
                description: "Leadership IQ studied 20,000 new hires over 3 years. Nearly 9 in 10 failures had nothing to do with technical ability. They just didn't mesh with the team or the role.",
                icon: Users,
                source: "Leadership IQ Study"
              },
              {
                stat: "Weeks",
                title: "You'll Never Get Back",
                description: "The performance reviews. The coaching sessions. The awkward conversations. The HR meetings. The search for their replacement. Time that should've gone to growing your business.",
                icon: Clock,
                source: ""
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-slate-800 h-full hover:border-violet-500/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="text-4xl font-bold text-red-400 mb-2">{item.stat}</div>
                    <CardTitle className="text-white text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400">{item.description}</p>
                    {item.source && (
                      <p className="text-xs text-slate-500 mt-3 italic">Source: {item.source}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="demo" className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm mb-6">
              <Zap className="w-4 h-4" />
              <span>Here&apos;s What To Do Instead</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Know Who You&apos;re Hiring <em>Before</em> You Extend The Offer
            </h2>
            <p className="text-slate-400 text-lg">
              PRISM-7 uses the HEXACO personality model—the gold standard in academic research—to show you who candidates really are, not just who they appear to be in a 45-minute interview.
            </p>
          </motion.div>

          {/* How It Works Steps */}
          <div className="grid lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                step: "01",
                title: "Drop In Your Job Description",
                description: "Takes 30 seconds. Our AI identifies exactly which personality traits predict success in this specific role.",
                icon: Building2
              },
              {
                step: "02",
                title: "Send Candidates One Link",
                description: "They finish in 15 minutes, on their own time, from any device. Zero coordination on your end.",
                icon: Users
              },
              {
                step: "03",
                title: "See Who Actually Fits",
                description: "Your candidates ranked by fit score. Red flags highlighted. No more guessing who's worth an interview.",
                icon: BarChart3
              },
              {
                step: "04",
                title: "Hire Someone Who Sticks",
                description: "When you match personality to role requirements, new hires actually succeed. Less turnover. Less headaches. Better team.",
                icon: UserCheck
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="bg-slate-900/50 border-slate-800 h-full">
                  <CardHeader>
                    <div className="text-sm font-mono text-violet-400 mb-2">{item.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-violet-400" />
                    </div>
                    <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-slate-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Target,
                title: "AI Job Analysis",
                description: "Paste any job description and our AI extracts the ideal personality profile in seconds. No more guessing what traits matter."
              },
              {
                icon: TrendingUp,
                title: "Predictive Fit Scoring",
                description: "Each candidate gets a 0-100 fit score based on how their personality aligns with role requirements."
              },
              {
                icon: Users,
                title: "Team Composition View",
                description: "See how a new hire would change your team's dynamics. Identify gaps, avoid redundancy, maximize collaboration."
              },
              {
                icon: Award,
                title: "Candidate Ranking",
                description: "Automatically rank your entire candidate pool. Spend time on the top 10%, not screening the bottom 90%."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Personality Science Works Section */}
      <section className="py-20 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              &ldquo;Personality Tests Don&apos;t Work.&rdquo;<br />Wrong Ones Don&apos;t. This One Does.
            </h2>
            <p className="text-slate-400 text-lg">
              Most hiring assessments are horoscopes dressed up in corporate branding. PRISM-7 is built on the actual science—the kind published in peer-reviewed journals, not marketing decks.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { value: "6", label: "HEXACO personality dimensions measured (the academic gold standard)" },
              { value: "100+", label: "Questions designed to resist faking and social desirability bias" },
              { value: "15min", label: "Average completion time—candidates actually finish it" },
              { value: "0", label: "Adverse impact on protected classes (EEOC compliant)" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-800"
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-2">
                  {stat.value}
                </div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Research Foundation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border-violet-500/20">
              <CardContent className="p-8">
                <p className="text-lg text-slate-300 mb-4">
                  <strong className="text-white">The Science Behind It</strong>
                </p>
                <p className="text-slate-400 mb-4">
                  Schmidt &amp; Hunter&apos;s landmark meta-analysis of 85 years of hiring research found that structured assessments significantly outperform unstructured interviews in predicting job performance. The HEXACO model we use has been validated in hundreds of peer-reviewed studies across cultures.
                </p>
                <p className="text-slate-400 text-sm">
                  <strong className="text-slate-300">Important:</strong> No assessment can guarantee perfect hires. PRISM-7 gives you better data to make better decisions—it&apos;s one powerful tool in a comprehensive hiring process.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              $15 To Avoid a $24,000 Mistake?
            </h2>
            <p className="text-slate-400 text-lg">
              No subscriptions. No annual contracts. Just pay when you hire—and sleep better knowing who you&apos;re bringing on.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pay Per Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/50 border-slate-800 h-full">
                <CardHeader>
                  <CardTitle className="text-white">Pay As You Go</CardTitle>
                  <CardDescription className="text-slate-400">Test it. No commitment.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">$15</span>
                    <span className="text-slate-400">/assessment</span>
                  </div>
                  <p className="text-xs text-emerald-400 mt-1">First one free</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {[
                      "Full personality assessment",
                      "Job fit scoring",
                      "Candidate ranking",
                      "AI job analysis",
                      "Results never expire"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline" asChild>
                    <Link href="/sign-up">Get Your Free Assessment</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Credit Packs - Most Popular */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-b from-violet-900/30 to-slate-900/50 border-violet-500/30 h-full relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm rounded-full">
                  Best Value
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-white">Credit Packs</CardTitle>
                  <CardDescription className="text-slate-400">Serious about hiring right</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">$10</span>
                    <span className="text-slate-400">/assessment</span>
                  </div>
                  <p className="text-sm text-emerald-400 mt-1">Save $5 per hire</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {[
                      "Everything in Pay As You Go",
                      "25-100 assessment credits",
                      "Team composition analysis",
                      "Priority support",
                      "Bulk candidate import"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-violet-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500" asChild>
                    <Link href="/sign-up">Lock In This Price</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 h-full">
                <CardHeader>
                  <CardTitle className="text-white">Enterprise</CardTitle>
                  <CardDescription className="text-slate-400">Hiring at scale</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">Let&apos;s Talk</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {[
                      "Unlimited assessments",
                      "ATS integrations",
                      "Your branding, your experience",
                      "Dedicated account manager",
                      "Full API access"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline" asChild>
                    <Link href="/contact">Talk to Our Team</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Money-back guarantee */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 max-w-2xl mx-auto"
          >
            <Shield className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
            <p className="text-white font-semibold mb-1">Zero-Risk Guarantee</p>
            <p className="text-slate-400">
              30 days to decide. If PRISM-7 isn&apos;t delivering value, we refund your unused credits—no questions, no hassle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "How is this different from other personality tests?",
                  a: "Most hiring tests use outdated models or aren't designed for workplace assessment. PRISM-7 is built on HEXACO—the most current personality framework in academic research—and specifically designed to identify job-relevant traits like conscientiousness, agreeableness, and emotional stability."
                },
                {
                  q: "How long does the assessment take?",
                  a: "12-18 minutes. It's designed to be engaging (not tedious), works on any device, and doesn't require scheduling or supervision. Candidates can complete it whenever works for them."
                },
                {
                  q: "Is this legally compliant for hiring?",
                  a: "Yes. PRISM-7 assesses personality traits, not protected characteristics. The HEXACO model has been extensively studied for adverse impact and shows no discrimination against protected classes. We provide documentation for your records."
                },
                {
                  q: "Can candidates fake their answers?",
                  a: "We've built in multiple validity checks that flag inconsistent responding and social desirability bias. You'll see a 'validity score' with each candidate's results. That said, no assessment is cheat-proof—use it as one data point alongside interviews."
                },
                {
                  q: "What if a candidate I like scores poorly?",
                  a: "The assessment provides data, not a hiring decision. A low fit score might mean the candidate needs more support in certain areas, or that the role requirements need adjustment. Use it to have better conversations, not as an automatic filter."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-800 pb-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-slate-400">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              You&apos;re Going To Hire Someone Next Month.<br />The Only Question Is Who.
            </h2>
            <p className="text-xl text-slate-400 mb-4">
              You can keep doing what you&apos;ve been doing—resumes, interviews, references, and hope for the best.
            </p>
            <p className="text-lg text-slate-300 mb-8">
              Or you can spend 5 minutes setting up PRISM-7 and actually <em>know</em> who you&apos;re bringing onto your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-6 text-lg shadow-lg shadow-violet-500/25"
                asChild
              >
                <Link href="/sign-up">
                  Get Your Free Assessment Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-700 bg-slate-900/50 text-white hover:bg-slate-800 px-8 py-6 text-lg"
                asChild
              >
                <Link href="/contact">
                  Have Questions? Let&apos;s Talk
                </Link>
              </Button>
            </div>
            <p className="text-slate-500 text-sm mt-6">
              No credit card required • Set up in 5 minutes • Your first assessment is free
            </p>
          </motion.div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}
