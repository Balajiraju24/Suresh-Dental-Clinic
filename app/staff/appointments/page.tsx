"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StaffLayout } from "@/components/staff/layout/StaffLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  getPatients,
  getDentalServices,
  getStaffMembers,
} from "@/lib/data/data-service";
import { Appointment, Patient, DentalService, StaffUser } from "@/types/portal";
import {
  CalendarDays,
  Plus,
  Search,
  Stethoscope,
  Building,
  Phone,
  X,
  AlertCircle,
} from "lucide-react";

export default function StaffAppointmentsPage() {
  const { currentUser, checkPermission } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<DentalService[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDentist, setSelectedDentist] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Booking Modal
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookPatientId, setBookPatientId] = useState("");
  const [bookDentistUid, setBookDentistUid] = useState("");
  const [bookServiceId, setBookServiceId] = useState("");
  const [bookDate, setBookDate] = useState(new Date().toISOString().split("T")[0]);
  const [bookTimeSlot, setBookTimeSlot] = useState("10:00 AM");
  const [bookOperatory, setBookOperatory] = useState("Operatory 1 (Implant Suite)");
  const [bookComplaint, setBookComplaint] = useState("");
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  const dentists = useMemo(
    () => staffList.filter((s) => s.role === "dentist" || s.role === "administrator"),
    [staffList]
  );

  const loadData = useCallback(async () => {
    try {
      const [appts, pts, srvs, staff] = await Promise.all([
        getAppointments(),
        getPatients(),
        getDentalServices(),
        getStaffMembers(),
      ]);
      setAppointments(appts);
      setPatients(pts);
      setServices(srvs.filter((s) => s.isActive));
      setStaffList(staff);

      if (staff.length > 0 && !bookDentistUid) {
        const defaultDoctor = staff.find((s) => s.role === "administrator") || staff[0];
        setBookDentistUid(defaultDoctor.uid);
      }
      if (srvs.length > 0 && !bookServiceId) {
        setBookServiceId(srvs[0].id);
      }
      if (pts.length > 0 && !bookPatientId) {
        setBookPatientId(pts[0].id);
      }
    } catch (e) {
      console.error("Error loading appointments:", e);
    } finally {
      setLoading(false);
    }
  }, [bookDentistUid, bookServiceId, bookPatientId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Date filter
      if (selectedDate && apt.date !== selectedDate) {
        return false;
      }
      // Dentist filter
      if (selectedDentist !== "all" && apt.dentistUid !== selectedDentist) {
        return false;
      }
      // Status filter
      if (selectedStatus !== "all" && apt.status !== selectedStatus) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = apt.patientName.toLowerCase().includes(q);
        const matchesPhone = apt.patientPhone.includes(q);
        const matchesService = apt.serviceName.toLowerCase().includes(q);
        const matchesAptNumber = apt.appointmentNumber.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesService && !matchesAptNumber) {
          return false;
        }
      }
      return true;
    });
  }, [appointments, selectedDate, selectedDentist, selectedStatus, searchQuery]);

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: Appointment["status"]
  ) => {
    if (!currentUser) return;
    await updateAppointmentStatus(appointmentId, newStatus, {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      role: currentUser.role,
    });
    await loadData();
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setBookError(null);
    setBookSubmitting(true);

    try {
      const patient = patients.find((p) => p.id === bookPatientId);
      const dentist = staffList.find((s) => s.uid === bookDentistUid);
      const service = services.find((s) => s.id === bookServiceId);

      if (!patient || !dentist || !service) {
        setBookError("Please select a valid patient, doctor, and treatment service.");
        setBookSubmitting(false);
        return;
      }

      await createAppointment(
        {
          patientId: patient.id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          patientPhone: patient.phoneNumber,
          dentistUid: dentist.uid,
          dentistName: dentist.displayName,
          serviceId: service.id,
          serviceName: service.name,
          date: bookDate,
          timeSlot: bookTimeSlot,
          durationMinutes: service.durationMinutes,
          operatory: bookOperatory,
          status: "scheduled",
          chiefComplaint: bookComplaint.trim() || service.name,
        },
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          role: currentUser.role,
        }
      );

      setIsBookModalOpen(false);
      setBookComplaint("");
      await loadData();
    } catch (err: unknown) {
      setBookError(err instanceof Error ? err.message : "Failed to book appointment.");
    } finally {
      setBookSubmitting(false);
    }
  };

  const timeSlots = [
    // Morning Session: 10:00 AM - 12:00 PM
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    // Evening Session: 04:30 PM - 08:30 PM
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
  ];

  const canCreate = checkPermission("appointments:create");
  const canEdit = checkPermission("appointments:edit") || checkPermission("appointments:checkin");

  return (
    <StaffLayout requiredPermissions={["appointments:view"]}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Appointment Schedule &amp; Operatory Slots
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage patient consultations, periodontal surgical appointments, and dental implant slots.
            </p>
          </div>

          {canCreate && (
            <button
              type="button"
              onClick={() => {
                setIsBookModalOpen(true);
                setBookError(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Appointment</span>
            </button>
          )}
        </div>

        {/* Filters Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Date selector */}
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Dentist filter */}
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Consultant / Doctor
              </label>
              <select
                value={selectedDentist}
                onChange={(e) => setSelectedDentist(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Doctors</option>
                {dentists.map((d) => (
                  <option key={d.uid} value={d.uid}>
                    {d.displayName} ({d.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Appointment Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="checked_in">Checked In</option>
                <option value="in_progress">In Chair / In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>

            {/* Live Search */}
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Search Patient / Record
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Patient name, phone, APT #"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Date Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Quick Date:</span>
            <button
              type="button"
              onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
              className={`px-2.5 py-1 rounded-lg border font-medium ${
                selectedDate === new Date().toISOString().split("T")[0]
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setSelectedDate(tomorrow.toISOString().split("T")[0]);
              }}
              className="px-2.5 py-1 rounded-lg border font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate("")}
              className={`px-2.5 py-1 rounded-lg border font-medium ${
                !selectedDate
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              Show All Dates
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Showing {filteredAppointments.length} appointment(s)
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading appointment schedules...
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              No appointments found matching the current filters.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Time Slot Badge */}
                    <div className="w-16 shrink-0 text-center py-2 px-1 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 rounded-xl">
                      <div className="text-xs font-bold text-sky-900 dark:text-sky-300">
                        {apt.timeSlot.split(" ")[0]}
                      </div>
                      <div className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-medium">
                        {apt.timeSlot.split(" ")[1]}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        {apt.durationMinutes} min
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-slate-400">
                          {apt.appointmentNumber}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {apt.patientName}
                        </h3>
                        <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {apt.patientPhone}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                        {apt.serviceName}
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Complaint / Note: {apt.chiefComplaint}
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                        <span className="inline-flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                          {apt.dentistName}
                        </span>
                        <span>&bull;</span>
                        <span className="inline-flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {apt.operatory}
                        </span>
                        <span>&bull;</span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          {apt.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Status and actions */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                        apt.status === "scheduled"
                          ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800"
                          : apt.status === "checked_in"
                          ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800"
                          : apt.status === "in_progress"
                          ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800"
                          : apt.status === "completed"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800"
                          : apt.status === "cancelled"
                          ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {apt.status.replace("_", " ").toUpperCase()}
                    </span>

                    {canEdit && (
                      <div className="flex items-center gap-1">
                        {apt.status === "scheduled" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(apt.id, "checked_in")}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors cursor-pointer"
                          >
                            Check In
                          </button>
                        )}
                        {apt.status === "checked_in" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(apt.id, "in_progress")}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer"
                          >
                            In Chair
                          </button>
                        )}
                        {apt.status === "in_progress" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(apt.id, "completed")}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                          >
                            Complete
                          </button>
                        )}
                        {apt.status !== "completed" && apt.status !== "cancelled" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(apt.id, "cancelled")}
                            className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Book Appointment Modal */}
        {isBookModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Book Operatory Appointment
                  </h2>
                  <p className="text-xs text-slate-500">
                    Dr. R. Suresh Dental Clinic &bull; R.A. Puram, Chennai
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {bookError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bookError}</span>
                </div>
              )}

              <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
                {/* Select Patient */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Patient *
                  </label>
                  <select
                    required
                    value={bookPatientId}
                    onChange={(e) => setBookPatientId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} ({p.patientIdNumber} - {p.phoneNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Dentist */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Consulting Doctor / Specialist *
                  </label>
                  <select
                    required
                    value={bookDentistUid}
                    onChange={(e) => setBookDentistUid(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {dentists.map((d) => (
                      <option key={d.uid} value={d.uid}>
                        {d.displayName} ({d.specialization || d.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Service */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dental Procedure / Service *
                  </label>
                  <select
                    required
                    value={bookServiceId}
                    onChange={(e) => setBookServiceId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.durationMinutes} min - ₹{s.standardFee})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time Slot Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Time Slot *
                    </label>
                    <select
                      required
                      value={bookTimeSlot}
                      onChange={(e) => setBookTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      {timeSlots.map((ts) => (
                        <option key={ts} value={ts}>
                          {ts}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Operatory Selection */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operatory Suite *
                  </label>
                  <select
                    value={bookOperatory}
                    onChange={(e) => setBookOperatory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Operatory 1 (Implant Suite)">
                      Operatory 1 (Implant Suite &bull; Surgical)
                    </option>
                    <option value="Operatory 2 (Periodontal Care)">
                      Operatory 2 (Periodontal Care &bull; General)
                    </option>
                  </select>
                </div>

                {/* Chief Complaint / Notes */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Chief Complaint / Special Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={bookComplaint}
                    onChange={(e) => setBookComplaint(e.target.value)}
                    placeholder="e.g. Lower right molar pain, bleeding gums during brushing..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsBookModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookSubmitting}
                    className="px-5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {bookSubmitting ? "Booking..." : "Confirm Booking"}
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
