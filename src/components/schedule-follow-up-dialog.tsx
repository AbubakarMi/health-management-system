
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, addWeeks, addMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  date: z.date({ required_error: "A follow-up date is required." }),
  reason: z.string().min(10, "Please provide a reason for the follow-up."),
});

type FormData = z.infer<typeof formSchema>;

interface ScheduleFollowUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  onSchedule: (data: FormData) => void;
  suggestion?: { timing: string; reason: string };
}

export function ScheduleFollowUpDialog({ isOpen, onClose, patientName, onSchedule, suggestion }: ScheduleFollowUpDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });
  
  useEffect(() => {
    if (isOpen) {
        if (suggestion) {
            let suggestedDate = new Date();
            const timing = suggestion.timing.toLowerCase();
            if (timing.includes("week")) {
                const weeks = parseInt(timing) || 1;
                suggestedDate = addWeeks(new Date(), weeks);
            } else if (timing.includes("month")) {
                const months = parseInt(timing) || 1;
                suggestedDate = addMonths(new Date(), months);
            }
            form.reset({
                date: suggestedDate,
                reason: suggestion.reason
            });
        } else {
             form.reset({
                date: undefined,
                reason: ""
             });
        }
    }
  }, [isOpen, suggestion, form]);


  function onSubmit(values: FormData) {
    onSchedule(values);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Follow-up</DialogTitle>
          <DialogDescription>
            Set a future follow-up date for {patientName}. This will be added to the admin's follow-up list.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Follow-up Date</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Follow-up</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., To review lab results and adjust medication." {...field} rows={3}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Schedule Follow-up</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
