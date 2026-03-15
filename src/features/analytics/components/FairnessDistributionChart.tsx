"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = {
  regular: "hsl(215 25% 55%)",
  premium: "hsl(38 92% 48%)",
  grid: "hsl(var(--border) / 0.4)",
  text: "hsl(var(--foreground) / 0.8)",
  tooltipBg: "hsl(var(--card))",
  tooltipBorder: "hsl(var(--border))",
};

export interface DistributionDatum {
  userId: string;
  name: string;
  totalHours: number;
  premiumHours: number;
  regularHours: number;
}

interface FairnessDistributionChartProps {
  data: DistributionDatum[];
  maxHours: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length || !label) return null;
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-lg"
      style={{
        backgroundColor: CHART_COLORS.tooltipBg,
        borderColor: CHART_COLORS.tooltipBorder,
      }}
    >
      <p className="mb-1 font-medium text-foreground">{label}</p>
      <p className="text-sm text-muted-foreground">
        Total: <span className="font-medium text-foreground">{total.toFixed(1)}h</span>
      </p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs text-muted-foreground">
          {p.name}: {p.value?.toFixed(1) ?? 0}h
        </p>
      ))}
    </div>
  );
}

export function FairnessDistributionChart({ data, maxHours }: FairnessDistributionChartProps) {
  const yAxisWidth = Math.min(120, Math.max(60, data.length * 12));

  return (
    <div className="h-[280px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
          <XAxis
            type="number"
            domain={[0, Math.max(maxHours * 1.1, 10)]}
            tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
            tickFormatter={(v) => `${v}h`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={yAxisWidth}
            tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value) => (
              <span className="text-muted-foreground">{value}</span>
            )}
          />
          <Bar
            dataKey="regularHours"
            name="Regular"
            stackId="hours"
            fill={CHART_COLORS.regular}
            radius={[0, 2, 2, 0]}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="premiumHours"
            name="Premium (Fri/Sat eve)"
            stackId="hours"
            fill={CHART_COLORS.premium}
            radius={[0, 2, 2, 0]}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
