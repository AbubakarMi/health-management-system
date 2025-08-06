
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { medicationManager } from "@/lib/constants"
import { useEffect, useState } from "react";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  available: {
    label: "Available",
    color: "hsl(var(--chart-5))",
  },
  lowStock: {
    label: "Low Stock Threshold",
    color: "hsl(var(--destructive))",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication Availability</CardTitle>
        <CardDescription>Current stock levels of key medications.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart data={medicationData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="available" fill="var(--color-available)" name="Available" radius={4} />
            <Bar dataKey="lowStock" fill="var(--color-lowStock)" name="Low Stock Threshold" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
