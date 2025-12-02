"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle2, TrendingUp, Users, Award } from "lucide-react";

interface MetricGaugeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  description: string;
  color: string;
  icon: React.ElementType;
  delay?: number;
}

function MetricGauge({
  label,
  value,
  min,
  max,
  suffix = "%",
  description,
  color,
  icon: Icon,
  delay = 0,
}: MetricGaugeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const duration = 1000;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setAnimatedValue(value * eased);
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  // Calculate gauge percentage (assuming 100 is max for display)
  const gaugePercent = (animatedValue / 100) * 100;
  const gaugeData = [
    { value: gaugePercent },
    { value: 100 - gaugePercent },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: delay / 1000, duration: 0.4 }}
      className="rounded-xl border border-border/50 bg-card/80 p-4 text-center"
    >
      {/* Mini Gauge */}
      <div className="relative w-24 h-24 mx-auto mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={40}
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
            >
              <Cell fill={color} />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>

      {/* Value */}
      <div className="text-2xl font-bold text-foreground mb-1">
        {min !== max ? (
          <span>
            {min.toFixed(min % 1 === 0 ? 0 : 2)}-{max.toFixed(max % 1 === 0 ? 0 : 2)}
            {suffix}
          </span>
        ) : (
          <span>
            {animatedValue.toFixed(value % 1 === 0 ? 0 : 2)}
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="text-sm font-medium text-foreground mb-1">{label}</div>

      {/* Description */}
      <div className="text-xs text-muted-foreground">{description}</div>
    </motion.div>
  );
}

interface ValidationMetricsProps {
  showTitle?: boolean;
  className?: string;
}

export function ValidationMetrics({
  showTitle = true,
  className = "",
}: ValidationMetricsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const metrics = [
    {
      label: "Test-Retest Reliability",
      value: 88.5,
      min: 85,
      max: 92,
      suffix: "%",
      description: "Consistent results over time",
      color: "#10b981",
      icon: TrendingUp,
    },
    {
      label: "Internal Consistency",
      value: 0.865,
      min: 0.82,
      max: 0.91,
      suffix: "",
      description: "Cronbach's alpha coefficient",
      color: "#8b5cf6",
      icon: CheckCircle2,
    },
    {
      label: "Convergent Validity",
      value: 0.885,
      min: 0.85,
      max: 0.92,
      suffix: "",
      description: "Correlation with NEO-PI-R, HEXACO",
      color: "#3b82f6",
      icon: Award,
    },
    {
      label: "Validation Sample",
      value: 5000,
      min: 5000,
      max: 5000,
      suffix: "+",
      description: "Diverse participants tested",
      color: "#f59e0b",
      icon: Users,
    },
  ];

  const content = (
    <div ref={ref} className={className}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricGauge key={metric.label} {...metric} delay={index * 150} />
        ))}
      </div>

      {/* Context note */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50"
      >
        <div className="flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-500/30 text-green-600">
              Excellent
            </Badge>
            <span>Above 0.85</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500/30 text-blue-600">
              Good
            </Badge>
            <span>0.70-0.85</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-500/30 text-amber-600">
              Acceptable
            </Badge>
            <span>0.60-0.70</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Validation & Reliability Metrics</CardTitle>
          <CardDescription>
            Scientific measures of assessment quality
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default ValidationMetrics;

