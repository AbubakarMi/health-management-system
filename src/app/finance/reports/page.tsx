"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initialInvoices } from "@/lib/constants";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const mockRevenueData: RevenueData[] = [
  { month: "Jan 2024", revenue: 8500000, expenses: 6200000, profit: 2300000 },
  { month: "Feb 2024", revenue: 9200000, expenses: 6800000, profit: 2400000 },
  { month: "Mar 2024", revenue: 8800000, expenses: 6500000, profit: 2300000 },
  { month: "Apr 2024", revenue: 9500000, expenses: 7100000, profit: 2400000 },
  { month: "May 2024", revenue: 10200000, expenses: 7300000, profit: 2900000 },
  { month: "Jun 2024", revenue: 9800000, expenses: 7000000, profit: 2800000 }
];

const departmentRevenue = [
  { department: "Emergency", revenue: 3200000, percentage: 32 },
  { department: "Surgery", revenue: 2800000, percentage: 28 },
  { department: "Cardiology", revenue: 1500000, percentage: 15 },
  { department: "Pediatrics", revenue: 1200000, percentage: 12 },
  { department: "Laboratory", revenue: 800000, percentage: 8 },
  { department: "Pharmacy", revenue: 500000, percentage: 5 }
];

export default function FinancialReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("monthly");
  const [reportType, setReportType] = useState("comprehensive");

  const financialSummary = useMemo(() => {
    const totalRevenue = initialInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidRevenue = initialInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const pendingRevenue = initialInvoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueRevenue = initialInvoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
    
    const collectionRate = totalRevenue > 0 ? (paidRevenue / totalRevenue) * 100 : 0;
    const averageInvoiceValue = initialInvoices.length > 0 ? totalRevenue / initialInvoices.length : 0;
    const totalInvoices = initialInvoices.length;
    const overdueInvoices = initialInvoices.filter(inv => inv.status === 'Overdue').length;
    
    return {
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      overdueRevenue,
      collectionRate,
      averageInvoiceValue,
      totalInvoices,
      overdueInvoices
    };
  }, []);

  const reportCards = [
    {
      title: "Total Revenue",
      value: `₦${financialSummary.totalRevenue.toLocaleString()}`,
      subtitle: `${financialSummary.totalInvoices} invoices`,
      icon: DollarSign,
      trend: "+15.2%",
      trendUp: true,
      color: "from-emerald-400 to-teal-400"
    },
    {
      title: "Collection Rate",
      value: `${financialSummary.collectionRate.toFixed(1)}%`,
      subtitle: "Payment efficiency",
      icon: CheckCircle,
      trend: "+3.8%",
      trendUp: true,
      color: "from-green-400 to-emerald-400"
    },
    {
      title: "Outstanding",
      value: `₦${(financialSummary.pendingRevenue + financialSummary.overdueRevenue).toLocaleString()}`,
      subtitle: `${financialSummary.overdueInvoices} overdue`,
      icon: Clock,
      trend: "-5.1%",
      trendUp: false,
      color: "from-amber-400 to-orange-400"
    },
    {
      title: "Avg Invoice Value",
      value: `₦${financialSummary.averageInvoiceValue.toLocaleString()}`,
      subtitle: "Per transaction",
      icon: BarChart3,
      trend: "+8.9%",
      trendUp: true,
      color: "from-blue-400 to-cyan-400"
    }
  ];

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report for ${reportPeriod} period`);
    // Here you would implement the actual export functionality
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
              <div className="p-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold nubenta-gradient-text">Financial Reports</h1>
                <p className="text-muted-foreground">Comprehensive revenue analytics and insights</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comprehensive">Comprehensive</SelectItem>
              <SelectItem value="revenue">Revenue Only</SelectItem>
              <SelectItem value="collections">Collections</SelectItem>
              <SelectItem value="department">By Department</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button onClick={() => exportReport('PDF')} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reportCards.map((card, index) => (
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
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend Analysis */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Revenue Trend Analysis
              </CardTitle>
              <CardDescription>Monthly revenue, expenses, and profit analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockRevenueData.map((item, index) => {
                  const profitMargin = item.revenue > 0 ? (item.profit / item.revenue) * 100 : 0;
                  return (
                    <div key={item.month} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                          <span className="font-medium">{item.month}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">₦{item.revenue.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{profitMargin.toFixed(1)}% margin</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Revenue</div>
                          <Progress value={100} className="h-2 bg-gradient-to-r from-green-200 to-green-300" />
                          <div className="text-xs font-medium">₦{item.revenue.toLocaleString()}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Expenses</div>
                          <Progress value={(item.expenses / item.revenue) * 100} className="h-2 bg-gradient-to-r from-red-200 to-red-300" />
                          <div className="text-xs font-medium">₦{item.expenses.toLocaleString()}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Profit</div>
                          <Progress value={profitMargin} className="h-2 bg-gradient-to-r from-blue-200 to-blue-300" />
                          <div className="text-xs font-medium">₦{item.profit.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Revenue Breakdown */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Department Revenue
            </CardTitle>
            <CardDescription>Revenue distribution by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentRevenue.map((dept, index) => (
              <div key={dept.department} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{dept.department}</span>
                  <span className="text-sm text-muted-foreground">{dept.percentage}%</span>
                </div>
                <Progress value={dept.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground">₦{dept.revenue.toLocaleString()}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Transaction Report */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Table className="w-5 h-5 text-green-500" />
                Transaction Details
              </CardTitle>
              <CardDescription>Recent invoices and payment status</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Department</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialInvoices.slice(0, 10).map((invoice) => (
                  <TableRow key={invoice.id}>
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
                    <TableCell className="text-muted-foreground">
                      {['Emergency', 'Surgery', 'Cardiology', 'Pediatrics', 'Laboratory'][Math.floor(Math.random() * 5)]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-500" />
            Export Options
          </CardTitle>
          <CardDescription>Download reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              onClick={() => exportReport('PDF')}
              variant="outline" 
              className="h-16 flex flex-col items-center gap-2"
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm">PDF Report</span>
            </Button>
            
            <Button 
              onClick={() => exportReport('Excel')}
              variant="outline" 
              className="h-16 flex flex-col items-center gap-2"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">Excel Export</span>
            </Button>
            
            <Button 
              onClick={() => exportReport('Summary')}
              variant="outline" 
              className="h-16 flex flex-col items-center gap-2"
            >
              <PieChart className="w-6 h-6" />
              <span className="text-sm">Summary Report</span>
            </Button>
            
            <Button 
              onClick={() => exportReport('Custom')}
              variant="outline" 
              className="h-16 flex flex-col items-center gap-2"
            >
              <Filter className="w-6 h-6" />
              <span className="text-sm">Custom Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}