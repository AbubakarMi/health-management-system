"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { initialInvoices } from "@/lib/constants";
import { 
  ArrowLeft, 
  CreditCard,
  DollarSign,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Receipt,
  Banknote,
  Wallet,
  Building,
  Calendar,
  User,
  Phone,
  Mail,
  FileCheck,
  Printer,
  Download,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  available: boolean;
}

interface PaymentForm {
  invoiceId: string;
  patientName: string;
  amount: string;
  paymentMethod: string;
  referenceNumber: string;
  notes: string;
  payerName: string;
  payerPhone: string;
  payerEmail: string;
}

export default function PaymentProcessingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processPaymentModal, setProcessPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    invoiceId: "",
    patientName: "",
    amount: "",
    paymentMethod: "",
    referenceNumber: "",
    notes: "",
    payerName: "",
    payerPhone: "",
    payerEmail: ""
  });
  const [processingPayment, setProcessingPayment] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    { id: "cash", name: "Cash Payment", icon: Banknote, available: true },
    { id: "card", name: "Debit/Credit Card", icon: CreditCard, available: true },
    { id: "transfer", name: "Bank Transfer", icon: Building, available: true },
    { id: "mobile", name: "Mobile Money", icon: Wallet, available: true },
    { id: "check", name: "Cheque", icon: FileCheck, available: true }
  ];

  const filteredInvoices = useMemo(() => {
    return initialInvoices.filter(invoice => {
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "unpaid" && (invoice.status === "Pending" || invoice.status === "Overdue")) ||
        invoice.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const paymentSummary = useMemo(() => {
    const unpaidInvoices = initialInvoices.filter(inv => inv.status !== 'Paid');
    const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const overdueCount = initialInvoices.filter(inv => inv.status === 'Overdue').length;
    const pendingCount = initialInvoices.filter(inv => inv.status === 'Pending').length;
    const paidToday = 8; // Mock data
    const totalCollected = 2450000; // Mock data

    return {
      unpaidInvoices: unpaidInvoices.length,
      totalUnpaid,
      overdueCount,
      pendingCount,
      paidToday,
      totalCollected
    };
  }, []);

  const handleInvoiceSelect = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      invoiceId: invoice.id,
      patientName: invoice.patientName,
      amount: invoice.amount.toString(),
      paymentMethod: "",
      referenceNumber: "",
      notes: "",
      payerName: invoice.patientName,
      payerPhone: "",
      payerEmail: ""
    });
    setProcessPaymentModal(true);
  };

  const processPayment = async () => {
    setProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would implement actual payment processing logic
    console.log("Processing payment:", paymentForm);
    
    setProcessingPayment(false);
    setProcessPaymentModal(false);
    
    // Reset form
    setPaymentForm({
      invoiceId: "",
      patientName: "",
      amount: "",
      paymentMethod: "",
      referenceNumber: "",
      notes: "",
      payerName: "",
      payerPhone: "",
      payerEmail: ""
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/finance" className="p-2 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold nubenta-gradient-text">Payment Processing</h1>
                <p className="text-muted-foreground">Process payments and manage transactions</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-orange-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unpaid Invoices</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentSummary.unpaidInvoices}</div>
            <p className="text-xs text-muted-foreground">₦{paymentSummary.totalUnpaid.toLocaleString()} total</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{paymentSummary.overdueCount}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paymentSummary.paidToday}</div>
            <p className="text-xs text-muted-foreground">₦{paymentSummary.totalCollected.toLocaleString()} collected</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Receipt className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{paymentSummary.pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-500" />
            Find Invoice
          </CardTitle>
          <CardDescription>Search for invoices to process payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search Invoice/Patient</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Invoice ID or patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Payment Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Invoices</SelectItem>
                  <SelectItem value="unpaid">Unpaid Only</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-cyan-500" />
            Outstanding Invoices
          </CardTitle>
          <CardDescription>Click on an invoice to process payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow 
                    key={invoice.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.patientName}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell className="font-semibold">₦{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          invoice.status === 'Paid' ? 'default' : 
                          invoice.status === 'Overdue' ? 'destructive' : 'secondary'
                        }
                        className={
                          invoice.status === 'Paid' ? 'bg-green-500 hover:bg-green-600' : ''
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invoice.status !== 'Paid' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleInvoiceSelect(invoice)}
                          className="bg-teal-500 hover:bg-teal-600"
                        >
                          <CreditCard className="w-4 h-4 mr-1" />
                          Process Payment
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Process Payment Modal */}
      <Dialog open={processPaymentModal} onOpenChange={setProcessPaymentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-500" />
              Process Payment
            </DialogTitle>
            <DialogDescription>
              Complete the payment details for invoice {paymentForm.invoiceId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Invoice Details */}
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Invoice ID</Label>
                    <div className="font-medium">{paymentForm.invoiceId}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Patient Name</Label>
                    <div className="font-medium">{paymentForm.patientName}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Amount Due</Label>
                    <div className="text-2xl font-bold text-teal-600">₦{parseInt(paymentForm.amount).toLocaleString()}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Date</Label>
                    <div className="font-medium">{selectedInvoice?.date}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label>Payment Method</Label>
              <div className="grid gap-3 md:grid-cols-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentForm({...paymentForm, paymentMethod: method.id})}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentForm.paymentMethod === method.id
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950'
                        : 'border-muted hover:border-teal-300'
                    } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <method.icon className={`w-5 h-5 ${
                        paymentForm.paymentMethod === method.id ? 'text-teal-600' : 'text-muted-foreground'
                      }`} />
                      <span className={`text-sm font-medium ${
                        paymentForm.paymentMethod === method.id ? 'text-teal-600' : ''
                      }`}>
                        {method.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="payer-name">Payer Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="payer-name"
                    value={paymentForm.payerName}
                    onChange={(e) => setPaymentForm({...paymentForm, payerName: e.target.value})}
                    className="pl-10"
                    placeholder="Enter payer name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payer-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="payer-phone"
                    value={paymentForm.payerPhone}
                    onChange={(e) => setPaymentForm({...paymentForm, payerPhone: e.target.value})}
                    className="pl-10"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payer-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="payer-email"
                    type="email"
                    value={paymentForm.payerEmail}
                    onChange={(e) => setPaymentForm({...paymentForm, payerEmail: e.target.value})}
                    className="pl-10"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  value={paymentForm.referenceNumber}
                  onChange={(e) => setPaymentForm({...paymentForm, referenceNumber: e.target.value})}
                  placeholder="Transaction reference"
                />
              </div>
            </div>

            {/* Payment Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Payment Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                placeholder="Add any additional notes about this payment..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setProcessPaymentModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={processPayment}
                disabled={!paymentForm.paymentMethod || !paymentForm.payerName || processingPayment}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {processingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Process Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}