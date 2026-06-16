<template>
  <!-- 搜索表单 -->
  <Search
    :schema="searchSchema"
    v-model="searchForm"
    @search="handleSearch"
    @reset="handleReset"
    :formProps="formProps"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Search from '@/components/Search.vue'
import type { SearchField } from '@/types/search'

// ========================================================================
// Search
// ========================================================================

const searchSchema: SearchField[] = [
  { name: 'name', label: '名称', type: 'input', span: 1 },
  { name: 'leaveType', label: '请假类别', type: 'select', span: 1 },
]

const searchForm = ref<Record<string, unknown>>({
  name: '',
  leaveType: undefined,
})

function handleSearch(values: Record<string, unknown>) {
  console.log('search values:', values)
}

function handleReset() {
  searchForm.value = { name: '', leaveType: undefined }
}

const formProps = {}
</script>
