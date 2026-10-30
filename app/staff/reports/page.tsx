"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StaffLayout } from "@/components/staff/layout/StaffLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getInvoices,
  getPayments,
  getAppointments,
  getPatients,
} from "@/lib/data/data-service";
import { Invoice, PaymentReceipt, Appointment, Patient } from "@/types/portal";
import {
  BarChart3,
  IndianRupee,
  Calendar,
  Download,
  CreditCard,
  TrendingUp,
  PieChart,
  CheckCircle2,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

function formatMonthName(monthKey: string): string {
  if (monthKey === "all") return "All Time (Cumulative)";
  const [year, month] = monthKey.split("-").map(Number);
  if (!year || !month) return monthKey;
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function extractMonthKey(dateStr?: string): string | null {
  if (!dateStr) return null;
  if (dateStr.length >= 7) {
    return dateStr.slice(0, 7);
  }
  return null;
}

export default function StaffReportsPage() {
  const { currentUser } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentReceipt[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Current Month calculation
  const currentMonthKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const lastMonthKey = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  // Selected Month State (defaults to current month)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);

  const loadData = useCallback(async () => {
    try {
      const [invs, pays, appts, pts] = await Promise.all([
        getInvoices(),
        getPayments(),
        getAppointments(),
        getPatients(),
      ]);
      setInvoices(invs);
      setPayments(pays);
      setAppointments(appts);
      setPatients(pts);
    } catch (e) {
      console.error("Reports data error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Dynamically generate all available months from actual database activity + past 12 months
  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>();

    // Include past 12 months rolling window
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    for (let i = 0; i < 12; i++) {
      const d = new Date(curYear, curMonth - i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      monthSet.add(`${yyyy}-${mm}`);
    }

    // Include months from historical payments, invoices, and appointments
    payments.forEach((p) => {
      const k = extractMonthKey(p.paymentDate || p.createdAt);
      if (k) monthSet.add(k);
    });
    invoices.forEach((inv) => {
      const k = extractMonthKey(inv.issueDate || inv.createdAt);
      if (k) monthSet.add(k);
    });
    appointments.forEach((a) => {
      const k = extractMonthKey(a.date);
      if (k) monthSet.add(k);
    });

    // Sort chronologically descending
    return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
  }, [payments, invoices, appointments]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (selectedMonth === "all") {
      setSelectedMonth(availableMonths[0] || currentMonthKey);
      return;
    }
    const idx = availableMonths.indexOf(selectedMonth);
    if (idx < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[idx + 1]);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === "all") return;
    const idx = availableMonths.indexOf(selectedMonth);
    if (idx > 0) {
      setSelectedMonth(availableMonths[idx - 1]);
    }
  };

  const canGoNext = selectedMonth !== "all" && availableMonths.indexOf(selectedMonth) > 0;
  const canGoPrev =
    selectedMonth === "all" ||
    availableMonths.indexOf(selectedMonth) < availableMonths.length - 1;

  // Filtered Datasets based on selected month
  const filteredInvoices = useMemo(() => {
    if (selectedMonth === "all") return invoices;
    return invoices.filter((inv) => {
      const d = inv.issueDate || inv.createdAt;
      return d && d.startsWith(selectedMonth);
    });
  }, [invoices, selectedMonth]);

  const filteredPayments = useMemo(() => {
    if (selectedMonth === "all") return payments;
    return payments.filter((p) => {
      const d = p.paymentDate || p.createdAt;
      return d && d.startsWith(selectedMonth);
    });
  }, [payments, selectedMonth]);

  const filteredAppointments = useMemo(() => {
    if (selectedMonth === "all") return appointments;
    return appointments.filter((a) => {
      return a.date && a.date.startsWith(selectedMonth);
    });
  }, [appointments, selectedMonth]);

  const filteredPatients = useMemo(() => {
    if (selectedMonth === "all") return patients;
    return patients.filter((pt) => {
      return pt.registeredAt && pt.registeredAt.startsWith(selectedMonth);
    });
  }, [patients, selectedMonth]);

  // Aggregate Key Metrics for Selected Month
  const totalBilled = useMemo(
    () => filteredInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0),
    [filteredInvoices]
  );

  const totalCollected = useMemo(
    () => filteredPayments.reduce((acc, pay) => acc + pay.amount, 0),
    [filteredPayments]
  );

  const totalOutstanding = useMemo(
    () => filteredInvoices.reduce((acc, inv) => acc + (inv.balanceAmount || 0), 0),
    [filteredInvoices]
  );

  const collectionRate = useMemo(() => {
    if (totalBilled <= 0) return totalCollected > 0 ? 100 : 0;
    return Math.min(100, Math.round((totalCollected / totalBilled) * 100));
  }, [totalBilled, totalCollected]);

  // Collections by Payment Method in selected period
  const paymentMethodBreakdown = useMemo(() => {
    const map: Record<string, number> = {
      upi: 0,
      cash: 0,
      card: 0,
      bank_transfer: 0,
    };
    filteredPayments.forEach((p) => {
      map[p.paymentMethod] = (map[p.paymentMethod] || 0) + p.amount;
    });
    return map;
  }, [filteredPayments]);

  // Appointment Status distribution in selected period
  const appointmentDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      completed: 0,
      scheduled: 0,
      checked_in: 0,
      in_progress: 0,
      cancelled: 0,
      no_show: 0,
    };
    filteredAppointments.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return counts;
  }, [filteredAppointments]);

  // Top procedures billed in this period
  const topProcedures = useMemo(() => {
    const serviceMap = new Map<string, { name: string; count: number; revenue: number }>();
    filteredInvoices.forEach((inv) => {
      inv.items.forEach((item) => {
        const existing = serviceMap.get(item.serviceName) || {
          name: item.serviceName,
          count: 0,
          revenue: 0,
        };
        existing.count += item.quantity;
        existing.revenue += item.total;
        serviceMap.set(item.serviceName, existing);
      });
    });
    return Array.from(serviceMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredInvoices]);

  // Export CSV function for selected month
  const handleExportCSV = () => {
    const headers = [
      "Receipt Number",
      "Invoice Ref",
      "Date",
      "Patient Name",
      "Amount (INR)",
      "Method",
      "Ref ID",
      "Received By",
    ];
    const rows = filteredPayments.map((p) => [
      p.receiptNumber,
      p.invoiceNumber,
      p.paymentDate,
      `"${p.patientName}"`,
      p.amount,
      p.paymentMethod.toUpperCase(),
      p.transactionReference || "N/A",
      `"${p.receivedByName}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const periodLabel = selectedMonth === "all" ? "All_Time" : selectedMonth.replace("-", "_");
    link.setAttribute(
      "download",
      `Dr_R_Suresh_Collections_Report_${periodLabel}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <StaffLayout requiredPermissions={["billing:reports"]}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Practice Financial &amp; Operational Reports
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive revenue audits, payment method distribution, clinical operatory volume, and monthly reconciliation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredPayments.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export {selectedMonth === "all" ? "All" : formatMonthName(selectedMonth)} CSV ({filteredPayments.length})</span>
          </button>
        </div>

        {/* Dynamic Month Selector Toolbar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Month Stepper & Dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mr-2">
              <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Reporting Period:</span>
            </div>

            <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={!canGoPrev}
                title="Previous Month"
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold bg-transparent text-slate-900 dark:text-white border-0 focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="all" className="dark:bg-slate-900">
                  All Time (Cumulative)
                </option>
                <optgroup label="Monthly Periods" className="dark:bg-slate-900">
                  {availableMonths.map((m) => (
                    <option key={m} value={m} className="dark:bg-slate-900">
                      {formatMonthName(m)} {m === currentMonthKey ? "• (Current)" : ""}
                    </option>
                  ))}
                </optgroup>
              </select>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={!canGoNext}
                title="Next Month"
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Preset Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedMonth(currentMonthKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedMonth === currentMonthKey
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              This Month
            </button>

            <button
              type="button"
              onClick={() => setSelectedMonth(lastMonthKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedMonth === lastMonthKey
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Last Month
            </button>

            <button
              type="button"
              onClick={() => setSelectedMonth("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedMonth === "all"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Time
            </button>

            {selectedMonth !== "all" && (
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 ml-2">
                Filtered: <strong className="text-sky-700 dark:text-sky-400">{formatMonthName(selectedMonth)}</strong>
              </span>
            )}
          </div>
        </div>

        {/* 4 Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Total Invoiced Billing
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatINR(totalBilled)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {filteredInvoices.length} invoices issued in {selectedMonth === "all" ? "total" : formatMonthName(selectedMonth)}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
              Reconciled Collections
            </span>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
              {formatINR(totalCollected)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {filteredPayments.length} verified transactions
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase">
              Period Outstanding
            </span>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {formatINR(totalOutstanding)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Unpaid treatment balances for period
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-sky-800 dark:text-sky-300 uppercase">
              Collection Efficiency
            </span>
            <div className="text-2xl font-bold text-sky-700 dark:text-sky-400 mt-1">
              {collectionRate}%
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{filteredPatients.length} new patients registered</span>
            </div>
          </div>
        </div>

        {/* Breakdown Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Method Breakdown */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Collections by Payment Mode
                </h2>
                <p className="text-[11px] text-slate-400">
                  {selectedMonth === "all" ? "All Time" : formatMonthName(selectedMonth)} revenue breakdown
                </p>
              </div>
              <CreditCard className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>UPI / Digital (GPay / PhonePe)</span>
                  <span>{formatINR(paymentMethodBreakdown.upi)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${totalCollected > 0 ? (paymentMethodBreakdown.upi / totalCollected) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Credit / Debit Card (Front Desk POS)</span>
                  <span>{formatINR(paymentMethodBreakdown.card)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${totalCollected > 0 ? (paymentMethodBreakdown.card / totalCollected) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Cash Collections</span>
                  <span>{formatINR(paymentMethodBreakdown.cash)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${totalCollected > 0 ? (paymentMethodBreakdown.cash / totalCollected) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Direct Bank Transfer (NEFT / IMPS)</span>
                  <span>{formatINR(paymentMethodBreakdown.bank_transfer)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${totalCollected > 0 ? (paymentMethodBreakdown.bank_transfer / totalCollected) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Operatory Volume Analytics */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Clinical Operatory Volume Breakdown
                </h2>
                <p className="text-[11px] text-slate-400">
                  {filteredAppointments.length} total appointments in {selectedMonth === "all" ? "practice history" : formatMonthName(selectedMonth)}
                </p>
              </div>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900">
                <span className="text-slate-500 block">Completed Treatments</span>
                <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                  {appointmentDistribution.completed}
                </span>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900">
                <span className="text-slate-500 block">Scheduled &amp; In Queue</span>
                <span className="text-lg font-bold text-blue-800 dark:text-blue-300">
                  {appointmentDistribution.scheduled + appointmentDistribution.checked_in + appointmentDistribution.in_progress}
                </span>
              </div>

              <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900">
                <span className="text-slate-500 block">Cancelled</span>
                <span className="text-lg font-bold text-red-800 dark:text-red-300">
                  {appointmentDistribution.cancelled}
                </span>
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block">No Shows</span>
                <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  {appointmentDistribution.no_show}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-slate-600 dark:text-slate-400 text-xs">
              <span className="font-semibold text-slate-900 dark:text-white">Active Period Audit: </span>
              {filteredAppointments.length > 0
                ? `${Math.round(((appointmentDistribution.completed) / (filteredAppointments.length || 1)) * 100)}% procedure completion rate during this period.`
                : "No appointment entries recorded during this period."}
            </div>
          </div>
        </div>

        {/* Procedures & Recent Period Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Procedures */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Top Billed Clinical Procedures
                </h2>
                <p className="text-[11px] text-slate-400">
                  Highest revenue treatments for {selectedMonth === "all" ? "all time" : formatMonthName(selectedMonth)}
                </p>
              </div>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>

            {topProcedures.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No treatment line items billed in this period.
              </div>
            ) : (
              <div className="space-y-3">
                {topProcedures.map((proc, i) => (
                  <div
                    key={proc.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold flex items-center justify-center text-[10px]">
                        #{i + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {proc.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {proc.count} procedure{proc.count > 1 ? "s" : ""} delivered
                        </div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatINR(proc.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transactions in Period */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Period Verified Receipts ({filteredPayments.length})
                </h2>
                <p className="text-[11px] text-slate-400">
                  Collections logged in {selectedMonth === "all" ? "all periods" : formatMonthName(selectedMonth)}
                </p>
              </div>
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            </div>

            {filteredPayments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No payment receipts found for {selectedMonth === "all" ? "any period" : formatMonthName(selectedMonth)}.
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {filteredPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {pay.patientName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{pay.receiptNumber}</span>
                        <span>&bull;</span>
                        <span className="uppercase">{pay.paymentMethod}</span>
                        <span>&bull;</span>
                        <span>{pay.paymentDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        +{formatINR(pay.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        By {pay.receivedByName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
