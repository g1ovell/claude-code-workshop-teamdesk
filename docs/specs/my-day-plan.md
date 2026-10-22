# Implementation Plan: My Day (`/my-day`)

Companion plan for [`docs/specs/my-day.md`](./my-day.md), broken into 3 phases.

## Phase 1: Database & Service Queries + Unit Tests
1. **`packages/db/src/bookings.ts`**:
   - Add `listMemberBookingsInRange(db, memberId, { from, to })` to query active bookings (`cancelledAt IS NULL`) where `memberId = Number(memberId)`, `startsAt < to`, and `endsAt > from`, ordered by `startsAt ASC`.
2. **`packages/services/src/bookings.ts`**:
   - Add `listForMemberOnDay(memberId, day)` to `BookingsService` and `createBookingsService`, using `utcDayBounds(day)` and `listMemberBookingsInRange`.
3. **Tests**:
   - Add unit tests in `packages/db/src/bookings.test.ts` and `packages/services/src/bookings.test.ts` covering member day bookings and boundary conditions.
   - Verify with `bun test`.

## Phase 2: tRPC Router Endpoints
1. **`apps/web/src/server/trpc/routers/bookings.ts`**:
   - Add `forMemberDay` query accepting `z.object({ day: z.iso.datetime(), memberId: z.string() })` and delegating to `ctx.services.bookings.listForMemberOnDay(input.memberId, input.day)`.
2. **`apps/web/src/server/trpc/routers/tasks.ts`**:
   - Update `list` query to accept `z.object({ assigneeId: z.string().optional() }).optional()` and pass it to `ctx.services.tasks.list(input)`.

## Phase 3: `/my-day` Route, Navigation & Verification
1. **`apps/web/src/routes/my-day.tsx`**:
   - Create the `/my-day` route with `validateSearch` for `?day=YYYY-MM-DD`, loader fetching `members` and `rooms`, and client state loading the acting member's bookings for `day` (`bookings.forMemberDay`) and assigned tasks (`tasks.list({ assigneeId: actorId })`).
   - Support cancelling bookings (`bookings.cancel`) and completing/reassigning tasks (`tasks.complete`, `tasks.assign`).
2. **Navigation**:
   - Add `"My day"` link to `apps/web/src/components/Header.tsx` and `apps/web/src/routes/index.tsx`.
3. **Verification**:
   - Run `bun run fix`, `bun run check`, and `bun test` to ensure all tests, types, and Ultracite lint rules pass.
