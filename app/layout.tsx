import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ 
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "منصة 4IT - حلول التحول الرقمي",
  description: "شريكك التقني لتطوير البرمجيات وحلول الأعمال المتكاملة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}