# 快速开始

## 在线演示

下面是完整的组件演示，可交互操作：

<DemoFrame title="TablePro 在线演示" height="700" />

[↗ 全屏打开演示](/table-pro/demo/index.html){target="_blank"}

## 安装

```sh
npm install table-pro
```

## 注册插件

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import TableProPlugin from 'table-pro'
import {
  NInput, NSelect, NButton, NForm, NFormItem,
  NGrid, NGridItem, NSpace, NDataTable, NModal,
  NPagination, NDropdown, NText,
} from 'naive-ui'

const app = createApp(App)

app.use(TableProPlugin, {
  components: {
    input: NInput,
    select: NSelect,
    button: NButton,
    form: NForm,
    formItem: NFormItem,
    grid: NGrid,
    gridItem: NGridItem,
    space: NSpace,
    table: NDataTable,
    modal: NModal,
    pagination: NPagination,
    dropdown: NDropdown,
    text: NText,
  },
})

app.mount('#app')
```

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TablePro, TableAction } from 'table-pro'
import type { TableColumn, ActionItem, ConfirmHandlers } from 'table-pro'

const columns: TableColumn[] = [
  { key: 'name', title: '名称', config: { isSearch: true, type: 'input' } },
  { key: 'status', title: '状态', config: { isSearch: true, type: 'select' } },
  { key: 'date', title: '日期', config: { isSearch: true, type: 'datePicker' } },
]

const data = ref([
  { id: 1, name: 'admin', status: '启用', date: '2024-01-01' },
  { id: 2, name: 'user', status: '禁用', date: '2024-02-15' },
])

const page = ref(1)
const pageSize = ref(10)

const confirmHandlers: ConfirmHandlers = {
  add: (formData) => console.log('新增:', formData),
  edit: (formData) => console.log('编辑:', formData),
}
</script>

<template>
  <TablePro
    :columns="columns"
    :data="data"
    :confirm-handlers="confirmHandlers"
    v-model:page="page"
    v-model:page-size="pageSize"
    :item-count="100"
    @search="(v) => console.log('搜索:', v)"
  >
    <template #action-col="{ row }">
      <TableAction
        :actions="[
          { label: '编辑', onClick: () => console.log('edit', row) },
        ]"
      />
    </template>
  </TablePro>
</template>
```
