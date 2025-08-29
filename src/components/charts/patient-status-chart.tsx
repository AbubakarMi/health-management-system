
"use client"

import * as React from "react"
import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"
import { Activity, Users, TrendingUp, AlertCircle } from "lucide-react"
import type { Patient } from "@/lib/constants"

interface PatientStatusChartProps {
  patients: Patient[];
}

const chartConfig = {
  Critical: { label: "Critical", color: "hsl(0 84% 60%)" },
  Improving: { label: "Improving", color: "hsl(45 100% 60%)" },
  Stable: { label: "Stable", color: "hsl(162 100% 50%)" },
  Normal: { label: "Normal", color: "hsl(180 100% 50%)" },
  Deceased: { label: "Deceased", color: "hsl(0 0% 45%)" },
} satisfies ChartConfig

export function PatientStatusChart({ patients }: PatientStatusChartProps) {

  const { chartData, stats } = React.useMemo(() => {
    const statusCounts = patients.reduce((acc, patient) => {
      acc[patient.condition] = (acc[patient.condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: ((count / patients.length) * 100).toFixed(1),
      fill: `var(--color-${status})`,
    }));

    const criticalCount = statusCounts['Critical'] || 0;
    const stableCount = statusCounts['Stable'] || 0;
    const improvingCount = statusCounts['Improving'] || 0;

    return {
      chartData: data,
      stats: {
        total: patients.length,
        critical: criticalCount,
        stable: stableCount,
        improving: improvingCount,
        criticalRate: ((criticalCount / patients.length) * 100).toFixed(1)
      }
    };
  }, [patients]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Critical': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'Stable': return <Activity className="w-4 h-4 text-green-500" />
      case 'Improving': return <TrendingUp className="w-4 h-4 text-yellow-500" />
      default: return <Users className="w-4 h-4 text-cyan-500" />
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Patient Status Overview
            </CardTitle>
            <CardDescription className="text-base">Real-time patient condition analysis</CardDescription>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-400/10 via-orange-400/10 to-yellow-400/10 rounded-full">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">
              {stats.criticalRate}% Critical
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-cyan-400/10 to-blue-400/10">
            <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-red-400/10 to-pink-400/10">
            <AlertCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{stats.critical}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-400/10 to-emerald-400/10">
            <Activity className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{stats.stable}</div>
            <div className="text-xs text-muted-foreground">Stable</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-yellow-400/10 to-orange-400/10">
            <TrendingUp className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{stats.improving}</div>
            <div className="text-xs text-muted-foreground">Improving</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-[28rem] pt-4">
        <div className="flex items-center h-full">
          <div className="flex-1">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <defs>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [`${value} patients (${chartData.find(d => d.status === name)?.percentage}%)`, name]}
                    hideLabel 
                  />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={70}
                  outerRadius={120}
                  strokeWidth={3}
                  stroke="hsl(var(--background))"
                  animationBegin={0}
                  animationDuration={1500}
                  filter="url(#shadow)"
                >
                   {chartData.map((entry, index) => (
                     <Cell 
                       key={`cell-${entry.status}`} 
                       fill={entry.fill}
                       style={{
                         filter: `drop-shadow(0 4px 8px ${entry.fill}40)`
                       }}
                     />
                   ))}
                </Pie>
                 <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-3xl font-bold"
                 >
                    {stats.total}
                </text>
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-sm"
                    dy="20"
                >
                    Total Patients
                </text>
              </PieChart>
            </ChartContainer>
          </div>
          
          <div className="w-48 pl-6 space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground mb-4">STATUS BREAKDOWN</h4>
            {chartData.map((item) => (
              <div key={item.status} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{item.count}</div>
                  <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
