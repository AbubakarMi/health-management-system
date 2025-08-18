
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { detailedPatients, Patient, Prescription, prescriptionManager, labTestManager, MedicalHistoryEntry, patientManager } from "@/lib/constants";
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Pill, MoreHorizontal, Edit, Trash2, FlaskConical, Stethoscope, Microscope, TestTube2, VenetianMask, Fingerprint, History, CalendarPlus, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineTitle, TimelineContent, TimelineTime } from '@/components/ui/timeline';
import { VisitDetailsDialog } from '@/components/visit-details-dialog';
import { CreateVisitDialog } from '@/components/create-visit-dialog';
import { generatePatientCard } from '@/lib/patient-card-generator';


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
  const [selectedVisit, setSelectedVisit] = useState<MedicalHistoryEntry | null>(null);
  const [isCreateVisitOpen, setCreateVisitOpen] = useState(false);
  
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
    // Deep copy to ensure re-render on nested changes
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
  
  
  const openAddDialog = () => {
    setEditingPrescription(null);
    setPrescribeDialogOpen(true);
  };
  
  const openEditDialog = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setPrescribeDialogOpen(true);
  }

  const handlePrintCard = () => {
    if (patient) {
      generatePatientCard(patient);
      toast({
        title: "Patient ID Card Generated",
        description: `ID card for ${patient.name} has been downloaded.`,
      });
    }
  };

  const handlePrescriptionSubmit = (values: PrescriptionFormData) => {
    if (!patient) return;
    
    if (editingPrescription) {
      // Update existing prescription
      prescriptionManager.updatePrescription({
        ...editingPrescription,
        medicine: values.medicine,
        dosage: values.dosage,
      });
    } else {
        // Add new prescription
        prescriptionManager.addPrescription({
            patientName: patient.name,
            medicine: values.medicine,
            dosage: values.dosage,
            doctor: "Admin", // Admin can prescribe in this context
            status: "Pending"
        });
    }
    setPrescribeDialogOpen(false);
    setEditingPrescription(null);
    prescriptionForm.reset();
  };
  
  const handleDeletePrescription = (prescriptionId: string) => {
    if (!patient) return;
    prescriptionManager.deletePrescription(patient.id, prescriptionId);
  }
  
  const handleLabRequestSubmit = (values: LabRequestFormData) => {
    if (!patient) return;
    labTestManager.addLabTest({ 
        patient: patient.name, 
        test: values.test,
        instructions: values.instructions,
        doctor: 'Admin' 
    });
    setLabRequestDialogOpen(false);
    labRequestForm.reset();
    toast({
        title: "Lab Request Sent",
        description: `Instructions for ${patient?.name} have been sent to the lab.`
    });
  }
  
   const handleCreateVisit = (data: { event: string; details: string }) => {
    if (!patient) return;
    patientManager.createVisit(patient.id, data.event, data.details, 'Admin');
    toast({
      title: "Visit Created",
      description: `A new visit has been scheduled for ${patient.name}.`,
    });
    setCreateVisitOpen(false);
  };


   const getTimelineIcon = (event: string) => {
      const eventLower = event.toLowerCase();
      if (eventLower.includes("lab test ordered")) return <TestTube2 className="h-4 w-4" />;
      if (eventLower.includes("lab test results")) return <Microscope className="h-4 w-4" />;
      if (eventLower.includes("check-up") || eventLower.includes("admission") || eventLower.includes("follow-up") || eventLower.includes("diagnosis") || eventLower.includes("registration") || eventLower.includes("consultation")) return <Stethoscope className="h-4 w-4" />;
      if (eventLower.includes("prescription")) return <Pill className="h-4 w-4" />;
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="w-16 h-16 border">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person" />
              <AvatarFallback className="text-2xl">{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
                <CardTitle className="text-2xl md:text-3xl">{patient.name}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="font-mono bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">{patient.id}</span>
                    <Badge variant={patient.condition === 'Critical' ? 'destructive' : 'secondary'}>{patient.condition}</Badge>
                    <span className="flex items-center gap-1"><VenetianMask className="w-4 h-4 text-muted-foreground"/> {patient.gender}</span>
                    {patient.fingerprintId && (
                      <span className="flex items-center gap-1 text-green-600"><Fingerprint className="w-4 h-4"/> Biometrics Registered</span>
                    )}
                </CardDescription>
                <p className="text-sm text-muted-foreground pt-1">Last Visit: {patient.lastVisit}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handlePrintCard} className="whitespace-nowrap">
              <CreditCard className="mr-2 h-4 w-4" />
              Print ID Card
            </Button>
          </div>
        </CardHeader>
      </Card>
      
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
             <Card>
                <CardHeader>
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                     <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" /> Medical History</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setLabRequestDialogOpen(true)}><FlaskConical className="mr-2 h-4 w-4"/> Send to Lab</Button>
                        <Button onClick={() => setCreateVisitOpen(true)}><CalendarPlus className="mr-2 h-4 w-4"/> Create New Visit</Button>
                      </div>
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
                                    <p className="text-xs text-muted-foreground">Doctor: {entry.doctor}</p>
                                    <Button variant="link" size="sm" className="h-auto p-0 mt-2" onClick={() => setSelectedVisit(entry)}>
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
                 <Button size="sm" onClick={openAddDialog}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
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
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            p.status === 'Pending' ? 'secondary' : p.status === 'Unavailable' ? 'destructive' : 'default'
                                        } className={p.status === 'Filled' ? 'bg-green-500' : ''}>{p.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
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
    
    {selectedVisit && patient && (
        <VisitDetailsDialog
            isOpen={!!selectedVisit}
            onClose={() => setSelectedVisit(null)}
            visit={selectedVisit}
            patient={patient}
        />
    )}
     {patient && (
        <CreateVisitDialog
            isOpen={isCreateVisitOpen}
            onClose={() => setCreateVisitOpen(false)}
            patientName={patient.name}
            onVisitCreate={handleCreateVisit}
        />
    )}
    </>
  );
}
