# Warc Frontend

React admin app for Warc Analytics — Vite, React Router, Apollo Client, shadcn/ui, Zod.

## Setup

1. Copy the environment file:

```bash
cp .env.example .env
```

Required variables:

| Variable | Example |
|----------|---------|
| `VITE_GRAPHQL_BACKEND_URL` | `http://localhost:8081/graphql` |
| `VITE_GRAPHQL_CODEGEN_URL` | `http://localhost:8081/graphql` |

Subscriptions use SSE at the same host with `/graphql` replaced by `/graphql/stream`.

2. Install and start (backend must be running first):

```bash
yarn install
yarn dev
```

3. Regenerate GraphQL types after schema changes:

```bash
yarn compile   # requires backend up at VITE_GRAPHQL_CODEGEN_URL
```

## Seeded logins

Password: `password`. See [backend RBAC guide](../warc-backend/Agent_docs/RBAC-and-Roles-Guide.md) for the full roster.

| Email | Platform role |
|-------|---------------|
| `superadmin@example.com` | Super Admin |
| `admin@example.com` | Admin |
| `nimisha@`, `sai@`, `shiva@`, `chithra@` | Manager (can create projects) |
| `raghav@` and other dev emails | Viewer |

## Routes

| Path | Page |
|------|------|
| `/` | Dashboard |
| `/projects` | Project list (+ create for Admin/Manager) |
| `/projects/:id` | Project board + settings |
| `/projects/:id/tasks/:taskId` | Task detail |
| `/my-tasks` | Assigned tasks |
| `/search` | Global search |
| `/trash` | Restore / admin-only permanent delete |
| `/user-management/members` | Users |
| `/user-management/roles` | Roles (Admin+ with ROLE_MANAGE) |
| `/settings` | Settings |

**Global:** Cmd+K command palette (navigation + recent projects).

## Features

- **Auth:** Login, signup, JWT refresh, protected routes
- **RBAC:** `AuthProvider.hasAllPermissions()`, project-scoped `useProjectPermissions`
- **Phase 1:** Projects, Kanban board, tasks, members
- **Phase 2:** Comments, attachments, dependencies, time logs, notifications, my-tasks
- **Phase 3:** Trash, global search (debounced + skeleton), Cmd+K, GraphQL subscriptions over SSE
- **Dashboard:** Personal + project-scoped KPIs, charts, attention queue, activity, timer — see [Dashboard guide](../warc-backend/Agent_docs/Dashboard-Guide.md)
- **App shell:** Persistent sidebar/header via shared `AppShell` route; per-page title/breadcrumbs via `Layout` + `PageLayoutContext`
- **Project delete:** Settings tab danger zone on `/projects/:id` (soft-delete to Trash, `PROJECT_DELETE` permission)

## Real-time

Apollo Client splits subscription operations to a custom SSE link (`src/utils/subscription-link.ts`) with Bearer auth. Wired on project board, task comments, and notification bell.

## Project structure

```
src/
├── components/       # AppShell, Layout, PageLayoutContext, DataTable, CommandPalette, ui/*
├── routes/           # Page modules per route (protected routes nested under AppShell)
├── hooks/            # useProjectPermissions, useDebouncedCallback, …
├── graphql/          # Subscription documents
└── utils/            # Apollo client, permissions, debounce
```

**Routing:** Auth routes (`/login`, `/signup`) render standalone. All other routes share one `AppShell` instance (`src/routes/index.tsx`) so the sidebar does not remount on navigation. Each page wraps content in `Layout` to publish title, breadcrumbs, and header actions into context.

## Documentation

Backend docs (status, RBAC, phase plans): [../warc-backend/Agent_docs/README.md](../warc-backend/Agent_docs/README.md)
