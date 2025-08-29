"use client";

import { MedicationAvailabilityChart } from "@/components/charts/medication-availability-chart";
import { LabVisitsChart } from "@/components/charts/lab-visits-chart";
import { DoctorAdmissionsChart } from "@/components/charts/doctor-admissions-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { initialInvoices, detailedPatients, prescriptionManager, labTestManager } from "@/lib/constants";
import { 
  CheckCircle, 
  Clock, 
  FileWarning, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Heart,
  Stethoscope,
  Building2,
  DollarSign,
  Calendar,
  Plus,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Zap,
  Shield,
  Star
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { NairaIcon } from "@/components/ui/naira-icon";

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const comprehensiveMetrics = useMemo(() => {
    const totalBilled = initialInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = initialInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const outstandingAmount = initialInvoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueInvoices = initialInvoices.filter(inv => inv.status === 'Overdue').length;
    
    // Patient metrics
    const totalPatients = detailedPatients.length;
    const criticalPatients = detailedPatients.filter(p => p.condition === 'Critical').length;
    const admittedPatients = detailedPatients.filter(p => p.admission.isAdmitted).length;
    
    // Prescription metrics
    const prescriptions = prescriptionManager.getPrescriptions();
    const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending').length;
    const unavailablePrescriptions = prescriptions.filter(p => p.status === 'Unavailable').length;
    
    // Lab test metrics
    const labTests = labTestManager.getLabTests();
    const pendingTests = labTests.filter(t => t.status === 'Pending').length;
    const completedTests = labTests.filter(t => t.status === 'Completed').length;
    
    // Calculate trends and percentages
    const paymentRate = totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0;
    const criticalRate = totalPatients > 0 ? (criticalPatients / totalPatients) * 100 : 0;
    const admissionRate = totalPatients > 0 ? (admittedPatients / totalPatients) * 100 : 0;
    const testCompletionRate = labTests.length > 0 ? (completedTests / labTests.length) * 100 : 0;
    
    return { 
      totalBilled, 
      totalPaid, 
      outstandingAmount, 
      overdueInvoices,
      totalPatients,
      criticalPatients,
      admittedPatients,
      pendingPrescriptions,
      unavailablePrescriptions,
      pendingTests,
      completedTests,
      paymentRate,
      criticalRate,
      admissionRate,
      testCompletionRate
    };
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: `₦${comprehensiveMetrics.totalBilled.toLocaleString()}`,
      subtitle: `${comprehensiveMetrics.paymentRate.toFixed(1)}% collected`,
      icon: DollarSign,
      trend: "+12.5%",
      trendUp: true,
      color: "from-emerald-400 to-cyan-400",
      progress: comprehensiveMetrics.paymentRate
    },
    {
      title: "Active Patients",
      value: comprehensiveMetrics.totalPatients.toString(),
      subtitle: `${comprehensiveMetrics.criticalPatients} critical`,
      icon: Users,
      trend: "+8.2%",
      trendUp: true,
      color: "from-blue-400 to-indigo-400",
      progress: 85
    },
    {
      title: "Admissions",
      value: comprehensiveMetrics.admittedPatients.toString(),
      subtitle: `${comprehensiveMetrics.admissionRate.toFixed(1)}% occupancy`,
      icon: Building2,
      trend: "+4.1%",
      trendUp: true,
      color: "from-purple-400 to-pink-400",
      progress: comprehensiveMetrics.admissionRate
    },
    {
      title: "Lab Tests",
      value: comprehensiveMetrics.completedTests.toString(),
      subtitle: `${comprehensiveMetrics.pendingTests} pending`,
      icon: Activity,
      trend: "+15.7%",
      trendUp: true,
      color: "from-orange-400 to-red-400",
      progress: comprehensiveMetrics.testCompletionRate
    }
  ];

  const alertCards = [
    {
      title: "Critical Patients",
      count: comprehensiveMetrics.criticalPatients,
      status: "urgent",
      icon: Heart,
      color: "bg-red-500/10 text-red-600 border-red-200"
    },
    {
      title: "Overdue Invoices",
      count: comprehensiveMetrics.overdueInvoices,
      status: "warning",
      icon: FileWarning,
      color: "bg-amber-500/10 text-amber-600 border-amber-200"
    },
    {
      title: "Drug Shortages",
      count: comprehensiveMetrics.unavailablePrescriptions,
      status: "attention",
      icon: AlertTriangle,
      color: "bg-orange-500/10 text-orange-600 border-orange-200"
    },
    {
      title: "Pending Tests",
      count: comprehensiveMetrics.pendingTests,
      status: "info",
      icon: Clock,
      color: "bg-blue-500/10 text-blue-600 border-blue-200"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold nubenta-gradient-text">
                Admin Command Center
              </h1>
              <p className="text-muted-foreground">
                Real-time hospital operations overview
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
          <div className="px-4 py-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white rounded-full text-sm font-semibold animate-pulse-slow">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Live Data
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
            System Alerts & Notifications
          </CardTitle>
          <CardDescription>
            Critical items requiring immediate attention
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
                {alert.count > 0 && (
                  <Button size="sm" variant="ghost" className="w-full mt-2 h-8">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <MedicationAvailabilityChart />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
          <LabVisitsChart />
        </div>
      </div>

      {/* Full Width Chart */}
      <div className="animate-fade-in-up" style={{ animationDelay: "1.0s" }}>
        <DoctorAdmissionsChart />
      </div>

      {/* Quick Actions Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common administrative tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              className="h-16 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1">
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add Patient</span>
              </div>
            </Button>
            <Button 
              variant="outline"
              className="h-16 border-2 hover:bg-accent/50 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1">
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm font-medium">View Reports</span>
              </div>
            </Button>
            <Button 
              variant="outline"
              className="h-16 border-2 hover:bg-accent/50 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Schedule</span>
              </div>
            </Button>
            <Button 
              variant="outline"
              className="h-16 border-2 hover:bg-accent/50 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1">
                <PieChart className="w-5 h-5" />
                <span className="text-sm font-medium">Analytics</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}