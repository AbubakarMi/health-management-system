
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { callManager, Call } from "@/lib/constants";
import { Phone, PhoneMissed } from "lucide-react";
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export default function CallHistoryPage() {
    const [calls, setCalls] = useState<Call[]>([]);

    useEffect(() => {
        const handleUpdate = (updatedCalls: Call[]) => {
            setCalls([...updatedCalls]);
        };
        handleUpdate(callManager.getCalls()); // Initial load
        const unsubscribe = callManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, []);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6" />
                    <div>
                        <CardTitle>Emergency Call History</CardTitle>
                        <CardDescription>A log of all incoming emergency calls.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Caller ID</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {calls.map((call) => (
                            <TableRow key={call.id}>
                                <TableCell className="font-medium">{call.callerId}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{format(parseISO(call.timestamp), 'PPP p')}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(parseISO(call.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={call.status === 'Answered' ? 'default' : 'destructive'} className={call.status === 'Answered' ? 'bg-green-500' : ''}>
                                        {call.status === 'Answered' ? <Phone className="mr-2 h-3 w-3"/> : <PhoneMissed className="mr-2 h-3 w-3"/>}
                                        {call.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {calls.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No calls have been recorded yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
