import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { eventoConfig } from "@/config/evento";
import { getAdminAtual } from "@/lib/admin/queries";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = {
  title: "Painel administrativo",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminAtual();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/70 bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="font-display text-lg text-evento-marrom">
            {eventoConfig.nomeEvento} · Painel
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {admin.nome}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
