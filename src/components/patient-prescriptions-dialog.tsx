
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Lightbulb, CheckCircle, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SuggestionDialog } from "@/components/suggestion-dialog";
import { useToast } from "@/hooks/use-toast";
import { Patient, Prescription, Suggestion, prescriptionManager, detailedPatients } from "@/lib/constants";

type PatientWithPrescriptions = {
    patient: Patient;
    prescriptions: Prescription[];
    pendingCount: number;
};

interface PatientPrescriptionsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    patientData: PatientWithPrescriptions;
}

export function PatientPrescriptionsDialog({ isOpen, onClose, patientData }: PatientPrescriptionsDialogProps) {
    const [suggestingFor, setSuggestingFor] = useState<Prescription | null>(null);
    const { toast } = useToast();
    const { patient, prescriptions } = patientData;

    const handleStatusChange = (id: string, status: Prescription['status']) => {
        prescriptionManager.updatePrescriptionStatus(id, status);
        toast({ title: "Status Updated", description: `Prescription status changed to ${status}.`});
    };
    
    const handleSaveSuggestion = (suggestionData: Omit<Suggestion, 'status'>) => {
        if (!suggestingFor) return;
        
        const patientRecord = detailedPatients.find(p => p.id === patient.id);
        if (!patientRecord) return;
        
        prescriptionManager.addSuggestion(suggestingFor.id, suggestionData, patientRecord.id);
        toast({
            title: "Suggestion Submitted",
            description: `Your suggestion for ${suggestingFor.medicine} has been sent to ${suggestingFor.doctor} for review.`,
        });
        setSuggestingFor(null);
    };

    const getStatusBadge = (p: Prescription) => {
        if (p.suggestion?.status === 'pending') {
            return <Badge className="bg-yellow-500">Suggestion Pending</Badge>;
        }
        if (p.suggestion?.status === 'accepted') {
            return <Badge className="bg-green-500 flex items-center gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild><CheckCircle className="h-3 w-3" /></TooltipTrigger>
                        <TooltipContent><p>Suggestion was accepted by the doctor.</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                Filled
            </Badge>;
        }
        if (p.suggestion?.status === 'rejected') {
             return <Badge variant="destructive" className="flex items-center gap-1">
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild><XCircle className="h-3 w-3" /></TooltipTrigger>
                        <TooltipContent>
                            <p className="font-bold">Suggestion Rejected</p>
                            <p className="max-w-xs">{p.suggestion.rejectionReason}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                 {p.status}
             </Badge>;
        }

        switch (p.status) {
            case 'Filled': return <Badge className="bg-green-500">Filled</Badge>;
            case 'Unavailable': return <Badge variant="destructive">Unavailable</Badge>;
            case 'Pending':
            default: return <Badge variant="secondary">Pending</Badge>;
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16 border">
                                <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person" />
                                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <DialogTitle className="text-2xl">Prescriptions for {patient.name}</DialogTitle>
                                <DialogDescription>
                                    Manage all prescriptions for this patient. Condition: <Badge variant={patient.condition === 'Critical' ? 'destructive' : 'secondary'}>{patient.condition}</Badge>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <div className="grid gap-6 mt-4">
                        <section>
                            <h3 className="font-semibold text-lg mb-2">Clinical Summary</h3>
                            <ScrollArea className="h-24 p-3 border rounded-md bg-muted/50 text-sm text-muted-foreground">
                                {patient.clinicalSummary || "No summary available."}
                            </ScrollArea>
                        </section>

                        <section>
                            <h3 className="font-semibold text-lg mb-2">Prescription List</h3>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Medicine</TableHead>
                                            <TableHead>Dosage</TableHead>
                                            <TableHead>Doctor</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {prescriptions.map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell className="font-medium">{p.medicine}</TableCell>
                                                <TableCell>{p.dosage}</TableCell>
                                                <TableCell>{p.doctor}</TableCell>
                                                <TableCell>{getStatusBadge(p)}</TableCell>
                                                <TableCell className="text-right">
                                                     <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleStatusChange(p.id, 'Filled')} disabled={p.suggestion?.status === 'pending'}>Mark as Filled</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusChange(p.id, 'Pending')}>Mark as Pending</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleStatusChange(p.id, 'Unavailable')} disabled={p.suggestion?.status === 'pending'}>Mark as Unavailable</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => setSuggestingFor(p)} disabled={!!p.suggestion}>
                                                                <Lightbulb className="mr-2 h-4 w-4" />
                                                                Suggest Alternative
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </section>
                    </div>
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {suggestingFor && (
                <SuggestionDialog
                    isOpen={!!suggestingFor}
                    onClose={() => setSuggestingFor(null)}
                    prescription={suggestingFor}
                    onSuggestionSubmit={handleSaveSuggestion}
                />
            )}
        </>
    );
}
