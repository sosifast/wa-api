"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  QrCode,
  CreditCard,
  LifeBuoy,
  User,
  LogOut,
  Smartphone,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  level: string;
}

export default function MemberSidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      router.push("/auth/login");
      router.refresh();
    }
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/member",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "WhatsApp Akun",
      href: "/member/whatsapp/account",
      icon: Smartphone,
      match: ["/member/whatsapp", "/member/whatsapp/account"],
    },
    {
      name: "Scan QR WhatsApp",
      href: "/member/whatsapp/scan-qr",
      icon: QrCode,
    },
    {
      name: "Membership Plan",
      href: "/member/membership/plan",
      icon: CreditCard,
    },
    {
      name: "Bantuan & Tiket",
      href: "/member/ticket",
      icon: LifeBuoy,
    },
    {
      name: "Profil Akun",
      href: "/member/account",
      icon: User,
    },
  ];

  const isActive = (item: (typeof navigation)[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    if (item.match) {
      return item.match.includes(pathname);
    }
    return pathname.startsWith(item.href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Fixed Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-68 h-full flex-col bg-white text-slate-800 border-r border-slate-200 font-normal transition-transform duration-300 ease-in-out lg:static lg:h-full lg:shrink-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header (Fixed top in sidebar) */}
        <div className="flex h-18 shrink-0 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md shadow-[#25D366]/30">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight text-[#075E54] flex items-center gap-1.5">
              <span>WA Gateway</span>
              <span className="rounded-md bg-[#25D366]/20 px-1.5 py-0.5 text-[10px] font-medium text-[#075E54]">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-normal text-slate-400">Member Portal</p>
          </div>
        </div>

        {/* Navigation list (Scrollable only if menu items exceed height) */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>
          {navigation.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-normal transition-all ${
                  active
                    ? "bg-[#E7FCE8] text-[#075E54] font-medium shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      active ? "text-[#128C7E]" : "text-slate-400 group-hover:text-[#128C7E]"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight className="h-4 w-4 text-[#128C7E] opacity-80" />}
              </Link>
            );
          })}

          {/* Quick link to Admin if user is Admin */}
          {user?.level === "Admin" && (
            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-amber-600">
                Akses Khusus Admin
              </div>
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-800 hover:bg-amber-100 transition"
              >
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <span>Buka Panel Admin</span>
              </Link>
            </div>
          )}
        </div>

        {/* User Card & Logout (Fixed bottom in sidebar) */}
        <div className="shrink-0 border-t border-slate-100 p-4 bg-slate-50/70">
          <div className="rounded-xl bg-white border border-slate-200 p-3 mb-2 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-medium text-xs uppercase shadow-xs">
                {user?.fullName?.slice(0, 2) || "MB"}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-medium text-slate-800">
                  {user?.fullName || "Member User"}
                </p>
                <p className="truncate text-[11px] font-normal text-slate-400">
                  {user?.email || "member@portal.com"}
                </p>
              </div>
            </div>
            <span className="rounded-md bg-[#25D366]/20 px-1.5 py-0.5 text-[10px] font-medium text-[#075E54] uppercase">
              {user?.level || "Member"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-normal text-red-600 hover:bg-red-100 hover:border-red-300 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
}
