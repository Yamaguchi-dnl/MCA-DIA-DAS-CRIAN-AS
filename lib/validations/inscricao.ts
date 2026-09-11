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

export const inscricaoFormSchema = z.object({
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
  consentimentoPrivacidade: z.literal(true, {
    error: "É necessário autorizar o uso dos dados para continuar",
  }),
});

export type InscricaoFormValues = z.infer<typeof inscricaoFormSchema>;
