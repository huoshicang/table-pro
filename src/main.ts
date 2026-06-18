import { createApp } from 'vue'
import App from './App.vue'
import TableProPlugin from '@/index'
import '@/styles/global.css'

import {
  // ========================================================================
  // 表单输入组件：通过 getComponent(field.type) 动态渲染
  // ========================================================================
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
  // ========================================================================
  // 表单结构组件：FormRenderer 使用
  // ========================================================================
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  // ========================================================================
  // 通用组件：Search / Table / Modal / TableAction 使用
  // ========================================================================
  NButton,
  NSpace,
  NDataTable,
  NModal,
  NPagination,
  NDropdown,
  // ========================================================================
  // 回退组件：Table.vue 的 getComponent 回退链 ['text', 'input']
  // ========================================================================
  NText,
} from 'naive-ui'

const app = createApp(App)

app.use(TableProPlugin, {
  components: {
    // 表单输入组件（field.type 可选值）
    input: NInput,
    textarea: NInput, // Naive UI 的 textarea 是 NInput 的 type="textarea" 模式
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
    // 表单结构组件
    form: NForm,
    formItem: NFormItem,
    grid: NGrid,
    gridItem: NGridItem,
    // 通用组件
    button: NButton,
    space: NSpace,
    table: NDataTable,
    modal: NModal,
    pagination: NPagination,
    dropdown: NDropdown,
    // 回退组件
    text: NText,
  },
  config: {
    debug: true,
    // 全局组件默认配置：各子组件可在此基础上传入 props 覆盖
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
    // Modal 适配器：跨 UI 库兼容
    modalAdapter: {
      visibleProp: 'show',
      visibleEvent: 'update:show',
      slots: {
        header: 'header', // naive-ui n-modal 头部插槽名
        actions: 'action', // naive-ui n-modal preset="dialog" 底部操作插槽名
      },
    },
  },
})

app.mount('#app')
