"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { criarInscricao } from "@/lib/actions/inscricoes";
import {
  inscricaoFormSchema,
  type InscricaoFormValues,
} from "@/lib/validations/inscricao";
import { mascararTelefone } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function RadioSimNao({
  name,
  value,
  onChange,
  rotuloSim = "Sim",
  rotuloNao = "Não",
}: {
  name: string;
  value: "sim" | "nao" | undefined;
  onChange: (valor: "sim" | "nao") => void;
  rotuloSim?: string;
  rotuloNao?: string;
}) {
  return (
    <div className="flex gap-6">
      {(
        [
          ["nao", rotuloNao],
          ["sim", rotuloSim],
        ] as const
      ).map(([opcao, rotulo]) => (
        <label
          key={opcao}
          className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
        >
          <input
            type="radio"
            name={name}
            value={opcao}
            checked={value === opcao}
            onChange={() => onChange(opcao)}
            className="h-4 w-4 accent-primary"
          />
          {rotulo}
        </label>
      ))}
    </div>
  );
}

export function InscricaoForm() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);

  const form = useForm<InscricaoFormValues>({
    resolver: zodResolver(inscricaoFormSchema),
    defaultValues: {
      nomeCrianca: "",
      idade: NaN,
      nomeResponsavel: "",
      telefone: "",
      possuiRestricaoAlimentar: undefined as unknown as "nao",
      restricaoAlimentarDetalhe: "",
      possuiInformacaoImportante: undefined as unknown as "nao",
      informacaoImportanteDetalhe: "",
      contatoEmergenciaNome: "",
      contatoEmergenciaParentesco: "",
      contatoEmergenciaTelefone: "",
      autorizacaoBrinquedos: false as unknown as true,
      autorizacaoImagem: undefined as unknown as "sim",
    },
  });

  const possuiRestricao = form.watch("possuiRestricaoAlimentar");
  const possuiInformacao = form.watch("possuiInformacaoImportante");

  async function aoEnviar(valores: InscricaoFormValues) {
    if (enviando) return;
    setEnviando(true);

    try {
      const resultado = await criarInscricao(valores);

      if (!resultado.sucesso) {
        toast.error(resultado.erro);
        return;
      }

      toast.success("Inscrição recebida com sucesso!");
      const parametros = new URLSearchParams({ nome: valores.nomeCrianca });
      router.push(`/inscricao/sucesso?${parametros.toString()}`);
    } catch {
      toast.error("Não foi possível concluir a inscrição. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(aoEnviar)}
        className="space-y-8"
        noValidate
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="nomeCrianca"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Nome completo da criança *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo da criança" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={17}
                    placeholder="Ex.: 8"
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(evento) =>
                      field.onChange(
                        evento.target.value === ""
                          ? NaN
                          : Number(evento.target.value),
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp do responsável *</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="(00) 00000-0000"
                    value={mascararTelefone(field.value ?? "")}
                    onChange={(evento) =>
                      field.onChange(mascararTelefone(evento.target.value))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nomeResponsavel"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Nome completo do responsável *</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6 border-t border-border/70 pt-6">
          <FormField
            control={form.control}
            name="possuiRestricaoAlimentar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  A criança possui alguma alergia ou restrição alimentar? *
                </FormLabel>
                <FormControl>
                  <RadioSimNao
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {possuiRestricao === "sim" && (
            <FormField
              control={form.control}
              name="restricaoAlimentarDetalhe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva a alergia ou restrição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="possuiInformacaoImportante"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Existe alguma informação importante sobre a criança que
                  nossa equipe deve saber para garantir sua segurança e
                  bem-estar durante o evento? *
                </FormLabel>
                <FormControl>
                  <RadioSimNao
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {possuiInformacao === "sim" && (
            <FormField
              control={form.control}
              name="informacaoImportanteDetalhe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva a informação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="space-y-4 border-t border-border/70 pt-6">
          <p className="text-sm font-bold text-evento-marrom">
            Em caso de emergência, podemos entrar em contato com outra
            pessoa além do responsável? *
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="contatoEmergenciaNome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contatoEmergenciaParentesco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parentesco</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Avó, tio…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contatoEmergenciaTelefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      placeholder="(00) 00000-0000"
                      value={mascararTelefone(field.value ?? "")}
                      onChange={(evento) =>
                        field.onChange(mascararTelefone(evento.target.value))
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-border/70 pt-6">
          <FormField
            control={form.control}
            name="autorizacaoBrinquedos"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(marcado) => field.onChange(marcado === true)}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer font-normal leading-relaxed">
                    Autorizo meu/minha filho(a) a participar das atividades
                    recreativas e utilizar os brinquedos disponibilizados no
                    evento, incluindo escorregador inflável, piscina de
                    bolinhas, cama elástica e similares, sempre respeitando
                    as orientações da equipe e as regras de segurança de
                    cada brinquedo. *
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autorizacaoImagem"
            render={({ field }) => (
              <FormItem>
                <div
                  className={cn(
                    "rounded-xl border border-border/70 bg-muted/30 p-4",
                  )}
                >
                  <FormLabel className="font-normal leading-relaxed">
                    Autorizo a captação e utilização de fotos e vídeos da
                    criança durante o evento para divulgação das atividades
                    do MCA e da igreja em redes sociais, materiais
                    institucionais e outros meios de comunicação. *
                  </FormLabel>
                  <FormControl>
                    <div className="mt-3">
                      <RadioSimNao
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        rotuloSim="Sim, autorizo"
                        rotuloNao="Não autorizo"
                      />
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={enviando}>
          {enviando ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Enviando inscrição…
            </>
          ) : (
            "Confirmar inscrição"
          )}
        </Button>
      </form>
    </Form>
  );
}
