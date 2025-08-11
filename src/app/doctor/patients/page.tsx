
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { detailedPatients, Patient } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import Link from "next/link";

export default function Page() {
    const [searchQuery, setSearchQuery] = useState("");
    const loggedInDoctor = "Dr. Aisha Bello";

    const myPatients = useMemo(() => {
        return detailedPatients
            .filter(patient => patient.assignedDoctor === loggedInDoctor)
            .filter(patient =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, loggedInDoctor]);
    
    const getBadgeVariant = (condition: string): "destructive" | "secondary" | "default" => {
        switch (condition) {
            case 'Critical': return 'destructive';
            case 'Improving': return 'secondary';
            case 'Stable': return 'secondary';
            case 'Normal': return 'default';
            default: return 'secondary';
        }
    }
  
    const getBadgeClass = (condition: string): string => {
        switch (condition) {
            case 'Normal': return 'bg-green-500 text-white';
            case 'Improving': return 'bg-yellow-500 text-white';
            default: return '';
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-6 h-6" />
                        <div>
                            <CardTitle>My Patients</CardTitle>
                            <CardDescription>A list of all patients assigned to you.</CardDescription>
                        </div>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or ID..."
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
                            <TableHead>Condition</TableHead>
                            <TableHead>Last Visit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {myPatients.map((patient) => (
                           <TableRow key={patient.id} className="cursor-pointer as-child">
                                <TableCell className="font-medium">
                                    <Link href={`/doctor/patients/${patient.id}`} className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person" />
                                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {patient.name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link href={`/doctor/patients/${patient.id}`} className="block w-full h-full">
                                        {patient.id}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                     <Link href={`/doctor/patients/${patient.id}`} className="block w-full h-full">
                                        <Badge variant={getBadgeVariant(patient.condition)} className={getBadgeClass(patient.condition)}>
                                        {patient.condition}
                                        </Badge>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link href={`/doctor/patients/${patient.id}`} className="block w-full h-full">
                                        {patient.lastVisit}
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {myPatients.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No patients found for "{searchQuery}".</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
