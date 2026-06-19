# 插件注册

## ComponentMap

`ComponentMap` 是一个强类型的组件映射表，key 为组件名，value 为 Vue 组件。

### 必需组件

| 分类 | 组件 | 说明 |
|------|------|------|
| **表单结构** | `form` `formItem` `grid` `gridItem` | FormRenderer 使用 |
| **通用** | `button` `space` `table` `modal` `pagination` `dropdown` | 各组件使用 |
| **回退** | `text` | Table.vue 的默认回退组件 |

### 表单输入组件（可选）

| 组件 | 说明 |
|------|------|
| `input` | 输入框（默认回退组件） |
| `textarea` | 多行输入（用 NInput 的 type="textarea"） |
| `select` | 下拉选择 |
| `cascader` | 级联选择器 |
| `datePicker` | 日期选择器 |
| `timePicker` | 时间选择器 |
| `switch` | 开关 |
| `radioGroup` | 单选框组 |
| `checkboxGroup` | 多选框组 |
| `inputNumber` | 数字输入 |
| `slider` | 滑块 |
| `rate` | 评分 |
| `colorPicker` | 颜色选择器 |

## 配置结构

```ts
app.use(TableProPlugin, {
  components: {
    // ComponentMap：组件映射
  },
  config: {
    // 调试模式
    debug: true,

    // 全局组件默认配置
    components: {
      form: { /* form 默认 props */ },
      grid: { /* grid 默认 props */ },
      formItem: { /* form-item 默认 props */ },
      table: { /* data-table 默认 props */ },
      modal: { /* modal 默认 props */ },
      pagination: { /* pagination 默认 props */ },
    },

    // Modal 适配器（跨 UI 库兼容）
    modalAdapter: {
      visibleProp: 'show',        // 可见性 prop 名
      visibleEvent: 'update:show', // 可见性事件名
      slots: {
        header: 'header',         // 头部插槽名
        actions: 'action',        // 底部操作插槽名
      },
    },

    // 通用组件适配器（prop/event 名称映射）
    adapters: {
      pagination: {
        props: { page: 'current', itemCount: 'total' },       // prop 名映射
        events: { 'update:page': 'update:current' },           // 事件名映射
      },
      formItem: {
        props: { path: 'name', rule: 'rules' },
      },
    },
  },
})
```

## 配置合并策略

所有组件遵循三层合并：**全局默认 → 组件 props 覆盖**

```
injection.config.components.modal  →  props.modalProps
         (全局默认)                      (组件级)
                    ↓
              mergedModalProps      (最终值，computed 响应式)
```

通过 `useMergedProps` composable 统一处理，组件只需一行：

```ts
const mergedModalProps = useMergedProps('modal', () => props.modalProps)
```
