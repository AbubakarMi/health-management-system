
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { detailedPatients as initialPatients, Patient } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";


export default function Page() {
    const [searchQuery, setSearchQuery] = useState("");

    const patients = useMemo(() => {
        const activePatients = initialPatients.filter(p => p.condition !== 'Deceased');
        if (!searchQuery) {
            return activePatients;
        }
        return activePatients.filter(patient =>
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>All Patients</CardTitle>
                            <CardDescription>A list of all active patients in the system.</CardDescription>
                        </div>
                         <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search patients..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button asChild>
                               <Link href="/admin/patients/create">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create Patient
                               </Link>
                            </Button>
                        </div>
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
                                 <TableRow key={patient.id} className="cursor-pointer as-child">
                                    <TableCell className="font-medium">
                                        <Link href={`/admin/patients/${patient.id}`} className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person" />
                                                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            {patient.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                         <Link href={`/admin/patients/${patient.id}`} className="block w-full h-full">
                                            {patient.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                         <Link href={`/admin/patients/${patient.id}`} className="block w-full h-full">
                                            <Badge variant={patient.condition === 'Critical' ? 'destructive' : 'secondary'}>{patient.condition}</Badge>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/admin/patients/${patient.id}`} className="block w-full h-full">
                                            {patient.lastVisit}
                                        </Link>
                                    </TableCell>
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
        </>
    )
}
