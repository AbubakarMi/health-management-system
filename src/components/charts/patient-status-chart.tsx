
"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"
import type { Patient } from "@/lib/constants"

interface PatientStatusChartProps {
  patients: Patient[];
}

const chartConfig = {
  Critical: { label: "Critical", color: "hsl(var(--destructive))" },
  Improving: { label: "Improving", color: "hsl(var(--chart-5))" },
  Stable: { label: "Stable", color: "hsl(var(--chart-1))" },
  Normal: { label: "Normal", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

export function PatientStatusChart({ patients }: PatientStatusChartProps) {

  const chartData = React.useMemo(() => {
    const statusCounts = patients.reduce((acc, patient) => {
      acc[patient.condition] = (acc[patient.condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      fill: `var(--color-${status})`,
    }));
  }, [patients]);

  const totalPatients = React.useMemo(() => {
    return patients.length;
  }, [patients]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Status Overview</CardTitle>
        <CardDescription>Breakdown of patient conditions for your caseload.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
               {chartData.map((entry) => (
                 <Cell key={`cell-${entry.status}`} fill={entry.fill} />
               ))}
            </Pie>
             <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-3xl font-bold"
             >
                {totalPatients.toLocaleString()}
            </text>
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground"
                dy="20"
            >
                Patients
            </text>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
