import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartColors } from "@/hooks/use-chart-colors";
import { useContainerSize } from "@/hooks/use-container-size";
import { generateFullMonthData } from "@/lib/chart-utils";
import { minutesToHours, timeToMinutes } from "@/lib/work-calculator";
import type { WorkRecord } from "@/types/work-record";

interface OvertimeSummaryChartProps {
  records: WorkRecord[];
}

export function OvertimeSummaryChart({ records }: OvertimeSummaryChartProps) {
  const [containerRef, { width }] = useContainerSize<HTMLDivElement>();
  const colors = useChartColors();
  const fullData = generateFullMonthData(records);

  let cumulative = 0;
  const data = fullData.map((d) => {
    if (!d.isWeekend && d.overtimeHours > 0) {
      const record = records.find((r) => r.date.getDate() === d.day);
      if (record) {
        cumulative += timeToMinutes(record.overtimeHours);
      }
    }

    return {
      day: d.day,
      daily: d.overtimeHours,
      cumulative: minutesToHours(cumulative),
    };
  });

  const totalOvertime = minutesToHours(cumulative);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>残業時間累計</CardTitle>
          <CardDescription>データがありません</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chartWidth = width || 400;
  const chartHeight = 220;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">残業時間累計</CardTitle>
        <CardDescription className="text-sm">
          月間合計: {totalOvertime.toFixed(1)}時間
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} style={{ width: "100%" }}>
          {width > 0 && (
            <AreaChart width={chartWidth} height={chartHeight} data={data}>
              <defs>
                <linearGradient id="overtimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.chart3} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colors.chart3} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 9, fill: colors.mutedForeground }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: colors.mutedForeground }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}h`}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: colors.foreground,
                }}
                formatter={(value, name) => [
                  `${Number(value ?? 0).toFixed(1)}h`,
                  name === "daily" ? "当日" : "累計",
                ]}
                labelFormatter={(label) => `${label}日`}
              />
              <Area
                type="stepAfter"
                dataKey="cumulative"
                stroke={colors.chart3}
                strokeWidth={2}
                fill="url(#overtimeGradient)"
              />
            </AreaChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
