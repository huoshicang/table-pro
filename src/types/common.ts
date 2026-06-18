/**
 * 共享类型定义
 * @description 跨组件复用的 TypeScript 接口
 */

// ========================================================================
// Modal 相关
// ========================================================================

/** Modal 确认回调，按模式分发 */
export interface ConfirmHandlers {
  /** 新增模式确认回调 */
  add?: (formData: Record<string, unknown>) => void
  /** 编辑模式确认回调 */
  edit?: (formData: Record<string, unknown>) => void
  /** 详情模式确认回调 */
  detail?: (formData: Record<string, unknown>) => void
}

// ========================================================================
// 操作按钮相关
// ========================================================================

/** 操作按钮项，用于 TableAction 组件 */
export interface ActionItem {
  /** 按钮文案 */
  label: string
  /** 点击回调 */
  onClick: () => void
  /** 按钮的额外属性，通过 v-bind 绑定（如 type: 'primary'、size: 'small'） */
  meta?: Record<string, unknown>
}

// ========================================================================
// FormRenderer 相关
// ========================================================================

/** FormRenderer 组件实例类型，用于父组件通过 ref 访问内部状态 */
export interface FormRendererInstance {
  /** form 组件 ref，可调用 validate 等方法 */
  formRef: Record<string, unknown> | null
  /** 表单响应式数据 */
  formValue: Record<string, unknown>
}
