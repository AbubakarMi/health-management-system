
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, CalendarIcon, UserPlus, ArrowRight, ClipboardCheck, Sparkles, Loader2, Fingerprint, ScanFace, CheckCircle, Camera, X, Printer, CreditCard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { patientManager } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { generateMedicalNote } from "@/ai/flows/generate-medical-note";
import { useEffect, useRef } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { generatePatientCard } from "@/lib/patient-card-generator";

const patientSchema = z.object({
  // Step 1
  name: z.string().min(3, "Full name is required."),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  gender: z.enum(["Male", "Female"]),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
  address: z.string().min(5, "Address is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  preferredCommunicationMethod: z.enum(["SMS", "Email", "WhatsApp"]),
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
  // Step 4 - Biometrics (at least one required)
  biometricId: z.string().optional(),
  faceId: z.string().optional(),
}).refine(data => data.biometricId || data.faceId, {
  message: "At least one biometric (fingerprint or face) is required",
  path: ["biometricId"]
});

type PatientFormData = z.infer<typeof patientSchema>;
const step1Fields: (keyof PatientFormData)[] = ["name", "dateOfBirth", "gender", "maritalStatus", "address", "phone", "preferredCommunicationMethod", "emergencyContactName", "emergencyContactRelationship", "emergencyContactPhone"];
const step2Fields: (keyof PatientFormData)[] = ["bloodType", "allergies", "pastMedicalHistory", "familyMedicalHistory"];
const step3Fields: (keyof PatientFormData)[] = ["appointmentType", "department"];

export default function CreatePatientPage() {
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState<keyof PatientFormData | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [biometricCaptured, setBiometricCaptured] = useState<{fingerprint: boolean, face: boolean}>({fingerprint: false, face: false});
    const [isCapturing, setIsCapturing] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdPatient, setCreatedPatient] = useState<any>(null);
    const [isGeneratingCard, setIsGeneratingCard] = useState(false);
    const [patientPhoto, setPatientPhoto] = useState<string | null>(null);
    const [isPhotoCamera, setIsPhotoCamera] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
            preferredCommunicationMethod: "SMS",
            biometricId: "",
            faceId: "",
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

    useEffect(() => {
        const initCamera = async () => {
            if (isCameraOpen && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setHasCameraPermission(true);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (error) {
                    console.error('Error accessing camera:', error);
                    setHasCameraPermission(false);
                    setIsCameraOpen(false);
                    toast({
                        variant: 'destructive',
                        title: 'Camera Access Denied',
                        description: 'Please enable camera permissions to capture face biometric.',
                    });
                }
            }
        };

        const stopCamera = () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        };

        if (isCameraOpen) {
            initCamera();
        } else {
            stopCamera();
        }

        return () => stopCamera();
    }, [isCameraOpen, toast]);
    
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

    const onSubmit = async (values: PatientFormData) => {
        if (isSubmitting) return; // Prevent duplicate submissions
        
        setIsSubmitting(true);
        
        try {
            // Check for duplicate patients by name and date of birth
            const existingPatients = patientManager.getPatients();
            const duplicateFound = existingPatients.some(patient => 
                patient.name.toLowerCase() === values.name.toLowerCase() &&
                patient.dateOfBirth === format(values.dateOfBirth, "yyyy-MM-dd")
            );
            
            if (duplicateFound) {
                toast({
                    variant: "destructive",
                    title: "Duplicate Patient Detected",
                    description: `A patient with the name "${values.name}" and same date of birth already exists.`,
                });
                return;
            }
            
            const newPatientId = `P${Date.now()}`;
            const clinicalSummary = `
Initial Appointment: ${values.appointmentType} to ${values.department}.
Known Allergies: ${values.allergies || 'None specified'}.
Past Medical History: ${values.pastMedicalHistory || 'None specified'}.
Family Medical History: ${values.familyMedicalHistory || 'None specified'}.
            `.trim();
            
            const newPatient = {
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
                admission: { isAdmitted: false, admissionDate: null, dischargeDate: null, roomNumber: null, bedNumber: null },
                preferredCommunicationMethod: values.preferredCommunicationMethod,
                fingerprintId: values.biometricId,
                faceId: values.faceId,
                avatarUrl: patientPhoto || undefined,
                email: "",
                phone: values.phone,
                emergencyContactName: values.emergencyContactName,
                emergencyContactRelationship: values.emergencyContactRelationship,
                emergencyContactPhone: values.emergencyContactPhone
            };
            
            patientManager.getPatients().push(newPatient);
            
            // Store created patient for success modal
            setCreatedPatient(newPatient);
            setShowSuccessModal(true);
            
        } catch (error) {
            console.error('Error creating patient:', error);
            toast({
                variant: "destructive",
                title: "Creation Failed",
                description: "An error occurred while creating the patient record. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = async () => {
        let isValid = false;
        if (step === 1) {
            isValid = await form.trigger(step1Fields);
        } else if (step === 2) {
            isValid = await form.trigger(step2Fields);
        } else if (step === 3) {
            isValid = await form.trigger(step3Fields);
        }
        
        if (isValid) {
            setStep(s => s + 1);
        }
    }
    
    const handleBack = () => {
        setStep(s => s - 1);
    }
    
    const handleCaptureBiometric = (type: "fingerprint" | "face") => {
        if (type === "face") {
            setIsPhotoCamera(false);
            setIsCameraOpen(true);
        } else {
            // Fingerprint capture simulation
            setIsCapturing(true);
            setTimeout(() => {
                const newId = `FP_${Date.now()}`;
                form.setValue('biometricId', newId);
                setBiometricCaptured(prev => ({ ...prev, fingerprint: true }));
                setIsCapturing(false);
                toast({
                    title: "Fingerprint Captured",
                    description: "The patient's fingerprint has been successfully registered."
                });
            }, 1500);
        }
    };

    const handleCapturePatientPhoto = () => {
        setIsPhotoCamera(true);
        setIsCameraOpen(true);
    };

    const handleRemovePatientPhoto = () => {
        setPatientPhoto(null);
        setBiometricCaptured(prev => ({ ...prev, face: false }));
        form.setValue('faceId', '');
        toast({
            title: "Photo Removed",
            description: "Patient photo and face biometric data have been cleared."
        });
    };

    const handleCameraCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        
        if (isPhotoCamera) {
            // Capture photo for BOTH ID card and biometric
            setPatientPhoto(dataUrl);
            const newFaceId = `FACE_${Date.now()}`;
            form.setValue('faceId', newFaceId);
            setBiometricCaptured(prev => ({ ...prev, face: true }));
            setIsCameraOpen(false);
            setIsPhotoCamera(false);
            
            toast({
                title: "Photo Captured Successfully",
                description: "Photo will be used for both biometric recognition and ID card display."
            });
        } else {
            // This branch is no longer used since we only use photo camera now
            // Generate face ID for biometric
            const newFaceId = `FACE_${Date.now()}`;
            form.setValue('faceId', newFaceId);
            setBiometricCaptured(prev => ({ ...prev, face: true }));
            setIsCameraOpen(false);
            
            toast({
                title: "Face Biometric Captured",
                description: "The patient's facial biometric has been successfully registered."
            });
        }
    };

    const handlePrintCard = async () => {
        if (createdPatient && !isGeneratingCard) {
            setIsGeneratingCard(true);
            try {
                toast({
                    title: "Generating ID Card",
                    description: createdPatient.avatarUrl ? 
                        "Processing patient photo with AI enhancement and generating ID card..." :
                        "Generating professional ID card...",
                });
                
                await generatePatientCard(createdPatient);
                
                toast({
                    title: "ID Card Generated Successfully",
                    description: createdPatient.avatarUrl ?
                        `Professional ID card for ${createdPatient.name} has been downloaded with AI-enhanced photo.` :
                        `Professional ID card for ${createdPatient.name} has been downloaded.`,
                });
            } catch (error) {
                console.error('Error generating patient card:', error);
                toast({
                    variant: "destructive",
                    title: "Card Generation Failed",
                    description: "Failed to generate ID card. Please try again.",
                });
            } finally {
                setIsGeneratingCard(false);
            }
        }
    };

    const handleContinueToProfile = () => {
        if (createdPatient) {
            setShowSuccessModal(false);
            router.push(`/admin/patients/${createdPatient.id}`);
        }
    };

    return (
        <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/patients"><ArrowLeft /></Link>
                    </Button>
                    <h1 className="text-xl sm:text-2xl font-bold">Create New Patient Record</h1>
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
                                            <CardTitle>Core Patient Demographics</CardTitle>
                                            <CardDescription>Step 1 of 4: Enter the required information to register a new patient.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Personal Information</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Muhammad Idris Abubakar" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="dateOfBirth" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1920} toYear={new Date().getFullYear()} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="maritalStatus" render={({ field }) => (<FormItem><FormLabel>Marital Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select marital status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Single">Single</SelectItem><SelectItem value="Married">Married</SelectItem><SelectItem value="Divorced">Divorced</SelectItem><SelectItem value="Widowed">Widowed</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Contact Details</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="address" render={({ field }) => (<FormItem className="sm:col-span-2"><FormLabel>Home Address</FormLabel><FormControl><Input placeholder="e.g., No 20 Emir's Palace Road, Kano State" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="e.g., 07042526971" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                             <FormField control={form.control} name="preferredCommunicationMethod" render={({ field }) => (<FormItem><FormLabel>Preferred Communication</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a method" /></SelectTrigger></FormControl><SelectContent><SelectItem value="SMS">SMS</SelectItem><SelectItem value="Email">Email</SelectItem><SelectItem value="WhatsApp">WhatsApp</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Emergency Contact</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <FormField control={form.control} name="emergencyContactName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Muhammad Idris Abubakar" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="emergencyContactRelationship" render={({ field }) => (<FormItem><FormLabel>Relationship</FormLabel><FormControl><Input placeholder="e.g., Spouse" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="emergencyContactPhone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="e.g., 07042526971" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0">
                                    <Button type="button" onClick={handleNext} className="w-full sm:w-auto">
                                        Next <ArrowRight className="ml-2 h-4 w-4"/>
                                    </Button>
                                </CardFooter>
                            </>
                         )}
                         {step === 2 && (
                             <>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <ClipboardCheck className="w-6 h-6" />
                                        <div>
                                            <CardTitle>Medical Information</CardTitle>
                                            <CardDescription>Step 2 of 4: Provide key medical details for treatment and safety.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                     <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
                                    <Button type="button" variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                                        <ArrowLeft className="mr-2 h-4 w-4"/> Back
                                    </Button>
                                    <Button type="button" onClick={handleNext} className="w-full sm:w-auto">
                                        Next <ArrowRight className="ml-2 h-4 w-4"/>
                                    </Button>
                                </CardFooter>
                             </>
                         )}
                         {step === 3 && (
                              <>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <ClipboardCheck className="w-6 h-6" />
                                        <div>
                                            <CardTitle>Administrative Information</CardTitle>
                                            <CardDescription>Step 3 of 4: Final details for patient routing.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                     <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
                                    <Button type="button" variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                                        <ArrowLeft className="mr-2 h-4 w-4"/> Back
                                    </Button>
                                    <Button type="button" onClick={handleNext} className="w-full sm:w-auto">
                                        Next <ArrowRight className="ml-2 h-4 w-4"/>
                                    </Button>
                                </CardFooter>
                             </>
                         )}
                         {step === 4 && (
                            <>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Fingerprint className="w-6 h-6" />
                                        <div>
                                            <CardTitle>Biometric Verification & Photo</CardTitle>
                                            <CardDescription>Step 4 of 4: Secure the patient's record and capture photo for ID card.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className={cn("p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center", biometricCaptured.fingerprint && 'border-green-500 bg-green-500/10')}>
                                            <Fingerprint className={cn("w-16 h-16 text-muted-foreground", biometricCaptured.fingerprint && 'text-green-600')} />
                                            <h3 className="mt-4 font-semibold">Fingerprint Scan</h3>
                                            <p className="mt-1 text-sm text-muted-foreground">Capture the patient's fingerprint for secure identification.</p>
                                            <Button type="button" variant="outline" className="mt-4" onClick={() => handleCaptureBiometric('fingerprint')} disabled={isCapturing || biometricCaptured.fingerprint}>
                                                {isCapturing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                                {biometricCaptured.fingerprint ? <CheckCircle className="mr-2 h-4 w-4" /> : <Fingerprint className="mr-2 h-4 w-4" />}
                                                {isCapturing ? 'Capturing...' : biometricCaptured.fingerprint ? 'Captured' : 'Start Scan'}
                                            </Button>
                                        </div>
                                        {/* Combined Photo & Face Biometric Card */}
                                        <div className={cn("p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center", (biometricCaptured.face || patientPhoto) && 'border-green-500 bg-green-500/10')}>  
                                            {(biometricCaptured.face || patientPhoto) ? (
                                                <div className="relative">
                                                    <img 
                                                        src={patientPhoto} 
                                                        alt="Patient Photo & Face Biometric" 
                                                        className="w-16 h-20 object-cover rounded-lg mb-2"
                                                    />
                                                    <CheckCircle className="w-6 h-6 text-green-600 absolute -top-1 -right-1" />
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <ScanFace className="w-16 h-16 text-muted-foreground" />
                                                    <Camera className="w-6 h-6 text-muted-foreground absolute -bottom-1 -right-1" />
                                                </div>
                                            )}
                                            <h3 className="mt-4 font-semibold">Face Photo & ID Card</h3>
                                            <p className="mt-1 text-sm text-muted-foreground">Single photo for both biometric recognition and ID card display.</p>
                                            <Button type="button" variant="outline" className="mt-4" onClick={handleCapturePatientPhoto} disabled={!!(biometricCaptured.face || patientPhoto)}>
                                                {(biometricCaptured.face || patientPhoto) ? <CheckCircle className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
                                                {(biometricCaptured.face || patientPhoto) ? 'Photo Captured' : 'Take Photo'}
                                            </Button>
                                            {(biometricCaptured.face || patientPhoto) && (
                                                <Button type="button" variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => {
                                                    handleRemovePatientPhoto();
                                                    setBiometricCaptured(prev => ({ ...prev, face: false }));
                                                }}>
                                                    <X className="mr-1 h-3 w-3" />
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {!biometricCaptured.fingerprint && !biometricCaptured.face && !patientPhoto && (
                                        <div className="text-center text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                                            <span className="font-medium">⚠️ At least one identification method is required</span> - Please capture fingerprint, face biometric, or patient photo to continue.
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
                                    <Button type="button" variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                                        <ArrowLeft className="mr-2 h-4 w-4"/> Back
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button 
                                                type="button" 
                                                disabled={!biometricCaptured.fingerprint && !biometricCaptured.face && !patientPhoto || isSubmitting}
                                                className="w-full sm:w-auto"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Creating Patient...
                                                    </>
                                                ) : (
                                                    "Save and Register Patient"
                                                )}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Patient Registration</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   Are you certain that all the information provided for this patient is accurate and complete? This action will create a permanent medical record.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Review Information</AlertDialogCancel>
                                                <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
                                                    Continue and Save
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </>
                         )}
                    </form>
                </Form>
            </Card>

            {/* Camera Modal for Photo/Biometric Capture */}
            <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                <DialogContent className="max-w-2xl w-full mx-4 sm:mx-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isPhotoCamera ? 'Capture Patient Photo' : 'Capture Face Biometric'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                            {hasCameraPermission === false ? (
                                <div className="text-center text-muted-foreground">
                                    <Camera className="mx-auto h-12 w-12 mb-2"/>
                                    <p className="font-semibold">Camera access is required</p>
                                    <p className="text-sm">Please allow camera permissions in your browser.</p>
                                </div>
                            ) : (
                                <video 
                                    ref={videoRef} 
                                    className="w-full h-full object-cover" 
                                    autoPlay 
                                    muted 
                                    playsInline 
                                />
                            )}
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                        <div className="text-center text-sm text-muted-foreground">
                            {isPhotoCamera 
                                ? "Position the patient within the frame for their ID card photo and click capture when ready."
                                : "Position the patient's face within the frame and click capture when ready."
                            }
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => {
                            setIsCameraOpen(false);
                            setIsPhotoCamera(false);
                        }} className="w-full sm:w-auto">
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            onClick={handleCameraCapture}
                            disabled={hasCameraPermission !== true}
                            className="w-full sm:w-auto"
                        >
                            <Camera className="mr-2 h-4 w-4" />
                            {isPhotoCamera ? 'Capture Photo' : 'Capture Face'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Modal with Print Card Option */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="max-w-md w-full mx-4 sm:mx-auto">
                    <DialogHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <DialogTitle className="text-center">Patient Created Successfully!</DialogTitle>
                    </DialogHeader>
                    
                    {createdPatient && (
                        <div className="space-y-4 text-center">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-lg">{createdPatient.name}</h3>
                                <p className="text-sm text-gray-600">Patient ID: <span className="font-mono font-bold">{createdPatient.id}</span></p>
                                <p className="text-sm text-gray-600">Date of Birth: {format(new Date(createdPatient.dateOfBirth), 'PPP')}</p>
                                <p className="text-sm text-gray-600">Blood Type: <span className="font-semibold text-red-600">{createdPatient.bloodType}</span></p>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                                The patient record has been successfully created and saved to the system.
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={handlePrintCard}
                            disabled={isGeneratingCard}
                            className="w-full sm:w-auto"
                        >
                            {isGeneratingCard ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    {createdPatient?.avatarUrl ? 'Generate AI-Enhanced ID Card' : 'Print ID Card'}
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={handleContinueToProfile}
                            className="w-full sm:w-auto"
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            View Profile
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </div>
    );
}
