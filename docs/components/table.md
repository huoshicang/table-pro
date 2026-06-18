# Table 数据表格

数据表格组件，通过 ComponentMap 动态渲染 n-data-table。

## 基础用法

```vue live
<script setup>
import { ref } from 'vue'

const columns = [
  { key: 'name', title: '名称', sortable: true },
  { key: 'age', title: '年龄', sortable: true, width: 80 },
  { key: 'status', title: '状态' },
]

const data = ref([
  { id: 1, name: 'admin', age: 28, status: '启用' },
  { id: 2, name: 'user', age: 25, status: '禁用' },
  { id: 3, name: 'guest', age: 30, status: '启用' },
])

const checkedKeys = ref([])
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :show-add="true"
    row-key="id"
    @action="(key) => console.log('action:', key)"
    @batch-delete="(keys) => { data = data.filter(r => !keys.includes(r.id)) }"
  />
</template>
```

## 自定义操作列

```vue live
<script setup>
import { ref } from 'vue'

const columns = [
  { key: 'name', title: '名称' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色' },
]

const data = ref([
  { id: 1, name: '张三', email: 'zhang@example.com', role: '管理员' },
  { id: 2, name: '李四', email: 'li@example.com', role: '用户' },
])
</script>

<template>
  <Table :columns="columns" :data="data" :show-add="false">
    <template #action-col="{ row }">
      <TableAction
        :actions="[
          { label: '编辑', onClick: () => console.log('edit', row) },
          { label: '删除', onClick: () => { data = data.filter(r => r.id !== row.id) }, meta: { type: 'error' } },
        ]"
        :dropDownActions="[
          { label: '查看详情', onClick: () => console.log('detail', row) },
        ]"
      />
    </template>
  </Table>
</template>
```

## 自定义工具栏

```vue live
<script setup>
import { ref } from 'vue'

const columns = [
  { key: 'product', title: '产品' },
  { key: 'price', title: '价格' },
  { key: 'stock', title: '库存' },
]

const data = ref([
  { id: 1, product: 'iPhone', price: 7999, stock: 100 },
  { id: 2, product: 'MacBook', price: 12999, stock: 50 },
])
</script>

<template>
  <Table :columns="columns" :data="data" :show-add="false">
    <template #toolbar>
      <n-space>
        <n-button type="primary" @click="console.log('自定义操作')">导入数据</n-button>
        <n-button @click="console.log('导出')">导出 Excel</n-button>
      </n-space>
    </template>
  </Table>
</template>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `TableColumn<T>[]` | `[]` | 列配置 |
| `data` | `T[]` | `[]` | 表格数据 |
| `showAdd` | `boolean` | `true` | 显示新增按钮 |
| `rowKey` | `string` | `'id'` | 行唯一标识字段 |
| `tableProps` | `TableConfig` | `{}` | n-table 的 props |

## TableColumn 配置

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

## ColumnConfig 配置

```ts
interface ColumnConfig {
  isNew?: boolean               // 是否参与新增表单
  isSearch?: boolean            // 是否参与搜索表单
  type?: keyof ComponentMap     // 表单控件类型
}
```

## Events

| Event | 参数 | 说明 |
|-------|------|------|
| `action` | `(actionKey: string, row?: T)` | 操作按钮点击 |
| `batch-delete` | `keys: unknown[]` | 批量删除 |

## Slots

| Slot | Props | 说明 |
|------|-------|------|
| `action-col` | `{ row }` | 操作列（每行调用） |
| `toolbar` | — | 工具栏（覆盖默认新增/批量删除按钮） |
