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
    components: {
      formItem: {
        labelWidth: 80,
        labelPlacement: 'left',
      },
      pagination: {
        size: 'medium',
        showQuickJumper: true,
        showSizePicker: true,
      },
      modal: {
        preset: 'dialog',
        style: { width: '80%' },
      },
    },
    modalAdapter: {
      visibleProp: 'show',
      visibleEvent: 'update:show',
      slots: {
        header: 'header',
        actions: 'action',
      },
    },
  },
})

naiveApp.mount('#app-naive')

// ========================================================================
// 应用 2：Ant Design Vue 示例
// ========================================================================

const antdApp = createApp(AntdDemo)

antdApp.use(TableProPlugin, {
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
    components: {
      formItem: {
        labelCol: { style: { width: '80px' } },
      },
      grid: {
        gutter: [12, 8],
      },
      pagination: {
        showQuickJumper: true,
        showSizePicker: true,
      },
      modal: {
        style: { width: '80%' },
      },
    },
    modalAdapter: {
      visibleProp: 'open',
      visibleEvent: 'update:open',
      slots: {
        header: 'header',
        actions: 'footer',
      },
    },
    // 通用适配器：声明式 prop/event 名称映射
    adapters: {
      pagination: {
        props: {
          page: 'current',
          itemCount: 'total',
          showSizePicker: 'showSizeChanger',
        },
        events: {
          'update:page': 'update:current',
        },
      },
      formItem: {
        props: {
          path: 'name',
          rule: 'rules',
        },
      },
    },
  },
})

antdApp.mount('#app-antd')
