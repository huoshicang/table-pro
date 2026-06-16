<template>
  <!-- 根节点：n-form 包裹全部表单字段，通过动态组件渲染 -->
  <component
    :is="getComponent('form')"
    ref="formRef"
    :model="formValue"
    v-bind="mergedFormProps"
  >
    <!-- n-grid 提供栅格布局，cols / xGap / yGap 等全部走 mergedGridProps -->
    <component :is="getComponent('grid')" v-bind="mergedGridProps">
      <component
        :is="getComponent('gridItem')"
        v-for="field in visibleFields"
        :key="field.name"
        :span="field.span ?? 1"
      >
        <!-- 每个字段的 n-form-item，label/path/rule 来自 field 自身 -->
        <component
          :is="getComponent('formItem')"
          :label="field.label"
          :path="field.name"
          :rule="field.rules"
          v-bind="mergedFormItemBaseProps"
        >
          <!-- 字段输入组件，类型由 field.type 决定 -->
          <component
            :is="getComponent(field.type)"
            :value="formValue[field.name]"
            @update:value="(val: unknown) => updateField(field.name, val)"
            v-bind="{ style: { width: '100%' }, ...field.componentProps }"
            :placeholder="field.componentProps?.placeholder ?? `请输入${field.label}`"
          />
        </component>
      </component>
    </component>
  </component>
  <!-- 操作按钮区域：空插槽，由调用方自由放置按钮 -->
  <slot
    name="actions"
    :onSearch="handleSearch"
    :onReset="handleReset"
    :toggleExpanded="toggleExpanded"
    :expanded="expanded"
    :needsToggle="needsToggle"
  />
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

/** 表单渲染组件的属性定义 */
interface Props {
  /** 表单字段配置数组 */
  schema: SearchField[]
  /** 表单数据（双向绑定） */
  modelValue?: Record<string, unknown>
  /** n-form 的 props */
  formProps?: FormConfig
  /** n-grid 的 props */
  gridProps?: GridConfig
  /** n-form-item 的 props */
  formItemProps?: FormItemConfig
  /** 是否展开所有字段（默认收起，超出阈值时只显示前 visibleCount 个） */
  expanded?: boolean
  /** 默认可见字段数 */
  visibleCount?: number
}

// ========================================================================
// Props 默认值
// ========================================================================

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  formProps: () => ({}),
  gridProps: () => ({}),
  formItemProps: () => ({}),
  expanded: false,
  visibleCount: 7,
})

const emit = defineEmits<{
  /** 表单值变更 */
  'update:modelValue': [value: Record<string, unknown>]
  /** 用户触发搜索 */
  search: [values: Record<string, unknown>]
  /** 用户触发重置 */
  reset: []
}>()

// ========================================================================
// 依赖注入与状态
// ========================================================================

/** 表单组件 ref */
const formRef = ref<ComponentPublicInstance | null>(null)
const injection = inject(TABLE_COMPONENTS_KEY, { components: {} })
const componentMap = injection.components
/** 提取全局组件默认配置 */
const globalComponentDefaults = injection.config?.components

/** 表单响应式数据 */
const formValue = reactive<Record<string, unknown>>({ ...(props.modelValue ?? {}) })

/** 内部展开状态（受 props.expanded 控制） */
const expanded = ref(props.expanded)

// ========================================================================
// 监听 props.expanded 变化（外部控制展开状态）
// ========================================================================

import { watch } from 'vue'

watch(
  () => props.expanded,
  (val) => {
    expanded.value = val
  }
)

// ========================================================================
// 展开/折叠逻辑
// ========================================================================

/** 是否显示展开/折叠按钮（字段数超出默认可见数时显示） */
const needsToggle = computed(() => props.schema.length > props.visibleCount)

/** 当前可见的字段列表 */
const visibleFields = computed<SearchField[]>(() => {
  if (!needsToggle.value || expanded.value) {
    return props.schema
  }
  return props.schema.slice(0, props.visibleCount)
})

function toggleExpanded() {
  expanded.value = !expanded.value
}

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

function updateField(name: string, value: unknown) {
  formValue[name] = value
  emit('update:modelValue', { ...formValue })
}

/** 校验表单，通过后触发 search 事件 */
function handleSearch() {
  // @ts-expect-error dynamic component ref
  formRef.value?.validate?.((errors: unknown) => {
    if (!errors) {
      emit('search', { ...formValue })
    }
  })
}

/** 重置所有表单字段为空值 */
function handleReset() {
  for (const field of props.schema) {
    formValue[field.name] = ''
  }
  emit('update:modelValue', { ...formValue })
  emit('reset')
}

// ========================================================================
// 暴露
// ========================================================================

defineExpose({
  /** 表单 ref，供外部调用 validate 等方法 */
  formRef,
})
</script>
