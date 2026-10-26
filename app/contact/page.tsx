"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Mail,
  AlertCircle,
  Calendar,
  Send,
  CheckCircle2,
  Info,
  ExternalLink
} from "lucide-react";
import { clinicConfig } from "@/config/clinic";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/shared/Card";

interface FormState {
  fullName: string;
  contactMethod: "phone" | "email" | "whatsapp";
  contactDetail: string;
  preferredTiming: string;
  enquiryMessage: string;
}

interface FormErrors {
  fullName?: string;
  contactDetail?: string;
  preferredTiming?: string;
  enquiryMessage?: string;
}

export default function ContactPage() {
  const { location, contact } = clinicConfig;

  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    contactMethod: "phone",
    contactDetail: "",
    preferredTiming: "",
    enquiryMessage: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [prototypeSubmitted, setPrototypeSubmitted] = useState(false);
  const [submittedDataPreview, setSubmittedDataPreview] = useState<FormState | null>(null);

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
        // Phone / WhatsApp validation: at least 8 digits
        const cleanPhone = formData.contactDetail.replace(/[\s\-\(\)\+]/g, "");
        if (cleanPhone.length < 8 || cleanPhone.length > 15) {
          newErrors.contactDetail = "Please enter a valid telephone/mobile number (8–15 digits).";
        }
      }
    }

    if (!formData.preferredTiming.trim()) {
      newErrors.preferredTiming = "Please select or specify your preferred consultation timing.";
    }

    if (!formData.enquiryMessage.trim()) {
      newErrors.enquiryMessage = "Please include a brief general enquiry or note for the clinic.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Honest prototype behaviour as requested:
    // Does NOT claim the message was sent to a backend
    // Explains that this is a client-side frontend prototype
    // Does NOT store in localStorage
    setSubmittedDataPreview({ ...formData });
    setPrototypeSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      contactMethod: "phone",
      contactDetail: "",
      preferredTiming: "",
      enquiryMessage: ""
    });
    setErrors({});
    setPrototypeSubmitted(false);
    setSubmittedDataPreview(null);
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

              {/* Address with Verification Notice */}
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {location.locality}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {location.city}, {location.state}, {location.country}
                    </p>
                    <div className="mt-2 p-2.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        Exact door and street number verification in progress before public launch.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="space-y-3 text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Direct Communications
                </p>

                {/* Telephone */}
                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <Phone className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Telephone Line</p>
                    {contact.isPhoneVerified && contact.phoneNumber ? (
                      <a
                        href={`tel:${contact.phoneNumber}`}
                        className="text-sky-700 dark:text-sky-400 hover:underline font-medium"
                      >
                        {contact.phoneNumber}
                      </a>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                        Phone line verification in progress (disabled in preview)
                      </p>
                    )}
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">WhatsApp Consultation</p>
                    {contact.isWhatsappVerified && contact.whatsappNumber ? (
                      <a
                        href={`https://wa.me/${contact.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <span>Chat via WhatsApp</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                        WhatsApp consultation line pending clinic confirmation
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Email Enquiries</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {contact.displayEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Consultation Timings */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        Clinic Operating Hours
                      </p>
                      <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/80 px-2 py-0.5 rounded-full">
                        Verified via Google
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-2 space-y-1.5">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        Days: Monday – Saturday
                      </p>
                      <p>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Morning Consultation:</span> 10:00 AM – 12:00 PM
                      </p>
                      <p>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Evening Consultation:</span> 4:30 PM – 8:30 PM
                      </p>
                      <p className="text-rose-600 dark:text-rose-400 font-medium">
                        Sunday: Closed
                      </p>
                    </div>

                    <div className="mt-3 p-2.5 rounded-lg bg-sky-50/90 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-[11px] text-sky-900 dark:text-sky-200 leading-snug">
                      <span className="font-semibold">Notice:</span> Official hours sourced from the clinic&apos;s Google Business listing. Prior appointment scheduling is recommended before visiting to ensure specialist availability.
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Google Maps / Directions Placeholder Card */}
            <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                <span>Clinic Directions &amp; Location Map</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                The practice is located in Raja Annamalaipuram (R.A. Puram), accessible via R.A. Puram Main Road and Chamiers Road.
              </p>

              {/* Map visual placeholder */}
              <div className="aspect-[16/9] w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center">
                <MapPin className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" aria-hidden="true" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Interactive Google Map Embed
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                  Exact GPS coordinates and directions will be integrated once the official clinic address is confirmed.
                </p>
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
                  Submit your contact preference and desired consultation slot. Please note that this is a frontend prototype demonstrating client-side validation.
                </p>
              </div>

              {/* Privacy Warning: No Sensitive Medical Data Collected */}
              <div className="mb-6 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  <span className="font-semibold text-slate-800 dark:text-white">Privacy Notice:</span> To protect your confidential medical information, do not submit detailed medical histories or acute diagnostic symptoms through this form. Clinical assessments are conducted in person.
                </p>
              </div>

              {/* Form or Prototype Confirmation State */}
              {prototypeSubmitted && submittedDataPreview ? (
                <div className="space-y-6 py-4">
                  <div className="p-5 bg-sky-50 dark:bg-sky-950/70 rounded-2xl border border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-200 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-base text-sky-900 dark:text-sky-100">
                      <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                      <span>Form Client-Side Validation Successful</span>
                    </div>
                    <p className="text-xs sm:text-sm text-sky-800 dark:text-sky-300 leading-relaxed">
                      This is a frontend demonstration prototype. In production, this form will connect directly to the clinic&apos;s verified appointment management system or secure email gateway. No actual data has been transmitted to a server or stored in local storage.
                    </p>
                  </div>

                  {/* Validated Data Summary */}
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs sm:text-sm">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                      Validated Input Summary:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-xs">Patient Name:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{submittedDataPreview.fullName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-xs">Contact Method:</span>
                        <span className="font-medium text-slate-900 dark:text-white capitalize">{submittedDataPreview.contactMethod} ({submittedDataPreview.contactDetail})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-xs">Preferred Slot:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{submittedDataPreview.preferredTiming}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-xs">General Enquiry:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{submittedDataPreview.enquiryMessage}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-950 font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors"
                  >
                    <span>Reset Prototype Form</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                            contactMethod: e.target.value as "phone" | "email" | "whatsapp"
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                      >
                        <option value="phone">Telephone Call</option>
                        <option value="whatsapp">WhatsApp Message</option>
                        <option value="email">Email</option>
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
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        errors.preferredTiming
                          ? "border-rose-400 dark:border-rose-600 bg-rose-50/30 dark:bg-rose-950/30"
                          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <option value="">Select a preferred time window</option>
                      <option value="Morning Consultation: 10:00 AM – 12:00 PM (Mon – Sat)">Morning Consultation: 10:00 AM – 12:00 PM (Mon – Sat)</option>
                      <option value="Evening Consultation: 04:30 PM – 08:30 PM (Mon – Sat)">Evening Consultation: 04:30 PM – 08:30 PM (Mon – Sat)</option>
                      <option value="Saturday Appointment (10:00 AM – 12:00 PM or 4:30 PM – 8:30 PM)">Saturday Consultation Slot</option>
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
                      placeholder="e.g. Seeking consultation regarding periodontal gum evaluation or dental implant feasibility."
                      aria-required="true"
                      aria-invalid={!!errors.enquiryMessage}
                      aria-describedby={errors.enquiryMessage ? "enquiryMessage-error" : undefined}
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
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white font-semibold text-sm px-7 py-3.5 rounded-xl shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                      <span>Submit Appointment Enquiry</span>
                    </button>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                      * Frontend prototype with client-side validation. Does not transmit medical data.
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
