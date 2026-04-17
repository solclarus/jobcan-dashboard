import { describe, expect, it } from "vite-plus/test";
import { generateFullMonthData, getDaysInMonth } from "./chart-utils";
import type { WorkRecord } from "@/types/work-record";

describe("getDaysInMonth", () => {
  it("returns correct days for each month", () => {
    expect(getDaysInMonth(2024, 1)).toBe(31); // January
    expect(getDaysInMonth(2024, 2)).toBe(29); // February (leap year)
    expect(getDaysInMonth(2024, 4)).toBe(30); // April
    expect(getDaysInMonth(2024, 12)).toBe(31); // December
  });

  it("handles leap years correctly", () => {
    expect(getDaysInMonth(2024, 2)).toBe(29); // leap year
    expect(getDaysInMonth(2023, 2)).toBe(28); // non-leap year
  });
});

describe("generateFullMonthData", () => {
  const createRecord = (day: number, overrides: Partial<WorkRecord> = {}): WorkRecord => ({
    date: new Date(2024, 0, day),
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

  it("returns empty array for empty records", () => {
    expect(generateFullMonthData([])).toEqual([]);
  });

  it("generates data for all days in month", () => {
    const records = [createRecord(1), createRecord(15)];
    const data = generateFullMonthData(records);
    expect(data).toHaveLength(31); // January has 31 days
  });

  it("maps records to correct days", () => {
    const records = [createRecord(15)];
    const data = generateFullMonthData(records);

    expect(data[14].day).toBe(15);
    expect(data[14].hasWork).toBe(true);
    expect(data[14].workHours).toBe(8);
  });

  it("marks days without records correctly", () => {
    const records = [createRecord(15)];
    const data = generateFullMonthData(records);

    expect(data[0].day).toBe(1);
    expect(data[0].hasWork).toBe(false);
    expect(data[0].workHours).toBe(0);
  });

  it("identifies weekends", () => {
    // January 2024: 6th is Saturday, 7th is Sunday
    const records = [createRecord(6), createRecord(7)];
    const data = generateFullMonthData(records);

    expect(data[5].isWeekend).toBe(true); // Saturday
    expect(data[6].isWeekend).toBe(true); // Sunday
    expect(data[0].isWeekend).toBe(false); // Monday
  });

  it("sets day of week labels correctly", () => {
    // January 1, 2024 is Monday
    const records = [createRecord(1)];
    const data = generateFullMonthData(records);

    expect(data[0].dayOfWeekLabel).toBe("月"); // Monday
    expect(data[5].dayOfWeekLabel).toBe("土"); // Saturday
    expect(data[6].dayOfWeekLabel).toBe("日"); // Sunday
  });

  it("calculates overtime hours", () => {
    const records = [createRecord(1, { overtimeHours: "02:30" })];
    const data = generateFullMonthData(records);

    expect(data[0].overtimeHours).toBe(2.5);
  });

  it("handles public holidays", () => {
    const records = [createRecord(1, { holidayType: "公休", workTime: "", shiftStart: "" })];
    const data = generateFullMonthData(records);

    expect(data[0].dayType).toBe("holiday");
  });

  it("handles paid leave", () => {
    const records = [createRecord(1, { status: "有休", workTime: "" })];
    const data = generateFullMonthData(records);

    expect(data[0].dayType).toBe("paidLeave");
  });

  it("handles half-day leave", () => {
    const records = [createRecord(1, { status: "午前半休", workTime: "04:00" })];
    const data = generateFullMonthData(records);

    expect(data[0].dayType).toBe("halfDayLeave");
  });

  it("sets start and end minutes", () => {
    const records = [createRecord(1, { startTime: "09:30", endTime: "18:30" })];
    const data = generateFullMonthData(records);

    expect(data[0].startMinutes).toBe(570); // 9.5 hours * 60
    expect(data[0].endMinutes).toBe(1110); // 18.5 hours * 60
  });

  it("handles missing start/end times", () => {
    const records = [createRecord(1, { startTime: "", endTime: "", workTime: "" })];
    const data = generateFullMonthData(records);

    expect(data[0].startMinutes).toBeNull();
    expect(data[0].endMinutes).toBeNull();
  });
});
