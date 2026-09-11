import "server-only";

import type { Inscricao } from "@/lib/supabase/database.types";
import { formatarDataHora, rotuloStatusInscricao } from "@/lib/format";

const COLUNAS: { chave: keyof Inscricao; rotulo: string }[] = [
  { chave: "nome_crianca", rotulo: "Nome da criança" },
  { chave: "idade", rotulo: "Idade" },
  { chave: "nome_responsavel", rotulo: "Responsável" },
  { chave: "telefone", rotulo: "WhatsApp" },
  { chave: "possui_restricao_alimentar", rotulo: "Possui restrição alimentar" },
  { chave: "restricao_alimentar_detalhe", rotulo: "Detalhe da restrição" },
  { chave: "possui_informacao_importante", rotulo: "Possui informação importante" },
  { chave: "informacao_importante_detalhe", rotulo: "Detalhe da informação" },
  { chave: "contato_emergencia_nome", rotulo: "Contato de emergência (nome)" },
  { chave: "contato_emergencia_parentesco", rotulo: "Contato de emergência (parentesco)" },
  { chave: "contato_emergencia_telefone", rotulo: "Contato de emergência (telefone)" },
  { chave: "autorizacao_brinquedos", rotulo: "Autorizou brinquedos" },
  { chave: "autorizacao_imagem", rotulo: "Autorizou uso de imagem" },
  { chave: "status_inscricao", rotulo: "Status" },
  { chave: "observacoes_administrativas", rotulo: "Observações administrativas" },
  { chave: "created_at", rotulo: "Criado em" },
];

const COLUNAS_BOOLEANAS: (keyof Inscricao)[] = [
  "possui_restricao_alimentar",
  "possui_informacao_importante",
  "autorizacao_brinquedos",
  "autorizacao_imagem",
];

function escaparCelula(valor: unknown) {
  if (valor === null || valor === undefined) return "";
  const texto = String(valor);
  if (/[",;\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

export function gerarCsvInscricoes(inscricoes: Inscricao[]) {
  const cabecalho = COLUNAS.map((coluna) => coluna.rotulo).join(";");

  const linhas = inscricoes.map((inscricao) =>
    COLUNAS.map((coluna) => {
      const valor = inscricao[coluna.chave];
      if (coluna.chave === "created_at" && valor) {
        return escaparCelula(formatarDataHora(String(valor)));
      }
      if (coluna.chave === "status_inscricao" && valor) {
        return escaparCelula(rotuloStatusInscricao(String(valor)));
      }
      if (COLUNAS_BOOLEANAS.includes(coluna.chave)) {
        return escaparCelula(valor ? "Sim" : "Não");
      }
      return escaparCelula(valor);
    }).join(";"),
  );

  return ["﻿" + cabecalho, ...linhas].join("\n");
}
