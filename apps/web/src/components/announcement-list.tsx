import type { Announcement } from "@repo/db/shared";
import { formatUtc } from "#/lib/datetime";
import { useI18n } from "#/lib/i18n";

interface AnnouncementListProps {
  announcements: readonly Announcement[];
  memberNames: ReadonlyMap<string, string>;
}

export default function AnnouncementList({
  announcements,
  memberNames,
}: AnnouncementListProps) {
  const { t } = useI18n();
  if (announcements.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {t("No announcements yet.", "暂无公告。")}
      </p>
    );
  }
  return (
    <ul className="m-0 list-none space-y-4 p-0">
      {announcements.map((announcement) => (
        <li className="border-border border-t pt-4" key={announcement.id}>
          <p className="m-0 whitespace-pre-line text-foreground">
            {announcement.pinned ? (
              <span className="island-kicker mr-2">{t("Pinned", "置顶")}</span>
            ) : null}
            {announcement.body}
          </p>
          <p className="m-0 text-muted-foreground text-xs">
            {memberNames.get(announcement.authorId) ??
              t("Unknown member", "未知成员")}
            ,{" "}
            <time dateTime={announcement.createdAt}>
              {formatUtc(announcement.createdAt)}
            </time>
          </p>
        </li>
      ))}
    </ul>
  );
}
