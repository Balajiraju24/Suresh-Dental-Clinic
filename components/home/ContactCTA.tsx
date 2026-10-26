import React from "react";
import Link from "next/link";
import { Phone, Calendar, MapPin, Clock, AlertCircle } from "lucide-react";
import { clinicConfig } from "@/config/clinic";

export function ContactCTA() {
  const { contact, location } = clinicConfig;

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white relative overflow-hidden isolate">
      {/* Decorative background glow */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.15)_0%,rgba(20,184,166,0)_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.15)_0%,rgba(14,165,233,0)_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="clinic-container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-950 text-sky-300 border border-sky-800">
            <span>Consultation Enquiries</span>
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Schedule a Personalised Dental Consultation
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Discuss your oral health, gum condition, or tooth replacement options with Dr. R. Suresh
            in a calm, patient-focused setting in Raja Annamalaipuram, Chennai.
          </p>

          {/* Location & Schedule Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-300 pt-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" aria-hidden="true" />
              <span>{location.fullAddressDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" aria-hidden="true" />
              <span>Prior Appointment Preferred</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contact#appointment-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-slate-950 font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <Calendar className="w-5 h-5 text-slate-950" aria-hidden="true" />
              <span>Request an Appointment</span>
            </Link>

            {contact.isPhoneVerified && contact.phoneNumber ? (
              <a
                href={`tel:${contact.phoneNumber}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white font-medium text-sm sm:text-base px-6 py-3.5 rounded-xl border border-slate-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <Phone className="w-4 h-4 text-sky-400" aria-hidden="true" />
                <span>Call Clinic ({contact.phoneNumber})</span>
              </a>
            ) : (
              <div
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/40 text-slate-400 font-medium text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-slate-800 cursor-not-allowed"
                title="Direct calling will be enabled once clinic verifies official telephone number"
              >
                <Phone className="w-4 h-4 text-slate-500" aria-hidden="true" />
                <span>Telephone line pending verification</span>
              </div>
            )}
          </div>

          {/* Development Notice */}
          <p className="text-[11px] text-slate-500 pt-2 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>
              Phone connection is disabled in preview mode until verified by clinic. Use the enquiry form to contact.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
