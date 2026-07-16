import { createApp } from 'vue'
import App from './App.vue'
import AntdDemo from '@/demos/AntdDemo.vue'
import AntdTableAdapter from '@/demos/AntdTableAdapter.vue'
import AntdDropdownAdapter from '@/demos/AntdDropdownAdapter.vue'
import TableProPlugin from '@/index'
import '@/styles/global.css'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

// ========================================================================
// Naive UI 组件导入
// ========================================================================

import {
  NInput,
  NSelect,
  NCascader,
  NDatePicker,
  NTimePicker,
  NSwitch,
  NRadioGroup,
  NRadio,
  NCheckboxGroup,
  NCheckbox,
  NInputNumber,
  NSlider,
  NRate,
  NColorPicker,
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  NButton,
  NSpace,
  NDataTable,
  NModal,
  NPagination,
  NDropdown,
  NText,
} from 'naive-ui'

// ========================================================================
// Ant Design Vue 组件导入
// ========================================================================

import {
  Input,
  Select,
  Cascader,
  DatePicker,
  TimePicker,
  Switch,
  Radio,
  Checkbox,
  InputNumber,
  Slider,
  Rate,
  Form,
  Row,
  Col,
  Button,
  Space,
  Modal,
  Pagination,
  Typography,
} from 'ant-design-vue'

// ========================================================================
// 应用 1：Naive UI 示例
// ========================================================================

const naiveApp = createApp(App)

naiveApp.use(TableProPlugin, {
  // ======================================================================
  // 组件映射：框架内部组件名 → Naive UI 组件
  // ======================================================================
  components: {
    input: NInput,
    textarea: NInput,
    select: NSelect,
    cascader: NCascader,
    datePicker: NDatePicker,
    timePicker: NTimePicker,
    switch: NSwitch,
    radioGroup: NRadioGroup,
    radio: NRadio,
    checkboxGroup: NCheckboxGroup,
    checkbox: NCheckbox,
    inputNumber: NInputNumber,
    slider: NSlider,
    rate: NRate,
    colorPicker: NColorPicker,
    form: NForm,
    formItem: NFormItem,
    grid: NGrid,
    gridItem: NGridItem,
    button: NButton,
    space: NSpace,
    table: NDataTable,
    modal: NModal,
    pagination: NPagination,
    dropdown: NDropdown,
    text: NText,
  },

  config: {
    debug: true,

    // ====================================================================
    // 全局组件默认配置：各子组件可在此基础上传入 props 覆盖
    // 合并优先级：全局 config < 组件 props
    // ====================================================================
    components: {
      // 表单组件（对应 n-form）
      form: {},

      // 栅格布局（对应 n-grid）
      // cols: 等分列数 | xGap: 水平间距 | yGap: 垂直间距
      grid: { xGap: 12, yGap: 8, cols: 4 },

      // 表单项（对应 n-form-item）
      // labelWidth: 标签宽度 | labelPlacement: 标签位置
      formItem: { labelWidth: 80, labelPlacement: 'left' },

      // 表格组件（对应 n-data-table）
      table: {},

      // 分页组件（对应 n-pagination）
      // size: 分页尺寸 | pageSizes: 每页条数选项（仅全局配置生效）
      pagination: { size: 'medium', pageSizes: [10, 20, 50] },

      // 弹窗组件（对应 n-modal）
      // preset: 预设样式 | style: 内联样式
      modal: { preset: 'dialog', style: { width: '80%' } },
    },

    // ====================================================================
    // Modal 适配器：跨 UI 库兼容
    // key 固定（header / actions），value 为 UI 库实际插槽名
    // ====================================================================
    modalAdapter: {
      /** 弹窗显隐 prop 名：'show' (Naive UI) / 'visible' (Ant Design / Element) */
      visibleProp: 'show',
      /** 显隐变化事件名：与 visibleProp 对应 */
      visibleEvent: 'update:show',
      slots: {
        /** 头部插槽名（key 固定为 'header'，value 为 UI 库实际插槽名） */
        header: 'header',
        /** 底部操作按钮插槽名（key 固定为 'actions'，value 为 UI 库实际插槽名） */
        actions: 'action',
      },
    },

    // ====================================================================
    // 通用组件适配器：声明式 prop/event/slot 名称映射
    // 框架内部名 → UI 库实际名
    // ====================================================================
    adapters: {
      // 表单适配器（对应 n-form）
      form: {},

      // 栅格适配器（对应 n-grid）
      grid: {},

      // 表单项适配器（对应 n-form-item）
      formItem: {},

      // 分页适配器（对应 n-pagination）
      pagination: {},

      // 下拉菜单适配器（对应 n-dropdown）
      dropdown: {},
    },
  },
})

naiveApp.mount('#app-naive')

// ========================================================================
// 应用 2：Ant Design Vue 示例
// ========================================================================

const antdApp = createApp(AntdDemo)

antdApp.use(TableProPlugin, {
  // ======================================================================
  // 组件映射：框架内部组件名 → Ant Design Vue 组件
  // ======================================================================
  components: {
    input: Input,
    textarea: Input.TextArea,
    select: Select,
    cascader: Cascader,
    datePicker: DatePicker,
    timePicker: TimePicker,
    switch: Switch,
    radioGroup: Radio.Group,
    radio: Radio,
    checkboxGroup: Checkbox.Group,
    checkbox: Checkbox,
    inputNumber: InputNumber,
    slider: Slider,
    rate: Rate,
    form: Form,
    formItem: Form.Item,
    grid: Row,
    gridItem: Col,
    button: Button,
    space: Space,
    // Table 和 Dropdown 使用 adapter 组件（结构变换，非简单 prop 映射）
    table: AntdTableAdapter,
    modal: Modal,
    pagination: Pagination,
    dropdown: AntdDropdownAdapter,
    text: Typography.Text,
  },

  config: {
    debug: true,

    // ====================================================================
    // 全局组件默认配置
    // ====================================================================
    components: {
      // 表单组件（对应 a-form）
      form: {},

      // 栅格布局（对应 a-row）
      // gutter: 间距（通过 adapters.grid 映射 xGap → gutter）
      grid: { gutter: [12, 8] },

      // 表单项（对应 a-form-item）
      // labelCol: 标签列配置
      formItem: { labelCol: { style: { width: '80px' } } },

      // 表格组件（对应 a-table）
      table: {},

      // 分页组件（对应 a-pagination）
      // pageSizes: 每页条数选项 | showSizeChanger: antd 特有，显示每页条数选择器
      pagination: { pageSizes: [3, 6, 9], showSizeChanger: true },

      // 弹窗组件（对应 a-modal）
      modal: { style: { width: '80%' } },
    },

    // ====================================================================
    // Modal 适配器：跨 UI 库兼容
    // key 固定（header / actions），value 为 UI 库实际插槽名
    // ====================================================================
    modalAdapter: {
      /** 弹窗显隐 prop 名：antd 使用 'open' */
      visibleProp: 'open',
      /** 显隐变化事件名：与 visibleProp 对应 */
      visibleEvent: 'update:open',
      slots: {
        /** 头部插槽名（key 固定为 'header'，value 为 UI 库实际插槽名） */
        header: 'header',
        /** 底部操作按钮插槽名（key 固定为 'actions'，value 为 UI 库实际插槽名） */
        actions: 'footer',
      },
    },

    // ====================================================================
    // 通用组件适配器：声明式 prop/event/slot 名称映射
    // 框架内部名 → UI 库实际名
    // ====================================================================
    adapters: {
      // 表单适配器（对应 a-form）
      form: {},

      // 栅格适配器（对应 a-row）
      // xGap → gutter：框架用 xGap，antd 用 gutter
      grid: {
        props: { xGap: 'gutter' },
      },

      // 表单项适配器（对应 a-form-item）
      // path → name：表单字段名 | rule → rules：校验规则
      formItem: {
        props: { path: 'name', rule: 'rules' },
      },

      // 分页适配器（对应 a-pagination）
      // page → current：当前页码 | itemCount → total：总条目数
      // pageSizes → pageSizeOptions：每页条数选项
      pagination: {
        props: {
          page: 'current',
          itemCount: 'total',
          pageSizes: 'pageSizeOptions',
        },
        events: {
          'update:page': 'update:current',
        },
      },

      // 下拉菜单适配器（使用 adapter 组件 AntdDropdownAdapter，无需 prop 映射）
      dropdown: {},
    },
  },
})

antdApp.mount('#app-antd')
