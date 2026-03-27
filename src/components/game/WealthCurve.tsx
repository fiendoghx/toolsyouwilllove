"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WealthHistoryPoint } from "@/types/game";
import { formatUsd } from "@/lib/formatters";

interface WealthCurveProps {
  data: WealthHistoryPoint[];
}

const tooltipStyle = {
  borderRadius: "18px",
  border: "1px solid rgba(212,168,83,0.2)",
  background: "rgba(12,12,12,0.96)",
  color: "#fff1cb",
};

const legendStyle = { color: "#d0bea0", fontSize: "12px" };

function ChartLines() {
  return (
    <>
      <Line
        type="monotone"
        dataKey="playerAssets"
        name="你"
        stroke="#f5e7c2"
        strokeWidth={3}
        dot={false}
        activeDot={{ r: 5, fill: "#f5e7c2" }}
      />
      <Line
        type="monotone"
        dataKey="companionAssets"
        name="Elon Musk"
        stroke="#7b8aa8"
        strokeWidth={2.5}
        dot={false}
        strokeDasharray="8 6"
        activeDot={{ r: 5, fill: "#7b8aa8" }}
      />
      <Line
        type="monotone"
        dataKey="buffettAssets"
        name="巴菲特"
        stroke="#d4a853"
        strokeWidth={3}
        dot={false}
        activeDot={{ r: 5, fill: "#d4a853" }}
      />
    </>
  );
}

function SingleChart({
  data,
  title,
}: {
  data: WealthHistoryPoint[];
  title: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-accent/70">
        {title}
      </p>
      <div className="h-72 w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
          <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 6 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#b3a07a", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#8d7b58", fontSize: 11 }}
              tickFormatter={(value: number) => formatUsd(value, true)}
              width={80}
            />
            <Tooltip
              formatter={(value, name) => [
                formatUsd(Number(value ?? 0)),
                String(name ?? ""),
              ]}
              contentStyle={tooltipStyle}
              labelStyle={{ color: "#bda980" }}
            />
            <Legend wrapperStyle={legendStyle} />
            <ChartLines />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function WealthCurve({ data }: WealthCurveProps) {
  // data[0] 是"起点"，data[1..5] 是前5轮，data[6..10] 是后5轮
  // 分割点：前半包含 起点 + 前5个节点（索引 0-5），后半包含 第5个节点 + 后5个节点（索引 5-10）
  // 两段共享第5个节点作为衔接点
  const midIndex = Math.ceil(data.length / 2);
  const firstHalf = data.slice(0, midIndex + 1);
  const secondHalf = data.slice(midIndex);

  if (data.length <= 3) {
    return <SingleChart data={data} title="财富曲线" />;
  }

  return (
    <div className="grid gap-6">
      <SingleChart data={firstHalf} title="前期（早年积累）" />
      <SingleChart data={secondHalf} title="后期（资本爆发）" />
    </div>
  );
}
