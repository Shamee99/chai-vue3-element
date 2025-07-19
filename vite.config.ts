import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    // 服务器配置
    server: {
      port: Number(env.VITE_PORT) || 5174,
      host: env.VITE_HOST || '0.0.0.0',
      open: env.VITE_OPEN_BROWSER === 'true',
      https: env.VITE_USE_HTTPS === 'true',
      hmr: env.VITE_HMR !== 'false',
      // 代理配置
      proxy: env.VITE_USE_PROXY === 'true' ? {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      } : undefined
    },
    // 构建配置
    build: {
      outDir: env.VITE_OUTPUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCE_MAP === 'true',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: env.VITE_DROP_CONSOLE === 'true',
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]'
        }
      }
    },
    // 定义全局常量
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE)
    }
  }
})
