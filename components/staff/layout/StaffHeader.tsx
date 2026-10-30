"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ROLE_METADATA } from "@/lib/auth/permissions";
import { StaffRole } from "@/types/portal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Menu,
  LogOut,
  ChevronDown,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface StaffHeaderProps {
  onToggleSidebar: () => void;
}

export function StaffHeader({ onToggleSidebar }: StaffHeaderProps) {
  const { currentUser, role, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const roleMeta = role ? ROLE_METADATA[role] : null;

  const handleLogout = async () => {
    await logout();
    router.replace("/staff/login");
  };

  const todayStr = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Clinic Identifier */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{todayStr}</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Clinic Session Active</span>
          </div>
        </div>

        {/* Right actions: Verified Role Badge, Theme toggle, Profile menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Current Verified Role Badge (Enforced & Read-Only) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                role === "administrator"
                  ? "bg-purple-500"
                  : role === "receptionist"
                  ? "bg-blue-500"
                  : role === "dentist"
                  ? "bg-teal-500"
                  : "bg-emerald-500"
              }`}
            />
            <span className="hidden md:inline text-slate-400 dark:text-slate-500">Role:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {roleMeta?.label || role}
            </span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
              }}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                {currentUser?.displayName.charAt(0) || "S"}
              </div>
              <span className="hidden sm:inline text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                {currentUser?.displayName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {currentUser?.displayName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.email}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md border ${
                        roleMeta?.badgeClass || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {roleMeta?.label || role}
                    </span>
                  </div>
                </div>

                <div className="pt-2 px-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out of Staff Portal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

