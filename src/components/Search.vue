<template>
  <!-- 使用 FormRenderer 渲染表单，操作按钮通过 #actions 插槽自定义 -->
  <FormRenderer
    :schema="schema"
    v-model="formValue"
    :form-props="mergedFormProps"
    :grid-props="mergedGridProps"
    :form-item-props="mergedFormItemBaseProps"
    :expanded="expanded"
    :visible-count="DEFAULT_VISIBLE_COUNT"
    @search="handleSearch"
    @reset="handleReset"
  >
    <template #actions="{ onSearch, onReset, toggleExpanded, needsToggle }">
      <component :is="getComponent('gridItem')">
        <component :is="getComponent('formItem')" :show-label="false">
          <component :is="getComponent('space')">
            <slot name="search" :onClick="onSearch">
              <component :is="getComponent('button')" attr-type="button" @click="onSearch">搜索</component>
            </slot>
            <slot name="reset" :onClick="onReset">
              <component :is="getComponent('button')" attr-type="button" @click="onReset">重置</component>
            </slot>
            <slot
              v-if="needsToggle"
              name="toggle"
              :onClick="toggleExpanded"
              :expanded="expanded"
            >
              <component
                :is="getComponent('button')"
                attr-type="button"
                @click="toggleExpanded"
              >
                {{ expanded ? '收起' : '展开' }}
              </component>
            </slot>
          </component>
        </component>
      </component>
    </template>
  </FormRenderer>
</template>

<script setup lang="ts">
import { inject, reactive, ref, computed } from 'vue'

import type { ComponentPublicInstance } from 'vue'
import { TABLE_COMPONENTS_KEY } from '@/index'
import type { FormConfig, GridConfig, FormItemConfig } from '@/index'
import type { SearchField } from '@/types/search'
import FormRenderer from './FormRenderer.vue'

// ========================================================================
// Props & Emits
// ========================================================================

/** 搜索表单组件的属性定义 */
interface Props {
  /** 搜索字段配置数组 */
  schema: SearchField[]
  /** 表单数据（双向绑定） */
  modelValue?: Record<string, unknown>
  /** n-form 的 props */
  formProps?: FormConfig
  /** n-grid 的 props */
  gridProps?: GridConfig
  /** n-form-item 的 props */
  formItemProps?: FormItemConfig
}

// ========================================================================
// Props 默认值
// ========================================================================

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  formProps: () => ({}),
  gridProps: () => ({}),
  formItemProps: () => ({}),
})

const emit = defineEmits<{
  search: [values: Record<string, unknown>]
  reset: []
  'update:modelValue': [value: Record<string, unknown>]
}>()

// ========================================================================
// 依赖注入与状态
// ========================================================================

const injection = inject(TABLE_COMPONENTS_KEY, { components: {} })
const componentMap = injection.components
const globalComponentDefaults = injection.config?.components

/** 表单响应式数据 */
const formValue = reactive<Record<string, unknown>>({ ...(props.modelValue ?? {}) })

/** 内部展开状态 */
const expanded = ref(false)

// ========================================================================
// 监听外部 modelValue 变更
// ========================================================================

import { watch } from 'vue'

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      for (const key of Object.keys(formValue)) {
        delete (formValue as Record<string, unknown>)[key]
      }
      for (const [k, v] of Object.entries(val)) {
        formValue[k] = v
      }
    }
  },
  { deep: true }
)

// ========================================================================
// 展开/折叠逻辑
// ========================================================================

/** 默认可见字段数：2 行 × 4 列 = 8 格，减去 1 个按钮格 */
const DEFAULT_VISIBLE_COUNT = 7

// ========================================================================
// 配置合并：全局默认 → 组件 props 覆盖
// ========================================================================

const mergedFormProps: FormConfig = {
  ...(globalComponentDefaults?.form ?? {}),
  ...props.formProps,
}

const mergedGridProps: GridConfig = {
  ...(globalComponentDefaults?.grid ?? {
    xGap: 12,
    yGap: 8,
    cols: 4,
  }),
  ...props.gridProps,
}

const mergedFormItemBaseProps: FormItemConfig = {
  ...(globalComponentDefaults?.formItem ?? {}),
  ...props.formItemProps,
}

// ========================================================================
// 工具函数
// ========================================================================

function getComponent(type: string) {
  return (
    (componentMap as Record<string, (typeof componentMap)[keyof typeof componentMap]>)[type] ??
    componentMap.input
  )
}

/** 校验表单，通过后触发 search 事件 */
function handleSearch() {
  emit('search', { ...formValue })
}

/** 重置所有表单字段 */
function handleReset() {
  for (const field of props.schema) {
    formValue[field.name] = ''
  }
  emit('update:modelValue', { ...formValue })
  emit('reset')
}
</script>
