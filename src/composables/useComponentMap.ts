import { inject } from 'vue'
import { TABLE_COMPONENTS_KEY } from '@/index'
import type { TableProInjection } from '@/index'

/**
 * 统一的组件映射注入钩子
 * @description 封装 inject + getComponent，避免在多个组件中重复定义。
 * 默认 fallback 到 `componentMap.input`，可通过 `defaultFallbacks` 或调用时的 `fallbacks` 参数自定义回退链。
 * @param defaultFallbacks - 可选的默认回退链，省略时使用 `['input']`
 * @returns componentMap、getComponent 函数和 injection 对象
 * @example
 * // 默认行为（回退到 input）
 * const { getComponent } = useComponentMap()
 * // 自定义默认回退链（Table 组件回退到 text 再到 input）
 * const { getComponent } = useComponentMap(['text', 'input'])
 */
export function useComponentMap(defaultFallbacks?: string[]) {
  const injection = inject(TABLE_COMPONENTS_KEY, { components: {} }) as TableProInjection
  const componentMap = injection.components

  /**
   * 根据组件类型名从注入的 ComponentMap 中查找组件
   * @description 未找到时按 `fallbacks` 链依次回退，默认回退到 `input`。
   * 优先使用调用时传入的 fallbacks，其次使用 useComponentMap 时的 defaultFallbacks。
   * @param type - 组件类型名（ComponentMap 的 key）
   * @param fallbacks - 可选的回退链，覆盖默认值
   * @returns 匹配的组件，未找到时返回 undefined
   */
  function getComponent(type: string, fallbacks?: string[]) {
    const map = componentMap as Record<string, any>
    if (map[type]) return map[type]
    const chain = fallbacks ?? defaultFallbacks ?? ['input']
    for (const fallback of chain) {
      if (map[fallback]) return map[fallback]
    }
    return undefined
  }

  return { componentMap, getComponent, injection }
}
