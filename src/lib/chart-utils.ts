import type { WorkRecord } from "@/types/work-record";
import { minutesToHours, timeToMinutes } from "./work-calculator";
import type { ChartColors } from "@/hooks/use-chart-colors";

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export type DayType =
  | "normal"
  | "weekend"
  | "holiday"
  | "publicHoliday"
  | "absent"
  | "paidLeave"
  | "late"
  | "earlyLeave";

export interface DayData {
  day: number;
  workHours: number;
  overtimeHours: number;
  startMinutes: number | null;
  endMinutes: number | null;
  isWeekend: boolean;
  dayType: DayType;
  holidayType: string;
  status: string;
  hasWork: boolean;
}

export interface DayTypeConfig {
  label: string;
  color: string;
  bgClass: string;
}

function getDayType(record: WorkRecord | undefined, isWeekend: boolean): DayType {
  if (!record) {
    return isWeekend ? "weekend" : "holiday";
  }

  const { holidayType, status, shiftStart, workTime } = record;

  // 勤怠状況による分類
  if (status === "欠勤") return "absent";
  if (status === "有休" || status === "有給" || status === "有給休暇") return "paidLeave";
  if (status === "遅刻") return "late";
  if (status === "早退") return "earlyLeave";

  // 休日区分による分類
  if (holidayType === "祝日") return "publicHoliday";
  if (holidayType === "公休") return "holiday";

  // シフトがない日
  if (!shiftStart) {
    return isWeekend ? "weekend" : "holiday";
  }

  // 勤務データがある
  if (workTime) return "normal";

  return isWeekend ? "weekend" : "holiday";
}

export function generateFullMonthData(records: WorkRecord[]): DayData[] {
  if (records.length === 0) return [];

  const firstRecord = records[0];
  const year = firstRecord.date.getFullYear();
  const month = firstRecord.date.getMonth();
  const daysInMonth = getDaysInMonth(year, month + 1);

  const recordMap = new Map<number, WorkRecord>();
  records.forEach((r) => {
    recordMap.set(r.date.getDate(), r);
  });

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const record = recordMap.get(day);
    const date = new Date(year, month, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const dayType = getDayType(record, isWeekend);

    if (!record) {
      return {
        day,
        workHours: 0,
        overtimeHours: 0,
        startMinutes: null,
        endMinutes: null,
        isWeekend,
        dayType,
        holidayType: "",
        status: "",
        hasWork: false,
      };
    }

    const workHours = minutesToHours(timeToMinutes(record.workTime));
    const overtimeHours = minutesToHours(timeToMinutes(record.overtimeHours));
    const startMinutes = record.startTime ? timeToMinutes(record.startTime) : null;
    const endMinutes = record.endTime ? timeToMinutes(record.endTime) : null;
    const hasWork = !!record.workTime;

    return {
      day,
      workHours: hasWork ? workHours : 0,
      overtimeHours: hasWork ? overtimeHours : 0,
      startMinutes,
      endMinutes,
      isWeekend,
      dayType,
      holidayType: record.holidayType,
      status: record.status,
      hasWork,
    };
  });
}

export function getDayTypeConfig(colors: ChartColors): Record<DayType, DayTypeConfig> {
  return {
    normal: { label: "通常勤務", color: colors.chart1, bgClass: "bg-chart-1" },
    weekend: { label: "週末", color: colors.muted, bgClass: "bg-muted" },
    holiday: { label: "休日", color: colors.muted, bgClass: "bg-muted" },
    publicHoliday: { label: "祝日", color: colors.chart4, bgClass: "bg-chart-4" },
    absent: { label: "欠勤", color: colors.chart4, bgClass: "bg-destructive" },
    paidLeave: { label: "有給休暇", color: colors.chart2, bgClass: "bg-chart-2" },
    late: { label: "遅刻", color: colors.chart3, bgClass: "bg-chart-3" },
    earlyLeave: { label: "早退", color: colors.chart3, bgClass: "bg-chart-3" },
  };
}

// 後方互換性のためのデフォルト値（静的な色が必要な場合用）
export const DAY_TYPE_CONFIG: Record<DayType, DayTypeConfig> = {
  normal: { label: "通常勤務", color: "hsl(221 83% 53%)", bgClass: "bg-chart-1" },
  weekend: { label: "週末", color: "hsl(215.4 16.3% 46.9%)", bgClass: "bg-muted" },
  holiday: { label: "休日", color: "hsl(215.4 16.3% 46.9%)", bgClass: "bg-muted" },
  publicHoliday: { label: "祝日", color: "hsl(0 84% 60%)", bgClass: "bg-chart-4" },
  absent: { label: "欠勤", color: "hsl(0 84% 60%)", bgClass: "bg-destructive" },
  paidLeave: { label: "有給休暇", color: "hsl(142 76% 36%)", bgClass: "bg-chart-2" },
  late: { label: "遅刻", color: "hsl(38 92% 50%)", bgClass: "bg-chart-3" },
  earlyLeave: { label: "早退", color: "hsl(38 92% 50%)", bgClass: "bg-chart-3" },
};
