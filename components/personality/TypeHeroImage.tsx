"use client";

import Image from "next/image";

interface TypeHeroImageProps {
  typeName: string;
  typeSlug: string;
  gradient: string;
  className?: string;
}

// Unsplash images that represent different personality archetypes
// Using direct Unsplash URLs with optimization parameters
const typeImages: Record<string, string> = {
  // PRISM-7 Types
  innovator: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80", // Abstract tech/space
  architect: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80", // Architecture
  catalyst: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80", // Team collaboration
  strategist: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80", // Chess/strategy
  connector: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80", // People connecting
  guardian: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80", // Protection/care
  explorer: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80", // Adventure road
  stabilizer: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", // Calm mountains
  visionary: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80", // Galaxy/future
  harmonizer: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&q=80", // Peaceful nature
  achiever: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80", // Summit/achievement
  analyst: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80", // Data/analysis
  
  // MBTI Types - using thematic images
  intj: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1200&q=80", // Strategic chess
  intp: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80", // Abstract thinking
  entj: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80", // Leadership
  entp: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80", // Innovation debate
  infj: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", // Depth/insight
  infp: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&q=80", // Creative nature
  enfj: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80", // Inspiring others
  enfp: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80", // Adventure/enthusiasm
  istj: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80", // Organization
  isfj: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=1200&q=80", // Caring/support
  estj: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80", // Executive leadership
  esfj: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80", // Community
  istp: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80", // Hands-on work
  isfp: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80", // Artistic expression
  estp: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80", // Action/sports
  esfp: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80", // Performance/fun
};

// Fallback gradient backgrounds for types without images
const gradientBackgrounds: Record<string, string> = {
  innovator: "from-purple-600 via-pink-500 to-orange-400",
  architect: "from-blue-600 via-indigo-500 to-purple-500",
  catalyst: "from-orange-500 via-red-500 to-pink-500",
  strategist: "from-green-600 via-teal-500 to-cyan-500",
  connector: "from-pink-500 via-rose-500 to-red-400",
  guardian: "from-emerald-600 via-green-500 to-teal-400",
  explorer: "from-yellow-500 via-orange-500 to-red-500",
  stabilizer: "from-cyan-500 via-blue-500 to-indigo-500",
  visionary: "from-violet-600 via-purple-500 to-fuchsia-500",
  harmonizer: "from-teal-500 via-cyan-400 to-blue-400",
  achiever: "from-amber-500 via-yellow-500 to-orange-400",
  analyst: "from-slate-600 via-gray-500 to-zinc-400",
};

export function TypeHeroImage({ typeName, typeSlug, gradient, className = "" }: TypeHeroImageProps) {
  const imageUrl = typeImages[typeSlug.toLowerCase()];
  const fallbackGradient = gradientBackgrounds[typeSlug.toLowerCase()] || gradient;

  if (!imageUrl) {
    // Fallback to gradient background
    return (
      <div className={`relative w-full h-64 md:h-80 rounded-2xl overflow-hidden ${className}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient} opacity-80`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl md:text-8xl opacity-30">✨</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-64 md:h-80 rounded-2xl overflow-hidden ${className}`}>
      <Image
        src={imageUrl}
        alt={`${typeName} personality type visual representation`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 1200px"
        priority
      />
      {/* Gradient overlay for text readability */}
      <div className={`absolute inset-0 bg-gradient-to-t ${fallbackGradient} opacity-40`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}

/**
 * Get hero image URL for a type (for use in metadata/OG images)
 */
export function getTypeHeroImageUrl(typeSlug: string): string | null {
  return typeImages[typeSlug.toLowerCase()] || null;
}




