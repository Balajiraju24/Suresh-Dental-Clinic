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
} from "lucide-react";

export default function StaffReportsPage() {
  const { currentUser } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentReceipt[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Aggregate stats
  const totalBilled = useMemo(
    () => invoices.reduce((acc, inv) => acc + inv.totalAmount, 0),
    [invoices]
  );
  const totalCollected = useMemo(
    () => payments.reduce((acc, pay) => acc + pay.amount, 0),
    [payments]
  );
  const totalOutstanding = useMemo(
    () => invoices.reduce((acc, inv) => acc + (inv.balanceAmount || 0), 0),
    [invoices]
  );

  // Collections by Payment Method
  const paymentMethodBreakdown = useMemo(() => {
    const map: Record<string, number> = {
      upi: 0,
      cash: 0,
      card: 0,
      bank_transfer: 0,
    };
    payments.forEach((p) => {
      map[p.paymentMethod] = (map[p.paymentMethod] || 0) + p.amount;
    });
    return map;
  }, [payments]);

  // Appointment Status distribution
  const appointmentDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      completed: 0,
      scheduled: 0,
      checked_in: 0,
      in_progress: 0,
      cancelled: 0,
      no_show: 0,
    };
    appointments.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return counts;
  }, [appointments]);

  // Export CSV function
  const handleExportCSV = () => {
    const headers = ["Receipt Number", "Invoice Ref", "Date", "Patient Name", "Amount (INR)", "Method", "Ref ID", "Received By"];
    const rows = payments.map((p) => [
      p.receiptNumber,
      p.invoiceNumber,
      p.paymentDate,
      `"${p.patientName}"`,
      p.amount,
      p.paymentMethod.toUpperCase(),
      p.transactionReference || "N/A",
      `"${p.receivedByName}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Dr_R_Suresh_Collections_Report_${new Date().toISOString().split("T")[0]}.csv`);
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
              Comprehensive financial audits, revenue reconciliation, payment methods, and clinic volume analytics.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Collections CSV</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Total Invoiced Billing
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatINR(totalBilled)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Across {invoices.length} patient treatment invoices
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
              Total Reconciled Collections
            </span>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
              {formatINR(totalCollected)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {payments.length} verified transactions
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase">
              Outstanding Receivables
            </span>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {formatINR(totalOutstanding)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Pending stage payment installments
            </div>
          </div>
        </div>

        {/* Breakdown Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Method Breakdown */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Collections by Payment Mode
              </h2>
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
                    className="bg-sky-500 h-full rounded-full"
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
                    className="bg-teal-500 h-full rounded-full"
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
                    className="bg-emerald-500 h-full rounded-full"
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
                    className="bg-purple-500 h-full rounded-full"
                    style={{
                      width: `${totalCollected > 0 ? (paymentMethodBreakdown.bank_transfer / totalCollected) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Completion Analytics */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Clinical Operatory Volume Breakdown
              </h2>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900">
                <span className="text-slate-500 block">Completed</span>
                <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                  {appointmentDistribution.completed}
                </span>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900">
                <span className="text-slate-500 block">Scheduled / In Queue</span>
                <span className="text-lg font-bold text-blue-800 dark:text-blue-300">
                  {appointmentDistribution.scheduled + appointmentDistribution.checked_in}
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
              <span className="font-semibold text-slate-900 dark:text-white">Clinical Note: </span>
              Cancellations and no-shows are logged for follow-up and schedule optimization.
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

