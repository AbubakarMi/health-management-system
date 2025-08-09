
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { detailedPatients, Patient, Prescription, prescriptionManager, labTestManager, MedicalHistoryEntry, patientManager } from "@/lib/constants";
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Pill, MoreHorizontal, Edit, Trash2, FlaskConical, Stethoscope, Microscope, TestTube2, BedDouble, LogOut, Lightbulb, VenetianMask, Fingerprint, History, Sparkles, Loader2, Check, CalendarPlus, NotebookText, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineTitle, TimelineContent, TimelineTime } from '@/components/ui/timeline';
import { ReviewSuggestionDialog } from '@/components/review-suggestion-dialog';
import { VisitDetailsDialog } from '@/components/visit-details-dialog';
import { generateClinicalPlan, GenerateClinicalPlanOutput } from '@/ai/flows/generate-clinical-plan';
import { ScheduleFollowUpDialog } from '@/components/schedule-follow-up-dialog';
import { EditSummaryDialog } from '@/components/edit-summary-dialog';
import { RecordDeathDialog } from '@/components/record-death-dialog';
import { ReferPatientDialog } from '@/components/refer-patient-dialog';


const prescriptionSchema = z.object({
  medicine: z.string().min(2, "Medicine name is required."),
  dosage: z.string().min(1, "Dosage is required."),
});
type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

const labRequestSchema = z.object({
  test: z.string().min(3, "Test name is required."),
  instructions: z.string().min(10, "Please provide detailed instructions for the lab."),
});
type LabRequestFormData = z.infer<typeof labRequestSchema>;


export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  const { toast } = useToast();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isPrescribeDialogOpen, setPrescribeDialogOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [isLabRequestDialogOpen, setLabRequestDialogOpen] = useState(false);
  const [isRecordDeathOpen, setRecordDeathOpen] = useState(false);
  const [isReferPatientOpen, setReferPatientOpen] = useState(false);
  const [reviewingSuggestion, setReviewingSuggestion] = useState<Prescription | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<MedicalHistoryEntry | null>(null);
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<GenerateClinicalPlanOutput | null>(null);
  const [isFollowUpOpen, setFollowUpOpen] = useState(false);
  const [isEditSummaryOpen, setEditSummaryOpen] = useState(false);

  
  const prescriptionForm = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: { medicine: "", dosage: "" },
  });

  const labRequestForm = useForm<LabRequestFormData>({
      resolver: zodResolver(labRequestSchema),
      defaultValues: { test: "", instructions: "" },
  });
  
  const updatePatientData = () => {
    const foundPatient = detailedPatients.find(p => p.id === patientId) || null;
    if (foundPatient) {
        foundPatient.medicalHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    setPatient(JSON.parse(JSON.stringify(foundPatient)));
  }

  useEffect(() => {
    updatePatientData();
    
    const unsubscribePatient = patientManager.subscribe(updatePatientData);
    const unsubscribeLab = labTestManager.subscribe(updatePatientData);
    const unsubscribePrescription = prescriptionManager.subscribe(updatePatientData);

    return () => {
        unsubscribePatient();
        unsubscribeLab();
        unsubscribePrescription();
    }
  }, [patientId]);

  useEffect(() => {
     if (!patient) return;
     
     const handlePrescriptionUpdate = () => {
         const patientPrescriptions = prescriptionManager.getPatientPrescriptions(patient.id);
         setPrescriptions(patientPrescriptions);
     }
     
     handlePrescriptionUpdate(); // Initial load
     
     const unsubscribe = prescriptionManager.subscribe(handlePrescriptionUpdate);
     return () => unsubscribe();
  }, [patient]);
  
  useEffect(() => {
    if (editingPrescription) {
      prescriptionForm.reset({
        medicine: editingPrescription.medicine,
        dosage: editingPrescription.dosage,
      });
    } else {
      prescriptionForm.reset({ medicine: "", dosage: "" });
    }
  }, [editingPrescription, prescriptionForm]);
  
  
  const openAddDialog = (suggestion?: { medicine: string, dosage: string }) => {
    setEditingPrescription(null);
    if (suggestion) {
        prescriptionForm.reset(suggestion);
    } else {
        prescriptionForm.reset({ medicine: "", dosage: "" });
    }
    setPrescribeDialogOpen(true);
  };
  
  const openEditDialog = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setPrescribeDialogOpen(true);
  }

  const handlePrescriptionSubmit = (values: PrescriptionFormData) => {
    if (!patient) return;
    
    if (editingPrescription) {
      // Update existing prescription
      prescriptionManager.updatePrescription({
        ...editingPrescription,
        medicine: values.medicine,
        dosage: values.dosage,
      });
       toast({ title: "Prescription Updated", description: "The prescription has been successfully updated." });
    } else {
        // Add new prescription
        prescriptionManager.addPrescription({
            patientName: patient.name,
            medicine: values.medicine,
            dosage: values.dosage,
            doctor: "Dr. Aisha Bello", // Hardcoded for now
            status: "Pending"
        });
        toast({ title: "Prescription Added", description: `A new prescription has been added for ${patient.name}.` });
    }

    // If this was an AI suggestion, remove it from the list
    if (aiSuggestions) {
        setAISuggestions(prev => ({
            ...prev!,
            prescriptionSuggestions: prev!.prescriptionSuggestions.filter(p => p.medicine !== values.medicine)
        }));
    }

    setPrescribeDialogOpen(false);
    setEditingPrescription(null);
    prescriptionForm.reset();
  };
  
  const handleDeletePrescription = (prescriptionId: string) => {
    if (!patient) return;
    prescriptionManager.deletePrescription(patient.id, prescriptionId);
     toast({ variant: "destructive", title: "Prescription Deleted", description: "The prescription has been removed." });
  }
  
  const handleLabRequestSubmit = (values: LabRequestFormData) => {
    if (!patient) return;
    labTestManager.addLabTest({ 
        patient: patient.name, 
        test: values.test,
        instructions: values.instructions,
        doctor: 'Dr. Aisha Bello' 
    });
    setLabRequestDialogOpen(false);
    labRequestForm.reset();
    toast({
        title: "Lab Request Sent",
        description: `Instructions for ${patient?.name} have been sent to the lab.`
    });
  }

  const handleAdmitPatient = () => {
      if (!patient) return;
      patientManager.admitPatient(patient.id);
      toast({
          title: "Patient Admitted",
          description: `${patient.name} has been admitted and is awaiting bed assignment.`
      });
  }
  
  const handleDischargePatient = () => {
      if (!patient) return;
      patientManager.dischargePatient(patient.id);
      toast({
          title: "Patient Discharged",
          description: `${patient.name} has been successfully discharged.`
      });
  }

  const handleConditionChange = (condition: string) => {
    if (!patient) return;
    patientManager.updatePatientCondition(patient.id, condition, patient.assignedDoctor);
    toast({
        title: "Patient Condition Updated",
        description: `The patient's condition has been set to ${condition}.`
    });
  };
  
  const handleConfirmDeceased = (report: string) => {
      if (!patient) return;
      patientManager.markPatientAsDeceased(patient.id, patient.assignedDoctor, report);
      toast({
        variant: "destructive",
        title: "Patient Status Updated",
        description: `${patient.name} has been marked as deceased.`,
      });
      setRecordDeathOpen(false);
  }

  const handleConfirmReferral = (referralLetter: string, receivingEntity: string) => {
    if (!patient) return;
    patientManager.referPatient(patient.id, patient.assignedDoctor, referralLetter, receivingEntity);
    toast({
      title: "Patient Referral Saved",
      description: `${patient.name} has been referred. The referral letter is saved in their history.`
    });
    setReferPatientOpen(false);
  }

  const handleAcceptSuggestion = (prescriptionId: string) => {
    if (!patient) return;
    prescriptionManager.acceptSuggestion(prescriptionId, patient.id);
    setReviewingSuggestion(null);
    toast({ title: "Suggestion Accepted", description: "The prescription has been updated." });
  }
  
  const handleRejectSuggestion = (prescriptionId: string, reason: string) => {
    if (!patient) return;
    prescriptionManager.rejectSuggestion(prescriptionId, reason, patient.id);
    setReviewingSuggestion(null);
    toast({ title: "Suggestion Rejected", description: "The pharmacist has been notified." });
  }

  const handleGetAISuggestions = async () => {
      if (!patient) return;
      setIsAISuggesting(true);
      setAISuggestions(null);
      try {
          const medicalHistorySummary = patient.medicalHistory.map(h => `${h.date}: ${h.event} - ${h.details}`).join('\n');
          const result = await generateClinicalPlan({
              medicalHistory: medicalHistorySummary,
              currentCondition: patient.condition
          });
          setAISuggestions(result);
      } catch (error) {
          console.error("AI suggestion failed:", error);
          toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate suggestions at this time.' });
      } finally {
          setIsAISuggesting(false);
      }
  }

  const handleAcceptLifestyleSuggestion = (suggestion: {id: string, suggestion: string}) => {
      if (!patient) return;
      patientManager.addNoteToLatestVisit(patient.id, `AI-assisted recommendation: ${suggestion.suggestion}`);
      setAISuggestions(prev => ({
          ...prev!,
          recommendations: prev!.recommendations.filter(r => r.id !== suggestion.id)
      }));
      toast({ title: "Suggestion Added", description: "The AI recommendation has been added to the visit notes." });
  }

  const handleScheduleFollowUp = (data: { date: Date; reason: string }) => {
    if (!patient) return;
    patientManager.scheduleFollowUp(patient.id, data.date, data.reason, patient.assignedDoctor);
     setAISuggestions(prev => ({ ...prev!, followUpSuggestion: undefined }));
    toast({
      title: "Follow-up Scheduled",
      description: `A follow-up has been scheduled for ${patient.name}.`,
    });
    setFollowUpOpen(false);
  };

  const handleSaveSummary = (newSummary: string) => {
    if (!patient) return;
    patientManager.updateClinicalSummary(patient.id, newSummary);
    toast({ title: "Summary Updated", description: "The clinical summary has been saved." });
    setEditSummaryOpen(false);
  }


  const getBadgeVariant = (condition: string): "destructive" | "secondary" | "default" => {
    switch (condition) {
        case 'Critical': return 'destructive';
        case 'Deceased': return 'destructive';
        case 'Improving': return 'secondary';
        case 'Stable': return 'secondary';
        case 'Normal': return 'default';
        default: return 'secondary';
    }
  }
  
   const getBadgeClass = (condition: string): string => {
    switch (condition) {
        case 'Normal': return 'bg-green-500 text-white';
        case 'Improving': return 'bg-yellow-500 text-white';
        case 'Deceased': return 'bg-black text-white hover:bg-black/80';
        default: return '';
    }
  }

  const getTimelineIcon = (event: string) => {
      const eventLower = event.toLowerCase();
      if (eventLower.includes("lab test ordered")) return <TestTube2 className="h-4 w-4" />;
      if (eventLower.includes("lab test results")) return <Microscope className="h-4 w-4" />;
      if (eventLower.includes("check-up") || eventLower.includes("follow-up") || eventLower.includes("diagnosis") || eventLower.includes("registration") || eventLower.includes("condition update") || eventLower.includes("deceased") || eventLower.includes("consultation")) return <Stethoscope className="h-4 w-4" />;
      if (eventLower.includes("prescription")) return <Pill className="h-4 w-4" />;
      if (eventLower.includes("admitted")) return <BedDouble className="h-4 w-4" />;
      if (eventLower.includes("discharged")) return <LogOut className="h-4 w-4" />;
      if (eventLower.includes("suggestion")) return <Lightbulb className="h-4 w-4" />;
      if (eventLower.includes("referral")) return <Send className="h-4 w-4" />;
      return <FileText className="h-4 w-4" />;
  }

  if (!patient) {
    return (
        <Card>
            <CardHeader><CardTitle>Patient not found</CardTitle></CardHeader>
            <CardContent><p>The requested patient could not be found.</p></CardContent>
        </Card>
    );
  }

  return (
    <>
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 space-y-0">
           <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border">
                <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person" />
                <AvatarFallback className="text-2xl">{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <CardTitle className="text-2xl md:text-3xl">{patient.name}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="font-mono bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">{patient.id}</span>
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild disabled={patient.condition === 'Deceased'}>
                             <Badge variant={getBadgeVariant(patient.condition)} className={`${getBadgeClass(patient.condition)} cursor-pointer`}>
                                {patient.condition}
                             </Badge>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleConditionChange('Critical')}>Critical</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleConditionChange('Improving')}>Improving</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleConditionChange('Stable')}>Stable</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleConditionChange('Normal')}>Normal</DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => setRecordDeathOpen(true)}>Deceased</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="flex items-center gap-1"><VenetianMask className="w-4 h-4 text-muted-foreground"/> {patient.gender}</span>
                         {patient.fingerprintId && (
                           <span className="flex items-center gap-1 text-green-600"><Fingerprint className="w-4 h-4"/> Biometrics Registered</span>
                         )}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground pt-1">Last Visit: {patient.lastVisit}</p>
                </div>
           </div>
            <div className='flex gap-2'>
                 {patient.admission.isAdmitted ? (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={patient.condition === 'Deceased'}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Discharge Patient
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to discharge {patient.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will mark the patient as discharged and free up their bed. This cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDischargePatient} className="bg-destructive hover:bg-destructive/90">
                                Discharge
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : (
                    <Button onClick={handleAdmitPatient} disabled={patient.condition === 'Deceased'}>
                        <BedDouble className="mr-2 h-4 w-4" />
                        Admit Patient
                    </Button>
                )}
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" disabled={patient.condition === 'Deceased'}>
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setReferPatientOpen(true)}>
                            <Send className="mr-2 h-4 w-4" /> Refer Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFollowUpOpen(true)}>
                            <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Follow-up
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>
        <CardContent className="pt-4">
            {patient.admission.isAdmitted && (
                 <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                    <BedDouble className="mr-2 h-4 w-4" />
                    Admitted {patient.admission.roomNumber ? `(Room ${patient.admission.roomNumber} - Bed ${patient.admission.bedNumber})` : '(Awaiting Bed Assignment)'}
                </Badge>
            )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
             <Card>
                <CardHeader>
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                     <CardTitle className="flex items-center gap-2"><NotebookText className="w-5 h-5" /> Clinical Summary</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => setEditSummaryOpen(true)}>
                        <Edit className="mr-2 h-4 w-4"/>
                        Edit Summary
                    </Button>
                   </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {patient.clinicalSummary || "No clinical summary has been recorded for this patient."}
                    </p>
                </CardContent>
              </Card>
            <Card>
            <CardHeader>
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                 <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" /> Medical History</CardTitle>
                 <Button variant="outline" onClick={() => setLabRequestDialogOpen(true)} disabled={patient.condition === 'Deceased'}><FlaskConical className="mr-2 h-4 w-4"/> Send to Lab</Button>
               </div>
            </CardHeader>
            <CardContent>
                <Timeline>
                    {patient.medicalHistory.map((entry) => (
                         <TimelineItem key={entry.id}>
                            <TimelineConnector />
                            <TimelineHeader>
                                <TimelineTime>{entry.date}</TimelineTime>
                                <TimelineIcon>{getTimelineIcon(entry.event)}</TimelineIcon>
                                <TimelineTitle>{entry.event}</TimelineTitle>
                            </TimelineHeader>
                            <TimelineContent>
                                <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setSelectedVisit(entry)}>
                                    View Visit Details
                                </Button>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card>
            <CardHeader>
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                 <CardTitle className="flex items-center gap-2"><Pill className="w-5 h-5" /> Prescriptions</CardTitle>
                 <Button size="sm" onClick={() => openAddDialog()} disabled={patient.condition === 'Deceased'}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
               </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Medicine</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {prescriptions.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <div className="font-medium">{p.medicine}</div>
                                        <div className="text-xs text-muted-foreground">{p.dosage}</div>
                                        {p.suggestion && p.suggestion.status === 'pending' && (
                                           <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-yellow-600" onClick={() => setReviewingSuggestion(p)}>
                                               <Lightbulb className="mr-1 h-3 w-3" />
                                               Review Suggestion
                                           </Button>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            p.suggestion?.status === 'pending' ? 'secondary' : p.status === 'Pending' ? 'secondary' : p.status === 'Unavailable' ? 'destructive' : 'default'
                                        } className={p.suggestion?.status === 'pending' ? 'bg-yellow-500' : p.status === 'Filled' ? 'bg-green-500' : ''}>
                                            {p.suggestion?.status === 'pending' ? 'Suggestion' : p.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={patient.condition === 'Deceased'}>
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditDialog(p)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Edit</span>
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" className="w-full justify-start text-sm font-normal text-destructive hover:bg-destructive/10 hover:text-destructive px-2 py-1.5 relative flex cursor-default select-none items-center rounded-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Delete</span>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the prescription for {p.medicine}.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeletePrescription(p.id)} className="bg-destructive hover:bg-destructive/90">
                                                            Delete
                                                        </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                </div>
            </CardContent>
          </Card>
           <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" />AI Clinical Assistant</CardTitle>
                    <CardDescription>Generate a clinical plan based on the patient's record.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGetAISuggestions} disabled={isAISuggesting || patient.condition === 'Deceased'} className="w-full">
                        {isAISuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {isAISuggesting ? "Analyzing..." : "Generate AI Plan"}
                    </Button>
                    {aiSuggestions && (
                        <div className="mt-4 space-y-4">
                            {/* Prescription Suggestions */}
                            {aiSuggestions.prescriptionSuggestions && aiSuggestions.prescriptionSuggestions.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Prescription Suggestions</h4>
                                    {aiSuggestions.prescriptionSuggestions.map(p => (
                                        <div key={p.id} className="p-3 border rounded-md bg-muted/50 text-sm">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <p className="font-medium">{p.medicine}</p>
                                                    <p className="text-muted-foreground">{p.dosage}</p>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => openAddDialog({ medicine: p.medicine, dosage: p.dosage })}>
                                                   <Edit className="mr-2 h-4 w-4" /> Edit & Accept
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                             {/* Follow-up Suggestion */}
                            {aiSuggestions.followUpSuggestion && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Follow-up Suggestion</h4>
                                     <div className="p-3 border rounded-md bg-muted/50 text-sm">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <p className="font-medium">Follow up in {aiSuggestions.followUpSuggestion.timing}</p>
                                                <p className="text-muted-foreground">{aiSuggestions.followUpSuggestion.reason}</p>
                                            </div>
                                            <Button size="sm" variant="outline" onClick={() => setFollowUpOpen(true)}>
                                                <Check className="mr-2 h-4 w-4" /> Accept
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lifestyle Recommendations */}
                            {aiSuggestions.recommendations && aiSuggestions.recommendations.length > 0 && (
                                <div className="space-y-2">
                                     <h4 className="font-semibold text-sm">Lifestyle Recommendations</h4>
                                    {aiSuggestions.recommendations.map(rec => (
                                        <div key={rec.id} className="p-3 border rounded-md bg-muted/50 text-sm">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <Badge variant="secondary" className="mb-2">{rec.category}</Badge>
                                                    <p>{rec.suggestion}</p>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => handleAcceptLifestyleSuggestion(rec)}>
                                                   <Check className="mr-2 h-4 w-4" /> Add to Notes
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>


      {/* Prescription Dialog */}
      <Dialog open={isPrescribeDialogOpen} onOpenChange={setPrescribeDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingPrescription ? 'Edit' : 'Add New'} Prescription</DialogTitle>
                <DialogDescription>
                    {editingPrescription ? 'Update the details for this medication.' : `Prescribe a new medication for ${patient.name}.`}
                </DialogDescription>
            </DialogHeader>
            <Form {...prescriptionForm}>
              <form onSubmit={prescriptionForm.handleSubmit(handlePrescriptionSubmit)} className="space-y-4">
                <FormField
                  control={prescriptionForm.control}
                  name="medicine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Atorvastatin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={prescriptionForm.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 20mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setPrescribeDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingPrescription ? 'Update' : 'Add'} Prescription</Button>
                </DialogFooter>
              </form>
            </Form>
        </DialogContent>
      </Dialog>
      
      {/* Lab Request Dialog */}
      <Dialog open={isLabRequestDialogOpen} onOpenChange={setLabRequestDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Send to Lab</DialogTitle>
                <DialogDescription>
                    Provide instructions for the lab technician for patient {patient.name}.
                </DialogDescription>
            </DialogHeader>
            <Form {...labRequestForm}>
              <form onSubmit={labRequestForm.handleSubmit(handleLabRequestSubmit)} className="space-y-4">
                 <FormField
                  control={labRequestForm.control}
                  name="test"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Complete Blood Count (CBC)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={labRequestForm.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lab Instructions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Please perform a Complete Blood Count (CBC) and a lipid panel." {...field} rows={4}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setLabRequestDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Send Request</Button>
                </DialogFooter>
              </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>

    {/* Review Suggestion Dialog */}
    {reviewingSuggestion && (
        <ReviewSuggestionDialog
            isOpen={!!reviewingSuggestion}
            onClose={() => setReviewingSuggestion(null)}
            prescription={reviewingSuggestion}
            onAccept={handleAcceptSuggestion}
            onReject={handleRejectSuggestion}
        />
    )}

    {/* Visit Details Dialog */}
    {selectedVisit && patient && (
        <VisitDetailsDialog
            isOpen={!!selectedVisit}
            onClose={() => setSelectedVisit(null)}
            visit={selectedVisit}
            patient={patient}
            role="doctor"
        />
    )}
     {patient && (
        <ScheduleFollowUpDialog
            isOpen={isFollowUpOpen}
            onClose={() => setFollowUpOpen(false)}
            patientName={patient.name}
            onSchedule={handleScheduleFollowUp}
            suggestion={aiSuggestions?.followUpSuggestion}
        />
    )}
     {patient && (
        <EditSummaryDialog
            isOpen={isEditSummaryOpen}
            onClose={() => setEditSummaryOpen(false)}
            patient={patient}
            onSave={handleSaveSummary}
        />
    )}
    {patient && (
        <RecordDeathDialog
            isOpen={isRecordDeathOpen}
            onClose={() => setRecordDeathOpen(false)}
            patientName={patient.name}
            onConfirm={handleConfirmDeceased}
        />
    )}
     {patient && (
        <ReferPatientDialog
            isOpen={isReferPatientOpen}
            onClose={() => setReferPatientOpen(false)}
            patient={patient}
            onConfirm={handleConfirmReferral}
        />
    )}
    </>
  );
}
