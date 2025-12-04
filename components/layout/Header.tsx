"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ConditionalAuth } from "@/components/providers/ConditionalAuth";
import { ChevronDown, Menu, X, Building2, LayoutDashboard } from "lucide-react";

// MBTI Types grouped by temperament
const mbtiTypes = {
  analysts: [
    { code: "INTJ", name: "Architect" },
    { code: "INTP", name: "Logician" },
    { code: "ENTJ", name: "Commander" },
    { code: "ENTP", name: "Debater" },
  ],
  diplomats: [
    { code: "INFJ", name: "Advocate" },
    { code: "INFP", name: "Mediator" },
    { code: "ENFJ", name: "Protagonist" },
    { code: "ENFP", name: "Campaigner" },
  ],
  sentinels: [
    { code: "ISTJ", name: "Logistician" },
    { code: "ISFJ", name: "Defender" },
    { code: "ESTJ", name: "Executive" },
    { code: "ESFJ", name: "Consul" },
  ],
  explorers: [
    { code: "ISTP", name: "Virtuoso" },
    { code: "ISFP", name: "Adventurer" },
    { code: "ESTP", name: "Entrepreneur" },
    { code: "ESFP", name: "Entertainer" },
  ],
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

// PRISM-7 Types
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

export function Header() {
  const [typesOpen, setTypesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent group-hover:from-violet-500 group-hover:via-fuchsia-500 group-hover:to-rose-500 transition-all">
              PRISM-7
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/assessment"
              className="text-sm font-medium text-foreground transition-colors hover:text-violet-600"
            >
              Take Assessment
            </Link>

            {/* Personality Types Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setTypesOpen(true)}
              onMouseLeave={() => setTypesOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Personality Types
                <ChevronDown className={`h-4 w-4 transition-transform ${typesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {typesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[800px]">
                  <div className="bg-card border border-border rounded-xl shadow-xl p-6">
                    <div className="grid grid-cols-3 gap-8">
                      {/* PRISM-7 Column */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 text-violet-600">PRISM-7 Archetypes</h3>
                        <div className="grid grid-cols-2 gap-1">
                          {prismTypes.map((type) => (
                            <Link
                              key={type.id}
                              href={`/type/${type.id}`}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <span>{type.icon}</span>
                              <span>{type.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* MBTI Column */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 text-blue-600">MBTI Types</h3>
                        <div className="space-y-3">
                          {Object.entries(mbtiTypes).map(([group, types]) => (
                            <div key={group}>
                              <p className="text-xs text-muted-foreground capitalize mb-1">{group}</p>
                              <div className="grid grid-cols-2 gap-1">
                                {types.map((type) => (
                                  <Link
                                    key={type.code}
                                    href={`/type/mbti/${type.code.toLowerCase()}`}
                                    className="px-2 py-1 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                  >
                                    {type.code}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Enneagram Column */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 text-emerald-600">Enneagram</h3>
                        <div className="space-y-1">
                          {enneagramTypes.map((type) => (
                            <Link
                              key={type.num}
                              href={`/type/enneagram/${type.num}`}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs flex items-center justify-center font-medium">
                                {type.num}
                              </span>
                              <span>{type.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Links */}
                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                      <Link
                        href="/type"
                        className="text-sm text-violet-600 hover:text-violet-700 transition-colors font-medium"
                      >
                        Explore All Types →
                      </Link>
                      <Link
                        href="/compare"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Compare Types →
                      </Link>
                      <Link
                        href="/science"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Learn About Our Methodology →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/science"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Science
            </Link>

            {/* For Employers - Single Link */}
            <Link
              href="/for-employers"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Building2 className="h-4 w-4" />
              For Employers
            </Link>

            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>

            {isSignedIn && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}

            <ConditionalAuth />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                href="/assessment"
                className="text-sm font-medium text-foreground transition-colors hover:text-violet-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Take Assessment
              </Link>

              {/* Mobile Types Accordion */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-muted-foreground">
                  Personality Types
                  <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-2 pl-4 space-y-4">
                  {/* Explore All Link */}
                  <Link
                    href="/type"
                    className="block text-sm font-medium text-violet-600 hover:text-violet-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Explore All Types →
                  </Link>
                  
                  {/* PRISM */}
                  <div>
                    <p className="text-xs font-medium text-violet-600 mb-2">PRISM-7</p>
                    <div className="grid grid-cols-2 gap-2">
                      {prismTypes.map((type) => (
                        <Link
                          key={type.id}
                          href={`/type/${type.id}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {type.icon} {type.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* MBTI */}
                  <div>
                    <p className="text-xs font-medium text-blue-600 mb-2">MBTI</p>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.values(mbtiTypes).flat().map((type) => (
                        <Link
                          key={type.code}
                          href={`/type/mbti/${type.code.toLowerCase()}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {type.code}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Enneagram */}
                  <div>
                    <p className="text-xs font-medium text-emerald-600 mb-2">Enneagram</p>
                    <div className="grid grid-cols-3 gap-2">
                      {enneagramTypes.map((type) => (
                        <Link
                          key={type.num}
                          href={`/type/enneagram/${type.num}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Type {type.num}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </details>

              <Link
                href="/science"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Science
              </Link>

              {/* For Employers - Single Link */}
              <Link
                href="/for-employers"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building2 className="w-4 h-4 text-violet-500" />
                For Employers
              </Link>

              <Link
                href="/blog"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>

              {isSignedIn && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
