-- Dia das Crianças IAP Barreirinha — schema inicial
-- Tabelas: inscricoes, administradores, auditoria_inscricoes
-- RLS: acesso de leitura/escrita restrito a administradores autenticados;
-- a inscrição pública passa sempre pela service role key dentro de uma
-- Server Action (nunca diretamente do navegador).

create extension if not exists "pgcrypto";

-- ==========================================================
-- Tabela: administradores
-- ==========================================================
create table if not exists public.administradores (
  id uuid primary key references auth.users (id) on delete cascade,
  nome varchar(160) not null,
  email varchar(160) not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.administradores enable row level security;

create policy "Administrador vê o próprio registro"
  on public.administradores
  for select
  to authenticated
  using (id = (select auth.uid()));

-- ==========================================================
-- Tabela: inscricoes
-- ==========================================================
create table if not exists public.inscricoes (
  id uuid primary key default gen_random_uuid(),
  nome_crianca varchar(200) not null,
  idade smallint not null check (idade >= 2 and idade <= 17),
  nome_responsavel varchar(200) not null,
  telefone varchar(20) not null,

  possui_restricao_alimentar boolean not null default false,
  restricao_alimentar_detalhe text,
  possui_informacao_importante boolean not null default false,
  informacao_importante_detalhe text,

  contato_emergencia_nome varchar(200) not null,
  contato_emergencia_parentesco varchar(100) not null,
  contato_emergencia_telefone varchar(20) not null,

  autorizacao_brinquedos boolean not null default false,
  autorizacao_imagem boolean not null default false,

  status_inscricao varchar(20) not null default 'pendente'
    check (status_inscricao in ('pendente', 'confirmado', 'cancelado')),
  observacoes_administrativas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inscricoes_telefone_idx on public.inscricoes (telefone);
create index if not exists inscricoes_status_inscricao_idx on public.inscricoes (status_inscricao);
create index if not exists inscricoes_nome_crianca_idx on public.inscricoes (lower(nome_crianca));

-- Evita duplicidade de inscrição da mesma criança pelo mesmo WhatsApp,
-- exceto quando a inscrição anterior foi cancelada (permite reenviar).
-- Como um mesmo WhatsApp pode inscrever mais de uma criança (irmãos), a
-- unicidade é sobre o par telefone + nome da criança, não sobre o telefone
-- sozinho.
create unique index if not exists inscricoes_duplicidade_idx
  on public.inscricoes (telefone, lower(nome_crianca))
  where status_inscricao <> 'cancelado';

alter table public.inscricoes enable row level security;

create policy "Administrador ativo vê inscrições"
  on public.inscricoes
  for select
  to authenticated
  using (
    exists (
      select 1 from public.administradores a
      where a.id = (select auth.uid()) and a.ativo = true
    )
  );

create policy "Administrador ativo atualiza inscrições"
  on public.inscricoes
  for update
  to authenticated
  using (
    exists (
      select 1 from public.administradores a
      where a.id = (select auth.uid()) and a.ativo = true
    )
  )
  with check (
    exists (
      select 1 from public.administradores a
      where a.id = (select auth.uid()) and a.ativo = true
    )
  );

-- Não há policy de INSERT/DELETE para os papéis anon/authenticated:
-- inscrições são criadas apenas via service role (Server Action pública).

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inscricoes_set_updated_at on public.inscricoes;
create trigger inscricoes_set_updated_at
  before update on public.inscricoes
  for each row
  execute function public.set_updated_at();

-- ==========================================================
-- Tabela: auditoria_inscricoes
-- ==========================================================
create table if not exists public.auditoria_inscricoes (
  id uuid primary key default gen_random_uuid(),
  inscricao_id uuid not null references public.inscricoes (id) on delete cascade,
  administrador_id uuid references public.administradores (id) on delete set null,
  campo_alterado varchar(60) not null,
  valor_anterior text,
  valor_novo text,
  created_at timestamptz not null default now()
);

create index if not exists auditoria_inscricao_id_idx on public.auditoria_inscricoes (inscricao_id);
create index if not exists auditoria_inscricoes_administrador_id_idx on public.auditoria_inscricoes (administrador_id);

alter table public.auditoria_inscricoes enable row level security;

create policy "Administrador ativo vê auditoria"
  on public.auditoria_inscricoes
  for select
  to authenticated
  using (
    exists (
      select 1 from public.administradores a
      where a.id = (select auth.uid()) and a.ativo = true
    )
  );

create policy "Administrador ativo registra auditoria"
  on public.auditoria_inscricoes
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.administradores a
      where a.id = (select auth.uid()) and a.ativo = true
    )
  );
