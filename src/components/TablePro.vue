<template>
  <!-- 搜索表单 -->
  <Search
    :schema="searchSchema"
    v-model="searchForm"
    @search="handleSearch"
    @reset="handleReset"
    :formProps="formProps"
  />

  <!-- 表格区域 -->
  <div class="table-pro-layout">
    <Table
      :data="tableData as unknown[]"
      :columns="tableColumns as unknown as TableColumn<unknown>[]"
      :showAdd="true"
      @action="(actionKey, row) => handleTableAction(actionKey, row as unknown as RowData)"
      @batch-delete="handleBatchDelete"
    />
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import Search from '@/components/Search.vue'
import Table from '@/components/Table.vue'
import type { SearchField } from '@/types/search'
import type { TableColumn } from '@/types/table'

// ========================================================================
// Search
// ========================================================================

/** 从 tableColumns 自动派生搜索表单 schema：仅包含 config.isSearch 为 true 的列 */
const searchSchema = computed<SearchField[]>(() =>
  tableColumns
    .filter((col) => col.config?.isSearch)
    .map((col) => ({
      name: col.key,
      label: col.title,
      type: (col.config?.type ?? 'input') as SearchField['type'],
      span: 1,
      componentProps: col.meta as Record<string, unknown> | undefined,
    })),
)

const searchForm = ref<Record<string, unknown>>({})

function handleSearch(values: Record<string, unknown>) {
  console.log('search values:', values)
}

function handleReset() {
  const empty: Record<string, unknown> = {}
  for (const col of tableColumns) {
    if (col.config?.isSearch) {
      empty[col.key] = undefined
    }
  }
  searchForm.value = empty
}

const formProps = {}

// ========================================================================
// Table
// ========================================================================

interface RowData {
  type?: string
  id: number | string
  applyNo: string
  name: string
  applyDate: string
  leaveType: string
  startTime: string
  endTime: string
  status: string
}

const tableData: RowData[] = [
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
]

const tableColumns: TableColumn<RowData>[] = [
  {
    key: 'applyNo',
    title: '申请编号',
    sortable: true,
    config: { isEdit: true, isDelete: true, isSearch: true, type: 'input' },
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
  },
  {
    key: 'leaveType',
    title: '请假类别',
    config: { isSearch: true, type: 'select' },
  },
  { key: 'startTime', title: '请假开始时间' },
  { key: 'endTime', title: '请假结束时间' },
  { key: 'status', title: '流程状态' },
]

function handleTableAction(actionKey: string, row: RowData) {
  if (actionKey === 'add') {
    handleAdd()
  } else if (actionKey === 'edit') {
    openEditModal(row)
  } else if (actionKey === 'delete') {
    const idx = tableData.findIndex((r) => r.id === row.id)
    if (idx !== -1) {
      tableData.splice(idx, 1)
    }
  }
}

/** 批量删除：根据选中的 key 数组删除对应行 */
function handleBatchDelete(keys: unknown[]) {
  console.log(`删除列${keys}`)
}

// ========================================================================
// Modal（新增/编辑）
// ========================================================================

const modalVisible = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const editingRow = ref<RowData | null>(null)



function handleAdd() {
  modalMode.value = 'add'
  editingRow.value = null
  modalVisible.value = true
}

function openEditModal(row: RowData) {
  modalMode.value = 'edit'
  editingRow.value = { ...row }
  modalVisible.value = true
}

</script>

<style scoped>
.table-pro-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content {
  min-height: 400px;
}
</style>
