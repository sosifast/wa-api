"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Smartphone,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import AnimatedText from "@/components/animated-text";

interface UserItem {
  id: number;
  full_name: string;
  username: string;
  email: string;
  level: string;
  status: string;
  create_at: string;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalWa, setTotalWa] = useState(0);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [userRes, waRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/whatsapp/accounts"),
      ]);

      const userData = await userRes.json();
      const waData = await waRes.json();

      if (userData.success) {
        setUsers(userData.data);
      }
      if (waData.success) {
        setTotalWa(waData.data.length);
      }
    } catch (err) {
      console.error("Gagal mengambil data admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.level === "Admin").length;
  const activeUsers = users.filter((u) => u.status === "Active").length;

  return (
    <div className="space-y-8">
      {/* Admin Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#075E54] via-[#128C7E] to-slate-900 p-6 text-white shadow-lg sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-200 border border-rose-400/30">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span>Administrator Access Level Verified</span>
          </div>

          <div>
            <AnimatedText
              text="Panel Administrator Sistem"
              className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white leading-tight"
              as="h1"
            />
          </div>

          <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
            Pusat kendali pengguna, manajemen otorisasi level akses (RBAC), dan pengawasan infrastruktur WhatsApp Gateway.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/admin/user"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#075E54] shadow-md hover:bg-slate-50 transition"
            >
              <Users className="h-4 w-4 text-[#25D366]" />
              <span>Kelola Seluruh Pengguna</span>
            </Link>
            <Link
              href="/member"
              className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition"
            >
              <span>Buka Portal Member</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      {/* 4-Column Horizontal Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Pengguna
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{totalUsers}</div>
            <p className="mt-1 text-xs text-slate-400">Semua akun terdaftar</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pengguna Aktif
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7FCE8] text-[#25D366]">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#25D366]">{activeUsers}</div>
            <p className="mt-1 text-xs font-medium text-emerald-600">Status Active</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Admin / Root
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-rose-600">{totalAdmins}</div>
            <p className="mt-1 text-xs text-slate-400">Hak akses root</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              WhatsApp Akun
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#128C7E]">
              <Smartphone className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#128C7E]">{totalWa}</div>
            <p className="mt-1 text-xs text-slate-400">Terdaftar di sistem</p>
          </div>
        </div>
      </div>

      {/* Recent Users preview Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Users className="h-4 w-4 text-[#075E54]" />
            <span>Pengguna Terdaftar Terbaru</span>
          </h2>
          <Link
            href="/admin/user"
            className="flex items-center gap-1 text-xs font-semibold text-[#128C7E] hover:text-[#075E54] transition"
          >
            <span>Buka Tabel User Lengkap</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 p-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#075E54] border-t-transparent"></div>
              <span className="text-xs text-slate-400">Memuat data pengguna...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada pengguna di database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Nama & Username</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role / Level</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Tanggal Registrasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.slice(0, 5).map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{u.full_name}</div>
                        <div className="text-[11px] text-slate-400">@{u.username}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                            u.level === "Admin"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-[#E7FCE8] text-[#075E54] border border-[#25D366]/30"
                          }`}
                        >
                          {u.level === "Admin" ? (
                            <ShieldAlert className="h-3 w-3" />
                          ) : (
                            <ShieldCheck className="h-3 w-3" />
                          )}
                          {u.level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            u.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(u.create_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
