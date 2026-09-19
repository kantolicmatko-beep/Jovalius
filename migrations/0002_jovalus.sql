create table if not exists members (
  user_id text primary key,
  email text not null unique,
  role text not null check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

create table if not exists invites (
  email text primary key,
  invited_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists gigs (
  id text primary key,
  title text not null,
  type text not null,
  date date not null,
  start_time text not null default '',
  end_time text not null default '',
  venue text not null default '',
  city text not null default '',
  address text not null default '',
  contact_name text not null default '',
  contact_phone text not null default '',
  fee integer,
  deposit integer,
  status text not null,
  notes text not null default '',
  setlist text not null default '',
  created_at timestamptz not null default now(),
  created_by text not null
);

create index if not exists gigs_date_idx on gigs (date);

create table if not exists documents (
  id text primary key,
  gig_id text not null references gigs (id) on delete cascade,
  name text not null,
  kind text not null,
  mime_type text not null,
  size integer not null,
  content_base64 text not null,
  created_at timestamptz not null default now(),
  created_by text not null
);

create index if not exists documents_gig_id_idx on documents (gig_id);

create table if not exists wedding_forms (
  gig_id text primary key references gigs (id) on delete cascade,
  data text not null,
  updated_at timestamptz not null default now(),
  updated_by text not null
);
