
"use client";

import { CreatePatientDialog } from "@/components/create-patient-dialog";
import { useToast } from "@/hooks/use-toast";
import { detailedPatients as initialPatients, Patient } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";


export default function CreatePatientPage() {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

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

    useEffect(() => {
        // Open the dialog as soon as the component mounts
        setDialogOpen(true);
    }, []);

    const handleClose = () => {
        setDialogOpen(false);
        // Navigate back to the main patients list after a short delay
        setTimeout(() => router.push('/admin/patients'), 200);
    }

    const handlePatientSaved = (newPatient: Omit<Patient, 'id' | 'medicalHistory' | 'prescriptions' | 'lastVisit' | 'labTests' | 'bloodType' | 'admission'>) => {
        // Generate a random 3-character alphanumeric suffix
        const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();

        // Find the highest existing patient number to generate a new sequential one
        let maxNumber = 0;
        initialPatients.forEach(p => {
            const numPart = parseInt(p.id.split('-')[1]);
            if (numPart > maxNumber) {
                maxNumber = numPart;
            }
        });
        const newPatientNumber = maxNumber + 1;
        const paddedNumber = String(newPatientNumber).padStart(6, '0');

        const genderPrefix = newPatient.gender === 'Male' ? 'PM' : 'PF';
        const newId = `${genderPrefix}-${paddedNumber}-${suffix}`;

        const patientToAdd: Patient = {
            ...newPatient,
            id: newId,
            lastVisit: new Date().toISOString().split('T')[0],
            bloodType: 'O+',
             admission: { isAdmitted: false, admissionDate: null, dischargeDate: null, roomNumber: null, bedNumber: null },
            medicalHistory: [{
                id: `visit-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                event: "Patient Registration",
                details: `Patient registered with ID ${newId} and assigned to ${newPatient.assignedDoctor}.`,
                doctor: "Admin"
            }],
            prescriptions: [],
            labTests: []
        };
        
        initialPatients.unshift(patientToAdd);
        
        toast({
            title: "Patient Created",
            description: `${newPatient.name} has been successfully added with ID ${newId}.`
        });
        handleClose();
    };

    return (
        // This page is a proxy to show the dialog
        // You can add a loading state or a placeholder here if needed
        <>
            <div className="flex h-full items-center justify-center">
                <p>Loading Patient Creator...</p>
            </div>
            <CreatePatientDialog
                isOpen={isDialogOpen}
                onClose={handleClose}
                onPatientSaved={handlePatientSaved}
                importedData={importedData}
            />
        </>
    )
}
