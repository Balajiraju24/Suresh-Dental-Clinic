import React from "react";

interface SectionHeaderProps {
  badge?: string;
  badgeType?: "info" | "neutral" | "warning";
  title: string;
  subtitle?: string;
  alignment?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  badge,
  badgeType = "info",
  title,
  subtitle,
  alignment = "center",
  className = ""
}: SectionHeaderProps) {
  const isCentered = alignment === "center";

  const badgeStyles = {
    info: "bg-sky-50 text-sky-800 border-sky-200/80",
    neutral: "bg-slate-100 text-slate-800 border-slate-200",
    warning: "bg-amber-50 text-amber-900 border-amber-200"
  };

  return (
    <div
      className={`max-w-3xl mb-12 ${
        isCentered ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      {badge && (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border mb-3 ${badgeStyles[badgeType]}`}
        >
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
