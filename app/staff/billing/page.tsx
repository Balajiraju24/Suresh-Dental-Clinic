"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StaffLayout } from "@/components/staff/layout/StaffLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getInvoices,
  createInvoice,
  getPayments,
  recordPayment,
  getPatients,
  getDentalServices,
} from "@/lib/data/data-service";
import { Invoice, PaymentReceipt, Patient, DentalService, PaymentMethod } from "@/types/portal";
import {
  CreditCard,
  Plus,
  Search,
  IndianRupee,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  X,
  Building,
  User,
  Calendar,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import {
  generateReceiptPDF,
  generateInvoicePDF,
  printPDFDocument,
} from "@/lib/utils/pdf-generator";

export default function StaffBillingPage() {
  const { currentUser, checkPermission } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentReceipt[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<DentalService[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter
  const [activeTab, setActiveTab] = useState<"invoices" | "payments">("invoices");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Invoice Modal
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invPatientId, setInvPatientId] = useState("");
  const [invItems, setInvItems] = useState<
    Array<{ serviceId: string; serviceName: string; toothNumber: string; quantity: number; unitPrice: number }>
  >([
    { serviceId: "", serviceName: "", toothNumber: "", quantity: 1, unitPrice: 0 },
  ]);
  const [invDiscount, setInvDiscount] = useState<number>(0);
  const [invNotes, setInvNotes] = useState("");
  const [invSubmitting, setInvSubmitting] = useState(false);

  // Record Payment Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("upi");
  const [payReference, setPayReference] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [paySubmitting, setPaySubmitting] = useState(false);

  // View / Print Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [invs, pays, pts, srvs] = await Promise.all([
        getInvoices(),
        getPayments(),
        getPatients(),
        getDentalServices(),
      ]);
      setInvoices(invs);
      setPayments(pays);
      setPatients(pts);
      setServices(srvs.filter((s) => s.isActive));

      if (pts.length > 0 && !invPatientId) {
        setInvPatientId(pts[0].id);
      }
      if (srvs.length > 0 && !invItems[0].serviceId) {
        setInvItems([
          {
            serviceId: srvs[0].id,
            serviceName: srvs[0].name,
            toothNumber: "",
            quantity: 1,
            unitPrice: srvs[0].standardFee,
          },
        ]);
      }
    } catch (e) {
      console.error("Billing data load error:", e);
    } finally {
      setLoading(false);
    }
  }, [invPatientId, invItems]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== "all" && inv.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          inv.patientName.toLowerCase().includes(q) ||
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.patientPhone.includes(q)
        );
      }
      return true;
    });
  }, [invoices, statusFilter, searchQuery]);

  const filteredPayments = useMemo(() => {
    return payments.filter((pay) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          pay.patientName.toLowerCase().includes(q) ||
          pay.receiptNumber.toLowerCase().includes(q) ||
          pay.invoiceNumber.toLowerCase().includes(q) ||
          (pay.transactionReference && pay.transactionReference.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [payments, searchQuery]);

  // Invoice calculations
  const calculateSubtotal = () => {
    return invItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    return Math.max(0, sub - Number(invDiscount || 0));
  };

  const handleServiceChange = (index: number, serviceId: string) => {
    const srv = services.find((s) => s.id === serviceId);
    if (!srv) return;
    const updated = [...invItems];
    updated[index] = {
      ...updated[index],
      serviceId: srv.id,
      serviceName: srv.name,
      unitPrice: srv.standardFee,
    };
    setInvItems(updated);
  };

  const handleAddLineItem = () => {
    const firstSrv = services[0];
    setInvItems([
      ...invItems,
      {
        serviceId: firstSrv ? firstSrv.id : "",
        serviceName: firstSrv ? firstSrv.name : "",
        toothNumber: "",
        quantity: 1,
        unitPrice: firstSrv ? firstSrv.standardFee : 0,
      },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (invItems.length <= 1) return;
    setInvItems(invItems.filter((_, i) => i !== index));
  };

  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setInvSubmitting(true);

    try {
      const patient = patients.find((p) => p.id === invPatientId);
      if (!patient) return;

      const subtotal = calculateSubtotal();
      const total = calculateTotal();

      const items = invItems.map((item, idx) => ({
        id: `item-${idx + 1}`,
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        toothNumber: item.toothNumber || undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      }));

      const created = await createInvoice(
        {
          patientId: patient.id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          patientPhone: patient.phoneNumber,
          issueDate: new Date().toISOString().split("T")[0],
          items,
          subtotal,
          discount: Number(invDiscount || 0),
          tax: 0,
          totalAmount: total,
          status: "issued",
          notes: invNotes.trim() || undefined,
          createdByUid: currentUser.uid,
          createdByName: currentUser.displayName,
        },
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          role: currentUser.role,
        }
      );

      setInvoices((prev) => [created, ...prev]);
      setIsInvoiceModalOpen(false);
      setInvDiscount(0);
      setInvNotes("");
      loadData();
    } catch (err) {
      console.error("Create invoice error:", err);
    } finally {
      setInvSubmitting(false);
    }
  };

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !payInvoice) return;
    setPaySubmitting(true);

    try {
      const newReceipt = await recordPayment(
        {
          invoiceId: payInvoice.id,
          invoiceNumber: payInvoice.invoiceNumber,
          patientId: payInvoice.patientId,
          patientName: payInvoice.patientName,
          amount: Number(payAmount),
          paymentDate: new Date().toISOString().split("T")[0],
          paymentMethod: payMethod,
          transactionReference: payReference.trim() || undefined,
          receivedByUid: currentUser.uid,
          receivedByName: currentUser.displayName,
          notes: payNotes.trim() || undefined,
        },
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          role: currentUser.role,
        }
      );

      // Optimistic instant state update for immediate UI feedback
      setPayments((prev) => [newReceipt, ...prev]);
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === payInvoice.id) {
            const updatedPaid = inv.paidAmount + newReceipt.amount;
            const updatedBal = Math.max(0, inv.totalAmount - updatedPaid);
            return {
              ...inv,
              paidAmount: updatedPaid,
              balanceAmount: updatedBal,
              status: updatedBal === 0 ? "paid" : "partially_paid",
            };
          }
          return inv;
        })
      );

      setIsPayModalOpen(false);
      setPayAmount(0);
      setPayReference("");
      setPayNotes("");
      setSelectedReceipt(newReceipt);
      loadData();
    } catch (err) {
      console.error("Payment record error:", err);
    } finally {
      setPaySubmitting(false);
    }
  };

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const canCreateInvoice = checkPermission("billing:create");
  const canRecordPayment = checkPermission("billing:record_payment");

  return (
    <StaffLayout requiredPermissions={["billing:view"]}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Billing, Invoices &amp; Payment Receipts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Practice accounting, surgical procedure invoicing, UPI/Card reconciliations, and patient receipt issuance.
            </p>
          </div>

          {canCreateInvoice && (
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Invoice</span>
            </button>
          )}
        </div>

        {/* Tab & Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("invoices")}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeTab === "invoices"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Invoices ({invoices.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("payments")}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeTab === "payments"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Receipts / Payments ({payments.length})
              </button>
            </div>

            {/* Live Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search patient, invoice #, phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {activeTab === "invoices" && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Status Filter:</span>
              {["all", "issued", "partially_paid", "paid", "cancelled"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg border font-medium capitalize ${
                    statusFilter === st
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab 1: Invoices View */}
        {activeTab === "invoices" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading invoices...</div>
            ) : filteredInvoices.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No invoices found matching criteria.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-sky-800 dark:text-sky-300">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {inv.patientName}
                        </h3>
                        <span className="text-xs text-slate-500">({inv.patientPhone})</span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {inv.items.map((i) => i.serviceName).join(", ")}
                      </div>

                      <div className="text-[11px] text-slate-400">
                        Issued on {inv.issueDate} &bull; Created by {inv.createdByName}
                      </div>
                    </div>

                    {/* Financial Figures & Actions */}
                    <div className="flex items-center gap-4 self-end md:self-center">
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {formatINR(inv.totalAmount)}
                        </div>
                        {inv.balanceAmount > 0 ? (
                          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                            {formatINR(inv.balanceAmount)} balance
                          </div>
                        ) : (
                          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Paid in full
                          </div>
                        )}
                      </div>

                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border capitalize ${
                          inv.status === "paid"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                            : inv.status === "partially_paid"
                            ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {inv.status.replace("_", " ")}
                      </span>

                      {/* Record payment button if balance remains */}
                      {canRecordPayment && inv.balanceAmount > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPayInvoice(inv);
                            setPayAmount(inv.balanceAmount);
                            setIsPayModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                        >
                          Collect Payment
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                        title="View Tax Invoice Details"
                      >
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const matchedPt = patients.find((p) => p.id === inv.patientId);
                          const doc = generateInvoicePDF(inv, matchedPt);
                          printPDFDocument(doc);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-semibold cursor-pointer"
                        title="Print A4 Dental Invoice on Laser Printer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print A4</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const matchedPt = patients.find((p) => p.id === inv.patientId);
                          const doc = generateInvoicePDF(inv, matchedPt);
                          doc.save(`Invoice_${inv.invoiceNumber}.pdf`);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Download A4 Invoice PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Payments / Receipts View */}
        {activeTab === "payments" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading payments...</div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No payment transactions recorded.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          {pay.receiptNumber}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {pay.patientName}
                        </h3>
                        <span className="font-mono text-xs text-slate-400">
                          (Ref: {pay.invoiceNumber})
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Method: <span className="font-semibold uppercase">{pay.paymentMethod}</span>
                        {pay.transactionReference && (
                          <span className="font-mono ml-2 text-slate-500">
                            [{pay.transactionReference}]
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400">
                        Received on {pay.paymentDate} by {pay.receivedByName}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                        +{formatINR(pay.amount)}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(pay)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                        title="View Receipt Details"
                      >
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const matchedInv = invoices.find(
                            (inv) => inv.id === pay.invoiceId || inv.invoiceNumber === pay.invoiceNumber
                          );
                          const doc = generateReceiptPDF(pay, matchedInv);
                          printPDFDocument(doc);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-lg text-xs font-semibold cursor-pointer"
                        title="Print single-sheet A4 receipt directly on laser printer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print A4</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const matchedInv = invoices.find(
                            (inv) => inv.id === pay.invoiceId || inv.invoiceNumber === pay.invoiceNumber
                          );
                          const doc = generateReceiptPDF(pay, matchedInv);
                          doc.save(`Receipt_${pay.receiptNumber}.pdf`);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Download A4 PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Create Invoice */}
        {isInvoiceModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Create Patient Dental Invoice
                  </h2>
                  <p className="text-xs text-slate-500">
                    Dr. R. Suresh Dental Clinic &bull; R.A. Puram, Chennai
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Patient *
                  </label>
                  <select
                    required
                    value={invPatientId}
                    onChange={(e) => setInvPatientId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} ({p.patientIdNumber} - {p.phoneNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Line Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Dental Procedures &amp; Services *
                    </label>
                    <button
                      type="button"
                      onClick={handleAddLineItem}
                      className="text-xs font-semibold text-sky-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Procedure Line
                    </button>
                  </div>

                  {invItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-5">
                        <select
                          required
                          value={item.serviceId}
                          onChange={(e) => handleServiceChange(index, e.target.value)}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        >
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} (₹{s.standardFee})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Tooth #"
                          value={item.toothNumber}
                          onChange={(e) => {
                            const updated = [...invItems];
                            updated[index].toothNumber = e.target.value;
                            setInvItems(updated);
                          }}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...invItems];
                            updated[index].quantity = Number(e.target.value);
                            setInvItems(updated);
                          }}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>

                      <div className="col-span-2 text-right font-semibold text-slate-800 dark:text-slate-200">
                        {formatINR(item.quantity * item.unitPrice)}
                      </div>

                      <div className="col-span-1 text-center">
                        {invItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLineItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount & Totals */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Discount (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={invDiscount}
                      onChange={(e) => setInvDiscount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-right space-y-1">
                    <div className="text-slate-500">Subtotal: {formatINR(calculateSubtotal())}</div>
                    <div className="text-slate-500">Discount: -{formatINR(invDiscount)}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                      Total: {formatINR(calculateTotal())}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Invoice Notes / Treatment Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={invNotes}
                    onChange={(e) => setInvNotes(e.target.value)}
                    placeholder="e.g. Tooth 46 implant crown delivery. Advance paid earlier."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={invSubmitting}
                    className="px-5 py-2 font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    {invSubmitting ? "Generating..." : "Generate Invoice"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Record Payment */}
        {isPayModalOpen && payInvoice && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-8 text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Record Authorized Payment
                  </h2>
                  <p className="text-xs text-slate-500">
                    Invoice #{payInvoice.invoiceNumber} &bull; {payInvoice.patientName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-slate-500">Outstanding Invoice Balance:</span>
                  <span className="font-bold text-amber-600 text-sm">
                    {formatINR(payInvoice.balanceAmount)}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Amount to Collect (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={payInvoice.balanceAmount}
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="upi">UPI / GPay / PhonePe / Paytm</option>
                    <option value="cash">Cash at Front Desk</option>
                    <option value="card">Credit / Debit Card (POS)</option>
                    <option value="bank_transfer">Direct Bank / NEFT / IMPS</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Transaction Reference ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={payReference}
                    onChange={(e) => setPayReference(e.target.value)}
                    placeholder="e.g. UPI Ref 329482910481, or Last 4 card digits"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paySubmitting}
                    className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    {paySubmitting ? "Recording..." : "Confirm & Issue Receipt"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Printable Receipt Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-700" />
                  <span className="font-bold text-sm">Official Payment Receipt</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Clinic Letterhead */}
              <div className="text-center py-2 border-b border-dashed border-slate-300">
                <div className="font-bold text-base text-slate-900">Dr. R. Suresh MDS, PhD, DSc</div>
                <div className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider">
                  Dental Clinic &amp; Implant Centre
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5">
                  Raja Annamalaipuram (R.A. Puram), Chennai - 600028 &bull; Tamil Nadu
                </div>
              </div>

              {/* Receipt Details */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt Number:</span>
                  <span className="font-mono font-bold">{selectedReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Reference:</span>
                  <span className="font-mono">{selectedReceipt.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span>{selectedReceipt.paymentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="font-semibold">{selectedReceipt.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="uppercase font-semibold">{selectedReceipt.paymentMethod}</span>
                </div>
                {selectedReceipt.transactionReference && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ref ID:</span>
                    <span className="font-mono text-[10px]">{selectedReceipt.transactionReference}</span>
                  </div>
                )}
              </div>

              {/* Amount Box */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <div className="text-[10px] uppercase font-semibold text-emerald-800">
                  Amount Received
                </div>
                <div className="text-xl font-bold text-emerald-900">
                  {formatINR(selectedReceipt.amount)}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center">
                Collected by: {selectedReceipt.receivedByName} &bull; Computer generated receipt
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="w-full sm:w-auto px-4 py-2 border rounded-xl font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const matchedInv = invoices.find(
                        (inv) => inv.id === selectedReceipt.invoiceId || inv.invoiceNumber === selectedReceipt.invoiceNumber
                      );
                      const doc = generateReceiptPDF(selectedReceipt, matchedInv);
                      doc.save(`Receipt_${selectedReceipt.receiptNumber}.pdf`);
                    }}
                    className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold inline-flex items-center gap-1.5 cursor-pointer text-xs"
                    title="Download official A4 PDF document"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const matchedInv = invoices.find(
                        (inv) => inv.id === selectedReceipt.invoiceId || inv.invoiceNumber === selectedReceipt.invoiceNumber
                      );
                      const doc = generateReceiptPDF(selectedReceipt, matchedInv);
                      printPDFDocument(doc);
                    }}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                    title="Send clean A4 receipt directly to laser printer without website chrome"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print A4 Receipt (Laser)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Printable Formal Invoice Modal */}
        {selectedInvoiceForPrint && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-sky-700" />
                  <span className="font-bold text-sm">Tax Invoice / Bill of Supply</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Letterhead */}
              <div className="border-b border-slate-200 pb-3">
                <div className="font-bold text-base text-slate-900">Dr. R. Suresh MDS, PhD, DSc</div>
                <div className="text-xs font-semibold text-sky-800 uppercase">
                  Dental Clinic &amp; Implant Centre
                </div>
                <div className="text-[10px] text-slate-600">
                  Raja Annamalaipuram (R.A. Puram), Chennai &bull; Tamil Nadu - 600028
                </div>
              </div>

              {/* Patient info */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-slate-100">
                <div>
                  <span className="text-slate-500 block">Billed To:</span>
                  <span className="font-bold">{selectedInvoiceForPrint.patientName}</span>
                  <div className="text-slate-500">{selectedInvoiceForPrint.patientPhone}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Invoice No:</span>
                  <span className="font-mono font-bold">{selectedInvoiceForPrint.invoiceNumber}</span>
                  <div className="text-slate-500">Date: {selectedInvoiceForPrint.issueDate}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-[10px] text-slate-500 uppercase">
                    <th className="py-1">Description</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoiceForPrint.items.map((i, idx) => (
                    <tr key={idx} className="py-1.5">
                      <td className="py-1 font-medium">
                        {i.serviceName}
                        {i.toothNumber && <span className="text-slate-400 ml-1">({i.toothNumber})</span>}
                      </td>
                      <td className="py-1 text-center">{i.quantity}</td>
                      <td className="py-1 text-right">{formatINR(i.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="pt-2 border-t border-slate-200 space-y-1 text-right">
                <div>Subtotal: {formatINR(selectedInvoiceForPrint.subtotal)}</div>
                {selectedInvoiceForPrint.discount > 0 && (
                  <div>Discount: -{formatINR(selectedInvoiceForPrint.discount)}</div>
                )}
                <div className="text-sm font-bold text-slate-900 pt-1 border-t">
                  Total Amount: {formatINR(selectedInvoiceForPrint.totalAmount)}
                </div>
                <div className="text-xs font-semibold text-emerald-700">
                  Paid to Date: {formatINR(selectedInvoiceForPrint.paidAmount)}
                </div>
                {selectedInvoiceForPrint.balanceAmount > 0 && (
                  <div className="text-xs font-bold text-amber-600">
                    Balance Due: {formatINR(selectedInvoiceForPrint.balanceAmount)}
                  </div>
                )}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="w-full sm:w-auto px-4 py-2 border rounded-xl font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const matchedPt = patients.find((p) => p.id === selectedInvoiceForPrint.patientId);
                      const doc = generateInvoicePDF(selectedInvoiceForPrint, matchedPt);
                      doc.save(`Invoice_${selectedInvoiceForPrint.invoiceNumber}.pdf`);
                    }}
                    className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold inline-flex items-center gap-1.5 cursor-pointer text-xs"
                    title="Download A4 Invoice PDF"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const matchedPt = patients.find((p) => p.id === selectedInvoiceForPrint.patientId);
                      const doc = generateInvoicePDF(selectedInvoiceForPrint, matchedPt);
                      printPDFDocument(doc);
                    }}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                    title="Print single-sheet A4 invoice on laser printer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print A4 Bill (Laser)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}

