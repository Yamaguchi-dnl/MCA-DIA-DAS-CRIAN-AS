"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { eventoConfig } from "@/config/evento";
import {
  inscricaoFormSchema,
  type InscricaoFormValues,
} from "@/lib/validations/inscricao";

export type ResultadoAcao<T> =
  | { sucesso: true; dados: T }
  | { sucesso: false; erro: string };

export async function criarInscricao(
  valoresBrutos: InscricaoFormValues,
): Promise<ResultadoAcao<{ id: string }>> {
  const parsed = inscricaoFormSchema.safeParse(valoresBrutos);

  if (!parsed.success) {
    return {
      sucesso: false,
      erro: "Alguns dados do formulário são inválidos. Revise e tente novamente.",
    };
  }

  const valores = parsed.data;
  const supabase = createAdminClient();

  if (eventoConfig.limiteVagas !== null) {
    const { count, error: erroContagem } = await supabase
      .from("inscricoes")
      .select("id", { count: "exact", head: true })
      .neq("status_inscricao", "cancelado");

    if (erroContagem) {
      return {
        sucesso: false,
        erro: "Não foi possível verificar as vagas disponíveis. Tente novamente em instantes.",
      };
    }

    if ((count ?? 0) >= eventoConfig.limiteVagas) {
      return {
        sucesso: false,
        erro: "As vagas para este evento já foram preenchidas.",
      };
    }
  }

  const { data: existente } = await supabase
    .from("inscricoes")
    .select("id")
    .ilike("nome_crianca", valores.nomeCrianca)
    .eq("telefone", valores.telefone)
    .neq("status_inscricao", "cancelado")
    .maybeSingle();

  if (existente) {
    return {
      sucesso: false,
      erro: "Esta criança já foi inscrita com este WhatsApp. Se precisar alterar algo, entre em contato com a organização.",
    };
  }

  const { data, error: erroInsercao } = await supabase
    .from("inscricoes")
    .insert({
      nome_crianca: valores.nomeCrianca,
      idade: valores.idade,
      nome_responsavel: valores.nomeResponsavel,
      telefone: valores.telefone,
      possui_restricao_alimentar: valores.possuiRestricaoAlimentar === "sim",
      restricao_alimentar_detalhe:
        valores.possuiRestricaoAlimentar === "sim"
          ? valores.restricaoAlimentarDetalhe?.trim() || null
          : null,
      possui_informacao_importante: valores.possuiInformacaoImportante === "sim",
      informacao_importante_detalhe:
        valores.possuiInformacaoImportante === "sim"
          ? valores.informacaoImportanteDetalhe?.trim() || null
          : null,
      contato_emergencia_nome: valores.contatoEmergenciaNome,
      contato_emergencia_parentesco: valores.contatoEmergenciaParentesco,
      contato_emergencia_telefone: valores.contatoEmergenciaTelefone,
      autorizacao_brinquedos: valores.autorizacaoBrinquedos,
      autorizacao_imagem: valores.autorizacaoImagem === "sim",
      status_inscricao: "pendente",
    })
    .select("id")
    .single();

  if (erroInsercao || !data) {
    return {
      sucesso: false,
      erro: "Não foi possível concluir a inscrição. Tente novamente em instantes.",
    };
  }

  return { sucesso: true, dados: { id: data.id } };
}
