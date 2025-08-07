
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { autopsyManager, AutopsyCase } from "@/lib/constants";
import { CheckCircle, Microscope } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CompletedAutopsyPage() {
    const [allCases, setAllCases] = useState<AutopsyCase[]>([]);

    useEffect(() => {
        const handleUpdate = (updatedCases: AutopsyCase[]) => setAllCases([...updatedCases]);
        handleUpdate(autopsyManager.getCases());
        const unsubscribe = autopsyManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, []);
    
    const completedCases = useMemo(() => {
        return allCases.filter(c => c.status === 'Completed');
    }, [allCases]);

    return (
        <Card>
            <CardHeader>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600"/>
                        <div>
                            <CardTitle>Completed Autopsy Log</CardTitle>
                            <CardDescription>An archive of all finalized autopsy reports.</CardDescription>
                        </div>
                    </div>
                    <Button asChild variant="outline">
                       <Link href="/admin/autopsy">
                           <ArrowLeft className="mr-2 h-4 w-4" />
                           Back to Case Management
                       </Link>
                   </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Case ID</TableHead>
                            <TableHead>Deceased's Name</TableHead>
                            <TableHead>Date Registered</TableHead>
                            <TableHead>Assigned Pathologist</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {completedCases.map((caseItem) => (
                            <TableRow key={caseItem.id}>
                                <TableCell className="font-medium">{caseItem.id}</TableCell>
                                <TableCell>{caseItem.deceasedName}</TableCell>
                                <TableCell>{caseItem.dateRegistered}</TableCell>
                                <TableCell>{caseItem.assignedDoctor}</TableCell>
                                <TableCell>
                                    <Badge className="bg-green-500">
                                        {caseItem.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {completedCases.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No completed autopsy cases found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
