<template>
  <component :is="Space" align="center">
    <!-- 主要操作按钮 -->
    <component
      v-for="action in actions"
      :key="action.label"
      :is="Button"
      attr-type="button"
      v-bind="action.meta ?? {}"
      size="small"
      @click="action.onClick"
    >
      {{ action.label }}
    </component>
    <!-- 下拉操作菜单 -->
    <component
      v-if="effectiveDropActions.length"
      :is="Dropdown"
      trigger="click"
      :options="dropdownOptions"
      @select="handleDropdownSelect"
    >
      <component :is="Button" attr-type="button" size="small">更多</component>
    </component>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentMap } from '@/composables/useComponentMap'
import type { ActionItem } from '@/types/common'

export type { ActionItem }

// ========================================================================
// Props
// ========================================================================

const props = withDefaults(
  defineProps<{
    /** 主要操作按钮 */
    actions?: ActionItem[]
    /** 下拉操作项 */
    dropDownActions?: ActionItem[]
  }>(),
  {
    actions: () => [],
    dropDownActions: () => [],
  },
)

// ========================================================================
// 依赖注入
// ========================================================================

const { getComponent } = useComponentMap()

/** 常用组件引用 */
const Button = getComponent('button')
const Space = getComponent('space')
const Dropdown = getComponent('dropdown')

// ========================================================================
// 下拉选项
// ========================================================================

const effectiveDropActions = computed(() => props.dropDownActions ?? [])

const dropdownOptions = computed(() =>
  effectiveDropActions.value.map((a, i) => ({
    label: a.label,
    key: String(i),
  })),
)

function handleDropdownSelect(key: string) {
  const idx = Number(key)
  effectiveDropActions.value[idx]?.onClick()
}
</script>

<style scoped></style>
