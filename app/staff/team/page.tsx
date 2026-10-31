"use client";

import React, { useState, useEffect, useCallback } from "react";
import { StaffLayout } from "@/components/staff/layout/StaffLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getStaffMembers,
  createStaffMember,
  updateStaffStatus,
  updateStaffRole,
  deleteStaffMember,
} from "@/lib/data/data-service";
import { StaffUser, StaffRole } from "@/types/portal";
import { ROLE_METADATA } from "@/lib/auth/permissions";
import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { firebaseConfig, isFirebaseConfigured } from "@/lib/firebase/config";
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
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Send,
  KeyRound,
  ExternalLink,
  Trash2,
} from "lucide-react";

export default function StaffTeamPage() {
  const { currentUser, checkPermission, resetPassword } = useAuth();

  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Staff deletion state
  const [staffToDelete, setStaffToDelete] = useState<StaffUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  // New staff modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("receptionist");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [password, setPassword] = useState("SureshClinic2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Created account modal state
  const [createdAccountDetails, setCreatedAccountDetails] = useState<{
    name: string;
    email: string;
    role: StaffRole;
    password: string;
    resetEmailSent: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Row-level action status toast
  const [actionStatus, setActionStatus] = useState<{
    email: string;
    message: string;
    isError?: boolean;
  } | null>(null);

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

  const generateRandomPassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
    let pwd = "DrSuresh#";
    for (let i = 0; i < 4; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
  };

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

  const handleSendResetEmail = async (userEmail: string) => {
    try {
      const success = await resetPassword(userEmail);
      if (success) {
        setActionStatus({
          email: userEmail,
          message: `Password reset link dispatched to ${userEmail}. (Check inbox & spam folder)`,
        });
      } else {
        setActionStatus({
          email: userEmail,
          message: `Could not send reset link. Ensure the account exists in Firebase Authentication.`,
          isError: true,
        });
      }
    } catch (err) {
      setActionStatus({
        email: userEmail,
        message: err instanceof Error ? err.message : "Failed to send reset email.",
        isError: true,
      });
    }
    setTimeout(() => setActionStatus(null), 6000);
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

      if (password.length < 6) {
        setFormError("Password must be at least 6 characters.");
        setSubmitting(false);
        return;
      }

      let authUid: string | undefined;
      let resetEmailSent = false;

      // 1. Provision user in Firebase Authentication without logging out the current admin
      if (isFirebaseConfigured()) {
        const tempAppName = `staff-create-${Date.now()}`;
        const tempApp = initializeApp(firebaseConfig, tempAppName);
        try {
          const tempAuth = getAuth(tempApp);
          const cred = await createUserWithEmailAndPassword(tempAuth, cleanEmail, password);
          authUid = cred.user.uid;

          // Dispatch password reset email if mailbox is ready
          try {
            await sendPasswordResetEmail(tempAuth, cleanEmail);
            resetEmailSent = true;
          } catch (e) {
            console.warn("sendPasswordResetEmail skipped or failed:", e);
          }
        } catch (authErr: unknown) {
          const code = (authErr as { code?: string })?.code;
          const msg = authErr instanceof Error ? authErr.message : "Authentication error";
          if (code === "auth/email-already-in-use") {
            // Already created in Firebase Auth, proceed to link Firestore profile
            console.info("User already exists in Firebase Auth, linking clinic staff profile.");
          } else {
            throw new Error(msg);
          }
        } finally {
          try {
            await deleteApp(tempApp);
          } catch {}
        }
      }

      // 2. Create staff record in Firestore and local registry
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
        },
        authUid
      );

      // 3. Show credentials confirmation card to admin
      setCreatedAccountDetails({
        name: name.trim(),
        email: cleanEmail,
        role,
        password,
        resetEmailSent,
      });

      await loadData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to create staff account.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCreatedAccountDetails(null);
    setName("");
    setEmail("");
    setPhone("");
    setSpecialization("");
    setPassword("SureshClinic2026!");
    setFormError(null);
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete || !currentUser) return;
    setDeleting(true);
    try {
      await deleteStaffMember(staffToDelete.uid, {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        role: currentUser.role,
      });
      setActionStatus({
        email: staffToDelete.email,
        message: `Successfully removed ${staffToDelete.displayName} (${staffToDelete.email}) from staff records.`,
      });
      setStaffToDelete(null);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete staff member.";
      setActionStatus({
        email: staffToDelete.email,
        message: msg,
        isError: true,
      });
    } finally {
      setDeleting(false);
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
                setCreatedAccountDetails(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Provision Staff Account</span>
            </button>
          )}
        </div>

        {/* Action Status Toast */}
        {actionStatus && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2 shadow-xs transition-all ${
              actionStatus.isError
                ? "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
                : "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
            }`}
          >
            <div className="flex items-center gap-2">
              {actionStatus.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              )}
              <span>{actionStatus.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionStatus(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Security Rule Banner */}
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 flex items-start gap-3 text-xs text-sky-900 dark:text-sky-200">
          <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Privileged Administrative Provisioning Active</span>
            <p className="text-slate-600 dark:text-slate-400">
              Unrestricted public staff registration is strictly disabled. New accounts are provisioned directly in Firebase Authentication by authorized clinic administrators. Role permissions are enforced at the database security rule layer.
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

                    {/* Actions: Status & Reset Email */}
                    <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
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
                        <>
                          <button
                            type="button"
                            onClick={() => handleSendResetEmail(user.email)}
                            className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                            title="Dispatch password reset instructions to this email"
                          >
                            <Send className="w-3 h-3 text-sky-500" />
                            <span>Send Reset Link</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-colors ${
                              user.isActive
                                ? "text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                                : "text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                            }`}
                          >
                            {user.isActive ? "Deactivate" : "Re-activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setStaffToDelete(user)}
                            className="text-xs px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-medium cursor-pointer transition-colors flex items-center gap-1"
                            title="Permanently remove staff record"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </>
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
                    {createdAccountDetails ? "Account Provisioned" : "Provision Staff Account"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Dr. R. Suresh Dental Clinic &bull; R.A. Puram, Chennai
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {createdAccountDetails ? (
                /* Success View with Direct Credentials */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm">Staff Account Successfully Created!</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        This user is registered in Firebase Authentication and granted immediate clinic access.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Staff Member:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{createdAccountDetails.name}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Login Email:</span>
                      <span className="font-mono font-medium text-slate-900 dark:text-white">{createdAccountDetails.email}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Clinic Role:</span>
                      <span className="font-semibold text-sky-700 dark:text-sky-300 capitalize">{createdAccountDetails.role}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Assigned Password:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white px-2.5 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm select-all">
                        {createdAccountDetails.password}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
                    <strong>Direct Access Available:</strong> You can give the email and password above directly to the staff member so they can sign in immediately at <span className="font-mono">drsureshdental.com/staff/login</span>. They do not have to wait for an email to be delivered.
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        const text = `Dr. R. Suresh Dental Clinic - Staff Login\nPortal: https://drsureshdental.com/staff/login\nEmail: ${createdAccountDetails.email}\nInitial Password: ${createdAccountDetails.password}\nRole: ${createdAccountDetails.role}`;
                        navigator.clipboard.writeText(text);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 3000);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? "Copied Credentials!" : "Copy Login Info"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-5 py-2 font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <>
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
                          placeholder="staff@drsureshdental.com"
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

                    {/* Temporary Password Field */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-semibold text-slate-700 dark:text-slate-300">
                          Initial Login Password *
                        </label>
                        <button
                          type="button"
                          onClick={generateRandomPassword}
                          className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Generate Secure</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full pl-3 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        The staff member can use this password to sign in immediately at /staff/login.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Instant Access: </span>
                      Account is provisioned directly in Firebase Authentication. You will receive a copyable credentials card upon completion.
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? "Provisioning..." : "Provision Account"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
        {/* Modal: Delete Staff Member Confirmation */}
        {staffToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>Delete Staff Record</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStaffToDelete(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 space-y-2">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Are you sure you want to remove this staff profile?
                </p>
                <div className="space-y-1 text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Name:</span>{" "}
                    {staffToDelete.displayName}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Email:</span>{" "}
                    {staffToDelete.email}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Role:</span>{" "}
                    <span className="capitalize">{staffToDelete.role}</span>
                  </div>
                </div>
                <p className="text-[11px] text-red-600 dark:text-red-400 pt-1">
                  This profile will be permanently removed from the staff directory and database. This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStaffToDelete(null)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStaff}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deleting ? "Deleting..." : "Confirm Delete"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
