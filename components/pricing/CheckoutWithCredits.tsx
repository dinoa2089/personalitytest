"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Coins, Sparkles, Check, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import type { LucideIcon } from "lucide-react";

interface CheckoutWithCreditsProps {
  productName: string;
  productKey: string;
  price: number; // in dollars
  sessionId?: string | null;
  icon?: LucideIcon;
  onSuccess?: () => void;
  variant?: "default" | "compact" | "inline";
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function CheckoutWithCredits({
  productName,
  productKey,
  price,
  sessionId,
  icon: Icon,
  onSuccess,
  variant = "default",
  className = "",
  disabled = false,
  children,
}: CheckoutWithCreditsProps) {
  const { user } = useUser();
  const [creditBalance, setCreditBalance] = useState(0);
  const [applyCredits, setApplyCredits] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // Fetch credit balance
  useEffect(() => {
    async function fetchCredits() {
      if (!user?.id) {
        setLoadingBalance(false);
        return;
      }

      try {
        const response = await fetch("/api/credits/balance");
        if (response.ok) {
          const data = await response.json();
          setCreditBalance(data.balance || 0);
        }
      } catch (error) {
        console.error("Error fetching credit balance:", error);
      } finally {
        setLoadingBalance(false);
      }
    }

    fetchCredits();
  }, [user?.id]);

  const creditsToApply = applyCredits ? Math.min(creditBalance, price) : 0;
  const finalPrice = price - creditsToApply;
  const canPayWithCreditsOnly = creditsToApply >= price;

  const handleCheckout = useCallback(async () => {
    if (!user?.id) {
      toast.error("Please sign in to purchase");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: productKey,
          userId: user.id,
          clerkId: user.id,
          sessionId: sessionId,
          applyCredits: applyCredits && creditBalance > 0,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      // If paid entirely with credits
      if (data.paidWithCredits) {
        toast.success(`Unlocked ${productName} with credits!`);
        setCreditBalance(data.newBalance);
        onSuccess?.();

        // Redirect to success URL if provided
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        }
        return;
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout");
    } finally {
      setLoading(false);
    }
  }, [user?.id, productKey, sessionId, applyCredits, creditBalance, productName, onSuccess]);

  // Compact inline variant - just shows button with credit discount
  if (variant === "inline") {
    return (
      <Button
        onClick={handleCheckout}
        disabled={disabled || loading}
        className={className}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : Icon ? (
          <Icon className="h-4 w-4 mr-2" />
        ) : null}
        {canPayWithCreditsOnly ? (
          <>Free with Credits</>
        ) : creditsToApply > 0 ? (
          <>${finalPrice.toFixed(2)} (was ${price.toFixed(2)})</>
        ) : (
          <>${price.toFixed(2)}</>
        )}
      </Button>
    );
  }

  // Compact variant - smaller card
  if (variant === "compact") {
    return (
      <div className={`space-y-3 ${className}`}>
        {creditBalance > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-500" />
              <span className="text-sm">
                ${creditBalance.toFixed(2)} credits available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="apply-credits-compact" className="text-sm">Apply</Label>
              <Switch
                id="apply-credits-compact"
                checked={applyCredits}
                onCheckedChange={setApplyCredits}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleCheckout}
          disabled={disabled || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : canPayWithCreditsOnly ? (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Unlock with Credits
            </>
          ) : (
            <>
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {creditsToApply > 0 ? (
                <>
                  Pay ${finalPrice.toFixed(2)}
                  <Badge variant="outline" className="ml-2 text-green-500 border-green-500/30">
                    -${creditsToApply.toFixed(2)}
                  </Badge>
                </>
              ) : (
                <>Pay ${price.toFixed(2)}</>
              )}
            </>
          )}
        </Button>
        {children}
      </div>
    );
  }

  // Default variant - full card with all details
  return (
    <Card className={`border-border/50 ${className}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <h3 className="font-semibold">{productName}</h3>
              <p className="text-sm text-muted-foreground">One-time purchase</p>
            </div>
          </div>
          <div className="text-right">
            {creditsToApply > 0 ? (
              <>
                <p className="text-sm text-muted-foreground line-through">
                  ${price.toFixed(2)}
                </p>
                <p className="text-2xl font-bold text-green-500">
                  ${finalPrice.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold">${price.toFixed(2)}</p>
            )}
          </div>
        </div>

        {/* Credit Balance Section */}
        {!loadingBalance && creditBalance > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Your Credit Balance</span>
              </div>
              <span className="text-lg font-bold text-amber-500">
                ${creditBalance.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="apply-credits" className="cursor-pointer">
                Apply credits to this purchase
              </Label>
              <Switch
                id="apply-credits"
                checked={applyCredits}
                onCheckedChange={setApplyCredits}
              />
            </div>

            {applyCredits && (
              <div className="text-sm space-y-1 pt-2 border-t border-amber-500/20">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original price</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span>Credits applied</span>
                  <span>-${creditsToApply.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-1 border-t border-amber-500/20">
                  <span>You pay</span>
                  <span>{finalPrice === 0 ? "FREE!" : `$${finalPrice.toFixed(2)}`}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {loadingBalance && creditBalance === 0 && user?.id && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          disabled={disabled || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : canPayWithCreditsOnly ? (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Unlock with Credits
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              {finalPrice > 0 ? `Pay $${finalPrice.toFixed(2)}` : "Unlock Now"}
            </>
          )}
        </Button>

        {children}
      </CardContent>
    </Card>
  );
}

