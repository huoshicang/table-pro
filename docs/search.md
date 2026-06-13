# Search 组件

基于 Schema 驱动的搜索表单组件，通过动态组件渲染 Naive UI 表单项，支持全局配置覆盖、展开/折叠、具名插槽等能力。

## 快速开始

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Search from '@/components/Search.vue'
import type { SearchField } from '@/types/search'

const schema: SearchField[] = [
  { name: 'name', label: '姓名', type: 'input', span: 1 },
  { name: 'age', label: '年龄', type: 'inputNumber', span: 1 },
  { name: 'date', label: '日期', type: 'datePicker', span: 2 },
]

const formValue = ref<Record<string, unknown>>({})

function handleSearch(values: Record<string, unknown>) {
  console.log('search:', values)
}

function handleReset() {
  formValue.value = { name: '', age: undefined, date: undefined }
}
</script>

<template>
  <Search
    :schema="schema"
    v-model="formValue"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>
```

## 组件结构

```
┌─ n-form ───────────────────────┐
│  ┌─ n-grid (cols=4, xGap=12) ─┐│
│  │  n-gridItem × N (字段)      ││
│  │  n-gridItem (按钮区域)      ││
│  │    └─ n-space               ││
│  │       ├─ #search 按钮       ││
│  │       ├─ #reset 按钮        ││
│  │       └─ #toggle 按钮       ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `schema` | `SearchField[]` | **必填** | 搜索字段配置数组 |
| `modelValue` | `Record<string, unknown>` | `{}` | 表单数据（v-model 双向绑定） |
| `formProps` | `FormConfig` | `{}` | 覆盖 `n-form` 的 props |
| `gridProps` | `GridConfig` | `{}` | 覆盖 `n-grid` 的 props（含 `cols`/`xGap`/`yGap`） |
| `formItemProps` | `FormItemConfig` | `{}` | 覆盖 `n-form-item` 的 props |

### schema 字段配置 (SearchField)

| Field | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | **必填** | 字段名，对应表单 model 的 key |
| `label` | `string` | **必填** | 表单项 label |
| `type` | `keyof ComponentMap` | **必填** | 组件类型，如 `'input'` / `'select'` / `'datePicker'` |
| `span` | `number` | `1` | 在 n-grid 中占的列数 |
| `rules` | `unknown[]` | — | 表单校验规则 |
| `componentProps` | `Record<string, unknown>` | — | 传递给底层输入组件的额外 props |

## Events

| Event | Params | Description |
|---|---|---|
| `search` | `(values: Record<string, unknown>)` | 点击搜索按钮触发，参数为当前表单值（校验通过后） |
| `reset` | `[]` | 点击重置按钮触发 |
| `update:modelValue` | `(value: Record<string, unknown>)` | 表单值变化时触发，v-model 双向绑定 |

## Slots

| Name | Params | Default | Description |
|---|---|---|---|
| `search` | `{ onClick: () => void }` | 搜索按钮 | 替换整个搜索按钮组件 |
| `reset` | `{ onClick: () => void }` | 重置按钮 | 替换整个重置按钮组件 |
| `toggle` | `{ onClick: () => void, expanded: boolean }` | 展开/收起按钮 | 替换整个展开折叠按钮组件 |

### 插槽使用示例

```vue
<Search :schema="schema" v-model="formValue">
  <template #search="{ onClick }">
    <n-button type="primary" @click="onClick()">自定义搜索</n-button>
  </template>
  <template #reset="{ onClick }">
    <n-button text @click="onClick()">清空</n-button>
  </template>
  <template #toggle="{ onClick, expanded }">
    <n-button text @click="onClick()">
      {{ expanded ? '收起字段' : '显示更多' }}
    </n-button>
  </template>
</Search>
```

## 展开/折叠

当 `schema` 字段数超过 **7** 个（默认 2 行 × 4 列 - 1 按钮格）时，默认只显示前 7 个字段，底部出现展开/收起按钮。点击后展示全部字段。

该行为不可配置（硬编码阈值 `DEFAULT_VISIBLE_COUNT = 7`），若需调整可直接修改组件内的常量。

## 配置合并

配置按以下优先级合并（后者覆盖前者）：

```
全局默认 (main.ts → config.components)  →  组件 props (formProps / gridProps / formItemProps)  →  代码默认值
```

以 `mergedGridProps` 为例：

```ts
const mergedGridProps: GridConfig = {
  ...(globalComponentDefaults?.grid ?? { xGap: 12, yGap: 8, cols: 4 }), // 代码默认
  ...props.gridProps,                                                     // 组件 props 覆盖
}
```

合并结果通过 `v-bind="mergedXxxProps"` 整体传入模板，无需逐个绑定属性。

### 全局配置示例 (main.ts)

```ts
app.use(TableProPlugin, {
  components: { /* ComponentMap */ },
  config: {
    components: {
      formItem: {
        labelWidth: 80,
        labelPlacement: 'left',
      },
      grid: {
        xGap: 16,
        yGap: 10,
      },
    },
  },
})
```

## 动态组件渲染

所有子元素均通过 `<component :is="getComponent('key')"` 动态渲染，组件 key 在 `main.ts` 的 `TableProPlugin` 安装时注入：

| Key | Naive UI 组件 |
|---|---|
| `form` | `NForm` |
| `grid` | `NGrid` |
| `gridItem` | `NGridItem` |
| `formItem` | `NFormItem` |
| `space` | `NSpace` |
| `button` | `NButton` |
| `input` | `NInput`（fallback） |
| `select` | `NSelect` |
| `datePicker` | `NDatePicker` |
| `inputNumber` | `NInputNumber` |
| ... | （详见 `ComponentMap` 类型定义） |

`getComponent(type)` 未找到匹配时 fallback 到 `componentMap.input`。

## 搜索与重置逻辑

- **搜索**：调用 `n-form.validate()` 校验，校验通过则触发 `search` 事件并传入当前表单值；校验失败不做任何操作。
- **重置**：将 `formValue` 中所有字段置为空字符串（`''`），触发 `update:modelValue` 和 `reset` 事件。

## 源码

- 组件：`src/components/Search.vue`
- 类型：`src/types/search.ts`
- 插件注册：`src/index.ts`（`TABLE_COMPONENTS_KEY`、`ComponentMap`）
- 示例用法：`src/components/TablePro.vue`
