
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Medication } from "@/lib/constants";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  available: z.coerce.number().min(0, "Stock cannot be negative."),
  lowStock: z.coerce.number().min(0, "Threshold cannot be negative."),
});

type FormData = z.infer<typeof formSchema>;
type MedicineSaveData = Omit<Medication, 'id'>;

interface AddMedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMedicineSaved: (medicine: MedicineSaveData, originalId?: string) => void;
  medicineToEdit: Medication | null;
}

export function AddMedicineDialog({ isOpen, onClose, onMedicineSaved, medicineToEdit }: AddMedicineDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      available: 0,
      lowStock: 20,
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (medicineToEdit) {
            form.reset({
                name: medicineToEdit.name,
                price: medicineToEdit.price,
                available: medicineToEdit.available,
                lowStock: medicineToEdit.lowStock,
            });
        } else {
            form.reset({
                name: "",
                price: 0,
                available: 0,
                lowStock: 20,
            });
        }
    }
  }, [isOpen, medicineToEdit, form]);

  const isEditing = !!medicineToEdit;

  function onSubmit(values: FormData) {
    onMedicineSaved(values, medicineToEdit?.id);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add New'} Medicine</DialogTitle>
           <DialogDescription>
            {isEditing ? `Update the details for ${medicineToEdit.name}.` : 'Fill in the details to add a new medication to the inventory.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicine Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Aspirin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₦)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="lowStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add Medicine'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
