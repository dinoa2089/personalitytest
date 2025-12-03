import Link from "next/link";
import { Building2, Sparkles } from "lucide-react";

// PRISM-7 Archetypes
const prismTypes = [
  { id: "innovator", name: "Innovator", icon: "💡" },
  { id: "architect", name: "Architect", icon: "🏛️" },
  { id: "catalyst", name: "Catalyst", icon: "⚡" },
  { id: "strategist", name: "Strategist", icon: "🎯" },
  { id: "connector", name: "Connector", icon: "🤝" },
  { id: "guardian", name: "Guardian", icon: "🛡️" },
  { id: "explorer", name: "Explorer", icon: "🧭" },
  { id: "stabilizer", name: "Stabilizer", icon: "⚖️" },
  { id: "visionary", name: "Visionary", icon: "🔮" },
  { id: "harmonizer", name: "Harmonizer", icon: "☮️" },
  { id: "achiever", name: "Achiever", icon: "🏆" },
  { id: "analyst", name: "Analyst", icon: "🔬" },
];

// MBTI Types grouped by temperament
const mbtiTypes = {
  analysts: ["INTJ", "INTP", "ENTJ", "ENTP"],
  diplomats: ["INFJ", "INFP", "ENFJ", "ENFP"],
  sentinels: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  explorers: ["ISTP", "ISFP", "ESTP", "ESFP"],
};

// Enneagram Types
const enneagramTypes = [
  { num: "1", name: "Reformer" },
  { num: "2", name: "Helper" },
  { num: "3", name: "Achiever" },
  { num: "4", name: "Individualist" },
  { num: "5", name: "Investigator" },
  { num: "6", name: "Loyalist" },
  { num: "7", name: "Enthusiast" },
  { num: "8", name: "Challenger" },
  { num: "9", name: "Peacemaker" },
];

// Topic guides for SEO
const topicGuides = [
  { slug: "careers", name: "Career Guides", icon: "💼" },
  { slug: "relationships", name: "Relationship Guides", icon: "💕" },
  { slug: "compatibility", name: "Compatibility", icon: "🤝" },
  { slug: "growth", name: "Personal Growth", icon: "🌱" },
  { slug: "stress", name: "Stress & Coping", icon: "🧘" },
  { slug: "leadership", name: "Leadership", icon: "👑" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 lg:gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <div>
              <h3 className="font-bold text-lg bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent mb-2">
                PRISM-7
              </h3>
              <p className="text-xs text-muted-foreground mb-1">by Authentic Self</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Scientifically validated personality assessment based on the HEXACO+ model.
            </p>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-foreground">Get Started</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/assessment" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  Free Assessment
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Unlock Full Results
                </Link>
              </li>
              <li>
                <Link href="/for-employers" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-violet-500" />
                  Hiring Solutions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-foreground">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/science" className="text-muted-foreground hover:text-foreground transition-colors">
                  Our Science
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-muted-foreground hover:text-foreground transition-colors">
                  Compare Types
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* PRISM-7 Types */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-foreground">PRISM-7 Types</h4>
            <ul className="space-y-1.5 text-xs">
              {prismTypes.slice(0, 6).map((type) => (
                <li key={type.id}>
                  <Link 
                    href={`/type/${type.id}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {type.icon} {type.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-1.5 text-xs mt-2">
              {prismTypes.slice(6).map((type) => (
                <li key={type.id}>
                  <Link 
                    href={`/type/${type.id}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {type.icon} {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* MBTI Types */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-foreground">MBTI Types</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              {Object.values(mbtiTypes).flat().map((type) => (
                <Link 
                  key={type}
                  href={`/type/mbti/${type.toLowerCase()}`} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {type}
                </Link>
              ))}
            </div>
          </div>

          {/* Enneagram Types */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-foreground">Enneagram</h4>
            <ul className="space-y-1.5 text-xs">
              {enneagramTypes.map((type) => (
                <li key={type.num}>
                  <Link 
                    href={`/type/enneagram/${type.num}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Type {type.num}: {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-rose-600/10 border border-violet-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Ready to discover your authentic self?</h4>
              <p className="text-sm text-muted-foreground">Take our free 15-minute personality assessment today.</p>
            </div>
            <Link 
              href="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium text-sm hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25"
            >
              <Sparkles className="w-4 h-4" />
              Start Free Assessment
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PRISM-7 by Authentic Self. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>Based on the HEXACO+ model of personality psychology</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">94% Test-Retest Reliability</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
