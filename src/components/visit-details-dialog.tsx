
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import { MedicalHistoryEntry, Patient, patientManager, Role } from "@/lib/constants";
import { Badge } from "./ui/badge";
import { FileText, Pill, TestTube2, Edit, Download } from "lucide-react";
import { format } from 'date-fns';
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { EditNotesDialog } from "./edit-notes-dialog";
import { generateDeathCertificatePdf } from "@/lib/death-certificate-generator";
import { generateReferralLetterPdf } from "@/lib/referral-letter-generator";

interface VisitDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  visit: MedicalHistoryEntry;
  patient: Patient;
  role: Role;
}

export function VisitDetailsDialog({ isOpen, onClose, visit, patient, role }: VisitDetailsDialogProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const { toast } = useToast();

  if (!visit) return null;

  const visitPrescriptions = patient.prescriptions.filter(p => p.visitId === visit.id);
  const visitLabTests = patient.labTests.filter(t => t.visitId === visit.id);
  
  const handleSaveNotes = (newDetails: string) => {
    patientManager.updateVisitDetails(patient.id, visit.id, newDetails);
    toast({ title: "Notes Updated", description: "The visit notes have been successfully saved." });
    setIsEditingNotes(false);
  }

  const isDeathReport = visit.event.toLowerCase().includes('deceased');
  const isReferral = visit.event.toLowerCase().includes('referral');

  const handlePrintCertificate = () => {
    generateDeathCertificatePdf(patient, visit);
  }
  
  const handlePrintReferral = () => {
    generateReferralLetterPdf(patient, visit);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Visit Details</DialogTitle>
            <DialogDescription>
              A summary of the visit on {format(new Date(visit.date), "PPP")} with {visit.doctor}.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-6">
              <div className="space-y-6 mt-4">
                  <section>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/>
                            {isDeathReport ? 'Official Death Report' : isReferral ? 'Referral Letter' : "Doctor's Notes"}
                        </h3>
                        {role === 'doctor' && !isDeathReport && !isReferral && (
                            <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(true)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Notes
                            </Button>
                        )}
                      </div>
                      <div className="p-4 border rounded-md bg-muted/50">
                          <p className="font-semibold">{visit.event}</p>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{visit.details}</p>
                      </div>
                  </section>

                  {visitPrescriptions.length > 0 && (
                       <section>
                          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Pill className="w-5 h-5 text-primary"/>Prescriptions Issued</h3>
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Medicine</TableHead>
                                      <TableHead>Dosage</TableHead>
                                      <TableHead>Status</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {visitPrescriptions.map((p) => (
                                      <TableRow key={p.id}>
                                          <TableCell>{p.medicine}</TableCell>
                                          <TableCell>{p.dosage}</TableCell>
                                          <TableCell>
                                              <Badge variant={p.status === 'Pending' ? 'secondary' : p.status === 'Unavailable' ? 'destructive' : 'default'} className={p.status === 'Filled' ? 'bg-green-500' : ''}>{p.status}</Badge>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </section>
                  )}

                   {visitLabTests.length > 0 && (
                       <section>
                          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><TestTube2 className="w-5 h-5 text-primary"/>Lab Tests Ordered</h3>
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Test Name</TableHead>
                                      <TableHead>Status</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {visitLabTests.map((t) => (
                                      <TableRow key={t.id}>
                                          <TableCell>{t.test}</TableCell>
                                          <TableCell>
                                              <Badge variant={t.status === 'Pending' ? 'destructive' : t.status === 'Processing' ? 'secondary' : 'default'} className={t.status === 'Completed' ? 'bg-green-500' : ''}>{t.status}</Badge>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </section>
                  )}
              </div>
          </ScrollArea>
          <DialogFooter className="pt-4 justify-between">
            <div>
                 {isDeathReport && (
                    <Button variant="ghost" onClick={handlePrintCertificate}>
                        <Download className="mr-2 h-4 w-4" /> Print Death Certificate
                    </Button>
                )}
                 {isReferral && (
                    <Button variant="ghost" onClick={handlePrintReferral}>
                        <Download className="mr-2 h-4 w-4" /> Print Referral Letter
                    </Button>
                )}
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <EditNotesDialog
        isOpen={isEditingNotes}
        onClose={() => setIsEditingNotes(false)}
        visitDetails={visit.details}
        onSave={handleSaveNotes}
      />
    </>
  );
}
