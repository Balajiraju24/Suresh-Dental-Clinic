"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ROLE_METADATA } from "@/lib/auth/permissions";
import { StaffRole } from "@/types/portal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Menu,
  LogOut,
  UserCheck,
  ChevronDown,
  Clock,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface StaffHeaderProps {
  onToggleSidebar: () => void;
}

export function StaffHeader({ onToggleSidebar }: StaffHeaderProps) {
  const { currentUser, role, logout, switchDemoRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const roleMeta = role ? ROLE_METADATA[role] : null;

  const handleLogout = async () => {
    await logout();
    router.replace("/staff/login");
  };

  const handleRoleChange = (newRole: StaffRole) => {
    switchDemoRole(newRole);
    setShowRoleMenu(false);
  };

  const roles: StaffRole[] = ["administrator", "receptionist", "dentist", "accounts"];

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

        {/* Right actions: Role preview switcher, Theme toggle, Profile menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role testing switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowUserMenu(false);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Role:</span>
              <span className="font-bold text-sky-700 dark:text-sky-400">
                {roleMeta?.label || role}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  Switch Active Role Test
                </div>
                {roles.map((r) => {
                  const meta = ROLE_METADATA[r];
                  const isCurrent = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        isCurrent
                          ? "font-bold text-sky-700 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div>
                        <div>{meta.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal line-clamp-1">
                          {meta.description}
                        </div>
                      </div>
                      {isCurrent && <UserCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowRoleMenu(false);
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

