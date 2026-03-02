# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal Kanban board productivity tool for tracking weekly tasks between two users. Each user gets their own board (URL-based identity, no auth), and a shared progress page shows weekly completion stats. Built as a static site deployed to GitHub Pages with Supabase as the backend database.

## Tech Stack

- **UI**: React 19 + Vite 7 (JSX, no TypeScript)
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` plugin, no config file — v4 uses CSS-based config via `@import "tailwindcss"` in `src/index.css`)
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Routing**: react-router-dom v7 (basename: `/kanban-board`)
- **Database**: Supabase (PostgreSQL + real-time subscriptions)
- **Hosting**: GitHub Pages (base path: `/kanban-board/`)

## Commands

```bash
npm run dev        # Local dev server (http://localhost:5173)
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run deploy     # Build + deploy to GitHub Pages via gh-pages
```

## Architecture

```
src/
├── lib/           # Supabase client + all database read/write functions
│   ├── supabase.js   # createClient (reads env vars VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
│   └── db.js         # All CRUD: createBoard, getTasks, updateTask, etc. + real-time subscription
├── components/    # Reusable UI (Board, Column, Card, AddCard, ProgressBar)
└── pages/         # Route-level views (Home, BoardPage, Progress, Admin)
```

**Data flow**: Pages call `db.js` functions → `db.js` calls Supabase → Supabase returns data. Real-time updates use Supabase's `postgres_changes` channel in `subscribeToTasks()`.

**Routing** (defined in `App.jsx`):
- `/` — Home: create or join a board
- `/board/:boardId` — The Kanban board for one user
- `/progress` — Weekly completion stats across all boards
- `/admin` — List all boards with copy-link buttons

## Database Schema (Supabase)

Two tables in `supabase-schema.sql`:
- **boards**: `id` (uuid PK), `name`, `created_at`
- **tasks**: `id` (uuid PK), `board_id` (FK → boards), `title`, `column` (todo|in_progress|done), `position`, `created_at`, `completed_at`

RLS is enabled with permissive policies (appropriate for a personal tool between known users).

## Environment Variables

Stored in `.env` (gitignored). See `.env.example` for the template:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key

## Key Patterns

- **URL-based identity**: No auth. Each board has a UUID in the URL — bookmarking is the "login"
- **Optimistic updates**: Card moves update local state immediately, then sync to Supabase
- **Column IDs**: Always use `todo`, `in_progress`, `done` (snake_case strings, defined in `Column.jsx` and `Board.jsx`)
- **GitHub Pages SPA**: Uses `basename="/kanban-board"` in both `vite.config.js` and `BrowserRouter`. If the repo name changes, update both.
