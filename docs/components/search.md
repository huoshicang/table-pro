# Search 搜索表单

搜索表单组件，内置展开/折叠功能，内部使用 FormRenderer 渲染字段。

## 基础用法

```vue live
<script setup>
import { ref } from 'vue'

const schema = [
  { name: 'keyword', label: '关键词', type: 'input' },
  { name: 'status', label: '状态', type: 'select', componentProps: { options: [{ label: '启用', value: '1' }, { label: '禁用', value: '0' }] } },
  { name: 'date', label: '日期', type: 'datePicker' },
]

const form = ref({})
</script>

<template>
  <n-card title="基础搜索">
    <Search
      :schema="schema"
      v-model="form"
      @search="(v) => console.log('搜索:', v)"
      @reset="() => console.log('重置')"
    />
    <n-divider />
    <p>表单数据: {{ JSON.stringify(form) }}</p>
  </n-card>
</template>
```

## 展开/折叠

```vue live
<script setup>
import { ref } from 'vue'

const schema = [
  { name: 'f1', label: '字段1', type: 'input' },
  { name: 'f2', label: '字段2', type: 'input' },
  { name: 'f3', label: '字段3', type: 'input' },
  { name: 'f4', label: '字段4', type: 'input' },  // 超过默认显示数
  { name: 'f5', label: '字段5', type: 'input' },
]

const form = ref({})
</script>

<template>
  <n-card title="展开/折叠（默认显示 3 个）">
    <Search
      :schema="schema"
      v-model="form"
      :default-visible-count="3"
      @search="(v) => console.log('搜索:', v)"
    />
  </n-card>
</template>
```

## 自定义配置

```vue live
<script setup>
import { ref } from 'vue'

const schema = [
  { name: 'name', label: '姓名', type: 'input' },
  { name: 'age', label: '年龄', type: 'inputNumber', span: 2 },
  { name: 'city', label: '城市', type: 'select', span: 2 },
]

const form = ref({})
</script>

<template>
  <n-card title="自定义 Grid 配置（2列）">
    <Search
      :schema="schema"
      v-model="form"
      :grid-props="{ cols: 4, xGap: 16, yGap: 12 }"
      :form-item-props="{ labelWidth: 60, labelPlacement: 'left' }"
      :default-visible-count="10"
    />
  </n-card>
</template>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `schema` | `SearchField[]` | — | 搜索字段配置（必传） |
| `modelValue` | `Record<string, unknown>` | `{}` | 表单数据（v-model） |
| `defaultVisibleCount` | `number` | `3` | 折叠时默认显示字段数 |
| `formProps` | `FormConfig` | `{}` | form 的 props |
| `gridProps` | `GridConfig` | `{}` | grid 的 props |
| `formItemProps` | `FormItemConfig` | `{}` | form-item 的 props |

## SearchField 配置

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

## Events

| Event | 参数 | 说明 |
|-------|------|------|
| `search` | `values: Record<string, unknown>` | 点击搜索（校验通过后） |
| `reset` | — | 点击重置 |
| `update:modelValue` | `Record<string, unknown>` | 表单数据变化 |
