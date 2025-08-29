"use client"

import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  DollarSign, 
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Download,
  Sparkles,
  Brain,
  Target
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';
import { detailedPatients, mockFinancialData, prescriptionManager, labTestManager } from '@/lib/constants';

// Advanced analytics engine
class AdvancedAnalytics {
  static calculatePatientTrends() {
    const patients = detailedPatients;
    const statusDistribution = patients.reduce((acc, patient) => {
      acc[patient.condition] = (acc[patient.condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ageGroups = patients.reduce((acc, patient) => {
      const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
      const group = age < 18 ? 'Child' : age < 40 ? 'Adult' : age < 65 ? 'Middle Age' : 'Senior';
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { statusDistribution, ageGroups };
  }

  static calculateOperationalMetrics() {
    const prescriptions = prescriptionManager.getPrescriptions();
    const labTests = labTestManager.getLabTests();
    
    const prescriptionMetrics = {
      total: prescriptions.length,
      pending: prescriptions.filter(p => p.status === 'Pending').length,
      filled: prescriptions.filter(p => p.status === 'Filled').length,
      unavailable: prescriptions.filter(p => p.status === 'Unavailable').length
    };

    const labMetrics = {
      total: labTests.length,
      pending: labTests.filter(l => l.status === 'Pending').length,
      processing: labTests.filter(l => l.status === 'Processing').length,
      completed: labTests.filter(l => l.status === 'Completed').length
    };

    return { prescriptionMetrics, labMetrics };
  }

  static calculatePredictiveInsights() {
    const patients = detailedPatients;
    const criticalPatients = patients.filter(p => p.condition === 'Critical').length;
    const totalPatients = patients.length;
    
    // Mock predictive analytics
    const predictions = {
      riskAlert: criticalPatients > totalPatients * 0.15 ? 'High' : criticalPatients > totalPatients * 0.08 ? 'Medium' : 'Low',
      expectedAdmissions: Math.round(criticalPatients * 1.5),
      resourceUtilization: Math.min(95, (criticalPatients / totalPatients) * 100 + 65),
      recommendedActions: [
        'Increase critical care staffing',
        'Review medication inventory',
        'Schedule follow-up appointments',
        'Optimize bed allocation'
      ]
    };

    return predictions;
  }

  static generatePerformanceMetrics() {
    const currentMonth = new Date().getMonth();
    const mockData = Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      patients: Math.floor(Math.random() * 50) + 20,
      prescriptions: Math.floor(Math.random() * 30) + 10,
      labTests: Math.floor(Math.random() * 25) + 5,
      revenue: Math.floor(Math.random() * 5000) + 2000
    }));

    return mockData;
  }

  static calculateROI() {
    const totalRevenue = mockFinancialData.reduce((sum, month) => sum + month.revenue, 0);
    const totalExpenses = mockFinancialData.reduce((sum, month) => sum + month.expenses, 0);
    const profit = totalRevenue - totalExpenses;
    const roi = (profit / totalExpenses) * 100;

    return {
      totalRevenue,
      totalExpenses,
      profit,
      roi,
      growthRate: 12.5, // Mock growth rate
      efficiency: 78.3 // Mock efficiency score
    };
  }
}

// Metric card component
interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ComponentType<any>;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple';
}

function MetricCard({ title, value, change, changeLabel, icon: Icon, trend, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-400/10 to-cyan-400/10 text-blue-400',
    green: 'from-green-400/10 to-emerald-400/10 text-green-400',
    red: 'from-red-400/10 to-pink-400/10 text-red-400',
    orange: 'from-orange-400/10 to-yellow-400/10 text-orange-400',
    purple: 'from-purple-400/10 to-pink-400/10 text-purple-400'
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <div className="flex items-center gap-2 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : (
                <Activity className="w-4 h-4 text-yellow-500" />
              )}
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-500' : 
                trend === 'down' ? 'text-red-500' : 
                'text-yellow-500'
              }`}>
                {change > 0 ? '+' : ''}{change}% {changeLabel}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main analytics dashboard
export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const analytics = useMemo(() => ({
    patientTrends: AdvancedAnalytics.calculatePatientTrends(),
    operationalMetrics: AdvancedAnalytics.calculateOperationalMetrics(),
    predictiveInsights: AdvancedAnalytics.calculatePredictiveInsights(),
    performanceData: AdvancedAnalytics.generatePerformanceMetrics(),
    roi: AdvancedAnalytics.calculateROI()
  }), []);

  const chartData = useMemo(() => {
    const { statusDistribution, ageGroups } = analytics.patientTrends;
    
    const statusChartData = Object.entries(statusDistribution).map(([status, count]) => ({
      name: status,
      value: count,
      color: status === 'Critical' ? '#ef4444' : 
             status === 'Stable' ? '#10b981' : 
             status === 'Improving' ? '#f59e0b' : '#06b6d4'
    }));

    const ageChartData = Object.entries(ageGroups).map(([group, count]) => ({
      group,
      count,
      percentage: ((count / detailedPatients.length) * 100).toFixed(1)
    }));

    return { statusChartData, ageChartData };
  }, [analytics]);

  const radarData = [
    { subject: 'Patient Care', A: 95, fullMark: 100 },
    { subject: 'Efficiency', A: 87, fullMark: 100 },
    { subject: 'Safety', A: 92, fullMark: 100 },
    { subject: 'Innovation', A: 78, fullMark: 100 },
    { subject: 'Cost Control', A: 83, fullMark: 100 },
    { subject: 'Staff Satisfaction', A: 89, fullMark: 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights and predictive analytics for your healthcare operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Patients"
          value={detailedPatients.length}
          change={8.2}
          changeLabel="vs last month"
          icon={Users}
          trend="up"
          color="blue"
        />
        <MetricCard
          title="Revenue"
          value={`$${(analytics.roi.totalRevenue / 1000).toFixed(0)}K`}
          change={12.5}
          changeLabel="vs last month"
          icon={DollarSign}
          trend="up"
          color="green"
        />
        <MetricCard
          title="Critical Cases"
          value={analytics.predictiveInsights.expectedAdmissions}
          change={-5.3}
          changeLabel="vs last month"
          icon={AlertCircle}
          trend="down"
          color="red"
        />
        <MetricCard
          title="Efficiency Score"
          value={`${analytics.roi.efficiency}%`}
          change={3.1}
          changeLabel="vs last month"
          icon={Target}
          trend="up"
          color="purple"
        />
      </div>

      {/* Predictive Insights Card */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              AI Predictive Insights
            </CardTitle>
            <Badge 
              variant={
                analytics.predictiveInsights.riskAlert === 'High' ? 'destructive' :
                analytics.predictiveInsights.riskAlert === 'Medium' ? 'secondary' : 'default'
              }
            >
              Risk Level: {analytics.predictiveInsights.riskAlert}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-400/10 to-pink-400/10">
              <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{analytics.predictiveInsights.expectedAdmissions}</div>
              <div className="text-sm text-muted-foreground">Expected Admissions</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-400/10 to-cyan-400/10">
              <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{analytics.predictiveInsights.resourceUtilization}%</div>
              <div className="text-sm text-muted-foreground">Resource Utilization</div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground mb-3">Recommended Actions</h4>
              {analytics.predictiveInsights.recommendedActions.map((action, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-cyan-500" />
                  Patient Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={chartData.statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {chartData.statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Performance Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar 
                      name="Performance" 
                      dataKey="A" 
                      stroke="hsl(180 100% 50%)" 
                      fill="hsl(180 100% 50%)" 
                      fillOpacity={0.2}
                      strokeWidth={3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.ageChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="group" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(180 100% 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
              <CardHeader>
                <CardTitle>Operational Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-400/10 to-emerald-400/10">
                    <div className="text-2xl font-bold text-foreground">{analytics.operationalMetrics.prescriptionMetrics.filled}</div>
                    <div className="text-sm text-muted-foreground">Prescriptions Filled</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-400/10 to-cyan-400/10">
                    <div className="text-2xl font-bold text-foreground">{analytics.operationalMetrics.labMetrics.completed}</div>
                    <div className="text-sm text-muted-foreground">Lab Tests Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
            <CardHeader>
              <CardTitle>Weekly Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={analytics.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="patients" fill="hsl(180 100% 50%)" name="Patients" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(280 65% 60%)" name="Revenue" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={mockFinancialData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(180 100% 50%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(180 100% 50%)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(180 100% 50%)" fill="url(#revenueGradient)" name="Revenue" />
                  <Area type="monotone" dataKey="expenses" stackId="2" stroke="hsl(0 84% 60%)" fill="url(#expensesGradient)" name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Powered by Nubenta Technology Advanced Analytics Engine</span>
        </div>
      </div>
    </div>
  );
}