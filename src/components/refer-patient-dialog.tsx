
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { generateReferralLetter } from "@/ai/flows/generate-referral-letter";
import { Loader2, Sparkles, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";
import { Patient } from "@/lib/constants";
import { Input } from "./ui/input";

const formSchema = z.object({
  receivingEntity: z.string().min(3, "Please specify the receiving hospital or doctor."),
  doctorNotes: z.string().min(10, "Please provide brief clinical notes for the referral."),
  formalLetter: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ReferPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onConfirm: (formalLetter: string, receivingEntity: string) => void;
}

export function ReferPatientDialog({ isOpen, onClose, patient, onConfirm }: ReferPatientDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receivingEntity: "",
      doctorNotes: "",
      formalLetter: "",
    },
  });
  
  useEffect(() => {
    if(isOpen) {
        form.reset();
    }
  }, [isOpen, form]);

  const handleGenerateLetter = async () => {
    const { doctorNotes, receivingEntity } = form.getValues();
    if (!doctorNotes || !receivingEntity) {
        if(!doctorNotes) form.setError("doctorNotes", { message: "Please enter brief notes first." });
        if(!receivingEntity) form.setError("receivingEntity", { message: "Please enter a recipient." });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateReferralLetter({ 
            doctorNotes, 
            receivingEntity,
            patientName: patient.name,
            referringDoctor: patient.assignedDoctor,
        });
        form.setValue("formalLetter", result.formalLetter);
    } catch (error) {
        console.error("Failed to generate referral letter:", error);
        toast({ variant: "destructive", title: "AI Error", description: "Could not generate the letter." });
    } finally {
        setIsGenerating(false);
    }
  }

  function onSubmit(values: FormData) {
    if (!values.formalLetter) {
        toast({ variant: "destructive", title: "Missing Letter", description: "Please generate the formal letter before confirming."});
        return;
    }
    onConfirm(values.formalLetter, values.receivingEntity);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Refer Patient to Specialist Care</DialogTitle>
          <DialogDescription>
            Generate a formal referral letter for {patient.name}. This will be added to their medical history.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="receivingEntity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To (Hospital, Clinic, or Doctor)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., National Hospital Abuja" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctorNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Referral (Brief Notes)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Patient requires specialist cardiac evaluation..." {...field} rows={3}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="button" variant="outline" onClick={handleGenerateLetter} disabled={isGenerating} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                {isGenerating ? "Generating..." : "AI Generate Full Letter"}
            </Button>
            
            <Separator />
            
             <FormField
              control={form.control}
              name="formalLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formal Referral Letter</FormLabel>
                  <FormControl>
                    <Textarea readOnly placeholder="The AI-generated formal letter will appear here..." {...field} rows={8} className="bg-muted/50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit">
                    <Send className="mr-2 h-4 w-4"/>
                    Confirm and Save Referral
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
