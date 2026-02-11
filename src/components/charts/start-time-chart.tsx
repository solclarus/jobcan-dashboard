import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timeToMinutes, formatMinutesToTime } from "@/lib/work-calculator";
import type { WorkRecord } from "@/types/work-record";

interface StartTimeChartProps {
  records: WorkRecord[];
}

export function StartTimeChart({ records }: StartTimeChartProps) {
  const data = records
    .filter((r) => r.startTime && r.holidayType !== "公休")
    .map((r) => ({
      date: `${r.date.getMonth() + 1}/${r.date.getDate()}`,
      startMinutes: timeToMinutes(r.startTime),
      endMinutes: timeToMinutes(r.endTime),
      shiftStart: timeToMinutes(r.shiftStart),
    }));

  const shiftStartMinutes = data[0]?.shiftStart || 600;

  return (
    <Card>
      <CardHeader>
        <CardTitle>出退勤時刻</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              domain={[480, 1320]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatMinutesToTime(v)}
            />
            <ReferenceLine
              y={shiftStartMinutes}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{ value: "定時", position: "left", fontSize: 10 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <p className="text-sm font-medium">{p.date}</p>
                      <p className="text-sm text-muted-foreground">
                        出勤: {formatMinutesToTime(p.startMinutes)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        退勤: {formatMinutesToTime(p.endMinutes)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="startMinutes"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="出勤"
            />
            <Line
              type="monotone"
              dataKey="endMinutes"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="退勤"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
