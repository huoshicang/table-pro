<script setup lang="ts">
import { ref } from 'vue'

import TablePro from '@/components/TablePro.vue'
import TableAction from '@/components/TableAction.vue'
import type { ActionItem } from '@/types/common'
import type { TableColumn } from '@/types/table'

// ========================================================================
// 列配置
// ========================================================================

interface RowData {
  id: number | string
  applyNo: string
  name: string
  applyDate: string
  leaveType: string
  startTime: string
  endTime: string
  status: string
}

const columns: TableColumn<RowData>[] = [
  {
    key: 'applyNo',
    title: '申请编号',
    sortable: true,
    config: { isSearch: true, type: 'input' },
    meta: { placeholder: '请输入申请编号' },
  },
  {
    key: 'name',
    title: '名称',
    sortable: true,
    config: { isSearch: true, type: 'input' },
  },
  {
    key: 'age',
    title: '年龄',
    sortable: true,
    config: { isSearch: true, type: 'input' },
  },
  {
    key: 'applyDate',
    title: '申请日期',
    sortable: true,
    config: { isSearch: true, type: 'datePicker' },
    meta: { type: 'date', placeholder: '请选择日期' },
  },
  {
    key: 'leaveType',
    title: '请假类别',
    config: { isSearch: true, type: 'select' },
    meta: { options: [{ label: '病假', value: '病假' }, { label: '年假', value: '年假' }, { label: '事假', value: '事假' }] },
  },
  { key: 'startTime', title: '请假开始时间' },
  { key: 'endTime', title: '请假结束时间' },
  { key: 'status', title: '流程状态' },
]

// ========================================================================
// 表格数据
// ========================================================================

const tableData = ref<RowData[]>([
  {
    id: 0,
    applyNo: '1000002125414575',
    name: 'admin',
    applyDate: '2024-05-29',
    leaveType: '病假',
    startTime: '2024-06-03 17:00:09',
    endTime: '2024-06-04 17:00:12',
    status: '已完成',
  },
  {
    id: 1,
    applyNo: '10000000000000',
    name: 'aaaaa',
    applyDate: '2024-05-29',
    leaveType: '病假',
    startTime: '2024-06-03 17:00:09',
    endTime: '2024-06-04 17:00:12',
    status: '已完成',
  },
])

// ========================================================================
// 操作按钮
// ========================================================================

function getTableAction(record: RowData): ActionItem[] {
  return [
    {
      label: '编辑',
      onClick: () => tableProRef.value?.openEdit(record as unknown as Record<string, unknown>),
    },
    {
      label: '删除',
      onClick: () => handleDelete(record),
    },
  ]
}

function getDropDownAction(record: RowData): ActionItem[] {
  return [
    {
      label: '详情',
      onClick: () => tableProRef.value?.openDetail(record as unknown as Record<string, unknown>),
    },
  ]
}

// ========================================================================
// 事件处理
// ========================================================================

function handleDelete(record: RowData) {
  console.log(`删除：`, record)
}

function handleSearch(values: Record<string, unknown>) {
  console.log('搜索:', values)
}

function handleReset() {
  console.log('重置')
}

function handleBatchDelete(keys: unknown[]) {
  console.log('batch-delete keys:', keys)
}

function handleAddConfirm(formData: Record<string, unknown>) {
  console.log('新增:', formData)
}

function handleEditConfirm(formData: Record<string, unknown>) {
  console.log('编辑:', formData)
}

function handleDetailConfirm(formData: Record<string, unknown>) {
  console.log('详情:', formData)
}

function handlePageChange(page: number, pageSize: number) {
  console.log('分页变化:', page, pageSize)
}

const confirmHandlers = {
  add: handleAddConfirm,
  edit: handleEditConfirm,
  detail: handleDetailConfirm,
}

const tableProRef = ref<InstanceType<typeof TablePro>>()
const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <TablePro
    ref="tableProRef"
    :columns="columns as TableColumn[]"
    :data="tableData as Record<string, unknown>[]"
    @search="handleSearch"
    @reset="handleReset"
    @batch-delete="handleBatchDelete"
    :confirm-handlers="confirmHandlers"
    v-model:page="page"
    v-model:page-size="pageSize"
    :item-count="100"
    @change="handlePageChange"
  >
    <template #action-col="{ row }">
      <TableAction
        :actions="getTableAction(row as unknown as RowData)"
        :dropDownActions="getDropDownAction(row as unknown as RowData)"
      />
    </template>
  </TablePro>
</template>
