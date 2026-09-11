import type { Metadata } from "next";

import { eventoConfig } from "@/config/evento";
import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Login administrativo",
  robots: { index: false, follow: false },
};

export default function PaginaLoginAdmin({
  searchParams,
}: {
  searchParams: { redirectTo?: string };
}) {
  const redirectTo = searchParams.redirectTo || "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="space-y-6 p-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Área administrativa
            </p>
            <h1 className="mt-2 font-display text-2xl text-evento-marrom">
              {eventoConfig.nomeEvento}
            </h1>
          </div>

          <LoginForm redirectTo={redirectTo} />
        </CardContent>
      </Card>
    </main>
  );
}
