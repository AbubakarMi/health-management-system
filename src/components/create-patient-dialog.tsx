
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Patient, users } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Camera, Upload, User as UserIcon, X, Fingerprint, CheckCircle, CalendarIcon, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Textarea } from "./ui/textarea";

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
type PatientSaveData = Omit<Patient, 'id' | 'medicalHistory' | 'prescriptions' | 'lastVisit' | 'labTests' | 'bloodType' | 'admission'>;

interface CreatePatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientSaved: (patient: PatientSaveData) => void;
  importedData?: { name: string; dateOfBirth: Date, clinicalSummary: string } | null;
}

const doctors = users.filter(u => u.role === 'doctor');
const step1Fields: (keyof FormData)[] = ['name', 'gender', 'dateOfBirth', 'maritalStatus', 'address', 'condition', 'assignedDoctor', 'clinicalSummary'];

// This component is now deprecated and will be removed in a future update.
// The functionality has been moved to a dedicated page at /admin/patients/create
export function CreatePatientDialog({ isOpen, onClose, onPatientSaved, importedData }: CreatePatientDialogProps) {
    const [step, setStep] = useState(1);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [fingerprintCaptured, setFingerprintCaptured] = useState(false);
    const [isCameraOpen, setCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            gender: "Male",
            maritalStatus: "Single",
            address: "",
            condition: "Stable",
            assignedDoctor: "",
            clinicalSummary: "",
            avatarUrl: "",
            fingerprintId: "",
        },
    });
    
    useEffect(() => {
        if (isOpen) {
            setStep(1); // Reset to first step when dialog opens
            form.reset({
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
            });
            setPhotoPreview(null);
            setFingerprintCaptured(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [isOpen, form, importedData]);

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
        // Simulate fingerprint capture
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
        onPatientSaved({ ...values, dateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd")});
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-xl flex flex-col p-0">
                    <DialogHeader className="p-6 pb-4 border-b">
                        <DialogTitle>Create New Patient Record</DialogTitle>
                        <DialogDescription>
                           Step {step} of 2: {step === 1 ? 'Enter Patient Details' : 'Capture Biometrics'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
                             <ScrollArea className="flex-1">
                                <div className="p-6">
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
                                                <FormField
                                                    control={form.control}
                                                    name="maritalStatus"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Marital Status</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
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
                                                <FormField
                                                    control={form.control}
                                                    name="assignedDoctor"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Assign Doctor</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger></FormControl>
                                                                <SelectContent>
                                                                    {doctors.map((doctor) => (<SelectItem key={doctor.email} value={doctor.name}>{doctor.name}</SelectItem>))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                             <div className="space-y-6">
                                                <FormField
                                                        control={form.control}
                                                        name="address"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Address</FormLabel>
                                                                <FormControl>
                                                                    <Textarea placeholder="123 Main St, Anytown..." {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                <FormField
                                                    control={form.control}
                                                    name="condition"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Initial Condition</FormLabel>
                                                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl><SelectTrigger><SelectValue placeholder="Select initial condition" /></SelectTrigger></FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Stable">Stable</SelectItem>
                                                                    <SelectItem value="Improving">Improving</SelectItem>
                                                                    <SelectItem value="Critical">Critical</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                        control={form.control}
                                                        name="clinicalSummary"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Clinical Summary (Imported)</FormLabel>
                                                                <FormControl>
                                                                    <Textarea placeholder="Imported from external record..." {...field} rows={4} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                            </div>
                                        </div>
                                    )}
                                    {step === 2 && (
                                         <div className="space-y-6">
                                            <div className="space-y-3 flex flex-col">
                                                <FormLabel>Patient Biometrics</FormLabel>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="aspect-square w-full rounded-md border bg-muted flex items-center justify-center overflow-hidden relative group/photo">
                                                        {photoPreview ? (
                                                            <>
                                                                <Image src={photoPreview} alt="Patient preview" layout="fill" objectFit="cover" />
                                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                                                                    <Button type="button" size="icon" variant="destructive" onClick={clearPhoto}>
                                                                        <X className="h-5 w-5" />
                                                                        <span className="sr-only">Clear Photo</span>
                                                                    </Button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-muted-foreground p-2">
                                                                <UserIcon className="mx-auto h-10 w-10" />
                                                                <p className="text-xs mt-1">Patient Photo</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={cn("aspect-square w-full rounded-md border bg-muted flex items-center justify-center overflow-hidden relative group/fingerprint transition-colors", fingerprintCaptured && "border-green-500 bg-green-500/10")}>
                                                        {fingerprintCaptured ? (
                                                            <>
                                                                <div className="text-center text-green-600 p-2">
                                                                    <CheckCircle className="mx-auto h-10 w-10" />
                                                                    <p className="text-xs mt-1 font-semibold">Captured</p>
                                                                </div>
                                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/fingerprint:opacity-100 transition-opacity">
                                                                    <Button type="button" size="icon" variant="destructive" onClick={clearFingerprint}>
                                                                        <X className="h-5 w-5" />
                                                                        <span className="sr-only">Clear Fingerprint</span>
                                                                    </Button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-muted-foreground p-2">
                                                                <Fingerprint className="mx-auto h-10 w-10" />
                                                                <p className="text-xs mt-1">Fingerprint</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button type="button" variant="outline" className="w-full" onClick={() => setCameraOpen(true)}>
                                                        <Camera className="mr-2 h-4 w-4"/>Take Photo
                                                    </Button>
                                                    <Button type="button" variant="outline" className="w-full" onClick={triggerFileUpload}>
                                                        <Upload className="mr-2 h-4 w-4"/>Upload
                                                    </Button>
                                                    <Button type="button" variant="outline" className="w-full" onClick={handleFingerprintCapture} disabled={fingerprintCaptured}>
                                                        <Fingerprint className="mr-2 h-4 w-4"/>Scan Print
                                                    </Button>
                                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/gif" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            <DialogFooter className="p-6 pt-4 border-t bg-background flex justify-between">
                                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                                <div className="flex gap-2">
                                    {step === 2 && (
                                         <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                    )}
                                    {step === 1 ? (
                                        <Button type="button" onClick={handleNext}>
                                            Next <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button type="submit">Create Patient</Button>
                                    )}
                                </div>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Camera Modal */}
            <Dialog open={isCameraOpen} onOpenChange={setCameraOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Take Patient Photo</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center overflow-hidden mt-2 border">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setCameraOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleCapture}>
                            <Camera className="mr-2 h-4 w-4" /> Capture and Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
