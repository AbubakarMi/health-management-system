"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { patientManager, Patient, detailedPatients } from "@/lib/constants";
import Link from "next/link";
import { 
  User, 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Stethoscope,
  Heart,
  Activity,
  Users,
  AlertCircle,
  CheckCircle,
  FileText,
  Thermometer,
  Pill,
  Plus,
  ArrowRight,
  Star,
  Brain,
  Save
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { PatientStatusChart } from "@/components/charts/patient-status-chart";
import { DoctorAdmissionsChart } from "@/components/charts/doctor-admissions-chart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const appointments = [
    { patient: 'Muhammad Bello', patientId: 'PM-000005-K3L', time: '10:00 AM', reason: 'Follow-up', avatar: 'M', urgency: 'normal', condition: 'Stable' },
    { patient: 'Samira Umar', patientId: 'PF-000006-R2D', time: '11:30 AM', reason: 'New Consultation', avatar: 'S', urgency: 'high', condition: 'Critical' },
    { patient: 'Abdulkarim Sani', patientId: 'PM-000007-S1B', time: '02:00 PM', reason: 'Routine Checkup', avatar: 'A', urgency: 'normal', condition: 'Improving' },
    { patient: 'Khadija Ahmed', patientId: 'PF-000008-T4M', time: '03:30 PM', reason: 'Lab Results Review', avatar: 'K', urgency: 'medium', condition: 'Stable' },
];

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const loggedInDoctor = "Dr. Aisha Bello";
  
  // Modal states for Quick Actions
  const [newPatientModal, setNewPatientModal] = useState(false);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [notesModal, setNotesModal] = useState(false);
  const [labOrderModal, setLabOrderModal] = useState(false);
  
  const [patientForm, setPatientForm] = useState({
    name: '', age: '', gender: '', symptoms: '', diagnosis: '', treatment: ''
  });
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientName: '', medication: '', dosage: '', frequency: '', duration: '', instructions: ''
  });
  const [notesForm, setNotesForm] = useState({
    patientName: '', noteType: '', content: '', followUp: ''
  });
  const [labOrderForm, setLabOrderForm] = useState({
    patientName: '', testType: '', urgency: '', notes: '', department: ''
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
        setPatients([...patientManager.getPatients()]);
    };
    handleUpdate();
    const unsubscribe = patientManager.subscribe(handleUpdate);
    return () => unsubscribe();
  }, []);

  const myPatients = useMemo(() => {
      return patients.filter(p => p.assignedDoctor === loggedInDoctor);
  }, [patients, loggedInDoctor]);

  const doctorMetrics = useMemo(() => {
    const totalPatients = myPatients.length;
    const criticalPatients = myPatients.filter(p => p.condition === 'Critical').length;
    const stablePatients = myPatients.filter(p => p.condition === 'Stable').length;
    const improvingPatients = myPatients.filter(p => p.condition === 'Improving').length;
    const todayAppointments = appointments.length;
    const urgentAppointments = appointments.filter(a => a.urgency === 'high').length;
    
    const patientSatisfactionRate = 98.5; // Mock data
    const consultationEfficiency = 92.3; // Mock data
    
    return {
      totalPatients,
      criticalPatients,
      stablePatients,
      improvingPatients,
      todayAppointments,
      urgentAppointments,
      patientSatisfactionRate,
      consultationEfficiency
    };
  }, [myPatients]);

  const statCards = [
    {
      title: "My Patients",
      value: doctorMetrics.totalPatients.toString(),
      subtitle: `${doctorMetrics.criticalPatients} critical cases`,
      icon: Users,
      trend: "+5.2%",
      trendUp: true,
      color: "from-blue-400 to-cyan-400",
      progress: 85
    },
    {
      title: "Today's Schedule",
      value: doctorMetrics.todayAppointments.toString(),
      subtitle: `${doctorMetrics.urgentAppointments} urgent`,
      icon: Calendar,
      trend: "+2.1%",
      trendUp: true,
      color: "from-green-400 to-emerald-400",
      progress: 75
    },
    {
      title: "Patient Satisfaction",
      value: `${doctorMetrics.patientSatisfactionRate}%`,
      subtitle: "Above hospital average",
      icon: Heart,
      trend: "+1.8%",
      trendUp: true,
      color: "from-pink-400 to-red-400",
      progress: doctorMetrics.patientSatisfactionRate
    },
    {
      title: "Consultation Efficiency",
      value: `${doctorMetrics.consultationEfficiency}%`,
      subtitle: "Time management score",
      icon: Activity,
      trend: "+3.4%",
      trendUp: true,
      color: "from-purple-400 to-indigo-400",
      progress: doctorMetrics.consultationEfficiency
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default: return 'bg-green-500/10 text-green-600 border-green-200';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch(condition) {
      case 'Critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-xl">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold nubenta-gradient-text">
                Clinical Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {loggedInDoctor}
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
          <Badge className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            Elite Doctor
          </Badge>
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

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <PatientStatusChart patients={myPatients}/>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <DoctorAdmissionsChart />
        </div>
      </div>

      {/* Today's Appointments */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Today's Appointments
              </CardTitle>
              <CardDescription>Your schedule for today - {currentTime.toLocaleDateString()}</CardDescription>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-1" />
              Add Appointment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
           <div className="space-y-6">
            {appointments.map((appt, index) => (
              <div 
                key={appt.patient} 
                className="flex gap-4 relative p-4 rounded-lg border bg-background/50 hover:bg-accent/50 transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="mb-2 ring-2 ring-primary/20">
                          <AvatarImage src={`https://placehold.co/40x40.png?text=${appt.avatar}`} data-ai-hint="person" />
                          <AvatarFallback className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white font-semibold">
                            {appt.avatar}
                          </AvatarFallback>
                      </Avatar>
                      {getConditionIcon(appt.condition)}
                    </div>
                    {index < appointments.length - 1 && (
                        <div className="w-px h-8 bg-border"></div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-lg">{appt.patient}</p>
                              <Badge 
                                className={getUrgencyColor(appt.urgency)}
                                variant="outline"
                              >
                                {appt.urgency} priority
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appt.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {appt.reason}
                              </div>
                              <div className="flex items-center gap-1">
                                <Thermometer className="w-4 h-4" />
                                {appt.condition}
                              </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Brain className="mr-1 h-4 w-4" />
                            Notes
                          </Button>
                          <Button size="sm" asChild className="bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-white">
                             <Link href={`/doctor/patients/${appt.patientId}`}>
                                  <User className="mr-1 h-4 w-4" />
                                  View Patient
                                  <ArrowRight className="ml-1 h-4 w-4" />
                              </Link>
                          </Button>
                        </div>
                    </div>
                </div>
              </div>
            ))}
           </div>
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-3xl"></div>
        
        <Card className="relative border-0 shadow-2xl bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-xl overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-2xl animate-float [animation-delay:2s]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[size:30px_30px] opacity-20"></div>
          </div>
          
          {/* Header */}
          <CardHeader className="relative text-center pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl shadow-lg animate-glow mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Quick Clinical Actions
            </CardTitle>
            <CardDescription className="text-white/70 text-lg">
              Essential medical tools at your fingertips
            </CardDescription>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"></div>
          </CardHeader>
          
          <CardContent className="relative pb-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              
              {/* New Patient Card */}
              <div className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500/90 to-cyan-500/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 group-hover:scale-[1.05] group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">New Patient</h3>
                      <p className="text-sm text-white/80">Register new patient records</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-white/60">
                        <Users className="w-3 h-3" />
                        <span>Patient Registration</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/60 rounded-full animate-pulse [animation-delay:1s]"></div>
                </div>
              </div>

              {/* Prescriptions Card */}
              <div className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse [animation-delay:0.5s]"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/90 to-teal-500/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 group-hover:scale-[1.05] group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Pill className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Prescriptions</h3>
                      <p className="text-sm text-white/80">Manage medications</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-white/60">
                        <Heart className="w-3 h-3" />
                        <span>Medical Care</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/40 rounded-full animate-ping [animation-delay:0.5s]"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/60 rounded-full animate-pulse [animation-delay:1.5s]"></div>
                </div>
              </div>

              {/* Medical Notes Card */}
              <div className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse [animation-delay:1s]"></div>
                <div className="relative bg-gradient-to-br from-purple-500/90 to-pink-500/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 group-hover:scale-[1.05] group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Medical Notes</h3>
                      <p className="text-sm text-white/80">Clinical documentation</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-white/60">
                        <Brain className="w-3 h-3" />
                        <span>Documentation</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/40 rounded-full animate-ping [animation-delay:1s]"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/60 rounded-full animate-pulse [animation-delay:2s]"></div>
                </div>
              </div>

              {/* Lab Orders Card */}
              <div className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse [animation-delay:1.5s]"></div>
                <div className="relative bg-gradient-to-br from-orange-500/90 to-red-500/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 group-hover:scale-[1.05] group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Lab Orders</h3>
                      <p className="text-sm text-white/80">Request lab tests</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-white/60">
                        <Stethoscope className="w-3 h-3" />
                        <span>Diagnostics</span>
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
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">Streamlined clinical workflow</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}