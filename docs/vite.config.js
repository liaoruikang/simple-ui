import { fileURLToPath, URL } from 'node:url'
import Markdown from 'vite-plugin-md'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [
    vue({
      include: [/\.md$/, /\.vue$/],
    }),
    Markdown(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
