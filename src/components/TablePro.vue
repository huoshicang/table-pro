<template>
  <!-- 搜索表单 -->
  <Search
    :schema="searchSchema"
    v-model="searchForm"
    @search="emit('search', $event)"
    @reset="handleReset"
    :formProps="formProps"
  />

  <!-- 表格区域 -->
  <div class="table-pro-layout">
    <Table
      :data="data"
      :columns="columns"
      :showAdd="true"
      @action="handleAction"
      @batch-delete="emit('batch-delete', $event)"
    >
      <template #action-col="{ row }">
        <slot name="action-col" :row="row" />
      </template>
    </Table>

    <!-- 分页 -->
    <div class="table-pro-pagination">
      <Pagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :item-count="itemCount"
        :pagination-props="paginationProps"
        @change="onPageChange"
      />
    </div>
  </div>

  <!-- 新增/编辑/详情 Modal -->
  <Modal
    v-model:visible="modalVisible"
    :mode="modalMode"
    :row-data="editingRow"
    :form-schema="derivedFormSchema"
    :confirm-handlers="confirmHandlers"
    @cancel="handleModalCancel"
  >
    <!-- 动态透传父组件所有 slot 到 Modal -->
    <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
      <slot :name="name" v-bind="scope || {}" />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import Search from '@/components/Search.vue'
import Table from '@/components/Table.vue'
import Modal from '@/components/Modal.vue'
import Pagination from '@/components/Pagination.vue'
import { columnsToSchema } from '@/types/table'
import type { TableColumn } from '@/types/table'
import type { FormConfig, PaginationConfig } from '@/index'
import type { ConfirmHandlers } from '@/types/common'

// ========================================================================
// Props & Emits
// ========================================================================

interface Props {
  /** 列配置 */
  columns: TableColumn[]
  /** 表格数据 */
  data?: Record<string, unknown>[]
  /** form 组件的 props */
  formProps?: FormConfig
  /** Modal 确认回调，按模式分发 */
  confirmHandlers?: ConfirmHandlers
  /** 总条目数 */
  itemCount?: number
  /** 分页组件的 props，合并时会覆盖全局配置中的同名字段 */
  paginationProps?: PaginationConfig
  /** 表单字段默认栅格跨度（默认 1，antd 24 列栅格建议 8） */
  defaultSpan?: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  formProps: () => ({}),
  confirmHandlers: () => ({}),
  itemCount: 0,
  paginationProps: () => ({}),
  defaultSpan: 1,
})

const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

const emit = defineEmits<{
  /** 用户点击搜索按钮 */
  search: [values: Record<string, unknown>]
  /** 用户点击重置按钮 */
  reset: []
  /** 用户点击批量删除 */
  'batch-delete': [keys: unknown[]]
  change: [page: number, pageSize: number]
}>()

// ========================================================================
// Search
// ========================================================================

/** 从 columns 自动派生搜索表单 schema：仅包含 config.isSearch 为 true 的列 */
const searchSchema = computed(() =>
  columnsToSchema(props.columns, (col) => !!col.config?.isSearch, props.defaultSpan),
)

const searchForm = ref<Record<string, unknown>>({})

function handleReset() {
  const empty: Record<string, unknown> = {}
  for (const col of props.columns) {
    if (col.config?.isSearch) {
      empty[col.key] = undefined
    }
  }
  searchForm.value = empty
  emit('reset')
}

// ========================================================================
// Table
// ========================================================================

function handleAction(actionKey: string) {
  if (actionKey === 'add') {
    openAdd()
  }
}

// ========================================================================
// Pagination（computed get/set 替代 refs + watchers）
// ========================================================================

/** 统一管理 page/pageSize 的双向绑定，自动处理 pageSize 变化时的页码重置 */
function onPageChange(newPage: number, newPageSize: number) {
  const effectivePage = newPageSize !== pageSize.value ? 1 : newPage
  page.value = effectivePage
  pageSize.value = newPageSize
  emit('change', effectivePage, newPageSize)
}

// ========================================================================
// Modal（新增/编辑/详情）
// ========================================================================

const modalVisible = ref(false)
const modalMode = ref<'add' | 'edit' | 'detail'>('add')
const editingRow = ref<Record<string, unknown> | null>(null)

/** 从 columns 自动派生 Modal 表单 schema，仅包含未隐藏的列 */
const derivedFormSchema = computed(() =>
  columnsToSchema(props.columns, (col) => !col.hidden, props.defaultSpan),
)

/** 打开新增弹窗 */
function openAdd() {
  modalMode.value = 'add'
  editingRow.value = null
  modalVisible.value = true
}

/** 打开编辑弹窗，回填行数据 */
function openEdit(row: Record<string, unknown>) {
  modalMode.value = 'edit'
  editingRow.value = row
  modalVisible.value = true
}

/** 打开详情弹窗，回填行数据（只读） */
function openDetail(row: Record<string, unknown>) {
  modalMode.value = 'detail'
  editingRow.value = row
  modalVisible.value = true
}

function handleModalCancel() {
  editingRow.value = null
  modalVisible.value = false
}

// ========================================================================
// 对外暴露：父组件可通过 ref 调用 openAdd / openEdit / openDetail
// ========================================================================

defineExpose({ openAdd, openEdit, openDetail })
</script>

<style scoped>
.table-pro-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-pro-pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
