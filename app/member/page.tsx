"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  CheckCircle2,
  QrCode,
  ArrowRight,
  Zap,
  ShieldCheck,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import AnimatedText from "@/components/animated-text";

interface WhatsappAccount {
  id: number;
  name: string;
  phone_number: string | null;
  status: "CONNECTED" | "CONNECTING" | "DISCONNECTED";
  create_at: string;
}

export default function MemberDashboardPage() {
  const [accounts, setAccounts] = useState<WhatsappAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/whatsapp/accounts");
      const json = await res.json();
      if (json.success) {
        setAccounts(json.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    const timer = setInterval(fetchAccounts, 8000);
    return () => clearInterval(timer);
  }, []);

  const totalAccounts = accounts.length;
  const connectedAccounts = accounts.filter((a) => a.status === "CONNECTED").length;
  const connectingAccounts = accounts.filter((a) => a.status === "CONNECTING").length;

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner with WhatsApp Green Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366] p-6 text-white shadow-lg sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs">
            <Zap className="h-3.5 w-3.5 text-amber-300" />
            <span>Baileys Gateway Multi-Device</span>
          </div>

          <div>
            <AnimatedText
              text="Selamat Datang di Portal WhatsApp Gateway"
              className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white leading-tight"
              as="h1"
            />
          </div>

          <p className="text-sm text-emerald-50 leading-relaxed max-w-xl">
            Kelola sesi WhatsApp Anda, pantau koneksi real-time, dan integrasikan pengiriman pesan dengan mudah melalui API Baileys kami.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/member/whatsapp/scan-qr"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#075E54] shadow-md hover:bg-slate-50 transition-transform active:scale-95"
            >
              <QrCode className="h-4 w-4 text-[#25D366]" />
              <span>Scan QR WhatsApp Baru</span>
            </Link>
            <Link
              href="/member/whatsapp"
              className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <span>Kelola Semua Akun</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/15 blur-2xl"></div>
        <div className="pointer-events-none absolute right-1/4 -top-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-xl"></div>
      </div>

      {/* 4-Column Horizontal Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1: Total Akun */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total WhatsApp Akun
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7FCE8] text-[#075E54]">
              <Smartphone className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">
              {totalAccounts}
            </div>
            <p className="mt-1 text-xs text-slate-400">Perangkat terdaftar</p>
          </div>
        </div>

        {/* Stat 2: Akun Online */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Akun Online
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#25D366]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#25D366]">
              {connectedAccounts}
            </div>
            <p className="mt-1 text-xs font-medium text-emerald-600">Sesi terhubung aktif</p>
          </div>
        </div>

        {/* Stat 3: Menunggu Scan QR */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Menunggu Scan QR
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-600">
              {connectingAccounts}
            </div>
            <p className="mt-1 text-xs text-slate-400">Perlu dipindai</p>
          </div>
        </div>

        {/* Stat 4: Status Engine */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status Engine
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#128C7E]">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#25D366]"></span>
            </span>
            <div className="text-2xl font-extrabold text-slate-900">Online</div>
          </div>
          <p className="mt-1 text-xs text-slate-400">Baileys v7 running</p>
        </div>
      </div>

      {/* Main Content Grid: Table & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 cols): Recent Accounts Table */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Smartphone className="h-4 w-4 text-[#128C7E]" />
              <span>Akun WhatsApp Terbaru</span>
            </h2>
            <Link
              href="/member/whatsapp"
              className="flex items-center gap-1 text-xs font-semibold text-[#128C7E] hover:text-[#075E54] transition-colors"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-2 p-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#25D366] border-t-transparent"></div>
                <span className="text-xs text-slate-400">Memuat data akun...</span>
              </div>
            ) : accounts.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Smartphone className="h-6 w-6" />
                </div>
                <p className="text-xs text-slate-500">Belum ada akun WhatsApp terdaftar.</p>
                <Link
                  href="/member/whatsapp/scan-qr"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] px-4 py-2 text-xs font-semibold text-white transition-colors"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span>Scan QR Sekarang</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4 font-semibold">Perangkat</th>
                      <th className="py-3 px-4 font-semibold">Nomor WhatsApp</th>
                      <th className="py-3 px-4 font-semibold">Status Sesi</th>
                      <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accounts.slice(0, 5).map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold ${
                                acc.status === "CONNECTED"
                                  ? "bg-[#E7FCE8] text-[#075E54]"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <Smartphone className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-slate-800">{acc.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                          {acc.phone_number ? (
                            `+${acc.phone_number}`
                          ) : (
                            <span className="italic text-slate-400">Belum terhubung</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {acc.status === "CONNECTED" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7FCE8] px-2.5 py-0.5 text-[11px] font-bold text-[#075E54] border border-[#25D366]/30">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]"></span>
                              Connected
                            </span>
                          ) : acc.status === "CONNECTING" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Menunggu Scan
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                              Terputus
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href="/member/whatsapp"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Quick Actions & Baileys Features */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Sparkles className="h-4 w-4 text-[#25D366]" />
            <span>Aktivitas Cepat</span>
          </h2>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E7FCE8] text-[#075E54]">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Tautkan WhatsApp
                </h4>
                <p className="text-[11px] text-slate-500">
                  Scan QR code untuk mengaktifkan sesi Baileys
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-700 space-y-2 border border-slate-100">
              <div className="font-bold text-slate-800">
                Fitur Utama Gateway:
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#25D366] shrink-0" />
                  <span>Multi-Device WhatsApp Web (Baileys)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#25D366] shrink-0" />
                  <span>Credentials aman di PostgreSQL</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#25D366] shrink-0" />
                  <span>Auto-reconnect & penanganan 515 restart</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#25D366] shrink-0" />
                  <span>Live QR Code rendering real-time</span>
                </li>
              </ul>
            </div>

            <Link
              href="/member/whatsapp/scan-qr"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <QrCode className="h-4 w-4" />
              <span>Scan QR Sekarang</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
