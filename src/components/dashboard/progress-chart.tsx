"use client";

const trendData = [
  { session: "S1", optimization: 78, edgeCase: 72, logical: 70 },
  { session: "S2", optimization: 73, edgeCase: 68, logical: 66 },
  { session: "S3", optimization: 66, edgeCase: 61, logical: 60 },
  { session: "S4", optimization: 58, edgeCase: 55, logical: 54 },
  { session: "S5", optimization: 49, edgeCase: 46, logical: 48 },
];

const weaknessDistribution = [
  { label: "Approach", value: 58 },
  { label: "Edge Cases", value: 46 },
  { label: "Optimization", value: 49 },
  { label: "Data Structures", value: 41 },
  { label: "Time Mgmt", value: 52 },
];

function LineTrack({ values, color }: { values: number[]; color: string }) {
  const points = values.map((value, index) => `${index * 85 + 12},${160 - value * 1.6}`).join(" ");
  return <polyline fill="none" stroke={color} strokeWidth="3" points={points} />;
}

export function ProgressChart() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <p className="mb-3 text-sm font-semibold">Weakness Trend Across Sessions</p>
        <svg viewBox="0 0 380 170" className="h-56 w-full rounded-md bg-muted/30 p-2">
          {[0, 1, 2, 3].map((row) => (
            <line key={row} x1="10" x2="360" y1={40 + row * 30} y2={40 + row * 30} stroke="hsl(var(--border))" />
          ))}
          <LineTrack values={trendData.map((d) => d.optimization)} color="hsl(var(--primary))" />
          <LineTrack values={trendData.map((d) => d.edgeCase)} color="#a16207" />
          <LineTrack values={trendData.map((d) => d.logical)} color="#b91c1c" />
        </svg>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
            Optimization
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#a16207]" />
            Edge Case
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#b91c1c]" />
            Logical
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-4">
        <p className="mb-3 text-sm font-semibold">Current Weakness Distribution</p>
        <div className="space-y-3">
          {weaknessDistribution.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold">{item.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary/80" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

