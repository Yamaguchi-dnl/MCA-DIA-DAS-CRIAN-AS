import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-5xl">🧭</p>
      <h1 className="mt-4 font-display text-2xl text-evento-marrom">
        Página não encontrada
      </h1>
      <p className="mt-2 text-muted-foreground">
        O endereço que você tentou acessar não existe.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
