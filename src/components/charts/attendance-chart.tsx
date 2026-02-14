import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartColors } from "@/hooks/use-chart-colors";
import { useContainerSize } from "@/hooks/use-container-size";
import { type DayData, generateFullMonthData, getDayTypeConfig } from "@/lib/chart-utils";
import { formatMinutesToTime } from "@/lib/work-calculator";
import type { WorkRecord } from "@/types/work-record";
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
        <CardHeader>
          <CardTitle>出退勤記録</CardTitle>
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

  const minChartWidth = 700;
  const chartWidth = Math.max(width || 600, minChartWidth);
  const chartHeight = 320;

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
        <CardTitle className="text-base font-medium">出退勤記録</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div
          ref={containerRef}
          className="overflow-x-auto focus:outline-none"
          style={{ width: "100%" }}
        >
          {width > 0 && (
            <ComposedChart width={chartWidth} height={chartHeight} data={data} barCategoryGap="15%">
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
              {/* 左Y軸: 時刻 */}
              <YAxis
                yAxisId="time"
                orientation="left"
                tick={{ fontSize: 10, fill: colors.mutedForeground }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => formatMinutesToTime(v)}
                domain={[420, 1380]}
                ticks={[540, 660, 780, 900, 1020, 1140, 1260]}
                width={50}
                allowDataOverflow
              />
              {/* 右Y軸: 労働時間 */}
              <YAxis
                yAxisId="hours"
                orientation="right"
                tick={{ fontSize: 10, fill: colors.mutedForeground }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}h`}
                domain={[0, 12]}
                ticks={[0, 4, 8, 12]}
                width={30}
                allowDataOverflow
              />
              {/* 8時間基準線 */}
              <ReferenceLine
                y={8}
                yAxisId="hours"
                stroke={colors.chart2}
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
              {/* 定時基準線 */}
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
                  return (
                    <div className="rounded-lg border border-border bg-background p-2 shadow-sm">
                      <p className="text-sm font-medium text-foreground">
                        {dayData.day}日 ({dayData.dayOfWeekLabel})
                      </p>
                      {dayData.hasWork ? (
                        <>
                          <p className="text-sm text-muted-foreground">
                            出勤:{" "}
                            {dayData.startMinutes ? formatMinutesToTime(dayData.startMinutes) : "-"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            退勤:{" "}
                            {dayData.endMinutes ? formatMinutesToTime(dayData.endMinutes) : "-"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            労働: {dayData.workHours.toFixed(1)}h
                            {dayData.overtimeHours > 0 &&
                              ` (残業 ${dayData.overtimeHours.toFixed(1)}h)`}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {dayTypeConfig[dayData.dayType].label}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              {/* 労働時間（棒グラフ） */}
              <Bar dataKey="workHours" yAxisId="hours" radius={[2, 2, 0, 0]} maxBarSize={12}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry)}
                    fillOpacity={entry.hasWork ? 0.8 : 0.2}
                  />
                ))}
              </Bar>
              {/* 退勤時刻（グラデーションエリア） */}
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
              {/* 出勤時刻（下を背景色で塗りつぶし） */}
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
