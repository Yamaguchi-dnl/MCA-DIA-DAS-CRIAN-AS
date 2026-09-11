"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

import { confirmarInscricao } from "@/lib/actions/admin";
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

export function ConfirmarInscricaoButton({ id }: { id: string }) {
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();

  function confirmar() {
    iniciarTransicao(async () => {
      const resultado = await confirmarInscricao(id);
      if (!resultado.sucesso) {
        toast.error(resultado.erro);
        return;
      }
      toast.success("Inscrição confirmada.");
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={pendente}
          title="Confirmar inscrição"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-success hover:bg-muted/60 disabled:opacity-50"
        >
          {pendente ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
        </button>
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
          <AlertDialogAction onClick={confirmar}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
