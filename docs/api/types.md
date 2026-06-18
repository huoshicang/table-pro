# 类型定义

## 共享类型

### ConfirmHandlers

Modal 确认回调，按模式分发。

```ts
interface ConfirmHandlers {
  add?: (formData: Record<string, unknown>) => void    // 新增确认回调
  edit?: (formData: Record<string, unknown>) => void   // 编辑确认回调
  detail?: (formData: Record<string, unknown>) => void // 详情确认回调
}
```

### ActionItem

操作按钮项，用于 TableAction 组件。

```ts
interface ActionItem {
  label: string                        // 按钮文案
  onClick: () => void                  // 点击回调
  meta?: Record<string, unknown>       // 按钮 v-bind 属性
}
```

### FormRendererInstance

FormRenderer 组件实例类型，用于父组件通过 ref 访问内部状态。

```ts
interface FormRendererInstance {
  formRef: Record<string, unknown> | null   // n-form ref，可调用 validate
  formValue: Record<string, unknown>        // 表单响应式数据
}
```

---

## 表格类型

### TableColumn

```ts
interface TableColumn<T = unknown> {
  key: string                              // 字段名
  title: string                            // 列标题
  type?: keyof ComponentMap                // 单元格渲染组件（默认 'text'）
  componentProps?: Record<string, unknown> // 渲染组件的额外 props
  sortable?: boolean                       // 是否可排序
  width?: number | string                  // 列宽
  fixed?: 'left' | 'right'                // 固定列
  hidden?: boolean                         // 是否隐藏
  render?: (row: T) => unknown             // 自定义渲染函数
  config?: ColumnConfig                    // 行为配置
  meta?: Record<string, unknown>           // 表单控件 v-bind 属性
}
```

### ColumnConfig

```ts
interface ColumnConfig {
  isNew?: boolean               // 是否参与新增表单
  isSearch?: boolean            // 是否参与搜索表单
  type?: keyof ComponentMap     // 表单控件类型
}
```

---

## 搜索类型

### SearchField

```ts
interface SearchField {
  name: string                          // 字段名
  label: string                         // 表单项 label
  type?: keyof ComponentMap             // 组件类型（默认 'input'）
  componentProps?: Record<string, unknown> // 组件 props
  span?: number                         // 栅格列数（默认 1）
  rules?: unknown[]                     // 校验规则
}
```

---

## 配置类型

### ComponentMap

后台管理页面常用组件映射表。完整定义见源码 `src/index.ts`。

```ts
type ComponentMap = {
  input?: Component
  textarea?: Component
  select?: Component
  cascader?: Component
  datePicker?: Component
  timePicker?: Component
  switch?: Component
  radioGroup?: Component
  checkboxGroup?: Component
  inputNumber?: Component
  slider?: Component
  rate?: Component
  colorPicker?: Component
  button?: Component
  form?: Component
  formItem?: Component
  grid?: Component
  gridItem?: Component
  space?: Component
  table?: Component
  modal?: Component
  pagination?: Component
  dropdown?: Component
  text?: Component
  // ... 更多组件
}
```

### FormConfig

```ts
interface FormConfig {
  inline?: boolean
  labelWidth?: number
  labelAlign?: 'left' | 'right' | 'auto'
  labelPlacement?: 'left' | 'right' | 'top'
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}
```

### GridConfig

```ts
interface GridConfig {
  cols?: number | string
  xGap?: number | string
  yGap?: number | string
  responsive?: 'self' | 'screen'
  collapsed?: boolean
  collapsedRows?: number
}
```

### FormItemConfig

```ts
interface FormItemConfig {
  labelWidth?: number | string
  labelPlacement?: 'left' | 'right' | 'top'
  showLabel?: boolean
  showFeedback?: boolean
}
```

### TableConfig

```ts
interface TableConfig {
  size?: 'tiny' | 'small' | 'medium' | 'large'
  bordered?: boolean
  striped?: boolean
  loading?: boolean
  maxHeight?: number
}
```

### ModalConfig

```ts
interface ModalConfig {
  preset?: 'dialog' | 'card'
  style?: string | Record<string, unknown>
  closable?: boolean
  maskClosable?: boolean
  title?: string
}
```

### PaginationConfig

```ts
interface PaginationConfig {
  pageSizes?: number[]
  showSizePicker?: boolean
  showQuickJumper?: boolean
  size?: 'small' | 'medium' | 'large'
}
```

### ModalAdapter

```ts
interface ModalAdapter {
  visibleProp?: string       // 可见性 prop 名（如 'show' / 'visible'）
  visibleEvent?: string      // 可见性事件名（如 'update:show' / 'update:visible'）
  slots?: {
    header?: string          // 头部插槽名
    actions?: string         // 底部操作插槽名
  }
}
```

### ComponentDefaultsConfig

```ts
interface ComponentDefaultsConfig {
  form?: FormConfig
  grid?: GridConfig
  space?: SpaceConfig
  formItem?: FormItemConfig
  table?: TableConfig
  modal?: ModalConfig
  pagination?: PaginationConfig
}
```

### TableProConfig

```ts
interface TableProConfig {
  debug?: boolean
  text?: string
  components?: ComponentDefaultsConfig
  modalAdapter?: ModalAdapter
}
```
