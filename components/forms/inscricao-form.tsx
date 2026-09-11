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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
      consentimentoPrivacidade: false as unknown as true,
    },
  });

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
        className="space-y-6"
        noValidate
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="nomeCrianca"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Nome da criança *</FormLabel>
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
                <FormLabel>Nome do responsável *</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="consentimentoPrivacidade"
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
                  Autorizo o uso dos dados informados para organização deste
                  evento. *
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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
