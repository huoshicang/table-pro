<template>
  <!--
    triggerMode: 'slot' → 用插槽包裹触发元素
    triggerMode: 'wrap' → 直接包裹子元素
    未注册 popconfirm 组件时，直接渲染子元素（无确认弹框）
  -->
  <template v-if="Popconfirm">
    <!-- slot 模式：用指定插槽包裹触发元素 -->
    <component
      v-if="triggerMode === 'slot'"
      :is="Popconfirm"
      v-bind="popconfirmProps"
      @[confirmEvent]="onConfirm"
      @[cancelEvent]="onCancel"
    >
      <template #[triggerSlotName]>
        <slot />
      </template>
    </component>
    <!-- wrap 模式：直接包裹子元素 -->
    <component
      v-else
      :is="Popconfirm"
      v-bind="popconfirmProps"
      @[confirmEvent]="onConfirm"
      @[cancelEvent]="onCancel"
    >
      <slot />
    </component>
  </template>
  <slot v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useComponentMap } from '@/composables/useComponentMap'
import { useComponentAdapter } from '@/composables/useComponentAdapter'

// ========================================================================
// Props & Emits
// ========================================================================

interface Props {
  /** 确认提示文案 */
  confirmTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmTitle: '确认执行此操作？',
})

const emit = defineEmits<{
  /** 用户点击确认 */
  confirm: []
  /** 用户点击取消 */
  cancel: []
}>()

// ========================================================================
// 依赖注入
// ========================================================================

const { getComponent } = useComponentMap()
const Popconfirm = getComponent('popconfirm')

const { adapter, mapEvent } = useComponentAdapter('popconfirm')

// ========================================================================
// 适配器配置
// ========================================================================

/** 触发器渲染模式：'slot' 用插槽包裹，'wrap' 直接包裹 */
const triggerMode = computed(() => (adapter as { triggerMode?: string })?.triggerMode ?? 'wrap')

/** 触发器插槽名（仅 slot 模式需要） */
const triggerSlotName = computed(
  () => (adapter as { triggerSlot?: string })?.triggerSlot ?? 'trigger',
)

/** 确认事件名（经适配器映射后） */
const confirmEvent = computed(() => mapEvent('confirm'))

/** 取消事件名（经适配器映射后） */
const cancelEvent = computed(() => mapEvent('cancel'))

/** Popconfirm 的 props（传入确认提示文案） */
const popconfirmProps = computed(() => ({
  title: props.confirmTitle,
}))

// ========================================================================
// 事件处理
// ========================================================================

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
}
</script>
