
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { detailedPatients, Patient } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Search, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeceasedPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const deceasedPatients = useMemo(() => {
        return detailedPatients
            .filter(p => p.condition === 'Deceased')
            .filter(patient =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [searchQuery]);
    
    const getDateOfDeath = (patient: Patient) => {
        const deceasedEvent = patient.medicalHistory.find(e => e.event.toLowerCase().includes('deceased'));
        return deceasedEvent ? deceasedEvent.date : 'N/A';
    }

    const handleRowClick = (patientId: string) => {
        router.push(`/admin/patients/${patientId}`);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <LogOut className="w-6 h-6"/>
                        <div>
                            <CardTitle>Deceased Patient Records</CardTitle>
                            <CardDescription>An archive of all patients marked as deceased.</CardDescription>
                        </div>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search records..."
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
                            <TableHead>Name</TableHead>
                            <TableHead>Patient ID</TableHead>
                            <TableHead>Date of Death</TableHead>
                            <TableHead>Assigned Doctor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deceasedPatients.map((patient) => (
                            <TableRow key={patient.id} onClick={() => handleRowClick(patient.id)} className="cursor-pointer">
                                <TableCell className="font-medium flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person" />
                                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {patient.name}
                                </TableCell>
                                <TableCell>{patient.id}</TableCell>
                                <TableCell>{getDateOfDeath(patient)}</TableCell>
                                <TableCell>{patient.assignedDoctor}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {deceasedPatients.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No deceased patient records found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
