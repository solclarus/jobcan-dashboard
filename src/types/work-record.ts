export interface WorkRecord {
  date: Date;
  holidayType: string;
  shiftStart: string;
  shiftEnd: string;
  startTime: string;
  endTime: string;
  workTime: string;
  overtimeOutOfShift: string;
  overtimeHours: string;
  nightTime: string;
  breakTime: string;
  status: string;
  error: string;
}

export interface DailyStats {
  date: Date;
  workMinutes: number;
  overtimeMinutes: number;
  isHoliday: boolean;
  isAbsent: boolean;
}

export interface MonthlyStats {
  totalWorkDays: number;
  totalWorkHours: number;
  totalOvertimeHours: number;
  averageWorkHours: number;
  averageStartTime: string;
  averageEndTime: string;
}
