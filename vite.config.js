import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'


export default defineConfig(({ mode }) => {
  const { VITE_API_END_POINT, VITE_API_KEY } = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url)),
      }
    },
    define: {
      API_END_POINT: JSON.stringify(VITE_API_END_POINT), 
      API_KEY: JSON.stringify(VITE_API_KEY)
    }
  }
})
