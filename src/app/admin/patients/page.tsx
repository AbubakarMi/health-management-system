
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { detailedPatients as initialPatients, Patient } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CreatePatientDialog } from "@/components/create-patient-dialog";
import { useToast } from "@/hooks/use-toast";


export default function Page() {
    const [patients, setPatients] = useState(initialPatients.filter(p => p.condition !== 'Deceased'));
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();

    const handlePatientSaved = (newPatient: Omit<Patient, 'id' | 'medicalHistory' | 'prescriptions' | 'lastVisit' | 'labTests' | 'bloodType' | 'admission'>) => {
        // Generate a random 3-character alphanumeric suffix
        const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();

        // Find the highest existing patient number to generate a new sequential one
        let maxNumber = 0;
        initialPatients.forEach(p => {
            const numPart = parseInt(p.id.split('-')[1]);
            if (numPart > maxNumber) {
                maxNumber = numPart;
            }
        });
        const newPatientNumber = maxNumber + 1;
        const paddedNumber = String(newPatientNumber).padStart(6, '0');

        const genderPrefix = newPatient.gender === 'Male' ? 'PM' : 'PF';
        const newId = `${genderPrefix}-${paddedNumber}-${suffix}`;

        const patientToAdd: Patient = {
            ...newPatient,
            id: newId,
            lastVisit: new Date().toISOString().split('T')[0],
            bloodType: 'O+',
            admission: { isAdmitted: false, admissionDate: null, dischargeDate: null, roomNumber: null, bedNumber: null },
            medicalHistory: [{
                id: `visit-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                event: "Patient Registration",
                details: `Patient registered with ID ${newId} and assigned to ${newPatient.assignedDoctor}.`,
                doctor: "Admin"
            }],
            prescriptions: [],
            labTests: []
        };
        
        initialPatients.unshift(patientToAdd);
        setPatients(initialPatients.filter(p => p.condition !== 'Deceased'));

        toast({
            title: "Patient Created",
            description: `${newPatient.name} has been successfully added with ID ${newId}.`
        });
        setDialogOpen(false);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>All Patients</CardTitle>
                            <CardDescription>A list of all active patients in the system.</CardDescription>
                        </div>
                        <Button onClick={() => setDialogOpen(true)}>Create Patient</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Patient ID</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead>Last Visit</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients.map((patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person" />
                                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {patient.name}
                                    </TableCell>
                                    <TableCell>{patient.id}</TableCell>
                                    <TableCell>
                                        <Badge variant={patient.condition === 'Critical' ? 'destructive' : 'secondary'}>{patient.condition}</Badge>
                                    </TableCell>
                                    <TableCell>{patient.lastVisit}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="icon">
                                            <Link href={`/admin/patients/${patient.id}`}>
                                                <ArrowRight className="w-4 h-4" />
                                                <span className="sr-only">View Patient</span>
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <CreatePatientDialog
                isOpen={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                onPatientSaved={handlePatientSaved}
            />
        </>
    )
}

    