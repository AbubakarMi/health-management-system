
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { medicationManager, Medication } from "@/lib/constants";
import { AddMedicineDialog } from "@/components/add-medicine-dialog";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const handleUpdate = (updatedMedications: Medication[]) => {
            setMedications([...updatedMedications]);
        };

        handleUpdate(medicationManager.getMedications());
        const unsubscribe = medicationManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, []);

    const handleMedicineAdded = (newMedicine: Omit<Medication, 'id'>) => {
        medicationManager.addMedication(newMedicine);
        toast({
            title: "Medicine Added",
            description: `${newMedicine.name} has been successfully added to the inventory.`
        });
        setAddDialogOpen(false);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Pharmacy Inventory</CardTitle>
                            <CardDescription>View and manage medication stock levels.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => setAddDialogOpen(true)}>
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
                                <TableHead>Available Stock</TableHead>
                                <TableHead>Low Stock Threshold</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medications.map((med) => (
                                <TableRow key={med.id}>
                                    <TableCell className="font-medium">{med.name}</TableCell>
                                    <TableCell>{med.available}</TableCell>
                                    <TableCell>{med.lowStock}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <AddMedicineDialog
                isOpen={isAddDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onMedicineAdded={handleMedicineAdded}
            />
        </>
    )
}
