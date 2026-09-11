"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { ResultadoAcao } from "@/lib/actions/inscricoes";

export async function loginAdmin(
  email: string,
  senha: string,
): Promise<ResultadoAcao<null>> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error || !data.user) {
    return { sucesso: false, erro: "E-mail ou senha inválidos." };
  }

  const { data: admin } = await supabase
    .from("administradores")
    .select("ativo")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!admin || !admin.ativo) {
    await supabase.auth.signOut();
    return {
      sucesso: false,
      erro: "Este usuário não tem acesso ao painel administrativo.",
    };
  }

  return { sucesso: true, dados: null };
}

export async function logoutAdmin() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
