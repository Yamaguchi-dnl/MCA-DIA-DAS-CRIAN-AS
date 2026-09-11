import Link from "next/link";
import { AtSign, Mail } from "lucide-react";

import { eventoConfig } from "@/config/evento";

function ehPlaceholder(valor: string) {
  return valor.startsWith("[A_DEFINIR");
}

export function Footer() {
  const temEmail = !ehPlaceholder(eventoConfig.emailContato);
  const temInstagram = !ehPlaceholder(eventoConfig.instagram);

  return (
    <footer className="border-t border-border/70 bg-evento-fundo-secundario/60">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:justify-between">
        <div className="max-w-sm space-y-2">
          <p className="font-display text-lg font-semibold text-evento-marrom">
            {eventoConfig.nomeEvento}
          </p>
          <p className="text-sm text-muted-foreground">
            {eventoConfig.nomeIgreja}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {(temEmail || temInstagram) && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Contato
              </p>
              {temEmail && (
                <a
                  href={`mailto:${eventoConfig.emailContato}`}
                  className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary"
                >
                  <Mail className="h-4 w-4" /> {eventoConfig.emailContato}
                </a>
              )}
              {temInstagram && (
                <a
                  href={eventoConfig.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary"
                >
                  <AtSign className="h-4 w-4" /> Instagram
                </a>
              )}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Inscrição
            </p>
            <Link
              href="/inscricao"
              className="block text-sm text-foreground/80 hover:text-primary"
            >
              Inscreva-se
            </Link>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Legal
            </p>
            <Link
              href="/privacidade"
              className="block text-sm text-foreground/80 hover:text-primary"
            >
              Política de privacidade
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 py-6">
        <p className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {eventoConfig.nomeIgreja}. Todos os
          direitos reservados.
        </p>
      </div>
    </footer>
  );
}
