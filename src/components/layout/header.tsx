import { MonthSelector } from "@/components/filters/month-selector";
import { Button } from "@/components/ui/button";
import type { CsvFile } from "@/types/csv-file";
import { ThemeToggle } from "./theme-toggle";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.93c.57.1.78-.25.78-.55v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.99 10.99 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.35.78 1.05.78 2.12v3.14c0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

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
              <GithubIcon className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
