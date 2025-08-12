
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { communicationManager, Communication } from "@/lib/constants";
import { MessageSquare, Mail, Smartphone } from "lucide-react";
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export default function CommunicationsPage() {
    const [communications, setCommunications] = useState<Communication[]>([]);

    useEffect(() => {
        const handleUpdate = (updatedComms: Communication[]) => {
            setCommunications([...updatedComms]);
        };
        handleUpdate(communicationManager.getCommunications());
        const unsubscribe = communicationManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, []);

    const getIcon = (method: string) => {
        switch (method) {
            case 'Email': return <Mail className="w-4 h-4 text-muted-foreground" />;
            case 'WhatsApp': return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
            case 'SMS':
            default: return <Smartphone className="w-4 h-4 text-muted-foreground" />;
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6" />
                    <div>
                        <CardTitle>Automated Communications Log</CardTitle>
                        <CardDescription>A log of all automated messages sent to patients.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Message</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {communications.map((comm) => (
                            <TableRow key={comm.id}>
                                <TableCell className="font-medium">{comm.patientName}</TableCell>
                                <TableCell>
                                     <Badge variant={comm.type === 'Follow-up' ? 'secondary' : 'default'}>{comm.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getIcon(comm.method)}
                                        <span>{comm.method}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{format(parseISO(comm.timestamp), 'PPP p')}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(parseISO(comm.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">{comm.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {communications.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No automated communications have been sent yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
