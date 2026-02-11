import { DailyWorkChart } from "@/components/charts/daily-work-chart";
import { MonthlyComparisonChart } from "@/components/charts/monthly-comparison-chart";
import { OvertimeSummaryChart } from "@/components/charts/overtime-summary-chart";
import { TimeDistributionChart } from "@/components/charts/time-distribution-chart";
import { WeekdayAnalysisChart } from "@/components/charts/weekday-analysis-chart";
import { Header } from "@/components/layout/header";
import { StatsOverview } from "@/components/stats/stats-overview";
import { formatMonthLabel } from "@/lib/csv-loader";
import { useWorkStore } from "@/stores/use-work-store";
import { useEffect } from "react";

function App() {
  const { files, selectedFile, records, previousRecords, isLoading, error, loadIndex, selectFile } =
    useWorkStore();

  useEffect(() => {
    loadIndex();
  }, [loadIndex]);

  const currentIndex = selectedFile ? files.findIndex((f) => f.id === selectedFile.id) : -1;
  const previousFile = currentIndex > 0 ? files[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header files={files} selectedFile={selectedFile} onSelectFile={selectFile} />
      <main className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              読み込み中...
            </div>
          </div>
        ) : records.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            <StatsOverview records={records} previousRecords={previousRecords} />

            <DailyWorkChart records={records} />

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              <TimeDistributionChart records={records} />
              <OvertimeSummaryChart records={records} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              <WeekdayAnalysisChart records={records} />
              <MonthlyComparisonChart
                currentRecords={records}
                previousRecords={previousRecords}
                currentMonth={selectedFile ? formatMonthLabel(selectedFile) : ""}
                previousMonth={previousFile ? formatMonthLabel(previousFile) : ""}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">データがありません</p>
              <p className="mt-1 text-sm text-muted-foreground/70">CSVファイルを追加してください</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
