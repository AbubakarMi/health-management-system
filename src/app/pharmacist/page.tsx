
"use client";

import { MedicationAvailabilityChart } from "@/components/charts/medication-availability-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { prescriptionManager, Prescription } from "@/lib/constants";

export default function PharmacistDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  
  useEffect(() => {
    const handleUpdate = (updatedPrescriptions: Prescription[]) => {
        setPrescriptions(updatedPrescriptions.filter(p => p.status === 'Pending').slice(0, 4));
    }
    handleUpdate(prescriptionManager.getPrescriptions());
    const unsubscribe = prescriptionManager.subscribe(handleUpdate);
    return () => unsubscribe();
  }, []);


  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <MedicationAvailabilityChart />
      <Card>
        <CardHeader>
          <CardTitle>Pending Prescriptions</CardTitle>
          <CardDescription>Prescriptions that need attention.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Medicine</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.patientName}</TableCell>
                  <TableCell>{p.medicine}</TableCell>
                  <TableCell>
                    <Badge variant='secondary'>{p.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
