import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { Camera, PartyPopper, Star, Users } from "lucide-react";

import { eventoConfig } from "@/config/evento";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FotoColagem = {
  src: string;
  alt: string;
};

const fotosColagem: FotoColagem[] = [
  { src: "/criancas-1.jpg", alt: "Crianças brincando na igreja" },
  { src: "/criancas-2.jpg", alt: "Criançada se divertindo no evento" },
  { src: "/criancas-3.jpg", alt: "Brincadeiras do Dia das Crianças" },
];

function fotoExiste(src: string) {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}

const CORES_TITULO = ["text-evento-laranja", "text-evento-amarelo", "text-evento-rosa"];

/** Título do evento com a última palavra colorida letra a letra. */
function TituloEvento({ titulo }: { titulo: string }) {
  const palavras = titulo.trim().split(" ");
  const destaque = palavras.pop() ?? "";

  return (
    <>
      {palavras.length > 0 ? `${palavras.join(" ")} ` : null}
      {destaque.split("").map((letra, indice) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={indice}
          className={CORES_TITULO[indice % CORES_TITULO.length]}
        >
          {letra}
        </span>
      ))}
    </>
  );
}

function FotoCircular({
  foto,
  className,
  anelClassName,
}: {
  foto: FotoColagem;
  className?: string;
  anelClassName?: string;
}) {
  const existe = fotoExiste(foto.src);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-evento-amarelo/20 shadow-xl shadow-evento-marrom/15 ring-8",
        anelClassName ?? "ring-evento-branco",
        className,
      )}
    >
      {existe ? (
        <Image
          src={foto.src}
          alt={foto.alt}
          fill
          sizes="(min-width: 1024px) 420px, 70vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-evento-laranja/50">
          <Camera className="h-8 w-8" />
        </div>
      )}
    </div>
  );
}

/** Formas coloridas soltas atrás/ao redor da foto principal, tipo confete. */
function FormasDecorativas() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-[-14%] z-0">
      <Star
        className="absolute right-[4%] top-0 h-12 w-12 -rotate-12 fill-evento-amarelo text-evento-amarelo animate-float-slow xl:h-16 xl:w-16"
        style={{ animationDelay: "0.2s" }}
      />
      <span
        className="absolute left-0 top-[16%] h-9 w-9 rounded-full bg-evento-azul/90 animate-float-slow xl:h-12 xl:w-12"
        style={{ animationDelay: "0.6s" }}
      />
      <span className="absolute left-[6%] bottom-[6%] h-16 w-16 rounded-tl-full rounded-tr-full rounded-br-full bg-evento-verde animate-float-slow xl:h-20 xl:w-20" />
      <span
        className="absolute right-0 bottom-[14%] h-14 w-14 rotate-45 rounded-2xl bg-evento-rosa animate-float-slow xl:h-16 xl:w-16"
        style={{ animationDelay: "0.4s" }}
      />
      <span className="absolute right-[14%] top-[36%] h-6 w-6 rounded-full bg-evento-laranja-escuro" />
      <Star
        className="absolute left-[18%] top-[2%] h-5 w-5 rotate-12 fill-evento-rosa text-evento-rosa animate-float-slow xl:h-6 xl:w-6"
        style={{ animationDelay: "0.8s" }}
      />
      <span
        className="absolute -right-2 top-[62%] h-8 w-8 -rotate-6 rounded-full border-4 border-evento-amarelo animate-float-slow"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  );
}

/** Confete espalhado pelo fundo da seção inteira, atrás do texto e do nav. */
function ConfeteFundo() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <span className="absolute left-[4%] top-[12%] h-4 w-4 rotate-12 rounded bg-evento-amarelo/70 animate-float-slow xl:h-5 xl:w-5" />
      <span
        className="absolute left-[14%] top-[58%] h-3 w-3 rounded-full bg-evento-laranja/40 animate-float-slow"
        style={{ animationDelay: "0.5s" }}
      />
      <Star
        className="absolute left-[26%] top-[6%] hidden h-6 w-6 rotate-6 fill-evento-verde/60 text-evento-verde/60 animate-float-slow lg:block"
        style={{ animationDelay: "0.7s" }}
      />
      <span
        className="absolute left-[2%] bottom-[10%] hidden h-10 w-10 -rotate-6 rounded-2xl border-4 border-evento-rosa/50 animate-float-slow lg:block"
        style={{ animationDelay: "0.2s" }}
      />
      <span className="absolute right-[3%] top-[8%] h-5 w-5 rounded-full bg-evento-azul/30 animate-float-slow xl:h-6 xl:w-6" />
      <span
        className="absolute right-[8%] bottom-[6%] hidden h-6 w-6 rotate-45 rounded-md bg-evento-amarelo/50 animate-float-slow lg:block"
        style={{ animationDelay: "0.9s" }}
      />
    </div>
  );
}

export function Hero() {
  const [foto1, foto2, foto3] = fotosColagem;

  return (
    <section className="relative overflow-hidden bg-evento-branco">
      <div className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:grid lg:grid-cols-3 lg:px-12 xl:px-20 2xl:px-32">
        <Link href="/" className="flex items-center gap-3 lg:justify-self-start">
          <span className="font-display text-base font-semibold text-evento-laranja">
            {eventoConfig.nomeIgreja}
          </span>
        </Link>

        <span className="font-display text-sm font-medium tracking-wide text-evento-marrom lg:justify-self-center">
          {eventoConfig.subtitulo}
        </span>

        <Button
          asChild
          size="sm"
          className="hidden bg-evento-laranja text-evento-branco hover:bg-evento-laranja/90 lg:inline-flex lg:justify-self-end"
        >
          <Link href="/inscricao">inscreva-se</Link>
        </Button>
      </div>

      <div className="relative px-6 py-10 sm:px-10 lg:px-12 lg:py-16 xl:px-20 2xl:px-32">
        <ConfeteFundo />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-12 lg:min-h-[70vh] lg:grid-cols-2 lg:items-center lg:gap-10">
            {/* Texto */}
            <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <span className="animate-fade-up rounded-full bg-evento-amarelo px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-evento-marrom sm:text-xs sm:tracking-[0.15em]">
                🎪 Entrada gratuita
              </span>

              <h1 className="animate-fade-up text-balance font-display text-4xl font-semibold leading-[1.05] text-evento-marrom sm:text-5xl lg:text-6xl xl:text-7xl">
                <TituloEvento titulo={eventoConfig.nomeEvento} />
              </h1>

              <p
                className="animate-fade-up max-w-md text-balance text-base text-evento-marrom/80 sm:text-lg"
                style={{ animationDelay: "0.05s" }}
              >
                {eventoConfig.descricaoCurta}
              </p>

              <div
                className="animate-fade-up flex flex-wrap items-center justify-center gap-3 lg:justify-start"
                style={{ animationDelay: "0.08s" }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-evento-laranja/20 bg-evento-fundo-secundario px-3.5 py-1.5 text-xs font-bold text-evento-laranja">
                  <PartyPopper className="h-3.5 w-3.5" /> Gratuito
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-evento-laranja/20 bg-evento-fundo-secundario px-3.5 py-1.5 text-xs font-bold text-evento-laranja">
                  <Users className="h-3.5 w-3.5" /> {eventoConfig.faixaEtariaExibicao}
                </span>
              </div>

              <div className="animate-fade-up pt-2" style={{ animationDelay: "0.1s" }}>
                <Button
                  size="lg"
                  asChild
                  className="rounded-full bg-evento-laranja px-8 text-base font-semibold text-evento-branco hover:bg-evento-laranja/90"
                >
                  <Link href="/inscricao">inscreva-se</Link>
                </Button>
              </div>

              <div
                className="animate-fade-up flex flex-col items-center gap-1 pt-2 lg:items-start"
                style={{ animationDelay: "0.15s" }}
              >
                <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-balance text-sm font-medium text-evento-marrom sm:text-base lg:justify-start">
                  <span>{eventoConfig.dataEventoExibicao}</span>
                  <span className="text-evento-laranja">•</span>
                  <span>{eventoConfig.horario}</span>
                </p>
                <p className="text-balance text-sm text-evento-marrom/60">
                  {eventoConfig.local} — {eventoConfig.endereco}
                </p>
              </div>
            </div>

            {/* Foto com formas coloridas */}
            <div className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-lg xl:max-w-xl">
              <FormasDecorativas />
              <FotoCircular
                foto={foto1}
                className="relative z-10 aspect-square w-full"
                anelClassName="ring-evento-amarelo"
              />
              <FotoCircular
                foto={foto2}
                className="absolute -left-6 bottom-0 z-20 aspect-square w-24 sm:w-28 lg:-left-12 lg:w-32"
                anelClassName="ring-evento-branco"
              />
              <FotoCircular
                foto={foto3}
                className="absolute -right-4 top-4 z-20 aspect-square w-20 sm:w-24 lg:-right-10 lg:w-28"
                anelClassName="ring-evento-branco"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 w-full bg-evento-laranja sm:h-20 lg:h-28" />
    </section>
  );
}
