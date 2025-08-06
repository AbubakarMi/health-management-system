
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { detailedPatients, MedicalHistoryEntry } from "@/lib/constants";
import { CalendarClock } from "lucide-react";
import { format, isFuture, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

type FollowUp = {
    patientId: string;
    patientName: string;
    followUpDate: string;
    reason: string;
    doctor: string;
};

export default function FollowUpsPage() {
    const router = useRouter();

    const upcomingFollowUps = useMemo(() => {
        const followUps: FollowUp[] = [];
        detailedPatients.forEach(patient => {
            patient.medicalHistory.forEach(entry => {
                if (entry.event.toLowerCase().includes('follow-up scheduled')) {
                    // Extract date from the event details
                    const dateMatch = entry.details.match(/on (\d{4}-\d{2}-\d{2})/);
                    if (dateMatch && dateMatch[1]) {
                        const followUpDate = dateMatch[1];
                        if (isFuture(parseISO(followUpDate))) {
                             followUps.push({
                                patientId: patient.id,
                                patientName: patient.name,
                                followUpDate: followUpDate,
                                reason: entry.details.replace(`Follow-up scheduled on ${followUpDate}. `, ''),
                                doctor: entry.doctor,
                            });
                        }
                    }
                }
            });
        });
        return followUps.sort((a, b) => new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime());
    }, []);
    
    const handleRowClick = (patientId: string) => {
        router.push(`/admin/patients/${patientId}`);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <CalendarClock className="w-6 h-6" />
                    <div>
                        <CardTitle>Upcoming Follow-ups</CardTitle>
                        <CardDescription>A list of all scheduled patient follow-up appointments.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Follow-up Date</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Original Doctor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {upcomingFollowUps.length > 0 ? upcomingFollowUps.map((followUp) => (
                            <TableRow key={`${followUp.patientId}-${followUp.followUpDate}`} onClick={() => handleRowClick(followUp.patientId)} className="cursor-pointer">
                                <TableCell className="font-medium">{followUp.patientName}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{format(parseISO(followUp.followUpDate), 'PPP')}</Badge>
                                </TableCell>
                                <TableCell>{followUp.reason}</TableCell>
                                <TableCell>{followUp.doctor}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No upcoming follow-ups scheduled.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
