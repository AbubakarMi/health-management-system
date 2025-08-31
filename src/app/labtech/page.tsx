"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  TestTube, 
  Activity, 
  FlaskConical, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Eye,
  FileText,
  Search,
  Calendar,
  Settings,
  Wrench,
  Plus,
  BarChart3,
  RefreshCw,
  Filter,
  BookOpen,
  Droplets,
  Beaker,
  Microscope,
  TrendingUp,
  Users,
  Building
} from "lucide-react";
import { detailedPatients } from "@/lib/constants";
import { generateInvoicePdf } from "@/lib/pdf-generator";

// Lab test results data
const labTestResults = [
  { id: "LAB001", patientName: "John Doe", testType: "Blood Chemistry", status: "Completed", priority: "High", results: "Normal glucose levels: 95 mg/dL\nCholesterol: 180 mg/dL\nLiver enzymes: Normal", date: "2024-01-15", technician: "Dr. Sarah Kim" },
  { id: "LAB002", patientName: "Jane Smith", testType: "Complete Blood Count", status: "Pending", priority: "Medium", results: "Pending analysis", date: "2024-01-16", technician: "Dr. Mike Johnson" },
  { id: "LAB003", patientName: "Bob Wilson", testType: "Urinalysis", status: "Completed", priority: "Low", results: "Specific gravity: 1.015\nProtein: Negative\nGlucose: Negative", date: "2024-01-14", technician: "Dr. Sarah Kim" },
  { id: "LAB004", patientName: "Alice Brown", testType: "Microbiology Culture", status: "In Progress", priority: "High", results: "Culture in progress - 24hr incubation", date: "2024-01-16", technician: "Dr. Mike Johnson" },
  { id: "LAB005", patientName: "Charlie Davis", testType: "Lipid Panel", status: "Completed", priority: "Medium", results: "Total cholesterol: 220 mg/dL\nHDL: 45 mg/dL\nLDL: 140 mg/dL\nTriglycerides: 175 mg/dL", date: "2024-01-13", technician: "Dr. Sarah Kim" }
];

// Equipment data
const equipmentData = [
  { id: "EQ001", name: "Automated Chemistry Analyzer", status: "Operational", lastMaint: "2024-01-10", nextDue: "2024-04-10", location: "Lab-A", condition: "Excellent" },
  { id: "EQ002", name: "Hematology Analyzer", status: "Maintenance", lastMaint: "2024-01-05", nextDue: "2024-01-20", location: "Lab-B", condition: "Good" },
  { id: "EQ003", name: "Centrifuge", status: "Operational", lastMaint: "2024-01-08", nextDue: "2024-03-08", location: "Lab-C", condition: "Excellent" },
  { id: "EQ004", name: "Microscope (Advanced)", status: "Down", lastMaint: "2024-01-01", nextDue: "2024-01-15", location: "Lab-A", condition: "Needs Repair" },
  { id: "EQ005", name: "PCR Machine", status: "Operational", lastMaint: "2024-01-12", nextDue: "2024-05-12", location: "Molecular Lab", condition: "Excellent" }
];

export default function LabtechDashboard() {
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [maintenanceDate, setMaintenanceDate] = useState<Date>();
  const [maintenanceNotes, setMaintenanceNotes] = useState("");

  // Lab metrics calculation
  const labMetrics = useMemo(() => {
    const totalTests = labTestResults.length;
    const completedTests = labTestResults.filter(test => test.status === 'Completed').length;
    const pendingTests = labTestResults.filter(test => test.status === 'Pending').length;
    const inProgressTests = labTestResults.filter(test => test.status === 'In Progress').length;
    const completionRate = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
    const operationalEquipment = equipmentData.filter(eq => eq.status === 'Operational').length;
    const equipmentEfficiency = equipmentData.length > 0 ? (operationalEquipment / equipmentData.length) * 100 : 0;
    
    return {
      totalTests,
      completedTests,
      pendingTests,
      inProgressTests,
      completionRate,
      equipmentEfficiency,
      operationalEquipment
    };
  }, []);

  // Generate lab report PDF
  const generateLabReportPDF = (format: string) => {
    const doc = new (window as any).jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Laboratory Report', 20, 30);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Report Type: ${format}`, 20, 55);
    
    // Lab Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Laboratory Summary', 20, 75);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Tests: ${labMetrics.totalTests}`, 20, 90);
    doc.text(`Completed: ${labMetrics.completedTests}`, 20, 100);
    doc.text(`Pending: ${labMetrics.pendingTests}`, 20, 110);
    doc.text(`In Progress: ${labMetrics.inProgressTests}`, 20, 120);
    doc.text(`Completion Rate: ${labMetrics.completionRate.toFixed(1)}%`, 20, 130);
    doc.text(`Equipment Efficiency: ${labMetrics.equipmentEfficiency.toFixed(1)}%`, 20, 140);
    
    // Test Results Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recent Test Results', 20, 165);
    
    let y = 180;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    labTestResults.forEach((test, index) => {
      if (y > 250) {
        doc.addPage();
        y = 30;
      }
      
      doc.text(`${test.id} - ${test.patientName}`, 20, y);
      doc.text(`${test.testType} | ${test.status}`, 20, y + 10);
      doc.text(`Date: ${test.date} | Tech: ${test.technician}`, 20, y + 20);
      y += 35;
    });
    
    const fileName = `lab-report-${format.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  };

  // Export test results
  const exportTestResults = (format: string) => {
    if (format === 'PDF') {
      generateLabReportPDF('Test Results');
    } else if (format === 'CSV') {
      const csvContent = [
        ['Test ID', 'Patient Name', 'Test Type', 'Status', 'Priority', 'Date', 'Technician'],
        ...labTestResults.map(test => [
          test.id,
          test.patientName,
          test.testType,
          test.status,
          test.priority,
          test.date,
          test.technician
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `test-results-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // View test result in popup
  const viewTestResult = (test: any) => {
    const popup = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>Test Result - ${test.id}</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 30px; 
                background: #f8fafc;
                color: #334155;
              }
              .header { 
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .content { 
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                margin-bottom: 20px;
              }
              .field { 
                margin-bottom: 15px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 10px;
              }
              .label { 
                font-weight: 600;
                color: #475569;
                margin-bottom: 5px;
              }
              .value { 
                color: #1e293b;
              }
              .status {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
              }
              .status.completed { background: #dcfce7; color: #166534; }
              .status.pending { background: #fef3c7; color: #92400e; }
              .status.in-progress { background: #dbeafe; color: #1d4ed8; }
              .print-btn {
                background: #3b82f6;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
              }
              .print-btn:hover { background: #2563eb; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🧪 Laboratory Test Result</h1>
              <p>Careflux Hospital Laboratory Services</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">Test ID:</div>
                <div class="value">${test.id}</div>
              </div>
              
              <div class="field">
                <div class="label">Patient Name:</div>
                <div class="value">${test.patientName}</div>
              </div>
              
              <div class="field">
                <div class="label">Test Type:</div>
                <div class="value">${test.testType}</div>
              </div>
              
              <div class="field">
                <div class="label">Status:</div>
                <div class="value">
                  <span class="status ${test.status.toLowerCase().replace(' ', '-')}">${test.status}</span>
                </div>
              </div>
              
              <div class="field">
                <div class="label">Priority:</div>
                <div class="value">${test.priority}</div>
              </div>
              
              <div class="field">
                <div class="label">Date:</div>
                <div class="value">${test.date}</div>
              </div>
              
              <div class="field">
                <div class="label">Technician:</div>
                <div class="value">${test.technician}</div>
              </div>
              
              <div class="field">
                <div class="label">Results:</div>
                <div class="value">
                  <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${test.results}</pre>
                </div>
              </div>
            </div>
            
            <button class="print-btn" onclick="window.print()">🖨️ Print Result</button>
          </body>
        </html>
      `);
      popup.document.close();
    }
  };

  // Schedule equipment maintenance
  const scheduleMaintenanceHandler = (equipment: any) => {
    setSelectedEquipment(equipment);
  };

  // Handle maintenance scheduling
  const handleScheduleMaintenance = () => {
    if (selectedEquipment && maintenanceDate) {
      alert(`Maintenance scheduled for ${selectedEquipment.name} on ${maintenanceDate.toLocaleDateString()}\nNotes: ${maintenanceNotes || 'No additional notes'}`);
      setSelectedEquipment(null);
      setMaintenanceDate(undefined);
      setMaintenanceNotes("");
    }
  };

  // View equipment details
  const viewEquipmentDetails = (equipment: any) => {
    const popup = window.open('', '_blank', 'width=700,height=600');
    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>Equipment Details - ${equipment.name}</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 30px; 
                background: #f1f5f9;
                color: #334155;
              }
              .header { 
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .content { 
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                margin-bottom: 20px;
              }
              .field { 
                margin-bottom: 15px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 10px;
              }
              .label { 
                font-weight: 600;
                color: #475569;
                margin-bottom: 5px;
              }
              .value { 
                color: #1e293b;
              }
              .status-indicator {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
              }
              .operational { background: #22c55e; }
              .maintenance { background: #f59e0b; }
              .down { background: #ef4444; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>⚙️ Equipment Details</h1>
              <p>Laboratory Equipment Management</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">Equipment ID:</div>
                <div class="value">${equipment.id}</div>
              </div>
              
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${equipment.name}</div>
              </div>
              
              <div class="field">
                <div class="label">Status:</div>
                <div class="value">
                  <span class="status-indicator ${equipment.status.toLowerCase()}"></span>
                  ${equipment.status}
                </div>
              </div>
              
              <div class="field">
                <div class="label">Location:</div>
                <div class="value">${equipment.location}</div>
              </div>
              
              <div class="field">
                <div class="label">Condition:</div>
                <div class="value">${equipment.condition}</div>
              </div>
              
              <div class="field">
                <div class="label">Last Maintenance:</div>
                <div class="value">${equipment.lastMaint}</div>
              </div>
              
              <div class="field">
                <div class="label">Next Maintenance Due:</div>
                <div class="value">${equipment.nextDue}</div>
              </div>
            </div>
          </body>
        </html>
      `);
      popup.document.close();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold nubenta-gradient-text">Laboratory Dashboard</h1>
              <p className="text-muted-foreground">Manage tests, equipment, and laboratory operations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tests</CardTitle>
            <FlaskConical className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labMetrics.totalTests}</div>
            <p className="text-xs text-muted-foreground">Active test orders</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labMetrics.completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{labMetrics.completedTests} completed</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tests</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labMetrics.pendingTests + labMetrics.inProgressTests}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Equipment Status</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labMetrics.equipmentEfficiency.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">{labMetrics.operationalEquipment} operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-blue-900 dark:to-indigo-900">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold nubenta-gradient-text">Quick Actions</CardTitle>
              <CardDescription>Streamlined laboratory operations and management</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Action Buttons Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Lab Report Management */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="group relative cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-blue-500/90 to-cyan-500/90 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                    <div className="text-center space-y-3">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Lab Reports</h3>
                        <p className="text-xs text-white/80">Generate and export reports</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Lab Report Management
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button 
                      onClick={() => generateLabReportPDF('Complete')}
                      className="h-24 flex flex-col items-center gap-2 bg-blue-500 hover:bg-blue-600"
                    >
                      <Download className="w-6 h-6" />
                      <span>Export Complete Report (PDF)</span>
                    </Button>
                    
                    <Button 
                      onClick={() => generateLabReportPDF('Summary')}
                      variant="outline" 
                      className="h-24 flex flex-col items-center gap-2"
                    >
                      <BarChart3 className="w-6 h-6" />
                      <span>Export Summary (PDF)</span>
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Report Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Total Tests: {labMetrics.totalTests}</div>
                      <div>Completed: {labMetrics.completedTests}</div>
                      <div>Pending: {labMetrics.pendingTests}</div>
                      <div>Completion Rate: {labMetrics.completionRate.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Test Results Management */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="group relative cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-green-500/90 to-emerald-500/90 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                    <div className="text-center space-y-3">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                        <Microscope className="w-7 h-7 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Test Results</h3>
                        <p className="text-xs text-white/80">View and export results</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-green-500" />
                    Test Results Management
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={() => exportTestResults('PDF')} size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button onClick={() => exportTestResults('CSV')} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {labTestResults.map((test) => (
                          <TableRow key={test.id}>
                            <TableCell className="font-medium">{test.id}</TableCell>
                            <TableCell>{test.patientName}</TableCell>
                            <TableCell>{test.testType}</TableCell>
                            <TableCell>
                              <Badge variant={
                                test.status === 'Completed' ? 'default' : 
                                test.status === 'Pending' ? 'secondary' : 'outline'
                              }>
                                {test.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                test.priority === 'High' ? 'destructive' : 
                                test.priority === 'Medium' ? 'outline' : 'secondary'
                              }>
                                {test.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => viewTestResult(test)}
                                size="sm" 
                                variant="outline"
                                className="mr-2"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>

            {/* Blood Bank Management */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="group relative cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-red-500/90 to-rose-500/90 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                    <div className="text-center space-y-3">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                        <Droplets className="w-7 h-7 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Blood Bank</h3>
                        <p className="text-xs text-white/80">Inventory management</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-red-500" />
                    Blood Bank Management
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-red-500" />
                        <span className="font-semibold">Blood Type A+</span>
                      </div>
                      <div className="text-sm text-gray-600">Available: 15 units</div>
                      <Progress value={75} className="mt-2" />
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold">Blood Type O-</span>
                      </div>
                      <div className="text-sm text-gray-600">Available: 8 units</div>
                      <Progress value={40} className="mt-2" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Inventory
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Equipment Status & Maintenance */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="group relative cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-emerald-500/90 to-teal-500/90 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                    <div className="text-center space-y-3">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                        <Activity className="w-7 h-7 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Equipment</h3>
                        <p className="text-xs text-white/80">Status & maintenance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[85vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    Equipment Status & Maintenance
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                  <div className="space-y-6">
                    
                    {/* Equipment Overview Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <div className="font-semibold">Operational</div>
                              <div className="text-sm text-muted-foreground">
                                {equipmentData.filter(eq => eq.status === 'Operational').length} units
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-amber-50 border-amber-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Wrench className="w-5 h-5 text-amber-500" />
                            <div>
                              <div className="font-semibold">Maintenance</div>
                              <div className="text-sm text-muted-foreground">
                                {equipmentData.filter(eq => eq.status === 'Maintenance').length} units
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <div>
                              <div className="font-semibold">Down</div>
                              <div className="text-sm text-muted-foreground">
                                {equipmentData.filter(eq => eq.status === 'Down').length} units
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Equipment Table */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Equipment Inventory</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Equipment Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Maintenance</TableHead>
                                <TableHead>Next Due</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {equipmentData.map((equipment) => (
                                <TableRow key={equipment.id}>
                                  <TableCell className="font-medium">{equipment.id}</TableCell>
                                  <TableCell>{equipment.name}</TableCell>
                                  <TableCell>{equipment.location}</TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant={
                                        equipment.status === 'Operational' ? 'default' :
                                        equipment.status === 'Maintenance' ? 'secondary' : 'destructive'
                                      } 
                                      className={equipment.status === 'Operational' ? 'bg-green-500 hover:bg-green-600 text-white' : equipment.status === 'Maintenance' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}
                                    >
                                      {equipment.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{equipment.lastMaint}</TableCell>
                                  <TableCell className="text-muted-foreground">{equipment.nextDue}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2 justify-center">
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700"
                                        onClick={() => scheduleMaintenanceHandler(equipment)}
                                      >
                                        <Wrench className="w-3 h-3 mr-1" />
                                        Schedule
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                                        onClick={() => viewEquipmentDetails(equipment)}
                                      >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Details
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Scheduling Dialog */}
      <Dialog open={!!selectedEquipment} onOpenChange={() => setSelectedEquipment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Schedule Maintenance - {selectedEquipment?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Maintenance Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {maintenanceDate ? maintenanceDate.toLocaleDateString() : "Select maintenance date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={maintenanceDate}
                    onSelect={setMaintenanceDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={maintenanceNotes}
                onChange={(e) => setMaintenanceNotes(e.target.value)}
                placeholder="Add maintenance notes or special instructions..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSelectedEquipment(null)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleMaintenance}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}