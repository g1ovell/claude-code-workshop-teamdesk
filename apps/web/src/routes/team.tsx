import {
  ANNOUNCEMENT_BODY_MAX_LENGTH,
  MEMBER_NAME_MAX_LENGTH,
  MEMBER_ROLES,
} from "@repo/db/shared";
import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useCallback, useMemo } from "react";
import AnnouncementList from "#/components/announcement-list";
import FormError from "#/components/form-error";
import MemberPicker from "#/components/member-picker";
import PageError from "#/components/page-error";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "#/components/ui/native-select";
import { Textarea } from "#/components/ui/textarea";
import { useActingMember } from "#/hooks/use-acting-member";
import { useAction } from "#/hooks/use-action";
import { getTrpc } from "#/integrations/trpc/client";
import { formatUtc } from "#/lib/datetime";
import { useI18n } from "#/lib/i18n";

export const Route = createFileRoute("/team")({
  loader: async () => {
    const trpc = getTrpc();
    const [members, announcements] = await Promise.all([
      trpc.members.list.query(),
      trpc.announcements.latest.query(),
    ]);
    return { announcements, members };
  },
  component: TeamPage,
  errorComponent: PageError,
});

function TeamPage() {
  const { announcements, members } = Route.useLoaderData();
  const { actingMember, setActingMemberId } = useActingMember(members);
  const addMember = useAction();
  const postAnnouncement = useAction();
  const { t } = useI18n();
  const actorId = actingMember?.id ?? "";

  const memberNames = useMemo(
    () => new Map(members.map((member) => [member.id, member.name])),
    [members]
  );

  const handleAddMember = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const ok = await addMember.run(() =>
        getTrpc().members.add.mutate({
          actorId,
          member: {
            email: String(data.get("email") ?? ""),
            name: String(data.get("name") ?? ""),
            role:
              MEMBER_ROLES.find((role) => role === data.get("role")) ??
              "member",
          },
        })
      );
      if (ok) {
        form.reset();
      }
    },
    [actorId, addMember.run]
  );

  const handlePost = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const ok = await postAnnouncement.run(() =>
        getTrpc().announcements.post.mutate({
          actorId,
          announcement: { body: String(data.get("body") ?? "") },
        })
      );
      if (ok) {
        form.reset();
      }
    },
    [actorId, postAnnouncement.run]
  );

  return (
    <main className="page-wrap px-4 py-12">
      <section className="flex max-w-3xl flex-col gap-4">
        <p className="island-kicker m-0">Teamdesk</p>
        <h1 className="display-title m-0 text-4xl text-foreground sm:text-5xl">
          {t("Team", "团队")}
        </h1>
        <p className="m-0 text-base text-muted-foreground leading-8">
          {t(
            "Who is on the team and what they need to know.",
            "团队成员名单与重要通知公告。"
          )}
        </p>
        <MemberPicker
          members={members}
          onChange={setActingMemberId}
          value={actingMember?.id}
        />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-2xl text-foreground">
          {t("Members", "成员列表")}
        </h2>
        <ul className="m-0 list-none space-y-4 p-0">
          {members.map((member) => (
            <li className="border-border border-t pt-4" key={member.id}>
              <p className="m-0 font-semibold text-foreground">{member.name}</p>
              <p className="m-0 text-muted-foreground text-sm">
                {member.email},{" "}
                {t(member.role, member.role === "admin" ? "管理员" : "成员")},{" "}
                {t(
                  `joined ${formatUtc(member.joinedAt).slice(0, 10)}`,
                  `加入于 ${formatUtc(member.joinedAt).slice(0, 10)}`
                )}
              </p>
            </li>
          ))}
        </ul>

        {actingMember?.role === "admin" ? (
          <form
            className="island-shell mt-6 p-6 sm:p-8"
            onSubmit={handleAddMember}
          >
            <p className="island-kicker mb-3">
              {t("Add member", "添加新成员")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                aria-label="Name"
                maxLength={MEMBER_NAME_MAX_LENGTH}
                name="name"
                placeholder={t("Name", "姓名")}
                required
              />
              <Input
                aria-label="Email"
                name="email"
                placeholder={t("Email", "邮箱")}
                required
                type="email"
              />
              <NativeSelect aria-label="Role" defaultValue="member" name="role">
                {MEMBER_ROLES.map((role) => (
                  <NativeSelectOption key={role} value={role}>
                    {t(role, role === "admin" ? "管理员" : "成员")}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <Button disabled={addMember.pending} type="submit">
                {addMember.pending
                  ? t("Adding…", "添加中…")
                  : t("Add member", "添加成员")}
              </Button>
            </div>
            <FormError message={addMember.error} />
          </form>
        ) : null}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-2xl text-foreground">
          {t("Announcements", "团队公告")}
        </h2>
        <form className="island-shell mb-6 p-6 sm:p-8" onSubmit={handlePost}>
          <label
            className="island-kicker mb-3 block"
            htmlFor="announcement-body"
          >
            {t("Post an announcement", "发布新公告")}
          </label>
          <Textarea
            id="announcement-body"
            maxLength={ANNOUNCEMENT_BODY_MAX_LENGTH}
            name="body"
            required
          />
          <Button
            className="mt-3"
            disabled={postAnnouncement.pending}
            type="submit"
          >
            {postAnnouncement.pending
              ? t("Posting…", "发布中…")
              : t("Post", "发布")}
          </Button>
          <FormError message={postAnnouncement.error} />
        </form>
        <AnnouncementList
          announcements={announcements}
          memberNames={memberNames}
        />
      </section>
    </main>
  );
}
