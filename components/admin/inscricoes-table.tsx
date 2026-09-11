import Link from "next/link";
import { MessageCircle } from "lucide-react";

import type { Inscricao } from "@/lib/supabase/database.types";
import { formatarData, rotuloStatusInscricao } from "@/lib/format";
import { gerarLinkWhatsapp } from "@/config/evento";
import { Badge } from "@/components/ui/badge";
import { ConfirmarInscricaoButton } from "@/components/admin/confirmar-inscricao-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function corBadge(status: Inscricao["status_inscricao"]) {
  if (status === "confirmado") return "success" as const;
  if (status === "cancelado") return "destructive" as const;
  return "warning" as const;
}

export function InscricoesTable({
  inscricoes,
  paginaAtual,
  totalPaginas,
  queryString,
}: {
  inscricoes: Inscricao[];
  paginaAtual: number;
  totalPaginas: number;
  queryString: (pagina: number) => string;
}) {
  if (inscricoes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
        Nenhuma inscrição encontrada com os filtros atuais.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/70 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inscricoes.map((inscricao) => {
              const linkWhatsapp = gerarLinkWhatsapp(inscricao.nome_crianca);

              return (
                <TableRow key={inscricao.id}>
                  <TableCell className="font-medium">
                    {inscricao.nome_crianca}
                  </TableCell>
                  <TableCell>{inscricao.idade} anos</TableCell>
                  <TableCell>{inscricao.nome_responsavel}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {inscricao.telefone}
                  </TableCell>
                  <TableCell>
                    <Badge variant={corBadge(inscricao.status_inscricao)}>
                      {rotuloStatusInscricao(inscricao.status_inscricao)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatarData(inscricao.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {linkWhatsapp ? (
                        <a
                          href={linkWhatsapp}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-muted/60"
                          title="Abrir WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      ) : null}
                      {inscricao.status_inscricao === "pendente" ? (
                        <ConfirmarInscricaoButton id={inscricao.id} />
                      ) : null}
                      <Link
                        href={`/admin/inscricoes/${inscricao.id}`}
                        className="inline-flex h-9 items-center rounded-full border border-input px-4 text-xs font-medium hover:bg-muted/60"
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPaginas > 1 ? (
        <nav
          className="flex items-center justify-center gap-2"
          aria-label="Paginação"
        >
          {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map(
            (pagina) => (
              <Link
                key={pagina}
                href={queryString(pagina)}
                aria-current={pagina === paginaAtual ? "page" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                  pagina === paginaAtual
                    ? "bg-primary text-primary-foreground"
                    : "border border-input hover:bg-muted/60"
                }`}
              >
                {pagina}
              </Link>
            ),
          )}
        </nav>
      ) : null}
    </div>
  );
}
