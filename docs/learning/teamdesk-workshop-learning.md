# TeamDesk 全栈开发与 AI Agent 工程实验讲义
**(Sydney Claude Code Workshop · Google Antigravity 深度学习版)**

> **文档元数据与可追溯基线（Traceability Baseline）**
> - **工作坊日期**：2026-10-23 (Australia/Sydney)
> - **上游官方仓库 (`upstream`)**：`https://github.com/codewithpassion/claude-code-workshop-teamdesk` (基线 Commit: `6bd668bcc10084f2374cd83992d010e89498eb01`)
> - **个人 Fork 仓库 (`origin`)**：`https://github.com/g1ovell/claude-code-workshop-teamdesk`
> - **分析基准 Git HEAD Commit**：`4cfe1e935a4943962ea04c887772a970e21574b6`
> - **线上生产环境地址**：`https://teamdesk.wuwukai0707.workers.dev`
> - **面向读者背景**：具备 C/C++、数据结构、基础 Python 与软件工程基础，希望从底层原理理解现代 TypeScript 全栈架构（TanStack Start + Hono + tRPC + Drizzle + Cloudflare Workers/D1）以及 AI Agent 工程化开发方法论（Spec → Plan → Build）。

---

## 目录（Table of Contents）

1. [第一章：Workshop 整体目标与完整教学流程](#第一章workshop-整体目标与完整教学流程)
2. [第二章：TeamDesk 架构入门（给 C++/Python 程序员的现代全栈导论）](#第二章teamdesk-架构入门给-cpython-程序员的现代全栈导论)
3. [第三章：Spec → Plan → Build 全链路拆解（以 My Day 与中英双语功能为例）](#第三章spec--plan--build-全链路拆解以-my-day-与中英双语功能为例)
4. [第四章：测试为什么这样写？（从内存数据库到业务边界验证）](#第四章测试为什么这样写从内存数据库到业务边界验证)
5. [第五章：Cloudflare 边缘计算与 D1 部署原理](#第五章cloudflare-边缘计算与-d1-部署原理)
6. [第六章：AI Agent 工程方法论（规则、上下文、子智能体与权限边界）](#第六章ai-agent-工程方法论规则上下文子智能体与权限边界)
7. [第七章：工程方法迁移：从 TeamDesk 到 AIRI + HAST 桌宠系统](#第七章工程方法迁移从-teamdesk-到-airi--hast-桌宠系统)
8. [第八章：互动学习、自测题（12 题）与 ChatGPT 深度研讨指南](#第八章互动学习自测题12-题与-chatgpt-深度研讨指南)

---

## 第一章：Workshop 整体目标与完整教学流程

本工作坊的核心目标**不是教你手写 HTML/CSS**，而是训练一种现代软件工程的核心范式：**如何将 AI Coding Agent（如 Claude Code 或 Google Antigravity）从“聊天问答玩具”变成“受控、可验证、遵循架构边界的工程协作者”**。

主办方在 `Claude Code Workshop Setup.html` 中设计了 9 个循序渐进的步骤。下表严格区分了**官方教学目标**与我们在 **Google Antigravity 中的实际执行结果**：

| 步骤与时间 | 1. 讲师希望学生学会什么？ | 2. 实际需要执行什么操作？ | 3. 为什么要安排这一步？ | 4. 如何判断完成？（验收标准） | 5. 当前项目实际完成状态（含官方 vs Antigravity 对比） |
| :--- | :--- | :--- | :--- | :--- | :---
| **1. Before you start (09:05)** | 理解模型推理档位（Effort）与执行权限模式（Auto/Plan）对延迟和自主性的影响。 | 官方：运行 `/model` 切至 Sonnet 5.5 (Medium)，按 `Shift+Tab` 切至 `auto`。 | 太高的推理档位在简单任务上浪费时间；太低的档位在架构设计上容易出错。 | 模型配置生效，Agent 能在工作区内自主执行读写和终端命令。 | **已完成**。在 Antigravity 中切换为 `Gemini 4 Argon (Medium)`，具备完整的终端、文件编辑与子智能体工具。 |
| **2. Run it locally (09:15)** | 掌握接手陌生代码库的第一步：先跑通本地开发服务器，并让 Agent 追踪核心数据流向。 | 安装依赖 `bun install`，跑通测试 `bun test`，启动 `bun run dev`，并询问 Booking 从页面到数据库的流转链路。 | 在写任何新代码前，必须确保基线环境健康（Green Build）并理解现有分层架构，避免写出破坏架构的“面条代码”。 | `http://localhost:3000` 可访问；`bun test` 55 项通过；能用真实文件路径解释 Booking 入库全过程。 | **已完成**。本地服务运行于 `localhost:3000`，通过本地 tRPC 实测写入 `Workshop Test Booking` 并用 `wrangler d1 execute DB --local` 查表核实。 |
| **3. Deploy to Cloudflare (09:25)** | 理解本地开发环境（Miniflare 模拟器）与真实云端生产环境（Cloudflare Workers + 远程 D1）的差异与绑定机制。 | `bunx wrangler login` → `wrangler d1 create teamdesk` → 更新 `apps/web/wrangler.jsonc` 的 `database_id` → `db:apply:remote` & `db:seed:remote` → `bun run deploy`。 | 尽早打通 CI/CD 部署管道（Shift-Left Deployment）。如果等到最后才部署，往往会因云端绑定、子域名或环境变量问题卡死。 | 拿到真实的 `*.workers.dev` 线上地址，且线上页面能读写远程 D1 数据库。 | **已完成**。远程 D1 ID 为 `c4b1f87f-c645-4bbc-b527-77cedbc4d3e0`；通过 API 解决了首次注册 `wuwukai0707.workers.dev` 子域名问题；线上实测写入 `Workshop Cloud Booking`。 |
| **4. CLAUDE.md (10:05)** | 学会编写高信噪比的项目级系统提示词（Project Rules），只记录“AI 不看就会犯错的隐性约定”。 | 官方：`/init` 生成初始文档后，精简到 60 行以内，附带每条规则的**原因（Why）**，并提交 Git Commit。 | 如果规则文档长达几百行且充斥着“这是一个 React 项目”等废话，不仅浪费上下文窗口（Context Window），还会稀释真正重要的架构红线。 | 根目录存在 `<60 行` 的 `CLAUDE.md`，每条规则包含原因，且已与 `wrangler.jsonc` 一起 Commit。 | **已完成**（Commit `755814b`）。生成了 40 行的 `CLAUDE.md`，涵盖前后端导入边界、禁止 Barrel 文件、SSR `ctx.env` 陷阱、ID 类型转换等核心约束。 |
| **5. Spec (10:15)** | 掌握**需求工程（Requirements Engineering）**：通过单步提问访谈（Interview）消除需求歧义，将模糊想法转化为结构化规格说明。 | 选定一个 20 分钟体量的新功能（如 `My day`），让 AI 每次只问 1 个问题，对齐后生成 `docs/specs/my-day.md`。 | 人类说的“加个今日概览页”极其模糊（放哪？用什么时区？能不能直接取消预订？）。直接写代码必返工；先写 Spec 成本最低。 | `docs/specs/my-day.md` 已生成，明确包含数据层、服务层、路由层、UI 交互与测试要求。 | **已完成**。通过 Antigravity 的交互式提问工具完成了 3 轮访谈，产出了 `docs/specs/my-day.md`。 |
| **6. Plan (10:35)** | 掌握**架构分解（Architectural Decomposition）**：将需求规格拆解为按依赖顺序排列、可独立验证的实施阶段（Phases）。 | 读取 `@docs/specs/my-day.md`，拆解为最多 3 个阶段的实施计划并审阅确认。 | 复杂任务一次性改十几个文件极易引发连锁报错。自底向上（DB → Service → API → UI）分阶段推进，每步都有编译器和测试兜底。 | `docs/specs/my-day-plan.md` 已生成，包含清晰的 Phase 1、Phase 2、Phase 3 目标文件与验证方式。 | **已完成**。产出了 `docs/specs/my-day-plan.md`，分为 Phase 1（DB/Service + 测试）、Phase 2（tRPC 路由）、Phase 3（`/my-day` 页面与导航）。 |
| **7. Build (10:50)** | 体验基于 Spec 和 Plan 的自主构建闭环（测试驱动 + 阶段性 Git Commit）。 | 官方：使用 `/goal` 配合子智能体按计划实现，在每个阶段边界提交 Commit，直到 `bun test` 全绿。 | 当 Spec 和 Plan 足够清晰时，编码实现就是确定性的工程执行。按阶段 Commit 提供了随时回滚的安全检查点（Checkpoints）。 | 3 个阶段代码全部落地，`bun test`（57 pass）与 `bun run check` 零错误，每个阶段有独立 Git Commit。 | **已完成**。分别提交了 Phase 1 (`7daeeb2`)、Phase 2 (`ebe1473`)、Phase 3 (`17106a4`)，并额外实现了全站中英文双语切换 (`4cfe1e9`)。 |
| **8. Ship it (11:10)** | 完成代码复盘（Code Review）、远程仓库同步（GitHub Fork Push）与生产环境发布。 | 总结实际实现与原计划的差异 → 本地预览 → `git push` 到个人 Fork → `bun run deploy` 更新线上 Worker。 | 工程闭环的标志不是“我电脑上能跑”，而是代码进入版本库、生产环境更新且经过验证。 | `g1ovell/claude-code-workshop-teamdesk` 仓库同步最新代码；`https://teamdesk.wuwukai0707.workers.dev/my-day` 线上可用。 | **已完成**。已通过 `gh` 完成 Fork、推送全部 5 个新 Commit，并将包含 `/my-day` 和双语切换的最新版部署上线（Version ID `c938d8bd`）。 |
| **9. Try next (课后扩展)** | 了解 Agent 进阶定制能力：生命周期钩子（Hooks）、外部系统集成（MCP）与权限控制。 | 课后在自己的仓库尝试配置每次编辑后自动运行 `bun run check` 的 Hook 及 Issue Tracker 连接。 | 将人工监督进一步自动化，让代码格式化、类型检查成为每次文件修改后的强制门禁（Quality Gate）。 | 理解 Hooks 和 MCP 的配置机制与适用场景。 | **已整理至本教材第六章与第七章**，供课后深入学习与迁移至桌宠项目。 |

---

## 第二章：TeamDesk 架构入门（给 C++/Python 程序员的现代全栈导论）

如果你习惯了写 C/C++ 或 Python 程序，第一次看到现代 Web 全栈项目往往会觉得眼花缭乱：为什么有这么多配置文件？为什么一个查询要跨 4 个文件夹？

让我们用你熟悉的 **C/C++ 编译链接模型与操作系统分层** 来建立直观映射。

### 2.1 为什么用 Monorepo 拆成 3 个包（`apps/web`、`packages/services`、`packages/db`）？

打开根目录的 `package.json`（第 6–9 行）：
```json
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
```
这就像一个大型 C++ 工程的顶层 `CMakeLists.txt`，里面管理了两个静态/动态库（`packages/db` 和 `packages/services`）以及一个最终的可执行程序（`apps/web`）：

```mermaid
flowchart TD
    subgraph Client["浏览器端 (Browser Runtime)"]
        UI["React 路由与组件\napps/web/src/routes/*.tsx\napps/web/src/components/**"]
        Shared["共享类型与常量 (纯头文件)\n@repo/db/shared\npackages/db/src/shared.ts"]
    end

    subgraph Worker["服务端 (Cloudflare Worker Runtime)"]
        Hono["Hono HTTP 入口与 CSRF 防护\napps/web/src/server.ts"]
        TRPC["tRPC 路由层 (RPC 胶水层)\napps/web/src/server/trpc/routers/*.ts"]
        Services["业务逻辑与 Zod 校验层\n@repo/services/*\npackages/services/src/*.ts"]
        DB["数据访问与 Drizzle ORM 层\n@repo/db/*\npackages/db/src/*.ts"]
        D1[("SQLite / Cloudflare D1\nenv.DB")]
    end

    UI -. "仅允许导入类型与常量" .-> Shared
    UI == "getTrpc().bookings.create.mutate()\n(HTTP JSON POST / SSR 直连)" ==> Hono
    Hono --> TRPC
    TRPC --> Services
    Services --> DB
    DB --> D1
    Services -. "共享类型" .-> Shared
    DB -. "共享类型" .-> Shared
```

#### 为什么要拆得这么严格？（核心设计原因）
1. **前后端运行环境隔离（防止服务端代码泄漏到浏览器）**：
   - 在 Web 开发中，React 组件会被打包工具（Vite）编译成发送到用户浏览器里运行的 JavaScript；而数据库代码运行在 Cloudflare 服务器上。
   - 浏览器里**没有** SQLite 驱动，也不应该知道数据库表结构细节。
   - 因此，`@repo/db` 专门分离出了一个纯类型和常量文件 `packages/db/src/shared.ts`（相当于 C++ 里的纯公共头文件 `shared.h`），里面只有 `export interface Booking` 和 `export const BOOKING_MAX_MINUTES = 240`。**浏览器代码只允许 `import ... from "@repo/db/shared"`**。一旦浏览器组件不小心 `import ... from "@repo/db"`，就会把 Drizzle ORM 打包进前端，导致构建失败或包体积暴增。
2. **让业务逻辑层（`@repo/services`）脱离 Web 框架独立可测**：
   - 注意 `packages/services` 的 `package.json` 里**完全没有依赖 Hono、tRPC、React 或 Cloudflare**！
   - 它只接收一个抽象的 `Database` 对象（相当于 C++ 中的抽象基类指针 `IDatabase*`）。这意味着无论是在 Cloudflare Worker 生产环境，还是在本地命令行运行 `bun test`（使用内存 SQLite），业务规则代码完全通用，不需要启动任何 HTTP 服务器就能在 200 毫秒内跑完 57 个测试！
3. **为什么禁止 Barrel Files（桶文件 `index.ts` 重导出）？**
   - 很多项目喜欢在一个 `index.ts` 里把所有模块 `export *` 出来。但在全栈项目中，如果 `@repo/db/index.ts` 同时导出了 `testing.ts`（依赖 `bun:sqlite`），那么当 Cloudflare Worker 导入 `@repo/db` 时，就会顺带把 Worker 根本不支持的 `bun:sqlite` 一起引入而直接崩溃。因此本项目强制每个子模块独立导出（`@repo/db/bookings`、`@repo/db/testing`）。

---

### 2.2 技术栈角色速查表（C++/Python 类比）

| 技术名称 | 在 TeamDesk 中的角色 | C/C++ 或 Python 类比 | 所在核心文件 |
| :--- | :--- | :--- | :--- |
| **TypeScript** | 带静态类型系统的 JavaScript | 从动态类型的 Python 加上了类似 C++ 的编译期类型检查（`tsc --noEmit`） | 全仓库 `.ts` / `.tsx` |
| **Bun** | 极速 JS/TS 运行时、包管理器、测试运行器 | 把 `python` 解释器 + `pip` + `pytest` 三合一，底层用 Zig 编写，启动极快 | 命令行 `bun install`, `bun test` |
| **React** | 声明式 UI 组件库（通过状态 `useState` 驱动 DOM 更新） | 类似于状态驱动的 Qt / Dear ImGui：`UI = f(state)` | `apps/web/src/components/**` |
| **TanStack Start & Router** | 全栈 React 框架，负责文件路由（File-based Routing）与服务端渲染（SSR） | 根据 `src/routes/` 下的文件名自动生成路由表，并在服务端预渲染首屏 HTML | `apps/web/src/routes/*.tsx` |
| **Hono** | 跑在 Cloudflare Worker 上的超轻量 HTTP 服务器框架 | Python 的 `FastAPI` / `Flask` 或 C++ 的 `Crow` / `cpp-httplib` | `apps/web/src/server.ts` |
| **tRPC** | 端到端类型安全的远程过程调用（RPC）框架 | 无需手写 `.proto` 文件的 `gRPC`！后端改了函数签名，前端编译器立刻报错 | `apps/web/src/server/trpc/**` |
| **Zod** | 运行时数据校验与解析库（Schema Validation） | Python 的 `Pydantic`（由于 TS 类型在编译后会擦除，网络请求必须在运行时用 Zod 校验） | `packages/services/src/*.ts` |
| **Drizzle ORM** | 轻量级、类型安全的 SQL 构建器与 ORM | Python 的 `SQLAlchemy Core` 或 C++ 的 `sqlpp11`（写法几乎和原生 SQL 一一对应） | `packages/db/src/schema.ts` |
| **Cloudflare Workers & D1** | 无服务器边缘计算运行时（Workers）与边缘 Serverless SQLite 数据库（D1） | 在全球边缘节点（如悉尼 SYD 机房）按需毫秒级启动的轻量沙箱进程 + 云端 SQLite | `apps/web/wrangler.jsonc` |

---

### 2.3 本地 D1 与远程 Cloudflare D1 有什么区别？

在 `packages/db/src/schema.ts`（第 18 行）中，你会看到这行精妙的类型定义：
```ts
export type Database = BaseSQLiteDatabase<"sync" | "async", unknown>;
```
这一个类型同时兼容了**三种**数据库实例：
1. **单元测试环境（`bun test`）**：由 `packages/db/src/testing.ts` 中的 `new Sqlite(":memory:")`（`bun:sqlite`）创建，完全在**内存**中同步运行，测试结束即销毁，耗时仅几毫秒。
2. **本地开发环境（`bun run dev`）**：由 Wrangler 内置的 Miniflare 模拟器在本地磁盘文件夹 `apps/web/.wrangler/state/v3/d1` 下创建的本地 SQLite 文件，不需要联网即可开发。
3. **云端生产环境（Cloudflare D1）**：部署在 Cloudflare 边缘网络（我们的实例在 `OC / SYD` 悉尼数据中心，ID 为 `c4b1f87f-c645-4bbc-b527-77cedbc4d3e0`）上的分布式 SQLite 服务，通过 Worker 的 `env.DB` 绑定进行异步访问。

因为 JavaScript 的 `await` 关键字既可以等待异步 Promise（D1），也可以直接解包同步返回值（`bun:sqlite`），所以 `@repo/db` 和 `@repo/services` 里的所有函数只需写成 `async/await`，就能**一套代码无缝跑在内存、本地磁盘和全球云端**！

---

### 2.4 实战源码追踪：一条会议室预订（Booking）是如何从点击按钮到写入数据库的？

下面我们追踪用户在 `/bookings` 页面填写表单并点击 **“Book（立即预订）”** 按钮后，代码执行的**真实调用栈（Call Stack）**。

#### 第 1 步：前端表单收集数据并转换为 UTC ISO 时间
- **文件**：`apps/web/src/components/bookings/BookingForm.tsx`（第 31–47 行）
- **函数**：`handleSubmit`
```tsx
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const ok = await onSubmit({
        attendees: Number(data.get("attendees")),
        endsAt: isoFromDayAndTime(day, String(data.get("endsAt"))),
        startsAt: isoFromDayAndTime(day, String(data.get("startsAt"))),
        title: String(data.get("title") ?? ""),
      });
      if (ok) {
        form.reset();
      }
    },
    [day, onSubmit]
  );
```
- **关键细节**：HTML `<input type="time">` 给出的只是 `"09:00"` 这样的字符串。`isoFromDayAndTime("2026-10-23", "09:00")`（位于 `apps/web/src/lib/datetime.ts`）将其拼接为标准的 UTC ISO 8601 字符串 `"2026-10-23T09:00:00.000Z"`。

#### 第 2 步：路由页面附加 `actorId` 和 `roomId`，发起 tRPC Mutation
- **文件**：`apps/web/src/routes/bookings.tsx`（第 114–131 行）
- **函数**：`handleCreate`
```tsx
  const handleCreate = useCallback(
    async (draft: BookingDraft) => {
      if (!room) {
        return false;
      }
      const ok = await createBooking.run(() =>
        getTrpc().bookings.create.mutate({
          actorId,
          booking: { ...draft, roomId: room.id },
        })
      );
      if (ok) {
        await loadUpcoming();
      }
      return ok;
    },
    [actorId, createBooking.run, loadUpcoming, room]
  );
```
- **为什么传 `actorId`？** 本项目目前没有登录认证系统（`ctx.userId` 恒为 `null`）。页面顶部的 `<MemberPicker>` 组件把当前选中的成员 ID 保存在浏览器的 `localStorage` 中（见 `apps/web/src/hooks/use-acting-member.ts`），每次修改数据时作为 `actorId` 显式传给后端。
- **`getTrpc()` 做了什么？**（见 `apps/web/src/integrations/trpc/client.ts` 第 19–34 行）：
  - 在浏览器端点击按钮时，它使用 `httpBatchLink({ url: "/api/trpc" })`，向后端发起 `POST /api/trpc/bookings.create` HTTP JSON 请求。
  - 而在页面首次打开的服务端渲染（SSR `loader`）阶段，它使用 `unstable_localLink` 直接在同一个 Worker 进程内调用函数，省去了一次无意义的网络回环请求！

#### 第 3 步：Worker 入口拦截 CSRF 并构建请求上下文（Context）
- **文件 1**：`apps/web/src/server.ts`（第 18–33 行）
  - Hono 先通过 `app.use("/api/trpc/*", csrf())` 校验请求头（防止跨站请求伪造），然后交给 `trpcServer`。
- **文件 2**：`apps/web/src/server/trpc/context.ts`（第 37–45 行）
```ts
const createContext = (bindings: Env, userId: string | null): Context => ({
  services: createServices(drizzle(bindings.DB)),
  userId,
});
```
  - 这里是**全项目唯一读取 `env.DB` 的地方**！它用 `drizzle(bindings.DB)` 包装 D1 数据库绑定，并实例化所有 Service 挂载到 `ctx.services` 上。

#### 第 4 步：tRPC 路由层校验外层结构并转发给 Service
- **文件**：`apps/web/src/server/trpc/routers/bookings.ts`（第 14–18 行）
```ts
  create: publicProcedure
    .input(z.object({ actorId: z.string(), booking: createBookingInput }))
    .mutation(({ ctx, input }) =>
      ctx.services.bookings.create(input.actorId, input.booking)
    ),
```
- 注意路由层极其轻薄（Thin Router）：它只做参数接收和转发，不包含任何 `if/else` 业务逻辑。

#### 第 5 步：Service 层执行 6 道核心业务防线
- **文件**：`packages/services/src/bookings.ts`（第 134–188 行）
- **函数**：`createBookingsService(db).create(actorId, input)`
- 让我们看它依次执行的 **6 道防线**：
  1. **身份存在性检查（第 135 行）**：`await requireMember(db, actorId)` —— 如果传入的 `actorId` 在 `members` 表中不存在，直接抛出 `NotFoundError`（映射为 HTTP 404）。
  2. **Zod 格式与时长检查（第 136–139 行）**：
     - `createBookingInput.parse(input)` 校验标题非空且 `<= 120` 字符、人数 `>= 1`、时间符合 ISO 格式。
     - `checkSlot(startsAt, endsAt)`（第 79–91 行）计算分钟差，确保时长在 `[15, 240]` 分钟之间，否则抛出 `ValidationError`（HTTP 400）。
  3. **会议室状态与容量检查（第 141–149 行）**：
     - `getRoom(db, data.roomId)` 检查会议室是否存在且未归档（`!room.archived`）。
     - 若 `data.attendees > room.capacity`，抛出 `ValidationError("Harbour holds at most 10 people.")`。
  4. **时间段重叠冲突检查（第 151–160 行）**：
     - 调用 `findOverlappingBookings(db, { roomId, startsAt, endsAt })`。
     - 若返回非空数组，抛出 `ConflictError`（HTTP 409）。
  5. **每人每日预订上限检查（第 162–167 行）**：
     - 调用 `countBookingsOnDay(db, actorId, startsAt)` 统计该成员在当天 UTC `[00:00, 24:00)` 内已有的活跃预订数。若 `>= 3`（`MAX_BOOKINGS_PER_MEMBER_PER_DAY`），抛出 `ConflictError`。
  6. **数据库写入与并发唯一索引兜底（第 171–187 行）**：
     - 调用 `insertBooking(db, ...)`。如果两个请求在同一毫秒绕过了第 4 步的 SELECT 检查同时插入，SQLite 底层的部分唯一索引 `bookings_room_start_active` 会触发 `UNIQUE constraint failed`，被 `isUniqueViolation(error)` 捕获并转化为友好的 `ConflictError`！

#### 第 6 步：DB 层执行 Drizzle SQL `INSERT ... RETURNING *`
- **文件**：`packages/db/src/bookings.ts`（第 123–147 行）
- **函数**：`insertBooking`
```ts
export async function insertBooking(
  db: Database,
  input: {
    attendees: number;
    endsAt: string;
    memberId: string;
    roomId: string;
    startsAt: string;
    title: string;
  }
): Promise<Booking> {
  const [row] = await db
    .insert(bookings)
    .values({
      ...input,
      createdAt: new Date().toISOString(),
      memberId: Number(input.memberId),
      roomId: Number(input.roomId),
    })
    .returning();
  if (!row) {
    throw new Error("Booking was inserted but could not be read back.");
  }
  return toBooking(row);
}
```
- **为什么这里要把 `memberId` 和 `roomId` 用 `Number(...)` 转换，返回时又在 `toBooking(row)` 里用 `String(row.id)` 转回字符串？**
  - 在 SQLite 内部（`packages/db/src/schema.ts` 第 59–65 行），主键和外键使用 `integer` 存储与索引效率最高。
  - 但在前端 URL 查询参数（如 `?roomId=1`）、HTML `<select value="1">` 和 JSON 传输中，统一使用 `string` 类型最不容易出现类型隐式转换 Bug。因此 `@repo/db` 在边界处统一完成了 `string <-> number` 的封装转换！

---

## 第三章：Spec → Plan → Build 全链路拆解（以 My Day 与中英双语功能为例）

本章是整份讲义的核心。我们将彻底剖析：**一个新功能是如何从一句话点子，变成严谨的 Spec、拆解为 3 阶段 Plan，并最终转化为高质量代码的。**

---

### 3.1 A. Spec：需求如何形成？（读取 `docs/specs/my-day.md`）

#### 1. 为什么需要先访谈用户（Interview），而不是直接写代码？
在工作坊练习 5 中，提示词明确要求：
> *"I want to add a feature to Teamdesk: [your idea]. Don't build anything yet. Interview me about it, one question at a time, until you know what I want. Keep it small enough to build in 20 minutes. Then write the spec to docs/specs/."*

如果用户只说一句“我想做 My Day（今日概览）”，直接让 AI 写代码会面临至少 **5 个歧义点**：
1. 放在哪个页面？（是改首页 `/` 还是新建路由 `/my-day`？）
2. “今日”是按浏览器本地时区还是 UTC 时区？（项目其他地方全是 UTC，如果这里混用本地时区会导致跨时区预订查不到！）
3. 能不能切换看其他日期（比如明天）的安排？
4. 任务列表是只显示“今天到期（`dueOn === day`）”的任务，还是显示“分配给我的所有未完成任务”？
5. 页面是纯只读展示，还是可以直接在上面点击“取消预订”和“完成/转交任务”？

通过 3 个精确的单步选择题访谈，我们在 1 分钟内消除了上述所有歧义。

#### 2. 功能性需求 vs 非功能性约束 vs Agent 设计假设
- **功能性需求（Functional Requirements — 用户明确拍板）**：
  - 新增独立路由 `/my-day`，并在顶部导航栏 `Header.tsx` 和首页 `index.tsx` 增加入口。
  - 支持通过 `<MemberPicker>` 切换当前成员，通过 `<Input type="date">` 切换目标 UTC 日期（默认 `todayUtc()`）。
  - 展示该成员在所选 UTC 日期的所有有效预订，并支持直接点击取消。
  - 展示分配给该成员的所有未完成任务（`completedAt === null`），并支持直接点击完成或重新分配。
- **非功能性约束（Non-Functional Constraints — 来自架构规范与 20 分钟限制）**：
  - **不修改数据库 Schema**（无需新建表或运行迁移，控制在 20 分钟开发体量内）。
  - 严格遵守 `Route -> tRPC -> @repo/services -> @repo/db` 四层调用链，前端绝不直接导入 `@repo/db` 的查询函数。
  - 复用现有 UI 组件（`BookingList`、`TaskList`、`MemberPicker`、`FormError`），保持视觉风格完全一致。
- **Agent 自主做出的合理设计假设（Design Assumptions）**：
  - 在 `@repo/db/bookings` 中，原有的 `listMemberBookings(db, memberId, from)` 查的是“从 `from` 之后结束的所有未来预订”（用于 `/bookings` 底部的 `My upcoming bookings`），没有上限时间 `to`。因此 Agent 决定新增一个带区间上下界的 `listMemberBookingsInRange(db, memberId, { from, to })`，而不是破坏性地修改原有的 `listMemberBookings`（否则会导致 `/bookings` 页面的 `upcoming` 功能坏掉！）。

#### 3. 什么叫 Acceptance Criteria（验收标准）？
验收标准就是**“写完代码后，用什么客观、可执行的条件来判定需求 100% 达标”**（就像 C++ 课程作业里的 Online Judge 测试用例）。

**用户原始需求 → Spec 条款 → 验收标准 对应表**：

| 用户访谈原始回答 | 转化为 `docs/specs/my-day.md` 的条款 | 客观验收标准（Acceptance Criteria） |
| :--- | :--- | :--- |
| 选择功能：`My day`（今日概览：集中展示当前所选成员今天的房间预订与待办任务） | Overview & Scope：不改表结构，提供单页汇总视图。 | 1. 无需执行 `drizzle-kit generate`；<br>2. 页面同时包含预订与任务两个区块。 |
| 选择位置：新增独立路由 `/my-day`，在顶部导航栏和首页卡片增加入口，支持日期选择（默认 UTC 今日） | Section 2 (`Route & UI`)：路径 `/my-day`，支持 `?day=YYYY-MM-DD` 查询参数；更新 `Header.tsx` 和 `index.tsx`。 | 1. 访问 `GET /my-day` 返回 HTTP 200；<br>2. 顶部导航栏和首页出现 `"My day"` 链接；<br>3. 修改日期选择器时 URL 变为 `/my-day?day=2026-10-24` 并重新加载对应日期数据。 |
| 选择交互：展示所选成员当天的预订（支持取消）+ 分配给该成员的所有未完成任务（支持勾选完成） | Section 1 (`DB & Service`) & Section 2 (`Sections`)：新增 `listMemberBookingsInRange`、`listForMemberOnDay`、`bookings.forMemberDay`；复用 `tasks.list({ assigneeId })` 并在前端过滤 `completedAt === null`；绑定 `bookings.cancel`、`tasks.complete`、`tasks.assign`。 | 1. `bookings.test.ts` 新增区间查询与按日查询单元测试并通过；<br>2. 在 `/my-day` 点击 Cancel 能取消预订并刷新列表；<br>3. 点击 Complete 能完成任务并从待办列表移除；<br>4. `bun run check` 与 `bun test` 全部通过。 |

---

### 3.2 B. Plan：需求如何变成开发计划？（读取 `docs/specs/my-day-plan.md`）

为什么我们要把开发计划拆成 **Phase 1（DB & Service） → Phase 2（tRPC Router） → Phase 3（Frontend Route & Nav）** 这 3 个阶段，而不是先写前端页面？

**答案：顺着编译器类型推导与依赖图（Dependency Graph）的方向自底向上构建！**
在 TypeScript + tRPC 架构中，前端 `getTrpc().bookings.forMemberDay.query(...)` 的自动补全和类型检查，完全依赖于后端 `bookingsRouter` 的导出类型 `AppRouter`；而 `bookingsRouter` 又依赖于 `@repo/services/bookings` 的方法签名；`@repo/services/bookings` 又依赖于 `@repo/db/bookings` 的 SQL 查询函数。
- 如果你**先写前端（自顶向下）**，调用的所有接口都不存在，IDE 全是红线报错，直到最后一步才能验证。
- 如果你**自底向上（Bottom-Up）**：
  - 做完 **Phase 1**，立刻就能用 `bun test` 验证 SQL 查询和业务逻辑 100% 正确（此时哪怕一行前端代码都没写，核心逻辑已经稳如磐石）。
  - 做完 **Phase 2**，tRPC 的类型树就自动生长完毕。
  - 做 **Phase 3** 时，前端调用 `getTrpc().bookings.forMemberDay` 直接享受完整的类型检查，一次写对！

**Spec 条款 → Plan 阶段 → 目标文件 → 测试与验证方式 对应表**：

| Spec 条款 | Plan 阶段 | 涉及架构层次 | 目标修改文件 | 为什么改这些文件？（及替代方案对比） | 阶段验证方式 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1.1 `@repo/db/bookings` 新增区间查询<br>1.2 `@repo/services/bookings` 新增按天查询<br>3. 单元测试 | **Phase 1** (`Commit 7daeeb2`) | 数据库层 (`@repo/db`) + 业务逻辑层 (`@repo/services`) | - `packages/db/src/bookings.ts`<br>- `packages/db/src/bookings.test.ts`<br>- `packages/services/src/bookings.ts`<br>- `packages/services/src/bookings.test.ts` | **为什么不在前端用 `bookings.upcoming` 再手动过滤日期？**<br>因为 `upcoming` 只查当前时刻（`now`）之后还未结束的预订！如果用户想看今天早上已经结束的预订，或者用日期选择器看昨天/前天的预订，`upcoming` 根本查不出来。因此在 DB 层提供 `[from, to)` 范围查询是最正统的做法。 | 运行 `bun test`，确认新增的 2 个单元测试通过（总通过数从 55 变为 57）。 |
| 1.3 `bookingsRouter` 暴露 `forMemberDay`<br>1.4 `tasksRouter.list` 支持 `assigneeId` | **Phase 2** (`Commit ebe1473`) | API 路由层 (`apps/web/src/server/trpc`) | - `apps/web/src/server/trpc/routers/bookings.ts`<br>*(注：`tasks.ts` 经检查已原生支持 `assigneeId`，无需改动)* | tRPC 路由按领域分文件存放，预订相关的 query 必须挂在 `bookingsRouter` 下。 | 运行 `bun run check` 确认 `AppRouter` 类型推导无误。 |
| 2. `/my-day` 路由页面与导航栏入口 | **Phase 3** (`Commit 17106a4`) | 前端路由与视图层 (`apps/web/src/routes` & `components`) | - `apps/web/src/routes/my-day.tsx` (新建)<br>- `apps/web/src/components/Header.tsx`<br>- `apps/web/src/routes/index.tsx` | TanStack Router 采用文件路由约定：新建 `routes/my-day.tsx` 会由 Vite 插件自动更新 `routeTree.gen.ts` 注册 `/my-day` 路径。 | 1. 访问 `http://localhost:3000/my-day` 返回 200；<br>2. 运行 `bun run check` 与 `bun test` 全部通过。 |

---

### 3.3 C. Build：开发计划如何变成真实代码？（逐文件、逐行深度剖析）

下面我们对照真实的 Git Commit 历史，逐一回答每个关键文件修改背后的 **8 个工程问题**。

---

#### 🛠️ 改动 1：`packages/db/src/bookings.ts`（Phase 1 — Commit `7daeeb2`）

1. **修改了哪个文件？**
   `packages/db/src/bookings.ts`（第 74–93 行）。
2. **这个文件原本负责什么？**
   负责 `bookings` 表的纯 Drizzle SQL 增删改查（`getBooking`, `listRoomBookings`, `listMemberBookings`, `findOverlappingBookings`, `insertBooking`, `updateBookingTimes`, `cancelBooking`），并将数据库行转换为 `Booking` JSON 对象。
3. **为什么必须修改它？**
   原有的 `listRoomBookings` 是按“会议室 ID + 时间区间”查；原有的 `listMemberBookings` 是按“成员 ID + 结束时间晚于 `from`”查。缺少一个按**“成员 ID + 指定日期区间 `[from, to)`”**查询有效预订的底层函数。
4. **具体增加了什么？（真实代码片段，第 74–93 行）**：
   ```ts
   /** A member's active bookings that overlap [from, to), earliest first. */
   export async function listMemberBookingsInRange(
     db: Database,
     memberId: string,
     range: { from: string; to: string }
   ): Promise<Booking[]> {
     const rows = await db
       .select()
       .from(bookings)
       .where(
         and(
           eq(bookings.memberId, Number(memberId)),
           isNull(bookings.cancelledAt),
           lt(bookings.startsAt, range.to),
           gt(bookings.endsAt, range.from)
         )
       )
       .orderBy(asc(bookings.startsAt));
     return rows.map(toBooking);
   }
   ```
5. **对应 Spec 中的哪条需求？**
   对应 `docs/specs/my-day.md` 第 1 节：*"Add `listMemberBookingsInRange(db, memberId, range)` returning active (`cancelledAt is null`) bookings for `memberId` that overlap `[from, to)`, ordered by `startsAt` ascending."*
6. **为什么选择这种实现方式？（重点看区间重叠条件）**
   注意 `where` 子句中的两个不等式：
   `lt(bookings.startsAt, range.to)`（`starts_at < to`）且 `gt(bookings.endsAt, range.from)`（`ends_at > from`）。
   在算法和数据结构中，判断两个半开区间 $[A_{start}, A_{end})$ 与 $[B_{start}, B_{end})$ 是否存在交集的充要条件正是：
   $$A_{start} < B_{end} \quad \land \quad A_{end} > B_{start}$$
   这样哪怕有一个跨午夜的会议（例如前一天 23:00 开始，当天 01:00 结束），也能被准确包含在当天的日程里；而刚好在当天 `00:00` 结束的前一天会议（`ends_at == range.from`），因为是严格大于 `gt`，不会被误算进来！此外，这个查询直接复用了 `schema.ts` 第 75 行已有的复合索引 `index("bookings_member_start").on(table.memberId, table.startsAt)`，查询性能极佳。
7. **如果不做这个改动，会发生什么？**
   上层 Service 就无法按天查询某个成员的预订，或者只能把该成员历史上的所有预订全表查出来再在内存里过滤，既浪费内存又不符合现有架构。
8. **如何证明这个改动正确？**
   在 `packages/db/src/bookings.test.ts`（第 120–132 行）新增了单元测试 `listMemberBookingsInRange returns only bookings overlapping the range`，插入了 `2026-10-23` 和 `2026-10-24` 两条记录，断言查询 `2026-10-23` 时只返回当天的记录 ID。

---

#### 🛠️ 改动 2：`packages/services/src/bookings.ts`（Phase 1 — Commit `7daeeb2`）

1. **修改了哪个文件？**
   `packages/services/src/bookings.ts`（第 10、63、190–193 行）。
2. **这个文件原本负责什么？**
   预订模块的业务逻辑层（`BookingsService`），对外提供经过业务规则包装的方法。
3. **为什么必须修改它？**
   根据 `CLAUDE.md` 铁律，tRPC 路由层绝不能直接调用 `@repo/db`，必须通过 `@repo/services` 调用，并由 Service 层负责使用 `utcDayBounds(day)` 计算某一天 UTC 的起止时间戳 `[00:00:00.000Z, 次日 00:00:00.000Z)`。
4. **具体增加了什么？（真实代码片段，第 62–64 行与第 190–193 行）**：
   ```ts
   // 在 BookingsService 接口中声明（第 62-63 行）：
   /** A member's active bookings on the UTC day `day` falls on. */
   listForMemberOnDay: (memberId: string, day: string) => Promise<Booking[]>;

   // 在 createBookingsService 中实现（第 190-193 行）：
   listForMemberOnDay: (memberId, day) => {
     const { end, start } = utcDayBounds(day);
     return listMemberBookingsInRange(db, memberId, { from: start, to: end });
   },
   ```
5. **对应 Spec 中的哪条需求？**
   对应 `docs/specs/my-day.md` 第 1 节：*"Add `listForMemberOnDay(memberId: string, day: string): Promise<Booking[]>` on `BookingsService` using `utcDayBounds(day)` and `listMemberBookingsInRange`."*
6. **为什么选择这种实现方式？**
   你看它紧挨着的第 194–197 行原有的 `listForRoom`：
   ```ts
   listForRoom: (roomId, day) => {
     const { end, start } = utcDayBounds(day);
     return listRoomBookings(db, roomId, { from: start, to: end });
   },
   ```
   `listForMemberOnDay` 与 `listForRoom` 保持了 **100% 对称的代码结构（Symmetry）**！在软件工程中，与现有代码保持高度对称意味着最低的维护认知负担。
7. **如果不做这个改动，会发生什么？**
   如果把 `utcDayBounds` 放到 tRPC Router 甚至前端去算，时间边界逻辑就会散落在多个层，违背单一职责原则（SRP）。
8. **如何证明这个改动正确？**
   在 `packages/services/src/bookings.test.ts`（第 168–190 行）新增了单元测试 `listForMemberOnDay returns only the member's bookings for that UTC day`，同时验证了：**不会混入其他成员（Ben）同一天的预订**，且**不会混入同一成员（Ana）第二天的预订**。

---

#### 🛠️ 改动 3：`apps/web/src/server/trpc/routers/bookings.ts`（Phase 2 — Commit `ebe1473`）

1. **修改了哪个文件？**
   `apps/web/src/server/trpc/routers/bookings.ts`（第 19–23 行）。
2. **这个文件原本负责什么？**
   将 `ctx.services.bookings` 的方法暴露为前端可调用的 tRPC procedures（`cancel`, `create`, `forRoom`, `reschedule`, `upcoming`）。
3. **为什么必须修改它？**
   前端页面 `/my-day` 需要通过 tRPC 获取指定成员在指定日期的预订列表。
4. **具体增加了什么？（真实代码片段，第 19–23 行）**：
   ```ts
   forMemberDay: publicProcedure
     .input(z.object({ day: z.iso.datetime(), memberId: z.string() }))
     .query(({ ctx, input }) =>
       ctx.services.bookings.listForMemberOnDay(input.memberId, input.day)
     ),
   ```
5. **对应 Spec 中的哪条需求？**
   对应 `docs/specs/my-day.md` 第 1 节：*"Add `forMemberDay` query taking `{ memberId: z.string(), day: z.iso.datetime() }`"*。
6. **为什么选择这种实现方式？（以及为什么没有改 `tasks.ts`？）**
   - 输入校验使用 `z.iso.datetime()`，与下方 `forRoom` 的 `day: z.iso.datetime()` 完全一致，强制要求前端传入合法的 ISO 8601 时间字符串。
   - **计划调整说明（Plan vs Actual）**：在 Plan 的 Phase 2 中，我们原本计划修改 `apps/web/src/server/trpc/routers/tasks.ts` 让 `tasks.list` 支持 `assigneeId`。但在实际读取 `tasks.ts`（第 30–32 行）时发现：
     ```ts
     list: publicProcedure
       .input(z.object({ assigneeId: z.string().optional() }).optional())
       .query(({ ctx, input }) => ctx.services.tasks.list(input)),
     ```
     官方 Starter 已经在 `tasksRouter.list` 中写好了这个可选过滤参数（虽然在 `/tasks` 页面没用到它）！因此我们直接复用它，避免了多余的修改。
7. **如果不做这个改动，会发生什么？**
   前端 `getTrpc().bookings` 上就没有 `forMemberDay` 方法，无法按天拉取个人预订。
8. **如何证明这个改动正确？**
   `bun run check` 中的 `tsc --noEmit` 静态类型检查通过，且在 `/my-day` 页面中能够带完整类型提示调用 `trpc.bookings.forMemberDay.query({ day, memberId })`。

---

#### 🛠️ 改动 4：`apps/web/src/routes/my-day.tsx`、`Header.tsx`、`index.tsx`（Phase 3 — Commit `17106a4`）

1. **修改/新建了哪些文件？**
   - 新建 `apps/web/src/routes/my-day.tsx`（共 195 行）。
   - 修改 `apps/web/src/components/Header.tsx`（新增 `/my-day` 导航链接）。
   - 修改 `apps/web/src/routes/index.tsx`（在首页 `pages` 数组新增 `My day` 卡片）。
2. **这些文件负责什么？**
   负责 `/my-day` 页面的 URL 参数校验、服务端初始数据加载（`loader`）、客户端成员数据拉取与交互事件处理（取消预订、完成任务、转交任务）。
3. **为什么这样设计 `loader` 与 `useEffect` 的分工？（核心架构重点！）**
   请仔细看 `apps/web/src/routes/my-day.tsx` 的第 35–43 行（`loader`）与第 65–86 行（`loadMyDay`）：
   ```tsx
   // 1. 路由 loader（在 SSR 服务端和路由跳转时运行）：
   loader: async ({ deps }) => {
     const trpc = getTrpc();
     const [members, rooms] = await Promise.all([
       trpc.members.list.query(),
       trpc.rooms.list.query(),
     ]);
     const day = deps.day ?? todayUtc();
     return { day, members, rooms };
   },
   ```
   ```tsx
   // 2. 组件内客户端加载（在浏览器知道 actingMember 是谁之后运行）：
   const loadMyDay = useCallback(async () => {
     if (!actorId) {
       return;
     }
     const trpc = getTrpc();
     const [dayBookings, assignedTasks] = await Promise.all([
       trpc.bookings.forMemberDay.query({
         day: `${day}T00:00:00.000Z`,
         memberId: actorId,
       }),
       trpc.tasks.list.query({ assigneeId: actorId }),
     ]);
     setBookings(dayBookings);
     setTasks(assignedTasks.filter((task) => task.completedAt === null));
   }, [actorId, day]);
   ```
   **思考题：为什么不在 `loader` 里直接把 `dayBookings` 和 `assignedTasks` 也查出来，而要在组件的 `useEffect` 里查？**
   - 因为当前选中的成员 ID（`actorId`）是保存在**浏览器端的 `localStorage`** 里的（由 `useActingMember(members)` 读取）！
   - 当 Cloudflare Worker 在服务端执行 SSR `loader` 时，服务端根本读不到用户浏览器里的 `localStorage`，不知道当前是谁在看这个页面！
   - 所以，`loader` 只负责并发拉取与具体成员无关的公共字典数据（`members` 成员列表和 `rooms` 会议室列表），等页面到达浏览器、拿到了 `actorId` 后，再通过 `Promise.all` 并发拉取该成员当天的预订和任务！这也与官方 `apps/web/src/routes/bookings.tsx`（第 85–96 行注释：`// The acting member is only known in the browser, so their bookings load here rather than in the route loader.`）的设计模式 **100% 保持一致**。
4. **交互动作是如何实现的？**
   - **切换日期（`handleDayChange`，第 88–95 行）**：当用户在 `<Input type="date" value={day} />` 选择新日期时，调用 `navigate({ search: { day: event.target.value } })` 更新 URL 查询参数 `?day=YYYY-MM-DD`。TanStack Router 检测到 `search` 变化，自动更新 `day`，进而触发 `useEffect` 重新调用 `loadMyDay()`。
   - **取消预订（`handleCancelBooking`，第 97–107 行）**：调用 `getTrpc().bookings.cancel.mutate({ actorId, bookingId })`，成功后调用 `await loadMyDay()` 刷新当前列表。
   - **完成与转交任务（`handleCompleteTask` / `handleAssignTask`，第 109–131 行）**：分别调用 `tasks.complete.mutate` 和 `tasks.assign.mutate`，成功后同样调用 `await loadMyDay()` 刷新，已完成的任务会因为 `task.completedAt !== null` 自动从待办列表中消失。

---

#### 🛠️ 改动 5：额外扩展 — 全站中英文双语切换系统（Commit `4cfe1e9`）

在完成官方练习后，你提出了增加**“网页中英文双语切换（默认英文）”**的需求。让我们看看这个功能是如何优雅地嵌入现有架构而不破坏 SSR 的：

1. **新建 `apps/web/src/lib/i18n.tsx`（轻量级 Context 状态机）**：
   - 定义了 `Locale = "en" | "zh"` 和上下文 Hook `useI18n()`，提供内联翻译函数 `t(en: string, zh: string): string`。
   - **为什么不用庞大的第三方 i18n 库（如 `react-i18next`）？**
     对于只有 7 个页面的轻量级应用，引入外部 i18n 库不仅增加打包体积，还要维护繁琐的 JSON 键值表。使用 `t("Bookings", "会议室预订")` 内联双语对照，阅读源码时一眼就能同时看到中英文，且永远不会出现“漏写某个 JSON key 导致页面显示乱码”的问题。
   - **如何解决 SSR 水合不匹配（Hydration Mismatch）问题？（第 45–52 行）**
     ```tsx
     export function I18nProvider({ children }: { children: ReactNode }) {
       // Default to "en" on first render so SSR and initial hydration match.
       const [locale, setLocaleState] = useState<Locale>("en");

       useEffect(() => {
         const initial = getInitialLocale();
         setLocaleState(initial);
         document.documentElement.lang = initial === "zh" ? "zh-CN" : "en";
       }, []);
     ```
     在服务端渲染（SSR）时，服务器总是按默认语言 `"en"` 渲染 HTML。如果浏览器端在第一次渲染（Mount）时直接从 `localStorage` 读出 `"zh"`，React 就会发现服务端生成的英文 HTML 和客户端第一次渲染的中文 DOM 不一致，抛出 Hydration Error！因此，我们在 `useState("en")` 首屏保持 `"en"`，在挂载后的 `useEffect` 中再读取 `localStorage` 切换为上次保存的语言，这与官方 `theme-toggle.tsx`（第 61–68 行）的处理手法完全一致。
2. **新建 `apps/web/src/components/language-toggle.tsx` 并挂载到 `__root.tsx` 与 `Header.tsx`**：
   - 在 `__root.tsx` 最外层包裹 `<I18nProvider>`，在 `Header.tsx` 右上角 `<ThemeToggle />` 旁加入 `<LanguageToggle />` 按钮（显示 `EN / 中文`），实现了全站无缝切换。

---

## 第四章：测试为什么这样写？（从内存数据库到业务边界验证）

很多初学者写测试只追求“跑通一条正常流程”，但真正能帮你在重构和 AI 编码时守住底线的，是**边界条件测试（Boundary Tests）**和**异常冲突测试（Conflict/Error Tests）**。

### 4.1 单元测试、集成测试与端到端测试的区别（以及本仓库覆盖了哪几层？）

| 测试层级 | 定义与范围 | TeamDesk 仓库的覆盖情况（实事求是评估） |
| :--- | :--- | :--- |
| **1. 单元测试 (Unit Tests)** | 隔离外部依赖（如数据库、网络），只测试纯函数逻辑。 | **已覆盖**：`apps/web/src/lib/datetime.test.ts`（7 个测试，专门测试纯时间格式化与转换函数，运行耗时 `< 1ms`）。 |
| **2. 数据库与服务层集成测试 (DB & Service Integration Tests)** | 结合真实的 SQL 迁移文件、Drizzle 查询和业务规则校验，在内存 SQLite 上测试完整的数据读写闭环。 | **重度覆盖（核心主力）**：`packages/db/src/*.test.ts`（5 个文件）与 `packages/services/src/*.test.ts`（7 个文件），共 50 个测试。每次 `beforeEach` 都会调用 `createTestDatabase()` 创建全新的 `:memory:` 数据库并执行真实的 `migrations/*.sql`！ |
| **3. API 接口测试 (API / HTTP Tests)** | 通过 HTTP 客户端（如 `curl` / `fetch`）请求 `/api/trpc/*`，验证路由、CSRF、序列化与数据库。 | **人工/Agent 命令验证**：我们在阶段 4 和阶段 7 使用 `Invoke-RestMethod` / `fetch` 对本地 `localhost:3000` 和线上 `workers.dev` 进行了实测，但仓库中**尚未编写自动化的 HTTP 路由测试文件**。 |
| **4. 浏览器端到端测试 (End-to-End / E2E UI Tests)** | 启动真实无头浏览器（如 Playwright），模拟用户点击 DOM 按钮并断言页面渲染。 | **未实现（当前缺失）**：仓库中目前没有 Playwright 或 React Testing Library 组件测试。前端组件依靠 `tsc --noEmit` 类型检查和手动浏览器验证。 |

---

### 4.2 深度剖析 3 个极具代表性的真实测试

让我们打开 `packages/services/src/bookings.test.ts`，逐行研究其中 3 个测试的设计精妙之处。

#### 案例 1：正常业务流程（Happy Path）
- **位置**：`packages/services/src/bookings.test.ts`（第 27–40 行）
```ts
  test("create stores the booking for the acting member", async () => {
    const booking = await bookings.create(
      team.ana.id,
      standUp(team.bigRoom.id)
    );

    expect(booking).toMatchObject({
      memberId: team.ana.id,
      roomId: team.bigRoom.id,
    });
    expect(await bookings.listForRoom(team.bigRoom.id, at("00:00"))).toEqual([
      booking,
    ]);
  });
```
- **测试目标**：验证成员创建预订后，不仅返回值正确，而且真的持久化到了数据库中，能通过 `listForRoom` 读出来。
- **输入数据**：操作人 `team.ana.id`，会议室 `team.bigRoom.id`（Harbour，容量 10），时间 `2026-10-23T09:00:00.000Z` 至 `09:30`，人数 2，标题 `"Stand-up"`。
- **预期结果**：返回的 `booking` 包含正确的 `memberId` 和 `roomId`，且查询当天该房间的预订列表恰好等于 `[booking]`。
- **如果删除这个测试可能漏掉什么 Bug？**：如果有人在 `create` 里只构造并返回了内存对象却忘了 `await insertBooking(...)`，或者 `listForRoom` 的日期边界算错了，没有这第二个 `expect` 就发现不了。

#### 案例 2：非法输入与业务规则冲突（区间重叠 vs 首尾相接边界）
- **位置**：`packages/services/src/bookings.test.ts`（第 42–58 行）
```ts
  test("create refuses an overlapping slot but allows a touching one", async () => {
    await bookings.create(
      team.ana.id,
      standUp(team.bigRoom.id, at("09:00"), at("10:00"))
    );

    await expect(
      bookings.create(
        team.ben.id,
        standUp(team.bigRoom.id, at("09:30"), at("10:30"))
      )
    ).rejects.toMatchObject({ code: "CONFLICT" });
    await bookings.create(
      team.ben.id,
      standUp(team.bigRoom.id, at("10:00"), at("10:30"))
    );
  });
```
- **测试目标**：同时验证**“时间部分重叠必须报错拒绝”**和**“前一场结束瞬间等于后一场开始瞬间（Touching Slot）必须允许”**这两条核心规则。
- **输入数据**：
  1. Ana 先订了 `[09:00, 10:00)`。
  2. Ben 尝试订 `[09:30, 10:30)`（重叠 30 分钟）。
  3. Ben 尝试订 `[10:00, 10:30)`（在 10:00 首尾相接）。
- **预期结果**：第 2 步抛出 `ConflictError`（`code: "CONFLICT"`）；第 3 步成功创建不抛异常。
- **对应的业务规则**：`packages/db/src/bookings.ts` 第 88 行的半开区间条件 `lt(bookings.startsAt, input.endsAt) && gt(bookings.endsAt, input.startsAt)`。
- **如果删除这个测试可能漏掉什么 Bug？（C++ 程序员最熟悉的 Off-by-one 差一错误！）**：
  如果某个程序员（或 AI）在写 SQL 重叠查询时，不小心把 `lt` / `gt`（`<` / `>`）写成了 `lte` / `gte`（`<=` / `>=`），那么上一场会议 10:00 结束，下一场 10:00 开始就会被误判为冲突！这个测试专门用 `at("10:00")` 卡住了这个极易写错的 `Off-by-one` 边界。

#### 案例 3：My Day 新功能的跨成员与跨日隔离边界测试
- **位置**：`packages/services/src/bookings.test.ts`（第 168–190 行，我们在 Phase 1 新增）
```ts
  test("listForMemberOnDay returns only the member's bookings for that UTC day", async () => {
    const nextDay = (time: string) =>
      at(time).replace("2026-10-23", "2026-10-24");
    const todayBooking = await bookings.create(
      team.ana.id,
      standUp(team.bigRoom.id, at("09:00"), at("09:30"))
    );
    await bookings.create(
      team.ben.id,
      standUp(team.smallRoom.id, at("10:00"), at("10:30"))
    );
    await bookings.create(
      team.ana.id,
      standUp(team.bigRoom.id, nextDay("09:00"), nextDay("09:30"))
    );

    const anaToday = await bookings.listForMemberOnDay(
      team.ana.id,
      at("00:00")
    );

    expect(anaToday.map((b) => b.id)).toEqual([todayBooking.id]);
  });
```
- **测试目标**：验证 `listForMemberOnDay` 在面对多成员、多日期混合数据时，过滤条件是否严密（既不漏数据，也不串数据）。
- **输入数据**：
  1. **目标正例**：Ana 在 `2026-10-23 09:00–09:30` 的预订（`todayBooking`）。
  2. **干扰项 A（同日不同人）**：Ben 在 `2026-10-23 10:00–10:30` 的预订。
  3. **干扰项 B（同人不同日）**：Ana 在第二天 `2026-10-24 09:00–09:30` 的预订。
- **预期结果**：调用 `bookings.listForMemberOnDay(team.ana.id, "2026-10-23T00:00:00.000Z")` 只返回 `[todayBooking.id]`。
- **如果删除这个测试可能漏掉什么 Bug？**：
  如果在 SQL `where(and(...))` 中漏写了 `eq(bookings.memberId, ...)`，干扰项 A 就会漏进来（看到别人的日程）；如果漏写了 `lt(bookings.startsAt, range.to)`，干扰项 B 就会漏进来（把明天的日程当成今天的）。这就是高价值测试的标准写法：**用正例 + 每一个过滤维度的反例（Negative Cases）构造最小完备集**。

---

## 第五章：Cloudflare 边缘计算与 D1 部署原理

### 5.1 核心工具链与 `wrangler.jsonc` 详解

在传统后端开发中，你需要买一台 Linux 云服务器（如 AWS EC2），安装 Nginx、Node.js 和 PostgreSQL，自己管理进程守护。而在 Cloudflare 边缘架构中：
- **Cloudflare Workers**：你的后端代码（`apps/web/src/server.ts`）被编译成一个单一的 ES Module 脚本，分发到全球数百个边缘节点。有请求来时毫秒级唤醒执行，没请求时不占资源。
- **Cloudflare D1**：跑在 Cloudflare 边缘节点上的托管式 SQLite 数据库。
- **Wrangler**：Cloudflare 官方命令行工具（通过 `bunx wrangler` 调用），负责本地模拟（Miniflare）、创建云端资源、执行数据库迁移和打包上传代码。

打开 `apps/web/wrangler.jsonc`（第 1–17 行）：
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "teamdesk",
  "compatibility_date": "2026-08-19",
  "compatibility_flags": ["nodejs_compat"],
  "main": "src/server.ts",
  "observability": { "enabled": true },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "teamdesk",
      "database_id": "c4b1f87f-c645-4bbc-b527-77cedbc4d3e0",
      "migrations_dir": "../../packages/db/migrations"
    }
  ]
}
```
- **`"binding": "DB"` 是什么意思？**
  Cloudflare Worker 没有传统的数据库连接字符串（如 `postgres://user:pass@host:5432/db`）。相反，你在 `wrangler.jsonc` 中声明一个 `binding: "DB"` 并填入云端数据库的 UUID（`c4b1f87f-...`），Cloudflare 运行时就会自动把数据库连接对象注入到 Worker 的全局变量 `env.DB` 中！不仅零密码配置，而且外部网络根本无法直接连你的数据库，安全性极高。
- **注意我们在阶段 4 遇到的一个真实隐藏机制**：
  当 `wrangler.jsonc` 里的 `database_id` 从初始的 `"local"` 改成真实的 UUID `"c4b1f87f-..."` 后，Wrangler 本地模拟器（`.wrangler/state/v3/d1`）会根据这个新的 `database_id` 切换到一个全新的本地 SQLite 文件！这就是为什么我们在改完 `wrangler.jsonc` 后，本地查询一度报 `no such table: bookings`，随后通过重新运行 `bun run db:apply` 和 `bun run db:seed` 立即恢复了本地数据。

---

### 5.2 Migration（迁移）与 Seed（种子数据）的区别

| 维度 | Migration（数据库迁移） | Seed（种子数据填充） |
| :--- | :--- | :--- |
| **所在位置** | `packages/db/migrations/0000_notes.sql`, `0001_team.sql` | `packages/db/seed.sql` |
| **核心职责** | **DDL（数据定义语言）**：创建/修改表结构与索引（`CREATE TABLE`, `CREATE UNIQUE INDEX`）。 | **DML（数据操作语言）**：插入初始演示数据（3 个成员 Kim/Ana/Ben，3 个会议室 Harbour/Bridge/Quay）。 |
| **幂等性与状态追踪** | Wrangler 会在数据库中维护一张 `_cf_migrations` 表，记录哪些迁移文件已经执行过，**每个迁移文件只会被执行一次**。 | 使用 `INSERT OR IGNORE INTO ...` 编写，每次执行 `bun run dev` 都会重跑一遍，如果主键已存在则静默跳过，保证可安全重复运行。 |
| **执行命令** | 本地：`bun run db:apply`<br>远程：`bun run db:apply:remote` | 本地：`bun run db:seed`<br>远程：`bun run db:seed:remote` |

---

### 5.3 为什么本地运行成功 $\neq$ 云端部署成功？（结合本次真实排障案例）

在今天的实操中，我们亲历了 3 个只有在真机/云端操作时才会暴露的经典工程问题：

1. **Windows 终端环境变量继承问题（`bunx` 未识别）**：
   - 现场讲师和我们的初始环境都遇到了 `bun` / `bunx` 无法识别的问题。
   - **根因**：`irm bun.sh/install.ps1 | iex` 将 Bun 安装在 `%USERPROFILE%\.bun\bin`，并修改了用户的注册表环境变量。但**已经打开的 PowerShell 进程不会自动重新加载注册表中的 PATH**！在 Antigravity 中，每次 `run_command` 启动新会话时，我们通过显式注入 `$env:PATH = "$env:USERPROFILE\.bun\bin;$env:PATH"` 彻底解决了该问题。
2. **Cloudflare 首次部署的 `workers.dev` 子域名拦截与后台改版 404**：
   - 当我们第一次运行 `bun run deploy` 时，Vite 编译全部成功，但在最后上传阶段报错：`You need to register a workers.dev subdomain before publishing to workers.dev`，且 Wrangler 打印出的引导链接 `/workers/onboarding` 因 Cloudflare 2026 控制台改版（移至 `Compute` 菜单下）返回 404。
   - **解决方式**：我们没有被失效的 UI 链接卡住，而是直接通过 Cloudflare REST API（`PUT /client/v4/accounts/<ACCOUNT_ID>/workers/subdomain`）注册了 `wuwukai0707.workers.dev`，10 秒内打通了部署流水线。
3. **边缘 SSL/TLS 证书签发延迟（`EPROTO` / `Schannel` 握手等待）**：
   - 在刚刚注册完 `wuwukai0707.workers.dev` 并部署成功的第 1 秒，立刻发起 HTTPS 请求会出现 TLS 握手失败。这是因为 Cloudflare 边缘节点为新注册的二级子域名签发和分发通配符 TLS 证书需要约 **10~15 秒**。等待 15 秒后再次请求，HTTPS 证书即完全生效，线上 `POST /api/trpc/bookings.create` 与远程 D1 查表一举通过！

---

## 第六章：AI Agent 工程方法论（规则、上下文、子智能体与权限边界）

### 6.1 `CLAUDE.md` 与 `AGENTS.md` / `.agent/rules/` 的用途与差异

| 特性 | `CLAUDE.md` | `AGENTS.md` / `.agent/rules/*.md` |
| :--- | :--- | :--- |
| **适用工具** | Claude Code (CLI / Desktop) 默认自动读取的仓库级规则文件 | 跨 Agent 通用约定（`AGENTS.md`）或 Google Antigravity 原生规则目录（`.agent/rules/`） |
| **设计黄金法则** | **只写“如果不告诉 AI，AI 就会凭默认习惯写错的规则”，并附上 `Why`（原因）**。 | 同左。支持按文件 Glob 匹配按需激活（例如只在修改 `packages/db/**` 时加载数据库规则）。 |
| **反模式（不要写什么）** | 不要写可以通过 `package.json` 一眼看出来的废话，不要把整个 README 复制进去。控制在 60 行以内。 | 避免写互相冲突的规则或过时的目录结构。 |

### 6.2 Memory、Skills、MCP 的本质区别

很多开发者容易把这三者混淆，用一句话区分：
- **Memory / Rules（记忆与规则 — 静态背景知识）**：告诉 Agent **“在这个项目里做事的规矩和偏好”**（比如 `CLAUDE.md` 中规定必须用 `bun` 而不是 `npm`）。它通常常驻在系统提示词（System Prompt）头部。
- **Skills（技能包 — 按需加载的 SOP 操作手册与脚本）**：告诉 Agent **“遇到某类特定复杂任务时的标准作业程序（SOP）”**。它平时只向 Agent 暴露短短一行名称和描述（不占上下文），只有当任务匹配时，Agent 才会调用 `read_file` 去读取 `SKILL.md` 正文。
- **MCP (Model Context Protocol — 外部工具与数据源接口)**：给 Agent **“长出新的手和眼睛”**，让它能通过标准协议调用原本没有的外部 API（例如读取 Linear/Jira 的工单、查询生产环境的 Sentry 报错日志、操作外部数据库）。

### 6.3 `/context` 上下文占用与 Deferred Tools（延迟加载工具）

在现代 Agent 架构中，模型的 Context Window（上下文窗口）是最宝贵的运行时内存（就像嵌入式系统的 SRAM）：
- 如果把 50 个 MCP 工具的完整 JSON Schema 定义全部塞进每次对话的开头，哪怕你只是让 AI 改一行拼写错误，也会瞬间消耗掉数万个 Token，不仅变慢、变贵，还会导致模型注意力分散（Lost in the Middle）。
- **Deferred Tools（延迟工具加载）**：系统只把高频核心工具（如 `read_file`, `edit_file`, `run_command`）直接放进上下文；而把低频或扩展工具标记为 Deferred（只放一个名字列表，或者按需检索）。因此你在界面上看到“有 40 个可用工具”，并不代表它们的完整定义已经占用了你的当前上下文！
- **为什么工作坊在练习 4、5、6 之间频繁要求运行 `/clear`（或在 Antigravity 中使用 `/compact`）？**
  因为当一个阶段（比如 Cloudflare 部署排障）已经完成并固化到文件和 Git Commit 中后，之前的终端报错日志对后续写新功能（`My day`）毫无用处。清理上下文能让 Agent 在进入 Spec 和 Plan 阶段时保持最高的推理精度。

### 6.4 为什么分阶段 Commit 比一次性提交更适合 Agent 协作？

在练习 7（Build）中，我们严格按照：
1. `7daeeb2` — Phase 1: DB & Service + Tests
2. `ebe1473` — Phase 2: tRPC Router
3. `17106a4` — Phase 3: `/my-day` UI Route & Nav
4. `4cfe1e9` — Extra: EN/ZH Bilingual Toggle

进行了 4 次独立 Commit。这样做有三大工程收益：
1. **原子级回滚点（Atomic Rollback）**：如果 Phase 3 的前端代码改乱了，只需 `git reset --hard ebe1473`，Phase 1 和 Phase 2 写好的后端代码与测试毫发无损。
2. **极小化的 Code Review 粒度**：人类审查者（或另一个 Review Subagent）每次只需要看几十行的 `git show <commit>`，一眼就能看出有没有夹带私货。
3. **触发 Pre-commit 门禁**：每次 `git commit` 都会自动触发 `.husky/pre-commit` 运行 Ultracite（Biome）格式化与代码检查，把语法和格式问题消灭在每个阶段内部。

> [!IMPORTANT]
> **关于 Claude Code 与 Google Antigravity 的能力边界说明**：
> 虽然两者都能完成本次工作坊的全部任务，但底层机制并不完全等价。例如 Claude Code 在终端内通过 `! command` 让用户交互式执行命令，通过 `Shift+Tab` 切换 Plan/Auto 模式；而 Google Antigravity 原生具备结构化 Artifact 文档系统、`ask_question` 交互式多选弹窗、后台任务异步通知机制（Reactive Wakeup）以及 `invoke_subagent` 多子智能体编排工具。在使用时应发挥各自平台的原生优势，而不是生搬硬套另一个工具的快捷键。

---

## 第七章：工程方法迁移：从 TeamDesk 到 AIRI + HAST 桌宠系统

你正在开发的 **AIRI + HAST + 酒馆编排（Tavern Orchestration）AI 桌宠系统**（涵盖聊天 UI、LLM 调用、长期记忆、TTS 语音合成以及手机/桌面跨端交互），其复杂度远高于 TeamDesk。如果直接用自然语言跟 AI 说“帮我把记忆模块和 TTS 接上”，极易出现状态失控和并发冲突。

以下是将今天学到的 **TeamDesk 工程方法论** 直接迁移到你的桌宠项目的实战指南：

### 1. 为桌宠项目编写 `<60 行` 的高价值架构红线文档（`CLAUDE.md` / `.agent/rules/`）
不要写“这是一个可爱的桌宠项目”，要写**跨模块边界铁律**。例如：
- **UI 渲染层（Live2D / VRM / 聊天窗口）绝不允许直接拼装 Prompt 或调用 LLM/TTS HTTP 接口**（*原因：所有对话编排必须经过酒馆编排层 Tavern Orchestrator，否则记忆注入、情绪标签解析和 TTS 音频队列会脱节*）。
- **记忆读写（HAST Memory）必须与 UI 帧率解耦，所有向量检索与状态持久化必须异步执行并设置超时兜底**（*原因：防止 LLM 响应或记忆检索卡顿导致桌宠动画掉帧或主线程卡死*）。
- **跨端协议（手机端与桌面端）的所有消息 Payload 必须通过共享的 Zod Schema 校验**（*原因：保证两端状态同步时的类型安全*）。

### 2. 如何把桌宠新功能写成可验收的 Spec？（以“情绪驱动的 TTS 语音播报”为例）
每次加新功能前，先建立 `docs/specs/<feature>.md`，明确三件事：
- **输入输出契约（Data Contract）**：例如 LLM 回复中输出的 `[emotion:happy]` 标签如何被解析器剥离？（聊天框显示的纯文本不能露出标签，而标签枚举值传给动作状态机和 TTS 语调参数）。
- **异常与降级策略（Fallback）**：如果 TTS 服务超时或断网，桌宠是否依然正常显示文字气泡并播放口型动画？
- **客观验收标准（Acceptance Criteria）**：给出 3 条可以直接用单元测试验证的输入输出样例。

### 3. 如何将 Plan 拆成相互独立的阶段，让多 Agent 并行分工而不冲突？
当你想让多个子智能体（Subagents）同时加速开发桌宠功能时，**最大的敌人是两个 Agent 同时修改同一个文件导致 Git 冲突或逻辑覆盖**。
正确的拆分法是：**先在 Phase 1 锁死共享接口文件，再按模块目录物理隔离并行开发**：
- **Phase 1（主 Agent 串行完成并 Commit）**：修改共享类型与接口契约文件（如 `packages/shared/src/dialogue-types.ts`），定义好 `DialogueTurn`、`EmotionTag`、`TtsPayload` 的数据结构。
- **Phase 2（派生 2~3 个 Subagent 并行开发，互不触碰对方目录）**：
  - **Subagent A（负责 `packages/orchestrator/`）**：实现酒馆 Prompt 编排、HAST 记忆检索与情绪标签提取，编写单元测试。
  - **Subagent B（负责 `packages/tts/`）**：根据 `TtsPayload` 实现音频流合成、缓存与队列管理，编写 Mock 测试。
  - **Subagent C（负责 `apps/desktop-ui/`）**：实现聊天气泡、表情切换与音频播放状态绑定。
- **Phase 3（主 Agent 集成验收）**：汇总各子模块，跑通全量测试并 Commit。

---

## 第八章：互动学习、自测题（12 题）与 ChatGPT 深度研讨指南

你可以把本章的问题作为自测，或者把整份文档发给 ChatGPT，让它扮演你的“一对一实验课助教”，逐题考你并展开讨论。（**标准答案与详细解析统一放在本章最末尾**）。

---

### 8.1 十二道分级自测题（请先独立思考，再看文末解析）

#### 【第一组：基础概念题（共 4 题）】
1. **（Monorepo 与导入边界）** 在 TeamDesk 中，为什么前端 React 组件（如 `apps/web/src/routes/bookings.tsx`）只能 `import type { Booking } from "@repo/db/shared"`，而绝对不能 `import { insertBooking } from "@repo/db/bookings"`？
2. **（TypeScript 与 Zod 的分工）** 既然 TypeScript 已经有了编译期静态类型检查（如 `interface CreateBookingInput`），为什么在 `packages/services/src/bookings.ts` 中还要用 Zod 写一遍 `createBookingInput.parse(input)`？C++ 或 Python 里有类似的概念吗？
3. **（SSR 与客户端状态）** 在实现中英文双语切换组件 `I18nProvider`（`apps/web/src/lib/i18n.tsx`）时，为什么 `useState<Locale>("en")` 的初始值必须固定为 `"en"`，而把读取 `window.localStorage.getItem("teamdesk-locale")` 放在 `useEffect` 里？如果在 `useState` 初始化时直接读 `localStorage` 会发生什么？
4. **（Migration vs Seed）** 在 Cloudflare D1 中，`bun run db:apply:remote` 和 `bun run db:seed:remote` 分别执行了什么？如果线上数据库已经有真实用户的预订数据，重复运行这两个命令安全吗？为什么？

#### 【第二组：结合 TeamDesk 真实代码的理解题（共 4 题）】
5. **（区间重叠算法）** 查看 `packages/db/src/bookings.ts` 第 88 行的 `listMemberBookingsInRange`（以及 `findOverlappingBookings`），代码使用 `lt(bookings.startsAt, range.to)` 和 `gt(bookings.endsAt, range.from)` 判断时间重叠。假设会议室已有一场 `09:00–10:00` 的预订，现在有人预订 `10:00–11:00`，这两个条件分别求值为什么？如果把 `lt` 和 `gt` 改成 `lte` (`<=`) 和 `gte` (`>=`)，会导致什么业务问题？
6. **（ID 类型设计）** 查看 `packages/db/src/schema.ts` 和 `packages/db/src/bookings.ts`，`bookings` 表的 `id`、`roomId`、`memberId` 在 SQLite 中是什么类型？而在 `toBooking(row)` 返回给上层时又变成了什么类型？为什么要做这层转换？
7. **（并发竞争与数据库约束）** 查看 `packages/services/src/bookings.ts` 第 151–187 行：既然第 151 行已经调用了 `findOverlappingBookings` 检查确认没有时间冲突，为什么第 171 行 `insertBooking` 外面还要套一层 `try ... catch` 去捕获 `isUniqueViolation(error)`？什么情况下第 151 行没查出冲突，但第 171 行却会报唯一约束冲突？
8. **（Loader vs useEffect 数据加载时机）** 对比 `apps/web/src/routes/my-day.tsx` 的第 35–43 行（`loader`）和第 65–86 行（`loadMyDay`）：为什么 `members` 和 `rooms` 在 `loader` 里加载，而 `bookings.forMemberDay` 和 `tasks.list` 必须在组件内部的 `useEffect` 里加载？

#### 【第三组：架构设计与故障排查题（共 4 题）】
9. **（故障排查：本地数据库表消失之谜）** 在今天阶段 6C 的实操中，当我们把 `apps/web/wrangler.jsonc` 中的 `"database_id": "local"` 修改为远程 D1 的真实 UUID `"c4b1f87f-c645-4bbc-b527-77cedbc4d3e0"` 后，为什么原本运行正常的 `localhost:3000` 突然报错 `no such table: bookings`？是如何修复的？
10. **（安全设计：CSRF 与 CORS）** 查看 `apps/web/src/server.ts` 第 14–18 行的注释与代码。为什么作者特别警告：*“adding `cors()` to these routes would leave mutations open to CSRF”*（给 `/api/trpc/*` 加上 `cors()` 会导致跨站请求伪造漏洞）？
11. **（错误处理链路）** 当一个普通成员（`role: "member"`，如 Ana）尝试在 `/rooms` 页面点击按钮归档一个会议室时，从后端 Service 抛出异常到前端 `<FormError>` 显示出错误提示，中间经历了哪几个文件的转换？前端收到的 HTTP 状态码是多少？
12. **（新需求架构演练：Task Comments 任务评论）** 假设你现在要实现工作坊备选点子中的 **“Task comments（允许团队成员在任务下发表评论）”**，请严格按照本项目的架构规范，列出你需要按顺序修改或新建哪些文件（从 Phase 1 到 Phase 3）？

---

### 8.2 五个适合发给 ChatGPT 深入研讨的高阶问题

当你把本讲义发给 ChatGPT 学习时，可以用以下 5 个问题开启深度探讨：

1. **架构分层探讨**：“结合讲义第三章，为什么 `My Day` 功能需要修改 `@repo/db` 和 `@repo/services`，而不是直接在前端 `my-day.tsx` 里调用现有的接口把所有预订拉下来再自己用 JavaScript `.filter()` 过滤？”
2. **同构 RPC 原理探讨**：“请结合讲义第二章和 `apps/web/src/integrations/trpc/client.ts` 的代码，给我详细讲讲 `createIsomorphicFn`、`unstable_localLink` 和 `httpBatchLink` 是如何配合工作的？如果不用 `unstable_localLink`，在 Cloudflare Worker 的 SSR `loader` 里用 HTTP 请求自己的 URL 会有什么问题？”
3. **并发控制探讨**：“在 `packages/db/src/schema.ts` 第 72 行的 `uniqueIndex("bookings_room_start_active").on(table.roomId, table.startsAt).where(sql\`${table.cancelledAt} is null\`)` 中，这个 SQLite 部分唯一索引（Partial Unique Index）能防住哪类并发冲突？如果两个并发请求同时预订同一个房间的 `09:00–10:00` 和 `09:30–10:30`（开始时间不同但时段重叠），这个唯一索引能防住吗？在 SQLite/D1 中如何彻底解决任意区间的并发写冲突？”
4. **真实认证改造探讨**：“当前 TeamDesk 用 `<MemberPicker>` 把 `actorId` 放在请求参数里传给后端（演示模式）。如果要把它改造成真正的生产级登录认证（例如基于 Cookie/Session 或 JWT），`context.ts`、`init.ts`（`protectedProcedure`）和各个 Service 的函数签名应该如何重构？”
5. **桌宠项目迁移探讨**：“我正在开发 AIRI + HAST + 酒馆编排的桌宠系统。请参考讲义第六章和第七章，帮我为桌宠项目设计一份 50 行以内的 `CLAUDE.md` 架构红线文档，并设计一个用于测试‘酒馆 Prompt 编排 + 记忆注入’的纯内存集成测试方案（类似 TeamDesk 的 `createTestDatabase`）。”

---

### 8.3 自测题参考答案与详细解析

#### 【第一组：基础概念题解析】
1. **解析**：
   - `@repo/db/bookings` 内部导入了 `drizzle-orm` 和数据库表定义 `schema.ts`，属于纯服务端代码（Server-only）。如果前端路由组件导入了它，打包工具会把服务端 ORM 代码打进浏览器 Bundle，甚至因缺少服务端环境而报错。
   - `@repo/db/shared` 只包含 TypeScript 接口（编译后擦除，零运行时体积）和纯常量（如 `BOOKING_MAX_MINUTES`），因此前后端均可安全导入。
2. **解析**：
   - TypeScript 的类型只在**编译期（Compile-time）**存在，编译成 JavaScript 后所有 `interface` 和 `type` 都会被擦除（Type Erasure）。当后端 Worker 收到来自网络的 HTTP JSON 请求时，恶意用户或有 Bug 的客户端完全可以通过 `curl` 发送非法数据（例如 `attendees: -5` 或空标题）。
   - Zod 在**运行时（Runtime）**对输入对象进行解析和校验，相当于 C++ 中在网络反序列化函数里写的边界检查断言，或 Python FastAPI 中的 `Pydantic` 模型校验。此外，Service 层再次调用 `.parse()` 保证了即使不走 HTTP（例如在 CLI 脚本或测试中直接调用 Service），输入校验依然生效。
3. **解析**：
   - 在 TanStack Start 的 SSR（服务端渲染）流程中，组件会先在 Cloudflare Worker 上执行一次生成初始 HTML（此时没有 `window` 对象，默认渲染英文 `"en"`），发给浏览器后，React 会在浏览器端执行第一次渲染并进行**水合（Hydration，即把事件监听器绑定到已有的服务端 HTML 节点上）**。
   - 如果在 `useState` 初始化时直接从 `localStorage` 读出 `"zh"`，浏览器端第一次渲染出的虚拟 DOM 就是中文（`"首页"`），而服务端发来的 HTML 却是英文（`"Home"`），React 会报 Hydration Mismatch 错误。放在 `useEffect` 中则保证了首屏水合与服务端一致，水合完成后立即平滑切换为本地存储的语言。
4. **解析**：
   - `db:apply:remote` 执行 `packages/db/migrations/*.sql` 中尚未应用过的迁移文件；Wrangler 通过远程 D1 中的 `_cf_migrations` 表记录已执行的迁移，因此重复运行 `db:apply:remote` 会提示没有新迁移需要执行，是安全的。
   - `db:seed:remote` 执行 `packages/db/seed.sql`。打开 `seed.sql` 可以看到它写的是 `INSERT OR IGNORE INTO members ...` 和 `INSERT OR IGNORE INTO rooms ...`，没有 `DELETE` 或 `DROP` 语句，也不会触碰 `bookings` 和 `tasks` 表。因此重复运行也是安全的（已存在的 ID 1, 2, 3 会被 `OR IGNORE` 忽略）。但在其他项目中，务必先检查 `seed.sql` 是否包含 `DELETE FROM` 或 `TRUNCATE`，绝不能盲目在生产环境跑 Seed。

#### 【第二组：真实代码理解题解析】
5. **解析**：
   - 已有预订为 `[09:00, 10:00)`，新预订区间 `range` 为 `[10:00, 11:00)`。
   - 条件 1：`bookings.startsAt < range.to` 即 `"09:00" < "11:00"`，为 `true`。
   - 条件 2：`bookings.endsAt > range.from` 即 `"10:00" > "10:00"`，因为是严格大于（`gt`），求值为 `false`！
   - 两者 `AND` 的结果为 `false`（不重叠），因此允许无缝衔接预订 `10:00–11:00`。如果改成 `<=` 和 `>=`，`"10:00" >= "10:00"` 就会变成 `true`，导致 `09:00–10:00` 的会议结束后，`10:00` 整点不能立刻开始下一场会议。
6. **解析**：
   - 在 `packages/db/src/schema.ts` 中，`id`、`roomId`、`memberId` 均定义为 `integer`（SQLite 整型自增主键与外键，占用空间小、索引比对最快）。
   - 在 `toBooking(row)` 中，它们被 `String(row.id)` 转换成了 `string` 类型（对外遵循 `@repo/db/shared` 中的 `Booking` 接口）。这样前端在处理表单 `<select>` 的 `value`（HTML DOM 中 `value` 永远是 `string`）以及 URL 查询参数时，不需要到处手动转数字，消除了前后端 ID 类型不一致的隐患。
7. **解析**：
   - 这是经典的 **TOCTOU（Time-of-Check to Time-of-Use，检查与使用时间差）并发竞态条件**。
   - 假设用户 A 和用户 B 在同一毫秒请求预订 `Harbour` 会议室的 `09:00–10:00`。请求 A 和请求 B 同时执行第 151 行的 `findOverlappingBookings`（`SELECT`），此时两人谁都还没执行 `INSERT`，所以两个 `SELECT` 都返回空数组 `[]`（均认为没有冲突）。
   - 紧接着两人同时执行第 171 行的 `insertBooking`（`INSERT`）。第一个到达 SQLite 的写入成功，第二个到达的写入就会触发 `schema.ts` 第 72 行定义的 `bookings_room_start_active` 唯一索引错误（`UNIQUE constraint failed`）。通过 `try ... catch` + `isUniqueViolation` 捕获该错误并抛出 `ConflictError`，客户端就能收到友好的 `409 Conflict` 提示，而不是崩溃报 `500 Internal Server Error`。
8. **解析**：
   - `loader` 在 SSR 阶段运行在 Cloudflare Worker 服务端，而当前演示系统的身份切换（`actingMember`）保存在浏览器的 `localStorage` 中（见 `apps/web/src/hooks/use-acting-member.ts`）。
   - 服务端执行 `loader` 时不知道当前浏览器选中的 `actorId` 是谁，所以 `loader` 只能拉取公共的 `members` 和 `rooms` 列表；等组件在浏览器渲染并由 `useActingMember` 确定了 `actorId` 后，再在 `useEffect` 中触发 `loadMyDay()` 拉取该成员专属的 `bookings` 和 `tasks`。

#### 【第三组：架构设计与故障排查题解析】
9. **解析**：
   - Wrangler 在本地开发模式（`--local`）下，会将本地 SQLite 数据库文件保存在 `apps/web/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/` 目录下，且**文件名是根据 `wrangler.jsonc` 中的 `database_id` 哈希生成的**。
   - 当我们把 `database_id` 从 `"local"` 改为 `"c4b1f87f-c645-4bbc-b527-77cedbc4d3e0"` 后，Miniflare 立刻指向了一个以新 UUID 命名的空白 SQLite 文件（里面还没有跑过迁移建表）。
   - **修复方法**：执行 `bun run db:apply` 和 `bun run db:seed`，对这个新 UUID 对应的本地 SQLite 实例应用迁移与种子数据，即可恢复正常。
10. **解析**：
    - `apps/web/src/server.ts` 使用了 `csrf()` 中间件，它会拦截跨站发送的简单表单请求（如 `application/x-www-form-urlencoded`）。
    - 而 tRPC 的 mutation 使用的是 `application/json` POST 请求。在浏览器安全模型中，跨域发送 `application/json` 属于“非简单请求”，浏览器必须先发送一个 `OPTIONS` 预检请求（CORS Preflight）。因为 `server.ts` 没有配置 `cors()`，任何恶意第三方网站发起的跨域预检请求都会直接被浏览器拦截，从而天然防住了针对 JSON 接口的 CSRF 攻击。如果贸然加上允许任意来源的 `cors()`，这层防护就会失效。
11. **解析**：
    1. **Service 层（`packages/services/src/rooms.ts`）**：`archive` 方法调用 `requireAdmin(db, actorId)`，发现 Ana 的 `role` 不是 `"admin"`，抛出 `new ForbiddenError("Only admins can do this.")`（它是 `ServiceError` 的子类，`code = "FORBIDDEN"`）。
    2. **tRPC 中间件层（`apps/web/src/server/trpc/init.ts` 第 46–57 行）**：`serviceErrors` 中间件捕获到 `result.error.cause instanceof ServiceError`，查表 `TRPC_CODES["FORBIDDEN"]`，将其转换为 `new TRPCError({ code: "FORBIDDEN", message: cause.message })`，对应 **HTTP 状态码 403**。
    3. **前端 Hook 与组件层（`apps/web/src/hooks/use-action.ts` & `routes/rooms.tsx`）**：`archiveRoom.run(...)` 捕获到 tRPC Client 抛出的错误，将 `error.message` 存入 `archiveRoom.error` 状态，最终由 `<FormError message={archiveRoom.error} />` 渲染在页面上。
12. **解析（Task Comments 标准实现路线）**：
    - **Phase 1（Schema、Migration、DB 与 Service 层 + 测试）**：
      1. 修改 `packages/db/src/shared.ts`：新增 `TaskComment` 接口和 `TASK_COMMENT_MAX_LENGTH` 常量。
      2. 修改 `packages/db/src/schema.ts`：新增 `taskComments` 表（`id`, `taskId`, `authorId`, `body`, `createdAt`），运行 `bun run --filter @repo/db generate` 生成新迁移文件，并运行 `bun run db:apply`。
      3. 新建 `packages/db/src/task-comments.ts` 并在 `packages/db/package.json#exports` 注册导出（注意：绝不建 barrel 文件！），实现 `insertTaskComment` 和 `listTaskComments`。
      4. 新建 `packages/services/src/task-comments.ts` 并在 `packages/services/package.json#exports` 注册导出，实现 Zod 校验（校验 `actorId` 是有效成员、`taskId` 存在、`body` 非空且不超长）。
      5. 编写 `packages/db/src/task-comments.test.ts` 和 `packages/services/src/task-comments.test.ts`，跑通 `bun test`。
    - **Phase 2（tRPC Context 与 Router 层）**：
      1. 修改 `apps/web/src/server/trpc/context.ts`：在 `createServices` 中挂载 `taskComments: createTaskCommentsService(db)`。
      2. 修改 `apps/web/src/server/trpc/routers/tasks.ts`（或新建 `task-comments.ts` 并挂到 `router.ts`）：新增 `comments` 查询和 `addComment` 变更接口。
    - **Phase 3（前端 UI 组件与路由集成）**：
      1. 在 `apps/web/src/components/` 下编写评论列表与输入框组件（仅从 `@repo/db/shared` 导入 `TaskComment` 类型）。
      2. 在 `apps/web/src/routes/tasks.tsx`（及 `task-list.tsx`）中集成评论展示与提交，运行 `bun run check` 与 `bun test` 验证通过。
