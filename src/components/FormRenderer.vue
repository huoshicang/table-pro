<template>
  <!-- 根节点：form 组件包裹全部字段，通过动态组件渲染 -->
  <component :is="Form" ref="formRef" :model="formValue" v-bind="mappedFormProps">
    <!-- grid 组件提供栅格布局 -->
    <component :is="Grid" v-bind="mappedGridProps">
      <!-- 每个字段的 grid-item -->
      <component :is="GridItem" v-for="field in schema" :key="field.name" :span="field.span ?? 1">
        <!-- form-item：label / path / rule 来自 field 自身，基础 props 走全局合并 -->
        <component
          :is="FormItem"
          :label="field.label"
          v-bind="mappedFieldProps(field)"
        >
          <!-- 字段输入组件，类型由 field.type 决定，props 由 field.componentProps 传入 -->
          <component
            :is="getComponent(field.type ?? 'input')"
            :value="formValue[field.name]"
            @update:value="(val: unknown) => updateField(field.name, val)"
            v-bind="{ style: { width: '100%' }, ...field.componentProps }"
            :placeholder="field.componentProps?.placeholder ?? `请输入${field.label}`"
          />
        </component>
      </component>
      <!-- 操作按钮区域：由父组件通过 actions 插槽注入 -->
      <component :is="GridItem" v-if="$slots.actions">
        <component :is="FormItem" :show-label="false">
          <slot name="actions" />
        </component>
      </component>
    </component>
  </component>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import type { ComponentPublicInstance } from 'vue'
import { useComponentMap } from '@/composables/useComponentMap'
import { useMergedProps } from '@/composables/useMergedProps'
import { useComponentAdapter } from '@/composables/useComponentAdapter'
import { clearAndReassign } from '@/utils/reactive'
import type { FormConfig, GridConfig, FormItemConfig } from '@/index'
import type { SearchField } from '@/types/search'

// ========================================================================
// Props & Emits
// ========================================================================

interface Props {
  schema: SearchField[]
  modelValue?: Record<string, unknown>
  formProps?: FormConfig
  gridProps?: GridConfig
  formItemProps?: FormItemConfig
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  formProps: () => ({}),
  gridProps: () => ({}),
  formItemProps: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()

// ========================================================================
// 依赖注入与状态
// ========================================================================

const formRef = ref<ComponentPublicInstance | null>(null)
const { getComponent } = useComponentMap()
const Form = getComponent('form')
const Grid = getComponent('grid')
const FormItem = getComponent('formItem')
const GridItem = getComponent('gridItem')

const formValue = reactive<Record<string, unknown>>({ ...(props.modelValue ?? {}) })

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    clearAndReassign(formValue, val)
  },
  { deep: true },
)

// ========================================================================
// 配置合并 + 适配器映射
// ========================================================================

const { mapProps: mapFormProps } = useComponentAdapter('form')
const { mapProps: mapGridProps } = useComponentAdapter('grid')
const { mapProps: mapFormItemProps } = useComponentAdapter('formItem')

const mergedFormProps = useMergedProps<FormConfig>('form', () => props.formProps)

const mergedGridProps = useMergedProps<GridConfig>('grid', () => props.gridProps, {
  xGap: 12,
  yGap: 8,
  cols: 4,
})

const mergedFormItemBaseProps = useMergedProps<FormItemConfig>(
  'formItem',
  () => props.formItemProps,
  { labelWidth: 80, labelPlacement: 'left' },
)

/** form props 经适配器映射 */
const mappedFormProps = computed(() => mapFormProps(mergedFormProps.value as Record<string, unknown>))

/** grid props 经适配器映射（如 xGap → gutter） */
const mappedGridProps = computed(() => mapGridProps(mergedGridProps.value as Record<string, unknown>))

/** 生成单个字段的 formItem props（含 field 级别的 path/rule + 全局 base props），经适配器映射 */
function mappedFieldProps(field: SearchField) {
  return mapFormItemProps({
    ...mergedFormItemBaseProps.value,
    path: field.name,
    rule: field.rules,
  })
}

function updateField(name: string, value: unknown) {
  formValue[name] = value
  emit('update:modelValue', { ...formValue })
}

defineExpose({ formRef, formValue })
</script>

<style scoped></style>
