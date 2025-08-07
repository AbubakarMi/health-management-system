
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { autopsyManager, AutopsyCase } from "@/lib/constants";
import { ArrowLeft, FileText, Download, Edit, Sparkles, Loader2, Microscope } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { generateAutopsyReport } from "@/ai/flows/generate-autopsy-report";
import { generateAutopsyReportPdf } from "@/lib/autopsy-report-generator";

export default function AutopsyDetailPage() {
    const params = useParams();
    const caseId = params.id as string;
    const router = useRouter();
    const { toast } = useToast();

    const [caseDetails, setCaseDetails] = useState<AutopsyCase | null>(null);
    const [pathologistNotes, setPathologistNotes] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const handleUpdate = () => {
            const foundCase = autopsyManager.getCaseById(caseId);
            setCaseDetails(foundCase || null);
            if (foundCase) {
                setPathologistNotes(foundCase.pathologistNotes || "");
            }
        };
        handleUpdate();
        const unsubscribe = autopsyManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, [caseId]);

    const handleGenerateReport = async () => {
        if (!pathologistNotes.trim()) {
            toast({ variant: "destructive", title: "Missing Notes", description: "Please enter pathologist findings before generating a report." });
            return;
        }
        setIsGenerating(true);
        try {
            const result = await generateAutopsyReport({
                pathologistNotes,
                deceasedName: caseDetails!.deceasedName,
            });
            autopsyManager.addReport(caseId, result.formalReport, pathologistNotes);
            toast({ title: "Report Generated", description: "The formal autopsy report has been successfully generated and saved." });
        } catch (error) {
            console.error("AI report generation failed:", error);
            toast({ variant: "destructive", title: "AI Error", description: "Could not generate the report at this time." });
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrintReport = () => {
        if (caseDetails && caseDetails.report) {
            generateAutopsyReportPdf(caseDetails);
        } else {
            toast({ variant: "destructive", title: "No Report", description: "A final report must be generated before it can be printed." });
        }
    }
    
    const getStatusVariant = (status: AutopsyCase['status']) => {
        switch (status) {
            case 'Completed': return 'default';
            case 'Report Pending': return 'secondary';
            case 'Awaiting Autopsy':
            default: return 'destructive';
        }
    }

    if (!caseDetails) {
        return (
             <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Case Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The requested autopsy case could not be found.</p>
                        <Button asChild className="mt-4">
                            <Link href="/admin/autopsy">Return to Case List</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const canEdit = caseDetails.status !== 'Completed';

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/autopsy"><ArrowLeft /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Autopsy Case: {caseDetails.id}</h1>
                    <p className="text-muted-foreground">For {caseDetails.deceasedName}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Edit className="w-5 h-5"/> Pathologist Findings</CardTitle>
                            <CardDescription>Enter the brief clinical findings from the examination here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-2">
                                <Label htmlFor="pathologist-notes">Clinical Notes</Label>
                                <Textarea
                                    id="pathologist-notes"
                                    value={pathologistNotes}
                                    onChange={(e) => setPathologistNotes(e.target.value)}
                                    placeholder="e.g., Cause of death: Myocardial Infarction. Evidence of significant coronary artery disease..."
                                    rows={8}
                                    disabled={!canEdit}
                                />
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> Formal Report</CardTitle>
                            <CardDescription>This report is generated by AI based on the notes above.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="p-4 border rounded-md bg-muted/50 min-h-[200px] whitespace-pre-wrap text-sm">
                                {caseDetails.report || "No formal report has been generated yet."}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card className="sticky top-20">
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Microscope className="w-5 h-5"/>Case Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-1">
                                <p className="text-sm font-medium">Status</p>
                                <Badge variant={getStatusVariant(caseDetails.status)} className={caseDetails.status === 'Completed' ? 'bg-green-500' : ''}>
                                    {caseDetails.status}
                                </Badge>
                            </div>
                             <div className="space-y-1">
                                <p className="text-sm font-medium">Assigned Pathologist</p>
                                <p className="text-muted-foreground">{caseDetails.assignedDoctor}</p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-sm font-medium">Date Registered</p>
                                <p className="text-muted-foreground">{caseDetails.dateRegistered}</p>
                            </div>
                            <Separator />
                             <Button onClick={handleGenerateReport} disabled={isGenerating || !canEdit} className="w-full">
                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                {isGenerating ? "Generating..." : "AI Generate Full Report"}
                            </Button>
                            <Button onClick={handlePrintReport} disabled={!caseDetails.report} variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Print Report as PDF
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
