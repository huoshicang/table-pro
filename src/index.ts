// src/index.ts

import type { App, Component, InjectionKey } from 'vue'

/** 后台管理页面常用组件映射表：key 为组件名（用于 app.component / h()），value 为 Vue 组件类型 */
export type ComponentMap = {
  /** 输入框 */
  input?: Component
  /** 多行输入框 */
  textarea?: Component
  /** 搜索框 */
  select?: Component
  /** 级联选择器 */
  cascader?: Component
  /** 日期选择器 */
  datePicker?: Component
  /** 日期时间范围选择器 */
  dateTimePicker?: Component
  /** 日期范围选择器 */
  dateRangePicker?: Component
  /** 时间选择器 */
  timePicker?: Component
  /** 时间范围选择器 */
  timeRangePicker?: Component
  /** 开关 */
  switch?: Component
  /** 单选框组 */
  radioGroup?: Component
  /** 单选按钮 */
  radioButton?: Component
  /** 多选框组 */
  checkboxGroup?: Component
  /** 单选框 */
  radio?: Component
  /** 多选框 */
  checkbox?: Component
  /** 按钮 */
  button?: Component
  /** 表单 */
  form?: Component
  /** 表单表单项 */
  formItem?: Component
  /** 网格布局 */
  grid?: Component
  /** 网格项 */
  gridItem?: Component
  /** 弹性间距容器 */
  space?: Component
  /** 表格 */
  table?: Component
  /** 对话框 */
  dialog?: Component
  /** 弹窗（Modal） */
  modal?: Component
  /** 抽屉 */
  drawer?: Component
  /** 树形控件 */
  tree?: Component
  /** 上传组件 */
  upload?: Component
  /** 分页 */
  pagination?: Component
  /** 标签 */
  tag?: Component
  /** 提示框（Tooltip） */
  tooltip?: Component
  /** 下拉菜单 */
  dropdown?: Component
  /** 弹出选择器（Popover） */
  popover?: Component
  /** 自动完成 */
  autoComplete?: Component
  /** 输入框组 */
  inputNumber?: Component
  /** 滑块 */
  slider?: Component
  /** 速率选择器 */
  rate?: Component
  /** 颜色选择器 */
  colorPicker?: Component
  /** 分割线 */
  divider?: Component
  /** 面包屑 */
  breadcrumb?: Component
  /** 导航菜单 */
  menu?: Component
  /** 选项卡 */
  tabs?: Component
  /** 步骤条 */
  steps?: Component
  /** 卡片 */
  card?: Component
  /** 折叠面板 */
  collapse?: Component
  /** 时间线 */
  timeline?: Component
  /** 列表 */
  list?: Component
  /** 头像 */
  avatar?: Component
  /** 徽章 */
  badge?: Component
  /** 锚点 */
  anchor?: Component
  /** 二维码 */
  qrcode?: Component
  /** 统计数 */
  statistic?: Component
  /** 文字省略 */
  text?: Component
  /** 空状态 */
  empty?: Component
}

/** 表单组件（n-form）默认 props */
export interface FormConfig {
  /** 是否为行内表单 */
  inline?: boolean
  /** 标签宽度（px） */
  labelWidth?: number
  /** 标签对齐方式：'left' | 'right' | 'auto' */
  labelAlign?: 'left' | 'right' | 'auto'
  /** 标签位置：'left' | 'right' | 'top' */
  labelPlacement?: 'left' | 'right' | 'top'
  /** 表单数据对象 */
  model?: Record<string, unknown>
  /** 校验规则 */
  rules?: unknown
  /** 禁用全部表单项 */
  disabled?: boolean
  /** 表单项尺寸：'small' | 'medium' | 'large' */
  size?: 'small' | 'medium' | 'large'
}

/** 网格组件（n-grid）默认 props */
export interface GridConfig {
  /** 是否禁用布局偏移动画 */
  layoutShiftDisabled?: boolean
  /** 响应式策略：'self'（单网格独立）| 'screen'（全局屏幕适配） */
  responsive?: 'self' | 'screen'
  /** 等分列数 */
  cols?: number | string
  /** 子项是否独立响应式 */
  itemResponsive?: boolean
  /** 是否折叠 */
  collapsed?: boolean
  /** 折叠后的行数 */
  collapsedRows?: number
  /** 子项样式 */
  itemStyle?: string | Record<string, unknown>
  /** 水平间距（px） */
  xGap?: number | string
  /** 垂直间距（px） */
  yGap?: number | string
}

/** 间距容器组件（n-space）默认 props */
export interface SpaceConfig {
  /** 对齐方式 */
  align?: 'stretch' | 'baseline' | 'start' | 'end' | 'center' | 'flex-end' | 'flex-start'
  /** 主轴对齐：'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly' */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
  /** 是否为行内排列 */
  inline?: boolean
  /** 是否为纵向排列 */
  vertical?: boolean
  /** 是否反转顺序 */
  reverse?: boolean
  /** 间距大小：'small' | 'medium' | 'large' | number */
  size?: 'small' | 'medium' | 'large' | number
}

/** 表单表单项组件（n-form-item）默认 props */
export interface FormItemConfig {
  /** 表单项 label */
  label?: string
  /** 标签宽度 */
  labelWidth?: number | string
  /** 标签样式 */
  labelStyle?: string | Record<string, unknown>
  /** 标签对齐方式 */
  labelAlign?: 'left' | 'right' | 'auto'
  /** 标签位置：'left' | 'right' | 'top' */
  labelPlacement?: 'left' | 'right' | 'top'
  /** 字段路径 */
  path?: string
  /** 是否首次校验 */
  first?: boolean
  /** 校验规则 */
  rule?: unknown | unknown[]
  /** 显示必填标记 */
  showRequireMark?: boolean
  /** 必填标记位置 */
  requireMarkPlacement?: 'left' | 'right' | 'right-hanging'
  /** 显示校验反馈 */
  showFeedback?: boolean
  /** 表单项尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 校验状态：'error' | 'warning' | 'success' */
  validationStatus?: 'error' | 'warning' | 'success'
  /** 校验反馈文字 */
  feedback?: string
  /** 是否显示 label */
  showLabel?: boolean
}

/** 表格组件（n-data-table）默认 props */
export interface TableConfig {
  /** 表格尺寸：'tiny' | 'small' | 'medium' | 'large' */
  size?: 'tiny' | 'small' | 'medium' | 'large'
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示斑马纹 */
  striped?: boolean
  /** 是否显示表格边框（紧凑模式） */
  columnBorder?: boolean | number
  /** 加载状态 */
  loading?: boolean
  /** 空数据时显示的提示 */
  empty?: string
  /** 分页配置 */
  pagination?: unknown
  /** 是否显示滚动条 */
  scrollX?: number | boolean
  /** 最大高度（px） */
  maxHeight?: number
}

/** 组件默认配置映射 */
export interface ComponentDefaultsConfig {
  /** 表单组件默认配置 */
  form?: FormConfig
  /** 网格组件默认配置 */
  grid?: GridConfig
  /** 间距容器默认配置 */
  space?: SpaceConfig
  /** 表单表单项默认配置 */
  formItem?: FormItemConfig
  /** 表格组件默认配置 */
  table?: TableConfig
}

/** 插件配置默认值 */
export const defaultTableProConfig: TableProConfig = {
  debug: false,
  text: '没有传入值，使用默认值',
  modalAdapter: {
    visibleProp: 'show',
    visibleEvent: 'update:show',
  },
}

/** 弹窗（Modal）适配器配置
 * @description 用于跨框架兼容：不同 UI 库的 modal 组件在 visible prop 名、事件名等方面可能不同，
 * 通过此适配器统一映射，使 Modal.vue 无需感知底层使用的是 Naive UI / Ant Design / Element 等哪个库
 */
export interface ModalAdapter {
  /** modal 组件的可见性 prop 名，如 'show' (Naive) / 'visible' (Ant Design / Element) */
  visibleProp?: string
  /** 可见性更新事件名，如 'update:show' / 'update:visible' */
  visibleEvent?: string
}

/** 插件配置 */
export interface TableProConfig {
  /** 调试模式，开启后会在控制台输出更多信息，仅开发阶段使用 */
  debug?: boolean
  /**
   * 默认提示文案
   * @description 当某些组件未传入值时显示的文字内容
   * @default '没有传入值，使用默认值'
   * @example text: '暂无数据'
   */
  text?: string
  /**
   * 组件默认配置
   * @description 各子组件的默认 props，在引用组件时传入的配置会覆盖此处全局配置
   * @example components: { form: { inline: true, labelPlacement: 'left' }, grid: { xGap: 16, yGap: 8 }, table: { size: 'small', striped: true } }
   */
  components?: ComponentDefaultsConfig
  /**
   * 弹窗组件适配器
   * @description 跨框架兼容配置，用于映射 modal 组件的 visible prop 名和更新事件名
   * @example modalAdapter: { visibleProp: 'visible', visibleEvent: 'update:visible' } // Ant Design / Element
   */
  modalAdapter?: ModalAdapter
}

/** 注入的数据类型 */
interface TableProInjection {
  components: ComponentMap
  config?: TableProConfig
}

/** 注入键 */
export const TABLE_COMPONENTS_KEY: InjectionKey<TableProInjection> = Symbol('table-pro')

/** 插件安装选项 */
export interface TableProPluginOptions {
  /** 后台管理常用组件映射表，key 为组件名（如 'input'、'button'），value 为 Naive UI 组件 */
  components?: ComponentMap
  /** 插件全局配置 */
  config?: TableProConfig
}

/** TablePro 插件 */
const TableProPlugin = {
  install(app: App, options?: TableProPluginOptions) {
    const injection: TableProInjection = {
      components: options?.components ?? {},
      config: { ...defaultTableProConfig, ...options?.config },
    }

    // 将组件映射和配置通过 provide 暴露给整个应用
    app.provide(TABLE_COMPONENTS_KEY, injection)
  },
}

export default TableProPlugin
