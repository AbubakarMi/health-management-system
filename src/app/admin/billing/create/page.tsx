
"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { detailedPatients, initialInvoices, Invoice, InvoiceItem, LabTest, Patient, Prescription } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CalendarIcon, UserPlus, FilePlus2, UserSearch, FileText } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SelectPatientDialog } from "@/components/select-patient-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type BillableItem = (Prescription | LabTest) & { type: 'Prescription' | 'Lab Test' };

export default function CreateInvoicePage() {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedItems, setSelectedItems] = useState<Record<string, BillableItem>>({});
    const [dueDate, setDueDate] = useState<Date | undefined>(addDays(new Date(), 14));
    const [isPatientDialogOpen, setPatientDialogOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    const backHref = pathname.startsWith('/admin') ? '/admin/billing' : '/finance/invoices';
    const finalRedirectUrl = backHref;

    const billableItems: BillableItem[] = useMemo(() => {
        if (!selectedPatient) return [];
        const prescriptions = selectedPatient.prescriptions
            .filter(p => !p.invoiced)
            .map(p => ({ ...p, type: 'Prescription' as const }));
        const labTests = selectedPatient.labTests
            .filter(t => !t.invoiced)
            .map(t => ({ ...t, name: t.test, type: 'Lab Test' as const }));
        return [...prescriptions, ...labTests];
    }, [selectedPatient]);
    
    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setSelectedItems({});
        setPatientDialogOpen(false);
    };

    const handleItemSelect = (item: BillableItem) => {
        const newSelectedItems = { ...selectedItems };
        if (newSelectedItems[item.id]) {
            delete newSelectedItems[item.id];
        } else {
            newSelectedItems[item.id] = item;
        }
        setSelectedItems(newSelectedItems);
    };

    const totalAmount = useMemo(() => {
        return Object.values(selectedItems).reduce((sum, item) => sum + item.price, 0);
    }, [selectedItems]);

    const handleCreateInvoice = () => {
        if (!selectedPatient || Object.keys(selectedItems).length === 0 || !dueDate) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please select a patient, at least one item, and a due date.",
            });
            return;
        }

        const invoiceItems: InvoiceItem[] = Object.values(selectedItems).map(item => ({
            id: item.id,
            name: item.type === 'Prescription' ? item.medicine : item.test,
            type: item.type,
            price: item.price
        }));

        const newInvoice: Invoice = {
            id: `INV-${Date.now()}`,
            patientName: selectedPatient.name,
            amount: totalAmount,
            dueDate: format(dueDate, "yyyy-MM-dd"),
            status: "Pending",
            items: invoiceItems,
            doctorName: selectedPatient.assignedDoctor,
        };

        initialInvoices.unshift(newInvoice);

        Object.keys(selectedItems).forEach(itemId => {
            const item = selectedItems[itemId];
            if (item.type === 'Prescription') {
                const pres = selectedPatient.prescriptions.find(p => p.id === itemId);
                if (pres) pres.invoiced = true;
            } else {
                const test = selectedPatient.labTests.find(t => t.id === itemId);
                if (test) test.invoiced = true;
            }
        });
        
        toast({
            title: "Invoice Created",
            description: `Invoice for ${selectedPatient.name} has been successfully created.`,
        });
        router.push(finalRedirectUrl);
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={backHref}><ArrowLeft /></Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create New Invoice</h1>
                </div>

                {!selectedPatient ? (
                     <Card className="flex flex-col items-center justify-center h-96 border-2 border-dashed">
                        <CardContent className="text-center">
                            <UserSearch className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-medium">No Patient Selected</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Please select a patient to start creating an invoice.</p>
                            <Button className="mt-6" onClick={() => setPatientDialogOpen(true)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Select Patient
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle>Billable Items for {selectedPatient.name}</CardTitle>
                                            <CardDescription>Select items to include in this invoice.</CardDescription>
                                        </div>
                                        <Button variant="link" onClick={() => setSelectedPatient(null)}>Change Patient</Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px]"></TableHead>
                                                <TableHead>Item</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {billableItems.length > 0 ? billableItems.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Checkbox 
                                                            checked={!!selectedItems[item.id]}
                                                            onCheckedChange={() => handleItemSelect(item)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{item.type === 'Prescription' ? item.medicine : item.test}</TableCell>
                                                    <TableCell>{item.type}</TableCell>
                                                    <TableCell>{format(new Date(item.type === 'Lab Test' ? item.collected : selectedPatient.lastVisit), "yyyy-MM-dd")}</TableCell>
                                                    <TableCell className="text-right">₦{item.price.toFixed(2)}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                                        <FileText className="mx-auto h-8 w-8 mb-2" />
                                                        No uninvoiced items found for this patient.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <Card className="sticky top-20">
                                <CardHeader>
                                    <CardTitle>Invoice Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="flex items-center gap-3">
                                        <Avatar>
                                          <AvatarImage src={selectedPatient.avatarUrl} data-ai-hint="person" />
                                          <AvatarFallback>{selectedPatient.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-semibold">{selectedPatient.name}</p>
                                          <p className="text-sm text-muted-foreground">{Object.keys(selectedItems).length} item(s) selected</p>
                                        </div>
                                     </div>
                                    <div>
                                        <Label>Total Amount</Label>
                                        <p className="text-3xl font-bold">₦{totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <Label>Due Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dueDate}
                                                onSelect={setDueDate}
                                                initialFocus
                                                disabled={(date) => date < new Date()}
                                            />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <Button 
                                        className="w-full"
                                        onClick={handleCreateInvoice}
                                        disabled={Object.keys(selectedItems).length === 0}
                                    >
                                        <FilePlus2 className="mr-2 h-4 w-4" />
                                        Create Invoice
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
            <SelectPatientDialog 
                isOpen={isPatientDialogOpen}
                onClose={() => setPatientDialogOpen(false)}
                onPatientSelected={handleSelectPatient}
            />
        </>
    );
}
