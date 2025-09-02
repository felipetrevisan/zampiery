import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@nathy/studio': path.resolve(__dirname, './src'),
    },
  },
})
