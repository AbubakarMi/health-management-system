
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Prescription } from "@/lib/constants";
import { ArrowRight, Check, X } from "lucide-react";
import { Separator } from "./ui/separator";

const rejectionSchema = z.object({
  rejectionReason: z.string().min(10, "A reason for rejection is required."),
});
type RejectionFormData = z.infer<typeof rejectionSchema>;

interface ReviewSuggestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription;
  onAccept: (prescriptionId: string) => void;
  onReject: (prescriptionId: string, reason: string) => void;
}

export function ReviewSuggestionDialog({ isOpen, onClose, prescription, onAccept, onReject }: ReviewSuggestionDialogProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  
  const form = useForm<RejectionFormData>({
    resolver: zodResolver(rejectionSchema),
    defaultValues: { rejectionReason: "" },
  });

  if (!prescription.suggestion) return null;
  
  const handleRejectSubmit = (values: RejectionFormData) => {
    onReject(prescription.id, values.rejectionReason);
  };
  
  const handleDialogClose = () => {
    setIsRejecting(false);
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Review Prescription Suggestion</DialogTitle>
          <DialogDescription>
            The pharmacist has suggested an alternative for this prescription.
          </DialogDescription>
        </DialogHeader>

        {!isRejecting ? (
             <div className="space-y-6 my-4">
                <div className="grid grid-cols-2 gap-4 items-center">
                    {/* Original */}
                    <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">ORIGINAL PRESCRIPTION</h4>
                        <div className="mt-2 p-4 border rounded-md bg-muted/50">
                            <p className="font-bold text-lg">{prescription.medicine}</p>
                            <p className="text-muted-foreground">{prescription.dosage}</p>
                        </div>
                    </div>
                    {/* Suggestion */}
                     <div>
                        <h4 className="font-semibold text-sm text-primary">PHARMACIST'S SUGGESTION</h4>
                        <div className="mt-2 p-4 border rounded-md border-primary bg-primary/10">
                            <p className="font-bold text-lg text-primary">{prescription.suggestion.medicine}</p>
                            <p className="text-muted-foreground">{prescription.suggestion.dosage}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">REASON FOR SUGGESTION</h4>
                    <p className="mt-1 text-sm text-foreground p-3 border bg-muted/30 rounded-md">
                        {prescription.suggestion.reason}
                    </p>
                </div>
                
                 <DialogFooter className="mt-6">
                    <Button type="button" variant="destructive" onClick={() => setIsRejecting(true)}>
                        <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button type="button" onClick={() => onAccept(prescription.id)}>
                        <Check className="mr-2 h-4 w-4" /> Accept & Update
                    </Button>
                </DialogFooter>
            </div>
        ) : (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRejectSubmit)} className="space-y-4 pt-4">
                     <FormField
                        control={form.control}
                        name="rejectionReason"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Reason for Rejection</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Provide a clear reason for rejecting the suggestion..." 
                                    {...field} 
                                    rows={4}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsRejecting(false)}>Back</Button>
                        <Button type="submit" variant="destructive">Confirm Rejection</Button>
                    </DialogFooter>
                </form>
            </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
