# Popconfirm 删除二次确认设计

## 背景

Table.vue 的批量删除按钮和 TableAction.vue 的删除操作按钮目前没有二次确认，用户点击后直接执行删除。需要使用 Popconfirm 组件进行二次确认。

## 问题

1. Table.vue 的"批量删除"按钮是固定的，可以直接嵌套 Popconfirm
2. TableAction.vue 的操作按钮通过 `v-for` 动态渲染，需要一种方式标识哪些按钮需要确认
3. 不同 UI 库的 Popconfirm API 不同：
   - Naive UI `NPopconfirm`：使用 `#trigger` 插槽包裹触发元素，事件为 `positive-click` / `negative-click`
   - Ant Design Vue `APopconfirm`：直接包裹子元素作为触发器，事件为 `confirm` / `cancel`
4. 需要支持后期扩展其他 UI 库，不能硬编码库名

## 设计方案

### 1. 新建 ConfirmButton 组件

新建 `src/components/ConfirmButton.vue`，封装 Popconfirm 的跨 UI 库差异。

**Props：**

| Prop | 类型 | 说明 |
|------|------|------|
| `confirmTitle` | `string` | 确认提示文案（默认 '确认执行此操作？'） |

**Slots：**

| Slot | 说明 |
|------|------|
| `default` | 触发 Popconfirm 的按钮/元素 |

**Events：**

| Event | 说明 |
|-------|------|
| `confirm` | 用户点击确认 |
| `cancel` | 用户点击取消 |

**内部逻辑：**

- 通过 `getComponent('popconfirm')` 获取 Popconfirm 组件
- 通过 `useComponentAdapter('popconfirm')` 映射事件名
- 根据 `adapter.triggerMode` 决定渲染方式：
  - `'slot'`：用 `#[triggerSlot]` 插槽包裹子元素
  - `'wrap'`：直接包裹子元素作为触发器
- 不硬编码任何 UI 库名称

### 2. 扩展 ActionItem 类型

在 `src/types/common.ts` 中扩展 `ActionItem`：

```ts
interface ActionItem {
  label: string
  onClick: () => void
  meta?: Record<string, unknown>
  confirm?: {                    // 新增
    title?: string               // 确认提示文案（默认 '确认执行此操作？'）
    onCancel?: () => void        // 取消回调（可选）
  }
}
```

当 `confirm` 存在时，按钮被 ConfirmButton 包裹，`onClick` 变为确认后才执行。

### 3. TableAction.vue 改动

```vue
<!-- 有 confirm → ConfirmButton 包裹 -->
<template v-if="action.confirm">
  <component :is="ConfirmButton" :confirm-title="action.confirm.title" @confirm="action.onClick" @cancel="action.confirm.onCancel">
    <component :is="Button" ...>{{ action.label }}</component>
  </component>
</template>

<!-- 无 confirm → 直接按钮 -->
<component v-else :is="Button" ...>{{ action.label }}</component>
```

### 4. Table.vue 批量删除按钮

固定按钮，直接用 ConfirmButton 包裹：

```vue
<component :is="ConfirmButton" confirm-title="确认删除选中的数据？" @confirm="handleBatchDelete">
  <component :is="Button" type="error">批量删除（{{ checkedRowKeys.length }}）</component>
</component>
```

### 5. ComponentMap 新增 `popconfirm`

在 `src/index.ts` 的 ComponentMap 中添加 `popconfirm` 类型。

### 6. triggerMode 配置说明

在 popconfirm 的 adapter 中新增 `triggerMode` 配置项，用于描述 Popconfirm 的渲染方式。

#### `triggerMode: 'slot'` — 使用插槽包裹触发元素

适用于 Naive UI `NPopconfirm` 等使用插槽定义触发器的组件。

```ts
popconfirm: {
  triggerMode: 'slot',
  triggerSlot: 'trigger',     // 触发器插槽名（Naive UI 固定为 'trigger'）
  events: {
    'positive-click': 'confirm',   // 确认事件映射
    'negative-click': 'cancel',    // 取消事件映射
  },
}
```

渲染结果：
```vue
<Popconfirm @positive-click="onConfirm" @negative-click="onCancel">
  <template #trigger>
    <Button>删除</Button>
  </template>
</Popconfirm>
```

#### `triggerMode: 'wrap'` — 直接包裹子元素

适用于 Ant Design Vue `APopconfirm` 等直接包裹子元素作为触发器的组件。

```ts
popconfirm: {
  triggerMode: 'wrap',
  events: {
    confirm: 'confirm',      // 确认事件映射
    cancel: 'cancel',        // 取消事件映射
  },
}
```

渲染结果：
```vue
<Popconfirm @confirm="onConfirm" @cancel="onCancel">
  <Button>删除</Button>
</Popconfirm>
```

#### 配置对照表

| 配置项 | `triggerMode: 'slot'` | `triggerMode: 'wrap'` |
|--------|----------------------|----------------------|
| `triggerSlot` | 必填，触发器插槽名 | 不需要 |
| `events` | 映射确认/取消事件名 | 映射确认/取消事件名 |
| 适用场景 | Naive UI `NPopconfirm` | Ant Design Vue `APopconfirm` |

### 7. main.ts 配置更新

#### Naive UI

```ts
components: {
  popconfirm: NPopconfirm,
},
adapters: {
  popconfirm: {
    triggerMode: 'slot',
    triggerSlot: 'trigger',
    events: {
      'positive-click': 'confirm',
      'negative-click': 'cancel',
    },
  },
}
```

#### Ant Design Vue

```ts
components: {
  popconfirm: APopconfirm,
},
adapters: {
  popconfirm: {
    triggerMode: 'wrap',
    events: {
      confirm: 'confirm',
      cancel: 'cancel',
    },
  },
}
```

### 8. README 更新

- ActionItem 类型新增 `confirm` 字段说明
- main.ts 配置示例新增 popconfirm 组件注册和 adapter 配置
- adapters 速查表新增 popconfirm
- triggerMode 配置说明（含对照表）

## 涉及文件

| 文件 | 改动 |
|------|------|
| `src/components/ConfirmButton.vue` | **新建** — Popconfirm 封装组件 |
| `src/types/common.ts` | ActionItem 新增 `confirm` 字段 |
| `src/components/TableAction.vue` | v-for 中根据 `confirm` 字段条件渲染 ConfirmButton |
| `src/components/Table.vue` | 批量删除按钮用 ConfirmButton 包裹 |
| `src/index.ts` | ComponentMap 新增 `popconfirm` 类型 |
| `src/main.ts` | 注册 popconfirm 组件 + adapter 配置 |
| `README.md` | 更新 ActionItem 类型、main.ts 配置示例、adapters 说明 |
