"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Ban,
  Eye,
  EyeOff,
  Activity,
  AlertTriangle,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

interface ApiKey {
  id: string;
  key_prefix: string;
  tier: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

interface UsageStats {
  totalThisMonth: number;
  totalToday: number;
  avgLatencyMs: number;
  errorRate: number;
  byEndpoint: Record<string, number>;
}

const TIER_LIMITS: Record<string, number> = {
  api_starter: 1000,
  professional: 500,
  enterprise: 10000,
};

const TIER_COLORS: Record<string, string> = {
  api_starter: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  professional: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  enterprise: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

export function ApiKeysManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showKey, setShowKey] = useState(true);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await fetch("/api/v1/keys");
      if (response.ok) {
        const data = await response.json();
        setKeys(data.keys || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  };

  const createKey = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "api_starter" }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewKey(data.apiKey);
        setShowKey(true);
        toast.success("API key created!");
        fetchKeys();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create API key");
      }
    } catch (error) {
      console.error("Failed to create API key:", error);
      toast.error("Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  };

  const copyKey = async () => {
    if (newKey) {
      await navigator.clipboard.writeText(newKey);
      setCopiedKey(true);
      toast.success("API key copied to clipboard!");
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const revokeKey = async (keyId: string) => {
    setDeletingKeyId(keyId);
    try {
      const response = await fetch(`/api/v1/keys?keyId=${keyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("API key revoked");
        fetchKeys();
      } else {
        toast.error("Failed to revoke API key");
      }
    } catch (error) {
      console.error("Failed to revoke API key:", error);
      toast.error("Failed to revoke API key");
    } finally {
      setDeletingKeyId(null);
    }
  };

  const deleteKey = async (keyId: string) => {
    if (!confirm("Permanently delete this API key? This cannot be undone.")) {
      return;
    }

    setDeletingKeyId(keyId);
    try {
      const response = await fetch(`/api/v1/keys?keyId=${keyId}&permanent=true`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("API key deleted");
        fetchKeys();
      } else {
        toast.error("Failed to delete API key");
      }
    } catch (error) {
      console.error("Failed to delete API key:", error);
      toast.error("Failed to delete API key");
    } finally {
      setDeletingKeyId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const activeKey = keys.find((k) => k.is_active);
  const usagePercentage = activeKey && stats
    ? Math.round((stats.totalThisMonth / TIER_LIMITS[activeKey.tier]) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
            <CardDescription>
              Manage your Personality Intelligence API keys
            </CardDescription>
          </div>
          <Button
            onClick={createKey}
            disabled={isCreating}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? "Creating..." : "Create Key"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Key Display */}
        <AnimatePresence>
          {newKey && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium text-sm">
                    Save this key now - it won&apos;t be shown again!
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-background/50 px-3 py-2 rounded font-mono text-sm break-all">
                    {showKey ? newKey : "•".repeat(40)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyKey}
                    className={copiedKey ? "text-green-500" : ""}
                  >
                    {copiedKey ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNewKey(null)}
                  className="text-muted-foreground"
                >
                  I&apos;ve saved my key
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Usage Stats */}
        {stats && activeKey && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.totalThisMonth}</div>
              <div className="text-xs text-muted-foreground">
                Requests this month
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {usagePercentage}% of {TIER_LIMITS[activeKey.tier].toLocaleString()} limit
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.totalToday}</div>
              <div className="text-xs text-muted-foreground">Requests today</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.avgLatencyMs}ms</div>
              <div className="text-xs text-muted-foreground">Avg latency</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.errorRate}%</div>
              <div className="text-xs text-muted-foreground">Error rate</div>
            </div>
          </div>
        )}

        {/* API Keys List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading API keys...
          </div>
        ) : keys.length === 0 ? (
          <div className="text-center py-8">
            <Key className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">No API keys yet</p>
            <p className="text-sm text-muted-foreground">
              Create an API key to start using the Personality Intelligence API
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  key.is_active
                    ? "bg-card"
                    : "bg-muted/30 opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      key.is_active
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm">
                        {key.key_prefix}...
                      </code>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          TIER_COLORS[key.tier] || "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {key.tier.replace("_", " ")}
                      </span>
                      {!key.is_active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                          Revoked
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Created {formatDate(key.created_at)}
                      {key.last_used_at && (
                        <> • Last used {formatDate(key.last_used_at)}</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {key.is_active ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => revokeKey(key.id)}
                      disabled={deletingKeyId === key.id}
                      title="Revoke key"
                    >
                      <Ban className="h-4 w-4 text-yellow-500" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteKey(key.id)}
                      disabled={deletingKeyId === key.id}
                      title="Delete permanently"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Start Guide */}
        <div className="border-t pt-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Quick Start
          </h4>
          <div className="bg-muted/50 rounded-lg p-4">
            <code className="text-xs block whitespace-pre-wrap font-mono">
{`curl -X GET https://yourapp.vercel.app/api/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
            </code>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Replace YOUR_API_KEY with your actual API key. See{" "}
            <a href="/docs/api" className="text-primary hover:underline">
              API documentation
            </a>{" "}
            for more details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}


