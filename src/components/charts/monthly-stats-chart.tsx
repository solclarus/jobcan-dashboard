import { Bar, ComposedChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartColors } from "@/hooks/use-chart-colors";
import { useContainerSize } from "@/hooks/use-container-size";
import type { MonthlyStatsWithLabel } from "@/stores/use-work-store";
import { TrendingUp } from "lucide-react";

interface MonthlyStatsChartProps {
  stats: MonthlyStatsWithLabel[];
  selectedMonth?: string;
}

export function MonthlyStatsChart({ stats, selectedMonth }: MonthlyStatsChartProps) {
  const [containerRef, { width }] = useContainerSize<HTMLDivElement>();
  const colors = useChartColors();

  const data = stats.map((s) => ({
    ...s,
    label: `${s.monthNum}月`,
    isSelected: s.month === selectedMonth,
  }));

  const minChartWidth = Math.max(data.length * 50, 400);
  const chartWidth = Math.max(width || 400, minChartWidth);
  const chartHeight = 240;
  const yAxisLeftWidth = 45;
  const yAxisRightWidth = 40;
  const innerChartWidth = chartWidth - yAxisLeftWidth - yAxisRightWidth;

  // Y軸のドメインを計算
  const maxHours =
    data.length > 0
      ? Math.ceil(Math.max(...data.map((d) => d.totalWorkHours)) / 20) * 20 + 20
      : 200;
  const maxDays =
    data.length > 0 ? Math.ceil(Math.max(...data.map((d) => d.totalWorkDays)) / 5) * 5 + 5 : 25;

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
      <CardContent className="px-2 sm:px-6">
        <div ref={containerRef} className="flex" style={{ width: "100%" }}>
          {stats.length === 0 ? (
            <p className="text-muted-foreground py-8">データがありません</p>
          ) : (
            width > 0 && (
              <>
                {/* 左Y軸（固定） */}
                <div className="shrink-0">
                  <ComposedChart
                    width={yAxisLeftWidth}
                    height={chartHeight}
                    data={data}
                    margin={{ top: 5, right: 0, bottom: 20, left: 0 }}
                  >
                    <YAxis
                      yAxisId="hours"
                      orientation="left"
                      tick={{ fontSize: 10, fill: colors.mutedForeground }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v}h`}
                      domain={[0, maxHours]}
                      width={yAxisLeftWidth}
                      allowDataOverflow
                    />
                  </ComposedChart>
                </div>

                {/* メインチャート（スクロール可能） */}
                <div className="overflow-x-auto flex-1">
                  <ComposedChart
                    width={innerChartWidth}
                    height={chartHeight}
                    data={data}
                    barCategoryGap="20%"
                    margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: colors.mutedForeground }}
                      axisLine={false}
                      tickLine={false}
                      height={20}
                    />
                    <YAxis yAxisId="hours" hide domain={[0, maxHours]} allowDataOverflow />
                    <YAxis yAxisId="days" hide domain={[0, maxDays]} allowDataOverflow />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || payload.length === 0) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-border bg-background p-3 shadow-sm min-w-[160px]">
                            <p className="text-sm font-semibold text-foreground mb-2">{d.month}</p>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <span
                                    className="h-2 w-2 rounded-sm"
                                    style={{ backgroundColor: colors.chart1 }}
                                  />
                                  総労働
                                </span>
                                <span className="font-medium text-foreground">
                                  {d.totalWorkHours.toFixed(1)}h
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: colors.chart4 }}
                                  />
                                  残業
                                </span>
                                <span className="font-medium text-foreground">
                                  {d.totalOvertimeHours.toFixed(1)}h
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: colors.chart2 }}
                                  />
                                  勤務日数
                                </span>
                                <span className="font-medium text-foreground">
                                  {d.totalWorkDays}日
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground pt-1 border-t border-border">
                                <span>平均</span>
                                <span>{d.averageWorkHours.toFixed(1)}h/日</span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    {/* 総労働時間（棒グラフ） */}
                    <Bar
                      dataKey="totalWorkHours"
                      yAxisId="hours"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors.chart1}
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
                </div>

                {/* 右Y軸（固定） */}
                <div className="shrink-0">
                  <ComposedChart
                    width={yAxisRightWidth}
                    height={chartHeight}
                    data={data}
                    margin={{ top: 5, right: 0, bottom: 20, left: 0 }}
                  >
                    <YAxis
                      yAxisId="days"
                      orientation="right"
                      tick={{ fontSize: 10, fill: colors.mutedForeground }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v}日`}
                      domain={[0, maxDays]}
                      width={yAxisRightWidth}
                      allowDataOverflow
                    />
                  </ComposedChart>
                </div>
              </>
            )
          )}
        </div>
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
