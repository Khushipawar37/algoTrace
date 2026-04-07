"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { session: "S1", optimization: 78, edgeCase: 72, logical: 70 },
  { session: "S2", optimization: 73, edgeCase: 68, logical: 66 },
  { session: "S3", optimization: 66, edgeCase: 61, logical: 60 },
  { session: "S4", optimization: 58, edgeCase: 55, logical: 54 },
  { session: "S5", optimization: 49, edgeCase: 46, logical: 48 },
];

export function ProgressChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="session" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip />
          <Line type="monotone" dataKey="optimization" stroke="hsl(var(--primary))" strokeWidth={3} />
          <Line type="monotone" dataKey="edgeCase" stroke="#f59e0b" strokeWidth={2} />
          <Line type="monotone" dataKey="logical" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

