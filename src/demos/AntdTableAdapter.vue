<template>
  <ATable
    :columns="adaptedColumns"
    :data-source="data"
    :row-key="rowKey"
    :row-selection="rowSelection"
    v-bind="restProps"
  />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Table as ATable } from 'ant-design-vue'
import type { TableColumn } from '@/types/table'

interface Props {
  columns?: TableColumn[]
  data?: Record<string, unknown>[]
  rowKey?: string | ((record: Record<string, unknown>) => string)
  checkedRowKeys?: unknown[]
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  data: () => [],
  rowKey: 'id',
  checkedRowKeys: () => [],
})

const emit = defineEmits<{
  'update:checked-row-keys': [keys: unknown[]]
}>()

const attrs = useAttrs()

/** 将 TableColumn 格式转换为 antd Table 列格式 */
const adaptedColumns = computed(() =>
  (props.columns ?? []).map((col) => ({
    dataIndex: col.key,
    title: col.title,
    width: col.width,
    fixed: col.fixed,
    sorter: col.sortable ?? false,
    customRender: col.render
      ? ({ record }: { record: Record<string, unknown> }) => col.render!(record)
      : undefined,
  })),
)

/** 行选择配置 */
const rowSelection = computed(() => ({
  selectedRowKeys: props.checkedRowKeys ?? [],
  onChange: (keys: unknown[]) => emit('update:checked-row-keys', keys),
}))

/** 透传其余 props（排除已处理的） */
const restProps = computed(() => {
  const { columns, data, rowKey, checkedRowKeys, ...rest } = props
  return { ...attrs, ...rest }
})
</script>
