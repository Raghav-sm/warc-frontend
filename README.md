# Warc Frontend

Auth + RBAC React frontend for Warc Analytics, built with Vite, React, Apollo Client, shadcn/ui, and Zod.

## Setup

1. Copy the environment file:

```bash
cp .env.example .env
# Ensure VITE_GRAPHQL_BACKEND_URL points at your running backend
```

2. Install dependencies:

```bash
yarn install
```

3. Start the backend first (see `../warc-backend/README.md`), then start the frontend:

```bash
yarn dev
```

4. After the backend is running, regenerate GraphQL types (optional but recommended):

```bash
yarn compile
```

## Seeded logins

All users share the password `password`:

| Email | Role |
|-------|------|
| `superadmin@example.com` | Super Admin |
| `admin@example.com` | Admin |
| `viewer@example.com` | Viewer |

## What's included

- **Auth**: Login, signup, JWT session management, protected routes
- **RBAC**: Role-based permissions via `AuthProvider.hasAllPermissions()`
- **CRUD demos**: Users list (`/user-management/members`), Roles list/detail (`/user-management/roles`)
- **Dashboard**: KPI cards + recent users DataTable
- **Components**: Full shadcn/ui kit, `DataTable`, `Form` + Zod primitives, `KpiCard`

## Project structure

```
src/
├── components/       # App shell, DataTable, Form, KpiCard, ui/*
├── primitives/       # Form field inputs
├── routes/           # Page modules (auth, dashboard, users-management, settings)
├── hooks/            # useLogout, use-mobile
└── utils/            # Apollo client, validation, permissions
```
