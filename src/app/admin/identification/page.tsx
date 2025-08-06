
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, ScanFace, UserSearch, User, ArrowRight, Fingerprint } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { identifyPatient } from "@/ai/flows/identify-patient";
import { detailedPatients, Patient } from "@/lib/constants";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function IdentificationPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [result, setResult] = useState<{ matchFound: boolean; patientId?: string } | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        const getCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setHasCameraPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                    variant: 'destructive',
                    title: 'Camera Access Denied',
                    description: 'Please enable camera permissions in your browser settings to use this feature.',
                });
            }
        };

        getCameraPermission();

        return () => {
             if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [toast]);
    
    const handleScanFace = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        setIsLoading(true);
        setResult(null);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const photoDataUri = canvas.toDataURL('image/jpeg');
        
        try {
            const patientDatabase = detailedPatients.map(p => ({
                id: p.id,
                name: p.name,
                avatarUrl: p.avatarUrl || ''
            }));

            const identificationResult = await identifyPatient({ photoDataUri, patientDatabase });
            setResult(identificationResult);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Scan Failed", description: "An unexpected error occurred during the scan." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleScanFingerprint = () => {
        setIsLoading(true);
        setResult(null);

        // Simulate scanning and finding a match
        setTimeout(() => {
            const patientsWithFingerprints = detailedPatients.filter(p => p.fingerprintId);
            if (patientsWithFingerprints.length > 0) {
                // Pick a random patient with a fingerprint to simulate a match
                const randomPatient = patientsWithFingerprints[Math.floor(Math.random() * patientsWithFingerprints.length)];
                setResult({ matchFound: true, patientId: randomPatient.id });
            } else {
                setResult({ matchFound: false });
            }
            setIsLoading(false);
        }, 2000);
    };
    
    const matchedPatient = result?.matchFound ? detailedPatients.find(p => p.id === result.patientId) : null;

    const renderResult = () => {
        if (!result) return null;
        return (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Scan Result</CardTitle>
                </CardHeader>
                <CardContent>
                   {matchedPatient ? (
                       <div className="flex flex-col sm:flex-row items-center gap-4">
                           <Avatar className="w-24 h-24 border-2 border-green-500">
                               <AvatarImage src={matchedPatient.avatarUrl} alt={matchedPatient.name} data-ai-hint="person" />
                               <AvatarFallback>{matchedPatient.name.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <div className="text-center sm:text-left">
                               <p className="text-sm text-green-600 font-semibold">Match Found</p>
                               <h3 className="text-xl font-bold">{matchedPatient.name}</h3>
                               <p className="text-muted-foreground">ID: {matchedPatient.id}</p>
                               <Button asChild className="mt-3" size="sm">
                                   <Link href={`/admin/patients/${matchedPatient.id}`}>
                                       View Full Record <ArrowRight className="ml-2 h-4 w-4"/>
                                   </Link>
                               </Button>
                           </div>
                       </div>
                   ) : (
                       <Alert>
                            <UserSearch className="h-4 w-4" />
                            <AlertTitle>No Match Found</AlertTitle>
                            <AlertDescription>
                                This person does not appear to be in the patient database. You can create a new patient record.
                                <Button asChild className="mt-3" variant="outline">
                                   <Link href="/admin/patients/create">
                                       <User className="mr-2 h-4 w-4" /> Create New Patient
                                   </Link>
                               </Button>
                            </AlertDescription>
                        </Alert>
                   )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <ScanFace className="w-6 h-6" />
                    <div>
                        <CardTitle>Patient Identification</CardTitle>
                        <CardDescription>Select a method to identify a patient and find their record.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <Tabs defaultValue="face" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="face"><ScanFace className="mr-2 h-4 w-4"/> Facial Scan</TabsTrigger>
                        <TabsTrigger value="fingerprint"><Fingerprint className="mr-2 h-4 w-4"/> Fingerprint Scan</TabsTrigger>
                    </TabsList>
                    <TabsContent value="face" className="mt-6">
                        <div className="aspect-video w-full rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                           {hasCameraPermission === false ? (
                                <div className="text-center text-muted-foreground p-4">
                                    <Camera className="mx-auto h-12 w-12 mb-2"/>
                                    <p className="font-semibold">Camera access is required</p>
                                    <p className="text-sm">Please allow camera permissions in your browser.</p>
                                </div>
                            ) : (
                               <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            )}
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                        <Button onClick={handleScanFace} disabled={isLoading || !hasCameraPermission} className="w-full mt-4">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                            {isLoading ? 'Scanning...' : 'Scan Face'}
                        </Button>
                    </TabsContent>
                    <TabsContent value="fingerprint" className="mt-6">
                        <div className="aspect-video w-full rounded-md border bg-muted flex flex-col items-center justify-center overflow-hidden">
                             <Fingerprint className="w-24 h-24 text-muted-foreground/50" />
                             <p className="mt-4 text-muted-foreground">Ready for fingerprint scan</p>
                        </div>
                        <Button onClick={handleScanFingerprint} disabled={isLoading} className="w-full mt-4">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Fingerprint className="mr-2 h-4 w-4" />}
                            {isLoading ? 'Scanning...' : 'Start Scan'}
                        </Button>
                    </TabsContent>
                </Tabs>
                
                {renderResult()}
            </CardContent>
        </Card>
    )
}
    
