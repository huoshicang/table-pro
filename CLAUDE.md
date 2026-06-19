# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**table-pro** is a Vue 3 component library that provides a configurable admin-style data table. The library consists of 4 parts: search, table info, pagination, and add/edit dialog.

## Common Commands

```sh
npm install            # Install dependencies
npm run dev            # Start dev server (HMR on http://localhost:5173)
npm run build          # Type-check + minify build (vue-tsc --build + vite build)
npm run build-only     # Build without type-checking
npm run type-check     # vue-tsc --build only
npm run preview        # Preview production build locally
npm run format         # Prettier format src/ (semi: false, singleQuote: true, printWidth: 100)
```

## Codebase Structure

- **`src/main.ts`** — App entry. When consumed as a library, this is where component registration happens via `app.component('input', ELInput)` style naming.
- **`src/App.vue`** — Demo page for local development.
- **`vite.config.ts`** — Vite config with `@` path alias mapped to `./src/`.
- **`tsconfig.app.json`** — TypeScript config extending `@vue/tsconfig/tsconfig.dom.json`, path mapping `@/*` → `./src/*`, `vue-tsc` build info at `./node_modules/.tmp/tsconfig.app.tsbuildinfo`.
- **`.prettierrc.json`** — Format: no semicolons, single quotes, 100 char print width.

## Library Architecture

The component library exposes multiple sub-components (search, table, pagination, dialog) that are wired together through configuration passed at the top level. Each sub-component is individually globally registered in the consuming app's `main.ts`.

## Plugin Usage

The project uses `TableProPlugin` (from `src/index.ts`) which accepts a `ComponentMap` and optional `config`. All components are Naive UI components, imported from `naive-ui` and registered at plugin installation.

### ComponentMap

`ComponentMap` is a strongly typed record mapping component names to Naive UI components. Key components include:

| Category | Components |
|---|---|
| **Form inputs** | `input`, `textarea`, `select`, `cascader`, `autoComplete`, `inputNumber`, `slider`, `rate`, `colorPicker` |
| **Date/Time** | `datePicker`, `dateTimePicker`, `dateRangePicker`, `timePicker`, `timeRangePicker` |
| **Selection** | `switch`, `radioGroup`, `radio`, `checkboxGroup`, `checkbox` |
| **Layout/Display** | `table`, `tree`, `card`, `collapse`, `tabs`, `steps`, `list`, `divider`, `tag`, `avatar`, `badge`, `statistic`, `text`, `empty`, `timeline`, `anchor`, `qrcode` |
| **Feedback/Actions** | `button`, `dialog`, `drawer`, `pagination`, `tooltip`, `dropdown`, `popover`, `upload` |
| **Navigation** | `breadcrumb`, `menu` |

### Registration Example

```ts
import { TableProPlugin } from 'table-pro'
import { NInput, NButton, NTable, ... } from 'naive-ui'

app.use(TableProPlugin, {
  components: {
    input: NInput,
    button: NButton,
    table: NTable,
    // ... all other components
  },
  config: {
    debug: true,
    text: '暂无数据', // default prompt text when no value is provided
  },
})
```

Components are injected via `inject(TABLE_COMPONENTS_KEY)` and accessible as `injection.components.input`, etc.

### Global Styles

A global stylesheet is imported in `src/main.ts`:
- **File**: `src/styles/global.css`
- **Rule**: `#app { padding: 20px; margin: 20px; }`

## Coding Patterns

### getComponent 重复调用 → 提取为变量

模板中多次使用的 `getComponent('xxx')` 必须提取为变量，避免每次渲染都调用函数：

```ts
// ❌ 模板中重复调用
<component :is="getComponent('button')" @click="fn1">取消</component>
<component :is="getComponent('button')" type="primary" @click="fn2">确认</component>

// ✅ 提取为变量
const Button = getComponent('button')
const Space = getComponent('space')
// 模板中用 <component :is="Button" ...>
```

已提取变量的组件：Table.vue（`Button`, `Space`）、Search.vue（`button`）、FormRenderer.vue（`FormItem`, `GridItem`）、Modal.vue（`Button`, `Space`）。

### 配置合并：全局默认 → 组件 props 覆盖

```ts
const globalComponentDefaults = injection.config?.components
const mergedXxxProps = computed(() => ({
  ...(globalComponentDefaults?.xxx ?? {}),
  ...props.xxxProps,
}))
```

### 插槽透传：TablePro → 子组件

TablePro 作为编排层，通过 `$slots` 动态透传给 Modal（Table 因需要 slot props 仍手动转发 `#action-col`）：

```vue
<Modal ...>
  <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
    <slot :name="name" v-bind="scope || {}" />
  </template>
</Modal>
```

### Modal 插槽动态映射

Modal 暴露逻辑插槽名（`#header` / `#actions`），内部通过 `modalAdapter.slots` 映射到 UI 库的实际插槽名，实现跨 UI 库兼容。

### 适配器模式：useComponentAdapter

内部组件通过 `useComponentAdapter` composable 自动映射 prop/event 名称，无需感知底层 UI 库：

```ts
const { mapProps, mapEvent } = useComponentAdapter('pagination')
// { page: 1 } → { current: 1 }（当配置了 props: { page: 'current' } 时）
const mappedProps = mapProps({ page: 1, itemCount: 100 })
```

适用于简单名称映射场景（Pagination、FormItem 等）。结构变换场景（Table 列格式、Dropdown 菜单结构）使用 adapter 组件或 `createAdapter` 工具函数。

### columnsToSchema 的 defaultSpan 参数

`columnsToSchema` 支持第三个参数 `defaultSpan`，控制表单字段的栅格跨度。naive-ui 默认 `1`（1列/行），antd 24 列栅格建议 `8`（3列/行）。通过 `TablePro` 的 `defaultSpan` prop 透传。

## Known Issues & Gotchas

### Search.vue 开发过程中的踩坑记录

- **模板中组件应走 ComponentMap 动态渲染**：原生 Naive UI 标签（`<n-form>` 等）需全部替换为 `<component :is="getComponent('form')"` 等动态组件，保持组件库与具体 UI 库解耦。
- **配置合并用 `v-bind` 整体绑定**：合并后的 props 对象（`mergedFormProps` / `mergedGridProps` / `mergedFormItemBaseProps`）通过 `v-bind` 整体传入模板，不要在模板中逐个写 prop。
- **展开运算符已处理覆盖，无需额外 fallback**：`{ ...globalDefaults, ...localProps }` 中后者自然覆盖前者，不需要再写一层条件默认值。
- **`gridProps` 中已包含 `cols`**：不要单独传 `cols` prop 给 `n-grid`，`cols` 已合并到 `mergedGridProps` 中。
- **`showSearchButton` / `showResetButton` 已移除**：搜索和重置按钮始终显示，不需要条件渲染。
- **具名插槽应包裹整个按钮组件，而非仅替换内部文本**：`<slot name="search">` 应包裹整个 `<component :is="getComponent('button')..." >` 元素，这样插槽使用者才能替换按钮的类型、样式、事件绑定等全部行为。
- **`inputNumber` 组件的校验 trigger 不能用 `'input'`**：`n-input-number` 触发的是 `change` 事件而非 `input`，rules 中 `trigger` 需设为 `['blur', 'change']`。`n-input` 则用 `'input'` / `'blur'`。不同组件的事件名称不同，需按组件类型选择正确的 trigger。

## Recent Development History

- **2026-06-13**: Added `ComponentMap` with 45+ strongly-typed Naive UI component definitions in `src/index.ts`
- **2026-06-13**: Added JSDoc comments with `@description`, `@default`, `@example` to `TableProConfig` fields in `src/index.ts` for IDE hover hints
- **2026-06-13**: Configured all Naive UI components in `src/main.ts` and passed them to `TableProPlugin`
- **2026-06-13**: Added global CSS stylesheet `src/styles/global.css` with `#app { padding: 20px; margin: 20px }`
- **2026-06-19**: Added Ant Design Vue dual-app demo with adapter components (AntdTableAdapter, AntdDropdownAdapter)
- **2026-06-19**: Added `ComponentAdapter` / `AdaptersConfig` types and `adapters` config in `TableProConfig`
- **2026-06-19**: Added `useComponentAdapter` composable for declarative prop/event/slot name mapping
- **2026-06-19**: Added `createAdapter` utility function for generating adapter components from config
- **2026-06-19**: Added `defaultSpan` parameter to `columnsToSchema` and `defaultSpan` prop to `TablePro`
