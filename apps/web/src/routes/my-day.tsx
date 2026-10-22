import type { Booking, Task } from "@repo/db/shared";
import { createFileRoute } from "@tanstack/react-router";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import BookingList from "#/components/bookings/BookingList";
import FormError from "#/components/form-error";
import MemberPicker from "#/components/member-picker";
import PageError from "#/components/page-error";
import TaskList from "#/components/task-list";
import { Input } from "#/components/ui/input";
import { useActingMember } from "#/hooks/use-acting-member";
import { useAction } from "#/hooks/use-action";
import { getTrpc } from "#/integrations/trpc/client";
import { todayUtc } from "#/lib/datetime";
import { useI18n } from "#/lib/i18n";

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface MyDaySearch {
  day?: string;
}

export const Route = createFileRoute("/my-day")({
  validateSearch: (search: Record<string, unknown>): MyDaySearch => ({
    day:
      typeof search.day === "string" && DAY_PATTERN.test(search.day)
        ? search.day
        : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const trpc = getTrpc();
    const [members, rooms] = await Promise.all([
      trpc.members.list.query(),
      trpc.rooms.list.query(),
    ]);
    const day = deps.day ?? todayUtc();
    return { day, members, rooms };
  },
  component: MyDayPage,
  errorComponent: PageError,
});

function MyDayPage() {
  const { day, members, rooms } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const { actingMember, setActingMemberId } = useActingMember(members);
  const cancelBooking = useAction();
  const updateTask = useAction();
  const { t } = useI18n();
  const actorId = actingMember?.id ?? "";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const roomNames = useMemo(
    () => new Map(rooms.map((r) => [r.id, r.name])),
    [rooms]
  );

  const loadMyDay = useCallback(async () => {
    if (!actorId) {
      return;
    }
    const trpc = getTrpc();
    const [dayBookings, assignedTasks] = await Promise.all([
      trpc.bookings.forMemberDay.query({
        day: `${day}T00:00:00.000Z`,
        memberId: actorId,
      }),
      trpc.tasks.list.query({ assigneeId: actorId }),
    ]);
    setBookings(dayBookings);
    setTasks(assignedTasks.filter((task) => task.completedAt === null));
  }, [actorId, day]);

  useEffect(() => {
    loadMyDay().catch(() => {
      setBookings([]);
      setTasks([]);
    });
  }, [loadMyDay]);

  const handleDayChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.value) {
        navigate({ search: { day: event.target.value } });
      }
    },
    [navigate]
  );

  const handleCancelBooking = useCallback(
    async (bookingId: string) => {
      const ok = await cancelBooking.run(() =>
        getTrpc().bookings.cancel.mutate({ actorId, bookingId })
      );
      if (ok) {
        await loadMyDay();
      }
    },
    [actorId, cancelBooking.run, loadMyDay]
  );

  const handleCompleteTask = useCallback(
    async (taskId: string) => {
      const ok = await updateTask.run(() =>
        getTrpc().tasks.complete.mutate({ actorId, taskId })
      );
      if (ok) {
        await loadMyDay();
      }
    },
    [actorId, loadMyDay, updateTask.run]
  );

  const handleAssignTask = useCallback(
    async (taskId: string, assigneeId: string | null) => {
      const ok = await updateTask.run(() =>
        getTrpc().tasks.assign.mutate({ actorId, assigneeId, taskId })
      );
      if (ok) {
        await loadMyDay();
      }
    },
    [actorId, loadMyDay, updateTask.run]
  );

  const describeBooking = useCallback(
    (booking: Booking) =>
      roomNames.get(booking.roomId) ?? t("archived room", "已归档会议室"),
    [roomNames, t]
  );

  return (
    <main className="page-wrap px-4 py-12">
      <section className="flex max-w-3xl flex-col gap-4">
        <p className="island-kicker m-0">Teamdesk</p>
        <h1 className="display-title m-0 text-4xl text-foreground sm:text-5xl">
          {t("My day", "今日概览")}
        </h1>
        <p className="m-0 text-base text-muted-foreground leading-8">
          {t(
            "Your room bookings for the selected UTC day and your open tasks in one place.",
            "在一个页面集中查看您所选 UTC 日期的会议室预订与未完成任务。"
          )}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <MemberPicker
            members={members}
            onChange={setActingMemberId}
            value={actingMember?.id}
          />
          <Input
            aria-label="Day"
            className="sm:w-44"
            onChange={handleDayChange}
            type="date"
            value={day}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-2xl text-foreground">
          {t(`My bookings on ${day}`, `我在 ${day} 的预订`)}
        </h2>
        <FormError message={cancelBooking.error} />
        <BookingList
          bookings={bookings}
          describe={describeBooking}
          disabled={cancelBooking.pending}
          emptyText={t(
            "You have no bookings on this day.",
            "您在当天没有会议室预订。"
          )}
          onCancel={handleCancelBooking}
        />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-2xl text-foreground">
          {t("My open tasks", "我的待办任务")}
        </h2>
        <FormError message={updateTask.error} />
        <TaskList
          disabled={updateTask.pending}
          members={members}
          onAssign={handleAssignTask}
          onComplete={handleCompleteTask}
          tasks={tasks}
        />
      </section>
    </main>
  );
}
