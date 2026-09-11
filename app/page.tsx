import { Hero } from "@/components/sections/hero";
import { EventoJsonLd } from "@/components/sections/evento-jsonld";

export default function PaginaInicial() {
  return (
    <>
      <EventoJsonLd />
      <main>
        <Hero />
      </main>
    </>
  );
}
