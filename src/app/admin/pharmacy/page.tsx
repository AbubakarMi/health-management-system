
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import { medicationManager, Medication, prescriptionManager, Prescription } from "@/lib/constants";
import { AddMedicineDialog } from "@/components/add-medicine-dialog";
import { useToast } from "@/hooks/use-toast";
import { MedicationAvailabilityChart } from "@/components/charts/medication-availability-chart";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Page() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [pendingPrescriptions, setPendingPrescriptions] = useState<Prescription[]>([]);
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const handleMedicationUpdate = (updatedMedications: Medication[]) => {
            setMedications([...updatedMedications]);
        };
        handleMedicationUpdate(medicationManager.getMedications());
        const unsubscribeMedication = medicationManager.subscribe(handleMedicationUpdate);
        
        const handlePrescriptionUpdate = (updatedPrescriptions: Prescription[]) => {
            setPendingPrescriptions(updatedPrescriptions.filter(p => p.status === 'Pending').slice(0, 5));
        }
        handlePrescriptionUpdate(prescriptionManager.getPrescriptions());
        const unsubscribePrescription = prescriptionManager.subscribe(handlePrescriptionUpdate);

        return () => {
            unsubscribeMedication();
            unsubscribePrescription();
        };
    }, []);

    const openAddDialog = () => {
        setEditingMedication(null);
        setAddDialogOpen(true);
    };

    const openEditDialog = (medication: Medication) => {
        setEditingMedication(medication);
        setAddDialogOpen(true);
    };

    const handleSaveMedicine = (medicine: Omit<Medication, 'id'>, originalId?: string) => {
        if (editingMedication && originalId) {
            medicationManager.updateMedication({ ...medicine, id: originalId });
            toast({ title: "Medicine Updated", description: `${medicine.name} has been updated.` });
        } else {
            medicationManager.addMedication(medicine);
            toast({ title: "Medicine Added", description: `${medicine.name} has been added.` });
        }
        setAddDialogOpen(false);
        setEditingMedication(null);
    };
    
    const handleDeleteMedicine = (medicationId: string) => {
        medicationManager.deleteMedication(medicationId);
        toast({
            title: "Medicine Deleted",
            description: "The medication has been removed from the inventory.",
            variant: "destructive"
        });
    }

    const getStockStatus = (med: Medication): {text: string, variant: "default" | "secondary" | "destructive"} => {
        if (med.available <= 0) return { text: "Out of Stock", variant: "destructive" };
        if (med.available <= med.lowStock) return { text: "Low Stock", variant: "secondary" };
        return { text: "In Stock", variant: "default" };
    }

    return (
        <>
            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    <MedicationAvailabilityChart />
                    <Card>
                        <CardHeader>
                        <CardTitle>Pending Prescriptions</CardTitle>
                        <CardDescription>Prescriptions that need pharmacist attention.</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Medicine</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {pendingPrescriptions.map((p) => (
                                <TableRow key={p.id}>
                                <TableCell className="font-medium">{p.patientName}</TableCell>
                                <TableCell>{p.medicine}</TableCell>
                                <TableCell>
                                    <Badge variant='secondary'>{p.status}</Badge>
                                </TableCell>
                                </TableRow>
                            ))}
                             {pendingPrescriptions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">No pending prescriptions.</TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Pharmacy Inventory</CardTitle>
                                <CardDescription>View and manage medication stock levels.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={openAddDialog}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Medicine
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Medicine</TableHead>
                                    <TableHead>Price (₦)</TableHead>
                                    <TableHead>Available Stock</TableHead>
                                    <TableHead>Low Stock Threshold</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {medications.map((med) => {
                                    const status = getStockStatus(med);
                                    return (
                                        <TableRow key={med.id}>
                                            <TableCell className="font-medium">{med.name}</TableCell>
                                            <TableCell>₦{med.price.toFixed(2)}</TableCell>
                                            <TableCell>{med.available}</TableCell>
                                            <TableCell>{med.lowStock}</TableCell>
                                            <TableCell>
                                                <Badge variant={status.variant} className={status.variant === 'default' ? 'bg-green-500' : ''}>{status.text}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(med)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                                         <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive hover:bg-destructive/10 w-full text-left">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    <span>Delete</span>
                                                                </button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This will permanently delete {med.name} from the inventory.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDeleteMedicine(med.id)} className="bg-destructive hover:bg-destructive/90">
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <AddMedicineDialog
                isOpen={isAddDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onMedicineSaved={handleSaveMedicine}
                medicineToEdit={editingMedication}
            />
        </>
    )
}
