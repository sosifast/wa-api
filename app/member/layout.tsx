import MemberLayoutWrapper from "@/app/layouts/member/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Area - WhatsApp Gateway",
  description: "Kelola akun WhatsApp dan layanan gateway Anda",
};

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MemberLayoutWrapper>{children}</MemberLayoutWrapper>;
}
