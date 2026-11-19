"use client";

import { useState } from "react";
import MemberSidebar from "./sidebar";
import MemberNavbar from "./navbar";
import MemberFooter from "./footer";

interface MemberLayoutWrapperProps {
  children: React.ReactNode;
}

export default function MemberLayoutWrapper({ children }: MemberLayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen h-[100dvh] w-full overflow-hidden bg-slate-50 text-slate-800 font-sans font-normal">
      {/* Fixed Sidebar (Pinned to left, does not scroll with page content) */}
      <MemberSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Layout Area */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden bg-slate-50">
        {/* Fixed Topbar / Navbar (Pinned to top, does not scroll) */}
        <MemberNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Dynamic Page Content (The ONLY area that scrolls) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Fixed Footer (Pinned to bottom, does not scroll) */}
        <MemberFooter />
      </div>
    </div>
  );
}
