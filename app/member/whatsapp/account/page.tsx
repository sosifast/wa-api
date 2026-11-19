"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  PowerOff,
  QrCode,
  Filter,
} from "lucide-react";
import AnimatedText from "@/components/animated-text";

interface WhatsappAccount {
  id: number;
  uuid: string;
  name: string;
  phone_number: string | null;
  jid: string | null;
  status: "CONNECTED" | "CONNECTING" | "DISCONNECTED";
  qr: string | null;
  create_at: string;
  update_at: string;
}

export default function WhatsappAccountsPage() {
  const [accounts, setAccounts] = useState<WhatsappAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/whatsapp/accounts");
      const json = await res.json();
      if (json.success) {
        setAccounts(json.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data akun:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    const interval = setInterval(fetchAccounts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDisconnect = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin memutuskan koneksi akun WhatsApp ini?")) return;
    try {
      setActionLoading(id);
      const res = await fetch(`/api/whatsapp/accounts/${id}/disconnect`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        fetchAccounts();
      } else {
        alert(data.error || "Gagal memutuskan koneksi");
      }
    } catch {
      alert("Terjadi kesalahan saat memutuskan akun");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Peringatan: Menghapus akun akan menghapus semua session data Baileys di database. Lanjutkan?")) return;
    try {
      setActionLoading(id);
      const res = await fetch(`/api/whatsapp/accounts/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchAccounts();
      } else {
        alert(data.error || "Gagal menghapus akun");
      }
    } catch {
      alert("Terjadi kesalahan saat menghapus akun");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.phone_number && acc.phone_number.includes(searchQuery));
    const matchesStatus =
      statusFilter === "ALL" || acc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const connectedCount = accounts.filter((a) => a.status === "CONNECTED").length;
  const connectingCount = accounts.filter((a) => a.status === "CONNECTING").length;

  return (
    <div className="space-y-6">
      {/* Header section with Anime.js AnimatedText */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E7FCE8] text-[#075E54]">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <AnimatedText
                text="Daftar Akun WhatsApp"
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800"
                as="h1"
              />
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola koneksi perangkat WhatsApp dan status sesi Baileys Multi-Device
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAccounts}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#25D366]" : "text-slate-500"}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/member/whatsapp/scan-qr"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] px-4 py-2 text-xs font-semibold text-white transition shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah & Scan QR</span>
          </Link>
        </div>
      </div>

      {/* 3-Column Horizontal Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Akun
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7FCE8] text-[#075E54]">
              <Smartphone className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{accounts.length}</div>
            <p className="mt-0.5 text-xs text-slate-400">Perangkat terdaftar</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Akun Terhubung
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#25D366]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#25D366]">{connectedCount}</div>
            <p className="mt-0.5 text-xs font-medium text-emerald-600">Online aktif</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Terputus / Menunggu
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-600">
              {accounts.length - connectedCount}
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              {connectingCount > 0 ? `${connectingCount} menunggu scan` : "Perlu disambung ulang"}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama perangkat atau nomor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#25D366] focus:bg-white focus:outline-hidden transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#25D366] focus:outline-hidden"
            >
              <option value="ALL">Semua Status</option>
              <option value="CONNECTED">Online / Connected</option>
              <option value="CONNECTING">Menghubungkan (Scan)</option>
              <option value="DISCONNECTED">Terputus</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accounts Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Perangkat / Akun</th>
                <th className="py-3 px-4">Nomor WhatsApp</th>
                <th className="py-3 px-4">Status Sesi</th>
                <th className="py-3 px-4">Waktu Dibuat</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && accounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#25D366] border-t-transparent"></div>
                      <span className="text-xs text-slate-400">Memuat data akun WhatsApp...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7FCE8] text-[#075E54]">
                        <Smartphone className="h-7 w-7" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-800">
                        Belum ada akun WhatsApp terdaftar
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm">
                        Mulai dengan menambahkan perangkat WhatsApp baru dan scan QR Code untuk menghubungkan sesi Baileys.
                      </p>
                      <Link
                        href="/member/whatsapp/scan-qr"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] px-4 py-2 text-xs font-semibold text-white transition mt-2 shadow-xs"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Akun Sekarang</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => {
                  const isAction = actionLoading === account.id;

                  return (
                    <tr key={account.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold ${
                              account.status === "CONNECTED"
                                ? "bg-[#E7FCE8] text-[#075E54]"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <Smartphone className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-800">
                              {account.name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              ID: #{account.id} &bull; {account.uuid.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700">
                        {account.phone_number ? (
                          `+${account.phone_number}`
                        ) : (
                          <span className="italic text-slate-400 text-[11px]">Belum terhubung</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {account.status === "CONNECTED" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7FCE8] px-2.5 py-0.5 text-[11px] font-bold text-[#075E54] border border-[#25D366]/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]"></span>
                            Connected
                          </span>
                        ) : account.status === "CONNECTING" ? (
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

                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {new Date(account.create_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {account.status === "CONNECTED" ? (
                            <button
                              onClick={() => handleDisconnect(account.id)}
                              disabled={isAction}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition disabled:opacity-50"
                            >
                              <PowerOff className="h-3 w-3" />
                              <span>Putuskan</span>
                            </button>
                          ) : (
                            <Link
                              href={`/member/whatsapp/scan-qr?id=${account.id}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#25D366] hover:bg-[#128C7E] px-2.5 py-1 text-xs font-semibold text-white transition shadow-xs"
                            >
                              <QrCode className="h-3 w-3" />
                              <span>Scan QR</span>
                            </Link>
                          )}

                          <button
                            onClick={() => handleDelete(account.id)}
                            disabled={isAction}
                            title="Hapus Akun"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
