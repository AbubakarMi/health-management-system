
"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { detailedPatients } from "@/lib/constants";
import { Send } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Referral = {
    patientId: string;
    patientName: string;
    patientAvatar?: string;
    referralDate: string;
    referredTo: string;
    referringDoctor: string;
};

export default function ReferralsPage() {
    const router = useRouter();

    const allReferrals = useMemo(() => {
        const referrals: Referral[] = [];
        detailedPatients.forEach(patient => {
            patient.medicalHistory.forEach(entry => {
                if (entry.event.toLowerCase().includes('referral')) {
                    const referredToMatch = entry.event.match(/to (.*)/);
                    const referredTo = referredToMatch ? referredToMatch[1] : 'N/A';
                    
                    referrals.push({
                        patientId: patient.id,
                        patientName: patient.name,
                        patientAvatar: patient.avatarUrl,
                        referralDate: entry.date,
                        referredTo: referredTo,
                        referringDoctor: entry.doctor,
                    });
                }
            });
        });
        return referrals.sort((a, b) => new Date(b.referralDate).getTime() - new Date(a.referralDate).getTime());
    }, []);
    
    const handleRowClick = (patientId: string) => {
        router.push(`/admin/patients/${patientId}`);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Send className="w-6 h-6" />
                    <div>
                        <CardTitle>Patient Referrals</CardTitle>
                        <CardDescription>A log of all patients referred to external specialists or hospitals.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Referred To</TableHead>
                            <TableHead>Referral Date</TableHead>
                            <TableHead>Referring Doctor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allReferrals.length > 0 ? allReferrals.map((referral) => (
                            <TableRow key={`${referral.patientId}-${referral.referralDate}`} onClick={() => handleRowClick(referral.patientId)} className="cursor-pointer">
                                <TableCell className="font-medium flex items-center gap-3">
                                     <Avatar>
                                        <AvatarImage src={referral.patientAvatar} alt={referral.patientName} data-ai-hint="person" />
                                        <AvatarFallback>{referral.patientName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {referral.patientName}
                                </TableCell>
                                <TableCell>{referral.referredTo}</TableCell>
                                <TableCell>{format(parseISO(referral.referralDate), 'PPP')}</TableCell>
                                <TableCell>{referral.referringDoctor}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No patient referrals have been recorded.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
