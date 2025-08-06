
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { prescriptionManager, Prescription, detailedPatients, Patient } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Search, NotebookText, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientPrescriptionsDialog } from "@/components/patient-prescriptions-dialog";

type PatientWithPrescriptions = {
    patient: Patient;
    prescriptions: Prescription[];
    pendingCount: number;
};

export default function Page() {
    const [allPrescriptions, setAllPrescriptions] = useState<Prescription[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<PatientWithPrescriptions | null>(null);

    useEffect(() => {
        const handleUpdate = (updatedPrescriptions: Prescription[]) => {
            setAllPrescriptions([...updatedPrescriptions]);
        };
        handleUpdate(prescriptionManager.getPrescriptions());
        const unsubscribe = prescriptionManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, []);

    const patientsWithPrescriptions = useMemo(() => {
        const patientMap = new Map<string, PatientWithPrescriptions>();

        allPrescriptions.forEach(p => {
            const patientRecord = detailedPatients.find(dp => dp.name === p.patientName);
            if (!patientRecord) return;

            if (!patientMap.has(patientRecord.id)) {
                patientMap.set(patientRecord.id, {
                    patient: patientRecord,
                    prescriptions: [],
                    pendingCount: 0,
                });
            }
            
            const entry = patientMap.get(patientRecord.id)!;
            entry.prescriptions.push(p);
            if (p.status === 'Pending' || p.suggestion?.status === 'pending') {
                entry.pendingCount++;
            }
        });
        
        const sortedPatients = Array.from(patientMap.values())
            .sort((a, b) => b.pendingCount - a.pendingCount);

        if (!searchQuery) {
            return sortedPatients;
        }

        return sortedPatients.filter(p => 
            p.patient.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allPrescriptions, searchQuery]);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Manage Prescriptions</CardTitle>
                            <CardDescription>View and update the status of patient prescriptions.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by patient name..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Total Prescriptions</TableHead>
                                <TableHead>Pending Actions</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patientsWithPrescriptions.map((p) => (
                                <TableRow key={p.patient.id}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={p.patient.avatarUrl} alt={p.patient.name} data-ai-hint="person" />
                                            <AvatarFallback>{p.patient.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {p.patient.name}
                                    </TableCell>
                                    <TableCell>{p.prescriptions.length}</TableCell>
                                    <TableCell>
                                        {p.pendingCount > 0 ? (
                                            <Badge variant="secondary">{p.pendingCount} pending</Badge>
                                        ) : (
                                            <Badge variant="default" className="bg-green-500">All Filled</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedPatient(p)}>
                                           <NotebookText className="mr-2 h-4 w-4" /> View Prescriptions
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {patientsWithPrescriptions.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No patients with prescriptions found for "{searchQuery}".
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedPatient && (
                <PatientPrescriptionsDialog
                    isOpen={!!selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                    patientData={selectedPatient}
                />
            )}
        </>
    );
}
