
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { communicationManager, Communication } from "@/lib/constants";
import { MessageSquare, Mail, Smartphone, Send, History } from "lucide-react";
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CommunicationsPage() {
    const [communications, setCommunications] = useState<Communication[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const handleUpdate = (updatedComms: Communication[]) => {
            setCommunications([...updatedComms]);
        };
        handleUpdate(communicationManager.getCommunications());
        const unsubscribe = communicationManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, []);

    const { pending, sent } = useMemo(() => {
        return {
            pending: communications.filter(c => c.status === 'Pending'),
            sent: communications.filter(c => c.status === 'Sent')
        }
    }, [communications]);

    const handleSend = (comm: Communication) => {
        communicationManager.markAsSent(comm.id);
        toast({
            title: "Message Sent (Simulated)",
            description: `A ${comm.type} notification has been logged as sent to ${comm.patientName}.`
        })
    };

    const getIcon = (method: string) => {
        switch (method) {
            case 'Email': return <Mail className="w-4 h-4 text-muted-foreground" />;
            case 'WhatsApp': return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
            case 'SMS':
            default: return <Smartphone className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const renderTable = (data: Communication[], isSentLog: boolean) => (
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>{isSentLog ? 'Time Sent' : 'Time Queued'}</TableHead>
                    {!isSentLog && <TableHead><span className="sr-only">Actions</span></TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((comm) => (
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
                        <TableCell className="max-w-xs truncate">{comm.message}</TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span>{format(parseISO(comm.timestamp), 'PPP p')}</span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(parseISO(comm.timestamp), { addSuffix: true })}
                                </span>
                            </div>
                        </TableCell>
                        {!isSentLog && (
                            <TableCell className="text-right">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm"><Send className="mr-2 h-4 w-4"/>Send</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Notification</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                You are about to send the following message:
                                                <div className="my-4 p-3 border rounded-md bg-muted text-foreground">
                                                    <p className="font-semibold">To: {comm.patientName} ({comm.patientContact}) via {comm.method}</p>
                                                    <p className="mt-2 text-sm">"{comm.message}"</p>
                                                </div>
                                                This action will be logged. Do you want to proceed?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleSend(comm)}>Confirm and Send</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6" />
                    <div>
                        <CardTitle>Communications Hub</CardTitle>
                        <CardDescription>Manage and send automated patient notifications.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pending">
                    <TabsList>
                        <TabsTrigger value="pending">
                            <Send className="mr-2 h-4 w-4" />
                            Pending Queue
                            {pending.length > 0 && <Badge variant="secondary" className="ml-2">{pending.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="sent">
                             <History className="mr-2 h-4 w-4" />
                            Sent Log
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending" className="mt-4">
                        {pending.length > 0 ? renderTable(pending, false) : (
                             <div className="text-center py-16 text-muted-foreground">
                                <p className="font-semibold">The pending queue is empty.</p>
                                <p className="text-sm">All patient communications have been sent.</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="sent" className="mt-4">
                        {sent.length > 0 ? renderTable(sent, true) : (
                            <div className="text-center py-16 text-muted-foreground">
                                <p>No communications have been sent yet.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
