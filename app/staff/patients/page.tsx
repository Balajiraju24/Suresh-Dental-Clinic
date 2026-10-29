"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StaffLayout } from "@/components/staff/layout/StaffLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getPatients,
  createPatient,
  updatePatient,
  addClinicalNote,
  getAppointments,
  getInvoices,
} from "@/lib/data/data-service";
import { Patient, Appointment, Invoice, ClinicalNote } from "@/types/portal";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  FileText,
  Calendar,
  CreditCard,
  X,
  Stethoscope,
  HeartPulse,
  UserPlus,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

function PatientsContent() {
  const { currentUser, checkPermission, role } = useAuth();
  const searchParams = useSearchParams();
  const initialPatientId = searchParams.get("id");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // New Patient Modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regDob, setRegDob] = useState("1990-01-01");
  const [regGender, setRegGender] = useState<"male" | "female" | "other">("male");
  const [regBloodGroup, setRegBloodGroup] = useState("B+");
  const [regLocality, setRegLocality] = useState("Raja Annamalaipuram");
  const [regStreet, setRegStreet] = useState("");
  const [regEmergencyName, setRegEmergencyName] = useState("");
  const [regEmergencyRel, setRegEmergencyRel] = useState("");
  const [regEmergencyPhone, setRegEmergencyPhone] = useState("");
  const [regAllergies, setRegAllergies] = useState<string[]>([]);
  const [regConditions, setRegConditions] = useState<string[]>([]);
  const [regMedications, setRegMedications] = useState("");
  const [regMedicalNotes, setRegMedicalNotes] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);

  // Add Clinical Note Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteTooth, setNoteTooth] = useState("");
  const [noteProcedure, setNoteProcedure] = useState("");
  const [noteFindings, setNoteFindings] = useState("");
  const [noteTreatment, setNoteTreatment] = useState("");
  const [notePrescription, setNotePrescription] = useState("");
  const [noteNextVisit, setNoteNextVisit] = useState("");
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [pts, appts, invs] = await Promise.all([
        getPatients(),
        getAppointments(),
        getInvoices(),
      ]);
      setPatients(pts);
      setAppointments(appts);
      setInvoices(invs);

      if (initialPatientId) {
        const found = pts.find((p) => p.id === initialPatientId);
        if (found) setSelectedPatient(found);
      } else if (pts.length > 0 && !selectedPatient) {
        setSelectedPatient(pts[0]);
      }
    } catch (e) {
      console.error("Error loading patients:", e);
    } finally {
      setLoading(false);
    }
  }, [initialPatientId, selectedPatient]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered patients
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const q = searchQuery.toLowerCase();
    return patients.filter((p) => {
      const full = `${p.firstName} ${p.lastName}`.toLowerCase();
      return (
        full.includes(q) ||
        p.phoneNumber.includes(q) ||
        p.patientIdNumber.toLowerCase().includes(q)
      );
    });
  }, [patients, searchQuery]);

  // Patient Appointments & Invoices
  const patientAppointments = useMemo(() => {
    if (!selectedPatient) return [];
    return appointments.filter((a) => a.patientId === selectedPatient.id);
  }, [appointments, selectedPatient]);

  const patientInvoices = useMemo(() => {
    if (!selectedPatient) return [];
    return invoices.filter((inv) => inv.patientId === selectedPatient.id);
  }, [invoices, selectedPatient]);

  // Common Allergies & Medical Conditions for checkboxes
  const commonAllergiesList = ["Penicillin", "Amoxicillin", "Latex", "Local Anesthetic (Lignocaine)", "Sulfa drugs", "Aspirin / NSAIDs"];
  const commonConditionsList = ["Type 2 Diabetes", "Hypertension", "Bleeding Disorder", "Cardiovascular Disease", "Asthma", "Epilepsy", "Osteoporosis (Bisphosphonates)"];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setRegSubmitting(true);

    try {
      const newP = await createPatient(
        {
          firstName: regFirstName.trim(),
          lastName: regLastName.trim(),
          dateOfBirth: regDob,
          gender: regGender,
          bloodGroup: regBloodGroup,
          phoneNumber: regPhone.trim(),
          email: regEmail.trim() || undefined,
          address: {
            street: regStreet.trim() || undefined,
            locality: regLocality.trim(),
            city: "Chennai",
            postalCode: "600028",
          },
          emergencyContact: {
            name: regEmergencyName.trim(),
            relationship: regEmergencyRel.trim(),
            phone: regEmergencyPhone.trim(),
          },
          medicalHistory: {
            allergies: regAllergies,
            conditions: regConditions,
            currentMedications: regMedications.split(",").map((s) => s.trim()).filter(Boolean),
            notes: regMedicalNotes.trim() || undefined,
          },
          status: "active",
        },
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          role: currentUser.role,
        }
      );

      setIsRegisterOpen(false);
      setSelectedPatient(newP);
      // Reset form
      setRegFirstName("");
      setRegLastName("");
      setRegPhone("");
      setRegEmail("");
      setRegStreet("");
      setRegEmergencyName("");
      setRegEmergencyPhone("");
      setRegAllergies([]);
      setRegConditions([]);
      setRegMedications("");
      setRegMedicalNotes("");
      await loadData();
    } catch (err) {
      console.error("Register patient error:", err);
    } finally {
      setRegSubmitting(false);
    }
  };

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedPatient) return;
    setNoteSubmitting(true);

    try {
      await addClinicalNote(
        selectedPatient.id,
        {
          date: new Date().toISOString().split("T")[0],
          authorUid: currentUser.uid,
          authorName: currentUser.displayName,
          authorRole: currentUser.role,
          toothNumbers: noteTooth ? noteTooth.split(",").map((s) => s.trim()) : undefined,
          procedureName: noteProcedure.trim() || undefined,
          findings: noteFindings.trim(),
          treatmentRendered: noteTreatment.trim(),
          prescription: notePrescription.trim() || undefined,
          nextVisitRecommendation: noteNextVisit.trim() || undefined,
        },
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          role: currentUser.role,
        }
      );

      setIsNoteModalOpen(false);
      setNoteTooth("");
      setNoteProcedure("");
      setNoteFindings("");
      setNoteTreatment("");
      setNotePrescription("");
      setNoteNextVisit("");
      await loadData();
    } catch (err) {
      console.error("Add note error:", err);
    } finally {
      setNoteSubmitting(false);
    }
  };

  const canRegister = checkPermission("patients:create");
  const canAddClinicalNote = checkPermission("patients:clinical_notes");
  const canViewBilling = checkPermission("billing:view");

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <StaffLayout requiredPermissions={["patients:view"]}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Patient Records &amp; Clinical Charts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive patient registry, periodontal screening, medical alerts, and dental treatment records.
            </p>
          </div>

          {canRegister && (
            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Patient</span>
            </button>
          )}
        </div>

        {/* 2-Column Split: Patient List + Patient Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Patient List (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, phone, SDC #"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {filteredPatients.length} Registered Patients
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading patients...</div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No patients found.</div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredPatients.map((p) => {
                  const isSelected = selectedPatient?.id === p.id;
                  const hasMedicalAlert =
                    (p.medicalHistory?.allergies?.length || 0) > 0 ||
                    (p.medicalHistory?.conditions?.length || 0) > 0;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPatient(p)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-sky-50/80 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 shadow-xs"
                          : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100/70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {p.firstName} {p.lastName}
                        </div>
                        {hasMedicalAlert && (
                          <span
                            className="w-2 h-2 rounded-full bg-red-500 shrink-0"
                            title="Medical Alert"
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                        <span className="font-mono">{p.patientIdNumber}</span>
                        <span>{p.phoneNumber}</span>
                      </div>

                      {p.outstandingBalance > 0 && canViewBilling && (
                        <div className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
                          {formatINR(p.outstandingBalance)} outstanding
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Selected Patient Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {selectedPatient ? (
              <>
                {/* Header Profile Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                          {selectedPatient.patientIdNumber}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </h2>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {selectedPatient.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Registered on {new Date(selectedPatient.registeredAt).toLocaleDateString("en-IN")} &bull; {selectedPatient.totalVisits} clinic visits
                      </p>
                    </div>

                    {canViewBilling && selectedPatient.outstandingBalance > 0 && (
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Balance Due</div>
                        <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          {formatINR(selectedPatient.outstandingBalance)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Demographics & Contact Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Phone</span>
                      <a href={`tel:${selectedPatient.phoneNumber}`} className="font-medium text-sky-600 hover:underline">
                        {selectedPatient.phoneNumber}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Gender / DOB</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                        {selectedPatient.gender} &bull; {selectedPatient.dateOfBirth}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Blood Group</span>
                      <span className="font-medium text-red-600 dark:text-red-400 font-semibold">
                        {selectedPatient.bloodGroup || "Not recorded"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Locality</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {selectedPatient.address.locality}, {selectedPatient.address.city}
                      </span>
                    </div>
                  </div>

                  {/* CRITICAL MEDICAL ALERTS SECTION */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-2.5">
                      <HeartPulse className="w-4 h-4 text-rose-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Medical Alerts &amp; Clinical Precautions
                      </h3>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Allergies */}
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 font-medium shrink-0 w-24">Allergies:</span>
                        {selectedPatient.medicalHistory.allergies.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPatient.medicalHistory.allergies.map((a) => (
                              <span
                                key={a}
                                className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border border-red-200 dark:border-red-900"
                              >
                                ⚠ {a}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500">None reported</span>
                        )}
                      </div>

                      {/* Conditions */}
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 font-medium shrink-0 w-24">Conditions:</span>
                        {selectedPatient.medicalHistory.conditions.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPatient.medicalHistory.conditions.map((c) => (
                              <span
                                key={c}
                                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500">No chronic systemic conditions</span>
                        )}
                      </div>

                      {/* Current Medications & Clinical Notes */}
                      {selectedPatient.medicalHistory.notes && (
                        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs">
                          <span className="font-semibold">Doctor Precaution Note: </span>
                          {selectedPatient.medicalHistory.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Clinical Notes & Dental Charting */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Clinical Treatment Notes &amp; Periodontal Charting
                      </h3>
                      <p className="text-xs text-slate-500">
                        Detailed operatory notes entered by attending surgeons &bull; FDI Notation
                      </p>
                    </div>

                    {canAddClinicalNote ? (
                      <button
                        type="button"
                        onClick={() => setIsNoteModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Clinical Note</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        Clinical notes edit restricted to Dentist &amp; Admin
                      </span>
                    )}
                  </div>

                  {selectedPatient.clinicalNotes.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      No clinical notes recorded yet for this patient.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedPatient.clinicalNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {note.procedureName || "Clinical Consultation"}
                              </span>
                              {note.toothNumbers && note.toothNumbers.length > 0 && (
                                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-mono text-[10px] font-bold">
                                  Tooth: {note.toothNumbers.join(", ")}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {note.date} &bull; {note.authorName}
                            </span>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Findings: </span>
                            <span className="text-slate-600 dark:text-slate-400">{note.findings}</span>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Treatment Rendered: </span>
                            <span className="text-slate-600 dark:text-slate-400">{note.treatmentRendered}</span>
                          </div>

                          {note.prescription && (
                            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 border border-teal-200/60 dark:border-teal-900">
                              <span className="font-semibold">Rx: </span> {note.prescription}
                            </div>
                          )}

                          {note.nextVisitRecommendation && (
                            <div className="text-[11px] text-slate-500">
                              <span className="font-semibold">Recall: </span>
                              {note.nextVisitRecommendation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Patient Appointments History */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                    Appointment History ({patientAppointments.length})
                  </h3>
                  {patientAppointments.length === 0 ? (
                    <div className="text-xs text-slate-500">No appointments recorded.</div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {patientAppointments.map((a) => (
                        <div key={a.id} className="py-2.5 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {a.date} &bull; {a.timeSlot}
                            </span>
                            <div className="text-slate-500">{a.serviceName} ({a.dentistName})</div>
                          </div>
                          <span className="font-semibold uppercase text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-sm text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                Select a patient from the left column to view clinical charts and history.
              </div>
            )}
          </div>
        </div>

        {/* Register Patient Modal */}
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Register New Patient
                  </h2>
                  <p className="text-xs text-slate-500">
                    Dr. R. Suresh Dental Clinic &bull; R.A. Puram, Chennai
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Names */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="e.g. Ramesh"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="e.g. Sundaram"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                {/* Contact & DOB */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98400 12345"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={regBloodGroup}
                      onChange={(e) => setRegBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gender & Email */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Gender *
                    </label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as "male" | "female" | "other")}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                {/* Chennai Address */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Street / Flat No.
                    </label>
                    <input
                      type="text"
                      value={regStreet}
                      onChange={(e) => setRegStreet(e.target.value)}
                      placeholder="e.g. No. 12, 3rd Cross Street"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Chennai Locality *
                    </label>
                    <input
                      type="text"
                      required
                      value={regLocality}
                      onChange={(e) => setRegLocality(e.target.value)}
                      placeholder="e.g. Raja Annamalaipuram, Mandaveli"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                {/* Medical Allergies Checkboxes */}
                <div>
                  <label className="block font-semibold text-red-600 dark:text-red-400 mb-1">
                    Known Drug Allergies
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {commonAllergiesList.map((alg) => (
                      <label key={alg} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regAllergies.includes(alg)}
                          onChange={(e) => {
                            if (e.target.checked) setRegAllergies([...regAllergies, alg]);
                            else setRegAllergies(regAllergies.filter((a) => a !== alg));
                          }}
                          className="rounded text-red-600"
                        />
                        <span className="text-slate-700 dark:text-slate-300">{alg}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Medical Conditions Checkboxes */}
                <div>
                  <label className="block font-semibold text-amber-600 dark:text-amber-400 mb-1">
                    Systemic Medical Conditions
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {commonConditionsList.map((cond) => (
                      <label key={cond} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regConditions.includes(cond)}
                          onChange={(e) => {
                            if (e.target.checked) setRegConditions([...regConditions, cond]);
                            else setRegConditions(regConditions.filter((c) => c !== cond));
                          }}
                          className="rounded text-amber-600"
                        />
                        <span className="text-slate-700 dark:text-slate-300">{cond}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Medical Notes */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Medical Precaution Notes
                  </label>
                  <textarea
                    rows={2}
                    value={regMedicalNotes}
                    onChange={(e) => setRegMedicalNotes(e.target.value)}
                    placeholder="Specific clinical remarks, previous surgery, pacemaker, anticoagulants..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={regSubmitting}
                    className="px-5 py-2 font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    {regSubmitting ? "Registering..." : "Complete Registration"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Clinical Note Modal */}
        {isNoteModalOpen && selectedPatient && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Record Clinical Treatment Note
                  </h2>
                  <p className="text-xs text-slate-500">
                    Patient: {selectedPatient.firstName} {selectedPatient.lastName} ({selectedPatient.patientIdNumber})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddNoteSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tooth Number (FDI / Universal)
                    </label>
                    <input
                      type="text"
                      value={noteTooth}
                      onChange={(e) => setNoteTooth(e.target.value)}
                      placeholder="e.g. 16, 26, 46"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Procedure Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={noteProcedure}
                      onChange={(e) => setNoteProcedure(e.target.value)}
                      placeholder="e.g. Deep Subgingival Curettage"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Clinical Examination &amp; Findings *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={noteFindings}
                    onChange={(e) => setNoteFindings(e.target.value)}
                    placeholder="Pocket depths, bleeding index, mobility, periapical status..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Treatment Rendered &amp; Materials Used *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={noteTreatment}
                    onChange={(e) => setNoteTreatment(e.target.value)}
                    placeholder="e.g. Ultrasonic debridement, Gracey curettes, Povidone irrigation..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prescription / Post-Op Orders (Rx)
                  </label>
                  <textarea
                    rows={2}
                    value={notePrescription}
                    onChange={(e) => setNotePrescription(e.target.value)}
                    placeholder="e.g. Chlorhexidine mouthwash 0.2% BD, Amoxicillin 500mg TDS x 5 days..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Next Recall / Recommendation
                  </label>
                  <input
                    type="text"
                    value={noteNextVisit}
                    onChange={(e) => setNoteNextVisit(e.target.value)}
                    placeholder="e.g. Review in 10 days for stitch removal"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={noteSubmitting}
                    className="px-5 py-2 font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    {noteSubmitting ? "Saving..." : "Save Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}

export default function StaffPatientsPage() {
  return (
    <Suspense
      fallback={
        <StaffLayout requiredPermissions={["patients:view"]}>
          <div className="p-8 text-center text-sm text-slate-500">Loading patients...</div>
        </StaffLayout>
      }
    >
      <PatientsContent />
    </Suspense>
  );
}

