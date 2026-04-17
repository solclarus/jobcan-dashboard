import type { CsvFile } from "@/types/csv-file";
import type { WorkRecord } from "@/types/work-record";
import { parseCsv } from "./csv-parser";

const BASE_PATH = import.meta.env.BASE_URL || "/";

function parseFileId(id: string): CsvFile {
  const [yearStr, monthStr] = id.split("-");
  const year = Number.parseInt(yearStr, 10);
  const month = Number.parseInt(monthStr, 10);
  return {
    id,
    name: `${year}年${month}月`,
    path: `data/${id}.csv`,
    year,
    month,
  };
}

export async function loadCsvIndex(): Promise<CsvFile[]> {
  const response = await fetch(`${BASE_PATH}data/index.txt`);
  const text = await response.text();
  const ids = text.trim().split("\n").filter(Boolean);
  return ids.map(parseFileId);
}

export async function loadCsvFile(path: string): Promise<WorkRecord[]> {
  const response = await fetch(`${BASE_PATH}${path}`);
  const text = await response.text();
  return parseCsv(text);
}

export function formatMonthLabel(file: CsvFile): string {
  return `${file.year}年${file.month}月`;
}

export function formatMonthId(file: CsvFile): string {
  return `${file.year}/${file.month}`;
}
