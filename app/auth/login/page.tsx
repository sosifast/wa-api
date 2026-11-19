"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MessageSquare,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import AnimatedText from "@/components/animated-text";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const errorParam = searchParams.get("error");

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (errorParam === "unauthorized_admin_access") {
      setErrorMsg("Akses ditolak: Anda tidak memiliki hak akses Administrator.");
    } else if (redirectPath) {
      setErrorMsg("Silakan login terlebih dahulu untuk mengakses halaman tersebut.");
    }
  }, [errorParam, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Login berhasil! Mengalihkan...");
        const target = redirectPath || data.redirectUrl || "/member";
        setTimeout(() => {
          router.push(target);
          router.refresh();
        }, 700);
      } else {
        setErrorMsg(data.error || "Login gagal");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30">
            <MessageSquare className="h-7 w-7" />
          </div>
          <div>
            <AnimatedText
              text="Masuk ke Portal Gateway"
              className="text-2xl font-bold tracking-tight text-slate-800"
              as="h1"
            />
          </div>
          <p className="text-xs text-slate-500">
            Akses dashboard & manajemen sesi Baileys WhatsApp Anda
          </p>
        </div>

        {/* Clean White Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-[#E7FCE8] p-3 text-xs text-[#075E54] border border-[#25D366]/30">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#25D366]" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username atau Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Masukkan username atau email"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 focus:outline-hidden transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-[11px] font-semibold text-[#128C7E] hover:text-[#075E54] transition">
                  Lupa password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 focus:outline-hidden transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] py-3 text-xs font-bold text-white shadow-md shadow-[#25D366]/20 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <span>Masuk Sekarang</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200"></div>
            <span className="text-[11px] font-semibold uppercase text-slate-400">ATAU</span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          <div className="text-center text-xs text-slate-500">
            Belum memiliki akun?{" "}
            <Link href="/auth/register" className="font-bold text-[#128C7E] hover:text-[#075E54] transition">
              Daftar Akun Member
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#25D366] border-t-transparent"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
