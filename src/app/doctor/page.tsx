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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-xl shadow-lg">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Clinical Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Welcome back, {loggedInDoctor}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4">
          <div className="text-right">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              {currentTime.toLocaleDateString()}
            </div>
            <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white px-3 py-1.5 shadow-lg">
            <Star className="w-3 h-3 mr-1" />
            <span className="text-xs sm:text-sm">Elite Doctor</span>
          </Badge>
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

      {/* Charts Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
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
      <div className="relative animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
        <Card className="border-2 shadow-lg bg-card">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg mb-4">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Quick Clinical Actions
            </CardTitle>
            <CardDescription className="text-base">
              Essential medical tools at your fingertips
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

              {/* New Patient Card */}
              <Link href="/admin/patients/create">
                <div className="group cursor-pointer p-4 rounded-xl border-2 border-border hover:border-teal-500 bg-card hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-all duration-300 hover:shadow-lg">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">New Patient</h3>
                      <p className="text-xs text-muted-foreground">Register new records</p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Prescriptions Card */}
              <Link href="/doctor/prescriptions">
                <div className="group cursor-pointer p-4 rounded-xl border-2 border-border hover:border-emerald-500 bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300 hover:shadow-lg">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">Prescriptions</h3>
                      <p className="text-xs text-muted-foreground">Manage medications</p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Medical Notes Card */}
              <div
                className="group cursor-pointer p-4 rounded-xl border-2 border-border hover:border-purple-500 bg-card hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-300 hover:shadow-lg"
                onClick={() => setNotesModal(true)}
              >
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Medical Notes</h3>
                    <p className="text-xs text-muted-foreground">Clinical documentation</p>
                  </div>
                </div>
              </div>

              {/* Lab Orders Card */}
              <Link href="/doctor/lab-orders">
                <div className="group cursor-pointer p-4 rounded-xl border-2 border-border hover:border-orange-500 bg-card hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-300 hover:shadow-lg">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">Lab Orders</h3>
                      <p className="text-xs text-muted-foreground">Request lab tests</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}