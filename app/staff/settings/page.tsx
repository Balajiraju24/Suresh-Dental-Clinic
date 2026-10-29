"use client";

import React, { useState, useEffect, useCallback } from "react";
import { StaffLayout } from "@/components/staff/layout/StaffLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAuditLogs } from "@/lib/data/data-service";
import { AuditLog } from "@/types/portal";
import { clinicConfig } from "@/config/clinic";
import {
  Settings,
  Shield,
  Clock,
  Building,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function StaffSettingsPage() {
  const { currentUser } = useAuth();

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [logFilter, setLogFilter] = useState("");

  const loadData = useCallback(async () => {
    try {
      const logs = await getAuditLogs();
      setAuditLogs(logs);
    } catch (e) {
      console.error("Audit log load error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredLogs = auditLogs.filter((log) => {
    if (!logFilter.trim()) return true;
    const q = logFilter.toLowerCase();
    return (
      log.actorName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.resourceType.toLowerCase().includes(q)
    );
  });

  return (
    <StaffLayout requiredPermissions={["settings:view"]}>
      <div className="space-y-6">
        {/* Top Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Clinic Settings &amp; Security Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Practice operatory parameters, consultation schedule settings, and immutable healthcare compliance audit logs.
          </p>
        </div>

        {/* Clinic Identity & Hours Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clinic Entity Details */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Practice Profile (Official)
              </h2>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Clinic Title</span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                  {clinicConfig.clinicName}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Lead Periodontist &amp; Implantologist</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {clinicConfig.doctor.fullName} ({clinicConfig.doctor.qualificationsDisplay})
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Associate Dental Surgeon</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {clinicConfig.associateDoctor.fullName} ({clinicConfig.associateDoctor.role})
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Location &amp; Landmark</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Raja Annamalaipuram (R.A. Puram), Chennai, Tamil Nadu - 600028
                </span>
              </div>
            </div>
          </div>

          {/* Consultation Timings & Operatories */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Clinical Hours &amp; Operatories
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Operatory Consultation Sessions (Mon – Sat)
                </span>
                <div className="mt-1 flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Morning Session:</span>
                  <span className="font-semibold">10:00 AM – 12:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Evening Session:</span>
                  <span className="font-semibold">04:30 PM – 08:30 PM</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px] mt-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Sunday:</span>
                  <span>Closed (Emergency on-call only)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Active Operatory Suites
                </span>
                <div className="mt-1 text-slate-600 dark:text-slate-300 space-y-1">
                  <div>&bull; <strong>Suite 1:</strong> Implant Surgical Suite (Advanced Guided Surgery)</div>
                  <div>&bull; <strong>Suite 2:</strong> Periodontal Care &amp; General Dentistry Operatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Immutable Security Audit Logs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Immutable Security Audit Trail
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Append-only log of patient record creations, payment receipts, appointment check-ins, and staff modifications.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter logs by actor, action..."
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">Loading audit trail...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No audit entries found.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto text-xs font-mono">
              {filteredLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {log.action}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {log.resourceType}:{log.resourceId}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Actor: <span className="text-slate-800 dark:text-slate-200 font-sans font-semibold">{log.actorName}</span> ({log.actorRole})
                    </div>

                    {log.details && (
                      <div className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-850 p-1.5 rounded border border-slate-200/60 dark:border-slate-800">
                        {JSON.stringify(log.details)}
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 shrink-0 font-sans">
                    {new Date(log.timestamp).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  );
}

