import { describe, expect, it } from "vite-plus/test";
import {
  formatMinutesToTime,
  getMonthlyStats,
  minutesToHours,
  timeToMinutes,
} from "./work-calculator";
import type { WorkRecord } from "@/types/work-record";

describe("timeToMinutes", () => {
  it("converts time string to minutes", () => {
    expect(timeToMinutes("09:00")).toBe(540);
    expect(timeToMinutes("18:30")).toBe(1110);
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("23:59")).toBe(1439);
  });

  it("returns 0 for empty string", () => {
    expect(timeToMinutes("")).toBe(0);
  });
});

describe("minutesToHours", () => {
  it("converts minutes to hours with 2 decimal places", () => {
    expect(minutesToHours(60)).toBe(1);
    expect(minutesToHours(90)).toBe(1.5);
    expect(minutesToHours(480)).toBe(8);
    expect(minutesToHours(510)).toBe(8.5);
  });

  it("rounds to 2 decimal places", () => {
    expect(minutesToHours(100)).toBe(1.67);
  });
});

describe("formatMinutesToTime", () => {
  it("formats minutes to HH:MM string", () => {
    expect(formatMinutesToTime(540)).toBe("09:00");
    expect(formatMinutesToTime(1110)).toBe("18:30");
    expect(formatMinutesToTime(0)).toBe("00:00");
  });

  it("pads hours and minutes with zeros", () => {
    expect(formatMinutesToTime(65)).toBe("01:05");
  });
});

describe("getMonthlyStats", () => {
  const createRecord = (overrides: Partial<WorkRecord> = {}): WorkRecord => ({
    date: new Date(2024, 0, 1),
    holidayType: "",
    shiftStart: "09:00",
    shiftEnd: "18:00",
    startTime: "09:00",
    endTime: "18:00",
    workTime: "08:00",
    overtimeOutOfShift: "",
    overtimeHours: "00:00",
    nightTime: "",
    breakTime: "01:00",
    status: "",
    error: "",
    ...overrides,
  });

  it("calculates stats for empty records", () => {
    const stats = getMonthlyStats([]);
    expect(stats.totalWorkDays).toBe(0);
    expect(stats.totalWorkHours).toBe(0);
    expect(stats.averageWorkHours).toBe(0);
  });

  it("calculates total work days", () => {
    const records = [
      createRecord({ date: new Date(2024, 0, 1) }),
      createRecord({ date: new Date(2024, 0, 2) }),
      createRecord({ date: new Date(2024, 0, 3) }),
    ];
    const stats = getMonthlyStats(records);
    expect(stats.totalWorkDays).toBe(3);
  });

  it("excludes public holidays from work days", () => {
    const records = [
      createRecord({ date: new Date(2024, 0, 1) }),
      createRecord({ date: new Date(2024, 0, 2), holidayType: "公休", workTime: "" }),
    ];
    const stats = getMonthlyStats(records);
    expect(stats.totalWorkDays).toBe(1);
  });

  it("calculates total and average work hours", () => {
    const records = [createRecord({ workTime: "08:00" }), createRecord({ workTime: "09:00" })];
    const stats = getMonthlyStats(records);
    expect(stats.totalWorkHours).toBe(17);
    expect(stats.averageWorkHours).toBe(8.5);
  });

  it("calculates overtime hours", () => {
    const records = [
      createRecord({ overtimeHours: "01:00" }),
      createRecord({ overtimeHours: "02:30" }),
    ];
    const stats = getMonthlyStats(records);
    expect(stats.totalOvertimeHours).toBe(3.5);
  });

  it("calculates average start and end times", () => {
    const records = [
      createRecord({ startTime: "09:00", endTime: "18:00" }),
      createRecord({ startTime: "10:00", endTime: "19:00" }),
    ];
    const stats = getMonthlyStats(records);
    expect(stats.averageStartTime).toBe("09:30");
    expect(stats.averageEndTime).toBe("18:30");
  });
});
