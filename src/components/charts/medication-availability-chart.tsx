
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { medicationManager } from "@/lib/constants"
import { useEffect, useState, useMemo } from "react";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Package, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

const chartConfig = {
  available: {
    label: "Available Stock",
    color: "hsl(162 100% 50%)",
  },
  lowStock: {
    label: "Low Stock Threshold", 
    color: "hsl(0 84% 60%)",
  },
} satisfies ChartConfig;


export function MedicationAvailabilityChart() {
  const [medicationData, setMedicationData] = useState(medicationManager.getMedications());

  useEffect(() => {
      const handleUpdate = () => {
          setMedicationData([...medicationManager.getMedications()]);
      }
      const unsubscribe = medicationManager.subscribe(handleUpdate);
      return () => unsubscribe();
  }, [])

  const stats = useMemo(() => {
    const totalMedications = medicationData.length;
    const lowStockItems = medicationData.filter(med => med.available <= med.lowStock).length;
    const criticalItems = medicationData.filter(med => med.available < med.lowStock * 0.5).length;
    const totalValue = medicationData.reduce((sum, med) => sum + (med.available * med.price), 0);
    
    return {
      total: totalMedications,
      lowStock: lowStockItems,
      critical: criticalItems,
      wellStocked: totalMedications - lowStockItems,
      totalValue,
      lowStockRate: ((lowStockItems / totalMedications) * 100).toFixed(1)
    };
  }, [medicationData]);

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Medication Inventory
            </CardTitle>
            <CardDescription className="text-base">Real-time stock levels and availability tracking</CardDescription>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-400/10 via-red-400/10 to-pink-400/10 rounded-full">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-orange-400">
              {stats.lowStockRate}% Low Stock
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-400/10 to-indigo-400/10">
            <Package className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Items</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-400/10 to-emerald-400/10">
            <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{stats.wellStocked}</div>
            <div className="text-xs text-muted-foreground">Well Stocked</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-orange-400/10 to-yellow-400/10">
            <TrendingDown className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{stats.lowStock}</div>
            <div className="text-xs text-muted-foreground">Low Stock</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-red-400/10 to-pink-400/10">
            <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{stats.critical}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-[28rem] pt-4">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart 
            data={medicationData} 
            layout="vertical" 
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <defs>
              <linearGradient id="availableGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(162 100% 50%)" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="hsl(180 100% 50%)" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="lowStockGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(0 84% 60%)" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="hsl(15 84% 60%)" stopOpacity={0.6}/>
              </linearGradient>
              <filter id="barShadow">
                <feDropShadow dx="2" dy="2" stdDeviation="4" floodOpacity="0.3"/>
              </filter>
            </defs>
            <CartesianGrid 
              strokeDasharray="2 4" 
              stroke="hsl(var(--border))" 
              strokeOpacity={0.3}
              horizontal={false}
            />
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              content={<ChartTooltipContent 
                formatter={(value, name, props) => {
                  const medication = medicationData.find(m => m.name === props.payload?.name);
                  const isLowStock = medication && medication.available <= medication.lowStock;
                  return [
                    `${value} units`,
                    name,
                    isLowStock ? '⚠️ Low Stock Alert' : ''
                  ];
                }}
              />}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar 
              dataKey="available" 
              fill="url(#availableGradient)" 
              name="Available Stock" 
              radius={[0, 4, 4, 0]}
              filter="url(#barShadow)"
              animationDuration={1500}
              animationBegin={0}
            />
            <Bar 
              dataKey="lowStock" 
              fill="url(#lowStockGradient)" 
              name="Low Stock Threshold" 
              radius={[0, 2, 2, 0]}
              opacity={0.7}
              animationDuration={1500}
              animationBegin={300}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
