import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export function Select({ className, options, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-8 sm:h-10 w-full appearance-none rounded-md border border-input bg-background px-2 sm:px-3 py-1 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 sm:right-3 top-2 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
    </div>
  );
}
