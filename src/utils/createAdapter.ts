import { defineComponent, h, computed, useAttrs } from 'vue'
import type { Component, PropType } from 'vue'

/**
 * Adapter 配置：声明式的 prop/event 映射
 */
export interface AdapterConfig {
  /** prop 名称映射：框架内部名 → UI 库实际名 */
  props?: Record<string, string>
  /** 事件名称映射：框架内部名 → UI 库实际名 */
  events?: Record<string, string>
  /** 自定义 prop 变换（处理值结构变化，如 Table 的 columns 映射） */
  transformProps?: (props: Record<string, unknown>) => Record<string, unknown>
}

/**
 * 从声明式配置生成 adapter 组件
 * @description 创建一个薄包装组件，自动将框架内部的 prop/event 名称映射到目标 UI 库。
 * 适用于简单名称映射场景；复杂结构变换（如 Table 列格式转换）可使用 transformProps 回调。
 * @param WrappedComponent - 被包装的目标 UI 库组件
 * @param config - adapter 配置（prop/event 映射 + 可选的 transformProps）
 * @returns 包装后的 adapter 组件，可直接注册到 ComponentMap
 * @example
 * const AntdPaginationAdapter = createAdapter(APagination, {
 *   props: { page: 'current', itemCount: 'total', showSizePicker: 'showSizeChanger' },
 *   events: { 'update:page': 'update:current' },
 * })
 */
export function createAdapter(WrappedComponent: Component, config: AdapterConfig): Component {
  return defineComponent({
    name: `Adapter(${WrappedComponent.name || 'Anonymous'})`,
    inheritAttrs: false,
    props: {
      /** 接受所有 props，由 adapter 内部映射 */
      ...({} as Record<string, unknown>),
    },
    emits: [] as string[],
    setup(_, { attrs, slots, emit }) {
      const mappedProps = computed(() => {
        let result: Record<string, unknown> = {}

        // 第 1 步：prop 名称映射
        if (config.props) {
          for (const [key, value] of Object.entries(attrs)) {
            const mappedKey = config.props[key] ?? key
            result[mappedKey] = value
          }
        } else {
          result = { ...attrs }
        }

        // 第 2 步：自定义值变换
        if (config.transformProps) {
          result = config.transformProps(result)
        }

        return result
      })

      const mappedEvents = computed(() => {
        const events: Record<string, (...args: unknown[]) => void> = {}
        if (config.events) {
          for (const [internalEvent, externalEvent] of Object.entries(config.events)) {
            // 从 attrs 中提取事件处理器
            const handler = attrs[`on${internalEvent.charAt(0).toUpperCase()}${internalEvent.slice(1)}`]
            if (typeof handler === 'function') {
              events[`on${externalEvent.charAt(0).toUpperCase()}${externalEvent.slice(1)}`] = handler as (...args: unknown[]) => void
            }
          }
        }
        return events
      })

      return () => h(WrappedComponent, { ...mappedProps.value, ...mappedEvents.value }, slots)
    },
  })
}
