import type { Component } from 'vue'

import type { ComponentMap } from '@/index'

/** 搜索表单单个字段的配置 */
export interface SearchField {
  /** 字段名，对应表单 model 的 key */
  name: string
  /** 表单项 label */
  label: string
  /** 组件类型，对应 ComponentMap 的 key（默认 'input'） */
  type?: keyof ComponentMap
  /** 传递给组件的额外 props */
  componentProps?: Record<string, unknown>
  /** 在 grid 中占的列数（默认 1） */
  span?: number
  /** 表单校验规则 */
  rules?: unknown[]
}
