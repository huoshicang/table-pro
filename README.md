# Table Pro

开箱即用的 Vue 3 数据表格组件库。只需定义 `columns`，自动生成搜索表单、数据表格、分页、新增/编辑弹窗。

## 特性

- **Schema 驱动** — 一处定义 `columns`，搜索、表格、弹窗表单自动派生
- **UI 库无关** — 通过适配器机制支持 Naive UI、Ant Design Vue 等任意 UI 库
- **三层配置合并** — 全局默认 → 组件 props 覆盖，统一管理默认值
- **TypeScript** — 完整类型推导，配置项有 JSDoc 悬浮提示

---

## 快速开始

### 1. 安装

```sh
npm install table-pro
```

### 2. 注册插件

在 `main.ts` 中注册插件，传入你使用的 UI 库组件和配置：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { TableProPlugin } from 'table-pro'
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
  // ① 组件映射（必填）：将 UI 库组件注册到 ComponentMap
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

  // ② 全局配置（可选）：设置默认值，实例可覆盖
  config: {
    components: {
      formItem: { labelWidth: 80, labelPlacement: 'left' },
      grid: { xGap: 12, yGap: 8, cols: 4 },
      pagination: { pageSizes: [10, 20, 50] },
      modal: { preset: 'dialog', style: { width: '80%' } },
    },
    modalAdapter: {
      visibleProp: 'show',
      visibleEvent: 'update:show',
      slots: { header: 'header', actions: 'action' },
    },
    adapters: {},
  },
})

app.mount('#app')
```

### 3. 使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import TablePro from 'table-pro'
import type { TableColumn } from 'table-pro'

const columns: TableColumn[] = [
  { key: 'name', title: '名称', config: { isSearch: true, type: 'input' } },
  { key: 'status', title: '状态', config: { isSearch: true, type: 'select' } },
]

const data = ref([
  { id: 1, name: 'admin', status: '启用' },
  { id: 2, name: 'user', status: '禁用' },
])

const pagination = ref({ page: 1, pageSize: 10, itemCount: 100 })
</script>

<template>
  <TablePro
    :columns="columns"
    :data="data"
    v-model:pagination="pagination"
    @search="(v) => console.log('搜索:', v)"
    @change="(page, size) => console.log('分页:', page, size)"
  />
</template>
```

运行 `npm run dev` 即可看到效果。

---

## 配置指南

插件的 `config` 对象包含 3 个部分：`components`（全局默认值）、`modalAdapter`（弹窗适配）、`adapters`（prop/event 名称映射）。

简单理解：
- **`components`** — 设置 UI 组件的**默认属性值**（如表单默认 label 宽度、分页默认每页条数选项）
- **`adapters`** — 设置 prop/event 的**名称映射**（如内部叫 `page`，antd 叫 `current`）
- **`modalAdapter`** — Modal 组件专用的适配配置（显隐 prop/事件名 + 插槽名映射）

### components — 全局默认值

为各 UI 组件设置全局默认属性。实例级 props 会覆盖这里的值。

#### 速查表

| Key | 对应 UI 组件 | 作用 | 必填 |
|-----|-------------|------|------|
| `form` | Naive UI: `NForm` / antd: `AForm` | 表单组件的全局默认属性 | 否 |
| `grid` | Naive UI: `NGrid` / antd: `Row` | 栅格布局组件的全局默认属性 | 否 |
| `formItem` | Naive UI: `NFormItem` / antd: `AFormItem` | 表单项组件的全局默认属性 | 否 |
| `table` | Naive UI: `NDataTable` / antd: `ATable` | 表格组件的全局默认属性 | 否 |
| `pagination` | Naive UI: `NPagination` / antd: `APagination` | 分页组件的全局默认属性 | 否 |
| `modal` | Naive UI: `NModal` / antd: `AModal` | 弹窗组件的全局默认属性 | 否 |

> **注意**：`pagination.pageSizes` 只能在这里全局配置，实例级 props 无法覆盖。

#### 完整示例

```ts
config: {
  components: {
    // 表单：对应 UI 库的表单组件（Naive UI: NForm，antd: AForm）
    // 填入该 UI 库表单组件支持的 props，如 labelPlacement、disabled 等
    form: {},

    // 栅格：对应 UI 库的栅格组件（Naive UI: NGrid，antd: Row）
    // 填入该 UI 库栅格组件支持的 props，如 cols、xGap、yGap 等
    grid: {},

    // 表单项：对应 UI 库的表单项组件（Naive UI: NFormItem，antd: AFormItem）
    // 填入该 UI 库表单项组件支持的 props，如 labelWidth、labelPlacement 等
    formItem: {},

    // 表格：对应 UI 库的表格组件（Naive UI: NDataTable，antd: ATable）
    // 填入该 UI 库表格组件支持的 props，如 bordered、size 等
    table: {},

    // 分页：对应 UI 库的分页组件（Naive UI: NPagination，antd: APagination）
    // pageSizes 是框架层面的配置，只能在这里全局设置
    pagination: {
      pageSizes: [10, 20, 50],
    },

    // 弹窗：对应 UI 库的弹窗组件（Naive UI: NModal，antd: AModal）
    // 填入该 UI 库弹窗组件支持的 props，如 preset、style、maskClosable 等
    modal: {},
  },
}
```

#### 说明

每个 key 对应一个 UI 组件，填入你所用 UI 库的原生 props 即可，框架会透传给对应组件。

不同 UI 库的 props 不同（如 `bordered` 在 Naive UI 中有，在其他库可能没有），请参考你所用 UI 库的文档。

> **特殊说明**：`pagination.pageSizes` 是框架层面的配置（每页条数选项），只能在全局 config 中设置，实例级 props 无法覆盖。

---

### modalAdapter — 弹窗适配配置

Modal 组件的显隐 prop/事件名和插槽名在不同 UI 库中不同。`modalAdapter` 用于映射这些名称。

#### 速查表

| Key | 作用 | 必填 | 默认值 | 说明 |
|-----|------|------|--------|------|
| `visibleProp` | 控制弹窗显隐的 prop 名 | 否 | `'show'` | Naive UI 用 `show`，antd 用 `open` |
| `visibleEvent` | 弹窗显隐变化的事件名 | 否 | `'update:show'` | Naive UI 用 `update:show`，antd 用 `update:open` |
| `slots` | 插槽名映射 | 否 | `{ header: 'header', actions: 'action' }` | key 固定，value 是 UI 库的实际插槽名 |

#### slots 子属性

| Key（固定） | 作用 | Naive UI 默认值 | Ant Design Vue |
|-------------|------|-----------------|----------------|
| `header` | 弹窗头部插槽 | `'header'` | `'header'` 或 `'title'` |
| `actions` | 弹窗底部操作按钮插槽 | `'action'` | `'footer'` |

> **说明**：`header` 和 `actions` 这两个 key 是固定的，你只需要修改 value 来匹配你使用的 UI 库。

#### 完整示例

```ts
// Naive UI（默认值，可省略）
config: {
  modalAdapter: {
    visibleProp: 'show',           // NModal 的显隐 prop
    visibleEvent: 'update:show',   // NModal 的显隐事件
    slots: {
      header: 'header',            // NModal 的头部插槽名
      actions: 'action',           // NModal 的底部按钮插槽名
    },
  },
}

// Ant Design Vue
config: {
  modalAdapter: {
    visibleProp: 'open',           // AModal 的显隐 prop
    visibleEvent: 'update:open',   // AModal 的显隐事件
    slots: {
      header: 'title',             // AModal 的标题插槽名
      actions: 'footer',           // AModal 的底部按钮插槽名
    },
  },
}
```

---

### adapters — prop/event 名称映射

当内部组件使用的 prop/event 名称与 UI 库不同时，通过 `adapters` 配置映射。

**什么时候需要配置？**
- 内部组件使用 `page`，但你的 UI 库用 `current` → 需要映射
- 内部组件使用 `itemCount`，但你的 UI 库用 `total` → 需要映射
- 内部组件使用 `pageSizes`，但你的 UI 库用 `pageSizeOptions` → 需要映射

**什么时候不需要配置？**
- 你使用的 UI 库的 prop 名称和内部组件一致 → 不需要配置，传 `{}` 即可

#### 可配置的 Key

| Key | 作用 | 必填 | 默认值 |
|-----|------|------|--------|
| `form` | 表单组件的 prop/event 映射 | 否 | `{}` |
| `grid` | 栅格组件的 prop/event 映射 | 否 | `{}` |
| `formItem` | 表单项组件的 prop/event 映射 | 否 | `{}` |
| `table` | 表格组件的 prop/event 映射 | 否 | `{}` |
| `pagination` | 分页组件的 prop/event 映射 | 否 | `{}` |
| `dropdown` | 下拉菜单组件的 prop/event 映射 | 否 | `{}` |

#### 每个 Key 的子属性

| 子属性 | 类型 | 作用 |
|--------|------|------|
| `props` | `Record<string, string>` | prop 名称映射，key 是内部名，value 是 UI 库名 |
| `events` | `Record<string, string>` | 事件名称映射，key 是内部名，value 是 UI 库名 |
| `slots` | `Record<string, string>` | 插槽名称映射，key 是内部名，value 是 UI 库名 |

#### 完整示例

```ts
// Naive UI（不需要映射，传空对象）
config: {
  adapters: {
    form: {},
    grid: {},
    formItem: {},
    table: {},
    pagination: {},
    dropdown: {},
  },
}

// Ant Design Vue（需要映射）
config: {
  adapters: {
    // form: antd 的 AForm 和内部组件 prop 名一致，不需要映射
    form: {},

    // grid: antd 用 Row 组件，gutter 替代 xGap/yGap
    grid: {
      props: { xGap: 'gutter' },  // xGap → gutter
    },

    // formItem: antd 用 AFormItem，name/rules 替代 path/rule
    formItem: {
      props: { path: 'name', rule: 'rules' },  // path → name, rule → rules
    },

    // table: antd 的 ATable 和内部组件 prop 名基本一致
    table: {},

    // pagination: antd 用 APagination，current/total/pageSizeOptions
    pagination: {
      props: {
        page: 'current',              // page → current
        itemCount: 'total',           // itemCount → total
        pageSizes: 'pageSizeOptions', // pageSizes → pageSizeOptions
      },
      events: {
        'update:page': 'update:current',  // update:page → update:current
      },
    },

    // dropdown: antd 的 ADropdown 和内部组件 prop 名基本一致
    dropdown: {},
  },
}
```

#### 映射原理

内部组件通过 `useComponentAdapter` composable 自动应用映射：

```ts
// 内部代码（你不需要写这个，框架已内置）
const { mapProps } = useComponentAdapter('pagination')
const mapped = mapProps({ page: 1, itemCount: 100 })
// 如果配置了 { page: 'current', itemCount: 'total' }
// 映射结果：{ current: 1, total: 100 }
```

---

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import TablePro from '@/components/TablePro.vue'
import TableAction from '@/components/TableAction.vue'
import type { ActionItem, ConfirmHandlers } from '@/types/common'
import type { TableColumn } from '@/types/table'

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
const pagination = ref({ page: 1, pageSize: 10, itemCount: 100 })
</script>

<template>
  <TablePro
    ref="tableProRef"
    :columns="columns"
    :data="data"
    :confirm-handlers="confirmHandlers"
    v-model:pagination="pagination"
    @search="(v) => console.log('搜索:', v)"
    @reset="console.log('重置')"
    @batch-delete="(keys) => console.log('批量删除:', keys)"
    @change="(page, size) => console.log('分页变化:', page, size)"
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

### 自定义 Modal 按钮

```vue
<template>
  <TablePro :columns="columns" :data="data" :confirm-handlers="confirmHandlers">
    <template #action-col="{ row }">
      <TableAction :actions="getTableAction(row)" />
    </template>
    <!-- 自定义底部按钮 -->
    <template #actions="{ onConfirm, onCancel }">
      <n-button @click="onCancel">取消</n-button>
      <n-button type="primary" @click="onConfirm">提交</n-button>
    </template>
  </TablePro>
</template>
```

---

## 组件 API

### TablePro

顶层编排组件，接收配置并协调 Search / Table / Pagination / Modal 子组件。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `TableColumn[]` | — | 列配置（必传） |
| `data` | `Record<string, unknown>[]` | `[]` | 表格数据 |
| `formProps` | `FormConfig` | `{}` | 搜索表单的 form props |
| `confirmHandlers` | `ConfirmHandlers` | `{}` | Modal 确认回调（按模式分发） |
| `pagination` | `PaginationConfig` | `{ page: 1 }` | 分页配置（v-model） |
| `defaultSpan` | `number` | `1` | 表单字段默认栅格占列数（antd 建议 `8`） |

**Events：**

| Event | 参数 | 说明 |
|-------|------|------|
| `search` | `values: Record<string, unknown>` | 点击搜索按钮 |
| `reset` | — | 点击重置按钮 |
| `batch-delete` | `keys: unknown[]` | 点击批量删除 |
| `change` | `(page: number, pageSize: number)` | 分页变化 |
| `update:pagination` | `PaginationConfig` | 分页配置变化（v-model） |

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

数据表格组件，通过 ComponentMap 动态渲染。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `TableColumn<T>[]` | `[]` | 列配置 |
| `data` | `T[]` | `[]` | 表格数据 |
| `showAdd` | `boolean` | `true` | 显示新增按钮 |
| `rowKey` | `string` | `'id'` | 行唯一标识字段 |
| `tableProps` | `TableConfig` | `{}` | 表格组件的 props |

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

---

### Search

搜索表单组件，内置展开/折叠功能。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `schema` | `SearchField[]` | — | 搜索字段配置（必传） |
| `modelValue` | `Record<string, unknown>` | `{}` | 表单数据（v-model） |
| `defaultVisibleCount` | `number` | `3` | 折叠时默认显示字段数 |
| `formProps` | `FormConfig` | `{}` | form 组件的 props |
| `gridProps` | `GridConfig` | `{}` | grid 组件的 props |
| `formItemProps` | `FormItemConfig` | `{}` | formItem 组件的 props |

**Events：**

| Event | 参数 | 说明 |
|-------|------|------|
| `search` | `values: Record<string, unknown>` | 点击搜索按钮（校验通过后触发） |
| `reset` | — | 点击重置按钮 |
| `update:modelValue` | `Record<string, unknown>` | 表单数据变化 |

---

### FormRenderer

纯表单字段渲染器，不含操作按钮。被 Search 和 Modal 内部使用。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `schema` | `SearchField[]` | — | 字段配置（必传） |
| `modelValue` | `Record<string, unknown>` | `{}` | 表单数据（v-model） |
| `formProps` | `FormConfig` | `{}` | form 组件的 props |
| `gridProps` | `GridConfig` | `{}` | grid 组件的 props |
| `formItemProps` | `FormItemConfig` | `{}` | formItem 组件的 props |

**Exposed：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `formRef` | `ComponentPublicInstance \| null` | form 组件 ref，可调用 `validate()` |
| `formValue` | `Record<string, unknown>` | 表单响应式数据 |

---

### Pagination

分页组件，支持 v-model 双向绑定。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `pagination` | `PaginationConfig` | `{ page: 1 }` | 分页配置对象（v-model） |

**Events：**

| Event | 参数 | 说明 |
|-------|------|------|
| `update:pagination` | `PaginationConfig` | 分页配置变化 |
| `change` | `(page: number, pageSize: number)` | 统一变化回调 |

**说明：**
- 切换每页条数时自动重置页码为 1，避免页码越界
- `pageSizes` 只能通过全局 config 配置，实例级 props 无法覆盖

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
| `modalProps` | `ModalConfig` | `{}` | 弹窗组件的 props |
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
- 详情模式下自动禁用所有表单项
- 详情模式不显示确认按钮
- 通过 `modalAdapter` 配置实现跨 UI 库兼容

---

### TableAction

操作列按钮组件，支持主要按钮和下拉菜单两种形式。

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `actions` | `ActionItem[]` | `[]` | 主要操作按钮 |
| `dropDownActions` | `ActionItem[]` | `[]` | 下拉菜单项 |

---

## 类型定义

### PaginationConfig

```ts
interface PaginationConfig {
  page?: number                    // 当前页码（默认 1）
  pageSize?: number                // 每页条数（默认 pageSizes[0]）
  pageCount?: number               // 总页数
  itemCount?: number               // 总条数
  pageSizes?: number[]             // 每页条数选项（仅全局配置生效）
  size?: 'small' | 'medium' | 'large'
  [key: string]: unknown           // 透传 UI 库原生 props
}
```

### FormConfig

```ts
interface FormConfig {
  inline?: boolean
  labelWidth?: number
  labelAlign?: 'left' | 'right' | 'auto'
  labelPlacement?: 'left' | 'right' | 'top'
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}
```

### GridConfig

```ts
interface GridConfig {
  cols?: number | string
  xGap?: number | string
  yGap?: number | string
  responsive?: 'self' | 'screen'
  collapsed?: boolean
  collapsedRows?: number
}
```

### FormItemConfig

```ts
interface FormItemConfig {
  labelWidth?: number | string
  labelPlacement?: 'left' | 'right' | 'top'
  showLabel?: boolean
  showFeedback?: boolean
}
```

### TableConfig

```ts
interface TableConfig {
  size?: 'tiny' | 'small' | 'medium' | 'large'
  bordered?: boolean
  striped?: boolean
  loading?: boolean
  maxHeight?: number
}
```

### ModalConfig

```ts
interface ModalConfig {
  preset?: 'dialog' | 'card'
  style?: string | Record<string, unknown>
  closable?: boolean
  maskClosable?: boolean
}
```

### TableColumn

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

### ColumnConfig

```ts
interface ColumnConfig {
  isNew?: boolean               // 是否参与新增表单
  isSearch?: boolean            // 是否参与搜索表单
  type?: keyof ComponentMap     // 表单控件类型（input / select / datePicker ...）
}
```

### SearchField

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

### ConfirmHandlers

```ts
interface ConfirmHandlers {
  add?: (formData: Record<string, unknown>) => void
  edit?: (formData: Record<string, unknown>) => void
  detail?: (formData: Record<string, unknown>) => void
}
```

### ActionItem

```ts
interface ActionItem {
  label: string                        // 按钮文案
  onClick: () => void                  // 点击回调
  meta?: Record<string, unknown>       // 按钮 v-bind 属性（如 type: 'primary'）
}
```

### ModalAdapter

```ts
interface ModalAdapter {
  visibleProp?: string       // 可见性 prop 名（如 'show' / 'open'）
  visibleEvent?: string      // 可见性事件名（如 'update:show' / 'update:open'）
  slots?: {
    header?: string          // 头部插槽名
    actions?: string         // 底部操作插槽名
  }
}
```

### ComponentAdapter

```ts
interface ComponentAdapter {
  props?: Record<string, string>    // prop 名称映射，如 { page: 'current' }
  events?: Record<string, string>   // 事件名称映射，如 { 'update:page': 'update:current' }
  slots?: Record<string, string>    // 插槽名称映射
}
```

---

## 工具函数 & Composables

### columnsToSchema

将列配置按过滤条件转换为表单 schema。

```ts
import { columnsToSchema } from '@/types/table'
import type { TableColumn } from '@/types/table'

// 搜索表单：仅包含 isSearch 为 true 的列
const searchSchema = columnsToSchema(columns, (col) => !!col.config?.isSearch)

// 编辑表单：包含所有未隐藏的列
const formSchema = columnsToSchema(columns, (col) => !col.hidden)

// antd 场景：指定默认 span（8/24 = 3 列/行）
const antdSchema = columnsToSchema(columns, (col) => !!col.config?.isSearch, 8)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `columns` | `TableColumn[]` | 列配置数组 |
| `filter` | `(col: TableColumn) => boolean` | 过滤函数 |
| `defaultSpan` | `number` | 默认栅格跨度（默认 `1`） |

**返回值：** `SearchField[]`

---

### createAdapter

从声明式配置生成 adapter 组件，用于结构变换场景。

```ts
import { createAdapter } from '@/utils/createAdapter'
import { Pagination } from 'ant-design-vue'

const AntdPagination = createAdapter(Pagination, {
  props: { page: 'current', itemCount: 'total' },
  events: { 'update:page': 'update:current' },
})
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `component` | `Component` | 被包装的目标 UI 库组件 |
| `config` | `AdapterConfig` | adapter 配置 |

---

### clearAndReassign

清空响应式对象的所有 key 并重新赋值，保持同一引用不变。

```ts
import { clearAndReassign } from '@/utils/reactive'
import { reactive } from 'vue'

const formValue = reactive<Record<string, unknown>>({})
clearAndReassign(formValue, newFormData)
```

---

### useComponentMap

统一的组件映射注入钩子。

```ts
import { useComponentMap } from '@/composables/useComponentMap'

const { getComponent, injection } = useComponentMap()

// 自定义默认回退链
const { getComponent } = useComponentMap(['text', 'input'])

// 使用：提取为变量，避免模板重复调用
const Button = getComponent('button')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `defaultFallbacks` | `string[]` | 可选的默认回退链（默认 `['input']`） |

**返回值：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `getComponent` | `(type: string, fallbacks?: string[]) => Component \| undefined` | 组件查找函数 |
| `injection` | `TableProInjection` | 完整的注入对象（含 config） |

---

### useMergedProps

合并全局默认配置与组件本地 props。

```ts
import { useMergedProps } from '@/composables/useMergedProps'

// 全局默认 + 组件 props
const mergedFormProps = useMergedProps<FormConfig>('form', () => props.formProps)

// 全局默认 + 内联默认 + 组件 props
const mergedGridProps = useMergedProps<GridConfig>('grid', () => props.gridProps, {
  cols: 4, xGap: 12, yGap: 8,
})
```

**合并优先级：** `globalDefaults < inlineDefaults < localProps`

---

### usePaginationState

统一管理分页状态的双向绑定。

```ts
import { usePaginationState } from '@/composables/usePaginationState'

const { page, pageSize, onPageChange } = usePaginationState(() => pagination, emit)
```

**返回值：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `page` | `WritableComputedRef<number>` | 页码双向绑定 |
| `pageSize` | `WritableComputedRef<number>` | 每页条数双向绑定 |
| `onPageChange` | `(newPage: number, newPageSize: number) => void` | 统一变化处理 |

---

### useComponentAdapter

根据注入的 adapters 配置，提供 prop/event/slot 名称映射。

```ts
import { useComponentAdapter } from '@/composables/useComponentAdapter'

const { mapProps, mapEvent } = useComponentAdapter('pagination')

// { page: 1, itemCount: 100 } → { current: 1, total: 100 }
const mapped = mapProps({ page: 1, itemCount: 100 })

// 'update:page' → 'update:current'
const eventName = mapEvent('update:page')
```

**返回值：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `adapter` | `ComponentAdapter \| undefined` | 当前组件的适配器配置 |
| `mapProps` | `(props: Record<string, unknown>) => Record<string, unknown>` | prop 名称映射 |
| `mapEvent` | `(event: string) => string` | 事件名称映射 |
| `mapSlot` | `(slot: string) => string` | 插槽名称映射 |

---

## 架构概览

### 组件层级

```
App.vue                      ← 消费者：定义 columns + data + 业务逻辑
  └─ TablePro.vue            ← 编排层：Search + Table + Pagination + Modal
       ├─ Search.vue         ← 搜索表单（展开/折叠 + 搜索/重置按钮）
       │    └─ FormRenderer  ← 纯表单字段渲染（form → grid → fields）
       ├─ Table.vue          ← 数据表格（多选 + 批量删除 + 操作列）
       │    └─ TableAction   ← 操作按钮 + 下拉菜单
       ├─ Pagination.vue     ← 分页（v-model:pagination）
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
│   ├── useComponentAdapter.ts      # 适配器钩子（prop/event/slot 名称映射）
│   └── usePaginationState.ts       # 分页状态钩子（computed get/set 双向绑定）
├── utils/
│   ├── reactive.ts                 # 响应式工具函数（clearAndReassign）
│   └── createAdapter.ts            # 适配器组件生成工具
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

1. **Schema 驱动** — 列配置同时定义表格展示、搜索表单、编辑表单，一处定义多处复用
2. **ComponentMap 动态渲染** — 所有 UI 组件通过 `<component :is>` 渲染，与具体 UI 库解耦
3. **三层配置合并** — 全局默认 → 组件 props 覆盖，通过 `useMergedProps` 统一处理
4. **适配器模式** — 通过 `useComponentAdapter` 实现 prop/event/slot 名称映射，支持任意 UI 库
5. **插槽透传** — TablePro 作为编排层，通过 `$slots` 动态透传给子组件
6. **类型安全** — 完整的 TypeScript 类型定义，泛型支持行数据类型
