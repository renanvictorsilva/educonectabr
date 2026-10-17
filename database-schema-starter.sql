-- Connect Edu PR — PostgreSQL/Supabase starter schema
-- REVIEW before deployment. Apply row-level security and policies only after
-- confirming the real identity model, institution boundaries, and consent flows.
create extension if not exists pgcrypto;

create type public.app_role as enum ('student','teacher','pedagogue','guardian','school_admin');
create type public.assignment_status as enum ('draft','published','submitted','reviewed');
create type public.skill_status as enum ('not_started','developing','consolidating','demonstrated');

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  municipality text,
  state_code char(2) not null default 'PR',
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete restrict,
  full_name text not null,
  role public.app_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  school_year text not null,
  created_at timestamptz not null default now(),
  unique (school_id, name, school_year)
);

create table public.class_memberships (
  class_id uuid not null references public.classes(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  membership_role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (class_id, profile_id)
);

create table public.guardian_student_links (
  guardian_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  relationship_label text,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  primary key (guardian_id, student_id),
  check (guardian_id <> student_id)
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  area text,
  is_active boolean not null default true
);

create table public.curriculum_skills (
  id uuid primary key default gen_random_uuid(),
  framework_name text not null,
  framework_version text,
  official_code text,
  stage text not null,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  description text not null,
  validation_status text not null default 'draft'
    check (validation_status in ('draft','reviewed','approved','archived')),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  description text,
  resource_type text not null,
  url text,
  storage_path text,
  visibility text not null default 'school'
    check (visibility in ('school','class','private')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  created_by uuid not null references public.profiles(id),
  title text not null,
  instructions text,
  due_at timestamptz,
  status public.assignment_status not null default 'draft',
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.assignment_skill_links (
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  skill_id uuid not null references public.curriculum_skills(id) on delete cascade,
  primary key (assignment_id, skill_id)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  response_text text,
  file_path text,
  score numeric(5,2) check (score >= 0 and score <= 100),
  teacher_feedback text,
  submitted_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  unique (assignment_id, student_id)
);

create table public.skill_evidence (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.curriculum_skills(id) on delete cascade,
  assignment_id uuid references public.assignments(id) on delete set null,
  status public.skill_status not null default 'not_started',
  evidence_note text,
  assessed_by uuid references public.profiles(id),
  assessed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.school_events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  audience text not null default 'school',
  created_by uuid not null references public.profiles(id)
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  title text not null,
  body text not null,
  audience text not null default 'school',
  published_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  school_id uuid references public.schools(id) on delete set null,
  action text not null,
  object_type text,
  object_id text,
  created_at timestamptz not null default now()
);



-- v14.4: canais de conversa por turma (base para integração real no backend).
-- Não habilite produção antes de criar/testar as políticas RLS abaixo.
create table public.class_chat_channels (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null unique references public.classes(id) on delete cascade,
  title text not null default 'Canal da turma',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.class_chat_messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.class_chat_channels(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete restrict,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create index class_chat_messages_channel_created_idx
  on public.class_chat_messages(channel_id, created_at desc)
  where deleted_at is null;

-- Before production:
-- 1) Enable RLS on every table.
-- 2) Write and test policies using auth.uid(), school membership, role, and
--    verified guardian_student_links. For class chat, allow SELECT/INSERT only to
--    active teachers/pedagogues assigned to that class (and explicitly approved
--    school admins); validate sender_id against auth.uid(). Never trust browser roles.
-- 3) Do not expose service-role keys to front-end code.
-- 4) Add retention, consent, deletion/export, incident-response and backup plans.
-- 5) Test that students cannot query teacher/admin records by changing IDs.
