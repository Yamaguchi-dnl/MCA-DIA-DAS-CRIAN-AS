import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";

import { eventoConfig, inscricoesEstaoAbertas } from "@/config/evento";
import { Header } from "@/components/layout/header";
import { InscricaoForm } from "@/components/forms/inscricao-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Inscrição",
  description: `Faça a inscrição da sua criança para o ${eventoConfig.nomeEvento}.`,
};

export default function PaginaInscricao() {
  const aberta = inscricoesEstaoAbertas();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-organic-blob py-16 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <Card className="lg:sticky lg:top-28">
            <CardContent className="space-y-5 p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Resumo do evento
                </p>
                <h1 className="mt-2 font-display text-2xl text-evento-marrom">
                  {eventoConfig.nomeEvento}
                </h1>
              </div>

              <div className="space-y-3 text-sm text-foreground/80">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {eventoConfig.dataEventoExibicao} · {eventoConfig.horario}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {eventoConfig.local} — {eventoConfig.endereco}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Faixa etária: {eventoConfig.faixaEtariaExibicao}
                </p>
              </div>

              <div className="rounded-xl bg-secondary/20 px-4 py-3 text-sm font-semibold text-evento-marrom">
                🎈 Evento 100% gratuito
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Ao se inscrever, os dados serão usados apenas para a
                organização deste evento. Consulte nossa{" "}
                <Link href="/privacidade" className="underline">
                  política de privacidade
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              {aberta ? (
                <>
                  <h2 className="font-display text-2xl text-evento-marrom">
                    Dados da inscrição
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Preencha com atenção — usaremos esses dados para
                    confirmar a vaga da criançada.
                  </p>
                  <div className="mt-8">
                    <InscricaoForm />
                  </div>
                </>
              ) : (
                <div className="py-10 text-center">
                  <h2 className="font-display text-2xl text-evento-marrom">
                    Inscrições encerradas
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    As inscrições para este evento já foram encerradas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
