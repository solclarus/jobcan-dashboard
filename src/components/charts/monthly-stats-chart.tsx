import {
  Bar,
  ComposedChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartColors } from "@/hooks/use-chart-colors";
import type { MonthlyStatsWithLabel } from "@/stores/use-work-store";
import { TrendingUp } from "lucide-react";

interface MonthlyStatsChartProps {
  stats: MonthlyStatsWithLabel[];
  selectedMonth?: string;
}

export function MonthlyStatsChart({ stats, selectedMonth }: MonthlyStatsChartProps) {
  const colors = useChartColors();

  if (stats.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-chart-5/15 text-chart-5">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <CardTitle className="text-base font-medium">月別統計</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">データがありません</p>
        </CardContent>
      </Card>
    );
  }

  const data = stats.map((s) => ({
    ...s,
    label: `${s.monthNum}月`,
    isSelected: s.month === selectedMonth,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-chart-5/15 text-chart-5">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <CardTitle className="text-base font-medium">月別統計</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: colors.mutedForeground }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="hours"
              orientation="left"
              tick={{ fontSize: 10, fill: colors.mutedForeground }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}h`}
              width={40}
            />
            <YAxis
              yAxisId="days"
              orientation="right"
              tick={{ fontSize: 10, fill: colors.mutedForeground }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}日`}
              width={35}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border border-border bg-background p-2 shadow-sm">
                    <p className="text-sm font-medium text-foreground">{d.month}</p>
                    <p className="text-sm text-muted-foreground">勤務日数: {d.totalWorkDays}日</p>
                    <p className="text-sm text-muted-foreground">
                      総労働: {d.totalWorkHours.toFixed(1)}h
                    </p>
                    <p className="text-sm text-muted-foreground">
                      残業: {d.totalOvertimeHours.toFixed(1)}h
                    </p>
                    <p className="text-sm text-muted-foreground">
                      平均: {d.averageWorkHours.toFixed(1)}h/日
                    </p>
                  </div>
                );
              }}
            />
            {/* 総労働時間（棒グラフ） */}
            <Bar dataKey="totalWorkHours" yAxisId="hours" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isSelected ? colors.chart1 : colors.chart1}
                  fillOpacity={entry.isSelected ? 1 : 0.5}
                />
              ))}
            </Bar>
            {/* 残業時間（線グラフ） */}
            <Line
              type="monotone"
              dataKey="totalOvertimeHours"
              yAxisId="hours"
              stroke={colors.chart4}
              strokeWidth={2}
              dot={{ r: 4, fill: colors.chart4 }}
              activeDot={{ r: 6 }}
            />
            {/* 勤務日数（線グラフ） */}
            <Line
              type="monotone"
              dataKey="totalWorkDays"
              yAxisId="days"
              stroke={colors.chart2}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: colors.chart2 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        {/* 凡例 */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: colors.chart1 }} />
            <span>総労働時間</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-0.5 w-4" style={{ backgroundColor: colors.chart4 }} />
            <span>残業時間</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-0.5 w-4"
              style={{ backgroundColor: colors.chart2, borderStyle: "dashed" }}
            />
            <span>勤務日数</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
