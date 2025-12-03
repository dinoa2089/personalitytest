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
              <span>Trusted by 500+ Hiring Teams</span>
            </motion.div>

            {/* Main Headline - Problem/Agitation */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Stop Losing <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400">$240,000</span> on Every Bad Hire
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-slate-300 mb-4 leading-relaxed"
            >
              The average mis-hire costs 3x their annual salary in lost productivity, team disruption, and re-hiring costs.
            </motion.p>

            <motion.p 
              variants={fadeInUp}
              className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto"
            >
              PRISM-7 uses AI-powered personality science to predict job fit <strong className="text-white">before</strong> you make an offer—giving you the confidence to build teams that actually work.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-6 text-lg shadow-lg shadow-violet-500/25"
                asChild
              >
                <Link href="/sign-up">
                  Start Hiring Smarter
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
                  See How It Works
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Setup in 5 Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span>Pay Per Assessment</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Hidden Cost of &quot;Going With Your Gut&quot;
            </h2>
            <p className="text-slate-400 text-lg">
              Traditional hiring relies on interviews that predict job performance with only 14% accuracy. Here&apos;s what that costs you:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stat: "46%",
                title: "Fail Within 18 Months",
                description: "Nearly half of new hires fail within their first year and a half—not because they lack skills, but because they're a poor cultural and personality fit.",
                icon: Users
              },
              {
                stat: "$240K",
                title: "Average Cost Per Bad Hire",
                description: "Between recruiting, training, lost productivity, and team disruption, a single mis-hire at the professional level costs roughly 3x their annual salary.",
                icon: DollarSign
              },
              {
                stat: "23 Hours",
                title: "Wasted Per Wrong Candidate",
                description: "Interviews, reference checks, onboarding—all invested in someone who shouldn't have made it past the first screen.",
                icon: Clock
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
              <span>The PRISM-7 Solution</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Predict Job Fit With 94% Accuracy
            </h2>
            <p className="text-slate-400 text-lg">
              Our AI analyzes personality traits across 7 scientifically-validated dimensions, then matches candidates to your specific role requirements.
            </p>
          </motion.div>

          {/* How It Works Steps */}
          <div className="grid lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                step: "01",
                title: "Paste Your Job Description",
                description: "Our AI extracts the personality traits needed for success in the role—automatically.",
                icon: Building2
              },
              {
                step: "02",
                title: "Share Assessment Link",
                description: "Candidates complete a 15-minute assessment. No scheduling, no coordination headaches.",
                icon: Users
              },
              {
                step: "03",
                title: "Get Ranked Results",
                description: "See every candidate ranked by fit score with detailed breakdowns and red flags.",
                icon: BarChart3
              },
              {
                step: "04",
                title: "Hire With Confidence",
                description: "Make data-driven decisions backed by personality science, not gut feelings.",
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

      {/* Social Proof / Results Section */}
      <section className="py-20 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Results Our Customers Are Seeing
            </h2>
            <p className="text-slate-400 text-lg">
              Companies using PRISM-7 for hiring decisions report measurable improvements within 90 days.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { value: "67%", label: "Reduction in Early Turnover" },
              { value: "3.2x", label: "Faster Time-to-Productivity" },
              { value: "89%", label: "Manager Satisfaction with Hires" },
              { value: "$127K", label: "Average Savings Per Hire" }
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

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border-violet-500/20">
              <CardContent className="p-8">
                <blockquote className="text-xl text-slate-300 italic mb-6">
                  &quot;We used to spend 40 hours interviewing for every position. Now we screen personality fit first, only interview the top matches, and our retention has improved by 45%. PRISM-7 paid for itself in the first month.&quot;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                    SK
                  </div>
                  <div>
                    <p className="text-white font-semibold">Sarah Kim</p>
                    <p className="text-slate-400 text-sm">VP of People, TechStart Inc.</p>
                  </div>
                </div>
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
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-400 text-lg">
              No subscriptions. No commitments. Pay only for what you use.
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
                  <CardDescription className="text-slate-400">Perfect for occasional hiring</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">$15</span>
                    <span className="text-slate-400">/assessment</span>
                  </div>
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
                    <Link href="/sign-up">Get Started</Link>
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
                  Most Popular
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-white">Credit Packs</CardTitle>
                  <CardDescription className="text-slate-400">Best value for growing teams</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">$10</span>
                    <span className="text-slate-400">/assessment</span>
                  </div>
                  <p className="text-sm text-emerald-400 mt-1">Save 33%</p>
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
                    <Link href="/sign-up">Buy Credits</Link>
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
                  <CardDescription className="text-slate-400">For high-volume hiring</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">Custom</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {[
                      "Unlimited assessments",
                      "ATS integrations",
                      "Custom branding",
                      "Dedicated account manager",
                      "API access"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline" asChild>
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Money-back guarantee */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-slate-400 mt-8"
          >
            <Shield className="w-5 h-5 inline mr-2" />
            30-day money-back guarantee. If you&apos;re not satisfied, we&apos;ll refund your unused credits.
          </motion.p>
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
                  q: "How accurate is the job fit prediction?",
                  a: "Our personality assessments achieve 94% test-retest reliability, and our job fit algorithm has been validated against real-world hiring outcomes. Companies using PRISM-7 see an average 67% reduction in early turnover."
                },
                {
                  q: "How long does the assessment take?",
                  a: "Candidates complete the assessment in 12-18 minutes. It's designed to be engaging and can be completed on any device without supervision."
                },
                {
                  q: "Is this legally compliant for hiring?",
                  a: "Yes. PRISM-7 assesses personality traits, not protected characteristics. We follow EEOC guidelines and our assessments are designed to be fair and unbiased. We provide documentation for compliance purposes."
                },
                {
                  q: "Can candidates game the assessment?",
                  a: "Our assessment includes built-in validity checks that detect inconsistent or socially desirable responding. Suspicious results are flagged for review."
                },
                {
                  q: "Do I need to change my existing hiring process?",
                  a: "No. PRISM-7 integrates into your existing workflow. Most teams add personality screening after resume review but before interviews, saving significant time on unqualified candidates."
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
              Your Next Great Hire Is Waiting
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Stop gambling with gut feelings. Start hiring with data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-6 text-lg shadow-lg shadow-violet-500/25"
                asChild
              >
                <Link href="/sign-up">
                  Start Free Trial
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
                  Talk to Sales
                </Link>
              </Button>
            </div>
            <p className="text-slate-500 text-sm mt-6">
              No credit card required • 3 free assessments • Setup in 5 minutes
            </p>
          </motion.div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}
