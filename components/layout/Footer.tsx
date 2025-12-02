import Link from "next/link";

// PRISM-7 Archetypes
const prismTypes = [
  { id: "innovator", name: "Innovator" },
  { id: "architect", name: "Architect" },
  { id: "catalyst", name: "Catalyst" },
  { id: "strategist", name: "Strategist" },
  { id: "connector", name: "Connector" },
  { id: "guardian", name: "Guardian" },
  { id: "explorer", name: "Explorer" },
  { id: "stabilizer", name: "Stabilizer" },
  { id: "visionary", name: "Visionary" },
  { id: "harmonizer", name: "Harmonizer" },
  { id: "achiever", name: "Achiever" },
  { id: "analyst", name: "Analyst" },
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

export function Footer() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <div>
              <h3 className="font-bold text-lg bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                PRISM-7
              </h3>
              <p className="text-xs text-muted-foreground mb-1">by Authentic Self</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Scientifically validated personality assessment based on modern psychology research.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/assessment" className="text-muted-foreground hover:text-foreground transition-colors">
                  Take Assessment
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/science" className="text-muted-foreground hover:text-foreground transition-colors">
                  Science
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* PRISM-7 Types */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">PRISM-7 Types</h4>
            <ul className="space-y-1.5 text-xs">
              {prismTypes.slice(0, 6).map((type) => (
                <li key={type.id}>
                  <Link 
                    href={`/type/${type.id}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {type.name}
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
                    {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* MBTI Types */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">MBTI Types</h4>
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
            <h4 className="font-semibold mb-4 text-sm">Enneagram</h4>
            <ul className="space-y-1.5 text-xs">
              {enneagramTypes.map((type) => (
                <li key={type.num}>
                  <Link 
                    href={`/type/enneagram/${type.num}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Type {type.num}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
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

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PRISM-7 by Authentic Self. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Based on the HEXACO+ model of personality psychology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
