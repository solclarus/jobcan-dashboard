import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChartData } from "@/lib/work-calculator";
import type { WorkRecord } from "@/types/work-record";

interface WorkHoursChartProps {
  records: WorkRecord[];
}

export function WorkHoursChart({ records }: WorkHoursChartProps) {
  const data = getChartData(records);

  return (
    <Card>
      <CardHeader>
        <CardTitle>日別労働時間</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <p className="text-sm font-medium">{payload[0].payload.date}</p>
                      <p className="text-sm text-muted-foreground">労働: {payload[0].value}h</p>
                      <p className="text-sm text-muted-foreground">
                        残業: {payload[1]?.value || 0}h
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="workHours"
              fill="var(--color-chart-1)"
              radius={[4, 4, 0, 0]}
              name="労働時間"
            />
            <Bar
              dataKey="overtimeHours"
              fill="var(--color-chart-3)"
              radius={[4, 4, 0, 0]}
              name="残業時間"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
