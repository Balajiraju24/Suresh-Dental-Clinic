/**
 * Dental Practice Data Access Service
 * Dr. R. Suresh Dental Clinic Management Portal
 * Supports both Live Cloud Firestore operations and offline local fallback.
 */

import {
  Patient,
  Appointment,
  DentalService,
  Invoice,
  PaymentReceipt,
  AuditLog,
  StaffUser,
  DashboardMetrics,
  ClinicalNote,
  StaffRole,
} from "@/types/portal";
import {
  INITIAL_STAFF,
  INITIAL_SERVICES,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_AUDIT_LOGS,
} from "./initial-data";
import { db, isFirebaseConfigured } from "../firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

// Local storage keys for offline/fallback mode
const STORAGE_KEYS = {
  STAFF: "sdc_portal_staff",
  PATIENTS: "sdc_portal_patients",
  APPOINTMENTS: "sdc_portal_appointments",
  SERVICES: "sdc_portal_services",
  INVOICES: "sdc_portal_invoices",
  PAYMENTS: "sdc_portal_payments",
  AUDIT_LOGS: "sdc_portal_audit_logs",
};

/**
 * Ensures Firestore operations never block the user interface if network stalls or is slow.
 */
function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Firestore timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * Recursively strips undefined keys and nested undefined properties from objects
 * so Firestore setDoc/updateDoc never throws "Unsupported field value: undefined".
 */
function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) return data;
  return JSON.parse(JSON.stringify(data)) as T;
}

// In-memory fallback cache for Node test and server environments
const memoryCache: Record<string, unknown[]> = {};

function getLocalData<T>(key: string, initialData: T[]): T[] {
  if (typeof window === "undefined") {
    if (!memoryCache[key]) {
      // Deep clone initialData so mutations don't corrupt the prototype
      memoryCache[key] = JSON.parse(JSON.stringify(initialData));
    }
    return memoryCache[key] as T[];
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw);
  } catch {
    return initialData;
  }
}

function setLocalData<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") {
    memoryCache[key] = JSON.parse(JSON.stringify(data));
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Local storage write error:", err);
  }
}

// ==========================================
// AUDIT LOGGING
// ==========================================
export async function logAuditEvent(
  actor: { uid: string; displayName: string; role: StaffRole },
  action: string,
  resourceType: AuditLog["resourceType"],
  resourceId: string,
  details: Record<string, unknown>
): Promise<void> {
  const auditEntry: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    actorUid: actor.uid,
    actorName: actor.displayName,
    actorRole: actor.role,
    action,
    resourceType,
    resourceId,
    details,
  };

  // 1. Immediately record in local persistent storage
  const list = getLocalData<AuditLog>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  list.unshift(auditEntry);
  setLocalData(STORAGE_KEYS.AUDIT_LOGS, list.slice(0, 500));

  // 2. Non-blocking sanitized background sync to Firestore
  if (isFirebaseConfigured() && db) {
    try {
      const cleanAudit = sanitizeForFirestore(auditEntry);
      withTimeout(setDoc(doc(db, "audit_logs", auditEntry.id), cleanAudit), 3000).catch((e) =>
        console.warn("Firestore audit write fallback:", e)
      );
    } catch (e) {
      console.warn("Firestore audit dispatch note:", e);
    }
  }
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(100));
      const snap = await withTimeout(getDocs(q), 2500);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as AuditLog);
      }
    } catch (e) {
      console.warn("Firestore getAuditLogs fallback:", e);
    }
  }
  return getLocalData<AuditLog>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
}

// ==========================================
// APPOINTMENTS
// ==========================================
export async function getAppointments(): Promise<Appointment[]> {
  const localList = getLocalData<Appointment>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "appointments"), orderBy("date", "desc"));
      const snap = await withTimeout(getDocs(q), 2500);
      if (!snap.empty) {
        const firestoreList = snap.docs.map((d) => d.data() as Appointment);
        const firestoreIds = new Set(firestoreList.map((a) => a.id));
        const pendingLocal = localList.filter((a) => !firestoreIds.has(a.id));
        const merged = [...pendingLocal, ...firestoreList];
        setLocalData(STORAGE_KEYS.APPOINTMENTS, merged);
        return merged;
      }
    } catch (e) {
      console.warn("Firestore getAppointments fallback:", e);
    }
  }
  return localList;
}

export async function createAppointment(
  data: Omit<Appointment, "id" | "appointmentNumber" | "createdAt" | "updatedAt">,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<Appointment> {
  const all = await getAppointments();
  const nextNum = 1000 + all.length + 1;
  const newAppointment: Appointment = {
    ...data,
    id: `apt-${Date.now()}`,
    appointmentNumber: `APT-2026-${nextNum}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      const cleanApt = sanitizeForFirestore(newAppointment);
      await withTimeout(setDoc(doc(db, "appointments", newAppointment.id), cleanApt), 3000);
    } catch (e) {
      console.warn("Firestore createAppointment fallback:", e);
    }
  }

  const list = getLocalData<Appointment>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  list.unshift(newAppointment);
  setLocalData(STORAGE_KEYS.APPOINTMENTS, list);

  await logAuditEvent(actor, "appointment.create", "appointment", newAppointment.id, {
    appointmentNumber: newAppointment.appointmentNumber,
    patientName: newAppointment.patientName,
    date: newAppointment.date,
    timeSlot: newAppointment.timeSlot,
    operatory: newAppointment.operatory,
  });

  return newAppointment;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: Appointment["status"],
  actor: { uid: string; displayName: string; role: StaffRole },
  cancellationReason?: string
): Promise<void> {
  const updates: Partial<Appointment> = {
    status: newStatus,
    updatedAt: new Date().toISOString(),
    ...(cancellationReason ? { cancellationReason } : {}),
  };

  if (isFirebaseConfigured() && db) {
    try {
      const cleanUpdates = sanitizeForFirestore(updates);
      await withTimeout(updateDoc(doc(db, "appointments", appointmentId), cleanUpdates), 3000);
    } catch (e) {
      console.warn("Firestore updateAppointmentStatus fallback:", e);
    }
  }

  const list = getLocalData<Appointment>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  const updated = list.map((a) => (a.id === appointmentId ? { ...a, ...updates } : a));
  setLocalData(STORAGE_KEYS.APPOINTMENTS, updated);

  await logAuditEvent(actor, `appointment.status_${newStatus}`, "appointment", appointmentId, {
    newStatus,
    cancellationReason,
  });
}

// ==========================================
// PATIENTS
// ==========================================
export async function getPatients(): Promise<Patient[]> {
  const localList = getLocalData<Patient>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "patients"), orderBy("registeredAt", "desc"));
      const snap = await withTimeout(getDocs(q), 2500);
      if (!snap.empty) {
        const firestoreList = snap.docs.map((d) => d.data() as Patient);
        const firestoreIds = new Set(firestoreList.map((p) => p.id));
        const pendingLocal = localList.filter((p) => !firestoreIds.has(p.id));
        const merged = [...pendingLocal, ...firestoreList];
        setLocalData(STORAGE_KEYS.PATIENTS, merged);
        return merged;
      }
    } catch (e) {
      console.warn("Firestore getPatients fallback:", e);
    }
  }
  return localList;
}

export async function getPatientById(id: string): Promise<Patient | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, "patients", id));
      if (snap.exists()) {
        return snap.data() as Patient;
      }
    } catch (e) {
      console.warn("Firestore getPatientById fallback:", e);
    }
  }
  const list = getLocalData<Patient>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  return list.find((p) => p.id === id) || null;
}

export async function createPatient(
  data: Omit<Patient, "id" | "patientIdNumber" | "totalVisits" | "outstandingBalance" | "clinicalNotes" | "registeredAt" | "updatedAt">,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<Patient> {
  const all = await getPatients();
  const nextNum = String(all.length + 41).padStart(4, "0");
  const newPatient: Patient = {
    ...data,
    id: `pat-${Date.now()}`,
    patientIdNumber: `SDC-2026-${nextNum}`,
    clinicalNotes: [],
    totalVisits: 0,
    outstandingBalance: 0,
    registeredAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      const cleanPatient = sanitizeForFirestore(newPatient);
      await withTimeout(setDoc(doc(db, "patients", newPatient.id), cleanPatient), 3000);
    } catch (e) {
      console.warn("Firestore createPatient fallback:", e);
    }
  }

  const list = getLocalData<Patient>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  list.unshift(newPatient);
  setLocalData(STORAGE_KEYS.PATIENTS, list);

  await logAuditEvent(actor, "patient.create", "patient", newPatient.id, {
    patientIdNumber: newPatient.patientIdNumber,
    name: `${newPatient.firstName} ${newPatient.lastName}`,
    phone: newPatient.phoneNumber,
  });

  return newPatient;
}

export async function updatePatient(
  patientId: string,
  data: Partial<Patient>,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<void> {
  const updates = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      const cleanUpdates = sanitizeForFirestore(updates);
      await withTimeout(updateDoc(doc(db, "patients", patientId), cleanUpdates), 3000);
    } catch (e) {
      console.warn("Firestore updatePatient fallback:", e);
    }
  }

  const list = getLocalData<Patient>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  const updated = list.map((p) => (p.id === patientId ? { ...p, ...updates } : p));
  setLocalData(STORAGE_KEYS.PATIENTS, updated);

  await logAuditEvent(actor, "patient.update", "patient", patientId, {
    fieldsUpdated: Object.keys(data),
  });
}

export async function deletePatient(
  patientId: string,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<void> {
  if (actor.role !== "administrator") {
    throw new Error("Unauthorized: Only clinic administrators can delete patient records.");
  }

  const patients = getLocalData<Patient>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  const targetPatient = patients.find((p) => p.id === patientId);
  if (!targetPatient) {
    throw new Error("Patient record not found.");
  }

  // 1. Remove patient from local storage
  const updatedPatients = patients.filter((p) => p.id !== patientId);
  setLocalData(STORAGE_KEYS.PATIENTS, updatedPatients);

  // 2. Clean associated appointments from local storage
  const appointments = getLocalData<Appointment>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  const updatedAppointments = appointments.filter((a) => a.patientId !== patientId);
  setLocalData(STORAGE_KEYS.APPOINTMENTS, updatedAppointments);

  // 3. Record audit log
  const auditLogs = getLocalData<AuditLog>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  const auditEntry: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    actorUid: actor.uid,
    actorName: actor.displayName,
    actorRole: actor.role,
    action: "patient.delete",
    resourceType: "patient",
    resourceId: targetPatient.id,
    details: {
      patientIdNumber: targetPatient.patientIdNumber,
      patientName: `${targetPatient.firstName} ${targetPatient.lastName}`,
      phoneNumber: targetPatient.phoneNumber,
    },
  };
  auditLogs.unshift(auditEntry);
  setLocalData(STORAGE_KEYS.AUDIT_LOGS, auditLogs.slice(0, 500));

  // 4. Non-blocking parallel background sync to Firestore
  if (isFirebaseConfigured() && db) {
    try {
      const cleanAudit = sanitizeForFirestore(auditEntry);
      Promise.allSettled([
        withTimeout(deleteDoc(doc(db, "patients", patientId)), 3000),
        withTimeout(setDoc(doc(db, "audit_logs", auditEntry.id), cleanAudit), 3000),
      ]).catch((err) => console.warn("Firestore background patient delete note:", err));
    } catch (err) {
      console.warn("Firestore background patient delete dispatch note:", err);
    }
  }
}

export async function addClinicalNote(
  patientId: string,
  noteData: Omit<ClinicalNote, "id" | "createdAt">,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<ClinicalNote> {
  const newNote: ClinicalNote = {
    ...noteData,
    id: `note-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const patient = await getPatientById(patientId);
  const updatedNotes = [newNote, ...(patient?.clinicalNotes || [])];

  await updatePatient(
    patientId,
    {
      clinicalNotes: updatedNotes,
      totalVisits: (patient?.totalVisits || 0) + 1,
    },
    actor
  );

  await logAuditEvent(actor, "patient.clinical_note_add", "patient", patientId, {
    noteId: newNote.id,
    procedureName: newNote.procedureName,
    toothNumbers: newNote.toothNumbers,
  });

  return newNote;
}

// ==========================================
// DENTAL SERVICES CATALOGUE
// ==========================================
export async function getDentalServices(): Promise<DentalService[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "services"), orderBy("code", "asc"));
      const snap = await withTimeout(getDocs(q), 2500);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as DentalService);
      }
    } catch (e) {
      console.warn("Firestore getDentalServices fallback:", e);
    }
  }
  return getLocalData<DentalService>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
}

export async function createDentalService(
  service: Omit<DentalService, "id" | "createdAt" | "updatedAt">,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<DentalService> {
  const newService: DentalService = {
    ...service,
    id: `srv-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "services", newService.id), newService);
    } catch (e) {
      console.warn("Firestore createDentalService fallback:", e);
    }
  }

  const list = getLocalData<DentalService>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  list.push(newService);
  setLocalData(STORAGE_KEYS.SERVICES, list);

  await logAuditEvent(actor, "service.create", "service", newService.id, {
    code: newService.code,
    name: newService.name,
    fee: newService.standardFee,
  });

  return newService;
}

export async function updateDentalService(
  serviceId: string,
  data: Partial<DentalService>,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<void> {
  const updates = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      await updateDoc(doc(db, "services", serviceId), updates);
    } catch (e) {
      console.warn("Firestore updateDentalService fallback:", e);
    }
  }

  const list = getLocalData<DentalService>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  const updated = list.map((s) => (s.id === serviceId ? { ...s, ...updates } : s));
  setLocalData(STORAGE_KEYS.SERVICES, updated);

  await logAuditEvent(actor, "service.update", "service", serviceId, {
    fieldsUpdated: Object.keys(data),
  });
}

// ==========================================
// BILLING & INVOICES
// ==========================================
export async function getInvoices(): Promise<Invoice[]> {
  const localList = getLocalData<Invoice>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "invoices"), orderBy("issueDate", "desc"));
      const snap = await withTimeout(getDocs(q), 2500);
      if (!snap.empty) {
        const firestoreList = snap.docs.map((d) => d.data() as Invoice);
        const firestoreIds = new Set(firestoreList.map((i) => i.id));
        const pendingLocal = localList.filter((i) => !firestoreIds.has(i.id));

        const mergedFirestore = firestoreList.map((fInv) => {
          const lInv = localList.find((l) => l.id === fInv.id);
          if (lInv && lInv.updatedAt && fInv.updatedAt) {
            return new Date(lInv.updatedAt) > new Date(fInv.updatedAt) ? lInv : fInv;
          }
          return lInv || fInv;
        });

        const merged = [...pendingLocal, ...mergedFirestore];
        setLocalData(STORAGE_KEYS.INVOICES, merged);
        return merged;
      }
    } catch (e) {
      console.warn("Firestore getInvoices fallback:", e);
    }
  }
  return localList;
}

export async function createInvoice(
  data: Omit<Invoice, "id" | "invoiceNumber" | "paidAmount" | "balanceAmount" | "createdAt" | "updatedAt">,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<Invoice> {
  const invoicesList = getLocalData<Invoice>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  const nextNum = 150 + invoicesList.length + 1;
  const newInvoice: Invoice = {
    ...data,
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-2026-${nextNum}`,
    paidAmount: 0,
    balanceAmount: data.totalAmount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1. Persist immediately to local cache
  invoicesList.unshift(newInvoice);
  setLocalData(STORAGE_KEYS.INVOICES, invoicesList);

  // 2. Update patient balance locally
  const patients = getLocalData<Patient>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  const targetPatient = patients.find((p) => p.id === newInvoice.patientId);
  let newPatientBalance = newInvoice.totalAmount;
  if (targetPatient) {
    newPatientBalance = (targetPatient.outstandingBalance || 0) + newInvoice.totalAmount;
    const updatedPatients = patients.map((p) =>
      p.id === targetPatient.id ? { ...p, outstandingBalance: newPatientBalance, updatedAt: new Date().toISOString() } : p
    );
    setLocalData(STORAGE_KEYS.PATIENTS, updatedPatients);
  }

  // 3. Record audit log locally
  const auditLogs = getLocalData<AuditLog>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  const auditEntry: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    actorUid: actor.uid,
    actorName: actor.displayName,
    actorRole: actor.role,
    action: "invoice.create",
    resourceType: "invoice",
    resourceId: newInvoice.id,
    details: {
      invoiceNumber: newInvoice.invoiceNumber,
      patientName: newInvoice.patientName,
      totalAmount: newInvoice.totalAmount,
    },
  };
  auditLogs.unshift(auditEntry);
  setLocalData(STORAGE_KEYS.AUDIT_LOGS, auditLogs.slice(0, 500));

  // 4. Non-blocking parallel background sync to Firestore
  if (isFirebaseConfigured() && db) {
    try {
      const cleanInvoice = sanitizeForFirestore(newInvoice);
      const cleanAudit = sanitizeForFirestore(auditEntry);
      Promise.allSettled([
        withTimeout(setDoc(doc(db, "invoices", newInvoice.id), cleanInvoice), 3000),
        targetPatient
          ? withTimeout(
              updateDoc(doc(db, "patients", targetPatient.id), {
                outstandingBalance: newPatientBalance,
                updatedAt: new Date().toISOString(),
              }),
              3000
            )
          : Promise.resolve(),
        withTimeout(setDoc(doc(db, "audit_logs", auditEntry.id), cleanAudit), 3000),
      ]).catch((err) => console.warn("Firestore background invoice sync note:", err));
    } catch (err) {
      console.warn("Firestore background invoice dispatch note:", err);
    }
  }

  return newInvoice;
}

export async function deleteInvoice(
  invoiceId: string,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<void> {
  if (actor.role !== "administrator") {
    throw new Error("Unauthorized: Only clinic administrators can delete invoices.");
  }

  const invoicesList = getLocalData<Invoice>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  const targetInvoice = invoicesList.find((i) => i.id === invoiceId);
  if (!targetInvoice) {
    throw new Error("Invoice record not found.");
  }

  // 1. Remove invoice from local storage
  const updatedInvoices = invoicesList.filter((i) => i.id !== invoiceId);
  setLocalData(STORAGE_KEYS.INVOICES, updatedInvoices);

  // 2. Adjust patient balance if there was an unpaid balance on this invoice
  const patients = getLocalData<Patient>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  const targetPatient = patients.find((p) => p.id === targetInvoice.patientId);
  let newPatientBalance: number | null = null;
  if (targetPatient && targetInvoice.balanceAmount > 0) {
    newPatientBalance = Math.max(0, (targetPatient.outstandingBalance || 0) - targetInvoice.balanceAmount);
    const updatedPatients = patients.map((p) =>
      p.id === targetPatient.id ? { ...p, outstandingBalance: newPatientBalance as number, updatedAt: new Date().toISOString() } : p
    );
    setLocalData(STORAGE_KEYS.PATIENTS, updatedPatients);
  }

  // 3. Record audit log
  const auditLogs = getLocalData<AuditLog>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  const auditEntry: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    actorUid: actor.uid,
    actorName: actor.displayName,
    actorRole: actor.role,
    action: "invoice.delete",
    resourceType: "invoice",
    resourceId: targetInvoice.id,
    details: {
      invoiceNumber: targetInvoice.invoiceNumber,
      patientName: targetInvoice.patientName,
      totalAmount: targetInvoice.totalAmount,
      balanceAdjusted: targetInvoice.balanceAmount,
    },
  };
  auditLogs.unshift(auditEntry);
  setLocalData(STORAGE_KEYS.AUDIT_LOGS, auditLogs.slice(0, 500));

  // 4. Non-blocking parallel background sync to Firestore
  if (isFirebaseConfigured() && db) {
    try {
      const cleanAudit = sanitizeForFirestore(auditEntry);
      Promise.allSettled([
        withTimeout(deleteDoc(doc(db, "invoices", invoiceId)), 3000),
        targetPatient && newPatientBalance !== null
          ? withTimeout(
              updateDoc(doc(db, "patients", targetPatient.id), {
                outstandingBalance: newPatientBalance,
                updatedAt: new Date().toISOString(),
              }),
              3000
            )
          : Promise.resolve(),
        withTimeout(setDoc(doc(db, "audit_logs", auditEntry.id), cleanAudit), 3000),
      ]).catch((err) => console.warn("Firestore background invoice delete note:", err));
    } catch (err) {
      console.warn("Firestore background invoice delete dispatch note:", err);
    }
  }
}

// ==========================================
// PAYMENTS & RECEIPTS
// ==========================================
export async function getPayments(): Promise<PaymentReceipt[]> {
  const localList = getLocalData<PaymentReceipt>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "payments"), orderBy("paymentDate", "desc"));
      const snap = await withTimeout(getDocs(q), 2500);
      if (!snap.empty) {
        const firestoreList = snap.docs.map((d) => d.data() as PaymentReceipt);
        const firestoreIds = new Set(firestoreList.map((p) => p.id));
        const pendingLocal = localList.filter((p) => !firestoreIds.has(p.id));
        const merged = [...pendingLocal, ...firestoreList];
        setLocalData(STORAGE_KEYS.PAYMENTS, merged);
        return merged;
      }
    } catch (e) {
      console.warn("Firestore getPayments fallback:", e);
    }
  }
  return localList;
}

export async function recordPayment(
  paymentData: Omit<PaymentReceipt, "id" | "receiptNumber" | "createdAt">,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<PaymentReceipt> {
  const paymentsList = getLocalData<PaymentReceipt>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  const nextNum = 110 + paymentsList.length + 1;
  const newPayment: PaymentReceipt = {
    ...paymentData,
    id: `rec-${Date.now()}`,
    receiptNumber: `REC-2026-${nextNum}`,
    createdAt: new Date().toISOString(),
  };

  // 1. Immediately persist payment to local cache
  paymentsList.unshift(newPayment);
  setLocalData(STORAGE_KEYS.PAYMENTS, paymentsList);

  // 2. Reconcile associated invoice immediately
  const invoices = getLocalData<Invoice>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  const targetInvoice = invoices.find((inv) => inv.id === newPayment.invoiceId);
  let invUpdates: Partial<Invoice> | null = null;
  if (targetInvoice) {
    const updatedPaid = targetInvoice.paidAmount + newPayment.amount;
    const updatedBalance = Math.max(0, targetInvoice.totalAmount - updatedPaid);
    const newStatus = updatedBalance === 0 ? "paid" : "partially_paid";

    invUpdates = {
      paidAmount: updatedPaid,
      balanceAmount: updatedBalance,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    const updatedInvoices = invoices.map((inv) =>
      inv.id === targetInvoice.id ? { ...inv, ...invUpdates } : inv
    );
    setLocalData(STORAGE_KEYS.INVOICES, updatedInvoices);
  }

  // 3. Deduct from patient's outstanding balance immediately
  const patients = getLocalData<Patient>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  const targetPatient = patients.find((p) => p.id === newPayment.patientId);
  let newPatientBalance = 0;
  if (targetPatient) {
    newPatientBalance = Math.max(0, (targetPatient.outstandingBalance || 0) - newPayment.amount);
    const updatedPatients = patients.map((p) =>
      p.id === targetPatient.id ? { ...p, outstandingBalance: newPatientBalance, updatedAt: new Date().toISOString() } : p
    );
    setLocalData(STORAGE_KEYS.PATIENTS, updatedPatients);
  }

  // 4. Record audit log locally immediately
  const auditLogs = getLocalData<AuditLog>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  const auditEntry: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    actorUid: actor.uid,
    actorName: actor.displayName,
    actorRole: actor.role,
    action: "payment.record",
    resourceType: "payment",
    resourceId: newPayment.id,
    details: {
      receiptNumber: newPayment.receiptNumber,
      amount: newPayment.amount,
      invoiceId: newPayment.invoiceId,
      method: newPayment.paymentMethod,
      reference: newPayment.transactionReference,
    },
  };
  auditLogs.unshift(auditEntry);
  setLocalData(STORAGE_KEYS.AUDIT_LOGS, auditLogs.slice(0, 500));

  // 5. Non-blocking parallel background sync to Cloud Firestore
  if (isFirebaseConfigured() && db) {
    try {
      const cleanPayment = sanitizeForFirestore(newPayment);
      const cleanInvUpdates = invUpdates ? sanitizeForFirestore(invUpdates) : null;
      const cleanAudit = sanitizeForFirestore(auditEntry);
      Promise.allSettled([
        withTimeout(setDoc(doc(db, "payments", newPayment.id), cleanPayment), 3000),
        targetInvoice && cleanInvUpdates
          ? withTimeout(updateDoc(doc(db, "invoices", targetInvoice.id), cleanInvUpdates), 3000)
          : Promise.resolve(),
        targetPatient
          ? withTimeout(
              updateDoc(doc(db, "patients", targetPatient.id), {
                outstandingBalance: newPatientBalance,
                updatedAt: new Date().toISOString(),
              }),
              3000
            )
          : Promise.resolve(),
        withTimeout(setDoc(doc(db, "audit_logs", auditEntry.id), cleanAudit), 3000),
      ]).catch((err) => console.warn("Firestore background payment sync note:", err));
    } catch (err) {
      console.warn("Firestore background payment dispatch note:", err);
    }
  }

  return newPayment;
}

// ==========================================
// STAFF & TEAM MANAGEMENT
// ==========================================
export async function getStaffMembers(): Promise<StaffUser[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "staff"), orderBy("createdAt", "asc"));
      const snap = await withTimeout(getDocs(q), 2500);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as StaffUser);
      }
    } catch (e) {
      console.warn("Firestore getStaffMembers fallback:", e);
    }
  }
  return getLocalData<StaffUser>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
}

export async function createStaffMember(
  data: Omit<StaffUser, "uid" | "createdAt" | "updatedAt">,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<StaffUser> {
  const newStaff: StaffUser = {
    ...data,
    uid: `staff-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "staff", newStaff.uid), newStaff);
    } catch (e) {
      console.warn("Firestore createStaffMember fallback:", e);
    }
  }

  const list = getLocalData<StaffUser>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  list.push(newStaff);
  setLocalData(STORAGE_KEYS.STAFF, list);

  await logAuditEvent(actor, "staff.create", "staff", newStaff.uid, {
    email: newStaff.email,
    name: newStaff.displayName,
    role: newStaff.role,
  });

  return newStaff;
}

export async function updateStaffStatus(
  uid: string,
  isActive: boolean,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<void> {
  const updates = { isActive, updatedAt: new Date().toISOString() };

  if (isFirebaseConfigured() && db) {
    try {
      await updateDoc(doc(db, "staff", uid), updates);
    } catch (e) {
      console.warn("Firestore updateStaffStatus fallback:", e);
    }
  }

  const list = getLocalData<StaffUser>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  const updated = list.map((s) => (s.uid === uid ? { ...s, ...updates } : s));
  setLocalData(STORAGE_KEYS.STAFF, updated);

  await logAuditEvent(actor, isActive ? "staff.activate" : "staff.deactivate", "staff", uid, {
    isActive,
  });
}

export async function updateStaffRole(
  uid: string,
  newRole: StaffRole,
  actor: { uid: string; displayName: string; role: StaffRole }
): Promise<void> {
  if (actor.role !== "administrator") {
    throw new Error("Unauthorized: Only clinic administrators can change staff roles.");
  }
  const updates = { role: newRole, updatedAt: new Date().toISOString() };

  if (isFirebaseConfigured() && db) {
    try {
      const cleanUpdates = sanitizeForFirestore(updates);
      await withTimeout(updateDoc(doc(db, "staff", uid), cleanUpdates), 3000);
    } catch (e) {
      console.warn("Firestore updateStaffRole fallback:", e);
    }
  }

  const list = getLocalData<StaffUser>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  const updated = list.map((s) => (s.uid === uid ? { ...s, ...updates } : s));
  setLocalData(STORAGE_KEYS.STAFF, updated);

  await logAuditEvent(actor, "staff.role_change", "staff", uid, {
    newRole,
  });
}

// ==========================================
// DASHBOARD METRICS CALCULATION
// ==========================================
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const appointments = await getAppointments();
  const patients = await getPatients();
  const invoices = await getInvoices();
  const payments = await getPayments();

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter((a) => a.date === today);
  const checkedInCount = todayAppointments.filter((a) => a.status === "checked_in").length;
  const inProgressCount = todayAppointments.filter((a) => a.status === "in_progress").length;
  const completedTodayCount = todayAppointments.filter((a) => a.status === "completed").length;
  const cancelledTodayCount = todayAppointments.filter((a) => a.status === "cancelled").length;
  const noShowTodayCount = todayAppointments.filter((a) => a.status === "no_show").length;

  const todayPayments = payments.filter((p) => p.paymentDate === today);
  const todayCollectionsTotal = todayPayments.reduce((acc, p) => acc + p.amount, 0);

  const totalOutstandingBalance = invoices.reduce((acc, inv) => acc + (inv.balanceAmount || 0), 0);

  return {
    todayAppointmentsCount: todayAppointments.length,
    checkedInCount,
    inProgressCount,
    completedTodayCount,
    cancelledTodayCount,
    noShowTodayCount,
    upcomingThisWeekCount: appointments.filter((a) => a.date > today).length,
    totalRegisteredPatients: patients.length,
    todayCollectionsTotal,
    totalOutstandingBalance,
  };
}
