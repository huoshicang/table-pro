# 使用示例

## 基础 CRUD 表格

完整的增删改查示例，包含搜索、分页、批量删除、操作列。

```vue live
<script setup>
import { ref } from 'vue'

const columns = [
  { key: 'applyNo', title: '申请编号', sortable: true, config: { isSearch: true, type: 'input' }, meta: { placeholder: '请输入编号' } },
  { key: 'name', title: '申请人', sortable: true, config: { isSearch: true, type: 'input' } },
  { key: 'department', title: '部门', config: { isSearch: true, type: 'select', options: [{ label: '技术部', value: 'tech' }, { label: '产品部', value: 'product' }, { label: '设计部', value: 'design' }] } },
  { key: 'applyDate', title: '申请日期', sortable: true, config: { isSearch: true, type: 'datePicker' } },
  { key: 'status', title: '状态', config: { isSearch: true, type: 'select' } },
  { key: 'amount', title: '金额', sortable: true },
  { key: 'remark', title: '备注' },
]

const data = ref([
  { id: 1, applyNo: 'REQ-2024-001', name: '张三', department: '技术部', applyDate: '2024-05-29', status: '已完成', amount: 5000, remark: '办公设备采购' },
  { id: 2, applyNo: 'REQ-2024-002', name: '李四', department: '产品部', applyDate: '2024-06-15', status: '审批中', amount: 3000, remark: '差旅费用' },
  { id: 3, applyNo: 'REQ-2024-003', name: '王五', department: '设计部', applyDate: '2024-06-20', status: '已驳回', amount: 8000, remark: '软件授权' },
])

const page = ref(1)
const pageSize = ref(10)
const tableProRef = ref()

const confirmHandlers = {
  add: (formData) => {
    data.value = [...data.value, { ...formData, id: Date.now() }]
  },
  edit: (formData) => {
    const idx = data.value.findIndex(r => r.id === formData.id)
    if (idx !== -1) data.value[idx] = { ...formData }
  },
}

function handleDelete(row) {
  data.value = data.value.filter(r => r.id !== row.id)
}

function handleBatchDelete(keys) {
  data.value = data.value.filter(r => !keys.includes(r.id))
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
    @reset="console.log('重置')"
    @batch-delete="handleBatchDelete"
  >
    <template #action-col="{ row }">
      <TableAction
        :actions="[
          { label: '编辑', onClick: () => tableProRef?.openEdit(row) },
          { label: '删除', onClick: () => handleDelete(row), meta: { type: 'error' } },
        ]"
        :dropDownActions="[
          { label: '详情', onClick: () => tableProRef?.openDetail(row) },
          { label: '导出', onClick: () => console.log('导出', row) },
        ]"
      />
    </template>
  </TablePro>
</template>
```

---

## 审批流程表格

带状态标签和审批操作的表格。

```vue live
<script setup>
import { ref, h } from 'vue'
import { NTag } from 'naive-ui'

const columns = [
  { key: 'title', title: '审批标题', config: { isSearch: true, type: 'input' } },
  { key: 'applicant', title: '申请人', config: { isSearch: true, type: 'input' } },
  { key: 'type', title: '类型', config: { isSearch: true, type: 'select' } },
  { key: 'status', title: '状态', render: (row) => {
    const typeMap = { '待审批': 'warning', '已通过': 'success', '已驳回': 'error' }
    return h(NTag, { type: typeMap[row.status] || 'default', size: 'small' }, { default: () => row.status })
  }},
  { key: 'submitDate', title: '提交时间', sortable: true },
  { key: 'amount', title: '金额', sortable: true },
]

const data = ref([
  { id: 1, title: '办公设备采购申请', applicant: '张三', type: '采购', status: '待审批', submitDate: '2024-06-20', amount: 12000 },
  { id: 2, title: '出差报销申请', applicant: '李四', type: '报销', status: '已通过', submitDate: '2024-06-18', amount: 3500 },
  { id: 3, title: '软件许可证续费', applicant: '王五', type: '采购', status: '已驳回', submitDate: '2024-06-15', amount: 28000 },
  { id: 4, title: '会议室预订', applicant: '赵六', type: '行政', status: '待审批', submitDate: '2024-06-21', amount: 0 },
])

const tableProRef = ref()
const page = ref(1)
const pageSize = ref(10)

const confirmHandlers = {
  add: (formData) => { data.value = [...data.value, { ...formData, id: Date.now(), status: '待审批' }] },
}

function approve(row) {
  const idx = data.value.findIndex(r => r.id === row.id)
  if (idx !== -1) data.value[idx] = { ...row, status: '已通过' }
}

function reject(row) {
  const idx = data.value.findIndex(r => r.id === row.id)
  if (idx !== -1) data.value[idx] = { ...row, status: '已驳回' }
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
  >
    <template #action-col="{ row }">
      <TableAction
        :actions="[
          ...(row.status === '待审批' ? [
            { label: '通过', onClick: () => approve(row), meta: { type: 'success' } },
            { label: '驳回', onClick: () => reject(row), meta: { type: 'error' } },
          ] : []),
          { label: '详情', onClick: () => tableProRef?.openDetail(row) },
        ]"
      />
    </template>
  </TablePro>
</template>
```

---

## 自定义搜索表单

独立使用 Search 组件，配合自定义表单控件。

```vue live
<script setup>
import { ref } from 'vue'

const schema = [
  { name: 'keyword', label: '关键词', type: 'input', componentProps: { placeholder: '搜索名称、编号...' } },
  { name: 'status', label: '状态', type: 'select', componentProps: { options: [{ label: '全部', value: '' }, { label: '启用', value: '1' }, { label: '禁用', value: '0' }] } },
  { name: 'dateRange', label: '日期范围', type: 'datePicker', componentProps: { type: 'daterange' } },
  { name: 'minAmount', label: '最小金额', type: 'inputNumber', componentProps: { min: 0, placeholder: '最低金额' } },
  { name: 'maxAmount', label: '最大金额', type: 'inputNumber', componentProps: { min: 0, placeholder: '最高金额' } },
  { name: 'category', label: '分类', type: 'cascader', componentProps: { options: [{ label: '电子产品', value: 'electronics', children: [{ label: '手机', value: 'phone' }, { label: '电脑', value: 'computer' }] }, { label: '办公用品', value: 'office' }] } },
]

const form = ref({})

function handleSearch(values) {
  console.log('搜索条件:', values)
}

function handleReset() {
  console.log('已重置')
}
</script>

<template>
  <n-card title="高级搜索">
    <Search
      :schema="schema"
      v-model="form"
      :default-visible-count="4"
      :grid-props="{ cols: 3, xGap: 16, yGap: 12 }"
      :form-item-props="{ labelWidth: 80, labelPlacement: 'left' }"
      @search="handleSearch"
      @reset="handleReset"
    />
    <n-divider />
    <p>当前搜索条件: {{ JSON.stringify(form) }}</p>
  </n-card>
</template>
```

---

## 独立分页

在表格之外单独使用分页组件。

```vue live
<script setup>
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(10)
const total = ref(256)

function handleChange(p, ps) {
  console.log('页码:', p, '每页:', ps)
}
</script>

<template>
  <n-card title="独立分页">
    <p>共 {{ total }} 条数据，当前第 {{ page }} 页，每页 {{ pageSize }} 条</p>
    <Pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :item-count="total"
      @change="handleChange"
    />
  </n-card>
</template>
```

---

## 操作按钮组合

TableAction 的各种按钮组合方式。

```vue live
<script setup>
const primaryActions = [
  { label: '编辑', onClick: () => console.log('编辑') },
  { label: '删除', onClick: () => console.log('删除'), meta: { type: 'error' } },
]

const dropdownOnly = [
  { label: '查看详情', onClick: () => console.log('详情') },
  { label: '导出 PDF', onClick: () => console.log('导出 PDF') },
  { label: '导出 Excel', onClick: () => console.log('导出 Excel') },
  { label: '打印', onClick: () => console.log('打印') },
]

const mixedActions = [
  { label: '审批', onClick: () => console.log('审批'), meta: { type: 'success' } },
  { label: '驳回', onClick: () => console.log('驳回'), meta: { type: 'error' } },
]

const mixedDropdown = [
  { label: '转交', onClick: () => console.log('转交') },
  { label: '加签', onClick: () => console.log('加签') },
  { label: '退回', onClick: () => console.log('退回') },
]
</script>

<template>
  <n-space vertical>
    <n-card title="主要按钮 + 下拉菜单">
      <TableAction :actions="primaryActions" :dropDownActions="dropdownOnly" />
    </n-card>
    <n-card title="审批按钮 + 更多操作">
      <TableAction :actions="mixedActions" :dropDownActions="mixedDropdown" />
    </n-card>
    <n-card title="仅下拉菜单">
      <TableAction :dropDownActions="dropdownOnly" />
    </n-card>
  </n-space>
</template>
```

---

## 自定义 Modal 按钮

覆盖 Modal 默认的底部按钮。

```vue live
<script setup>
import { ref } from 'vue'

const visible = ref(false)
const schema = [
  { name: 'title', label: '标题', type: 'input', rules: [{ required: true, message: '请输入标题' }] },
  { name: 'content', label: '内容', type: 'textarea' },
  { name: 'priority', label: '优先级', type: 'select', componentProps: { options: [{ label: '高', value: 'high' }, { label: '中', value: 'medium' }, { label: '低', value: 'low' }] } },
]
</script>

<template>
  <n-button type="primary" @click="visible = true">创建工单</n-button>

  <Modal
    :visible="visible"
    mode="add"
    :form-schema="schema"
    @update:visible="visible = $event"
  >
    <template #actions="{ onConfirm, onCancel }">
      <n-space>
        <n-button @click="onCancel">取消</n-button>
        <n-button type="warning" @click="onConfirm">保存草稿</n-button>
        <n-button type="primary" @click="onConfirm">提交审批</n-button>
      </n-space>
    </template>
  </Modal>
</template>
```

---

## 表单内嵌 FormRenderer

在 Modal 之外独立使用 FormRenderer，配合自定义按钮。

```vue live
<script setup>
import { ref } from 'vue'

const schema = [
  { name: 'name', label: '姓名', type: 'input', rules: [{ required: true, message: '请输入姓名' }] },
  { name: 'email', label: '邮箱', type: 'input', rules: [{ required: true, type: 'email', message: '请输入有效邮箱' }] },
  { name: 'phone', label: '电话', type: 'input' },
  { name: 'department', label: '部门', type: 'select', componentProps: { options: [{ label: '技术部', value: 'tech' }, { label: '产品部', value: 'product' }, { label: '设计部', value: 'design' }] } },
  { name: 'joinDate', label: '入职日期', type: 'datePicker' },
  { name: 'active', label: '在职状态', type: 'switch' },
]

const formRendererRef = ref(null)
const formData = ref({})

function handleSubmit() {
  formRendererRef.value?.formRef?.validate((errors) => {
    if (!errors) {
      console.log('提交数据:', formData.value)
    }
  })
}
</script>

<template>
  <n-card title="员工信息表单">
    <FormRenderer
      ref="formRendererRef"
      :schema="schema"
      v-model="formData"
      :grid-props="{ cols: 2, xGap: 16 }"
      :form-item-props="{ labelWidth: 80, labelPlacement: 'left' }"
    >
      <template #actions>
        <n-space>
          <n-button @click="formData = {}">重置</n-button>
          <n-button type="primary" @click="handleSubmit">提交</n-button>
        </n-space>
      </template>
    </FormRenderer>
  </n-card>
</template>
```

---

## TableAction 自定义属性

通过 `meta` 传递按钮属性。

```vue live
<script setup>
const actions = [
  { label: '主要', onClick: () => {}, meta: { type: 'primary' } },
  { label: '成功', onClick: () => {}, meta: { type: 'success' } },
  { label: '警告', onClick: () => {}, meta: { type: 'warning' } },
  { label: '错误', onClick: () => {}, meta: { type: 'error' } },
  { label: '禁用', onClick: () => {}, meta: { type: 'default', disabled: true } },
  { label: '加载中', onClick: () => {}, meta: { type: 'primary', loading: true } },
]

const sizeActions = [
  { label: '小按钮', onClick: () => {}, meta: { size: 'tiny' } },
  { label: '小按钮', onClick: () => {}, meta: { size: 'small' } },
  { label: '中按钮', onClick: () => {}, meta: { size: 'medium' } },
  { label: '大按钮', onClick: () => {}, meta: { size: 'large' } },
]
</script>

<template>
  <n-space vertical>
    <n-card title="按钮类型">
      <TableAction :actions="actions" />
    </n-card>
    <n-card title="按钮尺寸">
      <TableAction :actions="sizeActions" />
    </n-card>
  </n-space>
</template>
```
