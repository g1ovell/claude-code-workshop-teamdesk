import { Link } from "@tanstack/react-router";
import { useI18n } from "#/lib/i18n";
import LanguageToggle from "./language-toggle";
import ThemeToggle from "./theme-toggle";

export default function Header() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-border border-b bg-background/90 px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base">
          <Link
            className="inline-flex items-center gap-2.5 font-heading text-foreground text-xl no-underline"
            to="/"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            Teamdesk
          </Link>
        </h2>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 font-semibold text-sm sm:order-none sm:w-auto sm:pb-0">
          <Link
            activeProps={{ className: "nav-link is-active" }}
            className="nav-link"
            to="/"
          >
            {t("Home", "首页")}
          </Link>
          <Link
            activeProps={{ className: "nav-link is-active" }}
            className="nav-link"
            to="/about"
          >
            {t("About", "关于")}
          </Link>
          <Link
            activeProps={{ className: "nav-link is-active" }}
            className="nav-link"
            to="/notes"
          >
            {t("Notes", "笔记")}
          </Link>
          <Link
            activeProps={{ className: "nav-link is-active" }}
            className="nav-link"
            to="/team"
          >
            {t("Team", "团队")}
          </Link>
          <Link
            activeProps={{ className: "nav-link is-active" }}
            className="nav-link"
            to="/rooms"
          >
            {t("Rooms", "会议室")}
          </Link>
          <Link
            activeProps={{ className: "nav-link is-active" }}
            className="nav-link"
            to="/bookings"
          >
            {t("Bookings", "预订")}
          </Link>
          <Link
            activeProps={{ className: "nav-link is-active" }}
            className="nav-link"
            to="/tasks"
          >
            {t("Tasks", "任务")}
          </Link>
          <Link
            activeProps={{ className: "nav-link is-active" }}
            className="nav-link"
            to="/my-day"
          >
            {t("My day", "今日概览")}
          </Link>
          <a
            className="nav-link"
            href="https://tanstack.com/start/latest/docs/framework/react/overview"
            rel="noreferrer"
            target="_blank"
          >
            {t("Docs", "文档")}
          </a>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
