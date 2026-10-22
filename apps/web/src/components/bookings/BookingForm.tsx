import { BOOKING_TITLE_MAX_LENGTH } from "@repo/db/shared";
import { type FormEvent, useCallback } from "react";
import FormError from "#/components/form-error";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { isoFromDayAndTime } from "#/lib/datetime";
import { useI18n } from "#/lib/i18n";

export interface BookingDraft {
  attendees: number;
  endsAt: string;
  startsAt: string;
  title: string;
}

interface BookingFormProps {
  capacity: number;
  /** The chosen UTC day, YYYY-MM-DD. */
  day: string;
  error: string | null;
  onSubmit: (draft: BookingDraft) => Promise<boolean>;
  pending: boolean;
}

export default function BookingForm({
  capacity,
  day,
  error,
  onSubmit,
  pending,
}: BookingFormProps) {
  const { t } = useI18n();
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const ok = await onSubmit({
        attendees: Number(data.get("attendees")),
        endsAt: isoFromDayAndTime(day, String(data.get("endsAt"))),
        startsAt: isoFromDayAndTime(day, String(data.get("startsAt"))),
        title: String(data.get("title") ?? ""),
      });
      if (ok) {
        form.reset();
      }
    },
    [day, onSubmit]
  );

  return (
    <form className="island-shell p-6 sm:p-8" onSubmit={handleSubmit}>
      <p className="island-kicker mb-3">
        {t(
          `New booking on ${day} (times in UTC)`,
          `新建 ${day} 的预订（UTC 时间）`
        )}
      </p>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] sm:items-end">
        <label className="grid gap-1 text-sm" htmlFor="booking-title">
          {t("Title", "会议主题")}
          <Input
            id="booking-title"
            maxLength={BOOKING_TITLE_MAX_LENGTH}
            name="title"
            required
          />
        </label>
        <label className="grid gap-1 text-sm" htmlFor="booking-start">
          {t("Start", "开始时间")}
          <Input
            defaultValue="09:00"
            id="booking-start"
            name="startsAt"
            required
            step={900}
            type="time"
          />
        </label>
        <label className="grid gap-1 text-sm" htmlFor="booking-end">
          {t("End", "结束时间")}
          <Input
            defaultValue="10:00"
            id="booking-end"
            name="endsAt"
            required
            step={900}
            type="time"
          />
        </label>
        <label className="grid gap-1 text-sm" htmlFor="booking-attendees">
          {t("Attendees", "参会人数")}
          <Input
            defaultValue={1}
            id="booking-attendees"
            max={capacity}
            min={1}
            name="attendees"
            required
            type="number"
          />
        </label>
        <Button disabled={pending} type="submit">
          {pending ? t("Booking…", "预订中…") : t("Book", "立即预订")}
        </Button>
      </div>
      <FormError message={error} />
    </form>
  );
}
