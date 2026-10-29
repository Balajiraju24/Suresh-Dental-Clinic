"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Permission } from "@/types/portal";
import { hasAllPermissions, ROLE_METADATA } from "@/lib/auth/permissions";
import { ShieldAlert, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
}

export function AuthGuard({ children, requiredPermissions }: AuthGuardProps) {
  const { currentUser, role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !currentUser && pathname !== "/staff/login" && pathname !== "/staff/login/") {
      const redirectUrl = `/staff/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    }
  }, [isLoading, currentUser, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Verifying clinic credentials & security clearances...
        </p>
      </div>
    );
  }

  // Not signed in
  if (!currentUser) {
    return null;
  }

  // Account deactivated check
  if (!currentUser.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-red-200 dark:border-red-900/50 p-8 text-center">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Account Deactivated
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Your staff account is currently inactive. Please contact Dr. R. Suresh or the clinic administrator to re-enable access.
          </p>
          <Link
            href="/staff/login"
            className="inline-flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Return to Staff Login
          </Link>
        </div>
      </div>
    );
  }

  // Permission authorization check
  const hasAccess = requiredPermissions ? hasAllPermissions(role, requiredPermissions) : true;

  if (!hasAccess) {
    const roleMeta = role ? ROLE_METADATA[role] : null;

    return (
      <div className="p-8 max-w-2xl mx-auto my-12">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-amber-200 dark:border-amber-900/40 p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded-full mb-3">
            Access Restricted
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Authorisation Required
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
            Your assigned role as <strong className="text-slate-900 dark:text-slate-200">{roleMeta?.label || role}</strong> does not possess clearance to view or perform operations within this section.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mb-6 font-mono bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200 dark:border-slate-700">
            Path: {pathname} | Missing: {requiredPermissions?.join(", ")}
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/staff/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Staff Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

