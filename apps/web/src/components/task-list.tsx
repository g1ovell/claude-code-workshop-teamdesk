import type { Member, Task } from "@repo/db/shared";
import { type ChangeEvent, type MouseEvent, useCallback } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "#/components/ui/native-select";
import { useI18n } from "#/lib/i18n";

interface TaskListProps {
  disabled: boolean;
  highlightDay?: string;
  members: readonly Member[];
  onAssign: (taskId: string, assigneeId: string | null) => void;
  onComplete: (taskId: string) => void;
  tasks: readonly Task[];
}

interface TaskListItemProps {
  disabled: boolean;
  highlightDay?: string;
  members: readonly Member[];
  onAssign: (taskId: string, assigneeId: string | null) => void;
  onComplete: (taskId: string) => void;
  task: Task;
}

function TaskListItem({
  disabled,
  highlightDay,
  members,
  onAssign,
  onComplete,
  task,
}: TaskListItemProps) {
  const { t } = useI18n();

  const handleAssign = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      onAssign(task.id, event.currentTarget.value || null);
    },
    [onAssign, task.id]
  );

  const handleComplete = useCallback(
    (_event: MouseEvent<HTMLButtonElement>) => {
      onComplete(task.id);
    },
    [onComplete, task.id]
  );

  const isOverdue = Boolean(
    highlightDay && !task.completedAt && task.dueOn && task.dueOn < highlightDay
  );
  const isDueToday = Boolean(
    highlightDay &&
      !task.completedAt &&
      task.dueOn &&
      task.dueOn === highlightDay
  );

  let itemClass =
    "flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between transition-colors";
  if (isOverdue) {
    itemClass =
      "flex flex-col gap-3 rounded-lg border-t border-destructive/40 bg-destructive/5 p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between dark:bg-destructive/10";
  } else if (isDueToday) {
    itemClass =
      "flex flex-col gap-3 rounded-lg border-t border-amber-500/40 bg-amber-500/5 p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between dark:bg-amber-950/20";
  }

  let titleClass = "m-0 text-foreground";
  if (task.completedAt) {
    titleClass = "m-0 text-muted-foreground line-through";
  } else if (isOverdue) {
    titleClass = "m-0 font-medium text-destructive dark:text-red-400";
  } else if (isDueToday) {
    titleClass = "m-0 font-medium text-amber-700 dark:text-amber-400";
  }

  return (
    <li className={itemClass}>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className={titleClass}>{task.title}</p>
          {isOverdue ? (
            <Badge
              className="px-1.5 py-0 font-semibold text-[10px]"
              variant="destructive"
            >
              {t("Overdue", "已逾期")}
            </Badge>
          ) : null}
          {isDueToday ? (
            <Badge className="bg-amber-600 px-1.5 py-0 font-semibold text-[10px] text-white hover:bg-amber-600 dark:bg-amber-500">
              {t("Due today", "今日到期")}
            </Badge>
          ) : null}
        </div>
        <p className="m-0 mt-0.5 text-muted-foreground text-xs">
          {task.dueOn
            ? t(`Due ${task.dueOn}`, `截止日期 ${task.dueOn}`)
            : t("No due date", "无截止日期")}
          {task.completedAt
            ? t(
                `, done ${task.completedAt.slice(0, 10)}`,
                `，完成于 ${task.completedAt.slice(0, 10)}`
              )
            : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <NativeSelect
          aria-label={`Assignee for ${task.title}`}
          data-task-id={task.id}
          disabled={disabled || task.completedAt !== null}
          onChange={handleAssign}
          size="sm"
          value={task.assigneeId ?? ""}
        >
          <NativeSelectOption value="">
            {t("Unassigned", "未分配")}
          </NativeSelectOption>
          {members.map((member) => (
            <NativeSelectOption key={member.id} value={member.id}>
              {member.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {task.completedAt ? null : (
          <Button
            disabled={disabled}
            onClick={handleComplete}
            size="sm"
            value={task.id}
            variant="outline"
          >
            {t("Complete", "完成")}
          </Button>
        )}
      </div>
    </li>
  );
}

export default function TaskList({
  disabled,
  highlightDay,
  members,
  onAssign,
  onComplete,
  tasks,
}: TaskListProps) {
  const { t } = useI18n();

  if (tasks.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {t("No tasks yet. Add the first one above.", "暂无任务。")}
      </p>
    );
  }
  return (
    <ul className="m-0 list-none space-y-4 p-0">
      {tasks.map((task) => (
        <TaskListItem
          disabled={disabled}
          highlightDay={highlightDay}
          key={task.id}
          members={members}
          onAssign={onAssign}
          onComplete={onComplete}
          task={task}
        />
      ))}
    </ul>
  );
}
