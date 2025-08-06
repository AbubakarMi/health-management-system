
"use client"

import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { detailedPatients } from "@/lib/constants"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "../ui/chart"


const chartConfig = {
  admissions: {
    label: "Admissions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function DoctorAdmissionsChart() {
  const admissionsData = useMemo(() => {
    const admissionsByDoctor: Record<string, number> = {};
    
    detailedPatients
      .filter(p => p.admission.isAdmitted)
      .forEach(patient => {
        if (!admissionsByDoctor[patient.assignedDoctor]) {
          admissionsByDoctor[patient.assignedDoctor] = 0;
        }
        admissionsByDoctor[patient.assignedDoctor]++;
      });
      
    return Object.entries(admissionsByDoctor)
      .map(([doctor, admissions]) => ({ doctor, admissions }))
      .sort((a, b) => a.admissions - b.admissions); // Sort for better visualization
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Patient Admissions</CardTitle>
        <CardDescription>Live patient admissions by doctor.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart 
              data={admissionsData} 
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorAdmissions" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" dataKey="admissions" />
              <YAxis 
                dataKey="doctor" 
                type="category"
                width={110}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent />} 
              />
              <Bar 
                dataKey="admissions" 
                fill="url(#colorAdmissions)" 
                name="Admissions" 
                radius={[0, 4, 4, 0]} 
              />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
