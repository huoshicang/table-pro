import { computed } from 'vue'
import type { WritableComputedRef } from 'vue'

/**
 * 分页事件 emit 函数类型
 */
export interface PaginationEmit {
  (event: 'update:page', value: number): void
  (event: 'update:pageSize', value: number): void
  (event: 'change', page: number, pageSize: number): void
}

/**
 * 统一管理分页状态的双向绑定
 * @description 用 computed get/set 替代 refs + watchers 模式，
 * 消除 Pagination.vue 和 TablePro.vue 中重复的分页同步逻辑。
 * pageSize 变化时自动重置 page 为 1，避免页码越界。
 * @param props - 包含 page 和 pageSize 的 props 对象
 * @param emit - 组件的 emit 函数
 * @returns page/pageSize 的 WritableComputedRef + onPageChange 统一处理函数
 * @example
 * const { page, pageSize, onPageChange } = usePaginationState(props, emit)
 * // 模板中直接使用 <Pagination :page="page" :page-size="pageSize" @change="onPageChange" />
 */
export function usePaginationState(
  props: { page: number; pageSize: number },
  emit: PaginationEmit,
): {
  page: WritableComputedRef<number>
  pageSize: WritableComputedRef<number>
  onPageChange: (newPage: number, newPageSize: number) => void
} {
  /**
   * page 双向绑定：get 读取 props，set 触发 update:page 事件
   * 使用 computed get/set 替代 ref + watch，避免中间态不同步问题
   */
  const page = computed({
    get: () => props.page,
    set: (val: number) => emit('update:page', val),
  })

  /**
   * pageSize 双向绑定：get 读取 props，set 触发 update:pageSize 事件
   */
  const pageSize = computed({
    get: () => props.pageSize,
    set: (val: number) => emit('update:pageSize', val),
  })

  /**
   * 统一处理分页变化
   * @description 同时更新 page 和 pageSize，并触发 change 事件。
   * 当 pageSize 变化时自动重置 page 为 1，防止页码超出新总页数。
   * @param newPage - 新的页码
   * @param newPageSize - 新的每页条数
   */
  function onPageChange(newPage: number, newPageSize: number) {
    // pageSize 变化时重置到第 1 页，避免当前页码越界
    const effectivePage = newPageSize !== props.pageSize ? 1 : newPage
    page.value = effectivePage
    pageSize.value = newPageSize
    emit('change', effectivePage, newPageSize)
  }

  return { page, pageSize, onPageChange }
}
