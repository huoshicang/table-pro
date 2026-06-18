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
    :visible="modalVisible"
    :mode="modalMode"
    :row-data="editingRow"
    :form-schema="derivedFormSchema"
    :confirm-handlers="confirmHandlers"
    @update:visible="modalVisible = $event"
    @cancel="handleModalCancel"
  >
    <!-- 动态透传父组件所有 slot 到 Modal -->
    <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
      <slot :name="name" v-bind="scope || {}" />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import Search from '@/components/Search.vue'
import Table from '@/components/Table.vue'
import Modal from '@/components/Modal.vue'
import Pagination from '@/components/Pagination.vue'
import { usePaginationState } from '@/composables/usePaginationState'
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
  /** 当前页码（v-model） */
  page?: number
  /** 每页条数（v-model） */
  pageSize?: number
  /** 总条目数 */
  itemCount?: number
  /** 分页组件的 props，合并时会覆盖全局配置中的同名字段 */
  paginationProps?: PaginationConfig
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  formProps: () => ({}),
  confirmHandlers: () => ({}),
  page: 1,
  pageSize: 10,
  itemCount: 0,
  paginationProps: () => ({}),
})

const emit = defineEmits<{
  /** 用户点击搜索按钮 */
  search: [values: Record<string, unknown>]
  /** 用户点击重置按钮 */
  reset: []
  /** 用户点击批量删除 */
  'batch-delete': [keys: unknown[]]
  /** 页码或每页条数变化 */
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
  change: [page: number, pageSize: number]
}>()

// ========================================================================
// Search
// ========================================================================

/** 从 columns 自动派生搜索表单 schema：仅包含 config.isSearch 为 true 的列 */
const searchSchema = computed(() => columnsToSchema(props.columns, (col) => !!col.config?.isSearch))

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
const { page, pageSize, onPageChange } = usePaginationState(props, emit)

// ========================================================================
// Modal（新增/编辑/详情）
// ========================================================================

const modalVisible = ref(false)
const modalMode = ref<'add' | 'edit' | 'detail'>('add')
const editingRow = ref<Record<string, unknown> | null>(null)

/** 从 columns 自动派生 Modal 表单 schema，仅包含未隐藏的列 */
const derivedFormSchema = computed(() => columnsToSchema(props.columns, (col) => !col.hidden))

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
