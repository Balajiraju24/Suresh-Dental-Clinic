/**
 * PDF Generation Utility for Dr. R. Suresh Dental Clinic & Implant Centre
 * RA Puram, Chennai, Tamil Nadu
 * 
 * Generates exact A4 format (210mm x 297mm) documents optimized for laser printing:
 * - Official Patient Payment Receipts (REC-2026-xxxx)
 * - Formal Dental Treatment Invoices / Bill of Supply (INV-2026-xxxx)
 */

import { jsPDF } from "jspdf";
import { PaymentReceipt, Invoice, Patient } from "@/types/portal";

// Number to Indian Words converter (e.g. 5500 -> Five Thousand Five Hundred Rupees Only)
export function numberToIndianWords(num: number): string {
  if (num === 0) return "Zero Rupees Only";
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n: number): string => {
    let str = "";
    if (n > 99) {
      str += a[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + " " + a[n % 10];
    } else if (n > 0) {
      str += a[n];
    }
    return str.trim();
  };

  let crore = Math.floor(num / 10000000);
  num %= 10000000;
  let lakh = Math.floor(num / 100000);
  num %= 100000;
  let thousand = Math.floor(num / 1000);
  num %= 1000;
  let remainder = num;

  let res = "";
  if (crore > 0) res += inWords(crore) + " Crore ";
  if (lakh > 0) res += inWords(lakh) + " Lakh ";
  if (thousand > 0) res += inWords(thousand) + " Thousand ";
  if (remainder > 0) res += inWords(remainder);

  return res.trim() + " Rupees Only";
}

/**
 * Generates an official A4 Payment Receipt PDF
 */
export function generateReceiptPDF(receipt: PaymentReceipt, invoice?: Invoice | null): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4", // 210mm x 297mm
  });

  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // Background subtle border
  doc.setDrawColor(220, 226, 235);
  doc.setLineWidth(0.4);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, 267);

  // Top Accent Bar (Medical Deep Blue)
  doc.setFillColor(14, 116, 144); // #0e7490 (Cyan-700 / Ocean)
  doc.rect(margin - 2, margin - 2, contentWidth + 4, 4, "F");

  // 1. Clinic Letterhead Header
  let y = margin + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("DR. R. SURESH DENTAL CLINIC & IMPLANT CENTRE", margin, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("Dr. R. Suresh MDS, PhD, DSc | Senior Consultant Periodontist & Implantologist", margin, y);

  y += 4.5;
  doc.text("No. 12, Bishop Garden, Raja Annamalaipuram (R.A. Puram), Chennai - 600 028, TN, India", margin, y);

  y += 4.5;
  doc.text("Tel: +91 44 2493 8214, +91 98400 12345 | Email: contact@drsureshdental.com", margin, y);

  // Divider
  y += 5;
  doc.setDrawColor(14, 116, 144);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + contentWidth, y);

  // 2. Receipt Badge & Header
  y += 8;
  doc.setFillColor(240, 253, 250); // Emerald-50
  doc.setDrawColor(167, 243, 208); // Emerald-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y - 4, contentWidth, 12, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(6, 95, 70); // Emerald-800
  doc.text("OFFICIAL PAYMENT RECEIPT", margin + 5, y + 3.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Receipt #: ${receipt.receiptNumber}`, margin + contentWidth - 5, y + 3.5, { align: "right" });

  // 3. Metadata Grid (Patient info on Left, Payment info on Right)
  y += 16;
  const col1 = margin;
  const col2 = margin + 95;

  // Patient Card Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col1, y, 88, 30, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("PATIENT INFORMATION", col1 + 4, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(receipt.patientName, col1 + 4, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Patient ID: ${receipt.patientId}`, col1 + 4, y + 19);
  if (invoice?.patientPhone) {
    doc.text(`Contact: ${invoice.patientPhone}`, col1 + 4, y + 24);
  }

  // Payment Details Box
  doc.roundedRect(col2, y, 85, 30, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("PAYMENT DETAILS", col2 + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Payment Date: ${receipt.paymentDate}`, col2 + 4, y + 12);
  doc.text(`Mode of Payment: ${receipt.paymentMethod.toUpperCase()}`, col2 + 4, y + 17);
  doc.text(`Invoice Ref: ${receipt.invoiceNumber}`, col2 + 4, y + 22);
  if (receipt.transactionReference) {
    doc.text(`Transaction Ref: ${receipt.transactionReference}`, col2 + 4, y + 27);
  }

  // 4. Financial Transaction Table
  y += 38;
  doc.setFillColor(15, 23, 42); // slate-900 table header
  doc.rect(margin, y, contentWidth, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("Sl", margin + 4, y + 5.5);
  doc.text("Description / Procedure", margin + 15, y + 5.5);
  doc.text("Total Bill (INR)", margin + 115, y + 5.5, { align: "right" });
  doc.text("Amount Received (INR)", margin + contentWidth - 4, y + 5.5, { align: "right" });

  y += 8;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, 18, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("1", margin + 4, y + 6);

  const desc = invoice?.items
    ? invoice.items.map((i) => i.serviceName).join(", ")
    : `Authorized Dental Treatment Payment (Ref: ${receipt.invoiceNumber})`;
  const splitDesc = doc.splitTextToSize(desc, 90);
  doc.text(splitDesc, margin + 15, y + 6);

  const invTotal = invoice ? `Rs. ${invoice.totalAmount.toLocaleString("en-IN")}` : "-";
  doc.text(invTotal, margin + 115, y + 6, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 95, 70); // Emerald
  doc.text(`Rs. ${receipt.amount.toLocaleString("en-IN")}`, margin + contentWidth - 4, y + 6, {
    align: "right",
  });

  // Total Summary Box
  y += 24;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("AMOUNT RECEIVED IN WORDS:", margin + 5, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(numberToIndianWords(receipt.amount), margin + 5, y + 15);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(6, 95, 70);
  doc.text(
    `TOTAL RECEIVED:  Rs. ${receipt.amount.toLocaleString("en-IN")}`,
    margin + contentWidth - 5,
    y + 14,
    { align: "right" }
  );

  // Outstanding Balance Notice
  if (invoice) {
    y += 28;
    const balance = invoice.balanceAmount;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    if (balance > 0) {
      doc.setTextColor(180, 83, 9); // Amber-700
      doc.text(
        `* Notice: An outstanding balance of Rs. ${balance.toLocaleString("en-IN")} remains due on Invoice ${invoice.invoiceNumber}.`,
        margin,
        y
      );
    } else {
      doc.setTextColor(6, 95, 70); // Emerald
      doc.text(
        `* Verified: Invoice ${invoice.invoiceNumber} is fully settled. Thank you!`,
        margin,
        y
      );
    }
  }

  // 5. Signature & Sign-off Block
  y += 26;
  const sigCol1 = margin;
  const sigCol2 = margin + contentWidth - 65;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Received By: ${receipt.receivedByName}`, sigCol1, y);
  doc.text(`System Reference: ${receipt.id}`, sigCol1, y + 5);
  doc.text(`Date & Time Issued: ${new Date().toLocaleString("en-IN")}`, sigCol1, y + 10);

  // Official Signature line
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(sigCol2, y + 8, sigCol2 + 65, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("FOR DR. R. SURESH DENTAL CLINIC", sigCol2, y + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Authorized Signatory / Clinic Seal", sigCol2, y + 16);

  // 6. Footer Information
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 270, margin + contentWidth, 270);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Dr. R. Suresh MDS, PhD, DSc Dental Clinic & Implant Centre - R.A. Puram, Chennai",
    margin,
    275
  );
  doc.text("Computer Generated Official Receipt | Valid without physical signature", margin + contentWidth, 275, {
    align: "right",
  });

  return doc;
}

/**
 * Generates an official A4 Dental Invoice / Bill of Supply PDF
 */
export function generateInvoicePDF(invoice: Invoice, patient?: Patient | null): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Background border
  doc.setDrawColor(220, 226, 235);
  doc.setLineWidth(0.4);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, 267);

  // Top Accent Bar (Medical Deep Navy)
  doc.setFillColor(30, 58, 138); // blue-900
  doc.rect(margin - 2, margin - 2, contentWidth + 4, 4, "F");

  // 1. Clinic Letterhead Header
  let y = margin + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text("DR. R. SURESH DENTAL CLINIC & IMPLANT CENTRE", margin, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Dr. R. Suresh MDS, PhD, DSc | Senior Consultant Periodontist & Implantologist", margin, y);

  y += 4.5;
  doc.text("No. 12, Bishop Garden, Raja Annamalaipuram (R.A. Puram), Chennai - 600 028, TN, India", margin, y);

  y += 4.5;
  doc.text("Tel: +91 44 2493 8214, +91 98400 12345 | Web: https://suresh-dental-clinic.web.app", margin, y);

  // Divider
  y += 5;
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + contentWidth, y);

  // 2. Invoice Title Banner
  y += 8;
  doc.setFillColor(239, 246, 255); // Blue-50
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin, y - 4, contentWidth, 12, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text("TAX INVOICE / BILL OF SUPPLY", margin + 5, y + 3.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, margin + contentWidth - 5, y + 3.5, { align: "right" });

  // 3. Information Grid
  y += 16;
  const col1 = margin;
  const col2 = margin + 95;

  // Bill To (Patient)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col1, y, 88, 32, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("BILLED TO (PATIENT)", col1 + 4, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(invoice.patientName, col1 + 4, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Patient ID: ${invoice.patientId}`, col1 + 4, y + 19);
  doc.text(`Contact: ${invoice.patientPhone}`, col1 + 4, y + 24);
  if (patient?.address) {
    const addr = [patient.address.street, patient.address.locality, patient.address.city, patient.address.postalCode]
      .filter(Boolean)
      .join(", ");
    doc.text(`Address: ${addr.substring(0, 35)}`, col1 + 4, y + 29);
  }

  // Invoice Details
  doc.roundedRect(col2, y, 85, 32, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("INVOICE PARTICULARS", col2 + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Date of Issue: ${invoice.issueDate}`, col2 + 4, y + 12);
  doc.text(`Payment Status: ${invoice.status.toUpperCase()}`, col2 + 4, y + 18);
  doc.text(`Created By: ${invoice.createdByName}`, col2 + 4, y + 24);

  // 4. Line Items Table
  y += 40;
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("#", margin + 4, y + 5.5);
  doc.text("Procedure / Dental Service", margin + 12, y + 5.5);
  doc.text("Tooth #", margin + 105, y + 5.5);
  doc.text("Rate (INR)", margin + 135, y + 5.5, { align: "right" });
  doc.text("Qty", margin + 152, y + 5.5, { align: "right" });
  doc.text("Total (INR)", margin + contentWidth - 4, y + 5.5, { align: "right" });

  y += 8;
  invoice.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 8, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);

    doc.text((index + 1).toString(), margin + 4, y + 5.5);
    doc.text(item.serviceName, margin + 12, y + 5.5);
    doc.text(item.toothNumber ? `FDI #${item.toothNumber}` : "-", margin + 105, y + 5.5);
    doc.text(item.unitPrice.toLocaleString("en-IN"), margin + 135, y + 5.5, { align: "right" });
    doc.text(item.quantity.toString(), margin + 152, y + 5.5, { align: "right" });
    doc.text(item.total.toLocaleString("en-IN"), margin + contentWidth - 4, y + 5.5, { align: "right" });

    y += 8;
  });

  // Financial Breakdown Box
  y += 4;
  const sumWidth = 85;
  const sumX = margin + contentWidth - sumWidth;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(sumX, y, sumWidth, 42, 2, 2, "FD");

  let sy = y + 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  doc.text("Subtotal:", sumX + 5, sy);
  doc.text(`Rs. ${invoice.subtotal.toLocaleString("en-IN")}`, sumX + sumWidth - 5, sy, { align: "right" });

  if (invoice.discount > 0) {
    sy += 6;
    doc.text("Discount Applied:", sumX + 5, sy);
    doc.text(`- Rs. ${invoice.discount.toLocaleString("en-IN")}`, sumX + sumWidth - 5, sy, { align: "right" });
  }

  sy += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Total Invoice Amount:", sumX + 5, sy);
  doc.text(`Rs. ${invoice.totalAmount.toLocaleString("en-IN")}`, sumX + sumWidth - 5, sy, { align: "right" });

  sy += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70); // Emerald
  doc.text("Total Paid to Date:", sumX + 5, sy);
  doc.text(`Rs. ${invoice.paidAmount.toLocaleString("en-IN")}`, sumX + sumWidth - 5, sy, { align: "right" });

  sy += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  if (invoice.balanceAmount > 0) {
    doc.setTextColor(180, 83, 9); // Amber
  } else {
    doc.setTextColor(6, 95, 70);
  }
  doc.text("Balance Due:", sumX + 5, sy);
  doc.text(`Rs. ${invoice.balanceAmount.toLocaleString("en-IN")}`, sumX + sumWidth - 5, sy, { align: "right" });

  // Notes on Left
  if (invoice.notes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("CLINICAL / BILLING NOTES:", margin, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const splitNotes = doc.splitTextToSize(invoice.notes, 80);
    doc.text(splitNotes, margin, y + 13);
  }

  // 5. Signature Block
  y += 50;
  const sigCol = margin + contentWidth - 65;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(sigCol, y + 8, sigCol + 65, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("FOR DR. R. SURESH DENTAL CLINIC", sigCol, y + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Authorized Signatory & Stamp", sigCol, y + 16);

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 270, margin + contentWidth, 270);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Dr. R. Suresh Dental Clinic & Implant Centre - R.A. Puram, Chennai - 600 028",
    margin,
    275
  );
  doc.text("Valid Computer-Generated Medical Bill of Supply", margin + contentWidth, 275, {
    align: "right",
  });

  return doc;
}

/**
 * Directly prints the generated A4 PDF without printing any website UI or page chrome.
 * Creates an invisible iframe loaded with the PDF blob and triggers its print function.
 */
export function printPDFDocument(doc: jsPDF): void {
  if (typeof window === "undefined") return;

  const blob = doc.output("blob");
  const blobUrl = URL.createObjectURL(blob);

  // Create an isolated hidden iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.src = blobUrl;

  iframe.onload = () => {
    try {
      setTimeout(() => {
        iframe.focus();
        iframe.contentWindow?.print();
        // Clean up memory after print dialog closes
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobUrl);
        }, 60000);
      }, 300);
    } catch {
      // Fallback: Open PDF in a new tab if iframe printing is restricted by browser policy
      window.open(blobUrl, "_blank");
    }
  };

  document.body.appendChild(iframe);
}

