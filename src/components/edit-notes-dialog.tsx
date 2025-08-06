
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { generateMedicalNote } from "@/ai/flows/generate-medical-note";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  notes: z.string().min(1, "Notes cannot be empty."),
});

type FormData = z.infer<typeof formSchema>;

interface EditNotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  visitDetails: string;
  onSave: (newDetails: string) => void;
}

export function EditNotesDialog({ isOpen, onClose, visitDetails, onSave }: EditNotesDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });
  
  useEffect(() => {
    if(isOpen) {
        form.setValue("notes", visitDetails);
    }
  }, [isOpen, visitDetails, form]);

  const handleGenerateNote = async () => {
    const briefNote = form.getValues("notes");
    if (!briefNote) {
        form.setError("notes", { message: "Please enter a brief note first." });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateMedicalNote({ briefNote });
        form.setValue("notes", result.detailedNote);
    } catch (error) {
        console.error("Failed to generate medical note:", error);
        toast({ variant: "destructive", title: "AI Error", description: "Could not generate the note." });
    } finally {
        setIsGenerating(false);
    }
  }

  function onSubmit(values: FormData) {
    onSave(values.notes);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add/Edit Doctor's Notes</DialogTitle>
          <DialogDescription>
            Update the clinical notes for this visit. You can use the AI assistant to expand on brief notes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Patient c/o headache, fever. Vitals stable. Plan: CBC, prescribe Paracetamol." {...field} rows={8}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center">
                <Button type="button" variant="outline" onClick={handleGenerateNote} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isGenerating ? "Generating..." : "AI Generate Full Note"}
                </Button>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Notes</Button>
                </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
