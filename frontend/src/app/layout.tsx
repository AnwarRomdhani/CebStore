import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CebStore - AI-Powered E-Commerce",
  description: "Modern e-commerce platform with AI chatbot, personalized recommendations, and seamless shopping experience.",
  keywords: ["e-commerce", "shopping", "AI", "chatbot", "Tunisia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased font-[family-name:var(--font-geist-sans)] flex flex-col`}
      >
        <ToastProvider>
          <ErrorBoundary>
            <Header />
            <main className="mx-auto w-full max-w-7xl px-4 py-8 flex-1">{children}</main>
            <Footer />
          </ErrorBoundary>
        </ToastProvider>
      </body>
    </html>
  );
}
