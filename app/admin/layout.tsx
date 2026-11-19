import AdminLayoutWrapper from "@/app/layouts/admin/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - WhatsApp Gateway",
  description: "Panel Kontrol Administrator WhatsApp Gateway",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
