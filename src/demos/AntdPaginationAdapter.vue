<template>
  <APagination
    :current="page"
    :page-size="pageSize"
    :total="itemCount"
    :show-size-changer="showSizePicker"
    :show-quick-jumper="showQuickJumper"
    @update:current="handlePageChange"
    @update:page-size="handlePageSizeChange"
    v-bind="restProps"
  />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Pagination as APagination } from 'ant-design-vue'

interface Props {
  page?: number
  pageSize?: number
  itemCount?: number
  showSizePicker?: boolean
  showQuickJumper?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  showQuickJumper: true,
})

const emit = defineEmits<{
  'update:page': [page: number]
  'update:page-size': [pageSize: number]
}>()

const attrs = useAttrs()

function handlePageChange(newPage: number) {
  emit('update:page', newPage)
}

function handlePageSizeChange(newSize: number) {
  emit('update:page-size', newSize)
}

const restProps = computed(() => {
  const { page, pageSize, itemCount, showSizePicker, showQuickJumper, ...rest } = props
  return { ...attrs, ...rest }
})
</script>
