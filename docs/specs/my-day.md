# Spec: My Day (`/my-day`)

## Overview

Give each team member a single page (`/my-day`) to view their room bookings for a chosen UTC day alongside their open assigned tasks, with quick actions to cancel a booking or complete/reassign a task.

## Scope & Goals (20-Minute Build)

- Keep schema unchanged (no new tables or D1 migrations needed).
- Reuse existing UI primitives (`MemberPicker`, `BookingList`, `TaskList`, `Input`, `FormError`) and follow the strict layer boundaries (`Route -> tRPC -> @repo/services -> @repo/db`).

## Requirements

### 1. Database & Service Layer
- **`@repo/db/bookings`**:
  - Add `listMemberBookingsInRange(db: Database, memberId: string, range: { from: string; to: string }): Promise<Booking[]>` returning active (`cancelledAt is null`) bookings for `memberId` that overlap `[from, to)`, ordered by `startsAt` ascending.
- **`@repo/services/bookings`**:
  - Add `listForMemberOnDay(memberId: string, day: string): Promise<Booking[]>` on `BookingsService` using `utcDayBounds(day)` and `listMemberBookingsInRange`.
  - Validate that `day` is a valid ISO datetime string (or normalize via `utcDayBounds`).
- **`apps/web/src/server/trpc/routers/bookings.ts`**:
  - Add `forMemberDay` query taking `{ memberId: z.string(), day: z.iso.datetime() }` and calling `ctx.services.bookings.listForMemberOnDay(input.memberId, input.day)`.
- **Tasks**:
  - Reuse `tasks.list` (which already supports optional `{ assigneeId }` filter in `@repo/services/tasks` and `@repo/db/tasks`). Expose optional `{ assigneeId: z.string().optional() }` input on `tasksRouter.list` in `apps/web/src/server/trpc/routers/tasks.ts`, and filter to open tasks (`completedAt === null`) on the My Day view.

### 2. Route & UI (`apps/web/src/routes/my-day.tsx`)
- **URL & Search Params**:
  - Route path: `/my-day` with optional search param `?day=YYYY-MM-DD` (defaults to `todayUtc()`).
- **Navigation**:
  - Add a `"My day"` link to `apps/web/src/components/Header.tsx` and a card on the home page `apps/web/src/routes/index.tsx`.
- **Controls**:
  - `MemberPicker` to choose the acting member (`useActingMember`).
  - Date `<Input type="date" />` to switch the target UTC day.
- **Sections**:
  1. **My bookings on `{day}`**:
     - Renders `<BookingList>` with the acting member's active bookings on `{day}`, showing the room name for each booking and allowing cancellation via `bookings.cancel`.
  2. **My open tasks**:
     - Renders `<TaskList>` with open tasks (`completedAt === null`) assigned to the acting member, sorted by due date (highlighting tasks due on or before `{day}`), allowing task completion (`tasks.complete`) and reassignment (`tasks.assign`).

### 3. Testing
- Unit test `listMemberBookingsInRange` in `packages/db/src/bookings.test.ts`.
- Unit test `bookingsService.listForMemberOnDay` in `packages/services/src/bookings.test.ts`.
- All existing and new tests must pass via `bun test`, and `bun run check` must pass with zero lint/type errors.
