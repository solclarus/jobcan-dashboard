import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartColors } from "@/hooks/use-chart-colors";
import { useContainerSize } from "@/hooks/use-container-size";
import { getMonthlyStats } from "@/lib/work-calculator";
import type { WorkRecord } from "@/types/work-record";

interface MonthlyComparisonChartProps {
  currentRecords: WorkRecord[];
  previousRecords: WorkRecord[];
  currentMonth: string;
  previousMonth: string;
}

export function MonthlyComparisonChart({
  currentRecords,
  previousRecords,
  currentMonth,
  previousMonth,
}: MonthlyComparisonChartProps) {
  const [containerRef, { width }] = useContainerSize<HTMLDivElement>();
  const colors = useChartColors();
  const current = getMonthlyStats(currentRecords);
  const previous = getMonthlyStats(previousRecords);

  const data = [
    {
      name: "勤務日数",
      [previousMonth]: previous.totalWorkDays,
      [currentMonth]: current.totalWorkDays,
    },
    {
      name: "総労働時間",
      [previousMonth]: Math.round(previous.totalWorkHours),
      [currentMonth]: Math.round(current.totalWorkHours),
    },
    {
      name: "残業時間",
      [previousMonth]: Math.round(previous.totalOvertimeHours),
      [currentMonth]: Math.round(current.totalOvertimeHours),
    },
  ];

  const hasPrevious = previousRecords.length > 0;
  const chartWidth = width || 400;
  const chartHeight = 220;

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">月次比較</CardTitle>
        <CardDescription className="text-sm">
          {hasPrevious ? `${previousMonth} vs ${currentMonth}` : currentMonth}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} style={{ width: "100%" }}>
          {width > 0 && (
            <BarChart
              width={chartWidth}
              height={chartHeight}
              data={data}
              layout="vertical"
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke={colors.border}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: colors.mutedForeground }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: colors.mutedForeground }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: colors.foreground,
                }}
              />
              {hasPrevious && (
                <Bar
                  dataKey={previousMonth}
                  fill={colors.mutedForeground}
                  radius={[0, 4, 4, 0]}
                  maxBarSize={24}
                />
              )}
              <Bar
                dataKey={currentMonth}
                fill={colors.chart1}
                radius={[0, 4, 4, 0]}
                maxBarSize={24}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="rect" iconSize={10} />
            </BarChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
