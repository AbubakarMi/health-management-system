
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { autopsyManager, AutopsyCase } from "@/lib/constants";
import { Microscope } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorAutopsyPage() {
    const [allCases, setAllCases] = useState<AutopsyCase[]>([]);
    const router = useRouter();
    
    // In a real app, this would come from an authentication context
    const loggedInDoctor = "Dr. Aisha Bello";

    useEffect(() => {
        const handleUpdate = (updatedCases: AutopsyCase[]) => setAllCases([...updatedCases]);
        handleUpdate(autopsyManager.getCases());
        const unsubscribe = autopsyManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, []);
    
    const myCases = useMemo(() => {
        return allCases.filter(c => c.assignedDoctor === loggedInDoctor);
    }, [allCases, loggedInDoctor]);


    const handleRowClick = (caseId: string) => {
        router.push(`/doctor/autopsy/${caseId}`);
    }
    
    const getStatusVariant = (status: AutopsyCase['status']) => {
        switch (status) {
            case 'Completed': return 'default';
            case 'Report Pending': return 'secondary';
            case 'Awaiting Autopsy':
            default: return 'destructive';
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Microscope className="w-6 h-6"/>
                    <div>
                        <CardTitle>My Autopsy Cases</CardTitle>
                        <CardDescription>A list of all autopsy cases assigned to you.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Case ID</TableHead>
                            <TableHead>Deceased's Name</TableHead>
                            <TableHead>Date Registered</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {myCases.map((caseItem) => (
                            <TableRow key={caseItem.id} onClick={() => handleRowClick(caseItem.id)} className="cursor-pointer">
                                <TableCell className="font-medium">{caseItem.id}</TableCell>
                                <TableCell>{caseItem.deceasedName}</TableCell>
                                <TableCell>{caseItem.dateRegistered}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(caseItem.status)} className={caseItem.status === 'Completed' ? 'bg-green-500' : ''}>
                                        {caseItem.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {myCases.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>You have no autopsy cases assigned to you.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
