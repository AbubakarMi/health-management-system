
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bedManager, Bed, patientManager, Patient } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { BedDouble, Hotel, UserCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdmissionsPage() {
    const [beds, setBeds] = useState<Bed[]>(bedManager.getBeds());
    const [admittedPatients, setAdmittedPatients] = useState<Patient[]>(patientManager.getAdmittedPatients());
    const [isAssignBedDialogOpen, setAssignBedDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedBed, setSelectedBed] = useState<string>("");
    const { toast } = useToast();

    useEffect(() => {
        const handleBedUpdate = (updatedBeds: Bed[]) => setBeds([...updatedBeds]);
        const handlePatientUpdate = (updatedPatients: Patient[]) => {
            setAdmittedPatients(updatedPatients.filter(p => p.admission.isAdmitted));
        };
        
        const unsubscribeBeds = bedManager.subscribe(handleBedUpdate);
        const unsubscribePatients = patientManager.subscribe(handlePatientUpdate);

        return () => {
            unsubscribeBeds();
            unsubscribePatients();
        };
    }, []);

    const openAssignBedDialog = (patient: Patient) => {
        setSelectedPatient(patient);
        setSelectedBed("");
        setAssignBedDialogOpen(true);
    };

    const handleAssignBed = () => {
        if (!selectedPatient || !selectedBed) {
            toast({ variant: "destructive", title: "Selection Missing", description: "Please select a bed." });
            return;
        }
        bedManager.assignBed(selectedPatient.id, selectedBed);
        toast({ title: "Bed Assigned", description: `${selectedPatient.name} has been assigned to bed ${selectedBed}.` });
        setAssignBedDialogOpen(false);
    };

    const occupancyData = useMemo(() => {
        const totalBeds = beds.length;
        const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
        const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
        return { totalBeds, occupiedBeds, occupancyRate };
    }, [beds]);
    
    const availableBeds = useMemo(() => bedManager.getAvailableBeds(), [beds]);

    return (
        <>
            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
                            <Hotel className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{occupancyData.totalBeds}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Beds Occupied</CardTitle>
                            <BedDouble className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{occupancyData.occupiedBeds}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{occupancyData.occupancyRate.toFixed(1)}%</div>
                             <Progress value={occupancyData.occupancyRate} className="mt-2 h-2" />
                        </CardContent>
                    </Card>
                </div>
            
                <Card>
                    <CardHeader>
                        <CardTitle>Admitted Patients</CardTitle>
                        <CardDescription>Manage bed assignments for admitted patients.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Admission Date</TableHead>
                                    <TableHead>Assigned Bed</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admittedPatients.map(patient => (
                                    <TableRow key={patient.id}>
                                        <TableCell className="font-medium">{patient.name}</TableCell>
                                        <TableCell>{patient.admission.admissionDate}</TableCell>
                                        <TableCell>
                                            {patient.admission.roomNumber ? 
                                                <Badge>Room {patient.admission.roomNumber} - Bed {patient.admission.bedNumber}</Badge> : 
                                                <Badge variant="secondary">Awaiting Assignment</Badge>
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => openAssignBedDialog(patient)}>
                                                {patient.admission.bedNumber ? "Reassign Bed" : "Assign Bed"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            {/* Assign Bed Dialog */}
            <Dialog open={isAssignBedDialogOpen} onOpenChange={setAssignBedDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Bed to {selectedPatient?.name}</DialogTitle>
                        <DialogDescription>
                            Select an available bed from the list below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Select onValueChange={setSelectedBed} value={selectedBed}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an available bed" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableBeds.map(bed => (
                                    <SelectItem key={bed.id} value={bed.id}>
                                        Room {bed.roomNumber} - Bed {bed.bedNumber}
                                    </SelectItem>
                                ))}
                                 {availableBeds.length === 0 && (
                                     <div className="p-4 text-center text-sm text-muted-foreground">No beds available.</div>
                                 )}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setAssignBedDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" onClick={handleAssignBed} disabled={!selectedBed}>Assign Bed</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
