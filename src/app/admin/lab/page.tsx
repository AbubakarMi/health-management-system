
"use client";

import { useState, useEffect } from "react";
import { LabVisitsChart } from "@/components/charts/lab-visits-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { labTestManager, LabTest } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Check, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function Page() {
    const [labTests, setLabTests] = useState<LabTest[]>([]);
    const [editingTest, setEditingTest] = useState<LabTest | null>(null);
    const [results, setResults] = useState("");
    const [price, setPrice] = useState<number>(0);
    const { toast } = useToast();

    useEffect(() => {
        const handleUpdate = (updatedTests: LabTest[]) => {
            setLabTests([...updatedTests]);
        };
        handleUpdate(labTestManager.getLabTests());
        const unsubscribe = labTestManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, []);

    const handleStatusChange = (id: string, status: LabTest['status']) => {
        labTestManager.updateLabTest(id, { status });
        toast({ title: "Status Updated", description: `Test ${id} marked as ${status}.` });
    };

    const handleStartEditing = (test: LabTest) => {
        setEditingTest(test);
        setResults(test.results || "");
        setPrice(test.price || 0);
    };

    const handleCancelEditing = () => {
        setEditingTest(null);
        setResults("");
        setPrice(0);
    };

    const handleSaveResults = () => {
        if (!editingTest) return;

        if (!results.trim()) {
            toast({ variant: "destructive", title: "Missing Results", description: "Please enter the test results before saving." });
            return;
        }
        if (price <= 0) {
            toast({ variant: "destructive", title: "Invalid Price", description: "Please enter a valid price for the test." });
            return;
        }

        labTestManager.updateLabTest(editingTest.id, { 
            status: 'Completed', 
            results,
            price
        });
        toast({ title: "Results Saved", description: `Results for test ${editingTest.id} have been saved.` });
        handleCancelEditing();
    };

    return (
        <>
            <div className="space-y-6">
                <LabVisitsChart />
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Patient Tests</CardTitle>
                        <CardDescription>View, update status, and record results for all lab tests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Test / Instructions</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Price (₦)</TableHead>
                                    <TableHead>Results</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {labTests.map((test) => (
                                    <TableRow key={test.id}>
                                        <TableCell className="font-medium">{test.patient}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{test.test}</div>
                                            <div className="text-xs text-muted-foreground">{test.instructions}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                test.status === 'Pending' ? 'destructive' : test.status === 'Processing' ? 'secondary' : 'default'
                                            } className={test.status === 'Completed' ? 'bg-green-500' : ''}>{test.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            ₦{test.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="min-w-[200px]">
                                             <p className="text-sm text-muted-foreground">{test.results || "No results yet."}</p>
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
                                                    <DropdownMenuItem onClick={() => handleStartEditing(test)}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>{test.results ? "Edit" : "Add"} Results & Price</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleStatusChange(test.id, 'Processing')}>Mark as Processing</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(test.id, 'Pending')}>Mark as Pending</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            <Dialog open={!!editingTest} onOpenChange={(isOpen) => !isOpen && handleCancelEditing()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Test Results & Price</DialogTitle>
                        <DialogDescription>
                            Enter the results for "{editingTest?.test}" for {editingTest?.patient}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                         <div className="space-y-2">
                            <Label htmlFor="results">Test Results</Label>
                            <Textarea 
                                id="results"
                                value={results}
                                onChange={(e) => setResults(e.target.value)}
                                placeholder="Enter test results..."
                                rows={6}
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="price">Price (₦)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                placeholder="Enter the price for this test"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={handleCancelEditing}>Cancel</Button>
                        <Button type="submit" onClick={handleSaveResults}>Save Results</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
