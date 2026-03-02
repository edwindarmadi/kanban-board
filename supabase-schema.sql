-- Run this in your Supabase SQL Editor to set up the database.
-- Dashboard: https://supabase.com/dashboard → your project → SQL Editor

-- ─── Boards table ──────────────────────────────────────────
create table boards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now()
);

-- ─── Tasks table ───────────────────────────────────────────
create table tasks (
  id uuid default gen_random_uuid() primary key,
  board_id uuid references boards(id) on delete cascade not null,
  title text not null,
  column text not null default 'todo',
  position int not null default 0,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Index for fast task lookups by board
create index idx_tasks_board_id on tasks(board_id);

-- ─── Row Level Security (RLS) ──────────────────────────────
-- Enable RLS but allow all operations via the anon key.
-- This is fine for a personal tool; add stricter policies if needed later.

alter table boards enable row level security;
alter table tasks enable row level security;

create policy "Allow all operations on boards" on boards
  for all using (true) with check (true);

create policy "Allow all operations on tasks" on tasks
  for all using (true) with check (true);

-- ─── Enable Realtime ───────────────────────────────────────
alter publication supabase_realtime add table tasks;
