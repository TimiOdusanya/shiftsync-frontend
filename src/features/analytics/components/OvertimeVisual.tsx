"use client";

import { BarChart, Bar, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from "recharts";

const CAP = 44;
const WARNING_AT = 35;
const OT_AT = 40;

const COLORS = {
  safe: "hsl(142 56% 42%)",
  warning: "hsl(38 92% 48%)",
  over: "hsl(0 72% 48%)",
  reference: "hsl(var(--border))",
  text: "hsl(var(--foreground) / 0.8)",
};

interface OvertimeVisualProps {
  projectedHours: number;
  weekLabel: string;
}

export function OvertimeVisual({ projectedHours, weekLabel }: OvertimeVisualProps) {
  const barColor =
    projectedHours >= OT_AT ? COLORS.over : projectedHours >= WARNING_AT ? COLORS.warning : COLORS.safe;

  const data = [{ week: weekLabel, hours: Math.min(projectedHours, CAP), actual: projectedHours }];

  return (
    <div className="h-[72px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
          <XAxis dataKey="week" hide />
          <YAxis
            domain={[0, CAP]}
            tick={{ fill: COLORS.text, fontSize: 11 }}
            tickFormatter={(v) => `${v}h`}
            width={32}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.[0] ? (
                <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-lg">
                  <span className="text-muted-foreground">Projected: </span>
                  <span className="font-medium text-foreground">{payload[0].payload.actual.toFixed(1)}h</span>
                </div>
              ) : null
            }
          />
          <ReferenceLine y={OT_AT} stroke={COLORS.reference} strokeDasharray="4 3" strokeWidth={1.5} />
          <Bar
            dataKey="hours"
            fill={barColor}
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-center text-xs text-muted-foreground">40h = overtime threshold</p>
    </div>
  );
}
