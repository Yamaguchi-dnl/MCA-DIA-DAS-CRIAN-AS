# O Incrível Parque MCA — IAP Barreirinha

Landing page com inscrições e painel administrativo para **O Incrível
Parque MCA**, o evento de Dia das Crianças da IAP Barreirinha.

- **Data:** 03 de outubro de 2025, a partir das 12h
- **Local:** IAP Barreirinha — Rua Flávio Dallegrave, 9745, Curitiba - PR
- **Entrada gratuita**

Este projeto segue a mesma arquitetura do site do Ministério de Mulheres da
IAP Barreirinha (`mm.iapbarreirinha.com.br`), adaptada para um evento
gratuito e infantil: mesma stack, mesmo padrão de Server Actions + Supabase
com RLS, mesmo painel administrativo com trilha de auditoria — sem os
componentes de pagamento (Pix), que não se aplicam aqui.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + componentes no padrão **shadcn/ui** (copiados
  localmente em `components/ui`, sem CLI) + **lucide-react**
- **React Hook Form** + **Zod** para validação de formulários
- **Supabase** (Postgres + Auth) como backend
- Deploy sugerido: **Vercel**

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar um projeto no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, rode o conteúdo de
   `supabase/migrations/0001_init.sql`. Isso cria as tabelas `inscricoes`,
   `administradores`, `auditoria_inscricoes`, os índices, o trigger de
   `updated_at` e as políticas de RLS.

### 3. Configurar variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha com os dados do seu
projeto Supabase (**Project Settings → API**):

```bash
cp .env.local.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — **nunca** exponha esta chave no navegador;
  ela é usada apenas na Server Action pública de inscrição
  (`lib/supabase/admin.ts`).
- `NEXT_PUBLIC_SITE_URL` — URL pública do site (usada em SEO/Open Graph).

### 4. Criar o primeiro administrador

O cadastro de administradores é sempre manual (não existe cadastro
público), por segurança:

1. No painel do Supabase, vá em **Authentication → Users → Add user** e
   crie um usuário com e-mail e senha reais.
2. Copie o `UID` gerado para esse usuário.
3. No **SQL Editor**, rode (substituindo os valores):

   ```sql
   insert into public.administradores (id, nome, email, ativo)
   values ('UID_DO_USUARIO', 'Nome do administrador', 'email@dominio.com', true);
   ```

4. Acesse `/admin/login` com o e-mail e senha cadastrados.

### 5. Editar os dados do evento

Edite **apenas** o arquivo [`config/evento.ts`](config/evento.ts) — ele
centraliza todos os textos, datas, local e contatos exibidos no site.
Campos marcados como `[A_DEFINIR: ...]` precisam ser substituídos pelos
dados reais antes da publicação:

- Nome, subtítulo e descrições do evento
- Data, horário e local
- Faixa etária e limite de vagas (ou `null` para sem limite)
- Número de WhatsApp da organização e Instagram/e-mail de contato

**Fotos da criançada (colagem da tela inicial):** salve os arquivos em
`public/criancas-1.jpg` até `public/criancas-4.jpg` (os caminhos já estão
configurados em `components/sections/hero.tsx`). Enquanto os arquivos não
existirem, aparece um bloco decorativo no lugar da foto — o site funciona
normalmente sem elas.

### 6. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 7. Build de produção

```bash
npm run build
npm run start
```

## Estrutura do projeto

```
app/                       Páginas (App Router)
  inscricao/                Formulário de inscrição e página de sucesso
  admin/
    login/                   Login administrativo
    (painel)/                Dashboard + lista + filtros + detalhe (protegido)
    exportar/                Route handler de exportação CSV
components/
  ui/                        Componentes de interface (padrão shadcn/ui)
  layout/                    Header e footer
  sections/                  Hero da landing page + JSON-LD do evento
  forms/                     Formulários (inscrição, login)
  admin/                     Componentes do painel administrativo
config/evento.ts             Configuração central e editável do evento
lib/
  supabase/                  Clientes Supabase (browser, server, admin/service role)
  actions/                   Server Actions (inscrição, autenticação, admin)
  admin/                     Consultas e exportação CSV usadas pelo painel
  validations/                Schemas Zod
supabase/migrations/          SQL de schema, índices e RLS
```

## Segurança e privacidade

- RLS habilitado em todas as tabelas. Leitura/edição de inscrições é
  restrita a administradores ativos (`administradores.ativo = true`),
  validado tanto no banco (policies) quanto no servidor (Server
  Actions/middleware).
- Não existe policy de INSERT pública na tabela `inscricoes` — a criação de
  inscrição passa por uma Server Action que usa a service role key
  **apenas no servidor**, nunca no navegador.
- O middleware (`middleware.ts`) protege todas as rotas `/admin/*`,
  redirecionando usuários não autenticados para `/admin/login`.
- Páginas administrativas têm `robots: noindex` e `/admin` está bloqueado
  em `robots.ts`.
- O painel permite anonimizar os dados pessoais de uma inscrição (LGPD)
  sem apagar o histórico de auditoria.

## Fluxo de inscrição

O evento é gratuito, então não há integração de pagamento:

1. O responsável preenche, em `/inscricao`: nome da criança, idade, nome e
   WhatsApp do responsável, se a criança possui alergia/restrição
   alimentar, informações importantes de segurança/bem-estar, um contato
   de emergência (nome, parentesco e telefone), a autorização de uso dos
   brinquedos (obrigatória) e a autorização de uso de imagem (sim/não).
2. A inscrição é salva com status `pendente`.
3. A organização confirma a presença manualmente no painel administrativo
   (`/admin`), mudando o status para `confirmado`. Inscrições com alergia,
   restrição alimentar ou informação de segurança marcada aparecem com um
   ícone de alerta na lista.

## Publicação (Vercel)

1. Suba o projeto para um repositório Git.
2. Importe o repositório na [Vercel](https://vercel.com/new).
3. Configure as mesmas variáveis de ambiente de `.env.local.example` no
   painel do projeto na Vercel (incluindo `NEXT_PUBLIC_SITE_URL` com a URL
   final).
4. Rode a migration do Supabase (passo 2 acima) no projeto Supabase de
   produção, se for diferente do usado em desenvolvimento.

## Dados fictícios de desenvolvimento

Nenhum dado fictício de contato ou credencial foi inserido no código —
campos sensíveis ainda não confirmados (WhatsApp da organização,
Instagram, e-mail) estão como placeholders `[A_DEFINIR: ...]` em
`config/evento.ts`, para serem preenchidos com os dados reais antes da
publicação.
