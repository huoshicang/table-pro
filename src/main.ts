import { createApp } from 'vue'
import App from './App.vue'
import TableProPlugin from '@/index.ts'
import '@/styles/global.css'

import {
  NInput,
  NSelect,
  NCascader,
  NDatePicker,
  NTimePicker,
  NSwitch,
  NRadioGroup,
  NRadioButton,
  NCheckboxGroup,
  NRadio,
  NCheckbox,
  NButton,
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  NSpace,
  NDataTable,
  NDialog,
  NDrawer,
  NTree,
  NUpload,
  NPagination,
  NTag,
  NTooltip,
  NDropdown,
  NPopover,
  NAutoComplete,
  NInputNumber,
  NSlider,
  NRate,
  NColorPicker,
  NDivider,
  NBreadcrumb,
  NMenu,
  NTabs,
  NSteps,
  NCard,
  NCollapse,
  NTimeline,
  NList,
  NAvatar,
  NBadge,
  NAnchor,
  NQrCode,
  NStatistic,
  NText,
  NEmpty,
} from 'naive-ui'

import Naive from 'naive-ui'

const app = createApp(App)

app.use(TableProPlugin, {
  components: {
    input: NInput,
    select: NSelect,
    cascader: NCascader,
    datePicker: NDatePicker,
    timePicker: NTimePicker,
    switch: NSwitch,
    radioGroup: NRadioGroup,
    radioButton: NRadioButton,
    checkboxGroup: NCheckboxGroup,
    radio: NRadio,
    checkbox: NCheckbox,
    button: NButton,
    form: NForm,
    formItem: NFormItem,
    grid: NGrid,
    gridItem: NGridItem,
    space: NSpace,
    table: NDataTable,
    dialog: NDialog,
    drawer: NDrawer,
    tree: NTree,
    upload: NUpload,
    pagination: NPagination,
    tag: NTag,
    tooltip: NTooltip,
    dropdown: NDropdown,
    popover: NPopover,
    autoComplete: NAutoComplete,
    inputNumber: NInputNumber,
    slider: NSlider,
    rate: NRate,
    colorPicker: NColorPicker,
    divider: NDivider,
    breadcrumb: NBreadcrumb,
    menu: NMenu,
    tabs: NTabs,
    steps: NSteps,
    card: NCard,
    collapse: NCollapse,
    timeline: NTimeline,
    list: NList,
    avatar: NAvatar,
    badge: NBadge,
    anchor: NAnchor,
    qrcode: NQrCode,
    statistic: NStatistic,
    text: NText,
    empty: NEmpty,
  },
  config: {
    debug: true,
    // 全局组件默认配置：各子组件可在此基础上传入 props 覆盖
    components: {
      // n-grid 默认间距
      // n-form-item 默认 label 宽度和位置
      formItem: {
        labelWidth: 80,
        labelPlacement: 'left',
      },
    },
  },
})

app.use(Naive)

app.mount('#app')
