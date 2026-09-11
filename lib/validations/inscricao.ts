import { z } from "zod";
import { eventoConfig } from "@/config/evento";

function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

export const telefoneSchema = z
  .string()
  .min(1, "Informe o WhatsApp")
  .transform(apenasDigitos)
  .refine((valor) => valor.length === 10 || valor.length === 11, {
    message: "Informe um telefone válido com DDD",
  });

export const simNaoSchema = z.enum(["sim", "nao"], {
  error: "Selecione uma opção",
});

export const inscricaoFormSchema = z
  .object({
    nomeCrianca: z
      .string()
      .trim()
      .min(2, "Informe o nome da criança")
      .max(200, "Nome muito longo"),
    idade: z
      .number({ error: "Informe a idade" })
      .int("A idade deve ser um número inteiro")
      .min(eventoConfig.idadeMinima, `A idade mínima é ${eventoConfig.idadeMinima} anos`)
      .max(eventoConfig.idadeMaxima, `A idade máxima é ${eventoConfig.idadeMaxima} anos`),
    nomeResponsavel: z
      .string()
      .trim()
      .min(2, "Informe o nome do responsável")
      .max(200, "Nome muito longo"),
    telefone: telefoneSchema,

    possuiRestricaoAlimentar: simNaoSchema,
    restricaoAlimentarDetalhe: z
      .string()
      .trim()
      .max(500, "Máximo de 500 caracteres")
      .optional()
      .or(z.literal("")),

    possuiInformacaoImportante: simNaoSchema,
    informacaoImportanteDetalhe: z
      .string()
      .trim()
      .max(1000, "Máximo de 1000 caracteres")
      .optional()
      .or(z.literal("")),

    contatoEmergenciaNome: z
      .string()
      .trim()
      .min(2, "Informe o nome do contato de emergência")
      .max(200, "Nome muito longo"),
    contatoEmergenciaParentesco: z
      .string()
      .trim()
      .min(2, "Informe o parentesco")
      .max(100, "Máximo de 100 caracteres"),
    contatoEmergenciaTelefone: telefoneSchema,

    autorizacaoBrinquedos: z.literal(true, {
      error: "É necessário autorizar o uso dos brinquedos para continuar",
    }),
    autorizacaoImagem: simNaoSchema,
  })
  .refine(
    (dados) =>
      dados.possuiRestricaoAlimentar === "nao" ||
      (dados.restricaoAlimentarDetalhe && dados.restricaoAlimentarDetalhe.trim().length > 0),
    {
      message: "Descreva a alergia ou restrição alimentar",
      path: ["restricaoAlimentarDetalhe"],
    },
  )
  .refine(
    (dados) =>
      dados.possuiInformacaoImportante === "nao" ||
      (dados.informacaoImportanteDetalhe && dados.informacaoImportanteDetalhe.trim().length > 0),
    {
      message: "Descreva a informação importante",
      path: ["informacaoImportanteDetalhe"],
    },
  );

export type InscricaoFormValues = z.infer<typeof inscricaoFormSchema>;
