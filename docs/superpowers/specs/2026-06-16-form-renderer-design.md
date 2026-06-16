# FormRenderer 共享表单渲染组件

## Context

Search.vue 内部有表单渲染逻辑（schema → form → grid → formItem → 动态 input）+ 操作按钮（搜索/重置/展开折叠）。将表单渲染逻辑抽取为共享组件 `FormRenderer.vue`，Search.vue 精简为 FormRenderer + 操作按钮插槽的壳。暂不修改 Modal。

## 改动

### 1. 新建 `src/components/FormRenderer.vue` — 共享表单渲染

**职责**：接收 schema 和表单数据，渲染完整的表单结构。

**Props**：
- `schema: SearchField[]` — 字段配置
- `modelValue?: Record<string, unknown>` — 表单数据（v-model）
- `formProps?: FormConfig` — n-form props
- `gridProps?: GridConfig` — n-grid props
- `formItemProps?: FormItemConfig` — n-form-item props
- `expanded?: boolean` — 是否展开（控制字段显示数量）
- `visibleCount?: number` — 默认可见字段数（默认 7）

**Emits**：
- `update:modelValue` — 表单值变更
- `search` — 由调用方在 #actions 中触发
- `reset` — 由调用方在 #actions 中触发

**Slots**：
- `#actions` — 空插槽，接收 `{ onSearch, onReset, toggleExpanded, expanded, needsToggle }` 作为 slot props

**内部结构**：
```vue
<component :is="getComponent('form')">
  <component :is="getComponent('grid')">
    <component :is="getComponent('gridItem')" v-for="field in visibleFields">
      <component :is="getComponent('formItem')">
        <component :is="getComponent(field.type)" />
      </component>
    </component>
  </component>
</component>
<!-- #actions 插槽，供调用方放置操作按钮 -->
<slot name="actions" :onSearch="handleSearch" :onReset="handleReset" ... />
```

**内部逻辑**：
- `visibleFields` computed：基于 `expanded` + `visibleCount` 过滤字段
- `handleSearch`：调用 formRef.validate，通过后 emit('search')
- `handleReset`：清空表单字段值，emit('reset')
- `toggleExpanded`：切换 expanded 状态

### 2. 重构 `src/components/Search.vue` — 精简壳

**职责**：管理展开折叠状态 + 搜索/重置事件分发 + 按钮插槽。

**模板**：
```vue
<FormRenderer
  :schema="schema"
  v-model="formValue"
  :form-props="mergedFormProps"
  :grid-props="mergedGridProps"
  :form-item-props="mergedFormItemBaseProps"
  :expanded="expanded"
  :visible-count="DEFAULT_VISIBLE_COUNT"
  @search="$emit('search', $event)"
  @reset="$emit('reset')"
>
  <template #actions="{ onSearch, onReset, toggleExpanded, expanded, needsToggle }">
    <slot name="search" :onClick="onSearch">
      <button @click="onSearch">搜索</button>
    </slot>
    <slot name="reset" :onClick="onReset">
      <button @click="onReset">重置</button>
    </slot>
    <slot v-if="needsToggle" name="toggle" :onClick="toggleExpanded" :expanded="expanded">
      <button @click="toggleExpanded">{{ expanded ? '收起' : '展开' }}</button>
    </slot>
  </template>
</FormRenderer>
```

**保留**：对外 props/emits 完全不变、展开折叠逻辑（moved from Search to FormRenderer）、按钮插槽行为。

**简化**：移除表单渲染的模板代码和 `formValue` 管理代码。

## 验证

1. `npm run type-check` 通过
2. `npm run build-only` 通过
3. `npm run dev` 启动，确认 Search 搜索表单正常（包括展开折叠、搜索/重置/按钮插槽）
