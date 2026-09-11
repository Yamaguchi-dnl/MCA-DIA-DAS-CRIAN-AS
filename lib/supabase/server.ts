import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "./database.types";

/**
 * Cliente Supabase para uso em Server Components, Server Actions e Route
 * Handlers. Usa a chave anônima — a autorização real vem do RLS e da sessão
 * do usuário armazenada em cookies.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado de um Server Component — o middleware já cuida de
            // renovar a sessão, então esse erro pode ser ignorado.
          }
        },
      },
    },
  );
}
