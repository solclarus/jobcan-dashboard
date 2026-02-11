import { create } from "zustand";
import type { CsvFile } from "@/types/csv-file";
import type { WorkRecord } from "@/types/work-record";
import { loadCsvFile, loadCsvIndex } from "@/lib/csv-loader";

interface WorkState {
  files: CsvFile[];
  selectedFile: CsvFile | null;
  records: WorkRecord[];
  previousRecords: WorkRecord[];
  isLoading: boolean;
  error: string | null;

  loadIndex: () => Promise<void>;
  selectFile: (file: CsvFile) => Promise<void>;
}

export const useWorkStore = create<WorkState>((set, get) => ({
  files: [],
  selectedFile: null,
  records: [],
  previousRecords: [],
  isLoading: false,
  error: null,

  loadIndex: async () => {
    set({ isLoading: true, error: null });
    try {
      const files = await loadCsvIndex();
      set({ files, isLoading: false });

      if (files.length > 0 && !get().selectedFile) {
        const latestFile = files[files.length - 1];
        await get().selectFile(latestFile);
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load index",
        isLoading: false,
      });
    }
  },

  selectFile: async (file: CsvFile) => {
    set({ isLoading: true, error: null, selectedFile: file });
    try {
      const records = await loadCsvFile(file.path);

      const { files } = get();
      const currentIndex = files.findIndex((f) => f.id === file.id);
      let previousRecords: WorkRecord[] = [];

      if (currentIndex > 0) {
        const prevFile = files[currentIndex - 1];
        previousRecords = await loadCsvFile(prevFile.path);
      }

      set({ records, previousRecords, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load CSV file",
        isLoading: false,
      });
    }
  },
}));
