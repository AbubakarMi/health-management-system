"use client";

import { useMemo, useState, useEffect } from "react";
import { FinancialOverviewChart } from "@/components/charts/financial-overview-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { initialInvoices } from "@/lib/constants";
import { 
  CheckCircle, Clock, FileWarning, Plus, FileText, Calculator, TrendingUp, TrendingDown, 
  BarChart3, CreditCard, DollarSign, Star, Zap, Users, AlertTriangle, Calendar, Building, 
  Phone, Mail, Percent, ArrowUpRight, Activity, Target, Shield, Crown, Sparkles,
  Eye, Download, RefreshCw, Filter, Search, MoreHorizontal, Bell, Banknote,
  Wallet, Receipt, PieChart, LineChart, TrendingDown as TrendingDownIcon,
  ChevronRight, ArrowRight, Coins, HandCoins
} from "lucide-react";
import { NairaIcon } from "@/components/ui/naira-icon";
import { useRouter } from "next/navigation";

export default function FinanceDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [createInvoiceModal, setCreateInvoiceModal] = useState(false);
  const [processPaymentModal, setProcessPaymentModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    serviceDescription: '',
    amount: '',
    dueDate: '',
    department: '',
    doctorName: ''
  });
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    patientName: '',
    amount: '',
    paymentMethod: '',
    referenceNumber: '',
    notes: ''
  });
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const financeMetrics = useMemo(() => {
    const totalBilled = initialInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = initialInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const outstandingAmount = initialInvoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueInvoices = initialInvoices.filter(inv => inv.status === 'Overdue').length;
    
    const paymentRate = totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0;
    const outstandingRate = totalBilled > 0 ? (outstandingAmount / totalBilled) * 100 : 0;
    const totalInvoices = initialInvoices.length;
    const paidInvoices = initialInvoices.filter(inv => inv.status === 'Paid').length;
    const monthlyGrowth = 15.8;
    
    return { 
      totalBilled, 
      totalPaid, 
      outstandingAmount, 
      overdueInvoices,
      paymentRate,
      outstandingRate,
      totalInvoices,
      paidInvoices,
      monthlyGrowth
    };
  }, []);

  const recentTransactions = initialInvoices.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 transition-colors duration-300">
      {/* Floating Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-800/20 shadow-lg transition-colors duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-700 p-3 rounded-2xl shadow-2xl">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-gradient-primary">
                  Finance Command Center
                </h1>
                <p className="text-slate-600 dark:text-slate-300 font-medium transition-colors duration-300">Professional Financial Management System</p>
              </div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 font-semibold animate-pulse">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-POWERED
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{currentTime.toLocaleDateString()}</div>
                <div className="text-lg font-bold text-gradient-primary">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-full font-semibold shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                LIVE
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Hero Stats Dashboard */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Revenue",
              value: `₦${financeMetrics.totalBilled.toLocaleString()}`,
              change: "+24.8%",
              icon: Banknote,
              gradient: "from-emerald-400 via-green-500 to-teal-600",
              bg: "from-emerald-50 to-green-100",
              progress: financeMetrics.paymentRate,
              subtitle: `${financeMetrics.paymentRate.toFixed(1)}% collected`
            },
            {
              title: "Payments Received", 
              value: `₦${financeMetrics.totalPaid.toLocaleString()}`,
              change: "+18.2%",
              icon: Wallet,
              gradient: "from-blue-400 via-indigo-500 to-purple-600",
              bg: "from-blue-50 to-indigo-100",
              progress: (financeMetrics.paidInvoices / financeMetrics.totalInvoices) * 100,
              subtitle: `${financeMetrics.paidInvoices}/${financeMetrics.totalInvoices} invoices`
            },
            {
              title: "Outstanding Amount",
              value: `₦${financeMetrics.outstandingAmount.toLocaleString()}`,
              change: "-8.4%",
              icon: Receipt,
              gradient: "from-amber-400 via-orange-500 to-red-500",
              bg: "from-amber-50 to-orange-100",
              progress: financeMetrics.outstandingRate,
              subtitle: `${financeMetrics.outstandingRate.toFixed(1)}% pending`
            },
            {
              title: "Monthly Growth",
              value: `${financeMetrics.monthlyGrowth}%`,
              change: "+5.7%",
              icon: TrendingUp,
              gradient: "from-violet-400 via-purple-500 to-pink-600",
              bg: "from-violet-50 to-purple-100",
              progress: financeMetrics.monthlyGrowth * 3,
              subtitle: "Above target"
            }
          ].map((metric, index) => (
            <Card key={metric.title} className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-fade-in-up card-premium" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.bg} opacity-60`}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent"></div>
              
              {/* Glowing Border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${metric.gradient} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500`}></div>
              
              <CardContent className="relative p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{metric.title}</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{metric.value}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{metric.subtitle}</p>
                  </div>
                  <div className={`relative p-3 rounded-2xl bg-gradient-to-r ${metric.gradient} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <metric.icon className="w-7 h-7 text-white" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${metric.gradient} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant={metric.change.startsWith('+') ? 'default' : 'destructive'} className="font-bold">
                    {metric.change.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDownIcon className="w-3 h-3 mr-1" />}
                    {metric.change}
                  </Badge>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{metric.progress?.toFixed(0)}%</span>
                </div>
                <Progress value={metric.progress} className="h-2 bg-white/50" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-blue-900 dark:to-indigo-900 card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gradient-primary">
                    Finance Operations Center
                  </CardTitle>
                  <CardDescription className="dark:text-slate-300">Streamlined financial management and operations</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Quick Invoice */}
              <Dialog open={createInvoiceModal} onOpenChange={setCreateInvoiceModal}>
                <DialogTrigger asChild>
                  <Card className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                        <Plus className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Create Invoice</h3>
                        <p className="text-sm text-white/80">Generate invoices instantly</p>
                      </div>
                      <div className="flex justify-center gap-2">
                        <Badge className="bg-white/20 text-white border-white/30">Quick Setup</Badge>
                        <Badge className="bg-white/20 text-white border-white/30">Professional</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-emerald-500" />
                      Create Lightning Invoice
                    </DialogTitle>
                    <DialogDescription>
                      Generate professional invoices with AI assistance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="patient-name">Patient Name</Label>
                        <Input
                          id="patient-name"
                          value={invoiceForm.patientName}
                          onChange={(e) => setInvoiceForm({...invoiceForm, patientName: e.target.value})}
                          placeholder="Enter patient name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patient-email">Email</Label>
                        <Input
                          id="patient-email"
                          type="email"
                          value={invoiceForm.patientEmail}
                          onChange={(e) => setInvoiceForm({...invoiceForm, patientEmail: e.target.value})}
                          placeholder="patient@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patient-phone">Phone Number</Label>
                        <Input
                          id="patient-phone"
                          value={invoiceForm.patientPhone}
                          onChange={(e) => setInvoiceForm({...invoiceForm, patientPhone: e.target.value})}
                          placeholder="Phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={invoiceForm.department} onValueChange={(value) => setInvoiceForm({...invoiceForm, department: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="surgery">Surgery</SelectItem>
                            <SelectItem value="cardiology">Cardiology</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="laboratory">Laboratory</SelectItem>
                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-description">Service Description</Label>
                      <Textarea
                        id="service-description"
                        value={invoiceForm.serviceDescription}
                        onChange={(e) => setInvoiceForm({...invoiceForm, serviceDescription: e.target.value})}
                        placeholder="Describe the services provided..."
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₦)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={invoiceForm.amount}
                          onChange={(e) => setInvoiceForm({...invoiceForm, amount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="due-date">Due Date</Label>
                        <Input
                          id="due-date"
                          type="date"
                          value={invoiceForm.dueDate}
                          onChange={(e) => setInvoiceForm({...invoiceForm, dueDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setCreateInvoiceModal(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <FileText className="w-4 h-4 mr-2" />
                        Create Invoice
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Smart Payment */}
              <Dialog open={processPaymentModal} onOpenChange={setProcessPaymentModal}>
                <DialogTrigger asChild>
                  <Card className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                        <CreditCard className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Process Payment</h3>
                        <p className="text-sm text-white/80">Handle payments efficiently</p>
                      </div>
                      <div className="flex justify-center gap-2">
                        <Badge className="bg-white/20 text-white border-white/30">Multiple Methods</Badge>
                        <Badge className="bg-white/20 text-white border-white/30">Secure</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      Smart Payment Processing
                    </DialogTitle>
                    <DialogDescription>
                      Process payments with lightning speed
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoice-select">Select Invoice</Label>
                      <Select value={paymentForm.invoiceId} onValueChange={(value) => {
                        const invoice = initialInvoices.find(inv => inv.id === value);
                        if (invoice) {
                          setPaymentForm({
                            ...paymentForm,
                            invoiceId: value,
                            patientName: invoice.patientName,
                            amount: invoice.amount.toString()
                          });
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select invoice to pay" />
                        </SelectTrigger>
                        <SelectContent>
                          {initialInvoices.filter(inv => inv.status !== 'Paid').map(invoice => (
                            <SelectItem key={invoice.id} value={invoice.id}>
                              {invoice.id} - {invoice.patientName} (₦{invoice.amount.toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {paymentForm.invoiceId && (
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Patient Name</Label>
                            <div className="p-2 bg-muted rounded text-sm">{paymentForm.patientName}</div>
                          </div>
                          <div className="space-y-2">
                            <Label>Amount</Label>
                            <div className="p-2 bg-muted rounded text-sm font-semibold">₦{parseInt(paymentForm.amount).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="payment-method">Payment Method</Label>
                          <Select value={paymentForm.paymentMethod} onValueChange={(value) => setPaymentForm({...paymentForm, paymentMethod: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="card">Credit/Debit Card</SelectItem>
                              <SelectItem value="transfer">Bank Transfer</SelectItem>
                              <SelectItem value="mobile">Mobile Money</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reference-number">Reference Number</Label>
                          <Input
                            id="reference-number"
                            value={paymentForm.referenceNumber}
                            onChange={(e) => setPaymentForm({...paymentForm, referenceNumber: e.target.value})}
                            placeholder="Transaction reference (optional)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="payment-notes">Notes</Label>
                          <Textarea
                            id="payment-notes"
                            value={paymentForm.notes}
                            onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                            placeholder="Additional payment notes..."
                            rows={3}
                          />
                        </div>
                      </>
                    )}
                    <div className="flex justify-between gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => router.push('/finance/payments')}
                        className="flex-1"
                      >
                        <Building className="w-4 h-4 mr-2" />
                        Payment Center
                      </Button>
                      <Button 
                        onClick={() => setProcessPaymentModal(false)} 
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700" 
                        disabled={!paymentForm.invoiceId || !paymentForm.paymentMethod}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Process
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Financial Reports */}
              <Card onClick={() => router.push('/finance/reports')} className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Financial Reports</h3>
                    <p className="text-sm text-white/80">Advanced analytics & insights</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-white/20 text-white border-white/30">Analytics</Badge>
                    <Badge className="bg-white/20 text-white border-white/30">Export</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Calculator */}
              <Card onClick={() => router.push('/finance/budget')} className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Budget Management</h3>
                    <p className="text-sm text-white/80">Smart financial planning</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-white/20 text-white border-white/30">Forecasting</Badge>
                    <Badge className="bg-white/20 text-white border-white/30">Analysis</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Financial Alerts - Premium Design */}
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl card-premium">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Financial Intelligence Center</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">Real-time monitoring & predictive analytics</CardDescription>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 font-semibold">
                <Activity className="w-4 h-4 mr-2" />
                LIVE MONITORING
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Critical Overdue",
                  count: financeMetrics.overdueInvoices,
                  status: "urgent",
                  icon: FileWarning,
                  gradient: "from-red-500 to-rose-600",
                  bg: "from-red-50 to-rose-100"
                },
                {
                  title: "Pending Payments",
                  count: initialInvoices.filter(inv => inv.status === 'Pending').length,
                  status: "warning", 
                  icon: Clock,
                  gradient: "from-amber-500 to-yellow-600",
                  bg: "from-amber-50 to-yellow-100"
                },
                {
                  title: "Processed Today",
                  count: 12,
                  status: "success",
                  icon: CheckCircle,
                  gradient: "from-emerald-500 to-green-600", 
                  bg: "from-emerald-50 to-green-100"
                },
                {
                  title: "Total Active",
                  count: financeMetrics.totalInvoices,
                  status: "info",
                  icon: Users,
                  gradient: "from-blue-500 to-indigo-600",
                  bg: "from-blue-50 to-indigo-100"
                }
              ].map((alert, index) => (
                <Card key={alert.title} className={`group relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${alert.bg} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${alert.gradient} opacity-5`}></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${alert.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                        <alert.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-slate-900 dark:text-slate-100">{alert.count}</div>
                        <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">{alert.title}</div>
                      </div>
                    </div>
                    {alert.count > 0 && alert.status === 'urgent' && (
                      <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        Immediate action required
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts and Transactions - Premium Layout */}
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-2xl bg-white dark:bg-gray-900 overflow-hidden card-premium">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Financial Performance Analytics</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <FinancialOverviewChart />
              </CardContent>
            </Card>
          </div>
          
          <Card className="lg:col-span-2 border-0 shadow-2xl bg-white dark:bg-gray-900 card-premium">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-800 dark:to-emerald-900 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Transaction Stream</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">Real-time payment activity</CardDescription>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 font-semibold">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  LIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">Invoice</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">Patient</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">Amount</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((t, index) => (
                    <TableRow key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                      <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{t.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">{t.patientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{t.patientName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 dark:text-slate-100">₦{t.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={t.status === 'Pending' ? 'secondary' : t.status === 'Overdue' ? 'destructive' : 'default'} 
                          className={`font-semibold shadow-sm ${
                            t.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 
                            t.status === 'Pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
                            'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {t.status === 'Paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {t.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                          {t.status === 'Overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {t.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}