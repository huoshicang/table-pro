# TableAction 操作按钮

操作列按钮组件，支持主要按钮和下拉菜单两种形式。

## 基础用法

```vue live
<script setup>
const actions = [
  { label: '编辑', onClick: () => console.log('编辑') },
  { label: '删除', onClick: () => console.log('删除'), meta: { type: 'error' } },
]

const dropDownActions = [
  { label: '详情', onClick: () => console.log('详情') },
  { label: '导出', onClick: () => console.log('导出') },
]
</script>

<template>
  <n-card title="主要按钮 + 下拉菜单">
    <TableAction :actions="actions" :dropDown-actions="dropDownActions" />
  </n-card>
</template>
```

## 仅主要按钮

```vue live
<script setup>
const actions = [
  { label: '查看', onClick: () => console.log('查看') },
  { label: '编辑', onClick: () => console.log('编辑') },
]
</script>

<template>
  <n-card title="仅主要按钮">
    <TableAction :actions="actions" />
  </n-card>
</template>
```

## 自定义按钮属性

```vue live
<script setup>
const actions = [
  { label: '通过', onClick: () => console.log('通过'), meta: { type: 'success' } },
  { label: '拒绝', onClick: () => console.log('拒绝'), meta: { type: 'error' } },
  { label: '挂起', onClick: () => console.log('挂起'), meta: { type: 'warning' } },
]
</script>

<template>
  <n-card title="自定义按钮属性（meta）">
    <TableAction :actions="actions" />
  </n-card>
</template>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `actions` | `ActionItem[]` | `[]` | 主要操作按钮 |
| `dropDownActions` | `ActionItem[]` | `[]` | 下拉菜单项 |

## ActionItem 配置

```ts
interface ActionItem {
  label: string                        // 按钮文案
  onClick: () => void                  // 点击回调
  meta?: Record<string, unknown>       // 按钮 v-bind 属性（如 type: 'primary', size: 'small'）
}
```

## meta 常用值

| meta | 值 | 说明 |
|------|------|------|
| `type` | `'primary' \| 'success' \| 'warning' \| 'error'` | 按钮类型 |
| `size` | `'tiny' \| 'small' \| 'medium' \| 'large'` | 按钮大小 |
| `disabled` | `boolean` | 是否禁用 |
| `loading` | `boolean` | 加载状态 |
