import Link from "next/link";

export default function MemberFooter() {
  return (
    <footer className="shrink-0 border-t border-slate-200 bg-white py-3.5 px-4 sm:px-6 text-xs text-slate-500 z-20 font-normal">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-normal text-slate-500">
          &copy; 2026 <span className="font-medium text-[#075E54]">API WA Gateway</span>. All rights reserved. Powered by Baileys Multi-Device.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/member/whatsapp" className="font-normal hover:text-[#128C7E] transition-colors">
            WhatsApp
          </Link>
          <Link href="/member/ticket" className="font-normal hover:text-[#128C7E] transition-colors">
            Bantuan
          </Link>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-normal text-slate-600">
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
