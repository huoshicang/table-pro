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
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `columns` | `TableColumn[]` | 列配置数组 |
| `filter` | `(col: TableColumn) => boolean` | 过滤函数，决定哪些列参与表单 |

### 返回值

`SearchField[]` — 符合 SearchField 格式的表单 schema

### 派生规则

| 来源 | 目标字段 | 说明 |
|------|----------|------|
| `col.key` | `name` | 表单字段名 |
| `col.title` | `label` | 表单项标签 |
| `col.config?.type ?? 'input'` | `type` | 控件类型 |
| `1` | `span` | 栅格占列数 |
| `col.meta` | `componentProps` | 控件 props |

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
