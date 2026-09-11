/**
 * Testa a conexão com o Supabase, confirma que a migration foi aplicada
 * (tabelas existem) e que a RLS está bloqueando acesso anônimo. Não
 * grava nada de permanente: qualquer linha de teste é removida no final.
 *
 * Uso: node scripts/testar-supabase.js
 */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function carregarEnvLocal() {
  const arquivo = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(arquivo)) return;
  for (const linha of fs.readFileSync(arquivo, "utf8").split("\n")) {
    const match = linha.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const chave = match[1];
    let valor = (match[2] ?? "").trim();
    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1);
    }
    if (!(chave in process.env)) process.env[chave] = valor;
  }
}

carregarEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function ok(msg) {
  console.log("✅", msg);
}
function fail(msg) {
  console.log("❌", msg);
}
function info(msg) {
  console.log("ℹ️ ", msg);
}

async function run() {
  if (!url || !anonKey || !serviceKey) {
    fail("Faltam variáveis em .env.local (URL, ANON_KEY ou SERVICE_ROLE_KEY).");
    process.exit(1);
  }
  info(`Projeto: ${url}`);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const anon = createClient(url, anonKey, { auth: { persistSession: false } });

  // 1. Tabelas existem? (via service role, ignora RLS)
  //    Usa select de uma coluna real (não head/count — isso retorna "sucesso"
  //    mesmo para tabelas inexistentes nesse projeto).
  const tabelasEColuna = [
    ["inscricoes", "id"],
    ["administradores", "id"],
    ["auditoria_inscricoes", "id"],
  ];
  for (const [tabela, coluna] of tabelasEColuna) {
    const { error } = await admin.from(tabela).select(coluna).limit(1);
    if (error) {
      fail(`Tabela "${tabela}" não encontrada ou inacessível: ${error.message}`);
    } else {
      ok(`Tabela "${tabela}" existe.`);
    }
  }

  // 2. Existe algum administrador cadastrado?
  const { data: admins, error: erroAdmins } = await admin
    .from("administradores")
    .select("id, nome, email, ativo");
  if (erroAdmins) {
    fail(`Não consegui listar administradores: ${erroAdmins.message}`);
  } else if (!admins || admins.length === 0) {
    info('Nenhum administrador cadastrado ainda (esperado se você não rodou o passo 4 do README).');
  } else {
    ok(`${admins.length} administrador(es) cadastrado(s): ${admins.map((a) => `${a.email} (ativo=${a.ativo})`).join(", ")}`);
  }

  // 3. RLS: anon NÃO deveria conseguir ler inscrições
  const { data: leituraAnon, error: erroAnonSelect } = await anon
    .from("inscricoes")
    .select("id")
    .limit(1);
  if (erroAnonSelect) {
    ok("RLS bloqueando leitura anônima de inscrições (esperado).");
  } else if (leituraAnon && leituraAnon.length === 0) {
    ok("Leitura anônima retornou vazio (RLS ok, ou tabela vazia).");
  } else {
    fail("Cliente anônimo conseguiu ler inscrições — RLS pode estar mal configurada!");
  }

  // 4. RLS: anon NÃO deveria conseguir inserir inscrições diretamente
  const { error: erroAnonInsert } = await anon.from("inscricoes").insert({
    nome_crianca: "Teste RLS",
    idade: 5,
    nome_responsavel: "Teste",
    telefone: "41999999999",
    contato_emergencia_nome: "Teste",
    contato_emergencia_parentesco: "Teste",
    contato_emergencia_telefone: "41999999999",
    autorizacao_brinquedos: true,
    autorizacao_imagem: false,
  });
  if (erroAnonInsert) {
    ok("RLS bloqueando insert anônimo direto na tabela (esperado — inscrição só entra via Server Action com service role).");
  } else {
    fail("Cliente anônimo conseguiu inserir direto na tabela — não deveria ser possível!");
  }

  // 5. Round-trip completo com service role (como a Server Action faz)
  const { data: inserida, error: erroInsercao } = await admin
    .from("inscricoes")
    .insert({
      nome_crianca: "__teste_conexao__",
      idade: 5,
      nome_responsavel: "__teste_conexao__",
      telefone: "00000000000",
      contato_emergencia_nome: "__teste_conexao__",
      contato_emergencia_parentesco: "__teste_conexao__",
      contato_emergencia_telefone: "00000000000",
      autorizacao_brinquedos: true,
      autorizacao_imagem: false,
    })
    .select("id")
    .single();

  if (erroInsercao) {
    fail(`Insert via service role falhou: ${erroInsercao.message}`);
  } else {
    ok(`Insert via service role funcionou (id ${inserida.id}).`);
    const { error: erroDelete } = await admin.from("inscricoes").delete().eq("id", inserida.id);
    if (erroDelete) {
      fail(`Não consegui apagar a linha de teste (id ${inserida.id}) — apague manualmente: ${erroDelete.message}`);
    } else {
      ok("Linha de teste removida com sucesso.");
    }
  }

  console.log("\nTeste concluído.");
}

run().catch((e) => {
  console.error("Erro inesperado:", e);
  process.exit(1);
});
