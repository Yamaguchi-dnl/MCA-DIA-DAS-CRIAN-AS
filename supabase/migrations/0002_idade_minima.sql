-- Atualiza a idade mínima aceita de 0 para 2 anos.

alter table public.inscricoes
  drop constraint if exists inscricoes_idade_check;

alter table public.inscricoes
  add constraint inscricoes_idade_check check (idade >= 2 and idade <= 17);
