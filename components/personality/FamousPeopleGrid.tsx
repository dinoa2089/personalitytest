"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

export interface FamousPerson {
  name: string;
  known_for: string;
  image_url: string;
  bio: string;
  wikipedia_url?: string;
}

interface FamousPeopleGridProps {
  people: FamousPerson[];
  typeName: string;
  showAll?: boolean;
}

export function FamousPeopleGrid({ people, typeName, showAll = false }: FamousPeopleGridProps) {
  const [expanded, setExpanded] = useState(showAll);
  const [selectedPerson, setSelectedPerson] = useState<FamousPerson | null>(null);
  
  // Show 10 initially, expand to show all 20
  const displayedPeople = expanded ? people : people.slice(0, 10);
  
  return (
    <div className="space-y-6">
      {/* Grid - 5 columns on desktop, 3 on tablet, 2 on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayedPeople.map((person, index) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="group cursor-pointer overflow-hidden rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full"
              onClick={() => setSelectedPerson(person)}
            >
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {person.image_url ? (
                    <Image
                      src={person.image_url}
                      alt={`${person.name} - Famous ${typeName}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      loading={index < 10 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                      <span className="text-4xl font-bold text-primary/50">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-white text-xs font-medium line-clamp-2">
                      {person.known_for}
                    </span>
                  </div>
                </div>
                
                {/* Name */}
                <div className="p-3">
                  <h4 className="font-semibold text-sm line-clamp-1">{person.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {person.known_for}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Expand/Collapse Button */}
      {people.length > 10 && (
        <div className="flex justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full border border-border/50 hover:border-primary/50"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show All {people.length} Famous {typeName}s <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Detail Modal */}
      <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedPerson && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedPerson.name}</DialogTitle>
                <DialogDescription>{selectedPerson.known_for}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Image */}
                {selectedPerson.image_url && (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src={selectedPerson.image_url}
                      alt={selectedPerson.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 500px"
                    />
                  </div>
                )}
                
                {/* Bio */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Why They're Considered a {typeName}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedPerson.bio}
                  </p>
                </div>
                
                {/* Wikipedia Link */}
                {selectedPerson.wikipedia_url && (
                  <a
                    href={selectedPerson.wikipedia_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Learn more on Wikipedia <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Schema.org markup for famous people */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `Famous ${typeName} Personality Types`,
            "description": `Notable people who exemplify the ${typeName} personality type`,
            "numberOfItems": people.length,
            "itemListElement": people.slice(0, 20).map((person, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Person",
                "name": person.name,
                "description": person.bio,
                ...(person.image_url && { "image": person.image_url }),
                ...(person.wikipedia_url && { "sameAs": person.wikipedia_url }),
              }
            }))
          })
        }}
      />
    </div>
  );
}




