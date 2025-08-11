
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { patientManager, Patient } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BedDouble } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DoctorAdmissionsPage() {
  const [patients, setPatients] = useState(patientManager.getPatients());
  const { toast } = useToast();

  useEffect(() => {
    const handleUpdate = () => {
        setPatients([...patientManager.getPatients()]);
    };
    const unsubscribe = patientManager.subscribe(handleUpdate);
    return () => unsubscribe();
  }, []);

  const handleConditionChange = (patientId: string, condition: string) => {
    patientManager.updatePatientCondition(patientId, condition);
    toast({
        title: "Patient Condition Updated",
        description: `The patient's condition has been set to ${condition}.`
    });
  };
  
  const getBadgeVariant = (condition: string): "destructive" | "secondary" | "default" => {
    switch (condition) {
        case 'Critical': return 'destructive';
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
        default: return '';
    }
  }

  const myAdmittedPatients = useMemo(() => {
    // For this prototype, we'll assume the logged-in doctor is "Dr. Aisha Bello"
    return patients.filter(p => p.assignedDoctor === 'Dr. Aisha Bello' && p.admission.isAdmitted);
  }, [patients]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <BedDouble className="w-6 h-6"/>
            <div>
                <CardTitle>My Admitted Patients</CardTitle>
                <CardDescription>A list of your patients currently admitted to the hospital.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Room/Bed</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myAdmittedPatients.length > 0 ? myAdmittedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">
                    <Link href={`/doctor/patients/${patient.id}`} className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person" />
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {patient.name}
                    </Link>
                </TableCell>
                <TableCell>
                    {patient.admission.roomNumber ? 
                        <Badge>Room {patient.admission.roomNumber} - Bed {patient.admission.bedNumber}</Badge> : 
                        <Badge variant="secondary">Awaiting</Badge>
                    }
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Badge variant={getBadgeVariant(patient.condition)} className={`${getBadgeClass(patient.condition)} cursor-pointer`}>
                          {patient.condition}
                       </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleConditionChange(patient.id, 'Critical')}>Critical</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleConditionChange(patient.id, 'Improving')}>Improving</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleConditionChange(patient.id, 'Stable')}>Stable</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleConditionChange(patient.id, 'Normal')}>Normal</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                     <Link href={`/doctor/patients/${patient.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                     </Link>
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  You have no patients currently admitted.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
