
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { mockLabVisitsData } from "@/lib/constants"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
    visits: {
        label: "Visits",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig

export function LabVisitsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lab Patient Visits</CardTitle>
        <CardDescription>Total patient visits to the lab per month.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <AreaChart data={mockLabVisitsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
             <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-visits)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-visits)" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent cursor={false}/>} />
            <Area type="monotone" dataKey="visits" stroke="var(--color-visits)" fillOpacity={1} fill="url(#colorVisits)" name="Visits" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
