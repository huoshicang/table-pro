<template>
  <!-- 根节点：n-form 包裹全部字段，通过动态组件渲染 -->
  <component :is="getComponent('form')" ref="formRef" :model="formValue" v-bind="mergedFormProps">
    <!-- n-grid 提供栅格布局 -->
    <component :is="getComponent('grid')" v-bind="mergedGridProps">
      <!-- 每个字段的 n-grid-item -->
      <component
        :is="getComponent('gridItem')"
        v-for="field in schema"
        :key="field.name"
        :span="field.span ?? 1"
      >
        <!-- n-form-item：label / path / rule 来自 field 自身，基础 props 走全局合并 -->
        <component
          :is="getComponent('formItem')"
          :label="field.label"
          :path="field.name"
          :rule="field.rules"
          v-bind="mergedFormItemBaseProps"
        >
          <!-- 字段输入组件，类型由 field.type 决定，props 由 field.componentProps 传入 -->
          <component
            :is="getComponent(field.type)"
            :value="formValue[field.name]"
            @update:value="(val: unknown) => updateField(field.name, val)"
            v-bind="{ style: { width: '100%' }, ...field.componentProps }"
            :placeholder="field.componentProps?.placeholder ?? `请输入${field.label}`"
          />
        </component>
      </component>
      <!-- 操作按钮区域：由父组件通过 actions 插槽注入 -->
      <component :is="getComponent('gridItem')" v-if="$slots.actions">
        <component :is="getComponent('formItem')" :show-label="false">
          <slot name="actions" />
        </component>
      </component>
    </component>
  </component>
</template>

<script setup lang="ts">
import { inject, reactive, ref } from 'vue'

import type { ComponentPublicInstance } from 'vue'
import { TABLE_COMPONENTS_KEY } from '@/index'
import type { FormConfig, GridConfig, FormItemConfig } from '@/index'
import type { SearchField } from '@/types/search'

// ========================================================================
// Props & Emits
// ========================================================================

/** 表单渲染组件的属性定义 —— 纯表单字段渲染，不含操作按钮 */
interface Props {
  /** 字段配置数组，每个元素定义一个字段的 name / label / type 等 */
  schema: SearchField[]
  /** 表单数据（双向绑定），key 为字段名，value 为用户输入的值 */
  modelValue?: Record<string, unknown>
  /** n-form 的 props，合并时会覆盖全局配置中的同名字段 */
  formProps?: FormConfig
  /** n-grid 的 props（含 cols / xGap / yGap 等），合并时会覆盖全局配置中的同名字段 */
  gridProps?: GridConfig
  /** n-form-item 的 props，合并时会覆盖全局配置中的同名字段 */
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
  'update:modelValue': [value: Record<string, unknown>]
}>()

// ========================================================================
// 依赖注入与状态
// ========================================================================

/** 表单组件 ref，用于调用 n-form 的 validate 方法 */
const formRef = ref<ComponentPublicInstance | null>(null)
const injection = inject(TABLE_COMPONENTS_KEY, { components: {} })
const componentMap = injection.components
/** 提取全局组件默认配置，避免每次访问深层嵌套 */
const globalComponentDefaults = injection.config?.components

/** 表单响应式数据 */
const formValue = reactive<Record<string, unknown>>({ ...(props.modelValue ?? {}) })

// ========================================================================
// 配置合并：全局默认 → 组件 props 覆盖
// ========================================================================

/** 合并 n-form 配置：全局默认 → 组件传入 props，后者覆盖前者 */
const mergedFormProps: FormConfig = {
  ...(globalComponentDefaults?.form ?? {}),
  ...props.formProps,
}

/** 合并 n-grid 配置：全局默认 → 组件传入 props，后者覆盖前者 */
const mergedGridProps: GridConfig = {
  ...(globalComponentDefaults?.grid ?? {
    xGap: 12,
    yGap: 8,
    cols: 4,
  }),
  ...props.gridProps,
}

/** 合并 n-form-item 基础 props：全局默认 → 组件传入 props，后者覆盖前者
 * label / path / rule 在模板中由 field 级别单独传入，不在此合并
 */
const mergedFormItemBaseProps: FormItemConfig = {
  ...(globalComponentDefaults?.formItem ?? {
    labelWidth: 80,
    labelPlacement: 'left',
  }),
  ...props.formItemProps,
}

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

/** 更新表单字段值并同步到父组件 */
function updateField(name: string, value: unknown) {
  formValue[name] = value
  emit('update:modelValue', { ...formValue })
}

// ========================================================================
// 对外暴露：父组件可通过 ref 访问 formRef（校验）和 formValue（读写）
// ========================================================================

defineExpose({ formRef, formValue })
</script>

<style scoped></style>
