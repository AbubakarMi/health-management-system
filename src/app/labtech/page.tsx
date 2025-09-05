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
  CheckSquare,
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
  const [showAlerts, setShowAlerts] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
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

  // Handle alerts button
  const handleAlertsClick = () => {
    setShowAlerts(!showAlerts);
  };

  // Handle refresh button
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
    // You can add actual data refresh logic here
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
          <Button variant="outline" size="sm" onClick={handleAlertsClick}>
            <Bell className="w-4 h-4 mr-2" />
            Alerts
            {labMetrics.criticalTests > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {labMetrics.criticalTests}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Alerts Panel */}
      {showAlerts && (
        <Card className="border-l-4 border-l-red-500 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Bell className="w-5 h-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {labMetrics.criticalTests > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">Critical Test Results</h4>
                  <p className="text-sm text-red-600">{labMetrics.criticalTests} test(s) require immediate attention</p>
                </div>
              </div>
            )}
            
            {equipmentData.filter(eq => eq.status === 'Down' || eq.status === 'Maintenance').map(eq => (
              <div key={eq.id} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Wrench className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800">Equipment Issue</h4>
                  <p className="text-sm text-amber-600">{eq.name} is currently {eq.status.toLowerCase()}</p>
                </div>
              </div>
            ))}
            
            {labTestResults.filter(test => test.priority === 'STAT').length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <Clock className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-800">STAT Orders</h4>
                  <p className="text-sm text-purple-600">{labTestResults.filter(test => test.priority === 'STAT').length} urgent test(s) pending</p>
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-4">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      )}

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

            {/* Clean Quick Actions Tab */}
            <TabsContent value="quick-actions" className="space-y-6 mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                
                {/* 1. Lab Results Management */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                          <TestTube className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Lab Results</h3>
                          <p className="text-sm text-white/80">View & manage test results</p>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Badge className="bg-white/20 text-white border-white/30">{labMetrics.totalTests} Tests</Badge>
                          <Badge className="bg-white/20 text-white border-white/30">Export</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <TestTube className="w-6 h-6 text-blue-500" />
                        Lab Results Management
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[75vh]">
                      <div className="space-y-6">
                        {/* Quick Export Buttons */}
                        <div className="grid gap-3 md:grid-cols-4">
                          <Button 
                            onClick={() => {
                              const doc = new (window as any).jsPDF();
                              doc.setFontSize(20);
                              doc.setFont('helvetica', 'bold');
                              doc.text('Complete Lab Results Report', 20, 30);
                              
                              doc.setFontSize(12);
                              doc.setFont('helvetica', 'normal');
                              doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 50);
                              doc.text(`Total Tests: ${labMetrics.totalTests}`, 20, 65);
                              doc.text(`Completed: ${labMetrics.completedTests}`, 20, 80);
                              doc.text(`Completion Rate: ${labMetrics.completionRate.toFixed(1)}%`, 20, 95);
                              
                              let y = 120;
                              labTestResults.forEach((test, index) => {
                                if (y > 250) {
                                  doc.addPage();
                                  y = 30;
                                }
                                doc.setFontSize(10);
                                doc.text(`${test.id} - ${test.patientName}`, 20, y);
                                doc.text(`${test.testType} | ${test.status}`, 20, y + 12);
                                y += 25;
                              });
                              
                              doc.save(`complete-lab-results-${new Date().toISOString().slice(0, 10)}.pdf`);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            PDF Report
                          </Button>
                          
                          <Button 
                            onClick={() => exportTestResults('CSV')}
                            variant="outline"
                          >
                            <Database className="w-4 h-4 mr-2" />
                            CSV Export
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              const criticalTests = labTestResults.filter(test => test.priority === 'STAT' || test.urgency === 'Critical');
                              if (criticalTests.length > 0) {
                                const doc = new (window as any).jsPDF();
                                doc.setFontSize(18);
                                doc.setFont('helvetica', 'bold');
                                doc.text('Critical Test Results Report', 20, 30);
                                
                                let y = 60;
                                criticalTests.forEach((test, index) => {
                                  if (y > 250) {
                                    doc.addPage();
                                    y = 30;
                                  }
                                  doc.setFontSize(12);
                                  doc.setFont('helvetica', 'bold');
                                  doc.text(`${test.id} - CRITICAL`, 20, y);
                                  doc.setFont('helvetica', 'normal');
                                  doc.text(`Patient: ${test.patientName}`, 20, y + 15);
                                  doc.text(`Test: ${test.testType}`, 20, y + 30);
                                  doc.text(`Priority: ${test.priority}`, 20, y + 45);
                                  y += 65;
                                });
                                
                                doc.save(`critical-results-${new Date().toISOString().slice(0, 10)}.pdf`);
                              } else {
                                alert('No critical tests found.');
                              }
                            }}
                            variant="outline"
                            className="border-red-200 hover:bg-red-50 text-red-600"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Critical Only
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              const completedTests = labTestResults.filter(test => test.status === 'Completed');
                              const csvContent = [
                                ['Test ID', 'Patient', 'Test Type', 'Department', 'Date', 'Results Summary'],
                                ...completedTests.map(test => [
                                  test.id,
                                  test.patientName,
                                  test.testType,
                                  test.department,
                                  test.date,
                                  test.results.split('\n')[0]
                                ])
                              ].map(row => row.join(',')).join('\n');
                              
                              const blob = new Blob([csvContent], { type: 'text/csv' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `completed-results-${new Date().toISOString().slice(0, 10)}.csv`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            }}
                            variant="outline"
                            className="border-green-200 hover:bg-green-50 text-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </Button>
                        </div>
                        
                        {/* Results Table */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Recent Test Results</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Test ID</TableHead>
                                  <TableHead>Patient</TableHead>
                                  <TableHead>Test Type</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {labTestResults.slice(0, 6).map((test) => (
                                  <TableRow key={test.id}>
                                    <TableCell className="font-mono">{test.id}</TableCell>
                                    <TableCell>{test.patientName}</TableCell>
                                    <TableCell>{test.testType}</TableCell>
                                    <TableCell>
                                      <Badge variant={test.status === 'Completed' ? 'default' : 'secondary'}>
                                        {test.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Button 
                                        onClick={() => viewTestResult(test)}
                                        size="sm" 
                                        variant="ghost"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
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

                {/* 2. Equipment Management */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                          <Activity className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Equipment</h3>
                          <p className="text-sm text-white/80">Manage & schedule maintenance</p>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Badge className="bg-white/20 text-white border-white/30">{labMetrics.operationalEquipment}/5 Online</Badge>
                          <Badge className="bg-white/20 text-white border-white/30">Schedule</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <Activity className="w-6 h-6 text-emerald-500" />
                        Equipment Management & Scheduling
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[75vh]">
                      <div className="space-y-6">
                        
                        {/* Quick Actions */}
                        <div className="grid gap-3 md:grid-cols-4">
                          <Button 
                            onClick={() => {
                              const doc = new (window as any).jsPDF();
                              doc.setFontSize(18);
                              doc.setFont('helvetica', 'bold');
                              doc.text('Equipment Status Report', 20, 30);
                              
                              let y = 60;
                              equipmentData.forEach((eq, index) => {
                                if (y > 250) {
                                  doc.addPage();
                                  y = 30;
                                }
                                doc.setFontSize(12);
                                doc.text(`${eq.id} - ${eq.name}`, 20, y);
                                doc.text(`Status: ${eq.status} | Location: ${eq.location}`, 20, y + 15);
                                doc.text(`Last Maintenance: ${eq.lastMaint}`, 20, y + 30);
                                y += 50;
                              });
                              
                              doc.save(`equipment-status-${new Date().toISOString().slice(0, 10)}.pdf`);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Status Report
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              const csvContent = [
                                ['Equipment ID', 'Name', 'Status', 'Location', 'Last Maintenance', 'Next Due'],
                                ...equipmentData.map(eq => [eq.id, eq.name, eq.status, eq.location, eq.lastMaint, eq.nextDue])
                              ].map(row => row.join(',')).join('\n');
                              
                              const blob = new Blob([csvContent], { type: 'text/csv' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `equipment-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            }}
                            variant="outline"
                          >
                            <Database className="w-4 h-4 mr-2" />
                            Export CSV
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              const dueSoon = equipmentData.filter(eq => {
                                const nextDue = new Date(eq.nextDue);
                                const today = new Date();
                                const diffDays = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 3600 * 24));
                                return diffDays <= 30;
                              });
                              
                              if (dueSoon.length > 0) {
                                const popup = window.open('', '_blank', 'width=600,height=500');
                                if (popup) {
                                  popup.document.write(`
                                    <html>
                                      <head><title>Maintenance Due Soon</title></head>
                                      <body style="font-family: system-ui, sans-serif; padding: 20px; background: #fef3c7;">
                                        <div style="background: #f59e0b; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                                          <h2>⚠️ Maintenance Due Soon</h2>
                                          <p>${dueSoon.length} equipment(s) need attention</p>
                                        </div>
                                        ${dueSoon.map(eq => `
                                          <div style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                                            <strong>${eq.name} (${eq.id})</strong><br>
                                            Location: ${eq.location}<br>
                                            Next Due: ${eq.nextDue}
                                          </div>
                                        `).join('')}
                                      </body>
                                    </html>
                                  `);
                                  popup.document.close();
                                }
                              } else {
                                alert('All equipment maintenance is up to date!');
                              }
                            }}
                            variant="outline"
                            className="border-amber-200 hover:bg-amber-50 text-amber-600"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Due Soon
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              const popup = window.open('', '_blank', 'width=500,height=600');
                              if (popup) {
                                popup.document.write(`
                                  <html>
                                    <head><title>Schedule Maintenance</title></head>
                                    <body style="font-family: system-ui, sans-serif; padding: 20px; background: #f0fdf4;">
                                      <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                                        <h2>📅 Schedule Maintenance</h2>
                                      </div>
                                      <form style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                        <div style="margin-bottom: 15px;">
                                          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Equipment:</label>
                                          <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                            ${equipmentData.map(eq => `<option value="${eq.id}">${eq.name} (${eq.id})</option>`).join('')}
                                          </select>
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Maintenance Date:</label>
                                          <input type="date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" min="${new Date().toISOString().slice(0, 10)}">
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Type:</label>
                                          <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                            <option>Routine Maintenance</option>
                                            <option>Calibration</option>
                                            <option>Repair</option>
                                            <option>Deep Cleaning</option>
                                          </select>
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Notes:</label>
                                          <textarea style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; height: 60px;" placeholder="Additional maintenance notes..."></textarea>
                                        </div>
                                        <button type="button" style="background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; width: 100%;" onclick="alert('Maintenance scheduled successfully!'); window.close();">
                                          ✅ Schedule Maintenance
                                        </button>
                                      </form>
                                    </body>
                                  </html>
                                `);
                                popup.document.close();
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                        
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

                {/* 3. View Test Results */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">View Results</h3>
                          <p className="text-sm text-white/80">Detailed test result viewer</p>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Badge className="bg-white/20 text-white border-white/30">Detailed View</Badge>
                          <Badge className="bg-white/20 text-white border-white/30">Print</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <Eye className="w-6 h-6 text-purple-500" />
                        Advanced Test Results Viewer
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[75vh]">
                      <div className="space-y-6">
                        {/* Quick Filter Buttons */}
                        <div className="grid gap-3 md:grid-cols-5">
                          <Button 
                            onClick={() => {
                              const completedTests = labTestResults.filter(test => test.status === 'Completed');
                              // Show completed tests in a popup
                              const popup = window.open('', '_blank', 'width=800,height=600');
                              if (popup) {
                                popup.document.write(`
                                  <html>
                                    <head><title>Completed Test Results</title></head>
                                    <body style="font-family: system-ui, sans-serif; padding: 20px; background: #f0fdf4;">
                                      <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                                        <h1>✅ Completed Test Results</h1>
                                        <p>${completedTests.length} completed tests</p>
                                      </div>
                                      ${completedTests.map(test => `
                                        <div style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #10b981; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <strong style="color: #10b981;">${test.id}</strong>
                                            <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${test.status}</span>
                                          </div>
                                          <strong>Patient:</strong> ${test.patientName}<br>
                                          <strong>Test:</strong> ${test.testType}<br>
                                          <strong>Department:</strong> ${test.department}<br>
                                          <strong>Date:</strong> ${test.date}<br>
                                          <details style="margin-top: 10px;">
                                            <summary style="cursor: pointer; font-weight: 600; color: #059669;">View Results</summary>
                                            <pre style="background: #f0f9ff; padding: 10px; margin: 10px 0; border-radius: 4px; white-space: pre-wrap; font-size: 12px;">${test.results}</pre>
                                          </details>
                                        </div>
                                      `).join('')}
                                    </body>
                                  </html>
                                `);
                                popup.document.close();
                              }
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              const pendingTests = labTestResults.filter(test => test.status === 'Pending' || test.status === 'In Progress');
                              const popup = window.open('', '_blank', 'width=800,height=600');
                              if (popup) {
                                popup.document.write(`
                                  <html>
                                    <head><title>Pending Test Results</title></head>
                                    <body style="font-family: system-ui, sans-serif; padding: 20px; background: #fef3c7;">
                                      <div style="background: #f59e0b; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                                        <h1>⏳ Pending Test Results</h1>
                                        <p>${pendingTests.length} tests in progress</p>
                                      </div>
                                      ${pendingTests.map(test => `
                                        <div style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <strong>${test.id}</strong>
                                            <span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${test.status}</span>
                                          </div>
                                          <strong>Patient:</strong> ${test.patientName}<br>
                                          <strong>Test:</strong> ${test.testType}<br>
                                          <strong>Priority:</strong> ${test.priority}<br>
                                          <strong>Date:</strong> ${test.date}
                                        </div>
                                      `).join('')}
                                    </body>
                                  </html>
                                `);
                                popup.document.close();
                              }
                            }}
                            variant="outline"
                            className="border-amber-200 hover:bg-amber-50 text-amber-600"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Pending
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              const criticalTests = labTestResults.filter(test => test.priority === 'STAT' || test.status === 'Critical Review');
                              if (criticalTests.length > 0) {
                                const popup = window.open('', '_blank', 'width=800,height=600');
                                if (popup) {
                                  popup.document.write(`
                                    <html>
                                      <head><title>Critical Test Results</title></head>
                                      <body style="font-family: system-ui, sans-serif; padding: 20px; background: #fef2f2;">
                                        <div style="background: #ef4444; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                                          <h1>🚨 Critical Test Results</h1>
                                          <p>${criticalTests.length} critical tests</p>
                                        </div>
                                        ${criticalTests.map(test => `
                                          <div style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #ef4444; animation: blink 2s infinite;">
                                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                              <strong style="color: #ef4444;">${test.id}</strong>
                                              <span style="background: #ef4444; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; animation: pulse 1s infinite;">${test.priority}</span>
                                            </div>
                                            <strong>Patient:</strong> ${test.patientName}<br>
                                            <strong>Test:</strong> ${test.testType}<br>
                                            <strong>Status:</strong> ${test.status}<br>
                                            <strong>Results:</strong><br>
                                            <pre style="background: #fef2f2; padding: 10px; margin: 10px 0; border-radius: 4px; white-space: pre-wrap; font-size: 12px;">${test.results}</pre>
                                          </div>
                                        `).join('')}
                                        <style>
                                          @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.7; } }
                                          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                                        </style>
                                      </body>
                                    </html>
                                  `);
                                  popup.document.close();
                                }
                              } else {
                                alert('No critical tests at this time.');
                              }
                            }}
                            variant="outline"
                            className="border-red-200 hover:bg-red-50 text-red-600"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Critical
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              // Export all detailed results to PDF
                              const doc = new (window as any).jsPDF();
                              doc.setFontSize(18);
                              doc.setFont('helvetica', 'bold');
                              doc.text('Detailed Lab Results Report', 20, 30);
                              
                              let y = 60;
                              labTestResults.forEach((test, index) => {
                                if (y > 220) {
                                  doc.addPage();
                                  y = 30;
                                }
                                
                                doc.setFontSize(14);
                                doc.setFont('helvetica', 'bold');
                                doc.text(`${test.id} - ${test.patientName}`, 20, y);
                                
                                doc.setFontSize(10);
                                doc.setFont('helvetica', 'normal');
                                doc.text(`Test: ${test.testType}`, 20, y + 15);
                                doc.text(`Department: ${test.department}`, 20, y + 25);
                                doc.text(`Status: ${test.status} | Priority: ${test.priority}`, 20, y + 35);
                                doc.text(`Date: ${test.date}`, 20, y + 45);
                                
                                // Add results with word wrap
                                const resultLines = doc.splitTextToSize(test.results, 160);
                                doc.text(resultLines, 20, y + 60);
                                
                                y += 80 + (resultLines.length * 5);
                                
                                // Add separator line
                                doc.setDrawColor(200, 200, 200);
                                doc.line(20, y, 190, y);
                                y += 15;
                              });
                              
                              doc.save(`detailed-lab-results-${new Date().toISOString().slice(0, 10)}.pdf`);
                            }}
                            variant="outline"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              // Print all results
                              const popup = window.open('', '_blank', 'width=900,height=700');
                              if (popup) {
                                popup.document.write(`
                                  <html>
                                    <head>
                                      <title>Lab Results - Print View</title>
                                      <style>
                                        @media print {
                                          .no-print { display: none; }
                                        }
                                        body { font-family: system-ui, sans-serif; padding: 20px; }
                                        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; margin-bottom: 30px; }
                                        .test-result { background: white; border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px; page-break-inside: avoid; }
                                        .test-id { font-size: 18px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 15px; }
                                        .results-section { background: #f8fafc; padding: 15px; border-radius: 6px; margin-top: 15px; }
                                        .print-btn { background: #3b82f6; color: white; padding: 15px 30px; border: none; border-radius: 6px; cursor: pointer; margin: 20px; }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="header">
                                        <h1>🧪 Laboratory Test Results</h1>
                                        <p>Careflux Hospital - Generated on ${new Date().toLocaleDateString()}</p>
                                      </div>
                                      <button class="print-btn no-print" onclick="window.print()">🖨️ Print Results</button>
                                      ${labTestResults.map(test => `
                                        <div class="test-result">
                                          <div class="test-id">${test.id} - ${test.patientName}</div>
                                          <div><strong>Test Type:</strong> ${test.testType}</div>
                                          <div><strong>Department:</strong> ${test.department}</div>
                                          <div><strong>Status:</strong> ${test.status}</div>
                                          <div><strong>Priority:</strong> ${test.priority}</div>
                                          <div><strong>Date:</strong> ${test.date}</div>
                                          <div><strong>Technician:</strong> ${test.technician}</div>
                                          <div class="results-section">
                                            <strong>Results:</strong><br>
                                            <pre style="white-space: pre-wrap; font-family: inherit; margin-top: 10px;">${test.results}</pre>
                                          </div>
                                        </div>
                                      `).join('')}
                                    </body>
                                  </html>
                                `);
                                popup.document.close();
                              }
                            }}
                            variant="outline"
                            className="border-blue-200 hover:bg-blue-50 text-blue-600"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Print View
                          </Button>
                        </div>
                        
                        {/* Interactive Results Grid */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {labTestResults.map((test, index) => (
                            <Card 
                              key={test.id} 
                              className={`border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                                test.status === 'Completed' ? 'bg-green-50 border-green-200' :
                                test.status === 'Critical Review' ? 'bg-red-50 border-red-200' :
                                test.status === 'In Progress' ? 'bg-blue-50 border-blue-200' :
                                'bg-amber-50 border-amber-200'
                              }`}
                              onClick={() => viewTestResult(test)}
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="font-mono text-sm font-bold">{test.id}</div>
                                  <Badge 
                                    variant={test.status === 'Completed' ? 'default' : 'secondary'}
                                    className={`text-xs ${
                                      test.status === 'Completed' ? 'bg-green-500 hover:bg-green-600' :
                                      test.status === 'Critical Review' ? 'bg-red-500 hover:bg-red-600' :
                                      'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                  >
                                    {test.status}
                                  </Badge>
                                </div>
                                <h4 className="font-semibold text-sm mb-2">{test.patientName}</h4>
                                <p className="text-xs text-muted-foreground mb-2">{test.testType}</p>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground">{test.date}</span>
                                  <Badge 
                                    variant={test.priority === 'STAT' ? 'destructive' : 'outline'}
                                    className={`text-xs ${
                                      test.priority === 'STAT' ? 'animate-pulse' : ''
                                    }`}
                                  >
                                    {test.priority}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                {/* 4. Sample Management */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                          <Beaker className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Sample Management</h3>
                          <p className="text-sm text-white/80">Track & manage lab samples</p>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Badge className="bg-white/20 text-white border-white/30">Tracking</Badge>
                          <Badge className="bg-white/20 text-white border-white/30">Quality Control</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <Beaker className="w-6 h-6 text-orange-500" />
                        Sample Management System
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[75vh]">
                      <div className="space-y-6">
                        {/* Sample Management Actions */}
                        <div className="grid gap-3 md:grid-cols-4">
                          <Button 
                            onClick={() => {
                              const popup = window.open('', '_blank', 'width=500,height=600');
                              if (popup) {
                                popup.document.write(`
                                  <html>
                                    <head><title>New Sample Registration</title></head>
                                    <body style="font-family: system-ui, sans-serif; padding: 20px; background: #fff7ed;">
                                      <div style="background: #ea580c; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                                        <h2>🧪 Register New Sample</h2>
                                      </div>
                                      <form style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                        <div style="margin-bottom: 15px;">
                                          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Sample ID:</label>
                                          <input type="text" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="AUTO-GENERATED" disabled>
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Patient ID:</label>
                                          <input type="text" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Enter patient ID">
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Sample Type:</label>
                                          <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                            <option>Blood</option>
                                            <option>Urine</option>
                                            <option>Tissue</option>
                                            <option>Swab</option>
                                            <option>Fluid</option>
                                          </select>
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Collection Date/Time:</label>
                                          <input type="datetime-local" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="${new Date().toISOString().slice(0, 16)}">
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Storage Requirements:</label>
                                          <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                            <option>Room Temperature</option>
                                            <option>Refrigerated (2-8°C)</option>
                                            <option>Frozen (-20°C)</option>
                                            <option>Deep Frozen (-80°C)</option>
                                          </select>
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Priority:</label>
                                          <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                            <option>Routine</option>
                                            <option>Urgent</option>
                                            <option>STAT</option>
                                          </select>
                                        </div>
                                        <button type="button" style="background: #ea580c; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; width: 100%;" onclick="alert('Sample registered successfully with ID: S' + Math.random().toString().slice(2,8)); window.close();">
                                          ✅ Register Sample
                                        </button>
                                      </form>
                                    </body>
                                  </html>
                                `);
                                popup.document.close();
                              }
                            }}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            New Sample
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              // Generate sample tracking report
                              const sampleData = [
                                { id: 'S001', patient: 'Musa Adebayo', type: 'Blood', status: 'Processing', priority: 'Routine' },
                                { id: 'S002', patient: 'Zainab Lawal', type: 'Urine', status: 'Completed', priority: 'Urgent' },
                                { id: 'S003', patient: 'Ibrahim Ali', type: 'Tissue', status: 'Storage', priority: 'STAT' },
                                { id: 'S004', patient: 'Halima Abubakar', type: 'Blood', status: 'Processing', priority: 'Routine' },
                                { id: 'S005', patient: 'Muhammad Bello', type: 'Fluid', status: 'Received', priority: 'Urgent' }
                              ];
                              
                              const csvContent = [
                                ['Sample ID', 'Patient', 'Type', 'Status', 'Priority', 'Date'],
                                ...sampleData.map(sample => [
                                  sample.id, sample.patient, sample.type, sample.status, sample.priority, new Date().toLocaleDateString()
                                ])
                              ].map(row => row.join(',')).join('\n');
                              
                              const blob = new Blob([csvContent], { type: 'text/csv' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `sample-tracking-${new Date().toISOString().slice(0, 10)}.csv`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            }}
                            variant="outline"
                          >
                            <Database className="w-4 h-4 mr-2" />
                            Track Samples
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              const popup = window.open('', '_blank', 'width=600,height=500');
                              if (popup) {
                                popup.document.write(`
                                  <html>
                                    <head><title>Quality Control Dashboard</title></head>
                                    <body style="font-family: system-ui, sans-serif; padding: 20px; background: #f0f9ff;">
                                      <div style="background: #0ea5e9; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                                        <h2>🔍 Quality Control Dashboard</h2>
                                        <p>Sample quality monitoring</p>
                                      </div>
                                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                                        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #10b981;">
                                          <div style="font-size: 24px; font-weight: bold; color: #10b981;">98.5%</div>
                                          <div style="color: #666;">Quality Pass Rate</div>
                                        </div>
                                        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #f59e0b;">
                                          <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">3</div>
                                          <div style="color: #666;">Samples on Hold</div>
                                        </div>
                                        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #3b82f6;">
                                          <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">156</div>
                                          <div style="color: #666;">Samples Today</div>
                                        </div>
                                        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #ef4444;">
                                          <div style="font-size: 24px; font-weight: bold; color: #ef4444;">2</div>
                                          <div style="color: #666;">Critical Issues</div>
                                        </div>
                                      </div>
                                      <div style="background: white; padding: 20px; border-radius: 8px;">
                                        <h3 style="margin-top: 0;">Recent QC Events</h3>
                                        <div style="border-left: 4px solid #10b981; padding-left: 10px; margin-bottom: 10px;">
                                          <strong>Temperature Check Passed</strong><br>
                                          <small>Storage Unit A - 2 hours ago</small>
                                        </div>
                                        <div style="border-left: 4px solid #f59e0b; padding-left: 10px; margin-bottom: 10px;">
                                          <strong>Sample Integrity Warning</strong><br>
                                          <small>Sample S003 - 4 hours ago</small>
                                        </div>
                                        <div style="border-left: 4px solid #10b981; padding-left: 10px;">
                                          <strong>Calibration Completed</strong><br>
                                          <small>Chemistry Analyzer - 6 hours ago</small>
                                        </div>
                                      </div>
                                    </body>
                                  </html>
                                `);
                                popup.document.close();
                              }
                            }}
                            variant="outline"
                            className="border-blue-200 hover:bg-blue-50 text-blue-600"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Quality Control
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              // Sample inventory report
                              const doc = new (window as any).jsPDF();
                              doc.setFontSize(18);
                              doc.setFont('helvetica', 'bold');
                              doc.text('Sample Inventory Report', 20, 30);
                              
                              doc.setFontSize(12);
                              doc.setFont('helvetica', 'normal');
                              doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 50);
                              
                              const sampleStats = [
                                'Total Samples in Storage: 1,247',
                                'Samples Processed Today: 156',
                                'Pending Analysis: 23',
                                'Quality Control Pass Rate: 98.5%',
                                'Storage Capacity Used: 67%'
                              ];
                              
                              let y = 80;
                              sampleStats.forEach(stat => {
                                doc.text(stat, 20, y);
                                y += 15;
                              });
                              
                              doc.save(`sample-inventory-${new Date().toISOString().slice(0, 10)}.pdf`);
                            }}
                            variant="outline"
                            className="border-green-200 hover:bg-green-50 text-green-600"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Inventory Report
                          </Button>
                        </div>
                        
                        {/* Sample Status Overview */}
                        <div className="grid gap-4 md:grid-cols-4">
                          {[
                            { status: 'Received', count: 45, color: 'blue', icon: 'checkmark' },
                            { status: 'Processing', count: 28, color: 'orange', icon: 'processing' },
                            { status: 'Completed', count: 156, color: 'green', icon: 'completed' },
                            { status: 'On Hold', count: 3, color: 'red', icon: 'warning' }
                          ].map((item, index) => (
                            <Card key={item.status} className={`border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer bg-${item.color}-50 border-${item.color}-200`}>
                              <CardContent className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  {item.status === 'Received' && <CheckSquare className="w-5 h-5 text-blue-500" />}
                                  {item.status === 'Processing' && <Clock className="w-5 h-5 text-orange-500" />}
                                  {item.status === 'Completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                  {item.status === 'On Hold' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                                  <span className="font-semibold">{item.status}</span>
                                </div>
                                <div className={`text-2xl font-bold mb-1 text-${item.color}-600`}>
                                  {item.count}
                                </div>
                                <div className="text-xs text-muted-foreground">samples</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
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