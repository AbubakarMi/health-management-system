
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { communicationManager, Communication } from "@/lib/constants";
import { MessageSquare, Mail, Smartphone, Send, History, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendNotification } from "@/services/notificationService";

export default function CommunicationsPage() {
    const [communications, setCommunications] = useState<Communication[]>([]);
    const [isSending, setIsSending] = useState<string | null>(null); // Store ID of comm being sent
    const { toast } = useToast();

    useEffect(() => {
        const handleUpdate = (updatedComms: Communication[]) => {
            setCommunications([...updatedComms]);
        };
        handleUpdate(communicationManager.getCommunications());
        const unsubscribe = communicationManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, []);

    const { pending, sent, failedCount } = useMemo(() => {
        return {
            pending: communications.filter(c => c.status === 'Pending'),
            sent: communications.filter(c => c.status === 'Sent'),
            failedCount: 0, // Placeholder for future implementation
        }
    }, [communications]);

    const handleSend = async (comm: Communication) => {
        setIsSending(comm.id);
        const result = await sendNotification(comm);
        if (result.success) {
            toast({
                title: "Message Sent",
                description: `A ${comm.type} notification has been sent to ${comm.patientName}.`
            });
        } else {
            toast({
                variant: "destructive",
                title: "Failed to Send",
                description: result.message,
            });
        }
        setIsSending(null);
    };

    const getIcon = (method: string) => {
        switch (method) {
            case 'Email': return <Mail className="w-5 h-5 text-muted-foreground" />;
            case 'WhatsApp': return <MessageSquare className="w-5 h-5 text-muted-foreground" />;
            case 'SMS':
            default: return <Smartphone className="w-5 h-5 text-muted-foreground" />;
        }
    };

    const renderTable = (data: Communication[], isSentLog: boolean) => (
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px]">Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="max-w-[300px]">Message</TableHead>
                    <TableHead>{isSentLog ? 'Time Sent' : 'Time Queued'}</TableHead>
                    {!isSentLog && <TableHead className="text-right">Actions</TableHead>}
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
                        <TableCell className="max-w-xs truncate text-muted-foreground">{comm.message}</TableCell>
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
                                        <Button size="sm" disabled={isSending === comm.id} className="bg-green-600 hover:bg-green-700">
                                            {isSending === comm.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                                            {isSending === comm.id ? 'Sending...' : 'Send Now'}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Notification</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                You are about to send the following message. This will contact the patient directly.
                                                <div className="my-4 p-3 border rounded-md bg-muted text-foreground">
                                                    <p className="font-semibold">To: {comm.patientName} ({comm.patientContact})</p>
                                                    <p className="font-semibold">Via: {comm.method}</p>
                                                    <p className="mt-2 text-sm">"{comm.message}"</p>
                                                </div>
                                                Do you want to proceed?
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
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Communications Hub</h1>
                    <p className="text-muted-foreground">Manage and dispatch automated patient notifications.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Queue</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pending.length}</div>
                        <p className="text-xs text-muted-foreground">messages awaiting admin action</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sent.length}</div>
                         <p className="text-xs text-muted-foreground">communications successfully dispatched</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{failedCount}</div>
                         <p className="text-xs text-muted-foreground">requires investigation</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Tabs defaultValue="pending">
                        <div className="p-4 border-b">
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
                        </div>
                        <TabsContent value="pending" className="p-4">
                            {pending.length > 0 ? renderTable(pending, false) : (
                                <div className="text-center py-16 text-muted-foreground">
                                    <CheckCircle className="mx-auto h-12 w-12 mb-4 text-green-500" />
                                    <p className="font-semibold">The pending queue is empty.</p>
                                    <p className="text-sm">All patient communications have been sent.</p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="sent" className="p-4">
                            {sent.length > 0 ? renderTable(sent, true) : (
                                <div className="text-center py-16 text-muted-foreground">
                                     <History className="mx-auto h-12 w-12 mb-4" />
                                    <p>No communications have been sent yet.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
