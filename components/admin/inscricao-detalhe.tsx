"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2, MessageCircle, ShieldAlert } from "lucide-react";

import {
  atualizarInscricao,
  anonimizarInscricao,
  type AtualizacaoInscricao,
} from "@/lib/actions/admin";
import type {
  AuditoriaInscricao,
  Inscricao,
} from "@/lib/supabase/database.types";
import { formatarDataHora, rotuloStatusInscricao } from "@/lib/format";
import { gerarLinkWhatsapp } from "@/config/evento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STATUS_OPCOES: Inscricao["status_inscricao"][] = [
  "pendente",
  "confirmado",
  "cancelado",
];

export function InscricaoDetalhe({
  inscricao,
  auditoria,
}: {
  inscricao: Inscricao;
  auditoria: AuditoriaInscricao[];
}) {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({
    nome_crianca: inscricao.nome_crianca,
    idade: String(inscricao.idade),
    nome_responsavel: inscricao.nome_responsavel,
    telefone: inscricao.telefone,
    observacoes_administrativas: inscricao.observacoes_administrativas ?? "",
    status_inscricao: inscricao.status_inscricao,
  });

  function atualizarCampo<K extends keyof typeof form>(
    campo: K,
    valor: (typeof form)[K],
  ) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvar() {
    setSalvando(true);
    try {
      const idadeNumero = Number(form.idade);
      if (!Number.isInteger(idadeNumero) || idadeNumero < 0 || idadeNumero > 17) {
        toast.error("Informe uma idade válida (0 a 17 anos).");
        return;
      }

      const patch: AtualizacaoInscricao = {
        nome_crianca: form.nome_crianca,
        idade: idadeNumero,
        nome_responsavel: form.nome_responsavel,
        telefone: form.telefone,
        observacoes_administrativas: form.observacoes_administrativas || null,
        status_inscricao: form.status_inscricao,
      };

      const resultado = await atualizarInscricao(inscricao.id, patch);

      if (!resultado.sucesso) {
        toast.error(resultado.erro);
        return;
      }

      toast.success("Inscrição atualizada com sucesso.");
      router.refresh();
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarRapido() {
    setSalvando(true);
    try {
      const resultado = await atualizarInscricao(inscricao.id, {
        status_inscricao: "confirmado",
      });

      if (!resultado.sucesso) {
        toast.error(resultado.erro);
        return;
      }

      atualizarCampo("status_inscricao", "confirmado");
      toast.success("Inscrição confirmada com sucesso.");
      router.refresh();
    } finally {
      setSalvando(false);
    }
  }

  async function anonimizar() {
    setSalvando(true);
    try {
      const resultado = await anonimizarInscricao(inscricao.id);
      if (!resultado.sucesso) {
        toast.error(resultado.erro);
        return;
      }
      toast.success("Dados anonimizados com sucesso.");
      router.push("/admin");
    } finally {
      setSalvando(false);
    }
  }

  const linkWhatsapp = gerarLinkWhatsapp(inscricao.nome_crianca);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome da criança</Label>
              <Input
                value={form.nome_crianca}
                onChange={(e) => atualizarCampo("nome_crianca", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Idade</Label>
              <Input
                type="number"
                min={0}
                max={17}
                value={form.idade}
                onChange={(e) => atualizarCampo("idade", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Nome do responsável</Label>
              <Input
                value={form.nome_responsavel}
                onChange={(e) =>
                  atualizarCampo("nome_responsavel", e.target.value)
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>WhatsApp</Label>
              <Input
                value={form.telefone}
                onChange={(e) => atualizarCampo("telefone", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 border-t border-border/70 pt-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status da inscrição</Label>
              <Select
                value={form.status_inscricao}
                onValueChange={(valor) =>
                  atualizarCampo(
                    "status_inscricao",
                    valor as Inscricao["status_inscricao"],
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPCOES.map((opcao) => (
                    <SelectItem key={opcao} value={opcao}>
                      {rotuloStatusInscricao(opcao)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Observações administrativas (interno)</Label>
              <Textarea
                value={form.observacoes_administrativas}
                onChange={(e) =>
                  atualizarCampo("observacoes_administrativas", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-6">
            {linkWhatsapp ? (
              <Button asChild variant="outline">
                <a href={linkWhatsapp} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> Conversar no WhatsApp
                </a>
              </Button>
            ) : (
              <span />
            )}

            <div className="flex flex-wrap items-center gap-3">
              {form.status_inscricao === "pendente" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" disabled={salvando}>
                      <CheckCircle2 className="h-4 w-4" />
                      Confirmar inscrição
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar esta inscrição?</AlertDialogTitle>
                      <AlertDialogDescription>
                        A inscrição será marcada como confirmada.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmarRapido}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={salvando}>
                    {salvando ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    Salvar alterações
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar alterações?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso vai atualizar os dados e o status desta inscrição.
                      Essa ação fica registrada no histórico de auditoria.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={salvar}>
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Inscrita em
            </p>
            <p className="font-display text-xl text-evento-marrom">
              {formatarDataHora(inscricao.created_at)}
            </p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={salvando}>
                  <ShieldAlert className="h-4 w-4" />
                  Anonimizar dados (LGPD)
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Anonimizar esta inscrição?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Os dados pessoais serão substituídos permanentemente e a
                    inscrição será cancelada. Essa ação não pode ser
                    desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={anonimizar}>
                    Anonimizar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Histórico de auditoria
            </p>
            {auditoria.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma alteração registrada ainda.
              </p>
            ) : (
              <ul className="space-y-3">
                {auditoria.map((registro) => (
                  <li key={registro.id} className="text-xs text-foreground/80">
                    <p className="font-medium">{registro.campo_alterado}</p>
                    <p className="text-muted-foreground">
                      {registro.valor_anterior || "—"} → {registro.valor_novo || "—"}
                    </p>
                    <p className="text-muted-foreground">
                      {formatarDataHora(registro.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
