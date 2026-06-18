# 公共方法与类型抽取设计文档

**日期：** 2026-06-18
**范围：** 抽取 4 个公共 composable/工具函数 + 修复 6 个类型问题 + 统一 getComponent 用法

## 背景

Code review 发现以下重复模式和类型问题：

- 配置合并模式 `...(globalDefaults?.x ?? {}), ...props.xProps` 重复 6 处（4 个文件）
- 分页同步模式（refs + watchers）在 Pagination.vue 和 TablePro.vue 完全重复
- Schema 派生的 `.map()` 体在 TablePro.vue 中重复 2 次
- 响应式对象清空重赋值在 FormRenderer.vue 和 Modal.vue 重复
- `confirmHandlers` 类型内联定义 3 次
- `ActionItem` 从 .vue 文件导出（应放 types/）
- `SearchField.type` 是必填但使用时都 fallback 到 `'input'`
- 3 处 `@ts-expect-error`（FormRenderer expose 类型不完整）
- Table.vue 需要包装函数来覆盖 getComponent 的 fallback 链

## 设计

### 1. `useMergedProps` composable

**文件：** `src/composables/useMergedProps.ts`

**职责：** 合并全局默认配置与组件本地 props，返回响应式 computed。

**签名：**
```ts
function useMergedProps<T extends Record<string, unknown>>(
  sectionKey: keyof ComponentDefaultsConfig,
  localProps: MaybeRefOrGetter<T>,
  defaults?: Partial<T>,
): ComputedRef<T>
```

**行为：**
- 内部调用 `useComponentMap()` 获取 injection，调用方无需手动提取 `globalComponentDefaults`
- 返回 `computed(() => ({ ...globalDefaults, ...defaults, ...toValue(localProps) }))`
- `defaults` 处理内联默认值（如 FormRenderer 的 grid 默认 `{ cols: 4, xGap: 12, yGap: 8 }`）
- `sectionKey` 对应 `ComponentDefaultsConfig` 的 key（`'form'` / `'grid'` / `'formItem'` / `'table'` / `'modal'` / `'pagination'`）

**替换范围：**
- Table.vue:128（`mergedTableProps`，同时修复非 computed 的 bug）
- FormRenderer.vue:116, 122, 134（`mergedFormProps` / `mergedGridProps` / `mergedFormItemBaseProps`）
- Modal.vue:126（`mergedModalProps`，Modal 额外追加 visibleProp 不在此 composable 范围内，保留手动合并）
- Pagination.vue:66（`mergedPaginationProps`，Pagination 额外排除 page/pageSize 的逻辑保留手动处理）

**注释要求：** JSDoc 注释包含 `@description`、`@param`、`@returns`、`@example`。

---

### 2. `usePaginationState` composable

**文件：** `src/composables/usePaginationState.ts`

**职责：** 统一管理分页状态的双向绑定，消除 refs + watchers 双状态问题。

**签名：**
```ts
function usePaginationState(
  props: { page: number; pageSize: number },
  emit: {
    (event: 'update:page', value: number): void
    (event: 'update:pageSize', value: number): void
    (event: 'change', page: number, pageSize: number): void
  },
): {
  page: WritableComputedRef<number>
  pageSize: WritableComputedRef<number>
  onPageChange: (newPage: number, newPageSize: number) => void
}
```

**行为：**
- `page` / `pageSize` 用 `computed({ get, set })` 替代 refs + watchers
- `onPageChange` 统一处理：设置 page/pageSize + emit update 事件 + emit change 事件
- pageSize 变化时自动重置 page 为 1（修复已知 bug：用户在第 10 页切换 pageSize 后页码越界）

**替换范围：**
- Pagination.vue:82-111（currentPage/currentPageSize refs + 两个 watchers + onPageChange + onPageSizeChange）
- TablePro.vue:159-184（currentPage/currentPageSize refs + 两个 watchers + handlePageChange）

**注释要求：** JSDoc 注释包含 `@description`、`@param`、`@returns`、`@example`。

---

### 3. `columnsToSchema` 工具函数

**文件：** `src/types/table.ts`（与 TableColumn 同文件）

**职责：** 将 TableColumn[] 按过滤条件转换为 SearchField[]。

**签名：**
```ts
function columnsToSchema(
  columns: TableColumn[],
  filter: (col: TableColumn) => boolean,
): SearchField[]
```

**行为：**
- 纯函数，不依赖 Vue
- `.filter(filter).map(...)` 提取公共 map 体
- 同时修复 `SearchField.type` 改为可选（`type?: keyof ComponentMap`），消除 `as SearchField['type']` 强制转换

**替换范围：**
- TablePro.vue:120-130（searchSchema computed）
- TablePro.vue:195-205（derivedFormSchema computed）

**注释要求：** JSDoc 注释包含 `@description`、`@param`、`@returns`、`@example`。

---

### 4. `clearAndReassign` 工具函数

**文件：** `src/utils/reactive.ts`

**职责：** 清空响应式对象的所有 key 并重新赋值，保持同一引用。

**签名：**
```ts
function clearAndReassign(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): void
```

**行为：**
- 遍历 `Object.keys(target)` 逐个 `delete`
- `Object.assign(target, source)` 重新赋值
- 保持 target 的响应式引用不变

**替换范围：**
- FormRenderer.vue:102-106（watch modelValue 中的清空循环）
- Modal.vue:152-154（watch visible 中的清空循环）

**注释要求：** JSDoc 注释包含 `@description`、`@param`、`@example`。

---

### 5. 类型整理

#### 5.1 新建 `src/types/common.ts`

```ts
/** Modal 确认回调，按模式分发 */
export interface ConfirmHandlers {
  /** 新增模式确认回调 */
  add?: (formData: Record<string, unknown>) => void
  /** 编辑模式确认回调 */
  edit?: (formData: Record<string, unknown>) => void
  /** 详情模式确认回调 */
  detail?: (formData: Record<string, unknown>) => void
}

/** 操作按钮项 */
export interface ActionItem {
  /** 按钮文案 */
  label: string
  /** 点击回调 */
  onClick: () => void
  /** 按钮的额外属性，通过 v-bind 绑定（如 type: 'primary'） */
  meta?: Record<string, unknown>
}
```

**替换范围：**
- TablePro.vue:77-81（内联 confirmHandlers 类型）
- Modal.vue:64-68（内联 confirmHandlers 类型）
- TableAction.vue:37-42（ActionItem 导出）

#### 5.2 修改 `src/types/search.ts`

- `SearchField.type` 从 `type: keyof ComponentMap` 改为 `type?: keyof ComponentMap`
- 消除 TablePro.vue 中两处 `as SearchField['type']` 强制转换

#### 5.3 修改 `src/index.ts`

- `TableProInjection` 改为 `export interface`（composable 依赖其类型）

#### 5.4 FormRenderer expose 类型修复

- 创建 `FormRendererInstance` 类型：
  ```ts
  export interface FormRendererInstance {
    formRef: ComponentPublicInstance | null
    formValue: Record<string, unknown>
  }
  ```
- FormRenderer.vue 的 `defineExpose` 保持不变
- Modal.vue:141 改为 `ref<FormRendererInstance | null>(null)`，消除 2 处 `@ts-expect-error`
- Search.vue:91 改为 `ref<FormRendererInstance | null>(null)`，消除 1 处 `@ts-expect-error`

---

### 6. `useComponentMap` 增强

**修改文件：** `src/composables/useComponentMap.ts`

**变更：**
```ts
export function useComponentMap(defaultFallbacks?: string[]) {
  // ...
  function getComponent(type: string, fallbacks = defaultFallbacks ?? ['input']) {
    // ...
  }
  return { componentMap, getComponent, injection }
}
```

**替换范围：**
- Table.vue:104, 109-111（删除本地包装函数，改为 `useComponentMap(['text', 'input'])`）
- FormRenderer.vue:3, 5（提取 `getComponent('form')` 和 `getComponent('grid')` 为变量 `Form` 和 `Grid`）

**注释要求：** 更新 useComponentMap 的 JSDoc，说明 `defaultFallbacks` 参数。

---

## 注释规范

所有新增/修改的代码遵循以下注释规范：

1. **Composable 函数：** JSDoc 块注释，包含 `@description`、`@param`、`@returns`、`@example`
2. **工具函数：** JSDoc 块注释，包含 `@description`、`@param`、`@example`
3. **TypeScript 接口：** 每个字段上方行内 `/** 注释 */`
4. **关键逻辑行：** 行尾 `// 注释` 说明 why 而非 what
5. **composable 内部：** 分节注释 `// ========================================================================` + `// 标题`

---

## 文件变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 新建 | `src/composables/useMergedProps.ts` | 配置合并 composable |
| 新建 | `src/composables/usePaginationState.ts` | 分页状态 composable |
| 新建 | `src/utils/reactive.ts` | clearAndReassign 工具函数 |
| 新建 | `src/types/common.ts` | ConfirmHandlers + ActionItem 类型 |
| 修改 | `src/composables/useComponentMap.ts` | 增加 defaultFallbacks 参数 |
| 修改 | `src/types/search.ts` | SearchField.type 改为可选 |
| 修改 | `src/types/table.ts` | 新增 columnsToSchema 函数 |
| 修改 | `src/index.ts` | 导出 TableProInjection |
| 修改 | `src/components/FormRenderer.vue` | 使用 useMergedProps + clearAndReassign + 提取 Form/Grid 变量 + 导出 FormRendererInstance |
| 修改 | `src/components/Table.vue` | 使用 useMergedProps + useComponentMap(['text', 'input']) |
| 修改 | `src/components/Modal.vue` | 使用 clearAndReassign + ConfirmHandlers 类型 + FormRendererInstance |
| 修改 | `src/components/Pagination.vue` | 使用 useMergedProps + usePaginationState |
| 修改 | `src/components/TablePro.vue` | 使用 usePaginationState + columnsToSchema + ConfirmHandlers 类型 |
| 修改 | `src/components/TableAction.vue` | ActionItem 改为从 types/common.ts 导入 |
| 修改 | `src/components/Search.vue` | FormRendererInstance 类型 |
