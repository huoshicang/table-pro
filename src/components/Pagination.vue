<template>
  <component
    :is="Pagination"
    v-bind="mergedPaginationProps"
    :page="page"
    :page-size="pageSize"
    @update:page="handlePageUpdate"
    @update:page-size="handlePageSizeUpdate"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useComponentMap } from '@/composables/useComponentMap'
import { useMergedProps } from '@/composables/useMergedProps'
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
  'update:pageSize': [pageSize: number]
  /** 页码或每页条数变化时触发 */
  change: [page: number, pageSize: number]
}>()

// ========================================================================
// 依赖注入
// ========================================================================

const { getComponent } = useComponentMap()
/** 常用组件引用：提取为变量，避免模板中重复调用 getComponent */
const Pagination = getComponent('pagination', ['text'])

// ========================================================================
// 分页状态（computed get/set 替代 refs + watchers）
// ========================================================================

/** 统一管理 page/pageSize 的双向绑定，自动处理 pageSize 变化时的页码重置 */
const { page, pageSize, onPageChange } = usePaginationState(props, emit)

/**
 * 处理分页组件的 update:page 事件
 * @description 更新 page 并触发 change 事件，传递当前 pageSize
 */
function handlePageUpdate(newPage: number) {
  onPageChange(newPage, pageSize.value)
}

/**
 * 处理分页组件的 update:page-size 事件
 * @description 更新 pageSize 并触发 change 事件，自动重置 page 为 1
 */
function handlePageSizeUpdate(newPageSize: number) {
  onPageChange(page.value, newPageSize)
}

// ========================================================================
// 配置合并：全局默认 → 组件 props 覆盖
// ========================================================================

/**
 * 合并分页配置：全局默认 → 组件传入 props，后者覆盖前者
 * 排除 page/pageSize，避免与分页组件的显式 prop 冲突
 */
const basePaginationProps = useMergedProps<PaginationConfig>(
  'pagination',
  () => props.paginationProps,
  { size: 'medium', showQuickJumper: true, showSizePicker: true },
)
const mergedPaginationProps = computed<PaginationConfig>(() => {
  const { page: _p, pageSize: _ps, ...rest } = basePaginationProps.value
  return rest
})
</script>

<style scoped></style>
