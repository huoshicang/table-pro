<template>
  <!-- 根节点：动态表格组件，通过 mergedTableProps 传入合并后的配置 -->
  <component
    :is="getComponent('table')"
    ref="tableRef"
    size="small"
    :columns="effectiveColumns"
    :data="effectiveData"
    v-bind="mergedTableProps"
  />
</template>

<script setup lang="ts" generic="T">
import { h, inject, ref, computed } from 'vue'

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
  /** 操作按钮配置，渲染在表格最右侧的操作列 */
  actions?: TableAction[]
  /** n-table 的 props，合并时会覆盖全局配置中的同名字段 */
  tableProps?: TableConfig
}

interface TableAction {
  /** 操作按钮的 key，用于具名插槽区分 */
  key: string
  /** 按钮文案 */
  label: string
}

// ========================================================================
// Props 默认值
// ========================================================================

const props = withDefaults(defineProps<Props>(), {
  data: () => [] as unknown as T[],
  columns: () => [] as unknown as TableColumn<T>[],
  actions: () => [],
  tableProps: () => ({}),
})

const emit = defineEmits<{
  /** 用户点击操作按钮时触发，参数为操作 key 和行数据 */
  action: [actionKey: string, row: T]
}>()

// ========================================================================
// 依赖注入与状态
// ========================================================================

/** 表格组件 ref */
const tableRef = ref<ComponentPublicInstance | null>(null)
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

/** 是否有操作按钮 */
const hasAction = computed(() => props.actions.length > 0)

/** 有效的列配置：过滤掉 hidden 为 true 的列 */
const effectiveColumns = computed<TableColumn<T>[]>(() => {
  let cols = props.columns.filter((col) => !col.hidden)

  // 如果有操作按钮，追加一列
  if (hasAction.value) {
    cols = [
      ...cols,
      {
        key: '__action__',
        title: '操作',
        render: (row: T) => renderActions(row),
      } as TableColumn<T>,
    ]
  }

  return cols
})

/** 有效的数据 */
const effectiveData = computed<T[]>(() => props.data ?? [])

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
function handleAction(actionKey: string, row: T) {
  emit('action', actionKey, row)
}

/** 渲染操作列中的按钮组 */
function renderActions(row: T) {
  const spaceComp = getComponent('space')
  const btnComp = getComponent('button')

  return h(
    spaceComp!,
    {},
    props.actions.map((action) => {
      return h(
        btnComp!,
        {
          attrType: 'button',
          size: 'small',
          onClick: () => handleAction(action.key, row),
        },
        { default: () => action.label },
      )
    }),
  )
}

// ========================================================================
// 暴露
// ========================================================================

defineExpose({
  /** 表格组件 ref，供外部调用 n-table 的方法（如 sort / filter） */
  tableRef,
})
</script>

<style scoped></style>
