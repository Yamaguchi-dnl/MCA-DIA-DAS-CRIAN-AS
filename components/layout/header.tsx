import Link from "next/link";

import { eventoConfig } from "@/config/evento";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header>
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-display text-lg font-semibold tracking-tight text-evento-marrom sm:text-xl">
            {eventoConfig.nomeEvento}
          </span>
        </Link>

        <Button asChild size="sm">
          <Link href="/inscricao">Inscreva-se</Link>
        </Button>
      </div>
    </header>
  );
}
