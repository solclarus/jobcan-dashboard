import { MonthSelector } from "@/components/filters/month-selector";
import { ThemeToggle } from "./theme-toggle";
import type { CsvFile } from "@/types/csv-file";

interface HeaderProps {
  files: CsvFile[];
  selectedFile: CsvFile | null;
  onSelectFile: (file: CsvFile) => void;
}

export function Header({ files, selectedFile, onSelectFile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-12 sm:h-14 max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-8">
        <h1 className="text-sm sm:text-lg font-semibold truncate">勤怠ダッシュボード</h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <MonthSelector files={files} selectedFile={selectedFile} onSelect={onSelectFile} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
