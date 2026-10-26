import React from "react";
import Link from "next/link";
import { MapPin, Clock, Shield, AlertTriangle, ArrowRight, Phone } from "lucide-react";
import { clinicConfig } from "@/config/clinic";
import { mainNavItems, footerServiceLinks, footerPatientLinks } from "@/config/navigation";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Footer Section */}
      <div className="clinic-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Clinic Identity & Clinical Stance */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-slate-950 flex items-center justify-center font-bold text-lg">
                S
              </span>
              <div>
                <span className="font-bold text-white text-lg tracking-tight block">
                  {clinicConfig.clinicName}
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">
                  Raja Annamalaipuram (R.A. Puram), Chennai
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Evidence-based dental care with dedicated focus in periodontal health,
              alveolar bone preservation, and precision implant dentistry.
            </p>

            <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 font-medium text-slate-300">
                <Shield className="w-4 h-4 text-sky-400 flex-shrink-0" aria-hidden="true" />
                <span>Clinical Leadership: {clinicConfig.doctor.formalTitle}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Academic qualifications: {clinicConfig.doctor.qualificationsDisplay}. Clinic
                operational parameters are verified prior to formal public launch.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-teal-400 transition-colors" aria-hidden="true" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Services */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Clinical Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerServiceLinks.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-teal-400 transition-colors" aria-hidden="true" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Practice Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Clinic Location
            </h3>

            <div className="text-xs text-slate-400 space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="text-slate-300 font-medium block">
                    {clinicConfig.location.streetAddress}
                  </span>
                  <span>
                    {clinicConfig.location.locality}, {clinicConfig.location.city} – {clinicConfig.location.postalCode}
                  </span>
                  <span className="block text-[11px] text-teal-400/90 mt-0.5">
                    (Verified Clinic Location)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-slate-300 font-medium">Consultation Timings:</p>
                  <p>Mon – Sat: 10:00 AM – 12:00 PM</p>
                  <p>Evening: 4:30 PM – 8:30 PM</p>
                  <p className="text-slate-400">Sunday: Closed</p>
                  <p className="text-[11px] text-teal-400/90 mt-1 font-medium">
                    Verified Google Business Profile
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${clinicConfig.contact.phoneNumber}`}
                  className="text-slate-300 hover:text-white font-medium hover:underline text-xs"
                >
                  {clinicConfig.contact.displayPhone}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>View Contact &amp; Directions</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Verification & Legal Bottom Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="clinic-container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>
              &copy; {currentYear} {clinicConfig.displayName}. All rights reserved.
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link
              href="/privacy-policy"
              className="text-slate-400 hover:text-slate-200 transition-colors underline"
            >
              Privacy Policy (Draft Healthcare Disclaimer)
            </Link>
          </div>

          <div className="flex items-center gap-1.5 text-amber-500/90 text-center text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>
              Complimentary preview build for clinic review. Content does not constitute individual medical diagnosis.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
