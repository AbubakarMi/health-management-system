
"use client";

import { useMemo, useState, useEffect } from "react";
import { FinancialOverviewChart } from "@/components/charts/financial-overview-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { initialInvoices } from "@/lib/constants";
import { CheckCircle, Clock, FileWarning, Plus, FileText, Calculator, TrendingUp, TrendingDown, BarChart3, CreditCard, DollarSign, Star, Zap, Users, AlertTriangle } from "lucide-react";
import { NairaIcon } from "@/components/ui/naira-icon";
import { useRouter } from "next/navigation";

export default function FinanceDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
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
    const monthlyGrowth = 15.8; // Mock data
    
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

  const statCards = [
    {
      title: "Total Revenue",
      value: `₦${financeMetrics.totalBilled.toLocaleString()}`,
      subtitle: `${financeMetrics.paymentRate.toFixed(1)}% collected`,
      icon: DollarSign,
      trend: "+20.1%",
      trendUp: true,
      color: "from-emerald-400 to-teal-400",
      progress: financeMetrics.paymentRate
    },
    {
      title: "Payments Received",
      value: `₦${financeMetrics.totalPaid.toLocaleString()}`,
      subtitle: `${financeMetrics.paidInvoices}/${financeMetrics.totalInvoices} invoices`,
      icon: CheckCircle,
      trend: "+12.5%",
      trendUp: true,
      color: "from-green-400 to-emerald-400",
      progress: (financeMetrics.paidInvoices / financeMetrics.totalInvoices) * 100
    },
    {
      title: "Outstanding Amount",
      value: `₦${financeMetrics.outstandingAmount.toLocaleString()}`,
      subtitle: `${financeMetrics.outstandingRate.toFixed(1)}% of total`,
      icon: Clock,
      trend: "+30.2%",
      trendUp: false,
      color: "from-amber-400 to-orange-400",
      progress: financeMetrics.outstandingRate
    },
    {
      title: "Monthly Growth",
      value: `${financeMetrics.monthlyGrowth}%`,
      subtitle: `${financeMetrics.overdueInvoices} overdue invoices`,
      icon: TrendingUp,
      trend: "+5.3%",
      trendUp: true,
      color: "from-blue-400 to-cyan-400",
      progress: financeMetrics.monthlyGrowth
    }
  ];

  const alertCards = [
    {
      title: "Overdue Invoices",
      count: financeMetrics.overdueInvoices,
      status: "urgent",
      icon: FileWarning,
      color: "bg-red-500/10 text-red-600 border-red-200"
    },
    {
      title: "Pending Payments",
      count: initialInvoices.filter(inv => inv.status === 'Pending').length,
      status: "warning",
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600 border-amber-200"
    },
    {
      title: "Processed Today",
      count: 12, // Mock data
      status: "info",
      icon: CheckCircle,
      color: "bg-green-500/10 text-green-600 border-green-200"
    },
    {
      title: "Total Invoices",
      count: financeMetrics.totalInvoices,
      status: "neutral",
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 border-blue-200"
    }
  ];

  const recentTransactions = initialInvoices.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold nubenta-gradient-text">
                Finance Control Center
              </h1>
              <p className="text-muted-foreground">
                Revenue management and financial analytics
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-muted-foreground">
              {currentTime.toLocaleDateString()}
            </div>
            <div className="text-lg font-bold nubenta-gradient-text">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-white rounded-full text-sm font-semibold animate-pulse-slow">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Live Revenue
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card 
            key={card.title} 
            className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up bg-gradient-to-br from-card via-card to-primary/5"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.color}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color}`}>
                <card.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{card.value}</div>
                <Badge 
                  variant={card.trendUp ? "default" : "destructive"}
                  className="text-xs"
                >
                  {card.trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {card.trend}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{card.subtitle}</span>
                  <span>{card.progress?.toFixed(0)}%</span>
                </div>
                <Progress value={card.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Cards */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Financial Alerts & Status
          </CardTitle>
          <CardDescription>
            Key financial metrics requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {alertCards.map((alert, index) => (
              <div 
                key={alert.title}
                className={`p-4 rounded-lg border ${alert.color} hover:shadow-md transition-all duration-200 animate-fade-in-up`}
                style={{ animationDelay: `${(index + 4) * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <alert.icon className="w-5 h-5" />
                  <span className="text-2xl font-bold">{alert.count}</span>
                </div>
                <div className="text-sm font-medium">{alert.title}</div>
                {alert.count > 0 && alert.status === 'urgent' && (
                  <Button size="sm" variant="ghost" className="w-full mt-2 h-8">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Action Required
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
          
          <CardContent className="relative pb-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              
              {/* Create Invoice Card */}
              <div 
                onClick={() => router.push('/finance/invoices')}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/90 to-teal-500/90 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Create Invoice</h3>
                      <p className="text-xs text-white/80">Generate new invoices</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Processing Card */}
              <div 
                onClick={() => router.push('/finance/payments')}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-teal-500/90 to-cyan-500/90 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Process Payment</h3>
                      <p className="text-xs text-white/80">Handle transactions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Reports Card */}
              <div 
                onClick={() => router.push('/finance/reports')}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-cyan-500/90 to-teal-500/90 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Financial Reports</h3>
                      <p className="text-xs text-white/80">Revenue analytics</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Calculator Card */}
              <div 
                onClick={() => router.push('/finance/budget')}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-teal-500/90 to-emerald-500/90 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Budget Calculator</h3>
                      <p className="text-xs text-white/80">Financial planning</p>
                    </div>
                  </div>
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
