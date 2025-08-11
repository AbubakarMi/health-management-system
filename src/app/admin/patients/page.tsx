
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { detailedPatients as initialPatients, Patient } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle } from "lucide-react";


export default function Page() {
    const [patients, setPatients] = useState(initialPatients.filter(p => p.condition !== 'Deceased'));

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>All Patients</CardTitle>
                            <CardDescription>A list of all active patients in the system.</CardDescription>
                        </div>
                        <Button asChild>
                           <Link href="/admin/patients/create">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Patient
                           </Link>
                        </Button>
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
