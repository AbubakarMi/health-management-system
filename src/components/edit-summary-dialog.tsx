
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Patient } from "@/lib/constants";

const formSchema = z.object({
  summary: z.string().min(1, "Summary cannot be empty."),
});

type FormData = z.infer<typeof formSchema>;

interface EditSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSave: (newSummary: string) => void;
}

export function EditSummaryDialog({ isOpen, onClose, patient, onSave }: EditSummaryDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summary: "",
    },
  });
  
  useEffect(() => {
    if(isOpen) {
        form.setValue("summary", patient.clinicalSummary || "");
    }
  }, [isOpen, patient.clinicalSummary, form]);

  function onSubmit(values: FormData) {
    onSave(values.summary);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Clinical Summary</DialogTitle>
          <DialogDescription>
            Update the high-level clinical summary for {patient.name}. This information is critical for any doctor reviewing this patient's file.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Summary</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Patient has a history of Type 2 Diabetes..." {...field} rows={8}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save Summary</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
