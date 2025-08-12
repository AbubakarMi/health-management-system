
"use client";

import { useState } from "react";
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
import { ArrowLeft, CalendarIcon, UserPlus, ArrowRight, ClipboardCheck, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { patientManager } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { generateMedicalNote } from "@/ai/flows/generate-medical-note";
import { useEffect } from "react";

const patientSchema = z.object({
  // Step 1
  name: z.string().min(3, "Full name is required."),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  gender: z.enum(["Male", "Female"]),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
  address: z.string().min(5, "Address is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  emergencyContactName: z.string().min(3, "Emergency contact name is required."),
  emergencyContactRelationship: z.string().min(2, "Relationship is required."),
  emergencyContactPhone: z.string().min(10, "A valid phone number is required."),
  // Step 2
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  allergies: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  // Step 3
  appointmentType: z.enum(["New Visit", "Emergency"]),
  department: z.enum(["General Medicine", "Cardiology", "Neurology", "Oncology", "Pediatrics"]),
});

type PatientFormData = z.infer<typeof patientSchema>;
const step1Fields: (keyof PatientFormData)[] = ["name", "dateOfBirth", "gender", "maritalStatus", "address", "phone", "emergencyContactName", "emergencyContactRelationship", "emergencyContactPhone"];
const step2Fields: (keyof PatientFormData)[] = ["bloodType", "allergies", "pastMedicalHistory", "familyMedicalHistory"];

export default function CreatePatientPage() {
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState<keyof PatientFormData | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const form = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            gender: "Male",
            maritalStatus: "Single",
            bloodType: "O+",
            appointmentType: "New Visit",
            department: "General Medicine",
            allergies: "",
            pastMedicalHistory: "",
            familyMedicalHistory: "",
        }
    });

    useEffect(() => {
        const name = searchParams.get('name');
        const dob = searchParams.get('dateOfBirth');
        const summary = searchParams.get('clinicalSummary');
        if (name) form.setValue('name', name);
        if (dob) form.setValue('dateOfBirth', new Date(dob));
        if (summary) form.setValue('pastMedicalHistory', summary);
    }, [searchParams, form]);
    
    const handleGenerateNote = async (fieldName: keyof PatientFormData) => {
        const briefNote = form.getValues(fieldName) as string;
        if (!briefNote) {
            form.setError(fieldName, { message: "Please enter a brief note first." });
            return;
        }
        setIsGenerating(fieldName);
        try {
            const result = await generateMedicalNote({ briefNote });
            form.setValue(fieldName, result.detailedNote, { shouldValidate: true });
        } catch (error) {
            console.error(`Failed to generate note for ${fieldName}:`, error);
            toast({ variant: "destructive", title: "AI Error", description: "Could not generate the note." });
        } finally {
            setIsGenerating(null);
        }
    }

    const onSubmit = (values: PatientFormData) => {
        const newPatientId = `P${Date.now()}`;
        const clinicalSummary = `
Initial Appointment: ${values.appointmentType} to ${values.department}.
Known Allergies: ${values.allergies || 'None specified'}.
Past Medical History: ${values.pastMedicalHistory || 'None specified'}.
Family Medical History: ${values.familyMedicalHistory || 'None specified'}.
        `.trim();
        
        patientManager.getPatients().push({
            id: newPatientId,
            name: values.name,
            gender: values.gender,
            dateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd"),
            address: values.address,
            maritalStatus: values.maritalStatus,
            condition: 'Stable', 
            lastVisit: format(new Date(), "yyyy-MM-dd"),
            bloodType: values.bloodType,
            assignedDoctor: 'Dr. Aisha Bello', 
            clinicalSummary,
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

    const handleNext = async () => {
        let isValid = false;
        if (step === 1) {
            isValid = await form.trigger(step1Fields);
        } else if (step === 2) {
            isValid = await form.trigger(step2Fields);
        }
        
        if (isValid) {
            setStep(s => s + 1);
        }
    }
    
    const handleBack = () => {
        setStep(s => s - 1);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/patients"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-2xl font-bold">Create New Patient Record</h1>
            </div>
            <Card>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                         {step === 1 && (
                            <>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <UserPlus className="w-6 h-6" />
                                        <div>
                                            <CardTitle>Core Patient Demographics (Mandatory)</CardTitle>
                                            <CardDescription>Step 1 of 3: Enter the required information to register a new patient.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Personal Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="dateOfBirth" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1920} toYear={new Date().getFullYear()} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="maritalStatus" render={({ field }) => (<FormItem><FormLabel>Marital Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select marital status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Single">Single</SelectItem><SelectItem value="Married">Married</SelectItem><SelectItem value="Divorced">Divorced</SelectItem><SelectItem value="Widowed">Widowed</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Contact Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="address" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Home Address</FormLabel><FormControl><Input placeholder="e.g., 123 Main Street, Abuja" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="e.g., 08012345678" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Emergency Contact</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField control={form.control} name="emergencyContactName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="emergencyContactRelationship" render={({ field }) => (<FormItem><FormLabel>Relationship</FormLabel><FormControl><Input placeholder="e.g., Spouse" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="emergencyContactPhone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="e.g., 08087654321" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="button" onClick={handleNext}>Next <ArrowRight className="ml-2 h-4 w-4"/></Button>
                                    </div>
                                </CardContent>
                            </>
                         )}
                         {step === 2 && (
                             <>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <UserPlus className="w-6 h-6" />
                                        <div>
                                            <CardTitle>Medical Information (For Treatment & Safety)</CardTitle>
                                            <CardDescription>Step 2 of 3: Provide key medical details for the patient.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                     <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="bloodType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Blood Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select blood type" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
                                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="allergies"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Known Allergies</FormLabel>
                                                    <FormControl><Textarea placeholder="e.g., Penicillin, Peanuts" {...field} /></FormControl>
                                                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => handleGenerateNote('allergies')} disabled={isGenerating === 'allergies'}>
                                                        {isGenerating === 'allergies' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                                                        AI Generate
                                                    </Button>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="pastMedicalHistory"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Past Medical History</FormLabel>
                                                    <FormControl><Textarea placeholder="e.g., Appendectomy (2015), history of asthma" {...field} /></FormControl>
                                                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => handleGenerateNote('pastMedicalHistory')} disabled={isGenerating === 'pastMedicalHistory'}>
                                                        {isGenerating === 'pastMedicalHistory' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                                                        AI Generate
                                                    </Button>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="familyMedicalHistory"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Family Medical History (If relevant)</FormLabel>
                                                    <FormControl><Textarea placeholder="e.g., Father has history of heart disease" {...field} /></FormControl>
                                                     <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => handleGenerateNote('familyMedicalHistory')} disabled={isGenerating === 'familyMedicalHistory'}>
                                                        {isGenerating === 'familyMedicalHistory' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                                                        AI Generate
                                                    </Button>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex justify-between">
                                        <Button type="button" variant="outline" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
                                        <Button type="button" onClick={handleNext}>Next <ArrowRight className="ml-2 h-4 w-4"/></Button>
                                    </div>
                                </CardContent>
                             </>
                         )}
                         {step === 3 && (
                              <>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <ClipboardCheck className="w-6 h-6" />
                                        <div>
                                            <CardTitle>Administrative Information</CardTitle>
                                            <CardDescription>Step 3 of 3: Final details for patient routing.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                     <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="appointmentType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Appointment Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select appointment type" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="New Visit">New Visit</SelectItem>
                                                                <SelectItem value="Emergency">Emergency</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                             <FormField
                                                control={form.control}
                                                name="department"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Department/Specialty</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="General Medicine">General Medicine</SelectItem>
                                                                <SelectItem value="Cardiology">Cardiology</SelectItem>
                                                                <SelectItem value="Neurology">Neurology</SelectItem>
                                                                <SelectItem value="Oncology">Oncology</SelectItem>
                                                                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <Button type="button" variant="outline" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
                                        <Button type="submit">Save and Register Patient</Button>
                                    </div>
                                </CardContent>
                             </>
                         )}
                    </form>
                </Form>
            </Card>
        </div>
    );
}
