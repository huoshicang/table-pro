import { computed } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

import { useComponentMap } from '@/composables/useComponentMap'
import type { ComponentDefaultsConfig } from '@/index'

/**
 * 合并全局默认配置与组件本地 props
 * @description 从注入的全局配置中提取指定 section 的默认值，
 * 与组件传入的 localProps 做浅合并（后者覆盖前者），返回响应式 computed。
 * 替代各组件中重复的 `...(globalComponentDefaults?.x ?? {}), ...props.xProps` 模式。
 * @param sectionKey - 全局配置中的 section 名（如 'form'、'modal'、'pagination'）
 * @param localProps - 组件传入的本地配置（getter 函数或 ref）
 * @param defaults - 可选的内联默认值，优先级低于 localProps
 * @returns 合并后的响应式配置对象
 * @example
 * // 基本用法
 * const mergedModalProps = useMergedProps('modal', () => props.modalProps)
 * // 带内联默认值
 * const mergedGridProps = useMergedProps('grid', () => props.gridProps, { cols: 4, xGap: 12 })
 */
export function useMergedProps<T extends object>(
  sectionKey: keyof ComponentDefaultsConfig,
  localProps: MaybeRefOrGetter<T>,
  defaults?: Partial<T>,
): ComputedRef<T> {
  const { injection } = useComponentMap()
  const globalComponentDefaults = injection.config?.components

  return computed<T>(() => ({
    ...(globalComponentDefaults?.[sectionKey] ?? {}),
    ...(defaults ?? {}),
    ...toValue(localProps),
  })) as ComputedRef<T>
}
