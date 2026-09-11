import "server-only";

import type { Inscricao } from "@/lib/supabase/database.types";
import { formatarDataHora, rotuloStatusInscricao } from "@/lib/format";

const COLUNAS: { chave: keyof Inscricao; rotulo: string }[] = [
  { chave: "nome_crianca", rotulo: "Nome da criança" },
  { chave: "idade", rotulo: "Idade" },
  { chave: "nome_responsavel", rotulo: "Responsável" },
  { chave: "telefone", rotulo: "WhatsApp" },
  { chave: "status_inscricao", rotulo: "Status" },
  { chave: "observacoes_administrativas", rotulo: "Observações administrativas" },
  { chave: "created_at", rotulo: "Criado em" },
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
      return escaparCelula(valor);
    }).join(";"),
  );

  return ["﻿" + cabecalho, ...linhas].join("\n");
}
