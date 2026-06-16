<template>
  <!-- 表单字段由 FormRenderer 渲染，Search 只负责操作按钮 -->
  <FormRenderer
    ref="formRendererRef"
    :schema="visibleFields"
    v-model="formData"
    :formProps="props.formProps"
    :gridProps="props.gridProps"
    :formItemProps="props.formItemProps"
  >
    <template #actions>
      <component :is="getComponent('space')">
        <slot name="search" :onClick="handleSearch">
          <component :is="getComponent('button')" attr-type="button" @click="handleSearch">搜索</component>
        </slot>
        <slot name="reset" :onClick="handleReset">
          <component :is="getComponent('button')" attr-type="button" @click="handleReset">重置</component>
        </slot>
        <slot
          v-if="needsToggle"
          name="toggle"
          :onClick="() => { expanded = !expanded }"
          :expanded="expanded"
        >
          <component
            :is="getComponent('button')"
            attr-type="button"
            @click="expanded = !expanded"
          >
            {{ expanded ? '收起' : '展开' }}
          </component>
        </slot>
      </component>
    </template>
  </FormRenderer>
</template>

<script setup lang="ts">
import { inject, ref, computed, watch } from 'vue'

import { TABLE_COMPONENTS_KEY } from '@/index'
import type { FormConfig, GridConfig, FormItemConfig } from '@/index'
import type { SearchField } from '@/types/search'
import FormRenderer from '@/components/FormRenderer.vue'

// ========================================================================
// Props & Emits
// ========================================================================

/** 搜索表单组件的属性定义 */
interface Props {
  /** 搜索字段配置数组，每个元素定义一个字段的 name / label / type 等 */
  schema: SearchField[]
  /** 表单数据（双向绑定），key 为字段名，value 为用户输入的值 */
  modelValue?: Record<string, unknown>
  /** n-form 的 props，合并时会覆盖全局配置中的同名字段 */
  formProps?: FormConfig
  /** n-grid 的 props（含 cols / xGap / yGap 等），合并时会覆盖全局配置中的同名字段 */
  gridProps?: GridConfig
  /** n-form-item 的 props，合并时会覆盖全局配置中的同名字段 */
  formItemProps?: FormItemConfig
  /** 未展开时默认显示的字段数（默认 3） */
  defaultVisibleCount?: number
}

// ========================================================================
// Props 默认值
// ========================================================================

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  formProps: () => ({}),
  gridProps: () => ({}),
  formItemProps: () => ({}),
  defaultVisibleCount: 3,
})

const emit = defineEmits<{
  /** 用户点击搜索按钮时触发，参数为当前表单值 */
  search: [values: Record<string, unknown>]
  /** 用户点击重置按钮时触发 */
  reset: []
  'update:modelValue': [value: Record<string, unknown>]
}>()

// ========================================================================
// 依赖注入与状态
// ========================================================================

const injection = inject(TABLE_COMPONENTS_KEY, { components: {} })
const componentMap = injection.components

/** FormRenderer 组件 ref，用于访问其内部的 formRef 和 formValue */
const formRendererRef = ref<InstanceType<typeof FormRenderer> | null>(null)

/** 表单数据，通过 v-model 与 FormRenderer 双向同步 */
const formData = ref<Record<string, unknown>>({ ...(props.modelValue ?? {}) })

/** 将 FormRenderer 的数据变更同步到 Search 的父组件 */
watch(
  formData,
  (val) => {
    emit('update:modelValue', { ...val })
  },
  { deep: true },
)

/** 是否展开所有字段（默认收起，超出阈值时只显示前 defaultVisibleCount 个） */
const expanded = ref(false)

// ========================================================================
// 展开/折叠逻辑
// ========================================================================

/** 是否显示展开/折叠按钮（字段数超出默认可见数时显示） */
const needsToggle = computed(() => props.schema.length > props.defaultVisibleCount)

/** 当前可见的字段列表，超出阈值且未展开时只显示前 defaultVisibleCount 个 */
const visibleFields = computed<SearchField[]>(() => {
  if (!needsToggle.value || expanded.value) {
    return props.schema
  }
  return props.schema.slice(0, props.defaultVisibleCount)
})

// ========================================================================
// 工具函数
// ========================================================================

/** 根据组件类型名从注入的 ComponentMap 中查找组件，未找到时 fallback 到 input */
function getComponent(type: string) {
  return (
    (componentMap as Record<string, (typeof componentMap)[keyof typeof componentMap]>)[type] ??
    componentMap.input
  )
}

// ========================================================================
// 搜索 / 重置逻辑
// ========================================================================

/** 校验表单，通过后触发 search 事件 */
function handleSearch() {
  // @ts-expect-error dynamic component ref, validate API is available at runtime
  formRendererRef.value?.formRef?.validate?.((errors: unknown) => {
    if (!errors) {
      emit('search', { ...formData.value })
    }
  })
}

/** 重置所有表单字段为空值并触发 reset 事件 */
function handleReset() {
  const fv = formRendererRef.value?.formValue
  if (fv) {
    for (const field of props.schema) {
      fv[field.name] = ''
    }
  }
  formData.value = fv ? { ...fv } : {}
  emit('update:modelValue', { ...formData.value })
  emit('reset')
}
</script>

<style scoped></style>
