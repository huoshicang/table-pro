<template>
  <n-pagination
    v-model:page="page"
    :page-count="100"
    size="medium"
    show-quick-jumper
    show-size-picker
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'

const page = ref(2)
</script>

<style scoped></style>
