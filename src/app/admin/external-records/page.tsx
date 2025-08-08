
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Database, Loader2, Search, UserPlus, AlertCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchExternalRecord, FetchExternalRecordOutput } from "@/ai/flows/fetch-external-record";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  patientName: z.string().min(2, "Patient name is required."),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
});

type FormData = z.infer<typeof formSchema>;

export default function ExternalRecordsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchResult, setSearchResult] = useState<FetchExternalRecordOutput & { searchData?: FormData } | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            patientName: "",
        },
    });

    async function onSubmit(values: FormData) {
        setIsLoading(true);
        setSearchResult(null);
        try {
            const result = await fetchExternalRecord({
                ...values,
                dateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd")
            });
            setSearchResult({ ...result, searchData: values });
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Search Failed",
                description: "An unexpected error occurred while searching for the record."
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleImport = () => {
        if (!searchResult || !searchResult.searchData) return;

        const importData = {
            name: searchResult.searchData.patientName,
            dateOfBirth: searchResult.searchData.dateOfBirth.toISOString(),
            clinicalSummary: searchResult.clinicalSummary || '',
        };

        const queryParams = new URLSearchParams(importData).toString();
        router.push(`/admin/patients/create?${queryParams}`);
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Database className="w-6 h-6 text-primary" />
                    <div>
                        <CardTitle>External Record Finder</CardTitle>
                        <CardDescription>
                            Search for a patient's record from the simulated National Health Information Exchange.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="patientName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Patient Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Binta Ibrahim" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Date of Birth</FormLabel>
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
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                captionLayout="dropdown-buttons"
                                                fromYear={1920}
                                                toYear={new Date().getFullYear()}
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Searching...</>
                            ) : (
                                <><Search className="mr-2 h-4 w-4" />Search for Record</>
                            )}
                        </Button>
                    </form>
                </Form>

                {searchResult && (
                    <div className="mt-6">
                        <Separator />
                        <div className="mt-6">
                             {searchResult.recordFound ? (
                                 <Card>
                                    <CardHeader>
                                        <CardTitle>Patient Record Found</CardTitle>
                                        <CardDescription>
                                            A matching record was found in the external database. Review the details below.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                         <div>
                                            <h4 className="font-semibold text-sm">Clinical Summary</h4>
                                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{searchResult.clinicalSummary}</p>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-sm">Known Allergies</h4>
                                            <p className="text-sm text-muted-foreground mt-1">{searchResult.allergies}</p>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-sm">Current Medications</h4>
                                            <p className="text-sm text-muted-foreground mt-1">{searchResult.medications}</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={handleImport}>
                                            <UserPlus className="mr-2 h-4 w-4"/> Import and Create New Patient
                                        </Button>
                                    </CardFooter>
                                </Card>
                             ) : (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>No Record Found</AlertTitle>
                                    <AlertDescription>
                                        No patient matching the provided details was found in the external database.
                                    </AlertDescription>
                                </Alert>
                             )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
