"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  interactions: {
    label: "Interactions",
    color: "#4a7dff",
  },
  aiReplies: {
    label: "AI Replies",
    color: "#6c2bd9",
  },
};

type Props = {
  data: {
    month: string;
    interactions: number;
    aiReplies: number;
  }[];
};

function Chart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-white/20 italic text-xs">
        Waiting for activity data...
      </div>
    );
  }

  return (
    <Card className="border-none bg-transparent p-0 shadow-none h-full">
      <CardContent className="p-0 h-full">
        <ResponsiveContainer height="100%" width="100%">
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ left: -10, right: 10, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillInteractions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a7dff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4a7dff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillAiReplies" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6c2bd9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6c2bd9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="interactions"
                type="monotone"
                fill="url(#fillInteractions)"
                stroke="#4a7dff"
                strokeWidth={2}
              />
              <Area
                dataKey="aiReplies"
                type="monotone"
                fill="url(#fillAiReplies)"
                stroke="#6c2bd9"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default Chart;
