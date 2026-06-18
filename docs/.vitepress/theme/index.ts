import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'

import {
  // 表单输入组件
  NInput, NSelect, NCascader, NDatePicker, NTimePicker,
  NSwitch, NRadioGroup, NRadio, NCheckboxGroup, NCheckbox,
  NInputNumber, NSlider, NRate, NColorPicker,
  // 表单结构组件
  NForm, NFormItem, NGrid, NGridItem,
  // 通用组件
  NButton, NSpace, NDataTable, NModal, NPagination, NDropdown,
  NText, NAlert, NCard, NDivider, NTag, NConfigProvider,
} from 'naive-ui'

import TableProPlugin from '@/index'
import TablePro from '@/components/TablePro.vue'
import Table from '@/components/Table.vue'
import Search from '@/components/Search.vue'
import FormRenderer from '@/components/FormRenderer.vue'
import PaginationComp from '@/components/Pagination.vue'
import Modal from '@/components/Modal.vue'
import TableAction from '@/components/TableAction.vue'
import DemoFrame from './DemoFrame.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册 Naive UI 组件到全局
    const naiveComponents = {
      NInput, NSelect, NCascader, NDatePicker, NTimePicker,
      NSwitch, NRadioGroup, NRadio, NCheckboxGroup, NCheckbox,
      NInputNumber, NSlider, NRate, NColorPicker,
      NForm, NFormItem, NGrid, NGridItem,
      NButton, NSpace, NDataTable, NModal, NPagination, NDropdown,
      NText, NAlert, NCard, NDivider, NTag, NConfigProvider,
    }
    for (const [name, component] of Object.entries(naiveComponents)) {
      app.component(name, component)
    }

    // 注册 table-pro 插件
    app.use(TableProPlugin, {
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
        debug: false,
        components: {
          formItem: { labelWidth: 80, labelPlacement: 'left' },
          pagination: { size: 'medium', showQuickJumper: true, showSizePicker: true },
          modal: { preset: 'dialog', style: { width: '80%' } },
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

    // 注册 table-pro 组件到全局（供 Markdown 中直接使用）
    app.component('TablePro', TablePro)
    app.component('Table', Table)
    app.component('Search', Search)
    app.component('FormRenderer', FormRenderer)
    app.component('Pagination', PaginationComp)
    app.component('Modal', Modal)
    app.component('TableAction', TableAction)
    app.component('DemoFrame', DemoFrame)
  },
} satisfies Theme
