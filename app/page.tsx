import Link from "next/link";
import { MessageSquare, QrCode, Smartphone, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="flex h-20 items-center justify-between border-b border-slate-800/80 px-6 sm:px-12 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg text-white">API WA Gateway</span>
            <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              Baileys Multi-Device
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="rounded-xl border border-slate-700/60 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
          >
            Masuk
          </Link>
          <Link
            href="/member"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition"
          >
            Portal Member &rarr;
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-6">
          <Zap className="h-3.5 w-3.5" />
          <span>Prisma ORM & PostgreSQL Session Storage</span>
        </div>

        <h1 className="max-w-3xl text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          WhatsApp API Gateway Multi-Device Siap Pakai
        </h1>

        <p className="mt-4 max-w-xl text-sm sm:text-base text-slate-400 leading-relaxed">
          Hubungkan akun WhatsApp dengan Baileys engine, simpan sesi & QR secara terpusat di database PostgreSQL Prisma, dan kelola dalam dashboard member yang modern.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/member/whatsapp/scan-qr"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition"
          >
            <QrCode className="h-5 w-5" />
            <span>Tautkan Perangkat (Scan QR)</span>
          </Link>

          <Link
            href="/member/whatsapp"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
          >
            <Smartphone className="h-5 w-5 text-emerald-500" />
            <span>Lihat Data Table Akun</span>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3 text-left">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-3">
              <QrCode className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">Live QR Scanner</h3>
            <p className="mt-1 text-xs text-slate-400">
              QR Code live dirender langsung ke layar dengan deteksi otomatis status tersambung.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">PostgreSQL Session</h3>
            <p className="mt-1 text-xs text-slate-400">
              Auth credentials & keys tersimpan aman di database melalui Prisma ORM.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-3">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">Member Dashboard</h3>
            <p className="mt-1 text-xs text-slate-400">
              Antarmuka terpisah dengan Sidebar, Navbar, dan Footer yang rapi dan responsif.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
