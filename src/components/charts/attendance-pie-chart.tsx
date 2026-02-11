import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkRecord } from "@/types/work-record";

interface AttendancePieChartProps {
  records: WorkRecord[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function AttendancePieChart({ records }: AttendancePieChartProps) {
  const normalDays = records.filter(
    (r) => r.workTime && !r.status && r.holidayType !== "公休",
  ).length;
  const holidays = records.filter((r) => r.holidayType === "公休" || !r.shiftStart).length;
  const earlyLeave = records.filter((r) => r.status === "早退").length;
  const absent = records.filter((r) => r.status === "欠勤").length;
  const late = records.filter((r) => r.status === "遅刻").length;

  const data = [
    { name: "通常勤務", value: normalDays },
    { name: "休日", value: holidays },
    { name: "早退", value: earlyLeave },
    { name: "欠勤", value: absent },
    { name: "遅刻", value: late },
  ].filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>勤怠内訳</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}日`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <p className="text-sm font-medium">{payload[0].name}</p>
                      <p className="text-sm text-muted-foreground">{payload[0].value}日</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
