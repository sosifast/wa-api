import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhatsApp API Gateway",
  description: "Platform WhatsApp Gateway Multi-Device terintegrasi Baileys dan Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="light" className="h-full bg-white text-slate-900 antialiased">
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans">{children}</body>
    </html>
  );
}
