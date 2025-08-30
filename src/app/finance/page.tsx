
"use client";

import { useMemo } from "react";
import { FinancialOverviewChart } from "@/components/charts/financial-overview-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { initialInvoices } from "@/lib/constants";
import { CheckCircle, Clock, FileWarning, Plus, FileText, Calculator, TrendingUp, BarChart3, CreditCard, DollarSign, Star, Zap } from "lucide-react";
import { NairaIcon } from "@/components/ui/naira-icon";

export default function FinanceDashboard() {

  const kpiData = useMemo(() => {
    const totalBilled = initialInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = initialInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const outstandingAmount = initialInvoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueInvoices = initialInvoices.filter(inv => inv.status === 'Overdue').length;
    return { totalBilled, totalPaid, outstandingAmount, overdueInvoices };
  }, []);

  const recentTransactions = initialInvoices.slice(0, 5);

  return (
    <div className="space-y-6">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
                    <NairaIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₦{kpiData.totalBilled.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₦{kpiData.totalPaid.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₦{kpiData.outstandingAmount.toLocaleString()}</div>
                     <p className="text-xs text-muted-foreground">+30.2% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                    <FileWarning className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpiData.overdueInvoices}</div>
                    <p className="text-xs text-muted-foreground">Immediate attention required</p>
                </CardContent>
            </Card>
        </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <FinancialOverviewChart />
        </div>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest invoices and their payment status.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.id}</TableCell>
                    <TableCell>{t.patientName}</TableCell>
                    <TableCell>₦{t.amount.toFixed(2)}</TableCell>
                     <TableCell>
                      <Badge variant={
                          t.status === 'Pending' ? 'secondary' : t.status === 'Overdue' ? 'destructive' : 'default'
                      } className={t.status === 'Paid' ? 'bg-green-500' : ''}>{t.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 rounded-3xl blur-3xl"></div>
        
        <Card className="relative border-0 shadow-2xl bg-gradient-to-br from-slate-900/90 via-green-900/90 to-emerald-900/90 backdrop-blur-xl overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl animate-float [animation-delay:2s]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[size:30px_30px] opacity-20"></div>
          </div>
          
          {/* Header */}
          <CardHeader className="relative text-center pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl shadow-lg animate-glow mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Quick Finance Actions
            </CardTitle>
            <CardDescription className="text-white/70 text-lg">
              Essential financial tools for efficient revenue management
            </CardDescription>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
          </CardHeader>
          
          <CardContent className="relative pb-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              
              {/* Create Invoice Card */}
              <div className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-500/90 to-emerald-500/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 group-hover:scale-[1.05] group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Create Invoice</h3>
                      <p className="text-sm text-white/80">Generate new invoices</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-white/60">
                        <FileText className="w-3 h-3" />
                        <span>Billing Management</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/60 rounded-full animate-pulse [animation-delay:1s]"></div>
                </div>
              </div>

              {/* Payment Processing Card */}
              <div className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse [animation-delay:0.5s]"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/90 to-teal-500/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 group-hover:scale-[1.05] group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Process Payment</h3>
                      <p className="text-sm text-white/80">Handle transactions</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-white/60">
                        <DollarSign className="w-3 h-3" />
                        <span>Payment Processing</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/40 rounded-full animate-ping [animation-delay:0.5s]"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/60 rounded-full animate-pulse [animation-delay:1.5s]"></div>
                </div>
              </div>

              {/* Financial Reports Card */}
              <div className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse [animation-delay:1s]"></div>
                <div className="relative bg-gradient-to-br from-blue-500/90 to-purple-500/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 group-hover:scale-[1.05] group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Financial Reports</h3>
                      <p className="text-sm text-white/80">Revenue analytics</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-white/60">
                        <BarChart3 className="w-3 h-3" />
                        <span>Financial Reporting</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/40 rounded-full animate-ping [animation-delay:1s]"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/60 rounded-full animate-pulse [animation-delay:2s]"></div>
                </div>
              </div>

              {/* Budget Calculator Card */}
              <div className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse [animation-delay:1.5s]"></div>
                <div className="relative bg-gradient-to-br from-orange-500/90 to-red-500/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 group-hover:scale-[1.05] group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Budget Calculator</h3>
                      <p className="text-sm text-white/80">Financial planning</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-white/60">
                        <TrendingUp className="w-3 h-3" />
                        <span>Budget Analysis</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/40 rounded-full animate-ping [animation-delay:1.5s]"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/60 rounded-full animate-pulse [animation-delay:2.5s]"></div>
                </div>
              </div>
            </div>
            
            {/* Bottom decoration */}
            <div className="flex items-center justify-center mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/60">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm">Streamlined financial operations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
