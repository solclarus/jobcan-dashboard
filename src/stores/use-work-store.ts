import { create } from "zustand";
import type { CsvFile } from "@/types/csv-file";
import type { WorkRecord } from "@/types/work-record";
import { loadCsvFile, loadCsvIndex } from "@/lib/csv-loader";
import { getMonthlyStats } from "@/lib/work-calculator";
import type { MonthlyStats } from "@/types/work-record";

export interface MonthlyStatsWithLabel extends MonthlyStats {
  month: string;
  year: number;
  monthNum: number;
}

interface WorkState {
  files: CsvFile[];
  selectedFile: CsvFile | null;
  records: WorkRecord[];
  previousRecords: WorkRecord[];
  allMonthlyStats: MonthlyStatsWithLabel[];
  isInitialLoading: boolean;
  isDataLoading: boolean;
  error: string | null;

  loadIndex: () => Promise<void>;
  selectFile: (file: CsvFile) => Promise<void>;
  loadAllStats: () => Promise<void>;
}

export const useWorkStore = create<WorkState>((set, get) => ({
  files: [],
  selectedFile: null,
  records: [],
  previousRecords: [],
  allMonthlyStats: [],
  isInitialLoading: true,
  isDataLoading: false,
  error: null,

  loadIndex: async () => {
    set({ isInitialLoading: true, error: null });
    try {
      const files = await loadCsvIndex();
      set({ files });

      if (files.length > 0 && !get().selectedFile) {
        const latestFile = files[files.length - 1];
        await get().selectFile(latestFile);
      }

      set({ isInitialLoading: false });

      // 全月の統計をバックグラウンドでロード
      get().loadAllStats();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load index",
        isInitialLoading: false,
      });
    }
  },

  selectFile: async (file: CsvFile) => {
    set({ isDataLoading: true, error: null, selectedFile: file });
    try {
      const records = await loadCsvFile(file.path);

      const { files } = get();
      const currentIndex = files.findIndex((f) => f.id === file.id);
      let previousRecords: WorkRecord[] = [];

      if (currentIndex > 0) {
        const prevFile = files[currentIndex - 1];
        previousRecords = await loadCsvFile(prevFile.path);
      }

      set({ records, previousRecords, isDataLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load CSV file",
        isDataLoading: false,
      });
    }
  },

  loadAllStats: async () => {
    const { files } = get();
    if (files.length === 0) return;

    const results: MonthlyStatsWithLabel[] = [];

    for (const file of files) {
      try {
        const records = await loadCsvFile(file.path);
        const stats = getMonthlyStats(records);
        results.push({
          ...stats,
          month: `${file.year}/${file.month}`,
          year: file.year,
          monthNum: file.month,
        });
      } catch (error) {
        console.error(`Failed to load stats for ${file.id}:`, error);
      }
    }

    set({ allMonthlyStats: results });
  },
}));
