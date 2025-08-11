
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { detailedPatients as initialPatients, Patient, users } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CalendarIcon, Camera, CheckCircle, Fingerprint, Upload, User as UserIcon, X, PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  gender: z.enum(['Male', 'Female']),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  address: z.string().min(10, "Address must be at least 10 characters."),
  condition: z.enum(['Stable', 'Critical', 'Improving']),
  assignedDoctor: z.string().min(1, "Please assign a doctor."),
  clinicalSummary: z.string().optional(),
  avatarUrl: z.string().optional(),
  fingerprintId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;
const doctors = users.filter(u => u.role === 'doctor');
const step1Fields: (keyof FormData)[] = ['name', 'gender', 'dateOfBirth', 'maritalStatus', 'address', 'condition', 'assignedDoctor', 'clinicalSummary'];

export default function CreatePatientPage() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState(1);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [fingerprintCaptured, setFingerprintCaptured] = useState(false);
    const [isCameraOpen, setCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

     const importedData = useMemo(() => {
        const name = searchParams.get('name');
        const dateOfBirth = searchParams.get('dateOfBirth');
        const clinicalSummary = searchParams.get('clinicalSummary');
        if (name && dateOfBirth) {
            return {
                name,
                dateOfBirth: new Date(dateOfBirth),
                clinicalSummary: clinicalSummary || '',
            }
        }
        return null;
    }, [searchParams]);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: importedData?.name || "",
            gender: "Male",
            dateOfBirth: importedData?.dateOfBirth,
            maritalStatus: "Single",
            address: "",
            condition: "Stable",
            assignedDoctor: doctors.length > 0 ? doctors[0].name : "",
            clinicalSummary: importedData?.clinicalSummary || "",
            avatarUrl: "",
            fingerprintId: "",
        },
    });

    useEffect(() => {
        if (importedData) {
            form.reset({
                name: importedData.name,
                dateOfBirth: importedData.dateOfBirth,
                clinicalSummary: importedData.clinicalSummary,
                gender: "Male",
                maritalStatus: "Single",
                address: "",
                condition: "Stable",
                assignedDoctor: doctors.length > 0 ? doctors[0].name : "",
            })
        }
    }, [importedData, form]);

    useEffect(() => {
        const startVideoStream = async () => {
            if (isCameraOpen && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (error) {
                    console.error("Error accessing camera:", error);
                    setCameraOpen(false);
                }
            }
        };

        const stopVideoStream = () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        };

        if (isCameraOpen) {
            startVideoStream();
        } else {
            stopVideoStream();
        }

        return () => stopVideoStream();
    }, [isCameraOpen]);
    

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/png');
            setPhotoPreview(dataUrl);
            form.setValue('avatarUrl', dataUrl);
            setCameraOpen(false);
        }
    }
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                setPhotoPreview(dataUrl);
                form.setValue('avatarUrl', dataUrl);
            }
            reader.readAsDataURL(file);
        }
    }

    const handleFingerprintCapture = () => {
        setFingerprintCaptured(true);
        form.setValue('fingerprintId', `FP_${Date.now()}`);
    }
    
    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const clearPhoto = () => {
        setPhotoPreview(null);
        form.setValue('avatarUrl', undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const clearFingerprint = () => {
        setFingerprintCaptured(false);
        form.setValue('fingerprintId', undefined);
    }

    const handleNext = async () => {
        const isValid = await form.trigger(step1Fields);
        if (isValid) {
            setStep(2);
        }
    }

    function onSubmit(values: FormData) {
        const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
        let maxNumber = 0;
        initialPatients.forEach(p => {
            const numPart = parseInt(p.id.split('-')[1]);
            if (numPart > maxNumber) {
                maxNumber = numPart;
            }
        });
        const newPatientNumber = maxNumber + 1;
        const paddedNumber = String(newPatientNumber).padStart(6, '0');
        const genderPrefix = values.gender === 'Male' ? 'PM' : 'PF';
        const newId = `${genderPrefix}-${paddedNumber}-${suffix}`;

        const patientToAdd: Patient = {
            ...values,
            dateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd"),
            id: newId,
            lastVisit: new Date().toISOString().split('T')[0],
            bloodType: 'O+',
            admission: { isAdmitted: false, admissionDate: null, dischargeDate: null, roomNumber: null, bedNumber: null },
            medicalHistory: [{
                id: `visit-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                event: "Patient Registration",
                details: `Patient registered with ID ${newId} and assigned to ${values.assignedDoctor}.`,
                doctor: "Admin"
            }],
            prescriptions: [],
            labTests: []
        };
        
        initialPatients.unshift(patientToAdd);
        
        toast({
            title: "Patient Created",
            description: `${values.name} has been successfully added with ID ${newId}.`
        });
        router.push('/admin/patients');
    }

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/patients"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-2xl font-bold">Create New Patient Record</h1>
            </div>

            <Card className="max-w-4xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle>Step {step}: {step === 1 ? 'Patient Details' : 'Biometrics'}</CardTitle>
                            <CardDescription>
                                {step === 1 ? 'Fill in the personal and medical details for the new patient.' : 'Capture optional biometric data for identification.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {step === 1 && (
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl><Input placeholder="Jane Smith" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="gender" render={({ field }) => ( <FormItem> <FormLabel>Gender</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl> <SelectContent> <SelectItem value="Male">Male</SelectItem> <SelectItem value="Female">Female</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
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
                                        <FormField control={form.control} name="maritalStatus" render={({ field }) => ( <FormItem> <FormLabel>Marital Status</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl> <SelectContent> <SelectItem value="Single">Single</SelectItem> <SelectItem value="Married">Married</SelectItem> <SelectItem value="Divorced">Divorced</SelectItem> <SelectItem value="Widowed">Widowed</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                                        <FormField control={form.control} name="assignedDoctor" render={({ field }) => ( <FormItem> <FormLabel>Assign Doctor</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger></FormControl> <SelectContent> {doctors.map((doctor) => (<SelectItem key={doctor.email} value={doctor.name}>{doctor.name}</SelectItem>))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                                    </div>
                                    <div className="space-y-6">
                                        <FormField control={form.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Address</FormLabel> <FormControl> <Textarea placeholder="123 Main St, Anytown..." {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                                        <FormField control={form.control} name="condition" render={({ field }) => ( <FormItem> <FormLabel>Initial Condition</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select initial condition" /></SelectTrigger></FormControl> <SelectContent> <SelectItem value="Stable">Stable</SelectItem> <SelectItem value="Improving">Improving</SelectItem> <SelectItem value="Critical">Critical</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                                        <FormField control={form.control} name="clinicalSummary" render={({ field }) => ( <FormItem> <FormLabel>Clinical Summary (from external record if available)</FormLabel> <FormControl> <Textarea placeholder="Patient has a history of..." {...field} rows={4} /> </FormControl> <FormMessage /> </FormItem> )}/>
                                    </div>
                                </div>
                            )}
                             {step === 2 && (
                                <div className="space-y-6 max-w-lg mx-auto">
                                    <div className="space-y-3 flex flex-col">
                                        <FormLabel>Patient Biometrics</FormLabel>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="aspect-square w-full rounded-md border bg-muted flex items-center justify-center overflow-hidden relative group/photo">
                                                {photoPreview ? (
                                                    <>
                                                        <Image src={photoPreview} alt="Patient preview" layout="fill" objectFit="cover" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                                                            <Button type="button" size="icon" variant="destructive" onClick={clearPhoto}><X className="h-5 w-5" /><span className="sr-only">Clear Photo</span></Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center text-muted-foreground p-2"><UserIcon className="mx-auto h-10 w-10" /><p className="text-xs mt-1">Patient Photo</p></div>
                                                )}
                                            </div>
                                            <div className={cn("aspect-square w-full rounded-md border bg-muted flex items-center justify-center overflow-hidden relative group/fingerprint transition-colors", fingerprintCaptured && "border-green-500 bg-green-500/10")}>
                                                {fingerprintCaptured ? (
                                                    <>
                                                        <div className="text-center text-green-600 p-2"><CheckCircle className="mx-auto h-10 w-10" /><p className="text-xs mt-1 font-semibold">Captured</p></div>
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/fingerprint:opacity-100 transition-opacity">
                                                            <Button type="button" size="icon" variant="destructive" onClick={clearFingerprint}><X className="h-5 w-5" /><span className="sr-only">Clear Fingerprint</span></Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center text-muted-foreground p-2"><Fingerprint className="mx-auto h-10 w-10" /><p className="text-xs mt-1">Fingerprint</p></div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="outline" className="w-full" onClick={() => setCameraOpen(true)}><Camera className="mr-2 h-4 w-4"/>Take Photo</Button>
                                            <Button type="button" variant="outline" className="w-full" onClick={triggerFileUpload}><Upload className="mr-2 h-4 w-4"/>Upload</Button>
                                            <Button type="button" variant="outline" className="w-full" onClick={handleFingerprintCapture} disabled={fingerprintCaptured}><Fingerprint className="mr-2 h-4 w-4"/>Scan Print</Button>
                                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/gif" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button type="button" variant="ghost" onClick={() => router.push('/admin/patients')}>Cancel</Button>
                            <div className="flex gap-2">
                                {step === 2 && (<Button type="button" variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>)}
                                {step === 1 ? (<Button type="button" onClick={handleNext}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>) : (<Button type="submit"><PlusCircle className="mr-2 h-4 w-4" />Create Patient</Button>)}
                            </div>
                        </CardFooter>
                    </form>
                </Form>
            </Card>

            <Dialog open={isCameraOpen} onOpenChange={setCameraOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Take Patient Photo</DialogTitle></DialogHeader>
                    <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center overflow-hidden mt-2 border">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setCameraOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleCapture}><Camera className="mr-2 h-4 w-4" /> Capture and Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
