-- MéritoPro — Initial Schema (v1)
-- Roadmap Paso 1: Leads, Profiles, Diagnostics, Questions + RLS

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- Enums
-- ============================================================
create type nivel_jerarquico as enum (
  'directivo', 'asesor', 'ejecutivo', 'profesional',
  'tecnico', 'administrativo', 'operativo'
);

create type tipo_pregunta as enum ('tipo_I', 'tipo_II', 'tipo_III', 'comportamental');

create type fuente_lead as enum ('landing', 'remarketing', 'referido');

-- ============================================================
-- Tabla: leads (pre-pago, acepta INSERT anónimo)
-- ============================================================
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  nombre text not null,
  cargo_aspirado text not null,
  profesion text,
  fuente fuente_lead not null default 'landing',
  diagnostico_id uuid,
  convertido boolean not null default false,
  creado_en timestamptz not null default now()
);

create index leads_email_idx on public.leads (email);
create index leads_convertido_idx on public.leads (convertido) where convertido = false;

-- ============================================================
-- Tabla: profiles (post-pago, 1:1 con auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  lead_id uuid references public.leads(id),
  profesion text not null,
  opec_seleccionada text not null,
  nivel_cargo nivel_jerarquico not null,
  ejes_asignados text[] not null default '{}',
  cv_resumen_json jsonb,
  linea_base_diagnostico_id uuid,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- ============================================================
-- Tabla: diagnostics
-- ============================================================
create table public.diagnostics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  lead_id uuid references public.leads(id),
  indice_preparacion numeric(5,2) not null check (indice_preparacion between 0 and 100),
  modulo_mas_fuerte text,
  modulo_mas_debil text,
  modulos_json jsonb not null default '[]'::jsonb,
  temas_debiles_json jsonb not null default '[]'::jsonb,
  temas_prioritarios text[] not null default '{}',
  fecha timestamptz not null default now(),
  constraint diagnostics_owner_check check (user_id is not null or lead_id is not null)
);

create index diagnostics_user_id_idx on public.diagnostics (user_id);
create index diagnostics_lead_id_idx on public.diagnostics (lead_id);

-- FK diferida en profiles y leads para evitar ciclo en creación
alter table public.profiles
  add constraint profiles_linea_base_fk
  foreign key (linea_base_diagnostico_id) references public.diagnostics(id) on delete set null;

alter table public.leads
  add constraint leads_diagnostico_fk
  foreign key (diagnostico_id) references public.diagnostics(id) on delete set null;

-- ============================================================
-- Tabla: questions (banco de preguntas PGN)
-- ============================================================
create table public.questions (
  id uuid primary key default uuid_generate_v4(),
  tipo_pregunta tipo_pregunta not null,
  modulo text not null,
  tema text not null,
  enunciado text not null,
  opciones_json jsonb not null,
  respuesta_correcta jsonb not null,
  explicacion text not null,
  norma_relacionada text not null,
  dificultad smallint not null check (dificultad between 1 and 3),
  activa boolean not null default true,
  creada_en timestamptz not null default now()
);

create index questions_modulo_idx on public.questions (modulo);
create index questions_tipo_idx on public.questions (tipo_pregunta);
create index questions_activa_idx on public.questions (activa) where activa = true;

-- ============================================================
-- Trigger: actualizar `actualizado_en` en profiles
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.leads      enable row level security;
alter table public.profiles   enable row level security;
alter table public.diagnostics enable row level security;
alter table public.questions  enable row level security;

-- leads: INSERT anónimo permitido (formulario landing). SELECT/UPDATE solo service_role.
create policy "leads_insert_anon"
  on public.leads for insert
  to anon, authenticated
  with check (true);

create policy "leads_select_service_role"
  on public.leads for select
  to service_role
  using (true);

-- profiles: cada usuario solo lee/actualiza su propio registro.
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- diagnostics: dueño por user_id. Lead (anónimo) puede insertar; lectura solo del propio usuario.
create policy "diagnostics_select_own"
  on public.diagnostics for select
  to authenticated
  using (auth.uid() = user_id);

create policy "diagnostics_insert_own_or_lead"
  on public.diagnostics for insert
  to anon, authenticated
  with check (
    (auth.uid() is not null and auth.uid() = user_id)
    or (auth.uid() is null and lead_id is not null and user_id is null)
  );

create policy "diagnostics_update_own"
  on public.diagnostics for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- questions: lectura pública (necesaria para el diagnóstico pre-pago).
create policy "questions_select_public"
  on public.questions for select
  to anon, authenticated
  using (activa = true);
