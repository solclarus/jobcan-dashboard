import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateFullMonthData, getDayTypeConfig, type DayData } from "@/lib/chart-utils";
import { useContainerSize } from "@/hooks/use-container-size";
import { useChartColors } from "@/hooks/use-chart-colors";
import type { WorkRecord } from "@/types/work-record";

interface DailyWorkChartProps {
  records: WorkRecord[];
}

export function DailyWorkChart({ records }: DailyWorkChartProps) {
  const [containerRef, { width }] = useContainerSize<HTMLDivElement>();
  const colors = useChartColors();
  const dayTypeConfig = getDayTypeConfig(colors);
  const data = generateFullMonthData(records);

  const getBarColor = (entry: DayData): string => {
    const config = dayTypeConfig[entry.dayType];
    if (entry.dayType === "normal" && entry.workHours > 9) {
      return colors.chart4;
    }
    return config.color;
  };

  if (data.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>日別労働時間</CardTitle>
          <CardDescription>データがありません</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chartWidth = width || 600;
  const chartHeight = 200;

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">日別労働時間</CardTitle>
        <CardDescription className="text-sm">基準: 8時間 / 日</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} style={{ width: "100%" }}>
          {width > 0 && (
            <BarChart width={chartWidth} height={chartHeight} data={data} barCategoryGap="8%">
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
                domain={[0, 12]}
                ticks={[0, 4, 8, 12]}
                width={35}
              />
              <ReferenceLine
                y={8}
                stroke={colors.chart2}
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
              <Tooltip
                cursor={{ fill: colors.muted, opacity: 0.2 }}
                contentStyle={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: colors.foreground,
                }}
                formatter={(value, name) => [
                  `${Number(value ?? 0).toFixed(1)}h`,
                  name === "workHours" ? "労働時間" : "残業時間",
                ]}
                labelFormatter={(label) => `${label}日`}
              />
              <Bar dataKey="workHours" stackId="work" radius={[0, 0, 0, 0]} maxBarSize={16}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry)}
                    fillOpacity={entry.hasWork ? 0.9 : 0.3}
                  />
                ))}
              </Bar>
              <Bar dataKey="overtimeHours" stackId="work" radius={[2, 2, 0, 0]} maxBarSize={16}>
                {data.map((entry, index) => (
                  <Cell
                    key={`overtime-${index}`}
                    fill={colors.chart3}
                    fillOpacity={entry.hasWork ? 0.8 : 0}
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
