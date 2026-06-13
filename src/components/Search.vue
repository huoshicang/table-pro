<template>
  <!-- 根节点：n-form 包裹全部搜索字段，通过动态组件渲染 -->
  <component :is="getComponent('form')" ref="formRef" :model="formValue" v-bind="mergedFormProps">
    <!-- n-grid 提供栅格布局，cols / xGap / yGap 等全部走 mergedGridProps，不再单独传 cols -->
    <component :is="getComponent('grid')" v-bind="mergedGridProps">
      <component
        :is="getComponent('gridItem')"
        v-for="field in visibleFields"
        :key="field.name"
        :span="field.span ?? 1"
      >
        <!-- 每个字段的 n-form-item，label/path/rule 来自 field 自身，其他基础 props 走全局合并 -->
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
      <!-- 按钮区域：始终显示搜索 / 重置 / 展开折叠按钮，占一个 gridItem -->
      <component :is="getComponent('gridItem')">
        <component :is="getComponent('formItem')" :show-label="false">
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
        </component>
      </component>
    </component>
  </component>
</template>

<script setup lang="ts">
import { inject, reactive, ref, computed } from 'vue'

import type { ComponentPublicInstance } from 'vue'
import { TABLE_COMPONENTS_KEY } from '@/index'
import type { FormConfig, GridConfig, FormItemConfig } from '@/index'
import type { SearchField } from '@/types/search'

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
  /** 用户点击搜索按钮时触发，参数为当前表单值 */
  search: [values: Record<string, unknown>]
  /** 用户点击重置按钮时触发 */
  reset: []
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

/** 表单响应式数据，n-form 校验需要动态属性支持 */
const formValue = reactive<Record<string, unknown>>({ ...(props.modelValue ?? {}) })

/** 是否展开所有字段（默认收起，超出阈值时只显示前 7 个） */
const expanded = ref(false)

// ========================================================================
// 展开/折叠逻辑
// ========================================================================

/** 默认可见字段数：2 行 × 4 列 = 8 格，减去 1 个按钮格 */
const DEFAULT_VISIBLE_COUNT = 7

/** 是否显示展开/折叠按钮（字段数超出默认可见数时显示） */
const needsToggle = computed(() => props.schema.length > DEFAULT_VISIBLE_COUNT)

/** 当前可见的字段列表，超出阈值且未展开时只显示前 DEFAULT_VISIBLE_COUNT 个 */
const visibleFields = computed<SearchField[]>(() => {
  if (!needsToggle.value || expanded.value) {
    return props.schema
  }
  return props.schema.slice(0, DEFAULT_VISIBLE_COUNT)
})

// ========================================================================
// 配置合并：全局默认 → 组件 props 覆盖
// ========================================================================

/** 合并 n-form 配置：全局默认 → 组件传入 props，后者覆盖前者 */
const mergedFormProps: FormConfig = {
  ...(globalComponentDefaults?.form ?? {}),
  ...props.formProps,
}

/** 合并 n-grid 配置：全局默认 → 组件传入 props，后者覆盖前者
 * cols / xGap / yGap 等全部通过 mergedGridProps 传入模板，不再单独传 prop
 */
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
  ...(globalComponentDefaults?.formItem ?? {}),
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

/** 校验表单，通过后触发 search 事件 */
function handleSearch() {
  // @ts-expect-error dynamic component ref, validate API is available at runtime
  formRef.value?.validate?.((errors: unknown) => {
    if (!errors) {
      emit('search', { ...formValue })
    }
  })
}

/** 重置所有表单字段为空值并触发 reset 事件 */
function handleReset() {
  for (const field of props.schema) {
    formValue[field.name] = ''
  }
  emit('update:modelValue', { ...formValue })
  emit('reset')
}
</script>

<style scoped></style>
