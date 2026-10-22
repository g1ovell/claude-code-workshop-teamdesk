import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { useI18n } from "#/lib/i18n";

export const Route = createFileRoute("/")({ component: App });

const pages = [
  {
    descriptionEn: "See who is on the team and read the latest announcements.",
    descriptionZh: "查看团队成员名单并阅读最新团队公告。",
    titleEn: "Team",
    titleZh: "团队",
    to: "/team",
  },
  {
    descriptionEn: "The meeting rooms you can book and how many each seats.",
    descriptionZh: "查看可预订的会议室及其容纳人数。",
    titleEn: "Rooms",
    titleZh: "会议室",
    to: "/rooms",
  },
  {
    descriptionEn: "Book a room for a meeting and keep track of your bookings.",
    descriptionZh: "预订会议室并随时管理您的日程安排。",
    titleEn: "Bookings",
    titleZh: "预订",
    to: "/bookings",
  },
  {
    descriptionEn: "Shared jobs, who has them and when they are due.",
    descriptionZh: "管理团队共享任务、负责人及截止日期。",
    titleEn: "Tasks",
    titleZh: "任务",
    to: "/tasks",
  },
  {
    descriptionEn:
      "Your bookings for the day and your open tasks in one place.",
    descriptionZh: "在一个页面集中查看您今日的会议预订与待办任务。",
    titleEn: "My day",
    titleZh: "今日概览",
    to: "/my-day",
  },
] as const;

function App() {
  const { t } = useI18n();

  return (
    <main className="page-wrap px-4 pt-14 pb-8">
      <section className="rise-in pt-6 pb-4 sm:pt-10">
        <p className="island-kicker mb-4">Teamdesk</p>
        <h1 className="display-title mb-5 max-w-3xl text-5xl text-foreground leading-[1.05] sm:text-6xl">
          {t(
            "Rooms, bookings and tasks for a small team.",
            "专为小团队打造的会议室、预订与任务协作空间。"
          )}
        </h1>
        <p className="mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {t(
            "One place to book a meeting room, share announcements and keep track of who is doing what.",
            "一站式预订会议室、发布团队公告，轻松掌握每个人的工作进展。"
          )}
        </p>
        <Button asChild>
          <Link to="/bookings">{t("Book a room", "预订会议室")}</Link>
        </Button>
      </section>

      <section className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {pages.map(
          ({ descriptionEn, descriptionZh, titleEn, titleZh, to }, index) => (
            <article
              className="rise-in border-border border-t pt-5"
              key={titleEn}
              style={{ animationDelay: `${index * 90 + 80}ms` }}
            >
              <h2 className="mb-2 font-heading text-2xl text-foreground leading-tight">
                <Link className="no-underline" to={to}>
                  {t(titleEn, titleZh)}
                </Link>
              </h2>
              <p className="m-0 text-muted-foreground text-sm">
                {t(descriptionEn, descriptionZh)}
              </p>
            </article>
          )
        )}
      </section>
    </main>
  );
}
