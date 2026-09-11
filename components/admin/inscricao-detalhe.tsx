"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  ShieldAlert,
  ToyBrick,
} from "lucide-react";

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
import { eventoConfig, gerarLinkWhatsapp } from "@/config/evento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
    possui_restricao_alimentar: inscricao.possui_restricao_alimentar,
    restricao_alimentar_detalhe: inscricao.restricao_alimentar_detalhe ?? "",
    possui_informacao_importante: inscricao.possui_informacao_importante,
    informacao_importante_detalhe:
      inscricao.informacao_importante_detalhe ?? "",
    contato_emergencia_nome: inscricao.contato_emergencia_nome,
    contato_emergencia_parentesco: inscricao.contato_emergencia_parentesco,
    contato_emergencia_telefone: inscricao.contato_emergencia_telefone,
    autorizacao_imagem: inscricao.autorizacao_imagem,
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
      if (
        !Number.isInteger(idadeNumero) ||
        idadeNumero < eventoConfig.idadeMinima ||
        idadeNumero > eventoConfig.idadeMaxima
      ) {
        toast.error(`Informe uma idade válida (${eventoConfig.faixaEtariaExibicao}).`);
        return;
      }

      const patch: AtualizacaoInscricao = {
        nome_crianca: form.nome_crianca,
        idade: idadeNumero,
        nome_responsavel: form.nome_responsavel,
        telefone: form.telefone,
        possui_restricao_alimentar: form.possui_restricao_alimentar,
        restricao_alimentar_detalhe: form.possui_restricao_alimentar
          ? form.restricao_alimentar_detalhe || null
          : null,
        possui_informacao_importante: form.possui_informacao_importante,
        informacao_importante_detalhe: form.possui_informacao_importante
          ? form.informacao_importante_detalhe || null
          : null,
        contato_emergencia_nome: form.contato_emergencia_nome,
        contato_emergencia_parentesco: form.contato_emergencia_parentesco,
        contato_emergencia_telefone: form.contato_emergencia_telefone,
        autorizacao_imagem: form.autorizacao_imagem,
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
                min={eventoConfig.idadeMinima}
                max={eventoConfig.idadeMaxima}
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

          <div className="space-y-4 border-t border-border/70 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Saúde e segurança
            </p>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="possui_restricao_alimentar"
                checked={form.possui_restricao_alimentar}
                onChange={(e) =>
                  atualizarCampo("possui_restricao_alimentar", e.target.checked)
                }
                className="mt-1 h-4 w-4"
              />
              <div className="flex-1 space-y-2">
                <Label htmlFor="possui_restricao_alimentar">
                  Possui alergia ou restrição alimentar
                </Label>
                {form.possui_restricao_alimentar ? (
                  <Textarea
                    value={form.restricao_alimentar_detalhe}
                    onChange={(e) =>
                      atualizarCampo(
                        "restricao_alimentar_detalhe",
                        e.target.value,
                      )
                    }
                    placeholder="Descreva a alergia ou restrição"
                  />
                ) : null}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="possui_informacao_importante"
                checked={form.possui_informacao_importante}
                onChange={(e) =>
                  atualizarCampo(
                    "possui_informacao_importante",
                    e.target.checked,
                  )
                }
                className="mt-1 h-4 w-4"
              />
              <div className="flex-1 space-y-2">
                <Label htmlFor="possui_informacao_importante">
                  Possui informação importante de segurança/bem-estar
                </Label>
                {form.possui_informacao_importante ? (
                  <Textarea
                    value={form.informacao_importante_detalhe}
                    onChange={(e) =>
                      atualizarCampo(
                        "informacao_importante_detalhe",
                        e.target.value,
                      )
                    }
                    placeholder="Descreva a informação"
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-border/70 pt-6 sm:grid-cols-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:col-span-3">
              Contato de emergência
            </p>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={form.contato_emergencia_nome}
                onChange={(e) =>
                  atualizarCampo("contato_emergencia_nome", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Parentesco</Label>
              <Input
                value={form.contato_emergencia_parentesco}
                onChange={(e) =>
                  atualizarCampo(
                    "contato_emergencia_parentesco",
                    e.target.value,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={form.contato_emergencia_telefone}
                onChange={(e) =>
                  atualizarCampo(
                    "contato_emergencia_telefone",
                    e.target.value,
                  )
                }
              />
            </div>
          </div>

          <div className="grid gap-4 border-t border-border/70 pt-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <ToyBrick className="h-4 w-4" /> Autorização de brinquedos
              </Label>
              <div>
                <Badge variant={inscricao.autorizacao_brinquedos ? "success" : "destructive"}>
                  {inscricao.autorizacao_brinquedos ? "Autorizado" : "Não autorizado"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4" /> Autorização de imagem
              </Label>
              <Select
                value={form.autorizacao_imagem ? "sim" : "nao"}
                onValueChange={(valor) =>
                  atualizarCampo("autorizacao_imagem", valor === "sim")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Autoriza</SelectItem>
                  <SelectItem value="nao">Não autoriza</SelectItem>
                </SelectContent>
              </Select>
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
