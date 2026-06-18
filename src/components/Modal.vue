<template>
  <component
    :is="getComponent('modal')"
    v-bind="mergedModalProps"
    @[visibleEvent]="onVisibleChange"
  >
    <!-- 头部：逻辑插槽 #header → 映射到 UI 库的 header 插槽名 -->
    <template #[headerSlotName]>
      <slot name="header">{{ title }}</slot>
    </template>

    <!-- 表单区域：固定渲染，不走 slot -->
    <FormRenderer
      ref="formRendererRef"
      :schema="formSchema"
      v-model="formData"
      :form-props="detailFormProps"
    />

    <!-- 底部按钮：逻辑插槽 #actions → 映射到 UI 库的 actions 插槽名 -->
    <template #[actionsSlotName]>
      <slot name="actions" :onConfirm="handleConfirm" :onCancel="handleCancel">
        <component :is="Space">
          <component :is="Button" @click="handleCancel">取消</component>
          <component
            v-if="props.mode !== 'detail'"
            :is="Button"
            type="primary"
            @click="handleConfirm"
          >
            确认
          </component>
        </component>
      </slot>
    </template>
  </component>
</template>

<script setup lang="ts" generic="T">
import { computed, reactive, ref, watch } from 'vue'

import { useComponentMap } from '@/composables/useComponentMap'
import { useMergedProps } from '@/composables/useMergedProps'
import { clearAndReassign } from '@/utils/reactive'
import FormRenderer from '@/components/FormRenderer.vue'
import type { SearchField } from '@/types/search'
import type { ModalConfig, FormConfig } from '@/index'
import type { ConfirmHandlers, FormRendererInstance } from '@/types/common'

// ========================================================================
// Props & Emits
// ========================================================================

interface Props {
  /** 弹窗显隐 */
  visible?: boolean
  /** 弹窗模式：add | edit | detail */
  mode?: 'add' | 'edit' | 'detail'
  /** 编辑/详情时的行数据 */
  rowData?: T | null
  /** 表单字段配置（由父组件从 columns 派生） */
  formSchema: SearchField[]
  /** n-modal 的 props，合并时会覆盖全局配置中的同名字段 */
  modalProps?: ModalConfig
  /** 确认回调，按模式分发 */
  confirmHandlers?: ConfirmHandlers
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  mode: 'add',
  rowData: null,
  formSchema: () => [],
  modalProps: () => ({}),
  confirmHandlers: () => ({}),
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  /** 取消 */
  cancel: []
}>()

// ========================================================================
// 依赖注入
// ========================================================================

const { getComponent, injection } = useComponentMap()
/** Modal 适配器：映射 UI 库的可见性 prop/事件名和插槽名 */
const modalAdapter = injection.config?.modalAdapter ?? {
  visibleProp: 'show',
  visibleEvent: 'update:show',
  slots: { header: 'header', actions: 'action' },
}

/** UI 库的实际插槽名，由 modalAdapter.slots 映射 */
const headerSlotName = computed(() => modalAdapter.slots?.header ?? 'header')
const actionsSlotName = computed(() => modalAdapter.slots?.actions ?? 'action')
/** UI 库的可见性事件名，由 modalAdapter.visibleEvent 映射 */
const visibleEvent = computed(() => modalAdapter.visibleEvent ?? 'update:show')
/** 常用组件引用：提取为变量，避免模板中重复调用 getComponent */
const Button = getComponent('button')
const Space = getComponent('space')

// ========================================================================
// 弹窗标题
// ========================================================================

const title = computed(() => {
  switch (props.mode) {
    case 'add':
      return '新增'
    case 'edit':
      return '编辑'
    default:
      return '详情'
  }
})

// ========================================================================
// Modal props：全局默认 → 组件传入 props，后者覆盖前者
// ========================================================================

/** 合并 modal 配置，额外追加 visibleProp 绑定 */
const baseModalProps = useMergedProps<ModalConfig>('modal', () => props.modalProps)
const mergedModalProps = computed(() => ({
  ...baseModalProps.value,
  [modalAdapter.visibleProp || 'show']: props.visible,
}))

/** 详情模式下禁用全部表单项 */
const detailFormProps = computed<FormConfig>(() =>
  props.mode === 'detail' ? { disabled: true } : {},
)

// ========================================================================
// 表单数据
// ========================================================================

const formRendererRef = ref<FormRendererInstance | null>(null)
/** 表单响应式数据，由 FormRenderer v-model 双向绑定 */
const formData = reactive<Record<string, unknown>>({})

/** 弹窗打开时初始化表单数据：新增为空，编辑/详情填入 rowData */
watch(
  () => props.visible,
  (isVisible) => {
    if (!isVisible) return

    // 清空旧数据并回填新数据，保持 formData 引用不变
    const source =
      (props.mode === 'edit' || props.mode === 'detail') && props.rowData
        ? (props.rowData as Record<string, unknown>)
        : {}
    clearAndReassign(formData, source)
  },
)

// ========================================================================
// 操作处理
// ========================================================================

function handleConfirm() {
  const formRef = formRendererRef.value?.formRef

  if (formRef && typeof (formRef as any).validate === 'function') {
    ;(formRef as any).validate((errors: unknown) => {
      if (!errors) {
        const currentData = formRendererRef.value?.formValue ?? { ...formData }
        props.confirmHandlers?.[props.mode]?.({ ...currentData })
        emit('update:visible', false)
      }
    })
  } else {
    props.confirmHandlers?.[props.mode]?.({ ...formData })
    emit('update:visible', false)
  }
}

function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}

/** 可见性变化回调，由 modalAdapter.visibleEvent 事件触发 */
function onVisibleChange(value: boolean) {
  emit('update:visible', value)
}

// ========================================================================
// 暴露
// ========================================================================

defineExpose({
  /** FormRenderer 实例，供外部调用 validate 等方法 */
  formRendererRef,
})
</script>

<style scoped></style>
