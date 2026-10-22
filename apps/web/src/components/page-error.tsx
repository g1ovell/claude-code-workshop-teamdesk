import type { ErrorComponentProps } from "@tanstack/react-router";
import { useI18n } from "#/lib/i18n";

/** Route error fallback for the Teamdesk pages. */
export default function PageError({ error }: ErrorComponentProps) {
  const { t } = useI18n();
  const message = error instanceof Error ? error.message : String(error);
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell max-w-3xl p-6 sm:p-8">
        <p className="island-kicker mb-3">Teamdesk</p>
        <h1 className="display-title mb-4 text-3xl text-foreground">
          {t("Could not load this page", "无法加载此页面")}
        </h1>
        <p className="m-0 text-muted-foreground text-sm leading-7">
          {t(
            "Locally this usually means the migrations or seed data have not been applied: bun run dev does both on start.",
            "在本地环境中，这通常表示尚未应用迁移或初始数据（bun run dev 会在启动时自动执行这两步）。"
          )}
        </p>
        <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-3 text-xs">
          {message}
        </pre>
      </section>
    </main>
  );
}
