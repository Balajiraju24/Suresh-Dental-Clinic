"use client";

import React, { useEffect, useState, useCallback } from "react";
import { StaffLayout } from "@/components/staff/layout/StaffLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getDashboardMetrics,
  getAppointments,
  updateAppointmentStatus,
  getPatients,
} from "@/lib/data/data-service";
import { DashboardMetrics, Appointment, Patient } from "@/types/portal";
import {
  CalendarDays,
  Users,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserCheck,
  XCircle,
  PlusCircle,
  ArrowRight,
  Stethoscope,
  Building,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function StaffDashboardPage() {
  const { currentUser, role, checkPermission } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [m, appts, pts] = await Promise.all([
        getDashboardMetrics(),
        getAppointments(),
        getPatients(),
      ]);
      setMetrics(m);

      const today = new Date().toISOString().split("T")[0];
      const todayList = appts.filter((a) => a.date === today);
      setTodayAppointments(todayList);
      setRecentPatients(pts.slice(0, 5));
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800";
      case "checked_in":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800";
      case "no_show":
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const canEditAppointments = checkPermission("appointments:edit") || checkPermission("appointments:checkin");
  const canViewBilling = checkPermission("billing:view");

  return (
    <StaffLayout requiredPermissions={["appointments:view"]}>
      <div className="space-y-6">
        {/* Welcome Banner & Quick Action Buttons */}
        <div className="bg-gradient-to-r from-sky-900 via-sky-850 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
                <span>R.A. Puram Operatory</span>
                <span>&bull;</span>
                <span>Chennai</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Good day, {currentUser?.displayName}
              </h1>
              <p className="text-sm text-sky-100 mt-1 max-w-xl">
                Dr. R. Suresh Dental Clinic &amp; Implant Centre Management System. Practice operations, appointments, and patient flows are synchronized.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRefreshing(true);
                  loadData();
                }}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                <span>Refresh Data</span>
              </button>

              {checkPermission("appointments:create") && (
                <Link
                  href="/staff/appointments"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl shadow-md transition-all font-sans"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Book Slot</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* KPI Widgets Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Widget 1: Today's Appointments */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Today&apos;s Appointments</span>
              <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {metrics?.todayAppointmentsCount ?? 0}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                {metrics?.checkedInCount ?? 0} checked in
              </span>
              <span>&bull;</span>
              <span>{metrics?.completedTodayCount ?? 0} completed</span>
            </div>
          </div>

          {/* Widget 2: Registered Patients */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Patients</span>
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {metrics?.totalRegisteredPatients ?? 0}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Active periodontal &amp; implant charts
            </div>
          </div>

          {/* Widget 3: Today's Collections (Visible to authorized roles) */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Today&apos;s Collections</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {canViewBilling ? formatINR(metrics?.todayCollectionsTotal ?? 0) : "••••••"}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {canViewBilling ? "UPI, Card & Cash reconciled" : "Restricted to Accounts/Admin"}
            </div>
          </div>

          {/* Widget 4: Outstanding Receivables */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Balance</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {canViewBilling ? formatINR(metrics?.totalOutstandingBalance ?? 0) : "••••••"}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {canViewBilling ? "Pending treatment installments" : "Restricted to Accounts/Admin"}
            </div>
          </div>
        </div>

        {/* Secondary KPI Bar: Appointments Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100/70 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <Clock className="w-4 h-4 text-sky-500" />
            <span className="text-slate-600 dark:text-slate-400">Upcoming This Week:</span>
            <span className="font-bold text-slate-900 dark:text-white">{metrics?.upcomingThisWeekCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Completed Today:</span>
            <span className="font-bold text-slate-900 dark:text-white">{metrics?.completedTodayCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-slate-600 dark:text-slate-400">Cancelled:</span>
            <span className="font-bold text-slate-900 dark:text-white">{metrics?.cancelledTodayCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5">
            <UserCheck className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600 dark:text-slate-400">No-shows:</span>
            <span className="font-bold text-slate-900 dark:text-white">{metrics?.noShowTodayCount ?? 0}</span>
          </div>
        </div>

        {/* Main Content Area: Today's Appointments & Operatory Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule Table (2 Cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Today&apos;s Operatory Schedule
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {todayAppointments.length} patients scheduled for consultation and treatment
                </p>
              </div>

              <Link
                href="/staff/appointments"
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-slate-500">
                Loading schedule...
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-500">
                No appointments scheduled for today yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-14 shrink-0 text-center py-1.5 px-2 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 rounded-xl">
                        <div className="text-xs font-bold text-sky-900 dark:text-sky-300">
                          {apt.timeSlot.split(" ")[0]}
                        </div>
                        <div className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-medium">
                          {apt.timeSlot.split(" ")[1]}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {apt.patientName}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${getStatusBadge(
                              apt.status
                            )}`}
                          >
                            {apt.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                          {apt.serviceName}
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Stethoscope className="w-3 h-3 text-teal-600" />
                            {apt.dentistName}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" />
                            {apt.operatory}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Quick Action Buttons */}
                    {canEditAppointments && (
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
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
                            className="px-2 py-1 text-xs font-medium rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Operatory Status & Quick Patient Access (1 Col) */}
          <div className="space-y-6">
            {/* Operatory Suite Status */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Operatory Suites (R.A. Puram)
              </h2>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Suite 1 &bull; Implant Surgical Suite
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Sterile / Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Dedicated piezoelectric surgery unit, autoclave cycle verified.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Suite 2 &bull; Periodontal &amp; General
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      In Chair
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Ultrasonic scaling &amp; digital intraoral sensor active.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent Registered Patients
                </h2>
                <Link
                  href="/staff/patients"
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  All Patients
                </Link>
              </div>

              <div className="space-y-2">
                {recentPatients.map((p) => (
                  <Link
                    key={p.id}
                    href={`/staff/patients?id=${p.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {p.firstName} {p.lastName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {p.patientIdNumber} &bull; {p.phoneNumber}
                      </div>
                    </div>
                    {p.outstandingBalance > 0 && canViewBilling && (
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        {formatINR(p.outstandingBalance)} due
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

