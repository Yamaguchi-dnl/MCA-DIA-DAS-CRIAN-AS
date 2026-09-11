"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getAdminAtual, getInscricaoPorId } from "@/lib/admin/queries";
import type { ResultadoAcao } from "@/lib/actions/inscricoes";
import type { Inscricao, StatusInscricao } from "@/lib/supabase/database.types";

export type AtualizacaoInscricao = Partial<
  Pick<
    Inscricao,
    | "nome_crianca"
    | "idade"
    | "nome_responsavel"
    | "telefone"
    | "possui_restricao_alimentar"
    | "restricao_alimentar_detalhe"
    | "possui_informacao_importante"
    | "informacao_importante_detalhe"
    | "contato_emergencia_nome"
    | "contato_emergencia_parentesco"
    | "contato_emergencia_telefone"
    | "autorizacao_imagem"
    | "status_inscricao"
    | "observacoes_administrativas"
  >
>;

const CAMPOS_AUDITADOS: (keyof AtualizacaoInscricao)[] = [
  "status_inscricao",
  "observacoes_administrativas",
  "nome_crianca",
  "idade",
  "nome_responsavel",
  "telefone",
  "possui_restricao_alimentar",
  "restricao_alimentar_detalhe",
  "possui_informacao_importante",
  "informacao_importante_detalhe",
  "contato_emergencia_nome",
  "contato_emergencia_parentesco",
  "contato_emergencia_telefone",
  "autorizacao_imagem",
];

export async function atualizarInscricao(
  id: string,
  atualizacao: AtualizacaoInscricao,
): Promise<ResultadoAcao<null>> {
  const admin = await getAdminAtual();

  if (!admin) {
    return { sucesso: false, erro: "Sessão administrativa inválida." };
  }

  const inscricaoAtual = await getInscricaoPorId(id);

  if (!inscricaoAtual) {
    return { sucesso: false, erro: "Inscrição não encontrada." };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("inscricoes")
    .update(atualizacao)
    .eq("id", id);

  if (error) {
    return {
      sucesso: false,
      erro: "Não foi possível salvar as alterações.",
    };
  }

  const registrosAuditoria = CAMPOS_AUDITADOS.filter(
    (campo) =>
      campo in atualizacao &&
      String(inscricaoAtual[campo] ?? "") !== String(atualizacao[campo] ?? ""),
  ).map((campo) => ({
    inscricao_id: id,
    administrador_id: admin.id,
    campo_alterado: campo,
    valor_anterior: String(inscricaoAtual[campo] ?? ""),
    valor_novo: String(atualizacao[campo] ?? ""),
  }));

  if (registrosAuditoria.length > 0) {
    await supabase.from("auditoria_inscricoes").insert(registrosAuditoria);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/inscricoes/${id}`);

  return { sucesso: true, dados: null };
}

export async function alterarStatusInscricao(
  id: string,
  status: StatusInscricao,
) {
  return atualizarInscricao(id, { status_inscricao: status });
}

export async function confirmarInscricao(id: string) {
  return alterarStatusInscricao(id, "confirmado");
}

export async function cancelarInscricao(id: string) {
  return alterarStatusInscricao(id, "cancelado");
}

export async function reativarInscricao(id: string) {
  return alterarStatusInscricao(id, "pendente");
}

export async function anonimizarInscricao(
  id: string,
): Promise<ResultadoAcao<null>> {
  const admin = await getAdminAtual();

  if (!admin) {
    return { sucesso: false, erro: "Sessão administrativa inválida." };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("inscricoes")
    .update({
      nome_crianca: "Criança removida (LGPD)",
      nome_responsavel: "Responsável removido (LGPD)",
      telefone: "00000000000",
      restricao_alimentar_detalhe: null,
      informacao_importante_detalhe: null,
      contato_emergencia_nome: "Removido (LGPD)",
      contato_emergencia_parentesco: "Removido (LGPD)",
      contato_emergencia_telefone: "00000000000",
      status_inscricao: "cancelado",
    })
    .eq("id", id);

  if (error) {
    return { sucesso: false, erro: "Não foi possível anonimizar a inscrição." };
  }

  await supabase.from("auditoria_inscricoes").insert({
    inscricao_id: id,
    administrador_id: admin.id,
    campo_alterado: "anonimizacao_lgpd",
    valor_anterior: "dados pessoais presentes",
    valor_novo: "dados anonimizados",
  });

  revalidatePath("/admin");

  return { sucesso: true, dados: null };
}
