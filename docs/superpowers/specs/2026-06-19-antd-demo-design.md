# Ant Design Vue 示例设计文档

**日期**: 2026-06-19
**目标**: 在现有 Naive UI 示例的基础上，新增一个 Ant Design Vue 示例，上下并排展示 TablePro 的跨 UI 库能力。

## 架构方案

采用**双 Vue 应用**方案：`index.html` 中放两个根节点，`main.ts` 中分别创建两个独立 Vue 应用，各自安装对应的 `TableProPlugin` 配置。

```
index.html
├── <div id="app-naive">  ← createApp(App).use(TableProPlugin, naiveConfig).mount()
│   └── App.vue (Naive UI 示例)
└── <div id="app-antd">   ← createApp(AntdDemo).use(TableProPlugin, antdConfig).mount()
    └── AntdDemo.vue (Ant Design Vue 示例)
```

两个应用完全隔离：各自的注入上下文、组件状态、样式作用域。

## 文件变更清单

| 文件 | 操作 | 说明 |
|---|---|---|
| `index.html` | 修改 | 两个根节点 `#app-naive` 和 `#app-antd`，加标题区分 |
| `src/main.ts` | 修改 | 拆分为两个独立 Vue 应用，各自安装插件 |
| `src/demos/AntdDemo.vue` | 新增 | Ant Design Vue 版本示例 |

## ComponentMap 映射

| ComponentMap Key | Naive UI | Ant Design Vue | 备注 |
|---|---|---|---|
| `input` | `NInput` | `Input` | |
| `textarea` | `NInput` (type=textarea) | `Input.TextArea` | antd 用子组件形式 |
| `select` | `NSelect` | `Select` | |
| `cascader` | `NCascader` | `Cascader` | |
| `datePicker` | `NDatePicker` | `DatePicker` | |
| `timePicker` | `NTimePicker` | `TimePicker` | |
| `switch` | `NSwitch` | `Switch` | |
| `radioGroup` | `NRadioGroup` | `Radio.Group` | antd 用子组件形式 |
| `radio` | `NRadio` | `Radio` | |
| `checkboxGroup` | `NCheckboxGroup` | `Checkbox.Group` | |
| `checkbox` | `NCheckbox` | `Checkbox` | |
| `inputNumber` | `NInputNumber` | `InputNumber` | |
| `slider` | `NSlider` | `Slider` | |
| `rate` | `NRate` | `Rate` | |
| `form` | `NForm` | `Form` | |
| `formItem` | `NFormItem` | `Form.Item` | |
| `grid` | `NGrid` | `Row` | antd 栅格用 Row/Col |
| `gridItem` | `NGridItem` | `Col` | |
| `button` | `NButton` | `Button` | |
| `space` | `NSpace` | `Space` | |
| `table` | `NDataTable` | `Table` | |
| `modal` | `NModal` | `Modal` | |
| `pagination` | `NPagination` | `Pagination` | |
| `dropdown` | `NDropdown` | `Dropdown` | |
| `text` | `NText` | `Typography.Text` | |
| `colorPicker` | `NColorPicker` | _(无)_ | antd 4.x 无此组件 |

## Plugin Config 差异

### Modal 适配器

```ts
// Ant Design Vue
modalAdapter: {
  visibleProp: 'open',
  visibleEvent: 'update:open',
  slots: { header: 'header', actions: 'footer' },
}
```

### Grid 配置

```ts
// Ant Design Vue — Row 用 gutter 代替 cols/xGap/yGap
gridProps: { gutter: [12, 8] }
```

### FormItem 配置

```ts
// Ant Design Vue — 用 labelCol 控制宽度
formItem: { labelCol: { style: { width: '80px' } } }
```

### Table 列定义差异

| 特性 | Naive UI (NDataTable) | Ant Design Vue (Table) |
|---|---|---|
| 列标识 | `key` | `dataIndex` |
| 自定义渲染 | `render: (row) => h(...)` | `customRender: ({ text, record }) => VNode` |
| 排序 | `sorter: true` | `sorter: true` |

`AntdDemo.vue` 需要独立定义 antd 格式的 columns，不能直接复用 Naive UI 的列定义。

## 实现步骤

1. 修改 `index.html` — 添加两个根节点
2. 新建 `src/demos/AntdDemo.vue` — 用 antd 组件实现相同功能
3. 修改 `src/main.ts` — 创建两个独立 Vue 应用

## 已知挑战

| 挑战 | 应对 |
|---|---|
| antd Table 列 API 不同 | AntdDemo 中独立定义 antd 格式 columns |
| antd Form 不支持 labelPlacement | 用 labelCol/wrapperCol 替代 |
| antd Row 不支持 cols | 每个 Col 用 span 属性控制列宽 |
| Input.TextArea 是子组件 | ComponentMap 中用 Input.TextArea 映射 textarea key |
| 两套样式冲突 | antd 4.x CSS-in-JS 天然组件级隔离，不冲突 |

## 范围外事项

- 不修改库核心组件（TablePro、Search、FormRenderer 等）
- 不引入 vue-router
- 不对 antd 做深度定制主题
