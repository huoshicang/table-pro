import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // ========================================================================
  // 库构建模式：npm run build:lib
  // ========================================================================
  if (mode === 'lib') {
    return {
      plugins: [vue()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          formats: ['es', 'cjs'],
          fileName: 'table-pro',
        },
        rollupOptions: {
          // 外部化 peerDependencies，不打包进产物
          external: ['vue', 'naive-ui'],
          output: {
            globals: {
              vue: 'Vue',
              'naive-ui': 'naive',
            },
            // CJS 格式使用 named exports，避免 mixed exports 警告
            exports: 'named',
          },
        },
        // 生成 sourcemap 方便调试
        sourcemap: true,
        // 清空 dist 目录
        emptyOutDir: true,
      },
    }
  }

  // ========================================================================
  // App 模式：开发 / 演示
  // ========================================================================
  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
