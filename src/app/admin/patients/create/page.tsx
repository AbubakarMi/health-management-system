
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, CalendarIcon, UserPlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { patientManager } from "@/lib/constants";

const patientSchema = z.object({
  name: z.string().min(3, "Full name is required."),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  gender: z.enum(["Male", "Female"]),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
  address: z.string().min(5, "Address is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  emergencyContactName: z.string().min(3, "Emergency contact name is required."),
  emergencyContactRelationship: z.string().min(2, "Relationship is required."),
  emergencyContactPhone: z.string().min(10, "A valid phone number is required."),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function CreatePatientPage() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
    });

    const onSubmit = (values: PatientFormData) => {
        // In a real app, this would save to a database.
        // For now, we'll just log it and show a success message.
        console.log("New Patient Data:", values);
        
        // For demonstration purposes, we can add it to our in-memory manager
        // In a real app, you'd likely get an ID back from the server.
        const newPatientId = `P${Date.now()}`;
        patientManager.getPatients().push({
            id: newPatientId,
            name: values.name,
            gender: values.gender,
            dateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd"),
            address: values.address,
            maritalStatus: values.maritalStatus,
            condition: 'Stable',
            lastVisit: format(new Date(), "yyyy-MM-dd"),
            bloodType: 'O+', // Default or to be added later
            assignedDoctor: 'Dr. Aisha Bello', // Default or assignable
            medicalHistory: [],
            prescriptions: [],
            labTests: [],
            admission: { isAdmitted: false, admissionDate: null, dischargeDate: null, roomNumber: null, bedNumber: null }
        });


        toast({
            title: "Patient Registered",
            description: `${values.name} has been successfully registered.`,
        });
        router.push(`/admin/patients/${newPatientId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/patients"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-2xl font-bold">Create New Patient Record</h1>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <UserPlus className="w-6 h-6" />
                        <div>
                            <CardTitle>Core Patient Demographics (Mandatory)</CardTitle>
                            <CardDescription>Enter the required information to register a new patient.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Personal Details */}
                            <div className="space-y-4">
                                 <h3 className="text-lg font-medium">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
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
                                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1920} toYear={new Date().getFullYear()} disabled={(date) => date > new Date()} initialFocus /></PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="maritalStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Marital Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select marital status" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Single">Single</SelectItem>
                                                        <SelectItem value="Married">Married</SelectItem>
                                                        <SelectItem value="Divorced">Divorced</SelectItem>
                                                        <SelectItem value="Widowed">Widowed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                             {/* Contact Details */}
                             <div className="space-y-4">
                                 <h3 className="text-lg font-medium">Contact Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Home Address</FormLabel>
                                                <FormControl><Input placeholder="e.g., 123 Main Street, Abuja" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl><Input placeholder="e.g., 08012345678" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            
                            {/* Emergency Contact */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Emergency Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="emergencyContactName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="emergencyContactRelationship"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Relationship</FormLabel>
                                                <FormControl><Input placeholder="e.g., Spouse" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="emergencyContactPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl><Input placeholder="e.g., 08087654321" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <Button type="submit">Save and Continue</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
