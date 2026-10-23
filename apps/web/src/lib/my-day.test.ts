import { describe, expect, test } from "bun:test";

interface TaskDueStatus {
  isDueToday: boolean;
  isOverdue: boolean;
}

function evaluateTaskDue(
  dueOn: string | null,
  completedAt: string | null,
  selectedDay: string
): TaskDueStatus {
  if (completedAt !== null) {
    return { isDueToday: false, isOverdue: false };
  }
  if (!dueOn) {
    return { isDueToday: false, isOverdue: false };
  }
  return {
    isDueToday: dueOn === selectedDay,
    isOverdue: dueOn < selectedDay,
  };
}

describe("My Day task due highlighting rules", () => {
  const selectedDay = "2026-10-23";

  test("early (dueOn < day) is overdue", () => {
    const status = evaluateTaskDue("2026-10-20", null, selectedDay);
    expect(status.isOverdue).toBe(true);
    expect(status.isDueToday).toBe(false);
  });

  test("equal (dueOn === day) is due today", () => {
    const status = evaluateTaskDue("2026-10-23", null, selectedDay);
    expect(status.isOverdue).toBe(false);
    expect(status.isDueToday).toBe(true);
  });

  test("late (dueOn > day) is not highlighted", () => {
    const status = evaluateTaskDue("2026-10-25", null, selectedDay);
    expect(status.isOverdue).toBe(false);
    expect(status.isDueToday).toBe(false);
  });

  test("null due date is not highlighted", () => {
    const status = evaluateTaskDue(null, null, selectedDay);
    expect(status.isOverdue).toBe(false);
    expect(status.isDueToday).toBe(false);
  });

  test("completed task is never highlighted even if dueOn <= day", () => {
    const status = evaluateTaskDue(
      "2026-10-20",
      "2026-10-22T10:00:00.000Z",
      selectedDay
    );
    expect(status.isOverdue).toBe(false);
    expect(status.isDueToday).toBe(false);
  });
});
