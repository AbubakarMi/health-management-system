
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, subDays } from "date-fns"
import { DateRange } from "react-day-picker"

import { initialInvoices, detailedPatients, medicationManager, labTestManager, Patient } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { CalendarIcon, Download, Loader2 } from "lucide-react"

const formSchema = z.object({
  reportType: z.enum(['financial', 'patients', 'inventory', 'lab_tests', 'deceased_records']),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

type FormData = z.infer<typeof formSchema>;

type ReportData = {
    headers: string[];
    rows: (string | number)[][];
};

const getDateOfDeath = (patient: Patient) => {
    const deceasedEvent = patient.medicalHistory.find(e => e.event.toLowerCase().includes('deceased'));
    return deceasedEvent ? deceasedEvent.date : 'N/A';
}

export function ReportGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const { toast } = useToast();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reportType: 'financial',
            dateRange: {
                from: subDays(new Date(), 30),
                to: new Date(),
            },
        },
    });

    const onSubmit = (values: FormData) => {
        setIsLoading(true);
        setReportData(null);
        
        // Simulate report generation
        setTimeout(() => {
            let data: ReportData = { headers: [], rows: [] };
            const { from, to } = values.dateRange;

            switch (values.reportType) {
                case 'financial':
                    data.headers = ['Invoice ID', 'Patient', 'Amount', 'Due Date', 'Status'];
                    data.rows = initialInvoices
                        .filter(inv => new Date(inv.dueDate) >= from && new Date(inv.dueDate) <= to)
                        .map(inv => [inv.id, inv.patientName, inv.amount.toFixed(2), inv.dueDate, inv.status]);
                    break;
                case 'patients':
                    data.headers = ['Patient ID', 'Name', 'Condition', 'Last Visit'];
                     data.rows = detailedPatients
                        .filter(p => new Date(p.lastVisit) >= from && new Date(p.lastVisit) <= to)
                        .map(p => [p.id, p.name, p.condition, p.lastVisit]);
                    break;
                case 'inventory':
                    data.headers = ['ID', 'Medicine', 'Available Stock', 'Low Stock Threshold'];
                    data.rows = medicationManager.getMedications().map(med => [med.id, med.name, med.available, med.lowStock]);
                    break;
                case 'lab_tests':
                    data.headers = ['Patient', 'Test', 'Collected Date', 'Status'];
                    data.rows = labTestManager.getLabTests()
                        .filter(t => new Date(t.collected) >= from && new Date(t.collected) <= to)
                        .map(t => [t.patient, t.test, t.collected, t.status]);
                    break;
                case 'deceased_records':
                     data.headers = ['Patient ID', 'Name', 'Gender', 'Date of Death', 'Assigned Doctor'];
                     data.rows = detailedPatients
                        .filter(p => p.condition === 'Deceased' && new Date(getDateOfDeath(p)) >= from && new Date(getDateOfDeath(p)) <= to)
                        .map(p => [p.id, p.name, p.gender, getDateOfDeath(p), p.assignedDoctor]);
                    break;
            }

            setReportData(data);
            setIsLoading(false);
            toast({ title: "Report Generated", description: "Your report is ready to be viewed or exported." });
        }, 1000);
    }

    const handleExport = () => {
        if (!reportData) return;
        
        const csvHeader = reportData.headers.join(',') + '\n';
        const csvBody = reportData.rows.map(row => row.join(',')).join('\n');
        const csvContent = csvHeader + csvBody;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${form.getValues('reportType')}_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({ title: "Exporting Report", description: "Your report has been downloaded." });
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 border rounded-lg grid md:grid-cols-3 gap-4 items-end">
                    <FormField
                        control={form.control}
                        name="reportType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Report Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a report type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="financial">Financial</SelectItem>
                                        <SelectItem value="patients">Patient Demographics</SelectItem>
                                        <SelectItem value="inventory">Pharmacy Inventory</SelectItem>
                                        <SelectItem value="lab_tests">Lab Tests</SelectItem>
                                        <SelectItem value="deceased_records">Deceased Records</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dateRange"
                        render={({ field }) => (
                           <FormItem className="flex flex-col">
                                <FormLabel>Date range</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                        "justify-start text-left font-normal",
                                        !field.value.from && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value.from ? (
                                        field.value.to ? (
                                            <>
                                            {format(field.value.from, "LLL dd, y")} -{" "}
                                            {format(field.value.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(field.value.from, "LLL dd, y")
                                        )
                                        ) : (
                                        <span>Pick a date</span>
                                        )}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={field.value.from}
                                        selected={{ from: field.value.from, to: field.value.to }}
                                        onSelect={(range) => field.onChange({from: range?.from, to: range?.to})}
                                        numberOfMonths={2}
                                    />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />
                    
                    <div className="flex gap-2">
                         <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Generate
                        </Button>
                        <Button type="button" onClick={handleExport} disabled={!reportData} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </form>
            </Form>
            
            {reportData && reportData.rows.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Report Results</h3>
                     <div className="overflow-x-auto border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {reportData.headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.rows.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <TableCell key={cellIndex}>{cell}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
             {reportData && reportData.rows.length === 0 && !isLoading && (
                 <div className="text-center text-muted-foreground py-10">
                    <p>No data found for the selected criteria.</p>
                </div>
            )}
        </div>
    )
}
