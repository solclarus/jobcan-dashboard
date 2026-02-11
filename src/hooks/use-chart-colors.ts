import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface ChartColors {
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  muted: string;
  mutedForeground: string;
  border: string;
  foreground: string;
  background: string;
}

function getCssVariableValue(name: string): string {
  if (typeof window === "undefined") return "";
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  // HSL値をhsl()形式に変換
  if (value && !value.startsWith("#") && !value.startsWith("rgb") && !value.startsWith("hsl")) {
    return `hsl(${value})`;
  }
  return value;
}

function getColorsFromCss(): ChartColors {
  return {
    chart1: getCssVariableValue("--chart-1"),
    chart2: getCssVariableValue("--chart-2"),
    chart3: getCssVariableValue("--chart-3"),
    chart4: getCssVariableValue("--chart-4"),
    chart5: getCssVariableValue("--chart-5"),
    muted: getCssVariableValue("--muted"),
    mutedForeground: getCssVariableValue("--muted-foreground"),
    border: getCssVariableValue("--border"),
    foreground: getCssVariableValue("--foreground"),
    background: getCssVariableValue("--background"),
  };
}

const DEFAULT_COLORS: ChartColors = {
  chart1: "hsl(221 83% 53%)",
  chart2: "hsl(142 76% 36%)",
  chart3: "hsl(38 92% 50%)",
  chart4: "hsl(0 84% 60%)",
  chart5: "hsl(262 83% 58%)",
  muted: "hsl(210 40% 96.1%)",
  mutedForeground: "hsl(215.4 16.3% 46.9%)",
  border: "hsl(214.3 31.8% 91.4%)",
  foreground: "hsl(222.2 47.4% 11.2%)",
  background: "hsl(0 0% 100%)",
};

export function useChartColors(): ChartColors {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState<ChartColors>(DEFAULT_COLORS);

  useEffect(() => {
    // テーマ変更後にCSSが適用されるのを待つ
    const timer = setTimeout(() => {
      setColors(getColorsFromCss());
    }, 0);

    return () => clearTimeout(timer);
  }, [resolvedTheme]);

  return colors;
}
