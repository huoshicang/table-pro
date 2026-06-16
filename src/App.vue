<script setup lang="ts">
import TablePro from '@/components/TablePro.vue'
import { NMessageProvider } from 'naive-ui'

import { inject, ref } from 'vue'
import { TABLE_COMPONENTS_KEY } from './index'

const injection = inject(TABLE_COMPONENTS_KEY)!

console.log('[App] config:', injection.components)

const showModal = ref(true)
</script>

<template>
  <n-modal-provider>
    <n-message-provider>
      <TablePro />

      
    </n-message-provider>
  </n-modal-provider>
</template>
