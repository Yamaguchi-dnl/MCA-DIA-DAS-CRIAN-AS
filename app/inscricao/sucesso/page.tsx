import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, PartyPopper } from "lucide-react";

import { eventoConfig } from "@/config/evento";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Inscrição confirmada",
};

export default function PaginaSucesso({
  searchParams,
}: {
  searchParams: { nome?: string };
}) {
  const nome = searchParams.nome?.trim();

  return (
    <>
      <Header />
      <main className="flex min-h-[80vh] items-center justify-center bg-organic-blob px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <CardContent className="space-y-6 p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <PartyPopper className="h-8 w-8" />
            </div>

            <div>
              <h1 className="font-display text-2xl text-evento-marrom">
                Inscrição recebida!
              </h1>
              {nome ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  A inscrição de <strong className="text-foreground">{nome}</strong>{" "}
                  foi registrada com sucesso.
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  A inscrição foi registrada com sucesso.
                </p>
              )}
            </div>

            <div className="space-y-2 rounded-xl bg-muted/40 p-4 text-left text-sm">
              <p className="flex items-center gap-2 text-foreground/80">
                <CalendarDays className="h-4 w-4 text-primary" />
                {eventoConfig.dataEventoExibicao} · {eventoConfig.horario}
              </p>
              <p className="flex items-center gap-2 text-foreground/80">
                <MapPin className="h-4 w-4 text-primary" />
                {eventoConfig.local} — {eventoConfig.endereco}
              </p>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href="/inscricao">Inscrever outra criança</Link>
            </Button>

            <p className="text-xs text-muted-foreground">
              Em caso de dúvidas, entre em contato com a organização do
              evento.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
