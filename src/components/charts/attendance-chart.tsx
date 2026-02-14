import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartColors } from "@/hooks/use-chart-colors";
import { useContainerSize } from "@/hooks/use-container-size";
import { type DayData, generateFullMonthData, getDayTypeConfig } from "@/lib/chart-utils";
import { formatMinutesToTime } from "@/lib/work-calculator";
import type { WorkRecord } from "@/types/work-record";
import { BarChart3 } from "lucide-react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AttendanceChartProps {
  records: WorkRecord[];
}

export function AttendanceChart({ records }: AttendanceChartProps) {
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
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-chart-1/15 text-chart-1">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <CardTitle className="text-base font-medium">出退勤記録</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">データがありません</p>
        </CardContent>
      </Card>
    );
  }

  // シフト開始時刻（最初の勤務日から取得）
  const firstWorkDay = data.find((d) => d.startMinutes !== null);
  const shiftStartMinutes = firstWorkDay?.startMinutes || 600;

  const minChartWidth = 800;
  const chartWidth = Math.max(width || 600, minChartWidth);
  const chartHeight = 320;
  const yAxisLeftWidth = 50;
  const yAxisRightWidth = 35;
  const innerChartWidth = chartWidth - yAxisLeftWidth - yAxisRightWidth;

  // 休日・祝日の範囲
  const holidayAreas = data.filter(
    (d) => d.dayType === "weekend" || d.dayType === "holiday" || d.dayType === "publicHoliday",
  );

  // X軸のカスタムtick
  const renderCustomTick = (props: {
    x?: string | number;
    y?: string | number;
    index?: number;
  }) => {
    const { x, y, index } = props;
    if (x === undefined || y === undefined || index === undefined) return null;
    const dayData = data[index];
    if (!dayData) return null;

    const isHoliday =
      dayData.dayType === "weekend" ||
      dayData.dayType === "holiday" ||
      dayData.dayType === "publicHoliday";
    const isSunday = dayData.dayOfWeek === 0;
    const isSaturday = dayData.dayOfWeek === 6;
    const isPublicHoliday = dayData.dayType === "publicHoliday";

    let tickColor = colors.mutedForeground;
    if (isPublicHoliday || isSunday) {
      tickColor = colors.chart4;
    } else if (isSaturday) {
      tickColor = colors.chart1;
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={10} textAnchor="middle" fill={tickColor} fontSize={9}>
          {dayData.day}
        </text>
        <text
          x={0}
          y={0}
          dy={22}
          textAnchor="middle"
          fill={isHoliday ? tickColor : colors.mutedForeground}
          fontSize={8}
          opacity={0.8}
        >
          {dayData.dayOfWeekLabel}
        </text>
      </g>
    );
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-chart-1/15 text-chart-1">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <CardTitle className="text-base font-medium">出退勤記録</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div ref={containerRef} className="flex" style={{ width: "100%" }}>
          {width > 0 && (
            <>
              {/* 左Y軸（固定） */}
              <div className="shrink-0">
                <ComposedChart
                  width={yAxisLeftWidth}
                  height={chartHeight}
                  data={data}
                  margin={{ top: 5, right: 0, bottom: 35, left: 0 }}
                >
                  <YAxis
                    yAxisId="time"
                    orientation="left"
                    tick={{ fontSize: 10, fill: colors.mutedForeground }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => formatMinutesToTime(v)}
                    domain={[420, 1380]}
                    ticks={[540, 660, 780, 900, 1020, 1140, 1260]}
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
                  barCategoryGap="15%"
                  margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors.chart2} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={colors.chart3} stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                  {holidayAreas.map((d) => (
                    <ReferenceArea
                      key={`holiday-${d.day}`}
                      x1={d.day - 0.5}
                      x2={d.day + 0.5}
                      y1={420}
                      y2={1380}
                      yAxisId="time"
                      fill={d.dayType === "publicHoliday" ? colors.chart4 : colors.muted}
                      fillOpacity={0.15}
                    />
                  ))}
                  <XAxis
                    dataKey="day"
                    tick={renderCustomTick}
                    axisLine={false}
                    tickLine={false}
                    height={35}
                    interval={0}
                  />
                  <YAxis yAxisId="time" hide domain={[420, 1380]} allowDataOverflow />
                  <YAxis yAxisId="hours" hide domain={[0, 12]} allowDataOverflow />
                  <ReferenceLine
                    y={8}
                    yAxisId="hours"
                    stroke={colors.chart2}
                    strokeDasharray="4 4"
                    strokeOpacity={0.5}
                  />
                  <ReferenceLine
                    y={shiftStartMinutes}
                    yAxisId="time"
                    stroke={colors.mutedForeground}
                    strokeDasharray="4 4"
                    strokeOpacity={0.3}
                  />
                  <Tooltip
                    cursor={{ fill: colors.muted, opacity: 0.2 }}
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const dayData = payload[0].payload as DayData;
                      const config = dayTypeConfig[dayData.dayType];
                      return (
                        <div className="rounded-lg border border-border bg-background p-3 shadow-sm min-w-[160px]">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <p className="text-sm font-semibold text-foreground">
                              {dayData.day}日 ({dayData.dayOfWeekLabel})
                            </p>
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                              style={{ backgroundColor: config.color }}
                            >
                              {config.label}
                            </span>
                          </div>
                          {dayData.hasWork ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: colors.chart3 }}
                                  />
                                  出勤
                                </span>
                                <span className="font-medium text-foreground">
                                  {dayData.startMinutes
                                    ? formatMinutesToTime(dayData.startMinutes)
                                    : "-"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: colors.chart2 }}
                                  />
                                  退勤
                                </span>
                                <span className="font-medium text-foreground">
                                  {dayData.endMinutes
                                    ? formatMinutesToTime(dayData.endMinutes)
                                    : "-"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <span
                                    className="h-2 w-2 rounded-sm"
                                    style={{ backgroundColor: colors.chart1 }}
                                  />
                                  労働時間
                                </span>
                                <span className="font-medium text-foreground">
                                  {dayData.workHours.toFixed(1)}h
                                </span>
                              </div>
                              {dayData.overtimeHours > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <span
                                      className="h-2 w-2 rounded-sm"
                                      style={{ backgroundColor: colors.chart4 }}
                                    />
                                    残業
                                  </span>
                                  <span className="font-medium text-foreground">
                                    {dayData.overtimeHours.toFixed(1)}h
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">勤務なし</p>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="workHours" yAxisId="hours" radius={[2, 2, 0, 0]} maxBarSize={12}>
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry)}
                        fillOpacity={entry.hasWork ? 0.8 : 0.2}
                      />
                    ))}
                  </Bar>
                  <Area
                    type="monotone"
                    dataKey="endMinutes"
                    yAxisId="time"
                    stroke={colors.chart2}
                    strokeWidth={2}
                    fill="url(#attendanceGradient)"
                    dot={{ r: 3, fill: colors.chart2, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="startMinutes"
                    yAxisId="time"
                    stroke={colors.chart3}
                    strokeWidth={2}
                    fill={colors.background}
                    fillOpacity={1}
                    dot={{ r: 3, fill: colors.chart3, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </div>

              {/* 右Y軸（固定） */}
              <div className="shrink-0">
                <ComposedChart
                  width={yAxisRightWidth}
                  height={chartHeight}
                  data={data}
                  margin={{ top: 5, right: 0, bottom: 35, left: 0 }}
                >
                  <YAxis
                    yAxisId="hours"
                    orientation="right"
                    tick={{ fontSize: 10, fill: colors.mutedForeground }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v}h`}
                    domain={[0, 12]}
                    ticks={[0, 4, 8, 12]}
                    width={yAxisRightWidth}
                    allowDataOverflow
                  />
                </ComposedChart>
              </div>
            </>
          )}
        </div>
        {/* 凡例 */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.chart3 }} />
            <span>出勤</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.chart2 }} />
            <span>退勤</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-3 w-3 rounded-sm opacity-80"
              style={{ backgroundColor: colors.chart1 }}
            />
            <span>労働時間</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-3 w-3 rounded-sm opacity-80"
              style={{ backgroundColor: colors.chart4 }}
            />
            <span>残業1時間以上</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
