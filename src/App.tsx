import { AttendanceChart } from "@/components/charts/attendance-chart";
import { MonthlyStatsChart } from "@/components/charts/monthly-stats-chart";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StatsOverview } from "@/components/stats/stats-overview";
import { formatMonthId } from "@/lib/csv-loader";
import { cn } from "@/lib/utils";
import { useWorkStore } from "@/stores/use-work-store";
import { useEffect } from "react";

function App() {
  const {
    files,
    selectedFile,
    records,
    previousRecords,
    allMonthlyStats,
    isInitialLoading,
    isDataLoading,
    error,
    loadIndex,
    selectFile,
  } = useWorkStore();

  useEffect(() => {
    void loadIndex();
  }, [loadIndex]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header files={files} selectedFile={selectedFile} onSelectFile={selectFile} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-2 py-4 sm:px-4 sm:py-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
        {isInitialLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              読み込み中...
            </div>
          </div>
        ) : records.length > 0 ? (
          <div
            className={cn(
              "space-y-4 sm:space-y-6",
              isDataLoading && "pointer-events-none opacity-50",
            )}
          >
            <StatsOverview records={records} previousRecords={previousRecords} />
            <AttendanceChart records={records} />
            <MonthlyStatsChart
              stats={allMonthlyStats}
              selectedMonth={selectedFile ? formatMonthId(selectedFile) : undefined}
            />
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
      <Footer />
    </div>
  );
}

export default App;
