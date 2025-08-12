
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

const UserPlusSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary drop-shadow-lg">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" x2="19" y1="8" y2="14"/>
        <line x1="22" x2="16" y1="11" y2="11"/>
    </svg>
);

export default function CreatePatientComingSoonPage() {
  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/admin/patients"><ArrowLeft /></Link>
            </Button>
            <h1 className="text-2xl font-bold">Create New Patient Record</h1>
        </div>
        <Card className="overflow-hidden">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <UserPlus className="w-6 h-6" />
                    <div>
                        <CardTitle>New Patient Registration</CardTitle>
                        <CardDescription>The patient registration module is being updated.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[50vh] bg-muted/30 relative p-8">
                <div className="animate-pulse">
                    <UserPlusSvg />
                </div>
                <div className="z-10 text-center bg-background/80 p-6 rounded-lg shadow-lg backdrop-blur-sm mt-8">
                    <h2 className="text-2xl font-bold font-headline text-primary">Coming Soon!</h2>
                    <p className="text-muted-foreground mt-2">
                        This feature is currently under development and will be available shortly.
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
