import React from "react";
import Link from "next/link";
import { ClipboardList, ShieldAlert, BookOpen, HelpCircle, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/shared/Card";

export function PatientInfoSection() {
  const resources = [
    {
      icon: ClipboardList,
      title: "Preparing for Your Consultation",
      description: "Essential tips on medical history records, medication lists, and what to expect during your comprehensive first examination.",
      href: "/patient-information#first-visit",
      color: "bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300"
    },
    {
      icon: BookOpen,
      title: "Understanding Dental Implants",
      description: "Learn about the biology of osseointegration, titanium fixtures, bone suitability, and maintaining peri-implant health.",
      href: "/services/dental-implants",
      color: "bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300"
    },
    {
      icon: ShieldAlert,
      title: "Signs of Periodontal Disease",
      description: "Recognising early indicators of gingivitis and periodontitis—such as bleeding on brushing, recession, or persistent bad breath.",
      href: "/services/periodontal-care",
      color: "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300"
    },
    {
      icon: HelpCircle,
      title: "Frequently Asked Questions",
      description: "Answers to common patient inquiries regarding appointment scheduling, treatment longevity, and preventive visits.",
      href: "/patient-information#faqs",
      color: "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-900/40 transition-colors duration-200">
      <div className="clinic-container">
        <SectionHeader
          badge="Patient Resources"
          title="Educational Information for Informed Care"
          subtitle="Explore evidence-based guides designed to help you understand common dental conditions, clinical options, and consultation steps."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="flex flex-col justify-between h-full bg-slate-50/50 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800/90 group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
