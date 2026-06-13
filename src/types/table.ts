import type { Component } from 'vue'

import type { ComponentMap } from '@/index'

/** 表格单列的配置 */
export interface TableColumn<T = unknown> {
  /** 列字段名，对应数据对象的 key */
  key: string
  /** 列标题 */
  title: string
  /**
   * 单元格渲染组件类型，对应 ComponentMap 的 key（默认 'text'）
   * 如 'input' | 'select' | 'tag' | 'button' 等
   */
  type?: keyof ComponentMap
  /** 传递给渲染组件的额外 props */
  componentProps?: Record<string, unknown>
  /** 是否可排序（默认 true） */
  sortable?: boolean
  /** 列宽（px 或百分比） */
  width?: number | string
  /** 固定列：'left' | 'right' */
  fixed?: 'left' | 'right'
  /** 是否隐藏该列 */
  hidden?: boolean
  /**
   * 自定义单元格渲染函数
   * @param row — 当前行数据
   * @returns Vue 节点或渲染函数返回内容
   */
  render?: (row: T) => unknown
}
