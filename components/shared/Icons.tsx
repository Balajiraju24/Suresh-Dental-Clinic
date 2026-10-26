import React from "react";

export function ToothIcon({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2C8.5 2 6 4.5 6 8c0 3 1.5 6 2 9 .4 2.2 1.5 3 2.5 3 1.2 0 1.5-2 1.5-4 0 2 .3 4 1.5 4 1 0 2.1-.8 2.5-3 .5-3 2-6 2-9 0-3.5-2.5-6-6-6Z" />
    </svg>
  );
}
