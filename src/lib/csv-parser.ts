import type { WorkRecord } from "@/types/work-record";

const CSV_HEADERS = [
  "日付",
  "休日区分",
  "シフト開始",
  "シフト終了",
  "出勤時刻",
  "退勤時刻",
  "労働時間",
  "シフト外労働時間",
  "残業時間",
  "深夜時間",
  "休憩時間",
  "勤怠状況",
  "エラー",
] as const;

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values;
}

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export function parseCsv(csvText: string): WorkRecord[] {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split("\n")
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return [];
  }

  const headerLine = parseCsvLine(lines[0]);
  const expectedHeaders = CSV_HEADERS.slice(0, headerLine.length);

  const headersMatch = expectedHeaders.every((h, i) => headerLine[i]?.replace(/"/g, "") === h);

  if (!headersMatch) {
    console.warn("CSV headers do not match expected format");
  }

  const records: WorkRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);

    if (values.length < 2 || !values[0]) {
      continue;
    }

    const record: WorkRecord = {
      date: parseDate(values[0]),
      holidayType: values[1] || "",
      shiftStart: values[2] || "",
      shiftEnd: values[3] || "",
      startTime: values[4] || "",
      endTime: values[5] || "",
      workTime: values[6] || "",
      overtimeOutOfShift: values[7] || "",
      overtimeHours: values[8] || "",
      nightTime: values[9] || "",
      breakTime: values[10] || "",
      status: values[11] || "",
      error: values[12] || "",
    };

    records.push(record);
  }

  return records;
}
