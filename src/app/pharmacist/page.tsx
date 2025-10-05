
"use client";

import { MedicationAvailabilityChart } from "@/components/charts/medication-availability-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useMemo } from "react";
import {
  Pill,
  Package,
  AlertTriangle,
  Clipboard,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  FileWarning,
  Plus,
  Search,
  FileText,
  Activity,
  Star,
  Zap,
  ShoppingCart,
  BarChart3,
  Loader2
} from "lucide-react";

interface DBPrescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: 'Pending' | 'Filled' | 'Unavailable';
  dateIssued: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PharmacistDashboard() {
  const [prescriptions, setPrescriptions] = useState<DBPrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchPrescriptions();
    // Refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchPrescriptions, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions');
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrescriptionStatus = async (id: string, status: 'Pending' | 'Filled' | 'Unavailable') => {
    try {
      const response = await fetch(`/api/prescriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh prescriptions after update
        fetchPrescriptions();
      }
    } catch (error) {
      console.error('Error updating prescription:', error);
    }
  };

  const pharmacyMetrics = useMemo(() => {
    const totalPrescriptions = prescriptions.length;
    const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending').length;
    const completedPrescriptions = prescriptions.filter(p => p.status === 'Filled').length;
    const unavailablePrescriptions = prescriptions.filter(p => p.status === 'Unavailable').length;
    
    // Mock additional metrics
    const totalInventory = 1250;
    const lowStockItems = 23;
    const expiringItems = 8;
    const dailyDispensed = 47;
    
    const completionRate = totalPrescriptions > 0 ? (completedPrescriptions / totalPrescriptions) * 100 : 0;
    const stockLevel = ((totalInventory - lowStockItems) / totalInventory) * 100;
    const dispensingEfficiency = 94.2; // Mock data
    
    return {
      totalPrescriptions,
      pendingPrescriptions,
      completedPrescriptions,
      unavailablePrescriptions,
      totalInventory,
      lowStockItems,
      expiringItems,
      dailyDispensed,
      completionRate,
      stockLevel,
      dispensingEfficiency
    };
  }, [prescriptions]);

  const statCards = [
    {
      title: "Total Inventory",
      value: pharmacyMetrics.totalInventory.toString(),
      subtitle: `${pharmacyMetrics.lowStockItems} low stock items`,
      icon: Package,
      trend: "+8.2%",
      trendUp: true,
      color: "from-blue-400 to-cyan-400",
      progress: pharmacyMetrics.stockLevel
    },
    {
      title: "Prescriptions Today",
      value: pharmacyMetrics.dailyDispensed.toString(),
      subtitle: `${pharmacyMetrics.pendingPrescriptions} pending`,
      icon: Pill,
      trend: "+12.5%",
      trendUp: true,
      color: "from-green-400 to-emerald-400",
      progress: 78
    },
    {
      title: "Dispensing Rate",
      value: `${pharmacyMetrics.dispensingEfficiency}%`,
      subtitle: "Above hospital average",
      icon: Activity,
      trend: "+3.1%",
      trendUp: true,
      color: "from-purple-400 to-pink-400",
      progress: pharmacyMetrics.dispensingEfficiency
    },
    {
      title: "Completion Rate",
      value: `${pharmacyMetrics.completionRate.toFixed(1)}%`,
      subtitle: `${pharmacyMetrics.completedPrescriptions} completed`,
      icon: CheckCircle,
      trend: "+5.7%",
      trendUp: true,
      color: "from-orange-400 to-red-400",
      progress: pharmacyMetrics.completionRate
    }
  ];

  const alertCards = [
    {
      title: "Urgent Prescriptions",
      count: pharmacyMetrics.pendingPrescriptions,
      status: "urgent",
      icon: Clock,
      color: "bg-red-500/10 text-red-600 border-red-200"
    },
    {
      title: "Low Stock Items",
      count: pharmacyMetrics.lowStockItems,
      status: "warning",
      icon: AlertTriangle,
      color: "bg-amber-500/10 text-amber-600 border-amber-200"
    },
    {
      title: "Expiring Soon",
      count: pharmacyMetrics.expiringItems,
      status: "attention",
      icon: FileWarning,
      color: "bg-orange-500/10 text-orange-600 border-orange-200"
    },
    {
      title: "Unavailable Drugs",
      count: pharmacyMetrics.unavailablePrescriptions,
      status: "info",
      icon: Package,
      color: "bg-blue-500/10 text-blue-600 border-blue-200"
    }
  ];

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending').slice(0, 6);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 rounded-xl shadow-lg">
              <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Pharmacy Operations Center
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Medication management and dispensing overview
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4">
          <div className="text-right">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              {currentTime.toLocaleDateString()}
            </div>
            <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Live Inventory</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
            Pharmacy Alerts & Notifications
          </CardTitle>
          <CardDescription>
            Critical items requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                    <Search className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts and Tables Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <MedicationAvailabilityChart />
        </div>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5 animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="w-5 h-5 text-blue-500" />
                  Pending Prescriptions
                </CardTitle>
                <CardDescription>Prescriptions requiring immediate attention</CardDescription>
              </div>
              <Badge variant="destructive" className="text-xs">
                {pendingPrescriptions.length} urgent
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPrescriptions.map((prescription, index) => (
                <div 
                  key={prescription.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-accent/50 transition-all duration-200"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{prescription.patientName}</div>
                    <div className="text-sm text-muted-foreground">{prescription.medicine}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {prescription.status}
                  </Badge>
                </div>
              ))}
              {pendingPrescriptions.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>All prescriptions processed!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="relative animate-fade-in-up" style={{ animationDelay: "1.0s" }}>
        <Card className="border-2 shadow-lg bg-card">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg mb-4">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Quick Pharmacy Actions
            </CardTitle>
            <CardDescription className="text-base">
              Essential pharmacy tools for efficient medication management
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

              {/* Add Inventory Card */}
              <div className="group cursor-pointer p-4 rounded-xl border-2 border-border hover:border-emerald-500 bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300 hover:shadow-lg">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Add Inventory</h3>
                    <p className="text-xs text-muted-foreground">Stock medications</p>
                  </div>
                </div>
              </div>

              {/* Dispense Drugs Card */}
              <div className="group cursor-pointer p-4 rounded-xl border-2 border-border hover:border-teal-500 bg-card hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-all duration-300 hover:shadow-lg">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Dispense Drugs</h3>
                    <p className="text-xs text-muted-foreground">Process prescriptions</p>
                  </div>
                </div>
              </div>

              {/* Stock Report Card */}
              <div className="group cursor-pointer p-4 rounded-xl border-2 border-border hover:border-cyan-500 bg-card hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition-all duration-300 hover:shadow-lg">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Stock Report</h3>
                    <p className="text-xs text-muted-foreground">Inventory analytics</p>
                  </div>
                </div>
              </div>

              {/* Analytics Card */}
              <div className="group cursor-pointer p-4 rounded-xl border-2 border-border hover:border-blue-500 bg-card hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300 hover:shadow-lg">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Analytics</h3>
                    <p className="text-xs text-muted-foreground">Performance insights</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
