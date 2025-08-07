
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { autopsyManager, AutopsyCase, users } from "@/lib/constants";
import { Microscope, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const newCaseSchema = z.object({
  deceasedName: z.string().min(3, "Name is required."),
  assignedDoctor: z.string().min(1, "A pathologist must be assigned."),
});
type NewCaseFormData = z.infer<typeof newCaseSchema>;

export default function AutopsyPage() {
    const [cases, setCases] = useState<AutopsyCase[]>([]);
    const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    
    const pathologists = users.filter(u => u.role === 'doctor');

    useEffect(() => {
        const handleUpdate = (updatedCases: AutopsyCase[]) => setCases([...updatedCases]);
        handleUpdate(autopsyManager.getCases());
        const unsubscribe = autopsyManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, []);

    const form = useForm<NewCaseFormData>({
        resolver: zodResolver(newCaseSchema),
        defaultValues: { deceasedName: "", assignedDoctor: "" },
    });

    const handleRegisterCase = (values: NewCaseFormData) => {
        autopsyManager.registerCase(values);
        toast({ title: "Case Registered", description: `Autopsy case for ${values.deceasedName} has been created.` });
        setRegisterDialogOpen(false);
        form.reset();
    };

    const handleRowClick = (caseId: string) => {
        router.push(`/admin/autopsy/${caseId}`);
    }
    
    const getStatusVariant = (status: AutopsyCase['status']) => {
        switch (status) {
            case 'Completed': return 'default';
            case 'Report Pending': return 'secondary';
            case 'Awaiting Autopsy':
            default: return 'destructive';
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Microscope className="w-6 h-6"/>
                            <div>
                                <CardTitle>Autopsy Case Management</CardTitle>
                                <CardDescription>Register and track external autopsy requests.</CardDescription>
                            </div>
                        </div>
                        <Button onClick={() => setRegisterDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Register New Case
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Case ID</TableHead>
                                <TableHead>Deceased's Name</TableHead>
                                <TableHead>Date Registered</TableHead>
                                <TableHead>Assigned Pathologist</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cases.map((caseItem) => (
                                <TableRow key={caseItem.id} onClick={() => handleRowClick(caseItem.id)} className="cursor-pointer">
                                    <TableCell className="font-medium">{caseItem.id}</TableCell>
                                    <TableCell>{caseItem.deceasedName}</TableCell>
                                    <TableCell>{caseItem.dateRegistered}</TableCell>
                                    <TableCell>{caseItem.assignedDoctor}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(caseItem.status)} className={caseItem.status === 'Completed' ? 'bg-green-500' : ''}>
                                            {caseItem.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {cases.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            <p>No autopsy cases have been registered.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Register Case Dialog */}
            <Dialog open={isRegisterDialogOpen} onOpenChange={setRegisterDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Register New Autopsy Case</DialogTitle>
                        <DialogDescription>
                            Enter the details for the deceased individual and assign a pathologist.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRegisterCase)} className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="deceasedName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name of Deceased</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="assignedDoctor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assign Pathologist</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a doctor" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {pathologists.map(doc => (
                                                    <SelectItem key={doc.email} value={doc.name}>
                                                        {doc.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setRegisterDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Register Case</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
