import { Select } from "@/components/ui/select";
import { formatMonthLabel } from "@/lib/csv-loader";
import type { CsvFile } from "@/types/csv-file";

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const file = files.find((f) => f.id === e.target.value);
    if (file) {
      onSelect(file);
    }
  };

  return (
    <div className="w-28 sm:w-36">
      <Select options={options} value={selectedFile?.id || ""} onChange={handleChange} />
    </div>
  );
}
