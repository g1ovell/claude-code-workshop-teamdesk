# Teamdesk Rules

Rules for non-obvious conventions in this repo that are easy to get wrong, and why each exists.

## Architecture & Module Boundaries

- **Browser code must only import `@repo/db/shared` — never `@repo/db` or `@repo/db/<table>`.**
  *Why:* All other `@repo/db` and `@repo/services` entries import Drizzle, which pulls server/SQLite code into the client bundle and breaks the browser build.
- **No barrel files (`index.ts` re-exports) in `@repo/db` or `@repo/services`.**
  *Why:* Each module has its own explicit entry in `package.json#exports` (`@repo/db/<module>`, `@repo/services/<module>`) to keep module boundaries and tree-shaking strict.
- **Request flow is strictly: Route -> tRPC router -> `@repo/services/<module>` -> `@repo/db/<table>`.**
  *Why:* Query functions in `@repo/db` perform zero validation; `@repo/services` owns Zod validation and business rules so tests and scripts get the same guarantees as HTTP callers.
- **Keep tRPC routers thin and never read `ctx.env` inside procedures.**
  *Why:* `@hono/trpc-server` attaches `env` over HTTP, but SSR in-process calls (`createSsrContext`) do not. Always read `env.DB` once in `apps/web/src/server/trpc/context.ts` and use `ctx.services`.
- **Never add `cors()` middleware to `/api/trpc/*` in `apps/web/src/server.ts`.**
  *Why:* JSON POST mutations rely on browser CORS preflight rejection alongside `csrf()` for CSRF protection.

## Auth & Identity

- **There is no user authentication yet (`ctx.userId` is always `null`). Pass `actorId` in procedure input.**
  *Why:* `protectedProcedure` always returns `401 UNAUTHORIZED`. All team mutations take the acting member's ID (`actorId`) from `<MemberPicker>` (`useActingMember`) and check permissions via `requireMember` / `requireAdmin`.

## Database, IDs & Time

- **Database primary/foreign keys are `integer` in SQLite, but exposed as `string` in JSON (`@repo/db/shared`).**
  *Why:* Convert IDs with `Number(id)` in `@repo/db` queries and `String(row.id)` in `to<Entity>()` mappers; never leak Drizzle row types outside `@repo/db`.
- **Take `Database` (`BaseSQLiteDatabase<"sync" | "async", unknown>`) in all `@repo/db` and `@repo/services` functions.**
  *Why:* Production uses async Cloudflare D1 (`drizzle-orm/d1`), while `bun test` uses sync in-memory `bun:sqlite`. `await` works on both.
- **All booking timestamps are UTC ISO 8601 strings with half-open intervals `[startsAt, endsAt)`. Task `dueOn` is `YYYY-MM-DD`.**
  *Why:* Lexicographical string comparisons in SQLite only work when every timestamp is normalized via `toUtcIso()`. Exclusive `endsAt` allows back-to-back bookings without conflict.
- **Generate migrations with `bun run --filter @repo/db generate`, apply with Wrangler, and always commit `migrations/meta/`.**
  *Why:* Drizzle diffs `schema.ts` against `migrations/meta/` snapshots; omitting `meta/` causes duplicate table creation on the next `generate`.

## Tooling & Errors

- **Throw `ServiceError` subclasses (`NotFoundError`, `ValidationError`, `ConflictError`, `ForbiddenError`) from services.**
  *Why:* `apps/web/src/server/trpc/init.ts` maps `ServiceError` to the matching tRPC HTTP status (`404`, `400`, `409`, `403`). Unhandled errors become generic `500`s.
- **Run `bun run check` (`ultracite check && turbo run typecheck`) and `bun test` before finishing.**
  *Why:* Ultracite (Biome) enforces strict formatting/linting rules and husky pre-commit hooks will reject non-compliant code.
