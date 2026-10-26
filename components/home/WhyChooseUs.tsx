import React from "react";
import { MessageSquare, Heart, ShieldCheck, Sparkles, Scale, Stethoscope } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/shared/Card";

export function WhyChooseUs() {
  const principles = [
    {
      icon: MessageSquare,
      title: "Clear Treatment Communication",
      description: "We explain clinical observations, diagnostic findings, and available treatment avenues in straightforward language, empowering you to make informed decisions without pressure.",
      colorClass: "bg-sky-50 text-sky-700"
    },
    {
      icon: Stethoscope,
      title: "Individualised Consultations",
      description: "No two oral microbiomes or dentitions are identical. Each consultation is allocated dedicated time to evaluate your unique dental history, periodontal status, and systemic considerations.",
      colorClass: "bg-teal-50 text-teal-700"
    },
    {
      icon: Heart,
      title: "Attention to Patient Comfort",
      description: "From local anaesthetic administration to gentle handling of inflamed tissues, our clinical protocols prioritize a tranquil, reassuring environment designed to ease dental anxiety.",
      colorClass: "bg-rose-50 text-rose-700"
    },
    {
      icon: ShieldCheck,
      title: "Emphasis on Preventive Care",
      description: "Preserving natural tooth structure and maintaining healthy alveolar bone are our primary objectives, targeting early demineralisation and gingival inflammation before invasive treatments become necessary.",
      colorClass: "bg-emerald-50 text-emerald-700"
    },
    {
      icon: Scale,
      title: "Conservative Clinical Philosophy",
      description: "We subscribe to minimally invasive dentistry: recommending restorative interventions or tooth extractions only when biologically essential and supported by clinical evidence.",
      colorClass: "bg-indigo-50 text-indigo-700"
    },
    {
      icon: Sparkles,
      title: "Sterile & Hygienic Practice",
      description: "Strict sterilization, autoclave monitoring, and barrier protection protocols safeguard patient wellness throughout every examination and clinical procedure.",
      colorClass: "bg-amber-50 text-amber-700"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="clinic-container">
        <SectionHeader
          badge="Our Clinical Standards"
          title="Patient-Centred Care Grounded in Evidence"
          subtitle="Our practice philosophy revolves around transparent dialogue, clinical precision, and respectful, unhurried care."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {principles.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="flex flex-col justify-between h-full bg-slate-50/50 hover:bg-white"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.colorClass} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
