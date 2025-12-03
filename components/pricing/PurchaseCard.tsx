"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface PurchaseProduct {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  description: string;
  icon: LucideIcon;
  features: string[];
  savings?: string;
  popular?: boolean;
  planKey: string; // The key to send to create-checkout API
}

interface PurchaseCardProps {
  product: PurchaseProduct;
  onPurchase: (planKey: string) => void;
  loading?: boolean;
  disabled?: boolean;
  alreadyPurchased?: boolean;
  index?: number;
}

export function PurchaseCard({
  product,
  onPurchase,
  loading = false,
  disabled = false,
  alreadyPurchased = false,
  index = 0,
}: PurchaseCardProps) {
  const IconComponent = product.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className={`relative h-full transition-all duration-300 hover:shadow-lg ${
          product.popular
            ? "border-2 border-primary shadow-xl ring-1 ring-primary/20"
            : "border-border/50 hover:border-primary/30"
        } ${alreadyPurchased ? "bg-green-950/20 border-green-500/30" : ""}`}
      >
        {product.popular && !alreadyPurchased && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <Badge className="bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold">
              Best Value
            </Badge>
          </div>
        )}
        
        {alreadyPurchased && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <Badge className="bg-green-600 text-white px-4 py-1 text-xs font-semibold">
              ✓ Purchased
            </Badge>
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                product.popular
                  ? "bg-primary/20 text-primary"
                  : alreadyPurchased
                  ? "bg-green-500/20 text-green-500"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold">{product.price}</span>
                <span className="text-xs text-muted-foreground">one-time</span>
              </div>
            </div>
          </div>
          
          <CardDescription className="text-sm">
            {product.description}
          </CardDescription>
          
          {product.savings && !alreadyPurchased && (
            <Badge
              variant="outline"
              className="mt-2 text-green-500 border-green-500/30 bg-green-500/10 w-fit"
            >
              {product.savings}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {product.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className={`w-full ${
              product.popular && !alreadyPurchased
                ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                : ""
            }`}
            variant={alreadyPurchased ? "outline" : product.popular ? "default" : "secondary"}
            onClick={() => onPurchase(product.planKey)}
            disabled={loading || disabled || alreadyPurchased}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : alreadyPurchased ? (
              "Already Unlocked"
            ) : (
              `Buy Now - ${product.price}`
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PurchaseCard;

