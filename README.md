# Halal Food Finder

A web app for discovering halal restaurants and food spots near you.

## Stack

A [Turborepo](https://turborepo.com) monorepo built on the T3 stack:

```text
.github
  └─ workflows
        └─ CI with bun cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ web                 Next.js 16 + React 19 + Tailwind CSS v4
packages
  ├─ api                 tRPC v11 router definition
  ├─ auth                Authentication via better-auth (Google OAuth)
  ├─ db                  Drizzle ORM + Supabase Postgres
  ├─ ui                  Shared shadcn/ui components
  └─ validators          Shared Zod schemas
tooling
  ├─ eslint              Shared ESLint presets
  ├─ prettier            Shared Prettier configuration
  ├─ tailwind            Shared Tailwind theme
  └─ typescript          Shared tsconfig bases
```

Package manager: [Bun](https://bun.sh) (≥ 1.3). Node ≥ 22.21 (see [`.nvmrc`](./.nvmrc)).

## Quick Start

You'll need [Bun](https://bun.sh) and [Docker](https://www.docker.com/) installed.

```bash
# 1. Install dependencies
bun install

# 2. Configure environment variables
cp .env.example .env
# Fill in AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
# (POSTGRES_URL is preconfigured for the local docker Postgres)

# 3. Start the local Postgres container
bun run db:up

# 4. Push the Drizzle schema to the database
bun run db:push

# 5. Start the dev server
bun run dev
```

The Next.js app boots on <http://localhost:3000>.

When you're done: `bun run db:down` stops the Postgres container. The data is persisted in a Docker volume (`halal_db_data`) so it survives restarts.

## Authentication

This project uses [Better Auth](https://www.better-auth.com) with Google as the only OAuth provider. To regenerate the auth schema after changing auth config:

```bash
bun --filter @powell-oss/auth generate
```

This rewrites `packages/db/src/auth-schema.ts` from the config in `packages/auth/script/auth-cli.ts`.

## Common scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | Run all apps in watch mode via `turbo watch` |
| `bun run dev:next` | Run only the Next.js app |
| `bun run build` | Build every workspace |
| `bun run lint` / `bun run lint:fix` | ESLint across all workspaces |
| `bun run format` / `bun run format:fix` | Prettier across all workspaces |
| `bun run typecheck` | `tsc --noEmit` across all workspaces |
| `bun run db:up` / `bun run db:down` | Start/stop the local Postgres container |
| `bun run db:push` | Push the Drizzle schema to the database |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run ui-add` | Add a shadcn/ui component to `@powell-oss/ui` |

## Adding a new package

```bash
bun run turbo gen init
```

The generator scaffolds `package.json`, `tsconfig.json`, an `eslint.config.ts`, and a `src/index.ts`.

## Deployment

### Next.js (Vercel)

1. Create a new project on [Vercel](https://vercel.com), selecting `apps/web` as the root directory.
2. Set the env vars: `POSTGRES_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.
3. Deploy.

The auth proxy plugin from better-auth lets OAuth keep working in preview deployments without re-registering callback URLs per branch.

## License

MIT — see [LICENSE](./LICENSE).
