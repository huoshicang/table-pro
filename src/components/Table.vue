<template>
  <!-- 外层容器：顶部工具栏（新增按钮）+ 表格 -->
  <div class="table-layout">
    <!-- 顶部工具栏插槽：新增按钮等 -->
    <div class="table-toolbar">
      <slot name="toolbar">
        <component :is="getComponent('space')">
          <component
            v-if="showAdd"
            :is="getComponent('button')"
            attr-type="button"
            @click="handleAction('add', undefined as unknown as T)"
          >
            新增
          </component>
          <component
            v-if="checkedRowKeys.length > 0"
            :is="getComponent('button')"
            attr-type="button"
            @click="handleBatchDelete"
          >
            批量删除（{{ checkedRowKeys.length }}）
          </component>
        </component>
      </slot>
    </div>

    <!-- 动态表格组件，通过 mergedTableProps 传入合并后的配置 -->
    <component
      :is="getComponent('table')"
      ref="tableRef"
      :columns="effectiveColumns"
      :data="effectiveData"
      :row-key="(row: T) => (row as Record<string, unknown>)[props.rowKey]"
      :checked-row-keys="checkedRowKeys"
      @update:checked-row-keys="onCheckedRowKeysChange"
      v-bind="mergedTableProps"
    >
      <!-- 操作列插槽：允许外部自定义操作列渲染 -->
      <template #action-col="{ row }">
        <slot name="action-col" :row="row">
          <component :is="getComponent('space')">
            <component
              v-if="canEdit(row)"
              :is="getComponent('button')"
              attr-type="button"
              size="small"
              @click="handleAction('edit', row)"
            >
              编辑
            </component>
            <component
              v-if="canDelete(row)"
              :is="getComponent('button')"
              attr-type="button"
              size="small"
              @click="handleAction('delete', row)"
            >
              删除
            </component>
            <slot
              v-for="customAction in customActions"
              :key="customAction.key"
              :name="`action-${customAction.key}`"
              :row="row"
              :onClick="(r: T) => customAction.handler(r)"
            >
              <component
                :is="getComponent('button')"
                attr-type="button"
                size="small"
                @click="customAction.handler(row)"
              >
                {{ customAction.label }}
              </component>
            </slot>
          </component>
        </slot>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts" generic="T">
import { h, inject, ref, computed } from 'vue'
import type { VNode } from 'vue'

import type { ComponentPublicInstance } from 'vue'
import { TABLE_COMPONENTS_KEY } from '@/index'
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
  /** 自定义操作按钮配置 */
  extraActions?: TableAction[]
  /** n-table 的 props，合并时会覆盖全局配置中的同名字段 */
  tableProps?: TableConfig
  /** 行数据唯一标识字段名（默认 'key'），用于多选功能 */
  rowKey?: string
}

interface TableAction {
  /** 操作按钮的 key，用于具名插槽区分 */
  key: string
  /** 按钮文案 */
  label: string
  /** 点击回调 */
  handler: (row: T) => void
}

// ========================================================================
// Props 默认值
// ========================================================================

const props = withDefaults(defineProps<Props>(), {
  data: () => [] as unknown as T[],
  columns: () => [] as unknown as TableColumn<T>[],
  showAdd: true,
  extraActions: () => [],
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
const injection = inject(TABLE_COMPONENTS_KEY, { components: {} })
const componentMap = injection.components
/** 提取全局组件默认配置 */
const globalComponentDefaults = injection.config?.components

// ========================================================================
// 配置合并：全局默认 → 组件 props 覆盖
// ========================================================================

/** 合并表格配置：全局默认 → 组件传入 props，后者覆盖前者 */
const mergedTableProps: TableConfig = {
  ...(globalComponentDefaults?.table ?? {}),
  ...props.tableProps,
}

// ========================================================================
// 计算属性
// ========================================================================

/** 有效列配置：首列追加多选列，过滤 hidden，末尾追加操作列 */
const effectiveColumns = computed<TableColumn<T>[]>(() => {
  let cols = props.columns.filter((col) => !col.hidden)

  // 首列追加多选列
  cols = [{ type: 'selection' } as unknown as TableColumn<T>, ...cols]

  // 末尾追加操作列
  cols = [
    ...cols,
    {
      key: '__action__',
      title: '操作',
      render: (row: T) => renderActions(row),
    } as TableColumn<T>,
  ]

  return cols
})

/** 有效的数据 */
const effectiveData = computed<T[]>(() => props.data ?? [])

/** 自定义操作按钮列表 */
const customActions = computed<TableAction[]>(() => props.extraActions)

// ========================================================================
// 工具函数
// ========================================================================

/** 根据组件类型名从注入的 ComponentMap 中查找组件，未找到时 fallback 到 text / input */
function getComponent(type: string) {
  return (
    (componentMap as Record<string, (typeof componentMap)[keyof typeof componentMap]>)[type] ??
    componentMap.text ??
    componentMap.input
  )
}

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

/** 判断是否可编辑：第一列 config.isEdit 为 true */
function canEdit(row: T): boolean {
  const firstCol = props.columns[0]?.config
  return firstCol?.isEdit ?? true
}

/** 判断是否可删除：第一列 config.isDelete 为 true */
function canDelete(row: T): boolean {
  const firstCol = props.columns[0]?.config
  return firstCol?.isDelete ?? true
}

/** 渲染操作列中的按钮组 */
function renderActions(row: T) {
  const spaceComp = getComponent('space')
  const btnComp = getComponent('button')

  const buttons: VNode[] = []
  if (canEdit(row)) {
    buttons.push(
      h(
        btnComp!,
        { attrType: 'button', size: 'small', onClick: () => handleAction('edit', row) },
        { default: () => '编辑' },
      ),
    )
  }
  if (canDelete(row)) {
    buttons.push(
      h(
        btnComp!,
        { attrType: 'button', size: 'small', onClick: () => handleAction('delete', row) },
        { default: () => '删除' },
      ),
    )
  }

  // 自定义操作按钮
  props.extraActions.forEach((action) => {
    buttons.push(
      h(
        btnComp!,
        { attrType: 'button', size: 'small', onClick: () => action.handler(row) },
        { default: () => action.label },
      ),
    )
  })

  return h(spaceComp!, {}, buttons)
}

// ========================================================================
// 暴露
// ========================================================================

defineExpose({
  /** 表格组件 ref，供外部调用 n-table 的方法（如 sort / filter） */
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
