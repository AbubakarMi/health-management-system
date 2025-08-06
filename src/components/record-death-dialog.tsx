
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { generateDeathReport } from "@/ai/flows/generate-death-report";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  doctorNotes: z.string().min(10, "Please provide brief clinical notes on the cause of death."),
  formalReport: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RecordDeathDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  onConfirm: (formalReport: string) => void;
}

export function RecordDeathDialog({ isOpen, onClose, patientName, onConfirm }: RecordDeathDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorNotes: "",
      formalReport: "",
    },
  });
  
  useEffect(() => {
    if(isOpen) {
        form.reset();
    }
  }, [isOpen, form]);

  const handleGenerateReport = async () => {
    const doctorNotes = form.getValues("doctorNotes");
    if (!doctorNotes) {
        form.setError("doctorNotes", { message: "Please enter brief notes first." });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateDeathReport({ doctorNotes, patientName });
        form.setValue("formalReport", result.formalReport);
    } catch (error) {
        console.error("Failed to generate death report:", error);
        toast({ variant: "destructive", title: "AI Error", description: "Could not generate the report." });
    } finally {
        setIsGenerating(false);
    }
  }

  function onSubmit(values: FormData) {
    if (!values.formalReport) {
        toast({ variant: "destructive", title: "Missing Report", description: "Please generate the formal report before confirming."});
        return;
    }
    onConfirm(values.formalReport);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record Patient Death</DialogTitle>
          <DialogDescription>
            Provide clinical notes to generate a formal death report for {patientName}. This action is irreversible.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="doctorNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor's Notes on Cause of Death</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Patient passed peacefully from complications of pneumonia..." {...field} rows={3}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="button" variant="outline" onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                {isGenerating ? "Generating..." : "AI Generate Full Report"}
            </Button>
            
            <Separator />
            
             <FormField
              control={form.control}
              name="formalReport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formal Report for Certificate</FormLabel>
                  <FormControl>
                    <Textarea readOnly placeholder="The AI-generated formal report will appear here..." {...field} rows={6} className="bg-muted/50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="destructive">Confirm and Save Report</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
