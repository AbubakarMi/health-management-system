
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { patientManager, Patient } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { PatientStatusChart } from "@/components/charts/patient-status-chart";
import { DoctorAdmissionsChart } from "@/components/charts/doctor-admissions-chart";

const appointments = [
    { patient: 'Muhammad Bello', patientId: 'PM-000005-K3L', time: '10:00 AM', reason: 'Follow-up', avatar: 'M' },
    { patient: 'Samira Umar', patientId: 'PF-000006-R2D', time: '11:30 AM', reason: 'New Consultation', avatar: 'S' },
    { patient: 'Abdulkarim Sani', patientId: 'PM-000007-S1B', time: '02:00 PM', reason: 'Routine Checkup', avatar: 'A' },
];

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const handleUpdate = () => {
        setPatients([...patientManager.getPatients()]);
    };
    const unsubscribe = patientManager.subscribe(handleUpdate);
    return () => unsubscribe();
  }, []);
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      <PatientStatusChart patients={patients}/>
      <DoctorAdmissionsChart />
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
           <CardDescription>Your schedule for today.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-8">
            {appointments.map((appt, index) => (
              <div key={appt.patient} className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                    <Avatar className="mb-2">
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${appt.avatar}`} data-ai-hint="person" />
                        <AvatarFallback>{appt.avatar}</AvatarFallback>
                    </Avatar>
                    {index < appointments.length - 1 && (
                        <div className="w-px h-full bg-border"></div>
                    )}
                </div>
                <div className="flex-1 pb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">{appt.patient}</p>
                            <p className="text-sm text-muted-foreground">{appt.time} - {appt.reason}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                           <Link href={`/doctor/patients/${appt.patientId}`}>
                                <User className="mr-2 h-4 w-4" />
                                View Patient
                            </Link>
                        </Button>
                    </div>
                </div>
              </div>
            ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
