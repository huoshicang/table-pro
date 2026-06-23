import { useComponentMap } from '@/composables/useComponentMap'
import type { ComponentAdapter } from '@/index'

/**
 * 通用组件适配器钩子
 * @description 根据注入的 adapters 配置，提供 prop/event/slot 名称映射方法，
 * 使内部组件无需感知底层 UI 库的 API 命名差异。
 * @param section - 适配器配置的组件类型名（如 'pagination'、'dropdown'、'formItem'）
 * @returns mapProps / mapEvent / mapSlot 映射函数
 * @example
 * const { mapProps, mapEvent } = useComponentAdapter('pagination')
 * // { page: 1 } → { current: 1 }（当配置了 props: { page: 'current' } 时）
 */
export function useComponentAdapter(section: string) {
  const { injection } = useComponentMap()
  const adapter = injection.config?.adapters?.[section as keyof typeof injection.config.adapters]

  /**
   * 将框架内部 prop 名映射为 UI 库实际 prop 名
   * @description 未配置映射时原样返回。映射仅作用于 key 名，value 不变。
   * @param props - 框架内部 prop 对象
   * @returns 映射后的 prop 对象
   */
  function mapProps(props: Record<string, unknown>): Record<string, unknown> {
    if (!adapter?.props) return props
    const mapped: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props)) {
      const mappedKey = adapter.props[key] ?? key
      mapped[mappedKey] = value
    }
    return mapped
  }

  /**
   * 将框架内部事件名映射为 UI 库实际事件名
   * @description 未配置映射时原样返回。
   * @param event - 框架内部事件名（如 'update:page'）
   * @returns UI 库实际事件名（如 'update:current'）
   */
  function mapEvent(event: string): string {
    return adapter?.events?.[event] ?? event
  }

  /**
   * 将框架内部插槽名映射为 UI 库实际插槽名
   * @description 未配置映射时原样返回。
   * @param slot - 框架内部插槽名
   * @returns UI 库实际插槽名
   */
  function mapSlot(slot: string): string {
    return adapter?.slots?.[slot] ?? slot
  }

  return { adapter: adapter as ComponentAdapter | undefined, mapProps, mapEvent, mapSlot }
}
