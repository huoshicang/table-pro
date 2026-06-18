# FormRenderer 表单渲染器

纯表单字段渲染器，不含操作按钮。被 Search 和 Modal 内部使用。

## 基础用法

```vue live
<script setup>
import { ref, reactive } from 'vue'

const schema = [
  { name: 'username', label: '用户名', type: 'input', rules: [{ required: true, message: '请输入用户名' }] },
  { name: 'email', label: '邮箱', type: 'input' },
  { name: 'age', label: '年龄', type: 'inputNumber', componentProps: { min: 0, max: 120 } },
  { name: 'gender', label: '性别', type: 'radioGroup', componentProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] } },
  { name: 'hobbies', label: '爱好', type: 'checkboxGroup', componentProps: { options: [{ label: '读书', value: 'read' }, { label: '运动', value: 'sport' }, { label: '音乐', value: 'music' }] } },
  { name: 'birthday', label: '生日', type: 'datePicker' },
  { name: 'city', label: '城市', type: 'select', componentProps: { options: [{ label: '北京', value: 'beijing' }, { label: '上海', value: 'shanghai' }, { label: '广州', value: 'guangzhou' }] } },
  { name: 'active', label: '启用', type: 'switch' },
  { name: 'score', label: '评分', type: 'rate' },
  { name: 'color', label: '颜色', type: 'colorPicker' },
]

const formData = ref({})
</script>

<template>
  <n-card title="多种表单控件">
    <FormRenderer
      :schema="schema"
      v-model="formData"
    />
    <n-divider />
    <p>表单数据: {{ JSON.stringify(formData) }}</p>
  </n-card>
</template>
```

## 自定义布局

```vue live
<script setup>
import { ref } from 'vue'

const schema = [
  { name: 'name', label: '姓名', type: 'input', span: 1 },
  { name: 'phone', label: '电话', type: 'input', span: 1 },
  { name: 'email', label: '邮箱', type: 'input', span: 2 },
  { name: 'address', label: '地址', type: 'input', span: 4 },
]

const formData = ref({})
</script>

<template>
  <n-card title="自定义栅格布局（4列）">
    <FormRenderer
      :schema="schema"
      v-model="formData"
      :grid-props="{ cols: 4, xGap: 16, yGap: 12 }"
      :form-item-props="{ labelWidth: 60, labelPlacement: 'left' }"
    />
  </n-card>
</template>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `schema` | `SearchField[]` | — | 字段配置（必传） |
| `modelValue` | `Record<string, unknown>` | `{}` | 表单数据（v-model） |
| `formProps` | `FormConfig` | `{}` | form 的 props |
| `gridProps` | `GridConfig` | `{}` | grid 的 props |
| `formItemProps` | `FormItemConfig` | `{}` | form-item 的 props |

## Slots

| Slot | 说明 |
|------|------|
| `actions` | 操作按钮区域（渲染在 grid 末尾） |

## Exposed

| 属性 | 类型 | 说明 |
|------|------|------|
| `formRef` | `ComponentPublicInstance \| null` | form ref，可调用 `validate()` |
| `formValue` | `Record<string, unknown>` | 表单响应式数据 |
