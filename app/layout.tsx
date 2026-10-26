import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VerificationBanner } from "@/components/layout/VerificationBanner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
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
    "Dental Clinic Chennai",
    "Dentist RA Puram",
    "Dental Implants Chennai",
    "Periodontist Chennai",
    "Gum treatment Chennai",
    "Raja Annamalaipuram dental clinic",
    "Periodontal care",
    "Oral health Chennai",
  ],
  authors: [{ name: clinicConfig.doctor.fullName }],
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
  // Conservative Schema.org JSON-LD Structured Data
  // Reflects provisional Monday - Sunday 10am - 8pm consultation hours
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinicConfig.clinicName,
    alternateName: clinicConfig.displayName,
    description: clinicConfig.description,
    url: "https://sureshdental.clinic",
    address: {
      "@type": "PostalAddress",
      addressLocality: clinicConfig.location.locality,
      addressRegion: clinicConfig.location.state,
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
      jobTitle: "Lead Dentist & Periodontist",
    },
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
          "Sunday",
        ],
        opens: "10:00",
        closes: "20:00",
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
          {/* Accessible Skip Link for Screen Readers & Keyboard Navigation */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-800 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
          >
            Skip to main content
          </a>

          {/* Development & Verification Status Banner */}
          <VerificationBanner />

          {/* Global Responsive Header */}
          <Header />

          {/* Main Page Content Landmark */}
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
