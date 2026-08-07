# Warc Frontend

Web app for **Warc Analytics** — project boards, task collaboration, dashboard, search, trash, and personal notes.

Built with **Vite**, **React**, **React Router**, **Apollo Client**, **shadcn/ui**, and **Zod**.

## What it does

- **Auth** — login, signup, JWT refresh, protected routes
- **Dashboard** — KPIs, charts, attention queue, activity, active timer
- **Projects** — list, Kanban board, members, settings, soft-delete
- **Tasks** — detail view with comments, attachments, dependencies, time logs
- **My Tasks** — tasks assigned to the current user
- **Notes** — personal markdown files in a folder tree; editor with preview, export, trash
- **Search** — global search across projects, tasks, and comments
- **Trash** — restore items; permanent delete for admins
- **User management** — users and roles (permission-gated)
- **Real-time** — GraphQL subscriptions over SSE on board, comments, and notifications
- **Command palette** — Cmd+K for navigation and recent projects

## Prerequisites

- Node.js 20+
- Yarn
- **Warc backend** running locally (see `../warc-backend/README.md`)

## Setup

1. **Environment**

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_GRAPHQL_BACKEND_URL` | GraphQL HTTP endpoint (e.g. `http://localhost:8081/graphql`) |
| `VITE_GRAPHQL_CODEGEN_URL` | Same URL, used by codegen |

Subscriptions use SSE at the same host with `/graphql` replaced by `/graphql/stream`.

2. **Install and run**

```bash
yarn install
yarn dev
```

App default: `http://localhost:5173` (Vite).

3. **GraphQL types** (after backend schema changes)

```bash
yarn compile
```

Requires the backend to be up at `VITE_GRAPHQL_CODEGEN_URL`.

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start Vite dev server |
| `yarn build` | Production build |
| `yarn preview` | Preview production build |
| `yarn compile` | Regenerate GraphQL types from backend schema |
| `yarn tsc -b` | Typecheck |
| `yarn format` | Format/lint with Biome |

## Seeded logins

Use the backend seed users. **Password:** `password`

Examples: `superadmin@example.com`, `admin@example.com`, `raghav@example.com`.

## Routes

| Path | Page |
|------|------|
| `/` | Dashboard |
| `/projects` | Project list |
| `/projects/:id` | Project board + settings |
| `/projects/:id/tasks/:taskId` | Task detail |
| `/my-tasks` | Assigned tasks |
| `/notes` | Personal notes (explorer + markdown editor) |
| `/search` | Global search |
| `/trash` | Deleted items |
| `/user-management/members` | Users |
| `/user-management/roles` | Roles |
| `/settings` | Settings |

Auth routes (`/login`, `/signup`) render outside the main shell.

## Project layout

```
src/
├── components/     # AppShell, Layout, shared UI, CommandPalette
├── routes/         # One folder per page (index.tsx + colocated queries)
├── hooks/          # useProjectPermissions, debounce, etc.
├── graphql/        # Subscription documents
├── utils/          # Apollo client, permissions, helpers
└── __generated__/  # GraphQL codegen output (do not edit by hand)
```

**Routing:** Protected routes share a single `AppShell` (sidebar + header). Each page uses `Layout` to set breadcrumbs and title via `PageLayoutContext`.

**Real-time:** Apollo splits subscriptions to an SSE link (`src/utils/subscription-link.ts`) with Bearer auth.

## Backend

The GraphQL API lives in the sibling repo **`warc-backend`**. Start it before `yarn dev` or `yarn compile`.
