"use client";

import React, { useState, useEffect, useCallback } from "react";
import { StaffLayout } from "@/components/staff/layout/StaffLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getStaffMembers,
  createStaffMember,
  updateStaffStatus,
  updateStaffRole,
} from "@/lib/data/data-service";
import { StaffUser, StaffRole } from "@/types/portal";
import { ROLE_METADATA } from "@/lib/auth/permissions";
import {
  UserCog,
  Plus,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  X,
  Lock,
  AlertCircle,
  UserCheck,
} from "lucide-react";

export default function StaffTeamPage() {
  const { currentUser, checkPermission } = useAuth();

  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  // New staff modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("receptionist");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data = await getStaffMembers();
      setStaffList(data);
    } catch (e) {
      console.error("Staff team load error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async (user: StaffUser) => {
    if (!currentUser) return;
    if (user.uid === currentUser.uid) {
      alert("You cannot deactivate your own active administrative account.");
      return;
    }

    await updateStaffStatus(user.uid, !user.isActive, {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      role: currentUser.role,
    });
    await loadData();
  };

  const handleRoleChange = async (user: StaffUser, newRole: StaffRole) => {
    if (!currentUser) return;
    if (user.uid === currentUser.uid) {
      alert("You cannot change the role of your currently active administrative session.");
      return;
    }

    try {
      await updateStaffRole(user.uid, newRole, {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        role: currentUser.role,
      });
      await loadData();
    } catch (err) {
      console.error("Change role error:", err);
      alert(err instanceof Error ? err.message : "Failed to change role.");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setFormError(null);
    setSubmitting(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const existing = staffList.find((s) => s.email.toLowerCase() === cleanEmail);
      if (existing) {
        setFormError("A staff account with this email address already exists.");
        setSubmitting(false);
        return;
      }

      await createStaffMember(
        {
          email: cleanEmail,
          displayName: name.trim(),
          role,
          phoneNumber: phone.trim() || undefined,
          specialization: specialization.trim() || undefined,
          isActive: true,
        },
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          role: currentUser.role,
        }
      );

      setIsModalOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setSpecialization("");
      await loadData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to create staff account.");
    } finally {
      setSubmitting(false);
    }
  };

  const canManageTeam = checkPermission("team:manage");

  return (
    <StaffLayout requiredPermissions={["team:view"]}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Clinic Staff &amp; Role-Based Access Control
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Secure staff accounts, operational role assignment, and access control governance for Dr. R. Suresh Dental Clinic.
            </p>
          </div>

          {canManageTeam && (
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
                setFormError(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Provision Staff Account</span>
            </button>
          )}
        </div>

        {/* Security Rule Banner */}
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 flex items-start gap-3 text-xs text-sky-900 dark:text-sky-200">
          <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Privileged Administrative Provisioning Active</span>
            <p className="text-slate-600 dark:text-slate-400">
              Unrestricted public staff registration is strictly disabled. New accounts are provisioned exclusively by authorized clinic administrators. Role permissions are enforced at the database security rule layer.
            </p>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading staff records...</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {staffList.map((user) => {
                const meta = ROLE_METADATA[user.role];
                const isSelf = currentUser?.uid === user.uid;

                return (
                  <div
                    key={user.uid}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 dark:border-slate-700">
                        {user.displayName.charAt(0)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {user.displayName}
                          </h3>
                          {isSelf && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                              CURRENT SESSION
                            </span>
                          )}
                          {canManageTeam && !isSelf ? (
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user, e.target.value as StaffRole)}
                              className="px-2 py-0.5 text-[10px] font-semibold rounded-md border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500"
                              title="Click to Change Staff Role"
                            >
                              <option value="administrator">Administrator</option>
                              <option value="dentist">Associate Dentist</option>
                              <option value="receptionist">Receptionist</option>
                              <option value="accounts">Accounts Manager</option>
                            </select>
                          ) : (
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${
                                meta?.badgeClass || "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {meta?.label || user.role}
                            </span>
                          )}
                        </div>

                        {user.specialization && (
                          <div className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                            {user.specialization}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {user.email}
                          </span>
                          {user.phoneNumber && (
                            <>
                              <span>&bull;</span>
                              <span className="inline-flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {user.phoneNumber}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & Toggle */}
                    <div className="flex items-center gap-3 self-end md:self-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                          user.isActive
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Deactivated</span>
                          </>
                        )}
                      </span>

                      {canManageTeam && !isSelf && (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors ${
                            user.isActive
                              ? "text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                              : "text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          }`}
                        >
                          {user.isActive ? "Deactivate" : "Re-activate"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Create Staff Account */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Provision Staff Account
                  </h2>
                  <p className="text-xs text-slate-500">
                    Dr. R. Suresh Dental Clinic &bull; R.A. Puram, Chennai
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Staff Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. K. Annamalai"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Clinic Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="staff@sureshdental.clinic"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Assigned Role *
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as StaffRole)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <option value="receptionist">Receptionist</option>
                      <option value="dentist">Dentist / Surgeon</option>
                      <option value="accounts">Accounts &amp; Billing</option>
                      <option value="administrator">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98400 99999"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Clinical Specialization
                    </label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g. Endodontist, Dental Hygienist"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Security Provisioning: </span>
                  New staff member will receive an activation email to establish their secure password. Initial access is active immediately upon confirmation.
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    {submitting ? "Provisioning..." : "Provision Account"}
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

