<template>
  <!--
    二次确认按钮：点击后弹出 Modal 确认弹窗
    未注册 modal 组件时，直接渲染子元素（无确认弹框）
  -->
  <template v-if="Modal">
    <span @click="visible = true">
      <slot />
    </span>
    <component
      :is="Modal"
      :show="visible"
      @[visibleEvent]="(val: boolean) => (visible = val)"
      preset="dialog"
      type="warning"
      :title="confirmTitle"
      positive-text="确认"
      negative-text="取消"
      @positive-click="onConfirm"
      @negative-click="onCancel"
    />
  </template>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useComponentMap } from '@/composables/useComponentMap'

// ========================================================================
// Props & Emits
// ========================================================================

interface Props {
  /** 确认提示文案 */
  confirmTitle?: string
}

withDefaults(defineProps<Props>(), {
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

const { getComponent, injection } = useComponentMap()
const Modal = getComponent('modal')

/** Modal 显隐事件名，从 modalAdapter 配置中获取 */
const visibleEvent = injection.config?.modalAdapter?.visibleEvent ?? 'update:show'

// ========================================================================
// 状态
// ========================================================================

const visible = ref(false)

// ========================================================================
// 事件处理
// ========================================================================

function onConfirm() {
  visible.value = false
  emit('confirm')
}

function onCancel() {
  visible.value = false
  emit('cancel')
}
</script>
