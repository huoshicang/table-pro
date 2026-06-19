# 工具函数

## columnsToSchema

将列配置按过滤条件转换为表单 schema。

```ts
import { columnsToSchema } from 'table-pro'
import type { TableColumn } from 'table-pro'

// 搜索表单：仅包含 isSearch 为 true 的列
const searchSchema = columnsToSchema(columns, (col) => !!col.config?.isSearch)

// 编辑表单：包含所有未隐藏的列
const formSchema = columnsToSchema(columns, (col) => !col.hidden)

// antd 场景：指定默认 span（8/24 = 3 列/行）
const antdSchema = columnsToSchema(columns, (col) => !!col.config?.isSearch, 8)
```

### 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `TableColumn[]` | — | 列配置数组 |
| `filter` | `(col: TableColumn) => boolean` | — | 过滤函数，决定哪些列参与表单 |
| `defaultSpan` | `number` | `1` | 默认栅格跨度（naive-ui: 1 = 1列/行，antd: 8 = 3列/行） |

### 返回值

`SearchField[]` — 符合 SearchField 格式的表单 schema

### 派生规则

| 来源 | 目标字段 | 说明 |
|------|----------|------|
| `col.key` | `name` | 表单字段名 |
| `col.title` | `label` | 表单项标签 |
| `col.config?.type ?? 'input'` | `type` | 控件类型 |
| `defaultSpan` | `span` | 栅格占列数 |
| `col.meta` | `componentProps` | 控件 props |

---

## createAdapter

从声明式配置生成 adapter 组件，用于结构变换场景（如 Table 列格式转换）。

```ts
import { createAdapter } from 'table-pro'
import { Pagination } from 'ant-design-vue'

// 将 naive-ui 的 prop 名映射到 antd
const AntdPagination = createAdapter(Pagination, {
  props: { page: 'current', itemCount: 'total' },
  events: { 'update:page': 'update:current' },
})
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `component` | `Component` | 被包装的目标 UI 库组件 |
| `config` | `AdapterConfig` | adapter 配置 |

### AdapterConfig

| 字段 | 类型 | 说明 |
|------|------|------|
| `props` | `Record<string, string>` | prop 名称映射（框架内部名 → UI 库实际名） |
| `events` | `Record<string, string>` | 事件名称映射 |
| `transformProps` | `(props: Record<string, unknown>) => Record<string, unknown>` | 自定义值变换（处理结构变化） |

### 返回值

`Component` — 包装后的 adapter 组件，可直接注册到 ComponentMap

---

## clearAndReassign

清空响应式对象的所有 key 并重新赋值，保持同一引用不变。

```ts
import { clearAndReassign } from 'table-pro'
import { reactive } from 'vue'

const formValue = reactive<Record<string, unknown>>({})
// 外部数据变化时同步（常用于 watch 回调）
clearAndReassign(formValue, newFormData)
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `target` | `Record<string, unknown>` | 要清空并重赋值的响应式对象 |
| `source` | `Record<string, unknown>` | 新的数据源 |

### 说明

- 先删除所有已有 key，确保不会残留旧字段
- 通过 `Object.assign` 写入新数据，保持 target 的响应式引用不变
- 常用于 `watch` 回调中同步外部数据到内部 `reactive` 对象
