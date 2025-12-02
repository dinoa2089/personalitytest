"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { getImageUrl } from "@/lib/image-urls";

export interface FamousExample {
  name: string;
  known_for?: string; // For MBTI/Enneagram
  role?: string; // For archetypes
  image_url?: string;
  bio?: string;
}

interface FamousExamplesGridProps {
  examples: FamousExample[];
  typeName: string;
  variant?: "compact" | "full"; // compact for results page, full for type pages
  maxVisible?: number;
  colorAccent?: string; // e.g., "purple", "blue", "amber"
}

// Generate a deterministic color based on name for consistent avatars
function getAvatarColor(name: string): string {
  const colors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-red-500",
    "from-indigo-500 to-violet-500",
    "from-teal-500 to-green-500",
    "from-fuchsia-500 to-purple-500",
  ];
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function FamousExamplesGrid({ 
  examples, 
  typeName, 
  variant = "full",
  maxVisible = 8,
  colorAccent = "yellow"
}: FamousExamplesGridProps) {
  const [expanded, setExpanded] = useState(variant === "full");
  const [selectedPerson, setSelectedPerson] = useState<FamousExample | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  const displayedExamples = expanded ? examples : examples.slice(0, maxVisible);
  
  const handleImageError = (name: string) => {
    setImageErrors((prev) => new Set(prev).add(name));
  };
  
  // Get the best image URL for a person from our mapping
  const getPersonImageUrl = (person: FamousExample): string | undefined => {
    return getImageUrl(person.name);
  };

  const accentColors = {
    yellow: "border-yellow-500/50 hover:border-yellow-500",
    purple: "border-purple-500/50 hover:border-purple-500",
    blue: "border-blue-500/50 hover:border-blue-500",
    green: "border-green-500/50 hover:border-green-500",
    amber: "border-amber-500/50 hover:border-amber-500",
    pink: "border-pink-500/50 hover:border-pink-500",
  };
  
  const borderClass = accentColors[colorAccent as keyof typeof accentColors] || accentColors.yellow;
  
  // For compact variant (results page), use smaller grid
  const gridClass = variant === "compact" 
    ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4";
  
  return (
    <div className="space-y-4">
      <div className={gridClass}>
        {displayedExamples.map((person, index) => {
          const imageUrl = getPersonImageUrl(person);
          const hasValidImage = imageUrl && !imageErrors.has(person.name);
          const subtitle = person.known_for || person.role || "";
          
          return (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card 
                className={`group cursor-pointer overflow-hidden rounded-xl border ${borderClass} hover:shadow-lg transition-all duration-300 h-full bg-card/80`}
                onClick={() => setSelectedPerson(person)}
              >
                <CardContent className="p-0">
                  {/* Image Container - square aspect ratio */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {hasValidImage ? (
                      <Image
                        src={imageUrl!}
                        alt={`${person.name} - ${typeName}`}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        sizes={variant === "compact" 
                          ? "(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                          : "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                        }
                        loading={index < 8 ? "eager" : "lazy"}
                        onError={() => handleImageError(person.name)}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getAvatarColor(person.name)}`}>
                        <span className="text-white font-bold text-2xl md:text-3xl drop-shadow-md">
                          {getInitials(person.name)}
                        </span>
                      </div>
                    )}
                    {/* Hover overlay with subtitle */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                      <span className="text-white text-xs font-medium line-clamp-2">
                        {subtitle}
                      </span>
                    </div>
                  </div>
                  
                  {/* Name */}
                  <div className="p-2 md:p-3">
                    <h4 className="font-semibold text-xs md:text-sm line-clamp-1">{person.name}</h4>
                    {variant === "full" && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 hidden sm:block">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Expand/Collapse Button */}
      {examples.length > maxVisible && (
        <div className="flex justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 bg-card/50"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show All {examples.length} <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Detail Modal */}
      <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedPerson && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedPerson.name}</DialogTitle>
                <DialogDescription>
                  {selectedPerson.known_for || selectedPerson.role}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Image or Avatar */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  {getPersonImageUrl(selectedPerson) && !imageErrors.has(selectedPerson.name) ? (
                    <Image
                      src={getPersonImageUrl(selectedPerson)!}
                      alt={selectedPerson.name}
                      fill
                      className="object-cover object-top"
                      sizes="400px"
                      onError={() => handleImageError(selectedPerson.name)}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getAvatarColor(selectedPerson.name)}`}>
                      <span className="text-white font-bold text-6xl drop-shadow-md">
                        {getInitials(selectedPerson.name)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Bio if available */}
                {selectedPerson.bio && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Why They're Considered a {typeName}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedPerson.bio}
                    </p>
                  </div>
                )}
                
                {!selectedPerson.bio && (
                  <p className="text-sm text-muted-foreground">
                    {selectedPerson.name} is often associated with {typeName} personality traits 
                    based on their public persona and known characteristics.
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

