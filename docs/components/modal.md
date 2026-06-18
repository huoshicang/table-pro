# Modal 弹窗

新增/编辑/详情弹窗，支持跨 UI 库的插槽名映射。

## 基础用法

```vue live
<script setup>
import { ref } from 'vue'

const visible = ref(false)
const mode = ref('add')
const formData = ref({})

const schema = [
  { name: 'name', label: '名称', type: 'input', rules: [{ required: true, message: '请输入名称' }] },
  { name: 'status', label: '状态', type: 'select', componentProps: { options: [{ label: '启用', value: '1' }, { label: '禁用', value: '0' }] } },
  { name: 'remark', label: '备注', type: 'textarea' },
]

const rowData = ref({ name: 'admin', status: '1', remark: '管理员账号' })

function openAdd() {
  mode.value = 'add'
  rowData.value = null
  visible.value = true
}

function openEdit() {
  mode.value = 'edit'
  rowData.value = { name: 'admin', status: '1', remark: '管理员账号' }
  visible.value = true
}

function openDetail() {
  mode.value = 'detail'
  rowData.value = { name: 'admin', status: '1', remark: '管理员账号' }
  visible.value = true
}
</script>

<template>
  <n-space>
    <n-button @click="openAdd">新增</n-button>
    <n-button @click="openEdit">编辑</n-button>
    <n-button @click="openDetail">详情</n-button>
  </n-space>

  <Modal
    :visible="visible"
    :mode="mode"
    :row-data="rowData"
    :form-schema="schema"
    @update:visible="visible = $event"
    @cancel="console.log('取消')"
  />
</template>
```

## 自定义按钮

```vue live
<script setup>
import { ref } from 'vue'

const visible = ref(false)
const schema = [
  { name: 'reason', label: '原因', type: 'textarea' },
]
</script>

<template>
  <n-button @click="visible = true">自定义弹窗</n-button>

  <Modal
    :visible="visible"
    mode="add"
    :form-schema="schema"
    @update:visible="visible = $event"
  >
    <template #actions="{ onConfirm, onCancel }">
      <n-space>
        <n-button @click="onCancel">关闭</n-button>
        <n-button type="warning" @click="onConfirm">保存草稿</n-button>
        <n-button type="primary" @click="onConfirm">提交</n-button>
      </n-space>
    </template>
  </Modal>
</template>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `visible` | `boolean` | `false` | 显隐控制 |
| `mode` | `'add' \| 'edit' \| 'detail'` | `'add'` | 弹窗模式 |
| `rowData` | `T \| null` | `null` | 编辑/详情时的行数据 |
| `formSchema` | `SearchField[]` | `[]` | 表单字段配置 |
| `modalProps` | `ModalConfig` | `{}` | modal 的 props |
| `confirmHandlers` | `ConfirmHandlers` | `{}` | 确认回调（按模式分发） |

## ModalConfig 配置

```ts
interface ModalConfig {
  preset?: 'dialog' | 'card'              // 弹窗预设样式
  style?: string | Record<string, unknown> // 弹窗内联样式
  closable?: boolean                       // 是否可关闭
  maskClosable?: boolean                   // 点击遮罩是否关闭
  title?: string                           // 弹窗标题
}
```

## ConfirmHandlers 配置

```ts
interface ConfirmHandlers {
  add?: (formData: Record<string, unknown>) => void    // 新增确认
  edit?: (formData: Record<string, unknown>) => void   // 编辑确认
  detail?: (formData: Record<string, unknown>) => void // 详情确认
}
```

## 说明

- **详情模式**下自动禁用所有表单项（`disabled: true`），不显示确认按钮
- 通过 `modalAdapter` 配置实现跨 UI 库兼容（插槽名映射、可见性 prop/事件名）
- 通过 `FormRendererInstance` 类型安全访问表单 ref

## Events

| Event | 参数 | 说明 |
|-------|------|------|
| `update:visible` | `boolean` | 显隐变化 |
| `cancel` | — | 点击取消 |

## Slots

| Slot | Props | 说明 |
|------|-------|------|
| `header` | — | 标题（默认：新增/编辑/详情） |
| `actions` | `{ onConfirm, onCancel }` | 底部按钮（默认：取消+确认） |
