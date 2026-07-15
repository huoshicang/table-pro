<template>
  <component :is="Pagination" v-bind="mappedProps" v-on="mappedEvents" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useComponentMap } from '@/composables/useComponentMap'
import { useMergedProps } from '@/composables/useMergedProps'
import { useComponentAdapter } from '@/composables/useComponentAdapter'
import { usePaginationState } from '@/composables/usePaginationState'
import type { PaginationConfig } from '@/index'

// ========================================================================
// Props & Emits
// ========================================================================

interface Props {
  /** 当前页码（v-model） */
  page?: number
  /** 每页条数（v-model） */
  pageSize?: number
  /** 总页数 */
  pageCount?: number
  /** 总条目数 */
  itemCount?: number
  /** 分页组件的 props，合并时会覆盖全局配置中的同名字段 */
  paginationProps?: PaginationConfig
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  pageSize: 10,
  pageCount: 1,
  itemCount: 0,
  paginationProps: () => ({}),
})

const emit = defineEmits<{
  'update:page': [page: number]
  'update:page-size': [pageSize: number]
  /** 页码或每页条数变化时触发 */
  change: [page: number, pageSize: number]
}>()

// ========================================================================
// 依赖注入
// ========================================================================

const { getComponent } = useComponentMap()
const Pagination = getComponent('pagination', ['text'])
const { mapProps, mapEvent } = useComponentAdapter('pagination')

// ========================================================================
// 分页状态
// ========================================================================

const { page, pageSize, onPageChange } = usePaginationState(props, emit)

function handlePageUpdate(newPage: number) {
  onPageChange(newPage, pageSize.value)
}

function handlePageSizeUpdate(newPageSize: number) {
  onPageChange(page.value, newPageSize)
}

// ========================================================================
// 配置合并 + 适配器映射
// ========================================================================

const basePaginationProps = useMergedProps<PaginationConfig>(
  'pagination',
  () => props.paginationProps,
  { size: 'medium', showQuickJumper: true, showSizePicker: true },
)

/** 合并后的 props 经过适配器映射，自动转换为 UI 库的实际 prop 名 */
const mappedProps = computed(() =>
  mapProps({
    ...basePaginationProps.value,
    page: page.value,
    pageSize: pageSize.value,
  }),
)

/** 事件名经适配器映射，自动转换为 UI 库的实际事件名 */
const mappedEvents = computed(() => ({
  [mapEvent('update:page')]: handlePageUpdate,
  [mapEvent('update:page-size')]: handlePageSizeUpdate,
}))
</script>

<style scoped></style>
