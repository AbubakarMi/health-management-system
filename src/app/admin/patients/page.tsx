
"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DBPatient {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    bloodGroup?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    condition?: string;
    isAdmitted: boolean;
    roomNumber?: string;
    createdAt: string;
    updatedAt: string;
}

export default function Page() {
    const [searchQuery, setSearchQuery] = useState("");
    const [patients, setPatients] = useState<DBPatient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await fetch('/api/patients');
            if (response.ok) {
                const data = await response.json();
                setPatients(data);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = useMemo(() => {
        const activePatients = patients.filter(p => p.condition !== 'Deceased');
        if (!searchQuery) {
            return activePatients;
        }
        return activePatients.filter(patient => {
            const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase()) ||
                   patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   patient.phone.includes(searchQuery);
        });
    }, [searchQuery, patients]);

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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                                        <p className="mt-2 text-muted-foreground">Loading patients...</p>
                                    </TableCell>
                                </TableRow>
                            ) : filteredPatients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No patients found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <TableRow key={patient.id} className="cursor-pointer">
                                        <TableCell className="font-medium">
                                            <Link href={`/admin/patients/${patient.id}`} className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback>{patient.firstName.charAt(0)}{patient.lastName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {patient.firstName} {patient.lastName}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/admin/patients/${patient.id}`} className="block w-full h-full">
                                                {patient.id.substring(0, 8)}...
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/admin/patients/${patient.id}`} className="block w-full h-full">
                                                <Badge variant={patient.condition === 'Critical' ? 'destructive' : 'secondary'}>
                                                    {patient.condition || 'Stable'}
                                                </Badge>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/admin/patients/${patient.id}`} className="block w-full h-full">
                                                {new Date(patient.createdAt).toLocaleDateString()}
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
