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
    info: "bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/80",
    neutral: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700",
    warning: "bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/80"
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
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
