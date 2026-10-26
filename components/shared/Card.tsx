import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  id?: string;
}

export function Card({
  children,
  className = "",
  hoverEffect = true,
  padding = "md",
  id
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-4 sm:p-5",
    md: "p-6 sm:p-8",
    lg: "p-8 sm:p-10"
  };

  return (
    <div
      id={id}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm ${
        hoverEffect
          ? "transition-all duration-300 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5"
          : ""
      } ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
