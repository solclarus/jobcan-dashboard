import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { minutesToHours, timeToMinutes } from "@/lib/work-calculator";
import type { WorkRecord } from "@/types/work-record";

interface OvertimeTrendChartProps {
  records: WorkRecord[];
}

export function OvertimeTrendChart({ records }: OvertimeTrendChartProps) {
  let cumulative = 0;
  const data = records
    .filter((r) => r.workTime && r.holidayType !== "公休")
    .map((r) => {
      cumulative += timeToMinutes(r.overtimeHours);
      return {
        date: `${r.date.getMonth() + 1}/${r.date.getDate()}`,
        overtime: minutesToHours(timeToMinutes(r.overtimeHours)),
        cumulative: minutesToHours(cumulative),
      };
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>残業時間推移</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorOvertime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}h`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <p className="text-sm font-medium">{payload[0].payload.date}</p>
                      <p className="text-sm text-muted-foreground">
                        当日: {payload[0].payload.overtime}h
                      </p>
                      <p className="text-sm text-muted-foreground">
                        累計: {payload[0].payload.cumulative}h
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="hsl(var(--chart-3))"
              fill="url(#colorOvertime)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
