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
  | "halfDayLeave"
  | "specialLeave"
  | "late"
  | "earlyLeave";

export interface DayData {
  day: number;
  dayOfWeek: number; // 0=日, 1=月, ..., 6=土
  dayOfWeekLabel: string; // 日, 月, 火, ...
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

const DAY_OF_WEEK_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export interface DayTypeConfig {
  label: string;
  color: string;
}

function getDayType(record: WorkRecord | undefined, isWeekend: boolean): DayType {
  if (!record) {
    return isWeekend ? "weekend" : "holiday";
  }

  const { holidayType, status, shiftStart, workTime } = record;

  // 勤怠状況による分類
  if (status === "欠勤") return "absent";
  if (status === "有休" || status === "有給" || status === "有給休暇") return "paidLeave";
  if (status.includes("半休") || status === "午前半休" || status === "午後半休")
    return "halfDayLeave";
  if (status === "特別休暇" || status === "特休") return "specialLeave";
  if (status === "遅刻") return "late";
  if (status === "早退") return "earlyLeave";

  // 休日区分による分類
  if (holidayType === "祝日") return "publicHoliday";
  if (holidayType === "公休") return "holiday";
  if (holidayType === "有給" || holidayType === "有休") return "paidLeave";
  if (holidayType === "半休") return "halfDayLeave";
  if (holidayType === "特休" || holidayType === "特別休暇") return "specialLeave";

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
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayType = getDayType(record, isWeekend);

    if (!record) {
      return {
        day,
        dayOfWeek,
        dayOfWeekLabel: DAY_OF_WEEK_LABELS[dayOfWeek],
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
      dayOfWeek,
      dayOfWeekLabel: DAY_OF_WEEK_LABELS[dayOfWeek],
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
    normal: { label: "通常勤務", color: colors.chart1 },
    weekend: { label: "週末", color: colors.muted },
    holiday: { label: "休日", color: colors.muted },
    publicHoliday: { label: "祝日", color: colors.chart4 },
    absent: { label: "欠勤", color: colors.chart4 },
    paidLeave: { label: "有給", color: colors.chart2 },
    halfDayLeave: { label: "半休", color: colors.chart5 },
    specialLeave: { label: "特休", color: colors.chart2 },
    late: { label: "遅刻", color: colors.chart3 },
    earlyLeave: { label: "早退", color: colors.chart3 },
  };
}
