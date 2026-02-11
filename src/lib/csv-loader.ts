import type { CsvFile, CsvIndex } from "@/types/csv-file";
import type { WorkRecord } from "@/types/work-record";
import { parseCsv } from "./csv-parser";

const BASE_PATH = import.meta.env.BASE_URL || "/";

export async function loadCsvIndex(): Promise<CsvFile[]> {
  const response = await fetch(`${BASE_PATH}data/index.json`);
  const data: CsvIndex = await response.json();
  return data.files || [];
}

export async function loadCsvFile(path: string): Promise<WorkRecord[]> {
  const response = await fetch(`${BASE_PATH}${path}`);
  const text = await response.text();
  return parseCsv(text);
}

export function formatMonthLabel(file: CsvFile): string {
  return `${file.year}年${file.month}月`;
}
