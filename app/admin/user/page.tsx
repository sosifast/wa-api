"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Smartphone,
  Filter,
} from "lucide-react";
import AnimatedText from "@/components/animated-text";

interface AdminUser {
  id: number;
  uuid: string;
  full_name: string;
  username: string;
  email: string;
  level: "Member" | "Admin";
  status: "Active" | "In_Active" | "In-Active";
  create_at: string;
  _count?: {
    whatsapp_accounts: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: AdminUser) => {
    const newStatus = user.status === "Active" ? "In-Active" : "Active";
    if (
      !confirm(
        `Ubah status pengguna ${user.full_name} menjadi "${newStatus}"?`
      )
    )
      return;

    try {
      setActionLoading(user.id);
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || "Gagal mengubah status pengguna");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRole = async (user: AdminUser) => {
    const newLevel = user.level === "Admin" ? "Member" : "Admin";
    if (
      !confirm(
        `Ubah hak akses level ${user.full_name} menjadi "${newLevel}"?`
      )
    )
      return;

    try {
      setActionLoading(user.id);
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: newLevel }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || "Gagal mengubah level");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Hapus pengguna ${user.full_name} (${user.email})?`)) return;

    try {
      setActionLoading(user.id);
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || "Gagal menghapus pengguna");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "ALL" || u.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header section with Anime.js */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#075E54] text-white">
            <Users className="h-5 w-5 text-[#25D366]" />
          </div>
          <div>
            <AnimatedText
              text="Manajemen Pengguna"
              className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800"
              as="h1"
            />
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola akun, ubah role (Admin/Member), serta status akses (Active/In-Active)
            </p>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#075E54]" : "text-slate-500"}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, username, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#075E54] focus:bg-white focus:outline-hidden transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Filter Level:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#075E54] focus:outline-hidden"
            >
              <option value="ALL">Semua Level</option>
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Level Akses</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4">Perangkat WA</th>
                <th className="py-3 px-4">Tgl Registrasi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#075E54] border-t-transparent"></div>
                      <span className="text-xs text-slate-400">Memuat data pengguna...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    Tidak ada pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isBusy = actionLoading === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold uppercase text-xs ${
                              user.level === "Admin"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-[#E7FCE8] text-[#075E54]"
                            }`}
                          >
                            {user.full_name.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-slate-800">
                              {user.full_name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              @{user.username} &bull; ID: #{user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">{user.email}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                            user.level === "Admin"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-[#E7FCE8] text-[#075E54] border border-[#25D366]/30"
                          }`}
                        >
                          {user.level === "Admin" ? (
                            <ShieldAlert className="h-3 w-3" />
                          ) : (
                            <ShieldCheck className="h-3 w-3" />
                          )}
                          {user.level}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            user.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        <span className="inline-flex items-center gap-1">
                          <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{user._count?.whatsapp_accounts ?? 0}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(user.create_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleRole(user)}
                            disabled={isBusy}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                          >
                            Set {user.level === "Admin" ? "Member" : "Admin"}
                          </button>

                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={isBusy}
                            className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition disabled:opacity-50 ${
                              user.status === "Active"
                                ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {user.status === "Active" ? "Non-Aktifkan" : "Aktifkan"}
                          </button>

                          <button
                            onClick={() => handleDelete(user)}
                            disabled={isBusy}
                            title="Hapus User"
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
