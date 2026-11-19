"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Bell, QrCode } from "lucide-react";

interface NavbarProps {
  onToggleSidebar: () => void;
}

interface UserProfile {
  fullName: string;
  email: string;
  level: string;
}

export default function MemberNavbar({ onToggleSidebar }: NavbarProps) {
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

  return (
    <header className="sticky top-0 z-30 shrink-0 flex h-18 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-8 backdrop-blur-md font-normal">
      {/* Left side: mobile toggle & engine indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Menu"
          className="btn btn-ghost btn-square btn-sm text-slate-700 lg:hidden hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#E7FCE8] px-3 py-1 border border-[#25D366]/30">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25D366]"></span>
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#075E54]">
            Baileys Engine Active
          </span>
        </div>
      </div>

      {/* Right side: quick actions & avatar */}
      <div className="flex items-center gap-3">
        <Link
          href="/member/whatsapp/scan-qr"
          className="btn btn-sm bg-[#25D366] hover:bg-[#128C7E] text-white border-0 font-normal gap-2 shadow-xs transition-colors"
        >
          <QrCode className="h-4 w-4" />
          <span className="hidden sm:inline">Scan QR WhatsApp</span>
        </Link>

        {/* Notifications button */}
        <button
          aria-label="Notifikasi"
          className="btn btn-ghost btn-circle btn-sm text-slate-600 hover:bg-slate-100 relative"
        >
          <div className="indicator">
            <Bell className="h-4 w-4" />
            <span className="badge badge-xs bg-[#25D366] border-0 indicator-item"></span>
          </div>
        </button>

        {/* User avatar & info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="avatar placeholder">
            <div className="bg-[#25D366] text-white rounded-xl w-8 h-8 flex items-center justify-center font-medium text-xs shadow-xs">
              <span className="uppercase">
                {user?.fullName?.slice(0, 2) || "WA"}
              </span>
            </div>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-medium text-slate-800 leading-tight">
              {user?.fullName || "Member User"}
            </p>
            <p className="text-[11px] font-normal text-slate-400">
              {user?.email || "member@portal.com"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
