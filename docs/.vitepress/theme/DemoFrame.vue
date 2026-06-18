<template>
  <div class="demo-frame">
    <div class="demo-frame-header">
      <span class="demo-frame-title">{{ title }}</span>
      <a :href="src" target="_blank" class="demo-frame-link">↗ 新窗口打开</a>
    </div>
    <iframe
      :src="src"
      :style="{ height: height + 'px' }"
      class="demo-frame-iframe"
      frameborder="0"
      allow="clipboard-write"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  /** iframe 地址 */
  src?: string
  /** 标题 */
  title?: string
  /** iframe 高度 */
  height?: number
}

withDefaults(defineProps<Props>(), {
  src: '/table-pro/demo/index.html',
  title: '实时演示',
  height: 600,
})
</script>

<style scoped>
.demo-frame {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
}

.demo-frame-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.demo-frame-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.demo-frame-link {
  font-size: 12px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.demo-frame-link:hover {
  text-decoration: underline;
}

.demo-frame-iframe {
  width: 100%;
  border: none;
  display: block;
}
</style>
