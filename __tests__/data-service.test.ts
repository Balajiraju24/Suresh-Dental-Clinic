import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  getPatients,
  createPatient,
  addClinicalNote,
  getInvoices,
  createInvoice,
  deleteInvoice,
  recordPayment,
  deletePatient,
  getDashboardMetrics,
  getStaffMembers,
} from "../lib/data/data-service";

describe("Dental Clinic Data Operations & Business Logic", () => {
  const testAdminActor = {
    uid: "test-admin-uid",
    displayName: "Dr. R. Suresh",
    role: "administrator" as const,
  };

  it("Fetches initial staff, patients, services, and appointments", async () => {
    const [staff, patients, appointments, invoices] = await Promise.all([
      getStaffMembers(),
      getPatients(),
      getAppointments(),
      getInvoices(),
    ]);

    assert.ok(staff.length > 0);
    assert.ok(patients.length > 0);
    assert.ok(appointments.length > 0);
    assert.ok(invoices.length > 0);

    const drSuresh = staff.find((s) => s.email === "dr.suresh@drsureshdental.com");
    assert.ok(drSuresh);
    assert.equal(drSuresh?.role, "administrator");

    const drAshritha = staff.find((s) => s.email === "dr.ashritha@drsureshdental.com");
    assert.ok(drAshritha);
    assert.equal(drAshritha?.role, "administrator");
  });

  it("Calculates live dashboard metrics from actual database collections", async () => {
    const metrics = await getDashboardMetrics();

    assert.ok(metrics);
    assert.equal(typeof metrics.todayAppointmentsCount, "number");
    assert.equal(typeof metrics.totalRegisteredPatients, "number");
    assert.equal(typeof metrics.todayCollectionsTotal, "number");
    assert.equal(typeof metrics.totalOutstandingBalance, "number");
    assert.ok(metrics.totalRegisteredPatients >= 4);
  });

  it("Registers a new patient and assigns unique patient identification number", async () => {
    const newPatient = await createPatient(
      {
        firstName: "Vaidyanathan",
        lastName: "Subramanian",
        dateOfBirth: "1975-08-20",
        gender: "male",
        bloodGroup: "O+",
        phoneNumber: "+91 94440 98765",
        email: "vaidya.subramanian@example.com",
        address: {
          locality: "R.A. Puram",
          city: "Chennai",
          postalCode: "600028",
        },
        emergencyContact: {
          name: "Saraswathi V.",
          relationship: "Spouse",
          phone: "+91 94440 98766",
        },
        medicalHistory: {
          allergies: ["Penicillin"],
          conditions: ["Hypertension"],
          currentMedications: ["Amlodipine 5mg OD"],
        },
        status: "active",
      },
      testAdminActor
    );

    assert.ok(newPatient.id);
    assert.ok(newPatient.patientIdNumber.includes("SDC-2026-"));
    assert.equal(newPatient.firstName, "Vaidyanathan");
    assert.ok(newPatient.medicalHistory.allergies.includes("Penicillin"));
  });

  it("Books an appointment and updates status through clinical workflow", async () => {
    const patients = await getPatients();
    const patient = patients[0];

    const apt = await createAppointment(
      {
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        patientPhone: patient.phoneNumber,
        dentistUid: testAdminActor.uid,
        dentistName: testAdminActor.displayName,
        serviceId: "srv-002",
        serviceName: "Full Mouth Ultrasonic Scaling & Polishing",
        date: new Date().toISOString().split("T")[0],
        timeSlot: "04:30 PM",
        durationMinutes: 45,
        operatory: "Operatory 2 (Periodontal Care)",
        status: "scheduled",
        chiefComplaint: "Routine periodontal hygiene recall",
      },
      testAdminActor
    );

    assert.ok(apt.id);
    assert.equal(apt.status, "scheduled");
    assert.ok(apt.appointmentNumber.includes("APT-2026-"));

    // Check in
    await updateAppointmentStatus(apt.id, "checked_in", testAdminActor);
    let updatedAppts = await getAppointments();
    let checked = updatedAppts.find((a) => a.id === apt.id);
    assert.equal(checked?.status, "checked_in");

    // Complete
    await updateAppointmentStatus(apt.id, "completed", testAdminActor);
    updatedAppts = await getAppointments();
    checked = updatedAppts.find((a) => a.id === apt.id);
    assert.equal(checked?.status, "completed");
  });

  it("Creates invoice, records payment, and verifies automated financial reconciliation", async () => {
    const patients = await getPatients();
    const patient = patients[0];

    // 1. Create an invoice for ₹5,000
    const invoice = await createInvoice(
      {
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        patientPhone: patient.phoneNumber,
        issueDate: new Date().toISOString().split("T")[0],
        items: [
          {
            id: "line-1",
            serviceId: "srv-003",
            serviceName: "Deep Periodontal Scaling & Root Planing",
            quantity: 1,
            unitPrice: 5000,
            total: 5000,
          },
        ],
        subtotal: 5000,
        discount: 0,
        tax: 0,
        totalAmount: 5000,
        status: "issued",
        createdByUid: testAdminActor.uid,
        createdByName: testAdminActor.displayName,
      },
      testAdminActor
    );

    assert.ok(invoice.id);
    assert.equal(invoice.totalAmount, 5000);
    assert.equal(invoice.balanceAmount, 5000);
    assert.equal(invoice.paidAmount, 0);

    // 2. Record a partial payment of ₹3,000 via UPI
    const receipt1 = await recordPayment(
      {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        patientId: patient.id,
        patientName: invoice.patientName,
        amount: 3000,
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "upi",
        transactionReference: "UPI-TEST-12345",
        receivedByUid: testAdminActor.uid,
        receivedByName: testAdminActor.displayName,
      },
      testAdminActor
    );

    assert.ok(receipt1.receiptNumber.includes("REC-2026-"));
    assert.equal(receipt1.amount, 3000);

    // Verify invoice is partially paid with ₹2,000 remaining
    let allInvoices = await getInvoices();
    let currentInv = allInvoices.find((i) => i.id === invoice.id);
    assert.equal(currentInv?.paidAmount, 3000);
    assert.equal(currentInv?.balanceAmount, 2000);
    assert.equal(currentInv?.status, "partially_paid");

    // 3. Record remaining balance payment of ₹2,000
    await recordPayment(
      {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        patientId: patient.id,
        patientName: invoice.patientName,
        amount: 2000,
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "card",
        receivedByUid: testAdminActor.uid,
        receivedByName: testAdminActor.displayName,
      },
      testAdminActor
    );

    allInvoices = await getInvoices();
    currentInv = allInvoices.find((i) => i.id === invoice.id);
    assert.equal(currentInv?.paidAmount, 5000);
    assert.equal(currentInv?.balanceAmount, 0);
    assert.equal(currentInv?.status, "paid");
  });

  it("Records clinical note with FDI tooth numbers and clinical observations", async () => {
    const patients = await getPatients();
    const patient = patients[0];

    const note = await addClinicalNote(
      patient.id,
      {
        date: new Date().toISOString().split("T")[0],
        authorUid: "staff-suresh-001",
        authorName: "Dr. R. Suresh",
        authorRole: "administrator",
        toothNumbers: ["36", "37"],
        procedureName: "Surgical Crown Lengthening & Pocket Reduction",
        findings: "Subgingival fracture margin on 36, biologic width violation. Probing depth 5mm.",
        treatmentRendered: "Full thickness mucoperiosteal flap elevated, 2mm ostectomy performed, sutured with 4-0 vicryl.",
        prescription: "Ibuprofen 400mg BD x 3 days, Chlorhexidine mouthwash 0.2% BD.",
        nextVisitRecommendation: "Suture removal in 7 days.",
      },
      testAdminActor
    );

    assert.ok(note.id);
    assert.ok(note.toothNumbers?.includes("36"));

    const updatedPatients = await getPatients();
    const updated = updatedPatients.find((p) => p.id === patient.id);
    assert.ok(updated?.clinicalNotes.some((n) => n.id === note.id));
  });

  it("Enforces admin-only authorization for deleting invoices and reconciles patient balance", async () => {
    const receptionistActor = {
      uid: "test-rec-uid",
      displayName: "Front Desk Priya",
      role: "receptionist" as const,
    };

    const patients = await getPatients();
    const patient = patients[0];

    // Create an invoice to delete
    const inv = await createInvoice(
      {
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        patientPhone: patient.phoneNumber,
        issueDate: new Date().toISOString().split("T")[0],
        items: [
          {
            id: "line-del-1",
            serviceId: "srv-001",
            serviceName: "Consultation",
            quantity: 1,
            unitPrice: 800,
            total: 800,
          },
        ],
        subtotal: 800,
        discount: 0,
        tax: 0,
        totalAmount: 800,
        status: "issued",
        createdByUid: testAdminActor.uid,
        createdByName: testAdminActor.displayName,
      },
      testAdminActor
    );

    // 1. Non-admin cannot delete
    await assert.rejects(
      async () => {
        await deleteInvoice(inv.id, receptionistActor);
      },
      { message: /Unauthorized: Only clinic administrators can delete invoices/ }
    );

    // 2. Admin successfully deletes invoice
    await deleteInvoice(inv.id, testAdminActor);

    const allInvoices = await getInvoices();
    assert.equal(allInvoices.some((i) => i.id === inv.id), false);
  });

  it("Enforces admin-only authorization for deleting patient records", async () => {
    const receptionistActor = {
      uid: "test-rec-uid",
      displayName: "Front Desk Priya",
      role: "receptionist" as const,
    };

    // Create temporary patient
    const tempPatient = await createPatient(
      {
        firstName: "Temp",
        lastName: "Patient",
        dateOfBirth: "1992-05-10",
        gender: "female",
        phoneNumber: "+91 91111 22222",
        address: { locality: "R.A. Puram", city: "Chennai", postalCode: "600028" },
        emergencyContact: { name: "Contact", relationship: "Friend", phone: "+91 91111 33333" },
        medicalHistory: { allergies: [], conditions: [], currentMedications: [] },
        status: "active",
      },
      testAdminActor
    );

    // 1. Non-admin cannot delete
    await assert.rejects(
      async () => {
        await deletePatient(tempPatient.id, receptionistActor);
      },
      { message: /Unauthorized: Only clinic administrators can delete patient records/ }
    );

    // 2. Admin successfully deletes patient
    await deletePatient(tempPatient.id, testAdminActor);

    const allPatients = await getPatients();
    assert.equal(allPatients.some((p) => p.id === tempPatient.id), false);
  });
});
