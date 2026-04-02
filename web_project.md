# Web Project: Vue3 Unity 回合制游戏项目介绍（单项目）

> 用途：作为项目的“开发大纲模板”。后续你在此文档里持续补充/调整页面、数据结构、组件与任务清单，避免开发时反复返工。

---

## 1. 项目目标（Why）

- 作为你的 Unity 回合制游戏项目“说明书”：结构化呈现背景、回合制核心流程、战斗/行动规则、单位/技能/关卡、媒体素材与开发进度。
- 提供良好的前端体验：响应式布局、加载性能、SEO 基础（若需要）、可扩展的内容结构。

## 2. 当前范围（Scope）

### 必须完成（MVP）

- 游戏项目主页面（GameProjectView）：包含概览、回合制机制说明、单位/技能/关卡、媒体与下载/试玩入口
- 可选：开发进度/里程碑模块（Roadmap），用于承接后续内容

### 可选增强（Later）

- 多语言（i18n）
- 搜索/筛选（当单位/关卡信息增多后需要）
- 博客/日志（Dev Log，若要记录开发过程）
- 视频播放器（YouTube/Bilibili embed 或本地视频）
- 交互式时间线/进度条（开发里程碑）
- 下载页/购买页（若有）
- 评论/表单（需后端/第三方服务）

## 3. 技术栈选择（Tech）

> 按你的偏好填写/确认最终选型；此处给出常见组合供参考。

- 构建工具：`Vite`
- Vue 版本：`Vue 3`
- 路由：`vue-router`
- 状态管理：`Pinia`（如需要）
- 样式方案（二选一或组合）：
  - `Tailwind CSS`（推荐，开发快）
  - 或 `SCSS` / `CSS Modules`
- 规范与质量：
  - 代码风格：ESLint + Prettier
  - 类型：是否使用 TypeScript（建议：是）
- 数据来源：
  - 静态内容：`src/content/*.ts|.json`
  - 或后端 API：`/api/*`（后续再说）

## 4. 页面与路由设计（Sitemap / Routes）

> 在这里列出最终路由；开发时按路由拆分页面组件。

- `/`：游戏项目主页 `GameProjectView`
  - 展示项目概览、回合制机制、单位/技能/关卡、媒体与下载/试玩入口
可选：

- `/devlog`：开发日志列表
- `/devlog/:postSlug`：开发日志详情
- `/gallery`：图片/视频合集（如果你素材多）
- `/faq`：常见问题（也可以作为首页折叠模块，避免额外页面）

## 5. 内容结构与数据模型（Data Model）

> 建议把“内容”与“渲染组件”解耦。下方给出可直接落地的内容 schema。

### 5.1 游戏项目（单项目）`GameProject`

```ts
type GameProject = {
  slug: string
  title: string
  subtitle?: string
  hero: {
    coverImageUrl?: string
    trailerUrl?: string   // 例如 YouTube/Bilibili embed 或本地视频路径
    colorTheme?: string   // 可选：用于页面主题色
  }
  quickFacts: {
    engine: "Unity"
    genre: string
    platforms?: string[]
    status?: "prototype" | "in_progress" | "released"
    releaseYear?: number
    version?: string
  }
  background: {
    problemOrGoal?: string
    designPhilosophy?: string
    inspirations?: string[]
  }
  turnBasedCore: {
    // 一回合内部的阶段/流程（例如：行动准备 -> 行动 -> 结算 -> 敌方回合）
    turnFlow: Array<{ phase: string; description?: string }>
    actionSystem: {
      // 行动机制（AP/行动点、卡牌行动等）在这里统一描述
      systemName: string
      actions: Array<{ name: string; cost?: string; description?: string }>
      turnRules: string[]
    }
    // 单位属性结构（用于动态渲染属性表）
    unitStats: {
      attributes: Array<{ key: string; label: string }>
    }
    // 战斗关键规则要点（命中/伤害/判定、连击等）
    combatRules: string[]
    statusEffects?: Array<{ name: string; durationRule?: string; effectSummary: string }>
  }
  // 单位/角色（你回合制战斗里用到的“可上场元素”）
  units: Array<{
    id: string
    name: string
    role: string
    faction?: string
    description?: string
    attributes: Record<string, number | string>
    skills: Array<{ name: string; description?: string; cooldown?: string; tags?: string[] }>
    portraitImageUrl?: string
  }>
  // 关卡/战斗场景
  stages: Array<{
    id: string
    name: string
    objective: string
    recommendedLevel?: number
    difficulty?: "easy" | "normal" | "hard"
    previewImageUrl?: string
    mechanicsNotes?: string[]
  }>
  media: {
    screenshots: Array<{ url: string; caption?: string }>
    videos: Array<{ url: string; title?: string }>
  }
  links: Array<{ label: string; href: string; kind?: "download" | "store" | "play" | "trailer" }>
  faq?: Array<{ q: string; a: string }>
  roadmap?: Array<{ milestone: string; status?: "planned" | "doing" | "done"; eta?: string; notes?: string }>
  devNotes?: string[]
}
```

### 5.2 开发日志（可选）`DevLogPost`

```ts
type DevLogPost = {
  slug: string
  title: string
  date: string             // ISO string
  coverImageUrl?: string
  excerpt: string
  content: string         // 或 markdown
  tags?: string[]         // 用于归类/筛选（可选）
}
```

## 6. 组件划分（Component Map）

> 用“可复用组件 + 业务视图”组合方式。

### 6.1 布局类

- `AppLayout`：公共骨架（TopNav / Footer / 主内容区）
- `TopNav`：页面内锚点导航（可选）
- `Footer`：页脚信息
- `Container`：内容最大宽度约束

### 6.2 通用组件

- `SectionTitle`：章节标题
- `BadgeList`：标签/徽章集合（用于单位/技能类型等）
- `StatTable`：属性表（用于渲染单位属性/规则表）
- `UnitCard` / `StageCard`：单位/关卡卡片
- `MediaGallery`：截图/视频混合展示
- `VideoEmbed`：视频嵌入封装
- `MarkdownRenderer`：渲染图文说明/规则段落
- `ButtonLink`：按钮样式的链接
- `FaqAccordion`：常见问题折叠面板
- `ResponsiveImage`：图片自适应（如需要）

### 6.3 业务视图组件

- `GameProjectView`
  - `ProjectHero`：封面/宣传视频/主题色
  - `QuickFactsSection`：引擎/类型/状态等快速信息
  - `TurnFlowSection`：一回合流程拆解
  - `ActionSystemSection`：行动机制与规则要点
  - `CombatRulesSection`：战斗判定/结算规则
  - `UnitRosterSection`：单位/角色列表
  - `StageOverviewSection`：关卡/战斗场景概览
  - `MediaGallery`：截图/视频展示
  - `RoadmapSection`：开发里程碑/进度条
  - `LinksAndDownload`：下载/试玩/商店入口
  - `FAQSection`（可选）

## 7. 状态与数据流（State / Data Flow）

> 推荐把“页面数据”作为只读（无复杂异步）处理，MVP 可不引入 Pinia。

- 数据加载方式：
  - 静态内容：`import` 本地 `content/*.ts`，直接渲染
  - 若未来接 API：使用 `fetch/axios` + `loading/error` 状态
- 路由参数：
  - （单项目站）无路由参数；首页直接加载唯一的 `GameProject` 数据

待确认：

- 是否需要根据版本/里程碑切换页面主题色/徽标？
- 是否需要用户互动（评论/反馈表单）？

## 8. 样式与主题（Styling / Theme）

- 全局样式：字体、间距、颜色体系
- 响应式策略：
  - 移动端优先或桌面优先（写清楚）
  - 断点：`sm/md/lg`（按 Tailwind 或你自己的规则）
- 页面主题色：
  - 是否用 `GameProject.hero.colorTheme` 动态设置？

## 9. SEO / 可访问性（SEO / A11y）

基础建议：

- 每个页面设置 `title` / `meta description`
- 图片使用合理的 `alt`
- 表单可达（label for / 键盘可操作）

待确认：

- 是否需要 `sitemap.xml` / `robots.txt`？
- 是否部署到 GitHub Pages / Vercel / Netlify？

## 10. 性能与资源策略（Performance）

- 图片优化：
  - 选择合适的宽高比
  - 适当使用压缩格式（如 WebP）
- 视频策略：
  - 首屏不加载大文件（使用封面图 + 点击加载 embed）
- 代码分割：
  - 路由懒加载（可选）

## 11. 测试与验证（Testing / Checks）

MVP 可做轻量验证：

- 路由能正常切换且刷新不丢数据
- 项目主页面渲染完整（核心模块齐全：回合流程/规则/单位/关卡/媒体）
- 图片与视频在移动端不溢出

待确认：

- 是否需要单元测试（Vitest）？

## 12. 构建与部署（Build / Deploy）

推荐记录：

- 构建命令：`npm run build`
- 本地预览：`npm run preview`
- 部署平台：`(待选择)`
- 基础路径：是否使用 `base`（尤其是部署到子路径时）

## 13. 开发计划与里程碑（Milestones）

### Milestone 1：工程骨架

- 初始化 Vue3 + Router
- 搭建公共布局（TopNav/Footer/Container）
- 首页路由 + 项目原型（静态 `GameProject` 数据）

### Milestone 2：项目核心模块

- `GameProjectView` 核心模块完整渲染（回合流程 + 行动/战斗规则 + 单位/关卡）
- `screenshots/media` 展示组件联动
- 填充至少 1 套“单位 + 关卡 + 回合制规则要点”的本地静态数据

### Milestone 3：内容完善与样式打磨

- 增加 FAQ、Roadmap 细节
- （可选）接入 DevLog 页面并用真实内容验证排版
- 调整响应式与动效（轻量）

### Milestone 4：部署上线

- 构建检查
- 部署到目标平台
- 基础 SEO 与可访问性检查

## 14. 任务清单（To-Do）

- [ ] 确认最终技术栈（Tailwind/SCSS、TS与否）
- [ ] 确认页面路由与信息架构
- [ ] 抽取静态内容（至少 1 套单位 + 关卡 + 回合制规则要点）
- [ ] 实现 `GameProjectView`（概览/回合流程/规则/单位/关卡/媒体/链接）
- [ ] （可选）实现 `DevLog` 列表与详情
- [ ] 样式适配移动端
- [ ] SEO 基础（title/meta）
- [ ] 部署并验证

## 15. 风险与待决策（Risks / Open Questions）

- 是否需要后端支持（评论、下载/付费回调等）？
- 你的视频素材来源是什么（YouTube/Bilibili/本地）？嵌入策略是什么？
- 页面内容较长时，如何设计导航/目录/折叠以提升可读性？
- 图片/视频授权是否齐全（避免上线后版权问题）？

---

## 附录：你可以在这里记录“变更记录”

- 2026-__-__：新增 `DevLog` 路由（示例）
- 2026-__-__：决定采用 Tailwind（示例）
