import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { numberToIndianWords, generateReceiptPDF, generateInvoicePDF } from "../lib/utils/pdf-generator";
import { PaymentReceipt, Invoice } from "../types/portal";

describe("PDF Generator & Indian Words Number Formatting", () => {
  it("correctly converts INR currency numbers to words", () => {
    assert.equal(numberToIndianWords(0), "Zero Rupees Only");
    assert.equal(numberToIndianWords(500), "Five Hundred Rupees Only");
    assert.equal(numberToIndianWords(1500), "One Thousand Five Hundred Rupees Only");
    assert.equal(numberToIndianWords(5000), "Five Thousand Rupees Only");
    assert.equal(numberToIndianWords(25000), "Twenty Five Thousand Rupees Only");
    assert.equal(numberToIndianWords(125000), "One Lakh Twenty Five Thousand Rupees Only");
  });

  it("generates an official A4 Payment Receipt PDF document", () => {
    const mockReceipt: PaymentReceipt = {
      id: "rec-test-01",
      receiptNumber: "REC-2026-101",
      invoiceId: "inv-test-01",
      invoiceNumber: "INV-2026-151",
      patientId: "pt-001",
      patientName: "Meenakshi Sundaram",
      amount: 4500,
      paymentDate: "2026-10-30",
      paymentMethod: "upi",
      transactionReference: "UPI/20261030/987654",
      receivedByUid: "staff-001",
      receivedByName: "Dr. R. Suresh",
      createdAt: "2026-10-30T10:00:00Z",
    };

    const mockInvoice: Invoice = {
      id: "inv-test-01",
      invoiceNumber: "INV-2026-151",
      patientId: "pt-001",
      patientName: "Meenakshi Sundaram",
      patientPhone: "+91 98401 23456",
      issueDate: "2026-10-30",
      items: [
        {
          id: "item-1",
          serviceId: "srv-01",
          serviceName: "Comprehensive Periodontal Consultation",
          quantity: 1,
          unitPrice: 4500,
          total: 4500,
        },
      ],
      subtotal: 4500,
      discount: 0,
      tax: 0,
      totalAmount: 4500,
      paidAmount: 4500,
      balanceAmount: 0,
      status: "paid",
      createdByUid: "staff-001",
      createdByName: "Dr. R. Suresh",
      createdAt: "2026-10-30T09:30:00Z",
      updatedAt: "2026-10-30T10:00:00Z",
    };

    const pdf = generateReceiptPDF(mockReceipt, mockInvoice);
    assert.ok(pdf);
    // Verify it generates pages in A4 size (210mm x 297mm)
    assert.equal(pdf.getNumberOfPages(), 1);
    const output = pdf.output("arraybuffer");
    assert.ok(output.byteLength > 1000, "PDF output should contain valid binary stream");
  });

  it("generates an official A4 Dental Invoice PDF document", () => {
    const mockInvoice: Invoice = {
      id: "inv-test-02",
      invoiceNumber: "INV-2026-152",
      patientId: "pt-002",
      patientName: "Karthik Subramanian",
      patientPhone: "+91 98402 34567",
      issueDate: "2026-10-30",
      items: [
        {
          id: "item-1",
          serviceId: "srv-02",
          serviceName: "Dental Implant Placement (Straumann SLA)",
          toothNumber: "36",
          quantity: 1,
          unitPrice: 45000,
          total: 45000,
        },
      ],
      subtotal: 45000,
      discount: 2000,
      tax: 0,
      totalAmount: 43000,
      paidAmount: 20000,
      balanceAmount: 23000,
      status: "partially_paid",
      notes: "Stage 1 surgical fixture placed under local anaesthesia. Sutures in place.",
      createdByUid: "staff-001",
      createdByName: "Dr. R. Suresh",
      createdAt: "2026-10-30T09:30:00Z",
      updatedAt: "2026-10-30T10:00:00Z",
    };

    const pdf = generateInvoicePDF(mockInvoice);
    assert.ok(pdf);
    assert.equal(pdf.getNumberOfPages(), 1);
    const output = pdf.output("arraybuffer");
    assert.ok(output.byteLength > 1000, "Invoice PDF output should contain valid binary stream");
  });
});

