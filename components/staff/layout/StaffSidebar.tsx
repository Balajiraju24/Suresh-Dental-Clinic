"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ROLE_METADATA } from "@/lib/auth/permissions";
import { Permission } from "@/types/portal";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CreditCard,
  Stethoscope,
  BarChart3,
  UserCog,
  Settings,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission;
  badge?: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/staff/dashboard",
    icon: LayoutDashboard,
    permission: "appointments:view",
  },
  {
    title: "Appointments",
    href: "/staff/appointments",
    icon: CalendarDays,
    permission: "appointments:view",
  },
  {
    title: "Patients",
    href: "/staff/patients",
    icon: Users,
    permission: "patients:view",
  },
  {
    title: "Billing & Invoices",
    href: "/staff/billing",
    icon: CreditCard,
    permission: "billing:view",
  },
  {
    title: "Dental Services",
    href: "/staff/services",
    icon: Stethoscope,
    permission: "services:view",
  },
  {
    title: "Reports & Analytics",
    href: "/staff/reports",
    icon: BarChart3,
    permission: "billing:reports",
  },
  {
    title: "Staff & Team",
    href: "/staff/team",
    icon: UserCog,
    permission: "team:view",
  },
  {
    title: "Clinic Settings",
    href: "/staff/settings",
    icon: Settings,
    permission: "settings:view",
  },
];

interface StaffSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StaffSidebar({ isOpen, onClose }: StaffSidebarProps) {
  const pathname = usePathname();
  const { currentUser, role, checkPermission } = useAuth();

  const roleMeta = role ? ROLE_METADATA[role] : null;

  // Filter items based on signed-in user's role
  const permittedItems = SIDEBAR_ITEMS.filter((item) => {
    if (!item.permission) return true;
    return checkPermission(item.permission);
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Clinic Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/staff/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-900/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                Dr. R. Suresh
              </div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Management Portal
              </div>
            </div>
          </Link>
        </div>

        {/* Current Active Staff Badge */}
        {currentUser && (
          <div className="px-4 py-3 mx-4 mt-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-900/80 text-sky-300 border border-sky-700/50 flex items-center justify-center font-bold text-sm">
              {currentUser.displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {currentUser.displayName}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded border ${
                    roleMeta?.badgeClass || "bg-slate-700 text-slate-300"
                  }`}
                >
                  {roleMeta?.label || role}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Active Session" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Operational Modules
          </div>

          {permittedItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/staff/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sky-600 text-white shadow-md shadow-sky-900/30 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  <span>{item.title}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-sky-200" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Clinic Reference & Public Site Link */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">RA Puram Operatory</span> &bull; Chennai
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-sky-400 hover:text-sky-300 hover:underline py-1"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}

