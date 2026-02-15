import type { MonthlyStats, WorkRecord } from "@/types/work-record";

export function timeToMinutes(time: string): number {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

export function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function getMonthlyStats(records: WorkRecord[]): MonthlyStats {
  const workingRecords = records.filter((r) => r.workTime && r.holidayType !== "公休");

  const totalWorkMinutes = workingRecords.reduce((sum, r) => sum + timeToMinutes(r.workTime), 0);

  const totalOvertimeMinutes = workingRecords.reduce(
    (sum, r) => sum + timeToMinutes(r.overtimeHours),
    0,
  );

  const startTimes = workingRecords
    .filter((r) => r.startTime)
    .map((r) => timeToMinutes(r.startTime));

  const endTimes = workingRecords.filter((r) => r.endTime).map((r) => timeToMinutes(r.endTime));

  const avgStartMinutes =
    startTimes.length > 0
      ? Math.round(startTimes.reduce((a, b) => a + b, 0) / startTimes.length)
      : 0;

  const avgEndMinutes =
    endTimes.length > 0 ? Math.round(endTimes.reduce((a, b) => a + b, 0) / endTimes.length) : 0;

  return {
    totalWorkDays: workingRecords.length,
    totalWorkHours: minutesToHours(totalWorkMinutes),
    totalOvertimeHours: minutesToHours(totalOvertimeMinutes),
    averageWorkHours: workingRecords.length
      ? minutesToHours(totalWorkMinutes / workingRecords.length)
      : 0,
    averageStartTime: formatMinutesToTime(avgStartMinutes),
    averageEndTime: formatMinutesToTime(avgEndMinutes),
  };
}
