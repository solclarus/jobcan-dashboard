import { MonthSelector } from "@/components/filters/month-selector";
import { Button } from "@/components/ui/button";
import type { CsvFile } from "@/types/csv-file";
import { Github } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  files: CsvFile[];
  selectedFile: CsvFile | null;
  onSelectFile: (file: CsvFile) => void;
}

export function Header({ files, selectedFile, onSelectFile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-12 sm:h-14 max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-8">
        <MonthSelector files={files} selectedFile={selectedFile} onSelect={onSelectFile} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            size={"icon"}
            variant={"outline"}
            className="cursor-pointer"
            aria-label="テーマ切り替え"
            asChild
          >
            <a
              href="https://github.com/solclarus/jobcan-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
