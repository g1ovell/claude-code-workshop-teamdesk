import type { Booking } from "@repo/db/shared";
import { useCallback } from "react";
import { Button } from "#/components/ui/button";
import { formatUtcRange } from "#/lib/datetime";
import { useI18n } from "#/lib/i18n";

interface BookingCardProps {
  booking: Booking;
  /** Who booked it or where it is, depending on the list. */
  detail: string;
  disabled: boolean;
  onCancel: (bookingId: string) => void;
}

export default function BookingCard({
  booking,
  detail,
  disabled,
  onCancel,
}: BookingCardProps) {
  const { t } = useI18n();
  const handleCancel = useCallback(
    () => onCancel(booking.id),
    [booking.id, onCancel]
  );

  return (
    <li className="flex items-center justify-between gap-4 border-border border-t pt-4">
      <div>
        <p className="m-0 font-semibold text-foreground">{booking.title}</p>
        <p className="m-0 text-muted-foreground text-sm">
          <time dateTime={booking.startsAt}>
            {formatUtcRange(booking.startsAt, booking.endsAt)}
          </time>
          , {detail},{" "}
          {t(
            `${booking.attendees} ${booking.attendees === 1 ? "person" : "people"}`,
            `${booking.attendees} 人`
          )}
        </p>
      </div>
      <Button
        disabled={disabled}
        onClick={handleCancel}
        size="sm"
        variant="outline"
      >
        {t("Cancel", "取消")}
      </Button>
    </li>
  );
}
