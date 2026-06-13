<script setup lang="ts">
import TablePro from '@/components/TablePro.vue'
import { NMessageProvider } from 'naive-ui'

import { inject } from 'vue'
import { TABLE_COMPONENTS_KEY } from './index'

const injection = inject(TABLE_COMPONENTS_KEY)!

console.log('[App] config:', injection.components)

const inp = 'input'
</script>

<template>
  <n-message-provider>
      <TablePro />
  </n-message-provider>
</template>
