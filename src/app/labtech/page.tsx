"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  Building,
  MessageSquare,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  Bell,
  Stethoscope,
  UserCheck,
  ClipboardCheck,
  Zap,
  Shield,
  Target,
  Workflow,
  Database,
  Timer,
  LineChart,
  PieChart,
  Star,
  Heart,
  Brain,
  Clipboard
} from "lucide-react";
import { detailedPatients, messageManager, users, Role } from "@/lib/constants";
import { generateInvoicePdf } from "@/lib/pdf-generator";

// Enhanced lab test results data
const labTestResults = [
  { 
    id: "LAB001", 
    patientName: "Musa Adebayo", 
    testType: "Blood Chemistry Panel", 
    status: "Completed", 
    priority: "High", 
    results: "Glucose: 95 mg/dL (Normal)\nTotal Cholesterol: 180 mg/dL (Normal)\nHDL: 50 mg/dL (Normal)\nLDL: 110 mg/dL (Normal)\nTriglycerides: 120 mg/dL (Normal)\nCreatinine: 1.0 mg/dL (Normal)", 
    date: "2024-01-15", 
    technician: "Khalid Ahmed",
    urgency: "Normal",
    department: "Clinical Chemistry"
  },
  { 
    id: "LAB002", 
    patientName: "Zainab Lawal", 
    testType: "Complete Blood Count", 
    status: "Critical Review", 
    priority: "STAT", 
    results: "WBC: 15,200/μL (High - indicates infection)\nRBC: 3.8 M/μL (Low)\nHemoglobin: 10.2 g/dL (Low)\nHematocrit: 30% (Low)\nPlatelets: 180,000/μL (Normal)", 
    date: "2024-01-16", 
    technician: "Khalid Ahmed",
    urgency: "Critical",
    department: "Hematology"
  },
  { 
    id: "LAB003", 
    patientName: "Ibrahim Ali", 
    testType: "Comprehensive Urinalysis", 
    status: "Completed", 
    priority: "Routine", 
    results: "Specific gravity: 1.015 (Normal)\nProtein: Negative\nGlucose: Negative\nKetones: Negative\nBlood: Negative\nLeukocyte esterase: Negative", 
    date: "2024-01-14", 
    technician: "Khalid Ahmed",
    urgency: "Normal",
    department: "Clinical Pathology"
  },
  { 
    id: "LAB004", 
    patientName: "Halima Abubakar", 
    testType: "Microbiology Culture & Sensitivity", 
    status: "In Progress", 
    priority: "High", 
    results: "Culture in progress - 48hr incubation\nPreliminary: Gram-positive cocci noted\nAntibiotic sensitivity pending", 
    date: "2024-01-16", 
    technician: "Khalid Ahmed",
    urgency: "High",
    department: "Microbiology"
  },
  { 
    id: "LAB005", 
    patientName: "Muhammad Bello", 
    testType: "Cardiac Enzyme Panel", 
    status: "Pending", 
    priority: "STAT", 
    results: "Sample received - Processing", 
    date: "2024-01-16", 
    technician: "Khalid Ahmed",
    urgency: "Critical",
    department: "Clinical Chemistry"
  },
  { 
    id: "LAB006", 
    patientName: "Samira Umar", 
    testType: "Liver Function Tests", 
    status: "Completed", 
    priority: "Medium", 
    results: "ALT: 28 U/L (Normal)\nAST: 32 U/L (Normal)\nBilirubin Total: 1.0 mg/dL (Normal)\nAlbumin: 4.2 g/dL (Normal)\nAlkaline Phosphatase: 85 U/L (Normal)", 
    date: "2024-01-13", 
    technician: "Khalid Ahmed",
    urgency: "Normal",
    department: "Clinical Chemistry"
  }
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
  // Main state
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [maintenanceDate, setMaintenanceDate] = useState<Date>();
  const [maintenanceNotes, setMaintenanceNotes] = useState("");
  
  // Chat state
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  const currentUser = users.find(u => u.role === 'labtech') || users[3]; // Khalid Ahmed

  // Initialize chat conversations
  useEffect(() => {
    const labConversations = messageManager.getConversations('labtech');
    setConversations(labConversations);
    const allMessages = messageManager.getMessages();
    setMessages(allMessages);
  }, []);

  // Enhanced lab metrics calculation
  const labMetrics = useMemo(() => {
    const filteredTests = labTestResults.filter(test => {
      const matchesSearch = searchTerm === "" || 
        test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || test.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || test.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    const totalTests = labTestResults.length;
    const completedTests = labTestResults.filter(test => test.status === 'Completed').length;
    const pendingTests = labTestResults.filter(test => test.status === 'Pending').length;
    const inProgressTests = labTestResults.filter(test => test.status === 'In Progress').length;
    const criticalReview = labTestResults.filter(test => test.status === 'Critical Review').length;
    const statTests = labTestResults.filter(test => test.priority === 'STAT').length;
    const criticalTests = labTestResults.filter(test => test.urgency === 'Critical').length;
    const completionRate = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
    const operationalEquipment = equipmentData.filter(eq => eq.status === 'Operational').length;
    const equipmentEfficiency = equipmentData.length > 0 ? (operationalEquipment / equipmentData.length) * 100 : 0;
    
    // Department distribution
    const departments = ['Clinical Chemistry', 'Hematology', 'Clinical Pathology', 'Microbiology'];
    const departmentStats = departments.map(dept => ({
      name: dept,
      count: labTestResults.filter(test => test.department === dept).length,
      completed: labTestResults.filter(test => test.department === dept && test.status === 'Completed').length
    }));
    
    return {
      totalTests,
      completedTests,
      pendingTests,
      inProgressTests,
      criticalReview,
      statTests,
      criticalTests,
      completionRate,
      equipmentEfficiency,
      operationalEquipment,
      filteredTests,
      departmentStats
    };
  }, [searchTerm, statusFilter, priorityFilter]);

  // Chat functions
  const sendMessage = (content: string) => {
    if (activeChat && content.trim()) {
      messageManager.sendMessage({
        from: currentUser.name,
        to: getRecipientRole(activeChat),
        content: content.trim()
      });
      setNewMessage("");
      // Refresh conversations
      const updated = messageManager.getConversations('labtech');
      setConversations(updated);
      setMessages(messageManager.getMessages());
    }
  };

  const getRecipientRole = (participant: string): Role => {
    const user = users.find(u => u.name === participant);
    return user?.role || 'admin';
  };

  const markAsRead = (participant: string) => {
    messageManager.markAsRead(participant, 'labtech');
    const updated = messageManager.getConversations('labtech');
    setConversations(updated);
  };

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
                <div class="label">Department:</div>
                <div class="value">${test.department}</div>
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
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-xl shadow-lg">
              <TestTube className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Laboratory Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">Advanced laboratory management system</p>
              <div className="flex items-center gap-4 mt-1">
                <Badge variant="outline" className="text-xs">
                  <UserCheck className="w-3 h-3 mr-1" />
                  {currentUser.name}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Timer className="w-3 h-3 mr-1" />
                  {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
            {labMetrics.criticalTests > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {labMetrics.criticalTests}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-950 dark:via-cyan-950 dark:to-blue-900">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">Total Tests</CardTitle>
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">{labMetrics.totalTests}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Active</Badge>
              <p className="text-xs text-muted-foreground">Laboratory orders</p>
            </div>
            <Progress value={100} className="h-1 bg-blue-200" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-950 dark:via-emerald-950 dark:to-green-900">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">Completion Rate</CardTitle>
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-green-800 dark:text-green-200">{labMetrics.completionRate.toFixed(1)}%</div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs bg-green-500">{labMetrics.completedTests}</Badge>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <Progress value={labMetrics.completionRate} className="h-1 bg-green-200" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950 dark:via-orange-950 dark:to-amber-900">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-300">Pending</CardTitle>
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-amber-800 dark:text-amber-200">{labMetrics.pendingTests + labMetrics.inProgressTests}</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{labMetrics.inProgressTests} In Progress</Badge>
            </div>
            <Progress value={(labMetrics.pendingTests / labMetrics.totalTests) * 100} className="h-1 bg-amber-200" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-red-50 via-rose-50 to-red-100 dark:from-red-950 dark:via-rose-950 dark:to-red-900">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-rose-500 to-red-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-300">Critical</CardTitle>
            <div className="p-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-red-800 dark:text-red-200">{labMetrics.criticalReview + labMetrics.statTests}</div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">STAT: {labMetrics.statTests}</Badge>
            </div>
            <Progress value={(labMetrics.criticalTests / labMetrics.totalTests) * 100} className="h-1 bg-red-200" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 dark:from-purple-950 dark:via-violet-950 dark:to-purple-900">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">Equipment</CardTitle>
            <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-purple-800 dark:text-purple-200">{labMetrics.equipmentEfficiency.toFixed(0)}%</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{labMetrics.operationalEquipment}/5</Badge>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
            <Progress value={labMetrics.equipmentEfficiency} className="h-1 bg-purple-200" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-blue-900 dark:to-indigo-900">
        <Tabs defaultValue="dashboard" className="w-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Laboratory Operations Center
                  </CardTitle>
                  <CardDescription>Comprehensive laboratory management and communication</CardDescription>
                </div>
              </div>
              <TabsList className="grid w-fit grid-cols-3">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="quick-actions" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Quick Actions
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                  {conversations.reduce((total, conv) => total + conv.unreadCount, 0) > 0 && (
                    <Badge variant="destructive" className="ml-1 text-xs h-5 w-5 p-0 flex items-center justify-center">
                      {conversations.reduce((total, conv) => total + conv.unreadCount, 0)}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6 mt-0">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests, patients, or test IDs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Critical Review">Critical Review</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="STAT">STAT</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Routine">Routine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Department Statistics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {labMetrics.departmentStats.map((dept, index) => (
                  <Card key={dept.name} className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">{dept.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{dept.count} tests</Badge>
                            <Badge variant="default" className="text-xs bg-green-500">{dept.completed} done</Badge>
                          </div>
                        </div>
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                          <Microscope className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <Progress 
                        value={dept.count > 0 ? (dept.completed / dept.count) * 100 : 0} 
                        className="h-2 mt-3" 
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Test Results Table */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-blue-500" />
                    Laboratory Test Results
                  </CardTitle>
                  <CardDescription>
                    Showing {labMetrics.filteredTests.length} of {labMetrics.totalTests} tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Test Type</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {labMetrics.filteredTests.map((test) => (
                          <TableRow key={test.id} className="hover:bg-muted/50">
                            <TableCell className="font-mono text-sm">{test.id}</TableCell>
                            <TableCell className="font-medium">{test.patientName}</TableCell>
                            <TableCell>{test.testType}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {test.department}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                test.status === 'Completed' ? 'default' : 
                                test.status === 'Critical Review' ? 'destructive' :
                                test.status === 'In Progress' ? 'secondary' : 'outline'
                              } className={
                                test.status === 'Completed' ? 'bg-green-500 hover:bg-green-600' : 
                                test.status === 'Critical Review' ? 'bg-red-500 hover:bg-red-600' : ''
                              }>
                                {test.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                test.priority === 'STAT' ? 'destructive' :
                                test.priority === 'High' ? 'secondary' : 'outline'
                              } className={
                                test.priority === 'STAT' ? 'bg-red-600 text-white animate-pulse' : ''
                              }>
                                {test.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{test.date}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button 
                                  onClick={() => viewTestResult(test)}
                                  size="sm" 
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button 
                                  onClick={() => generateLabReportPDF('Individual')}
                                  size="sm" 
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Quick Actions Tab */}
            <TabsContent value="quick-actions" className="space-y-6 mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                
                {/* Lab Report Management */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 text-white">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Lab Reports</h3>
                          <p className="text-sm text-white/80">Generate comprehensive reports</p>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Badge className="bg-white/20 text-white border-white/30">PDF Export</Badge>
                          <Badge className="bg-white/20 text-white border-white/30">Analytics</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <FileText className="w-6 h-6 text-blue-500" />
                        Advanced Lab Report Management
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Button 
                          onClick={() => generateLabReportPDF('Complete')}
                          className="h-32 flex flex-col items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        >
                          <Download className="w-8 h-8" />
                          <div>
                            <div className="font-semibold">Complete Report</div>
                            <div className="text-xs opacity-80">Full laboratory analysis</div>
                          </div>
                        </Button>
                        
                        <Button 
                          onClick={() => generateLabReportPDF('Summary')}
                          variant="outline" 
                          className="h-32 flex flex-col items-center gap-3 border-2 hover:bg-muted/50"
                        >
                          <BarChart3 className="w-8 h-8" />
                          <div>
                            <div className="font-semibold">Summary Report</div>
                            <div className="text-xs opacity-70">Key metrics overview</div>
                          </div>
                        </Button>
                        
                        <Button 
                          onClick={() => exportTestResults('CSV')}
                          variant="outline" 
                          className="h-32 flex flex-col items-center gap-3 border-2 hover:bg-muted/50"
                        >
                          <Database className="w-8 h-8" />
                          <div>
                            <div className="font-semibold">Data Export</div>
                            <div className="text-xs opacity-70">CSV format</div>
                          </div>
                        </Button>
                        
                        <Button 
                          onClick={() => generateLabReportPDF('Critical')}
                          variant="outline" 
                          className="h-32 flex flex-col items-center gap-3 border-2 border-red-200 hover:bg-red-50"
                        >
                          <AlertTriangle className="w-8 h-8 text-red-500" />
                          <div>
                            <div className="font-semibold">Critical Review</div>
                            <div className="text-xs opacity-70">STAT & urgent tests</div>
                          </div>
                        </Button>
                      </div>
                      
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold mb-3 text-blue-900">Current Laboratory Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{labMetrics.totalTests}</div>
                            <div className="text-blue-700">Total Tests</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{labMetrics.completedTests}</div>
                            <div className="text-green-700">Completed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">{labMetrics.pendingTests}</div>
                            <div className="text-amber-700">Pending</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{labMetrics.completionRate.toFixed(1)}%</div>
                            <div className="text-blue-700">Rate</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Equipment Management */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                          <Activity className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Equipment</h3>
                          <p className="text-sm text-white/80">Monitor & maintain equipment</p>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Badge className="bg-white/20 text-white border-white/30">{labMetrics.operationalEquipment}/5 Online</Badge>
                          <Badge className="bg-white/20 text-white border-white/30">Scheduling</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <Activity className="w-6 h-6 text-emerald-500" />
                        Equipment Management Center
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[75vh]">
                      <div className="space-y-6">
                        
                        {/* Equipment Overview Cards */}
                        <div className="grid gap-4 md:grid-cols-3">
                          <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <div className="font-semibold text-green-800">Operational</div>
                              </div>
                              <div className="text-2xl font-bold text-green-600">
                                {equipmentData.filter(eq => eq.status === 'Operational').length}
                              </div>
                              <div className="text-sm text-green-600">units running</div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-amber-50 border-amber-200">
                            <CardContent className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Wrench className="w-5 h-5 text-amber-500" />
                                <div className="font-semibold text-amber-800">Maintenance</div>
                              </div>
                              <div className="text-2xl font-bold text-amber-600">
                                {equipmentData.filter(eq => eq.status === 'Maintenance').length}
                              </div>
                              <div className="text-sm text-amber-600">units servicing</div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-red-50 border-red-200">
                            <CardContent className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <div className="font-semibold text-red-800">Down</div>
                              </div>
                              <div className="text-2xl font-bold text-red-600">
                                {equipmentData.filter(eq => eq.status === 'Down').length}
                              </div>
                              <div className="text-sm text-red-600">units offline</div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Equipment Table */}
                        <Card className="border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-lg">Equipment Inventory & Status</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Equipment Name</TableHead>
                                  <TableHead>Location</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Condition</TableHead>
                                  <TableHead>Last Maintenance</TableHead>
                                  <TableHead>Next Due</TableHead>
                                  <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {equipmentData.map((equipment) => (
                                  <TableRow key={equipment.id} className="hover:bg-muted/50">
                                    <TableCell className="font-mono text-sm">{equipment.id}</TableCell>
                                    <TableCell className="font-medium">{equipment.name}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="text-xs">
                                        {equipment.location}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant={
                                          equipment.status === 'Operational' ? 'default' :
                                          equipment.status === 'Maintenance' ? 'secondary' : 'destructive'
                                        } 
                                        className={
                                          equipment.status === 'Operational' ? 'bg-green-500 hover:bg-green-600 text-white' : 
                                          equipment.status === 'Maintenance' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 
                                          'bg-red-500 hover:bg-red-600 text-white'
                                        }
                                      >
                                        {equipment.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{equipment.condition}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{equipment.lastMaint}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{equipment.nextDue}</TableCell>
                                    <TableCell>
                                      <div className="flex gap-1 justify-center">
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-700"
                                          onClick={() => scheduleMaintenanceHandler(equipment)}
                                          title="Schedule maintenance"
                                        >
                                          <Calendar className="w-3 h-3" />
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700"
                                          onClick={() => viewEquipmentDetails(equipment)}
                                          title="View equipment details"
                                        >
                                          <Eye className="w-3 h-3" />
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-700"
                                          onClick={() => {
                                            const popup = window.open('', '_blank', 'width=500,height=400');
                                            if (popup) {
                                              popup.document.write(`
                                                <html>
                                                  <head><title>Maintenance Log - ${equipment.name}</title></head>
                                                  <body style="font-family: system-ui, sans-serif; padding: 20px; background: #f0fdf4;">
                                                    <div style="background: #059669; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                                                      <h2>🔧 Equipment Maintenance</h2>
                                                      <p>${equipment.name} (${equipment.id})</p>
                                                    </div>
                                                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                                      <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e5;">
                                                        <strong>Current Status:</strong> ${equipment.status}<br>
                                                        <strong>Last Maintenance:</strong> ${equipment.lastMaint}<br>
                                                        <strong>Next Due:</strong> ${equipment.nextDue}<br>
                                                        <strong>Location:</strong> ${equipment.location}
                                                      </div>
                                                      <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #22c55e;">
                                                        <strong>Maintenance Actions:</strong><br>
                                                        • Routine calibration completed<br>
                                                        • All components checked<br>
                                                        • Performance within normal range<br>
                                                        • Ready for operation
                                                      </div>
                                                    </div>
                                                  </body>
                                                </html>
                                              `);
                                              popup.document.close();
                                            }
                                          }}
                                          title="View maintenance log"
                                        >
                                          <Wrench className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                {/* Blood Bank Management */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 text-white">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                          <Droplets className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Blood Bank</h3>
                          <p className="text-sm text-white/80">Manage blood inventory</p>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Badge className="bg-white/20 text-white border-white/30">8 Types</Badge>
                          <Badge className="bg-white/20 text-white border-white/30">Tracking</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <Droplets className="w-6 h-6 text-red-500" />
                        Blood Bank Management System
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[
                          { type: 'A+', units: 20, percentage: 85 },
                          { type: 'O-', units: 15, percentage: 60 },
                          { type: 'B+', units: 12, percentage: 70 },
                          { type: 'AB+', units: 8, percentage: 40 },
                          { type: 'A-', units: 10, percentage: 50 },
                          { type: 'O+', units: 25, percentage: 95 },
                          { type: 'B-', units: 6, percentage: 30 },
                          { type: 'AB-', units: 4, percentage: 20 }
                        ].map((blood, index) => (
                          <Card key={blood.type} className={`border-0 shadow-lg ${blood.percentage < 40 ? 'bg-red-50 border-red-200' : blood.percentage < 70 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                            <CardContent className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Droplets className={`w-5 h-5 ${blood.percentage < 40 ? 'text-red-500' : blood.percentage < 70 ? 'text-amber-500' : 'text-green-500'}`} />
                                <span className="font-bold text-lg">{blood.type}</span>
                              </div>
                              <div className={`text-2xl font-bold mb-1 ${blood.percentage < 40 ? 'text-red-600' : blood.percentage < 70 ? 'text-amber-600' : 'text-green-600'}`}>
                                {blood.units}
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">units available</div>
                              <Progress value={blood.percentage} className="h-2" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Full Inventory
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Export Report
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Add Donation
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6 mt-0">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Conversations List */}
                <Card className="border-0 shadow-lg lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-96">
                      {conversations.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No conversations yet</p>
                          <p className="text-sm">Messages from staff will appear here</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {conversations.map((conv, index) => (
                            <div
                              key={conv.participant}
                              onClick={() => {
                                setActiveChat(conv.participant);
                                markAsRead(conv.participant);
                              }}
                              className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b ${
                                activeChat === conv.participant ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={`https://placehold.co/40x40.png?text=${conv.participant.split(' ').map((n: string) => n[0]).join('')}`} />
                                  <AvatarFallback>
                                    {conv.participant.split(' ').map((n: string) => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium truncate">{conv.participant}</h4>
                                    {conv.unreadCount > 0 && (
                                      <Badge variant="destructive" className="text-xs h-5 w-5 p-0 flex items-center justify-center">
                                        {conv.unreadCount}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {conv.lastMessage.content}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(conv.lastMessage.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Chat Messages */}
                <Card className="border-0 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {activeChat ? (
                          <>
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`https://placehold.co/32x32.png?text=${activeChat.split(' ').map(n => n[0]).join('')}`} />
                              <AvatarFallback className="text-xs">
                                {activeChat.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {activeChat}
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-5 h-5 text-muted-foreground" />
                            Select a conversation
                          </>
                        )}
                      </CardTitle>
                      {activeChat && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col h-96">
                    {!activeChat ? (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <h3 className="font-medium text-lg mb-2">Welcome to Lab Tech Chat</h3>
                          <p className="text-sm">Select a conversation to start messaging</p>
                          <p className="text-xs mt-2 opacity-75">
                            Communicate with doctors, admin, and other staff members
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ScrollArea className="flex-1 mb-4">
                          <div className="space-y-4 p-1">
                            {messages
                              .filter(msg => 
                                (msg.from === activeChat && msg.to === 'labtech') ||
                                (msg.from === currentUser.name && 
                                 users.find(u => u.name === activeChat)?.role === msg.to)
                              )
                              .map((msg, index) => (
                                <div 
                                  key={index}
                                  className={`flex ${msg.from === currentUser.name ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div className={`max-w-[70%] rounded-lg p-3 ${
                                    msg.from === currentUser.name 
                                      ? 'bg-blue-500 text-white' 
                                      : 'bg-muted'
                                  }`}>
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-xs mt-1 ${
                                      msg.from === currentUser.name 
                                        ? 'text-blue-100' 
                                        : 'text-muted-foreground'
                                    }`}>
                                      {new Date(msg.timestamp).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                        
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage(newMessage);
                              }
                            }}
                            className="flex-1"
                          />
                          <Button 
                            onClick={() => sendMessage(newMessage)}
                            disabled={!newMessage.trim()}
                            size="sm"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
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