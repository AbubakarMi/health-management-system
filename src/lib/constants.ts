

import { 
    LayoutDashboard, 
    Users, 
    FlaskConical, 
    CircleDollarSign, 
    Pill, 
    HeartPulse,
    UserCog,
    BarChart3,
    Droplets,
    Boxes,
    MessageSquare,
    Banknote,
    FileText,
    LucideIcon,
    BedDouble,
    LogOut,
    Lightbulb,
    ScanFace,
    Fingerprint,
    CalendarClock,
    Hotel,
    Send,
    Microscope,
    CheckCircle,
    Database,
    Phone,
    Ambulance
} from "lucide-react";

export const roles = ["admin", "doctor", "pharmacist", "finance", "labtech"] as const;
export type Role = (typeof roles)[number];

export const roleNames: Record<Role, string> = {
    admin: "Admin",
    doctor: "Doctor",
    pharmacist: "Pharmacist",
    finance: "Finance",
    labtech: "Lab Tech",
};

export type User = {
  name: string;
  email: string;
  role: Role;
  password?: string;
}

export const users: User[] = [
    { name: 'Dr. Aisha Bello', email: 'doctor@gmail.com', role: 'doctor', password: 'password123' },
    { name: 'Yusuf Ibrahim', email: 'pharmacist@gmail.com', role: 'pharmacist', password: 'password123' },
    { name: 'Fatima Garba', email: 'finance@gmail.com', role: 'finance', password: 'password123' },
    { name: 'Khalid Ahmed', email: 'labtech@gmail.com', role: 'labtech', password: 'password123' },
    { name: 'Amina Dauda', email: 'admin@gmail.com', role: 'admin', password: 'password123' },
];

export type Message = {
    id: string;
    from: string; // Can be a name or role
    to: Role;
    content: string;
    timestamp: string;
    read: boolean;
};

const initialMessages: Message[] = [
    { 
        id: 'msg-1', 
        from: 'Yusuf Ibrahim', 
        to: 'admin', 
        content: 'We are running critically low on Paracetamol. Please order a new shipment as soon as possible.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false 
    },
    { 
        id: 'msg-2', 
        from: 'Amina Dauda', 
        to: 'pharmacist', 
        content: 'Acknowledged. I will place the order for Paracetamol immediately.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        read: true
    },
    { 
        id: 'msg-3', 
        from: 'Dr. Aisha Bello', 
        to: 'admin', 
        content: 'The new ECG machine in room 304 is malfunctioning. Please have it looked at.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true 
    }
];

class MessageManager {
    private messages: Message[];
    private subscribers: Function[] = [];

    constructor(initialMessages: Message[]) {
        this.messages = initialMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    
    getConversations(role: Role) {
        const conversations: Record<string, Message[]> = {};
        this.messages.forEach(msg => {
            if (msg.to === role) {
                if (!conversations[msg.from]) conversations[msg.from] = [];
                conversations[msg.from].push(msg);
            } else if (users.find(u => u.name === msg.from)?.role === role) {
                const recipientUser = users.find(u => u.role === msg.to);
                if (recipientUser) {
                    if (!conversations[recipientUser.name]) conversations[recipientUser.name] = [];
                    conversations[recipientUser.name].push(msg);
                }
            }
        });
        
        // Return a list of conversations, with the most recent first
        return Object.entries(conversations).map(([participant, messages]) => ({
            participant,
            messages,
            lastMessage: messages[messages.length - 1],
            unreadCount: messages.filter(m => m.to === role && !m.read).length
        })).sort((a,b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
    }

    getMessages() {
        return this.messages;
    }

    sendMessage({ from, to, content }: { from: string, to: Role, content: string }) {
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            from,
            to,
            content,
            timestamp: new Date().toISOString(),
            read: false,
        };
        this.messages.push(newMessage);
        this.notify();
    }

    markAsRead(participantName: string, role: Role) {
        this.messages.forEach(msg => {
            if (msg.from === participantName && msg.to === role && !msg.read) {
                msg.read = true;
            }
        });
        this.notify();
    }

    subscribe(callback: Function) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notify() {
        this.subscribers.forEach(callback => callback(this.messages));
    }
}

export type Notification = {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
    href: string;
};

class NotificationManager {
    private notifications: Notification[];
    private subscribers: Function[] = [];

    constructor() {
        this.notifications = [];
    }
    
    getNotifications() {
        return this.notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    createNotification(message: string, href: string) {
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            message,
            href,
            timestamp: new Date().toISOString(),
            read: false,
        };
        this.notifications.unshift(newNotification);
        this.notify();
    }
    
    markAsRead(id: string) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.notify();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.notify();
    }
    
    subscribe(callback: (notifications: Notification[]) => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notify() {
        this.subscribers.forEach(callback => callback(this.notifications));
    }
}

export type Call = {
    id: string;
    callerId: string;
    timestamp: string;
    status: 'Answered' | 'Missed';
};

class CallManager {
    private calls: Call[];
    private subscribers: Function[] = [];

    constructor() {
        this.calls = [];
    }

    getCalls() {
        return this.calls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    logCall(callerId: string, status: Call['status']) {
        const newCall: Call = {
            id: `call-${Date.now()}`,
            callerId,
            status,
            timestamp: new Date().toISOString(),
        };
        this.calls.unshift(newCall);
        this.notify();
    }

    subscribe(callback: (calls: Call[]) => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notify() {
        this.subscribers.forEach(callback => callback(this.calls));
    }
}

export type Suggestion = {
    medicine: string;
    dosage: string;
    reason: string;
    status: 'pending' | 'accepted' | 'rejected';
    rejectionReason?: string;
};

export type Prescription = {
  id: string;
  patientName: string;
  medicine: string;
  dosage: string;
  doctor: string;
  status: "Pending" | "Filled" | "Unavailable";
  price: number;
  invoiced: boolean;
  suggestion?: Suggestion;
  visitId?: string; 
};

export type MedicalHistoryEntry = {
    id: string;
    date: string;
    event: string;
    details: string;
    doctor: string;
};

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type AdmissionDetails = {
    isAdmitted: boolean;
    admissionDate: string | null;
    dischargeDate: string | null;
    roomNumber: string | null;
    bedNumber: string | null;
};

export type Patient = {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  address: string;
  email: string;
  phone: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  condition: string;
  lastVisit: string;
  bloodType: BloodType;
  assignedDoctor: string;
  clinicalSummary?: string;
  medicalHistory: MedicalHistoryEntry[];
  prescriptions: Prescription[];
  labTests: LabTest[];
  admission: AdmissionDetails;
  avatarUrl?: string;
  fingerprintId?: string;
  preferredCommunicationMethod?: 'SMS' | 'Email' | 'WhatsApp';
};


const initialPrescriptions: Prescription[] = [
    { id: 'presc-001', visitId: 'visit-musa-1', patientName: 'Musa Adebayo', medicine: 'Lisinopril', dosage: '10mg', doctor: 'Dr. Aisha Bello', status: 'Pending', price: 25.50, invoiced: false },
    { id: 'presc-002', visitId: 'visit-zainab-2', patientName: 'Zainab Lawal', medicine: 'Metformin', dosage: '500mg', doctor: 'Dr. Aisha Bello', status: 'Filled', price: 30.00, invoiced: true },
    { id: 'presc-003', visitId: 'visit-ibrahim-1', patientName: 'Ibrahim Ali', medicine: 'Amoxicillin', dosage: '250mg', doctor: 'Dr. Aisha Bello', status: 'Pending', price: 15.75, invoiced: false },
    { id: 'presc-004', visitId: 'visit-halima-1', patientName: 'Halima Abubakar', medicine: 'Ibuprofen', dosage: '200mg', doctor: 'Dr. Aisha Bello', status: 'Unavailable', price: 10.00, invoiced: true },
];

export type LabTest = {
    id: string;
    patient: string;
    test: string;
    instructions: string;
    collected: string;
    status: 'Pending' | 'Processing' | 'Completed';
    results?: string;
    price: number;
    invoiced: boolean;
    visitId?: string;
}

const initialLabTests: LabTest[] = [
    { id: 'lab-001', visitId: 'visit-bello-1', patient: 'Muhammad Bello', test: 'Complete Blood Count', instructions: 'Standard CBC panel.', collected: '2024-05-12 09:00', status: 'Pending', price: 75.00, invoiced: false },
    { id: 'lab-002', visitId: 'visit-samira-1', patient: 'Samira Umar', test: 'Lipid Panel', instructions: 'Fasting required for 12 hours prior.', collected: '2024-05-12 09:30', status: 'Completed', results: 'Total Cholesterol: 210 mg/dL, HDL: 55 mg/dL, LDL: 130 mg/dL', price: 120.00, invoiced: true },
    { id: 'lab-003', visitId: 'visit-sani-1', patient: 'Abdulkarim Sani', test: 'Basic Metabolic Panel', instructions: 'Standard BMP.', collected: '2024-05-12 10:00', status: 'Processing', price: 95.00, invoiced: false },
    { id: 'lab-004', patient: 'Amina Salisu', test: 'Urinalysis', instructions: 'Clean catch midstream sample.', collected: '2024-05-12 10:15', status: 'Pending', price: 45.00, invoiced: false },
    { id: 'lab-005', visitId: 'visit-musa-1', patient: 'Musa Adebayo', test: 'Thyroid Panel', instructions: 'TSH and T4 test.', collected: '2024-05-13 08:30', status: 'Pending', price: 110.00, invoiced: false },
    { id: 'lab-006', visitId: 'visit-zainab-1', patient: 'Zainab Lawal', test: 'Cardiac Enzymes', instructions: 'Troponin I test.', collected: '2024-05-13 08:45', status: 'Processing', price: 250.00, invoiced: false },
];

export const detailedPatients: Patient[] = [
  { 
    id: 'PM-000001-A4E',
    name: 'Musa Adebayo', 
    gender: 'Male',
    dateOfBirth: '1975-08-22',
    address: '15, Aminu Kano Crescent, Wuse II, Abuja',
    email: 'musa.adebayo@example.com',
    phone: '08012345678',
    maritalStatus: 'Married',
    condition: 'Stable', 
    lastVisit: '2024-05-10',
    bloodType: 'O+',
    assignedDoctor: 'Dr. Aisha Bello',
    clinicalSummary: 'Patient has a long-standing history of hypertension, managed with Lisinopril. Regular monitoring of blood pressure is advised. No known allergies.',
    medicalHistory: [
        { id: 'visit-musa-2', date: '2024-05-10', event: 'Follow-up Consultation', details: 'Routine check-up, vitals are normal. Continue with current medication.', doctor: 'Dr. Aisha Bello' },
        { id: 'visit-musa-1', date: '2024-03-15', event: 'Initial Diagnosis', details: 'Diagnosed with Hypertension. Prescribed Lisinopril and ordered a Thyroid Panel to check for underlying issues.', doctor: 'Dr. Aisha Bello' }
    ],
    prescriptions: initialPrescriptions.filter(p => p.patientName === 'Musa Adebayo'),
    labTests: initialLabTests.filter(t => t.patient === 'Musa Adebayo'),
    admission: { isAdmitted: false, admissionDate: null, dischargeDate: null, roomNumber: null, bedNumber: null },
    avatarUrl: "https://placehold.co/100x100.png?text=MA",
    fingerprintId: "FP_17163052321",
    preferredCommunicationMethod: 'SMS',
  },
  { 
    id: 'PF-000002-B1C',
    name: 'Zainab Lawal', 
    gender: 'Female',
    dateOfBirth: '1968-04-15',
    address: '22, Adetokunbo Ademola Crescent, Wuse II, Abuja',
    email: 'zainab.lawal@example.com',
    phone: '08023456789',
    maritalStatus: 'Widowed',
    condition: 'Critical', 
    lastVisit: '2024-05-12',
    bloodType: 'A-',
    assignedDoctor: 'Dr. Aisha Bello',
    clinicalSummary: 'Patient manages Type 2 Diabetes with Metformin. Admitted for acute cardiac symptoms. High-risk for cardiovascular events.',
    medicalHistory: [
        { id: 'visit-zainab-1', date: '2024-05-12', event: 'Emergency Admission', details: 'Admitted for severe chest pain. Cardiac enzyme test ordered.', doctor: 'Dr. Aisha Bello' },
        { id: 'visit-zainab-2', date: '2023-11-20', event: 'Diagnosis', details: 'Diagnosed with Type 2 Diabetes. Prescribed Metformin.', doctor: 'Dr. Aisha Bello' }
    ],
    prescriptions: initialPrescriptions.filter(p => p.patientName === 'Zainab Lawal'),
    labTests: initialLabTests.filter(t => t.patient === 'Zainab Lawal'),
    admission: { isAdmitted: true, admissionDate: '2024-05-12', dischargeDate: null, roomNumber: '101', bedNumber: 'A' },
    avatarUrl: "https://placehold.co/100x100.png?text=ZL",
    preferredCommunicationMethod: 'Email',
  },
  { 
    id: 'PM-000003-D9F',
    name: 'Ibrahim Ali', 
    gender: 'Male',
    dateOfBirth: '1990-11-02',
    address: '4, Kolda Link, Wuse, Abuja',
    email: 'ibrahim.ali@example.com',
    phone: '08034567890',
    maritalStatus: 'Single',
    condition: 'Improving', 
    lastVisit: '2024-05-09',
    bloodType: 'B+',
    assignedDoctor: 'Dr. Aisha Bello',
    medicalHistory: [
        { id: 'visit-ibrahim-1', date: '2024-05-09', event: 'Follow-up', details: 'Follow-up for bacterial infection. Responding well to antibiotics. Prescribed Amoxicillin.', doctor: 'Dr. Aisha Bello' },
    ],
    prescriptions: initialPrescriptions.filter(p => p.patientName === 'Ibrahim Ali'),
    labTests: initialLabTests.filter(t => t.patient === 'Ibrahim Ali'),
    admission: { isAdmitted: false, admissionDate: null, dischargeDate: null, roomNumber: null, bedNumber: null },
    avatarUrl: "https://placehold.co/100x100.png?text=IA",
    fingerprintId: "FP_17163052322",
    preferredCommunicationMethod: 'WhatsApp',
  },
  { 
    id: 'PF-000004-G2H',
    name: 'Halima Abubakar',
    gender: 'Female', 
    dateOfBirth: '1985-01-30',
    address: '10, Ladi Kwali Street, Wuse, Abuja',
    email: 'halima.abubakar@example.com',
    phone: '08045678901',
    maritalStatus: 'Married',
    condition: 'Stable', 
    lastVisit: '2024-05-11',
    bloodType: 'AB+',
    assignedDoctor: 'Dr. Aisha Bello',
     medicalHistory: [
        { id: 'visit-halima-1', date: '2024-05-11', event: 'Check-up', details: 'Complaining of seasonal allergies. Prescribed Ibuprofen for symptomatic relief.', doctor: 'Dr. Aisha Bello' },
    ],
    prescriptions: initialPrescriptions.filter(p => p.patientName === 'Halima Abubakar'),
    labTests: initialLabTests.filter(t => t.patient === 'Halima Abubakar'),
    admission: { isAdmitted: false, admissionDate: null, dischargeDate: null, roomNumber: null, bedNumber: null },
    avatarUrl: "https://placehold.co/100x100.png?text=HA",
    preferredCommunicationMethod: 'SMS',
  },
  { 
    id: 'PM-000005-K3L',
    name: 'Muhammad Bello', 
    gender: 'Male',
    dateOfBirth: '1995-06-10',
    address: '7, Libreville Street, Wuse, Abuja',
    email: 'muhammad.bello@example.com',
    phone: '08056789012',
    maritalStatus: 'Single',
    condition: 'Critical', 
    lastVisit: '2024-05-12',
    bloodType: 'O-',
    assignedDoctor: 'Dr. Aisha Bello',
     medicalHistory: [
        { id: 'visit-bello-1', date: '2024-05-12', event: 'Admission', details: 'Admitted for observation after a minor accident. Ordered a CBC.', doctor: 'Dr. Aisha Bello' },
    ],
    prescriptions: [],
    labTests: initialLabTests.filter(t => t.patient === 'Muhammad Bello'),
    admission: { isAdmitted: true, admissionDate: '2024-05-12', dischargeDate: null, roomNumber: null, bedNumber: null },
    avatarUrl: "https://placehold.co/100x100.png?text=MB",
    fingerprintId: "FP_17163052323",
    preferredCommunicationMethod: 'Email',
  },
   {
    id: 'PF-000006-R2D',
    name: 'Samira Umar',
    gender: 'Female',
    dateOfBirth: '1982-03-25',
    address: '3, Agadez Street, Wuse II, Abuja',
    email: 'samira.umar@example.com',
    phone: '08067890123',
    maritalStatus: 'Married',
    condition: 'Stable',
    lastVisit: '2024-05-14',
    bloodType: 'B-',
    assignedDoctor: 'Dr. Aisha Bello',
    medicalHistory: [
      { id: 'visit-samira-1', date: '2024-05-14', event: 'New Consultation', details: 'Initial consultation for persistent headaches. Ordered a lipid panel to rule out underlying conditions.', doctor: 'Dr. Aisha Bello' }
    ],
    prescriptions: [],
    labTests: initialLabTests.filter(t => t.patient === 'Samira Umar'),
    admission: { isAdmitted: false, admissionDate: null, dischargeDate: null, roomNumber: null, bedNumber: null },
    avatarUrl: "https://placehold.co/100x100.png?text=SU",
    preferredCommunicationMethod: 'WhatsApp',
  },
  {
    id: 'PM-000007-S1B',
    name: 'Abdulkarim Sani',
    gender: 'Male',
    dateOfBirth: '2000-07-18',
    address: '18, Dalaba Street, Wuse, Abuja',
    email: 'abdul.sani@example.com',
    phone: '08078901234',
    maritalStatus: 'Single',
    condition: 'Normal',
    lastVisit: '2024-05-15',
    bloodType: 'A+',
    assignedDoctor: 'Dr. Aisha Bello',
    medicalHistory: [
      { id: 'visit-sani-1', date: '2024-05-15', event: 'Routine Checkup', details: 'Annual physical, all vitals normal. Ordered a BMP as part of routine screening.', doctor: 'Dr. Aisha Bello' }
    ],
    prescriptions: [],
    labTests: initialLabTests.filter(t => t.patient === 'Abdulkarim Sani'),
    admission: { isAdmitted: false, admissionDate: null, dischargeDate: null, roomNumber: null, bedNumber: null },
    avatarUrl: "https://placehold.co/100x100.png?text=AS",
    fingerprintId: "FP_17163052324",
    preferredCommunicationMethod: 'SMS',
  },
   { 
    id: 'PM-000008-T9C',
    name: 'Abubakar M.I.', 
    gender: 'Male',
    dateOfBirth: '1988-02-14',
    address: '1, Sultan Abubakar Way, Wuse, Abuja',
    email: 'abubakarmi131@gmail.com',
    phone: '+2347042526971',
    maritalStatus: 'Married',
    condition: 'Stable', 
    lastVisit: '2024-05-20',
    bloodType: 'O+',
    assignedDoctor: 'Dr. Aisha Bello',
    clinicalSummary: 'New patient for routine check-up. No significant medical history reported.',
    medicalHistory: [
        { id: 'visit-abubakar-1', date: '2024-05-20', event: 'New Patient Registration', details: 'Patient registered for the first time.', doctor: 'Dr. Aisha Bello' }
    ],
    prescriptions: [],
    labTests: [],
    admission: { isAdmitted: false, admissionDate: null, dischargeDate: null, roomNumber: null, bedNumber: null },
    avatarUrl: "https://placehold.co/100x100.png?text=AM",
    preferredCommunicationMethod: 'SMS',
  }
];

export type Bed = {
    id: string; // e.g., "101-A"
    roomNumber: string;
    bedNumber: string;
    status: 'Available' | 'Occupied';
    patientId: string | null;
};

export const initialBeds: Bed[] = [
    { id: '101-A', roomNumber: '101', bedNumber: 'A', status: 'Occupied', patientId: 'PF-000002-B1C' },
    { id: '101-B', roomNumber: '101', bedNumber: 'B', status: 'Available', patientId: null },
    { id: '102-A', roomNumber: '102', bedNumber: 'A', status: 'Available', patientId: null },
    { id: '102-B', roomNumber: '102', bedNumber: 'B', status: 'Available', patientId: null },
    { id: '201-A', roomNumber: '201', bedNumber: 'A', status: 'Available', patientId: null },
    { id: '201-B', roomNumber: '201', bedNumber: 'B', status: 'Available', patientId: null },
];

class BedManager {
    private beds: Bed[];
    private subscribers: Function[] = [];

    constructor(initialBeds: Bed[]) {
        this.beds = initialBeds;
    }

    getBeds() {
        return this.beds;
    }

    getAvailableBeds() {
        return this.beds.filter(b => b.status === 'Available');
    }

    addRoom(roomNumber: string) {
        const roomExists = this.beds.some(b => b.roomNumber === roomNumber);
        if (roomExists) {
            throw new Error(`Room ${roomNumber} already exists.`);
        }
        // Add a default bed 'A' when a new room is created
        this.addBed(roomNumber, 'A');
    }

    addBed(roomNumber: string, bedNumber: string) {
        const bedId = `${roomNumber}-${bedNumber}`;
        const bedExists = this.beds.some(b => b.id === bedId);
        if (bedExists) {
            throw new Error(`Bed ${bedNumber} in Room ${roomNumber} already exists.`);
        }
        const newBed: Bed = {
            id: bedId,
            roomNumber,
            bedNumber,
            status: 'Available',
            patientId: null
        };
        this.beds.push(newBed);
        this.notify();
    }

    deleteBed(bedId: string) {
        const bedIndex = this.beds.findIndex(b => b.id === bedId);
        if (bedIndex === -1) {
            throw new Error('Bed not found.');
        }
        if (this.beds[bedIndex].status === 'Occupied') {
            throw new Error('Cannot delete an occupied bed.');
        }
        this.beds.splice(bedIndex, 1);
        this.notify();
    }

    assignBed(patientId: string, bedId: string) {
        const patient = detailedPatients.find(p => p.id === patientId);
        const bed = this.beds.find(b => b.id === bedId);

        if (patient && bed && bed.status === 'Available') {
            // Free up old bed if any
            const oldBed = this.beds.find(b => b.patientId === patientId);
            if (oldBed) {
                oldBed.status = 'Available';
                oldBed.patientId = null;
            }
            
            // Assign new bed
            bed.status = 'Occupied';
            bed.patientId = patientId;
            
            patient.admission.roomNumber = bed.roomNumber;
            patient.admission.bedNumber = bed.bedNumber;
            
            this.notify();
            patientManager.notify();
        }
    }
    
    freeUpBedForPatient(patientId: string) {
        const bed = this.beds.find(b => b.patientId === patientId);
        if (bed) {
            bed.status = 'Available';
            bed.patientId = null;
            this.notify();
        }
    }

    subscribe(callback: (beds: Bed[]) => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notify() {
        this.subscribers.forEach(callback => callback(this.beds));
    }
}

class PatientManager {
    private patients: Patient[];
    private subscribers: Function[] = [];

    constructor(initialPatients: Patient[]) {
        this.patients = initialPatients;
    }

    getPatients() {
        return this.patients;
    }

    getAdmittedPatients() {
        return this.patients.filter(p => p.admission.isAdmitted);
    }
    
    createVisit(patientId: string, event: string, details: string, doctor: string) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
            const newVisit: MedicalHistoryEntry = {
                id: `visit-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                event,
                details,
                doctor,
            };
            patient.medicalHistory.unshift(newVisit);
            this.notify();
        }
    }

    updateVisitDetails(patientId: string, visitId: string, newDetails: string) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
            const visit = patient.medicalHistory.find(v => v.id === visitId);
            if(visit) {
                visit.details = newDetails;
                this.notify();
            }
        }
    }

    updateClinicalSummary(patientId: string, newSummary: string) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
            patient.clinicalSummary = newSummary;
            this.notify();
        }
    }

    scheduleFollowUp(patientId: string, date: Date, reason: string, doctor: string) {
        const patient = this.patients.find(p => p.id === patientId);
        if(patient) {
             const followUpVisit: MedicalHistoryEntry = {
                id: `visit-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                event: "Follow-up Scheduled",
                details: `Follow-up scheduled on ${date.toISOString().split('T')[0]}. ${reason}`,
                doctor,
            };
            patient.medicalHistory.unshift(followUpVisit);
            
            const contact = patient.preferredCommunicationMethod === 'Email' ? patient.email : patient.phone;
            communicationManager.logCommunication({
                patientName: patient.name,
                patientContact: contact,
                type: 'Follow-up',
                method: patient.preferredCommunicationMethod || 'SMS',
                message: `Reminder for your follow-up on ${date.toISOString().split('T')[0]} regarding "${reason}". (PDF summary attached)`
            });
            this.notify();
        }
    }

    addNoteToLatestVisit(patientId: string, note: string) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient && patient.medicalHistory.length > 0) {
            // Appends to the details of the most recent visit
            patient.medicalHistory[0].details += `\n\n- ${note}`;
            this.notify();
        }
    }

    markPatientAsDeceased(patientId: string, doctorName: string, formalReport: string) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
            patient.condition = 'Deceased';
            
            patient.medicalHistory.unshift({
                id: `visit-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                event: "Patient Deceased",
                details: formalReport,
                doctor: doctorName
            });

            if (patient.admission.isAdmitted) {
                this.dischargePatient(patientId, true);
            }
            notificationManager.createNotification(
                `${patient.name} has been marked as deceased.`,
                `/admin/deceased`
            );
            this.notify();
        }
    }
    
    referPatient(patientId: string, doctorName: string, referralLetter: string, receivingEntity: string) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
            patient.medicalHistory.unshift({
                id: `visit-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                event: `Patient Referral to ${receivingEntity}`,
                details: referralLetter,
                doctor: doctorName
            });
            notificationManager.createNotification(
                `${patient.name} has been referred to ${receivingEntity}.`,
                `/admin/referrals`
            );
            this.notify();
        }
    }

    updatePatientCondition(patientId: string, newCondition: string, doctorName?: string) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
            const oldCondition = patient.condition;
            patient.condition = newCondition;
            
            if (doctorName) {
                const details = `Patient condition changed from ${oldCondition} to ${newCondition}.`;
                patient.medicalHistory.unshift({
                    id: `visit-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    event: "Condition Update",
                    details,
                    doctor: doctorName
                });
            }
            this.notify();
        }
    }

    admitPatient(patientId: string) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient && !patient.admission.isAdmitted && patient.condition !== 'Deceased') {
            patient.admission.isAdmitted = true;
            patient.admission.admissionDate = new Date().toISOString().split('T')[0];
            patient.medicalHistory.unshift({
                id: `visit-${Date.now()}`,
                date: patient.admission.admissionDate,
                event: "Patient Admitted",
                details: "Patient has been admitted to the hospital and is awaiting bed assignment.",
                doctor: patient.assignedDoctor
            });
            notificationManager.createNotification(`${patient.name} has been admitted.`, '/admin/admissions');
            this.notify();
        }
    }
    
    dischargePatient(patientId: string, isDeceased = false) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient && patient.admission.isAdmitted) {
            patient.admission.isAdmitted = false;
            patient.admission.dischargeDate = new Date().toISOString().split('T')[0];
            
            if (!isDeceased) {
                patient.medicalHistory.unshift({
                    id: `visit-${Date.now()}`,
                    date: patient.admission.dischargeDate,
                    event: "Patient Discharged",
                    details: `Discharged from Room ${patient.admission.roomNumber || 'N/A'} - Bed ${patient.admission.bedNumber || 'N/A'}.`,
                    doctor: patient.assignedDoctor
                });
            }

            bedManager.freeUpBedForPatient(patientId);

            patient.admission.roomNumber = null;
            patient.admission.bedNumber = null;

            this.notify();
        }
    }

    subscribe(callback: Function) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    notify() {
        this.subscribers.forEach(callback => callback(this.patients));
    }
}

export type NavLink = { 
    href: string; 
    label: string; 
    icon: LucideIcon 
};

export type NavLinkGroup = {
    label: string;
    links: NavLink[];
};

export type NavLinks = {
    [key in Role]: (NavLink | NavLinkGroup)[];
};


export const navLinks: NavLinks = {
    admin: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        {
            label: "Patient Management",
            links: [
                { href: "/admin/patients", label: "All Patients", icon: Users },
                { href: "/admin/identification", label: "Identification", icon: ScanFace },
                { href: "/admin/external-records", label: "External Records", icon: Database },
                { href: "/admin/admissions", label: "Admissions", icon: BedDouble },
                { href: "/admin/follow-ups", label: "Follow-ups", icon: CalendarClock },
                { href: "/admin/referrals", label: "Referrals", icon: Send },
                { href: "/admin/deceased", label: "Deceased Records", icon: LogOut },
            ]
        },
        {
            label: "Hospital Operations",
            links: [
                { href: "/admin/rooms", label: "Rooms & Beds", icon: Hotel },
                { href: "/admin/pharmacy", label: "Pharmacy", icon: Pill },
                { href: "/admin/lab", label: "Lab", icon: FlaskConical },
            ]
        },
        {
            label: "Pathology",
            links: [
                { href: "/admin/autopsy", label: "Case Management", icon: Microscope },
                { href: "/admin/autopsy/completed", label: "Completed Log", icon: CheckCircle },
            ]
        },
        {
            label: "Dispatch Center",
            links: [
                { href: "/admin/calls", label: "Call History", icon: Phone },
                { href: "/admin/ambulance", label: "Ambulance", icon: Ambulance },
            ]
        },
        {
            label: "Administration",
            links: [
                { href: "/admin/billing", label: "Billing", icon: CircleDollarSign },
                { href: "/admin/messages", label: "Staff Messages", icon: MessageSquare },
                { href: "/admin/communications", label: "Communications", icon: MessageSquare },
                { href: "/admin/reports", label: "Reports", icon: BarChart3 },
            ]
        },
        { href: "/admin/staff", label: "Staff", icon: UserCog },
    ],
    doctor: [
        { href: "/doctor", label: "Dashboard", icon: LayoutDashboard },
        { href: "/doctor/patients", label: "My Patients", icon: Users },
        { href: "/doctor/admissions", label: "Admissions", icon: BedDouble },
        { href: "/doctor/autopsy", label: "Autopsy Cases", icon: Microscope },
        { href: "/doctor/risk-assessment", label: "Risk Assessment", icon: HeartPulse },
        { href: "/doctor/deceased", label: "Deceased Records", icon: LogOut },
    ],
    pharmacist: [
        { href: "/pharmacist", label: "Dashboard", icon: LayoutDashboard },
        { href: "/pharmacist/inventory", label: "Inventory", icon: Boxes },
        { href: "/pharmacist/prescriptions", label: "Prescriptions", icon: FileText },
        { href: "/pharmacist/requests", label: "Requests", icon: MessageSquare },
    ],
    finance: [
        { href: "/finance", label: "Dashboard", icon: LayoutDashboard },
        { href: "/finance/invoices", label: "Manage Invoices", icon: FileText },
    ],
    labtech: [
        { href: "/labtech", label: "Dashboard", icon: LayoutDashboard },
        { href: "/labtech/tests", label: "Patient Tests", icon: Users },
        { href: "/labtech/blood-bank", label: "Blood Bank", icon: Droplets },
    ],
};

// Global state for prescriptions
class PrescriptionManager {
  private prescriptions: Prescription[];
  private subscribers: Function[] = [];

  constructor(initialPrescriptions: Prescription[]) {
    this.prescriptions = initialPrescriptions;
  }

  getPrescriptions() {
    return this.prescriptions;
  }
  
  getPatientPrescriptions(patientId: string) {
    const patient = detailedPatients.find(p => p.id === patientId);
    if (!patient) return [];
    
    // This is a simplified way to link prescriptions. In a real app, this would be a DB relation.
    return this.prescriptions.filter(p => p.patientName === patient.name);
  }
  
  updatePrescription(updatedPrescription: Prescription) {
    const index = this.prescriptions.findIndex(p => p.id === updatedPrescription.id);
    if (index !== -1) {
        this.prescriptions[index] = updatedPrescription;
        
        const patient = detailedPatients.find(p => p.name === updatedPrescription.patientName);
        if (patient) {
            const patientPrescriptionIndex = patient.prescriptions.findIndex(p => p.id === updatedPrescription.id);
            if(patientPrescriptionIndex !== -1) {
                patient.prescriptions[patientPrescriptionIndex] = updatedPrescription;
            }
        }
        this.notify();
    }
  }

  updatePrescriptionStatus(id: string, status: Prescription['status']) {
    const index = this.prescriptions.findIndex(p => p.id === id);
    if (index !== -1) {
      this.prescriptions[index].status = status;
      this.notify();
    }
  }
  
  addPrescription(prescription: Omit<Prescription, 'id' | 'price' | 'invoiced'>) {
    const patient = detailedPatients.find(p => p.name === prescription.patientName);
    if (!patient || patient.medicalHistory.length === 0) return; // Cannot add if no visits exist

    // Associate with the most recent visit
    const lastVisitId = patient.medicalHistory[0].id;

    const newPrescription: Prescription = {
        ...prescription,
        id: `presc-${Date.now()}`,
        price: Math.floor(Math.random() * 50) + 10, // Mock price
        invoiced: false,
        visitId: lastVisitId
    };
    this.prescriptions.unshift(newPrescription);
    patient.prescriptions.unshift(newPrescription);
    
    notificationManager.createNotification(
        `New prescription for ${prescription.patientName} requires attention.`,
        '/pharmacist/prescriptions'
    );
    this.notify();
    patientManager.notify(); // Notify patient manager to trigger UI updates
  }

  deletePrescription(patientId: string, prescriptionId: string) {
      this.prescriptions = this.prescriptions.filter(p => p.id !== prescriptionId);
      const patient = detailedPatients.find(p => p.id === patientId);
      if (patient) {
          patient.prescriptions = patient.prescriptions.filter(p => p.id !== prescriptionId);
      }
      this.notify();
  }
  
    addSuggestion(prescriptionId: string, suggestion: Omit<Suggestion, 'status'>, patientId: string) {
        const prescription = this.prescriptions.find(p => p.id === prescriptionId);
        if (prescription) {
            prescription.suggestion = { ...suggestion, status: 'pending' };
            notificationManager.createNotification(
                `Pharmacist suggested an alternative for ${prescription.patientName}.`,
                `/doctor/patients/${patientId}`
            );
            this.notify();
            patientManager.notify();
        }
    }

    acceptSuggestion(prescriptionId: string, patientId: string) {
        const prescription = this.prescriptions.find(p => p.id === prescriptionId);
        const patient = detailedPatients.find(p => p.id === patientId);

        if (prescription && prescription.suggestion && patient) {
            const oldMedicine = prescription.medicine;
            prescription.medicine = prescription.suggestion.medicine;
            prescription.dosage = prescription.suggestion.dosage;
            prescription.suggestion.status = 'accepted';
            
             patient.medicalHistory.unshift({
                id: `visit-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                event: 'Suggestion Accepted',
                details: `Doctor accepted suggestion to change ${oldMedicine} to ${prescription.medicine}.`,
                doctor: prescription.doctor
            });

            this.notify();
            patientManager.notify();
        }
    }

    rejectSuggestion(prescriptionId: string, reason: string, patientId: string) {
        const prescription = this.prescriptions.find(p => p.id === prescriptionId);
         const patient = detailedPatients.find(p => p.id === patientId);

        if (prescription && prescription.suggestion && patient) {
            prescription.suggestion.status = 'rejected';
            prescription.suggestion.rejectionReason = reason;

             patient.medicalHistory.unshift({
                id: `visit-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                event: 'Suggestion Rejected',
                details: `Doctor rejected suggestion. Reason: ${reason}`,
                doctor: prescription.doctor
            });
            this.notify();
            patientManager.notify();
        }
    }

  subscribe(callback: Function) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach(callback => callback(this.prescriptions));
  }
}

export const mockFinancialData = [
  { name: 'Jan', revenue: 120000, expenses: 75000 },
  { name: 'Feb', revenue: 150000, expenses: 85000 },
  { name: 'Mar', revenue: 170000, expenses: 100000 },
  { name: 'Apr', revenue: 210000, expenses: 120000 },
  { name: 'May', revenue: 180000, expenses: 110000 },
  { name: 'Jun', revenue: 220000, expenses: 130000 },
];

export const mockLabVisitsData = [
  { month: 'Jan', visits: 120 },
  { month: 'Feb', visits: 150 },
  { month: 'Mar', visits: 170 },
  { month: 'Apr', visits: 210 },
  { month: 'May', visits: 180 },
  { month: 'Jun', visits: 220 },
];

export type Medication = {
    id: string;
    name: string;
    available: number;
    lowStock: number;
    price: number;
}

const initialMedications: Medication[] = [
  { id: 'med-001', name: 'Paracetamol', available: 150, lowStock: 50, price: 500.00 },
  { id: 'med-002', name: 'Ibuprofen', available: 80, lowStock: 20, price: 750.00 },
  { id: 'med-003', name: 'Amoxicillin', available: 45, lowStock: 30, price: 1225.00 },
  { id: 'med-004', name: 'Lisinopril', available: 120, lowStock: 40, price: 2550.00 },
  { id: 'med-005', name: 'Metformin', available: 200, lowStock: 60, price: 3000.00 },
];

class MedicationManager {
    private medications: Medication[];
    private subscribers: Function[] = [];

    constructor(initialMedications: Medication[]) {
        this.medications = initialMedications;
    }

    getMedications() {
        return this.medications;
    }
    
    updateMedication(updatedMedication: Medication) {
        const index = this.medications.findIndex(m => m.id === updatedMedication.id);
        if (index !== -1) {
            this.medications[index] = updatedMedication;
            this.notify();
        }
    }

    addMedication(medication: Omit<Medication, 'id'>) {
        const newMedication: Medication = {
            ...medication,
            id: `med-${Date.now()}`,
        };
        this.medications.push(newMedication);
        this.notify();
    }
    
    deleteMedication(medicationId: string) {
        this.medications = this.medications.filter(m => m.id !== medicationId);
        this.notify();
    }

    subscribe(callback: (medications: Medication[]) => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notify() {
        this.subscribers.forEach(callback => callback(this.medications));
    }
}

class LabTestManager {
    private labTests: LabTest[];
    private subscribers: Function[] = [];

    constructor(initialTests: LabTest[]) {
        this.labTests = initialTests;
    }

    getLabTests() {
        return this.labTests;
    }

    addLabTest(testRequest: Omit<LabTest, 'id' | 'price' | 'invoiced' | 'collected' | 'status'> & { doctor: string }) {
        const patient = detailedPatients.find(p => p.name === testRequest.patient);
        if (!patient || patient.medicalHistory.length === 0) return; // Cannot add if no visits exist

    // Associate with the most recent visit
    const lastVisitId = patient.medicalHistory[0].id;
    
    const newTest: LabTest = {
      ...testRequest,
      id: `lab-${Date.now()}`,
      collected: new Date().toISOString().split("T")[0],
      status: "Pending",
      price: 0, // Price will be set by lab tech upon completion
      invoiced: false,
      visitId: lastVisitId,
    };
    this.labTests.unshift(newTest);
    patient.labTests.unshift(newTest);

    notificationManager.createNotification(
      `A new lab test for ${patient.name} has been ordered.`,
      "/labtech/tests"
    );
    this.notify();
    patientManager.notify();
  }

  updateLabTest(testId: string, updates: Partial<Omit<LabTest, "id">>) {
    const testIndex = this.labTests.findIndex((t) => t.id === testId);
    if (testIndex !== -1) {
      const originalTest = this.labTests[testIndex];
      const updatedTest = { ...originalTest, ...updates };
      this.labTests[testIndex] = updatedTest;

      // If completed, add results to medical history
      if (
        updates.status === "Completed" &&
        originalTest.status !== "Completed"
      ) {
        const patient = detailedPatients.find(
          (p) => p.name === updatedTest.patient
        );
        if (patient) {
          patient.medicalHistory.unshift({
            id: `visit-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            event: `Lab Test Results: ${updatedTest.test}`,
            details: `Results: ${updatedTest.results}`,
            doctor: "Lab",
          });
          const contact = patient.preferredCommunicationMethod === 'Email' ? patient.email : patient.phone;
          communicationManager.logCommunication({
            patientName: patient.name,
            patientContact: contact,
            type: 'Lab Result',
            method: patient.preferredCommunicationMethod || 'SMS',
            message: `Your lab results for "${updatedTest.test}" are ready.`
          });
          patientManager.notify();
        }
      }
      this.notify();
    }
  }

  subscribe(callback: (tests: LabTest[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach((callback) => callback(this.labTests));
  }
}

export type InvoiceItem = {
    id: string; // prescription or lab test id
    name: string;
    type: 'Prescription' | 'Lab Test';
    price: number;
}

export type Invoice = {
    id: string;
    patientName: string;
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Pending' | 'Overdue';
    items: InvoiceItem[];
    doctorName?: string;
}

export const initialInvoices: Invoice[] = [
    { 
        id: 'INV-001', 
        patientName: 'Musa Adebayo', 
        amount: 250.00, 
        dueDate: '2024-05-20', 
        status: 'Paid',
        doctorName: 'Dr. Aisha Bello',
        items: [
            { id: 'presc-001', name: 'Lisinopril', type: 'Prescription', price: 25.50 },
            { id: 'lab-005', name: 'Thyroid Panel', type: 'Lab Test', price: 110.00 }
        ]
    },
    { id: 'INV-002', patientName: 'Zainab Lawal', amount: 150.75, dueDate: '2024-06-01', status: 'Pending', doctorName: 'Dr. Aisha Bello', items: [] },
    { id: 'INV-003', patientName: 'Ibrahim Ali', amount: 45.50, dueDate: '2024-04-30', status: 'Paid', doctorName: 'Dr. Aisha Bello', items: [] },
    { id: 'INV-004', patientName: 'Halima Abubakar', amount: 800.00, dueDate: '2024-05-01', status: 'Overdue', doctorName: 'Dr. Aisha Bello', items: [] },
    { id: 'INV-005', patientName: 'Muhammad Bello', amount: 320.00, dueDate: '2024-06-15', status: 'Pending', doctorName: 'Dr. Aisha Bello', items: [] },
];

export type BloodUnit = {
    bloodType: BloodType;
    quantity: number; // in units
};

export const bloodBankInventory: BloodUnit[] = [
    { bloodType: 'A+', quantity: 20 },
    { bloodType: 'A-', quantity: 15 },
    { bloodType: 'B+', quantity: 18 },
    { bloodType: 'B-', quantity: 10 },
    { bloodType: 'AB+', quantity: 8 },
    { bloodType: 'AB-', quantity: 5 },
    { bloodType: 'O+', quantity: 30 },
    { bloodType: 'O-', quantity: 25 },
];
    
export type AutopsyCase = {
    id: string;
    deceasedName: string;
    dateRegistered: string;
    assignedDoctor: string;
    status: 'Awaiting Autopsy' | 'Report Pending' | 'Completed';
    pathologistNotes?: string;
    report?: string;
};

const initialAutopsyCases: AutopsyCase[] = [
    {
        id: 'AUT-001',
        deceasedName: 'John Doe (External)',
        dateRegistered: '2024-05-18',
        assignedDoctor: 'Dr. Aisha Bello',
        status: 'Report Pending',
        pathologistNotes: 'Initial findings suggest myocardial infarction. Significant blockage in the left anterior descending artery noted.',
        report: 'A post-mortem examination was performed on the body of John Doe (External). External Examination: The body is that of a well-nourished adult male. There were no signs of external injury. Internal Examination: Cardiovascular System: The heart weighed 450 grams and showed significant left ventricular hypertrophy. The left anterior descending artery showed approximately 90% stenosis. Pathological Findings: Significant coronary artery disease. Conclusion: Based on the findings, the cause of death is determined to be Acute Myocardial Infarction.'
    }
];

class AutopsyManager {
    private cases: AutopsyCase[];
    private subscribers: Function[] = [];

    constructor(initialCases: AutopsyCase[]) {
        this.cases = initialCases;
    }

    getCases() {
        return this.cases;
    }
    
    getCaseById(caseId: string) {
        return this.cases.find(c => c.id === caseId);
    }

    registerCase(caseData: Omit<AutopsyCase, 'id' | 'dateRegistered' | 'status'>) {
        const newCase: AutopsyCase = {
            ...caseData,
            id: `AUT-${String(this.cases.length + 1).padStart(3, '0')}`,
            dateRegistered: new Date().toISOString().split('T')[0],
            status: 'Awaiting Autopsy',
        };
        this.cases.unshift(newCase);
        notificationManager.createNotification(
            `New autopsy case for ${newCase.deceasedName} assigned to you.`,
            `/doctor/autopsy/${newCase.id}`
        );
        this.notify();
    }

    addReport(caseId: string, report: string, pathologistNotes: string) {
        const caseToUpdate = this.cases.find(c => c.id === caseId);
        if (caseToUpdate) {
            caseToUpdate.report = report;
            caseToUpdate.pathologistNotes = pathologistNotes;
            caseToUpdate.status = 'Report Pending';
            this.notify();
        }
    }
    
    finalizeReport(caseId: string) {
        const caseToUpdate = this.cases.find(c => c.id === caseId);
        if (caseToUpdate && caseToUpdate.status === 'Report Pending') {
            caseToUpdate.status = 'Completed';
            notificationManager.createNotification(
                `Autopsy case ${caseId} for ${caseToUpdate.deceasedName} has been completed.`,
                `/admin/autopsy/completed`
            );
            this.notify();
        }
    }
    
    subscribe(callback: (cases: AutopsyCase[]) => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notify() {
        this.subscribers.forEach(callback => callback(this.cases));
    }
}

export type Communication = {
    id: string;
    patientName: string;
    patientContact: string;
    type: 'Lab Result' | 'Follow-up';
    method: 'SMS' | 'Email' | 'WhatsApp';
    message: string;
    timestamp: string;
    status: 'Pending' | 'Sent';
};

class CommunicationManager {
    private communications: Communication[] = [];
    private subscribers: Function[] = [];

    getCommunications() {
        return this.communications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    logCommunication(data: Omit<Communication, 'id' | 'timestamp' | 'status'>) {
        const newComm: Communication = {
            ...data,
            id: `comm-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'Pending',
        };
        this.communications.unshift(newComm);
        this.notify();
    }

    markAsSent(id: string) {
        const comm = this.communications.find(c => c.id === id);
        if (comm) {
            comm.status = 'Sent';
            this.notify();
        }
    }

    subscribe(callback: (communications: Communication[]) => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notify() {
        this.subscribers.forEach(callback => callback(this.communications));
    }
}

// All manager instantiations moved here to solve initialization order errors.
export const messageManager = new MessageManager(initialMessages);
export const notificationManager = new NotificationManager();
export const callManager = new CallManager();
export const communicationManager = new CommunicationManager();
export const bedManager = new BedManager(initialBeds);
export const patientManager = new PatientManager(detailedPatients);
export const prescriptionManager = new PrescriptionManager(initialPrescriptions);
export const medicationManager = new MedicationManager(initialMedications);
export const labTestManager = new LabTestManager(initialLabTests);
export const autopsyManager = new AutopsyManager(initialAutopsyCases);

// Initialize a sample follow-up
const abubakar = detailedPatients.find(p => p.id === 'PM-000008-T9C');
if (abubakar) {
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 7); // 1 week from now
    patientManager.scheduleFollowUp(abubakar.id, followUpDate, "Review initial check-up results", abubakar.assignedDoctor);

    const testFollowUpDate = new Date();
    testFollowUpDate.setDate(testFollowUpDate.getDate() + 14); // 2 weeks from now
    patientManager.scheduleFollowUp(abubakar.id, testFollowUpDate, "Check on medication progress", abubakar.assignedDoctor);
}
    


