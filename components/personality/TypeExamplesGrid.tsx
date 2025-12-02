"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Info, Sparkles, Film, User } from "lucide-react";

export interface TypeExample {
  name: string;
  source: string; // e.g., "Iron Man" for fictional, "Entrepreneur" for real
  type: "fictional" | "public_figure";
  image_url?: string;
  description: string; // Why they exemplify this type
  traits_shown: string[]; // Specific traits they demonstrate
}

interface TypeExamplesGridProps {
  examples: TypeExample[];
  typeName: string;
  typeDescription: string; // e.g., "High Openness + Adaptability"
}

export function TypeExamplesGrid({ examples, typeName, typeDescription }: TypeExamplesGridProps) {
  const [selectedExample, setSelectedExample] = useState<TypeExample | null>(null);
  
  const fictionalExamples = examples.filter(e => e.type === "fictional");
  const publicFigures = examples.filter(e => e.type === "public_figure");
  
  return (
    <div className="space-y-8">
      {/* Disclaimer Card */}
      <Card className="rounded-xl border border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">A note on examples:</strong> The individuals and characters below 
              are associated with {typeName} traits based on public perception and narrative portrayal. 
              Personality is complex and multidimensional—these examples are illustrative, not diagnostic. 
              Only a validated assessment can determine someone's actual personality profile.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fictional Characters Section */}
      {fictionalExamples.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Fictional Characters Who Embody {typeName} Traits</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            These characters were intentionally written to display {typeDescription.toLowerCase()} patterns.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {fictionalExamples.map((example, index) => (
              <motion.div
                key={example.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="group cursor-pointer overflow-hidden rounded-xl border border-border/50 hover:border-purple-500/50 hover:shadow-lg transition-all duration-300 h-full"
                  onClick={() => setSelectedExample(example)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      {example.image_url ? (
                        <Image
                          src={example.image_url}
                          alt={`${example.name} - ${typeName} character example`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          loading={index < 4 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-12 w-12 text-purple-500/50" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-purple-500/90 text-white text-xs">
                          Fictional
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h4 className="font-semibold text-sm line-clamp-1">{example.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {example.source}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Public Figures Section */}
      {publicFigures.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Public Figures Often Associated With {typeName} Traits</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            These individuals are popularly associated with {typeDescription.toLowerCase()} based on their public persona. 
            Individual personalities are complex and may differ from public perception.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {publicFigures.map((example, index) => (
              <motion.div
                key={example.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="group cursor-pointer overflow-hidden rounded-xl border border-border/50 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 h-full"
                  onClick={() => setSelectedExample(example)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                      {example.image_url ? (
                        <Image
                          src={example.image_url}
                          alt={`${example.name} - associated with ${typeName} traits`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          loading={index < 4 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-12 w-12 text-blue-500/50" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-500/90 text-white text-xs">
                          Public Figure
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h4 className="font-semibold text-sm line-clamp-1">{example.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {example.source}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedExample} onOpenChange={() => setSelectedExample(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedExample && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl">{selectedExample.name}</DialogTitle>
                  <Badge variant={selectedExample.type === "fictional" ? "default" : "secondary"}>
                    {selectedExample.type === "fictional" ? "Fictional" : "Public Figure"}
                  </Badge>
                </div>
                <DialogDescription>{selectedExample.source}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedExample.image_url && (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={selectedExample.image_url}
                      alt={selectedExample.name}
                      fill
                      className="object-cover"
                      sizes="500px"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      {selectedExample.type === "fictional" 
                        ? `Why ${selectedExample.name} Exemplifies ${typeName} Traits`
                        : `Traits Associated With ${selectedExample.name}`
                      }
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedExample.description}
                    </p>
                  </div>
                  
                  {selectedExample.traits_shown.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Traits Displayed</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedExample.traits_shown.map((trait) => (
                          <Badge key={trait} variant="outline" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedExample.type === "public_figure" && (
                  <p className="text-xs text-muted-foreground italic border-t pt-3">
                    Note: This association is based on public perception and may not reflect the individual's 
                    actual personality profile. Only a validated assessment can determine personality type.
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

