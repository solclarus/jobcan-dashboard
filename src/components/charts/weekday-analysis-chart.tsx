import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { minutesToHours, timeToMinutes } from "@/lib/work-calculator";
import { useContainerSize } from "@/hooks/use-container-size";
import { useChartColors } from "@/hooks/use-chart-colors";
import type { WorkRecord } from "@/types/work-record";

interface WeekdayAnalysisChartProps {
  records: WorkRecord[];
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function WeekdayAnalysisChart({ records }: WeekdayAnalysisChartProps) {
  const [containerRef, { width }] = useContainerSize<HTMLDivElement>();
  const colors = useChartColors();

  const data = WEEKDAYS.map((day, index) => {
    const dayRecords = records.filter(
      (r) => r.date.getDay() === index && r.workTime && r.holidayType !== "公休",
    );

    const totalMinutes = dayRecords.reduce((sum, r) => sum + timeToMinutes(r.workTime), 0);
    const overtimeMinutes = dayRecords.reduce((sum, r) => sum + timeToMinutes(r.overtimeHours), 0);
    const avgHours = dayRecords.length > 0 ? minutesToHours(totalMinutes / dayRecords.length) : 0;
    const avgOvertime =
      dayRecords.length > 0 ? minutesToHours(overtimeMinutes / dayRecords.length) : 0;

    return {
      day,
      avgHours,
      avgOvertime,
      count: dayRecords.length,
      isWeekend: index === 0 || index === 6,
    };
  });

  const chartWidth = width || 400;
  const chartHeight = 220;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">曜日別労働時間</CardTitle>
        <CardDescription className="text-sm">平均労働時間と残業時間</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} style={{ width: "100%" }}>
          {width > 0 && (
            <BarChart width={chartWidth} height={chartHeight} data={data} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: colors.mutedForeground }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: colors.mutedForeground }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}h`}
                domain={[0, 12]}
                width={35}
              />
              <Tooltip
                cursor={{ fill: colors.muted, opacity: 0.3 }}
                contentStyle={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: colors.foreground,
                }}
                formatter={(value, name) => [
                  `${Number(value ?? 0).toFixed(1)}h`,
                  name === "avgHours" ? "平均労働" : "平均残業",
                ]}
                labelFormatter={(label) => `${label}曜日`}
              />
              <Bar dataKey="avgHours" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={40}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isWeekend ? colors.mutedForeground : colors.chart1}
                    opacity={entry.count === 0 ? 0.3 : 1}
                  />
                ))}
              </Bar>
              <Bar dataKey="avgOvertime" stackId="a" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-overtime-${index}`}
                    fill={entry.isWeekend ? colors.muted : colors.chart3}
                    opacity={entry.count === 0 ? 0.3 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
