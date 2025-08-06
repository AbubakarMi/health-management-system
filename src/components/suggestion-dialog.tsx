
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Prescription, Suggestion } from "@/lib/constants";

const formSchema = z.object({
  medicine: z.string().min(2, "Medicine name is required."),
  dosage: z.string().min(1, "Dosage is required."),
  reason: z.string().min(10, "A reason must be provided."),
});

type FormData = z.infer<typeof formSchema>;
type SuggestionSaveData = Omit<Suggestion, 'status'>;

interface SuggestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription;
  onSuggestionSubmit: (data: SuggestionSaveData) => void;
}

export function SuggestionDialog({ isOpen, onClose, prescription, onSuggestionSubmit }: SuggestionDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicine: "",
      dosage: "",
      reason: "",
    },
  });

  function onSubmit(values: FormData) {
    onSuggestionSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suggest Alternative Prescription</DialogTitle>
          <DialogDescription>
            Propose a different medicine for {prescription.patientName}. The prescribing doctor will be notified to review your suggestion.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="medicine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggested Medicine</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Atorvastatin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggested Dosage</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 20mg once daily" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Suggestion</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., The suggested medicine has fewer side effects for this patient's profile." {...field} rows={4}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Submit Suggestion</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
