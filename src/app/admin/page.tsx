
"use client";

import { MedicationAvailabilityChart } from "@/components/charts/medication-availability-chart";
import { LabVisitsChart } from "@/components/charts/lab-visits-chart";
import { DoctorAdmissionsChart } from "@/components/charts/doctor-admissions-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { initialInvoices } from "@/lib/constants";
import { CheckCircle, Clock, FileWarning } from "lucide-react";
import { useMemo } from "react";
import { NairaIcon } from "@/components/ui/naira-icon";

export default function AdminDashboard() {

  const kpiData = useMemo(() => {
    const totalBilled = initialInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = initialInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const outstandingAmount = initialInvoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueInvoices = initialInvoices.filter(inv => inv.status === 'Overdue').length;
    return { totalBilled, totalPaid, outstandingAmount, overdueInvoices };
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
       <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
              <NairaIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">₦{kpiData.totalBilled.toLocaleString()}</div>
          </CardContent>
      </Card>
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">₦{kpiData.totalPaid.toLocaleString()}</div>
          </CardContent>
      </Card>
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">₦{kpiData.outstandingAmount.toLocaleString()}</div>
          </CardContent>
      </Card>
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
              <FileWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{kpiData.overdueInvoices}</div>
          </CardContent>
      </Card>
      <div className="lg:col-span-2">
        <MedicationAvailabilityChart />
      </div>
      <div className="lg:col-span-2">
        <LabVisitsChart />
      </div>
      <div className="lg:col-span-4">
        <DoctorAdmissionsChart />
      </div>
    </div>
  );
}
