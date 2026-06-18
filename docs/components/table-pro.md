# TablePro 顶层编排组件

顶层编排组件，接收配置并协调 Search / Table / Pagination / Modal 子组件。

## 完整演示

下面是完整的 App.vue 演示，包含所有组件的实际运行效果：

<DemoFrame title="TablePro 完整演示" height="700" />

## 基础用法

```vue live
<script setup>
import { ref } from 'vue'

const columns = [
  { key: 'applyNo', title: '申请编号', sortable: true, config: { isSearch: true, type: 'input' }, meta: { placeholder: '请输入申请编号' } },
  { key: 'name', title: '名称', sortable: true, config: { isSearch: true, type: 'input' } },
  { key: 'applyDate', title: '申请日期', sortable: true, config: { isSearch: true, type: 'datePicker' } },
  { key: 'leaveType', title: '请假类别', config: { isSearch: true, type: 'select' } },
  { key: 'status', title: '流程状态' },
]

const data = ref([
  { id: 1, applyNo: '1000002125414575', name: 'admin', applyDate: '2024-05-29', leaveType: '病假', status: '已完成' },
  { id: 2, applyNo: '10000000000000', name: 'user', applyDate: '2024-06-15', leaveType: '年假', status: '审批中' },
])

const page = ref(1)
const pageSize = ref(10)
const tableProRef = ref()

const confirmHandlers = {
  add: (formData) => { data.value = [...data.value, { ...formData, id: Date.now() }] },
  edit: (formData) => {
    const idx = data.value.findIndex(r => r.id === formData.id)
    if (idx !== -1) data.value[idx] = { ...formData }
  },
}
</script>

<template>
  <TablePro
    ref="tableProRef"
    :columns="columns"
    :data="data"
    :confirm-handlers="confirmHandlers"
    v-model:page="page"
    v-model:page-size="pageSize"
    :item-count="data.length"
    @search="(v) => console.log('搜索:', v)"
    @reset="() => console.log('重置')"
    @batch-delete="(keys) => { data = data.filter(r => !keys.includes(r.id)) }"
    @change="(p, ps) => console.log('分页:', p, ps)"
  >
    <template #action-col="{ row }">
      <TableAction
        :actions="[
          { label: '编辑', onClick: () => tableProRef?.openEdit(row) },
          { label: '删除', onClick: () => { data = data.filter(r => r.id !== row.id) }, meta: { type: 'error' } },
        ]"
        :dropDownActions="[
          { label: '详情', onClick: () => tableProRef?.openDetail(row) },
        ]"
      />
    </template>
  </TablePro>
</template>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `TableColumn[]` | — | 列配置（必传） |
| `data` | `Record<string, unknown>[]` | `[]` | 表格数据 |
| `formProps` | `FormConfig` | `{}` | 搜索表单的 form props |
| `confirmHandlers` | `ConfirmHandlers` | `{}` | Modal 确认回调（按模式分发） |
| `page` | `number` | `1` | 当前页码（v-model） |
| `pageSize` | `number` | `10` | 每页条数（v-model） |
| `itemCount` | `number` | `0` | 总条目数 |
| `paginationProps` | `PaginationConfig` | `{}` | pagination 的 props |

## Events

| Event | 参数 | 说明 |
|-------|------|------|
| `search` | `values: Record<string, unknown>` | 点击搜索按钮 |
| `reset` | — | 点击重置按钮 |
| `batch-delete` | `keys: unknown[]` | 点击批量删除 |
| `change` | `(page: number, pageSize: number)` | 分页变化 |
| `update:page` | `page: number` | 页码变化 |
| `update:pageSize` | `pageSize: number` | 每页条数变化 |

## Slots

| Slot | Props | 说明 |
|------|-------|------|
| `action-col` | `{ row }` | 操作列内容（每行调用） |
| `header` | — | Modal 头部（覆盖默认标题） |
| `actions` | `{ onConfirm, onCancel }` | Modal 底部按钮 |

## Exposed

| 方法 | 参数 | 说明 |
|------|------|------|
| `openAdd()` | — | 打开新增弹窗 |
| `openEdit(row)` | `Record<string, unknown>` | 打开编辑弹窗 |
| `openDetail(row)` | `Record<string, unknown>` | 打开详情弹窗（只读） |
