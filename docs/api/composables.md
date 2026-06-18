# Composables

## useComponentMap

统一的组件映射注入钩子，封装 `inject` + `getComponent`。

```ts
import { useComponentMap } from 'table-pro'

// 默认行为（回退到 input）
const { getComponent, injection } = useComponentMap()

// 自定义默认回退链（Table 组件回退到 text 再到 input）
const { getComponent } = useComponentMap(['text', 'input'])

// 使用
const Button = getComponent('button')
const Input = getComponent('input', ['text']) // 单次覆盖回退链
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `defaultFallbacks` | `string[]` | 可选的默认回退链，省略时使用 `['input']` |

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `componentMap` | `ComponentMap` | 注入的组件映射表 |
| `getComponent` | `(type: string, fallbacks?: string[]) => Component \| undefined` | 组件查找函数 |
| `injection` | `TableProInjection` | 完整的注入对象（含 config） |

---

## useMergedProps

合并全局默认配置与组件本地 props，返回响应式 computed。

```ts
import { useMergedProps } from 'table-pro'
import type { FormConfig } from 'table-pro'

// 基本用法
const mergedFormProps = useMergedProps<FormConfig>('form', () => props.formProps)

// 带内联默认值
const mergedGridProps = useMergedProps<GridConfig>('grid', () => props.gridProps, {
  cols: 4,
  xGap: 12,
  yGap: 8,
})
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `sectionKey` | `keyof ComponentDefaultsConfig` | 全局配置中的 section 名 |
| `localProps` | `MaybeRefOrGetter<T>` | 组件传入的本地配置 |
| `defaults` | `Partial<T>` | 可选的内联默认值 |

### 返回值

`ComputedRef<T>` — 合并后的响应式配置对象

### 合并优先级

`globalDefaults < defaults < localProps`

---

## usePaginationState

统一管理分页状态的双向绑定，用 computed get/set 替代 refs + watchers。

```ts
import { usePaginationState } from 'table-pro'

const { page, pageSize, onPageChange } = usePaginationState(props, emit)

// 模板中直接使用
// <Pagination v-model:page="page" v-model:page-size="pageSize" @change="onPageChange" />
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `props` | `{ page: number; pageSize: number }` | 包含 page 和 pageSize 的 props |
| `emit` | `PaginationEmit` | 组件的 emit 函数 |

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `page` | `WritableComputedRef<number>` | 页码双向绑定 |
| `pageSize` | `WritableComputedRef<number>` | 每页条数双向绑定 |
| `onPageChange` | `(newPage: number, newPageSize: number) => void` | 统一变化处理（pageSize 变化时自动重置 page 为 1） |
