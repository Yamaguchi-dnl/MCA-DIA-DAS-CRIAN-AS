import { Download } from "lucide-react";

import { listarInscricoes, getEstatisticasDashboard } from "@/lib/admin/queries";
import type { StatusInscricao } from "@/lib/supabase/database.types";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { FiltrosForm } from "@/components/admin/filtros-form";
import { InscricoesTable } from "@/components/admin/inscricoes-table";

type SearchParams = {
  busca?: string;
  status?: StatusInscricao | "todos";
  pagina?: string;
};

export default async function PaginaAdmin({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filtros = {
    busca: searchParams.busca,
    status: searchParams.status,
    pagina: searchParams.pagina ? Number(searchParams.pagina) : 1,
  };

  const [stats, resultadoLista] = await Promise.all([
    getEstatisticasDashboard(),
    listarInscricoes(filtros),
  ]);

  const parametrosExportacao = new URLSearchParams();
  if (filtros.busca) parametrosExportacao.set("busca", filtros.busca);
  if (filtros.status) parametrosExportacao.set("status", filtros.status);

  function montarQueryString(pagina: number) {
    const parametros = new URLSearchParams();
    if (filtros.busca) parametros.set("busca", filtros.busca);
    if (filtros.status) parametros.set("status", filtros.status);
    parametros.set("pagina", String(pagina));
    return `/admin?${parametros.toString()}`;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-evento-marrom">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral das inscrições do evento.
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-evento-marrom">
            Inscrições ({resultadoLista.total})
          </h2>
          <a
            href={`/admin/exportar?${parametrosExportacao.toString()}`}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-input px-4 text-sm font-medium hover:bg-muted/60"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </a>
        </div>

        <FiltrosForm valores={searchParams} />

        <InscricoesTable
          inscricoes={resultadoLista.inscricoes}
          paginaAtual={resultadoLista.pagina}
          totalPaginas={resultadoLista.totalPaginas}
          queryString={montarQueryString}
        />
      </div>
    </div>
  );
}
