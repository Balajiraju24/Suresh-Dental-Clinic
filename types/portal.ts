/**
 * Core Type Definitions for Dr. R. Suresh Dental Clinic Management Portal
 * RA Puram, Chennai, Tamil Nadu
 */

export type StaffRole = "administrator" | "receptionist" | "dentist" | "accounts";

export interface StaffUser {
  uid: string;
  email: string;
  displayName: string;
  role: StaffRole;
  phoneNumber?: string;
  specialization?: string; // e.g. "Lead Periodontist & Implantologist", "Associate Dental Surgeon"
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type Permission =
  // Appointments
  | "appointments:view"
  | "appointments:create"
  | "appointments:edit"
  | "appointments:cancel"
  | "appointments:checkin"
  // Patients
  | "patients:view"
  | "patients:create"
  | "patients:edit"
  | "patients:clinical_notes"
  // Billing
  | "billing:view"
  | "billing:create"
  | "billing:record_payment"
  | "billing:reports"
  // Services
  | "services:view"
  | "services:manage"
  // Staff & Team
  | "team:view"
  | "team:manage"
  // Settings & Security
  | "settings:view"
  | "settings:manage"
  | "audit:view";

export interface PatientMedicalHistory {
  allergies: string[];
  conditions: string[]; // e.g. "Diabetes", "Hypertension", "Bleeding Disorder", "Cardiovascular"
  currentMedications: string[];
  notes?: string;
  smoker?: boolean;
  pregnant?: boolean;
}

export interface ClinicalNote {
  id: string;
  date: string;
  authorUid: string;
  authorName: string;
  authorRole: StaffRole;
  toothNumbers?: string[]; // e.g. ["16", "26"] Universal / FDI notation
  procedureName?: string;
  findings: string;
  treatmentRendered: string;
  prescription?: string;
  nextVisitRecommendation?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  patientIdNumber: string; // e.g. "SDC-2026-0042"
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodGroup?: string;
  phoneNumber: string;
  email?: string;
  address: {
    street?: string;
    locality: string; // default "R.A. Puram, Chennai"
    city: string;
    postalCode?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: PatientMedicalHistory;
  clinicalNotes: ClinicalNote[];
  totalVisits: number;
  outstandingBalance: number;
  status: "active" | "inactive";
  registeredAt: string;
  updatedAt: string;
}

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Appointment {
  id: string;
  appointmentNumber: string; // e.g. "APT-2026-1082"
  patientId: string;
  patientName: string;
  patientPhone: string;
  dentistUid: string;
  dentistName: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM", "05:30 PM"
  durationMinutes: number;
  operatory: string; // e.g. "Operatory 1 (Implant Suite)", "Operatory 2 (Periodontal Care)"
  status: AppointmentStatus;
  chiefComplaint: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory =
  | "Periodontics"
  | "Implantology"
  | "General Dentistry"
  | "Endodontics"
  | "Prosthodontics"
  | "Oral Surgery"
  | "Laser Dentistry";

export interface DentalService {
  id: string;
  code: string; // e.g. "PERIO-CURET", "IMP-TITAN", "GEN-SCAL"
  name: string;
  category: ServiceCategory;
  description: string;
  standardFee: number; // in INR ₹
  durationMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = "draft" | "issued" | "partially_paid" | "paid" | "cancelled";

export interface InvoiceItem {
  id: string;
  serviceId: string;
  serviceName: string;
  toothNumber?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-0158"
  patientId: string;
  patientName: string;
  patientPhone: string;
  appointmentId?: string;
  issueDate: string; // YYYY-MM-DD
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number; // GST 0% for healthcare services in India
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
  notes?: string;
  createdByUid: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = "upi" | "cash" | "card" | "bank_transfer";

export interface PaymentReceipt {
  id: string;
  receiptNumber: string; // e.g. "REC-2026-0112"
  invoiceId: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  amount: number;
  paymentDate: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  transactionReference?: string; // e.g. UPI Ref / Card Last 4
  receivedByUid: string;
  receivedByName: string;
  notes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorUid: string;
  actorName: string;
  actorRole: StaffRole;
  action: string; // e.g. "appointment.create", "payment.record", "patient.clinical_note_add"
  resourceType: "appointment" | "patient" | "invoice" | "payment" | "staff" | "service" | "settings";
  resourceId: string;
  details: Record<string, unknown>;
}

export interface DashboardMetrics {
  todayAppointmentsCount: number;
  checkedInCount: number;
  inProgressCount: number;
  completedTodayCount: number;
  cancelledTodayCount: number;
  noShowTodayCount: number;
  upcomingThisWeekCount: number;
  totalRegisteredPatients: number;
  todayCollectionsTotal: number;
  totalOutstandingBalance: number;
}

