"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Building2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/staff/dashboard";

  const { login, resetPassword, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResetSuccessMessage(null);
    setIsSubmitting(true);

    if (isResetMode) {
      const ok = await resetPassword(email);
      if (ok) {
        setResetSuccessMessage(
          `A password reset link has been dispatched to ${email}. Please check your clinic inbox.`
        );
      }
      setIsSubmitting(false);
      return;
    }

    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      router.replace(redirect);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top bar with back to site and theme */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-800/60 hover:bg-slate-850 px-3.5 py-2 rounded-xl border border-slate-700/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Website</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 transition-all">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-sky-600 to-teal-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-sky-600/30 mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Dr. R. Suresh
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400 mt-0.5">
              Dental Clinic &amp; Implant Centre
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Authorised Staff Practice Management Portal
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resetSuccessMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3 text-emerald-700 dark:text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{resetSuccessMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="staff-email"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Clinic Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="staff-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@drsureshdental.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>

            {!isResetMode && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="staff-password"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      clearError();
                      setResetSuccessMessage(null);
                    }}
                    className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="staff-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isResetMode ? (
                <span>Send Password Reset Instructions</span>
              ) : (
                <>
                  <span>Sign In to Staff Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {isResetMode && (
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  clearError();
                }}
                className="w-full text-xs text-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white pt-2"
              >
                Back to Sign In
              </button>
            )}
          </form>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500 space-y-1">
          <p>Restricted Healthcare Information System &bull; R.A. Puram, Chennai</p>
          <p className="text-[11px]">All administrative activities are recorded in the immutable audit log.</p>
        </div>
      </div>

      <div />
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">
          Loading Staff Authentication...
        </div>
      }
    >
      <StaffLoginForm />
    </Suspense>
  );
}

