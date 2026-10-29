import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PublicShell } from "@/components/layout/PublicShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { clinicConfig } from "@/config/clinic";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0c2340" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sureshdental.clinic"),
  title: {
    default: `${clinicConfig.clinicName} | Chennai`,
    template: `%s | ${clinicConfig.displayName}`,
  },
  description: clinicConfig.description,
  keywords: [
    "Dr R Suresh",
    "Dr Ashritha Suresh",
    "Dental Clinic Chennai",
    "Dentist RA Puram",
    "Dental Implants Chennai",
    "Periodontist Chennai",
    "Gum treatment Chennai",
    "Raja Annamalaipuram dental clinic",
    "Sri Ramachandra Dental Graduate",
    "IIT Madras dental biomaterials",
    "Periodontal care",
    "Oral health Chennai",
  ],
  authors: [
    { name: clinicConfig.doctor.fullName },
    { name: clinicConfig.associateDoctor.fullName },
  ],
  creator: clinicConfig.displayName,
  publisher: clinicConfig.clinicName,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sureshdental.clinic",
    title: clinicConfig.clinicName,
    description: clinicConfig.description,
    siteName: clinicConfig.displayName,
    images: [
      {
        url: "/images/clinic-hero.jpg",
        width: 1200,
        height: 675,
        alt: `${clinicConfig.displayName} - Operatory in Raja Annamalaipuram, Chennai`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: clinicConfig.displayName,
    description: clinicConfig.description,
    images: ["/images/clinic-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinicConfig.clinicName,
    alternateName: clinicConfig.displayName,
    description: clinicConfig.description,
    url: "https://sureshdental.clinic",
    telephone: clinicConfig.contact.phoneNumber || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinicConfig.location.streetAddress || undefined,
      addressLocality: clinicConfig.location.locality,
      addressRegion: clinicConfig.location.state,
      postalCode: clinicConfig.location.postalCode || undefined,
      addressCountry: clinicConfig.location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "13.0238",
      longitude: "80.2544",
    },
    medicalSpecialty: [
      "Periodontics",
      "DentalImplantology",
      "Dentistry",
    ],
    founder: {
      "@type": "Person",
      name: clinicConfig.doctor.fullName,
      honorificPrefix: clinicConfig.doctor.salutation,
      jobTitle: "Lead Periodontist & Implantologist",
    },
    employee: [
      {
        "@type": "Person",
        name: clinicConfig.doctor.fullName,
        honorificPrefix: clinicConfig.doctor.salutation,
        jobTitle: clinicConfig.doctor.role,
      },
      {
        "@type": "Person",
        name: clinicConfig.associateDoctor.fullName,
        honorificPrefix: clinicConfig.associateDoctor.salutation,
        jobTitle: clinicConfig.associateDoctor.role,
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "12:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "16:30",
        closes: "20:30",
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (t === 'dark' || (!t && m)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-100 selection:text-sky-900 dark:selection:bg-sky-900 dark:selection:text-sky-100 transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <PublicShell>
              {children}
            </PublicShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
