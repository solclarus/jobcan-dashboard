import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { minutesToHours, timeToMinutes } from "@/lib/work-calculator";
import type { WorkRecord } from "@/types/work-record";

interface WeekdayRadarChartProps {
  records: WorkRecord[];
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function WeekdayRadarChart({ records }: WeekdayRadarChartProps) {
  const weekdayData = WEEKDAYS.map((day, index) => {
    const dayRecords = records.filter(
      (r) => r.date.getDay() === index && r.workTime && r.holidayType !== "公休",
    );
    const totalMinutes = dayRecords.reduce((sum, r) => sum + timeToMinutes(r.workTime), 0);
    const avgHours = dayRecords.length > 0 ? minutesToHours(totalMinutes / dayRecords.length) : 0;

    return {
      weekday: day,
      avgHours,
      count: dayRecords.length,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>曜日別平均労働時間</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={weekdayData}>
            <PolarGrid className="stroke-muted" />
            <PolarAngleAxis dataKey="weekday" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 12]}
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `${v}h`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <p className="text-sm font-medium">{p.weekday}曜日</p>
                      <p className="text-sm text-muted-foreground">
                        平均: {p.avgHours.toFixed(1)}h
                      </p>
                      <p className="text-sm text-muted-foreground">出勤日数: {p.count}日</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name="平均労働時間"
              dataKey="avgHours"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
