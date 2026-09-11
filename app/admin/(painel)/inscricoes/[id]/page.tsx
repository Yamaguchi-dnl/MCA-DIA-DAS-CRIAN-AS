import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getAuditoriaDaInscricao, getInscricaoPorId } from "@/lib/admin/queries";
import { InscricaoDetalhe } from "@/components/admin/inscricao-detalhe";

export default async function PaginaDetalheInscricao({
  params,
}: {
  params: { id: string };
}) {
  const inscricao = await getInscricaoPorId(params.id);

  if (!inscricao) {
    notFound();
  }

  const auditoria = await getAuditoriaDaInscricao(params.id);

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para o painel
      </Link>

      <div>
        <h1 className="font-display text-3xl text-evento-marrom">
          {inscricao.nome_crianca}
        </h1>
        <p className="text-sm text-muted-foreground">
          Responsável: {inscricao.nome_responsavel}
        </p>
      </div>

      <InscricaoDetalhe inscricao={inscricao} auditoria={auditoria} />
    </div>
  );
}
