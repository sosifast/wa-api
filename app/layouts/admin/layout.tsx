"use client";

import { useState } from "react";
import AdminSidebar from "./sidebar";
import AdminNavbar from "./navbar";
import AdminFooter from "./footer";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen h-[100dvh] w-full overflow-hidden bg-slate-50 text-slate-800 font-sans font-normal">
      {/* Fixed Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Layout Area */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden bg-slate-50">
        {/* Fixed Navbar */}
        <AdminNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Fixed Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}
