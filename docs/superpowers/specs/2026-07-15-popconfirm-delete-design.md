# 删除操作 Popconfirm 二次确认设计

## 目标

为表格的行级删除和内置批量删除提供不可绕过的 Popconfirm 二次确认，同时保持 table-pro 的跨 UI 库组件注入模式，并让调用方以明确、简洁的 API 声明删除操作。

## 使用方式

`TableAction` 新增可选的 `deleteAction`。调用方将普通操作保留在 `actions` 中，仅将删除回调传给 `deleteAction`：

```vue
<TableAction
  :actions="getTableAction(row)"
  :delete-action="{ onClick: () => handleDelete(row) }"
/>
```

`deleteAction` 默认显示“删除”，并允许通过 `label` 和 `meta` 定制按钮展示；它不提供关闭确认的配置。组件始终用 Popconfirm 包裹此按钮，只有用户确认后才调用 `onClick`。

内置批量删除无需调用方新增配置：点击后显示带当前选中数量的 Popconfirm；只有确认才触发既有 `batch-delete` 事件并清空选中行，取消时保留选中状态。

## 架构

- `ComponentMap` 增加 `popconfirm`，由调用方注入其 UI 库实现。
- `AdaptersConfig` 增加 `popconfirm` 映射，用于统一确认事件和触发器插槽名称。
- `TableAction` 获取动态 Popconfirm，将 `deleteAction` 的按钮作为触发器；普通按钮和下拉菜单维持现有行为。
- `Table` 使用同一动态 Popconfirm 包裹批量删除按钮。
- 两个 demo 分别注册 Naive UI `NPopconfirm` 与 Ant Design Vue `Popconfirm`，并提供对应的适配映射。

## 兼容性与错误处理

- 不以删除文案识别操作，避免国际化或自定义文案导致误判。
- 不修改 `ActionItem`，原有 `actions` / `dropDownActions` 调用保持兼容；删除操作迁移至新增 `deleteAction` 后获得强制确认。
- 若消费者未注入 `popconfirm`，不渲染删除和批量删除触发器，并在开发模式给出明确警告；绝不降级为可直接执行删除的普通按钮。文档和两套 demo 必须说明/展示 `popconfirm` 的注册为删除功能的必需依赖。

## 验证

- 类型检查和生产构建通过。
- Naive UI 与 Ant Design Vue demo 中：行级删除仅确认后触发回调；批量删除仅确认后触发事件并清空选择；取消不产生回调或状态变更。
