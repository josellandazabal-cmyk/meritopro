create extension if not exists vector;

create table if not exists documentos_rag (
  id bigserial primary key,
  fuente text not null,
  chunk text not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);

create index if not exists documentos_rag_embedding_idx
  on documentos_rag using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create index if not exists documentos_rag_fuente_idx on documentos_rag (fuente);

create or replace function match_documentos(
  query_embedding vector(1536),
  match_count int default 4
) returns table (
  id bigint,
  fuente text,
  chunk text,
  similarity float
) language sql stable as $$
  select id, fuente, chunk, 1 - (embedding <=> query_embedding) as similarity
  from documentos_rag
  order by embedding <=> query_embedding
  limit match_count;
$$;
