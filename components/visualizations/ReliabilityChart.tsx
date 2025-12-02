"use client";

import { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ErrorBar,
  ReferenceLine,
} from "recharts";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface ReliabilityData {
  name: string;
  value: number;
  min: number;
  max: number;
  color: string;
  status: "poor" | "moderate" | "good";
  description: string;
}

const reliabilityData: ReliabilityData[] = [
  {
    name: "MBTI",
    value: 57.5, // midpoint of 39-76
    min: 39,
    max: 76,
    color: "#ef4444", // red
    status: "poor",
    description: "39-76% get different results when retaking after 5 weeks",
  },
  {
    name: "CliftonStrengths",
    value: 70,
    min: 65,
    max: 75,
    color: "#f59e0b", // amber
    status: "moderate",
    description: "Limited independent validation; proprietary methodology",
  },
  {
    name: "Big Five",
    value: 80,
    min: 75,
    max: 85,
    color: "#3b82f6", // blue
    status: "good",
    description: "Well-validated but lacks Honesty-Humility dimension",
  },
  {
    name: "PRISM-7",
    value: 88.5, // midpoint of 85-92
    min: 85,
    max: 92,
    color: "#10b981", // green
    status: "good",
    description: "85-92% consistency with confidence intervals",
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ReliabilityData;
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="font-semibold text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Reliability: <span className="font-medium">{data.min}-{data.max}%</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          {data.description}
        </p>
      </div>
    );
  }
  return null;
};

interface ReliabilityChartProps {
  showTitle?: boolean;
  className?: string;
  compact?: boolean;
}

export function ReliabilityChart({ 
  showTitle = true, 
  className = "",
  compact = false 
}: ReliabilityChartProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [animatedData, setAnimatedData] = useState(
    reliabilityData.map((d) => ({ ...d, value: 0 }))
  );

  useEffect(() => {
    if (isInView) {
      // Animate bars sequentially
      reliabilityData.forEach((item, index) => {
        setTimeout(() => {
          setAnimatedData((prev) =>
            prev.map((d, i) => (i === index ? { ...d, value: item.value } : d))
          );
        }, index * 200);
      });
    }
  }, [isInView]);

  const chartHeight = compact ? 200 : 300;

  const content = (
    <div ref={ref} className={className}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={animatedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: compact ? 80 : 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: compact ? 11 : 13, fill: "hsl(var(--foreground))", fontWeight: 500 }}
            width={compact ? 75 : 95}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={80} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" opacity={0.5} />
          <Bar
            dataKey="value"
            radius={[0, 4, 4, 0]}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {animatedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
            ))}
            <ErrorBar
              dataKey={(d: ReliabilityData) => [d.value - d.min, d.max - d.value]}
              stroke="hsl(var(--foreground))"
              strokeWidth={1.5}
              width={8}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend / Status indicators */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-4 flex flex-wrap gap-3 justify-center"
        >
          {reliabilityData.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 text-sm"
            >
              {item.status === "poor" ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : item.status === "moderate" ? (
                <Info className="h-4 w-4 text-amber-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              <span className="text-muted-foreground">{item.name}</span>
              <Badge
                variant="outline"
                className={`text-xs ${
                  item.status === "poor"
                    ? "border-red-500/30 text-red-600"
                    : item.status === "moderate"
                    ? "border-amber-500/30 text-amber-600"
                    : "border-green-500/30 text-green-600"
                }`}
              >
                {item.min}-{item.max}%
              </Badge>
            </div>
          ))}
        </motion.div>
      )}

      {/* Threshold label */}
      {!compact && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground mt-3"
        >
          Dashed line indicates 80% reliability threshold (scientific standard)
        </motion.p>
      )}
    </div>
  );

  if (showTitle) {
    return (
      <Card className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Test-Retest Reliability Comparison</CardTitle>
          <CardDescription>
            How consistent are results when the same person retakes the test?
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}

export default ReliabilityChart;

