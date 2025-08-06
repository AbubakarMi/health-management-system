
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { mockFinancialData } from "@/lib/constants"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"


const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function FinancialOverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Monthly Revenue vs. Expenses</CardDescription>
      </CardHeader>
      <CardContent className="h-[20.5rem]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <AreaChart data={mockFinancialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
             <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
            <Area type="monotone" dataKey="expenses" stroke="var(--color-expenses)" fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
