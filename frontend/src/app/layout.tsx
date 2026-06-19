import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "EcoSentinel — Carbon Footprint Awareness Platform",
    template: "%s | EcoSentinel",
  },
  description:
    "Enterprise-grade carbon footprint tracking, analytics, and AI-powered reduction strategies. Measure, understand, and act on your organisation's emissions.",
  keywords: ["carbon footprint", "GHG emissions", "sustainability", "net zero", "ESG", "carbon accounting", "AQI", "air quality"],
  authors: [{ name: "EcoSentinel" }],
  openGraph: {
    title: "EcoSentinel — Carbon Footprint Awareness Platform",
    description: "Enterprise carbon emissions tracking, air quality monitoring & reduction platform",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#030c03" />
      </head>
      <body>
        {/* Skip navigation — keyboard & screen reader accessibility (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="skip-nav"
        >
          Skip to main content
        </a>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
