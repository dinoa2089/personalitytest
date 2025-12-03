"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureUpsellProps {
  title: string;
  description: string;
  price: string;
  productKey: string;
  icon?: LucideIcon;
  onPurchase: (productKey: string) => void;
  loading?: boolean;
  variant?: "default" | "compact" | "inline";
  accentColor?: "amber" | "pink" | "purple" | "green" | "blue";
}

const accentColors = {
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-950/10",
    iconBg: "bg-amber-500/20",
    iconText: "text-amber-400",
    buttonBg: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
  },
  pink: {
    border: "border-pink-500/30",
    bg: "bg-pink-950/10",
    iconBg: "bg-pink-500/20",
    iconText: "text-pink-400",
    buttonBg: "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
  },
  purple: {
    border: "border-purple-500/30",
    bg: "bg-purple-950/10",
    iconBg: "bg-purple-500/20",
    iconText: "text-purple-400",
    buttonBg: "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700",
  },
  green: {
    border: "border-green-500/30",
    bg: "bg-green-950/10",
    iconBg: "bg-green-500/20",
    iconText: "text-green-400",
    buttonBg: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
  },
  blue: {
    border: "border-blue-500/30",
    bg: "bg-blue-950/10",
    iconBg: "bg-blue-500/20",
    iconText: "text-blue-400",
    buttonBg: "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700",
  },
};

export function FeatureUpsell({
  title,
  description,
  price,
  productKey,
  icon: Icon,
  onPurchase,
  loading = false,
  variant = "default",
  accentColor = "amber",
}: FeatureUpsellProps) {
  const colors = accentColors[accentColor];

  if (variant === "inline") {
    return (
      <div className={`flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-dashed ${colors.border} ${colors.bg}`}>
        <div className="flex items-center gap-3">
          <Lock className={`h-4 w-4 ${colors.iconText}`} />
          <span className="font-medium">{title}</span>
        </div>
        <Button
          size="sm"
          className={`${colors.buttonBg} text-white border-0`}
          onClick={() => onPurchase(productKey)}
          disabled={loading}
        >
          {loading ? "..." : `Unlock ${price}`}
        </Button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`p-4 rounded-xl border-2 border-dashed ${colors.border} ${colors.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.iconBg}`}>
                <Icon className={`h-4 w-4 ${colors.iconText}`} />
              </div>
            )}
            <div>
              <h4 className="font-semibold text-sm">{title}</h4>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button
            size="sm"
            className={`${colors.buttonBg} text-white border-0`}
            onClick={() => onPurchase(productKey)}
            disabled={loading}
          >
            {loading ? "Processing..." : `Unlock - ${price}`}
          </Button>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`rounded-xl border-2 border-dashed ${colors.border} ${colors.bg} p-6`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg}`}>
              <Icon className={`h-6 w-6 ${colors.iconText}`} />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock className={`h-4 w-4 ${colors.iconText}`} />
              <h4 className="font-bold text-lg">{title}</h4>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">{description}</p>
          </div>
        </div>
        <Button
          className={`${colors.buttonBg} text-white border-0 min-w-[140px]`}
          onClick={() => onPurchase(productKey)}
          disabled={loading}
        >
          {loading ? (
            "Processing..."
          ) : (
            <>
              Unlock - {price}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function FullUnlockBanner({
  onPurchase,
  loading = false,
}: {
  onPurchase: (productKey: string) => void;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900/50 to-orange-950/20 p-6 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
        <div className="text-center md:text-left">
          <Badge className="mb-2 bg-amber-500/20 text-amber-400 border-amber-500/30">
            Best Value
          </Badge>
          <h4 className="font-bold text-lg mb-1">Want Everything?</h4>
          <p className="text-sm text-muted-foreground">
            Unlock all premium features for just <span className="text-amber-400 font-semibold">$7.99</span> — save ~$5
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0"
          onClick={() => onPurchase("full_unlock")}
          disabled={loading}
        >
          {loading ? "Processing..." : "Full Unlock - $7.99"}
        </Button>
      </div>
    </div>
  );
}

export default FeatureUpsell;

