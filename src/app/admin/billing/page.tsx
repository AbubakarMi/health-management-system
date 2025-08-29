
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { InvoiceDetailsDialog } from "@/components/invoice-details-dialog";
import { useToast } from "@/hooks/use-toast";
import { initialInvoices, Invoice } from "@/lib/constants";
import { PlusCircle, Download, MoreHorizontal, Calendar as CalendarIcon, Trash2, CheckCircle, Clock, FileWarning } from "lucide-react";
import { format, getYear, getMonth } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { FinancialOverviewChart } from "@/components/charts/financial-overview-chart";
import { NairaIcon } from "@/components/ui/naira-icon";


export default function Page() {
    const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
    const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const { toast } = useToast();

    const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
    const [filterMonth, setFilterMonth] = useState<string>("all");
    const [filterYear, setFilterYear] = useState<string>("all");
    
    const years = useMemo(() => {
        const allYears = initialInvoices.map(inv => getYear(new Date(inv.dueDate)));
        return [...new Set(allYears)].sort((a, b) => b - a).map(String);
    }, [invoices]);
    
    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.dueDate);
            if (filterDate && format(invoiceDate, 'yyyy-MM-dd') !== format(filterDate, 'yyyy-MM-dd')) {
                return false;
            }
            if (filterMonth !== 'all' && getMonth(invoiceDate) !== parseInt(filterMonth)) {
                return false;
            }
            if (filterYear !== 'all' && getYear(invoiceDate) !== parseInt(filterYear)) {
                return false;
            }
            return true;
        });
    }, [invoices, filterDate, filterMonth, filterYear]);

    const handleExport = () => {
        if (filteredInvoices.length === 0) {
            toast({
                variant: "destructive",
                title: "No Data to Export",
                description: "There are no invoices matching the current filters."
            });
            return;
        }

        const headers = ['Invoice ID', 'Patient Name', 'Amount', 'Due Date', 'Status'];
        const csvHeader = headers.join(',') + '\n';
        const csvBody = filteredInvoices.map(inv => 
            [inv.id, inv.patientName, inv.amount, inv.dueDate, inv.status].join(',')
        ).join('\n');
        const csvContent = csvHeader + csvBody;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `billing_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
            title: "Export Successful",
            description: "Your billing data has been downloaded as a CSV file."
        });
    }

    const handleStatusChange = (invoiceId: string, status: Invoice['status']) => {
        const updatedInvoices = invoices.map(inv => 
            inv.id === invoiceId ? { ...inv, status } : inv
        );
        setInvoices(updatedInvoices);
        toast({
            title: "Status Updated",
            description: `Invoice ${invoiceId} marked as ${status}.`
        });
    };

    const handleDelete = (invoiceId: string) => {
        const updatedInvoices = invoices.filter(inv => inv.id !== invoiceId);
        setInvoices(updatedInvoices);
        // Also update the mock source
        const index = initialInvoices.findIndex(inv => inv.id === invoiceId);
        if (index > -1) initialInvoices.splice(index, 1);
        toast({
            title: "Invoice Deleted",
            description: `Invoice ${invoiceId} has been removed.`,
            variant: "destructive"
        });
    };

    const handleViewDetails = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setDetailsDialogOpen(true);
    }

    const kpiData = useMemo(() => {
        const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
        const totalPaid = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
        const outstandingAmount = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
        const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue').length;
        return { totalBilled, totalPaid, outstandingAmount, overdueInvoices };
    }, [invoices]);

    return (
        <>
            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
                            <NairaIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₦{kpiData.totalBilled.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₦{kpiData.totalPaid.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₦{kpiData.outstandingAmount.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                            <FileWarning className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpiData.overdueInvoices}</div>
                        </CardContent>
                    </Card>
                </div>
                
                 <div className="grid gap-6 md:grid-cols-5">
                    <div className="md:col-span-3">
                         <FinancialOverviewChart />
                    </div>
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>A log of recent billing activities.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm text-muted-foreground">No recent activity to show.</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <CardTitle>All Invoices</CardTitle>
                                <CardDescription>Create, view, and manage all patient invoices.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto">
                                   <Download className="mr-2 h-4 w-4" />
                                   Export
                               </Button>
                               <Button asChild className="w-full sm:w-auto">
                                   <Link href="/admin/billing/create">
                                       <PlusCircle className="mr-2 h-4 w-4" />
                                       New Invoice
                                   </Link>
                               </Button>
                            </div>
                        </div>
                         <div className="mt-4 flex flex-col sm:flex-row items-stretch md:items-center gap-2">
                             <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className="w-full sm:w-[200px] justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filterDate ? format(filterDate, "PPP") : <span>Filter by date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={filterDate}
                                    onSelect={setFilterDate}
                                    initialFocus
                                  />
                                </PopoverContent>
                             </Popover>
                             <Select value={filterMonth} onValueChange={setFilterMonth}>
                                 <SelectTrigger className="w-full sm:w-[150px]">
                                     <SelectValue placeholder="Filter by month" />
                                 </SelectTrigger>
                                 <SelectContent>
                                     <SelectItem value="all">All Months</SelectItem>
                                     {Array.from({length: 12}).map((_, i) => (
                                         <SelectItem key={i} value={String(i)}>{format(new Date(0, i), 'MMMM')}</SelectItem>
                                     ))}
                                 </SelectContent>
                             </Select>
                             <Select value={filterYear} onValueChange={setFilterYear}>
                                 <SelectTrigger className="w-full sm:w-[120px]">
                                     <SelectValue placeholder="Filter by year" />
                                 </SelectTrigger>
                                 <SelectContent>
                                     <SelectItem value="all">All Years</SelectItem>
                                     {years.map(year => (
                                         <SelectItem key={year} value={year}>{year}</SelectItem>
                                     ))}
                                 </SelectContent>
                             </Select>
                         </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice ID</TableHead>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInvoices.map((invoice) => (
                                        <TableRow key={invoice.id} onClick={() => handleViewDetails(invoice)} className="cursor-pointer">
                                            <TableCell className="font-medium">{invoice.id}</TableCell>
                                            <TableCell>{invoice.patientName}</TableCell>
                                            <TableCell>₦{invoice.amount.toFixed(2)}</TableCell>
                                            <TableCell>{invoice.dueDate}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    invoice.status === 'Pending' ? 'secondary' : invoice.status === 'Overdue' ? 'destructive' : 'default'
                                                } className={invoice.status === 'Paid' ? 'bg-green-500' : ''}>{invoice.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenuItem onClick={() => handleViewDetails(invoice)}>View Details</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'Paid')}>Mark as Paid</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'Pending')}>Mark as Pending</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'Overdue')}>Mark as Overdue</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                              <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive hover:bg-destructive/10 w-full text-left">
                                                                  <Trash2 className="mr-2 h-4 w-4" />
                                                                  <span>Delete</span>
                                                              </button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                              <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                  This action cannot be undone. This will permanently delete the invoice {invoice.id}.
                                                                </AlertDialogDescription>
                                                              </AlertDialogHeader>
                                                              <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(invoice.id)} className="bg-destructive hover:bg-destructive/90">
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
            
            {selectedInvoice && (
                <InvoiceDetailsDialog
                    isOpen={isDetailsDialogOpen}
                    onClose={() => setDetailsDialogOpen(false)}
                    invoice={selectedInvoice}
                />
            )}
        </>
    )
}
