<template>
  <!-- 外层容器：顶部工具栏（新增按钮）+ 表格 -->
  <div class="table-layout">
    <!-- 顶部工具栏插槽：新增按钮等 -->
    <div class="table-toolbar">
      <slot name="toolbar">
        <component :is="Space">
          <component
            v-if="showAdd"
            :is="Button"
            attr-type="button"
            @click="handleAction('add', undefined as unknown as T)"
          >
            新增
          </component>
          <component
            v-if="checkedRowKeys.length > 0"
            :is="ConfirmButton"
            confirm-title="确认删除选中的数据？"
            @confirm="handleBatchDelete"
          >
            <component
              :is="Button"
              attr-type="button"
              type="error"
            >
              批量删除（{{ checkedRowKeys.length }}）
            </component>
          </component>
          <component
            v-if="checkedRowKeys.length > 0"
            :is="Button"
            attr-type="button"
            @click="checkedRowKeys = []"
          >
            清空
          </component>
        </component>
      </slot>
    </div>

    <!-- 动态表格组件，通过 mergedTableProps 传入合并后的配置 -->
    <component
      :is="Table"
      ref="tableRef"
      :columns="effectiveColumns"
      :data="effectiveData"
      :row-key="getRowKey"
      :checked-row-keys="checkedRowKeys"
      @update:checked-row-keys="onCheckedRowKeysChange"
      v-bind="mergedTableProps"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
import { ref, computed, useSlots } from 'vue'

import type { ComponentPublicInstance } from 'vue'
import { useComponentMap } from '@/composables/useComponentMap'
import { useMergedProps } from '@/composables/useMergedProps'
import ConfirmButton from '@/components/ConfirmButton.vue'
import type { TableConfig } from '@/index'
import type { TableColumn } from '@/types/table'

// ========================================================================
// Props & Emits
// ========================================================================

/** 表格组件的属性定义 */
interface Props {
  /** 表格数据 */
  data?: T[]
  /** 列配置数组，每个元素定义一列的 key / title / type 等 */
  columns?: TableColumn<T>[]
  /** 是否显示新增按钮（默认 false） */
  showAdd?: boolean
  /** 表格组件的 props，合并时会覆盖全局配置中的同名字段 */
  tableProps?: TableConfig
  /** 行数据唯一标识字段名（默认 'key'），用于多选功能 */
  rowKey?: string
}

// ========================================================================
// Props 默认值
// ========================================================================

const props = withDefaults(defineProps<Props>(), {
  data: () => [] as unknown as T[],
  columns: () => [] as unknown as TableColumn<T>[],
  showAdd: true,
  tableProps: () => ({}),
  rowKey: 'id',
})

const emit = defineEmits<{
  /** 用户点击操作按钮时触发，参数为操作 key 和行数据 */
  action: [actionKey: string, row: T | undefined]
  /** 用户点击批量删除时触发，参数为选中的行 key 数组 */
  'batch-delete': [keys: unknown[]]
}>()

// ========================================================================
// 依赖注入与状态
// ========================================================================

/** 表格组件 ref */
const tableRef = ref<ComponentPublicInstance | null>(null)
/** 多选：当前选中的行 key 数组 */
const checkedRowKeys = ref<unknown[]>([])
/** 从 ComponentMap 获取组件，Table 使用 ['text', 'input'] 回退链 */
const { getComponent } = useComponentMap(['text', 'input'])
/** 常用组件引用：提取为变量，避免模板中重复调用 getComponent */
const Button = getComponent('button')
const Space = getComponent('space')
const Table = getComponent('table')

/** 行唯一标识函数，提取为变量避免模板内联函数每次渲染重新创建 */
const getRowKey = (row: T) => (row as Record<string, unknown>)[props.rowKey]

/** 父组件传入的 slots，用于在 render 函数中转发 slot 内容 */
const slots = useSlots()

// ========================================================================
// 配置合并：全局默认 → 组件 props 覆盖（computed 响应式）
// ========================================================================

/** 合并表格配置：全局默认 → 组件传入 props，后者覆盖前者 */
const mergedTableProps = useMergedProps<TableConfig>('table', () => props.tableProps)

// ========================================================================
// 计算属性
// ========================================================================

/** 有效列配置：过滤 hidden，若父组件提供 action-col slot 则追加操作列 */
const effectiveColumns = computed<TableColumn<T>[]>(() => {
  let cols = props.columns.filter((col) => !col.hidden)

  // 仅当父组件提供 action-col slot 时追加操作列
  if (slots['action-col']) {
    cols = [
      ...cols,
      {
        key: 'action-col',
        title: '操作',
        render: (row: T) => {
          const slotFn = slots['action-col']
          return slotFn ? slotFn({ row }) : undefined
        },
      } as TableColumn<T>,
    ]
  }

  return cols
})

/** 有效的数据 */
const effectiveData = computed<T[]>(() => props.data ?? [])

/** 处理操作按钮点击 */
function handleAction(actionKey: string, row: T | undefined) {
  emit('action', actionKey, row)
}

/** 多选变化回调，同步选中状态 */
function onCheckedRowKeysChange(keys: unknown[]) {
  checkedRowKeys.value = keys
}

/** 批量删除：触发 batch-delete 事件并清空选中 */
function handleBatchDelete() {
  emit('batch-delete', [...checkedRowKeys.value])
  checkedRowKeys.value = []
}

// ========================================================================
// 暴露
// ========================================================================

defineSlots<{
  'action-col': (props: { row: T }) => any
  toolbar: () => any
}>()

defineExpose({
  /** 表格组件 ref，供外部调用表格组件的方法（如 sort / filter） */
  tableRef,
})
</script>

<style scoped>
.table-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-toolbar {
  /* 工具栏区域：新增按钮等 */
}
</style>
