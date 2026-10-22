import { NOTE_TEXT_MAX_LENGTH } from "@repo/db/shared";
import {
  createFileRoute,
  type ErrorComponentProps,
  useRouter,
} from "@tanstack/react-router";
import { type ChangeEvent, type FormEvent, useCallback, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { getTrpc } from "#/integrations/trpc/client";
import { formatUtc } from "#/lib/datetime";
import { useI18n } from "#/lib/i18n";

export const Route = createFileRoute("/notes")({
  loader: () => getTrpc().notes.list.query(),
  component: NotesPage,
  errorComponent: NotesError,
});

function NotesPage() {
  const notes = Route.useLoaderData();
  const router = useRouter();
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleTextChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setText(event.target.value),
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSaving(true);
      setError(null);
      try {
        await getTrpc().notes.create.mutate({ text });
        setText("");
        await router.invalidate();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : t("Could not save note.", "无法保存笔记。")
        );
      } finally {
        setSaving(false);
      }
    },
    [router, t, text]
  );

  return (
    <main className="page-wrap px-4 py-12">
      <section className="max-w-3xl">
        <p className="island-kicker mb-3">Cloudflare D1</p>
        <h1 className="display-title mb-4 text-4xl text-foreground sm:text-5xl">
          {t("Notes", "随手笔记")}
        </h1>
        <p className="m-0 max-w-3xl text-base text-muted-foreground leading-8">
          {t(
            "A minimal round trip: a tRPC procedure reads and writes a notes table through @repo/services. Add a note and it lands in the D1 database bound as DB.",
            "最小化的全栈数据闭环：通过 tRPC 与 @repo/services 读写 notes 表。添加一条笔记即可实时存入绑定为 DB 的 D1 数据库。"
          )}
        </p>
      </section>

      <form className="island-shell mt-10 p-6 sm:p-8" onSubmit={handleSubmit}>
        <label className="island-kicker mb-3 block" htmlFor="note-text">
          {t("New note", "新建笔记")}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="note-text"
            maxLength={NOTE_TEXT_MAX_LENGTH}
            onChange={handleTextChange}
            placeholder={t("What's on your mind?", "记录点什么…")}
            required
            value={text}
          />
          <Button disabled={saving || text.trim().length === 0} type="submit">
            {saving ? t("Saving…", "保存中…") : t("Add note", "添加笔记")}
          </Button>
        </div>
        {error ? (
          <p className="mt-3 text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </form>

      <section className="mt-10">
        {notes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {t(
              "No notes yet. Add the first one above.",
              "暂无笔记，在上方添加第一条吧。"
            )}
          </p>
        ) : (
          <ul className="m-0 list-none space-y-4 p-0">
            {notes.map((note) => (
              <li className="border-border border-t pt-4" key={note.id}>
                <p className="m-0 text-foreground">{note.text}</p>
                <time
                  className="text-muted-foreground text-xs"
                  dateTime={note.createdAt}
                >
                  {formatUtc(note.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function NotesError({ error }: ErrorComponentProps) {
  const { t } = useI18n();
  const message = error instanceof Error ? error.message : String(error);
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell max-w-3xl p-6 sm:p-8">
        <p className="island-kicker mb-3">Cloudflare D1</p>
        <h1 className="display-title mb-4 text-3xl text-foreground">
          {t("Could not reach D1", "无法连接 D1 数据库")}
        </h1>
        <p className="m-0 text-muted-foreground text-sm leading-7">
          {t(
            "Locally this usually means the migrations have not been applied: bun run dev does that on start. On a deployed Worker, check that database_id in wrangler.jsonc names a real database and that wrangler d1 migrations apply DB --remote has been run.",
            "在本地环境中，这通常表示尚未应用数据库迁移（bun run dev 会在启动时自动执行）。在已部署的 Worker 上，请检查 wrangler.jsonc 中的 database_id 是否有效，并确认已运行 wrangler d1 migrations apply DB --remote。"
          )}
        </p>
        <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-3 text-xs">
          {message}
        </pre>
      </section>
    </main>
  );
}
