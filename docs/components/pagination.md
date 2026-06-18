# Pagination 分页

分页组件，封装 n-pagination，支持 v-model 双向绑定。

## 基础用法

```vue live
<script setup>
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <n-card title="基础分页">
    <Pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :item-count="100"
      @change="(p, ps) => console.log('变化:', p, ps)"
    />
    <n-divider />
    <p>当前页: {{ page }}, 每页: {{ pageSize }}</p>
  </n-card>
</template>
```

## 自定义配置

```vue live
<script setup>
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(20)
</script>

<template>
  <n-card title="自定义配置">
    <Pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :item-count="200"
      :pagination-props="{
        size: 'small',
        pageSizes: [10, 20, 50, 100],
      }"
    />
  </n-card>
</template>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | `number` | `1` | 当前页码（v-model） |
| `pageSize` | `number` | `10` | 每页条数（v-model） |
| `pageCount` | `number` | `1` | 总页数 |
| `itemCount` | `number` | `0` | 总条目数 |
| `paginationProps` | `PaginationConfig` | `{}` | n-pagination 的 props |

## PaginationConfig 配置

```ts
interface PaginationConfig {
  pageSizes?: number[]          // 可选每页条数
  showSizePicker?: boolean      // 是否显示每页条数选择器
  showQuickJumper?: boolean     // 是否显示快速跳转
  size?: 'small' | 'medium' | 'large' // 分页尺寸
}
```

## Events

| Event | 参数 | 说明 |
|-------|------|------|
| `update:page` | `page: number` | 页码变化 |
| `update:pageSize` | `pageSize: number` | 每页条数变化 |
| `change` | `(page: number, pageSize: number)` | 统一变化回调 |
