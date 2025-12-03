"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

interface CreditData {
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  transactions: CreditTransaction[];
}

interface CreditBalanceProps {
  showTransactions?: boolean;
  className?: string;
}

export function CreditBalance({ showTransactions = false, className }: CreditBalanceProps) {
  const [credits, setCredits] = useState<CreditData>({
    balance: 0,
    lifetimeEarned: 0,
    lifetimeSpent: 0,
    transactions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/credits/balance")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setCredits(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="p-4">
          <div className="h-8 bg-muted rounded w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-500/20">
              <Coins className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">${credits.balance.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Available Credits</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {credits.lifetimeEarned > 0 && (
              <Badge variant="outline" className="text-green-600 border-green-500/30 bg-green-500/10">
                <TrendingUp className="h-3 w-3 mr-1" />
                ${credits.lifetimeEarned.toFixed(2)} earned
              </Badge>
            )}
            {credits.lifetimeSpent > 0 && (
              <Badge variant="outline" className="text-muted-foreground">
                ${credits.lifetimeSpent.toFixed(2)} used
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {showTransactions && credits.transactions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-sm">Recent Transactions</h4>
            <div className="space-y-2">
              {credits.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {tx.amount > 0 ? (
                      <ArrowDownRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{tx.description || getTypeLabel(tx.type)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "font-semibold",
                      tx.amount > 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {tx.amount > 0 ? "+" : ""}${tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    referral_bonus: "Referral Bonus",
    purchase_applied: "Applied to Purchase",
    admin_adjustment: "Admin Adjustment",
    expired: "Credits Expired",
    promo: "Promotional Credit",
  };
  return labels[type] || type;
}

