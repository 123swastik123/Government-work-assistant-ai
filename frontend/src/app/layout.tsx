import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAssistant } from "@/components/assistant/FloatingAssistant";

export const metadata: Metadata = {
  title: {
    default: "NammaPath Karnataka",
    template: "%s | NammaPath Karnataka",
  },
  description:
    "Clear, personalized citizen guidance for Karnataka government services. We explain the path; official portals complete the transaction.",
  keywords: ["government", "Karnataka", "Aadhaar", "PAN", "driving licence", "certificates", "citizen services", "India"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "NammaPath Karnataka",
    description: "Tell us what you need. We'll show you the path.",
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: "NammaPath Karnataka" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#073E45",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white antialiased overflow-x-hidden">
        <Providers>
          <Navbar />
          <main className="flex-1 overflow-x-hidden">{children}</main>
          <Footer />
          <FloatingAssistant />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                fontSize: "14px",
                fontFamily: "Inter, system-ui, sans-serif",
                maxWidth: "360px",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
