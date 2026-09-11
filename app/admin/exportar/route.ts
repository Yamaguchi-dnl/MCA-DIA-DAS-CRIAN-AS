import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getAdminAtual } from "@/lib/admin/queries";
import { gerarCsvInscricoes } from "@/lib/admin/csv";
import type { StatusInscricao } from "@/lib/supabase/database.types";

export async function GET(request: NextRequest) {
  const admin = await getAdminAtual();

  if (!admin) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const busca = searchParams.get("busca")?.trim();
  const status = searchParams.get("status") as StatusInscricao | "todos" | null;

  const supabase = createClient();
  let query = supabase
    .from("inscricoes")
    .select("*")
    .order("created_at", { ascending: false });

  if (busca) {
    query = query.or(
      `nome_crianca.ilike.%${busca}%,nome_responsavel.ilike.%${busca}%,telefone.ilike.%${busca}%`,
    );
  }
  if (status && status !== "todos") {
    query = query.eq("status_inscricao", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { erro: "Não foi possível gerar a exportação." },
      { status: 500 },
    );
  }

  const csv = gerarCsvInscricoes(data ?? []);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscricoes-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
