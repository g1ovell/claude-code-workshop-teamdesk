import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "#/lib/i18n";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const { t } = useI18n();
  return (
    <main className="page-wrap px-4 py-12">
      <section className="max-w-3xl">
        <p className="island-kicker mb-3">{t("About", "关于")}</p>
        <h1 className="display-title mb-4 text-4xl text-foreground sm:text-5xl">
          {t("A small starter with room to grow.", "精简起点，无限扩展空间。")}
        </h1>
        <p className="m-0 max-w-3xl text-base text-muted-foreground leading-8">
          {t(
            "TanStack Start gives you type-safe routing, server functions, and modern SSR defaults. Use this as a clean foundation, then layer in your own routes, styling, and add-ons.",
            "TanStack Start 提供类型安全的路由、服务端函数以及现代化的 SSR 默认配置。以此为简洁基座，轻松扩展您自己的路由、样式与功能模块。"
          )}
        </p>
      </section>
    </main>
  );
}
