"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  AlertCircle,
  Calendar,
  Send,
  CheckCircle2,
  Info,
  ExternalLink,
  Loader2,
  Copy,
  Check
} from "lucide-react";
import { clinicConfig } from "@/config/clinic";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/shared/Card";

interface FormState {
  fullName: string;
  contactMethod: "phone" | "email";
  contactDetail: string;
  preferredTiming: string;
  enquiryMessage: string;
  botField: string; // Anti-spam honeypot
}

interface FormErrors {
  fullName?: string;
  contactDetail?: string;
  preferredTiming?: string;
  enquiryMessage?: string;
}

export default function ContactPage() {
  const { location, contact, hours } = clinicConfig;

  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    contactMethod: "phone",
    contactDetail: "",
    preferredTiming: "",
    enquiryMessage: "",
    botField: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [submittedData, setSubmittedData] = useState<FormState | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters long.";
    }

    if (!formData.contactDetail.trim()) {
      newErrors.contactDetail =
        formData.contactMethod === "email"
          ? "Please provide an email address."
          : "Please provide a telephone or mobile number.";
    } else {
      if (formData.contactMethod === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.contactDetail.trim())) {
          newErrors.contactDetail = "Please provide a valid email format (e.g. name@example.com).";
        }
      } else {
        // Phone validation: at least 8 digits
        const cleanPhone = formData.contactDetail.replace(/[\s\-\(\)\+]/g, "");
        if (cleanPhone.length < 8 || cleanPhone.length > 15) {
          newErrors.contactDetail = "Please enter a valid telephone/mobile number (8–15 digits).";
        }
      }
    }

    if (!formData.preferredTiming.trim()) {
      newErrors.preferredTiming = "Please select your preferred consultation slot.";
    }

    if (!formData.enquiryMessage.trim()) {
      newErrors.enquiryMessage = "Please include a brief note or reason for your consultation.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Anti-spam Honeypot Check
    if (formData.botField) {
      setSubmitStatus("success");
      setReferenceId("SDC-2026-9999");
      return;
    }

    setSubmitStatus("submitting");
    setErrorMessage("");

    // Generate client-side reference ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedRefId = `SDC-${new Date().getFullYear()}-${randomSuffix}`;
    const endpoint = contact.googleScriptEndpoint;

    const payload = {
      fullName: formData.fullName.trim(),
      contactMethod: formData.contactMethod,
      contactDetail: formData.contactDetail.trim(),
      preferredTiming: formData.preferredTiming,
      enquiryMessage: formData.enquiryMessage.trim(),
      referenceId: generatedRefId,
      botField: formData.botField,
      submittedAt: new Date().toISOString()
    };

    if (endpoint) {
      try {
        // Google Apps Script Web Apps require no-cors mode and text/plain to prevent CORS preflight blocking
        await fetch(endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });

        setReferenceId(generatedRefId);
        setSubmittedData({ ...formData });
        setSubmitStatus("success");
      } catch (err) {
        console.error("Submission error:", err);
        setSubmitStatus("error");
        setErrorMessage(
          "We encountered a network issue submitting your enquiry online. Please call our clinic desk directly at " +
            (contact.phoneNumber || "+91 75987 65787") +
            " to schedule your consultation."
        );
      }
    } else {
      // Graceful offline/development simulation if NEXT_PUBLIC_GOOGLE_SCRIPT_URL is not yet configured
      await new Promise((resolve) => setTimeout(resolve, 800));
      setReferenceId(generatedRefId);
      setSubmittedData({ ...formData });
      setSubmitStatus("success");
    }
  };

  const handleCopyReference = () => {
    if (referenceId) {
      navigator.clipboard.writeText(referenceId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      contactMethod: "phone",
      contactDetail: "",
      preferredTiming: "",
      enquiryMessage: "",
      botField: ""
    });
    setErrors({});
    setSubmitStatus("idle");
    setErrorMessage("");
    setReferenceId("");
    setSubmittedData(null);
  };

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-200">
      <div className="clinic-container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-slate-900 dark:text-white" aria-current="page">
              Contact &amp; Appointments
            </li>
          </ol>
        </nav>

        <SectionHeader
          badge="Get in Touch"
          title="Contact &amp; Appointment Enquiries"
          subtitle="Locate our clinic in Raja Annamalaipuram, Chennai, and submit an appointment scheduling enquiry."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-start">
          {/* Clinic Contact Details & Operating Hours Column */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Location &amp; Practice Address
                </span>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white mt-1">
                  {clinicConfig.clinicName}
                </h2>
              </div>

              {/* Address */}
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Clinic Street Address:
                    </span>
                    <p className="mt-0.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {location.fullAddressDisplay}
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                      Landmarks: {location.landmarksNearby.join(" • ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Telephone */}
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Telephone / Reception Desk:
                    </span>
                    <a
                      href={`tel:${contact.phoneNumber}`}
                      className="mt-0.5 text-base font-bold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors inline-block"
                    >
                      {contact.displayPhone}
                    </a>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                      Prior appointment scheduling recommended before arrival.
                    </span>
                  </div>
                </div>
              </div>

              {/* Consultation Hours */}
              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="w-full">
                    <span className="font-semibold text-slate-900 dark:text-white block text-sm">
                      Consultation Hours:
                    </span>
                    <div className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {hours.regularSchedule.map((schedule, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-b-0"
                        >
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {schedule.days}:
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {schedule.morningSlot ? (
                              <>
                                {schedule.morningSlot} &bull; {schedule.eveningSlot}
                              </>
                            ) : (
                              "Closed"
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Google Maps / Directions Card */}
            <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                <span>Clinic Directions &amp; Location Map</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                The practice is located on {location.streetAddress}, {location.locality}, Chennai {location.postalCode}.
              </p>

              <div className="aspect-[16/9] w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-6 text-center">
                <MapPin className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-2" aria-hidden="true" />
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {location.fullAddressDisplay}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 max-w-sm">
                  Sector 1, Raja Annamalaipuram. Click below to view the official Google Maps pin and navigation directions.
                </p>
                <a
                  href={location.googleMapsDirectionsUrl || "https://maps.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 transition-colors shadow"
                >
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </Card>
          </div>

          {/* Appointment Enquiry Form Column */}
          <div id="appointment-form" className="lg:col-span-7">
            <Card className="p-6 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                  <span>Online Request</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">
                  Request an Appointment Consultation
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Submit your contact preference and desired consultation slot. Our clinical desk will follow up promptly to confirm your scheduled time.
                </p>
              </div>

              {/* Privacy Notice */}
              <div className="mb-6 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  <span className="font-semibold text-slate-800 dark:text-white">Privacy Notice:</span> Clinical diagnoses and treatment plans are determined in person. Please do not submit confidential medical records or acute diagnostic symptoms through this web form.
                </p>
              </div>

              {/* ERROR STATE */}
              {submitStatus === "error" && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-rose-800 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" aria-hidden="true" />
                    <span>Submission Issue</span>
                  </div>
                  <p className="text-xs leading-relaxed">{errorMessage}</p>
                </div>
              )}

              {/* SUCCESS CONFIRMATION STATE */}
              {submitStatus === "success" && submittedData ? (
                <div className="space-y-6 py-2">
                  <div className="p-6 bg-teal-50/90 dark:bg-teal-950/60 rounded-2xl border border-teal-200 dark:border-teal-800 text-teal-950 dark:text-teal-200 space-y-4">
                    <div className="flex items-center gap-2.5 font-extrabold text-lg text-teal-900 dark:text-teal-100">
                      <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
                      <span>Consultation Request Received!</span>
                    </div>
                    <p className="text-xs sm:text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
                      Thank you, <strong>{submittedData.fullName}</strong>. Your consultation enquiry has been routed directly to our clinic administration. Our desk will contact you via {submittedData.contactMethod} (<strong>{submittedData.contactDetail}</strong>) to confirm specialist availability.
                    </p>

                    {/* Reference ID Pill */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-teal-900 dark:text-teal-200">
                        Appointment Reference:
                      </span>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700 font-mono font-bold text-xs text-slate-900 dark:text-teal-300">
                        <span>{referenceId}</span>
                        <button
                          type="button"
                          onClick={handleCopyReference}
                          aria-label="Copy reference ID"
                          className="hover:text-teal-600 transition-colors"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs sm:text-sm">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                      Request Summary:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-xs">Patient Name:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{submittedData.fullName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-xs">Contact Mode:</span>
                        <span className="font-medium text-slate-900 dark:text-white capitalize">
                          {submittedData.contactMethod}: {submittedData.contactDetail}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500 dark:text-slate-400 block text-xs">Preferred Slot:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{submittedData.preferredTiming}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500 dark:text-slate-400 block text-xs">Clinical Note / Reason:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{submittedData.enquiryMessage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Immediate Assistance Box */}
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Need Immediate Assistance?
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        You can also contact our clinic reception directly by phone.
                      </span>
                    </div>
                    <a
                      href={`tel:${contact.phoneNumber}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold flex-shrink-0 transition-colors shadow"
                    >
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{contact.displayPhone}</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-950 font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors"
                  >
                    <span>Submit Another Enquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Honeypot field (hidden off-screen for spam bots) */}
                  <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                    <label htmlFor="botField">Leave this field blank</label>
                    <input
                      type="text"
                      id="botField"
                      name="botField"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.botField}
                      onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Patient Full Name <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      aria-required="true"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      disabled={submitStatus === "submitting"}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        errors.fullName
                          ? "border-rose-400 dark:border-rose-600 bg-rose-50/30 dark:bg-rose-950/30"
                          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    />
                    {errors.fullName && (
                      <p id="fullName-error" className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Contact Method Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contactMethod"
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Preferred Contact Mode <span className="text-rose-600 dark:text-rose-400">*</span>
                      </label>
                      <select
                        id="contactMethod"
                        name="contactMethod"
                        value={formData.contactMethod}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactMethod: e.target.value as "phone" | "email"
                          })
                        }
                        disabled={submitStatus === "submitting"}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                      >
                        <option value="phone">Telephone Call / Mobile</option>
                        <option value="email">Email Address</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contactDetail"
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        {formData.contactMethod === "email" ? "Email Address" : "Phone / Mobile Number"}{" "}
                        <span className="text-rose-600 dark:text-rose-400">*</span>
                      </label>
                      <input
                        type={formData.contactMethod === "email" ? "email" : "tel"}
                        id="contactDetail"
                        name="contactDetail"
                        value={formData.contactDetail}
                        onChange={(e) => setFormData({ ...formData, contactDetail: e.target.value })}
                        placeholder={formData.contactMethod === "email" ? "name@example.com" : "+91 98..."}
                        aria-required="true"
                        aria-invalid={!!errors.contactDetail}
                        aria-describedby={errors.contactDetail ? "contactDetail-error" : undefined}
                        disabled={submitStatus === "submitting"}
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                          errors.contactDetail
                            ? "border-rose-400 dark:border-rose-600 bg-rose-50/30 dark:bg-rose-950/30"
                            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        }`}
                      />
                      {errors.contactDetail && (
                        <p id="contactDetail-error" className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                          {errors.contactDetail}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preferred Timing */}
                  <div>
                    <label
                      htmlFor="preferredTiming"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Preferred Consultation Slot <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <select
                      id="preferredTiming"
                      name="preferredTiming"
                      value={formData.preferredTiming}
                      onChange={(e) => setFormData({ ...formData, preferredTiming: e.target.value })}
                      aria-required="true"
                      aria-invalid={!!errors.preferredTiming}
                      aria-describedby={errors.preferredTiming ? "preferredTiming-error" : undefined}
                      disabled={submitStatus === "submitting"}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        errors.preferredTiming
                          ? "border-rose-400 dark:border-rose-600 bg-rose-50/30 dark:bg-rose-950/30"
                          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <option value="">Select a preferred time window</option>
                      <option value="Morning: 10:00 AM – 12:00 PM (Mon – Sat)">Morning: 10:00 AM – 12:00 PM (Mon – Sat)</option>
                      <option value="Evening: 04:30 PM – 08:30 PM (Mon – Sat)">Evening: 04:30 PM – 08:30 PM (Mon – Sat)</option>
                      <option value="Saturday Appointment Slot">Saturday Consultation Slot</option>
                      <option value="Flexible / First Available Slot">Flexible / First Available Slot</option>
                    </select>
                    {errors.preferredTiming && (
                      <p id="preferredTiming-error" className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                        {errors.preferredTiming}
                      </p>
                    )}
                  </div>

                  {/* General Enquiry Message */}
                  <div>
                    <label
                      htmlFor="enquiryMessage"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      General Enquiry or Reason for Consultation <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <textarea
                      id="enquiryMessage"
                      name="enquiryMessage"
                      rows={4}
                      value={formData.enquiryMessage}
                      onChange={(e) => setFormData({ ...formData, enquiryMessage: e.target.value })}
                      placeholder="e.g. Seeking consultation regarding periodontal gum evaluation, dental implant feasibility, or routine check-up."
                      aria-required="true"
                      aria-invalid={!!errors.enquiryMessage}
                      aria-describedby={errors.enquiryMessage ? "enquiryMessage-error" : undefined}
                      disabled={submitStatus === "submitting"}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        errors.enquiryMessage
                          ? "border-rose-400 dark:border-rose-600 bg-rose-50/30 dark:bg-rose-950/30"
                          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    />
                    {errors.enquiryMessage && (
                      <p id="enquiryMessage-error" className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                        {errors.enquiryMessage}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitStatus === "submitting"}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-teal-700 hover:from-sky-700 hover:to-teal-800 disabled:opacity-75 text-white font-semibold text-sm px-7 py-3.5 rounded-xl shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                      {submitStatus === "submitting" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          <span>Transmitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" aria-hidden="true" />
                          <span>Submit Appointment Enquiry</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                      * Requests are delivered directly to clinic reception ({contact.adminNotificationEmail}).
                    </p>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
