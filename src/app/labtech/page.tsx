
"use client";

import { useState, useEffect, useMemo } from "react";
import { LabVisitsChart } from "@/components/charts/lab-visits-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { labTestManager, LabTest } from "@/lib/constants";
import Link from "next/link";
import { 
  ArrowRight, 
  TestTube, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Plus,
  FileText,
  BarChart3,
  Zap,
  Star,
  Search,
  FlaskConical
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LabTechDashboard() {
  const [pendingTests, setPendingTests] = useState<LabTest[]>([]);
  const [recentCompleted, setRecentCompleted] = useState<LabTest[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
      const handleUpdate = (updatedTests: LabTest[]) => {
          setPendingTests(updatedTests.filter(t => t.status === 'Pending' || t.status === 'Processing').slice(0, 5));
          setRecentCompleted(updatedTests.filter(t => t.status === 'Completed').slice(0, 5));
      };
      handleUpdate(labTestManager.getLabTests());
      const unsubscribe = labTestManager.subscribe(handleUpdate);
      return () => unsubscribe();
  }, []);

  const labMetrics = useMemo(() => {
    const allTests = labTestManager.getLabTests();
    const totalTests = allTests.length;
    const pendingCount = allTests.filter(t => t.status === 'Pending').length;
    const processingCount = allTests.filter(t => t.status === 'Processing').length;
    const completedCount = allTests.filter(t => t.status === 'Completed').length;
    
    const completionRate = totalTests > 0 ? (completedCount / totalTests) * 100 : 0;
    const pendingRate = totalTests > 0 ? (pendingCount / totalTests) * 100 : 0;
    const dailyTests = 18; // Mock data
    const avgProcessingTime = 2.4; // Mock data in hours
    
    return {
      totalTests,
      pendingCount,
      processingCount,
      completedCount,
      completionRate,
      pendingRate,
      dailyTests,
      avgProcessingTime
    };
  }, []);

  const statCards = [
    {
      title: "Total Tests",
      value: labMetrics.totalTests.toString(),
      subtitle: `${labMetrics.completedCount} completed`,
      icon: TestTube,
      trend: "+8.2%",
      trendUp: true,
      color: "from-blue-400 to-cyan-400",
      progress: labMetrics.completionRate
    },
    {
      title: "Daily Processing",
      value: labMetrics.dailyTests.toString(),
      subtitle: `${labMetrics.processingCount} in progress`,
      icon: Activity,
      trend: "+12.5%",
      trendUp: true,
      color: "from-emerald-400 to-teal-400",
      progress: 75
    },
    {
      title: "Completion Rate",
      value: `${labMetrics.completionRate.toFixed(1)}%`,
      subtitle: "Above target rate",
      icon: CheckCircle,
      trend: "+5.8%",
      trendUp: true,
      color: "from-green-400 to-emerald-400",
      progress: labMetrics.completionRate
    },
    {
      title: "Avg Processing Time",
      value: `${labMetrics.avgProcessingTime}h`,
      subtitle: `${labMetrics.pendingCount} tests pending`,
      icon: Clock,
      trend: "-2.1%",
      trendUp: true,
      color: "from-amber-400 to-orange-400",
      progress: 85
    }
  ];

  const alertCards = [
    {
      title: "Urgent Tests",
      count: labMetrics.pendingCount,
      status: "urgent",
      icon: AlertTriangle,
      color: "bg-red-500/10 text-red-600 border-red-200"
    },
    {
      title: "Processing",
      count: labMetrics.processingCount,
      status: "warning",
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600 border-amber-200"
    },
    {
      title: "Completed Today",
      count: 12, // Mock data
      status: "info",
      icon: CheckCircle,
      color: "bg-green-500/10 text-green-600 border-green-200"
    },
    {
      title: "Total Samples",
      count: labMetrics.totalTests,
      status: "neutral",
      icon: FlaskConical,
      color: "bg-blue-500/10 text-blue-600 border-blue-200"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-500 rounded-xl">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold nubenta-gradient-text">
                Laboratory Command Center
              </h1>
              <p className="text-muted-foreground">
                Test processing and diagnostic analytics
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
          <div className="px-4 py-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-500 text-white rounded-full text-sm font-semibold animate-pulse-slow">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Live Processing
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
            Laboratory Status & Alerts
          </CardTitle>
          <CardDescription>
            Current test processing status and priority items
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
                    <Search className="w-3 h-3 mr-1" />
                    View Tests
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts and Tables Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <LabVisitsChart />
        </div>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Pending Tests
                </CardTitle>
                <CardDescription>Tests requiring immediate attention</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/labtech/tests">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTests.map((test, index) => (
                <div 
                  key={test.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-accent/50 transition-all duration-200"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{test.patient}</div>
                    <div className="text-sm text-muted-foreground">{test.test}</div>
                  </div>
                  <Badge variant={test.status === 'Pending' ? 'destructive' : 'secondary'} className="text-xs">
                    {test.status}
                  </Badge>
                </div>
              ))}
              {pendingTests.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>All tests processed!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-teal-500/5 rounded-3xl blur-3xl"></div>
        
        <Card className="relative border-0 shadow-2xl bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-cyan-900/90 backdrop-blur-xl overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-r from-cyan-400/20 to-teal-500/20 rounded-full blur-2xl animate-float [animation-delay:2s]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[size:30px_30px] opacity-20"></div>
          </div>
          
          {/* Header */}
          <CardHeader className="relative text-center pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl shadow-lg animate-glow mb-4">
              <TestTube className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Quick Lab Actions
            </CardTitle>
            <CardDescription className="text-white/70 text-lg">
              Essential laboratory tools for efficient test processing
            </CardDescription>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500"></div>
          </CardHeader>
          
          <CardContent className="relative pb-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              
              {/* Process Sample Card */}
              <div 
                onClick={() => router.push('/labtech/process')}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-500/90 to-cyan-500/90 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Process Sample</h3>
                      <p className="text-xs text-white/80">Start new test</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Results Card */}
              <div 
                onClick={() => router.push('/labtech/results')}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-cyan-500/90 to-teal-500/90 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">View Results</h3>
                      <p className="text-xs text-white/80">Test outcomes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Reports Card */}
              <div 
                onClick={() => router.push('/labtech/reports')}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-teal-500/90 to-emerald-500/90 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Lab Reports</h3>
                      <p className="text-xs text-white/80">Analytics & trends</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipment Status Card */}
              <div 
                onClick={() => router.push('/labtech/equipment')}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/90 to-teal-500/90 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Equipment</h3>
                      <p className="text-xs text-white/80">Status & maintenance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom decoration */}
            <div className="flex items-center justify-center mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/60">
                <TestTube className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">Streamlined laboratory operations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
