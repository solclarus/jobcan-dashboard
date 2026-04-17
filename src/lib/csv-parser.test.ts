import { describe, expect, it } from "vite-plus/test";
import { parseCsv } from "./csv-parser";

describe("parseCsv", () => {
  it("parses empty CSV", () => {
    expect(parseCsv("")).toEqual([]);
  });

  it("parses CSV with only header", () => {
    const csv =
      "日付,休日区分,シフト開始,シフト終了,出勤時刻,退勤時刻,労働時間,シフト外労働時間,残業時間,深夜時間,休憩時間,勤怠状況,エラー";
    expect(parseCsv(csv)).toEqual([]);
  });

  it("parses simple CSV data", () => {
    const csv = `日付,休日区分,シフト開始,シフト終了,出勤時刻,退勤時刻,労働時間,シフト外労働時間,残業時間,深夜時間,休憩時間,勤怠状況,エラー
2024/01/15,,09:00,18:00,09:05,18:10,08:00,00:00,00:05,00:00,01:00,出勤,`;

    const records = parseCsv(csv);
    expect(records).toHaveLength(1);
    expect(records[0].date.getFullYear()).toBe(2024);
    expect(records[0].date.getMonth()).toBe(0);
    expect(records[0].date.getDate()).toBe(15);
    expect(records[0].shiftStart).toBe("09:00");
    expect(records[0].shiftEnd).toBe("18:00");
    expect(records[0].startTime).toBe("09:05");
    expect(records[0].endTime).toBe("18:10");
    expect(records[0].workTime).toBe("08:00");
    expect(records[0].overtimeHours).toBe("00:05");
    expect(records[0].status).toBe("出勤");
  });

  it("parses multiple records", () => {
    const csv = `日付,休日区分,シフト開始,シフト終了,出勤時刻,退勤時刻,労働時間,シフト外労働時間,残業時間,深夜時間,休憩時間,勤怠状況,エラー
2024/01/15,,09:00,18:00,09:00,18:00,08:00,00:00,00:00,00:00,01:00,出勤,
2024/01/16,,09:00,18:00,09:00,18:00,08:00,00:00,00:00,00:00,01:00,出勤,
2024/01/17,公休,,,,,,,,,,公休,`;

    const records = parseCsv(csv);
    expect(records).toHaveLength(3);
    expect(records[2].holidayType).toBe("公休");
  });

  it("handles BOM in CSV", () => {
    const csvWithBom = `\uFEFF日付,休日区分,シフト開始,シフト終了,出勤時刻,退勤時刻,労働時間,シフト外労働時間,残業時間,深夜時間,休憩時間,勤怠状況,エラー
2024/01/15,,09:00,18:00,09:05,18:10,08:00,00:00,00:05,00:00,01:00,出勤,`;

    const records = parseCsv(csvWithBom);
    expect(records).toHaveLength(1);
  });

  it("handles quoted fields", () => {
    const csv = `日付,休日区分,シフト開始,シフト終了,出勤時刻,退勤時刻,労働時間,シフト外労働時間,残業時間,深夜時間,休憩時間,勤怠状況,エラー
2024/01/15,"特別休暇",09:00,18:00,,,00:00,00:00,00:00,00:00,00:00,"特別休暇",`;

    const records = parseCsv(csv);
    expect(records).toHaveLength(1);
    expect(records[0].holidayType).toBe("特別休暇");
    expect(records[0].status).toBe("特別休暇");
  });

  it("skips empty lines", () => {
    const csv = `日付,休日区分,シフト開始,シフト終了,出勤時刻,退勤時刻,労働時間,シフト外労働時間,残業時間,深夜時間,休憩時間,勤怠状況,エラー
2024/01/15,,09:00,18:00,09:00,18:00,08:00,00:00,00:00,00:00,01:00,出勤,

2024/01/16,,09:00,18:00,09:00,18:00,08:00,00:00,00:00,00:00,01:00,出勤,`;

    const records = parseCsv(csv);
    expect(records).toHaveLength(2);
  });
});
