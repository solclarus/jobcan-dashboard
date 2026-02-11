export interface CsvFile {
  id: string;
  name: string;
  path: string;
  year: number;
  month: number;
}

export interface CsvIndex {
  files: CsvFile[];
}
