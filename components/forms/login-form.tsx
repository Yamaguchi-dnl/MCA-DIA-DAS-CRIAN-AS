"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { loginAdmin } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (carregando) return;

    setCarregando(true);
    setErro(null);

    try {
      const resultado = await loginAdmin(email, senha);

      if (!resultado.sucesso) {
        setErro(resultado.erro);
        return;
      }

      toast.success("Login realizado com sucesso.");
      router.push(redirectTo);
      router.refresh();
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={aoEnviar} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          type="password"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
        />
      </div>

      {erro ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {erro}
        </p>
      ) : null}

      <Button type="submit" className="w-full" size="lg" disabled={carregando}>
        {carregando ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Entrando…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" /> Entrar
          </>
        )}
      </Button>
    </form>
  );
}
