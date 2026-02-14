import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { formatMonthLabel } from "@/lib/csv-loader";
import type { CsvFile } from "@/types/csv-file";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
  files: CsvFile[];
  selectedFile: CsvFile | null;
  onSelect: (file: CsvFile) => void;
}

export function MonthSelector({ files, selectedFile, onSelect }: MonthSelectorProps) {
  const options = files.map((file) => ({
    value: file.id,
    label: formatMonthLabel(file),
  }));

  const currentIndex = selectedFile ? files.findIndex((f) => f.id === selectedFile.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < files.length - 1;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const file = files.find((f) => f.id === e.target.value);
    if (file) {
      onSelect(file);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      onSelect(files[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onSelect(files[currentIndex + 1]);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handlePrev}
        disabled={!hasPrev}
        aria-label="前月"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="w-24 sm:w-32">
        <Select options={options} value={selectedFile?.id || ""} onChange={handleChange} />
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleNext}
        disabled={!hasNext}
        aria-label="次月"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
