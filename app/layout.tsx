import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { FloatingNav } from "@/components/nav/floating-nav";

const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kanso - clinical Operations Platform",
  description: "Unified operations for clinical service businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/" afterSignInUrl="/onboarding" afterSignUpUrl="/onboarding">
      <html lang="en" className="font-sans">
        <body
          className={`${arimo.variable} font-sans antialiased`}
        >
          <FloatingNav />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
