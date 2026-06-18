# table-pro

Vue 3 后台管理表格组件库 —— schema 驱动的可配置数据表格，内置搜索、多选、批量操作、新增/编辑弹窗、分页。

基于 Naive UI，通过 ComponentMap 动态渲染实现与具体 UI 库解耦。

## 快速开始

```sh
npm install
npm run dev      # 开发服务器 (http://localhost:5173)
npm run build    # 类型检查 + 生产构建
```

## 架构概览

```
App.vue                      ← 消费者：定义 columns + data + 业务逻辑
  └─ TablePro.vue            ← 编排层：Search + Table + Pagination + Modal
       ├─ Search.vue         ← 搜索表单（展开/折叠 + 搜索/重置按钮）
       │    └─ FormRenderer  ← 纯表单字段渲染（form → grid → fields）
       ├─ Table.vue          ← 数据表格（多选 + 批量删除 + 操作列）
       │    └─ TableAction   ← 操作按钮 + 下拉菜单
       ├─ Pagination.vue     ← 分页（v-model:page / v-model:pageSize）
       └─ Modal.vue          ← 新增/编辑/详情弹窗
            └─ FormRenderer
```

### 数据流

```
columns ──┬── searchSchema (config.isSearch) ──→ Search ──→ FormRenderer
          ├── effectiveColumns (过滤 hidden)   ──→ Table
          ├── derivedFormSchema (过滤 hidden)  ──→ Modal ──→ FormRenderer
          └── columnToSchema 工具函数统一派生
```

### 配置合并策略

所有组件遵循三层配置合并：**全局默认 → 组件 props 覆盖**

```
injection.config.components.form  (全局)
  + props.formProps                (组件级)
  ────────────────────────────
  = mergedFormProps                (最终值，computed 响应式)
```

通过 `useMergedProps` composable 统一处理，避免各组件重复实现。

---

## 目录结构

```
src/
├── index.ts                        # 插件入口，导出所有类型和 TableProPlugin
├── main.ts                         # 开发用 App 入口
├── App.vue                         # 开发用 Demo 页面
├── types/
│   ├── common.ts                   # 共享类型（ConfirmHandlers / ActionItem / FormRendererInstance）
│   ├── table.ts                    # 表格相关类型（TableColumn / ColumnConfig / columnsToSchema）
│   └── search.ts                   # 搜索相关类型（SearchField）
├── composables/
│   ├── useComponentMap.ts          # 组件映射注入钩子（inject + getComponent）
│   ├── useMergedProps.ts           # 配置合并钩子（全局默认 + 本地 props）
│   └── usePaginationState.ts       # 分页状态钩子（computed get/set 双向绑定）
├── utils/
│   └── reactive.ts                 # 响应式工具函数（clearAndReassign）
└── components/
    ├── TablePro.vue                # 顶层编排组件
    ├── Table.vue                   # 数据表格
    ├── Search.vue                  # 搜索表单
    ├── FormRenderer.vue            # 表单字段渲染器
    ├── Pagination.vue              # 分页
    ├── Modal.vue                   # 弹窗
    └── TableAction.vue             # 操作按钮
```

---

## 组件

### TablePro

顶层编排组件，接收配置并协调 Search / Table / Pagination / Modal 子组件。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `TableColumn[]` | — | 列配置（必传） |
| `data` | `Record<string, unknown>[]` | `[]` | 表格数据 |
| `formProps` | `FormConfig` | `{}` | 搜索表单的 n-form props |
| `confirmHandlers` | `ConfirmHandlers` | `{}` | Modal 确认回调（按模式分发） |
| `page` | `number` | `1` | 当前页码（v-model） |
| `pageSize` | `number` | `10` | 每页条数（v-model） |
| `itemCount` | `number` | `0` | 总条目数 |
| `paginationProps` | `PaginationConfig` | `{}` | n-pagination 的 props |

**Events：**

| Event | 参数 | 说明 |
|-------|------|------|
| `search` | `values: Record<string, unknown>` | 点击搜索按钮 |
| `reset` | — | 点击重置按钮 |
| `batch-delete` | `keys: unknown[]` | 点击批量删除 |
| `change` | `(page: number, pageSize: number)` | 分页变化 |
| `update:page` | `page: number` | 页码变化（v-model） |
| `update:pageSize` | `pageSize: number` | 每页条数变化（v-model） |

**Slots：**

| Slot | Props | 说明 |
|------|-------|------|
| `action-col` | `{ row }` | 操作列内容（每行调用） |
| `header` | — | Modal 头部（覆盖默认标题） |
| `actions` | `{ onConfirm, onCancel }` | Modal 底部按钮 |

**Exposed：**

| 方法 | 参数 | 说明 |
|------|------|------|
| `openAdd()` | — | 打开新增弹窗 |
| `openEdit(row)` | `Record<string, unknown>` | 打开编辑弹窗，回填行数据 |
| `openDetail(row)` | `Record<string, unknown>` | 打开详情弹窗（只读） |

---

### Table

数据表格组件，通过 ComponentMap 动态渲染 n-data-table。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `TableColumn<T>[]` | `[]` | 列配置 |
| `data` | `T[]` | `[]` | 表格数据 |
| `showAdd` | `boolean` | `true` | 显示新增按钮 |
| `rowKey` | `string` | `'id'` | 行唯一标识字段 |
| `tableProps` | `TableConfig` | `{}` | n-table 的 props |

**Events：**

| Event | 参数 | 说明 |
|-------|------|------|
| `action` | `(actionKey: string, row?: T)` | 操作按钮点击 |
| `batch-delete` | `keys: unknown[]` | 批量删除 |

**Slots：**

| Slot | Props | 说明 |
|------|-------|------|
| `action-col` | `{ row }` | 操作列（每行调用） |
| `toolbar` | — | 工具栏（覆盖默认新增/批量删除按钮） |

**说明：**
- 操作列通过 `#action-col` slot 提供，不提供则不显示
- 多选列由 n-data-table 内置 selection 列提供
- 批量删除按钮在有选中行时自动显示

---

### Search

搜索表单组件，内置展开/折叠功能，内部使用 FormRenderer 渲染字段。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `schema` | `SearchField[]` | — | 搜索字段配置（必传） |
| `modelValue` | `Record<string, unknown>` | `{}` | 表单数据（v-model） |
| `defaultVisibleCount` | `number` | `3` | 折叠时默认显示字段数 |
| `formProps` | `FormConfig` | `{}` | n-form 的 props |
| `gridProps` | `GridConfig` | `{}` | n-grid 的 props |
| `formItemProps` | `FormItemConfig` | `{}` | n-form-item 的 props |

**Events：**

| Event | 参数 | 说明 |
|-------|------|------|
| `search` | `values: Record<string, unknown>` | 点击搜索按钮（校验通过后触发） |
| `reset` | — | 点击重置按钮 |
| `update:modelValue` | `Record<string, unknown>` | 表单数据变化 |

**说明：**
- 搜索和重置按钮始终显示
- 字段数超过 `defaultVisibleCount` 时自动显示展开/折叠按钮
- 搜索前会调用 FormRenderer 的表单校验

---

### FormRenderer

纯表单字段渲染器，不含操作按钮。被 Search 和 Modal 内部使用。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `schema` | `SearchField[]` | — | 字段配置（必传） |
| `modelValue` | `Record<string, unknown>` | `{}` | 表单数据（v-model） |
| `formProps` | `FormConfig` | `{}` | n-form 的 props |
| `gridProps` | `GridConfig` | `{}` | n-grid 的 props |
| `formItemProps` | `FormItemConfig` | `{}` | n-form-item 的 props |

**Events：**

| Event | 参数 | 说明 |
|-------|------|------|
| `update:modelValue` | `Record<string, unknown>` | 表单数据变化 |

**Slots：**

| Slot | 说明 |
|------|------|
| `actions` | 操作按钮区域（渲染在 grid 末尾） |

**Exposed：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `formRef` | `ComponentPublicInstance \| null` | n-form 组件 ref，可调用 `validate()` |
| `formValue` | `Record<string, unknown>` | 表单响应式数据 |

---

### Pagination

分页组件，封装 n-pagination，支持 v-model 双向绑定。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | `number` | `1` | 当前页码（v-model） |
| `pageSize` | `number` | `10` | 每页条数（v-model） |
| `pageCount` | `number` | `1` | 总页数 |
| `itemCount` | `number` | `0` | 总条目数 |
| `paginationProps` | `PaginationConfig` | `{}` | n-pagination 的 props |

**Events：**

| Event | 参数 | 说明 |
|-------|------|------|
| `update:page` | `page: number` | 页码变化 |
| `update:pageSize` | `pageSize: number` | 每页条数变化 |
| `change` | `(page: number, pageSize: number)` | 统一变化回调 |

**说明：**
- 使用 `usePaginationState` composable 管理双向绑定，computed get/set 替代 refs + watchers
- 切换每页条数时自动重置页码为 1，避免页码越界

---

### Modal

新增/编辑/详情弹窗，支持跨 UI 库的插槽名映射。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `visible` | `boolean` | `false` | 显隐控制 |
| `mode` | `'add' \| 'edit' \| 'detail'` | `'add'` | 弹窗模式 |
| `rowData` | `T \| null` | `null` | 编辑/详情时的行数据 |
| `formSchema` | `SearchField[]` | `[]` | 表单字段配置 |
| `modalProps` | `ModalConfig` | `{}` | n-modal 的 props |
| `confirmHandlers` | `ConfirmHandlers` | `{}` | 确认回调（按模式分发） |

**Events：**

| Event | 参数 | 说明 |
|-------|------|------|
| `update:visible` | `boolean` | 显隐变化 |
| `cancel` | — | 点击取消 |

**Slots：**

| Slot | Props | 说明 |
|------|-------|------|
| `header` | — | 标题（默认：新增/编辑/详情） |
| `actions` | `{ onConfirm, onCancel }` | 底部按钮（默认：取消+确认） |

**说明：**
- 详情模式下自动禁用所有表单项（`disabled: true`）
- 详情模式不显示确认按钮
- 通过 `modalAdapter` 配置实现跨 UI 库兼容（插槽名映射、可见性 prop/事件名）

---

### TableAction

操作列按钮组件，支持主要按钮和下拉菜单两种形式。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `actions` | `ActionItem[]` | `[]` | 主要操作按钮 |
| `dropDownActions` | `ActionItem[]` | `[]` | 下拉菜单项 |

---

## 类型

### 共享类型（`src/types/common.ts`）

```ts
/** Modal 确认回调，按模式分发 */
interface ConfirmHandlers {
  add?: (formData: Record<string, unknown>) => void
  edit?: (formData: Record<string, unknown>) => void
  detail?: (formData: Record<string, unknown>) => void
}

/** 操作按钮项 */
interface ActionItem {
  label: string                        // 按钮文案
  onClick: () => void                  // 点击回调
  meta?: Record<string, unknown>       // 按钮 v-bind 属性（如 type: 'primary'）
}

/** FormRenderer 组件实例类型 */
interface FormRendererInstance {
  formRef: Record<string, unknown> | null   // n-form ref
  formValue: Record<string, unknown>        // 表单数据
}
```

### TableColumn（`src/types/table.ts`）

```ts
interface TableColumn<T = unknown> {
  key: string                              // 字段名
  title: string                            // 列标题
  type?: keyof ComponentMap                // 单元格渲染组件（默认 'text'）
  componentProps?: Record<string, unknown> // 渲染组件的额外 props
  sortable?: boolean                       // 是否可排序
  width?: number | string                  // 列宽
  fixed?: 'left' | 'right'                // 固定列
  hidden?: boolean                         // 是否隐藏
  render?: (row: T) => unknown             // 自定义渲染函数
  config?: ColumnConfig                    // 行为配置
  meta?: Record<string, unknown>           // 表单控件 v-bind 属性
}
```

### ColumnConfig（`src/types/table.ts`）

```ts
interface ColumnConfig {
  isNew?: boolean               // 是否参与新增表单
  isSearch?: boolean            // 是否参与搜索表单
  type?: keyof ComponentMap     // 表单控件类型（input / select / datePicker ...）
}
```

### SearchField（`src/types/search.ts`）

```ts
interface SearchField {
  name: string                          // 字段名
  label: string                         // 表单项 label
  type?: keyof ComponentMap             // 组件类型（默认 'input'）
  componentProps?: Record<string, unknown> // 组件 props
  span?: number                         // 栅格列数（默认 1）
  rules?: unknown[]                     // 校验规则
}
```

### 配置类型（`src/index.ts`）

```ts
// 表单配置
interface FormConfig {
  inline?: boolean
  labelWidth?: number
  labelAlign?: 'left' | 'right' | 'auto'
  labelPlacement?: 'left' | 'right' | 'top'
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

// 网格配置
interface GridConfig {
  cols?: number | string
  xGap?: number | string
  yGap?: number | string
  responsive?: 'self' | 'screen'
  collapsed?: boolean
  collapsedRows?: number
}

// 表单项配置
interface FormItemConfig {
  labelWidth?: number | string
  labelPlacement?: 'left' | 'right' | 'top'
  showLabel?: boolean
  showFeedback?: boolean
}

// 表格配置
interface TableConfig {
  size?: 'tiny' | 'small' | 'medium' | 'large'
  bordered?: boolean
  striped?: boolean
  loading?: boolean
  maxHeight?: number
}

// 弹窗配置
interface ModalConfig {
  preset?: 'dialog' | 'card'
  style?: string | Record<string, unknown>
  closable?: boolean
  maskClosable?: boolean
}

// 分页配置
interface PaginationConfig {
  pageSizes?: number[]
  showSizePicker?: boolean
  showQuickJumper?: boolean
  size?: 'small' | 'medium' | 'large'
}

// 组件默认配置映射
interface ComponentDefaultsConfig {
  form?: FormConfig
  grid?: GridConfig
  space?: SpaceConfig
  formItem?: FormItemConfig
  table?: TableConfig
  modal?: ModalConfig
  pagination?: PaginationConfig
}

// Modal 适配器（跨 UI 库兼容）
interface ModalAdapter {
  visibleProp?: string       // 可见性 prop 名（如 'show' / 'visible'）
  visibleEvent?: string      // 可见性事件名（如 'update:show' / 'update:visible'）
  slots?: {
    header?: string          // 头部插槽名
    actions?: string         // 底部操作插槽名
  }
}
```

---

## 工具函数

### columnsToSchema（`src/types/table.ts`）

将列配置按过滤条件转换为表单 schema。

```ts
import { columnsToSchema } from '@/types/table'
import type { TableColumn } from '@/types/table'

// 搜索表单：仅包含 isSearch 为 true 的列
const searchSchema = columnsToSchema(columns, (col) => !!col.config?.isSearch)

// 编辑表单：包含所有未隐藏的列
const formSchema = columnsToSchema(columns, (col) => !col.hidden)
```

### clearAndReassign（`src/utils/reactive.ts`）

清空响应式对象的所有 key 并重新赋值，保持同一引用不变。

```ts
import { clearAndReassign } from '@/utils/reactive'
import { reactive } from 'vue'

const formValue = reactive<Record<string, unknown>>({})
// 外部数据变化时同步（常用于 watch 回调）
clearAndReassign(formValue, newFormData)
```

---

## Composables

### useComponentMap

统一的组件映射注入钩子，封装 `inject` + `getComponent`。

```ts
import { useComponentMap } from '@/composables/useComponentMap'

// 默认行为（回退到 input）
const { getComponent, injection } = useComponentMap()

// 自定义默认回退链（Table 组件回退到 text 再到 input）
const { getComponent } = useComponentMap(['text', 'input'])

// 使用
const Button = getComponent('button')        // 提取为变量，避免模板重复调用
const Input = getComponent('input', ['text']) // 单次调用时覆盖回退链
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `defaultFallbacks` | `string[]` | 可选的默认回退链，省略时使用 `['input']` |

**返回值：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `componentMap` | `ComponentMap` | 注入的组件映射表 |
| `getComponent` | `(type: string, fallbacks?: string[]) => Component \| undefined` | 组件查找函数 |
| `injection` | `TableProInjection` | 完整的注入对象（含 config） |

---

### useMergedProps

合并全局默认配置与组件本地 props，返回响应式 computed。

```ts
import { useMergedProps } from '@/composables/useMergedProps'
import type { FormConfig } from '@/index'

// 基本用法：全局默认 + 组件 props
const mergedFormProps = useMergedProps<FormConfig>('form', () => props.formProps)

// 带内联默认值：全局默认 + 内联默认 + 组件 props
const mergedGridProps = useMergedProps<GridConfig>('grid', () => props.gridProps, {
  cols: 4,
  xGap: 12,
  yGap: 8,
})
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `sectionKey` | `keyof ComponentDefaultsConfig` | 全局配置中的 section 名 |
| `localProps` | `MaybeRefOrGetter<T>` | 组件传入的本地配置 |
| `defaults` | `Partial<T>` | 可选的内联默认值 |

**返回值：** `ComputedRef<T>` — 合并后的响应式配置对象

**合并优先级：** `globalDefaults < defaults < localProps`

---

### usePaginationState

统一管理分页状态的双向绑定，用 computed get/set 替代 refs + watchers。

```ts
import { usePaginationState } from '@/composables/usePaginationState'

const { page, pageSize, onPageChange } = usePaginationState(props, emit)

// 模板中直接使用
// <Pagination v-model:page="page" v-model:page-size="pageSize" @change="onPageChange" />
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `props` | `{ page: number; pageSize: number }` | 包含 page 和 pageSize 的 props |
| `emit` | `PaginationEmit` | 组件的 emit 函数 |

**返回值：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `page` | `WritableComputedRef<number>` | 页码双向绑定 |
| `pageSize` | `WritableComputedRef<number>` | 每页条数双向绑定 |
| `onPageChange` | `(newPage: number, newPageSize: number) => void` | 统一变化处理（pageSize 变化时自动重置 page 为 1） |

---

## Schema 自动派生

TablePro 从 `columns` 自动生成搜索和表单 schema，无需手动维护：

- **搜索表单**：过滤 `config.isSearch === true` 的列，`config.type` → 控件类型，`meta` → 组件 props
- **新增/编辑表单**：过滤未隐藏的列，同样从 config 和 meta 派生

```ts
// 示例：一列同时参与搜索和表单
{
  key: 'applyNo',
  title: '申请编号',
  sortable: true,
  config: { isSearch: true, type: 'input' },  // 搜索 + 表单控件
  meta: { placeholder: '请输入申请编号' },       // v-bind 到控件
}
```

**派生规则：**

| 来源 | 目标字段 | 说明 |
|------|----------|------|
| `col.key` | `name` | 表单字段名 |
| `col.title` | `label` | 表单项标签 |
| `col.config?.type ?? 'input'` | `type` | 控件类型 |
| `1` | `span` | 栅格占列数 |
| `col.meta` | `componentProps` | 控件 props |

---

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import TablePro from '@/components/TablePro.vue'
import TableAction from '@/components/TableAction.vue'
import type { ActionItem } from '@/types/common'
import type { TableColumn } from '@/types/table'
import type { ConfirmHandlers } from '@/types/common'

interface RowData {
  id: number
  name: string
  status: string
}

const columns: TableColumn<RowData>[] = [
  { key: 'name', title: '名称', config: { isSearch: true, type: 'input' } },
  { key: 'status', title: '状态', config: { isSearch: true, type: 'select' } },
]

const data = ref<RowData[]>([
  { id: 1, name: 'admin', status: '启用' },
  { id: 2, name: 'user', status: '禁用' },
])

const page = ref(1)
const pageSize = ref(10)

const confirmHandlers: ConfirmHandlers = {
  add: (formData) => console.log('新增:', formData),
  edit: (formData) => console.log('编辑:', formData),
  detail: (formData) => console.log('详情:', formData),
}

function getTableAction(record: RowData): ActionItem[] {
  return [
    { label: '编辑', onClick: () => tableProRef.value?.openEdit(record as any) },
    { label: '删除', onClick: () => handleDelete(record) },
  ]
}

function getDropDownAction(record: RowData): ActionItem[] {
  return [
    { label: '详情', onClick: () => tableProRef.value?.openDetail(record as any) },
  ]
}

function handleDelete(record: RowData) {
  data.value = data.value.filter((r) => r.id !== record.id)
}

const tableProRef = ref()
</script>

<template>
  <TablePro
    ref="tableProRef"
    :columns="columns"
    :data="data"
    :confirm-handlers="confirmHandlers"
    v-model:page="page"
    v-model:page-size="pageSize"
    :item-count="100"
    @search="(v) => console.log('search:', v)"
    @reset="console.log('reset')"
    @batch-delete="(keys) => console.log('delete:', keys)"
    @change="(p, ps) => console.log('page change:', p, ps)"
  >
    <template #action-col="{ row }">
      <TableAction
        :actions="getTableAction(row)"
        :dropDownActions="getDropDownAction(row)"
      />
    </template>
  </TablePro>
</template>
```

### 自定义搜索按钮

```vue
<template>
  <TablePro :columns="columns" :data="data">
    <template #action-col="{ row }">
      <TableAction :actions="getTableAction(row)" />
    </template>
  </TablePro>
</template>
```

### 自定义 Modal 按钮

```vue
<template>
  <TablePro :columns="columns" :data="data" :confirm-handlers="confirmHandlers">
    <template #action-col="{ row }">
      <TableAction :actions="getTableAction(row)" />
    </template>
    <template #actions="{ onConfirm, onCancel }">
      <n-button @click="onCancel">取消</n-button>
      <n-button type="primary" @click="onConfirm">提交</n-button>
    </template>
  </TablePro>
</template>
```

---

## 插件注册

```ts
import { createApp } from 'vue'
import TableProPlugin from '@/index'
import {
  NInput, NTextarea, NSelect, NCascader,
  NDatePicker, NTimePicker, NSwitch,
  NRadioGroup, NRadio, NCheckboxGroup, NCheckbox,
  NInputNumber, NSlider, NRate, NColorPicker,
  NButton, NForm, NFormItem, NGrid, NGridItem, NSpace,
  NDataTable, NModal, NPagination, NDropdown,
  NTag, NTooltip, NPopover,
} from 'naive-ui'

const app = createApp(App)

app.use(TableProPlugin, {
  components: {
    input: NInput,
    textarea: NTextarea,
    select: NSelect,
    cascader: NCascader,
    datePicker: NDatePicker,
    timePicker: NTimePicker,
    switch: NSwitch,
    radioGroup: NRadioGroup,
    radio: NRadio,
    checkboxGroup: NCheckboxGroup,
    checkbox: NCheckbox,
    inputNumber: NInputNumber,
    slider: NSlider,
    rate: NRate,
    colorPicker: NColorPicker,
    button: NButton,
    form: NForm,
    formItem: NFormItem,
    grid: NGrid,
    gridItem: NGridItem,
    space: NSpace,
    table: NDataTable,
    modal: NModal,
    pagination: NPagination,
    dropdown: NDropdown,
    tag: NTag,
    tooltip: NTooltip,
    popover: NPopover,
  },
  config: {
    debug: true,
    // 全局组件默认配置：各子组件可在此基础上传入 props 覆盖
    components: {
      formItem: { labelWidth: 80, labelPlacement: 'left' },
      grid: { xGap: 12, yGap: 8, cols: 4 },
      pagination: { size: 'medium', showQuickJumper: true, showSizePicker: true },
      modal: { preset: 'dialog', style: { width: '80%' } },
    },
    // Modal 适配器：跨 UI 库兼容
    modalAdapter: {
      visibleProp: 'show',
      visibleEvent: 'update:show',
      slots: {
        header: 'header',
        actions: 'action',
      },
    },
  },
})
```

### 跨 UI 库适配

通过 `modalAdapter` 配置可以适配不同的 UI 库：

```ts
// Naive UI（默认）
modalAdapter: {
  visibleProp: 'show',
  visibleEvent: 'update:show',
  slots: { header: 'header', actions: 'action' },
}

// Ant Design Vue / Element Plus
modalAdapter: {
  visibleProp: 'visible',
  visibleEvent: 'update:visible',
  slots: { header: 'header', actions: 'footer' },
}
```

---

## 项目命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 (HMR) |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run build-only` | 仅构建（跳过类型检查） |
| `npm run type-check` | vue-tsc 类型检查 |
| `npm run format` | Prettier 格式化 |
| `npm run preview` | 预览生产构建 |

---

## 设计原则

1. **Schema 驱动**：列配置同时定义表格展示、搜索表单、编辑表单，一处定义多处复用
2. **ComponentMap 动态渲染**：所有 UI 组件通过 `<component :is>` 渲染，与具体 UI 库解耦
3. **三层配置合并**：全局默认 → 组件 props 覆盖，通过 `useMergedProps` 统一处理
4. **插槽透传**：TablePro 作为编排层，通过 `$slots` 动态透传给子组件
5. **类型安全**：完整的 TypeScript 类型定义，泛型支持行数据类型
