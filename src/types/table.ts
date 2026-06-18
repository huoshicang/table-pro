import type { Component } from 'vue'

import type { ComponentMap } from '@/index'
import type { SearchField } from '@/types/search'

/** 列行为配置：控制该列参与哪些功能，以及使用哪个表单控件 */
export interface ColumnConfig {
  /** 是否可新增（Modal 新增表单） */
  isNew?: boolean
  /** 是否可搜索（Search 搜索表单） */
  isSearch?: boolean
  /** 表单控件类型，对应 ComponentMap 的 key，如 'input' | 'select' | 'datePicker' */
  type?: keyof ComponentMap
}

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
  /** 列行为配置：控制编辑/新增/搜索/删除开关及表单控件类型 */
  config?: ColumnConfig
  /** 组件的元属性，通过 v-bind 绑定到表单控件上（如 placeholder、options 等） */
  meta?: Record<string, unknown>
}

// ========================================================================
// 工具函数
// ========================================================================

/**
 * 将列配置转换为表单 schema
 * @description 从 TableColumn[] 按过滤条件派生 SearchField[]，用于搜索表单和 Modal 表单的 schema 自动生成。
 * 提取公共的 map 逻辑，避免在多处重复相同的列→字段映射代码。
 * @param columns - 列配置数组
 * @param filter - 过滤函数，决定哪些列参与表单
 * @returns 符合 SearchField[] 格式的表单 schema
 * @example
 * // 搜索表单：仅包含 isSearch 为 true 的列
 * const searchSchema = columnsToSchema(columns, c => !!c.config?.isSearch)
 * // 编辑表单：包含所有未隐藏的列
 * const formSchema = columnsToSchema(columns, c => !c.hidden)
 */
export function columnsToSchema(
  columns: TableColumn[],
  filter: (col: TableColumn) => boolean,
): SearchField[] {
  return columns.filter(filter).map((col) => ({
    name: col.key,
    label: col.title,
    type: col.config?.type ?? 'input',
    span: 1,
    componentProps: col.meta,
  }))
}
