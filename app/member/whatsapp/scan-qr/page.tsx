"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Info,
} from "lucide-react";
import AnimatedText from "@/components/animated-text";

interface WhatsappAccount {
  id: number;
  name: string;
  phone_number: string | null;
  status: "CONNECTED" | "CONNECTING" | "DISCONNECTED";
  qr: string | null;
}

function ScanQrContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const existingId = searchParams.get("id");

  const [name, setName] = useState("");
  const [activeAccount, setActiveAccount] = useState<WhatsappAccount | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(45);

  // If id is provided in URL, fetch or start connect
  useEffect(() => {
    if (!existingId) return;

    let isMounted = true;
    const fetchExisting = async () => {
      try {
        setSubmitting(true);
        // Ensure connection session is initiated
        await fetch(`/api/whatsapp/accounts/${existingId}/connect`, {
          method: "POST",
        });

        const res = await fetch(`/api/whatsapp/accounts/${existingId}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setActiveAccount(data.data);
          setName(data.data.name);
        }
      } catch (err) {
        console.error("Error connecting existing account:", err);
      } finally {
        if (isMounted) setSubmitting(false);
      }
    };

    fetchExisting();

    return () => {
      isMounted = false;
    };
  }, [existingId]);

  // Polling for QR and connection status while active account is CONNECTING
  useEffect(() => {
    if (!activeAccount || activeAccount.status === "CONNECTED") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/whatsapp/accounts/${activeAccount.id}`);
        const data = await res.json();
        if (data.success) {
          setActiveAccount(data.data);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeAccount]);

  // Countdown timer for QR refresh indication
  useEffect(() => {
    if (!activeAccount || activeAccount.status === "CONNECTED") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAccount]);

  // Create new account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Nama akun wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      const res = await fetch("/api/whatsapp/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setActiveAccount(data.data);
        setCountdown(45);
      } else {
        setErrorMsg(data.error || "Gagal membuat sesi WhatsApp");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan, silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefreshQr = async () => {
    if (!activeAccount) return;
    try {
      setSubmitting(true);
      await fetch(`/api/whatsapp/accounts/${activeAccount.id}/connect`, {
        method: "POST",
      });
      setCountdown(45);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Navigation */}
      <div>
        <Link
          href="/member/whatsapp"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#075E54] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Daftar Akun WhatsApp</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b border-slate-100 bg-slate-50/70 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md shadow-[#25D366]/20">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <AnimatedText
                text="Tautkan Perangkat WhatsApp"
                className="text-xl font-bold tracking-tight text-slate-800"
                as="h1"
              />
              <p className="text-xs text-slate-500 mt-0.5">
                Scan QR Code menggunakan aplikasi WhatsApp di ponsel Anda melalui Baileys Engine
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* STEP 1: Name input if no active account */}
          {!activeAccount ? (
            <div className="mx-auto max-w-md py-6 space-y-6">
              <div className="flex items-center justify-center gap-3 text-xs font-semibold text-slate-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white text-[11px] font-bold">
                  1
                </span>
                <span className="text-[#075E54] font-bold">Beri Nama</span>
                <span className="h-px w-8 bg-slate-200"></span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-[11px]">
                  2
                </span>
                <span>Scan QR</span>
                <span className="h-px w-8 bg-slate-200"></span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-[11px]">
                  3
                </span>
                <span>Selesai</span>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Akun / Label Perangkat
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: WhatsApp CS 1, Admin Toko"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 focus:outline-hidden transition"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Label ini berguna untuk membedakan nomor jika Anda menghubungkan banyak akun.
                  </p>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] py-3 text-xs font-bold text-white shadow-md shadow-[#25D366]/20 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Membuat Sesi Baileys...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4" />
                      <span>Lanjut & Generate QR Code</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : activeAccount.status === "CONNECTED" ? (
            /* STEP 3: CONNECTED SUCCESS SCREEN */
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E7FCE8] text-[#25D366] shadow-md shadow-[#25D366]/20">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-800">
                  WhatsApp Berhasil Terhubung!
                </h3>
                <p className="text-xs text-slate-500">
                  Akun <strong className="text-slate-700">{activeAccount.name}</strong> aktif dengan nomor:
                </p>
                <div className="inline-block mt-2 rounded-xl bg-[#E7FCE8] px-4 py-2 font-mono text-sm font-bold text-[#075E54] border border-[#25D366]/30">
                  +{activeAccount.phone_number || "Nomor Terdeteksi"}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/member/whatsapp"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] px-4 py-2.5 text-xs font-bold text-white transition shadow-xs"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Lihat di Data Table</span>
                </Link>
                <button
                  onClick={() => {
                    setActiveAccount(null);
                    setName("");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Tautkan Akun Lain
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: DISPLAYING QR CODE & INSTRUCTIONS */
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
              {/* QR Code Box */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
                    Menunggu Pindai Kode QR
                  </span>
                </div>

                <div className="relative flex h-72 w-72 items-center justify-center rounded-2xl bg-white p-3 shadow-md border border-slate-200">
                  {activeAccount.qr ? (
                    <img
                      src={activeAccount.qr}
                      alt="WhatsApp QR Code"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-center p-4">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#25D366] border-t-transparent"></div>
                      <p className="text-xs text-slate-500">Menginisiasi Baileys Engine & membuat QR Code...</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between w-full max-w-[288px] text-[11px] text-slate-500">
                  <span>Refresh otomatis: {countdown}s</span>
                  <button
                    onClick={handleRefreshQr}
                    disabled={submitting}
                    className="inline-flex items-center gap-1 font-semibold text-[#128C7E] hover:text-[#075E54] transition"
                  >
                    <RefreshCw className={`h-3 w-3 ${submitting ? "animate-spin" : ""}`} />
                    <span>Muat Ulang QR</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Info className="h-4 w-4 text-[#128C7E]" />
                    <span>Petunjuk Menautkan WhatsApp</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Pastikan koneksi internet ponsel Anda stabil saat melakukan pemindaian QR code.
                  </p>
                </div>

                <ol className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E7FCE8] text-[11px] font-bold text-[#075E54]">
                      1
                    </span>
                    <span>
                      Buka aplikasi <strong>WhatsApp</strong> di handphone Anda.
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E7FCE8] text-[11px] font-bold text-[#075E54]">
                      2
                    </span>
                    <span>
                      Ketuk icon titik tiga <strong>(⋮)</strong> di Android atau menu <strong>Pengaturan (Settings)</strong> di iPhone.
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E7FCE8] text-[11px] font-bold text-[#075E54]">
                      3
                    </span>
                    <span>
                      Pilih menu <strong>Perangkat Tertaut (Linked Devices)</strong>.
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E7FCE8] text-[11px] font-bold text-[#075E54]">
                      4
                    </span>
                    <span>
                      Ketuk <strong>Tautkan Perangkat (Link a Device)</strong>, lalu arahkan kamera ke <strong>QR Code</strong> di samping.
                    </span>
                  </li>
                </ol>

                <div className="flex items-start gap-3 rounded-2xl bg-[#E7FCE8]/70 p-4 border border-[#25D366]/20 text-xs">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#075E54] mt-0.5" />
                  <div>
                    <div className="font-bold text-[#075E54]">Enkripsi End-to-End</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Sesi Baileys dan token auth disimpan aman di database PostgreSQL Prisma Anda.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ScanQrPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#25D366] border-t-transparent"></div>
        </div>
      }
    >
      <ScanQrContent />
    </Suspense>
  );
}
