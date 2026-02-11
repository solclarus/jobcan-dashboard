import {
  Line,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutesToTime } from "@/lib/work-calculator";
import { generateFullMonthData, getDayTypeConfig, type DayData } from "@/lib/chart-utils";
import { useContainerSize } from "@/hooks/use-container-size";
import { useChartColors } from "@/hooks/use-chart-colors";
import type { WorkRecord } from "@/types/work-record";

interface TimeDistributionChartProps {
  records: WorkRecord[];
}

export function TimeDistributionChart({ records }: TimeDistributionChartProps) {
  const [containerRef, { width }] = useContainerSize<HTMLDivElement>();
  const colors = useChartColors();
  const dayTypeConfig = getDayTypeConfig(colors);
  const fullData = generateFullMonthData(records);

  const workingData = fullData.filter((d) => d.startMinutes !== null);
  const avgStart =
    workingData.length > 0
      ? Math.round(
          workingData.reduce((sum, d) => sum + (d.startMinutes || 0), 0) / workingData.length,
        )
      : 600;
  const avgEnd =
    workingData.length > 0
      ? Math.round(
          workingData.reduce((sum, d) => sum + (d.endMinutes || 0), 0) / workingData.length,
        )
      : 1080;

  const data = fullData.map((d) => ({
    ...d,
    start: d.startMinutes,
    end: d.endMinutes,
  }));

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>出退勤時刻</CardTitle>
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
        <CardTitle className="text-base font-medium">出退勤時刻</CardTitle>
        <CardDescription className="text-sm">
          平均 {formatMinutesToTime(avgStart)} 〜 {formatMinutesToTime(avgEnd)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">出勤</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">退勤</span>
          </div>
        </div>
        <div ref={containerRef} style={{ width: "100%" }}>
          {width > 0 && (
            <ComposedChart width={chartWidth} height={chartHeight} data={data}>
              <defs>
                <linearGradient id="workRange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.chart1} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={colors.chart1} stopOpacity={0.02} />
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
                domain={[480, 1320]}
                tick={{ fontSize: 10, fill: colors.mutedForeground }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatMinutesToTime(v)}
                ticks={[540, 720, 900, 1080, 1200]}
                width={40}
              />
              <ReferenceLine
                y={600}
                stroke={colors.mutedForeground}
                strokeDasharray="4 4"
                strokeOpacity={0.3}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload as DayData & {
                    start: number | null;
                    end: number | null;
                  };
                  const config = dayTypeConfig[d.dayType];

                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-md text-xs min-w-[140px]">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="font-semibold">{d.day}日</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                          style={{ backgroundColor: config.color }}
                        >
                          {config.label}
                        </span>
                      </div>
                      {d.start !== null ? (
                        <div className="space-y-1 text-muted-foreground">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-chart-1" />
                              出勤
                            </span>
                            <span className="font-medium text-foreground">
                              {formatMinutesToTime(d.start)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-chart-2" />
                              退勤
                            </span>
                            <span className="font-medium text-foreground">
                              {formatMinutesToTime(d.end!)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">勤務なし</p>
                      )}
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="end"
                stroke="none"
                fill="url(#workRange)"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="start"
                stroke={colors.chart1}
                strokeWidth={2}
                dot={{ r: 2, fill: colors.chart1 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="end"
                stroke={colors.chart2}
                strokeWidth={2}
                dot={{ r: 2, fill: colors.chart2 }}
                connectNulls
              />
            </ComposedChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
