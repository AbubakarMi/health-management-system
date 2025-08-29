
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { mockFinancialData } from "@/lib/constants"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { TrendingUp, DollarSign, ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { useMemo } from "react"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(180 100% 50%)",
  },
  expenses: {
    label: "Expenses", 
    color: "hsl(280 65% 60%)",
  },
} satisfies ChartConfig

export function FinancialOverviewChart() {
  const stats = useMemo(() => {
    const latestData = mockFinancialData[mockFinancialData.length - 1]
    const previousData = mockFinancialData[mockFinancialData.length - 2]
    
    const revenueChange = ((latestData.revenue - previousData.revenue) / previousData.revenue) * 100
    const profit = latestData.revenue - latestData.expenses
    const profitMargin = (profit / latestData.revenue) * 100
    
    return {
      currentRevenue: latestData.revenue,
      currentExpenses: latestData.expenses,
      profit,
      profitMargin,
      revenueChange,
      totalRevenue: mockFinancialData.reduce((sum, item) => sum + item.revenue, 0)
    }
  }, [])

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Financial Overview
            </CardTitle>
            <CardDescription className="text-base">Monthly Revenue vs. Expenses Analysis</CardDescription>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-teal-400/10 via-cyan-400/10 to-blue-500/10 rounded-full">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-semibold text-teal-400">
              {stats.revenueChange > 0 ? '+' : ''}{stats.revenueChange.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-teal-400/10 to-cyan-400/10">
            <DollarSign className="w-5 h-5 text-teal-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">${(stats.currentRevenue/1000).toFixed(0)}K</div>
            <div className="text-xs text-muted-foreground">Revenue</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-400/10 to-pink-400/10">
            <ArrowDownIcon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">${(stats.currentExpenses/1000).toFixed(0)}K</div>
            <div className="text-xs text-muted-foreground">Expenses</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-400/10 to-emerald-400/10">
            <ArrowUpIcon className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">${(stats.profit/1000).toFixed(0)}K</div>
            <div className="text-xs text-muted-foreground">Profit</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-400/10 to-indigo-400/10">
            <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{stats.profitMargin.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Margin</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="h-[24rem] pt-4">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <AreaChart 
            data={mockFinancialData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(180 100% 50%)" stopOpacity={0.9}/>
                <stop offset="50%" stopColor="hsl(162 100% 50%)" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="hsl(195 100% 50%)" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(280 65% 60%)" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="hsl(300 65% 60%)" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="hsl(320 65% 60%)" stopOpacity={0.1}/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid 
              strokeDasharray="2 4" 
              stroke="hsl(var(--border))" 
              strokeOpacity={0.3}
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}
            />
            <Tooltip 
              content={<ChartTooltipContent 
                formatter={(value, name) => [`$${(value as number).toLocaleString()}`, name]}
                labelFormatter={(label) => `Month: ${label}`}
              />} 
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(180 100% 50%)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              name="Revenue"
              filter="url(#glow)"
              animationDuration={2000}
              animationBegin={0}
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stroke="hsl(280 65% 60%)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorExpenses)" 
              name="Expenses"
              animationDuration={2000}
              animationBegin={500}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
