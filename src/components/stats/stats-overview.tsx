import { getMonthlyStats } from "@/lib/work-calculator";
import type { WorkRecord } from "@/types/work-record";
import { Calendar, Clock, Timer, TrendingDown, TrendingUp } from "lucide-react";

interface StatsOverviewProps {
  records: WorkRecord[];
  previousRecords?: WorkRecord[];
}

interface StatItemProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

function StatItem({ label, value, subValue, trend, icon }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 rounded-xl border bg-card p-3 sm:p-4">
      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-sm text-muted-foreground truncate">{label}</p>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <p className="text-lg sm:text-2xl font-semibold tracking-tight">{value}</p>
          {subValue && (
            <span className="flex items-center gap-0.5 text-[9px] sm:text-xs text-muted-foreground">
              {trend === "up" && <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-chart-2" />}
              {trend === "down" && (
                <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-chart-4" />
              )}
              <span className="hidden sm:inline">{subValue}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function StatsOverview({ records, previousRecords = [] }: StatsOverviewProps) {
  const stats = getMonthlyStats(records);
  const prevStats = previousRecords.length > 0 ? getMonthlyStats(previousRecords) : null;

  const workDaysDiff = prevStats ? stats.totalWorkDays - prevStats.totalWorkDays : 0;
  const overtimeDiff = prevStats ? stats.totalOvertimeHours - prevStats.totalOvertimeHours : 0;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
      <StatItem
        label="勤務日数"
        value={`${stats.totalWorkDays}日`}
        subValue={prevStats ? `${workDaysDiff >= 0 ? "+" : ""}${workDaysDiff}日` : undefined}
        trend={workDaysDiff > 0 ? "up" : workDaysDiff < 0 ? "down" : "neutral"}
        icon={<Calendar className="h-4 w-4 sm:h-5 sm:w-5" />}
      />
      <StatItem
        label="総労働時間"
        value={`${stats.totalWorkHours.toFixed(1)}h`}
        subValue={`平均 ${stats.averageWorkHours.toFixed(1)}h/日`}
        icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5" />}
      />
      <StatItem
        label="残業時間"
        value={`${stats.totalOvertimeHours.toFixed(1)}h`}
        subValue={
          prevStats ? `${overtimeDiff >= 0 ? "+" : ""}${overtimeDiff.toFixed(1)}h` : undefined
        }
        trend={overtimeDiff > 0 ? "up" : overtimeDiff < 0 ? "down" : "neutral"}
        icon={<Timer className="h-4 w-4 sm:h-5 sm:w-5" />}
      />
      <StatItem
        label="平均出勤"
        value={stats.averageStartTime}
        subValue={`退勤 ${stats.averageEndTime}`}
        icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />}
      />
    </div>
  );
}
