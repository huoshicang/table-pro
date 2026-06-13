<template>
  <Search
    :schema="searchSchema"
    v-model="searchForm"
    @search="handleSearch"
    @reset="handleReset"
    :formProps="formProps"
  />
  <Table
    :data="tableData as unknown[]"
    :columns="tableColumns as unknown as TableColumn[]"
    :actions="tableActions"
    @action="(actionKey, row) => handleTableAction(actionKey, row as unknown as RowData)"
  />
  <!--<Pagination />-->
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Search from '@/components/Search.vue'
import Pagination from '@/components/Pagination.vue'
import Table from '@/components/Table.vue'
import type { SearchField } from '@/types/search'
import type { TableColumn } from '@/types/table'

// ========================================================================
// Search
// ========================================================================

const searchSchema: SearchField[] = [
  { name: 'name', label: '姓名', type: 'input', span: 1 },
  { name: 'age', label: '年龄', type: 'inputNumber', span: 1 },
  { name: 'phone', label: '电话号码', type: 'inputNumber', span: 1 },
]

const searchForm = ref<Record<string, unknown>>({
  name: '',
  age: undefined,
  phone: undefined,
})

function handleSearch(values: Record<string, unknown>) {
  console.log('search values:', values)
}

function handleReset() {
  searchForm.value = { name: '', age: undefined, phone: undefined }
}

const formProps = {
  rules: {
    name: {
      required: true,
      message: '请输入姓名',
      trigger: 'blur',
    },
    phone: {
      required: true,
      message: '请输入电话号码',
      trigger: ['blur', 'change'],
    },
  },
}

// ========================================================================
// Table
// ========================================================================

interface RowData {
  key: number
  name: string
  age: number
  address: string
}

const tableData: RowData[] = [
  { key: 0, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: 1, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: 2, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
]

const tableColumns: TableColumn<RowData>[] = [
  { key: 'name', title: '姓名', type: 'text', sortable: true },
  { key: 'age', title: '年龄', type: 'text', sortable: true },
  { key: 'address', title: '地址' },
]

const tableActions = [
  { key: 'edit', label: '编辑' },
  { key: 'delete', label: '删除' },
]

function handleTableAction(actionKey: string, row: RowData) {
  console.log(`action: ${actionKey}, row:`, row)
}
</script>

<style scoped></style>
