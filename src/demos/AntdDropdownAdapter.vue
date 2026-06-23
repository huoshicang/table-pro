<template>
  <ADropdown :trigger="trigger" v-bind="restProps">
    <slot />
    <template #overlay>
      <AMenu :items="items" :selectable="false" @click="handleClick" />
    </template>
  </ADropdown>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Dropdown as ADropdown, Menu as AMenu } from 'ant-design-vue'

interface Props {
  options?: { label: string; key: string }[]
  trigger?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  trigger: () => ['click'],
})

const emit = defineEmits<{
  select: [key: string]
}>()

const attrs = useAttrs()

const items = computed(() =>
  (props.options ?? []).map((opt) => ({
    key: opt.key,
    label: opt.label,
  })),
)

function handleClick({ key }: { key: string }) {
  emit('select', key)
}

const restProps = computed(() => {
  const { options, trigger, ...rest } = props
  return { ...attrs, ...rest }
})
</script>
